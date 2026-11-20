import { buildPrototype } from './build.js';
import { startServer } from '../src/library/api/server.js';
await buildPrototype(true);
await startServer();
