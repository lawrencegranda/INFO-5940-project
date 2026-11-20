# AI-DLC State Tracking

## Project Information

- **Project**: Course Copilot
- **AI-DLC Version**: 1.0.1
- **Project Type**: Greenfield
- **Start Date**: 2026-11-19T17:28:00Z
- **Current Phase**: PROTOTYPE IMPLEMENTATION (separately authorized after Inception)
- **Current Stage**: Local prototype implemented, verified and published for trial
- **Inception Completed At**: 2026-11-20T04:20:19Z
- **Working Integration Branch**: `candidate/course-copilot`
- **Active Stage Branch**: `prototype/local-course-copilot`
- **Latest Stage Review**: PR #8 — approved/ready for maintainer integration: https://github.com/lawrencegranda/INFO-5940-project/pull/8
- **Prior Stage Dependency**: User Stories #5, Workflow Planning #6 and Application Design #7 approved/ready; awaiting maintainer integration in order.
- **Course Checkpoint**: Historical Inception checkpoint through Units Generation due 2026-11-24T23:59:00-05:00; its stop was honored at closure. The user's subsequent “我们现在就做吧” explicitly authorizes this separate prototype track. Formal full Construction approvals are not inferred or fabricated.

## Workspace State

- **Existing Application Code**: Yes — local Course Copilot prototype under root `src/`, `scripts/`, `tests/`
- **Programming Languages Present**: TypeScript/React, JavaScript, CSS, Swift native OCR helper
- **Build System Present**: npm/esbuild, project-local Node 22, TypeScript, Vitest
- **Project Structure**: Approved Inception documents plus separately authorized prototype; ignored local SQLite/originals/runtime files
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
- [x] **Application Design** — Five mandatory artifacts, twelve components and four logical services explicitly approved on 2026-11-20T03:43:36Z in PR #7.
- [x] **Units Generation** — Plan and all three generated artifacts separately approved; final approval 2026-11-20T04:20:19Z in PR #8. U-01/nine modules cover all 25 stories, 15 FRs and seven NFRs.

### CONSTRUCTION PHASE

- [ ] **Functional Design** — EXECUTE later per unit; deferred.
- [ ] **NFR Requirements** — EXECUTE later per unit; deferred.
- [ ] **NFR Design** — EXECUTE later per unit; deferred.
- [ ] **Infrastructure Design** — EXECUTE later with concise laptop-local mapping; deferred.
- [ ] **Code Generation** — EXECUTE later; deferred.
- [ ] **Build and Test** — EXECUTE later; deferred.

These unchecked entries describe the formal lifecycle track retained from the Inception checkpoint. They do not negate the later, explicitly authorized prototype work below or imply that formal review gates were completed.

### SEPARATE PROTOTYPE TRACK

- [x] **Implementation authorization** — User explicitly requested “我们现在就做吧” after the checkpoint discussion; approved Inception history retained.
- [x] **Working implementation** — SQLite/originals, import/extraction, course-scoped lexical/local-vector retrieval, saved deadline evidence, responsive UI, six read-only MCP tools and explicit-save extension.
- [x] **Automated verification** — 49 tests in four files, TypeScript and production build passed. Tests use actual temporary SQLite/API/stdin-stdout protocol and appropriate output fixtures.
- [x] **Runtime samples** — Local Ollama summary and native macOS image/scanned-PDF extraction exercised. Browser import, new version, historical original text and disabled historical processing verified.
- [x] **Handoff** — Complete prototype and quickstart published through xiaolonglin1124-bit to `prototype/local-course-copilot`. Fetched Git blobs matched all 36 staged implementation/document files before final handoff status. Local app is available at http://127.0.0.1:4310 while its development server runs.

The implementation is a prototype, not full acceptance of every U-01 story. Actual Codex CLI host connection, authenticated LMS/extension operation, automatic STT, broad extraction/model quality and performance remain unverified.

### OPERATIONS PHASE

- [ ] **Operations** — Out of scope.

## Execution Plan Summary

- **Plan**: `aidlc-docs/inception/plans/execution-plan.md` (explicitly approved).
- **Stage slots**: 14 total; 12 selected for lifecycle execution, one skipped, one placeholder. Construction stages repeat as applicable to later approved units.
- **Completed selected stages**: Workspace Detection, Requirements Analysis, User Stories, Workflow Planning, Application Design, Units Generation.
- **Remaining Inception**: None; all generated gate artifacts approved. Upstream integration/submission and whole-team candidate selection are separate pending work.
- **Skipped**: Reverse Engineering (Greenfield; no existing application).
- **Formal future stages**: Functional Design, NFR Requirements, NFR Design, Infrastructure Design, Code Generation, Build and Test; prototype implementation/verification proceeds separately under the new user instruction.
- **Placeholder**: Operations (production deployment excluded; local demo setup remains required).
- **Risk**: High; real LMS/extraction/model/MCP integrations unverified.

## Current Checkpoint and Handoff

Inception documentation is complete and approved. The earlier INFO5940-02 stop was honored at Inception closure. The user subsequently requested a runnable prototype now; that separate implementation is present on `prototype/local-course-copilot` with the [plan](construction/plans/local-prototype-plan.md) and [verification record](construction/build-and-test/prototype-verification.md). No additional approval gate is pending for this authorized prototype.

An upstream maintainer must integrate approved PRs #5→#6→#7→#8 into candidate/course-copilot in order. The current account has no upstream merge control. Preserve the single audit/state history and do not hand-merge those files. Whole-team candidate selection and final course submission are not claimed by this branch.

Formal lifecycle continuation and whole-team selection remain distinct from this prototype. The implementation does not fabricate formal stage approvals, full product acceptance or completed upstream integration. Core library operation and optional local AI require no hosted paid provider.
