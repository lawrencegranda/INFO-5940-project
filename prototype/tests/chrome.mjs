import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const project = fileURLToPath(new URL('../', import.meta.url))
const work = process.env.SPIKE_WORK || resolve(project, '.test-output')
await mkdir(work, { recursive: true })
const profile = process.env.SPIKE_CHROME_PROFILE || await mkdtemp(join(work, 'chrome-'))
const folder = resolve(process.argv[2] || 'assets')
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const context = await chromium.launchPersistentContext(profile, {
  executablePath: chrome,
  headless: !process.env.SPIKE_HEADFUL,
  ignoreDefaultArgs: ['--disable-extensions'],
  viewport: { width: 390, height: 920 },
  args: ['--enable-unsafe-extension-debugging', '--disable-background-networking'],
})
const stats = { profile, folder, calls: [], requests: [], browserErrors: [], scenarios: [] }
let page
try {
  const session = await context.browser().newBrowserCDPSession()
  const { id } = await session.send('Extensions.loadUnpacked', { path: resolve(project, 'dist') })
  assert.match(id, /^[a-p]{32}$/)
  stats.extensionId = id
  page = await context.newPage()
  page.on('pageerror', error => stats.browserErrors.push(error.message))
  page.on('request', request => {
    if (request.url().startsWith('http')) stats.requests.push(request.url())
  })
  page.on('requestfinished', request => {
    if (!request.url().endsWith('/api/chat')) return
    const { model, messages } = request.postDataJSON()
    const timing = request.timing()
    stats.calls.push({
      model,
      vision: Boolean(messages[0].images?.length),
      kind: messages[0].images?.length ? 'index' : messages[0].content.startsWith('Rank') ? 'rerank' : messages[0].content.startsWith('Read the marketing brief') ? 'interpret' : 'feedback',
      ms: Math.round(timing.responseEnd),
    })
  })
  await page.goto(`chrome-extension://${id}/index.html`)
  await page.waitForFunction(() => document.querySelector('#connection')?.textContent === 'Ollama connected', null, { timeout: 15000 })
  assert.equal(await page.inputValue('#model'), 'qwen3-vl:8b-instruct')
  await page.locator('#folder').setInputFiles(folder)
  await page.locator('#index').waitFor({ state: 'visible' })
  await page.waitForFunction(() => !document.querySelector('#choose').disabled)
  const galleryCount = await page.locator('#gallery li').count()
  assert.ok(galleryCount >= 4, 'Use at least four images for this smoke test.')
  assert.equal(await page.locator('#gallery img').count(), galleryCount)
  stats.assets = galleryCount
  console.log(`Chrome extension ${id}; ${galleryCount} local previews loaded`)
  if (await page.locator('#index').isEnabled()) {
    const started = performance.now()
    await page.locator('#index').click()
    await page.waitForFunction(() => /Indexing (finished|interrupted)/.test(document.querySelector('#index-label')?.textContent ?? ''), null, { timeout: 900_000 })
    stats.indexWallMs = Math.round(performance.now() - started)
    stats.indexStatus = await page.locator('#index-label').textContent()
    console.log(stats.indexStatus)
  }
  await page.waitForFunction(() => !document.querySelector('#choose').disabled)
  stats.indexed = await page.locator('#gallery small').filter({ hasText: /^Indexed$/ }).count()
  stats.indexErrors = await page.locator('#gallery small').filter({ hasText: /^Indexing error$/ }).count()
  assert.ok(stats.indexed >= 4, await page.locator('#status').textContent())
  const sample = page.locator('#gallery li').filter({ has: page.getByText('Indexed', { exact: true }) }).first()
  await sample.locator('button').click()
  assert.equal(await page.locator('.asset-metadata dt').count(), 7)
  for (const [label, width, height] of [['16:9', 1280, 720], ['1:1', 1080, 1080], ['9:16', 1080, 1920]]) {
    await page.getByRole('button', { name: label, exact: true }).click()
    await page.waitForFunction(
      ([label, width, height]) => {
        const canvas = document.querySelector('#crop')
        return canvas.width === width && canvas.height === height &&
          document.querySelector('#crop-info').textContent.startsWith(label) &&
          canvas.getContext('2d').getImageData(Math.floor(width / 2), Math.floor(height / 2), 1, 1).data[3] === 255
      }, [label, width, height]
    )
  }
  await page.reload()
  await page.waitForFunction(count => document.querySelectorAll('#gallery img').length === count, galleryCount)
  assert.equal(await page.locator('#gallery small').filter({ hasText: /^Indexed$/ }).count(), stats.indexed)

  for (const option of ['0', '1', '2']) {
    const title = await page.locator(`#scenario option[value="${option}"]`).textContent()
    await page.selectOption('#scenario', option)
    const sampleText = await page.inputValue('#brief')
    assert.ok(sampleText.length > 100)
    if (option === '2') {
      await page.locator('#brief').fill(sampleText + ' Keep the mood upbeat.')
      assert.equal(await page.inputValue('#scenario'), '')
    }
    assert.equal(await page.locator('#find').isEnabled(), true)
    await page.locator('#find').click()
    await page.waitForFunction(() => /^(Found |Ollama |Cannot reach |Choose an output)/.test(document.querySelector('#status')?.textContent ?? ''))
    const notice = await page.locator('#status').textContent()
    assert.match(notice, /^Found 3 recommendations/, notice)
    const rendered = await page.locator('.recommendation').evaluateAll(cards => cards.map(card => ({
      id: card.dataset.assetId, name: card.querySelector('h3').textContent,
      explanation: card.querySelector('.rec-copy p').textContent,
      layoutRisk: card.querySelector('.risk').textContent,
    })))
    assert.equal(new Set(rendered.map(card => card.id)).size, 3)
    assert.ok(rendered.every(card => card.explanation && card.layoutRisk))
    assert.equal(await page.locator('.recommendation img').count(), 3)
    stats.scenarios.push({ title, notice, recommendations: rendered.map(({ id, ...card }) => card) })
    console.log(title, notice)
    if (option === '0') {
      const rejected = rendered[0].id
      await page.getByRole('button', { name: 'Reject & refine' }).first().click()
      await page.locator('#feedback').fill('This image is too casual. I need something more professional with room for a headline on the left.')
      await page.getByRole('button', { name: 'Apply feedback' }).click()
      await page.waitForFunction(() => /^(Updated recommendations|Ollama |Cannot reach )/.test(document.querySelector('#status')?.textContent ?? ''))
      const outcome = await page.locator('#status').textContent()
      assert.match(outcome, /^Updated recommendations/)
      assert.equal(await page.locator('.recommendation').count(), 3)
      assert.equal(await page.locator('.change').count(), 3)
      const newIds = await page.locator('.recommendation').evaluateAll(cards => cards.map(card => card.dataset.assetId))
      assert.ok(!newIds.includes(rejected))
      const criteria = await page.locator('#constraints li').allTextContents()
      assert.ok(criteria.length && /professional|polished/i.test(criteria.join(' ')))
      assert.match(criteria.join(' '), /left|headline|text/i)
      stats.feedback = {
        notice: outcome, criteria, changes: await page.locator('.change').allTextContents(),
        recommendations: await page.locator('.rec-copy h3').allTextContents(),
      }
      console.log('Feedback', outcome, criteria)
      const shot = process.env.SPIKE_SCREENSHOT
      if (shot) await page.screenshot({ path: shot, fullPage: true })
    }
  }
  assert.ok(stats.requests.every(url => url.startsWith('http://127.0.0.1:11435/')))
  assert.deepEqual(stats.browserErrors, [])
  console.log('Chrome smoke passed: gallery, metadata, persistence, three crop ratios, three scenarios and feedback.')
} finally {
  if (page) {
    stats.finalStatus = await page.locator('#status').textContent().catch(() => null)
    stats.galleryState = await page.locator('#library-detail').textContent().catch(() => null)
  }
  await writeFile(process.env.SPIKE_STATS || join(work, 'chrome-results.json'), JSON.stringify(stats, null, 2))
  await context.close()
}
