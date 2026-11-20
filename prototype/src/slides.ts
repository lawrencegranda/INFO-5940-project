import type { Rect, Size } from './campaign.ts'

export const slidesScope = 'https://www.googleapis.com/auth/presentations.readonly'
export const slidesOrigin = 'https://slides.googleapis.com'

const idPattern = /^[A-Za-z0-9_-]{1,200}$/

export function parseSlidesUrl(value: string) {
  try {
    const url = new URL(value.trim())
    if (url.origin !== 'https://docs.google.com' || url.username || url.password) return
    const id = url.pathname.match(/^\/presentation\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]+)(?:\/(?:edit|view|present)(?:\/|$)|\/?$)/)?.[1]
    if (!id || !idPattern.test(id)) return
    const fragment = new URLSearchParams(url.hash.slice(1)).get('slide')?.replace(/^id\./, '')
    return { id, hintedPage: fragment && idPattern.test(fragment) ? fragment : undefined }
  } catch {
    return
  }
}

export function pickPage(pages: string[], hintedPage?: string) {
  if (hintedPage && pages.includes(hintedPage)) return { id: hintedPage, matched: true }
  return { id: pages[0] ?? '', matched: false }
}

interface Dimension { magnitude?: number; unit?: 'PT' | 'EMU' }
interface GoogleSize { width?: Dimension; height?: Dimension }
interface Transform {
  scaleX?: number; scaleY?: number; shearX?: number; shearY?: number
  translateX?: number; translateY?: number; unit?: 'PT' | 'EMU'
}
interface TextContent { textElements?: { textRun?: { content?: string }; autoText?: { content?: string } }[] }
interface PageElement {
  objectId?: string
  title?: string
  description?: string
  size?: GoogleSize
  transform?: Transform
  shape?: { text?: TextContent }
  table?: { tableRows?: { tableCells?: { text?: TextContent }[] }[] }
  wordArt?: { renderedText?: string }
  image?: unknown
  elementGroup?: { children?: PageElement[] }
}

export interface SlideItem {
  id: string
  kind: 'text' | 'image'
  text: string
  bounds?: Rect
}

export interface Deck {
  id: string
  title: string
  pageSize: Size
  pages: string[]
}

export interface Slide {
  id: string
  items: SlideItem[]
  text: string
}

function toPoints(value = 0, unit?: string) {
  return unit === 'EMU' ? value / 12700 : value
}

function sizeInPoints(size?: GoogleSize): Size {
  return {
    width: toPoints(size?.width?.magnitude, size?.width?.unit),
    height: toPoints(size?.height?.magnitude, size?.height?.unit),
  }
}

type Matrix = [number, number, number, number, number, number]
const identity: Matrix = [1, 0, 0, 1, 0, 0]

function matrix(transform?: Transform): Matrix {
  if (!transform) return identity
  return [
    transform.scaleX ?? 0, transform.shearY ?? 0, transform.shearX ?? 0, transform.scaleY ?? 0,
    toPoints(transform.translateX, transform.unit), toPoints(transform.translateY, transform.unit),
  ]
}

function multiply([a, b, c, d, tx, ty]: Matrix, [e, f, g, h, ux, uy]: Matrix): Matrix {
  return [a * e + c * f, b * e + d * f, a * g + c * h, b * g + d * h, a * ux + c * uy + tx, b * ux + d * uy + ty]
}

function boundsOf(size: Size, [a, b, c, d, tx, ty]: Matrix) {
  if (size.width <= 0 || size.height <= 0) return
  const xs = [tx, a * size.width + tx, c * size.height + tx, a * size.width + c * size.height + tx]
  const ys = [ty, b * size.width + ty, d * size.height + ty, b * size.width + d * size.height + ty]
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  const width = Math.max(...xs) - x
  const height = Math.max(...ys) - y
  if ([x, y, width, height].every(Number.isFinite) && width > 0 && height > 0) return { x, y, width, height }
}

function textContent(item?: TextContent) {
  return (item?.textElements ?? []).map(value => value.textRun?.content ?? value.autoText?.content ?? '').join('').trim()
}

export function parsePage(id: string, raw: { pageElements?: PageElement[] }): Slide {
  const items: SlideItem[] = []
  function visit(elements: PageElement[], parent: Matrix) {
    for (const element of elements) {
      const transform = multiply(parent, matrix(element.transform))
      if (element.elementGroup) {
        visit(element.elementGroup.children ?? [], transform)
        continue
      }
      const text = element.shape ? textContent(element.shape.text)
        : element.table ? (element.table.tableRows ?? []).map(row =>
          (row.tableCells ?? []).map(cell => textContent(cell.text)).filter(Boolean).join(' | ')
        ).filter(Boolean).join('\n')
        : element.wordArt?.renderedText?.trim() ?? ''
      const bounds = boundsOf(sizeInPoints(element.size), transform)
      if (text) items.push({ id: element.objectId ?? '', kind: 'text', text, bounds })
      if (element.image) items.push({
        id: element.objectId ?? '', kind: 'image',
        text: [element.title, element.description].filter(Boolean).join(' · '), bounds,
      })
    }
  }
  visit(raw.pageElements ?? [], identity)
  return { id, items, text: items.filter(item => item.kind === 'text').map(item => item.text).join('\n\n') }
}

export function describeBounds(bounds: Rect | undefined, page: Size) {
  if (!bounds || page.width <= 0 || page.height <= 0) return ''
  const pc = (value: number, axis: number) => Math.round(100 * value / axis)
  return `x ${pc(bounds.x, page.width)}%, y ${pc(bounds.y, page.height)}%, width ${pc(bounds.width, page.width)}%, height ${pc(bounds.height, page.height)}%`
}

export function describeSlide(slide: Slide, page: Size) {
  return slide.items.slice(0, 12).map(item =>
    `${item.kind}: ${item.text.replace(/\s+/g, ' ').slice(0, 110)}${item.bounds ? ` (${describeBounds(item.bounds, page)})` : ''}`
  ).join('; ').slice(0, 1200)
}

async function get<T>(path: string, token: string, fields: string, fetcher: typeof fetch): Promise<T> {
  const response = await fetcher(`${slidesOrigin}/v1/presentations/${path}?fields=${encodeURIComponent(fields)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    credentials: 'omit',
    redirect: 'error',
    referrerPolicy: 'no-referrer',
    signal: AbortSignal.timeout(15_000),
  })
  if (response.ok) return await response.json() as T
  const payload = await response.json().catch(() => ({}))
  const message = typeof payload?.error?.message === 'string' ? payload.error.message.slice(0, 300) : ''
  const hint = response.status === 403 ? ' Check deck access, OAuth consent, and whether the Slides API is enabled.' : ''
  throw new SlidesError(response.status, `Slides API HTTP ${response.status}.${hint}${message ? ` ${message}` : ''}`)
}

export class SlidesError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function readDeck(id: string, token: string, fetcher = fetch): Promise<Deck> {
  if (!idPattern.test(id)) throw new Error('Invalid presentation ID.')
  const data = await get<{ title?: string; pageSize?: GoogleSize; slides?: { objectId?: string }[] }>(
    id, token, 'title,pageSize,slides(objectId)', fetcher,
  )
  return {
    id, title: data.title || 'Untitled presentation', pageSize: sizeInPoints(data.pageSize),
    pages: (data.slides ?? []).flatMap(page => page.objectId && idPattern.test(page.objectId) ? [page.objectId] : []),
  }
}

export async function readPage(id: string, page: string, token: string, fetcher = fetch): Promise<Slide> {
  if (!idPattern.test(id) || !idPattern.test(page)) throw new Error('Invalid presentation or slide ID.')
  const data = await get<{ pageElements?: PageElement[] }>(
    `${id}/pages/${page}`, token, 'pageElements(objectId,title,description,size,transform,shape(text),image(imageProperties),table(tableRows(tableCells(text)),rows,columns),wordArt,elementGroup)', fetcher,
  )
  return parsePage(page, data)
}
