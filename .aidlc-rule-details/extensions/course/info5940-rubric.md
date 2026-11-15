# INFO 5940 Mid-Semester Milestone Rules

## Overview
These course rules are MANDATORY cross-cutting constraints for Cornell INFO 5940 (Fall 2026) based on `course-materials/mid-semester-milestone.md`. They are hard constraints enforced at every applicable AI-DLC stage.

**Enforcement**: At each applicable stage, verify compliance before presenting the stage completion message. Mark rules not applicable to the current stage as **N/A** in the compliance summary.

### Blocking Finding Behavior
1. List any non-compliant item in the stage completion message with its rule ID (`INFO5940-XX`).
2. Do NOT present "Approve & Continue" until all blocking findings are resolved; present only "Request Changes" with what must be fixed.
3. Log any blocking finding in `aidlc-docs/audit.md`.

### Verification Criteria Format
Verification items below are plain bullet points (distinct from `- [ ]` / `- [x]` stage plan checkboxes).

---

## Rule INFO5940-01: AI-DLC v1.0.1 Workflow Integrity
- All `aidlc-docs/` artifacts are generated strictly through the AI-DLC v1.0.1 workflow (never bypassed or hand-edited outside the workflow).
- Every stage, team answer, and gate approval is logged in `aidlc-docs/audit.md` and tracked in `aidlc-docs/aidlc-state.md`.

## Rule INFO5940-02: Milestone Stop Gate (Inception Only)
- Inception completes through **Units Generation** (`unit-of-work.md`, `unit-of-work-dependency.md`, `unit-of-work-story-map.md`).
- Workflow MUST **STOP before Construction** for the Mid-semester Milestone (do not generate application code or enter Construction).

## Rule INFO5940-03: Complete Team Answers
- Every `[Answer]:` tag in generated question files has a deliberate, non-empty team answer before proceeding past the gate.

## Rule INFO5940-04: Local-First LLM Product Scope
- Product design targets local execution for demo (cloud hosting not required).
- LLM integration is concrete (planned model/provider named, agentic/tool patterns preferred over single-call text generation).

## Rule INFO5940-05: No Secrets or Application Code in `aidlc-docs/`
- Application code (in Construction) goes at repository root, never inside `aidlc-docs/`.
- No API keys, tokens, or credentials appear in any file.

## Rule INFO5940-06: Single-Writer Inception Gate (One Draft PR per Gate)
- **Pre-flight check (mandatory before any Inception action)**: Run `git fetch && git status` and `gh pr list --state open`.
- If `main` is behind `origin/main`, pull before starting.
- If an open Inception PR already exists from another teammate, **STOP** — do not start a parallel `aidlc-docs/` branch or edit `aidlc-docs/`. Direct the user to review/comment on the active PR or wait until it merges to `main`.
- **When driving a gate**: Work on one branch (`inception/<nn>-<stage>`) with an open **Draft PR**. Before finalizing answers or requesting gate approval, check PR comments (`gh pr view --comments`) so all teammate feedback is incorporated and logged in `aidlc-docs/audit.md`.
- **Never hand-merge `aidlc-docs/audit.md` or `aidlc-docs/aidlc-state.md`**: All updates must come through the active single-writer workflow.
