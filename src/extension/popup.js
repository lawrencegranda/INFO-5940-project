const API = 'http://127.0.0.1:4310';
const MAX_ASSET_BYTES = 8 * 1024 * 1024;
const $ = (selector) => document.querySelector(selector);
let token = '';
let page = null;
let tabId;
let busy = false;

function status(message, kind = '') { $('#status').textContent = message; $('#status').className = kind; }
function updateSave() { $('#save').disabled = busy || !token || !page || !$('#course').value; }
function report(label, message, failed = false) {
  $('#results').hidden = false;
  const row = document.createElement('li');
  row.className = failed ? 'failed' : '';
  row.textContent = `${failed ? '!' : '✓'} ${label}: ${message}`;
  $('#results').append(row);
}

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options, credentials: 'omit',
    headers: { 'X-Course-Copilot-Token': token, ...options.headers },
    signal: AbortSignal.timeout(30_000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Pairing was not accepted. Copy the current code from library Settings.');
    throw new Error(typeof data.error === 'string' ? data.error.slice(0, 200) : 'The local library could not save this item.');
  }
  return data;
}

async function loadCourses() {
  const data = await request('/api/courses');
  const courses = Array.isArray(data) ? data : data.courses;
  if (!Array.isArray(courses)) throw new Error('The local library returned an unexpected course list.');
  $('#course').replaceChildren();
  const previous = (await chrome.storage.local.get('selectedCourseId')).selectedCourseId;
  for (const course of courses) {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = `${course.code} · ${course.name}`;
    $('#course').append(option);
  }
  if (previous && courses.some((course) => course.id === previous)) $('#course').value = previous;
  $('#connection').textContent = 'Connected';
  $('#connection').classList.add('online');
  if (!courses.length) throw new Error('Add a course in your local library, then reopen this popup.');
  $('#pairing').open = false;
  updateSave();
}

// This function runs only in the invoked active tab. It returns permitted content, never cookies or headers.
function snapshotPage() {
  function safeUrl(value) {
    try {
      const url = new URL(value, location.href);
      if (!['http:', 'https:'].includes(url.protocol)) return null;
      const normalizeKey = (key) => key.replace(/[-_.\s]/g, '').toLowerCase();
      function scrub(parameters) {
        const keys = [...parameters.keys()];
        const signed = keys.some((key) => /^(xamz|xgoog|awsaccesskeyid$|googleaccessid$|accesskeyid$|sig$|signature$|keypairid$)/.test(normalizeKey(key)));
        for (const key of keys) {
          const name = normalizeKey(key);
          if (/token|auth|signature|secret|credential|session|password|apikey|jwt|nonce|ticket|saml/.test(name) ||
            /^(xamz|xgoog|awsaccesskeyid$|googleaccessid$|accesskeyid$|sig$|code$|state$|keypairid$)/.test(name) ||
            (signed && /^(expires|policy)$/.test(name))) parameters.delete(key);
        }
      }
      url.username = ''; url.password = '';
      scrub(url.searchParams);
      // Hash routes identify different SPA materials. Ordinary section fragments do not.
      if (/^#!?\//.test(url.hash)) {
        const route = url.hash.slice(1).split('#', 1)[0];
        const queryAt = route.indexOf('?');
        const path = queryAt < 0 ? route : route.slice(0, queryAt);
        const parameters = new URLSearchParams(queryAt < 0 ? '' : route.slice(queryAt + 1));
        scrub(parameters);
        url.hash = path + (parameters.size ? `?${parameters}` : '');
      } else url.hash = '';
      return url.href;
    } catch { return null; }
  }
  const resources = new Map();
  for (const node of document.querySelectorAll('a[href],iframe[src],embed[src],object[data],video[src],audio[src],video source[src],audio source[src],img[src]')) {
    if (node.tagName === 'IMG') {
      const rect = node.getBoundingClientRect();
      if (rect.width < 120 || rect.height < 80) continue;
    }
    const raw = node.getAttribute('href') || node.getAttribute('src') || node.getAttribute('data');
    if (!raw) continue;
    let absolute;
    try { absolute = new URL(raw, location.href).href; } catch { continue; }
    if (!/^https?:/.test(absolute)) continue;
    const embedded = node.tagName !== 'A';
    if (!embedded && !/\.(pdf|docx?|pptx?|xlsx?|txt|md|csv|png|jpe?g|webp|mp3|m4a|wav|mp4|webm)(?:[?#]|$)|\/files\/|download|attachment/i.test(absolute) && !node.hasAttribute('download')) continue;
    const safe = safeUrl(absolute);
    if (!safe || resources.has(safe) || resources.size >= 25) continue;
    resources.set(safe, {
      url: absolute, sourceUrl: safe,
      title: (node.textContent?.trim() || node.getAttribute('alt') || node.getAttribute('title') || safe.split('/').pop() || 'Embedded resource').slice(0, 140),
      type: node.tagName === 'IMG' ? 'Image / diagram' : /\.(mp3|m4a|wav|mp4|webm)(?:[?#]|$)/i.test(absolute) ? 'Audio / video' : embedded ? 'Embedded resource' : 'Linked file',
    });
  }
  const omitted = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'IFRAME', 'EMBED', 'OBJECT', 'META', 'LINK', 'BASE']);
  let visited = 0;
  function clean(node) {
    if (++visited > 60_000) return null;
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || '');
    if (node.nodeType !== Node.ELEMENT_NODE || omitted.has(node.tagName)) return null;
    const style = getComputedStyle(node);
    if (node.hidden || node.getAttribute('aria-hidden') === 'true' || style.display === 'none' || style.visibility === 'hidden') return null;
    const clone = document.createElement(node.tagName === 'FORM' ? 'div' : node.tagName.toLowerCase());
    for (const attribute of [...node.attributes]) {
      if (['title', 'alt', 'colspan', 'rowspan'].includes(attribute.name)) clone.setAttribute(attribute.name, attribute.value.slice(0, 500));
      // Keep inert inline vector/math geometry so a saved equation/diagram is not reduced to an empty tag.
      if (node.namespaceURI === 'http://www.w3.org/2000/svg' &&
        ['d', 'viewBox', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'width', 'height', 'points', 'transform', 'xmlns', 'id'].includes(attribute.name) &&
        !/url\s*\(|javascript:|data:/i.test(attribute.value)) clone.setAttribute(attribute.name, attribute.value.slice(0, 150_000));
      if (['href', 'src'].includes(attribute.name)) {
        if (node.namespaceURI === 'http://www.w3.org/2000/svg' && /^#[a-zA-Z0-9_.:-]+$/.test(attribute.value)) {
          clone.setAttribute(attribute.name, attribute.value); continue;
        }
        const safe = safeUrl(attribute.value);
        if (safe) clone.setAttribute(attribute.name, safe);
      }
    }
    for (const child of node.childNodes) { const safe = clean(child); if (safe) clone.append(safe); }
    return clone;
  }
  const clone = clean(document.body);
  const html = clone?.innerHTML || '';
  return {
    title: document.title.slice(0, 240), sourceUrl: safeUrl(location.href),
    sourceType: /(^|\.)instructure\.com$|(^|\.)canvas\./.test(location.hostname) || document.body.classList.contains('ic-app') ? 'canvas'
      : /(^|\.)gradescope\.com$/.test(location.hostname) ? 'gradescope'
        : /(^|\.)edstem\.org$/.test(location.hostname) ? 'edstem' : 'web',
    content: html.slice(0, 2_000_000), format: 'html', resources: [...resources.values()],
    truncated: html.length > 2_000_000 || new TextEncoder().encode(html).byteLength > 2 * 1024 * 1024 || visited > 60_000,
  };
}

function renderResources() {
  const resources = page?.resources || [];
  $('#asset-section').hidden = resources.length === 0;
  $('#asset-count').textContent = `${resources.length} discovered`;
  for (const [index, resource] of resources.entries()) {
    const label = document.createElement('label'); label.className = 'asset';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.value = String(index);
    const text = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = resource.title;
    const detail = document.createElement('small'); detail.textContent = `${resource.type} · ${new URL(resource.sourceUrl).hostname}`;
    text.append(title, detail); label.append(checkbox, text); $('#assets').append(label);
  }
}

async function captureAsset(resource) {
  // Same-origin acquisition uses the page's existing session in its isolated execution context.
  const sameOrigin = new URL(resource.url).origin === new URL(page.sourceUrl).origin;
  let encoded;
  if (sameOrigin) {
    const executed = await chrome.scripting.executeScript({ target: { tabId }, args: [resource.url, MAX_ASSET_BYTES],
      func: async (url, maximum) => {
        try {
          const response = await fetch(url, { credentials: 'same-origin', signal: AbortSignal.timeout(20_000) });
          if (!response.ok) return { error: 'The page could not access this selected file.' };
          if (/text\/html/i.test(response.headers.get('content-type') || '')) return { error: 'This link opened an embedded page or login screen rather than a file. Open it directly or use permitted manual upload.' };
          if (Number(response.headers.get('content-length')) > maximum) return { error: 'This file exceeds the 8 MB browser-capture limit. Use manual upload.' };
          const blob = await response.blob();
          if (blob.size > maximum) return { error: 'This file exceeds the 8 MB browser-capture limit. Use manual upload.' };
          const bytes = new Uint8Array(await blob.arrayBuffer());
          let binary = '';
          for (let start = 0; start < bytes.length; start += 8192) binary += String.fromCharCode(...bytes.subarray(start, start + 8192));
          return { base64: btoa(binary), mime: blob.type || 'application/octet-stream' };
        } catch { return { error: 'This selected file was unavailable. Use permitted manual upload.' }; }
      } });
    encoded = executed[0]?.result;
    if (!encoded || encoded.error) throw new Error(encoded?.error || 'The active page changed. Reopen the popup to retry.');
  } else {
    const origin = `${new URL(resource.url).origin}/*`;
    // Permission is requested in the original Save click handler, before asynchronous capture starts.
    const permitted = await chrome.permissions.contains({ origins: [origin] });
    if (!permitted) throw new Error('Access was not granted for this file host. Use manual upload.');
    const response = await fetch(resource.url, { credentials: 'omit', signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error('This file is protected or unavailable. Use permitted manual upload.');
    if (/text\/html/i.test(response.headers.get('content-type') || '')) throw new Error('This link opened a webpage rather than an accessible file. Open it directly or use manual upload.');
    if (Number(response.headers.get('content-length')) > MAX_ASSET_BYTES) throw new Error('This file exceeds the 8 MB capture limit. Use manual upload.');
    const blob = await response.blob();
    if (blob.size > MAX_ASSET_BYTES) throw new Error('This file exceeds the 8 MB capture limit. Use manual upload.');
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let start = 0; start < bytes.length; start += 8192) binary += String.fromCharCode(...bytes.subarray(start, start + 8192));
    encoded = { base64: btoa(binary), mime: blob.type || 'application/octet-stream' };
  }
  const bytes = Uint8Array.from(atob(encoded.base64), (character) => character.charCodeAt(0));
  const filename = decodeURIComponent(new URL(resource.sourceUrl).pathname.split('/').pop() || 'resource');
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: encoded.mime }), filename);
  form.append('courseId', $('#course').value); form.append('title', resource.title);
  form.append('sourceUrl', resource.sourceUrl); form.append('sourceType', page.sourceType);
  form.append('kind', $('#kind').value);
  return request('/api/upload', { method: 'POST', body: form });
}

$('#connect').addEventListener('click', async () => {
  token = $('#pair-code').value.trim();
  if (!token) { status('Paste the pairing code shown in your library Settings.', 'error'); return; }
  try { await loadCourses(); await chrome.storage.local.set({ pairingToken: token }); $('#pair-code').value = ''; status('Connected. Choose what to save.'); }
  catch (error) { status(error.message || 'Start the local library and try again.', 'error'); }
});
$('#course').addEventListener('change', () => { void chrome.storage.local.set({ selectedCourseId: $('#course').value }); updateSave(); });
$('#save').addEventListener('click', async () => {
  if (busy || !page || !token || !$('#course').value) return;
  if (page.truncated) { status('This page is too large for a complete browser snapshot. Import the original file through the library instead.', 'error'); return; }
  const selected = [...document.querySelectorAll('#assets input:checked')].map((input) => page.resources[Number(input.value)]);
  const origins = [...new Set(selected.filter((item) => new URL(item.url).origin !== new URL(page.sourceUrl).origin).map((item) => `${new URL(item.url).origin}/*`))];
  // Chrome requires optional permissions to be requested directly from this explicit user gesture.
  const permissionRequest = origins.length ? chrome.permissions.request({ origins }) : Promise.resolve(true);
  busy = true; updateSave(); $('#results').replaceChildren(); $('#results').hidden = true;
  status('Saving to your local library… Keep this popup open until the results appear.');
  await permissionRequest.catch(() => false);
  let failures = 0;
  const captureLimitations = [];
  let reportPersisted = true;
  try {
    const { resources, truncated, ...snapshot } = page;
    const savedPage = await request('/api/capture', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...snapshot, courseId: $('#course').value, title: $('#title').value.trim() || page.title, kind: $('#kind').value }) });
    report('Page', 'Saved the accessible page snapshot.');
    for (const resource of selected) {
      status(`Saving ${resource.title}… Keep this popup open.`);
      try { const saved = await captureAsset(resource); const outcome = saved.document?.outcome || saved.outcome;
        report(resource.title, outcome && outcome !== 'complete' ? `Saved with ${outcome} extraction. Check limitations in the library.` : 'Saved as a separate source.');
        if (outcome && outcome !== 'complete') {
          failures++;
          captureLimitations.push(`${resource.title}: original saved, but extraction is ${outcome}.`);
        }
      } catch (error) {
        failures++;
        const reason = /^(This (selected file|file|link)|The (page|active page)|Access was not granted)/.test(error.message || '')
          ? error.message : 'This selected file could not be captured. Use permitted manual upload.';
        captureLimitations.push(`${resource.title}: ${reason}`.slice(0, 450));
        report(resource.title, reason, true);
      }
    }
    if (captureLimitations.length) {
      const parentId = savedPage.document?.id;
      try {
        if (!parentId) throw new Error('No parent reference was returned.');
        await request(`/api/documents/${encodeURIComponent(parentId)}/capture-report`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: $('#course').value, limitations: captureLimitations,
            versionId: savedPage.document.versionId }),
        });
      } catch {
        reportPersisted = false;
        report('Capture status', 'The page was saved, but its linked-file issues could not be recorded. Keep these results and retry in the library.', true);
      }
    }
    status(!reportPersisted ? 'Page saved, but linked-file issues could not be recorded. Review the results below before closing.'
      : failures ? `Page saved. ${failures} selected file${failures === 1 ? '' : 's'} need attention; review the linked-file issues in your library.`
        : 'Saved to your library. Open it to review sources and extraction.', failures ? 'error' : 'success');
  } catch (error) { status(error.message || 'The local library is unavailable. Start it and retry.', 'error'); }
  finally { busy = false; updateSave(); }
});

async function initialize() {
  const stored = await chrome.storage.local.get('pairingToken'); token = stored.pairingToken || '';
  $('#pairing').open = !token;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); tabId = tab?.id;
    if (!tabId || !tab.url || !/^https?:/.test(tab.url)) throw new Error('Open an accessible course page, paper or webpage to save it.');
    const executed = await chrome.scripting.executeScript({ target: { tabId }, func: snapshotPage });
    page = executed[0]?.result;
    if (!page?.sourceUrl || !page.content) throw new Error('This page has no accessible snapshot. Use local file import instead.');
    $('#page-name').textContent = page.title; $('#page-origin').textContent = new URL(page.sourceUrl).hostname;
    $('#title').value = page.title; renderResources();
  } catch (error) { $('#page-name').textContent = 'Page unavailable'; status(error.message, 'error'); }
  if (token) {
    try { await loadCourses(); }
    catch { token = ''; $('#pairing').open = true; status('Start your local library and connect with its pairing code.', 'error'); }
  }
  updateSave();
}
void initialize();
