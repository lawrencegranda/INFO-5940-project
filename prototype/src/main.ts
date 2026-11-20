import './style.css'
import { changedRecommendations, metadataFields, ratios, scenarios, shortlist } from './core.ts'
import type { Asset, Recommendation } from './core.ts'
import { imageForModel, previewFrom } from './images.ts'
import { connectFraming } from './framing.ts'
import { connectSlides } from './slides-panel.ts'
import { formatById, formats, placementDecision, validOutput } from './campaign.ts'
import type { Campaign, CampaignTarget, Output, Size, Strategy } from './campaign.ts'
import { loadLibrary, replaceLibrary, saveAsset } from './library.ts'
import { analyze, interpretCampaign, interpretFeedback, listVisionModels, preferredModel, rerank } from './ollama.ts'

function element<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T
}
function node<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string) {
  const result = document.createElement(tag)
  if (text) result.textContent = text
  if (className) result.className = className
  return result
}

const connection = element('connection')
const model = element<HTMLSelectElement>('model')
const choose = element<HTMLButtonElement>('choose')
const connect = element<HTMLButtonElement>('connect')
const folderInput = element<HTMLInputElement>('folder')
const index = element<HTMLButtonElement>('index')
const stop = element<HTMLButtonElement>('stop')
const scenario = element<HTMLSelectElement>('scenario')
const brief = element<HTMLTextAreaElement>('brief')
const find = element<HTMLButtonElement>('find')
const feedbackForm = element<HTMLFormElement>('feedback-form')
const feedbackInput = element<HTMLTextAreaElement>('feedback')
const status = element('status')
const progress = element<HTMLProgressElement>('index-progress')
const indexLabel = element('index-label')
const recommendTab = element('recommend')
const libraryTab = element('library')
const recommendationList = element('recommendations')
const inspector = element('inspector')
const assetInfo = element('asset-info')
const framing = connectFraming()
const placement = element<HTMLSelectElement>('placement')
const outputWidth = element<HTMLInputElement>('output-width')
const outputHeight = element<HTMLInputElement>('output-height')
const campaignPlan = element('campaign-plan')
const overrides = new Map<string, Size>()
for (const format of formats) {
  placement.append(new Option(format.label, format.id))
  const saved = localStorage.getItem(`format:${format.id}`)?.split('x').map(Number)
  if (saved && validOutput(saved[0], saved[1])) overrides.set(format.id, { width: saved[0], height: saved[1] })
}
const thumbnailUrls = new Map<string, string>()

let assets: Asset[] = []
let folder = ''
let busy = ''
let connected = false
let controller: AbortController | undefined
let selected: Asset | undefined
let selectedRatio = 0
let recommendationFrame = false
let target: CampaignTarget | undefined
let linkedSlide: { output: Output; layout: string } | undefined
let planCache: { brief: string; intent: Campaign } | undefined
let skipped: { name: string; reason: string }[] = []
let recommendations: Recommendation[] = []
let rejected = new Set<string>()
let constraints: string[] = []
let feedbackAsset: Asset | undefined

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
function notice(text = '', error = false) {
  status.textContent = text
  status.hidden = !text
  status.dataset.error = String(error)
}
function seconds(ms: number) {
  return `${(ms / 1000).toFixed(1)} s`
}
function thumbnail(asset: Asset) {
  if (!asset.preview) return node('div', 'Preview unavailable', 'photo-fallback')
  let url = thumbnailUrls.get(asset.id)
  if (!url) {
    url = URL.createObjectURL(asset.preview)
    thumbnailUrls.set(asset.id, url)
  }
  const image = node('img')
  image.src = url
  image.alt = asset.metadata?.caption ?? asset.name
  image.loading = 'lazy'
  return image
}
function action(label: string, onClick: () => void, className = 'secondary') {
  const button = node('button', label, className)
  button.type = 'button'
  button.addEventListener('click', onClick)
  return button
}
function show(tab: 'recommend' | 'library') {
  const libraryVisible = tab === 'library'
  recommendTab.hidden = libraryVisible
  libraryTab.hidden = !libraryVisible
  element('show-library').setAttribute('aria-pressed', String(libraryVisible))
  element('show-recommend').setAttribute('aria-pressed', String(!libraryVisible))
}
function pending() {
  return assets.filter(asset => asset.preview && (!asset.metadata || asset.model !== model.value))
}
function updateControls() {
  const working = Boolean(busy)
  element('clear-slide').hidden = !linkedSlide
  element<HTMLButtonElement>('clear-slide').disabled = working
  const indexed = assets.filter(asset => asset.metadata).length
  element('folder-label').textContent = folder || 'Local image library'
  element('library-count').textContent = assets.length ? `${indexed} of ${assets.length} indexed` : '0 images indexed'
  const failed = assets.filter(asset => asset.error).length
  element('library-detail').textContent = assets.length
    ? `${assets.length} images${failed ? ` · ${failed} with errors` : ''}`
    : 'Choose a folder with JPEG, PNG, or WebP photos.'
  choose.disabled = connect.disabled = working
  scenario.disabled = brief.disabled = placement.disabled = outputWidth.disabled = outputHeight.disabled = working
  model.disabled = true
  index.disabled = working || !connected || !pending().length
  stop.hidden = busy !== 'index'
  find.disabled = working || !connected || !brief.value.trim() || !indexed
  feedbackInput.disabled = working
  element<HTMLButtonElement>('apply-feedback').disabled = working
  element<HTMLButtonElement>('cancel-feedback').disabled = working
  element('recommend-hint').textContent = indexed
    ? 'Search uses your indexed images and the current brief.'
    : 'Choose a folder and index its images to get recommendations.'
  for (const button of recommendationList.querySelectorAll<HTMLButtonElement>('button[data-refine]')) button.disabled = working
}
function setBusy(task: string) {
  busy = task
  updateControls()
}
function renderGallery() {
  const gallery = element('gallery')
  gallery.replaceChildren(...assets.map(asset => {
    const item = node('li')
    item.dataset.assetId = asset.id
    const button = action('', () => inspect(asset), '')
    const title = node('span', asset.name)
    title.title = asset.path
    const label = node('small', asset.error ? 'Indexing error' : asset.metadata ? 'Indexed' : 'Ready to index')
    label.dataset.error = String(Boolean(asset.error))
    button.append(thumbnail(asset), title, label)
    item.append(button)
    return item
  }))
  updateControls()
}
function renderResults(changes: string[] = []) {
  recommendationList.replaceChildren()
  if (!recommendations.length) {
    updateControls()
    return
  }
  recommendationList.append(node('h2', 'Recommendations'))
  for (const item of skipped) recommendationList.append(node('p', `Used another asset instead of ${item.name}. ${item.reason}`, 'hint'))
  recommendations.forEach(({ assetId, reason, layoutRisk, strategy, adaptation }, rank) => {
    const asset = assets.find(item => item.id === assetId)!
    const card = node('article', undefined, 'recommendation')
    card.dataset.assetId = assetId
    const copy = node('div', undefined, 'rec-copy')
    if (changes[rank]) copy.append(node('div', changes[rank], 'change'))
    copy.append(node('h3', `${rank + 1}. ${asset.name}`), node('p', reason), node('p', `Layout risk: ${layoutRisk}`, 'risk'))
    if (strategy && adaptation) {
      card.dataset.strategy = strategy
      copy.append(node('p', `${strategy === 'pad' ? 'Pad to fit' : 'Crop to fill'}. ${adaptation}`, 'adaptation-note'))
    }
    const actions = node('div', undefined, 'actions')
    const refine = action('Reject & refine', () => {
      feedbackAsset = asset
      element('feedback-asset').textContent = `Replacing ${asset.name}`
      feedbackInput.value = ''
      feedbackForm.hidden = false
      feedbackInput.focus()
    })
    refine.dataset.refine = 'true'
    actions.append(action('Preview crop', () => inspect(asset, strategy ?? 'crop', true)), refine)
    copy.append(actions)
    card.append(thumbnail(asset), copy)
    recommendationList.append(card)
  })
  updateControls()
}
function resetSearch() {
  recommendations = []
  skipped = []
  target = undefined
  campaignPlan.replaceChildren()
  campaignPlan.hidden = true
  rejected = new Set()
  constraints = []
  feedbackAsset = undefined
  feedbackForm.hidden = true
  const note = element('constraints')
  note.replaceChildren()
  note.hidden = true
  renderResults()
}
function applyConstraints(summary: string, rejectedAsset: Asset, previous: Recommendation[]) {
  const note = element('constraints')
  const removed = previous.filter(item => !recommendations.some(rec => rec.assetId === item.assetId)).map(item =>
    assets.find(asset => asset.id === item.assetId)?.name
  ).filter(Boolean)
  const list = node('ul')
  for (const constraint of constraints) list.append(node('li', constraint))
  note.replaceChildren(
    node('strong', 'Updated criteria'),
    node('p', summary),
    list,
    node('p', `Rejected ${rejectedAsset.name}.`),
  )
  if (removed.length) note.append(node('p', `Removed from the shortlist: ${removed.join(', ')}.`))
  note.hidden = false
}
function renderInspector() {
  if (!selected) {
    inspector.hidden = true
    return
  }
  const asset = selected
  inspector.hidden = false
  element('asset-name').textContent = asset.name
  assetInfo.replaceChildren()
  if (asset.preview) assetInfo.append(node('p', `${asset.width} × ${asset.height} px`, 'hint'))
  if (asset.metadata) {
    const metadata = asset.metadata
    const details = node('dl', undefined, 'asset-metadata')
    for (const [name, label] of Object.entries(metadataFields)) {
      details.append(node('dt', label), node('dd', metadata[name as keyof typeof metadataFields]))
    }
    assetInfo.append(details)
  }
  if (asset.error) assetInfo.append(node('p', asset.error, 'hint'))
  element('crop-panel').hidden = !asset.preview
  renderRatios()
}

function renderRatios() {
  const choices: (Size & { label: string })[] = target ? [target.output, ...ratios] : [...ratios]
  const active = recommendationFrame && target ? 0 : selectedRatio + Number(Boolean(target))
  const controls = element('ratios')
  controls.replaceChildren(...choices.map(({ label }, i) => {
    const button = action(i === 0 && target ? 'Campaign format' : label, () => {
      recommendationFrame = Boolean(target && i === 0)
      if (!recommendationFrame) selectedRatio = i - Number(Boolean(target))
      framing.setOutput(choices[i])
      renderRatios()
      controls.querySelectorAll('button')[i]?.focus()
    })
    button.setAttribute('aria-pressed', String(i === active))
    return button
  }))
}

function inspect(asset: Asset, strategy: Strategy = 'crop', campaign = false) {
  selected = asset
  selectedRatio = 0
  recommendationFrame = campaign
  renderInspector()
  void framing.open(asset, (campaign && target?.output) || ratios[0], strategy, campaign ? target?.intent.headlineSide ?? 'unspecified' : 'unspecified')
  inspector.scrollIntoView({ block: 'start' })
}

function closeInspector() {
  selected = undefined
  framing.close()
  renderInspector()
}

function showOutput(output?: Size) {
  element('output-settings').hidden = !output
  outputWidth.value = output ? String(output.width) : ''
  outputHeight.value = output ? String(output.height) : ''
}

function selectPlacement(id: string) {
  placement.value = id
  const configured = formatById(id)
  showOutput(configured && (overrides.get(configured.id) ?? configured))
}

function describePlan(intent: Campaign, output?: Output, choices: readonly (typeof formats)[number][] = [], question?: string) {
  campaignPlan.hidden = false
  campaignPlan.replaceChildren(node('strong', output ? `${output.label} · ${output.width} × ${output.height}` : 'Interpreted brief'))
  const summaries = [
    ['Purpose', intent.purpose],
    ['Audience', intent.audience],
    ['Visual preferences', intent.visualPreferences.join('; ')],
    ['Layout', intent.layoutConstraints.join('; ')],
  ]
  for (const [label, value] of summaries) if (value) campaignPlan.append(node('p', `${label}: ${value}`))
  if (question) {
    campaignPlan.append(node('p', question))
    const actions = node('div', undefined, 'actions')
    for (const choice of choices) actions.append(action(choice.label, () => {
      selectPlacement(choice.id)
      resetSearch()
      closeInspector()
      void getRecommendations()
    }))
    campaignPlan.append(actions)
  }
}

function retrievalTerms(intent?: Campaign) {
  return intent ? [intent.purpose, intent.audience, ...intent.visualPreferences, ...intent.layoutConstraints].join(' ') : ''
}

async function checkConnection() {
  if (busy) return
  setBusy('connect')
  connection.textContent = 'Checking Ollama'
  connection.dataset.online = 'false'
  try {
    const models = await listVisionModels()
    connected = models.includes(preferredModel)
    model.replaceChildren(new Option(preferredModel, preferredModel))
    connection.textContent = connected ? 'Ollama connected' : 'No vision model'
    connection.dataset.online = String(connected)
    if (!connected) notice('Ollama is running. The installed qwen3-vl:8b-instruct vision model was not found.', true)
    else notice()
  } catch (error) {
    connected = false
    connection.textContent = 'Ollama offline'
    notice(errorMessage(error), true)
  } finally {
    setBusy('')
  }
}
async function importFolder(files: File[]) {
  const images = files.filter(file => /\.(jpe?g|png|webp)$/i.test(file.name))
    .sort((a, b) => (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name))
  if (!images.length) {
    notice('No supported images found. Choose a folder with JPEG, PNG, or WebP files.', true)
    return
  }
  const nextFolder = images[0].webkitRelativePath.split('/')[0] || 'Selected images'
  const previous = new Map(assets.map(asset => [asset.id, asset]))
  setBusy('import')
  show('library')
  try {
    const next: Asset[] = []
    for (const [i, file] of images.entries()) {
      notice(`Preparing thumbnails ${i + 1} of ${images.length}`)
      const path = file.webkitRelativePath || file.name
      const id = JSON.stringify([path, file.size, file.lastModified])
      const cached = previous.get(id)
      if (cached?.preview) {
        next.push({ ...cached, source: file })
        continue
      }
      const asset: Asset = { id, name: file.name, path, width: 0, height: 0 }
      try {
        const prepared = await previewFrom(file, 1280)
        Object.assign(asset, { width: prepared.width, height: prepared.height, preview: prepared.blob, source: file })
      } catch (error) {
        asset.error = `Could not read image. ${errorMessage(error)}`
      }
      next.push(asset)
    }
    await replaceLibrary(nextFolder, next)
    for (const url of thumbnailUrls.values()) URL.revokeObjectURL(url)
    thumbnailUrls.clear()
    assets = next
    folder = nextFolder
    resetSearch()
    closeInspector()
    element('progress-area').hidden = true
    renderGallery()
    const failures = assets.filter(asset => !asset.preview).length
    notice(failures ? `${failures} of ${assets.length} images could not be opened. Select an image to see its error.` : '')
  } catch (error) {
    notice(`Could not save the library. ${errorMessage(error)}`, true)
  } finally {
    setBusy('')
  }
}
async function indexImages() {
  const queue = pending()
  if (!queue.length || busy || !connected) return
  setBusy('index')
  notice()
  const activeModel = model.value
  controller = new AbortController()
  const signal = controller.signal
  let completed = 0
  let failures = 0
  const started = performance.now()
  element('progress-area').hidden = false
  progress.max = queue.length
  progress.value = 0
  try {
    for (const asset of queue) {
      if (signal.aborted) break
      indexLabel.textContent = `Analyzing ${completed + 1} of ${queue.length} · ${asset.name}`
      try {
        const { value, durationMs } = await analyze(activeModel, await imageForModel(asset.preview!), signal)
        Object.assign(asset, { metadata: value, model: activeModel, durationMs, error: undefined })
      } catch (error) {
        if (signal.aborted) break
        asset.error = errorMessage(error)
        failures++
      }
      await saveAsset(asset)
      progress.value = ++completed
      renderGallery()
      if (selected?.id === asset.id) renderInspector()
      // A failed connection will affect every image. Let the user retry after checking it.
      if (asset.error && /cannot reach|timed out|HTTP (403|404|503)/i.test(asset.error)) break
    }
    const summary = signal.aborted ? 'Indexing stopped' : 'Indexing finished'
    indexLabel.textContent = `${summary} · ${completed - failures} indexed · ${failures} errors · ${seconds(performance.now() - started)}`
    if (failures) notice('Select an image marked “Indexing error” for details. Index images again to retry.', true)
  } catch (error) {
    indexLabel.textContent = 'Indexing interrupted'
    notice(`Could not save metadata. ${errorMessage(error)}`, true)
  } finally {
    controller = undefined
    setBusy('')
  }
}

async function getRecommendations() {
  if (busy || !connected || !brief.value.trim()) return
  setBusy('recommend')
  notice('Reading the campaign brief…')
  try {
    const input = brief.value.trim()
    let planMs = 0
    if (planCache?.brief !== input) {
      const plan = await interpretCampaign(preferredModel, input)
      planCache = { brief: input, intent: plan.value }
      planMs = plan.durationMs
    }
    const intent = planCache.intent
    const manual = formatById(placement.value)
    let output: Output | undefined
    if (manual) {
      const width = outputWidth.valueAsNumber
      const height = outputHeight.valueAsNumber
      if (!validOutput(width, height)) throw new Error('Enter whole-number width and height between 64 and 4096 px.')
      output = { ...manual, width, height }
    } else if (linkedSlide) {
      output = linkedSlide.output
    } else {
      const decision = placementDecision(input, intent)
      if (decision.choices) {
        describePlan(intent, undefined, decision.choices, decision.question)
        notice('Choose an output format to find images.')
        return
      }
      if (decision.format) output = { ...decision.format, ...overrides.get(decision.format.id) }
    }
    const format = output && formatById(output.id)
    const resolvedIntent = format ? { ...intent, platform: format.platform, placement: format.id, clarification: '' } : intent
    target = output ? { intent: resolvedIntent, output, slideLayout: linkedSlide?.layout } : undefined
    describePlan(resolvedIntent, output)
    notice('Finding images for this brief…')
    const terms = `${input} ${retrievalTerms(intent)}`
    const result = await rerank(preferredModel, input, constraints, shortlist(assets, terms, constraints, rejected), target)
    recommendations = result.value
    skipped = result.skipped
    feedbackAsset = undefined
    feedbackForm.hidden = true
    renderResults()
    notice(`Found ${recommendations.length} recommendations · model ${seconds(result.durationMs + planMs)}`)
  } catch (error) {
    notice(errorMessage(error), true)
  } finally {
    setBusy('')
  }
}
async function refine() {
  const asset = feedbackAsset
  const response = feedbackInput.value.trim()
  if (!asset || !response || busy || !connected) return
  const previous = recommendations
  const nextRejected = new Set([...rejected, asset.id])
  setBusy('feedback')
  notice('Interpreting feedback…')
  try {
    const feedback = await interpretFeedback(preferredModel, brief.value.trim(), constraints, asset, response)
    const candidates = shortlist(assets, `${brief.value} ${retrievalTerms(planCache?.intent)}`, feedback.value.constraints, nextRejected)
    const result = candidates.length ? await rerank(preferredModel, brief.value.trim(), feedback.value.constraints, candidates, target) : { value: [], durationMs: 0, skipped: [] }
    constraints = feedback.value.constraints
    rejected = nextRejected
    recommendations = result.value
    skipped = result.skipped
    feedbackForm.hidden = true
    feedbackAsset = undefined
    applyConstraints(feedback.value.summary, asset, previous)
    renderResults(changedRecommendations(previous, recommendations))
    if (selected?.id === asset.id) closeInspector()
    notice(recommendations.length
      ? `Updated recommendations · feedback ${seconds(feedback.durationMs)} · rerank ${seconds(result.durationMs)}`
      : 'Feedback applied. The library has no remaining indexed candidates.')
  } catch (error) {
    notice(errorMessage(error), true)
  } finally {
    setBusy('')
  }
}

for (const [i, sample] of scenarios.entries()) scenario.append(new Option(sample.title, String(i)))
scenario.addEventListener('change', () => {
  brief.value = scenarios[Number.parseInt(scenario.value, 10)]?.text ?? ''
  linkedSlide = undefined
  selectPlacement('')
  resetSearch()
  closeInspector()
  notice()
})
brief.addEventListener('input', () => {
  scenario.value = ''
  resetSearch()
  closeInspector()
  notice()
})
choose.addEventListener('click', () => folderInput.click())
folderInput.addEventListener('change', () => {
  const files = Array.from(folderInput.files ?? [])
  folderInput.value = ''
  if (files.length && !busy) void importFolder(files)
})
element('show-library').addEventListener('click', () => {
  show('library')
  closeInspector()
})
element('show-recommend').addEventListener('click', () => {
  show('recommend')
  closeInspector()
})
placement.addEventListener('change', () => {
  selectPlacement(placement.value)
  resetSearch()
  closeInspector()
  notice()
})
for (const input of [outputWidth, outputHeight]) input.addEventListener('change', () => {
  const width = outputWidth.valueAsNumber
  const height = outputHeight.valueAsNumber
  if (placement.value && validOutput(width, height)) {
    overrides.set(placement.value, { width, height })
    localStorage.setItem(`format:${placement.value}`, `${width}x${height}`)
  }
  resetSearch()
  closeInspector()
  notice()
})
connect.addEventListener('click', () => void checkConnection())
find.addEventListener('click', () => void getRecommendations())
index.addEventListener('click', () => void indexImages())
stop.addEventListener('click', () => controller?.abort())
element('close-asset').addEventListener('click', closeInspector)
element('cancel-feedback').addEventListener('click', () => {
  feedbackAsset = undefined
  feedbackForm.hidden = true
})
feedbackForm.addEventListener('submit', event => {
  event.preventDefault()
  void refine()
})

async function start() {
  setBusy('load')
  try {
    const library = await loadLibrary()
    assets = library.assets
    folder = library.folder
    renderGallery()
  } catch (error) {
    notice(`Could not read the local library. ${errorMessage(error)}`, true)
  } finally {
    setBusy('')
  }
  await checkConnection()
}

element('clear-slide').addEventListener('click', () => {
  linkedSlide = undefined
  resetSearch()
  closeInspector()
  notice('Slides layout cleared. You can keep editing the brief.')
})

connectSlides(({ text, output, layout }) => {
  if (busy) return
  linkedSlide = { output, layout }
  scenario.value = ''
  selectPlacement('')
  brief.value = text
  resetSearch()
  closeInspector()
  notice(`Slide loaded. Google Slides deck size ${output.width} × ${output.height}. Review the text, then click Find images.`)
})

void start()
