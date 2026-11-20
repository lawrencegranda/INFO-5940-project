import { cropRect, validateFocus } from './core.ts'

export const formats = [
  { id: 'ig-feed-square', platform: 'instagram', label: 'Instagram Feed · Square', width: 1080, height: 1080 },
  { id: 'ig-feed-portrait', platform: 'instagram', label: 'Instagram Feed · Portrait', width: 1080, height: 1350 },
  { id: 'ig-story', platform: 'instagram', label: 'Instagram Stories', width: 1080, height: 1920 },
  { id: 'fb-feed-landscape', platform: 'facebook', label: 'Facebook Feed · Landscape', width: 1200, height: 630 },
  { id: 'fb-feed-square', platform: 'facebook', label: 'Facebook Feed · Square', width: 1080, height: 1080 },
  { id: 'x-landscape', platform: 'x', label: 'X / Twitter · Landscape post', width: 1600, height: 900 },
  { id: 'slides-wide', platform: 'slides', label: 'Google Slides · Widescreen', width: 1920, height: 1080 },
  { id: 'slides-standard', platform: 'slides', label: 'Google Slides · Standard', width: 1600, height: 1200 },
] as const

export type FormatId = typeof formats[number]['id']
export type Platform = typeof formats[number]['platform']
export type Strategy = 'crop' | 'pad'
export type Side = 'left' | 'right' | 'top' | 'bottom' | 'unspecified'
export interface Size { width: number; height: number }
export interface Rect extends Size { x: number; y: number }
export interface Output extends Size { label: string; id: FormatId }
export interface Campaign {
  platform: Platform | 'unspecified'
  placement: FormatId | ''
  purpose: string
  audience: string
  visualPreferences: string[]
  layoutConstraints: string[]
  headlineSide: Side
  clarification: string
}
export interface CampaignTarget {
  intent: Campaign
  output: Output
  slideLayout?: string
}

export function validOutput(width: number, height: number) {
  return [width, height].every(value => Number.isInteger(value) && value >= 64 && value <= 4096)
}

export function formatById(id: string) {
  return formats.find(format => format.id === id)
}

export function placementDecision(brief: string, intent: Campaign) {
  const mentioned: Platform[] = []
  if (/\binstagram\b|\big[ -]+(?:feed|story|stories|post|reel)\b/i.test(brief)) mentioned.push('instagram')
  if (/\bfacebook\b|\bfb[ -]+(?:feed|post)\b/i.test(brief)) mentioned.push('facebook')
  if (/\btwitter\b|\b(?:on|for) X\b|\bX (?:feed|post|landscape|\/)/.test(brief) || /\btwitter\b/i.test(brief)) mentioned.push('x')
  if (/\bgoogle slides\b/i.test(brief)) mentioned.push('slides')

  if (!mentioned.length) {
    // A generic slide still supports the original metadata-based recommendation flow.
    if (/\b(?:[149]\s*:\s*(?:1|3|5|16)|16\s*:\s*9)\b/.test(brief)) {
      return { choices: formats, question: 'Which platform and placement is this aspect ratio for?' }
    }
    return {}
  }
  if (mentioned.length > 1) return { choices: formats, question: 'Which platform should this version be made for?' }

  const platform = mentioned[0]
  const format = formatById(intent.placement)
  const square = /\b(square|1\s*:\s*1)\b/i.test(brief)
  const portrait = /\b(portrait|4\s*:\s*5)\b/i.test(brief)
  const landscape = /\b(landscape|widescreen|16\s*:\s*9|1\.91\s*:\s*1)\b/i.test(brief)
  const standard = /\b(standard|4\s*:\s*3)\b/i.test(brief)
  const feed = /\bfeed\b/i.test(brief)
  const story = /\b(?:instagram|ig)[ -]+(?:story|stories)\b|\b(?:story|stories) (?:on|for) instagram\b|\b9\s*:\s*16\b/i.test(brief)
  const expected = platform === 'instagram'
    ? story && !feed ? 'ig-story' : !story && square !== portrait ? square ? 'ig-feed-square' : 'ig-feed-portrait' : ''
    : platform === 'facebook'
      ? square !== landscape ? square ? 'fb-feed-square' : 'fb-feed-landscape' : ''
      : platform === 'x' ? landscape ? 'x-landscape' : ''
        : standard !== landscape ? standard ? 'slides-standard' : 'slides-wide' : ''
  if (expected && format?.id === expected && intent.platform === platform) return { format }
  const choices = formats.filter(item => item.platform === platform && !(platform === 'instagram' && feed && item.id === 'ig-story' && !story))
  return { choices, question: intent.clarification || 'Which placement and shape should the image fit?' }
}

export function slideOutput(page: Size): Output {
  const max = Math.max(page.width, page.height)
  if (max <= 0 || ![page.width, page.height].every(value => Number.isFinite(value) && value > 0)) {
    return { ...formats[6] }
  }
  return {
    id: 'slides-wide',
    label: 'Google Slides · Deck size',
    width: Math.max(64, Math.round(1920 * page.width / max)),
    height: Math.max(64, Math.round(1920 * page.height / max)),
  }
}

export function frameGeometry(source: Size, output: Size, mode: Strategy, x: number, y: number, zoom: number, side: Side = 'unspecified') {
  if (!validOutput(output.width, output.height) ||
      ![source.width, source.height].every(value => Number.isFinite(value) && value > 0)) {
    throw new Error('The image and output need valid dimensions.')
  }
  if (mode === 'crop') {
    const base = cropRect(source.width, source.height, output.width / output.height, x, y)
    const factor = Number.isFinite(zoom) ? Math.min(3, Math.max(1, zoom)) : 1
    const width = base.width / factor
    const height = base.height / factor
    return {
      source: {
        x: Math.max(0, Math.min(source.width - width, source.width * validateFocus(x) - width / 2)),
        y: Math.max(0, Math.min(source.height - height, source.height * validateFocus(y) - height / 2)),
        width, height,
      },
      dest: { x: 0, y: 0, ...output },
    }
  }
  const inset = side === 'left' || side === 'right' ? output.width * 0.25 : 0
  const topInset = side === 'top' || side === 'bottom' ? output.height * 0.25 : 0
  const available = { width: output.width - inset, height: output.height - topInset }
  const scale = Math.min(available.width / source.width, available.height / source.height)
  const width = source.width * scale
  const height = source.height * scale
  return {
    source: { x: 0, y: 0, width: source.width, height: source.height },
    dest: {
      x: (side === 'left' ? inset : 0) + (available.width - width) * (1 - validateFocus(x)),
      y: (side === 'top' ? topInset : 0) + (available.height - height) * (1 - validateFocus(y)),
      width, height,
    },
  }
}

export function subjectCoverage(frame: Rect, subject: Rect) {
  const width = Math.max(0, Math.min(frame.x + frame.width, subject.x + subject.width) - Math.max(frame.x, subject.x))
  const height = Math.max(0, Math.min(frame.y + frame.height, subject.y + subject.height) - Math.max(frame.y, subject.y))
  return width * height / (subject.width * subject.height)
}
