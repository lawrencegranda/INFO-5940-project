import assert from 'node:assert/strict'
import { test } from 'node:test'
import { frameGeometry, placementDecision, slideOutput, subjectCoverage, validOutput } from '../src/campaign.ts'
import { describeBounds, parsePage, parseSlidesUrl, pickPage, readDeck, readPage, SlidesError } from '../src/slides.ts'

const intent = (platform, placement, clarification = '') => ({ platform, placement, clarification })

test('ambiguous feed choices are presented and explicit placement is preserved', () => {
  assert.equal(placementDecision('Instagram Story', intent('instagram', 'ig-story')).format.id, 'ig-story')
  assert.deepEqual(placementDecision('Instagram Feed', intent('instagram', 'ig-feed-square')).choices.map(p => p.id),
    ['ig-feed-square', 'ig-feed-portrait'])
  assert.equal(placementDecision('Instagram Feed 4:5', intent('instagram', 'ig-feed-portrait')).format.id, 'ig-feed-portrait')
  assert.equal(placementDecision('Facebook Feed', intent('facebook', 'fb-feed-landscape')).choices.length, 2)
  assert.deepEqual(placementDecision('Recruit students for a slide', intent('slides', '', 'What Slides ratio?')), {})
})

test('valid render dimensions and native deck proportions use bounded pixel sizes', () => {
  assert.equal(validOutput(1080, 1920), true)
  for (const value of [0, 63, 100.5, 4097, NaN]) assert.equal(validOutput(value, 1920), false)
  assert.deepEqual([slideOutput({ width: 720, height: 540 }).width, slideOutput({ width: 720, height: 540 }).height], [1920, 1440])
})

test('geometry protects a marked subject with padding or manual framing', () => {
  const source = { width: 1600, height: 900 }
  const target = { width: 1080, height: 1920 }
  const subject = { x: 40, y: 150, width: 200, height: 400 }
  const centered = frameGeometry(source, target, 'crop', .5, .5, 1)
  const moved = frameGeometry(source, target, 'crop', 0, .5, 1)
  const padded = frameGeometry(source, target, 'pad', .5, .5, 1, 'left')
  assert.equal(subjectCoverage(centered.source, subject), 0)
  assert.equal(subjectCoverage(moved.source, subject), 1)
  assert.equal(subjectCoverage(padded.source, subject), 1)
  assert.ok(padded.dest.x >= target.width / 4)
  for (const x of [-8, 0, .5, 1, Infinity]) {
    for (const y of [-8, 0, .5, 1, NaN]) {
      const { source: frame, dest } = frameGeometry(source, target, 'crop', x, y, 3)
      assert.ok(frame.x >= 0 && frame.y >= 0)
      assert.ok(frame.x + frame.width <= source.width && frame.y + frame.height <= source.height)
      assert.ok(Math.abs(frame.width / frame.height - target.width / target.height) < 1e-9)
      assert.deepEqual(dest, { x: 0, y: 0, ...target })
    }
  }
})

test('only official presentation URLs are accepted and slide IDs are verified against the deck', () => {
  assert.deepEqual(parseSlidesUrl('https://docs.google.com/presentation/d/deck-1/edit#slide=id.g-2'), { id: 'deck-1', hintedPage: 'g-2' })
  assert.equal(parseSlidesUrl('https://docs.google.com.bad.example/presentation/d/a/edit'), undefined)
  assert.equal(parseSlidesUrl('https://docs.google.com/presentation/d/e/published/pub'), undefined)
  assert.equal(parseSlidesUrl('http://docs.google.com/presentation/d/a/edit'), undefined)
  assert.deepEqual(pickPage(['first', 'second'], 'second'), { id: 'second', matched: true })
  assert.deepEqual(pickPage(['first', 'second'], 'stale'), { id: 'first', matched: false })
})

const pt = magnitude => ({ magnitude, unit: 'PT' })
const box = (width, height) => ({ width: pt(width), height: pt(height) })
const translate = (translateX, translateY) => ({ scaleX: 1, scaleY: 1, translateX, translateY, unit: 'PT' })
const text = content => ({ textElements: [{ textRun: { content } }] })
const page = {
  pageElements: [
    { objectId: 'title', size: box(200, 50), transform: translate(20, 10), shape: { text: text('Research Showcase\n') } },
    { transform: translate(200, 80), elementGroup: { children: [
      { objectId: 'image', size: box(100, 80), transform: translate(10, 5), image: { contentUrl: 'private' }, title: 'Lab equipment' },
      { objectId: 'table', size: box(200, 30), table: { tableRows: [{ tableCells: [{ text: text('Schedule') }, { text: text('Friday') }] }] } },
    ] } },
  ],
}

test('shape and table text and grouped image layout are extracted without image URLs', () => {
  const parsed = parsePage('slide', page)
  assert.equal(parsed.text, 'Research Showcase\n\nSchedule | Friday')
  const image = parsed.items.find(x => x.kind === 'image')
  assert.deepEqual(image.bounds, { x: 210, y: 85, width: 100, height: 80 })
  assert.equal(describeBounds(image.bounds, { width: 400, height: 200 }), 'x 53%, y 43%, width 25%, height 40%')
  assert.ok(!JSON.stringify(parsed).includes('private'))
})

test('official transport uses only authenticated GET and handles 403', async () => {
  const requests = []
  const transport = async (url, init) => {
    requests.push({ url: new URL(url), init })
    return Response.json(url.includes('/pages/') ? page : { title: 'Research', pageSize: box(400, 200), slides: [{ objectId: 'p1' }] })
  }
  assert.deepEqual(await readDeck('deck', 'test-token', transport),
    { id: 'deck', title: 'Research', pageSize: { width: 400, height: 200 }, pages: ['p1'] })
  assert.equal((await readPage('deck', 'p1', 'test-token', transport)).items.length, 3)
  for (const { url, init } of requests) {
    assert.equal(url.origin, 'https://slides.googleapis.com')
    assert.equal(init.method, 'GET')
    assert.equal(init.headers.Authorization, 'Bearer test-token')
    assert.equal(init.redirect, 'error')
  }
  await assert.rejects(readDeck('deck', 'test-token', async () => Response.json({ error: { message: 'Permission denied' } }, { status: 403 })),
    error => error instanceof SlidesError && error.status === 403)
})
