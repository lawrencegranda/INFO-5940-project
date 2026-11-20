import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { constants } from 'node:fs';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import type { Capability, ExtractionResult } from '../../shared/types.js';

const run = promisify(execFile);
const MAX_BYTES = 40 * 1024 * 1024;
let nativeBuild: Promise<string> | undefined;
let nativeBuildFailed = false;

function result(segments: ExtractionResult['segments'], adapter: string, limitations: string[] = [], partial = false): ExtractionResult {
  const valid: ExtractionResult['segments'] = [];
  let remaining = 2_000_000;
  for (const segment of segments) {
    const text = segment.text.trim();
    if (!text) continue;
    if (text.length > remaining) {
      if (remaining > 0) valid.push({ ...segment, text: text.slice(0, remaining) });
      limitations = [...limitations, 'Indexed extraction was limited to 2,000,000 characters; the full original is preserved.'];
      partial = true;
      break;
    }
    valid.push({ ...segment, text });
    remaining -= text.length;
  }
  return { text: valid.map(segment => segment.text).join('\n\n'), segments: valid, adapter,
    outcome: partial || valid.length === 0 ? 'partial' : 'complete', limitations: [...new Set(limitations)] };
}
function unsupported(detail: string, adapter = 'unsupported'): ExtractionResult {
  return { text: '', segments: [], adapter, outcome: 'unsupported', limitations: [detail] };
}
async function executable(path: string): Promise<boolean> {
  try { await access(path, constants.X_OK); return true; } catch { return false; }
}
async function nativeSource(): Promise<string> {
  const adjacent = fileURLToPath(new URL('./native.swift', import.meta.url));
  try { await access(adjacent); return adjacent; } catch { return resolve(process.cwd(), 'src/library/extraction/native.swift'); }
}
async function ensureNativeBridge(): Promise<string> {
  if (process.platform !== 'darwin') throw new Error('macOS Vision/PDFKit is unavailable on this platform.');
  if (!nativeBuild) nativeBuild = (async () => {
    const source = await nativeSource();
    const hash = createHash('sha256').update(await readFile(source)).digest('hex').slice(0, 16);
    const cache = resolve(process.cwd(), '.runtime/native-extraction');
    const binary = join(cache, 'bridge-' + hash);
    if (await executable(binary)) return binary;
    const modules = join(cache, 'module-cache');
    await mkdir(modules, { recursive: true });
    await run('/usr/bin/xcrun', ['swiftc', '-O', '-module-cache-path', modules, '-o', binary, source],
      { encoding: 'utf8', timeout: 90_000, maxBuffer: 2 * 1024 * 1024,
        env: { ...process.env, CLANG_MODULE_CACHE_PATH: modules, SWIFT_MODULECACHE_PATH: modules } });
    return binary;
  })().catch(error => { nativeBuildFailed = true; throw error; });
  return nativeBuild;
}
async function appleExtract(bytes: Buffer, kind: 'image' | 'pdf'): Promise<ExtractionResult> {
  const bridge = await ensureNativeBridge();
  const temp = await mkdtemp(join(tmpdir(), 'course-copilot-extract-'));
  try {
    const input = join(temp, kind === 'pdf' ? 'input.pdf' : 'input.image');
    await writeFile(input, bytes);
    const { stdout } = await run(bridge, [kind, input], { encoding: 'utf8', timeout: 120_000, maxBuffer: 16 * 1024 * 1024 });
    const parsed: { segments: ExtractionResult['segments']; limitations: string[]; partial: boolean; adapter: string } = JSON.parse(stdout);
    if (!Array.isArray(parsed.segments) || parsed.segments.some(item => typeof item.text !== 'string' || typeof item.location !== 'string')) throw new Error('Invalid native extraction output.');
    return result(parsed.segments, parsed.adapter, parsed.limitations, parsed.partial);
  } finally { await rm(temp, { recursive: true, force: true }); }
}
async function whisperConfig(): Promise<{ command: string; model: string } | null> {
  const configured = process.env.WHISPER_COMMAND;
  const model = process.env.WHISPER_MODEL;
  if (!configured || !model) return null;
  let command = configured;
  if (!configured.includes('/')) {
    try { command = (await run('/usr/bin/which', [configured], { encoding: 'utf8', timeout: 2000 })).stdout.trim(); } catch { return null; }
  }
  try { await access(model, constants.R_OK); } catch { return null; }
  return await executable(command) ? { command, model } : null;
}
export async function extractionCapabilities(): Promise<{ ocr: Capability; transcription: Capability }> {
  const mac = process.platform === 'darwin' && !nativeBuildFailed && await executable('/usr/bin/xcrun') && await executable('/usr/bin/swift');
  const whisper = await whisperConfig();
  return {
    ocr: { available: mac, detail: mac ? 'Local macOS Vision OCR; helper is compiled on the first image/scanned-PDF import. Originals are preserved.' : 'Local macOS Vision OCR is unavailable; import a text/PDF transcription manually.' },
    transcription: { available: Boolean(whisper), detail: whisper ? 'Configured local whisper-cli and model; WAV input only. No hosted audio or OS speech permission is used.' : 'No configured local speech-to-text model. Upload a UTF-8 VTT/SRT transcript or text; audio/video originals remain available.' },
  };
}
function transcript(text: string): ExtractionResult {
  const segments: ExtractionResult['segments'] = [];
  for (const block of text.replace(/^\uFEFF/, '').split(/\r?\n\s*\r?\n/)) {
    const lines = block.split(/\r?\n/);
    if (/^(NOTE|STYLE|REGION)\b/.test(lines[0] ?? '')) continue;
    const index = lines.findIndex(line => /\d{2}:\d{2}(?::\d{2})?[.,]\d{3}\s+-->/.test(line));
    if (index < 0) continue;
    const times = lines[index].split('-->').map(value => value.trim().split(/\s+/)[0]);
    const body = lines.slice(index + 1).join('\n').replace(/<[^>]*>/g, '').trim();
    if (body) segments.push({ text: body, location: 'media ' + times.join(' – ') });
  }
  return result(segments, 'manual-transcript', segments.length ? ['Manually supplied transcript; not a verified transcription of the media original.'] : ['No valid timestamped transcript cues were found.'], !segments.length);
}
function decode(bytes: Buffer): string {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (text.includes('\u0000')) throw new Error('Binary data is not supported as UTF-8 text.');
  return text.replace(/^\uFEFF/, '');
}
function htmlText(html: string): ExtractionResult {
  const { document } = parseHTML(/<html[\s>]/i.test(html) ? html : '<html><body>' + html + '</body></html>');
  const embedded = document.querySelectorAll('iframe,object,embed,video,audio,img').length;
  document.querySelectorAll('script,style,form,input,textarea,select,button,template,noscript,[hidden],[aria-hidden="true"]').forEach(element => element.remove());
  const body = document.body ?? document.documentElement;
  const text = (body.innerText ?? body.textContent ?? '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return result([{ text, location: 'HTML text' }], 'html-linkedom',
    embedded ? ['Embedded images/files/media are not fetched by HTML extraction. Select and import accessible resources separately; the original snapshot is preserved.'] : [], embedded > 0);
}
async function pdfText(bytes: Buffer): Promise<ExtractionResult> {
  const segments: ExtractionResult['segments'] = [];
  const limitations: string[] = [];
  let missing = false;
  try {
    const { getDocument, OPS } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const document = await getDocument({ data: new Uint8Array(bytes), isEvalSupported: false, disableFontFace: true, useSystemFonts: true }).promise;
    try {
      const count = Math.min(document.numPages, 100);
      if (count < document.numPages) limitations.push('Only the first 100 of ' + document.numPages + ' PDF pages were extracted.');
      for (let index = 1; index <= count; index++) {
        try {
          const page = await document.getPage(index);
          const content = await page.getTextContent();
          const text = content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('').trim();
          if (text) {
            segments.push({ text, location: 'page ' + index });
            try {
              const operators = await page.getOperatorList();
              if (operators.fnArray.some(operation => [OPS.paintImageXObject, OPS.paintInlineImageXObject, OPS.paintImageMaskXObject].includes(operation))) {
                limitations.push('page ' + index + ': native text was indexed; embedded image text was not separately OCRed. Inspect the preserved original or import the image.');
              }
            } catch { limitations.push('page ' + index + ': embedded-image coverage could not be checked; the original is preserved.'); }
          }
          else { missing = true; limitations.push('page ' + index + ': no native text layer.'); }
          page.cleanup();
        } catch { missing = true; limitations.push('page ' + index + ': native text extraction failed.'); }
      }
    } finally { await document.destroy(); }
    if (!missing) return result(segments, 'pdfjs-native', limitations, limitations.length > 0);
  } catch { missing = true; limitations.push('Native PDF parsing failed or the file is protected.'); }
  if (process.platform === 'darwin') {
    try { return await appleExtract(bytes, 'pdf'); } catch { limitations.push('Local PDFKit/Vision fallback failed or timed out; upload a text transcription if needed.'); }
  } else limitations.push('Scanned-PDF OCR requires the local macOS Vision adapter or a manual transcription.');
  return segments.length ? result(segments, 'pdfjs-native', limitations, true) : { text: '', segments: [], outcome: 'failed', adapter: 'pdf', limitations };
}
async function transcribeWav(bytes: Buffer): Promise<ExtractionResult> {
  const config = await whisperConfig();
  if (!config) return unsupported('No configured local speech-to-text model. Upload a VTT/SRT transcript or text; no audio is sent to a hosted service.', 'media');
  const temp = await mkdtemp(join(tmpdir(), 'course-copilot-whisper-'));
  try {
    const input = join(temp, 'input.wav'), output = join(temp, 'transcript');
    await writeFile(input, bytes);
    await run(config.command, ['-m', config.model, '-f', input, '-otxt', '-of', output, '-nt'], { encoding: 'utf8', timeout: 120_000, maxBuffer: 2 * 1024 * 1024 });
    const text = (await readFile(output + '.txt', 'utf8')).trim();
    return result([{ text, location: 'audio transcript' }], 'configured-local-whisper', ['Automatically transcribed; inspect the preserved original. Segment timestamps are not available from this adapter.']);
  } catch { return { text: '', segments: [], adapter: 'configured-local-whisper', outcome: 'failed', limitations: ['Configured local WAV transcription failed or timed out. Upload a VTT/SRT transcript manually.'] }; }
  finally { await rm(temp, { recursive: true, force: true }); }
}
export async function extractContent(input: { bytes: Buffer; mime: string; name: string; format?: 'text' | 'html' }): Promise<ExtractionResult> {
  const { bytes, name, format } = input;
  const mime = input.mime.toLowerCase().split(';')[0].trim();
  const extension = extname(name).toLowerCase();
  if (bytes.length > MAX_BYTES) return unsupported('The 40 MB extraction limit was exceeded; the original can be retained, but this adapter has not processed it.');
  if (!bytes.length) return result([], 'empty', ['The selected file has no readable content.'], true);
  if (mime === 'application/pdf' || extension === '.pdf' || bytes.subarray(0, 5).toString() === '%PDF-') return pdfText(bytes);
  if (mime.startsWith('image/') || /\.(png|jpe?g|heic|tiff?|bmp|gif|webp)$/.test(extension)) {
    if (process.platform !== 'darwin') return unsupported('Image OCR is unavailable on this platform. Preserve the image and upload its text transcription.', 'image');
    try { return await appleExtract(bytes, 'image'); } catch { return { text: '', segments: [], adapter: 'apple-vision', outcome: 'failed', limitations: ['Local image OCR failed or timed out; the original is preserved. Upload text manually if needed.'] }; }
  }
  if (mime.startsWith('audio/') || mime.startsWith('video/') || /\.(mp3|m4a|wav|mp4|mov|webm|ogg|flac)$/.test(extension)) {
    if (extension === '.wav' || mime === 'audio/wav' || mime === 'audio/x-wav') return transcribeWav(bytes);
    return unsupported('This prototype has no configured decoder/transcriber for this audio/video format. Upload a VTT/SRT transcript or UTF-8 text; the original remains available.', 'media');
  }
  try {
    if ((format === 'html' || mime === 'text/html' || extension === '.html' || extension === '.htm') && bytes.length > 2 * 1024 * 1024) return unsupported('HTML exceeds the 2 MB parsing limit; preserve the original and import its PDF or UTF-8 text instead.');
    if (bytes.length > 8 * 1024 * 1024) return unsupported('Text exceeds the 8 MB decoding limit; preserve the original and import selected text sections.');
    const text = decode(bytes);
    if (extension === '.vtt' || extension === '.srt' || mime === 'text/vtt' || mime === 'application/x-subrip') return transcript(text);
    if (format === 'html' || mime === 'text/html' || extension === '.html' || extension === '.htm') return htmlText(text);
    if (format === 'text' || mime.startsWith('text/') || ['.txt', '.md', '.csv', '.json', '.xml'].includes(extension) || mime === 'application/json') return result([{ text, location: 'text' }], 'utf8-text');
    return unsupported('This file type is not supported for text extraction. Preserve the original and import UTF-8 text, HTML, PDF, an image or a transcript.');
  } catch { return unsupported('The file is not valid supported UTF-8 text. Preserve the original and upload a UTF-8/PDF transcription.'); }
}
