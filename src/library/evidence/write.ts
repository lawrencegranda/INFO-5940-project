import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import type { Course, DocumentKind, ExtractionResult, ImportInput, ImportResult, Material } from '../../shared/types.js';
import { normalizeSourceUrl } from '../knowledge/claims.js';
import { extractContent } from '../extraction/index.js';
import { summarizeLocally, embedLocally, getCapabilities } from '../gateways/local.js';
import { LibraryError, ReadOnlyLibrary } from './read.js';

const now=()=>new Date().toISOString();
const uuid=()=>randomUUID();
const schema=`
PRAGMA foreign_keys=ON;
PRAGMA journal_mode=DELETE;
CREATE TABLE IF NOT EXISTS courses(id TEXT PRIMARY KEY,code TEXT NOT NULL,name TEXT NOT NULL,color TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS documents(id TEXT PRIMARY KEY,source_id TEXT NOT NULL,source_key TEXT UNIQUE NOT NULL,source_url TEXT,source_type TEXT NOT NULL,current_version TEXT,is_demo INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS memberships(course_id TEXT NOT NULL REFERENCES courses(id),document_id TEXT NOT NULL REFERENCES documents(id),title TEXT NOT NULL,folder TEXT NOT NULL,tags TEXT NOT NULL,kind TEXT NOT NULL,metadata_revision INTEGER NOT NULL DEFAULT 1,PRIMARY KEY(course_id,document_id));
CREATE TABLE IF NOT EXISTS versions(id TEXT PRIMARY KEY,document_id TEXT NOT NULL REFERENCES documents(id),ordinal INTEGER NOT NULL,hash TEXT NOT NULL,captured_at TEXT NOT NULL,published_at TEXT,mime TEXT NOT NULL,original_name TEXT NOT NULL,original_file TEXT NOT NULL,size INTEGER NOT NULL,extraction_id TEXT NOT NULL,processing_state TEXT NOT NULL DEFAULT 'ready',UNIQUE(document_id,hash));
CREATE TABLE IF NOT EXISTS captures(id TEXT PRIMARY KEY,version_id TEXT NOT NULL REFERENCES versions(id),observed_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS extractions(id TEXT PRIMARY KEY,version_id TEXT NOT NULL REFERENCES versions(id),text TEXT NOT NULL,outcome TEXT NOT NULL,limitations TEXT NOT NULL,adapter TEXT NOT NULL,summary TEXT,summary_model TEXT,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS passages(id TEXT PRIMARY KEY,extraction_id TEXT NOT NULL REFERENCES extractions(id),version_id TEXT NOT NULL,document_id TEXT NOT NULL,ordinal INTEGER NOT NULL,text TEXT NOT NULL,location TEXT NOT NULL);
CREATE VIRTUAL TABLE IF NOT EXISTS passage_fts USING fts5(text,document_id UNINDEXED,version_id UNINDEXED,extraction_id UNINDEXED,tokenize='unicode61');
CREATE TABLE IF NOT EXISTS vectors(version_id TEXT PRIMARY KEY,extraction_id TEXT NOT NULL,model TEXT NOT NULL,vector TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_passages_ex ON passages(extraction_id);
CREATE INDEX IF NOT EXISTS idx_versions_doc ON versions(document_id);
`;
export class WritableLibrary {
  readonly dataDir: string;
  readonly reader: ReadOnlyLibrary;
  #db: DatabaseSync;
  constructor(dataDir: string) {
    this.dataDir=resolve(dataDir);
    mkdirSync(resolve(this.dataDir,'originals'),{recursive:true});
    this.#db=new DatabaseSync(resolve(this.dataDir,'library.sqlite'));
    this.#db.exec(schema);
    this.reader=new ReadOnlyLibrary(this.dataDir);
  }
  close(){this.reader.close();this.#db.close();}
  createCourse(input:{name:string;code:string;color?:string;id?:string}):Course {
    const id=input.id || uuid();
    if(!input.name.trim() || !input.code.trim())throw new LibraryError('invalid_input','A course name and code are required.');
    this.#db.prepare('INSERT OR IGNORE INTO courses(id,code,name,color,created_at) VALUES(?,?,?,?,?)').run(id,input.code.trim().slice(0,40),input.name.trim().slice(0,160),input.color || '#6366f1',now());
    return this.reader.listCourses().find(c=>c.id===id)!;
  }
  hasSource(url:string):boolean{return !!this.#db.prepare('SELECT id FROM documents WHERE source_key=?').get(normalizeSourceUrl(url));}
  #requireCourse(courseId:string){if(!this.#db.prepare('SELECT id FROM courses WHERE id=?').get(courseId))throw new LibraryError('not_found_in_scope','The selected course is unavailable.',404);}
  #membership(input:ImportInput,id:string){
    this.#db.prepare('INSERT OR IGNORE INTO memberships(course_id,document_id,title,folder,tags,kind) VALUES(?,?,?,?,?,?)').run(input.courseId,id,input.title.trim().slice(0,240),input.folder || 'General',JSON.stringify(input.tags || []),input.kind || 'notes');
  }
  async importText(input:ImportInput):Promise<ImportResult>{
    const content=input.content || '';
    if(!content.trim())throw new LibraryError('invalid_input','Paste some content or choose a file to save.');
    return this.importBytes(input,Buffer.from(content,'utf8'),input.format==='html'?'text/html':'text/plain',`${input.title || 'material'}.${input.format==='html'?'html':'txt'}`);
  }
  async importBytes(input:ImportInput,bytes:Buffer,mime:string,name:string):Promise<ImportResult>{
    this.#requireCourse(input.courseId);
    if(bytes.length>25*1024*1024)throw new LibraryError('invalid_input','Choose a file smaller than 25 MB.',413);
    if(!input.title?.trim())throw new LibraryError('invalid_input','A material title is required.');
    let document:any;
    const sourceUrl=input.sourceUrl?.trim()?normalizeSourceUrl(input.sourceUrl.trim()):null;
    if(input.documentId){
      this.reader.getDocument(input.courseId,input.documentId);
      document=this.#db.prepare('SELECT * FROM documents WHERE id=?').get(input.documentId);
      if(sourceUrl && sourceUrl!==document.source_key)throw new LibraryError('reference_mismatch','The supplied source URL does not match this saved document. Import a different source separately.');
    }else if(sourceUrl)document=this.#db.prepare('SELECT * FROM documents WHERE source_key=?').get(sourceUrl);
    let disposition:ImportResult['disposition']=document?'new_version':'new_document';
    const documentId=document?.id || uuid();
    const sourceId=document?.source_id || uuid();
    const hash=createHash('sha256').update(bytes).digest('hex');
    const old=document?this.#db.prepare('SELECT * FROM versions WHERE document_id=? AND hash=?').get(documentId,hash):null;
    if(old){
      this.#db.exec('BEGIN IMMEDIATE');
      try{
        this.#membership(input,documentId);
        this.#db.prepare('INSERT INTO captures(id,version_id,observed_at) VALUES(?,?,?)').run(uuid(),String(old.id),now());
        this.#db.exec('COMMIT');
      }catch(e){this.#db.exec('ROLLBACK');throw e;}
      return {document:this.reader.getDocument(input.courseId,documentId,String(old.id)).document,disposition:'unchanged'};
    }
    const versionId=uuid();const pendingId=uuid();const captureAt=now();
    const safeName=basename(name).replace(/[\x00-\x1f]/g,'').slice(0,180)||'material';
    const originalFile=`${versionId}.bin`;
    const temp=resolve(this.dataDir,'originals',`${versionId}.tmp`);
    writeFileSync(temp,bytes,{flag:'wx'});
    renameSync(temp,resolve(this.dataDir,'originals',originalFile));
    this.#db.exec('BEGIN IMMEDIATE');
    try{
      if(!document)this.#db.prepare('INSERT INTO documents(id,source_id,source_key,source_url,source_type,current_version,is_demo) VALUES(?,?,?,?,?,?,?)').run(documentId,sourceId,sourceUrl || `local:${uuid()}`,sourceUrl,input.sourceType || (sourceUrl?'web':'file'),versionId,input.isDemo?1:0);
      this.#membership(input,documentId);
      const count=this.#db.prepare('SELECT count(*) AS n FROM versions WHERE document_id=?').get(documentId);
      this.#db.prepare('INSERT INTO versions(id,document_id,ordinal,hash,captured_at,published_at,mime,original_name,original_file,size,extraction_id,processing_state) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(versionId,documentId,Number(count?.n || 0)+1,hash,captureAt,input.publishedAt || null,mime,safeName,originalFile,bytes.length,pendingId,'processing');
      this.#db.prepare('INSERT INTO extractions(id,version_id,text,outcome,limitations,adapter,created_at) VALUES(?,?,?,?,?,?,?)').run(pendingId,versionId,'','partial',JSON.stringify(['Original saved; extraction is in progress.']),'pending',captureAt);
      this.#db.prepare('INSERT INTO captures(id,version_id,observed_at) VALUES(?,?,?)').run(uuid(),versionId,captureAt);
      this.#db.prepare('UPDATE documents SET current_version=? WHERE id=?').run(versionId,documentId);
      this.#db.exec('COMMIT');
    }catch(e){this.#db.exec('ROLLBACK');throw e;}
    let extraction:ExtractionResult;
    try{extraction=await extractContent({bytes,mime,name:safeName,format:input.format});}
    catch(e){extraction={text:'',outcome:'failed',limitations:[`The original is saved, but extraction failed: ${safeMessage(e)}`],segments:[],adapter:'failed'};}
    this.#commitExtraction(documentId,versionId,extraction);
    try { const caps=await getCapabilities(); if(caps.embeddings.available)await this.indexSemantic(input.courseId,documentId,versionId,caps.embeddings.model); } catch { /* Optional semantic failure never blocks preserved originals or lexical retrieval. */ }
    return {document:this.reader.getDocument(input.courseId,documentId,versionId).document,disposition};
  }
  #commitExtraction(documentId:string,versionId:string,result:ExtractionResult):string{
    const revision=uuid();
    const text=result.text.slice(0,2_000_000);
    const segments=result.segments.length?result.segments:[{text,location:'Saved text'}];
    this.#db.exec('BEGIN IMMEDIATE');
    try{
      this.#db.prepare('INSERT INTO extractions(id,version_id,text,outcome,limitations,adapter,created_at) VALUES(?,?,?,?,?,?,?)').run(revision,versionId,text,result.outcome,JSON.stringify(result.limitations),result.adapter,now());
      let ordinal=0;
      for(const segment of segments){
        const parts=segment.text.match(/[\s\S]{1,1800}/g)||[];
        for(const part of parts){if(!part.trim())continue;const pid=uuid();this.#db.prepare('INSERT INTO passages(id,extraction_id,version_id,document_id,ordinal,text,location) VALUES(?,?,?,?,?,?,?)').run(pid,revision,versionId,documentId,ordinal++,part,segment.location || 'Saved text');this.#db.prepare('INSERT INTO passage_fts(text,document_id,version_id,extraction_id) VALUES(?,?,?,?)').run(part,documentId,versionId,revision);}
      }
      this.#db.prepare('UPDATE versions SET extraction_id=?,processing_state=? WHERE id=?').run(revision,'ready',versionId);
      this.#db.exec('COMMIT');
    }catch(e){this.#db.exec('ROLLBACK');throw e;}
    return revision;
  }
  editMetadata(courseId:string,documentId:string,patch:{title?:string;folder?:string;tags?:string[];kind?:DocumentKind}):Material{
    const detail=this.reader.getDocument(courseId,documentId);
    const current=detail.document;
    this.#db.prepare('UPDATE memberships SET title=?,folder=?,tags=?,kind=?,metadata_revision=metadata_revision+1 WHERE course_id=? AND document_id=?').run(patch.title?.trim() || current.title,patch.folder?.trim() || current.folder,JSON.stringify(patch.tags || current.tags),patch.kind || current.kind,courseId,documentId);
    return this.reader.getDocument(courseId,documentId).document;
  }
  addCaptureLimitations(courseId:string,documentId:string,limitations:string[],versionId?:string):Material{
    const detail=this.reader.getDocument(courseId,documentId,versionId);
    const ex=this.#db.prepare('SELECT * FROM extractions WHERE id=?').get(detail.document.extractionRevisionId)!;
    this.#commitExtraction(documentId,detail.document.versionId,{text:detail.content,outcome:detail.content?'partial':'unsupported',limitations:[...detail.document.limitations,...limitations].slice(0,40),segments:detail.passages.map(p=>({text:p.text,location:p.location})),adapter:String(ex.adapter)});
    return this.reader.getDocument(courseId,documentId).document;
  }
  async indexSemantic(courseId:string,documentId:string,versionId?:string,model?:string):Promise<void>{
    const detail=this.reader.getDocument(courseId,documentId,versionId);
    const chunks:string[]=[];
    for(const passage of detail.passages){const chars=Array.from(passage.text);for(let i=0;i<chars.length;i+=400)chunks.push(chars.slice(i,i+400).join(''));}
    if(!chunks.length)return;
    const vectors=await embedLocally(chunks);
    if(!vectors.length || vectors.length!==chunks.length)throw new LibraryError('invalid_model_output','Local vectors did not match the saved passages.');
    const vector=vectors[0].map((_,i)=>vectors.reduce((sum,row)=>sum+row[i],0)/vectors.length);
    this.#db.prepare('INSERT OR REPLACE INTO vectors(version_id,extraction_id,model,vector) VALUES(?,?,?,?)').run(detail.document.versionId,detail.document.extractionRevisionId,model || process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text',JSON.stringify(vector));
  }
  async processLocally(courseId:string,documentId:string):Promise<{document:Material;notes:string[]}>{
    let detail=this.reader.getDocument(courseId,documentId);
    const notes:string[]=[];
    if(!detail.content.trim() || detail.document.outcome==='failed'){
      const original=this.reader.readOriginal(courseId,documentId,detail.document.versionId);
      const result=await extractContent({bytes:original.bytes,mime:original.mime,name:original.name});
      this.#commitExtraction(documentId,detail.document.versionId,result);
      detail=this.reader.getDocument(courseId,documentId,detail.document.versionId);
    }
    if(!detail.content.trim())throw new LibraryError('processing_not_ready','The original is preserved, but a text extraction adapter or manual transcript is still needed.',422);
    const capabilities=await getCapabilities();
    if(capabilities.generation.available){
      try{
        const result=await summarizeLocally(detail.content);
        this.#db.prepare('UPDATE extractions SET summary=?,summary_model=? WHERE id=?').run(result.summary,result.model,detail.document.extractionRevisionId);
        notes.push(`Summary generated locally with ${result.model}.`);
      }catch(e){notes.push(`Local summary unavailable: ${safeMessage(e)}`);}
    }else notes.push(capabilities.generation.detail);
    if(capabilities.embeddings.available){
      try{await this.indexSemantic(courseId,documentId,detail.document.versionId,capabilities.embeddings.model);notes.push('Local semantic index updated from all saved text passages.');}catch(e){notes.push(`Keyword index remains available; embeddings failed: ${safeMessage(e)}`);}
    }else notes.push(capabilities.embeddings.detail);
    return {document:this.reader.getDocument(courseId,documentId,detail.document.versionId).document,notes};
  }
}
export function safeMessage(error:unknown):string{return (error instanceof Error?error.message:'Processing failed.').slice(0,350);}
