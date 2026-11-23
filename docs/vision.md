# Course Copilot — Product Vision

**Course:** Cornell INFO 5940, Fall 2026, Group 17  
**AI-DLC:** v1.0.1, Inception  
**Review status:** November 23 corrective draft on existing PR #8. Baseline input approval was recorded on 2026-11-19T19:26:39Z; revised artifact approval remains pending. The current work concerns Course Copilot.

**Current scope:** Xiaolong reports that the team settled on Ask and local MCP, and authorized the coordinated Step 2 revisions. Focused local Ask is now included alongside the local read-only MCP path. No meeting time/attendees or final team acceptance of the revised artifacts is inferred. See the [decision register](../aidlc-docs/inception/requirements/decision-register.md#november-23-scope-amendment--ask-and-local-mcp) and [review package](../aidlc-docs/inception/reviews/step2-review-package.md).

## Problem

Students use AI assistants for coursework, but relevant material is dispersed across authenticated learning platforms, documents, announcements and research resources. Uploading all materials into a chat creates context overload. Flat document retrieval often treats old and new information alike, missing changes in deadlines, assignment rules and other substantive facts. Students need course-specific answers grounded in attributable saved evidence and visible uncertainty.

## Product

Course Copilot is a **local-first, private, multi-course knowledge library with Ask and local MCP**. It preserves original sources, links, capture dates, versions, extracted evidence, course/topic organization and typed relationships. Students can ask grounded course questions in the local interface, or use an external assistant such as Codex through the read-only MCP tools. Both paths use ranked, attributable saved evidence and expose uncertainty.

## Primary user and journey

Maya is a synthetic first-year MPS Information Science student taking INFO 5940, HCI 5300 and ML 4100, not a researched participant. She saves an accessible page from Canvas, Gradescope, EdStem or the web with the Chrome extension, or imports a local document. She confirms/corrects course and folder as needed; the library preserves originals and source dates, extracts text and indexes it. She then selects a course and asks a question in the local interface without configuring a terminal. Ask searches then fetches exact evidence and returns a cited answer. A technical pilot can also connect Codex through local MCP; actual CLI integration remains a required later test.

For example, a saved syllabus gives Assignment 2 a November 20 deadline, a supported instructor message explicitly moves it to November 22, and Maya's notes say November 24. The answer can explain the supported instructor update while showing the note's disagreement. A student note, a platform label or a model guess cannot establish instructor authority. These are illustrative saved materials, not a live course policy or a completed test.

## MVP — target by December 16, 2026

1. **Capture:** Explicit user-triggered saving of accessible pages from Canvas, Gradescope, EdStem, and ordinary sites; local imports including research papers and PDFs. Discover embedded resources and retrieve them only where authorized. Attempt full accessible extraction using native text first, OCR/transcription where needed. Clearly label inaccessible, unsupported, partial, or failed extractions.
2. **Organize:** Multiple isolated courses, folders/topics, tags and editable classification; local original files/snapshots, provenance URLs, capture times and any known publication/effective dates. Jev may suggest classifications when specifically authorized; manual/local fallback remains available.
3. **Build knowledge:** Incremental source-linked summaries, a searchable index, immutable saved versions, and typed relationships among courses/topics/documents/versions/facts (without requiring a graph database).
4. **Respect change and uncertainty:** Highlight substantive changes and contradictory *saved* information, especially assignment deadlines, exam logistics and instructions. Use explicit dates/source authority/supersession rules; preserve competing evidence and flag unresolved uncertainty. Never claim to know about changes that have not been captured. Ordinary static documents need no generalized staleness warning.
5. **Retrieve:** Hybrid full-text/semantic search and version filters, optional permitted Jev routing/reranking, and two-step MCP tools for search previews then source fetch. Codex is the first required external client; the six tools remain read-only.
6. **Ask:** Local course-grounded questions with exact evidence citations, visible conflicts/insufficient evidence and per-course progress retained during navigation. Ask uses local retrieval/generation, has no library-write or autonomous-action capability, and shows retrieval-only evidence if the model is unavailable.

## LLM roles and evaluation

Use a local model via Ollama for summaries, structured fact extraction and grounded Ask; `gemma3:4b` is the first candidate pending laptop testing, with Qwen/DeepSeek comparisons proposed by reviewers. Select embeddings separately. Hosted [Jev from TypeSafe AI](https://github.com/TypeSafeAI/typesafe-playground) is a typed-decision API and remains a distinct, opt-in baseline for classification/possible retrieval decisions; its proposed deferral has not been adopted by the Ask decision. Ask itself uses local-only retrieval/generation. Send no credentials or unapproved source files. Deterministic code handles identity, versions, citation validation and supported precedence. Future tests cover conceptual cited answers, instructor updates versus notes, course isolation, navigation continuity, model failure and extraction gaps.

## Out of scope for this milestone / MVP

No cloud deployment, automatic LMS polling/synchronization, account/login automation, sharing across students, hosted MCP, ChatGPT-specific remote MCP, arbitrary autonomous actions or full general-purpose graph database. Focused local course Ask is included. Historical versions remain browsable; historical point-in-time query search is not required.

## Risks and open implementation validations

The combination of three authenticated LMS sites and broad media types is a schedule risk. Site-specific DOMs, cross-origin embeds and permissions may limit completeness. Record extraction status honestly and use manual upload fallback. Validate Chrome permission behavior, the Codex MCP connection, Ollama latency/quality, OCR/transcription practicality, vector implementation and rights/privacy constraints before final commitments. These are engineering validation tasks, not unresolved product-direction questions.

## Open questions

These unresolved product topics come from [Lawrence's PR #8 review](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660427686). The alternatives are proposals to discuss, not accepted answers or claims that the prototype already implements them.

1. **Starter organization and syllabus suggestions.** Decide whether a new course starts with editable default folders, a syllabus-derived suggestion, or a manual structure. Any generated structure must stay distinguishable from the saved syllabus and correctable by the student.
2. **First-save setup and course identity.** Decide the first-save course-mapping experience. Lawrence proposes confirming an LMS course-ID mapping once and remembering it, with local/PDF imports explicitly confirmed as needed. Reconcile any change with FR-06 and US-09 before adopting it; no automatic LMS synchronization or login automation is implied.
3. **Recordings and accessible captions.** Decide whether to use existing authorized captions first, then local transcription when captions are unavailable. The proposed `whisper.cpp`/`small.en` path is unverified. Recordings and the existing FR-05 breadth remain required until a real scope change is approved.
4. **Laptop resource coordination.** Decide how extraction, transcription, summaries and embeddings share the demo laptop. Lawrence proposes one heavy background job at a time. Preserved originals and local keyword search must remain available; actual latency budgets and model configurations still require measurement and review.
5. **Partial capture and recovery.** Decide how a selected resource's failure, omissions, retry and manual-upload alternative remain visible without hiding successful content or erasing earlier originals. A captured parent page must not imply that an inaccessible child was processed.

Cross-cutting choices on model validation, Jev, format priorities and owners remain in the [decision ledger](../aidlc-docs/inception/reviews/step2-review-package.md#7-pending-decisions-and-actual-missing-evidence). Ask + local MCP is the new reported team decision; remote integration remains excluded. These Open questions do not all have to be solved to review this bounded revision. No proposed meeting time or module-lead list is evidence of participation or acceptance.

## Milestone boundary

By **November 24, 2026, 11:59 PM EST**, finish team-approved AI-DLC **Inception through Units Generation** only. Do not enter Construction or write application code for that milestone. The final build/demo is due **December 16, 2026**.
