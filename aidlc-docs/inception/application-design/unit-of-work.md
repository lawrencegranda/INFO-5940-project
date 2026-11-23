# Course Copilot — Unit of Work

> **Current corrective draft - November 23, 2026:** The reported team decision includes local Ask and local read-only MCP. The driver authorized this coordinated revision. Historical approvals below cover the earlier baseline only; the revised artifacts still require team review and approval. STOP before Construction.

**Stage:** Inception / Units Generation / Part 2

**Status:** Revised unit artifacts generated for corrective review; current approval pending. The earlier baseline was approved on 2026-11-20T04:20:19Z. This is planning documentation, not an implemented or tested application.

**Plan approval:** 2026-11-20T04:08:23Z; raw response recorded in the audit. **Review:** [PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8). Same single workflow driver: xiaolonglin1124-bit. Integrate approved #5→#6→#7 before this dependent stage into candidate/course-copilot.

## 1. Unit definition

| Field | U-01 — Local Course Copilot |
|---|---|
| Purpose | Let one student save multi-course materials and retrieve applicable, source-linked, version-aware evidence through a private local library, grounded local Ask and read-only Codex MCP. |
| Scope | All US-01–US-26, FR-01–FR-16 and NFR-01–NFR-07; none assigned to an absent later unit. |
| Architecture | One modular local application bundle, with Chrome extension, local UI/library runtime and separate stdio MCP entry point. Internal modules are not independently hosted services. |
| Technical ownership | Defined by the nine module responsibility areas below; proposed leads are listed below, with acceptance pending. No teammate commitment is invented. |
| Persistence | Local SQLite/FTS5, original files and explicitly separated evidence-read, processing-read, permission-read and write ports. |
| AI | Local Ollama gemma3:4b is the first generative candidate, subject to measurement. Local embedding/OCR/STT stack choices remain later work. Optional hosted Jev is minimal and permission-bound. |
| Dependencies | No other Unit of Work. Internal module/port and external tool dependencies are mandatory and documented separately. |
| Completion | Later integrated acceptance across all stories and NFRs, not independent mock modules alone. This Inception review approves only the unit artifacts. |

Inputs: [unit plan](../plans/unit-of-work-plan.md), [requirements](../requirements/requirements.md), [stories](../user-stories/stories.md), [application design](application-design.md) and [component contracts](component-methods.md). Companion deliverables: [dependencies](unit-of-work-dependency.md) and [story/requirement map](unit-of-work-story-map.md).

## 2. Responsibilities and exclusions

U-01 owns explicit user-triggered capture/import from Canvas, Gradescope, EdStem, ordinary webpages/papers/PDFs and local files, selected accessible embedded resources, original preservation, extraction, correctable multi-course filing, incremental summaries/indexes, typed relationships and evidence-based substantive updates/conflicts. It also owns scoped hybrid search, exact evidence fetch/history, local original viewing, course-scoped local Ask and actual read-only Codex integration. Ask uses saved evidence, validates citations, surfaces conflicts/insufficient evidence and has no library mutation capability.

Native text, scan/image OCR, preserved equations/diagrams with reliable derivation, and accessible authorized audio/video transcription remain required. Every item retains honest complete/partial/failed/unsupported outcomes and processing status. Unavailable resources remain visible and recoverable through permitted manual upload/retry; failure handling does not replace successful accessible-format evidence.

Excluded scope remains automatic LMS synchronization/login, credential harvesting, general-purpose action agents, cloud accounts/collaboration/hosting, remote ChatGPT/hosted MCP integration or tunnels, universal protected-media access, arbitrary full graph generation and historical as-of querying. U-01 does not guarantee knowledge of unseen LMS updates or perfect contradiction detection.

## 3. Internal module responsibilities

| Module | Components in current draft | Responsibility and handoff |
|---|---|---|
| M-01 Capture | C-01 | Chrome MV3 explicit page/resource discovery/selection, browser-authorized content capture and safe source envelope. No session credentials leave the browser. Submit through M-03. |
| M-02 Library UI | C-02 | Course browsing/import, uncertain filing review, correction, original/history/conflict inspection, per-course Ask draft/result continuity during navigation and hosted consent decisions. Commands/queries use M-03; no direct database writes. |
| M-03 API and Workflow | C-03/C-04/C-13 | Validate paired loopback requests and orchestrate durable ingestion/recovery. C-13 separately composes query/read ports plus local generation for grounded Ask; it receives no ingestion, metadata, consent or index-write capability. |
| M-04 Evidence | C-05 | Stable source/original/version/capture identities, separate memberships/metadata and immutable derivation references; safe persistence and distinct capability ports. |
| M-05 Extraction | C-06 | Native/OCR/math/diagram/transcription adapters, exact original-relative locations, private unfiled output and honest per-format limitations. Return drafts to M-03. |
| M-06 Model Gateways | C-07/C-08 | Separate local generation/embedding and minimal hosted classification/routing/rerank. Validate matching permissions and outputs; no automatic hosted fallback or grant creation. |
| M-07 Knowledge | C-09/C-10 | Correctable filing, affected-only document/topic/course summary drafts, sourced substantive facts/typed relations and a separate pure query-time precedence/conflict view. |
| M-08 Index and Query | C-11 | Separate lexical/vector writer and course-scoped read-only progressive query. Index writer obtains local embeddings via M-06; query composition cannot acquire writes. |
| M-09 MCP | C-12 | Six local stdio business tools and optional scoped original-resource handler; query/read ports only, exact references and external-host disclosure. |

Shared pure identifiers/results/DTOs, serialization and helpers are cross-cutting foundations, not another Unit of Work. S-01–S-05 identify in-process orchestration responsibilities; they are not independently deployable services in this decomposition. Story primary/supporting areas describe implementation coordination, not split ownership of the unit's acceptance.

**Proposed leads from Lawrence's [PR #8 review](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660293171):** Safi - M-01/M-09; Iris - M-02; Lawrence - M-03/M-04; Chloe - M-05/M-07; Xiaolong - M-06/M-08. These are proposals; individual acceptance and capacity are not recorded. M-03's added Ask orchestration does not establish a new personal commitment.

## 4. Greenfield code organization strategy

Follow the code-generation single-unit pattern: **src/, tests/ and config/ at repository root**. These are future locations, not directories or source files created by this stage.

| Future area | Responsibility |
|---|---|
| src/extension/ | M-01 Chrome UI/content/background capture entry points. |
| src/ui/ | M-02 local library views and command/query clients. |
| src/library/api/, src/library/ingestion/, src/library/ask/ | M-03 controlled local entry, write-side ingestion and separately composed read-only Ask orchestration. |
| src/library/evidence/ | M-04 separate query-read, processing-read, permission-read and write implementations; explicit startup compositions. |
| src/library/extraction/ | M-05 local format adapters and extraction contracts. |
| src/library/gateways/ | M-06 local and optional hosted gateways with separate capability bindings. |
| src/library/knowledge/ | M-07 draft enrichment and distinct pure precedence view. |
| src/library/index/, src/library/query/ | M-08 index maintenance versus read-only retrieval; no automatic writer import from query startup. |
| src/mcp/ | M-09 stdio bootstrap composed from read-only capabilities. |
| src/shared/ | Pure shared contracts/helpers; no writable startup, migrations, processing jobs or credentials. |
| tests/unit/, tests/properties/, tests/fixtures/, tests/integration/ | Deterministic/module tests, selected properties, sanitized fixtures and integrated acceptance. Actual private course samples stay local outside version control. |
| config/ | Safe configuration templates/documented defaults, no secrets or real user material. |

Documentation remains under aidlc-docs/. Build outputs, local databases/originals, model files, private test samples and actual capability/consent secrets are outside committed source or ignored. Exact build tooling, runtime setup, physical storage paths and package choices are established in later Functional/NFR/Infrastructure Design; no apps/packages split or independent service repositories is introduced.

Read/query entry points must not import a library bootstrap that starts migrations/jobs/index writes. Runtime capability checks and before/after store inspection remain future verification, not an assertion that TypeScript imports provide an OS sandbox.

## 5. Integration sequence and parallel work

1. **Foundation:** M-03/M-04 plus shared contracts establish immutable identity, separate memberships, capture receipts, private pending items, derived revisions, statuses and restricted ports. Original persistence precedes all derived processing.
2. **Early vertical slice:** M-01/M-02 capture/import → M-03/M-04 preserve original → M-05 native extraction → M-03/M-04 commit derivation → accepted membership → M-08 lexical search → M-03/C-13 local Ask with M-06, and M-09 Codex search/fetch. Start three-LMS and OCR/media/math feasibility checks early after Construction authorization.
3. **Complete format coverage:** M-01/M-05 implement every approved source/format adapter with M-02 status/review/recovery views. Accepted course membership gates public indexing; after filing, usable lexical content precedes optional summary/claim/vector enrichment. Permitted minimal classification may assist initial filing before that gate; manual filing remains available without AI.
4. **Knowledge and hybrid retrieval:** M-06/M-07 add permitted suggestions, source-linked incremental hierarchical summaries and fact-scoped updates/conflicts; M-08 adds required local semantic retrieval and all filters. Preserve independent original availability and lexical/manual fallback.
5. **Integrated acceptance:** Join source/capture/history/conflict UI, all extraction paths, local cited Ask, actual Codex retrieval and offline/permission failures. Benchmark local AI/extraction/embedding quality and resources; revisit feasibility explicitly if required breadth cannot be delivered.

After shared contracts are agreed, M-01/M-02/M-05 work can proceed in parallel with isolated fixtures and explicit integration handoffs. The unit remains blocked from final acceptance until the whole source→evidence→Codex flow is demonstrated. Proposed leads require actual acceptance before being treated as assignments; the AI-DLC driver serializes audit/state while feature branches may modify their approved application areas during future Construction.

## 6. Non-negotiable acceptance boundaries

- **Identity:** Same source/unchanged hash adds an observation receipt; changed original creates a preserved version. Similarity can suggest relations but never merge originals. Metadata/summary/index changes do not create or rewrite original evidence.
- **Scope:** Every query except course listing checks current membership, including direct fetch/history/conflicts/original resources. A global source/version ID alone does not authorize access. Unfiled originals remain run-private until accepted filing.
- **Exact evidence:** Version/extraction/passage references remain immutable; old references never silently redirect to latest. Full-text fetch pins extraction revision; saved original bytes use a scoped opaque resource handle and bounded reads.
- **Applicability:** The Nov 20 syllabus → explicit authoritative Nov 22 announcement changes the matching deadline claim, retaining both sources and unrelated syllabus facts. Later recapture of the old syllabus cannot win by capture time. Unresolved competing evidence remains visible; unknown separate effective date alone does not negate an otherwise explicit update.
- **Local Ask:** FR-16/US-26 use only the selected course's saved evidence. Pin citations to retrieved source/version/extraction/passage references; unsupported citations cannot be shown as verified. No evidence yields insufficient-evidence status, and conflicting instructions remain visible. Missing/invalid local-model output returns a disclosed retrieval-only or error result, never a fabricated answer. Preserve each course's draft/result/error during tab navigation and bind in-flight results to the originating course. These browser-state changes do not grant library-write capability.
- **Read-only MCP:** list_courses, search_course, fetch_document, fetch_passages, get_document_history and get_conflicts expose no mutations. Startup/query cannot migrate, ingest, grant consent, repair indexes, regenerate summaries or persist caches/use counters. Optional resource handling obeys the same scope/read boundary.
- **Permission and host:** Controlled loopback UI/extension commands, untrusted source text, exact minimal Jev grants and external Codex/model processing are distinct boundaries. Local MCP does not imply the external host's inference is local.
- **Availability:** Originals/manual filing/keyword and metadata retrieval remain usable without paid AI or network. Failed OCR/transcription/model/index steps retain originals and disclose their individual limitations; required successful format/semantic acceptance still remains.

The companion story map assigns all 26 stories once to U-01 and records the specific future evidence obligations. All seven NFRs are unit-wide responsibilities with module participation. Use the approved Vitest fixture/manual E2E strategy, including selected property tests for pure transformations, round trips and version invariants; no executable tests are generated in this stage.

## 7. Delivery risks and verification status

**All runtime acceptance is specified, not run.** No application source, build, installed model, provider call, authorized LMS capture, OCR/STT/vector benchmark or Codex runtime verification is created or claimed in Inception. The unit's broad authenticated-source and multimodal scope remains high risk; a single-unit label does not make it smaller.

Later evidence must separately include actual authorized Canvas/Gradescope/EdStem captures; ordinary web/PDF/local and embedded-resource flows; successful native/scan/image/math/audio/video examples with originals and omissions; unchanged/changed recapture; two-course shared-source isolation and direct-fetch denial; claim-scoped authoritative updates and unresolved conflicts; lexical plus semantic/filter queries; exact search/fetch/reference round trips; local Ask citation correctness, insufficient/conflicting evidence, course-switch continuity and model-unavailable disclosure; actual Codex CLI read-only use; denied/revoked Jev, controlled loopback checks and AI/network-off fallback. Fixtures/tool registration/screenshots alone do not prove actual integration.

Concrete local extraction/embedding tools, model feasibility, source adapter details, confidence/claim matching, safe staging/migrations/recovery and physical installation are later design/measurement tasks. No new product-direction decision is needed merely to document those risks; any required scope reduction must be explicitly approved.

## 8. Stage compliance and checkpoint

| Rule | Current result |
|---|---|
| INFO5940-01 | Followed the explicitly approved unit plan; generated three required artifacts and kept audit/state under one driver. |
| INFO5940-02 | All mandatory unit files and greenfield organization are included. Current revised artifact approval is pending; STOP before Construction. |
| INFO5940-03 | Historical Q1 approvals remain recorded. They do not approve the November 23 revision; current team artifact approval remains pending. |
| INFO5940-04 | One local bundle, named preliminary local model and concrete progressive read-only Codex integration; Jev narrow permission/fallback retained. |
| INFO5940-05 | Documentation only; no application code or secrets. |
| INFO5940-06 | Existing PR #8 carries the corrective pass under the same driver. No Ready/merge authorization is claimed before actual revised approval; ordered integration remains pending. |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | Pure-transform/round-trip/version property obligations assigned to future unit tests; executable framework/results deferred. |

## 9. Historical generated-unit artifact approval

### Q1 — Review all three generated unit artifacts

A) **Approve the unit definition, dependencies and story map; complete Inception and stop before Construction.** Confirm U-01/nine modules, full coverage, root organization and future integrated acceptance. Approval does not claim a working prototype or authorize application implementation at this milestone.

B) **Request changes before approval.** Specify the unit/module boundary, dependency, responsibility, story/requirement mapping, evidence or code organization to revise.

C) **Other.** Describe the requested outcome after the answer tag.

[Answer]: A

**Historical approval response (English translation):** A: Approve the unit documents and complete Inception. The original raw response is preserved in the [audit](../../audit.md#units-generation--explicit-artifact-approval-and-inception-completion). This translation records the historical choice; it is not a new approval. The [current review hold](../../aidlc-state.md#current-checkpoint-and-handoff) remains in force.

Historical approval recorded on 2026-11-20T04:20:19Z. It completed the earlier unit baseline only. The coordinated November 23 Ask/source-authority revision requires new artifact review and actual team approval before the hold can be released. STOP before Construction under INFO5940-02; no application implementation is authorized by this document.
