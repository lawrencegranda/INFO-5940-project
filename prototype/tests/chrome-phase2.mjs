import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const project = fileURLToPath(new URL('../', import.meta.url))
const work = resolve(project, '.test-output')
await mkdir(work, { recursive: true })
const profile = process.env.SPIKE_CHROME_PROFILE
if (!profile) throw new Error('Set SPIKE_CHROME_PROFILE to a test profile with an indexed source library.')
const context = await chromium.launchPersistentContext(resolve(profile), {
  executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  ignoreDefaultArgs: ['--disable-extensions'],
  viewport: { width: 390, height: 930 },
  acceptDownloads: true,
  args: ['--enable-unsafe-extension-debugging', '--disable-background-networking'],
})
const stats = { campaign: [], slides: { fixtureRequests: [] }, browserErrors: [] }
const scope = 'https://www.googleapis.com/auth/presentations.readonly'
const deckUrl = 'https://docs.google.com/presentation/d/fixture-deck/edit#slide=id.research'
const px = (page, width, height) => page.waitForFunction(([w, h]) => {
  const canvas = document.querySelector('#crop')
  return canvas.width === w && canvas.height === h && canvas.getContext('2d').getImageData(w >> 1, h >> 1, 1, 1).data[3] === 255
}, [width, height])
const connected = page => page.waitForFunction(() => document.querySelector('#connection')?.textContent === 'Ollama connected')
const ready = page => page.waitForFunction(() => /^(Found |Ollama |Choose an output)/.test(document.querySelector('#status')?.textContent ?? ''), null, { timeout: 45_000 })
const proof = async page => {
  const text = await page.locator('#status').textContent()
  assert.match(text, /^Found 3 recommendations/, text)
  const results = await page.locator('.recommendation').evaluateAll(rows => rows.map(row => ({
    name: row.querySelector('h3').textContent.replace(/^\d+\. /, ''),
    strategy: row.dataset.strategy, reason: row.querySelector('.rec-copy p').textContent,
  })))
  assert.equal(results.length, 3)
  assert.ok(results.every(result => ['crop', 'pad'].includes(result.strategy)))
  return { status: text, plan: await page.locator('#campaign-plan').innerText(), results }
}
const slideSize = (width, height) => ({ width: { magnitude: width, unit: 'PT' }, height: { magnitude: height, unit: 'PT' } })
const anchor = (translateX, translateY) => ({ scaleX: 1, scaleY: 1, translateX, translateY, unit: 'PT' })
const textShape = (value) => ({ text: { textElements: [{ textRun: { content: value } }] } })

try {
  const cdp = await context.browser().newBrowserCDPSession()
  const { id } = await cdp.send('Extensions.loadUnpacked', { path: resolve(project, 'dist') })
  const url = `chrome-extension://${id}/index.html`
  const page = await context.newPage()
  page.on('pageerror', error => stats.browserErrors.push(error.message))
  await page.goto(url)
  await connected(page)
  assert.ok(await page.locator('#gallery img').count() >= 4, 'Use at least four indexed test photos.')

  const manifest = JSON.parse(await readFile(resolve(project, 'dist/manifest.json'), 'utf8'))
  if (manifest.oauth2?.client_id) {
    assert.deepEqual(manifest.oauth2.scopes, [scope])
    stats.slides.configuration = 'Built manifest requests only the read-only Slides scope'
  } else {
    await page.getByText('Read a Google Slides deck', { exact: true }).click()
    await page.locator('#deck-url').fill(deckUrl)
    await page.getByRole('button', { name: 'Read deck', exact: true }).click()
    assert.match(await page.locator('#slides-status').textContent(), /OAuth needs a client ID/)
    stats.slides.unconfigured = 'Shows actionable setup message before network requests'
    await page.getByText('Read a Google Slides deck', { exact: true }).click()
  }

  const brief = 'I need an Instagram Story promoting an engineering student research event to prospective engineering students. Find a polished lab image and leave space for a headline on the left.'
  await page.locator('#brief').fill(brief)
  await page.locator('#find').click()
  await ready(page)
  stats.campaign.push(await proof(page))
  assert.match(stats.campaign[0].plan, /Instagram Stories · 1080 × 1920/)
  await page.getByRole('button', { name: 'Preview crop', exact: true }).first().click()
  await px(page, 1080, 1920)
  assert.ok(await page.locator('#download-crop').isEnabled(), 'Expected the original source file.')
  await page.getByText('Check subject preservation', { exact: true }).click()
  await page.locator('#source-frame').scrollIntoViewIfNeeded()
  const box = await page.locator('#source-frame').boundingBox()
  assert.ok(box)
  await page.mouse.move(box.x + box.width * .12, box.y + box.height * .26)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * .37, box.y + box.height * .63)
  await page.mouse.up()
  await page.locator('#adaptation').selectOption('pad')
  assert.match(await page.locator('#crop-info').textContent(), /Reserved left headline space.*Marked subject retained 100%/)
  const preCrop = await page.locator('#crop').evaluate(canvas => canvas.toDataURL().slice(-230))
  await page.locator('#adaptation').selectOption('crop')
  await page.locator('#frame-x').fill('25')
  await page.locator('#frame-zoom').fill('200')
  const afterCrop = await page.locator('#crop').evaluate(canvas => canvas.toDataURL().slice(-230))
  assert.notEqual(preCrop, afterCrop)
  stats.crop = { marks: await page.locator('#crop-info').textContent(), padRetained: '100%', dimensions: '1080×1920' }
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download PNG' }).click()])
  const png = await readFile(await download.path())
  assert.equal(png.toString('ascii', 1, 4), 'PNG')
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1080, 1920])
  stats.crop.pngVerified = true
  console.log('Story rendering, panning, zoom, marked subject, and PNG dimensions verified.')

  await page.selectOption('#placement', 'x-landscape')
  await page.locator('#output-width').fill('1440')
  await page.locator('#output-height').fill('810')
  await page.locator('#find').click()
  await ready(page)
  stats.campaign.push(await proof(page))
  assert.match(stats.campaign[1].plan, /X \/ Twitter · Landscape post · 1440 × 810/)
  await page.getByRole('button', { name: 'Preview crop', exact: true }).first().click()
  await px(page, 1440, 810)

  await page.selectOption('#placement', '')
  await page.locator('#brief').fill('Find a polished Instagram Feed image for our fall research event.')
  await page.locator('#find').click()
  await ready(page)
  assert.match(await page.locator('#status').textContent(), /Choose an output format/)
  assert.equal(await page.locator('.recommendation').count(), 0)
  assert.ok(await page.getByRole('button', { name: 'Instagram Feed · Square' }).isVisible())
  stats.ambiguity = 'Instagram Feed offered a choice before reranking'
  console.log('Same campaign reranked at a different placement and ambiguous Feed offered a choice.')

  const slides = await context.newPage()
  slides.on('pageerror', error => stats.browserErrors.push(error.message))
  await slides.addInitScript(({ scope, deckUrl }) => {
    const app = globalThis.chrome || (globalThis.chrome = {})
    const get = app.runtime?.getManifest?.bind(app.runtime)
    const runtime = { getManifest: () => ({ ...get?.(), oauth2: { client_id: 'fixture.apps.googleusercontent.com', scopes: [scope] } }) }
    Object.defineProperty(app, 'runtime', { configurable: true, value: runtime })
    Object.defineProperty(app, 'tabs', { configurable: true, value: { query: async () => [{ url: deckUrl }] } })
    Object.defineProperty(app, 'permissions', { configurable: true, value: { request: async () => true } })
    Object.defineProperty(app, 'identity', { configurable: true, value: {
      getAuthToken: async ({ interactive }) => ({ token: interactive ? 'fixture-expired' : 'fixture-refreshed', grantedScopes: [scope] }),
      removeCachedAuthToken: async () => {},
    } })
  }, { scope, deckUrl })
  await slides.route('https://slides.googleapis.com/**', async route => {
    const req = route.request()
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization' }
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    const api = new URL(req.url())
    const token = (await req.allHeaders()).authorization === 'Bearer fixture-expired' ? 'expired' : 'refreshed'
    stats.slides.fixtureRequests.push({ method: req.method(), path: api.pathname, token })
    if (token === 'expired') return route.fulfill({ status: 401, json: { error: { message: 'expired' } }, headers })
    if (!api.pathname.includes('/pages/')) return route.fulfill({
      headers, json: { title: 'Fixture research deck', pageSize: slideSize(720, 540), slides: [{ objectId: 'welcome' }, { objectId: 'research' }] },
    })
    const first = api.pathname.endsWith('welcome')
    return route.fulfill({ headers, json: {
      pageElements: [
        { objectId: 'title', size: slideSize(360, 80), transform: anchor(30, 40), shape: textShape(first ? 'Welcome future engineers' : 'Student Research Showcase') },
        { objectId: 'equipment', size: slideSize(260, 220), transform: anchor(390, 180), title: 'Lab equipment', image: { imageProperties: {} } },
      ],
    } })
  })
  await slides.goto(url)
  await connected(slides)
  await slides.getByText('Read a Google Slides deck', { exact: true }).click()
  await slides.getByRole('button', { name: 'Use active tab' }).click()
  assert.equal(await slides.locator('#deck-url').inputValue(), deckUrl)
  await slides.getByRole('button', { name: 'Read deck', exact: true }).click()
  await slides.waitForFunction(() => document.querySelector('#slides-status')?.textContent.startsWith('Read the slide linked'), null, { timeout: 15_000 })
  assert.equal(await slides.locator('#slide-page').inputValue(), 'research')
  assert.match(await slides.locator('#slide-contents').innerText(), /Student Research Showcase/)
  assert.match(await slides.locator('#slide-contents').innerText(), /Image · x 54%.*Lab equipment/)
  await slides.selectOption('#slide-page', 'welcome')
  await slides.waitForFunction(() => document.querySelector('#slide-contents')?.textContent.includes('Welcome future engineers'))
  await slides.getByRole('button', { name: 'Use this slide' }).click()
  assert.equal(await slides.locator('#brief').inputValue(), 'Welcome future engineers')
  await slides.locator('#find').click()
  await ready(slides)
  stats.slides.recommendation = await proof(slides)
  assert.match(stats.slides.recommendation.plan, /Google Slides · Deck size · 1920 × 1440/)
  assert.ok(stats.slides.fixtureRequests.every(request => request.method === 'GET'))
  assert.deepEqual(stats.slides.fixtureRequests.map(request => request.token), ['expired', 'refreshed', 'refreshed', 'refreshed'])
  assert.deepEqual(stats.browserErrors, [])
  console.log('Slides fixture verified: active tab, 401 refresh, selected slide, picker, layout and local recommendations.')
} finally {
  await writeFile(process.env.SPIKE_PHASE2_STATS || resolve(work, 'phase2-chrome.json'), JSON.stringify(stats, null, 2))
  await context.close()
}
