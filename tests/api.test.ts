import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/library/api/server.js';
import type { Course, DocumentDetail, ImportResult } from '../src/shared/types.js';

let app: Awaited<ReturnType<typeof createApp>>;
let dataDir: string;
const token = 'test-token';
const host = '127.0.0.1:4310';
const extension = 'chrome-extension://' + 'a'.repeat(32);

beforeEach(async () => {
  vi.stubEnv('OLLAMA_URL', 'http://127.0.0.1:1');
  dataDir = mkdtempSync(join(tmpdir(), 'course-copilot-api-'));
  app = await createApp({ dataDir, seed: false, token, port: 4310 });
});
afterEach(() => {
  try { app?.locals.library.close(); }
  finally { if (dataDir) rmSync(dataDir, { recursive: true, force: true }); vi.restoreAllMocks(); vi.unstubAllEnvs(); }
});
async function course(code = 'TEST 101'): Promise<Course> {
  const response = await request(app).post('/api/courses').set('Host', host).set('X-Course-Copilot-Token', token)
    .send({ code, name: 'API fixture ' + code, color: '#5146d9' });
  expect(response.status).toBe(201);
  expect(response.body.id).toBeTruthy();
  return response.body as Course;
}
async function save(courseId: string, content: string, extra: Record<string, unknown> = {}): Promise<ImportResult> {
  const response = await request(app).post('/api/import').set('Host', host).set('X-Course-Copilot-Token', token)
    .send({ courseId, title: 'Actual API source', sourceType: 'web', sourceUrl: 'https://example.edu/api-source', content, ...extra });
  expect(response.status).toBe(201);
  return response.body as ImportResult;
}
async function detail(courseId: string, documentId: string, versionId?: string, extractionRevisionId?: string): Promise<DocumentDetail> {
  const response = await request(app).get('/api/documents/' + documentId).set('Host', host)
    .query({ courseId, ...(versionId ? { versionId } : {}), ...(extractionRevisionId ? { extractionRevisionId } : {}) });
  expect(response.status).toBe(200);
  return response.body as DocumentDetail;
}
function download(url: string) {
  return request(app).get(url).set('Host', host).buffer(true).parse((response, callback) => {
    const chunks: Buffer[] = [];
    response.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    response.on('end', () => callback(null, Buffer.concat(chunks)));
  });
}

describe('controlled local API access', () => {
  it('requires a valid pairing token before every mutation', async () => {
    const missing = await request(app).post('/api/courses').set('Host', host).send({ code: 'NO 1', name: 'Forbidden' });
    const wrong = await request(app).post('/api/courses').set('Host', host).set('X-Course-Copilot-Token', 'wrong-token')
      .send({ code: 'NO 2', name: 'Forbidden' });
    expect(missing.status).toBe(403); expect(missing.body.code).toBe('unpaired_client');
    expect(wrong.status).toBe(403); expect(wrong.body.code).toBe('unpaired_client');
    expect(app.locals.library.reader.listCourses()).toEqual([]);
    const added = await course();
    expect(added.name).toBe('API fixture TEST 101');
  });

  it('rejects a wrong multibyte token safely instead of failing the timing-safe comparison', async () => {
    const response = await request(app).post('/api/courses').set('Host', host)
      .set('X-Course-Copilot-Token', 'é'.repeat(token.length)).send({ code: 'NO 3', name: 'Forbidden' });
    expect(response.status).toBe(403);
    expect(response.body.code).toBe('unpaired_client');
    expect(app.locals.library.reader.listCourses()).toEqual([]);
  });

  it('denies hostile Host, Origin and cross-site requests even when a token is supplied', async () => {
    const hostileHost = await request(app).get('/api/bootstrap').set('Host', 'evil.example');
    const hostileOrigin = await request(app).get('/api/bootstrap').set('Host', host).set('Origin', 'https://evil.example');
    const lookalike = await request(app).get('/api/bootstrap').set('Host', host).set('Origin', 'http://127.0.0.1:4310.evil.example');
    const crossSite = await request(app).post('/api/courses').set('Host', host).set('Sec-Fetch-Site', 'cross-site')
      .set('X-Course-Copilot-Token', token).send({ code: 'NO 4', name: 'Forbidden' });
    for (const response of [hostileHost, hostileOrigin, lookalike, crossSite]) {
      expect(response.status).toBe(403); expect(response.body.code).toBe('origin_denied');
      expect(response.text).not.toContain(token);
    }
    expect(app.locals.library.reader.listCourses()).toEqual([]);
  });

  it('returns pairing data only to the local app and does not print it to console logs', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const bootstrap = await request(app).get('/api/bootstrap').set('Host', host).set('Origin', 'http://127.0.0.1:4310');
    expect(bootstrap.status).toBe(200);
    expect(bootstrap.body.pairingToken).toBe(token);
    expect(bootstrap.body.courses).toEqual([]);
    expect(bootstrap.body.mcpCommand).toContain('course-copilot');
    const extensionBootstrap = await request(app).get('/api/bootstrap').set('Host', host)
      .set('Origin', extension).set('X-Course-Copilot-Token', token);
    expect(extensionBootstrap.status).toBe(403);
    expect(extensionBootstrap.body.code).toBe('origin_denied');
    expect(extensionBootstrap.text).not.toContain(token);
    for (const spy of [log, warn, error]) {
      const printed = spy.mock.calls.map(args => args.map(String).join(' ')).join('\n');
      expect(printed).not.toContain(token);
    }
  });

  it('requires pairing on extension reads but allows an explicitly paired extension', async () => {
    await course();
    const denied = await request(app).get('/api/courses').set('Host', host).set('Origin', extension);
    expect(denied.status).toBe(403); expect(denied.body.code).toBe('unpaired_client');
    const allowed = await request(app).get('/api/courses').set('Host', host).set('Origin', extension).set('X-Course-Copilot-Token', token);
    expect(allowed.status).toBe(200);
    expect(allowed.body).toHaveLength(1);
    expect(allowed.headers['access-control-allow-origin']).toBe(extension);
  });
});

describe('actual import, evidence and original download', () => {
  it('persists a JSON import and retrieves real saved content through search, detail and original download', async () => {
    const selected = await course();
    const content = 'The precise source marker is lavender-capacitor.\nSecond source line.\n';
    const imported = await save(selected.id, content);
    expect(imported.disposition).toBe('new_document');
    expect(imported.document.isDemo).toBe(false);
    const found = await request(app).get('/api/search').set('Host', host).query({ courseId: selected.id, q: 'lavender-capacitor' });
    expect(found.status).toBe(200);
    expect(found.body.items.map((item: { id: string }) => item.id)).toEqual([imported.document.id]);
    const saved = await detail(selected.id, imported.document.id);
    expect(saved.content).toContain('lavender-capacitor');
    expect(saved.document.versionId).toBe(imported.document.versionId);
    expect(saved.document.extractionRevisionId).toBe(imported.document.extractionRevisionId);
    const original = await download(saved.original.url);
    expect(original.status).toBe(200);
    expect(original.headers['content-disposition']).toContain('attachment');
    expect(Buffer.isBuffer(original.body)).toBe(true);
    expect(original.body).toEqual(Buffer.from(content));
    expect(original.headers['x-content-type-options']).toBe('nosniff');
  });

  it('stores original uploaded bytes rather than returning a fabricated extracted reconstruction', async () => {
    const selected = await course();
    const bytes = Buffer.from('Original café π source.\nTrailing newline is part of the original.\n', 'utf8');
    const imported = await request(app).post('/api/import-file').set('Host', host).set('X-Course-Copilot-Token', token)
      .field('courseId', selected.id).field('title', 'Uploaded notes').field('sourceType', 'file').field('kind', 'notes')
      .attach('file', bytes, { filename: 'lecture-notes.txt', contentType: 'text/plain' });
    expect(imported.status).toBe(201);
    const saved = await detail(selected.id, imported.body.document.id);
    expect(saved.original.size).toBe(bytes.length);
    expect(saved.original.name).toBe('lecture-notes.txt');
    expect(saved.content).toContain('Original café π');
    const original = await download(saved.original.url);
    expect(original.status).toBe(200); expect(original.body).toEqual(bytes);
  });

  it('denies direct foreign-course detail, original, conflict and metadata paths without leaking source text', async () => {
    const alpha = await course('ALPHA 101'); const beta = await course('BETA 102');
    const secret = 'Course Alpha private marker is vermilion-citadel.';
    const imported = await save(alpha.id, secret);
    const saved = await detail(alpha.id, imported.document.id);
    const wrongDetail = await request(app).get('/api/documents/' + imported.document.id).set('Host', host).query({ courseId: beta.id });
    const wrongOriginal = await request(app).get('/api/documents/' + imported.document.id + '/original').set('Host', host)
      .query({ courseId: beta.id, versionId: imported.document.versionId });
    const wrongConflict = await request(app).get('/api/conflicts').set('Host', host).query({ courseId: beta.id, documentId: imported.document.id });
    const wrongEdit = await request(app).patch('/api/documents/' + imported.document.id).set('Host', host).set('X-Course-Copilot-Token', token)
      .send({ courseId: beta.id, title: 'Hijacked' });
    for (const response of [wrongDetail, wrongOriginal, wrongConflict, wrongEdit]) {
      expect(response.status).toBe(404); expect(response.body.code).toBe('not_found_in_scope');
      expect(response.text).not.toContain(secret); expect(response.text).not.toContain(saved.document.sourceUrl!);
    }
    const search = await request(app).get('/api/search').set('Host', host).query({ courseId: beta.id, q: 'vermilion-citadel' });
    expect(search.status).toBe(200); expect(search.body.items).toEqual([]);
    expect((await detail(alpha.id, imported.document.id)).document.title).toBe('Actual API source');
  });

  it('pins a delayed capture report to its original version instead of annotating a newer recapture', async () => {
    const selected = await course();
    const first = await save(selected.id, 'First captured source. Marker: old-cerulean.');
    const second = await save(selected.id, 'A newer captured source. Marker: new-copper.', { documentId: first.document.id });
    const limitation = 'A PDF selected during the older capture was inaccessible.';
    const report = await request(app).post('/api/documents/' + first.document.id + '/capture-report').set('Host', host)
      .set('X-Course-Copilot-Token', token).send({ courseId: selected.id, versionId: first.document.versionId, limitations: [limitation] });
    expect(report.status).toBe(200);
    const latest = await detail(selected.id, first.document.id);
    const earlier = await detail(selected.id, first.document.id, first.document.versionId);
    const pinnedEarlier = await detail(selected.id, first.document.id, first.document.versionId, first.document.extractionRevisionId);
    expect(latest.document.versionId).toBe(second.document.versionId);
    expect(latest.document.outcome).toBe('complete');
    expect(latest.document.limitations).not.toContain(limitation);
    expect(earlier.document.outcome).toBe('partial');
    expect(earlier.document.limitations).toContain(limitation);
    expect(earlier.document.extractionRevisionId).not.toBe(first.document.extractionRevisionId);
    expect(pinnedEarlier.document.outcome).toBe('complete');
    expect(pinnedEarlier.document.limitations).not.toContain(limitation);
    expect(pinnedEarlier.content).toContain('old-cerulean');
    expect(latest.history).toHaveLength(2);
  });

  it('validates malformed imports and missing original-version requests without mutating saved evidence', async () => {
    const selected = await course();
    const invalid = await request(app).post('/api/import').set('Host', host).set('X-Course-Copilot-Token', token)
      .send({ courseId: selected.id, title: '', content: 'A body' });
    expect(invalid.status).toBe(400); expect(invalid.body.code).toBe('invalid_input');
    expect((await request(app).get('/api/search').set('Host', host).query({ courseId: selected.id })).body.items).toEqual([]);
    const imported = await save(selected.id, 'A valid original remains intact.');
    const missingVersion = await request(app).get('/api/documents/' + imported.document.id + '/original').set('Host', host).query({ courseId: selected.id });
    expect(missingVersion.status).toBe(400);
    expect(missingVersion.body.code).toBe('invalid_input');
    expect((await detail(selected.id, imported.document.id)).history).toHaveLength(1);
  });
});
