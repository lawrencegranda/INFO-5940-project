# INFO 5940 Class Project — Group 17

Cornell University · INFO 5940: Special Topics in Information Science (AI Chatbots, RAG, AI Agents) · Fall 2026

- **Methodology**: **AI-DLC `v1.0.1`** (`awslabs/aidlc-workflows` tag `v1.0.1`)
- **Mid-semester Milestone**: Due Tuesday, November 24, 2026, 11:59 PM EST
- **Final Project**: Due Wednesday, December 16, 2026

## Team Members & Tooling

| Name | NetID | GitHub | Coding Agent(s) |
| --- | --- | --- | --- |
| Lawrence Granda Zarzuela | `lg626` | [`lawrencegranda`](https://github.com/lawrencegranda) | Claude Code, Codex, Cursor, Antigravity (`agy`) |
| Jiaxin (Iris) Li | `jl2726` | [`irisli0926`](https://github.com/irisli0926) | Claude Code, Codex |
| Xiaolong Lin | `xl2333` | [`XiaolongLin`](https://github.com/XiaolongLin) | Claude Code, Codex |
| Safiullah Safdariyan | `ss3322` | [`safi902`](https://github.com/safi902) | TBD |
| Chloe Wang | `sw2322` | [`chloeshixuanwang-bit`](https://github.com/chloeshixuanwang-bit) | Claude Code, Codex |

## 1. Problem & Rationale for Using LLMs

> **[TBD after team alignment meeting]** — Describe the problem our product addresses, target users, and why an LLM is an appropriate solution.

## 2. Planned LLM Integration

> **[TBD after team alignment meeting]** — Describe how LLM capabilities power the product, which features depend on them, planned agent/tool patterns, and the planned model/provider.

## 3. Project Scope & Feasibility

> **[TBD after team alignment meeting]** — Describe what the finished MVP will do by the December 16 final project deadline and why the scope is meaningful yet achievable.

## 4. Collaboration Plan

- **Meetings**: *[TBD — add meeting frequency and in-person / Zoom split after team kickoff]*
- **Async Communication**: Team group chat + GitHub Draft PR review comments.
- **Inception Workflow (One Draft PR per Gate)**:
  1. **Take the baton**: `git pull origin main`, create one stage branch (e.g., `inception/01-requirements`), and immediately open a **Draft PR** on GitHub. Only one Inception Draft PR may be open at a time.
  2. **Push questions/drafts**: Run the active AI-DLC stage and push the generated `*-questions.md` or artifact to the Draft PR.
  3. **Async team review**: Teammates review asynchronously and leave answers, critiques, and pushback directly as PR comments.
  4. **Synthesize & merge**: The driver's agent reads the PR comments, updates the AI-DLC stage and `aidlc-docs/audit.md`, and once the team approves, merges the PR to `main` to release the baton.
- **Construction Workflow (Final Project)**: After Inception completes Units Generation, teammates work in parallel on feature branches mapped to individual Units of Work.

## Repository Layout

- `CLAUDE.md`, `AGENTS.md`, `.cursor/rules/ai-dlc-workflow.mdc`, `.agent/rules/ai-dlc.md`, `GEMINI.md` — AI-DLC `v1.0.1` entry files
- `.aidlc-rule-details/` — Shared AI-DLC `v1.0.1` rule details + always-enforced course extension (`extensions/course/info5940-rubric.md`)
- `course-materials/` — Official assignment prompt and 150-point grading rubric (`mid-semester-milestone.md`)
- `aidlc-docs/` — AI-DLC generated artifacts and audit log (created once Inception starts)
