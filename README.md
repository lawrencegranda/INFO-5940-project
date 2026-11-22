# Course Copilot — INFO 5940 Group 17

A local course library that preserves saved sources, makes course materials searchable, and gives an existing assistant read-only access through MCP. There is no built-in chat interface.

This branch contains a runnable prototype following the approved Course Copilot Inception artifacts. Course Copilot remains a candidate alongside Marketing Campaign Asset Copilot; this prototype does not imply whole-team selection or completion of the full December MVP. Follow [AI-DLC state](aidlc-docs/aidlc-state.md), the [audit](aidlc-docs/audit.md), and the [prototype plan](aidlc-docs/construction/plans/local-prototype-plan.md) for workflow status.

## Run locally

Use Node.js 20 or newer with npm to install dependencies. `npm ci` also installs the project's Node 22 runtime; npm scripts use that local executable, which supplies `node:sqlite`. A system Node 20 executable alone cannot run the library.

From the repository root:

```sh
npm ci
npm run build
npm run dev
```

Open [http://127.0.0.1:4310](http://127.0.0.1:4310). Keep the terminal running and press Ctrl+C to stop. `npm run dev` watches frontend changes; restart it after backend edits. After an existing build, `npm start` runs the app without the frontend watcher.

The first launch of an empty library loads clearly labeled synthetic samples. Their external URLs are inactive. Use **New course** and **Add material** to save your own sources; the samples are examples, not evidence that real LMS access has been tested.

Data is stored in `.course-copilot/` by default: SQLite metadata/indexes and saved original files. It survives restarts and is ignored by Git. Stop the app before copying this whole directory for a backup. To use another location, set `COURSE_COPILOT_DATA_DIR` to an absolute directory for both the app and its MCP process.

If a direct command reports that `node:sqlite` is unavailable, use the project runtime rather than the system `node`:

```sh
./node_modules/node/bin/node --version
```

## Try the source and update workflow

1. Create a course, then use **Add material → Paste text**. Save `Assignment 1 is due November 20, 2026.` as a syllabus with a source URL and publication date.
2. Add an announcement from a different URL: `Assignment 1 deadline moved from November 20, 2026 to November 22, 2026.` Give it a later publication date.
3. Open **Known updates** or the material's **Conflicts** tab. The supported update shows both saved statements and explains the decision. A disagreement without sufficient update evidence stays unresolved.
4. Open a material's **Source** tab to inspect saved text, download its original, and copy a version-specific citation. Use **Save new version** to create a new content version, then inspect **History**. Editing a title, folder, or tags preserves the saved original.

Deadline detection currently uses narrow English rules for recognized assignment/project/exam names and dates. Capture recency alone never selects a winning instruction. General policy conflicts, multilingual fact extraction, automatic course/folder suggestions, and a full typed knowledge graph are future work.

## What runs today

| Area | Current behavior and limits |
| --- | --- |
| Local library | Multiple courses; manually chosen course, folder, type, and tags; SQLite persistence; separate course memberships and source identity. |
| Capture and import | Paste UTF-8 text, upload a file, or explicitly save an accessible page and selected resources with the Chrome extension. No scheduled LMS synchronization. |
| Text extraction | UTF-8 text/Markdown/CSV/JSON/XML, sanitized HTML, and native-text PDF. Saved originals remain available when extraction is partial, failed, or unsupported. |
| OCR | macOS Vision/PDFKit adapter for images and scanned PDFs, compiled locally on first use. Requires Apple's command-line developer tools. Other platforms need manual text; OCR coverage and quality must be checked on your files. |
| Transcripts and media | VTT/SRT files import supplied text with cue locations. There is no automatic audio/video transcription in the default setup. An explicitly configured local WAV-only Whisper CLI adapter exists but is not verified in this handoff. |
| Search | Course-scoped keyword retrieval, source filtering, updates/issues views, and optional local vector ranking when compatible embeddings exist. Retrieval reads saved material; it does not check the live LMS. |
| Evidence | Original bytes, content hashes, versions, capture observations, extraction revisions, passages, and citations. Repeated unchanged capture records another observation; it does not duplicate the content version. |
| Local AI | Optional Ollama summaries and embeddings. Unavailable models leave source excerpts and keyword search available. Model quality and latency are not guaranteed by an installed-model status. |
| MCP | Six read-only stdio tools plus a bounded original-file resource. No ingestion, metadata editing, storage initialization, or index rebuilding through MCP. |
| Hosted services | Jev is disabled. Core library use requires no paid model provider. An external assistant may still send retrieved text to its own configured provider. |

Current UI file uploads are limited to 25 MB. HTML parsing is limited to 2 MB, UTF-8 text decoding to 8 MB, extracted text to 2,000,000 characters, and PDF processing to the first 100 pages. Embedded image text inside native-text PDF pages is not independently OCRed. Inspect each material's processing limitations rather than treating a saved original as a promise of complete extraction.

## Optional local AI

The app works without Ollama. If you want local summaries or semantic ranking, start your own Ollama installation and check the models you already have:

```sh
ollama serve
```

In another terminal:

```sh
ollama list
```

No model is downloaded automatically. If needed, choose and download models manually using Ollama before running the app. The current defaults are `deepseek-r1:latest` for generation and `nomic-embed-text` for embeddings. To use different installed models, export `OLLAMA_MODEL` and `OLLAMA_EMBED_MODEL` before starting the app. `OLLAMA_URL` defaults to `http://127.0.0.1:11434` and accepts only a local loopback origin. Shell environment variables are used directly; `.env` is not automatically loaded.

Open **Connections & setup** to inspect actual local capability status. **Process locally** on a current material requests a summary and refreshes available embeddings; newly imported text also attempts embedding if its configured model is available. An unavailable or failed model leaves the original and keyword index intact and reports the limitation. Summary requests currently accept at most 14,000 source characters. OCR is a separate macOS adapter and does not use Ollama.

## Chrome capture extension

1. Run the local app and `npm run build`.
2. In Chrome, open `chrome://extensions`, enable **Developer mode**, and select **Load unpacked**. Choose the repository's `dist/extension` directory.
3. In the app, open **Connections & setup** and copy the masked pairing code. Paste it into the extension's connection panel. Pair again after restarting the app, which creates a new code.
4. Open a page you can access, invoke the extension, choose a course and any permitted resources, and select **Save to library**. Keep the popup open until it finishes.
5. Review saved items and processing limitations in the library. Protected or inaccessible resources need an authorized manual upload.

The extension requests access when you explicitly save. It saves a sanitized page snapshot and selected resources; it does not copy browser cookies, request headers, or LMS tokens into the library. Its limits are 2 MB of page HTML, 25 discovered resources, and 8 MB per selected asset. See the [extension guide](src/extension/README.md) for acquisition and permission details.

Actual authenticated Canvas, Gradescope, EdStem, protected embeds, and media have **not been verified**. Source labels in the UI are not API integrations or proof that all content on those sites can be captured.

## Read-only MCP connection

Run the app once to create a library, and build the prototype. **Connections & setup** generates a Codex registration command using the absolute paths of this checkout's project Node 22 executable and `dist/mcp/index.js`. Copy that command into a terminal with your existing Codex CLI installation. Keep the project in that location or update the registered paths after moving it.

The underlying stdio process must use these paths, with the placeholder replaced by your actual checkout directory:

```sh
"/absolute/path/course-copilot/node_modules/node/bin/node" "/absolute/path/course-copilot/dist/mcp/index.js"
```

The six tools are `list_courses`, `search_course`, `fetch_document`, `fetch_passages`, `get_document_history`, and `get_conflicts`. List courses first, then keep the returned course and exact version/extraction/passage references when fetching. Full-text and original-file responses are bounded and provide continuation information.

The automated suite verifies a real SDK client talking to the saved SQLite library over stdio. **A connection from an actual Codex CLI session has not yet been verified.** Local storage and transport do not determine where an assistant's model runs: review your assistant's settings before sharing retrieved course material. MCP does not use the extension's pairing code. With a custom data directory, configure the same `COURSE_COPILOT_DATA_DIR` for the MCP process.

## Verify and continue development

```sh
npm run typecheck
npm run build
npm test
```

The current integrated check passes TypeScript, the build, and **49 tests across four files**. These cover persistent SQLite/original-file behavior, scope isolation, version references, deadline rules, local API boundaries, extraction/model-gateway contracts, and read-only MCP stdio behavior. Browser checks also exercised a real local summary, displayed deadline-update evidence, and imported/changed/historical saved text. These checks do not establish real LMS coverage or general local-model quality. See [prototype verification](aidlc-docs/construction/build-and-test/prototype-verification.md) for evidence and remaining manual checks.

Application code is in `src/`, tests in `tests/`, build scripts in `scripts/`, and generated assets in `dist/`. Requirements and design remain in `aidlc-docs/inception/`; implementation notes and verification belong in `aidlc-docs/construction/`.

## Course and collaboration context

Cornell University · **INFO 5940: Special Topics in Information Science (AI Chatbots, RAG, AI Agents)** · Fall 2026. Methodology: **AI-DLC v1.0.1** ([pinned workflow release](https://github.com/awslabs/aidlc-workflows/releases/tag/v1.0.1)). The Inception milestone is due November 24, 2026 at 11:59 PM EST; the final project is due December 16. See the [assignment and rubric](course-materials/mid-semester-milestone.md).

| Name | NetID | GitHub | Coding agents |
| --- | --- | --- | --- |
| Lawrence Granda Zarzuela | `lg626` | [lawrencegranda](https://github.com/lawrencegranda) | Claude Code, Codex, Cursor, Antigravity |
| Jiaxin (Iris) Li | `jl2726` | [irisli0926](https://github.com/irisli0926) | Claude Code, Codex |
| Xiaolong Lin | `xl2333` | [xiaolonglin1124-bit](https://github.com/xiaolonglin1124-bit) | Claude Code, Codex |
| Safiullah Safdariyan | `ss3322` | [safi902](https://github.com/safi902) | Claude Code, Codex |
| Chloe Wang | `sw2322` | [chloeshixuanwang-bit](https://github.com/chloeshixuanwang-bit) | Claude Code, Codex |

Keep the two candidate tracks separate until the team selects a project. Inception approvals are recorded in upstream PRs [#5](https://github.com/lawrencegranda/INFO-5940-project/pull/5), [#6](https://github.com/lawrencegranda/INFO-5940-project/pull/6), [#7](https://github.com/lawrencegranda/INFO-5940-project/pull/7), and [#8](https://github.com/lawrencegranda/INFO-5940-project/pull/8); this branch does not claim those PRs were merged. Future changes should load the repository's `AGENTS.md` or corresponding agent rules and preserve the shared AI-DLC audit and state.
