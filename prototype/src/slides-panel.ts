import { slideOutput } from './campaign.ts'
import type { Output } from './campaign.ts'
import { describeBounds, describeSlide, parseSlidesUrl, pickPage, readDeck, readPage, SlidesError, slidesOrigin, slidesScope } from './slides.ts'
import type { Deck, Slide } from './slides.ts'

interface ChromeSlides {
  runtime?: { getManifest(): { oauth2?: { client_id?: string; scopes?: string[] } } }
  tabs?: { query(options: { active: boolean; currentWindow: boolean }): Promise<{ url?: string }[]> }
  permissions?: { request(options: { origins: string[] }): Promise<boolean> }
  identity?: {
    getAuthToken(options: { interactive: boolean }): Promise<{ token?: string; grantedScopes?: string[] }>
    removeCachedAuthToken(options: { token: string }): Promise<void>
  }
}

export function connectSlides(useContext: (context: { text: string; output: Output; layout: string }) => void) {
  const chrome = (globalThis as unknown as { chrome?: ChromeSlides }).chrome
  const get = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
  const link = get<HTMLInputElement>('deck-url')
  const connect = get<HTMLButtonElement>('read-deck')
  const picker = get<HTMLSelectElement>('slide-page')
  const use = get<HTMLButtonElement>('use-slide')
  const source = get('slide-source')
  const state = get('slides-status')
  const oauth = chrome?.runtime?.getManifest().oauth2
  let deck: Deck | undefined
  let slide: Slide | undefined
  let token = ''
  let busy = false

  function status(text: string) { state.textContent = text }
  function working(value: boolean) {
    busy = value
    link.disabled = connect.disabled = get<HTMLButtonElement>('detect-deck').disabled = busy
    picker.disabled = busy || !deck?.pages.length
    use.disabled = busy || !slide
  }

  async function detect(report = true) {
    try {
      const tab = (await chrome?.tabs?.query({ active: true, currentWindow: true }))?.[0]
      if (tab?.url && parseSlidesUrl(tab.url)) {
        if (link.value !== tab.url) {
          link.value = tab.url
          clear()
        }
        status('Detected an open Slides deck. Click Read deck to continue.')
      } else if (report) {
        status('Open a Slides deck and click the extension toolbar icon, or paste the deck link.')
      }
    } catch (error) {
      if (report) status(error instanceof Error ? error.message : String(error))
    }
  }

  async function authorize(interactive: boolean) {
    const identity = chrome?.identity
    if (!identity || !oauth?.client_id || !oauth.scopes?.includes(slidesScope)) {
      throw new Error('Configure the Chrome Extension OAuth client ID using the README, then reload this extension.')
    }
    const result = await identity.getAuthToken({ interactive })
    if (!result.token || (result.grantedScopes && !result.grantedScopes.includes(slidesScope))) {
      throw new Error('Slides read access was not granted. Connect again and allow read access.')
    }
    token = result.token
  }

  async function withToken<T>(read: (accessToken: string) => Promise<T>) {
    try {
      return await read(token)
    } catch (error) {
      if (!(error instanceof SlidesError) || error.status !== 401) throw error
      await chrome?.identity?.removeCachedAuthToken({ token })
      token = ''
      try { await authorize(false) } catch {
        throw new Error('Google sign-in expired. Click Read deck to reconnect.')
      }
      return await read(token)
    }
  }

  function clear() {
    deck = slide = undefined
    picker.replaceChildren()
    source.hidden = true
    working(busy)
  }

  async function readSelected(id: string) {
    if (!deck) return
    slide = undefined
    working(true)
    get('slide-contents').replaceChildren()
    const result = await withToken(access => readPage(deck!.id, id, access))
    slide = result
    const page = deck.pageSize
    const list = get('slide-contents')
    for (const item of result.items) {
      const entry = document.createElement('li')
      const label = item.kind === 'image' ? 'Image' : 'Text'
      const bounds = describeBounds(item.bounds, page)
      entry.textContent = `${label}${bounds ? ` · ${bounds}` : ''}${item.text ? ` · ${item.text}` : ''}`
      list.append(entry)
    }
    get('slide-layout').textContent = `${page.width ? `${Math.round(page.width)} × ${Math.round(page.height)} pt · ` : ''}${result.items.filter(item => item.kind === 'image').length} image elements`
    if (!list.children.length) {
      const entry = document.createElement('li')
      entry.textContent = 'This slide has no text or image elements.'
      list.append(entry)
    }
  }

  connect.addEventListener('click', async () => {
    if (busy) return
    const reference = parseSlidesUrl(link.value)
    if (!reference) { status('Paste a Google Slides editor or view link to read the presentation.'); return }
    if (!oauth?.client_id || !oauth.scopes?.includes(slidesScope)) {
      status('Google OAuth needs a client ID. Follow the Google Cloud setup steps in the README.')
      return
    }
    working(true)
    clear()
    status('Connecting to Google Slides…')
    try {
      if (!await chrome?.permissions?.request({ origins: [`${slidesOrigin}/*`] })) {
        throw new Error('Allow access to slides.googleapis.com to read the deck.')
      }
      await authorize(true)
      deck = await withToken(access => readDeck(reference.id, access))
      if (!deck.pages.length) throw new Error('The presentation has no readable slides.')
      const initial = pickPage(deck.pages, reference.hintedPage)
      get('deck-title').textContent = deck.title
      picker.replaceChildren(...deck.pages.map((id, i) => new Option(`Slide ${i + 1}`, id)))
      picker.value = initial.id
      source.hidden = false
      await readSelected(initial.id)
      status(initial.matched ? 'Read the slide linked in the editor URL. Use the picker to switch slides.' : 'Read the first slide. Choose the intended slide from the picker.')
    } catch (error) {
      status(error instanceof Error ? error.message : String(error))
    } finally {
      working(false)
    }
  })
  picker.addEventListener('change', async () => {
    if (busy || !deck || !picker.value) return
    status('Reading slide…')
    try {
      await readSelected(picker.value)
      status('Slide read.')
    } catch (error) {
      status(error instanceof Error ? error.message : String(error))
    } finally {
      working(false)
    }
  })
  use.addEventListener('click', () => {
    if (slide && deck) useContext({
      text: slide.text.slice(0, 1600) || `Find an image for slide ${picker.selectedIndex + 1} of ${deck.title}.`,
      output: slideOutput(deck.pageSize),
      layout: describeSlide(slide, deck.pageSize),
    })
  })
  link.addEventListener('input', clear)
  get('detect-deck').addEventListener('click', () => { if (!busy) void detect() })
  working(false)
  void detect(false)
}
