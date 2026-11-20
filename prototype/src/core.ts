export const ratios = [
  { label: '16:9', width: 1280, height: 720 },
  { label: '1:1', width: 1080, height: 1080 },
  { label: '9:16', width: 1080, height: 1920 },
] as const

export const scenarios = [
  {
    title: 'Engineering student recruitment',
    text: 'Recruit prospective Cornell engineering students. Show people doing hands-on technical work or collaborating on a project. Aim for an inviting but professional mood. Leave room for a headline on the left.',
  },
  {
    title: 'Research and innovation showcase',
    text: 'Highlight university research and innovation for faculty and industry guests. Favor a polished laboratory, equipment, or a visible research process. Avoid casual social imagery. Keep room for a slide title.',
  },
  {
    title: 'Student club event promotion',
    text: 'Promote a campus club kickoff for students. Look for a welcoming, energetic group or event scene that suggests participation. Keep some uncluttered space for event details.',
  },
] as const

export interface Metadata {
  category: string
  caption: string
  visualStyle: string
  subject: string
  composition: string
  negativeSpace: string
  suggestedUsage: string
  focusX: number
  focusY: number
}

export interface Asset {
  id: string
  name: string
  path: string
  width: number
  height: number
  preview?: Blob
  source?: Blob
  metadata?: Metadata
  model?: string
  durationMs?: number
  error?: string
}

export const metadataFields = {
  category: 'Category',
  caption: 'Caption',
  visualStyle: 'Visual style',
  subject: 'Subject',
  composition: 'Composition',
  negativeSpace: 'Negative space',
  suggestedUsage: 'Suggested usage',
} as const

export interface Recommendation {
  assetId: string
  reason: string
  layoutRisk: string
  strategy?: 'crop' | 'pad'
  adaptation?: string
}

export interface Feedback {
  constraints: string[]
  summary: string
}

export function validateFocus(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
    ? value : 0.5
}

export function cropRect(width: number, height: number, ratio: number, x: number, y: number) {
  if (![width, height, ratio].every(value => Number.isFinite(value) && value > 0)) {
    throw new Error('Crop needs positive image dimensions and aspect ratio.')
  }
  const cropWidth = Math.min(width, height * ratio)
  const cropHeight = Math.min(height, width / ratio)
  return {
    x: Math.max(0, Math.min(width - cropWidth, width * validateFocus(x) - cropWidth / 2)),
    y: Math.max(0, Math.min(height - cropHeight, height * validateFocus(y) - cropHeight / 2)),
    width: cropWidth,
    height: cropHeight,
  }
}

const stopWords = new Set('a an and are as at be but by can for from in into is it of on or our show that the their this to use with'.split(' '))

function words(value: string) {
  return new Set((value.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [])
    .map(word => word.length > 4 ? word.replace(/s$/, '') : word)
    .filter(word => !stopWords.has(word)))
}

export function shortlist(assets: Asset[], brief: string, constraints: string[], rejected: Set<string>) {
  const query = words(brief)
  const refinements = words(constraints.join(' '))
  const candidates = assets.flatMap(asset => {
    if (!asset.metadata || !asset.preview || rejected.has(asset.id)) return []
    const metadata = asset.metadata
    const primary = words([metadata.category, metadata.caption, metadata.subject].join(' '))
    const context = words([metadata.visualStyle, metadata.composition, metadata.negativeSpace, metadata.suggestedUsage].join(' '))
    let score = 0
    for (const term of query) score += primary.has(term) ? 2 : Number(context.has(term))
    for (const term of refinements) score += primary.has(term) || context.has(term) ? 2 : 0
    return [{ asset, score }]
  })
  return candidates.sort((left, right) =>
    right.score - left.score || left.asset.path.localeCompare(right.asset.path)
  ).slice(0, 12).map(({ asset }) => asset)
}

export function changedRecommendations(before: Recommendation[], after: Recommendation[]) {
  const previous = new Map(before.map(({ assetId }, index) => [assetId, index + 1]))
  return after.map(({ assetId }, index) => {
    const rank = previous.get(assetId)
    if (rank === undefined) return 'New recommendation'
    return rank === index + 1 ? 'Same position' : `Moved from #${rank} to #${index + 1}`
  })
}
