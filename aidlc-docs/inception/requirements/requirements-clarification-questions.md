# Course Copilot — Targeted AI-DLC Requirements Clarification Questions

**Status:** All eight clarifications resolved using the user's explicit acceptance of recommendations and Q24/Q31/Q5-Q6 refinements. This resolves the question gate, not formal requirements approval.

## Clarification 1 — Q14: Can students correct AI-organized metadata?

**Why this is unresolved:** You selected Q14=C (no manual corrections), but the original product description says the student can confirm/correct classification, and Q11=A requires a student decision when classification is uncertain. An automatic incorrect classification must have a recovery path.

A) **Editable metadata** — Allow corrections to course, folder, title, tags, and authority notes after saving. Recommended for trust and usability; modest UI effort.

B) **Course/folder correction only** — Keep classification fixable, but regenerate titles/tags automatically; simpler UI but less control.

C) **No post-save editing** — Preserve Q14=C literally. Students could only recapture/reindex, potentially leaving mistakes unresolved.

X) Other — Describe exact editable fields and when.

[Answer]: A
## Clarification 2 — Q17: How far does the knowledge graph go in the MVP?

**Why this is unresolved:** You want something similar to a knowledge graph, but a true open-ended graph and a hierarchy with typed edges are materially different projects.

A) **Graph-ready typed links (recommended)** — Course/topic/document/version/fact nodes with explicit relations (related, updates, supersedes), stored in SQLite; no dedicated graph database or automatic arbitrary entity graph.

B) **Full generated semantic graph** — Extract arbitrary entities/relations automatically and offer graph traversal/query, with significantly more extraction/evaluation effort.

C) **Simple hierarchy first** — Defer explicit relationship edges, which weakens conflict/version reasoning.

X) Other — Specify required node/edge types and views.

[Answer]: A
## Clarification 3 — Q18: Semantic similarity versus document identity

**Why this is unresolved:** Combining Q18=A+C can accidentally merge unrelated documents (e.g. a syllabus and an announcement both discussing Homework 4).

A) **Deterministic identity + suggested semantic links (recommended)** — Source URL/ID and content hash determine recapture/version; semantic similarity proposes duplicates or relationships for review, never silently merges originals.

B) **Automatic semantic merging** — AI similarity can assign shared identity, requiring stronger error-recovery and audit logic.

C) **Deterministic identity only** — No semantic duplicate suggestions; easiest and safest.

X) Other — Describe merge rules.

[Answer]: A
## Clarification 4 — Q24: How to describe freshness without automatic syncing?

**Why this is unresolved:** You chose B (assume old captures remain current), but new changes on LMS pages cannot be detected unless the user revisits/recaptures them.

A) **Show last-captured timestamp and unknown freshness (recommended)** — Resolve among *known saved versions* while clearly avoiding claims that the LMS itself has not changed.

B) **Assume saved information is externally current** — Preserve literal Q24=B, accepting the risk of incorrect 'current' claims.

C) **User-confirmed current** — Allow student to mark a source as reviewed, with timestamp; still no automatic external verification.

X) Other — Define freshness guarantee.

[Answer]: A — show URL and capture date; no routine stale warnings
## Clarification 5 — Q27: What if Jev is unavailable?

**Why this is unresolved:** You answered 'already answered. manual maybe?' but Q27 asks for a failure-mode decision, not manual capture.

A) **Deterministic fallback (recommended)** — Full-text and metadata-filtered retrieval still work; filing can be manual, and low-confidence AI enhancements are skipped.

B) **Manual browse/search only** — Keep stored content available but disable automated retrieval when Jev fails.

C) **Fail all search/ingestion** — Simplest error path but brittle during demo.

X) Other — Define fallback and user-visible notice.

[Answer]: A
## Clarification 6 — Q31: Which actual MCP client is the required first end-to-end test?

**Why this is unresolved:** 'Local MCP' specifies transport, not which host is tested and documented.

A) **Claude Desktop** — Desktop app uses a local server; good demo-oriented workflow.

B) **Claude Code or Codex CLI (recommended for the development team)** — Run a local MCP server and demonstrate calls from a coding assistant/terminal; less standalone UX polish.

C) **Both desktop and CLI clients** — More portable but additional testing/configuration.

X) Other — Name a concrete local MCP host and its test approach.

[Answer]: B — Codex CLI first
## Clarification 7 — Q37: Is any captured course text allowed to go to hosted Jev?

**Why this is unresolved:** You chose local-first storage/Ollama by cost, but Jev is externally hosted. Using Jev for classification/ranking sends some input text off-device unless substituted.

A) **Selective and disclosed Jev API use (recommended if Jev is a core feature)** — Send only necessary title, excerpt, or candidate snippet after an explicit user-controlled opt-in; local Ollama handles full-document summaries.

B) **Strictly offline course content** — Do not call hosted Jev on captured materials; use local heuristics/model instead.

C) **Hosted Jev may process complete text** — Simplifies classification but raises privacy/compliance and variable cost risks.

X) Other — Define exact transmission, consent, and redaction policy.

[Answer]: A
## Clarification 8 — Q5/Q6: What does 'all content types' require in the tested demo?

**Why this is unresolved:** Your answer requires Canvas, Gradescope, EdStem, internet pages, PDF, images, screenshots, equations and embedded media. Those vary from plain text parsing to OCR and transcription.

A) **Broad import, focused extraction (recommended for deadline)** — Test all three LMS page-save paths and arbitrary webpage/PDF import; preserve images, equations and embedded-media links/attachments; extract text where accessible, with manual fallback for otherwise opaque media.

B) **Complete machine-readable extraction** — Require tested screenshot/image OCR, math extraction, and audio/video transcription across sources, in addition to source capture. Significantly higher scope/risk.

C) **Prioritize fidelity for fewer formats** — Reduce required scope to HTML/PDF and defer image/media extraction; explicitly revise Q6.

X) Other — State the mandatory per-platform/per-format acceptance tests.

[Answer]: B — extract all accessible content using native text, OCR/transcription when needed; explicit partial status for inaccessible media
## Notes on resolved interpretations (do not re-answer unless incorrect)

- **Q19 + Q23:** preserve all versions, search only latest applicable by default; browsing history is allowed.
- **Q21:** comprehensive checks for deadlines and policy; broader semantic contradictions only best-effort.
- **Q26:** ingestion classification plus optional query routing/relevance screening and reranking.
- **Q28:** `search` returns compact ranked previews; `fetch` returns actual sourced text and optionally original file/resource.
- **Q30:** manual demo and automated fixtures.
- **Q35 + Q36:** Ollama with a named small local model, TypeScript end-to-end, subject to smoke tests.
- **Q43:** partial property-based testing selected on the user's instruction to choose.

**AI-DLC gate:** All eight responses have been reconciled with the decision register and requirements draft. Formal Requirements Analysis approval still requires team review, PR feedback, and explicit approval recorded in audit/state.