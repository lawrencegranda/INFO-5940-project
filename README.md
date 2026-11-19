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

**Marketing Campaign Asset Copilot** is a Chrome Side Panel for small marketing teams that reuse existing imagery across campaigns. A marketer preparing a deck or campaign often has to open files one at a time, guess which images fit the brief, and redo crops for each format. Searching by file name misses visual qualities such as clean backgrounds, subject placement, or a style that fits the campaign.

A multimodal LLM can describe and tag the contents and composition of each image, then compare those descriptions with a natural-language brief. The app can explain why an asset fits, flag a requested format when nothing qualifies, and suggest a crop that keeps the main subject visible. The marketer reviews the recommendation and the actual crop before using it.

## 2. Planned LLM Integration

We plan to use Google Gemma 3 4B through local Ollama to index images and rank a shortlist for each campaign. The extension orchestrates library lookup, model ranking, crop validation, and preview generation. Browser code checks image dimensions and renders the output. Accepting, rejecting, or requesting a change informs future rankings through local preferences. The model receives only the inputs needed for each step, and the user controls which prepared asset is exported or inserted.

## 3. Project Scope & Feasibility

For the December 16 demo, the MVP will use one local image folder, a campaign brief, and a small set of channel formats. A marketer can find existing images, preview and adjust smart crops, give feedback, download approved variants, and directly insert an approved asset into Google Slides. We will test the Slides handoff early. Google Drive as a library source, image generation, copywriting, and automatic publishing are outside this scope. The [vision](docs/vision.md) and [technical environment](docs/technical-environment.md) describe the demo and the proposed stack.

## 4. Collaboration Plan

- **Meetings (proposed, pending team confirmation)**: Meet once a week in person for scope and design decisions and once on Zoom during milestone weeks for gate review. Use the team chat to coordinate and the draft PR to capture decisions and feedback between meetings.
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
