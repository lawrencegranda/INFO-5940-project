# AI-DLC State Tracking

## Project Information

- **Project**: Course Copilot
- **AI-DLC Version**: 1.0.1
- **Project Type**: Greenfield
- **Start Date**: 2026-11-19T17:28:00Z
- **Current Phase**: INCEPTION
- **Current Stage**: Coordinated corrective Inception artifacts generated for team review; Ask + local MCP recorded; revised artifact approval pending
- **Historical Inception Completed At**: 2026-11-20T04:20:19Z
- **Working Integration Branch**: `candidate/course-copilot`
- **Active Stage Branch**: `inception/05-units-generation`
- **Latest Stage Review**: Historical approvals retained; revised artifacts on PR #8 require actual team review. Latest observed metadata: PRs #5–#7 Draft, #8 non-Draft with an older on-hold body, all unmerged. Platform status is not revised approval: https://github.com/lawrencegranda/INFO-5940-project/pull/8
- **Prior Stage Dependency**: Historical approvals in PRs #5–#8 remain in the audit. Chloe, Iris, Safi and Lawrence supplied their assigned review inputs. Xiaolong reports the team settled on Ask + local MCP and authorized the coordinated draft; actual review/approval of these artifacts remains pending before Ready or integration.
- **Course Checkpoint**: Inception through Units Generation due 2026-11-24T23:59:00-05:00; STOP before Construction

## Workspace State

- **Existing Application Code**: No
- **Programming Languages Present**: None in application source; TypeScript proposed for Construction
- **Build System Present**: No application build system yet; Node.js/npm proposed
- **Project Structure**: Greenfield documentation and AI-DLC rule files
- **Reverse Engineering Needed**: No (Greenfield)
- **Workspace Root**: Root of `lawrencegranda/INFO-5940-project`

## Code Location Rules

- **Application Code**: Repository workspace root and application packages only; NEVER inside `aidlc-docs/`.
- **Documentation**: Generated AI-DLC artifacts under `aidlc-docs/`; project input documents under `docs/`.
- **No Secrets**: No LMS session tokens, credentials, or API secrets in version control or documentation.
- **Structure Patterns**: Follow `.aidlc-rule-details/construction/code-generation.md` when Construction is authorized.

## Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| INFO 5940 Course Rubric (mandatory) | Yes | Workflow start; always enforced |
| Security Baseline (optional) | No | Requirements Analysis, Q41 = B |
| Resiliency Baseline (optional) | No | Requirements Analysis, Q42 = B |
| Property-Based Testing (optional) | Yes (Partial) | Requirements Analysis, Q43 = B |

**Property-Based Testing scope:** Partial option B: pure transformations, serialization round trips, and versioning invariants.

## Historical Stage Progress (before the corrective pass)

### INCEPTION PHASE

- [x] **Workspace Detection** — Greenfield repository verified; rule files active; reverse engineering skipped (2026-11-19T17:28:00Z).
- [x] **Reverse Engineering** — SKIPPED (Greenfield).
- [x] **Requirements Analysis** — Vision, technical environment, 43 verification questions, and 8 follow-up clarifications reconciled; decision register locked and requirements specification (`FR-01`–`FR-15`, `NFR-01`–`NFR-07`) approved on 2026-11-19T19:26:39Z.
- [x] **User Stories** — Planning and generated-artifact approvals explicitly recorded; P-01 persona and 25 stories validated in PR #5; approved on 2026-11-20T03:04:34Z.
- [x] **Workflow Planning** — Execution plan explicitly approved on 2026-11-20T03:18:17Z in PR #6; Application Design selected next; future Construction remains deferred.
- [x] **Application Design** — Five mandatory artifacts, twelve components and four logical services explicitly approved on 2026-11-20T03:43:36Z in PR #7.
- [x] **Units Generation** — Plan and all three generated artifacts separately approved; final approval 2026-11-20T04:20:19Z in PR #8. U-01/nine modules cover all 25 stories, 15 FRs and seven NFRs.

### CONSTRUCTION PHASE

- [ ] **Functional Design** — EXECUTE later per unit; deferred.
- [ ] **NFR Requirements** — EXECUTE later per unit; deferred.
- [ ] **NFR Design** — EXECUTE later per unit; deferred.
- [ ] **Infrastructure Design** — EXECUTE later with concise laptop-local mapping; deferred.
- [ ] **Code Generation** — EXECUTE later; deferred.
- [ ] **Build and Test** — EXECUTE later; deferred.

**Construction is NOT AUTHORIZED at the November 24 milestone.** Stage selection is a future plan, not completion or permission to start.

### OPERATIONS PHASE

- [ ] **Operations** — Out of scope.

## Execution Plan Summary

- **Plan**: `aidlc-docs/inception/plans/execution-plan.md` (historically approved; corrective amendment pending review).
- **Stage slots**: 14 total; 12 selected for lifecycle execution, one skipped, one placeholder. Construction stages repeat as applicable to later approved units.
- **Completed selected stages**: Workspace Detection, Requirements Analysis, User Stories, Workflow Planning, Application Design, Units Generation.
- **Remaining corrective work**: Obtain actual team review/approval of the validated, published coordinated draft. Record genuine meeting evidence separately, then follow Issue #9 integration/README/submission. Historical approvals do not complete this pass.
- **Skipped**: Reverse Engineering (Greenfield; no existing application).
- **Future only**: Functional Design, NFR Requirements, NFR Design, Infrastructure Design, Code Generation, Build and Test.
- **Placeholder**: Operations (production deployment excluded; local demo setup remains required).
- **Risk**: High; real LMS/extraction/model/MCP integrations unverified.

## Current Checkpoint and Handoff

**Current scope:** Focused local course Ask + local read-only MCP, as reported by Xiaolong on November 23. His subsequent "ok go on" authorizes the described coordinated document revisions and publication for review, not unseen-artifact approval. The [decision register](inception/requirements/decision-register.md#november-23-scope-amendment--ask-and-local-mcp) supersedes only the historical no-chat exclusion; remote ChatGPT/hosted MCP remains excluded. No meeting date, attendees, votes or ownership acceptance is inferred.

**Current draft:** 16 FRs, seven NFRs, 26 stories, P-01 with synthetic Maya, 13 components and five logical services, U-01/nine internal modules, and the unchanged six MCP tools. FR-16/US-26/C-13/S-05 describe local grounded Ask, exact citation validation, visible conflicts/insufficient evidence, per-course navigation continuity and in-flight isolation. Ask has no library-write or hosted-provider capability; external Codex model processing remains a separate boundary.

The [corrective plan](inception/plans/step2-request-changes-plan.md) and [review package](inception/reviews/step2-review-package.md) record actual PR #5–#8/Issue #9 inputs and dispositions, proposed leads, five Open questions and the four web-commit explanations. The withdrawn earlier story question is not an approval. Historical gate answers/audit bytes remain preserved; the old wider local unanswered questionnaire is not silently filled or imposed on this bounded pass.

Technical inputs contain proposed version ranges, the six-tool course scope, a queued capture example and a limited paired deadline function/test. Safi's exact two illustrative tests passed independently, while additional synthetic probes exposed authority/chain limitations; the draft explains those limits. Contract/example checks validate documentation only, not model performance, actual source capture or product acceptance. Jev/media scope-reduction requests remain unadopted; the existing optional Jev and required-format baseline remains visible. Final model/embedding/OCR choices and measured budgets belong to later authorized design/Construction.

**Publication checkpoint:** The 25-file corrective package was published through the verified xiaolonglin1124-bit browser session in eight commits on the existing PR #8 branch. Fetch and byte-for-byte comparison at remote c1202512668fea2d22d0154b466b830bae1174c6 found zero mismatches; all eight commit authors are xiaolonglin1124-bit. This state/audit/checklist follow-up records that observed result and remains review-only. No new branch/PR, Ready transition, merge or prototype integration. Other-account command-line/connector credentials were not used for writes. Latest observed PR metadata is #5–#7 Draft and #8 non-Draft; all remain unmerged and current artifact approval is pending.

**Next actual input:** Team reviews the [concrete revised-artifact prompt](inception/reviews/step2-approval.md), requests specific changes or approves the artifacts with actual respondent/source/rationale. Record the required dedicated problem meeting's real date/format/attendees and cadence separately. No future technical choice, proposal or async review substitutes for missing meeting evidence.

**Handoff after approval:** Xiaolong records corrected Inception complete through Units Generation and the STOP before Construction; follow the Issue #9 Ready sequence. Lawrence integrates existing stage PRs in order, Iris prepares the final README against the merged result, and the team completes final repository/submission checks. The independently developed prototype stays isolated. No application code or Construction is authorized here.
