import express from 'express';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ReadOnlyLibrary } from '../library/evidence/read.js';
import { getDataDir } from '../shared/config.js';
import { createMcpServer } from './index.js';

/**
 * Read-only MCP over HTTP, so ChatGPT (developer-mode connector / ChatGPT app) can use the same six tools.
 * It listens on 127.0.0.1 only. To reach it from ChatGPT you must expose it yourself with a temporary
 * HTTPS tunnel during a demo. The URL contains a secret path token; anyone with the full URL can read
 * the saved library, and ChatGPT sends retrieved passages to OpenAI. Stop the tunnel when you are done.
 */
export function createMcpHttpApp(library: ReadOnlyLibrary, secret: string) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));
  const matches = (value: string) => { const a = Buffer.from(value); const b = Buffer.from(secret); return a.length === b.length && timingSafeEqual(a, b); };
  app.all('/mcp/:secret', async (req, res) => {
    if (!matches(String(req.params.secret))) return res.status(404).json({ error: 'Not found.' });
    if (req.method !== 'POST') return res.status(405).set('Allow', 'POST').json({ error: 'Use POST.' });
    // Stateless: a fresh read-only server per request, no session state kept.
    const server = createMcpServer(library);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => { void transport.close(); void server.close(); });
    try { await server.connect(transport); await transport.handleRequest(req, res, req.body); }
    catch { if (!res.headersSent) res.status(500).json({ error: 'The MCP request failed.' }); }
  });
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));
  return app;
}

export function startMcpHttp() {
  const port = Number(process.env.MCP_HTTP_PORT || 4311);
  const secret = process.env.COURSE_COPILOT_MCP_SECRET || randomBytes(18).toString('hex');
  const library = new ReadOnlyLibrary(getDataDir());
  const app = createMcpHttpApp(library, secret);
  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Course Copilot read-only MCP for ChatGPT: http://127.0.0.1:${port}/mcp/${secret}`);
    console.log('To connect ChatGPT, expose this port with a temporary HTTPS tunnel and use: https://<your-tunnel>/mcp/' + secret);
    console.log('Keep this URL private. Stop the tunnel when your demo ends.');
  });
  const stop = () => server.close(() => { library.close(); process.exit(0); });
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) startMcpHttp();
