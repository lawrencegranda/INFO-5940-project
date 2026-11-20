# Course Copilot — User Stories Generation Plan

**Stage:** Inception / User Stories / Part 1: Planning
**Status:** Complete. Planning approved on 2026-11-20T02:44:10Z; generated stories and persona approved separately on 2026-11-20T03:04:34Z.
**Integration branch:** `candidate/course-copilot`
**Stage branch:** `inception/02-user-stories`
**Requirements baseline:** `485c52531f004b1e184fb595abe771cfbcd17003`

## 1. Purpose and fixed inputs

Translate the approved Course Copilot requirements into student-centered stories and acceptance criteria. This plan does not reopen the 43 resolved decisions or eight resolved clarifications, change MVP scope, specify implementation tasks, or claim that a prototype exists.

The primary user is one student managing multiple courses. The product is a private local course library exposed to an external AI assistant through read-only MCP. It retains original sources, saved versions and substantive conflicting evidence. A built-in chat interface, automatic LMS synchronization, shared cloud accounts and hosted MCP remain out of scope.

The existing technical direction stays local-first: TypeScript/Node, SQLite and local files, preliminary local Ollama, and hosted Jev only with explicit disclosure and opt-in. Runtime benchmarks and implementation choices will be verified in their appropriate later stages.

## 2. Story organization options

| Approach | Benefit | Limitation for this project |
|---|---|---|
| User journey | Keeps the student's end-to-end outcome visible. | Shared qualities need a separate coverage map. |
| Feature | Makes individual capabilities easy to locate. | Can split a single student task across unrelated sections. |
| Persona | Separates different human roles. | This MVP has one primary human role; inventing additional roles would expand scope. |
| Domain | Groups concepts such as sources, versions and retrieval. | Risks describing internal records instead of student value. |
| Epic | Organizes larger outcomes and related small stories. | Needs explicit rules to prevent oversized stories. |

**Proposed approach:** Organize by the approved user journeys, using descriptive epics as containers. Each story must express one observable student outcome. Split a story when it has independently useful behavior or materially different success/failure conditions. Use a shared FR/NFR map for cross-cutting requirements; do not create duplicate stories solely to repeat a technical quality.

## 3. Persona approach

Create **P-01: a student managing several courses**. Describe goals, context, pain points, evidence needs and constraints without inventing demographic facts, research interviews or additional roles.

Use two contexts within that same persona:

- **Capture and organize:** save accessible course material, import files, confirm filing and recover from incomplete extraction.
- **Retrieve and verify:** find scoped evidence, check changed instructions and inspect original sources or history.

External MCP clients, instructors, graders and administrators are not additional product-user personas in this MVP.

## 4. Planned journey groups and coverage

| Story group | Student outcome | Main functional coverage |
|---|---|---|
| Collect accessible material | Save explicitly selected pages and files, authorize embedded resources, and understand extraction results. | FR-02, FR-03, FR-04, FR-05 |
| Organize and correct | Maintain separate courses, correct suggested metadata and receive source-linked incremental summaries. | FR-01, FR-06, FR-07 |
| Preserve and inspect sources | Keep immutable originals, recognize unchanged/changed recaptures and inspect typed links and prior versions. | FR-04, FR-08, FR-09, FR-15 |
| Understand changed instructions | Follow grounded supersession and view unresolved substantive conflicts with both sources. | FR-08, FR-10, FR-11, FR-15 |
| Retrieve evidence progressively | Search a course with compact previews, then fetch cited passages through Codex's local read-only MCP connection. | FR-12, FR-13, FR-14 |
| Stay in control during failures | Use saved material locally, control hosted transmission and keep manual filing/local retrieval available. | FR-06, FR-12, FR-14 and cross-cutting NFRs |

Every story will identify its persona and FR/NFR references. Every FR-01 through FR-15 and NFR-01 through NFR-07 must appear in the coverage map, even when implemented through a shared acceptance condition rather than a separate story.

| Shared quality | Acceptance obligation carried into generation |
|---|---|
| NFR-01 | The student can use the saved local library without required cloud hosting or an LMS API key. |
| NFR-02 | Saving excludes credentials; hosted Jev transmission is disclosed, minimal and explicitly authorized. |
| NFR-03 | Retrieved evidence identifies its original URL, saved document/version and capture time. |
| NFR-04 | Incomplete, failed and unsupported extraction stays visible to the student. |
| NFR-05 | Manual filing and local keyword/metadata retrieval continue when Jev is unavailable. |
| NFR-06 | Critical behavior has repeatable evidence expectations, including the inherited partial property-testing scope. |
| NFR-07 | Later runtime checks measure local-model feasibility; core library/search availability does not require paid model calls. |

## 5. Story and acceptance format

Each story will contain:

- A stable story ID, title, journey group and persona/context.
- An "As a student, I want ..., so that ..." statement with an observable benefit.
- References to the approved functional/non-functional requirements.
- Given/When/Then acceptance criteria covering the successful outcome and relevant edge/failure conditions.
- Any dependency or assumption that prevents independent acceptance, stated explicitly.
- An evidence expectation: controlled fixture, actual source integration, manual review or runtime smoke test. A fixture is not proof of a live integration.

Review each story for INVEST: Independent, Negotiable, Valuable, Estimable, Small and Testable. Do not insert sprint commitments, invented latency targets, story-point estimates or implementation task lists at this stage.

### Illustrative acceptance shape

For the approved deadline-change scenario, future acceptance criteria should establish that:

- Given a saved syllabus with a November 20 deadline and a later saved authoritative announcement explicitly moving the same assignment to November 22, retrieval returns November 22 with the announcement's source evidence.
- Both saved originals and their source/capture information remain available.
- Saving a document later does not itself establish higher authority or supersession.
- When precedence cannot be established, both conflicting claims are visible instead of silently choosing one.
- The result describes the latest applicable **saved** evidence and makes no claim about unseen LMS updates.

These are a planning illustration based on approved requirements, not generated story artifacts or executed test results.

## 6. Scope and evidence safeguards

- Preserve all three required LMS capture sources: Canvas, Gradescope and EdStem, plus ordinary webpages, papers/PDFs and local imports.
- Preserve the required native text, scanned/image OCR, math/diagram fidelity and accessible audio/video transcription coverage. Do not quietly reduce the approved MVP to HTML-only or Canvas-only.
- Include explicit `complete`, `partial`, `failed` and `unsupported` outcomes and manual upload recovery where appropriate.
- Separate source identity/content hashes from model-suggested similarity. Similarity cannot silently merge original sources.
- Separate original snapshots from editable course/folder/title/tag/authority metadata.
- Separate historical version inspection from excluded historical "as-of" querying.
- Ground authority, effective dates and supersession in explicit evidence and rules; model assertions alone cannot establish precedence.
- Preserve read-only MCP and progressive search-then-fetch behavior, including actual Codex CLI verification in later implementation acceptance.
- Keep hosted Jev disabled until the user authorizes the specific minimal content transmission; core saved-content availability and local retrieval must not depend on paid calls.
- Carry forward the partial property-based testing scope for pure transformations, round trips and version invariants. User Stories records these acceptance obligations; framework configuration and code belong to later stages.
- Mark all future integrations and runtime model performance as unverified until measured. Never describe planned fixtures as existing product functionality.

## 7. Execution checklist

### Part 1 — Planning

- [x] Load the existing state, audit, approved requirements and prior decisions.
- [x] Verify the 43 answers and eight clarifications are resolved; avoid repeating product questions.
- [x] Fetch the integration branch and check for open Inception PRs before editing.
- [x] Document why User Stories adds value in `user-stories-assessment.md`.
- [x] Propose persona, grouping, story format, coverage and validation methods.
- [x] Present alternative grouping approaches and their trade-offs.
- [x] Prepare the explicit planning approval below.
- [x] Check available teammate PR feedback: no conversation, review or inline comments at Part 2 preflight.
- [x] Record the user's deliberate approval answer verbatim in `audit.md`.
- [x] Confirm that approval is unambiguous before starting Part 2.

### Part 2 — Generation, after planning approval

- [x] Generate `aidlc-docs/inception/user-stories/personas.md` using the approved persona approach.
- [x] Generate `aidlc-docs/inception/user-stories/stories.md` using the approved grouping and format.
- [x] Map persona/context and requirement references to each story.
- [x] Check coverage of every FR and NFR, including privacy, failure and offline paths.
- [x] Check INVEST, clear Given/When/Then conditions and story dependencies.
- [x] Check source/format breadth, saved-evidence semantics and honest verification labels.
- [x] Validate Markdown, links, IDs, requirement references and completed plan checkboxes.
- [x] Read Draft PR feedback and reconcile it through the shared audit trail.
- [x] Present generated stories and persona for their separate generation approval.
- [x] Record that approval before marking User Stories complete or entering Workflow Planning.

## 8. Planning approval

There is **one planning gate**, not a new product questionnaire. All earlier product decisions remain approved. The answer below records the user's explicit approval of this concrete plan; the response is preserved verbatim in the audit.

### Q1 — Review this User Stories approach

A) **Approve this plan and proceed to story/persona generation.** Use the proposed journey-based grouping, one primary student persona, INVEST review, Given/When/Then acceptance criteria and complete FR/NFR coverage.

B) **Request changes before generation.** Describe the changes after the answer tag; generation stays pending until the revised plan is explicitly approved.

C) **Other.** Describe an alternative direction after the answer tag.

[Answer]: A

**Approval response (verbatim):** A：批准计划并继续生成

Planning approval does not approve unseen generated stories, later design gates or Construction. The requested prototype remains a downstream deliverable following those gates.

## 9. Extension compliance for the approved plan and generated artifacts

| Rule | Status | Evidence or applicability |
|---|---|---|
| INFO5940-01 | Compliant | Resume the existing workflow; record explicit planning approval and generation actions in the append-only audit; record both explicit User Stories approvals before advancing. |
| INFO5940-02 | Compliant | Inception documentation only; generated stories and persona require separate approval before the next stage. No application code or Construction. |
| INFO5940-03 | Compliant at current gate | Inherited answers and the explicit planning approval are complete. The separate generated-artifact approval is recorded in stories.md and the audit. |
| INFO5940-04 | Compliant | Retain the approved local-first LLM/MCP product direction. |
| INFO5940-05 | Compliant | Documentation only; no credentials or application code. |
| INFO5940-06 | Compliant | Draft PR #5 is the only active Inception PR; remotes and all feedback channels were checked before Part 2. |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | N/A to implementation at this stage | No code or test framework is generated; acceptance obligations are retained for later design and Construction. |

Optional security and resiliency baseline extensions remain disabled according to the inherited decisions. Core approved privacy and error-reporting requirements remain in force.
