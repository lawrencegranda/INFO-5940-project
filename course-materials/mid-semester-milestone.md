# Class Project: Mid-semester Milestone (Official Canvas Assignment)

- **Course**: INFO 5940: Special Topics in Information Science (2026FA)
- **Canvas URL**: https://canvas.cornell.edu/courses/91792/assignments/1036177
- **Due**: Tuesday, November 24, 2026, 11:59 PM EST
- **Points**: 150 (15% of the course grade)
- **Submission**: One GitHub repository URL per team (publicly accessible in an incognito/private browser without signing in)

---

## Mid-semester Milestone: Complete the AI-DLC Inception Phase

**Due:** Tuesday, November 24, 2026, 11:59 PM · **Points:** 150 (15% of the course grade) · **One submission per team**

## About the project

This semester’s project is one team project, built in two stages. Your team will use an AI coding agent, guided by the **AI-Driven Development Lifecycle (AI-DLC v1.0.1)**, to design and build a product that itself uses LLMs. In other words, you use LLMs to build a product that leverages LLMs.

**Choose a problem you care about.** Start from a problem you find interesting or know well, from your studies, work, hobbies, or community, and that you’re curious to apply AI to. The product can be anything, as long as LLMs are part of how it works. We especially encourage products that use agentic patterns. A basic LLM feature makes one call and returns text, such as a summary or an answer. An agent goes further: the LLM decides what steps to take, calls tools (for example, searching a database, calling an API, or running code), and uses the results before it responds. A focused MVP (minimum viable product) is a good target for your project. An MVP is the smallest version of your product that still solves the core problem for your users: the few features that matter most, each one working the way a real user would need it to. You can leave “nice-to-have” features for later, and list them as out of scope in your vision document. During `Inception`, AI-DLC will help you split your MVP into manageable units of work.

AI-DLC is AWS’s methodology for AI-driven software development: the AI creates plans, asks clarifying questions, and builds, and your team reviews and approves each step. It has three phases: `Inception` (what to build and why), `Construction` (how to build it), and `Operations` (a placeholder in v1. This phase will not be required for this project).

- **Mid-semester Milestone** (due Tuesday, November 24, 15% of the course grade): set up AI-DLC in your team repository, write your `README` and your `vision` and `technical environment documents`, then complete the `Inception` phase.

- **Final Project** (due Wednesday, December 16, 35% of the course grade): complete the `Construction` phase for every unit of work, then submit a product demo video, a recorded presentation, your team repository, and the internal team-based peer evaluation.

## What this milestone requires from you

By the deadline, your team will have used AI-DLC v1.0.1 to complete the `Inception` phase, which determines **what** to build and **why**: requirements, user stories, application design, and units of work. You do not need to write any application code or set up the LLM inside your product yet; that happens in the final project.

You will submit one link to your team’s GitHub repository. It must contain:

- The `AI-DLC v1.0.1 rule files` for your coding agent

- A `README` with your names, NetIDs, project overview, and collaboration plan

- Your `vision document` and `technical environment document`

- The `Inception` artifacts AI-DLC generates in `aidlc-docs/inception/`

- The AI-DLC record: `aidlc-docs/audit.md` and `aidlc-docs/aidlc-state.md`

## Choosing your tools

### Your AI coding agent

Please use the AI coding agent of your choice, based on your availability (this choice will not be evaluated), such as Claude Code, Kiro, Cursor, GitHub Copilot, Amazon Q Developer, or OpenAI Codex, as long as it can load the AI-DLC v1.0.1 rules and you apply the framework correctly. Teammates can use different agents, as long as the rule files for each agent your team uses are installed and committed correctly.

Several agents offer free plans or limited free usage, and GitHub Copilot is free for verified students through GitHub Education. If you run out of free usage, Ollama can run some coding agents, including Claude Code and Codex, with free open models. See [https://docs.ollama.com/integrations/claude-code](https://docs.ollama.com/integrations/claude-code) and [https://docs.ollama.com/integrations/codex](https://docs.ollama.com/integrations/codex). Local models need tool support and a long context window, and results depend on the model you choose.

### The LLM inside your product

Please use the LLMs of your choice, based on your availability (the specific model or provider you choose will not be evaluated), as long as they work for your proposed product. The LLMs inside your product can come from any provider. For example, you can run free open models locally with Ollama, and your product can call them through Ollama’s API, including an OpenAI-compatible endpoint.

- **Download Ollama:** [https://ollama.com/download](https://ollama.com/download)

- **Browse models:** [https://ollama.com/library](https://ollama.com/library)

- **Get started:** [https://docs.ollama.com/quickstart](https://docs.ollama.com/quickstart)

- **OpenAI-compatible API:** [https://docs.ollama.com/openai](https://docs.ollama.com/openai)

You do not need to set this up for the milestone, but name your planned model and provider in your `README` and `technical environment document`. Choosing and setting up a model is part of the project, so read the documentation and try it early.

### AI-DLC v1.0.1 resources

Use **AI-DLC v1.0.1 only**. The main branch of the AI-DLC repository is now version 2, so use these v1.0.1 links:

- Release page and rules download (`ai-dlc-rules-v1.0.1.zip`): [https://github.com/awslabs/aidlc-workflows/releases/tag/v1.0.1](https://github.com/awslabs/aidlc-workflows/releases/tag/v1.0.1)

- Setup instructions for each coding agent: [https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/README.md](https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/README.md)

- Working with AI-DLC: [https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/WORKING-WITH-AIDLC.md](https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/WORKING-WITH-AIDLC.md)

- Writing your input documents (start here): [https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/writing-inputs/inputs-quickstart.md](https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/writing-inputs/inputs-quickstart.md)

- Example vision document: [https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/writing-inputs/example-minimal-vision-scientific-calculator-api.md](https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/writing-inputs/example-minimal-vision-scientific-calculator-api.md)

- Example technical environment document: [https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/writing-inputs/example-minimal-tech-env-scientific-calculator-api.md](https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/writing-inputs/example-minimal-tech-env-scientific-calculator-api.md)

- Every artifact AI-DLC can generate: [https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/GENERATED_DOCS_REFERENCE.md](https://github.com/awslabs/aidlc-workflows/blob/v1.0.1/docs/GENERATED_DOCS_REFERENCE.md)

- The methodology (AWS DevOps Blog): [https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)

## How to work as a team

The `Inception` phase revolves mostly around group discussion and documentation rather than code. AI-DLC is designed for the whole team to make decisions together, so plan to work in shared sessions.

- Choose one team member to create the repository, run the coding agent, and commit the changes for the `Inception` phase. Everyone else joins each working session and takes part in the decisions. Discussing ideas, answering the AI’s questions, and reviewing documents are all contributions that each member should make; please note, no programming is needed at this stage.

- If your team is comfortable with GitHub and source control, other members can commit too, for example through branches and pull requests.

- Run one AI-DLC workflow together. Please do not have each member run AI-DLC separately. The record in `audit.md` should show your team’s shared answers and approvals, which will be evaluated.

A few more points:

- **You may use AI to help write** your `README` and input documents. Be sure to review what it produces, as your team is responsible for the content.

- **If the AI asks something you don’t know,** that is an opportunity to use AI itself, and preferably other resources on the web and library to learn more. That is part of the project (and the process). Most `Inception` questions are about the product. The `Application Design` stage asks more technical questions, for example, how the code is organized and tested, so make sure your more technical members are involved in leading some of those decisions.

- **Start as early as you can.** The `Inception` phase asks many questions and stops for many approvals.

## What to complete

### Step 1. Set up your team repository and AI-DLC

1. One team member creates a GitHub repository for the project and adds every teammate as a collaborator. See the following page for more guidance on this: [https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository)

1. Download `ai-dlc-rules-v1.0.1.zip` from the release page and unzip it outside your project. Copy the rules to where your agent reads them, following the `README` at the v1.0.1 tag:
   - **Claude Code:** core rules go to `CLAUDE.md` (a copy of `core-workflow.md`); rule details go to `.aidlc-rule-details/`
   - **Kiro:** core rules go to `.kiro/steering/aws-aidlc-rules/`; rule details go to `.kiro/aws-aidlc-rule-details/`
   - **Amazon Q Developer:** core rules go to `.amazonq/rules/aws-aidlc-rules/`; rule details go to `.amazonq/aws-aidlc-rule-details/`
   - **Cursor:** core rules go to `.cursor/rules/ai-dlc-workflow.mdc` (see the `README` for the header); rule details go to `.aidlc-rule-details/`
   - **GitHub Copilot:** core rules go to `.github/copilot-instructions.md`; rule details go to `.aidlc-rule-details/`
   - **OpenAI Codex and other agents:** core rules go to `AGENTS.md`; rule details go to `.aidlc-rule-details/`

1. Commit the rule files. The AI-DLC `README` recommends version-controlling them.

1. Check that it works: start a session with “Using AI-DLC, …”. The agent should show the AI-DLC welcome message and create an `aidlc-docs/` folder. If it doesn’t, the rules are not loaded; check the file locations.

AI-DLC writes all of its artifacts to `aidlc-docs/` at the repository root. Application code goes at the repository root, never inside `aidlc-docs/`. Do not commit API keys or other secrets to your repository.

**Throughout the milestone, keep the AI-DLC record complete.** Once you start the workflow, AI-DLC automatically creates and updates two files. `aidlc-docs/audit.md` records every input, AI response, and approval with a timestamp, and `aidlc-docs/aidlc-state.md` tracks which stages are complete, skipped, or in progress. These files are how graders see that you followed AI-DLC.

- Commit both files with your work.

- Check them at each gate. If something wasn’t logged, ask the agent to add it rather than editing the file yourself.

- Follow *Working with AI-DLC*:
  - reset the context at each gate
  - start exploratory questions with “Do not update any documents.” The agent may then leave the question out of `audit.md`. If it does, ask it to add the entry once you’re done.
  - fix problems through the workflow rather than by editing files by hand

### Step 2. Write your `README`

Your `README.md` is your team’s own overview of the project: what you are building, why, and how you will work. It must include:

- **Every team member’s full name and NetID**

- **The coding agent or agents you use**, and the `AI-DLC version (v1.0.1)`

- **About 4–6 paragraphs (roughly 1–2 pages)** covering these four areas:
  1. **Problem and rationale for using LLMs:** the problem your product addresses, who it is for, and why an LLM is an appropriate way to solve it.
  1. **Planned LLM integration:** how LLM capabilities will be part of the product, which features depend on them, whether you plan to use agents or tools, and which model or provider you plan to use.
  1. **Project scope and feasibility:** what the finished product will do by the final project deadline. It should be a meaningful course project, not a single minor feature, while remaining achievable.
  1. **Collaboration plan:** how often your team will meet, how meetings will be conducted (in person or online), how you will communicate between meetings, and how you will share the work.

Areas 1–3 are graded under criterion A. Please dedicate at least one full team meeting to thoroughly discussing the problem you aim to address with your proposed LLM-integrated product. The names, NetIDs, and collaboration plan are graded under criterion E.

### Step 3. Write your two input documents

AI-DLC recommends preparing two documents before starting: a vision document and a technical environment document. Start with the inputs quickstart, then look at the worked examples (links above). The quickstart also describes a “minimum viable input” if you want to start quickly and fill in details later. Make sure to commit both documents to your repository.

**Vision document**

- What you are building and for whom

- MVP features in scope

- Features explicitly out of scope

- Open questions

**Technical environment document**

- Language and version, package manager, and framework

- Cloud provider and deployment model

- Test framework

- A prohibited-libraries table, with a reason and an alternative for each entry

- Security basics

- At least one example each of a typical endpoint, function, and test

**Your product only needs to run locally.** You do not need to deploy it to the cloud or host it online; it only has to run on your team’s laptops, so you can demo it. Make your technical choices with that in mind. In the “Cloud provider and deployment model” section, say that the product runs locally and how it runs (for example, a local web app that calls a model running in Ollama). Your product can still call a hosted LLM provider’s API if you choose one.

A document is complete when every section above has specific content for your product, not template text or placeholders. Both documents should be reviewed and agreed by the whole team before you start Step 4.

### Step 4. Complete the Inception phase

Meet as a team and start the workflow as the AI-DLC docs describe, for example:

*Using AI-DLC, I want to start a new project. Please read `[your vision document]` and `[your technical environment document]`, then begin the AI-DLC workflow.*

AI-DLC then walks you through the `Inception` stages its execution plan includes. At each stage it asks clarifying questions in a question file, which you answer, and it stops for your approval: **Request Changes** or **Approve & Continue**. Work through the stages together:

- **Answer every question** deliberately. Never leave an `[Answer]:` blank.

- **Review each document as a team before you approve it.** If a proposal doesn’t fit your product, push back: ask questions and request changes. This engagement is part of criterion C.

- **Give it real thought.** The quality of your requirements, stories, and personas reflects the effort you put in, and is graded under criterion D.

AI-DLC generates these artifacts in `aidlc-docs/inception/`:

- **Requirements Analysis:** `requirements/requirements.md` and `requirements/requirement-verification-questions.md`, with every `[Answer]:` filled in

- **User Stories:** `user-stories/stories.md` and `user-stories/personas.md`

- **Workflow Planning:** `plans/execution-plan.md`

- **Application Design:** the files in `application-design/`

- **Units Generation:** `application-design/unit-of-work.md`, `unit-of-work-dependency.md`, and `unit-of-work-story-map.md`

**Stop after Units Generation.** Its approval prompt offers to continue to the `Construction` phase. For the milestone, approve the units and tell the agent to stop before `Construction`. You will start `Construction` in the final project.

## How to submit

Commit and push all your work to your team’s GitHub repository by the deadline, and submit the GitHub repository URL on Canvas. Please make sure that the link opens in a private or incognito browser window without signing in.

## Rubric (150 points)

- **A. LLM-integrated product proposal and its scope:** 30 points

- **B. AI-DLC input documents:** 30 points

- **C. AI-DLC process and record:** 30 points

- **D. Inception artifacts:** 30 points

- **E. Clarity:** 30 points

- **Total:** 150 points

Each criterion is 20% of the milestone grade and is graded separately. Points within a level are at the grader’s discretion.

### A. LLM-integrated product proposal and its scope (30 points)

This criterion evaluates the rationale for using LLMs in your proposed product, your plan for integrating them, and the project’s scope, as described in areas 1–3 of your `README`.

- **Excellent (27–30):** The `README` provides a clear and compelling rationale for why LLMs are well-suited to the identified problem. It outlines a well-defined plan for integrating LLM capabilities into the product. The scope is ambitious enough to be a meaningful course project, rather than one minor feature, while remaining achievable by the final project deadline.

- **Good (23–26):** The `README` gives a reasonable rationale for using LLMs to address the identified problem. It describes how LLM capabilities will be integrated, although some details need further clarification. The proposed scope is generally appropriate and feasible for a course project.

- **Fair (19–22):** The rationale for using LLMs is limited or unclear, making it difficult to understand why LLMs are appropriate for the problem. The integration plan lacks detail. The scope may be too narrow to be a meaningful course project, or too broad to be achievable by the final project deadline.

- **Poor (0–18):** There is little or no justification for using LLMs, or the proposed use of LLMs is not meaningfully connected to the problem. The integration plan is missing, vague, or impractical. The scope is substantially too limited or unrealistic for the course timeline.

### B. AI-DLC input documents (30 points)

This criterion evaluates the quality of the `vision` and `technical environment documents` you provide to start AI-DLC.

- **Excellent (27–30):** Both documents are complete and cover all required sections. The content is specific, detailed, and actionable, with clear requirements, relevant technical information, and useful example code that AI-DLC can follow.

- **Good (23–26):** Both documents are complete and cover all required sections, but some sections are generic, vague, or not detailed enough to guide AI-DLC well.

- **Fair (19–22):** One or both documents are incomplete, with some required sections missing or insufficiently addressed. The content offers only partial guidance for AI-DLC.

- **Poor (0–18):** One or both documents are missing.

### C. AI-DLC process and record (30 points)

This criterion evaluates whether you set up and used AI-DLC as designed, using `aidlc-docs/audit.md` and `aidlc-docs/aidlc-state.md` as evidence of how your team worked with the agent. We look at three things:

- **Setup:** the `AI-DLC v1.0.1` rule files are installed and committed, so your agent follows the workflow.

- **Following AI-DLC:** your Inception artifacts were produced through the AI-DLC workflow. A **complete and consistent** record shows each stage, your answers, and your approvals, and matches the artifacts in your repository. A record is **incomplete or inconsistent** when artifacts exist that the record does not show being produced: for example, if the agent was told to skip the process and just write the documents, if artifacts were produced with another tool outside the workflow, or if files were edited by hand.

- **Engagement:** you responded to every request from the AI (its questions and approval prompts), and engaged beyond approving: asking questions, pushing back, and requesting changes when a proposal did not fit your product.

Levels:

- **Excellent (27–30):** Setup is complete. Every AI request was answered, the team engaged actively beyond approvals, and all Inception artifacts were produced through AI-DLC.

- **Good (23–26):** Setup is complete. Every AI request was answered and the artifacts were produced through AI-DLC, but there is little engagement beyond approving what the AI proposed.

- **Fair (19–22):** Setup has problems, some AI requests were not answered, or some artifacts were not produced through AI-DLC. A team with an incorrect setup can earn at most Fair.

- **Poor (0–18):** AI-DLC was not set up or not used, or the record is missing or nearly empty.

### D. Inception artifacts (30 points)

This criterion evaluates the files AI-DLC generates during Inception (listed in Step 4) for completeness and quality. Completeness means every expected artifact is present with real content. Quality means the content shows that your team thought it through: the requirements make sense for your product, the stories and personas are specific, and the design and units of work fit together.

- **Excellent (27–30):** Every Inception artifact is present and of high quality. `requirements.md` is complete and consistent with the vision; every question is answered deliberately; stories have clear acceptance criteria; personas are specific; and the execution plan, application design, and units of work (with the dependency and story-map files) fit together.

- **Good (23–26):** All artifacts are present and sound, with minor gaps in completeness or consistency.

- **Fair (19–22):** All artifacts are present, but they are thin or inconsistent: some questions are answered without thought, or stories lack acceptance criteria.

- **Poor (0–18):** Major artifacts are missing, or Inception was not completed.

### E. Clarity (30 points)

This criterion checks that your `README` and repository contain the required items. It is not about the overview paragraphs, which are graded under A, and the collaboration plan is graded on whether it is present, not on its content.

- **Full (30):** The `README` lists every team member’s full name and NetID and includes the collaboration plan, and the repository is organized and easy to follow.

- **Partial (10):** The `README` lists every team member’s full name and NetID and the repository is organized, but the collaboration plan is missing.

- **Missing (0):** Names or NetIDs are missing, or there is no usable `README`.

Late work follows the syllabus policy.
