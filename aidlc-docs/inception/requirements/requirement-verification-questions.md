# Course Copilot — AI-DLC Requirements Verification Questions

> **Status:** USER ANSWERS RECORDED; 8 TARGETED CLARIFICATIONS IN PROGRESS (`requirements-clarification-questions.md`). Original user responses are preserved verbatim alongside initial reconciled selections.
> **Methodology:** AI-DLC v1.0.1; INFO 5940 course extension applies.

## How to respond

Each question has a canonical `[Answer]:` letter (or X plus custom explanation). The original free-form answer is preserved separately under **Original user response (verbatim)**, and the final reconciled selection is recorded in `decision-register.md`.

## A. Product, users, and success

### Question 01 — Who is the MVP for?

**Decision impact:** This determines permissions, onboarding, and whether accounts/synchronization are necessary.

**A)** One student maintaining their own private library.

**B)** A small group sharing a course library, with access controls.

**C)** Students and instructors publishing shared course libraries.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — individual-first avoids identity and sharing infrastructure

[Answer]: A

**Original user response (verbatim):** A
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 02 — What is the primary demonstration task?

**Decision impact:** Choose the success case to optimize and evaluate rather than claiming every retrieval task works equally well.

**A)** Find the current assignment or exam deadline, explaining changes.

**B)** Answer conceptual course questions with passages and citations.

**C)** Demonstrate both deadline/version resolution and grounded conceptual Q&A.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* C — demonstrates the distinctive version-aware retrieval value

[Answer]: C

**Original user response (verbatim):** A+B = C
---

**Reconciled selection:** C

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 03 — How many courses should one user manage?

**Decision impact:** Affects database model and navigation, but not necessarily multi-user support.

**A)** One course only, to minimize UI.

**B)** Several independently organized courses.

**C)** One institutional course catalog shared by users.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — multiple courses without multi-user complexity

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 04 — Which criterion makes the product succeed?

**Decision impact:** Distinguish a working integration from genuinely better retrieval.

**A)** Working end-to-end demo only.

**B)** A small benchmark showing better citations and version handling than flat retrieval.

**C)** A formal user study with measured learning outcomes.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — feasible, defensible comparison with baseline RAG

[Answer]: A

**Original user response (verbatim):** A
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

## B. Capture and input

### Question 05 — Which sources must work in the final MVP?

**Decision impact:** Canvas, Gradescope and EdStem have different page structures and changing front ends.

**A)** Canvas first; Gradescope/EdStem are best-effort.

**B)** Canvas and EdStem required; Gradescope best-effort.

**C)** All three required with tested capture paths.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — provide one reliable source and generic capture fallback

[Answer]: X — All Canvas/Gradescope/EdStem plus general websites, papers, and local files

**Original user response (verbatim):** C + able to add things from internet easily (like articles or research papers, or other PDFs)
---

**Reconciled selection:** C + custom

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Capture all three LMS platforms and arbitrary student-selected websites/papers/PDFs; visible access and per-format extraction are verified during Construction.

### Question 06 — What content types are required?

**Decision impact:** PDF extraction, HTML extraction, images and math have different complexity.

**A)** Visible HTML text and accessible announcements only.

**B)** Visible HTML plus downloadable PDFs and uploaded documents.

**C)** HTML, PDFs, images, screenshots, equations, and embedded media.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — covers common coursework without OCR/media complexity

[Answer]: C

**Original user response (verbatim):** C / all
---

**Reconciled selection:** C

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Attempt complete authorized extraction of accessible HTML/PDF/images/equations/embedded media; use OCR or transcription when needed. Mark partial or inaccessible sources honestly, with manual import fallback.

### Question 07 — Which browser is the demo target?

**Decision impact:** Extension APIs differ across browsers.

**A)** Chrome with Manifest V3.

**B)** Chromium browsers (Chrome and Edge), tested on both.

**C)** Chrome and Firefox.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — smallest reliable extension target

[Answer]: A

**Original user response (verbatim):** chrome
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 08 — How is content captured?

**Decision impact:** Background capture risks permissions, duplication and brittle syncing.

**A)** Student clicks Save on the currently open page.

**B)** Student selects a region and saves only the selection.

**C)** Extension automatically captures/synchronizes visited course pages.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — explicit capture, minimal permissions, predictable provenance

[Answer]: X — User-initiated Save, with discoverable embedded-resource detection

**Original user response (verbatim):** A - but need to indentify if a file is embeded or similar
---

**Reconciled selection:** A + embedded discovery

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 09 — What import fallback is available?

**Decision impact:** Not every LMS page will parse correctly, and instructors distribute files outside LMS.

**A)** Browser extension only.

**B)** Extension plus local PDF/text/file upload.

**C)** Direct LMS API connections with OAuth.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — improves demo reliability without auth integration

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 10 — How should content be assigned to a course and folder?

**Decision impact:** Jev is suitable for structured classification, but unknown course IDs need confirmation.

**A)** User manually chooses course/folder.

**B)** Jev proposes known course/folder; student always confirms or corrects.

**C)** Jev proposes and auto-saves if confidence exceeds a threshold.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — transparent, low-risk intelligent organization

[Answer]: C

**Original user response (verbatim):** C
---

**Reconciled selection:** C

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 11 — What happens when classification is uncertain?

**Decision impact:** Low-confidence classification must not silently misfile course material.

**A)** Show top suggestions and require confirmation.

**B)** Save to an Unsorted inbox for later review.

**C)** Create a new course/folder automatically.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — preserve original user control

[Answer]: A

**Original user response (verbatim):** A
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

## C. Knowledge representation

### Question 12 — What original content is retained?

**Decision impact:** Index summaries must not replace source materials needed for verification.

**A)** Extracted plain text and original URL only.

**B)** Original downloaded file or HTML/text snapshot plus extracted text and metadata.

**C)** Only LLM-generated summaries to minimize storage.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — source fidelity and reproducibility

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 13 — What is the organizing structure?

**Decision impact:** A pure folder tree differs from a source-linked wiki.

**A)** Fixed hierarchy: course → folder → document.

**B)** Hierarchy plus tags and typed links between documents/versions.

**C)** Full knowledge graph of entities and relations.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — useful structure without graph-database overhead

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 14 — Should users be able to correct auto-generated metadata?

**Decision impact:** AI labels and summaries can be wrong.

**A)** Course/folder only.

**B)** Course/folder, tags, document title, and source/authority notes.

**C)** No manual corrections; regenerate automatically.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — editable metadata supports trustworthy organization

[Answer]: B

**Original user response (verbatim):** C - for now, we can revisit
---

**Reconciled selection:** B (Clarification 1 = A)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Editable course, folder, title, tags and source/authority notes, matching clarification 1.

### Question 15 — Which knowledge index should be generated?

**Decision impact:** Indexes reduce retrieval scope but cost model calls and can go stale.

**A)** Short per-document descriptions only.

**B)** Course and topic summaries only.

**C)** Both document summaries and a hierarchical source-linked course/topic index.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* C — strong course-wiki value; index references originals

[Answer]: C

**Original user response (verbatim):** C - ideally a knowledge graph similar
---

**Reconciled selection:** C

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 16 — When should indexes be rebuilt?

**Decision impact:** Updates must not leave retrieval pointing at stale summaries.

**A)** Incrementally after every saved/updated document.

**B)** Only when the student clicks Rebuild.

**C)** Periodic background rebuild.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — easier freshness semantics

[Answer]: A

**Original user response (verbatim):** A
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 17 — Should cross-document relationships be explicit?

**Decision impact:** A related page is different from one that supersedes an earlier instruction.

**A)** Tags only; no explicit edges.

**B)** Typed links such as related-to, duplicate-of, updates, and supersedes.

**C)** Arbitrary automatic knowledge-graph facts.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — directly supports version/conflict reasoning

[Answer]: B

**Original user response (verbatim):** ideally a knowledge graph similar
---

**Reconciled selection:** B (Clarification 2 = A)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Typed course/topic/document/version/fact relationships; graph-like behavior in SQLite rather than mandatory graph database, matching clarification 2.

## D. Versions, conflicts, and authority

### Question 18 — How should the system recognize a re-captured page?

**Decision impact:** A URL may hold changing content; an unchanged URL is not necessarily the same version.

**A)** Normalized source URL + content hash; save new version if content changes.

**B)** Treat every capture as a separate unrelated document.

**C)** Use semantic similarity to merge documents automatically.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — deterministic baseline with user override for special cases

[Answer]: A

**Original user response (verbatim):** A + C maybe
---

**Reconciled selection:** A + C (bounded)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Source URL/identity plus content hash for recapture; semantic similarity may suggest links, never auto-merge, matching clarification 3.

### Question 19 — What version history should remain available?

**Decision impact:** Auditability requires preserving prior versions rather than silently overwriting.

**A)** Retain all observed versions with capture timestamps and original snapshots.

**B)** Keep only latest, with a textual change summary.

**C)** Retain latest and one previous version.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — central product differentiator

[Answer]: A

**Original user response (verbatim):** A maybe, but only access latest?
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 20 — How is the default current answer selected?

**Decision impact:** Latest capture time is not equivalent to latest applicable or authoritative policy.

**A)** Simply prefer newest capture timestamp.

**B)** Use source type, published/effective dates, version relationships, and explicit precedence rules; flag ambiguity.

**C)** Require student to designate one document as canonical each time.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — deterministic, explainable authority rules

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 21 — Which contradictions should the MVP detect?

**Decision impact:** General-purpose contradiction detection is broad; deadline conflicts can be evaluated more reliably.

**A)** Dates/deadlines and exam logistics only.

**B)** Dates/deadlines plus assignment policy changes (rubric, submission rules, weights).

**C)** Any potentially contradictory course statements.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — narrow enough for validation, useful beyond one field

[Answer]: X — Systematic deadlines/logistics/assignment-policy checks, plus best-effort other substantive conflicts

**Original user response (verbatim):** A + B +C (little on C). not EVERY contradiction, but substantivbe ones
---

**Reconciled selection:** B + limited C

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Prioritize deadlines, exam logistics and assignment policies; broader conflicts only when substantive, not every textual difference.

### Question 22 — What should happen when sources conflict and priority is unclear?

**Decision impact:** An incorrect authoritative answer is worse than surfacing uncertainty.

**A)** Silently choose the newest statement.

**B)** Return both passages, dates/sources, and flag unresolved uncertainty for user review.

**C)** Suppress all answers involving conflicting sources.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — explicit, source-linked conflict status

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 23 — Should historical/as-of questions be supported?

**Decision impact:** The ability to ask what was true before an announcement makes versions directly useful.

**A)** Latest applicable facts by default; allow an as-of date filter.

**B)** Only newest information; history visible but not searchable.

**C)** Always ask the student to select a snapshot date.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — gives history without complicating normal queries

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 24 — How are sources that cannot be refreshed treated?

**Decision impact:** Manual capture cannot know whether the original site has changed.

**A)** Label last-captured time and do not claim current freshness without recapture.

**B)** Assume old captured data remains current.

**C)** Continuously poll logged-in sites in the background.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — accurate freshness disclosure without brittle syncing

[Answer]: A

**Original user response (verbatim):** B
---

**Reconciled selection:** A (Clarification 4 = A, non-alarmist presentation)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Show URL and capture date, with no routine staleness warnings on static documents; do not assert the live website is unchanged, matching final user refinement.

## E. Retrieval and Jev

### Question 25 — What retrieves initial candidates?

**Decision impact:** Organized routing and lexical search offer a simpler baseline than embedding-only RAG.

**A)** SQLite full-text search plus course/folder/date/version filters.

**B)** Hybrid lexical and vector search, with structured filters.

**C)** Pure Jev classification through the folder tree without a text index.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — simplest baseline; evaluate hybrid search as enhancement

[Answer]: B

**Original user response (verbatim):** B / knowledge search / RAG? similar
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 26 — Where should Jev participate in retrieval?

**Decision impact:** Jev is a structured decision model, not a substitute for source storage or deterministic version handling.

**A)** Course/folder classification at ingestion only.

**B)** Classification plus query routing, relevance screening, and reranking.

**C)** Jev replaces all lexical/vector retrieval and directs every navigation step.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — targeted intelligent steps with measurable benefit

[Answer]: B

**Original user response (verbatim):** A/B maybe?
---

**Reconciled selection:** B (A included)

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 27 — What happens if Jev is unavailable or uncertain?

**Decision impact:** A robust local demo should have predictable failure and fallback behavior.

**A)** Fall back to deterministic filters and full-text retrieval; disclose reduced ranking quality.

**B)** Fail retrieval entirely.

**C)** Silently trust the best Jev prediction regardless of confidence.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — keeps the library usable

[Answer]: A

**Original user response (verbatim):** already answered. manual maybe?
---

**Reconciled selection:** A (Clarification 5 = A)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Full-text and metadata-filtered fallback when Jev is unavailable; manual classification, matching clarification 5.

### Question 28 — What should retrieval return to the assistant?

**Decision impact:** Passing a giant context defeats the product motivation.

**A)** A short ranked evidence bundle with exact passages, source IDs, version IDs, and links.

**B)** Entire matching documents by default.

**C)** Only summaries, with no original passages.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — concise evidence for grounded answers

[Answer]: X — Two MCP tools: ranked preview search, followed by selected passage/full-content retrieval

**Original user response (verbatim):** A + B? like give a list first of potential with summaries, and then another MCP to fetch the actual content of the doc. maybe in text? or file? not sure
---

**Reconciled selection:** X — two-step search/fetch

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Return compact ranked search previews, then fetch selected excerpts or full extracted content with a separate read-only MCP tool.

### Question 29 — How should retrieval treat conflicting material?

**Decision impact:** Choosing one snippet can hide the existence of a contradictory newer announcement.

**A)** Return most recent passage only.

**B)** Return relevant competing versions/passages with relationship and confidence notes.

**C)** Return nothing until user resolves the conflict in the app.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — critical improvement over naïve RAG

[Answer]: B

**Original user response (verbatim):** already answered?  but maybe raise conflict and maybe B?
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 30 — Which evaluation tasks are required?

**Decision impact:** We need testable demonstrations that index/rerank/versions actually help.

**A)** Only manual demo examples.

**B)** Automated fixture tests for classification, latest-vs-stale dates, conflicts, passage citation, and MCP retrieval.

**C)** Large annotated retrieval evaluation set and human user study.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — enough rigor within course deadline

[Answer]: X — Manual end-to-end demo plus automated fixture tests

**Original user response (verbatim):** A + B
---

**Reconciled selection:** A + B

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Both manual demonstrations and automated fixtures; no formal large user study.

## F. MCP and user experience

### Question 31 — What must the first MCP client be?

**Decision impact:** Local stdio MCP is easier to demonstrate than remote ChatGPT integration.

**A)** Claude Desktop using a local MCP server.

**B)** Claude Code/Codex CLI using a local MCP server.

**C)** ChatGPT via remote MCP from the outset.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A or B — choose one known-available local client and test it end to end

[Answer]: B

**Original user response (verbatim):** for now, local MCP? maybe hosted later?
---

**Reconciled selection:** B (Clarification 6 = B, Codex CLI)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Codex CLI first as a local MCP client; remote/hosted options deferred, matching final user refinement.

### Question 32 — Is direct ChatGPT support mandatory for the final demo?

**Decision impact:** ChatGPT custom-server connections have plan/workspace restrictions and generally need a reachable remote endpoint.

**A)** Mandatory, even if remote connectivity and suitable account access are required.

**B)** Desirable stretch goal; MCP-compatible local client is sufficient for grading.

**C)** Explicitly excluded from MVP.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — avoid making a client entitlement the project critical path

[Answer]: B

**Original user response (verbatim):** local MCP is probably fine and neough
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 33 — Which MCP capabilities should the server expose first?

**Decision impact:** A narrow read-only contract is easier to secure and test.

**A)** Read-only tools: list courses, search, fetch passages, inspect versions/conflicts.

**B)** Tools plus resource discovery and prompt templates.

**C)** Full read/write course organization via MCP, including delete and modify.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — sufficient for grounded assistant Q&A

[Answer]: A

**Original user response (verbatim):** read-only
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 34 — Should Course Copilot provide an embedded chat?

**Decision impact:** A built-in chatbot duplicates the student’s preferred assistant and increases scope.

**A)** No embedded chat; extension and library UI plus external MCP assistant.

**B)** Minimal built-in search/preview, but no conversational generation.

**C)** Full built-in course chatbot.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — inspect library and sources without competing with ChatGPT/Claude

[Answer]: A

**Original user response (verbatim):** A no chat
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

## G. Implementation, privacy, and testing

### Question 35 — Which LLM does the product use for summaries and conflict candidates?

**Decision impact:** The assignment requires a concrete planned provider/model; local-first refers to app deployment, not necessarily model hosting.

**A)** Hosted OpenAI model via user-provided API key.

**B)** Local Ollama model (name and hardware requirements must be specified).

**C)** Hosted Anthropic model via user-provided API key.

**D)** User-selectable hosted/local provider with at least one tested default.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A or B — choose one tested model, not an unverified provider matrix

[Answer]: B

**Original user response (verbatim):** B - cheap and easy
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 36 — What is the application implementation stack?

**Decision impact:** Consistency matters across extension, local UI and MCP implementation.

**A)** TypeScript end to end: Chrome extension + Node backend + SQLite + MCP JS SDK + Vitest.

**B)** TypeScript extension with Python/FastAPI backend + SQLite + pytest.

**C)** Other ecosystem selected by team after quick proof of concept.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — fewer languages and shared types

[Answer]: A

**Original user response (verbatim):** whichever is easiest and best
---

**Reconciled selection:** A (agent selection)

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 37 — Where should data be stored and processed?

**Decision impact:** Authenticated class pages and unpublished materials may be sensitive.

**A)** Local-only database/files; only explicit selected text goes to any hosted model.

**B)** Local database with all extracted content sent to hosted model for indexing.

**C)** Cloud-hosted shared database and continuous syncing.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — restrictive by default; decide what explicit hosted calls are permitted

[Answer]: A

**Original user response (verbatim):** cheapest and best
---

**Reconciled selection:** A (agent selection)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Local data and Ollama by default; only minimal explicitly consented metadata or excerpts may reach hosted Jev, matching clarification 7.

### Question 38 — How should authenticated LMS access work?

**Decision impact:** Reusing session tokens or crawling behind logins increases security and policy risk.

**A)** Extension reads the current page with user action; never exports cookies/tokens.

**B)** User gives API tokens to programmatic LMS integrations.

**C)** Backend signs in with stored passwords to crawl the site.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — no credential collection

[Answer]: A

**Original user response (verbatim):** A / no API tokens
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 39 — Which level of collaboration/sharing is in the MVP?

**Decision impact:** Sharing course content may violate course policy and requires authorization controls.

**A)** Private single-user library, no sharing.

**B)** Explicit export/import of selected materials without account sync.

**C)** Cloud collaboration with permissions and team libraries.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* A — safe default and achievable MVP

[Answer]: A

**Original user response (verbatim):** A
---

**Reconciled selection:** A

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 40 — What is the realistic demo dataset?

**Decision impact:** The project needs meaningful test cases without unauthorized sharing or leaking personal data.

**A)** Synthetic course with crafted syllabus, conflicting announcements and assignments.

**B)** Real course materials only, with instructor permission if needed.

**C)** Both synthetic fixture for automated tests and authorized real-course demo.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* C — test repeatability and realistic usage

[Answer]: B

**Original user response (verbatim):** B, we can do our own courses (like team members)
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

## H. Optional AI-DLC extensions

### Question 41 — Should the Security Baseline extension be enabled?

**Decision impact:** Full rules become blocking constraints; base privacy and secret-handling requirements still apply if disabled.

**A)** Yes — apply all security extension rules as blocking constraints.

**B)** No — use mandatory baseline precautions, without the optional extension overhead.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B for a local prototype, unless the team specifically wants stricter checks

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 42 — Should the Resiliency Baseline extension be enabled?

**Decision impact:** This adds design-time reliability guidance and additional formal obligations.

**A)** Yes — apply resiliency guidance as an extension.

**B)** No — use targeted error handling and backup/testing requirements only.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — local course demo, not a high-availability service

[Answer]: B

**Original user response (verbatim):** B
---

**Reconciled selection:** B

**Status:** Initial response recorded; pending final clarification reconciliation.

### Question 43 — Should the Property-Based Testing extension be enabled?

**Decision impact:** It can improve version-state and serialization correctness but increases implementation effort.

**A)** Yes — full property-based-testing rules.

**B)** Partial — focus on pure functions, metadata/version invariants, and serialization round-trips.

**C)** No — conventional unit/integration fixture tests only.

**X) Other** — Describe an alternative or hybrid and the rule governing when each part applies.

*Suggested starting point (not an answer):* B — useful for deterministic version invariants

[Answer]: B

**Original user response (verbatim):** IDK, you think and pick
---

**Reconciled selection:** B (agent selection)

**Status:** Initial response recorded; pending final clarification reconciliation. **Final interpretation:** Partial property-based tests for pure versioning/serialization logic, as accepted by the user.

## Gate conditions

- Total questions: **43**. All `43` responses recorded; eight targeted follow-up clarifications are open in `requirements-clarification-questions.md`.
- Verify answers against `docs/vision.md` and `docs/technical-environment.md` before locking `decision-register.md` and generating `requirements.md`.

