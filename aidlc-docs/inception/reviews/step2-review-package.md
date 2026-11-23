# Step 2 — Review Inputs and Concrete Change Proposals

**Status:** Corrected Inception complete through Units Generation following [Lawrence’s approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) at 2026-11-23T22:37:29Z. The documented MVP/deferrals and existing local evaluation approach are accepted as revised artifacts. STOP before Construction.
**Date:** November 23, 2026, America/New_York.
**Baseline:** PR #8, `a4b52f82f32c9524c76f1538d974e5413f21f733`.
**Plan:** [Step 2 preparation](../plans/step2-request-changes-plan.md).

## 1. Actual feedback and disposition

Every row is an actual published request or report, not an invented team discussion. A draft response is not acceptance by the author. The assigned inputs from all four reviewers are now available; their comments are not revised stage approvals. PR #7 was empty at initial preparation, then Safi posted the three technical comments recorded below.

| ID | Actual source | Request | Disposition and affected artifacts |
| --- | --- | --- | --- |
| RC-05-01 | [Chloe, PR #5](https://github.com/lawrencegranda/INFO-5940-project/pull/5#issuecomment-7088616303) | Make P-01 concrete with a synthetic name, program, courses, tools and week. | Adopted in the revised P-01/persona and US-17/18 example. No user research is claimed; artifact approval is recorded in section 15. |
| RC-05-02 | Same Chloe review | Clarify Codex CLI suitability or a non-terminal persona. | Revised primary journey uses the local UI/Ask without a terminal; FR-14/US-22 still require a Codex CLI technical pilot. This is a planned audience distinction, not evidence of usability research. |
| RC-05-03 | Same Chloe review | Student posts/notes must not supersede instructor instructions. | Adopted in FR-10, US-17/18 and the PublisherEvidence design contract. Role/applicability needs saved provenance; no claim of implemented verification. |
| RC-05-04 | Same review and [README follow-up](https://github.com/lawrencegranda/INFO-5940-project/issues/9#issuecomment-7088783536) | Propose US-06/07 as stretch and macOS-only must-have OCR; align README if accepted. | Retained OCR/advanced recognition and audio/video features as post-MVP work under the delivery allocation. Native text/PDF extraction and original fidelity remain MVP; no macOS-only platform choice is inferred. |
| RC-06-01 | [Iris, model probe](https://github.com/lawrencegranda/INFO-5940-project/pull/6#discussion_r4660610515) | Compare models before NFR stack selection; measure task quality, JSON validity, thinking mode, latency and memory; select embeddings separately. | Adopted as a draft execution-plan evaluation task; candidate models and discussion budgets are not test results or chosen requirements. |
| RC-06-02 | [Iris, extraction checkpoint](https://github.com/lawrencegranda/INFO-5940-project/pull/6#discussion_r4660610523) | Around Dec 2 test required formats; separately date real extension saves; record failures and request scope change if needed. | Current MVP checkpoint covers native pages/text/PDFs and actual local Ask/MCP evidence. Advanced-format/provider feasibility tests remain in later work; a failed current capability cannot be labeled complete. |
| RC-06-03 | [Iris, stage depth](https://github.com/lawrencegranda/INFO-5940-project/pull/6#discussion_r4660610526) | Keep U-01/all four future design stages, make local NFR/infra concise, add provisional development windows. | Adopted as a draft planning amendment with provisional windows; no unit split, calendar commitment or stage approval inferred. |
| RC-07-01 | [Safi, versions/tools](https://github.com/lawrencegranda/INFO-5940-project/pull/7#discussion_r4669544807) | Name prototype-supported versions, add validation/extraction/testing libraries and use the agreed six MCP tools. | Technical input received. Added Zod, pdf.js, linkedom and supertest to the draft baseline; six tools/course scope already reconciled. Proposed versions are not compatibility results or final team adoption. |
| RC-07-02 | [Safi, endpoint/tests](https://github.com/lawrencegranda/INFO-5940-project/pull/7#discussion_r4669553328) | Use port 4310, add save response and replace the stub/array-only test with a deadline function and two tests. | Port corrected. Both supplied tests independently pass in an isolated fixture. Preserve authority/course/chain limits and distinguish his proposed API from the implemented singular route/`content`/import-result contract; detailed disposition is in section 9. |
| RC-07-03 | [Safi, model/local scope/wording](https://github.com/lawrencegranda/INFO-5940-project/pull/7#discussion_r4669558415) | Keep Gemma as a candidate while comparing Qwen/DeepSeek; defer Jev/ChatGPT; remove candidate wording after merges. | Gemma remains an initial candidate pending comparison. Jev and remote ChatGPT/hosted MCP are retained for later delivery; local Ask + local MCP remain current MVP. The revised-artifact approval is recorded in section 15. |
| RC-08-01 | [Lawrence, module leads](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660293171) | Propose named leads for nine modules. | Proposed leads in section 5; no named owner acceptance is recorded. U-01/nine modules are retained, with FR-16/US-26 added to the revised mapping. |
| RC-08-02 | [Lawrence, Jev/filing](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660349245) | Define Jev, propose deferral, use local filing and confirm LMS-course mapping on first save. | Jev is defined and retained for later integration, with local/manual filing in the current MVP. Remembered LMS-course mapping remains an Open question; it is not silently adopted. |
| RC-08-03 | [Lawrence, Open questions](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660427686) | Starter folders/syllabus suggestions, first save, captions/transcription, resource queue and failed capture recovery. | Add the five topics to vision with explicit pending status; no proposed answer becomes accepted behavior. |
| RC-09-01 | [Lawrence, technical examples](https://github.com/lawrencegranda/INFO-5940-project/issues/9#issuecomment-7087745145) | Pair the actual deadline function and test; show capture response IDs/status. | Prepare illustrative Markdown examples, not application implementation or pipeline validation. |
| RC-09-02 | [Iris, README report](https://github.com/lawrencegranda/INFO-5940-project/issues/9#issuecomment-7087802622) | Local-only deployment, remote ChatGPT later, benchmark early Construction; wait for Jev/model/meeting decisions. | Record her reported local changes. No README PR has been opened; final README remains her task after integration. |
| RC-09-03 | [Lawrence, all comment channels](https://github.com/lawrencegranda/INFO-5940-project/issues/9#issuecomment-7087569806) | Read conversation and inline reviews. | Completed intake through connector equivalents; empty summaries/threads do not create additional feedback. |
| RC-09-04 | [Iris, submission timeline](https://github.com/lawrencegranda/INFO-5940-project/issues/9#issuecomment-7086257369) | Sequence Xiaolong's pass, team approval, ready, maintainer merges, README and submission. | The timeline remains a proposal. The November 23 10:00–10:10 AM EST Zoom meeting took place with all five members; see section 12. [Iris's minutes](meeting-minutes-2026-11-23.md) are incorporated. Meetings are scheduled as needed, based on project needs and team availability. |
| RC-MIN-01 | [Iris, meeting minutes](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115423294) | Record 10:00–10:10 AM Zoom/full-team discussion, Ask/local-MCP direction and separate allocation/model-plan/artifact confirmations. | [Minutes incorporated](meeting-minutes-2026-11-23.md); remaining confirmations are bundled in [the concrete review gate](step2-approval.md). The minutes do not approve implementation or merging. |

## 2. Concrete P-01 revision

**Revision:** P-01 now includes an illustrative profile, the two principal contexts and revised requirement mapping, with the local Ask journey distinguished from the technical Codex pilot.

### Illustrative profile — Maya

Maya is a synthetic first-year MPS Information Science student, not an interviewed or observed participant. Her name, program and course labels make the requirements-derived example concrete; they are not evidence of research. She takes INFO 5940, HCI 5300 and ML 4100, reads syllabi in Canvas, assignment briefs in Gradescope and announcements/discussions in EdStem, and already uses an AI assistant while studying.

In one illustrative November week, her saved syllabus says Assignment 2 is due November 20. A later saved EdStem message attributable to the instructor explicitly moves that assignment from November 20 to November 22. Maya's personal notes say November 24. She selects the course and asks local Ask, "When is Assignment 2 due?" A technical pilot can retrieve the same evidence using Codex over local MCP.

The instructor message can establish the supported November 20-to-November 22 update. The note does not establish another authoritative change; its disagreement remains visible under US-18. All originals stay available, evidence stays within the selected course, and the answer describes saved instructions rather than unseen LMS changes. The HCI 5300 label comes from Chloe's synthetic proposal and is not a claim about the HCI 3300 prototype seed.

**CLI audience:** The reported Ask decision supports a normal local UI journey without terminal use; FR-14/US-22 retain actual Codex CLI integration for the technical pilot. No assumption that all students can configure a terminal or remote ChatGPT integration is added.

## 3. Authority acceptance revision

**Shared convention:** For US-17/18, authority needs supporting saved evidence about the publisher/role and applicability to the same course instruction. A platform name, an "Announcement" material label, later capture time or model-generated role alone does not establish instructor authority. A student-authored reply, personal note or unsupported retelling is not itself an instructor update. Unknown precedence remains explicit.

**Criteria added to US-17, preserving existing IDs and scope:**

- **Given** a saved instructor instruction and a conflicting student-authored reply or personal note about the same assignment, **when** precedence is assessed, **then** the student source does not supersede the instructor instruction even if saved later or classified as an announcement; the conflict is surfaced through US-18.
- **Given** a purported update without saved evidence establishing publisher authority or same-instruction applicability, **when** that instruction is retrieved, **then** its platform/type label alone cannot establish an authoritative update, and substantive disagreement follows US-18.
- **Given** Maya's syllabus deadline of November 20, a supported instructor update to November 22 and a note saying November 24, **when** the claims are compared, **then** the supported 20-to-22 relationship stays traceable while the note's disagreement remains visible rather than becoming another authoritative update.

**Criteria added to US-18:**

- **Given** conflicting instructor and student-authored sources without evidence resolving the disagreement, **when** the conflict is inspected, **then** the student can distinguish the supported source roles, view both claims and evidence, and see that the student source did not supersede the instructor instruction.
- **Given** an unknown publisher role, **when** conflicting evidence is displayed/retrieved, **then** that uncertainty remains explicit rather than presenting an inferred instructor identity as verified.

Future fixtures should cover an instructor update, a later recapture of old material, a student post labeled announcement, unknown publisher evidence, a different-assignment/course control and the three-source example. These are planned checks, not passing tests. The design must explain provenance representation before claiming authenticated publisher verification. A new manual "confirmed with instructor" mutation flow is a separate proposal, not silently added here.

## 4. Workflow Planning and technical inputs

The execution-plan amendment records Iris's actual proposals: compare local models before NFR Requirements chooses the stack; record exact configurations and actual outputs; propose Dec 2 per-format attempts and a separate later live-LMS-save date; keep all four design stages and every required artifact; make local NFR/infra treatment concise; use provisional Dec 1/2/3–11/12–16 windows. Dates, numerical latency budgets and technology candidates remain unapproved proposals. No benchmark or extraction has been run by this pass.

The technical input reconciles already-approved contracts: six MCP tools, mandatory course scope except listing, and required hybrid acceptance with honest keyword fallback. Safi's actual technical input is now received; proposed versions/frameworks, a paired illustrative function/test and capture-response shape remain distinguishable from final NFR choices and verified integrations. They do not justify entering Construction.

The Jev deferral is now reflected in FR-06/12, NFR-02/05, US-09/19/24/25, C-08, service/method/dependency labels, execution rows, unit/story maps, vision/technical inputs and README. Future contracts remain; MVP compositions do not connect the hosted provider.

## 5. Module leads — Lawrence's proposal, acceptance pending

| Modules | Proposed lead | Current status |
| --- | --- | --- |
| M-01 Capture; M-09 MCP | Safi | Proposal; acceptance not recorded. |
| M-02 Library UI | Iris | Proposal; acceptance not recorded. |
| M-03 API/workflow; M-04 Evidence store | Lawrence | His proposal; team confirmation remains pending. |
| M-05 Extraction; M-07 Knowledge | Chloe | Proposal; acceptance not recorded. |
| M-06 Model gateways; M-08 Index/query | Xiaolong | Proposal; this preparation request is not an ownership vote. |

## 6. Genuine prototype feedback — separate from milestone scope

Xiaolong's [published Issue #9 reply](https://github.com/lawrencegranda/INFO-5940-project/issues/9#issuecomment-7091526471) says he has no specific README changes at the moment, then reports these four prototype issues. Do not relabel this as a README change request or claim the prototype bugs are fixed.

| ID | Reported issue | Milestone disposition |
| --- | --- | --- |
| PF-01 | Too much manual collection/organization before asking a useful question. | First-save/filing improvement candidate tied to existing FR-02/03/06. Does not authorize automatic LMS sync or unattended login. |
| PF-02 | Ask input disappears after changing pages. | Adopted as a future US-26 acceptance criterion now that local Ask is in scope: preserve per-course progress and scope in-flight results. No prototype fix is claimed. |
| PF-03 | Material ordering is unclear; show rule/allow sorting. | Prototype backlog; no UI implementation in this documentation pass. |
| PF-04 | HCI sample syllabus contains November 28 but Deadlines says no deadlines found. | Future acceptance proposal: normal single-source deadlines must not be confused with no saved evidence just because there is no update/conflict. Current sample date is synthetic. No fix or new app acceptance is claimed. |

## 7. Pending decisions and actual missing evidence

Iris's minutes are incorporated. Lawrence’s revised-artifact approval covers the explicit feature allocation and existing evaluation approach, without selecting a final runtime model or claiming a benchmark. Numerical budgets, proposed owner acceptance and detailed later adapters remain planning topics. Jev and advanced media features have an explicit approved post-MVP allocation; the [scope table](../requirements/mvp-scope.md) distinguishes current acceptance from later work.

| Topic | Still needed; baseline while pending |
| --- | --- |
| Technical review disposition | Safi's actual PR #7 review is received. Resolve its illustrative authority/chain/API limitations and review the resulting concrete technical input; receipt of comments is not acceptance of an implementation. |
| Team selection and meeting | The meeting took place on November 23, 2026, 10:00–10:10 AM EST on Zoom with all five members. [Iris's minutes](meeting-minutes-2026-11-23.md) are incorporated; the later artifact approval is recorded in section 15. Meetings are scheduled as needed, based on project needs and team availability. Product scope includes Ask + local MCP. The revised-artifact approval is recorded in section 15. |
| Ask and remote ChatGPT | Local course Ask + local MCP is included in the current MVP. Remote ChatGPT/hosted MCP is retained for later integration; the six current MCP tools are unchanged. |
| Models | The documented local generation/embedding evaluation approach is covered by the artifact approval; actual measurements and final selection occur during authorized Construction. No final model/benchmark is claimed. |
| Jev | Retained for later classification/routing/reranking and hosted-permission design; not connected or required in the current MVP. |
| CLI audience | Revised persona distinguishes ordinary local UI/Ask users from the required Codex CLI technical pilot. Validate actual usability/integration later; do not claim research or universal CLI suitability. |
| Formats/platform | Current MVP native HTML/text/PDF extraction and original fidelity; scan/image OCR, advanced math/diagram recognition and audio/video processing retained post-MVP. No extra OS commitment is made. |
| Ownership | Actual acceptance or amendments from the proposed leads. |
| Filing/Open questions | Actual choices on remembered LMS course mapping, confirmation behavior, editable defaults and processing/recovery proposals. |
| Revised gate acceptance | [Lawrence’s approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) explicitly accepts the revised artifacts, MVP and documented deferrals. This is the actual November 23 response, separate from historical approvals; other reviewers are not recorded as approving. |

## 8. Historical web-commit reconciliation

The actual commit inspection found these changes. This is a present-day explanation of observable diffs, not a backdated audit event or evidence of a meeting:

- `a7cf0c3`: changed the Application Design plan from in-progress to artifacts-generated/approval-pending and checked generation/validation/presentation tasks; left the final approval task unchecked.
- `0f82712`: changed state from Workflow Planning handoff to Application Design artifacts generated/approval pending, selected branch/PR #7 and updated the next action. It did not itself record generated-design approval.
- `1c064e3`: removed one trailing blank line from `application-design/component-dependency.md`; no component dependency or design contract changed.
- `489de94`: changed the Application Design plan header to complete at the already-recorded `2026-11-20T03:43:36Z` approval and checked the final approval-recording task. The matching approval exists in the historical audit; this retrospective note does not create a new approval or prove an unrecorded discussion.

Issue #9 described the four collectively as plan/state edits, but the inspected `1c064e3` diff is only that blank-line removal. No intent beyond the recorded commit text/diff is inferred. The original audit remains byte-for-byte intact before this pass's appended entries.

## 9. Safi's received technical review — validation and disposition

All three actual inline comments are linked in RC-07-01–03. Their associated review submissions are COMMENTED with empty summary bodies; those submissions do not add decisions beyond the inline text.

### Versions and interface examples

The proposed stack aligns with the prototype manifest: Node 22, TypeScript 5, Express 4, Zod 4, React 18, MCP SDK 1.x, SQLite/local files, pdf.js, linkedom, Vitest 5, fast-check 3 and supertest. The technical draft names these and retains unverified OCR/transcription choices for later evaluation. Safi explicitly proposes comparison before choosing the final model. Jev remains a planned integration under the explicit post-MVP allocation; local behavior is the current delivery path.

Safi correctly identifies 4310 as the prototype's default port. Inspection of the original source shows `/api/capture` or `/api/import`, a `content` field and an import result with `document` and `disposition`. His plural `/api/captures`, `capturedText` and flat receipt are a proposed shape, not the current prototype's implemented interface. The draft now states the distinction explicitly. HTTP 201 can be legitimate after a synchronous import; a queued response must keep extraction/other work pending rather than implying completion. The illustrative queued design receipt is not a runbook for the prototype.

### Exact example test rerun and additional synthetic probes

The exact two TypeScript blocks from Safi's comment were copied into an isolated temporary fixture outside this repository. Vitest 5.1.1 reported **two tests passed**. This independently verifies those examples only, not the actual library or source-authority pipeline.

Two additional, separately constructed synthetic probes expose limits in the proposed function:

1. A `kind: "note"` claim with a November 24 date and `supersedes` pointing to the syllabus is returned as `resolved`/applicable. The function does not check publisher role/authority evidence. A replacement pointer alone must not allow a student source to supersede instructor evidence.
2. A chain of syllabus November 20, first announcement November 22 replacing the syllabus, and second announcement November 25 replacing the first returns November 22 in forward array order and November 25 after reordering. The first-match selection is not a general latest-applicable-update policy.

The example also has no course field, so same-course authorization would have to be an explicit caller precondition, and `publishedAt` is not checked despite the comment describing a later change. These are limits of the proposed sample, not observed bugs in the running prototype.

**Disposition:** Retain the improvement of calling a real function and preserving evidence, but do not copy the sample as a complete production precedence algorithm. The technical draft's limited old/new-pair projection includes same-course checks and assumes an upstream-validated authority evidence reference; its student example retains separate source/version IDs. Broader acceptance must include student-supplied replacement claims, unknown publishers, wrong-course references and chained updates. Actual publisher verification and the full precedence algorithm remain technical/design work, not claims made by this sample. No prototype code is changed or review comment posted.

## 10. Ask + local MCP scope amendment and review package

The selected product scope includes local Ask and read-only local MCP. The [decision register](../requirements/decision-register.md#november-23-scope-amendment--ask-and-local-mcp) records the amendment to the earlier no-chat boundary. The revised-artifact approval is recorded in section 15.

The retained catalog contains 16 FRs, seven NFRs, 26 stories, 13 components and five logical services within U-01/nine modules; delivery-phase labels distinguish current MVP work from retained later capabilities. Existing IDs and the six MCP tools are retained; FR-16/US-26/C-13/S-05 add focused local Ask. It uses bounded saved evidence, validated exact citations, visible uncertainty, per-course navigation continuity and local read-only retrieval/generation. No remote ChatGPT path, autonomous actions or app implementation is added.

The [concrete artifact record](step2-approval.md) now contains Lawrence’s actual approval. The minutes are incorporated and corrected Inception is complete through Units Generation. Proceed to the Ready/ordered-merge handoff; Construction remains stopped. Iris's final README remains Step 4 after Lawrence integrates the approved documents.

## 11. Validation of the coordinated draft

All 25 changed/new Markdown files passed link-target, fence, newline, nonblank-answer and English-addition checks. The story/requirement maps contain 26 unique stories, 16 FRs and seven NFRs. Strict TypeScript checking passed for the extracted design contracts and paired technical example; the current illustrative Vitest test passed and both HTTP JSON bodies parse. Dependency matrix dimensions and Mermaid declaration/edge structure were checked; diagrams were not rendered and no application pipeline/model benchmark is claimed.

Two independent AI consistency reviews found one mismatch in unavailable-model versus invalid-output behavior. It was corrected: unavailable means retrieval-only evidence; invalid output means a safe error, with normal local browsing/search still available. AI review does not count as teammate approval. The original 45,685-byte audit prefix is unchanged and all additions remain English. No application, rule or Construction files changed.

## 12. Meeting details

| Field | Details |
| --- | --- |
| Date and time | November 23, 2026, 10:00–10:10 AM EST (America/New_York). |
| Format | Zoom. |
| Attendees | Lawrence Granda Zarzuela; Jiaxin (Iris) Li; Xiaolong Lin; Safiullah Safdariyan; Chloe Wang. |
| Meeting minutes | [Incorporated minutes](meeting-minutes-2026-11-23.md), published by Iris in [PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115423294). |
| Meeting schedule | Meetings are scheduled as needed, based on project needs and team availability. |

The product scope remains **Ask + local MCP**. The separate revised-artifact approval is recorded in [the approval record](step2-approval.md).

## 13. Delivery allocation — current MVP and retained later work

The current MVP includes local course Ask, local read-only MCP and their supporting native-text/PDF evidence library. Jev classification/routing/reranking, hosted-permission setup, scan/image OCR, advanced math/diagram recognition, audio/video processing and remote assistant integration remain planned later capabilities. They are deferred, not removed or rejected, and carry no committed later delivery date.

The [canonical allocation](../requirements/mvp-scope.md) preserves all IDs and future contracts. US-05/US-06 are post-MVP; US-07 retains current original-viewing/native-text obligations while recognition is later. Local filing/retrieval remains current in US-09/US-19, with Jev-assisted portions later. C-08 is not composed into the MVP. Current acceptance does not require successful deferred adapters/provider calls; it still requires honest unsupported status, exact sources, native-text retrieval, grounded Ask and real local MCP integration. The revised-artifact approval is recorded in section 15.

## 14. Meeting-minutes incorporation checkpoint (before approval was recorded)

The [November 23 minutes](meeting-minutes-2026-11-23.md) are incorporated from Iris's published PR #8 record. They confirm the ten-minute Zoom meeting, full-team attendance, local Ask/local read-only MCP direction, and retention of broader product ideas.

The minutes explicitly reserve confirmation of the detailed feature allocation, local model/embedding evaluation plan and revised artifacts. The current D-46 allocation and existing evaluation approach are the concrete proposals in [the final review prompt](step2-approval.md); they are not represented as detailed votes approved at 10:00 AM. That one review gate can confirm the package and its stated Open questions together. It does not require a benchmark or final runtime model now.

At the minutes-incorporation checkpoint, PRs #5–#7 were Draft and #8 was non-Draft, all unmerged. This checkpoint is superseded by the actual approval in section 15. The minutes alone did not authorize merging or Construction.

## 15. Actual revised-artifact approval and Step 2 handoff

[Lawrence’s approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) (`lawrencegranda`, 2026-11-23T22:37:29Z) explicitly approves the revised Inception artifacts through Units Generation, including the local Ask/read-only local MCP MVP and documented deferrals, and requires STOP before Construction. The exact response is preserved in [the approval record](step2-approval.md) and audit. Only Lawrence is recorded as the approving reviewer.

The existing local model/embedding evaluation approach was part of the previously published artifacts and is covered by that approval. No final model, benchmark, proposed module-lead acceptance or implementation is claimed. The subsequent minutes/gate packaging does not change the substantive product scope and is not represented as a particular later commit he reviewed.

Corrected Inception is complete through Units Generation. Xiaolong has completed the existing PR Ready handoff; Lawrence then merges #5, #6, #7 and #8 using merge commits, followed by the integration branch into main. Iris’s README and final verification/submission remain later Issue #9 tasks.

## 16. Verified Ready handoff

At 2026-11-23T22:56:30Z, GitHub metadata confirms PRs #5–#8 are non-Draft, unmerged and mergeable. Xiaolong changed #5–#7 from Draft to Ready under xiaolonglin1124-bit; #8 was already non-Draft. All four descriptions now cite the actual approval and ordered merge sequence. The 26-file approval/status publication at `2b8a9eef52e8a9e1c23a6fa6c6f7a615bbd42994` exactly matches the checked local files. Step 2 is complete. Lawrence’s Step 3 ordered merge-commit integration remains pending; STOP before Construction.
