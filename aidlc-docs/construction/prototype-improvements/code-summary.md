# Prototype Improvements — Code Summary (branch `safi/prototype-improvements`)

Source of the change: Safi's answers in `aidlc-docs/inception/requirements/prototype-change-questions.md` (1A, 2C, 3A, 4C, 5C, 6B), then "just do it" (audit, 2026-11-22T19:05Z). Per answer 6B the shared requirements (FR-14) are **not** edited on this branch; the team approves before merge.

| Goal | What changed | Files |
|---|---|---|
| One-command setup (3A) | `npm run setup` installs, builds and starts | `package.json`, `README.md` |
| Ask box, agent style (1A, 2C) | `POST /api/ask`: agent chooses tools (search_course, check_deadlines, read_document) for up to 4 steps with a local Ollama model, answers only from saved evidence and returns sources and steps. Without a model it picks tools by rule and quotes saved text. Source text is treated as data. | `src/library/agent/ask.ts`, `src/library/gateways/local.ts` (`chatLocally`), `src/library/api/server.ts` |
| UI redesign around student tasks (4C) | Sections Materials → Ask → Deadlines; plainer wording; no sparkle icons; Deadlines view lists due dates, changes and conflicts with sources | `src/ui/app.tsx`, `src/ui/styles.css` |
| ChatGPT app (5C) | Read-only MCP over Streamable HTTP on 127.0.0.1:4311 with a secret path, for a temporary demo tunnel | `src/mcp/http.ts`, `scripts/build.ts`, `src/mcp/index.ts` (entry guard) |

## Verification
- `npm run typecheck`, `npm run build`: pass.
- `npm test`: 53 tests in 5 files pass (4 new in `tests/ask.test.ts`: deadline answer with sources/steps, "couldn't find", token/validation, MCP HTTP tool listing behind the secret path).
- Browser check: Ask answered "Final Project is due November 22, 2026" with the announcement and syllabus as sources; Deadlines showed the resolved final-project change and the unresolved Assignment 2 conflict.

## Not verified
- Ask with a real local Ollama model (no model in the build environment).
- A real ChatGPT developer-mode connection through a tunnel.
- FR-14 change and local-only exception for ChatGPT still need team approval (answer 6B).
