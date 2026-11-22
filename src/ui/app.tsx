import React, { useEffect, useRef, useState, type FormEvent, type ReactNode, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import type { Capabilities, Course, DocumentDetail, ImportInput, ImportResult, Material, SearchResponse, SourceType, DocumentKind, Claim, Conflict } from '../shared/types';
import './styles.css';

interface Bootstrap { courses: Course[]; capabilities: Capabilities; pairingToken: string; mcpCommand: string; extensionPath: string }
type View = 'all' | 'updates' | 'issues';
type Section = 'materials' | 'ask' | 'deadlines';
interface AskSource { documentId: string; versionId: string; title: string; excerpt: string; publishedAt: string | null }
interface AskResult { answer: string; sources: AskSource[]; steps: Array<{ tool: string; input: string; found: string }>; mode: 'local_model' | 'no_model'; model?: string; note?: string }
const toolNames: Record<string, string> = { search_course: 'Searched your materials', check_deadlines: 'Checked deadlines', read_document: 'Read a material' };
type DetailTab = 'overview' | 'source' | 'history' | 'conflicts';
type ModalName = 'import' | 'course' | 'edit' | 'update' | 'setup' | null;
type ImportMode = 'text' | 'file';
type IconName = 'book' | 'search' | 'plus' | 'file' | 'link' | 'upload' | 'spark' | 'close' | 'check' | 'copy' | 'clock' | 'shield' | 'alert' | 'download' | 'settings' | 'refresh';
const sourceNames: Record<SourceType, string> = { canvas: 'Canvas', gradescope: 'Gradescope', edstem: 'EdStem', web: 'Web', file: 'File', notes: 'Notes' };
const kinds: DocumentKind[] = ['syllabus', 'announcement', 'lecture', 'assignment', 'paper', 'notes'];
const colors = ['#5146d9', '#167c76', '#b65069', '#b46b24', '#4278b4', '#8552b5'];
const emptySearch: SearchResponse = { items: [], counts: { all: 0, updates: 0, issues: 0 }, retrievalMode: 'lexical', semanticStatus: 'not_ready' };

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    book: <><path d="M12 6.5C9.5 4.5 6 4 3 5v14c3-1 6.5-.5 9 1.5C14.5 18.5 18 18 21 19V5c-3-1-6.5-.5-9 1.5Z" /><path d="M12 6.5v14" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
    link: <><path d="m10 14 4-4M8.5 15.5l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M15.5 8.5l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0" /></>,
    upload: <><path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5" /></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8 12 3 3 5-6" /></>,
    alert: <><path d="m12 3 10 18H2Z" /><path d="M12 9v5m0 3h.01" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    settings: <><path d="M4 7h16M4 17h16" /><circle cx="8" cy="7" r="3" fill="currentColor" stroke="none" /><circle cx="16" cy="17" r="3" fill="currentColor" stroke="none" /></>,
    refresh: <><path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function date(value: string | null | undefined, time = false) {
  if (!value) return 'Not recorded';
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T12:00:00' : value);
  if (Number.isNaN(d.valueOf())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...(time ? { hour: 'numeric', minute: '2-digit' } : {}) }).format(d);
}
function errorMessage(error: unknown) { return error instanceof Error ? error.message : 'Something went wrong. Please try again.'; }
async function api<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (token && init.method && !['GET', 'HEAD'].includes(init.method)) headers.set('X-Course-Copilot-Token', token);
  const response = await fetch(path, { ...init, headers });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof body?.error === 'string' ? body.error : body?.error?.message || body?.message || 'The local library could not complete this request.');
  return body as T;
}
async function copyText(text: string) { await navigator.clipboard.writeText(text); }
function webUrl(value: string | null) {
  if (!value) return null;
  try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; }
}
function safeOriginal(value: string) {
  try { const u = new URL(value, location.origin); return u.origin === location.origin && u.pathname.startsWith('/api/') ? u.href : null; } catch { return null; }
}
function citation(detail: DocumentDetail, course?: Course) {
  const m = detail.document;
  return [course?.code, m.title, 'Source: ' + (m.sourceUrl || 'Local import'), 'Saved: ' + m.capturedAt, 'Version: ' + m.versionId, 'Extraction: ' + m.extractionRevisionId, detail.passages[0] ? 'Passage: ' + detail.passages[0].id : ''].filter(Boolean).join('\n');
}
function Badge({ children, tone = '', icon }: { children: ReactNode; tone?: string; icon?: IconName }) {
  return <span className={'badge ' + tone}>{icon && <Icon name={icon} size={13} />}{children}</span>;
}
function Field({ label, children, help }: { label: string; children: ReactNode; help?: string }) {
  return <label className="field"><span>{label}</span>{children}{help && <small>{help}</small>}</label>;
}
function Dialog({ title, subtitle, children, onClose, wide = false }: { title: string; subtitle?: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (box.current?.querySelector('[data-autofocus]') as HTMLElement | null)?.focus();
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  function keys(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
    if (e.key !== 'Tab') return;
    const elements = Array.from(box.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href]') || []);
    const first = elements[0], last = elements[elements.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={box} className={'dialog ' + (wide ? 'dialog-wide' : '')} role="dialog" aria-modal="true" aria-label={title} onKeyDown={keys}>
      <header className="dialog-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button></header>
      {children}
    </div>
  </div>;
}
function FormError({ message }: { message: string | null }) { return message ? <div role="alert" className="form-error"><Icon name="alert" size={17} />{message}</div> : null; }

function MaterialDialog({ initial, course, busy, error, close, submit }: { initial?: DocumentDetail; course: Course; busy: boolean; error: string | null; close: () => void; submit: (event: FormEvent<HTMLFormElement>, mode: ImportMode) => void }) {
  const [mode, setMode] = useState<ImportMode>('text');
  const [title, setTitle] = useState(initial?.document.title || '');
  return <Dialog title={initial ? 'Save an updated version' : 'Add course material'} subtitle={initial ? 'Earlier saved versions remain available.' : 'Keep the original, its source, and your course context together.'} onClose={close} wide>
    <form onSubmit={e => submit(e, mode)} data-testid={initial ? 'update-form' : 'import-form'}>
      <div className="dialog-body">
        <div className="course-context"><span className="course-dot" style={{ background: course.color }} />{course.code}<span>·</span>{course.name}</div>
        {!initial && <div className="segmented" role="tablist" aria-label="Import method"><button type="button" role="tab" aria-selected={mode === 'text'} onClick={() => setMode('text')} data-testid="import-text-tab"><Icon name="file" size={17} />Paste text</button><button type="button" role="tab" aria-selected={mode === 'file'} onClick={() => setMode('file')} data-testid="import-file-tab"><Icon name="upload" size={17} />Upload a file</button></div>}
        {mode === 'file' && <label className="file-drop"><Icon name="upload" size={26} /><strong>Choose your original file</strong><span>PDF, text, HTML, image, audio or video</span><input data-testid="import-file-input" type="file" name="file" required onChange={e => { const file = e.target.files?.[0]; if (file && !title) setTitle(file.name.replace(/\.[^.]+$/, '')); }} /><small>Processing availability depends on the connected local adapters.</small></label>}
        <Field label="Title"><input data-autofocus data-testid="material-title" name="title" value={title} onChange={e => setTitle(e.target.value)} required maxLength={240} placeholder="e.g. Final project requirements" /></Field>
        {mode === 'text' && <Field label={initial ? 'Updated source content' : 'Source content'}><textarea data-testid="material-content" name="content" required rows={9} defaultValue={initial?.content || ''} placeholder="Paste the text you want to save. Sources are kept as evidence, not instructions for the assistant." /></Field>}
        <Field label="Source URL (optional)" help={initial ? 'This version remains attached to the same source.' : 'For attribution. Use the extension to capture a signed-in page.'}><input data-testid="material-url" name="sourceUrl" type="url" readOnly={!!initial} defaultValue={initial?.document.sourceUrl || ''} placeholder="https://canvas.cornell.edu/..." /></Field>
        <div className="form-grid">
          <Field label="Source"><select key={mode} name="sourceType" data-testid="material-source-type" defaultValue={initial?.document.sourceType || (mode === 'file' ? 'file' : 'notes')} disabled={!!initial}>{Object.entries(sourceNames).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
          <Field label="Material type"><select name="kind" data-testid="material-kind" defaultValue={initial?.document.kind || 'notes'}>{kinds.map(kind => <option value={kind} key={kind}>{kind.charAt(0).toUpperCase() + kind.slice(1)}</option>)}</select></Field>
          <Field label="Folder"><input name="folder" data-testid="material-folder" defaultValue={initial?.document.folder || ''} placeholder="e.g. Final project" /></Field>
          <Field label="Published date (optional)"><input type="datetime-local" name="publishedAt" data-testid="material-published-at" /></Field>
        </div>
        <FormError message={error} />
      </div>
      <footer className="dialog-footer"><button type="button" className="button secondary" onClick={close}>Cancel</button><button className="button primary" disabled={busy} data-testid="material-save">{busy ? 'Saving…' : initial ? 'Save version' : 'Add material'}</button></footer>
    </form>
  </Dialog>;
}

function AskPanel({ course, token, open }: { course: Course; token?: string; open: (id: string, versionId?: string) => void }) {
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setResult(null); setError(null); }, [course.id]);
  async function submit(e: FormEvent) {
    e.preventDefault(); if (!question.trim()) return;
    setBusy(true); setError(null);
    try { setResult(await api<AskResult>('/api/ask', { method: 'POST', body: JSON.stringify({ courseId: course.id, question }) }, token)); }
    catch (err) { setError(errorMessage(err)); } finally { setBusy(false); }
  }
  const examples = ['When is the final project due?', 'What do I need to submit for Assignment 2?', 'Did any deadline change?'];
  return <section className="plain-panel" data-testid="ask-panel">
    <form className="ask-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="ask-input">Ask a question about {course.code}</label>
      <input id="ask-input" data-testid="ask-input" value={question} onChange={e => setQuestion(e.target.value)} maxLength={500} placeholder={'Ask about ' + course.code + ', e.g. ' + examples[0]} />
      <button className="button primary" disabled={busy || !question.trim()} data-testid="ask-submit">{busy ? 'Looking…' : 'Ask'}</button>
    </form>
    {!result && !busy && !error && <div className="ask-examples">{examples.map(x => <button key={x} className="chip" onClick={() => setQuestion(x)}>{x}</button>)}</div>}
    {error && <div role="alert" className="inline-error"><Icon name="alert" size={19} /><span>{error}</span></div>}
    {result && <div className="answer" data-testid="ask-answer">
      <p className="answer-text">{result.answer}</p>
      {result.note && <p className="answer-note">{result.note}</p>}
      {result.sources.length > 0 && <><h3>Sources</h3><ul className="answer-sources">{result.sources.map(src => <li key={src.documentId}><button className="text-button" onClick={() => open(src.documentId, src.versionId)}><Icon name="file" size={15} />{src.title}</button><span>{src.excerpt}</span></li>)}</ul></>}
      <details className="answer-steps"><summary>How this was found</summary><ol>{result.steps.map((step, i) => <li key={i}><strong>{toolNames[step.tool] || step.tool}</strong> · {step.input} → {step.found}</li>)}</ol></details>
    </div>}
  </section>;
}

function DeadlinesPanel({ course, open }: { course: Course; open: (id: string, versionId?: string) => void }) {
  const [items, setItems] = useState<Conflict[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setItems(null); api<Conflict[]>('/api/conflicts?courseId=' + encodeURIComponent(course.id)).then(setItems).catch(e => setError(errorMessage(e))); }, [course.id]);
  if (error) return <div role="alert" className="inline-error"><Icon name="alert" size={19} /><span>{error}</span></div>;
  if (!items) return <p className="plain-panel" role="status">Loading deadlines…</p>;
  if (!items.length) return <section className="plain-panel"><p>No deadlines found yet. Add your syllabus or announcements and they will show up here.</p></section>;
  return <section className="plain-panel" data-testid="deadlines-panel"><ul className="deadline-list">{items.map(c => { const now = c.applicable[0]; return <li key={c.id} className={c.status === 'unresolved' ? 'unsure' : ''}>
    <div><strong className="capitalize">{c.subject}</strong><span>{c.status === 'resolved_update' && now ? 'Due ' + date(now.value) : 'Dates don\'t match. Check with your instructor.'}</span></div>
    <p>{c.explanation}</p>
    <div className="deadline-sources">{[...c.applicable, ...c.competing].map(claim => <button key={claim.id} className="text-button" onClick={() => open(claim.ref.documentId, claim.ref.versionId)}><Icon name="file" size={14} />{claim.sourceTitle} · {date(claim.value)}</button>)}</div>
  </li>; })}</ul></section>;
}

function App() {
  const [boot, setBoot] = useState<Bootstrap | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState('');
  const [query, setQuery] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [view, setView] = useState<View>('all');
  const [section, setSection] = useState<Section>('materials');
  const [search, setSearch] = useState<SearchResponse>(emptySearch);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [modal, setModal] = useState<ModalName>(null);
  const [busy, setBusy] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const detailAbort = useRef<AbortController | null>(null);
  const activeCourse = boot?.courses.find(c => c.id === courseId);
  const token = boot?.pairingToken;
  const currentVersion = detail?.history.find(h => h.isCurrent)?.versionId;
  const historical = !!detail && !!currentVersion && currentVersion !== detail.document.versionId;

  async function refreshBootstrap(preferredId?: string, selectPopulated = false) {
    const value = await api<Bootstrap>('/api/bootstrap');
    setBoot(value); setBootError(null);
    setCourseId(current => preferredId || (selectPopulated ? value.courses.find(c => c.documentCount > 0)?.id : undefined) || (value.courses.some(c => c.id === current) ? current : value.courses[0]?.id || ''));
    setReload(n => n + 1);
    return value;
  }
  useEffect(() => { refreshBootstrap().catch(e => setBootError(errorMessage(e))); }, []);
  useEffect(() => {
    if (!courseId) { setSearch(emptySearch); return; }
    const controller = new AbortController();
    setSearching(true); setSearchError(null);
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams({ courseId, q: query, sourceType, view });
      api<SearchResponse>('/api/search?' + params, { signal: controller.signal }).then(setSearch).catch(e => { if (e.name !== 'AbortError') setSearchError(errorMessage(e)); }).finally(() => { if (!controller.signal.aborted) setSearching(false); });
    }, 180);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [courseId, query, sourceType, view, reload]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) && !target.isContentEditable && !modal) { e.preventDefault(); searchInput.current?.focus(); }
      if (e.key === 'Escape' && !modal) { setSelectedId(null); setDetail(null); detailAbort.current?.abort(); }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [modal]);
  useEffect(() => { if (!toast || toast.error) return; const id = window.setTimeout(() => setToast(null), 4500); return () => window.clearTimeout(id); }, [toast]);

  function chooseCourse(id: string) { detailAbort.current?.abort(); setCourseId(id); setQuery(''); setSourceType(''); setView('all'); setSelectedId(null); setDetail(null); }
  function openModal(name: ModalName) { setFormError(null); setModal(name); }
  async function openDocument(id: string, versionId?: string, tab: DetailTab = 'overview') {
    detailAbort.current?.abort();
    const controller = new AbortController(); detailAbort.current = controller;
    setSelectedId(id); setDetailLoading(true); setDetailTab(tab);
    const params = new URLSearchParams({ courseId }); if (versionId) params.set('versionId', versionId);
    try { const value = await api<DocumentDetail>('/api/documents/' + encodeURIComponent(id) + '?' + params, { signal: controller.signal }); if (!controller.signal.aborted) setDetail(value); }
    catch (e) { if (!controller.signal.aborted) { setToast({ text: errorMessage(e), error: true }); setSelectedId(null); setDetail(null); } }
    finally { if (!controller.signal.aborted) setDetailLoading(false); }
  }
  async function notifyCopy(value: string, label: string) { try { await copyText(value); setToast({ text: label + ' copied.' }); } catch { setToast({ text: 'Clipboard access is unavailable. Select and copy the text manually.', error: true }); } }
  async function loadSamples() {
    setBusy('samples');
    try { await api('/api/demo/load', { method: 'POST' }, token); await refreshBootstrap(undefined, true); setSelectedId(null); setDetail(null); setToast({ text: 'Sample materials loaded. Every sample is labeled.' }); }
    catch (e) { setToast({ text: errorMessage(e), error: true }); } finally { setBusy(''); }
  }
  async function saveMaterial(event: FormEvent<HTMLFormElement>, mode: ImportMode) {
    event.preventDefault(); if (!activeCourse) return;
    const data = new FormData(event.currentTarget); const updating = modal === 'update' && detail;
    setBusy('material'); setFormError(null);
    try {
      const published = String(data.get('publishedAt') || '');
      let result: ImportResult;
      if (mode === 'file') {
        data.set('courseId', courseId);
        if (published) data.set('publishedAt', new Date(published).toISOString()); else data.delete('publishedAt');
        result = await api<ImportResult>('/api/import-file', { method: 'POST', body: data }, token);
      } else {
        const input: ImportInput = {
          courseId, title: String(data.get('title') || '').trim(), content: String(data.get('content') || ''),
          sourceUrl: String(data.get('sourceUrl') || '') || undefined,
          sourceType: updating ? updating.document.sourceType : String(data.get('sourceType') || 'notes') as SourceType,
          kind: String(data.get('kind') || 'notes') as DocumentKind,
          folder: String(data.get('folder') || '').trim(), format: 'text',
          publishedAt: published ? new Date(published).toISOString() : undefined,
          ...(updating ? { documentId: updating.document.id } : {}),
        };
        result = await api<ImportResult>('/api/import', { method: 'POST', body: JSON.stringify(input) }, token);
      }
      setModal(null); await refreshBootstrap(courseId); await openDocument(result.document.id);
      setToast({ text: result.disposition === 'unchanged' ? 'Content unchanged. A new observation was recorded.' : result.disposition === 'new_version' ? 'New version saved. Earlier evidence is preserved.' : 'Material added to your course library.' });
    } catch (e) { setFormError(errorMessage(e)); } finally { setBusy(''); }
  }
  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setBusy('course'); setFormError(null);
    try { const course = await api<Course>('/api/courses', { method: 'POST', body: JSON.stringify({ name: String(data.get('name') || '').trim(), code: String(data.get('code') || '').trim(), color: String(data.get('color') || colors[0]) }) }, token); await refreshBootstrap(course.id); chooseCourse(course.id); setModal(null); setToast({ text: 'Course created.' }); }
    catch (e) { setFormError(errorMessage(e)); } finally { setBusy(''); }
  }
  async function editMetadata(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!detail) return; const id = detail.document.id; const data = new FormData(event.currentTarget); setBusy('edit'); setFormError(null);
    try { await api('/api/documents/' + encodeURIComponent(id), { method: 'PATCH', body: JSON.stringify({ courseId, title: String(data.get('title') || '').trim(), folder: String(data.get('folder') || '').trim(), tags: String(data.get('tags') || '').split(',').map(t => t.trim()).filter(Boolean), kind: String(data.get('kind') || 'notes') }) }, token); setModal(null); await refreshBootstrap(courseId); await openDocument(id); setToast({ text: 'Details updated. Original evidence is unchanged.' }); }
    catch (e) { setFormError(errorMessage(e)); } finally { setBusy(''); }
  }
  async function processLocally() {
    if (!detail) return; const id = detail.document.id; setBusy('process');
    try { const result = await api<{ document: DocumentDetail; notes: string[] }>('/api/documents/' + encodeURIComponent(id) + '/process', { method: 'POST', body: JSON.stringify({ courseId }) }, token); await refreshBootstrap(courseId); await openDocument(id); setToast({ text: result.notes.length ? result.notes.join(' ') : 'Local processing finished.' }); }
    catch (e) { setToast({ text: errorMessage(e), error: true }); } finally { setBusy(''); }
  }
  function claimCard(claim: Claim, label: string) {
    return <div key={claim.id} className="claim"><span className="eyebrow">{label}</span><strong>{date(claim.value)}</strong><p>“{claim.excerpt}”</p><button className="text-button" onClick={() => { if (claim.ref.courseId === courseId) openDocument(claim.ref.documentId, claim.ref.versionId, 'source'); }}><Icon name="file" size={15} />{claim.sourceTitle}</button></div>;
  }

  if (!boot) return <main className="startup"><span className="brand-mark"><Icon name="book" size={27} /></span><h1>Course Copilot</h1>{bootError ? <><p role="alert">{bootError}</p><button className="button primary" onClick={() => refreshBootstrap().catch(e => setBootError(errorMessage(e)))}>Reconnect to library</button></> : <p role="status">Opening your local library…</p>}</main>;
  return <div className={'app ' + (selectedId ? 'has-detail' : '')}>
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Icon name="book" size={23} /></span><div><strong>Course Copilot</strong><span>Your class files in one place</span></div></div>
      <div className="sidebar-label"><span>MY COURSES</span><button className="icon-button small" aria-label="Add course" onClick={() => openModal('course')} data-testid="add-course-button"><Icon name="plus" size={17} /></button></div>
      <nav className="course-list" aria-label="Courses">{boot.courses.map(course => <button key={course.id} className={'course-button ' + (course.id === courseId ? 'selected' : '')} onClick={() => chooseCourse(course.id)} aria-current={course.id === courseId ? 'page' : undefined} data-testid="course-button" style={{ '--course-color': course.color } as CSSProperties}><span className="course-monogram">{course.code.replace(/\s/g, '').slice(0, 2).toUpperCase() || 'C'}</span><span className="course-text"><strong>{course.code || course.name}</strong><span>{course.name}</span></span><span className="course-count">{course.documentCount}</span></button>)}</nav>
      {!boot.courses.length && <p className="sidebar-empty">Create a course to start collecting your sources.</p>}
      <button className="sidebar-add" onClick={() => openModal('course')}><Icon name="plus" size={17} />New course</button>
      <div className="sidebar-bottom"><div className="privacy-note"><Icon name="shield" size={18} /><div><strong>Stored on this device</strong><p>Your originals stay in your local library.</p></div></div><button className="setup-button" onClick={() => openModal('setup')} data-testid="open-setup"><Icon name="settings" size={18} /><span>Connections & setup</span></button><div className="sidebar-footnote">LOCAL PROTOTYPE <span>·</span> COURSE COPILOT</div></div>
    </aside>

    <main className="workspace">
      <header className="workspace-header"><div className="breadcrumb"><span className="course-dot" style={{ background: activeCourse?.color || colors[0] }} />{activeCourse?.code || 'Your workspace'}<span>/</span><span>{section === 'ask' ? 'Ask' : section === 'deadlines' ? 'Deadlines' : 'Materials'}</span></div><div className="page-heading"><div><h1>{activeCourse ? (section === 'ask' ? 'Ask about this course' : section === 'deadlines' ? 'Deadlines' : 'Course materials') : 'Add a course to get started'}</h1><p>{activeCourse ? activeCourse.name : 'Save your syllabus, announcements and notes, then ask questions about them.'}</p></div><button className="button primary" onClick={() => openModal('import')} disabled={!activeCourse} data-testid="add-material-button"><Icon name="plus" size={18} />Add material</button></div><nav className="section-nav" aria-label="Sections">{(['materials','ask','deadlines'] as Section[]).map(x => <button key={x} className={section === x ? 'active' : ''} aria-current={section === x ? 'page' : undefined} onClick={() => setSection(x)} disabled={!activeCourse} data-testid={'section-' + x}>{x === 'materials' ? 'Materials' : x === 'ask' ? 'Ask' : 'Deadlines'}</button>)}</nav><div className="library-summary"><span><strong>{search.counts.all}</strong> saved sources</span><span className="summary-divider" /><span className={'model-status ' + (boot.capabilities.generation.available ? 'ready' : '')}><span className="status-dot" />{boot.capabilities.generation.available ? 'AI model connected' : 'AI model not connected (Ask still quotes your files)'}</span></div></header>
      {section === 'ask' && activeCourse ? <AskPanel course={activeCourse} token={token} open={(id, v) => openDocument(id, v)} /> : section === 'deadlines' && activeCourse ? <DeadlinesPanel course={activeCourse} open={(id, v) => openDocument(id, v)} /> : <section className="library-content">
        <div className="library-toolbar"><label className="search-box"><Icon name="search" size={19} /><span className="sr-only">Search course materials</span><input ref={searchInput} data-testid="search-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search this course…" disabled={!activeCourse} /><kbd>/</kbd></label><label className="source-filter"><span className="sr-only">Filter by source</span><Icon name="settings" size={17} /><select value={sourceType} onChange={e => setSourceType(e.target.value)} data-testid="source-filter" disabled={!activeCourse}><option value="">All sources</option>{Object.entries(sourceNames).map(([value, name]) => <option value={value} key={value}>{name}</option>)}</select></label></div>
        <div className="library-tabs" role="tablist" aria-label="Library view">{(['all', 'updates', 'issues'] as View[]).map(tab => <button key={tab} role="tab" aria-selected={view === tab} className={view === tab ? 'active' : ''} onClick={() => setView(tab)} data-testid={'view-' + tab}>{tab === 'all' ? 'All' : tab === 'updates' ? 'Changed' : 'Check these'}<span>{search.counts[tab]}</span></button>)}<span className="retrieval-caption">{searching ? 'Searching…' : search.retrievalMode === 'hybrid' ? 'Hybrid search' : 'Keyword search'}</span></div>
        {search.items.some(m => m.isDemo) && <div className="sample-banner"><Badge tone="sample">SAMPLE DATA</Badge><span>Synthetic course materials for trying the workflow. Sample source links are inactive.</span></div>}
        {searchError && <div role="alert" className="inline-error"><Icon name="alert" size={19} /><span>{searchError}</span><button className="text-button" onClick={() => setReload(n => n + 1)}>Retry</button></div>}
        {!searching && !search.items.length && !searchError ? <div className="empty-state"><span className="empty-icon"><Icon name={query || sourceType || view !== 'all' ? 'search' : 'book'} size={32} /></span><h2>{query || sourceType || view !== 'all' ? 'No matching materials' : activeCourse ? 'No materials yet' : 'Start with your first course.'}</h2><p>{query || sourceType || view !== 'all' ? 'Try a different phrase or clear the filters to see your saved sources.' : activeCourse ? 'Add a syllabus, announcement or your notes to get started.' : 'Create a course, then add your class files.'}</p><div className="empty-actions">{query || sourceType || view !== 'all' ? <button className="button secondary" onClick={() => { setQuery(''); setSourceType(''); setView('all'); }}>Clear filters</button> : <><button className="button primary" onClick={() => openModal(activeCourse ? 'import' : 'course')}>{activeCourse ? 'Add your first material' : 'Create a course'}</button><button className="button secondary" onClick={loadSamples} disabled={!!busy} data-testid="load-samples">{busy === 'samples' ? 'Loading samples…' : 'Try sample library'}</button></>}</div></div> : <><div className="source-table-heading"><span>MATERIAL</span><span>STATUS</span><span className="saved-column">SAVED</span></div><ul className={'source-list ' + (searching ? 'is-loading' : '')} aria-busy={searching}>{search.items.map(material => <li key={material.id}><button className={'source-row ' + (material.id === selectedId ? 'selected' : '')} onClick={() => openDocument(material.id)} data-testid="document-row" aria-label={'Open ' + material.title}><span className={'source-icon source-' + material.sourceType}><Icon name="file" size={22} /></span><span className="source-main"><span className="source-title">{material.title}{material.isDemo && <Badge tone="sample">Sample</Badge>}</span><span className="source-meta"><span>{sourceNames[material.sourceType]}</span><span>·</span><span className="capitalize">{material.kind}</span>{material.folder && <><span>·</span><span>{material.folder}</span></>}</span><span className="source-preview">{material.summary || material.preview || 'Original saved. Extracted text is not available yet.'}</span></span><span className="source-status">{material.conflictCount > 0 ? <Badge tone="warning" icon="alert">Needs review</Badge> : material.updateCount > 0 ? <Badge tone="success" icon="check">Known update</Badge> : material.outcome !== 'complete' ? <Badge tone="warning">{material.outcome}</Badge> : <Badge tone="neutral">Saved</Badge>}{material.versionCount > 1 && <span className="version-count">{material.versionCount} versions</span>}</span><span className="source-date saved-column">{date(material.capturedAt)}</span></button></li>)}</ul></>}
        {search.items.length > 0 && <footer className="library-footer"><Icon name="shield" size={15} /><span>Based on saved evidence. Changes outside your library are not checked automatically.</span></footer>}
      </section>}
    </main>

    {selectedId && <aside className="detail-panel" aria-label="Material details" data-testid="detail-panel"><header className="detail-top"><span className="eyebrow">SOURCE DETAILS</span><button className="icon-button" aria-label="Close material details" onClick={() => { detailAbort.current?.abort(); setSelectedId(null); setDetail(null); }} data-testid="close-detail"><Icon name="close" /></button></header>{detailLoading ? <div className="detail-loading" role="status"><span className="spinner" />Opening saved evidence…</div> : detail && <>
      <div className="detail-heading"><div className="detail-badges"><Badge>{sourceNames[detail.document.sourceType]}</Badge>{detail.document.isDemo && <Badge tone="sample">Sample material</Badge>}{historical && <Badge tone="warning">Earlier saved version</Badge>}</div><h2>{detail.document.title}</h2><div className="detail-subline"><Icon name="clock" size={15} />Saved {date(detail.document.capturedAt, true)}</div>{historical && <button className="text-button" onClick={() => openDocument(detail.document.id)}>Return to current saved version</button>}<div className="detail-actions"><button className="button secondary compact" onClick={() => openModal('edit')} data-testid="edit-metadata">Edit details</button><button className="button secondary compact" onClick={() => openModal('update')} data-testid="save-updated-content">Save new version</button><button className="button quiet compact" onClick={processLocally} disabled={!!busy || !boot.capabilities.generation.available || historical} title={historical ? 'Open the current saved version to process locally.' : boot.capabilities.generation.detail} data-testid="process-locally"><Icon name="refresh" size={15} />{busy === 'process' ? 'Summarizing…' : 'Summarize'}</button></div></div>
      <div className="detail-tabs" role="tablist" aria-label="Material detail view">{(['overview', 'source', 'history', 'conflicts'] as DetailTab[]).map(tab => <button key={tab} role="tab" aria-selected={detailTab === tab} className={detailTab === tab ? 'active' : ''} onClick={() => setDetailTab(tab)} data-testid={'detail-tab-' + tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}{tab === 'history' && <span>{detail.history.length}</span>}{tab === 'conflicts' && detail.conflicts.length > 0 && <span>{detail.conflicts.length}</span>}</button>)}</div>
      <div className="detail-body" role="tabpanel">
        {detailTab === 'overview' && <><section className="overview-section"><div className="section-label"><Icon name="file" size={17} /><h3>{detail.document.summary ? 'Local AI summary' : 'Source excerpt'}</h3>{detail.document.summaryModel && <Badge>{detail.document.summaryModel}</Badge>}</div><p className="summary-text">{detail.document.summary || detail.document.preview || detail.content.slice(0, 700) || 'No extracted text is available. You can still inspect the saved original and processing details.'}</p>{!detail.document.summary && <p className="helper">This is saved source text. No AI summary has been generated.</p>}</section>
          {detail.conflicts.length > 0 && <section className="overview-section"><div className="section-label"><Icon name="link" size={17} /><h3>Changes & competing evidence</h3></div>{detail.conflicts.map(conflict => <button className={'change-preview ' + (conflict.status === 'unresolved' ? 'unresolved' : '')} key={conflict.id} onClick={() => setDetailTab('conflicts')}><Badge tone={conflict.status === 'resolved_update' ? 'success' : 'warning'}>{conflict.status === 'resolved_update' ? 'Known update' : 'Needs review'}</Badge><strong>{conflict.subject}</strong><span>{conflict.explanation}</span></button>)}</section>}
          <section className="overview-section"><h3>At a glance</h3><dl className="metadata-list"><div><dt>Course</dt><dd>{activeCourse?.code}</dd></div><div><dt>Folder</dt><dd>{detail.document.folder || 'Unfiled'}</dd></div><div><dt>Material type</dt><dd className="capitalize">{detail.document.kind}</dd></div><div><dt>Published</dt><dd>{date(detail.document.publishedAt)}</dd></div><div><dt>Extraction</dt><dd><Badge tone={detail.document.outcome === 'complete' ? 'neutral' : 'warning'}>{detail.document.outcome}</Badge></dd></div><div><dt>Saved versions</dt><dd>{detail.document.versionCount}</dd></div></dl>{detail.document.tags.length > 0 && <div className="tags">{detail.document.tags.map(tag => <span key={tag}>#{tag}</span>)}</div>}</section>
          {detail.document.limitations.length > 0 && <section className="limitation-box"><Icon name="alert" size={18} /><div><strong>Processing limitations</strong><ul>{detail.document.limitations.map((text, i) => <li key={i}>{text}</li>)}</ul></div></section>}
        </>}
        {detailTab === 'source' && <><section className="original-box"><div><Icon name="file" size={22} /><strong>{detail.original.name}</strong><span>{detail.original.mime} · {Math.max(1, Math.round(detail.original.size / 1024))} KB</span></div>{safeOriginal(detail.original.url) && <a className="button secondary compact" href={detail.original.url} download={detail.original.name} data-testid="download-original"><Icon name="download" size={16} />Original</a>}</section><div className="source-attribution"><span className="eyebrow">ORIGINAL SOURCE</span>{detail.document.isDemo ? <span className="muted">{detail.document.sourceUrl || 'Synthetic local sample'} · Sample link is inactive</span> : webUrl(detail.document.sourceUrl) ? <a href={webUrl(detail.document.sourceUrl)!} target="_blank" rel="noreferrer noopener">{detail.document.sourceUrl}</a> : <span className="muted">Local import · no web URL</span>}</div><div className="section-label source-label"><h3>Saved extracted content</h3><button className="text-button" onClick={() => notifyCopy(detail.content, 'Source text')} disabled={!detail.content}><Icon name="copy" size={15} />Copy text</button></div><pre className="source-content" data-testid="source-content">{detail.content || 'No text was extracted from this saved original.'}</pre><details className="evidence-identifiers"><summary>Evidence identifiers</summary><dl><dt>Version</dt><dd>{detail.document.versionId}</dd><dt>Extraction revision</dt><dd>{detail.document.extractionRevisionId}</dd><dt>Source</dt><dd>{detail.document.sourceId}</dd></dl></details></>}
        {detailTab === 'history' && <><div className="section-intro"><h3>Every saved version, preserved.</h3><p>Capture time records when you saved a source. It does not establish which instruction has authority.</p></div><ol className="history-list">{detail.history.map(entry => <li key={entry.versionId} className={entry.versionId === detail.document.versionId ? 'viewing' : ''}><span className="history-dot" /><div><div className="history-heading"><strong>{entry.isCurrent ? 'Current saved version' : 'Earlier saved version'}</strong>{entry.versionId === detail.document.versionId && <Badge tone="indigo">Viewing</Badge>}</div><p>{date(entry.capturedAt, true)}</p><span className="helper">Published {date(entry.publishedAt)} · {entry.observationCount} {entry.observationCount === 1 ? 'observation' : 'observations'}</span><div className="history-bottom"><code>{entry.hash.slice(0, 12)}</code><button className="text-button" onClick={() => openDocument(detail.document.id, entry.versionId, 'source')} data-testid="view-history-version">View saved evidence</button></div></div></li>)}</ol></>}
        {detailTab === 'conflicts' && (detail.conflicts.length ? <div className="conflict-list">{detail.conflicts.map(conflict => <section key={conflict.id} className="conflict-card"><Badge tone={conflict.status === 'resolved_update' ? 'success' : 'warning'} icon={conflict.status === 'resolved_update' ? 'check' : 'alert'}>{conflict.status === 'resolved_update' ? 'Evidence-supported update' : 'Unresolved conflict'}</Badge><h3>{conflict.subject}</h3><p className="conflict-explanation">{conflict.explanation}</p>{conflict.applicable.map(claim => claimCard(claim, conflict.status === 'resolved_update' ? 'Applicable saved instruction' : 'Competing saved instruction'))}{conflict.competing.map(claim => claimCard(claim, 'Earlier or competing evidence'))}</section>)}<p className="helper">A change applies to its matching claim. Other facts in the original source remain available.</p></div> : <div className="detail-empty"><Icon name="check" size={28} /><h3>No recorded conflicts</h3><p>No competing instructions are recorded for this saved material. This does not check for unseen updates.</p></div>)}
      </div><footer className="detail-footer"><span><Icon name="shield" size={15} />Exact saved evidence</span><button className="text-button" onClick={() => notifyCopy(citation(detail, activeCourse), 'Citation')} data-testid="copy-citation"><Icon name="copy" size={15} />Copy citation</button></footer>
    </>}</aside>}

    {(modal === 'import' || modal === 'update') && activeCourse && <MaterialDialog initial={modal === 'update' && detail ? detail : undefined} course={activeCourse} busy={busy === 'material'} error={formError} close={() => setModal(null)} submit={saveMaterial} />}
    {modal === 'course' && <Dialog title="Create a course" subtitle="Give your sources a clear place to belong." onClose={() => setModal(null)}><form onSubmit={createCourse} data-testid="create-course-form"><div className="dialog-body"><Field label="Course name"><input name="name" data-autofocus data-testid="course-name" required placeholder="e.g. AI Chatbots, RAG & Agents" maxLength={160} /></Field><Field label="Course code"><input name="code" data-testid="course-code" required placeholder="e.g. INFO 5940" maxLength={40} /></Field><fieldset className="color-field"><legend>Course color</legend><div>{colors.map((color, i) => <label key={color} style={{ '--swatch': color } as CSSProperties}><input type="radio" name="color" value={color} defaultChecked={i === 0} aria-label={'Color ' + (i + 1)} /><span /></label>)}</div></fieldset><FormError message={formError} /></div><footer className="dialog-footer"><button type="button" className="button secondary" onClick={() => setModal(null)}>Cancel</button><button className="button primary" disabled={!!busy} data-testid="create-course-submit">{busy === 'course' ? 'Creating…' : 'Create course'}</button></footer></form></Dialog>}
    {modal === 'edit' && detail && <Dialog title="Edit material details" subtitle="Organization can change. Your original evidence stays preserved." onClose={() => setModal(null)}><form onSubmit={editMetadata} data-testid="edit-metadata-form"><div className="dialog-body"><Field label="Title"><input name="title" data-autofocus data-testid="edit-title" required defaultValue={detail.document.title} /></Field><Field label="Folder"><input name="folder" data-testid="edit-folder" defaultValue={detail.document.folder} /></Field><Field label="Tags" help="Separate tags with commas."><input name="tags" data-testid="edit-tags" defaultValue={detail.document.tags.join(', ')} /></Field><Field label="Material type"><select name="kind" data-testid="edit-kind" defaultValue={detail.document.kind}>{kinds.map(kind => <option value={kind} key={kind}>{kind.charAt(0).toUpperCase() + kind.slice(1)}</option>)}</select></Field><FormError message={formError} /></div><footer className="dialog-footer"><button type="button" className="button secondary" onClick={() => setModal(null)}>Cancel</button><button className="button primary" disabled={!!busy} data-testid="edit-save">{busy === 'edit' ? 'Saving…' : 'Save details'}</button></footer></form></Dialog>}
    {modal === 'setup' && <Dialog title="Connections & setup" subtitle="Connect your browser and assistant to this local library." onClose={() => setModal(null)} wide><div className="dialog-body setup-body"><section><div className="section-label"><Icon name="book" size={19} /><h3>Your assistant · read-only MCP</h3></div><p>Use this command to connect your assistant. Tools search, fetch and inspect saved evidence; they cannot change the library.</p><div className="copy-block"><code data-testid="mcp-command">{boot.mcpCommand}</code><button className="icon-button" aria-label="Copy MCP command" onClick={() => notifyCopy(boot.mcpCommand, 'MCP command')} data-testid="copy-mcp-command"><Icon name="copy" size={18} /></button></div><p className="helper">Your assistant may send retrieved passages to its configured model. Local MCP describes the connection and storage, not the model's processing location.</p></section><section><div className="section-label"><Icon name="link" size={19} /><h3>Chrome capture extension</h3></div><p>In Chrome's Extensions page, enable Developer mode and load this unpacked folder:</p><div className="copy-block"><code data-testid="extension-path">{boot.extensionPath}</code><button className="icon-button" aria-label="Copy extension folder" onClick={() => notifyCopy(boot.extensionPath, 'Extension folder')}><Icon name="copy" size={18} /></button></div><Field label="Pairing code" help="Paste this into the local extension. Keep the code private."><div className="secret-input"><input type="password" readOnly value={boot.pairingToken} aria-label="Masked extension pairing code" data-testid="pairing-code" /><button type="button" className="button secondary compact" onClick={() => notifyCopy(boot.pairingToken, 'Pairing code')} data-testid="copy-pairing-code">Copy code</button></div></Field></section><section><div className="section-label"><Icon name="settings" size={19} /><h3>What's set up on this computer</h3></div><div className="capability-list">{(['generation', 'embeddings', 'ocr', 'transcription', 'jev'] as const).map(key => <div key={key}><span className={'capability-dot ' + (boot.capabilities[key].available ? 'available' : '')} /><div><strong>{{ generation: 'Local summaries', embeddings: 'Semantic retrieval', ocr: 'Image & scan OCR', transcription: 'Audio & video transcription', jev: 'Hosted Jev decisions' }[key]}</strong><p>{boot.capabilities[key].detail}</p></div><Badge tone={boot.capabilities[key].available ? 'success' : 'neutral'}>{boot.capabilities[key].available ? 'Available' : 'Unavailable'}</Badge></div>)}</div></section></div><footer className="dialog-footer"><button className="button primary" onClick={() => setModal(null)}>Done</button></footer></Dialog>}
    {toast && <div className={'toast ' + (toast.error ? 'toast-error' : '')} role={toast.error ? 'alert' : 'status'}><Icon name={toast.error ? 'alert' : 'check'} size={19} /><span>{toast.text}</span><button className="icon-button small" aria-label="Dismiss notification" onClick={() => setToast(null)}><Icon name="close" size={17} /></button></div>}
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
