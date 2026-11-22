import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/library/api/server.js';
import { ReadOnlyLibrary } from '../src/library/evidence/read.js';
import { createMcpHttpApp } from '../src/mcp/http.js';

let app: Awaited<ReturnType<typeof createApp>>;
let dataDir: string;
const token = 'test-token';
const host = '127.0.0.1:4310';

beforeEach(async () => {
  vi.stubEnv('OLLAMA_URL', 'http://127.0.0.1:1');
  dataDir = mkdtempSync(join(tmpdir(), 'course-copilot-ask-'));
  app = await createApp({ dataDir, seed: false, token, port: 4310 });
});
afterEach(() => {
  try { app?.locals.library.close(); }
  finally { rmSync(dataDir, { recursive: true, force: true }); vi.unstubAllEnvs(); }
});

async function setup() {
  const course = (await request(app).post('/api/courses').set('Host', host).set('X-Course-Copilot-Token', token)
    .send({ code: 'INFO 5940', name: 'Ask fixture' })).body;
  const post = (title: string, content: string, kind: string, publishedAt: string) => request(app).post('/api/import')
    .set('Host', host).set('X-Course-Copilot-Token', token)
    .send({ courseId: course.id, title, content, kind, sourceType: 'canvas', sourceUrl: 'https://example.edu/' + kind, publishedAt });
  await post('Syllabus', 'Final project is due November 20, 2026. Submit a runnable demo.', 'syllabus', '2026-09-01T12:00:00Z');
  await post('Deadline update', 'The final project deadline has been moved from November 20, 2026 to November 22, 2026.', 'announcement', '2026-11-19T12:00:00Z');
  return course.id as string;
}

describe('Ask agent', () => {
  it('answers a deadline question from saved evidence with sources and tool steps when no model is connected', async () => {
    const courseId = await setup();
    const res = await request(app).post('/api/ask').set('Host', host).set('X-Course-Copilot-Token', token)
      .send({ courseId, question: 'When is the final project due?' });
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('no_model');
    expect(res.body.answer).toMatch(/November 22, 2026/);
    expect(res.body.sources.map((s: { title: string }) => s.title)).toContain('Deadline update');
    expect(res.body.steps.map((s: { tool: string }) => s.tool)).toEqual(expect.arrayContaining(['check_deadlines', 'search_course']));
  });
  it('says so when the answer is not in the saved materials', async () => {
    const courseId = await setup();
    const res = await request(app).post('/api/ask').set('Host', host).set('X-Course-Copilot-Token', token)
      .send({ courseId, question: 'zebra xylophone quantum' });
    expect(res.status).toBe(200);
    expect(res.body.answer).toMatch(/couldn't find/i);
  });
  it('requires the paired token and a question', async () => {
    const courseId = await setup();
    expect((await request(app).post('/api/ask').set('Host', host).send({ courseId, question: 'due?' })).status).toBe(403);
    expect((await request(app).post('/api/ask').set('Host', host).set('X-Course-Copilot-Token', token).send({ courseId, question: '' })).status).toBe(400);
  });
});

describe('ChatGPT MCP over HTTP', () => {
  it('lists the read-only tools only for the secret path', async () => {
    await setup();
    const library = new ReadOnlyLibrary(dataDir);
    try {
      const mcp = createMcpHttpApp(library, 'secret-123');
      const headers = { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json' };
      expect((await request(mcp).post('/mcp/wrong').set(headers).send({})).status).toBe(404);
      const res = await request(mcp).post('/mcp/secret-123').set(headers)
        .send({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
      expect(res.status).toBe(200);
      const text = res.text.includes('data:') ? res.text.split('data:').pop()! : res.text;
      const names = JSON.parse(text).result.tools.map((t: { name: string }) => t.name);
      expect(names).toEqual(expect.arrayContaining(['list_courses', 'search_course', 'get_conflicts']));
    } finally { library.close(); }
  });
});
