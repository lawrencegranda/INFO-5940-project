import { readFile, writeFile } from 'node:fs/promises'

const id = process.argv[2]
if (!id || !/^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(id)) {
  console.error('Usage: npm run configure:slides -- YOUR_CLIENT_ID.apps.googleusercontent.com')
  process.exitCode = 1
} else {
  for (const path of ['public/manifest.json', 'dist/manifest.json']) {
    const url = new URL(`../${path}`, import.meta.url)
    const source = await readFile(url, 'utf8').catch(error => {
      if (path.startsWith('dist/') && error.code === 'ENOENT') return
      throw error
    })
    if (!source) continue
    const manifest = JSON.parse(source)
    manifest.permissions = [...new Set([...manifest.permissions, 'identity'])]
    manifest.oauth2 = {
      client_id: id,
      scopes: ['https://www.googleapis.com/auth/presentations.readonly'],
    }
    await writeFile(url, JSON.stringify(manifest, null, 2) + '\n')
  }
  console.log('Configured read-only Slides OAuth. Reload the extension from chrome://extensions.')
}
