import assert from 'node:assert/strict'
import { test } from 'node:test'
import { changedRecommendations, cropRect, ratios, shortlist, validateFocus } from '../src/core.ts'

test('all aspect ratios keep crop coordinates within source bounds', () => {
  for (const [width, height] of [[4000, 2199], [701, 2400], [350, 350], [1, 1]]) {
    for (const { width: targetWidth, height: targetHeight } of ratios) {
      const ratio = targetWidth / targetHeight
      for (const x of [0, 0.3, 1, -1, NaN]) {
        for (const y of [0, 0.6, 1, 2, Infinity]) {
          const crop = cropRect(width, height, ratio, x, y)
          assert.ok(crop.x >= 0 && crop.y >= 0)
          assert.ok(crop.x + crop.width <= width + 1e-9)
          assert.ok(crop.y + crop.height <= height + 1e-9)
          assert.ok(Math.abs(crop.width / crop.height - ratio) < 1e-9)
        }
      }
    }
  }
})
test('invalid source dimensions fail and invalid model focus falls back to center', () => {
  assert.throws(() => cropRect(0, 10, 1, 0, 0), /positive/)
  assert.equal(validateFocus(Infinity), 0.5)
  assert.equal(validateFocus(-0.1), 0.5)
  assert.equal(validateFocus('0.1'), 0.5)
  assert.equal(validateFocus(0.1), 0.1)
})
test('metadata retrieval scores relevant assets and excludes rejected or unindexed candidates', () => {
  const make = (id, caption, visualStyle) => ({
    id, path: id, preview: new Blob(), metadata: {
      category: 'photo', caption, subject: '', visualStyle, composition: '',
      negativeSpace: '', suggestedUsage: '',
    },
  })
  const assets = [
    make('a', 'student club', 'casual'),
    make('b', 'engineering student', 'professional'),
    make('c', 'engineering equipment', 'industrial'),
    { id: 'd', path: 'engineering', preview: new Blob() },
  ]
  assert.equal(shortlist(assets, 'engineering student', ['professional'], new Set())[0].id, 'b')
  assert.deepEqual(shortlist(assets, 'engineering student', [], new Set(['b'])).map(item => item.id), ['a', 'c'])
})
test('refinement labels new and reranked recommendations', () => {
  const rows = (...ids) => ids.map(assetId => ({ assetId }))
  assert.deepEqual(changedRecommendations(rows('a', 'b', 'c'), rows('b', 'd', 'c')),
    ['Moved from #2 to #1', 'New recommendation', 'Same position'])
})
