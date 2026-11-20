# Local Course Copilot — Prototype Implementation Plan

**Authorization:** The user explicitly requested “我们现在就做吧” after discussing the completed Inception and its course checkpoint. This newer instruction authorizes implementation now and takes precedence over the earlier checkpoint/approval pauses for this prototype. No retrospective formal Construction approval is fabricated.

**Branch:** prototype/local-course-copilot, based on the approved Inception snapshot b12893950f7f87b59f523aed9b337953b59e0f1c. All earlier Inception decisions and audit bytes are retained. Source code lives under root src/, tests/ and config/.

**Outcome:** A runnable local prototype with real persistence, import/search/evidence/history/update workflows, browser capture and a read-only MCP server. Preserve the full approved product direction and clearly report any unavailable adapters or runtime verification. No cloud deployment or paid provider is required for core access.

1. [x] Prepare TypeScript/React/esbuild configuration, shared contracts and local-only dependency setup.
2. [x] Implement SQLite evidence/memberships, immutable versions/passages/originals and repeated-capture receipts.
3. [x] Implement real text/HTML/PDF import, local available OCR/transcription adapters, per-item statuses and original viewing. Native macOS OCR and manual VTT/SRT verified; automatic speech recognition remains an unverified optional adapter.
4. [x] Implement scoped search/fetch/history and evidence-grounded deadline supersession/unresolved conflicts; optional local embeddings with honest availability.
5. [x] Implement responsive course library, import/review/detail/history/conflict UI and real settings/setup interactions.
6. [x] Implement the six-tool read-only stdio MCP adapter and explicit-save Chrome extension. Protocol tests pass; actual authenticated LMS capture and Codex CLI connection remain unverified.
7. [x] Integrate existing local Ollama generation without automatic model downloads; keep Jev disabled unless explicitly configured/consented later. Agent manually installed the official optional embedding model; the application never downloads models.
8. [x] Run meaningful identity/scope/property/API/MCP tests, build/type checks and browser QA; record observed evidence. 49/49 tests, typecheck/build pass; actual local summary, hybrid retrieval, native OCR and browser evidence/version flows exercised. See the verification record for remaining integration/quality limits.
9. [ ] Document quick start, actual capability limits and prototype handoff; publish only through the requested GitHub identity if available.

**Acceptance honesty:** Runtime acceptance is established only by actual checks. Authorized real LMS sessions, protected media, unavailable speech/embedding tools and model quality are not called verified merely because an adapter or fixture exists. Model-free lexical/manual fallback does not replace required future semantic/format success.
