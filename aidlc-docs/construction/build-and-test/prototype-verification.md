# Local Course Copilot — Prototype Verification

**Scope:** Runnable local prototype on `prototype/local-course-copilot`. This records implementation checks and open validation work; it does not close every approved U-01 acceptance criterion or certify the full MVP. Workflow authorization and gates remain in the [prototype plan](../plans/local-prototype-plan.md) and [AI-DLC state](../../aidlc-state.md).

## Build and repeat the automated checks

From the repository root, with Node.js 20+ and npm available:

```sh
npm ci
npm run typecheck
npm run build
npm test
```

`npm ci` installs a project Node 22 runtime. npm scripts resolve that local executable; direct runtime commands must also use `node_modules/node/bin/node`, because the SQLite library requires `node:sqlite`. The validated runtime was Node 22.23.5. Build output includes the UI, stdio MCP bundle, and unpacked Chrome extension.

The integrated run on November 20, 2026 passed `npm run typecheck`, `npm run build`, and **49/49 tests in four files**. The checks below describe the assertions actually exercised. They do not substitute for the pending real-system checks.

| Test artifact | Evidence |
| --- | --- |
| [Library tests](../../../tests/library.test.ts) | Real temporary SQLite/original files; exact bytes and SHA-256; unchanged capture observations; new/historical versions and extraction references; metadata independence; reload persistence; cross-course fetch/history/original denial; separate source identity and course membership. |
| Library deadline and property cases | Explicit published November 20 → 22 update; old-source recapture does not override it; unsupported disagreements remain unresolved; unrelated assignments/courses stay separate; invalid or yearless dates do not become invented facts. Fixed-seed properties cover URL normalization and saved-reference round trips. |
| [Local HTTP API tests](../../../tests/api.test.ts) | Token checks including malformed multibyte input; Host/Origin/cross-site restrictions; extension pairing boundaries; actual JSON/multipart import, search, download bytes, and course denial; a delayed old-version capture report cannot annotate the newer version; SPA-route fallback regression. |
| [Extraction and gateway tests](../../../tests/extraction.test.ts) | Actual native-text PDF parsing and page locations; UTF-8 text; sanitized HTML and omitted-embed disclosure; timestamped VTT parsing; unsupported-media/invalid-input statuses. Stubbed Ollama responses test local-only routing and output validation, not model quality. |
| [MCP integration tests](../../../tests/integration/mcp.test.ts) | Exactly six read-only tools; scoped exact references; bounded pagination; a real SDK client and spawned stdio process reading saved SQLite data; saved file hashes remain unchanged. Missing-library startup does not initialize storage. |

The library and API tests use temporary data rather than the user's course library. Their local-model endpoint is deliberately unavailable so persistence/security results do not depend on an installed model. HTTP tests need a runner allowed to bind a local socket. Do not classify a sandbox socket denial as a product assertion failure.

## Run and inspect the prototype

```sh
npm run dev
```

Open [http://127.0.0.1:4310](http://127.0.0.1:4310). On first launch of an empty data directory, synthetic examples are seeded and labeled. Import your own source to assess actual behavior. The default `.course-copilot/` directory and native-helper `.runtime/` cache are Git-ignored.

Browser checks in this run verified a real local-model summary, the displayed evidence for a resolved deadline update, text import followed by a new content version, exact old text through History, disabled local processing while viewing a historical version, and an actual PNG upload extracting “Assignment due November 22”. A real local API query using a paraphrase returned hybrid retrieval with `nomic-embed-text`, ranking the saved deadline update first. A 375-pixel viewport had a 375-pixel document width with no horizontal overflow; desktop layout was restored and reloaded. These are functional sample checks, not broad quality, mobile interaction or latency benchmarks. The following checks provide repeatable steps and remaining coverage:

| Manual check | Expected evidence to inspect |
| --- | --- |
| Import, organize, restart | Create a course; import text and a real file; edit folder/tags; restart. Confirm saved text, metadata, and exact original download remain available. |
| Versions and updates | Save changed content and inspect both versions. Add the explicit dated announcement example in the [README](../../../README.md); inspect both cited instructions and the explanation. A later capture of the old original must not reverse the decision. |
| Failure visibility | Upload an unsupported media file or inaccessible capture resource. Confirm per-item limitations and original availability; no invented transcript or summary. |
| Responsive UI | Check a narrow viewport, keyboard focus/Escape, import and metadata forms, tabs, history, copy actions, original download, and error feedback. Record observed results separately; the unit suite does not exercise a browser. |
| Local processing | With a manually installed model, request **Process locally**, inspect model provenance and returned notes, then retry with the local service unavailable. Keyword retrieval and originals must remain usable. |

## Connections and format validation still required

- **Actual Codex CLI host:** The stdio SDK test passed. Register the absolute project Node 22 and `dist/mcp/index.js` paths using **Connections & setup**, then exercise search → exact fetch in an actual assistant session. This has not yet been verified. The assistant's configured provider may receive retrieved text.
- **Chrome extension:** Build, load `dist/extension` from `chrome://extensions` in Developer mode, copy the app's masked pairing code, and explicitly save an accessible page and selected resources. The code changes after an app restart. See the [extension guide](../../../src/extension/README.md). Loading and real capture must be recorded as manual evidence, not inferred from the build.
- **Authenticated LMS and protected media:** Canvas, Gradescope, EdStem, logged-in embeds, permissions, and individual-resource failures still require user-authorized testing. No automatic synchronization or unrestricted media acquisition is claimed.
- **macOS OCR:** Images/scanned PDFs use the local Vision/PDFKit Swift helper, compiled on first import with Apple's command-line tools. Native smoke checks on this Mac successfully extracted the known text from both a PNG and scanned PDF; the browser also imported the PNG successfully. These small generated fixtures do not establish quality on real course scans, handwriting or math. The automated PDF test covers a native text layer, not OCR. Ollama is separate from OCR.
- **Ollama:** Only already-installed local models are discovered; downloads are manual. Generation and embedding adapters exist, but the suite's stubbed model-output tests do not benchmark actual quality, model context limits, or latency. Jev remains disabled.
- **Transcription:** UTF-8 VTT/SRT import is supported; the automated cue test uses VTT. No automatic STT is configured by default. An optional explicitly configured local Whisper CLI adapter accepts WAV only and is unverified in this handoff; other media need a manually supplied transcript. No generic video-to-text success is claimed.
- **Broader acceptance:** General policy/relationship extraction, automatic course/folder suggestions, broad multilingual deadline coverage, full authenticated format coverage, accessibility audit, retrieval evaluation, and performance/load benchmarks remain future acceptance work.

## Handoff boundaries

The prototype preserves originals and lexical/manual access when optional AI or extraction adapters fail. This fallback is not evidence that the approved semantic, OCR, transcription, or authenticated-capture requirements have been met. A saved snapshot describes captured evidence, not the current live course state. The implementation is a local single-user tool and has not been validated as a hosted or multi-user service.

No API keys, pairing-code values, browser credentials, or course originals belong in this verification record or repository. Keep runtime data local, use the generated setup paths, and record each remaining integration check with its actual environment and outcome.
