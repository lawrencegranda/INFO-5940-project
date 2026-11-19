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
| Security Baseline (optional) | Pending | To be decided in Requirements Analysis (Q41) |
| Resiliency Baseline (optional) | Pending | To be decided in Requirements Analysis (Q42) |
| Property-Based Testing (optional) | Pending | To be decided in Requirements Analysis (Q43) |

## Stage Progress

### INCEPTION PHASE

- [x] **Workspace Detection** — Greenfield repository verified; rule files active; reverse engineering skipped (2026-11-19T17:28:00Z).
- [x] **Reverse Engineering** — SKIPPED (Greenfield).
- [ ] **Requirements Analysis** — In progress.
- [ ] **User Stories** — Not started.
- [ ] **Workflow Planning** — Not started.
- [ ] **Application Design** — Not started.
- [ ] **Units Generation** — Not started.

### CONSTRUCTION PHASE

- [ ] **Construction** — NOT AUTHORIZED at the November 24 milestone.

### OPERATIONS PHASE

- [ ] **Operations** — Out of scope.

## Next Action
Capture Course Copilot product vision and technical environment inputs, then generate the Requirements Analysis verification question gate.
