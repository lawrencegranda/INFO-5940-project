import { frameGeometry, subjectCoverage } from './campaign.ts'
import type { Rect, Side, Size, Strategy } from './campaign.ts'
import { renderFrame } from './images.ts'
import type { Asset } from './core.ts'

export function connectFraming() {
  const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
  const canvas = get<HTMLCanvasElement>('crop')
  const sourceCanvas = get<HTMLCanvasElement>('source-frame')
  const notice = get('crop-info')
  const mode = get<HTMLSelectElement>('adaptation')
  const x = get<HTMLInputElement>('frame-x')
  const y = get<HTMLInputElement>('frame-y')
  const zoom = get<HTMLInputElement>('frame-zoom')
  const download = get<HTMLButtonElement>('download-crop')
  const modelFocus = get<HTMLButtonElement>('model-focus')

  let bitmap: ImageBitmap | undefined
  let asset: Asset | undefined
  let output: Size & { label: string }
  let side: Side = 'unspecified'
  let generation = 0
  let subject: Rect | undefined
  let start: { x: number; y: number } | undefined

  function paint() {
    if (!bitmap || !asset) return
    const activeMode: Strategy = mode.value === 'pad' ? 'pad' : 'crop'
    const frame = frameGeometry(bitmap, output, activeMode, Number(x.value) / 100, Number(y.value) / 100, Number(zoom.value) / 100, side)
    renderFrame(bitmap, canvas, output, frame)
    zoom.disabled = activeMode === 'pad'
    const width = Math.round(frame.source.width)
    const height = Math.round(frame.source.height)
    const scaleUp = frame.dest.width > frame.source.width + .5 || frame.dest.height > frame.source.height + .5
    notice.textContent = `${output.label} · ${output.width} × ${output.height} px. Source frame ${width} × ${height} px.`
    if (activeMode === 'pad' && side !== 'unspecified') notice.textContent += ` Reserved ${side} headline space.`
    if (subject) notice.textContent += ` Marked subject retained ${Math.round(100 * subjectCoverage(frame.source, subject))}%.`
    if (scaleUp) notice.textContent += ' This frame uses upscaling.'
    if (!asset.source) notice.textContent += ' Cached preview. Reselect the source folder for full-resolution output.'
    download.disabled = !asset.source

    const scale = Math.min(440 / bitmap.width, 280 / bitmap.height, 1)
    sourceCanvas.width = Math.max(1, Math.round(bitmap.width * scale))
    sourceCanvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = sourceCanvas.getContext('2d')
    if (!context) return
    context.drawImage(bitmap, 0, 0, sourceCanvas.width, sourceCanvas.height)
    const drawBox = (rect: Rect, color: string) => {
      context.strokeStyle = color
      context.lineWidth = 2
      context.strokeRect(rect.x * scale, rect.y * scale, rect.width * scale, rect.height * scale)
    }
    drawBox(frame.source, '#ffffff')
    if (subject) drawBox(subject, '#ffbd4a')
  }

  function clearBitmap() {
    bitmap?.close()
    bitmap = undefined
    canvas.width = 0
    canvas.height = 0
    sourceCanvas.width = 0
    sourceCanvas.height = 0
    download.disabled = true
  }

  function center() {
    x.value = y.value = '50'
    zoom.value = '100'
    paint()
  }

  function point(event: PointerEvent) {
    const bounds = sourceCanvas.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) * bitmap!.width,
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) * bitmap!.height,
    }
  }

  mode.addEventListener('change', paint)
  for (const input of [x, y, zoom]) input.addEventListener('input', paint)
  get('reset-frame').addEventListener('click', center)
  modelFocus.addEventListener('click', () => {
    if (!asset?.metadata) return
    mode.value = 'crop'
    x.value = String(asset.metadata.focusX * 100)
    y.value = String(asset.metadata.focusY * 100)
    paint()
  })
  sourceCanvas.addEventListener('pointerdown', event => {
    if (!bitmap) return
    sourceCanvas.setPointerCapture(event.pointerId)
    start = point(event)
  })
  sourceCanvas.addEventListener('pointerup', event => {
    if (!bitmap || !start) return
    const end = point(event)
    const width = Math.abs(start.x - end.x)
    const height = Math.abs(start.y - end.y)
    subject = width > 2 && height > 2
      ? { x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), width, height }
      : undefined
    start = undefined
    paint()
  })
  sourceCanvas.addEventListener('pointercancel', () => { start = undefined })
  download.addEventListener('click', () => {
    if (!bitmap || !asset?.source) return
    const name = asset.name.replace(/\.[^.]+$/, '')
    const { width, height } = output
    canvas.toBlob(blob => {
      if (!blob) { notice.textContent = 'Could not encode the PNG.'; return }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${name}-${width}x${height}.png`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 30_000)
    }, 'image/png')
  })

  return {
    async open(selected: Asset, target: Size & { label: string }, strategy: Strategy, headlineSide: Side) {
      const request = ++generation
      clearBitmap()
      asset = selected
      output = target
      side = headlineSide
      subject = start = undefined
      x.value = y.value = '50'
      zoom.value = '100'
      mode.value = strategy
      modelFocus.disabled = !selected.metadata
      const input = selected.source || selected.preview
      if (!input) return
      notice.textContent = 'Opening image…'
      try {
        const image = await createImageBitmap(input)
        if (generation !== request) { image.close(); return }
        bitmap = image
        paint()
      } catch (error) {
        if (generation === request) notice.textContent = error instanceof Error ? error.message : 'Could not open image.'
      }
    },
    setOutput(target: Size & { label: string }) {
      output = target
      paint()
    },
    close() {
      generation++
      asset = undefined
      clearBitmap()
    },
  }
}
