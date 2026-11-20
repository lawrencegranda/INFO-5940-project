# INFO 5940 Class Project — Group 17

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
| Xiaolong Lin | `xl2333` | [`XiaolongLin`](https://github.com/XiaolongLin) | Claude Code, Codex |
| Safiullah Safdariyan | `ss3322` | [`safi902`](https://github.com/safi902) | TBD |
| Chloe Wang | `sw2322` | [`chloeshixuanwang-bit`](https://github.com/chloeshixuanwang-bit) | Claude Code, Codex |

---

## Candidate proposal: Course Copilot

**Status:** Candidate being evaluated alongside **Marketing Campaign Asset Copilot**. The `candidate/course-copilot` track stays separate from `main`. Requirements Analysis, User Stories and Workflow Planning are approved; Application Design artifacts are being reviewed in [Draft PR #7](https://github.com/lawrencegranda/INFO-5940-project/pull/7). Follow `aidlc-docs/aidlc-state.md` and the audit for the current gate. Integrate approved #5, then #6, then this stage. No application code has been generated; the November 24 checkpoint stops after approved Units Generation.

## 1. Problem & Rationale for Using LLMs

Course materials are scattered across Canvas, Gradescope, EdStem, web pages, and PDFs, often behind student logins. Copying all of them into ChatGPT or Claude creates context overload, while naive retrieval can miss that a later announcement changes earlier course instructions. **Course Copilot** is a private, local-first, multi-course library and AI-ready knowledge layer—similar in organization to an Obsidian vault, but built to provide attributable, version-aware course context through MCP. Its primary users are students managing several courses. The product does not introduce another chatbot.

## 2. Planned LLM Integration

A Chrome extension saves accessible course pages, files, and discovered embedded media with source URL, capture time, original snapshots, extracted text, and a processing status. The library uses an LLM to suggest the correct course, folder, topical index, summaries, and substantive changes; the user can correct classification. **Ollama with `gemma3:4b`** is the preliminary local generative model, subject to a laptop benchmark. **Jev** may classify, route, or rerank snippets only after explicit user opt-in for any hosted data transmission; core indexing and keyword retrieval still work without Jev. Source identity, immutable versions, citations and authority/supersession decisions are explicit system data and rules, not unverified LLM assertions.

## 3. Project Scope & Feasibility

The December 16 MVP targets user-triggered capture from Canvas, Gradescope, EdStem and ordinary sites; PDF/local file import; full extraction where content is accessible (native text, OCR and transcription as needed); multi-course organization; source-linked summaries and typed relationships; version history and flags for substantive conflicting course facts; hybrid search; and a **read-only local MCP server first demonstrated with Codex CLI**. MCP search returns ranked previews, with a second tool for retrieving passages or full extracted content. Real-world authenticated embeds and media are a feasibility risk: extraction failures must be disclosed and manual upload offered. Cloud hosting, automatic LMS synchronization, hosted MCP, shared accounts, and a built-in chat interface are excluded.

## 4. Collaboration Plan

- **Team members and coding agents:** See the team table above; the group can use multiple coding agents but must follow the same pinned AI-DLC v1.0.1 rules.
- **Meetings (proposal requiring group confirmation):** Two synchronous working sessions before the November 24 Inception deadline, plus at least one dedicated product-idea alignment discussion; decide in person versus Zoom and confirm the recurring schedule with the group.
- **Async:** Team group chat and GitHub Draft PR comments. The stage driver incorporates team feedback and verifies explicit approvals before merging any stage PR.
- **Candidate workflow:** Keep Course Copilot and Marketing Campaign Asset Copilot isolated. Complete and review one Inception gate at a time; use `candidate/course-copilot` as the integration branch for this candidate and merge only the selected final candidate to `main`. The final team submission must have one coherent AI-DLC audit/state and artifact set.
- **Construction:** After the November 24 checkpoint and project selection, divide approved Units of Work into feature branches, integrate and test by December 16.

---

## Repository Quickstart & Layout

- **Verify your agent loaded AI-DLC `v1.0.1`**:
  - **Claude Code**: `CLAUDE.md` is at repo root (`/config` or ask *"What instructions are currently active in this project?"*)
  - **Codex**: `AGENTS.md` is at repo root (ask *"Using AI-DLC, what workflow do you see?"*)
  - **Cursor**: `.cursor/rules/ai-dlc-workflow.mdc` (check **Settings → Rules, Commands**)
  - **Antigravity**: `.agent/rules/ai-dlc.md` (and `GEMINI.md` for `agy` CLI)
- **Shared rule details & rubric enforcement**: `.aidlc-rule-details/` (includes always-enforced [`extensions/course/info5940-rubric.md`](.aidlc-rule-details/extensions/course/info5940-rubric.md))
- **Course assignment & rubric**: [`course-materials/mid-semester-milestone.md`](course-materials/mid-semester-milestone.md)
- **AI-DLC generated artifacts**: `aidlc-docs/` (created once Inception starts; never hand-edit `audit.md` or `aidlc-state.md`)
