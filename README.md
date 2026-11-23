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
| Xiaolong Lin | `xl2333` | [`xiaolonglin1124-bit`](https://github.com/xiaolonglin1124-bit) | Claude Code, Codex |
| Safiullah Safdariyan | `ss3322` | [`safi902`](https://github.com/safi902) | Not yet reported; confirm for the final README |
| Chloe Wang | `sw2322` | [`chloeshixuanwang-bit`](https://github.com/chloeshixuanwang-bit) | Claude Code, Codex |

---

## Course Copilot

**Status: Corrective Inception draft for team review.** The team settled on **Ask and local MCP**, as reported by Xiaolong on November 23. This Step 2 pass updates the existing PR #8 branch; revised artifact approval is pending. Historical approvals remain historical. Do not mark stages Ready or merge before the team reviews the revised package. Construction and the separately developed prototype stay outside this milestone branch.

## 1. Problem & Rationale for Using LLMs

Course materials are scattered across Canvas, Gradescope, EdStem, web pages and PDFs, often behind student logins. Uploading everything into a chat creates context overload, while flat retrieval can miss an instructor's later deadline update. **Course Copilot** is a private local multi-course library with course-grounded **Ask** and **read-only local MCP**. Students save authorized materials, ask questions and inspect the exact saved evidence supporting an answer. Student notes and unknown publishers cannot supersede instructor instructions merely because they were saved later.

## 2. Planned LLM Integration

A Chrome extension saves accessible course pages, files and selected embedded resources with originals, source identity, dates, extracted text and processing status. A local model supports organization, summaries, structured fact extraction and grounded Ask. **Ollama with `gemma3:4b`** is the initial candidate; compare suitable Qwen/DeepSeek candidates and choose embeddings during authorized early Construction, without claiming benchmark results now. Ask uses bounded local retrieval, validates citations and reports insufficient/conflicting evidence or model failure honestly. **[Jev from TypeSafe AI](https://github.com/TypeSafeAI/typesafe-playground)** is a typed-decision model/API and remains an optional hosted baseline for specifically permitted minimal classification/retrieval inputs pending a separate deferral decision; Ask does not require it. Source identity, immutable versions and precedence depend on explicit evidence/rules.

## 3. Project Scope & Feasibility

The December 16 MVP targets explicit capture from the three LMS sites and ordinary sites; PDF/local import; native extraction plus required accessible OCR/media paths; multi-course organization; source-linked summaries/relations; version history, supported updates and unresolved conflicts; hybrid search; **local course Ask**; and **read-only local MCP demonstrated with Codex CLI**. The normal UI/Ask journey requires no terminal. Ask retains per-course progress while navigating within the running app and provides retrieval-only evidence when the local model is unavailable. Local storage, ingestion, Ollama and MCP run on the student's laptop, with no deployed server required. Authenticated embeds/media remain a schedule risk: failures are visible, manual import is offered, and scope reductions require an actual decision. Cloud hosting, automatic LMS synchronization, hosted MCP, remote ChatGPT integration, shared accounts and autonomous actions are excluded.

The current corrective draft contains **16 functional requirements, seven non-functional requirements, 26 stories, 13 components, five logical services and one integrated unit with nine modules**. The six MCP tools are unchanged. See the [requirements](aidlc-docs/inception/requirements/requirements.md), [vision](docs/vision.md), [technical environment](docs/technical-environment.md) and [review package](aidlc-docs/inception/reviews/step2-review-package.md). These are plans, not passing implementation claims.

## 4. Collaboration Plan

- **Team members and coding agents:** See the team table above; the group can use multiple coding agents but must follow the same pinned AI-DLC v1.0.1 rules.
- **Project discussion meeting:** November 23, 2026, 10:00 AM EST (America/New_York), on Zoom, with all five members: Lawrence Granda Zarzuela, Jiaxin (Iris) Li, Xiaolong Lin, Safiullah Safdariyan and Chloe Wang. Iris will provide the discussion minutes and decisions. The recurring working cadence remains to be confirmed. The meeting record does not approve the later revised artifacts automatically.
- **Async:** Team group chat and GitHub Draft PR comments. The stage driver incorporates team feedback and verifies explicit approvals before merging any stage PR.
- **Current workflow:** Xiaolong revises the existing `inception/05-units-generation` / PR #8 branch. The team reviews the concrete artifacts before Ready transitions. Lawrence then integrates PRs #5–#8 in order and the established integration branch into `main`; Iris prepares the final README against that updated result. Follow [Issue #9](https://github.com/lawrencegranda/INFO-5940-project/issues/9); no new branch/PR is needed for this pass.
- **Construction:** Stop before Construction for the November 24 checkpoint. Later, confirm proposed module leads, complete the selected design stages and integrate/test by December 16. The prototype remains separate.

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
