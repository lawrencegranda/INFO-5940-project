# AI-DLC State Tracking

## Project Information

- **Project**: Course Copilot
- **AI-DLC Version**: 1.0.1
- **Project Type**: Greenfield
- **Start Date**: 2026-11-19T17:28:00Z
- **Current Phase**: INCEPTION
- **Current Stage**: Requirements Analysis
- **Working Integration Branch**: `candidate/course-copilot`
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
- [ ] **Requirements Analysis** — 43 verification responses recorded; 8 follow-up clarifications in progress (`requirements-clarification-questions.md`).
- [ ] **User Stories** — Not started.
- [ ] **Workflow Planning** — Not started.
- [ ] **Application Design** — Not started.
- [ ] **Units Generation** — Not started.

### CONSTRUCTION PHASE

- [ ] **Construction** — NOT AUTHORIZED at the November 24 milestone.

### OPERATIONS PHASE

- [ ] **Operations** — Out of scope.

## Next Action
Resolve the 8 targeted follow-up clarification questions in `aidlc-docs/inception/requirements/requirements-clarification-questions.md`, lock `decision-register.md`, and generate `requirements.md`.
