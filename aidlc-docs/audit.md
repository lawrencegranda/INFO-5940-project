# AI-DLC Audit Trail — Course Copilot

**AI-DLC**: v1.0.1  
**Phase**: INCEPTION  
**Project**: Course Copilot  
**Integration Branch**: `candidate/course-copilot`

---

## Workspace Detection — Repository Inspection & Rule Loading
**Timestamp**: 2026-11-19T17:28:00Z  
**User Input**:
```text
read this https://github.com/lawrencegranda/INFO-5940-project

we are going to do AI-DLC. make sure to have eveyrthing loaded
```
**AI Response**: Accessed `lawrencegranda/INFO-5940-project` and loaded AI-DLC v1.0.1 core workflow rules (`AGENTS.md`, `.aidlc-rule-details/`), Inception stage instructions, process controls, and the mandatory Cornell INFO 5940 course rubric extension (`course-materials/mid-semester-milestone.md`). Inspected the repository structure and confirmed a greenfield workspace with no pre-existing application code.  
**Context**: Repository rules and course rubric extension loaded; greenfield workspace detected.  
**Evidence**: `AGENTS.md`, `.aidlc-rule-details/`, `course-materials/mid-semester-milestone.md`.

---

## Workspace Detection — AI-DLC Workflow Readiness Confirmation
**Timestamp**: 2026-11-19T17:30:05Z  
**User Input**:
```text
we want to brainstorm ideas, using AI-DLC. i want you to run AI-DLC on my idea. Can you? Are you ready? make sure to have all the AI-DLC loaded and ready
```
**AI Response**: Confirmed readiness to execute AWS AI-DLC v1.0.1 for Cornell INFO 5940 (Fall 2026). Verified milestone constraints (complete Inception through Units Generation by November 24, 2026, 11:59 PM EST; stop before Construction; final Construction and demo due December 16, 2026). Marked Workspace Detection complete, skipped Reverse Engineering (Greenfield), and initialized Requirements Analysis.  
**Context**: Workspace Detection completed; ready for initial product vision input.  
**Evidence**: `aidlc-docs/aidlc-state.md`, `AGENTS.md`.

---

## Requirements Analysis — Initial Concept & Product Vision Input
**Timestamp**: 2026-11-19T17:35:14Z  
**User Input**:
```text
COURSE COPILOT - Lawrence Granda Zarzuela
Students already use ChatGPT, Claude, and other AI tools for coursework, but course materials are scattered across logged-in sites and hard to share with those tools. Course Copilot is a course library: a browser extension saves pages from Canvas, Gradescope, or EdStem into the right course and folder, keeps their sources and versions, and makes them searchable through MCP—so students can ask their preferred AI assistant questions grounded in course materials.
Capture and organize — Jev: Suggests the course and folder for each saved page. The student can confirm or correct it.
Build course context — LLM: Summarizes saved materials and maintains a source-linked course index. It keeps original documents available and flags possible conflicts, such as a newer announcement changing a syllabus deadline, instead of silently replacing older information.
Find and answer — ChatGPT, Claude, or another MCP-enabled assistant: Searches the course library and retrieves relevant passages and sources to answer the student’s question. The assistant handles the conversation; Course Copilot provides the organized, current course context.
```
**AI Response**: Conducted initial AI-DLC Inception feasibility assessment. Identified core value proposition as a student-controlled, version-aware course knowledge library exposed via MCP rather than a standalone chatbot. Evaluated feasibility of browser extension capture across Canvas, Gradescope, and EdStem, LLM-assisted categorization with user correction, immutable version preservation, conflict detection, and local MCP retrieval.  
**Context**: Initial product vision and architectural boundary assessment.  
**Evidence**: `docs/vision.md`, `docs/technical-environment.md`.

---

## Requirements Analysis — Technical Motivation & Retrieval Architecture Input
**Timestamp**: 2026-11-19T17:40:10Z  
**User Input**:
```text
motivation is that raw/naive chatgpt or claude with all the files/context, #1 context overload, #2 naive rag does not work well with versions, so contradicitons or changes can go unnoticed. need for more robust categorization or indexing. similar to second brain or LLM Wiki or Obsidian vault. better retrieval and more organized. maybe using Jev for retrieval too?


using all of this, think, then make sure to run AI-DLC on it
```
**AI Response**: Analyzed technical motivation around three failure modes of naive RAG: (1) context overload from whole-course uploads, (2) version blindness when newer announcements supersede older syllabus deadlines, and (3) weak flat organization lacking typed relationships across courses, topics, documents, versions, and source passages. Framed Course Copilot as a structured, Obsidian/wiki-like knowledge layer with Jev assisting classification, routing, and reranking alongside explicit deterministic authority and versioning logic.  
**Context**: Technical rationale and retrieval architecture refined in `docs/vision.md` and `docs/technical-environment.md`.  
**Evidence**: `docs/vision.md`, `docs/technical-environment.md`.

---

## Requirements Analysis — Verification Question Set Generation
**Timestamp**: 2026-11-19T17:49:35Z  
**User Input**:
```text
make sure to pose all questions/unresolved things, clearly. explaining the options clearly
```
**AI Response**: Prepared the formal AI-DLC Requirements Analysis verification question gate (`aidlc-docs/inception/requirements/requirement-verification-questions.md`) with 43 structured multiple-choice questions across eight decision areas (product scope, capture, knowledge representation, versions/conflicts, retrieval/Jev, MCP/UX, implementation/privacy/testing, and optional AI-DLC extensions), explaining the decision impact, options, tradeoffs, and suggested starting points with all `[Answer]:` fields left blank for user selection.  
**Context**: 43-question verification gate established; awaiting user responses.  
**Evidence**: `aidlc-docs/inception/requirements/requirement-verification-questions.md`.

---

## Requirements Analysis — User Answers (43 Verification Questions) & Initial Reconciliation
**Timestamp**: 2026-11-19T18:18:40Z  
**User Input**:
```text
my answers. make sure to lock as decisions. make sure to review against the questions. reconcile. make sure good.

1 A
2 A+B = C
3 B
4 A
5 C + able to add things from internet easily (like articles or research papers, or other PDFs)
6 C / all
7 chrome
8 A - but need to indentify if a file is embeded or similar
9 B 
10 C
11 A
12 B
13 B
14 C - for now, we can revisit
15 C - ideally a knowledge graph similar
16 A
17  ideally a knowledge graph similar
18 A + C maybe
19 A maybe, but only access latest?
20 B
21 A + B +C (little on C). not EVERY contradiction, but substantivbe ones
22 B
23 B
24 B
25 B / knowledge search / RAG? similar
26 A/B maybe?
27 - already answered. manual maybe?
28 A + B? like give a list first of potential with summaries, and then another MCP to fetch the actual content of the doc. maybe in text? or file? not sure
29 - already answered?  but maybe raise conflict and maybe B?
30 A + B
31 for now, local MCP? maybe hosted later?
32 local MCP is probably fine and neough
33 read-only
34 A no chat
35 B - cheap and easy
36 whichever is easiest and best
37 cheapest and best
38 A / no API tokens
39 A
40 B, we can do our own courses (like team members)
41 B
42 B
43 IDK, you think and pick
```
**AI Response**: Recorded all 43 verbatim responses in `requirement-verification-questions.md` and updated extension opt-ins in `aidlc-state.md`. Locked 35 clear decisions (including single-student private library, Chrome MV3 extension, local file upload fallback, immutable version preservation, explicit conflict surfacing, two-stage progressive MCP retrieval, read-only local MCP, no built-in chatbot, TypeScript + Node.js + SQLite + local Ollama `gemma3:4b`, Security Baseline disabled [Q41=B], Resiliency Baseline disabled [Q42=B], and partial Property-Based Testing enabled [Q43=B]). Generated 8 targeted follow-up clarification questions in `requirements-clarification-questions.md` to resolve ambiguities in Q14 (metadata correction), Q17 (knowledge-graph scope), Q18 (semantic similarity vs. deterministic identity), Q24 (freshness representation), Q27 (Jev fallback), Q31 (first tested MCP host), Q37 (hosted Jev privacy boundary), and Q5/Q6 (content/media extraction depth).  
**Context**: Initial 43 answers recorded; 8 targeted follow-up clarifications issued.  
**Evidence**: `aidlc-docs/inception/requirements/requirement-verification-questions.md`, `aidlc-docs/inception/requirements/requirements-clarification-questions.md`, `aidlc-docs/aidlc-state.md`.

---

## Requirements Analysis — Follow-Up Clarifications & Final Decision Lock
**Timestamp**: 2026-11-19T18:36:12Z  
**User Input**:
```text
all yout decisions are good.

fix:
Q24 - most documents will not need updates/versions, maybe. many wont change. so no need to question everything. but last date is important. also the link/url of where it was gotten from
Q31 - sure, codex as first
Q5/Q6 - fully extract the file / media / page. then maybe, if needed, not sure, transcribe to text?


is anything else left?
```
**AI Response**: Integrated all 8 clarification resolutions and the three specific refinements into `requirements-clarification-questions.md` and locked all 43 decisions in `decision-register.md`:
- **Q14 (Clarification 1 = A):** Allow user correction of course, folder, title, tags, and source/authority metadata after saving while keeping original snapshots immutable.
- **Q17 (Clarification 2 = A):** Implement graph-ready typed relationships (`related`, `duplicate-suggestion`, `updates`, `supersedes`) in SQLite relational tables without requiring a dedicated graph database.
- **Q18 (Clarification 3 = A):** Use normalized source URL/ID + content hash for deterministic version identity; semantic similarity suggests links/duplicates for review and never silently merges originals.
- **Q24 (Clarification 4 = A, refined):** Always preserve and display original source URL and capture timestamp in source details; avoid blanket stale-warning badges on ordinary static documents and warn only on observed substantive conflicts, changes, or supersessions.
- **Q27 (Clarification 5 = A):** Deterministic fallback to local full-text/metadata retrieval and manual filing when Jev is unavailable.
- **Q31 (Clarification 6 = B, refined):** Codex CLI is the first required end-to-end client connected to the local read-only MCP server.
- **Q37 (Clarification 7 = A):** Local storage and local Ollama by default; hosted Jev receives only minimal user-approved metadata/excerpts with explicit opt-in disclosure.
- **Q5/Q6 (Clarification 8 = B, refined):** Capture full accessible pages, files, and discovered embedded media; extract native text first and apply OCR or audio/video transcription when needed for searchability, preserving originals and recording explicit `complete`/`partial`/`failed`/`unsupported` status.

Generated the complete requirements specification (`aidlc-docs/inception/requirements/requirements.md`) containing 15 Functional Requirements (`FR-01` through `FR-15`), 7 Non-Functional Requirements (`NFR-01` through `NFR-07`), data model and retrieval behavior, 5 critical user journeys, scope boundaries, and milestone acceptance criteria. Updated `docs/vision.md`, `docs/technical-environment.md`, and `README.md`.  
**Context**: All 43 verification questions and 8 clarifications resolved and locked; `requirements.md` generated.  
**Evidence**: `aidlc-docs/inception/requirements/requirements-clarification-questions.md`, `aidlc-docs/inception/requirements/decision-register.md`, `aidlc-docs/inception/requirements/requirements.md`, `docs/vision.md`, `docs/technical-environment.md`, `README.md`.

---

## Requirements Analysis — Stage Review & Approval Gate
**Timestamp**: 2026-11-19T19:26:39Z  
**User Input**:
```text
Reviewed docs/vision.md, docs/technical-environment.md, aidlc-docs/inception/requirements/decision-register.md, and aidlc-docs/inception/requirements/requirements.md. All 43 decisions and 8 clarifications are reconciled accurately and match the Course Copilot MVP scope. Approve Requirements Analysis and proceed to User Stories.
```
**AI Response**: Recorded explicit approval of Requirements Analysis at `2026-11-19T19:26:39Z`. Marked Requirements Analysis complete (`[x]`) in `aidlc-docs/aidlc-state.md`, updated `Current Stage` to `User Stories`, and synchronized stage status across `decision-register.md` and `requirements.md`.  
**Context**: Requirements Analysis approval gate passed. Transitioned to Inception Stage 4: User Stories.  
**Evidence**: `aidlc-docs/aidlc-state.md`, `aidlc-docs/inception/requirements/requirements.md`, `aidlc-docs/inception/requirements/decision-register.md`.


---

## User Stories — Resume Handoff and User Request
**Timestamp**: 2026-11-20T02:24:42Z
**User Input**:
```text
我们现在建立一个这个prototype吧，按照同学的要求开始建立
```
**AI Response**: Resumed the existing Course Copilot workflow at the approved requirements baseline `485c52531f004b1e184fb595abe771cfbcd17003`. Cloned and fetched `candidate/course-copilot`, confirmed a clean checkout and no open PRs at preflight, and created local stage branch `inception/02-user-stories`. Loaded common AI-DLC rules, the User Stories stage, the mandatory course rubric and inherited extension selections. Read the approved requirements, decision register and prior audit; all 43 original verification answers and eight clarifications remain resolved. Interpreted the prototype request as the downstream product goal while preserving the explicit story-plan and subsequent review gates; no approval of an unseen plan is fabricated.
**Context**: Existing shared workflow resumed; no new product-direction questionnaire or application code. Optional security/resiliency extensions remain disabled. Partial property testing remains enabled for later applicable stages.

## User Stories — Prior Account Instruction Recorded at Resume
**Timestamp**: 2026-11-20T02:24:42Z
**User Input**:
```text
[https://github.com/xiaolonglin1124-bit/INFO-5940-Codespace](https://github.com/xiaolonglin1124-bit/INFO-5940-Codespace)
用我这个账号而不是在codex里面这个账号
```
**AI Response**: Preserved the user's earlier identity instruction as resume context. Verified the browser's signed-in GitHub identity as `xiaolonglin1124-bit`. The linked Codespace is a separate coursework repository; Course Copilot work stays based on `lawrencegranda/INFO-5940-project` and targets its `candidate/course-copilot` integration branch. GitHub writes for this stage use the requested browser account rather than the differently connected GitHub identity.
**Context**: This timestamp records the instruction being captured at resume, not its original arrival time. No credential or token is recorded.

## User Stories — Assessment and Concrete Planning Proposal
**Timestamp**: 2026-11-20T02:24:42Z
**User Input**: No new user input; preparation under the request above.
**AI Response**: Created `aidlc-docs/inception/plans/user-stories-assessment.md` and `story-generation-plan.md`. Proposed one primary multi-course student persona, journey-based story groups, INVEST review, Given/When/Then acceptance criteria and traceability across all 15 FRs and seven NFRs. Retained all three LMS sources, native/OCR/transcription breadth, immutable source identity, explicit supersession/conflict rules, read-only Codex MCP, hosted Jev opt-in and local fallback. Separated future controlled fixtures from actual runtime/integration evidence. No inherited decision requires re-answering; only the explicit approval of this concrete planning approach is new.
**Context**: Part 1 planning prepared. Generation checkboxes, `stories.md`, `personas.md`, later stage completion and Construction remain pending. No prior audit content was overwritten.

## User Stories — Planning Review Prompt
**Timestamp**: 2026-11-20T02:24:42Z
**User Input**: Awaiting response.
**AI Response**: 已准备好 User Stories 计划，请审阅 `aidlc-docs/inception/plans/story-generation-plan.md` 第 8 节。回复 A 表示批准这份具体计划并生成用户故事和 persona；回复 B 并说明要修改的地方。仓库的 `.aidlc-rule-details/inception/user-stories.md` 第 13 步明确要求："Do not proceed until the user explicitly approves the story approach." 因此当前只准备计划，尚不把用户故事标为完成或进入应用开发。
**Context**: Planning approval requested for a concrete artifact. The `[Answer]:` field is intentionally blank, and no dependent generation has executed.

