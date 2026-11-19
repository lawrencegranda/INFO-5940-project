# Course Copilot — Decision register (AI-DLC v1.0.1)

**State:** All 43 requirement-question decisions resolved, eight clarifications explicitly accepted, and three further refinements integrated. **Ready for Requirements Analysis stage gate approval**, with full reconciliation logged in `aidlc-docs/audit.md`. This document is part of the `candidate/course-copilot` Inception track.

## Product intent and non-negotiable distinctions

- This is a **private, multi-course second-brain / wiki-like knowledge provider**, not a second chatbot.
- Its differentiator is **structured, source-linked, version-aware retrieval**, rather than uploading entire course corpora or using only flat RAG.
- **Original document/snapshot, source URL, captured time, publication/effective time when known, and immutable observed versions** are separate from generated descriptions and indexes.
- **Full-content capture and selective text extraction:** capture every accessible component of the selected page/file, including embedded documents or media when fetchable with permission; derive indexed text via native extraction, OCR or transcription when needed. Maintain explicit per-item extraction status. Inaccessible media are not represented as fully extracted.
- **Calm freshness UX:** ordinary documents show source URL and capture date in details, without blanket stale-warning badges. Flag only observed conflicts, known supersessions, extraction gaps, or evidence of meaningful changes; never claim live LMS freshness without checking.
- **Latest applicable** is determined by source relationships and precedence, not just the newest crawl/capture timestamp. Manual ingestion cannot guarantee that an unsaved update is known.
- Retrieval is **progressive**: ranked compact candidates, then explicit source fetch, to control context size.
- **No silent contradiction resolution** where the evidence does not establish authority. Suppressing or erasing old content is not allowed.
- **Read-only local MCP** initially; external chat happens in the student's own assistant. No cloud deployment or sharing required.

## Answer-by-answer traceability

| Q | User answer (verbatim) | Reconciled selection | Status and decision |
|---:|---|---|---|
| 01 | A | A | **Locked:** One student, private library |
| 02 | A+B = C | C | **Locked:** Both version/deadline and conceptual grounded-Q&A demos |
| 03 | B | B | **Locked:** Multiple independent courses per student |
| 04 | A | A | **Locked:** Success criterion: end-to-end demo; automated tests still required under Q30 |
| 05 | C + able to add things from internet easily (like articles or research papers, or other PDFs) | C + custom (confirmed) | **Locked:** Canvas, Gradescope, EdStem, general webpages, research papers/PDFs; capture full accessible content with explicit coverage status. Student can also upload local files. |
| 06 | C / all | C + conditional text conversion (confirmed) | **Locked:** HTML, PDFs, images, screenshots, equations, embedded audio/video and files. Extract all accessible content; OCR/transcribe as needed for search, preserve originals, and mark partial/failed extraction. |
| 07 | chrome | A | **Locked:** Chrome Manifest V3 first |
| 08 | A - but need to indentify if a file is embeded or similar | A + embedded discovery | **Locked:** User-initiated capture; detect linked/embedded documents for optional inclusion |
| 09 | B | B | **Locked:** Browser extension and local file upload |
| 10 | C | C | **Locked:** Jev suggests course/folder, auto-save only above confidence threshold; below threshold require review |
| 11 | A | A | **Locked:** Require user confirmation when categorization is uncertain |
| 12 | B | B | **Locked:** Preserve original snapshots/files, text, metadata and provenance |
| 13 | B | B | **Locked:** Course/folder/document hierarchy, tags, typed relationships; no graph DB required |
| 14 | C - for now, we can revisit | B (Clarification 1 = A approved) | **Locked:** User may correct course, folder, title, tags, and source/authority metadata after saving. Original content and observed history remain immutable. |
| 15 | C - ideally a knowledge graph similar | C | **Locked:** Document summaries and source-linked hierarchical course/topic index; graph-ready |
| 16 | A | A | **Locked:** Incremental index updating after saves/changes |
| 17 | ideally a knowledge graph similar | B (clarification approved) | **Locked:** Graph-like typed edges among course/topic/document/version/fact nodes, stored in relational tables; no dedicated graph database or arbitrary generated graph required in the MVP. |
| 18 | A + C maybe | A + suggested relations (clarification approved) | **Locked:** URL/source ID + content hash defines version identity. Semantic similarity only suggests links/duplicates for review; do not silently merge unrelated originals. |
| 19 | A maybe, but only access latest? | A | **Reconciled:** Keep every observed version; default retrieval latest applicable and let user inspect historical versions |
| 20 | B | B | **Locked:** Use explicit source authority, publication/effective dates, and supersession; flag uncertainty |
| 21 | A + B +C (little on C). not EVERY contradiction, but substantivbe ones | B + limited C | **Reconciled:** Systematic deadline/exam logistics/assignment-policy checks; other substantive conflicts best-effort |
| 22 | B | B | **Locked:** Expose both sources and uncertainty where priority not safely resolved |
| 23 | B | B | **Locked:** Default searchable corpus is latest applicable; history browsable but no historical query filter required |
| 24 | B | A with non-alarmist presentation (confirmed) | **Locked:** Always retain source URL and captured-at timestamp. Show these in source details; do not flag ordinary static documents solely because time elapsed. Warn on observed substantive conflict/supersession or known change, but never promise external sources remain current. |
| 25 | B / knowledge search / RAG? similar | B | **Locked:** Hybrid keyword/vector retrieval with metadata and version filters; simple full-text fallback |
| 26 | A/B maybe? | B (A included) | **Reconciled:** Use Jev for ingestion classification plus optional query routing/relevance/reranking |
| 27 | already answered. manual maybe? | A (clarification approved) | **Locked:** If Jev is unavailable, use deterministic filing/manual correction and keyword/full-text/metadata retrieval. Do not disable library access or silently trust uncertain outputs. |
| 28 | A + B? like give a list first of potential with summaries, and then another MCP to fetch the actual content of the doc. maybe in text? or file? not sure | X — two-step search/fetch | **Reconciled:** First MCP tool returns ranked metadata+summaries+conflict flags; separate MCP tool fetches text excerpts/full source; optional original resource/file |
| 29 | already answered?  but maybe raise conflict and maybe B? | B | **Reconciled:** Expose relevant competing sources and conflicts, not just one selected passage |
| 30 | A + B | A + B | **Locked:** Manual demo scenarios plus automated fixture tests; no large user study |
| 31 | for now, local MCP? maybe hosted later? | B — Codex (confirmed) | **Locked:** First end-to-end client is Codex with a local read-only MCP server; other clients/hosted MCP are later extensions. |
| 32 | local MCP is probably fine and neough | B | **Reconciled:** Local MCP client sufficient; ChatGPT/hosted remote MCP later |
| 33 | read-only | A | **Locked:** Read-only MCP tools: list, search, fetch, inspect version/conflict |
| 34 | A no chat | A | **Locked:** No embedded conversational AI; lightweight browsing of library is allowed |
| 35 | B - cheap and easy | B | **Locked, model pending smoke test:** Local Ollama model for summaries/structured extraction; propose gemma3:4b as first candidate |
| 36 | whichever is easiest and best | A (agent selection) | **Reconciled:** TypeScript end-to-end, Node local backend, SQLite and TypeScript MCP; lower integration overhead |
| 37 | cheapest and best | A (clarification approved) | **Locked:** Database and original content stay local. Local Ollama handles private full-text extraction/summaries; hosted Jev may receive only user-approved minimal excerpts/metadata with explicit disclosure and local fallback. |
| 38 | A / no API tokens | A | **Locked:** Read current LMS page in extension; never collect cookies/passwords/tokens |
| 39 | A | A | **Locked:** No cross-user sharing or cloud collaboration |
| 40 | B, we can do our own courses (like team members) | B | **Locked:** Demo with authorized real courses/team materials; synthetic fixtures still permitted for automated tests |
| 41 | B | B | **Locked:** Do not enable optional Security Baseline; mandatory security precautions still apply |
| 42 | B | B | **Locked:** Do not enable optional Resiliency Baseline; targeted reliability requirements still apply |
| 43 | IDK, you think and pick | B (agent selection) | **Reconciled:** Partial property-based testing for pure transformations, versioning invariants and round trips |

## Final reconciliation — clarifications closed

- **Q14:** Original selection C superseded by user approval of editable metadata (original option B). AI suggestions remain correctable; immutable originals are not rewritten.
- **Q17:** Graph-like typed relationships are required; a full open-ended knowledge graph and dedicated graph database are not required in this MVP.
- **Q18:** Re-capture uses source ID/normalized URL and content hash. Semantic matching proposes related or duplicate links but never silently merges.
- **Q24:** Source URL and last capture time are preserved and accessible. Most documents need no special stale-warning banner. Only flag grounded, substantive conflicts/changes or observed supersessions. No live freshness assertion from manual capture.
- **Q27:** Search and filing remain usable without Jev through text/metadata search and manual correction.
- **Q31:** **Codex** is the first required MCP host. MCP is local and read-only; remote/other clients are not first-release requirements.
- **Q37:** Local storage and local Ollama by default. Any Jev transmission is selectively opted in with minimal content and disclosure; never assume external AI processing is permitted for course material.
- **Q5/Q6:** Full capture of accessible selected page/file, including discovered embedded content when permissions allow. The pipeline extracts text directly where available; OCR for image/scan text, speech-to-text for audio/video where search requires it, preserving original assets. A file that could not be fully extracted is explicitly marked partial/unsupported instead of being falsely labeled complete.
- **Q19/Q23:** Save old versions; by default search the latest applicable *saved* evidence, while allowing history inspection.
- **Q21/Q29:** Systematically check substantive schedule and assignment-policy changes; other semantic conflicts best-effort. Unresolved conflicts return competing source evidence.
- **Q28:** Search returns compact ranked previews, metadata and conflict flags. Separate `fetch` retrieves passages and, when host supports, file/resource link or original content.
- **Q35/Q36:** TypeScript, SQLite and Ollama are the agreed cost-conscious path; specific model remains a runtime smoke-test choice rather than a locked claim of compatibility.
- **Q43:** Partial property-based testing for deterministic transformations and version invariants.

**No remaining decision question from the initial 43 or eight clarifications.** Execution planning still must verify actual embedded-media capture, OCR/transcription quality, laptop performance and hosted Jev permission. These are delivery risks and acceptance-test tasks, not unresolved product direction.

## Scope and schedule warning

The committed breadth (three authenticated LMS sites + arbitrary internet sources + documents/images/math/embedded media) presents the largest December 16 delivery risk. Keep the breadth requirement visible and decide the per-source/per-format minimum acceptance test. Do not quietly reduce it to a single Canvas-only integration.

## Workflow compliance

- User-selected optional extensions: **Security No (Q41), Resiliency No (Q42), Property-Based Testing Partial (Q43)**.
- Mandatory course rubric extension remains enforced.
- All 43 original questions and eight clarifications are resolved. Ready for explicit user approval of Requirements Analysis before marking the stage complete in `aidlc-docs/aidlc-state.md` and proceeding to User Stories.
- Course Copilot Requirements Analysis artifacts are tracked on `candidate/course-copilot` (separate from `main` while candidate proposals are evaluated).