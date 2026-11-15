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

## 1. Problem & Rationale for Using LLMs

> **[TBD after team alignment meeting]** — Summarize the problem our product addresses, target users, and why an LLM is well-suited to solve it.

## 2. Planned LLM Integration

> **[TBD after team alignment meeting]** — Detail how LLM capabilities power the product, which features depend on them, planned agent/tool patterns, and the planned model/provider (e.g., local via Ollama or hosted API).

## 3. Project Scope & Feasibility

> **[TBD after team alignment meeting]** — Define what the finished MVP will do by the December 16 final project deadline and why the scope is meaningful yet achievable.

## 4. Collaboration Plan

- **Meetings**: *[TBD — add meeting cadence and in-person / Zoom split after team kickoff]*
- **Async Communication**: Team group chat + GitHub Draft PR review comments.
- **Inception Workflow (One Draft PR per Gate — Single-Writer Rule)**:
  1. **Take the baton**: `git pull origin main`, create one stage branch (e.g., `inception/01-requirements`), and immediately open a **Draft PR** on GitHub. Only one Inception Draft PR may be open at a time.
  2. **Push questions/drafts**: Run the active AI-DLC stage and push the generated `*-questions.md` or artifact to the Draft PR.
  3. **Async team review**: Teammates review asynchronously and leave answers, critiques, and pushback directly as PR comments.
  4. **Synthesize & merge**: The driver's agent reads the PR comments (`gh pr view --comments`), updates the AI-DLC stage and `aidlc-docs/audit.md`, and once the team approves, merges the PR to `main` to release the baton.
- **Construction Workflow (Final Project)**: After Inception completes Units Generation, teammates work in parallel on feature branches mapped to individual Units of Work.

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
