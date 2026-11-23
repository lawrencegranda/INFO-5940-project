# Course Copilot — Requirements Specification

**Course:** Cornell INFO 5940, Fall 2026 · Group 17
**Method:** AWS AI-DLC v1.0.1 · INCEPTION / Requirements Analysis
**Status:** November 23 corrective draft; revised artifact approval is pending. The baseline was approved on 2026-11-19T19:26:39Z after reconciliation of 43 decisions and eight clarifications. That historical approval remains in `aidlc-docs/audit.md`; it does not approve this revision. Work continues on existing PR #8, before Construction.
**Source of decisions:** `requirement-verification-questions.md`, `requirements-clarification-questions.md`, `decision-register.md`, `aidlc-docs/audit.md`.

**Current scope amendment:** Xiaolong reported that the team settled on **Ask and local MCP**, then authorized this corrective pass. Local course-grounded Ask is added as FR-16; FR-14 retains local read-only Codex MCP. The historical Q34 no-chat choice is superseded for this bounded Ask feature, not rewritten. Remote ChatGPT/hosted MCP remains excluded. See the [amendment record](decision-register.md#november-23-scope-amendment--ask-and-local-mcp).

## 1. Intent analysis

- **User request:** Course Copilot is a private student-managed, source-linked and version-aware course library with local Ask and access for external AI assistants via local MCP. It reduces context overload and errors caused by flat retrieval of contradictory/outdated materials.
- **Request type:** New greenfield product.
- **Scope:** Multi-component (Chrome extension, local backend/file store, extraction/indexing, LLM-assisted organization, provenance/version graph, retrieval, MCP tools).
- **Complexity:** Complex integration with authenticated web pages, diverse media and evidence-based updates; local-first MVP due December 16, 2026.
- **Primary user:** One student with several courses. The local library/Ask interface does not require terminal use; Codex CLI remains a required technical integration path, not an assumption about every student's skills. No multi-user cloud collaboration is required.

## 2. Functional requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-01 | Store multiple independent courses, each with folders/topics, tags and source-linked documents. | Two courses can contain separate documents; search scoped to one course does not leak results from another. |
| FR-02 | Capture user-opened accessible content from Canvas, Gradescope and EdStem via explicit Chrome extension Save, plus generic webpages, research papers, PDFs and local file uploads. | End-to-end tests exercise a saved page on each named LMS and a generic webpage/PDF. No login tokens are copied. |
| FR-03 | Discover embedded and linked files/media and allow user-authorized capture of each accessible resource. | Embedded PDF is found and imported or clearly shown as inaccessible/partial with optional manual upload. |
| FR-04 | Preserve original source contents or permitted snapshots, original URL, stable source ID, content hash, capture timestamp and known published/effective dates. | Details show clickable original URL and captured-at; unchanged recapture does not overwrite history. |
| FR-05 | Extract native machine-readable text from pages/documents. Use OCR for scans/images and transcription for accessible audio/video when needed for retrieval; preserve equations/diagrams in original form and extract text/notation where reliable. | Text PDF, scanned page, image, math source and accessible audio/video have demonstrated extraction paths; inaccessible or unparsed content is marked partial/failed/unsupported, never silently called complete. |
| FR-06 | Suggest course/folder and source metadata using Jev when permitted; allow auto-save when sufficiently confident, otherwise require confirmation. Allow corrections to course, folder, tags, title and authority notes. | Uncertain classification prompts correction; a misfiled document can be edited after ingestion without rewriting original source. |
| FR-07 | Incrementally maintain a source-linked course/topic/document summary and searchable passage index. | Saving or recapturing a source updates its index without reprocessing the entire library. |
| FR-08 | Store typed links such as `related`, `duplicate-suggestion`, `updates`, and `supersedes` among documents, versions and facts. | A later announcement can be linked to an earlier assignment requirement and traced back to both passages. Full graph database not required. |
| FR-09 | Treat same-source changed-content recapture as a new preserved version; never silently merge semantic neighbors. | Version history retains both source snapshots; semantic similarity may suggest a link for review but cannot overwrite originals. |
| FR-10 | Extract and compare substantive structured claims (especially deadlines, exam logistics and assignment instructions), applying source authority, publication/effective dates and supersession semantics. | An explicit applicable update with saved evidence establishing instructor authority may supersede the earlier instruction. Student notes/replies, unknown publisher roles, platform labels, model confidence or later capture alone cannot establish that authority. Earlier evidence remains accessible. |
| FR-11 | Flag unresolved substantive conflicts and surface competing evidence. Avoid alarms merely because a document is old. | Two conflicting claims without known precedence display both sources; ordinary unchanged documents have no generic stale warning. |
| FR-12 | Provide hybrid keyword/vector retrieval with course/topic, source, date and version filters. Jev may assist routing/reranking when user authorized. | Both lexical and semantic retrieval work on fixture queries; read-only metadata/full-text fallback still works without Jev. |
| FR-13 | Support two-stage progressive evidence retrieval over local MCP. | Search tool returns compact ranked candidates with metadata/summaries/conflict flags; fetch tool returns actual cited passages/full content where supported, plus source URL/capture/version info. |
| FR-14 | Expose local read-only MCP to **Codex** as the first required external AI host. | Codex connects locally, searches and fetches source-linked passages; the existing six tools do not mutate the library. Local Ask is separately covered by FR-16. |
| FR-15 | Preserve an accessible history viewer but default ordinary retrieval to latest applicable *saved* evidence. | Student can inspect prior versions; search favors applicable known updates but does not imply unseen LMS updates have been detected. |
| FR-16 | Provide local course-scoped Ask over saved evidence, using the local model and read-only retrieval capabilities. | Answers cite exact retrieved source/version/passage references, disclose conflicts and insufficient evidence, and cannot write library data or invoke autonomous actions. Per-course drafts/results survive navigation within the running app; in-flight results stay bound to the initiating course. Model unavailability offers visibly labeled retrieval-only evidence; invalid output returns a safe error without an unvalidated answer, while local browsing/search remains usable. |

## 3. Non-functional requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| NFR-01 | Local-first, single-user deployment with SQLite + local files; no cloud hosting or LMS API key required. | Chrome extension, backend and MCP run on a team laptop and operate with the saved library offline except deliberately enabled hosted features. |
| NFR-02 | Privacy/security by design. No credentials, session cookies or LMS tokens captured; only student-intended content; loopback API access controlled; hosted Jev receives only minimal selected text after explicit permission. | No secrets appear in repository/extensions; externally transmitted text is scoped/opted-in; content instructions treated as untrusted data. |
| NFR-03 | Traceable evidence. No unsupported live freshness claims; all retrieved evidence tied to original URL, document/version and capture timestamp. | An MCP fetch can identify precisely which saved source/version supports each result. |
| NFR-04 | Honest completeness and error reporting. | Every ingestion/extraction has a status (`complete`, `partial`, `failed`, `unsupported`), and unavailable media is visible as such. |
| NFR-05 | Graceful Jev failure. | Search by keyword/metadata and manual classification continue to work when the Jev API is disabled/unavailable. |
| NFR-06 | Repeatable testing. | Vitest fixtures and manual E2E demo cover capture, source tracking, categorization, versions, source authority, substantive conflicts, progressive MCP, grounded Ask/course continuity and offline fallback. Selected property tests cover deterministic pure transformations, serialization and version invariants. |
| NFR-07 | Reasonable demo latency/cost. | Select resource-conscious local Ollama model via practical smoke tests; the system must not depend on paid LLM calls for core document availability/search. |

## 4. Data model and retrieval behavior

- **Nodes/records:** Course, Folder/Topic, Document, DocumentVersion, Source, EmbeddedAsset, Passage, ExtractedFact, Relationship, IngestionRun.
- **Version identity:** Stable source URL/ID plus content hash, with distinct `capturedAt`, `publishedAt` and `effectiveAt` when available.
- **Conflict model:** Match course, subject and claim type first; prefer explicitly superseding applicable sources when saved publisher-role evidence and dates support it; otherwise surface competing passages and uncertainty. Maya's instructor update from November 20 to 22 remains supported while her note saying November 24 remains a visible disagreement, not another authoritative update.
- **Default query:** Search only latest applicable stored versions but keep the historical originals. `Last captured` is displayed in source details. Old timestamps alone are not proof of staleness; no blanket stale warnings.
- **Progressive retrieval:** `list_courses`, `search_course`, `fetch_document` or `fetch_passages`, `get_document_history`, `get_conflicts` (final MCP names established during Application Design). Search yields short previews; fetch yields evidence and source identifiers. Read-only.
- **Ask:** Local UI request carries an explicit course and request identity. C-13/S-05 use bounded local read-only search/fetch plus local generation; answer citations must refer to the evidence actually retrieved. UI continuity does not give the query path library-write capability. Reload-persistent chat history is not required by this amendment.

## 5. Critical user journeys

1. **Save course page:** Open a Canvas/Gradescope/EdStem page → explicit Save → discover and authorize embedded files → extract full available content → classify → confirm/correct as needed → index and store immutable snapshot.
2. **Import external paper:** Save article/PDF from arbitrary webpage or upload file → extract complete accessible content, convert non-text regions when needed → link to course/topic and source.
3. **Retrieve knowledge:** In Codex, search course → inspect ranked candidate summaries → fetch selected evidence → answer from cited passages without loading entire course.
4. **Detect a changed policy:** Capture syllabus and later announcement → identify substantive deadline supersession → return later applicable date, cite both sources and preserve history.
5. **Handle failure:** Jev inaccessible or an embedded media item cannot be downloaded → local search still works; source and extraction status remain visible; optional manual upload path available.
6. **Ask locally:** Select a course → enter a question → retrieve bounded saved passages → receive a grounded answer with exact citations and visible uncertainty. Open Materials and return without losing the course's question/result. A response finishing for another course cannot replace the current course's view.

## 6. Scope boundaries and risks

**In scope:** Chrome extension capture from all three named LMS sites, arbitrary web/paper/PDF and local files; images/scans/math and accessible media extraction pipeline; private local knowledge library; source links, versions and typed relations; meaningful conflict detection; Jev where authorized, local Ollama, hybrid retrieval, local grounded Ask and Codex-local MCP. Jev/media scope-reduction proposals remain unadopted pending a separate decision; this Ask amendment does not silently drop them.

**Out of scope:** Automatic LMS synchronization or unattended login, credential harvesting, cloud collaboration, accounts, universal guaranteed media access/transcription on DRM/restricted third-party embeds, production-level full semantic knowledge graphs, historical as-of search filters, general-purpose autonomous chat/actions, guaranteed detection of every subtle contradiction, remote ChatGPT integration and hosted MCP.

**Important distinction:** User requirement is to capture/extract all **accessible and authorized** content, not to claim impossible access to inaccessible cross-origin or protected media. Unsupported or partial captures must remain visible and not masquerade as fully indexed.

**Primary delivery risks:** authenticated SPA behavior across three sites; media permissions, OCR/transcription quality and performance; local model speed; source/authority inference; evaluation coverage; hosted Jev privacy permission. Define practical fixtures and run smoke tests early.

## 7. Milestone acceptance examples

- **Deadline:** Original syllabus says November 20; later announcement explicitly moves the same assignment to November 22. Retrieval selects Nov 22 as the latest *known saved* instruction, cites newer announcement, notes earlier syllabus and shows URLs/timestamps.
- **Source relevance:** A conceptual question returns scoped, compact ranked evidence previews, followed by requested verbatim saved passages, without entire-course context dump.
- **Capture fidelity:** Page + embedded accessible PDF is saved; scanned input is OCRed as needed; accessible media transcribed when required; failure is explicit and reversible via upload.
- **Trust:** Wrong folder corrected by user, Jev outage doesn't break searches, originals and previous versions remain available.
- **Ask:** A course question receives citations to retrieved saved evidence; unknown/contradictory information is visible. Navigation preserves the draft/result for that course; no-model mode is explicitly retrieval-only. Actual passing application evidence belongs to later Construction.

## 8. AI-DLC stage compliance and next gate

- 43 questions and eight clarifications have an accepted decision interpretation; optional extensions: Security Baseline **No**, Resiliency Baseline **No**, Property-Based Testing **Partial**. INFO5940 course extension mandatory.
- **Current action:** Revise requirements, stories, workflow, design and units together on the existing `inception/05-units-generation` / PR #8 branch. Retain US-01–US-25 and add US-26/FR-16; the current draft has 26 stories, 16 FRs and seven NFRs.
- **Next gate:** Obtain actual team review of the revised artifacts. No new branch/PR, Ready transition, merge or Construction is implied by the driver's authorization to generate the draft.
