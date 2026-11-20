import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createMcpServer } from '../../src/mcp/index.js';
import { WritableLibrary } from '../../src/library/evidence/write.js';
import type { Material, ReadLibrary } from '../../src/shared/types.js';

const cleanups: Array<() => Promise<void> | void> = [];
afterEach(async () => { for (const cleanup of cleanups.splice(0).reverse()) await cleanup(); });

function payload(value: unknown): any {
  const text = (value as { content: Array<{ type: string; text?: string }> }).content.find((item) => item.type === 'text')?.text;
  if (!text) throw new Error('No text result');
  return JSON.parse(text);
}

function savedFiles(directory: string): Record<string, string> {
  const files: Record<string, string> = {};
  function visit(path: string, prefix = '') {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isDirectory()) visit(join(path, entry.name), prefix + entry.name + '/');
      else if (entry.isFile()) files[prefix + entry.name] = createHash('sha256').update(readFileSync(join(path, entry.name))).digest('hex');
    }
  }
  visit(directory);
  return files;
}

function childEnvironment(dataDir: string): Record<string, string> {
  return { PATH: process.env.PATH || '', COURSE_COPILOT_DATA_DIR: dataDir,
    OLLAMA_URL: 'http://127.0.0.1:1', NODE_NO_WARNINGS: '1' };
}

function fixture(): ReadLibrary {
  const content = 'A saved primary source passage. '.repeat(180);
  const material: Material = {
    id: 'doc-1', sourceId: 'source-1', courseId: 'course-1', title: 'Exact saved evidence',
    sourceUrl: 'https://example.edu/lecture', sourceType: 'web', kind: 'lecture', folder: 'Lectures',
    tags: ['evidence'], capturedAt: '2026-11-20T00:00:00Z', lastObservedAt: '2026-11-20T00:00:00Z',
    publishedAt: null, versionId: 'version-1', extractionRevisionId: 'extraction-1', versionCount: 1,
    outcome: 'complete', limitations: [], preview: content.slice(0, 360), summary: null, summaryModel: null,
    isDemo: true, conflictCount: 0, updateCount: 0,
  };
  const ref = { courseId: material.courseId, sourceId: material.sourceId, documentId: material.id,
    versionId: material.versionId, extractionRevisionId: material.extractionRevisionId, passageId: 'passage-1' };
  const passage = { id: 'passage-1', text: 'A saved primary source passage.', location: 'Paragraph 1', ref };
  function requireScope(courseId: string, documentId?: string, versionId?: string, revisionId?: string) {
    if (courseId !== material.courseId || (documentId && documentId !== material.id)) throw new Error('not_found_in_scope');
    if ((versionId && versionId !== material.versionId) || (revisionId && revisionId !== material.extractionRevisionId)) throw new Error('reference_mismatch');
  }
  return {
    listCourses: () => [{ id: 'course-1', code: 'INFO 5940', name: 'Studio', color: '#5c7955', documentCount: 1 }],
    search: async ({ courseId }) => { requireScope(courseId); return { items: [material], counts: { all: 1, updates: 0, issues: 0 }, retrievalMode: 'lexical', semanticStatus: 'unavailable' }; },
    getDocument: (courseId, documentId, versionId, revisionId) => {
      requireScope(courseId, documentId, versionId, revisionId);
      return { document: material, content, passages: [passage], history: [], conflicts: [],
        original: { url: '/opaque-original', mime: 'text/plain', name: 'source.txt', size: content.length } };
    },
    fetchPassages: (courseId, refs) => {
      requireScope(courseId);
      if (refs.some((entry) => entry.passageId !== passage.id || entry.sourceId !== material.sourceId ||
        entry.versionId !== material.versionId || entry.extractionRevisionId !== material.extractionRevisionId)) throw new Error('reference_mismatch');
      return [passage];
    },
    getHistory: (courseId, documentId) => { requireScope(courseId, documentId); return []; },
    getConflicts: (courseId, documentId) => { requireScope(courseId, documentId); return []; },
    readOriginal: (courseId, documentId, versionId) => { requireScope(courseId, documentId, versionId); return { bytes: Buffer.from(content), mime: 'text/plain', name: 'source.txt' }; },
    close: () => undefined,
  };
}

async function protocolClient() {
  const server = createMcpServer(fixture());
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: 'course-copilot-test', version: '1.0.0' });
  await client.connect(clientTransport);
  cleanups.push(async () => { await client.close(); await server.close(); });
  return client;
}

describe('MCP protocol and read-only boundaries', () => {
  it('exposes six read-only tools and round-trips exact search references with explicit pagination', async () => {
    const client = await protocolClient();
    const tools = await client.listTools();
    expect(tools.tools.map((tool) => tool.name).sort()).toEqual([
      'fetch_document', 'fetch_passages', 'get_conflicts', 'get_document_history', 'list_courses', 'search_course',
    ]);
    expect(tools.tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(true);
    const search = payload(await client.callTool({ name: 'search_course', arguments: { courseId: 'course-1', query: 'saved source' } }));
    expect(search.items[0].ref).toMatchObject({ versionId: 'version-1', extractionRevisionId: 'extraction-1' });
    expect(search.items[0].preview.length).toBeLessThanOrEqual(360);
    const first = payload(await client.callTool({ name: 'fetch_document', arguments: { ...search.items[0].ref, maxCharacters: 80 } }));
    expect(first.text).toHaveLength(80);
    expect(first.hasMore).toBe(true);
    const next = payload(await client.callTool({ name: 'fetch_document', arguments: { ...search.items[0].ref, cursor: first.nextCursor, maxCharacters: 80 } }));
    expect(next.cursor).toBe(80);
    expect(next.document.ref).toEqual(first.document.ref);
    const resource = await client.readResource({ uri: first.original.uri });
    const original = JSON.parse((resource.contents[0] as { text: string }).text);
    expect(original.mime).toBe('text/plain');
    expect(Buffer.from(original.data, 'base64').toString()).toContain('saved primary source');
  });

  it('rejects cross-course references and missing or incorrect extraction revisions', async () => {
    const client = await protocolClient();
    const wrongCourse = await client.callTool({ name: 'fetch_document', arguments: {
      courseId: 'other-course', documentId: 'doc-1', versionId: 'version-1', extractionRevisionId: 'extraction-1',
    } });
    expect(wrongCourse.isError).toBe(true);
    expect(payload(wrongCourse).error.code).toBe('not_found_in_scope');
    const wrongRevision = await client.callTool({ name: 'fetch_document', arguments: {
      courseId: 'course-1', documentId: 'doc-1', versionId: 'version-1', extractionRevisionId: 'newer-unrequested-revision',
    } });
    expect(wrongRevision.isError).toBe(true);
    const missingRevision = await client.callTool({ name: 'fetch_document', arguments: {
      courseId: 'course-1', documentId: 'doc-1', versionId: 'version-1',
    } });
    expect(missingRevision.isError).toBe(true);
    const foreignPassage = await client.callTool({ name: 'fetch_passages', arguments: {
      courseId: 'other-course', refs: [{ courseId: 'course-1', sourceId: 'source-1', documentId: 'doc-1',
        versionId: 'version-1', extractionRevisionId: 'extraction-1', passageId: 'passage-1' }],
    } });
    expect(foreignPassage.isError).toBe(true);
    expect(payload(foreignPassage).error.code).toBe('not_found_in_scope');
  });

  it('serves a real saved SQLite library over stdio without changing its files or redirecting old references', async () => {
    const temporary = mkdtempSync(join(tmpdir(), 'course-copilot-stdio-'));
    cleanups.push(() => rmSync(temporary, { recursive: true, force: true }));
    const writer = new WritableLibrary(temporary);
    const course = writer.createCourse({ id: 'course-stdio', code: 'TEST 101', name: 'Protocol fixture' });
    const foreign = writer.createCourse({ id: 'course-foreign', code: 'TEST 102', name: 'Different course' });
    const first = await writer.importText({ courseId: course.id, title: 'Stored protocol source',
      sourceUrl: 'https://example.edu/protocol-source', content: 'Immutable original protocol passage. The retrieval marker is violet.', isDemo: true });
    const second = await writer.importText({ courseId: course.id, title: 'Stored protocol source',
      sourceUrl: 'https://example.edu/protocol-source', content: 'Updated protocol passage. The retrieval marker is violet and green.', isDemo: true });
    const oldRef = { courseId: course.id, documentId: first.document.id, sourceId: first.document.sourceId,
      versionId: first.document.versionId, extractionRevisionId: first.document.extractionRevisionId };
    writer.close();
    const before = savedFiles(temporary);
    const transport = new StdioClientTransport({ command: process.execPath,
      args: ['--import', 'tsx', 'src/mcp/index.ts'], cwd: process.cwd(), stderr: 'pipe', env: childEnvironment(temporary) });
    const client = new Client({ name: 'persisted-stdio-fixture', version: '1.0.0' });
    cleanups.push(async () => { await client.close().catch(() => undefined); });
    await client.connect(transport);
    expect((await client.listTools()).tools).toHaveLength(6);
    expect(payload(await client.callTool({ name: 'list_courses', arguments: {} })).courses).toHaveLength(2);
    const search = payload(await client.callTool({ name: 'search_course', arguments: { courseId: course.id, query: 'retrieval marker' } }));
    expect(search.items[0].ref.versionId).toBe(second.document.versionId);
    const current = payload(await client.callTool({ name: 'fetch_document', arguments: search.items[0].ref }));
    expect(current.text).toContain('Updated protocol passage');
    const original = payload(await client.callTool({ name: 'fetch_document', arguments: oldRef }));
    expect(original.text).toContain('Immutable original protocol passage');
    expect(original.text).not.toContain('Updated protocol passage');
    expect(original.document.ref.versionId).toBe(first.document.versionId);
    const passages = payload(await client.callTool({ name: 'fetch_passages', arguments: {
      courseId: course.id, refs: [original.citations[0].ref],
    } }));
    expect(passages.passages[0].text).toContain('Immutable original protocol passage');
    const denied = await client.callTool({ name: 'fetch_document', arguments: { ...oldRef, courseId: foreign.id } });
    expect(denied.isError).toBe(true);
    expect(payload(denied).error.code).toBe('not_found_in_scope');
    expect(payload(await client.callTool({ name: 'get_document_history', arguments: {
      courseId: course.id, documentId: first.document.id,
    } })).history).toHaveLength(2);
    await client.close();
    expect(savedFiles(temporary)).toEqual(before);
  }, 20_000);

  it('stdio startup against a missing library reports a diagnostic and creates no storage', async () => {
    const temporary = mkdtempSync(join(tmpdir(), 'course-copilot-mcp-'));
    const missing = join(temporary, 'does-not-exist');
    cleanups.push(() => rmSync(temporary, { recursive: true, force: true }));
    const transport = new StdioClientTransport({ command: process.execPath,
      args: ['--import', 'tsx', 'src/mcp/index.ts'], cwd: process.cwd(), stderr: 'pipe',
      env: childEnvironment(missing) });
    let diagnostic = '';
    transport.stderr?.on('data', (chunk) => { diagnostic += String(chunk); });
    const client = new Client({ name: 'missing-library-test', version: '1.0.0' });
    cleanups.push(async () => { await client.close().catch(() => undefined); });
    await expect(client.connect(transport)).rejects.toThrow();
    expect(diagnostic).toContain('library_unavailable');
    expect(existsSync(missing)).toBe(false);
  }, 10_000);
});
