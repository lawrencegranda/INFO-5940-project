# Course Copilot — Product Vision (DRAFT)

**Course:** Cornell INFO 5940, Fall 2026, Group 17  
**AI-DLC:** v1.0.1, Inception  
**Review status:** Proposed by one team member; not yet formally approved by the full team. A separate branch contains an alternative Marketing Campaign Asset Copilot concept; do not merge either proposal before team alignment.

## Problem

Students use ChatGPT, Claude, and other assistants for coursework, but relevant material is dispersed across authenticated learning platforms, documents, announcements, and research resources. Uploading all materials into a chat creates context overload. Flat document retrieval often treats old and new information alike, missing changes in deadlines, assignment rules, and other substantive facts. Students need a course-specific, organized, source-grounded knowledge layer rather than another chatbot.

## Product

Course Copilot is a **local-first, private, multi-course knowledge library**: an Obsidian/second-brain-like vault designed to serve accurate course context to other AI assistants using the Model Context Protocol (MCP). It preserves original sources, links, capture dates, versions, extracted evidence, course and topic organization, and graph-like typed relationships. The AI assistant handles the conversation; Course Copilot supplies ranked, attributable evidence and explicit uncertainty.

## Primary user and journey

A student studying several courses opens a page in Canvas, Gradescope, EdStem, or on the wider web and presses **Save** in a Chrome extension, or uploads a research paper, PDF, or other local file. The extension identifies the page and any discoverable embedded materials. An AI-supported classifier suggests course and folder, asking for confirmation when uncertain; the user can correct the metadata later. Course Copilot stores the accessible original/snapshot, captures URL and date, extracts searchable text, and updates a source-linked course index. The student later asks Codex, connected to the local read-only MCP server, a course question. Search returns compact ranked candidates; the assistant can request passages or complete extracted content for selected candidates.

## MVP — target by December 16, 2026

1. **Capture:** Explicit user-triggered saving of accessible pages from Canvas, Gradescope, EdStem, and ordinary sites; local imports including research papers and PDFs. Discover embedded resources and retrieve them only where authorized. Attempt full accessible extraction using native text first, OCR/transcription where needed. Clearly label inaccessible, unsupported, partial, or failed extractions.
2. **Organize:** Multiple isolated courses, folders/topics, tags and editable classification; local original files/snapshots, provenance URLs, capture times and any known publication/effective dates. Jev may suggest classifications when specifically authorized; manual/local fallback remains available.
3. **Build knowledge:** Incremental source-linked summaries, a searchable index, immutable saved versions, and typed relationships among courses/topics/documents/versions/facts (without requiring a graph database).
4. **Respect change and uncertainty:** Highlight substantive changes and contradictory *saved* information, especially assignment deadlines, exam logistics and instructions. Use explicit dates/source authority/supersession rules; preserve competing evidence and flag unresolved uncertainty. Never claim to know about changes that have not been captured. Ordinary static documents need no generalized staleness warning.
5. **Retrieve:** Hybrid full-text/semantic search and version filters, optional Jev query routing/reranking, and two-step MCP tools for search previews then retrieval of source passages/content. Codex is the first required local client; tools are read-only. No built-in chatbot.

## LLM roles and evaluation

Use a local generative model via Ollama for summary and structured fact extraction; `gemma3:4b` is the first model candidate, pending smoke testing on the team's laptop. Hosted Jev is a distinct, opt-in service for structured classification and possibly retrieval decisions; send minimal student-approved metadata/excerpts only, never credentials or unapproved source files. Deterministic code handles document identity, versions, citations, factual precedence rules and safe fallback. Test with (a) conceptual questions and citations, (b) a syllabus versus a later deadline-changing announcement, (c) multiple courses with no cross-course leakage, and (d) partial/inaccessible embedded media.

## Out of scope for this milestone / MVP

No cloud deployment, automatic LMS polling/synchronization, account/login automation, sharing across students, hosted MCP, ChatGPT-specific remote MCP, built-in chat, arbitrary autonomous actions, or full general-purpose graph database. Historical versions remain browsable; historical point-in-time query search is not required.

## Risks and open implementation validations

The combination of three authenticated LMS sites and broad media types is a schedule risk. Site-specific DOMs, cross-origin embeds and permissions may limit completeness. Record extraction status honestly and use manual upload fallback. Validate Chrome permission behavior, the Codex MCP connection, Ollama latency/quality, OCR/transcription practicality, vector implementation and rights/privacy constraints before final commitments. These are engineering validation tasks, not unresolved product-direction questions.

## Milestone boundary

By **November 24, 2026, 11:59 PM EST**, finish team-approved AI-DLC **Inception through Units Generation** only. Do not enter Construction or write application code for that milestone. The final build/demo is due **December 16, 2026**.
