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

