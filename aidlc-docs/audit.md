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

