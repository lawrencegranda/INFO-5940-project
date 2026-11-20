import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fc from 'fast-check';
import { WritableLibrary } from '../src/library/evidence/write.js';
import { ReadOnlyLibrary } from '../src/library/evidence/read.js';
import { normalizeSourceUrl, parseDate } from '../src/library/knowledge/claims.js';
import type { Course, EvidenceRef, ImportInput } from '../src/shared/types.js';

let dataDir: string;
let library: WritableLibrary;
let courseA: Course;
let courseB: Course;
let closed = false;
const initial = 'Assignment 1 is due November 20, 2026.\nOffice hours are on Tuesdays.\n';

beforeEach(() => {
  vi.stubEnv('OLLAMA_URL', 'http://127.0.0.1:1');
  dataDir = mkdtempSync(join(tmpdir(), 'course-copilot-library-'));
  library = new WritableLibrary(dataDir);
  closed = false;
  courseA = library.createCourse({ id: 'alpha', code: 'ALPHA 101', name: 'Course Alpha' });
  courseB = library.createCourse({ id: 'beta', code: 'BETA 102', name: 'Course Beta' });
});
afterEach(() => {
  try { if (library && !closed) library.close(); }
  finally { if (dataDir) rmSync(dataDir, { recursive: true, force: true }); vi.unstubAllEnvs(); }
});
function save(patch: Partial<ImportInput> = {}) {
  return library.importText({ courseId: courseA.id, title: 'Assignment 1 syllabus',
    sourceUrl: 'https://example.edu/course/syllabus', sourceType: 'web', kind: 'syllabus',
    publishedAt: '2026-11-01T12:00:00Z', content: initial, ...patch });
}
function denied(read: () => unknown) {
  let error: unknown;
  try { read(); } catch (caught) { error = caught; }
  expect(error).toMatchObject({ code: 'not_found_in_scope', status: 404 });
}

describe('persisted evidence and version identity', () => {
  it('preserves exact original bytes and records unchanged observations without duplicating versions', async () => {
    const first = await save();
    const before = library.reader.getDocument(courseA.id, first.document.id);
    const repeated = await save();
    const after = library.reader.getDocument(courseA.id, first.document.id);
    expect(first.disposition).toBe('new_document');
    expect(repeated.disposition).toBe('unchanged');
    expect(repeated.document.id).toBe(first.document.id);
    expect(repeated.document.sourceId).toBe(first.document.sourceId);
    expect(repeated.document.versionId).toBe(first.document.versionId);
    expect(repeated.document.extractionRevisionId).toBe(first.document.extractionRevisionId);
    expect(after.document.capturedAt).toBe(before.document.capturedAt);
    expect(after.history).toHaveLength(1);
    expect(after.history[0].observationCount).toBe(2);
    expect(after.history[0].hash).toBe(createHash('sha256').update(Buffer.from(initial)).digest('hex'));
    expect(library.reader.readOriginal(courseA.id, first.document.id, first.document.versionId).bytes).toEqual(Buffer.from(initial));
    expect(readdirSync(join(dataDir, 'originals'))).toHaveLength(1);
    expect(readFileSync(join(dataDir, 'library.sqlite')).subarray(0, 15).toString()).toBe('SQLite format 3');
  });

  it('adds a changed version while retaining exact old bytes, text, extraction and passage references', async () => {
    const first = await save();
    const old = library.reader.getDocument(courseA.id, first.document.id);
    const updated = 'Assignment 1 is due November 24, 2026.\nThe other instruction is unchanged.\n';
    const second = await save({ documentId: first.document.id, content: updated });
    const latest = library.reader.getDocument(courseA.id, first.document.id);
    const pinned = library.reader.getDocument(courseA.id, first.document.id, first.document.versionId, first.document.extractionRevisionId);
    expect(second.disposition).toBe('new_version');
    expect(second.document.id).toBe(first.document.id);
    expect(second.document.sourceId).toBe(first.document.sourceId);
    expect(second.document.versionId).not.toBe(first.document.versionId);
    expect(latest.content).toContain('November 24');
    expect(pinned.content).toEqual(old.content);
    expect(pinned.document.versionId).toBe(first.document.versionId);
    expect(pinned.document.extractionRevisionId).toBe(first.document.extractionRevisionId);
    expect(library.reader.fetchPassages(courseA.id, old.passages.map(p => p.ref))).toEqual(old.passages);
    expect(library.reader.readOriginal(courseA.id, first.document.id, first.document.versionId).bytes).toEqual(Buffer.from(initial));
    expect(latest.history.map(h => h.versionId)).toEqual([second.document.versionId, first.document.versionId]);
  });

  it('keeps original evidence and hashes unchanged when editable metadata changes', async () => {
    const first = await save();
    const before = library.reader.getDocument(courseA.id, first.document.id);
    const edited = library.editMetadata(courseA.id, first.document.id, {
      title: 'Corrected source title', folder: 'Final project', tags: ['reviewed', 'deadline'], kind: 'assignment',
    });
    const after = library.reader.getDocument(courseA.id, first.document.id);
    expect(edited).toMatchObject({ title: 'Corrected source title', folder: 'Final project',
      tags: ['reviewed', 'deadline'], kind: 'assignment' });
    expect(after.document.versionId).toBe(before.document.versionId);
    expect(after.document.sourceId).toBe(before.document.sourceId);
    expect(after.document.extractionRevisionId).toBe(before.document.extractionRevisionId);
    expect(after.history).toEqual(before.history);
    expect(after.content).toBe(before.content);
    expect(library.reader.readOriginal(courseA.id, first.document.id, first.document.versionId).bytes).toEqual(Buffer.from(initial));
    const found = await library.reader.search({ courseId: courseA.id, query: 'Corrected source title' });
    expect(found.items.map(d => d.id)).toContain(first.document.id);
  });

  it('records recapture of a historical hash without rolling the current saved version backwards', async () => {
    const first = await save();
    const second = await save({ documentId: first.document.id, content: 'A genuinely newer saved version with a retained-current marker.' });
    const observedOld = await save({ documentId: first.document.id });
    expect(observedOld.disposition).toBe('unchanged');
    expect(observedOld.document.versionId).toBe(first.document.versionId);
    const current = library.reader.getDocument(courseA.id, first.document.id);
    expect(current.document.versionId).toBe(second.document.versionId);
    expect(current.content).toContain('retained-current marker');
    expect(current.history).toHaveLength(2);
    expect(current.history.find(h => h.versionId === first.document.versionId)).toMatchObject({ isCurrent: false, observationCount: 2 });
    expect(current.history.find(h => h.versionId === second.document.versionId)?.isCurrent).toBe(true);
  });

  it('rejects a different source URL supplied with an existing document ID before changing evidence', async () => {
    const first = await save();
    await expect(save({ documentId: first.document.id, sourceUrl: 'https://example.edu/different-origin',
      content: 'This content must not overwrite another origin.' })).rejects.toThrow();
    const unchanged = library.reader.getDocument(courseA.id, first.document.id);
    expect(unchanged.document.sourceUrl).toBe(first.document.sourceUrl);
    expect(unchanged.document.versionId).toBe(first.document.versionId);
    expect(unchanged.history).toHaveLength(1);
    expect(unchanged.content).toContain('Office hours are on Tuesdays');
    expect(library.hasSource('https://example.edu/different-origin')).toBe(false);
  });

  it('retains an old extraction after later processing limitations create a new derived revision', async () => {
    const first = await save();
    const original = library.reader.getDocument(courseA.id, first.document.id);
    library.addCaptureLimitations(courseA.id, first.document.id, ['Selected embedded PDF was inaccessible.'], first.document.versionId);
    const current = library.reader.getDocument(courseA.id, first.document.id);
    const pinned = library.reader.getDocument(courseA.id, first.document.id, first.document.versionId, first.document.extractionRevisionId);
    expect(current.document.versionId).toBe(first.document.versionId);
    expect(current.document.extractionRevisionId).not.toBe(first.document.extractionRevisionId);
    expect(current.document.outcome).toBe('partial');
    expect(current.document.limitations).toContain('Selected embedded PDF was inaccessible.');
    expect(pinned.document.outcome).toBe('complete');
    expect(pinned.document.limitations).toEqual(original.document.limitations);
    expect(library.reader.fetchPassages(courseA.id, original.passages.map(p => p.ref))).toEqual(original.passages);
    expect(current.history).toHaveLength(1);
  });

  it('reloads courses, independent metadata, history and originals from the actual SQLite/files store', async () => {
    const first = await save();
    await save({ documentId: first.document.id, content: 'A later saved source with a persistence marker.' });
    library.editMetadata(courseA.id, first.document.id, { folder: 'Retained folder', tags: ['persistent'] });
    library.close(); closed = true;
    const reader = new ReadOnlyLibrary(dataDir);
    try {
      expect(reader.listCourses()).toHaveLength(2);
      const restored = reader.getDocument(courseA.id, first.document.id);
      expect(restored.document.folder).toBe('Retained folder');
      expect(restored.document.tags).toEqual(['persistent']);
      expect(restored.history).toHaveLength(2);
      expect((await reader.search({ courseId: courseA.id, query: 'persistence marker' })).items[0].id).toBe(first.document.id);
      expect(reader.readOriginal(courseA.id, first.document.id, first.document.versionId).bytes).toEqual(Buffer.from(initial));
    } finally { reader.close(); }
  });
});

describe('course scope and source membership', () => {
  it('denies direct metadata, original, history, conflict and passage fetches across courses', async () => {
    const saved = await save({ content: 'A private Alpha source with the violet-antelope marker.' });
    await save({ courseId: courseB.id, sourceUrl: 'https://example.edu/beta/lecture', content: 'Independent Beta course material.' });
    const detail = library.reader.getDocument(courseA.id, saved.document.id);
    const scoped = await library.reader.search({ courseId: courseB.id, query: 'violet-antelope' });
    expect(scoped.items.every(item => item.courseId === courseB.id && item.id !== saved.document.id && !item.preview.includes('violet-antelope'))).toBe(true);
    denied(() => library.reader.getDocument(courseB.id, saved.document.id));
    denied(() => library.reader.getDocument(courseB.id, saved.document.id, saved.document.versionId, saved.document.extractionRevisionId));
    denied(() => library.reader.getHistory(courseB.id, saved.document.id));
    denied(() => library.reader.getConflicts(courseB.id, saved.document.id));
    denied(() => library.reader.readOriginal(courseB.id, saved.document.id, saved.document.versionId));
    denied(() => library.reader.fetchPassages(courseB.id, detail.passages.map(p => p.ref)));
    denied(() => library.reader.fetchPassages(courseB.id, detail.passages.map(p => ({ ...p.ref, courseId: courseB.id }))));
    denied(() => library.editMetadata(courseB.id, saved.document.id, { title: 'An unauthorized change' }));
    expect(library.reader.getDocument(courseA.id, saved.document.id).document.title).toBe('Assignment 1 syllabus');
    await expect(library.reader.search({ courseId: 'missing-course', query: 'private' })).rejects.toMatchObject({ code: 'not_found_in_scope' });
  });

  it('keeps one origin identity across explicit memberships while keeping each course metadata separate', async () => {
    const first = await save({ title: 'Alpha source title', sourceUrl: 'https://example.edu/shared?item=1&utm_source=alpha' });
    const second = await save({ courseId: courseB.id, title: 'Beta source title',
      sourceUrl: 'https://example.edu/shared?utm_source=beta&item=1', folder: 'Beta reading', tags: ['beta'] });
    expect(second.disposition).toBe('unchanged');
    expect(second.document.id).toBe(first.document.id);
    expect(second.document.sourceId).toBe(first.document.sourceId);
    expect(second.document.versionId).toBe(first.document.versionId);
    expect(library.reader.getDocument(courseA.id, first.document.id).document.title).toBe('Alpha source title');
    expect(library.reader.getDocument(courseB.id, first.document.id).document).toMatchObject({ title: 'Beta source title', folder: 'Beta reading', tags: ['beta'] });
    library.editMetadata(courseB.id, first.document.id, { title: 'Only Beta changed' });
    expect(library.reader.getDocument(courseA.id, first.document.id).document.title).toBe('Alpha source title');
    expect(library.reader.listCourses().map(c => c.documentCount)).toEqual([1, 1]);
    expect(library.reader.getHistory(courseA.id, first.document.id)).toHaveLength(1);
  });

  it('does not merge distinct origins because their titles and extracted text happen to match', async () => {
    const first = await save({ sourceUrl: 'https://example.edu/distinct-a', title: 'Shared title' });
    const second = await save({ sourceUrl: 'https://example.edu/distinct-b', title: 'Shared title' });
    expect(second.document.id).not.toBe(first.document.id);
    expect(second.document.sourceId).not.toBe(first.document.sourceId);
    expect((await library.reader.search({ courseId: courseA.id, query: 'Shared title' })).items).toHaveLength(2);
  });
});

describe('evidence-supported deadlines and conflicts', () => {
  it('keeps an explicit published deadline change applicable after recapturing the older syllabus', async () => {
    const syllabus = await save();
    const announcement = await save({ sourceUrl: 'https://example.edu/course/announcements/7',
      title: 'Assignment 1 deadline update', kind: 'announcement', publishedAt: '2026-11-10T12:00:00Z',
      content: 'Assignment 1 deadline moved from November 20, 2026 to November 22, 2026.' });
    const recapture = await save();
    expect(recapture.disposition).toBe('unchanged');
    expect(recapture.document.versionId).toBe(syllabus.document.versionId);
    const conflicts = library.reader.getConflicts(courseA.id);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].status).toBe('resolved_update');
    expect(conflicts[0].applicable.map(c => c.value)).toEqual(['2026-11-22']);
    expect(conflicts[0].applicable[0].ref.documentId).toBe(announcement.document.id);
    expect(conflicts[0].competing[0].ref.documentId).toBe(syllabus.document.id);
    expect(conflicts[0].competing[0].value).toBe('2026-11-20');
    expect(library.reader.getDocument(courseA.id, syllabus.document.id).content).toContain('Office hours are on Tuesdays');
    const found = await library.reader.search({ courseId: courseA.id, query: 'Assignment 1 deadline' });
    expect(found.items[0].id).toBe(announcement.document.id);
  });

  it('preserves unresolved competing dates without conflating different assignments or courses', async () => {
    await save({ sourceUrl: 'https://example.edu/assignment2/a', title: 'Assignment 2 instructions',
      kind: 'assignment', content: 'Assignment 2 is due November 23, 2026.' });
    await save({ sourceUrl: 'https://example.edu/assignment2/b', title: 'Assignment 2 other instructions',
      kind: 'assignment', content: 'Assignment 2 is due November 25, 2026.' });
    const unrelated = await save({ sourceUrl: 'https://example.edu/assignment3', title: 'Assignment 3',
      kind: 'assignment', content: 'Assignment 3 is due November 28, 2026.' });
    await save({ courseId: courseB.id, sourceUrl: 'https://example.edu/beta/assignment2', title: 'Assignment 2',
      kind: 'assignment', content: 'Assignment 2 is due December 3, 2026.' });
    const conflicts = library.reader.getConflicts(courseA.id);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({ subject: 'Assignment 2', status: 'unresolved', applicable: [] });
    expect(new Set(conflicts[0].competing.map(c => c.value))).toEqual(new Set(['2026-11-23', '2026-11-25']));
    expect(library.reader.getConflicts(courseA.id, unrelated.document.id)).toEqual([]);
    expect(library.reader.getConflicts(courseB.id)).toEqual([]);
  });

  it('does not declare an un-dated purported update authoritative', async () => {
    await save();
    await save({ sourceUrl: 'https://example.edu/undated-update', kind: 'announcement', publishedAt: undefined,
      content: 'Assignment 1 deadline moved from November 20, 2026 to November 22, 2026.' });
    expect(library.reader.getConflicts(courseA.id)[0].status).toBe('unresolved');
  });

  it('does not invent a deadline year from query time when the source and publication date omit it', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(new Date('2026-12-31T23:59:00Z'));
      const source = await save({ publishedAt: undefined, content: 'Assignment 1 is due November 20.' });
      await save({ sourceUrl: 'https://example.edu/undated-year', kind: 'announcement', publishedAt: undefined,
        content: 'Assignment 1 deadline moved from November 20 to November 22.' });
      expect(parseDate('November 22')).toBeNull();
      const before = library.reader.getConflicts(courseA.id);
      vi.setSystemTime(new Date('2027-01-01T00:01:00Z'));
      expect(library.reader.getConflicts(courseA.id)).toEqual(before);
      expect(before).toEqual([]);
      expect(library.reader.getDocument(courseA.id, source.document.id).content).toContain('November 20');
    } finally { vi.useRealTimers(); }
  });
});

describe('pure normalization and exact-reference properties', () => {
  const text = fc.array(fc.constantFrom('a', 'b', 'c', '0', '1', '-', '_', ' '), { minLength: 1, maxLength: 40 }).map(chars => chars.join(''));
  it('normalization is idempotent, strips credentials/tracking and preserves meaningful query values', () => {
    fc.assert(fc.property(text, text, (secret, topic) => {
      const input = new URL('https://example.edu/courses/assignment?week=4');
      input.username = 'student'; input.password = secret; input.hash = 'temporary-browser-fragment';
      input.searchParams.set('token', secret); input.searchParams.set('access_token', secret);
      input.searchParams.set('utm_source', 'test'); input.searchParams.set('topic', topic);
      const normalized = normalizeSourceUrl(input.href);
      const output = new URL(normalized);
      expect(output.username).toBe(''); expect(output.password).toBe(''); expect(output.hash).toBe('');
      expect(output.searchParams.has('token')).toBe(false); expect(output.searchParams.has('access_token')).toBe(false);
      expect(output.searchParams.has('utm_source')).toBe(false);
      expect(output.searchParams.get('topic')).toBe(topic); expect(output.searchParams.get('week')).toBe('4');
      expect(normalizeSourceUrl(normalized)).toBe(normalized);
    }), { numRuns: 60, seed: 5940 });
  });

  it('removes AWS and Google signed credentials while retaining a meaningful course identifier', () => {
    const input = new URL('https://example.edu/files/reading.pdf?courseId=54');
    for (const name of ['X-Amz-Credential', 'X-Amz-Signature', 'X-Amz-Security-Token',
      'X-Goog-Credential', 'X-Goog-Signature', 'AWSAccessKeyId', 'Signature']) input.searchParams.set(name, 'sensitive-test-value');
    const normalized = new URL(normalizeSourceUrl(input.href));
    expect(normalized.searchParams.get('courseId')).toBe('54');
    expect([...normalized.searchParams.values()]).not.toContain('sensitive-test-value');
    expect(normalized.pathname).toBe('/files/reading.pdf');
  });

  it('keeps distinct SPA routes and removes their signed query credentials', () => {
    expect(normalizeSourceUrl('https://example.edu/#/lecture/1?token=secret&courseId=54')).toBe('https://example.edu/#/lecture/1?courseId=54');
    expect(normalizeSourceUrl('https://example.edu/#!/lecture/2?X-Goog-Signature=secret')).toBe('https://example.edu/#!/lecture/2');
    expect(normalizeSourceUrl('https://example.edu/#section')).toBe('https://example.edu/');
  });

  it('serialized exact passage references round-trip through the actual store without granting another course access', async () => {
    let sequence = 0;
    await fc.assert(fc.asyncProperty(text.filter(value => !!value.trim()), async value => {
      const saved = await save({ title: 'Generated source ' + sequence, sourceUrl: 'https://example.edu/generated/' + sequence++,
        kind: 'notes', content: 'Reference round-trip marker: ' + value });
      const detail = library.reader.getDocument(courseA.id, saved.document.id);
      const refs = JSON.parse(JSON.stringify(detail.passages.map(p => p.ref))) as EvidenceRef[];
      expect(refs.length).toBeGreaterThan(0);
      expect(library.reader.fetchPassages(courseA.id, refs)).toEqual(detail.passages);
      denied(() => library.reader.fetchPassages(courseB.id, refs.map(ref => ({ ...ref, courseId: courseB.id }))));
    }), { numRuns: 12, seed: 2026 });
  });

  it.each(['2026-99-88', '2026-02-29', '2026-02-31', 'February 31, 2026', 'November 31, 2026'])('does not turn impossible calendar date %s into a definite deadline', input => {
    expect(parseDate(input)).toBeNull();
  });
  it('keeps a valid leap-day deadline intact', () => {
    expect(parseDate('February 29, 2024')).toBe('2024-02-29');
    expect(parseDate('2024-02-29')).toBe('2024-02-29');
  });
});
