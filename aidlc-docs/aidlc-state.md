# AI-DLC State Tracking

## Project Information

- **Project**: Course Copilot
- **AI-DLC Version**: 1.0.1
- **Project Type**: Greenfield
- **Start Date**: 2026-11-19T17:28:00Z
- **Current Phase**: INCEPTION
- **Current Stage**: Workflow Planning complete — Application Design handoff
- **Working Integration Branch**: `candidate/course-copilot`
- **Active Stage Branch**: `inception/03-workflow-planning`
- **Active Stage Review**: Draft PR #6 — https://github.com/lawrencegranda/INFO-5940-project/pull/6
- **Prior Stage Dependency**: User Stories PR #5 approved and ready for review; awaiting upstream maintainer integration. Merge prior stage first.
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

## Stage Progress

### INCEPTION PHASE

- [x] **Workspace Detection** — Greenfield repository verified; rule files active; reverse engineering skipped (2026-11-19T17:28:00Z).
- [x] **Reverse Engineering** — SKIPPED (Greenfield).
- [x] **Requirements Analysis** — Vision, technical environment, 43 verification questions, and 8 follow-up clarifications reconciled; decision register locked and requirements specification (`FR-01`–`FR-15`, `NFR-01`–`NFR-07`) approved on 2026-11-19T19:26:39Z.
- [x] **User Stories** — Planning and generated-artifact approvals explicitly recorded; P-01 persona and 25 stories validated in PR #5; approved on 2026-11-20T03:04:34Z.
- [x] **Workflow Planning** — Execution plan explicitly approved on 2026-11-20T03:18:17Z in PR #6; Application Design selected next; future Construction remains deferred.
- [ ] **Application Design** — EXECUTE after execution-plan approval; not started.
- [ ] **Units Generation** — EXECUTE after Application Design approval; not started.

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

- **Plan**: `aidlc-docs/inception/plans/execution-plan.md` (explicitly approved).
- **Stage slots**: 14 total; 12 selected for lifecycle execution, one skipped, one placeholder. Construction stages repeat as applicable to later approved units.
- **Completed selected stages**: Workspace Detection, Requirements Analysis, User Stories, Workflow Planning.
- **Remaining Inception**: Application Design, Units Generation.
- **Skipped**: Reverse Engineering (Greenfield; no existing application).
- **Future only**: Functional Design, NFR Requirements, NFR Design, Infrastructure Design, Code Generation, Build and Test.
- **Placeholder**: Operations (production deployment excluded; local demo setup remains required).
- **Risk**: High; real LMS/extraction/model/MCP integrations unverified.

## Next Action

Publish the execution-plan approval in PR #6, mark that completed gate ready for integration and enter Application Design on inception/04-application-design. Prepare its concrete plan, evaluate all five question categories against resolved decisions, then generate the full design artifact set under the approved execution plan and delegated engineering choices. Obtain explicit design-artifact approval before Units Generation. Preserve ordered integration (#5 before #6 before the next stage), the same single writer and the stop after approved Units Generation.
