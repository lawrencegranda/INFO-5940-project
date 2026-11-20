import { mkdir, writeFile } from 'node:fs/promises'
import { interpretCampaign, preferredModel, listVisionModels } from '../src/ollama.ts'
import { placementDecision } from '../src/campaign.ts'

const examples = [
  ['Instagram Story', 'I need an Instagram Story promoting an engineering student research event to prospective engineering students. Keep room on the left for a headline.', 'instagram', 'ig-story'],
  ['Instagram Feed square', 'Make a square Instagram Feed post for a robotics club kickoff.', 'instagram', 'ig-feed-square'],
  ['Instagram Feed portrait', 'Find a polished portrait (4:5) Instagram Feed image for student recruitment.', 'instagram', 'ig-feed-portrait'],
  ['Facebook landscape', 'I need a landscape Facebook Feed image promoting a maker lab open house.', 'facebook', 'fb-feed-landscape'],
  ['Facebook square', 'Make a square Facebook Feed creative for research volunteers.', 'facebook', 'fb-feed-square'],
  ['X landscape', 'Find an image for a 16:9 landscape post on X (Twitter) about our campus research showcase.', 'x', 'x-landscape'],
  ['Slides widescreen', 'Create an image with room at the top for a widescreen 16:9 Google Slides slide about student labs.', 'slides', 'slides-wide'],
  ['Slides standard', 'Choose a collaborative lab image for a standard 4:3 Google Slides deck.', 'slides', 'slides-standard'],
  ['Unspecified Instagram placement', 'Find a friendly photo to promote our engineering club on Instagram.', 'instagram', 'clarify'],
  ['Unspecified Instagram Feed ratio', 'Find a polished Instagram Feed image for our fall research event.', 'instagram', 'clarify'],
  ['Unspecified Facebook Feed ratio', 'Find a Facebook Feed image for our fall research event.', 'facebook', 'clarify'],
  ['Generic slide', 'Find a group photo for a research kickoff slide. Keep a clear title area.', 'unspecified', 'legacy'],
]
if (!(await listVisionModels()).includes(preferredModel)) throw new Error('The required local model was not found.')
const results = []
for (const [name, brief, platform, expected] of examples) {
  try {
    const { value, durationMs } = await interpretCampaign(preferredModel, brief)
    const resolved = placementDecision(brief, value)
    const actual = resolved.format?.id ?? (resolved.choices ? 'clarify' : 'legacy')
    const raw = value.placement || (value.clarification ? 'clarify' : 'legacy')
    const row = { name, brief, platform, expected, actual, modelPlacement: value.placement, modelPlatform: value.platform,
      modelCorrect: value.platform === platform && raw === expected, correct: actual === expected, durationMs, intent: value }
    results.push(row)
    console.log(name, expected, actual, row.correct ? 'PASS' : 'MISS', `${durationMs} ms`)
  } catch (error) {
    results.push({ name, platform, expected, correct: false, error: error.message })
    console.log(name, 'ERROR', error.message)
  }
}
console.log(`Raw model ${results.filter(result => result.modelCorrect).length}/${results.length}; final placement ${results.filter(result => result.correct).length}/${results.length}`)
const work = new URL('../.test-output/', import.meta.url)
await mkdir(work, { recursive: true })
await writeFile(process.env.SPIKE_CAMPAIGN_STATS || new URL('phase2-campaign.json', work), JSON.stringify(results, null, 2))
