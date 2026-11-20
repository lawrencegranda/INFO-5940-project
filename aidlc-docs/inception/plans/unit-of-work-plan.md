# Course Copilot — Unit of Work Plan

**Stage:** Inception / Units Generation / Part 1: Planning

**Status:** Concrete decomposition proposal prepared; explicit plan approval pending. Do not generate unit artifacts before Q1 is answered.

**Baseline:** Requirements, 25 stories/P-01, Workflow Planning and all five Application Design artifacts are explicitly approved. Application Design approval was recorded on 2026-11-20T03:43:36Z.

**Review:** [Draft PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8).

**Branch:** `inception/05-units-generation`, based on approved design head `3acbe935f98d35512d07a4cffbf0bb21db0ea914`. Integrate #5 → #6 → #7 → this stage into `candidate/course-copilot`; one driver, xiaolonglin1124-bit. Earlier gates are complete/ready and await maintainer integration.

## 1. Inputs and decomposition rule

Read [requirements](../requirements/requirements.md), [decision register](../requirements/decision-register.md), [stories](../user-stories/stories.md), [approved design](../application-design/application-design.md), [methods](../application-design/component-methods.md), [dependencies](../application-design/component-dependency.md), [execution plan](execution-plan.md), state and audit.

The Units stage defines a monolith's single unit as the entire application with logical modules. The approved design is a local modular library with extension/UI/MCP entry points, not independently hosted services. Propose **one Unit of Work, U-01: Local Course Copilot**, covering the complete student evidence lifecycle. Different executable/browser entry points do not by themselves create microservices or separate independently deployable products.

All US-01–US-25, FR-01–FR-15 and NFR-01–NFR-07 belong to U-01. Internal modules provide concrete responsibility and parallel-work boundaries. A single unit is not permission to skip internal dependency analysis or integrated acceptance.

## 2. Six question categories — one consolidated proposal

Each targeted question below is included in the Q1 review. A approves all six proposed answers; B requests specific revisions. Existing product choices remain fixed; no repeated product questionnaire or invented teammate assignment is needed.

| Category | Targeted review question | Proposed answer and evidence |
|---|---|---|
| Story Grouping | Keep all 25 stories in one complete local-product unit, with internal primary/supporting module ownership? | Yes. Capture, versions, organization, claims and progressive retrieval share one evidence model; the approved modular-monolith architecture and stage definition support a single unit. |
| Dependencies | Use no cross-unit runtime dependencies while documenting the full internal dependency graph and integration order? | Yes. One unit still contains strict writer/query boundaries and adapters; preserve the approved C-01–C-12 matrix and all external local/optional-hosted dependencies. |
| Team Alignment | Define technical module responsibilities now and let teammates claim named ownership later? | Yes. No agreed individual assignments are present. Keep named owners explicitly unassigned; each story has a primary work area and integration responsibility, with the workflow driver serializing audit/state. No additional member approval is invented. |
| Technical Considerations | Deliver one laptop-local installation/verification bundle with browser, library and stdio entry points, retaining the approved fallback/permission limits? | Yes. No new cloud deployment, independent scaling, hosted service or shared account requirement. Local processes remain distinct trust boundaries. |
| Business Domain | Treat the student's private evidence lifecycle as one domain while preserving course membership, source/version identity and claim applicability boundaries? | Yes. One student/multiple courses, original preservation, exact citations and scoped authority/conflicts remain coherent across modules. |
| Code Organization | Use the greenfield single-unit root src/tests/config pattern, with logical modules inside it? | Yes. The code-generation Critical Rules require src/, tests/ and config/ at workspace root for a single greenfield unit. The separate greenfield multi-unit deployment questionnaire is N/A, explicitly because only one unit is proposed. The code organization artifact is still mandatory. |

## 3. Proposed internal modules and future code areas

These are planning boundaries inside U-01, **not nine additional units or independently hosted services**. Final code is future Construction work; no application directories/files are created now.

| Module | Components | Responsibility and proposed root-relative area |
|---|---|---|
| M-01 Capture | C-01 | Chrome MV3 explicit page/embedded-resource capture; src/extension/. |
| M-02 Library UI | C-02 | Course browsing/import, filing review, source/history/conflict/original viewing; src/ui/. |
| M-03 API and Workflow | C-03/C-04 | Controlled loopback entry, run/item/step orchestration, original-first persistence and recovery; src/library/api/ and src/library/ingestion/. |
| M-04 Evidence | C-05 | SQLite/files, identity/version/capture receipts, memberships, derived revisions and separated read/processing/write ports; src/library/evidence/. |
| M-05 Extraction | C-06 | Native/OCR/math/diagram/media adapters and honest per-resource outcomes; src/library/extraction/. |
| M-06 Model Gateways | C-07/C-08 | Local generation/embedding capability and separate permission-checked minimal Jev decisions; src/library/gateways/. |
| M-07 Knowledge | C-09/C-10 | Filing/summary/fact/relation drafts and separate pure precedence/conflict view; src/library/knowledge/. |
| M-08 Index and Query | C-11 | Incremental lexical/vector writer and separately composed read-only scoped query; src/library/index/ and src/library/query/. |
| M-09 MCP | C-12 | Six read-only business tools over local stdio, optional scoped resource handler; src/mcp/. |

Shared pure types/serialization/helpers may live in src/shared/. They cannot import runtime startup, writers, migrations or model credentials into the MCP composition. Tests live under root tests/ (unit, properties, fixtures, integration); configuration templates under root config/ contain no secrets. Build outputs/local databases/originals/private authorized course samples stay out of version control. No apps/packages or per-unit service repositories are introduced.

## 4. Proposed integration sequence and responsibility model

1. Define shared identifiers/results/DTOs and independent read/write/processing interfaces; establish immutable evidence and pending-item/capture-receipt semantics. M-04 and M-03 provide the foundation.
2. Build an early native-text/PDF slice: M-01/M-02 capture/import → M-03/M-04 preserve original → M-05 extract → M-03/M-04 commit derived output → M-08 lexical query → M-09 Codex search/fetch, after later Construction authorization. Start actual three-LMS/OCR/media/math feasibility checks early, not after all UI work.
3. Complete all required source/format adapters, manual recovery and per-stage status. Lexical publication requires accepted membership but precedes optional AI. M-01/M-02/M-05 can work in parallel once contracts are agreed.
4. Add M-06/M-07 correctable filing, source-linked incremental course/topic/document summaries and fact-scoped updates/conflicts; M-08 required semantic retrieval/filter behavior; preserve local fallback and immutable references.
5. Validate the complete laptop product across both conceptual search/fetch and deadline-change/history/conflict scenarios, all source/format paths, permission failures and actual Codex use. Unit acceptance is an integrated outcome, not a sum of mock-module test passes.

Teammates may claim module tasks later; this plan assigns no person or delivery commitment. The subsequent story map will give each story one primary module and supporting modules, all inside U-01. Cross-cutting NFRs remain owned by U-01, with specific verification responsibility and no orphaned acceptance criteria.

## 5. Full-scope and trust safeguards

Preserve all three LMS sites, ordinary web/papers/PDFs/local files, selected accessible embeds, native/OCR/image/math/diagram/audio/video extraction and manual recovery. Inaccessible/unsupported cases remain visible; a failure-status test cannot replace successful accessible-format evidence. No silent MVP reduction.

Keep source identity separate from current course membership; exact version/extraction/passage references never redirect to latest. Pending originals stay private to their run until filing. Originals survive AI/index failures; summaries/claims/indexes are derived. Capture time alone is not authority; explicit changes apply to matching claims, and unresolved competing evidence remains.

MCP receives read/query ports only: no jobs, writes, index initialization, migrations or permission grants. The controlled loopback UI/extension path is separate. Jev receives only explicitly disclosed matching minimal payloads, with local/manual fallback; external Codex/model processing remains a separate boundary. No provider, OCR/STT/embedding or runtime compatibility/latency claim is added.

## 6. Planned artifact generation checklist

### Part 1 — Planning

- [x] Load approved context, exact Units rules, course extension and single-unit code-location pattern.
- [x] Check remote status, open PRs and approved prior-stage feedback; no competing teammate Inception gate.
- [x] Propose unit boundary, internal modules, integration order, ownership status and full-scope safeguards.
- [x] Evaluate all six required question categories with targeted review and explicit applicability rationale.
- [x] Independently review this plan and resolve findings.
- [x] Publish the plan and inspect the stage PR feedback.
- [ ] Collect and analyze explicit Q1 approval, resolving any requested ambiguity before generation.

### Part 2 — Only after Q1 approval

- [ ] Generate inception/application-design/unit-of-work.md: U-01 definition/responsibilities, internal modules, implementation sequence, acceptance and greenfield root code organization strategy.
- [ ] Generate inception/application-design/unit-of-work-dependency.md: one-unit dependency matrix, internal module/port relationships, external dependencies, parallelism and integration order.
- [ ] Generate inception/application-design/unit-of-work-story-map.md: all 25 stories assigned once to U-01 with primary/supporting modules, FR/NFR coverage and future acceptance evidence.
- [ ] Validate unit boundaries, dependencies, complete story/requirement mappings, all three artifacts, links/diagrams and full source/format/trust scope.
- [ ] Obtain separate generated-unit artifact approval and record it before completing Inception.
- [ ] STOP before Construction for the November 24 milestone; no application code generation.

## 7. Extension compliance and milestone boundary

| Rule | Current result |
|---|---|
| INFO5940-01 | Follow Units Part 1; concrete proposal and explicit plan/generation gates tracked in audit/state. |
| INFO5940-02 | All three mandatory unit artifacts plus greenfield strategy planned; after artifact approval STOP before Construction. Generic stage text about continuing to Construction is overridden by the mandatory course checkpoint. |
| INFO5940-03 | Prior answers/approvals complete; one deliberate pending Q1 reviews all six proposed choices and blocks generation. |
| INFO5940-04 | One local demo bundle, concrete local Ollama candidate and progressive read-only Codex MCP; optional narrow Jev permission. |
| INFO5940-05 | Planning documentation only; no application code, credentials or secrets. |
| INFO5940-06 | Same driver and ordered prior-stage dependency; one active Draft gate, no parallel teammate workflow or manual audit/state merge. |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | Carry pure-transform/round-trip/version obligations into unit evidence; implementation and runtime results deferred. |

## 8. Decomposition-plan approval

### Q1 — Confirm the complete six-category proposal

A) **Approve this plan and generate the three unit artifacts.** One U-01 covers all stories/requirements, with the nine internal modules, ordered dependencies, root src/tests/config organization and named ownership left for later team claiming. Retain the full approved scope and separate generated-unit review before stopping at Inception.

B) **Request changes before generation.** Specify the unit/module boundary, responsibility, dependency, ownership approach, code organization or missing acceptance coverage to revise. A request for several independently deployable units needs explicit architectural justification rather than silently relabeling modules.

C) **Other.** Describe an alternative proposal after the answer tag.

[Answer]:

This is the explicit Units planning gate required by Step 9. Application Design approval authorizes preparing this plan; it does not approve this unseen decomposition or its later generated artifacts. No unit artifacts, application code or Construction are generated before the applicable approvals.
