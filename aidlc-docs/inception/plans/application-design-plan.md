# Course Copilot — Application Design Plan

**Current review (2026-11-23):** Step 2 corrective artifacts include local Ask and local MCP in the MVP and retain Jev/media capabilities for later work. The 2026-11-20 approval applies to the historical baseline; Lawrence's separate corrective approval is recorded below. No Construction or runtime acceptance is claimed.

**Current approval:** Lawrence approved the revised Inception artifacts through Units Generation on 2026-11-23T22:37:29Z ([PR #8 approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386)). The approval covers Ask + local MCP and the documented post-MVP deferrals. STOP before Construction.

**Delivery phases:** The current MVP includes native HTML/text/PDF capture and import, local organization and retrieval, source/version/authority handling, grounded Ask and read-only local MCP. Jev, scan/image OCR, advanced equation/diagram recognition, and audio/video extraction/transcription remain planned **post-MVP** features. Original preservation/viewing and honest extraction status remain in the MVP. C-08 and all hosted-permission/provider paths are retained design contracts but are not composed into the MVP. See the [MVP and later-work scope](../requirements/mvp-scope.md).

**Inputs:** Historical requirements/story/design approvals plus the Nov 23 scope amendment: local Ask + local MCP in the MVP, with Jev and advanced media retained for post-MVP. Current targets are P-01, US-01–US-26, FR-01–FR-16 and seven NFRs; application-design.md stage rules and course extension apply.

**Current branch:** Existing `inception/05-units-generation` / PR #8 holds the coordinated corrective pass. Historical Application Design was generated on `inception/04-application-design` after Workflow Planning head `ae4ce29f207bf67bc1390a23e3efe06feb9a2dbc`. Keep the existing #5→#6→#7→#8 merge order and single driver, xiaolonglin1124-bit; no new branch or PR is created.

## 1. Question-category assessment and authorization

The original five-category assessment below records the Nov 20 engineering direction. The Nov 23 corrective assessment adds the team-selected local Ask path; these revisions remain reviewable. The approved execution plan authorizes this stage and Q36 delegates routine technical choices to the agent. Application Design Steps 6–9 apply to actual unresolved questions; none is invented solely to create another approval round. This plan documents engineering choices transparently and proceeds to artifacts. The required separate design-artifact approval at Step 13 was subsequently recorded on 2026-11-20T03:43:36Z.

| Category | Evidence and design resolution | New user question |
|---|---|---|
| Component identification | Requirements identify Chrome MV3, local TypeScript/Node/SQLite library, extraction/indexing and read-only MCP. Use logical modules in one local library runtime, a local browsing UI and separate stdio MCP adapter. Final Units remain a later decision. | None; routine boundaries implement approved scope. |
| Component methods | FR-01–FR-15/stories establish save/import, metadata correction, scoped search/fetch/history/conflicts and explicit statuses. Specify typed contracts, source/version/passage IDs and scoped failures. | None; exact signatures are delegated engineering detail. |
| Service orchestration | FR-04/05/07/09 and NFR-04/05 require preserving originals before derived processing, incremental updates, honest failures and local fallback. Use bounded durable ingestion jobs with independent extraction/AI/index steps. | None; no new product behavior added. |
| Dependencies | SQLite/files store evidence; local model and hosted Jev have separate adapters. MCP depends exclusively on read-only query ports; mutations stay in the user-controlled library API. | None; trust boundaries follow approved requirements. |
| Design patterns | Local single-user cost-conscious TypeScript stack, no hosting/accounts/graph DB. Use modular monolith, adapters, processing pipeline and separated write/query interfaces. | None; microservices or new cloud accounts would conflict with existing constraints. |

The scope amendment includes local Ask and local MCP in the MVP and retains Jev/OCR/advanced-recognition/media features for post-MVP work. Lawrence's separate approval covers the revised Inception interfaces; runtime verification remains future work. Final local model selection is a later validation task. Detailed algorithms and runtime tool/model choices await later design/measurement; those later detailed-design artifacts require their own explicit review.

## 2. Proposed component map and contracts

| ID | Component | Main responsibility |
|---|---|---|
| C-01 | Capture Extension | User-triggered page/embedded-resource selection; browser-authorized capture; metadata/bytes envelope; no credential/session export. |
| C-02 | Local Library UI | Course/folder browsing, import, uncertain filing review, metadata correction, source/history/conflict inspection and course-scoped local Ask; course-keyed draft/result continuity during tab navigation. |
| C-03 | Local Library API | Controlled loopback mutations and UI queries; locally paired extension/UI; input/scope validation and status inspection. |
| C-04 | Ingestion Coordinator | Durable run/item states, original preservation, bounded processing and explicit retry/recovery. |
| C-05 | Evidence Store | SQLite/local originals; stable source identity, immutable versions, separate course memberships and metadata, passages/facts/relations/jobs; read/write ports separated. |
| C-06 | Extraction Pipeline | MVP native HTML/text/PDF extraction and original math/diagram viewing; post-MVP OCR/advanced recognition/media adapters; honest location/completeness/error records. |
| C-07 | Local AI Gateway | Ollama generation and local embedding abstraction; untrusted source envelopes; explicit unavailable/invalid output. First generative candidate gemma3:4b, unbenchmarked. |
| C-08 | Hosted Jev Gateway — post-MVP | Retained minimal scoped classification/routing/rerank and matching permission contracts; not composed into the current MVP. |
| C-09 | Organization and Summary | Correctable filing suggestions; incremental source-linked course/topic/document summaries. |
| C-10 | Claims and Relations | Evidence-linked substantive facts, proposed typed edges and claim-scoped precedence/conflict views; models cannot establish authority alone. |
| C-11 | Index and Retrieval | Incremental FTS5/vector indexing; all filters; compact progressive candidates and exact saved evidence; lexical fallback. |
| C-12 | Read-only MCP Adapter | Separate local stdio process with read-only persistence/query access; scoped list/search/fetch/history/conflicts; no ingestion or mutation tools. |
| C-13 | Course Ask Orchestrator | Controlled local question, local-only bounded retrieval and generation, validated exact citations, explicit insufficient-evidence/model-outage behavior; no writes/hosted fallback. |

Shared contract concepts: CourseId, SourceId, DocumentId, VersionId, PassageId, FactId, RelationshipId, IngestionRunId; immutable original references; course memberships distinct from source identity; captured/published/effective dates distinct; per-item complete/partial/failed/unsupported plus run progress; citations pinned to exact versions/passages. Final filenames/module packaging and detailed business algorithms belong to later stages.

S-01 Capture/Ingest, S-02 Processing/Index, S-03 Metadata/Review, S-04 Evidence Query and S-05 Local Course Ask orchestrate these components. They are logical services, not independently hosted microservices. Writes occur only on authorized library paths; the query service/MCP cannot mutate evidence or regenerate persisted indexes on demand.

## 3. Historical generation and validation checklist (Nov 20 baseline)

- [x] Load approved context and check stage prerequisites.
- [x] Fetch/status and inspect open PRs/feedback; no competing teammate stage.
- [x] Evaluate all five question categories; preserve resolved decisions and explain routine choices.
- [x] Document component/service direction and required contract boundaries.
- [x] Generate `application-design/components.md` with definitions, responsibilities and interfaces.
- [x] Generate `application-design/component-methods.md` with signatures, types, purposes and failure results; detailed business algorithms deferred.
- [x] Generate `application-design/services.md` with orchestration and failure/consistency boundaries.
- [x] Generate `application-design/component-dependency.md` with dependency matrix, communication and validated data flow/text alternative.
- [x] Generate consolidated `application-design/application-design.md`.
- [x] Validate all 25 stories, all FR/NFRs, source/format breadth, source identity/membership separation, exact-version citations and claim-scoped precedence.
- [x] Check read/write, permission/hosted/external-host boundaries; preserve offline/manual fallback and honest unverified labels.
- [x] Independently review, resolve findings, validate Markdown/links/diagram and publish one Draft stage PR.
- [x] Check all PR feedback and present the concrete design artifacts for explicit approval.
- [x] Record that approval before marking Application Design complete or entering Units Generation.

## 4. Guardrails and artifact review

Delivery-phase boundaries follow the scope amendment: native extraction/original viewing is MVP; Jev, OCR, advanced recognition and audio/video processing remain planned post-MVP features. Deferred features are retained but do not gate current MVP acceptance. Originals survive AI/index failures; extraction/index/summary rebuilds cannot rewrite originals. Semantic similarity cannot merge sources. Captured time alone is not authority; a deadline update supersedes that applicable fact, not the entire syllabus. Both search and exact fetch enforce course scope; source identity is independent of course membership. Historical evidence IDs never silently resolve to the newest version.

MVP controlled loopback access, untrusted material and external Codex/model processing are separate trust boundaries. Explicit Jev disclosure/consent remains a retained post-MVP boundary. No runtime performance, provider compatibility or successful source/client integration is claimed. No application code is generated; after approved Units Generation the course milestone stops before Construction.

The consolidated artifact contains the generated-design review question with A approve/continue, B changes and C Other. The user explicitly answered A on 2026-11-20T03:43:36Z for the historical baseline. That answer does not close the corrective-draft review gate.

## 5. Nov 23 corrective assessment and generation

| Category | Current direction and reason | Decision status |
|---|---|---|
| Component identification | Add C-13 behind existing C-02/C-03 so ordinary students can use the Ask UI. Keep C-12 independently available for the technical pilot. | Ask + local MCP included in current MVP; Lawrence's corrective artifact approval recorded. |
| Methods | Add AskRequest/AskResult, exact passage-grounded answer segments and per-course/request identity. Unknown citations fail safely. | Draft under the authorized Step 2 revision. |
| Services | Add read-only S-05; local-only bounded search/fetch precedes C-07 generation. Unavailable model exposes retrieval-only mode; missing support exposes insufficient evidence. | Draft; no general agent, remote ChatGPT or write behavior introduced. |
| Dependencies | C-13 receives C-11 query-only, C-05 scoped reads and C-07 local generation. All MVP C-11 query compositions exclude hosted Jev; C-08 dependencies remain post-MVP. | No writer/consent/index dependency is granted; verify during later Construction. |
| Patterns | Preserve modular local runtime, unchanged six MCP tools and explicit UI session state keyed by course/request. | Routine engineering direction within selected scope; revised artifacts require actual review. |

- [x] Incorporate the reported Ask + local MCP choice into this corrective plan, retaining the original design decisions and approval as history.
- [x] Revise all five design artifacts with C-13/S-05, FR-16/US-26, exact-citation, authority and course/request continuity boundaries.
- [x] Retain Jev/OCR/advanced-recognition/media capabilities with explicit post-MVP delivery; preserve native extraction/original viewing and local Ask/MCP as MVP acceptance.
- [x] Preserve component/service IDs and future hosted/media contracts while excluding deferred capabilities from MVP runtime composition. Final local model selection remains later validation.
- [x] Complete coordinated cross-artifact validation with the parent Step 2 review package.
- [x] Record Lawrence's explicit PR #8 approval of the concrete revised artifact package at 2026-11-23T22:37:29Z; do not substitute the historical A answer.
- [x] Close the corrective Application Design artifact gate on the recorded approval; continue to stop before Construction.
- [x] PR Ready transitions complete: #5–#7 changed from Draft to Ready; #8 already non-Draft. Verified 2026-11-23T22:56:30Z; ordered integration remains Lawrence’s task.
