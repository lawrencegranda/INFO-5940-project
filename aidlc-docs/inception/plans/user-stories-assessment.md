# Course Copilot — User Stories Assessment

**Stage:** Inception / User Stories / Part 1: Planning
**Status:** Assessment complete. Explicit planning approval and generation progress are tracked in the accompanying story-generation plan.
**Integration branch:** `candidate/course-copilot`
**Stage branch:** `inception/02-user-stories`
**Requirements baseline:** `485c52531f004b1e184fb595abe771cfbcd17003`

## Request and handoff

Xiaolong asked to start the Course Copilot prototype following the teammate's handoff. The existing workflow has completed and approved Requirements Analysis and identifies User Stories as the next stage. This assessment resumes that shared workflow; it does not restart requirements or declare an implemented prototype.

The November 24 milestone remains Inception-only. Application code and the full prototype require the subsequent approved design and Construction workflow. The user's implementation goal is retained as the downstream outcome, not recorded as approval of an unseen story plan.

## Sources reviewed

- `aidlc-docs/aidlc-state.md` and `aidlc-docs/audit.md`.
- `docs/vision.md` and `docs/technical-environment.md`.
- `aidlc-docs/inception/requirements/requirements.md`.
- `aidlc-docs/inception/requirements/decision-register.md`.
- All 43 answered verification questions and eight answered follow-up clarifications.
- `AGENTS.md`, the common AI-DLC rules, User Stories stage rules and enabled extensions.

## Request analysis

- **User impact:** Direct. A student saves, corrects, searches and verifies course materials.
- **Primary user:** One student managing several courses; external AI assistants are integration clients, not additional human personas.
- **Complexity:** Multiple connected journeys, authenticated source capture, diverse content extraction, immutable history, substantive conflicts and read-only progressive retrieval.
- **Stakeholders:** The five-person project team and the student using the local library.

## Assessment criteria

- [x] New user-facing functionality needs observable behavior and acceptance conditions.
- [x] Capture, correction, history and retrieval affect several user workflows.
- [x] Source identity, authority and supersession create important business rules.
- [x] The team needs shared, traceable expectations before splitting implementation work.
- [x] Explicit fallback and partial-extraction behavior require user-centered failure scenarios.
- [x] Benefits exceed the cost of producing stories and a persona.

## Decision

**Execute User Stories: Yes.** Convert all 15 functional and seven non-functional requirements into a traceable set of small, testable user outcomes. Keep approved product decisions fixed; no unanswered product-direction question was found in the inherited requirements.

## Expected outcomes

1. A primary student persona grounded in the approved scope, with capture/organization and evidence-retrieval contexts. Persona assumptions will be labeled rather than presented as interview findings.
2. Journey-based stories with clear boundaries, Given/When/Then acceptance criteria and explicit requirement references.
3. A coverage map for every FR and NFR, including failures, privacy and offline use.
4. A transparent distinction between future fixtures, actual integration evidence and unverified capabilities.
5. An approved foundation for Workflow Planning, Application Design and Units Generation.

## Preflight and controls

- Remote integration branch was fetched and the local checkout was clean before work.
- GitHub's open-PR listing returned no open PRs at the preflight check.
- The stage branch starts from the approved requirements baseline.
- GitHub writes and the Draft PR must use the user-requested account, `xiaolonglin1124-bit`.
- No prior requirements, decisions or approvals are rewritten by this assessment.
- Story generation and application development have not begun.
