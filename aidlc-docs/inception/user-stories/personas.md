# Course Copilot — User Persona

**Stage:** Inception / User Stories / Part 2: Generation

**Status:** Corrective draft revised November 23, 2026; team review of the revised artifacts is pending. The November 20 approval applies to the earlier 25-story version, not these changes. This remains a synthetic, requirements-derived persona with no claim of completed user research.

**Persona:** P-01 — Maya, a student managing several courses

**Requirements baseline:** `485c52531f004b1e184fb595abe771cfbcd17003`, amended by the November 23 Ask + local MCP and phased-delivery decisions. The revised story set has 26 stories and covers FR-01–FR-16 and NFR-01–NFR-07. The earlier exclusion of built-in chat is superseded for focused local course Ask. Hosted Jev and advanced OCR/math/media processing remain planned post-MVP features, as defined in the [MVP scope and retained roadmap](../requirements/mvp-scope.md).

## Evidence and scope

This is a requirements-derived scenario persona. It translates approved product decisions into a consistent human context for the user stories. It is not a report of interviews, observed usage or usability research. No demographic attributes, measured adoption rates or validated model-performance claims are invented.

The MVP has one primary human user. Capture/organization and retrieval/verification are two contexts of that same student, not separate personas. Codex and other external assistants are integration clients. Instructors, graders, administrators and teammates are not additional product-user roles in this MVP.

## P-01 — Maya, a student managing several courses

| Attribute | Description |
|---|---|
| Role | A synthetic first-year MPS Information Science student maintaining a private library for INFO 5940, HCI 5300 and ML 4100. These illustrative course labels are not claims about actual enrollment. |
| Material environment | Course pages and announcements in Canvas, Gradescope and EdStem, plus ordinary webpages, research papers, PDFs and other local files the student is authorized to use. |
| Working environment | A Chrome browser for explicit capture and a local course library for organization, focused Ask and evidence inspection. The main student flow does not require a terminal. Local Codex CLI MCP is a separate technical-pilot integration path, not a presumed skill of every student. |
| Responsibility and control | Choose native-text pages/PDFs to save or import, authorize selected resources, confirm or correct local filing, and inspect originals and source evidence. Hosted Jev permissions belong to the retained post-MVP extension. |
| Main need | Retrieve relevant, attributable course evidence while preserving original sources, saved history and uncertainty about changed instructions. |

### Illustrative week and question

Maya reads syllabi in Canvas, assignment briefs in Gradescope and instructor announcements or student discussion in EdStem. She already uses an AI assistant while studying, but this scenario does not assume she can install or configure Codex CLI.

In a synthetic November week, her saved INFO 5940 syllabus says Assignment 2 is due November 20. A later saved EdStem message, with supporting publisher-role evidence attributing it to the instructor, explicitly changes that same assignment from November 20 to November 22. Her personal study notes say November 24. She opens INFO 5940 in the library and asks, "When is Assignment 2 due?"

Ask presents the supported instructor update to November 22 with its exact saved evidence, keeps the earlier syllabus available, and shows the notes' disagreement without treating those notes as another authoritative update. An EdStem label or an "Announcement" category alone is not publisher verification. Unknown role or ambiguous assignment identity stays visible. Nothing in this example implies that an unseen LMS update has been captured. HCI 5300 is an illustrative persona course, distinct from the HCI 3300 prototype seed.

### Goals

- Collect accessible course material and related research without repeatedly copying an entire course into a chat.
- Keep courses, folders/topics and tags understandable, with corrections available when suggested metadata is wrong.
- Find a relevant concept, requirement or source passage within the intended course.
- Ask a focused course question without configuring a terminal, then inspect the saved evidence supporting the answer.
- Return from another library tab without losing the active course's question or result.
- Check which saved instruction applies when an announcement changes an earlier deadline, exam detail or assignment rule.
- Inspect the original evidence and prior saved versions when an answer needs verification.
- Keep source URLs, capture times and known publication/effective dates available without treating every older document as stale.
- Retain control over private material and use saved content when the local model or network is unavailable; the MVP makes no hosted Jev requests.
- Understand incomplete extraction and recover through a permitted alternative such as manual upload.

### Pain points represented by the requirements

- Relevant material is dispersed across authenticated sites, files and announcements.
- Whole-course context uploads can overwhelm an assistant; a flat result list can mix courses or hide the passage that matters.
- An old syllabus and a newer announcement can express different instructions about the same assignment.
- Missing source links or saved-version information make an answer hard to verify.
- An incorrect course/folder suggestion can make a saved document difficult to find.
- A scanned page or media-only source can leave a gap in the MVP's searchable native text; originals and unsupported/deferred-processing limitations must remain visible. OCR and transcription address these gaps in later iterations.
- A required hosted model call would make access depend on permission, connectivity or paid usage.

These pain points are product premises inherited from the approved vision and requirements, not claims that every student experiences them or that user research has confirmed their frequency.

## Two contexts of P-01

### Capture and organize

**Trigger:** The student is viewing material worth retaining, receives a changed instruction, or has a local file to add.

**Desired flow:** Explicitly save an accessible native-text page or import a native-text PDF/file; review selected native/PDF embedded resources and their status; confirm or correct local course/folder metadata; retain the source and original content; make the available text evidence searchable. Scans/media may retain originals with visible limitations; advanced extraction is post-MVP.

**Control needs:** Capture only material the student selected and can access. Keep credentials and session tokens out of the saved material. Make uncertain suggestions correctable and partial/failed/unsupported extraction visible. Correcting metadata must not rewrite an original snapshot or erase history.

**Successful outcome:** The material is findable in the intended course with its source, capture information and honest extraction status. A changed recapture preserves a new observed version; an unchanged recapture does not create a duplicate version.

### Retrieve and verify

**Trigger:** The student has a conceptual course question or needs to check a requirement, deadline, exam detail or conflicting instruction.

**Desired flow:** Select the course and use local Ask; retrieve compact candidates and exact saved passages; read a supported answer with citations or an honest insufficient-evidence/conflict result; inspect original sources or history. A technically supported Codex CLI pilot can use the same read-only evidence capabilities through local MCP instead. It is an alternate client path, not a prerequisite for the UI flow.

**Control needs:** Keep course scope explicit and evidence attributable. Favor the latest applicable saved evidence only when source relationships and precedence support it. Preserve both sides of an unresolved conflict. A later capture time alone does not establish authority, and a manually saved library cannot reveal an update that was never captured.

**Successful outcome:** Maya receives a course-scoped answer supported by the selected saved passages and exact source/version information, without loading the entire library. She can verify evidence, see meaningful uncertainty, and resume her per-course question/result after tab navigation. If the local answer model is unavailable, the library discloses retrieval-only mode and provides available evidence without pretending to generate an answer. Local keyword/metadata retrieval remains available if local AI is unavailable. Hosted Jev integration is not required by the MVP.

## Mapping to the current journey groups

The companion stories use P-01 with the context names above. This map records the persona's needs; the stories and their coverage map carry the detailed acceptance criteria.

| Journey group | P-01 context | Need represented | Requirement anchors |
|---|---|---|---|
| Collect accessible material | Capture and organize | MVP: save native-text pages/PDFs, select native/PDF resources and recognize gaps. Post-MVP: OCR and media extraction/transcription. | FR-02, FR-03, FR-04, FR-05; NFR-02, NFR-04 |
| Organize and correct | Capture and organize | Keep courses separate, correct filing and use source-linked incremental summaries. | FR-01, FR-06, FR-07; NFR-01, NFR-03 |
| Preserve and inspect sources | Both contexts | Retain immutable originals, distinguish recaptures and inspect typed links and history. | FR-04, FR-08, FR-09, FR-15; NFR-03 |
| Understand changed instructions | Retrieve and verify | Follow evidence-supported supersession and inspect unresolved competing claims. | FR-08, FR-10, FR-11, FR-15; NFR-03 |
| Retrieve evidence progressively | Retrieve and verify | Search scoped evidence previews and then fetch cited content through Codex. | FR-12, FR-13, FR-14; NFR-01, NFR-03 |
| Ask a focused course question | Retrieve and verify | Use local Ask without CLI setup, verify answer citations and retain per-course progress during navigation. | FR-16; NFR-01, NFR-02, NFR-03, NFR-04, NFR-07 |
| Stay in control during failures | Both contexts | MVP: preserve local access/manual filing with local AI unavailable. Post-MVP: control hosted Jev transmission. | FR-06, FR-12, FR-14; NFR-01, NFR-02, NFR-04, NFR-05, NFR-07 |

NFR-06 applies across the journeys: story acceptance must distinguish repeatable controlled fixtures, actual source integrations, manual review and runtime smoke tests. A planned test or a fixture result is not evidence that a live integration has been verified. NFR-07 remains an obligation to measure practical local-model feasibility rather than a performance promise.

## Assumptions and validation limits

| Item | Basis and limit |
|---|---|
| The student can review uncertain classifications and inspect evidence. | A scenario assumption supporting the approved correction and verification flows; it has not been validated in a usability study. |
| The student can configure Codex CLI. | Not assumed for the primary UI persona. Actual Codex MCP setup and search-then-fetch verification remain required for a technically supported pilot; suitability and onboarding require later validation. |
| A specific page, file or embedded resource is accessible and permitted to capture. | Must be checked for that item. The persona does not imply unrestricted access to every LMS resource or protected embed. |
| A local model can run acceptably on the student's laptop. | An engineering hypothesis requiring later smoke tests. The preliminary Ollama model choice is not measured performance evidence. |
| Available source evidence establishes authority or supersession. | Must be checked for each substantive claim. Unknown precedence requires visible competing evidence and uncertainty. |
| The student allows hosted Jev processing. | Post-MVP only and never assumed. The retained extension requires scoped disclosure/permission and local fallback; the MVP sends no Jev request. |

The original 43 decisions and eight clarifications remain historical records. The current phased scope includes local Ask + local MCP and their native-text evidence foundation in the MVP; Jev, scan/image OCR, advanced math/diagram recognition and audio/video extraction/transcription remain planned for later iterations. Exact model selection and runtime feasibility remain validation work. No deferred feature is deleted from the roadmap.

## Boundaries that stories must preserve

- One private student library with multiple courses; no cross-user sharing, shared cloud accounts or additional administrative workflows.
- Explicit saving and permitted local imports; no automatic LMS synchronization, unattended login or credential collection.
- Original snapshots and observed versions remain separate from editable metadata and generated summaries.
- Historical versions can be inspected; historical point-in-time query search is outside the approved MVP.
- Hosted Jev and advanced OCR/math/media processing are post-MVP; original preservation/viewing and honest unsupported/partial status remain MVP obligations.
- Focused local Ask and read-only local MCP share the same scoped evidence layer. Ask cannot capture, modify evidence or change permissions through a question. General-purpose agent actions and remote ChatGPT MCP integration remain outside this scope.
- No generic stale warning based only on age, no silently resolved substantive contradiction, and no claim about unseen LMS changes.

## Source traceability

- [Approved story-generation plan](../plans/story-generation-plan.md), especially the persona, journey grouping and evidence safeguards.
- [Requirements and current amendments](../requirements/requirements.md): primary-user scope, FR-01 through FR-16, NFR-01 through NFR-07 and the critical user journeys.
- [Decision register](../requirements/decision-register.md): Q01-Q03, Q05-Q24 and Q27-Q40, including the closed clarifications on saved evidence, metadata correction, local MCP and hosted processing.
- [Product vision](../../../docs/vision.md): problem, primary user, capture/retrieval journey and MVP boundaries.
