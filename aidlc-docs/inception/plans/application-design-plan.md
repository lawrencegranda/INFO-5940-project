# Course Copilot — Application Design Plan

**Status:** Authorized stage in progress under the explicitly approved execution plan; no separate planning approval is fabricated.

**Inputs:** Approved requirements/decision register, P-01 and US-01–US-25, execution-plan Q1 approval on 2026-11-20T03:18:17Z, application-design.md stage rules and course extension.

**Branch:** `inception/04-application-design`, based on approved Workflow Planning head `ae4ce29f207bf67bc1390a23e3efe06feb9a2dbc`. Integrate #5 then #6 then this stage into `candidate/course-copilot`. Same single driver: xiaolonglin1124-bit.

## 1. Question-category assessment and authorization

The five required categories have been evaluated. No genuinely missing product decision remains. The approved execution plan authorizes this stage and Q36 delegates routine technical choices to the agent. Application Design Steps 6–9 apply to actual unresolved questions; none is invented solely to create another approval round. This plan documents engineering choices transparently and proceeds to artifacts. The required separate design-artifact approval at Step 13 remains pending until artifacts exist.

| Category | Evidence and design resolution | New user question |
|---|---|---|
| Component identification | Requirements identify Chrome MV3, local TypeScript/Node/SQLite library, extraction/indexing and read-only MCP. Use logical modules in one local library runtime, a local browsing UI and separate stdio MCP adapter. Final Units remain a later decision. | None; routine boundaries implement approved scope. |
| Component methods | FR-01–FR-15/stories establish save/import, metadata correction, scoped search/fetch/history/conflicts and explicit statuses. Specify typed contracts, source/version/passage IDs and scoped failures. | None; exact signatures are delegated engineering detail. |
| Service orchestration | FR-04/05/07/09 and NFR-04/05 require preserving originals before derived processing, incremental updates, honest failures and local fallback. Use bounded durable ingestion jobs with independent extraction/AI/index steps. | None; no new product behavior added. |
| Dependencies | SQLite/files store evidence; local model and hosted Jev have separate adapters. MCP depends exclusively on read-only query ports; mutations stay in the user-controlled library API. | None; trust boundaries follow approved requirements. |
| Design patterns | Local single-user cost-conscious TypeScript stack, no hosting/accounts/graph DB. Use modular monolith, adapters, processing pipeline and separated write/query interfaces. | None; microservices or new cloud accounts would conflict with existing constraints. |

There are zero new unanswered product questions. This is a rationale, not a claim that the user explicitly approved unseen detailed interfaces. Detailed algorithms and runtime tool/model choices await later design/measurement; design artifacts require their own explicit review.

## 2. Proposed component map and contracts

| ID | Component | Main responsibility |
|---|---|---|
| C-01 | Capture Extension | User-triggered page/embedded-resource selection; browser-authorized capture; metadata/bytes envelope; no credential/session export. |
| C-02 | Local Library UI | Course/folder browsing, import, uncertain filing review, metadata correction, source/history/conflict inspection; no built-in chat. |
| C-03 | Local Library API | Controlled loopback mutations and UI queries; locally paired extension/UI; input/scope validation and status inspection. |
| C-04 | Ingestion Coordinator | Durable run/item states, original preservation, bounded processing and explicit retry/recovery. |
| C-05 | Evidence Store | SQLite/local originals; stable source identity, immutable versions, separate course memberships and metadata, passages/facts/relations/jobs; read/write ports separated. |
| C-06 | Extraction Pipeline | Native text, OCR, math/diagram preservation and accessible media transcription adapters; location/completeness/error records. |
| C-07 | Local AI Gateway | Ollama generation and local embedding abstraction; untrusted source envelopes; explicit unavailable/invalid output. First generative candidate gemma3:4b, unbenchmarked. |
| C-08 | Hosted Jev Gateway | Minimal scoped classification/routing/rerank only with explicit matching permission; denied/offline result; no full-library or secret upload. |
| C-09 | Organization and Summary | Correctable filing suggestions; incremental source-linked course/topic/document summaries. |
| C-10 | Claims and Relations | Evidence-linked substantive facts, proposed typed edges and claim-scoped precedence/conflict views; models cannot establish authority alone. |
| C-11 | Index and Retrieval | Incremental FTS5/vector indexing; all filters; compact progressive candidates and exact saved evidence; lexical fallback. |
| C-12 | Read-only MCP Adapter | Separate local stdio process with read-only persistence/query access; scoped list/search/fetch/history/conflicts; no ingestion or mutation tools. |

Shared contract concepts: CourseId, SourceId, DocumentId, VersionId, PassageId, FactId, RelationshipId, IngestionRunId; immutable original references; course memberships distinct from source identity; captured/published/effective dates distinct; per-item complete/partial/failed/unsupported plus run progress; citations pinned to exact versions/passages. Final filenames/module packaging and detailed business algorithms belong to later stages.

S-01 Capture/Ingest, S-02 Processing/Index, S-03 Metadata/Review and S-04 Evidence Query orchestrate these components. They are logical services, not independently hosted microservices. Writes occur only on authorized library paths; the query service/MCP cannot mutate evidence or regenerate persisted indexes on demand.

## 3. Generation and validation checklist

- [x] Load approved context and check stage prerequisites.
- [x] Fetch/status and inspect open PRs/feedback; no competing teammate stage.
- [x] Evaluate all five question categories; preserve resolved decisions and explain routine choices.
- [x] Document component/service direction and required contract boundaries.
- [ ] Generate `application-design/components.md` with definitions, responsibilities and interfaces.
- [ ] Generate `application-design/component-methods.md` with signatures, types, purposes and failure results; detailed business algorithms deferred.
- [ ] Generate `application-design/services.md` with orchestration and failure/consistency boundaries.
- [ ] Generate `application-design/component-dependency.md` with dependency matrix, communication and validated data flow/text alternative.
- [ ] Generate consolidated `application-design/application-design.md`.
- [ ] Validate all 25 stories, all FR/NFRs, source/format breadth, source identity/membership separation, exact-version citations and claim-scoped precedence.
- [ ] Check read/write, permission/hosted/external-host boundaries; preserve offline/manual fallback and honest unverified labels.
- [ ] Independently review, resolve findings, validate Markdown/links/diagram and publish one Draft stage PR.
- [ ] Check all PR feedback and present the concrete design artifacts for explicit approval.
- [ ] Record that approval before marking Application Design complete or entering Units Generation.

## 4. Guardrails and artifact review

Full approved source/format breadth is mandatory. Originals survive AI/index failures; extraction/index/summary rebuilds cannot rewrite originals. Semantic similarity cannot merge sources. Captured time alone is not authority; a deadline update supersedes that applicable fact, not the entire syllabus. Both search and exact fetch enforce course scope; source identity is independent of course membership. Historical evidence IDs never silently resolve to the newest version.

Controlled loopback access, explicit Jev data disclosure/consent, untrusted material and external Codex/model processing are separate trust boundaries. No runtime performance, provider compatibility or successful source/client integration is claimed. No application code is generated; after approved Units Generation the course milestone stops before Construction.

The consolidated artifact will contain the single generated-design review question with A approve/continue, B changes and C Other. Its answer remains pending until the actual artifacts are reviewed. That later gate is required by Application Design Step 13, not an extra product-direction questionnaire.
