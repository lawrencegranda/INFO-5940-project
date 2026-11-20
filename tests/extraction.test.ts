import { afterEach, describe, expect, it, vi } from 'vitest';
import { extractContent, extractionCapabilities } from '../src/library/extraction/index.js';
import { embedLocally, summarizeLocally } from '../src/library/gateways/index.js';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
function pdfFixture(text: string): Buffer {
  const stream = 'BT /F1 16 Tf 72 720 Td (' + text + ') Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Length ' + Buffer.byteLength(stream) + ' >>\nstream\n' + stream + '\nendstream',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += (index + 1) + ' 0 obj\n' + object + '\nendobj\n'; });
  const xref = Buffer.byteLength(pdf);
  pdf += 'xref\n0 6\n0000000000 65535 f \n' + offsets.slice(1).map(offset => String(offset).padStart(10, '0') + ' 00000 n \n').join('');
  return Buffer.from(pdf + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
}
describe('extraction evidence and honest limitations', () => {
  it('retains UTF-8 source text', async () => {
    const output = await extractContent({ bytes: Buffer.from('Assignment 1 截止日期: November 22.'), mime: 'text/plain', name: 'notes.txt' });
    expect(output.outcome).toBe('complete');
    expect(output.text).toContain('截止日期');
    expect(output.segments[0].location).toBe('text');
  });
  it('strips executable/style/form text from HTML and discloses selected embeds', async () => {
    const output = await extractContent({ bytes: Buffer.from('<h1>Course</h1><p>Due November 22.</p><script>steal()</script><style>.secret{}</style><form><input value="SECRET">password</form><iframe src="https://example.invalid"></iframe>'), mime: 'text/html', name: 'page.html' });
    expect(output.text).toContain('Due November 22');
    expect(output.text).not.toMatch(/steal|SECRET|password|secret/);
    expect(output.outcome).toBe('partial');
    expect(output.limitations.join(' ')).toContain('not fetched');
  });
  it('extracts actual PDF page text with a page location', async () => {
    const output = await extractContent({ bytes: pdfFixture('Assignment one is due November 22.'), mime: 'application/pdf', name: 'assignment.pdf' });
    expect(output.text).toContain('November 22');
    expect(output.segments[0].location).toContain('page 1');
    expect(output.outcome).toBe('complete');
  });
  it('imports a manual VTT transcript with segment time and provenance limitation', async () => {
    const output = await extractContent({ bytes: Buffer.from('WEBVTT\n\n00:00.000 --> 00:04.500\nThe exam is in room 201.\n'), mime: 'text/vtt', name: 'lecture.vtt' });
    expect(output.text).toContain('room 201');
    expect(output.segments[0].location).toContain('00:04.500');
    expect(output.limitations[0]).toContain('Manually');
  });
  it('does not claim to transcribe unsupported media', async () => {
    const output = await extractContent({ bytes: Buffer.from('not-real-audio'), mime: 'video/mp4', name: 'lecture.mp4' });
    expect(output.outcome).toBe('unsupported');
    expect(output.text).toBe('');
    expect(output.limitations.join(' ')).toContain('transcript');
  });
  it('does not index invalid UTF-8 or empty content as complete', async () => {
    expect((await extractContent({ bytes: Buffer.from([0xff, 0xfe, 0x00]), mime: 'text/plain', name: 'broken.txt' })).outcome).toBe('unsupported');
    expect((await extractContent({ bytes: Buffer.alloc(0), mime: 'text/plain', name: 'empty.txt' })).outcome).toBe('partial');
  });
  it('reports local capabilities without requesting hosted media or speech permissions', async () => {
    vi.stubEnv('WHISPER_COMMAND', '');
    vi.stubEnv('WHISPER_MODEL', '');
    const capabilities = await extractionCapabilities();
    expect(capabilities.transcription.available).toBe(false);
    expect(capabilities.transcription.detail).toContain('VTT/SRT');
  });
});
describe('local-only model gateway', () => {
  it('rejects external URLs before making a request', async () => {
    vi.stubEnv('OLLAMA_URL', 'https://example.com');
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    await expect(summarizeLocally('A source.')).rejects.toThrow('loopback');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('returns only the answer after a closed thought and requests no redirects', async () => {
    vi.stubEnv('OLLAMA_URL', 'http://127.0.0.1:11434');
    const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ response: '<think>Internal analysis</think>The deadline is November 22.', model: 'local-test' })));
    vi.stubGlobal('fetch', fetch);
    expect(await summarizeLocally('The deadline is November 22.')).toEqual({ summary: 'The deadline is November 22.', model: 'local-test' });
    expect(fetch.mock.calls[0][1].redirect).toBe('error');
  });
  it('rejects incomplete reasoning without fabricating a summary', async () => {
    vi.stubEnv('OLLAMA_URL', 'http://127.0.0.1:11434');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ response: '<think>Still considering the source' }))));
    await expect(summarizeLocally('Source.')).rejects.toThrow('no final answer');
  });
  it('validates embedding count and finite dimensions', async () => {
    vi.stubEnv('OLLAMA_URL', 'http://127.0.0.1:11434');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ embeddings: [[1, 2], [3, 4]] }))));
    expect(await embedLocally(['one', 'two'])).toEqual([[1, 2], [3, 4]]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ embeddings: [[1]] }))));
    await expect(embedLocally(['one', 'two'])).rejects.toThrow('input batch');
  });
});
