import { build, context } from 'esbuild';
import { mkdir, copyFile, cp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { projectRoot } from '../src/shared/config.js';
export async function buildPrototype(watch = false) {
  const root = projectRoot();
  await mkdir(resolve(root, 'dist/ui'), { recursive: true });
  await copyFile(resolve(root, 'src/ui/index.html'), resolve(root, 'dist/ui/index.html'));
  const options = { entryPoints: [resolve(root, 'src/ui/app.tsx')], bundle: true, format: 'esm' as const, target: 'es2020', outfile: resolve(root, 'dist/ui/app.js'), sourcemap: true, jsx: 'automatic' as const, minify: !watch };
  if (watch) { const ctx = await context(options); await ctx.watch(); } else await build(options);
  await build({ entryPoints: [resolve(root, 'src/mcp/index.ts')], bundle: true, platform: 'node', format: 'esm', packages: 'external', target: 'node20', outfile: resolve(root, 'dist/mcp/index.js') });
  await cp(resolve(root, 'src/extension'), resolve(root, 'dist/extension'), { recursive: true });
}
if (process.argv[1] && /build\.(ts|js)$/.test(process.argv[1])) {
  await buildPrototype();
  console.log('Built Course Copilot UI, local MCP server and Chrome extension.');
}
