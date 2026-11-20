function canvasAt(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable.')
  return { canvas, context }
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Image encoding failed.')), type, quality)
  })
}

export async function previewFrom(file: Blob, maxEdge: number, quality = 0.85) {
  const image = await createImageBitmap(file)
  try {
    const { width, height } = image
    if (width < 1 || height < 1) throw new Error('Image dimensions are invalid.')
    const scale = Math.min(maxEdge / Math.max(width, height), 1)
    const { canvas, context } = canvasAt(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)))
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return { blob: await encode(canvas, 'image/jpeg', quality), width, height }
  } finally {
    image.close()
  }
}

export async function imageForModel(preview: Blob) {
  const { blob } = await previewFrom(preview, 512, 0.78)
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not encode model input.'))
    reader.onload = () => resolve(String(reader.result).split(',', 2)[1])
    reader.readAsDataURL(blob)
  })
}

export function renderFrame(
  source: CanvasImageSource, canvas: HTMLCanvasElement,
  output: { width: number; height: number },
  frame: {
    source: { x: number; y: number; width: number; height: number }
    dest: { x: number; y: number; width: number; height: number }
  },
) {
  if (canvas.width !== output.width) canvas.width = output.width
  if (canvas.height !== output.height) canvas.height = output.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable.')
  const { source: src, dest } = frame
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(source, src.x, src.y, src.width, src.height, dest.x, dest.y, dest.width, dest.height)
}
