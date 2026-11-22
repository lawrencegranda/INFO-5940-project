# Prototype Change Request — Clarification Questions

Requested by Safiullah Safdariyan (team input from group chat, 2026-11-21/22): continue the Course Copilot prototype following AI-DLC with these goals:
(1) simpler setup, (2) an "Ask" box where the AI answers questions from saved materials with sources, (3) a UI that looks less AI-generated, (4) later, a ChatGPT app plugin.

**Conflict found:** approved requirement **FR-14** says "Expose local read-only MCP to Codex as the first required AI host. **No built-in chatbot.**" Goal (2) changes an approved requirement, so it must be decided by the team before any code changes.

Please answer every question. Put your letter after `[Answer]:`.

## Question 1
How should we handle FR-14 ("No built-in chatbot") given the request for an "Ask" box?

A) Change FR-14: add a built-in "Ask" box as a core feature, keep MCP as a second way to connect

B) Keep FR-14 as is: no built-in chat; improve the MCP/Codex connection instead

C) Add the "Ask" box only as an optional prototype experiment; FR-14 stays unchanged for the MVP

D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
If an "Ask" box is added, how should answers work?

A) The AI may only answer from the student's saved materials and must show the exact source passage; if nothing is found it says "I couldn't find this in your materials"

B) The AI answers from saved materials first, but may also use general knowledge, clearly labeled

C) Agent style: the AI decides which tools to call (search, fetch passages, check deadline updates) before answering, always with sources

D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3
What does "simpler setup" mean for the prototype?

A) One command (for example `npm run setup`) that installs, builds and starts the app

B) A) plus clear on-screen guidance in the app when the local AI (Ollama) is missing

C) Ship without local AI by default and use a hosted provider with the student's own API key

D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4
What should "less AI-generated UI" mean?

A) Plainer student-app look: simpler wording, fewer badges/labels, no "AI" sparkle icons, normal fonts and colors

B) Keep the current layout but rewrite the text so it sounds human and short

C) Redesign around the main student tasks (My courses → Materials → Ask → Deadlines)

D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 5
When should the ChatGPT app plugin happen?

A) Not now — record it as a future item for the final project (December)

B) Plan it now as part of this change, build later

C) Build it now in the prototype

D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 6
Who must approve this change before it is applied to the shared requirements?

A) Safi decides for the prototype branch only; the team reviews before anything is merged

B) The whole team must approve in the group before requirements are changed

C) Other (please describe after [Answer]: tag below)

[Answer]: 
