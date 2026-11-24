# Course Copilot — INFO 5940 Class Project, Group 17

Cornell University · **INFO 5940: Special Topics in Information Science (AI Chatbots, RAG, AI Agents)** · Fall 2026

- **Methodology**: **AI-DLC `v1.0.1`** ([`awslabs/aidlc-workflows@v1.0.1`](https://github.com/awslabs/aidlc-workflows/releases/tag/v1.0.1))
- **Mid-semester Milestone (Inception Phase)**: Due **Tuesday, November 24, 2026, 11:59 PM EST** (150 pts · 15% of grade)
- **Final Project (Construction + Demo)**: Due **Wednesday, December 16, 2026** (35% of grade)
- **Course Materials & Rubric**: [`course-materials/mid-semester-milestone.md`](course-materials/mid-semester-milestone.md)

## Team Members & Tooling

| Name | NetID | GitHub | Coding Agent(s) |
| --- | --- | --- | --- |
| Lawrence Granda Zarzuela | `lg626` | [`lawrencegranda`](https://github.com/lawrencegranda) | Claude Code, Codex, Cursor, Antigravity (`agy`) |
| Jiaxin (Iris) Li | `jl2726` | [`irisli0926`](https://github.com/irisli0926) | Claude Code, Codex |
| Xiaolong Lin | `xl2333` | [`xiaolonglin1124-bit`](https://github.com/xiaolonglin1124-bit) | Claude Code, Codex |
| Safiullah Safdariyan | `ss3322` | [`safi902`](https://github.com/safi902) | Claude Code, Codex |
| Chloe Wang | `sw2322` | [`chloeshixuanwang-bit`](https://github.com/chloeshixuanwang-bit) | Claude Code, Codex |

---

**Milestone status** — Inception is complete through Units Generation and the approved artifacts have merged into `main`. The November 24 milestone stops before Construction. [Inception approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) · [Integration PR](https://github.com/lawrencegranda/INFO-5940-project/pull/10)

## 1. Problem & Rationale for Using LLMs

Students juggling several courses have to piece together instructions from Canvas, Gradescope, EdStem, PDFs and email. An instructor can move a deadline by email while Canvas still shows the old date. During exam weeks, students can miss an update or lose track of where they left off. **Course Copilot** gives each course its own private, local workspace for saved materials, version history and answers linked to exact sources. A language model can connect differently worded instructions and extract dates and requirements from unstructured text. Saved versions and explicit source-authority rules determine which updates apply. Students can inspect the evidence when a conflict remains unresolved.

## 2. Planned LLM Integration

The app uses a local model for source-linked summaries, structured fact extraction and **Ask**. Ask retrieves a small set of passages from the selected course, checks answer citations against those passages and flags missing or conflicting evidence. When the local model is unavailable, Ask can return the retrieved evidence on its own. The model evaluation starts with **`gemma3:4b` through Ollama**. Early Construction will compare it with suitable Qwen and DeepSeek candidates and evaluate embeddings separately.

An external assistant can also query the library through a **read-only local Model Context Protocol (MCP) server**, with **Codex CLI** as the first demonstration host. The assistant can locate a course with `list_courses` and search it with `search_course`. When a deadline looks disputed, it can use `fetch_document` or `fetch_passages` to get exact evidence, then consult `get_document_history` and `get_conflicts` before answering with citations. Codex follows its own model and provider settings. [Technical environment and MCP tool list](docs/technical-environment.md)

## 3. Project Scope & Feasibility

By **December 16**, the MVP will let students use Chrome to save pages they can already access or import PDFs and local files. It will preserve originals and version history, extract available native HTML, text and PDF content, and organize saved material by course. Hybrid keyword and semantic search will support both the local Ask interface and the Codex CLI MCP demo. When course sources disagree, students can inspect the saved evidence and see whether an update is supported or the conflict remains unresolved.

The library, ingestion pipeline, Ollama model and MCP server run on the student's laptop. We can test browser capture, citation accuracy and the Codex connection early on a team laptop. The extension reports capture failures and offers manual import as a fallback. Later work includes scan and image OCR, advanced math and diagram recognition, audio and video processing, remote ChatGPT MCP, and Jev, TypeSafe AI's hosted classifier and reranker. [Product vision](docs/vision.md) · [Approved MVP and later work](aidlc-docs/inception/requirements/mvp-scope.md) · [Jev provider](https://github.com/TypeSafeAI/typesafe-playground)

## 4. Collaboration Plan

We schedule Zoom meetings as needed based on project needs and team availability. All five teammates discussed the student problem and how it shaped the Course Copilot MVP on **November 23, 2026, from 10:00 to 10:10 AM EST**. Between meetings we coordinate in the team group chat and review artifacts in GitHub draft PRs. For Inception, one teammate drives each AI-DLC stage and records feedback and approvals while the rest of the team reviews. In Construction, we will confirm leads for the nine modules in the single unit of work, build on feature branches, and integrate and test together for the December 16 demo. [Meeting minutes](aidlc-docs/inception/reviews/meeting-minutes-2026-11-23.md) · [Unit of work](aidlc-docs/inception/application-design/unit-of-work.md)

---

## Repository Quickstart & Layout

- **Verify your agent loaded AI-DLC `v1.0.1`**:
  - **Claude Code**: `CLAUDE.md` is at repo root (`/config` or ask *"What instructions are currently active in this project?"*)
  - **Codex**: `AGENTS.md` is at repo root (ask *"Using AI-DLC, what workflow do you see?"*)
  - **Cursor**: `.cursor/rules/ai-dlc-workflow.mdc` (check **Settings → Rules, Commands**)
  - **Antigravity**: `.agent/rules/ai-dlc.md` (and `GEMINI.md` for `agy` CLI)
- **Shared rule details & rubric enforcement**: `.aidlc-rule-details/` (includes always-enforced [`extensions/course/info5940-rubric.md`](.aidlc-rule-details/extensions/course/info5940-rubric.md))
- **Course assignment & rubric**: [`course-materials/mid-semester-milestone.md`](course-materials/mid-semester-milestone.md)
- **AI-DLC artifacts and record** — [Inception artifacts](aidlc-docs/inception/), [audit log](aidlc-docs/audit.md), and [workflow state](aidlc-docs/aidlc-state.md). The approved Inception design records 16 functional requirements, seven non-functional requirements, 26 stories, 13 components and five logical services. [Review package](aidlc-docs/inception/reviews/step2-review-package.md)
