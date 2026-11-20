import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
export function projectRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 7; i++) {
    const pkg = resolve(dir, 'package.json');
    try { if (existsSync(pkg) && JSON.parse(readFileSync(pkg, 'utf8')).name === 'course-copilot') return dir; } catch {}
    dir = dirname(dir);
  }
  throw new Error('Course Copilot project root could not be found.');
}
export function getDataDir(): string { return resolve(process.env.COURSE_COPILOT_DATA_DIR || resolve(projectRoot(), '.course-copilot')); }
export const DEFAULT_PORT = 4310;
