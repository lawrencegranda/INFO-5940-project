# Course Copilot — Product Vision

**Course:** Cornell INFO 5940, Fall 2026, Group 17  
**AI-DLC:** v1.0.1, Inception  
**Review status:** November 23 revised Inception artifacts approved by [Lawrence’s approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) at 2026-11-23T22:37:29Z on existing PR #8. Baseline input approval on 2026-11-19T19:26:39Z remains historical. Inception is complete through Units Generation; STOP before Construction.

**Current scope:** The MVP centers on local Ask and read-only local MCP with their supporting native-text/PDF evidence library. Jev and advanced media features are retained for later iterations. The [delivery allocation](../aidlc-docs/inception/requirements/mvp-scope.md) identifies the approved current commitments and retained deferred work.

## Problem

Students use AI assistants for coursework, but relevant material is dispersed across authenticated learning platforms, documents, announcements and research resources. Uploading all materials into a chat creates context overload. Flat document retrieval often treats old and new information alike, missing changes in deadlines, assignment rules and other substantive facts. Students need course-specific answers grounded in attributable saved evidence and visible uncertainty.

## Product

Course Copilot is a **local-first, private, multi-course knowledge library with Ask and local MCP**. It preserves original sources, links, capture dates, versions, extracted evidence, course/topic organization and typed relationships. Students can ask grounded course questions in the local interface, or use an external assistant such as Codex through the read-only MCP tools. Both paths use ranked, attributable saved evidence and expose uncertainty.

## Primary user and journey

Maya is a synthetic first-year MPS Information Science student taking INFO 5940, HCI 5300 and ML 4100, not a researched participant. She saves an accessible page from Canvas, Gradescope, EdStem or the web with the Chrome extension, or imports a local document. She confirms/corrects course and folder as needed; the library preserves originals and source dates, extracts text and indexes it. She then selects a course and asks a question in the local interface without configuring a terminal. Ask searches then fetches exact evidence and returns a cited answer. A technical pilot can also connect Codex through local MCP; actual CLI integration remains a required later test.

For example, a saved syllabus gives Assignment 2 a November 20 deadline, a supported instructor message explicitly moves it to November 22, and Maya's notes say November 24. The answer can explain the supported instructor update while showing the note's disagreement. A student note, a platform label or a model guess cannot establish instructor authority. These are illustrative saved materials, not a live course policy or a completed test.

## MVP — target by December 16, 2026

1. **Capture:** Explicit user-triggered saving of accessible pages from Canvas, Gradescope, EdStem, and ordinary sites; local imports including research papers and PDFs. Discover embedded resources and retrieve them only where authorized. Extract available native page/PDF text and preserve supported originals. OCR, advanced visual/math recognition and audio/video processing are later work. Clearly label inaccessible, unsupported, partial, or failed extractions.
2. **Organize:** Multiple isolated courses, folders/topics, tags and editable classification; local original files/snapshots, provenance URLs, capture times and any known publication/effective dates. Manual filing and local-model suggestions remain available; Jev-assisted classification is retained for later delivery.
3. **Build knowledge:** Incremental source-linked summaries, a searchable index, immutable saved versions, and typed relationships among courses/topics/documents/versions/facts (without requiring a graph database).
4. **Respect change and uncertainty:** Highlight substantive changes and contradictory *saved* information, especially assignment deadlines, exam logistics and instructions. Use explicit dates/source authority/supersession rules; preserve competing evidence and flag unresolved uncertainty. Never claim to know about changes that have not been captured. Ordinary static documents need no generalized staleness warning.
5. **Retrieve:** Local hybrid full-text/semantic search and version filters, with two-step MCP tools for search previews then source fetch. Codex is the first required external client; the six tools remain read-only.
6. **Ask:** Local course-grounded questions with exact evidence citations, visible conflicts/insufficient evidence and per-course progress retained during navigation. Ask uses local retrieval/generation, has no library-write or autonomous-action capability, and shows retrieval-only evidence if the model is unavailable.

## LLM roles and evaluation

Use a local model via Ollama for summaries, structured fact extraction and grounded Ask; `gemma3:4b` is the first candidate pending laptop testing, with Qwen/DeepSeek comparisons proposed by reviewers. Select embeddings separately. Hosted [Jev from TypeSafe AI](https://github.com/TypeSafeAI/typesafe-playground) is a typed-decision API retained for later classification/routing/reranking, with minimal-payload permission requirements. It is not connected or required in the current MVP. Ask itself uses local-only retrieval/generation. Send no credentials or unapproved source files. Deterministic code handles identity, versions, citation validation and supported precedence. Future tests cover conceptual cited answers, instructor updates versus notes, course isolation, navigation continuity, model failure and extraction gaps.

## Deferred features — retained for later work

- Jev-assisted classification, routing/reranking and the corresponding hosted-permission workflow.
- Scan/image OCR and advanced equation/diagram recognition; original preservation/viewing and available native text remain in the MVP.
- Audio/video-specific acquisition, captions/transcription and timestamped retrieval.
- ChatGPT-specific remote/hosted MCP integration and tunnels.

These capabilities remain part of the product backlog, with their requirements/stories/design contracts preserved. They are outside current MVP acceptance, not removed from the product. No later delivery date is committed.

## Other scope boundaries

The current product does not perform automatic LMS polling/login, credential harvesting, cross-student sharing, arbitrary autonomous actions or a production-level full graph database. Historical originals remain browsable; historical point-in-time search is not required.

## Risks and open implementation validations

Native capture across three authenticated LMS sites, local model/embedding performance, source authority and precise citations remain MVP delivery risks. Site-specific DOMs, embeds and permissions may limit native capture; report status and manual recovery honestly. OCR/transcription, advanced recognition, hosted Jev and remote integration require later feasibility/privacy validation before activation. Those retained capabilities do not block current MVP acceptance.

## Open questions

These unresolved product topics come from [Lawrence's PR #8 review](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660427686). The alternatives remain planning topics; delivery-phase labels below identify which ones concern later iterations.

1. **Starter organization and syllabus suggestions.** Decide whether a new course starts with editable default folders, a syllabus-derived suggestion, or a manual structure. Any generated structure must stay distinguishable from the saved syllabus and correctable by the student.
2. **First-save setup and course identity.** Decide the first-save course-mapping experience. Lawrence proposes confirming an LMS course-ID mapping once and remembering it, with local/PDF imports explicitly confirmed as needed. Reconcile any change with FR-06 and US-09 before adopting it; no automatic LMS synchronization or login automation is implied.
3. **Recordings and accessible captions — later work.** Evaluate existing authorized captions and local transcription in a later iteration. The proposed `whisper.cpp`/`small.en` path is unverified; successful recording processing is not required for current MVP acceptance.
4. **Laptop resource coordination.** Decide how native extraction, summaries, Ask and embeddings share the MVP laptop; add transcription coordination when that deferred adapter is developed. Lawrence proposes one heavy background job at a time. Preserved originals and local keyword search must remain available; actual latency budgets and model configurations still require measurement and review.
5. **Partial capture and recovery.** Decide how a selected resource's failure, omissions, retry and manual-upload alternative remain visible without hiding successful content or erasing earlier originals. A captured parent page must not imply that an inaccessible child was processed.

Model validation, detailed later adapters and owner acceptance remain in the [decision ledger](../aidlc-docs/inception/reviews/step2-review-package.md#7-pending-decisions-and-actual-missing-evidence). The MVP/later-work boundary is explicit in the [scope allocation](../aidlc-docs/inception/requirements/mvp-scope.md); future implementation details do not all need resolving for Inception review.

## Milestone boundary

By **November 24, 2026, 11:59 PM EST**, finish team-approved AI-DLC **Inception through Units Generation** only. Do not enter Construction or write application code for that milestone. The final build/demo is due **December 16, 2026**.
