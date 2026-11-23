# Course Copilot — Unit of Work Plan

> **Corrective artifact approval recorded - November 23, 2026:** The current MVP includes local Ask and read-only local MCP with their local evidence-library foundations. Jev and advanced media processing remain planned for post-MVP work. Historical approvals cover the earlier baseline; Lawrence's separate corrective approval is recorded below. STOP before Construction.

**Stage:** Inception / Units Generation / Part 2: Generation

**Status:** Corrective unit plan and three revised artifacts approved by Lawrence on 2026-11-23T22:37:29Z. Historical plan/artifact approvals dated November 20 remain recorded for the earlier baseline. STOP before Construction.

**Historical baseline:** Requirements, 25 stories/P-01, Workflow Planning and five Application Design artifacts were approved in the earlier pass. The current coordinated draft adds FR-16/US-26 and C-13/S-05 for local Ask, concrete Maya context and source-authority criteria; it does not inherit those historical artifact approvals.

**Current approval:** Lawrence approved the revised Inception artifacts through Units Generation on 2026-11-23T22:37:29Z ([PR #8 approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386)). The approval covers Ask + local MCP and the documented post-MVP deferrals. STOP before Construction.

**Review:** [PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8).

**Branch:** `inception/05-units-generation`, based on approved design head `3acbe935f98d35512d07a4cffbf0bb21db0ea914`. Integrate #5 → #6 → #7 → this stage into `candidate/course-copilot`; one driver, xiaolonglin1124-bit. All stage PRs remain unmerged. Lawrence's revised-artifact approval is recorded; Ready status and ordered integration remain separate handoff actions.

**Delivery phases:** The [MVP scope and deferred-feature catalog](../requirements/mvp-scope.md) distinguishes current acceptance from retained post-MVP work. All 26 story IDs, 16 FRs, seven NFRs, 13 component IDs, five services and U-01/nine modules remain in the planning catalog. A retained future contract is not a current-MVP dependency or acceptance blocker.

## 1. Inputs and decomposition rule

Read [requirements](../requirements/requirements.md), [decision register](../requirements/decision-register.md), [stories](../user-stories/stories.md), [design](../application-design/application-design.md), [methods](../application-design/component-methods.md), [dependencies](../application-design/component-dependency.md), [execution plan](execution-plan.md), state and audit.

The Units stage defines a monolith's single unit as the entire application with logical modules. The approved design is a local modular library with extension/UI/MCP entry points, not independently hosted services. Propose **one Unit of Work, U-01: Local Course Copilot**, covering the complete student evidence lifecycle. Different executable/browser entry points do not by themselves create microservices or separate independently deployable products.

All US-01–US-26, FR-01–FR-16 and NFR-01–NFR-07 remain in U-01's catalog, with current-MVP and post-MVP phases in the story map. Internal modules provide concrete responsibility and parallel-work boundaries. A single unit is not permission to skip internal dependency analysis or integrated acceptance.

## 2. Six decomposition categories - current corrective assessment

The table evaluates the six required decomposition categories for the current corrective draft, including Ask and proposed leads. It is an assessment, not a transcript of historical questions or new team answers. Historical Q1 remains unchanged in section 8. The November 23 instruction authorizes this coordinated revision within the same U-01/nine-module boundary; it is distinct from Lawrence's later explicit approval of the revised artifacts. No teammate assignment or response is invented.

| Category | Current review topic | Current proposal and evidence |
|---|---|---|
| Story Grouping | Keep all 26 stories in one complete local-product unit, with internal primary/supporting module ownership? | Yes. Capture, versions, organization, claims and progressive retrieval share one evidence model; the approved modular-monolith architecture and stage definition support a single unit. |
| Dependencies | Use no cross-unit runtime dependencies while documenting the full internal dependency graph and integration order? | Yes. One unit still contains strict writer/query boundaries and adapters; preserve the current C-01–C-13 matrix and local MVP dependencies and future-only hosted-provider edges. |
| Team Alignment | Define technical module responsibilities now and let teammates claim named ownership later? | Current amendment: record Lawrence's proposed module leads, with actual acceptance pending. Each story has one primary work area and integration responsibility; the workflow driver serializes audit/state. No member commitment is invented. |
| Technical Considerations | Deliver one laptop-local installation/verification bundle with browser, library and stdio entry points, retaining the approved fallback/permission limits? | Yes. No new cloud deployment, independent scaling, hosted service or shared account requirement. Local processes remain distinct trust boundaries. |
| Business Domain | Treat the student's private evidence lifecycle as one domain while preserving course membership, source/version identity and claim applicability boundaries? | Yes. One student/multiple courses, original preservation, exact citations and scoped authority/conflicts remain coherent across modules. |
| Code Organization | Use the greenfield single-unit root src/tests/config pattern, with logical modules inside it? | Yes. The code-generation Critical Rules require src/, tests/ and config/ at workspace root for a single greenfield unit. The separate greenfield multi-unit deployment questionnaire is N/A, explicitly because only one unit is proposed. The code organization artifact is still mandatory. |

## 3. Proposed internal modules and future code areas

These are planning boundaries inside U-01, **not nine additional units or independently hosted services**. Final code is future Construction work; no application directories/files are created now.

| Module | Components | Responsibility and proposed root-relative area |
|---|---|---|
| M-01 Capture | C-01 | Chrome MV3 explicit page/embedded-resource capture; src/extension/. |
| M-02 Library UI | C-02 | Course browsing/import, filing review, source/history/conflict/original viewing and per-course Ask navigation state; src/ui/. |
| M-03 API and Workflow | C-03/C-04/C-13 | Controlled loopback ingestion/recovery, plus separate course Ask read/query/local-generation composition; src/library/api/, src/library/ingestion/ and src/library/ask/. |
| M-04 Evidence | C-05 | SQLite/files, identity/version/capture receipts, memberships, derived revisions and separated read/processing/write ports; src/library/evidence/. |
| M-05 Extraction | C-06 | MVP native HTML/text/PDF adapters and original viewing; post-MVP OCR, advanced visual recognition and audio/video adapters; honest outcomes; src/library/extraction/. |
| M-06 Model Gateways | C-07/C-08 | MVP local generation/embedding; separate permission-checked Jev capability retained post-MVP; src/library/gateways/. |
| M-07 Knowledge | C-09/C-10 | Filing/summary/fact/relation drafts and separate pure precedence/conflict view; src/library/knowledge/. |
| M-08 Index and Query | C-11 | Incremental lexical/vector writer and separately composed read-only scoped query; src/library/index/ and src/library/query/. |
| M-09 MCP | C-12 | Six read-only business tools over local stdio, optional scoped resource handler; src/mcp/. |

Shared pure types/serialization/helpers may live in src/shared/. They cannot import runtime startup, writers, migrations or model credentials into the MCP composition. Tests live under root tests/ (unit, properties, fixtures, integration); configuration templates under root config/ contain no secrets. Build outputs/local databases/originals/private authorized course samples stay out of version control. No apps/packages or per-unit service repositories are introduced.

## 4. Proposed integration sequence and responsibility model

1. Define shared identifiers/results/DTOs and independent read/write/processing interfaces; establish immutable evidence and pending-item/capture-receipt semantics. M-04 and M-03 provide the foundation.
2. Build an early native-text/PDF slice: M-01/M-02 capture/import → M-03/M-04 preserve original → M-05 extract → M-03/M-04 commit derived output → M-08 lexical query → M-03/C-13 Ask with M-06, and M-09 Codex search/fetch, after later Construction authorization. Start current-MVP native-text/PDF and three-LMS checks early; deferred adapter feasibility belongs to later work.
3. Complete current-MVP native source/format adapters, original viewing, manual recovery and per-stage status. Lexical publication requires accepted membership and precedes optional post-filing summary/claim/vector enrichment. Local classification may assist pre-filing suggestions; manual filing remains available without AI. Jev suggestions and hosted consent are post-MVP. M-01/M-02/M-05 can work in parallel once contracts are agreed.
4. Add M-06/M-07 correctable filing, source-linked incremental course/topic/document summaries and fact-scoped updates/conflicts; M-08 required semantic retrieval/filter behavior; preserve local fallback and immutable references.
5. Validate the complete laptop product across conceptual search/fetch, local grounded Ask and deadline-change/history/conflict scenarios, current-MVP native source/format paths, controlled local privacy/failure cases and actual Codex use. Deferred features retain separate later acceptance. Unit acceptance is an integrated outcome, not a sum of mock-module test passes.

Lawrence's [review proposal](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660293171) names Safi M-01/M-09, Iris M-02, Lawrence M-03/M-04, Chloe M-05/M-07 and Xiaolong M-06/M-08. Acceptance/capacity remains pending; this plan does not invent personal commitments. The subsequent story map will give each story one primary module and supporting modules, all inside U-01. Cross-cutting NFRs remain owned by U-01, with specific verification responsibility and no orphaned acceptance criteria.

## 5. Delivery-phase and trust safeguards

Current-MVP acceptance retains all three LMS sites, ordinary web/native-text papers/PDFs, local imports, selected embedded PDFs, original preservation/viewing and honest limitations/manual recovery. Scan/image OCR, advanced math/diagram recognition, audio/video acquisition/transcription and hosted Jev remain planned post-MVP features. Retain their requirements/contracts and later acceptance; they do not block current-MVP closure and are not cancelled.

Keep source identity separate from current course membership; exact version/extraction/passage references never redirect to latest. Pending originals stay private to their run until filing. Originals survive AI/index failures; summaries/claims/indexes are derived. Capture time alone is not authority; explicit changes apply to matching claims, and unresolved competing evidence remains.

Local Ask (FR-16/US-26, C-13/S-05) uses scoped read/query ports and local generation only. Its bounded answer cites exact saved evidence; conflicts and insufficient evidence remain visible, and invalid/unavailable local-model output becomes a disclosed retrieval-only/error result. Per-course draft/result/error survives tab navigation, with in-flight responses bound to their originating course. Ask cannot ingest, edit metadata, change consent, write indexes or silently invoke remote ChatGPT.

MCP receives read/query ports only: no jobs, writes, index initialization, migrations or permission grants. The controlled loopback UI/extension path is separate. The retained post-MVP Jev contract uses explicitly disclosed matching minimal payloads and local/manual fallback; C-08 is not wired into the MVP runtime; external Codex/model processing remains a separate boundary. No provider, OCR/STT/embedding or runtime compatibility/latency claim is added.

## 6. Planned artifact generation checklist

### Historical Part 1 — Planning

- [x] Load approved context, exact Units rules, course extension and single-unit code-location pattern.
- [x] Check remote status, open PRs and approved prior-stage feedback; no competing teammate Inception gate.
- [x] Propose unit boundary, internal modules, integration order, ownership status and full-scope safeguards.
- [x] Evaluate all six required question categories with targeted review and explicit applicability rationale.
- [x] Independently review this plan and resolve findings.
- [x] Publish the plan and inspect the stage PR feedback.
- [x] Collect and analyze explicit Q1 approval, resolving any requested ambiguity before generation.

### Historical Part 2 — After the recorded Q1 approval

- [x] Generate inception/application-design/unit-of-work.md: U-01 definition/responsibilities, internal modules, implementation sequence, acceptance and greenfield root code organization strategy.
- [x] Generate inception/application-design/unit-of-work-dependency.md: one-unit dependency matrix, internal module/port relationships, external dependencies, parallelism and integration order.
- [x] Generate inception/application-design/unit-of-work-story-map.md: historical 25 stories assigned once to U-01 with primary/supporting modules, FR/NFR coverage and future acceptance evidence.
- [x] Validate unit boundaries, dependencies, complete story/requirement mappings, all three artifacts, links/diagrams and full source/format/trust scope.
- [x] Obtain separate generated-unit artifact approval and record it before completing Inception.
- [x] STOP before Construction for the November 24 milestone; no application code generation.

### November 23 corrective pass

- [x] Apply the Ask/local-MCP MVP and retained post-MVP phases within U-01/nine modules.
- [x] Add C-13/S-05, US-26/FR-16 and proposed leads with acceptance pending across the three unit artifacts.
- [x] Retain the full catalog, phase OCR/advanced media/Jev for post-MVP, and preserve MVP source-authority controls and actual future Codex integration.
- [x] Complete coordinated delivery-phase consistency validation with requirements, stories, design and unit maps.
- [x] Obtain Lawrence's review of the concrete published revision on PR #8.
- [x] Record Lawrence's explicit approval of the revised Inception artifacts through Units Generation at 2026-11-23T22:37:29Z.
- [ ] Apply any required Ready transitions during the ordered integration handoff.
- [x] STOP before Construction; no application implementation is performed.

## 7. Extension compliance and milestone boundary

| Rule | Historical result and current corrective boundary |
|---|---|
| INFO5940-01 | Follow Units Parts 1–2; explicit plan approval, artifact generation/review and gates tracked in audit/state. |
| INFO5940-02 | All three mandatory unit artifacts plus greenfield strategy are revised; Lawrence's corrective approval recorded. STOP before Construction. Generic stage text about continuing to Construction is overridden by the mandatory course checkpoint. |
| INFO5940-03 | Historical Q1 remains recorded; it does not approve the current Ask revision. Lawrence's separate actual revised-artifact approval is recorded with its source and timestamp. |
| INFO5940-04 | One local demo bundle, concrete local Ollama candidate and progressive read-only Codex MCP; Jev permission design retained for post-MVP integration. |
| INFO5940-05 | Planning documentation only; no application code, credentials or secrets. |
| INFO5940-06 | Same driver and ordered prior-stage dependency; corrective approval recorded, with Ready/integration separately tracked, no parallel teammate workflow or manual audit/state merge. |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | Carry pure-transform/round-trip/version obligations into unit evidence; implementation and runtime results deferred. |

## 8. Historical decomposition-plan approval

### Q1 — Confirm the complete six-category proposal

A) **Approve this plan and generate the three unit artifacts.** One U-01 covers all stories/requirements, with the nine internal modules, ordered dependencies, root src/tests/config organization and named ownership left for later team claiming. Retain the full approved scope and separate generated-unit review before stopping at Inception.

B) **Request changes before generation.** Specify the unit/module boundary, responsibility, dependency, ownership approach, code organization or missing acceptance coverage to revise. A request for several independently deployable units needs explicit architectural justification rather than silently relabeling modules.

C) **Other.** Describe an alternative proposal after the answer tag.

[Answer]: A

**Historical approval response (English translation):** A: Approve the units plan and proceed with generation. The original raw response is preserved in the [audit](../../audit.md#units-generation--explicit-plan-approval-and-part-2-start). This translation records the historical choice; it is not a new approval. The [current handoff](../../aidlc-state.md#current-checkpoint-and-handoff) records the separate corrective approval and the stop before Construction.

This answer approved the historical six-category proposal. Its historical artifact approval remains recorded in unit-of-work.md and the audit; neither answer approves the November 23 revised unit artifacts. Lawrence's separate current approval is recorded above; no other teammate approval or personal ownership acceptance is inferred. The milestone stop before Construction remains in force.
