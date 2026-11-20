import { DatabaseSync } from 'node:sqlite';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import type { ReadLibrary, Course, Material, DocumentDetail, SearchRequest, SearchResponse, Passage, EvidenceRef, HistoryEntry, Conflict, Claim } from '../../shared/types.js';
import { assessConflicts, extractClaims, cosine } from '../knowledge/claims.js';
import { embedLocally } from '../gateways/local.js';

type Row = Record<string, any>;
export class LibraryError extends Error { constructor(public code: string, message: string, public status = 400) { super(message); } }
const noScope = () => new LibraryError('not_found_in_scope', 'This material is not available in the selected course.', 404);
const parseJson = <T>(value: unknown, fallback: T): T => { try { return JSON.parse(String(value)) as T; } catch { return fallback; } };

/** This composition never creates storage, runs migrations, or obtains mutation ports. */
export class ReadOnlyLibrary implements ReadLibrary {
  #db: DatabaseSync;
  readonly dataDir: string;
  constructor(dataDir: string) {
    this.dataDir = resolve(dataDir);
    const file = resolve(this.dataDir, 'library.sqlite');
    if (!existsSync(file)) throw new LibraryError('library_unavailable', 'Start the local Course Copilot app once to initialize the library.', 503);
    this.#db = new DatabaseSync(file, { readOnly: true });
    this.#db.exec('PRAGMA query_only = ON; PRAGMA busy_timeout = 3000;');
    try { this.#db.prepare('SELECT id FROM courses LIMIT 1').get(); } catch { this.#db.close(); throw new LibraryError('schema_incompatible', 'The saved library needs preparation by the local app.', 503); }
  }
  close() { this.#db.close(); }
  listCourses(): Course[] {
    return this.#db.prepare('SELECT c.*, count(m.document_id) as documentCount FROM courses c LEFT JOIN memberships m ON m.course_id=c.id GROUP BY c.id ORDER BY c.created_at,c.id').all().map(r => ({ id:String(r.id),code:String(r.code),name:String(r.name),color:String(r.color),documentCount:Number(r.documentCount) }));
  }
  #membership(courseId: string, documentId: string): Row {
    const row = this.#db.prepare(`SELECT d.id,d.source_id as sourceId,d.source_url as sourceUrl,d.source_type as sourceType,d.current_version as currentVersion,d.is_demo as isDemo,m.title,m.folder,m.tags,m.kind FROM documents d JOIN memberships m ON m.document_id=d.id WHERE m.course_id=? AND d.id=?`).get(courseId,documentId);
    if (!row) throw noScope();
    return row;
  }
  #rows(courseId: string): Row[] {
    if (!this.#db.prepare('SELECT id FROM courses WHERE id=?').get(courseId)) throw noScope();
    return this.#db.prepare('SELECT document_id FROM memberships WHERE course_id=? ORDER BY rowid').all(courseId).map(r=>this.#membership(courseId,String(r.document_id)));
  }
  #version(documentId: string, id: string): Row {
    const row = this.#db.prepare('SELECT * FROM versions WHERE id=? AND document_id=?').get(id,documentId);
    if (!row) throw noScope();
    return row;
  }
  #extraction(version: Row, revisionId?: string): Row {
    const row = this.#db.prepare('SELECT * FROM extractions WHERE id=? AND version_id=?').get(revisionId || String(version.extraction_id),String(version.id));
    if (!row) throw new LibraryError('reference_mismatch','That extraction revision does not belong to the selected saved version.',404);
    return row;
  }
  #ref(courseId: string, row: Row, version: Row, extraction: Row, passageId?: string): EvidenceRef {
    return { courseId,documentId:String(row.id),sourceId:String(row.sourceId),versionId:String(version.id),extractionRevisionId:String(extraction.id),...(passageId?{passageId}:{}) };
  }
  #claims(courseId: string): Claim[] {
    const claims: Claim[]=[];
    for(const row of this.#rows(courseId)) {
      const v=this.#version(String(row.id),String(row.currentVersion));
      const ex=this.#extraction(v);
      const passages=this.#db.prepare('SELECT * FROM passages WHERE extraction_id=? ORDER BY ordinal').all(String(ex.id));
      for(const p of passages) claims.push(...extractClaims(String(p.text),{ref:this.#ref(courseId,row,v,ex,String(p.id)),title:String(row.title),kind:row.kind,publishedAt:v.published_at?String(v.published_at):null}));
    }
    return claims;
  }
  getConflicts(courseId: string, documentId?: string): Conflict[] {
    if(documentId) this.#membership(courseId,documentId);
    const all=assessConflicts(this.#claims(courseId));
    return documentId ? all.filter(c=>[...c.applicable,...c.competing].some(x=>x.ref.documentId===documentId)) : all;
  }
  #material(courseId: string,row: Row, conflicts: Conflict[], versionId?: string, extractionRevisionId?: string): Material {
    const v=this.#version(String(row.id),versionId || String(row.currentVersion));
    const ex=this.#extraction(v,extractionRevisionId);
    const observed=this.#db.prepare('SELECT max(observed_at) as last FROM captures WHERE version_id=?').get(String(v.id));
    const count=this.#db.prepare('SELECT count(*) as n FROM versions WHERE document_id=?').get(String(row.id));
    const related=conflicts.filter(c=>[...c.applicable,...c.competing].some(x=>x.ref.documentId===row.id));
    return {id:String(row.id),sourceId:String(row.sourceId),courseId,title:String(row.title),sourceUrl:row.sourceUrl?String(row.sourceUrl):null,sourceType:row.sourceType,kind:row.kind,folder:String(row.folder),tags:parseJson<string[]>(row.tags,[]),capturedAt:String(v.captured_at),lastObservedAt:String(observed?.last || v.captured_at),publishedAt:v.published_at?String(v.published_at):null,versionId:String(v.id),extractionRevisionId:String(ex.id),versionCount:Number(count?.n || 0),outcome:ex.outcome,limitations:parseJson<string[]>(ex.limitations,[]),preview:String(ex.text).replace(/\s+/g,' ').slice(0,230),summary:ex.summary?String(ex.summary):null,summaryModel:ex.summary_model?String(ex.summary_model):null,isDemo:!!row.isDemo,conflictCount:related.filter(c=>c.status==='unresolved').length,updateCount:related.filter(c=>c.status==='resolved_update').length};
  }
  async search(request: SearchRequest): Promise<SearchResponse> {
    const {courseId}=request;
    const conflicts=this.getConflicts(courseId);
    let items=this.#rows(courseId).map(r=>this.#material(courseId,r,conflicts,request.versionId && this.#db.prepare('SELECT id FROM versions WHERE id=? AND document_id=?').get(request.versionId,String(r.id)) ? request.versionId : undefined));
    if(request.versionId) items=items.filter(x=>x.versionId===request.versionId);
    if(request.sourceType && request.sourceType!=='all') items=items.filter(x=>x.sourceType===request.sourceType);
    if(request.folder) items=items.filter(x=>x.folder===request.folder);
    if(request.from) items=items.filter(x=>x.capturedAt>=request.from!);
    if(request.to) items=items.filter(x=>x.capturedAt<=request.to!);
    const counts={all:items.length,updates:items.filter(x=>x.updateCount>0).length,issues:items.filter(x=>x.outcome!=='complete'||x.conflictCount>0).length};
    if(request.view==='updates')items=items.filter(x=>x.updateCount>0);
    if(request.view==='issues')items=items.filter(x=>x.outcome!=='complete'||x.conflictCount>0);
    const query=(request.query||'').trim();
    let retrievalMode: 'lexical'|'hybrid'='lexical';
    let semanticStatus='No local embedding vectors have been indexed; keyword search is available.';
    if(query) {
      const tokens=query.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter(t=>t.length>1).slice(0,16)||[];
      const scores=new Map<string,number>();
      const match=tokens.map(t=>`"${t}"*`).join(' OR ');
      if(match) {
        try { for(const r of this.#db.prepare('SELECT document_id,version_id,extraction_id,bm25(passage_fts) as rank FROM passage_fts WHERE passage_fts MATCH ? LIMIT 300').all(match)) {
          const item=items.find(x=>x.id===r.document_id && x.versionId===r.version_id && x.extractionRevisionId===r.extraction_id);
          if(item)scores.set(item.id,(scores.get(item.id)||0)+1-Math.min(0,Number(r.rank)));
        }} catch { /* Valid keyword fallback below still applies to metadata and saved text. */ }
      }
      for(const item of items) {
        const ex=this.#db.prepare('SELECT text FROM extractions WHERE id=?').get(item.extractionRevisionId);
        const corpus=`${item.title} ${item.folder} ${item.tags.join(' ')} ${ex?.text || ''}`.toLowerCase();
        let score=scores.get(item.id)||0;
        for(const t of tokens) { if(corpus.includes(t))score+=1; if(item.title.toLowerCase().includes(t))score+=2; }
        if(tokens.some(t=>/deadline|due|project/.test(t)) && item.updateCount && item.kind==='announcement')score+=3;
        scores.set(item.id,score);
      }
      const model=process.env.OLLAMA_EMBED_MODEL || process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';
      const vectorRows=this.#db.prepare('SELECT * FROM vectors WHERE model=?').all(model).filter(v=>items.some(x=>x.versionId===v.version_id && x.extractionRevisionId===v.extraction_id));
      if(vectorRows.length) {
        try {
          const [qvec]=await embedLocally([query]);
          if(!qvec?.length)throw new Error('No query embedding was returned.');
          for(const v of vectorRows) { const item=items.find(x=>x.versionId===v.version_id && x.extractionRevisionId===v.extraction_id); if(!item)continue; const sim=cosine(qvec,parseJson<number[]>(v.vector,[])); if(sim>.18)scores.set(item.id,(scores.get(item.id)||0)+sim*6); }
          retrievalMode='hybrid';semanticStatus=`Local lexical and ${model} vector retrieval.`;
        } catch { semanticStatus='The local embedding model is unavailable; keyword results are shown.'; }
      }
      items=items.filter(x=>(scores.get(x.id)||0)>0).sort((a,b)=>(scores.get(b.id)||0)-(scores.get(a.id)||0));
    } else items.sort((a,b)=>b.capturedAt.localeCompare(a.capturedAt)||a.title.localeCompare(b.title));
    return {items:items.slice(0,Math.min(Math.max(request.limit || 100,1),100)),counts,retrievalMode,semanticStatus};
  }
  getDocument(courseId: string,documentId: string,versionId?: string,extractionRevisionId?: string): DocumentDetail {
    const row=this.#membership(courseId,documentId);
    const v=this.#version(documentId,versionId || String(row.currentVersion));
    const ex=this.#extraction(v,extractionRevisionId);
    const conflicts=this.getConflicts(courseId,documentId);
    const passages=this.#db.prepare('SELECT * FROM passages WHERE extraction_id=? ORDER BY ordinal').all(String(ex.id)).map(p=>({id:String(p.id),text:String(p.text),location:String(p.location),ref:this.#ref(courseId,row,v,ex,String(p.id))}));
    return {document:this.#material(courseId,row,conflicts,String(v.id),String(ex.id)),content:String(ex.text),passages,history:this.getHistory(courseId,documentId),conflicts,original:{url:`/api/documents/${encodeURIComponent(documentId)}/original?courseId=${encodeURIComponent(courseId)}&versionId=${encodeURIComponent(String(v.id))}`,mime:String(v.mime),name:String(v.original_name),size:Number(v.size)}};
  }
  fetchPassages(courseId: string,refs: EvidenceRef[]): Passage[] {
    if(refs.length>40)throw new LibraryError('invalid_input','Fetch up to 40 passages at a time.');
    return refs.map(ref=>{
      if(ref.courseId!==courseId || !ref.passageId)throw noScope();
      const row=this.#membership(courseId,ref.documentId);
      if(row.sourceId!==ref.sourceId)throw noScope();
      const v=this.#version(ref.documentId,ref.versionId);
      const ex=this.#extraction(v,ref.extractionRevisionId);
      const p=this.#db.prepare('SELECT * FROM passages WHERE id=? AND extraction_id=? AND version_id=?').get(ref.passageId,String(ex.id),String(v.id));
      if(!p)throw noScope();
      return {id:String(p.id),text:String(p.text),location:String(p.location),ref:this.#ref(courseId,row,v,ex,String(p.id))};
    });
  }
  getHistory(courseId: string,documentId: string): HistoryEntry[] {
    const row=this.#membership(courseId,documentId);
    return this.#db.prepare('SELECT v.*, e.outcome, (SELECT count(*) FROM captures c WHERE c.version_id=v.id) as observations FROM versions v JOIN extractions e ON e.id=v.extraction_id WHERE v.document_id=? ORDER BY v.ordinal DESC').all(documentId).map(v=>({versionId:String(v.id),capturedAt:String(v.captured_at),publishedAt:v.published_at?String(v.published_at):null,hash:String(v.hash),extractionRevisionId:String(v.extraction_id),outcome:v.outcome as HistoryEntry['outcome'],isCurrent:v.id===row.currentVersion,observationCount:Number(v.observations)}));
  }
  readOriginal(courseId: string,documentId: string,versionId: string) {
    this.#membership(courseId,documentId);
    const v=this.#version(documentId,versionId);
    const root=resolve(this.dataDir,'originals');
    const file=resolve(root,String(v.original_file));
    if(!file.startsWith(root+sep)||!existsSync(file))throw new LibraryError('original_unavailable','This saved original is unavailable.',404);
    return {bytes:readFileSync(file),mime:String(v.mime),name:String(v.original_name)};
  }
}
