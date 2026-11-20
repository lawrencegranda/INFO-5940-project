# AI-DLC State Tracking

## Project Information

- **Project**: Course Copilot
- **AI-DLC Version**: 1.0.1
- **Project Type**: Greenfield
- **Start Date**: 2026-11-19T17:28:00Z
- **Current Phase**: INCEPTION
- **Current Stage**: User Stories — Part 2 generated; awaiting generated-artifact approval
- **Working Integration Branch**: `candidate/course-copilot`
- **Active Stage Branch**: `inception/02-user-stories`
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
- [ ] **User Stories** — Part 1 planning explicitly approved; P-01 persona and 25 user stories generated and validated in Draft PR #5; generated-artifact approval pending.
- [ ] **Workflow Planning** — Not started.
- [ ] **Application Design** — Not started.
- [ ] **Units Generation** — Not started.

### CONSTRUCTION PHASE

- [ ] **Construction** — NOT AUTHORIZED at the November 24 milestone.

### OPERATIONS PHASE

- [ ] **Operations** — Out of scope.

## Next Action
Review `aidlc-docs/inception/user-stories/stories.md` and `personas.md` in Draft PR #5. After explicit generated-artifact approval is recorded, mark User Stories complete and proceed to Workflow Planning through the next approved single-writer gate. The candidate integration branch remains `candidate/course-copilot`.
