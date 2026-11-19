# Course Copilot — Technical Environment

**Course:** Cornell INFO 5940, Fall 2026 — Group 17  
**Method:** AWS AI-DLC v1.0.1. Draft input for the `candidate/course-copilot` Requirements Analysis stage; runtime model and integration benchmarks will be verified before Construction.

## Language, framework, package management

| Component | Proposed stack |
|---|---|
| Chrome extension | TypeScript, Chrome Manifest V3, user-triggered page capture, minimal permissions |
| Local backend and MCP | Node.js LTS, TypeScript, npm, lightweight HTTP server, TypeScript MCP SDK |
| Persistent storage | SQLite + FTS5, local file/snapshot directory, optional embeddings |
| Local LLM | Ollama with `gemma3:4b` as an initial candidate (performance unverified) |
| Optional structured classifier | Jev, enabled only with informed consent for hosted requests |
| Tests | Vitest unit/integration tests, controlled fixtures, manual Chrome/Codex smoke tests |

The MVP uses typed links between course, topic, source, document, version, passage, and fact records; a dedicated graph database is not necessary.

## Deployment / cloud provider

**No cloud provider is required.** Run the extension, local API, SQLite storage, Ollama, and a read-only MCP server on the team's laptop. **Codex CLI** is the initial target MCP host. Hosted Jev calls are optional, specifically authorized and minimized; the application must remain useful without them. Cloud deployment, hosted MCP and sharing are deferred.

## Data, capture and processing

A student explicitly selects **Save** on a page already accessible in Chrome, or imports a file. Do not automate login or capture secrets. Save the original accessible source, source URL, capture timestamp, content hash, discovered embedded-file references, and processing status. For embedded resources, attempt permitted capture; if inaccessible, report the limitation and support manual upload.

Perform native text extraction for HTML/PDF first, then OCR for images/scanned pages and transcription for accessible audio/video **when needed** to make media searchable. Store extracted text with page/segment provenance. Never falsely declare incomplete extraction to be complete. A user can edit course, folder, title, tags and source authority metadata.

Version identity is based on explicit source identity and content hashes; changing content creates a new immutable saved version. AI similarity may suggest relationships but cannot silently merge originals. Store source-linked facts and relations such as `related`, `updates`, and `supersedes`. Retrieve the latest applicable **saved** evidence by default, while exposing previous versions and substantive conflicts. For most static documents show URL and capture date without generalized freshness warnings; do not imply external sources have been checked since capture.

## Retrieval and MCP

Local indexed retrieval combines exact/full-text queries, optional semantic embeddings, course/topic filters, and version/authority rules. Jev may optionally classify, route or rerank bounded candidate sets. Fail closed on unsupported evidence, and fall back to deterministic full-text and metadata search when Jev or Ollama is unavailable.

Read-only MCP tools should include:
- `list_courses` — available courses.
- `search_course` — ranked compact previews (title, course, summary, source URL, captured date, version, snippets, conflict markers).
- `fetch_evidence` — selected excerpts or full available extracted text with original source references and competing evidence.
- `get_document_history` — saved versions and documented changes.

MCP cannot mutate or delete course materials. Ingestion and metadata correction happen through the extension/local interface, not MCP.

## Testing and evaluation

Use fixed, permission-cleared sample pages and documents. Automated tests should cover document identity, immutable versions, source citations, precedence/supersession rules, conflict flagging, course isolation, full-text fallback, input validation, and read-only MCP. Partial property-based tests may cover pure version/serialization invariants. Demo scenarios include deadline changes between a syllabus and later announcement, concept retrieval from course documents, and handling of inaccessible embeds. Perform an actual Codex MCP connection test and local LLM benchmark during Construction.

## Prohibited libraries / patterns

| Avoid in the MVP | Reason | Alternative |
|---|---|---|
| LMS credential harvesters, browser cookie extraction, headless login bots | Security and policy risk | User-initiated capture of already-authorized pages |
| Required managed cloud database or hosting | Unnecessary complexity for a laptop demo | SQLite, local files and localhost services |
| Front-end embedded provider/API secrets | Public exposure | Server-side ignored environment configuration, with explicit opt-in |
| Large autonomous orchestration frameworks without demonstrated value | Opaque behavior and cost | Explicit typed retrieval/indexing/validation pipeline |
| Silent semantic document merging or invented citations | Risks factual integrity | Preserve sources, typed links, ambiguity flags |

## Security basics

Use minimal extension permissions and explicit saving, loopback binding for the local server, origin/request checks, bounded file sizes, safe parsing, and prompt-injection resistance when extracting untrusted course pages. Never store LMS tokens or passwords; never commit secrets. Restrict any hosted Jev request to user-approved minimal metadata or excerpts; keep original files and full-document model processing local by default. Handle student records and copyrighted materials conservatively.

## Typical local endpoint (illustrative)

```http
POST http://127.0.0.1:4123/api/captures
Content-Type: application/json

{"courseId":"info5940","sourceUrl":"https://canvas.example.edu/courses/123/pages/syllabus","capturedText":"..."}
```

Successful responses provide the document/version IDs, capture time, and extraction status; the API never claims an inaccessible embed was extracted.

## Typical function (illustrative)

```ts
type Evidence = {
  passageId: string;
  documentId: string;
  versionId: string;
  sourceUrl: string;
  capturedAt: string;
  excerpt: string;
  conflictingPassageIds: string[];
};

async function searchCourse(
  query: string,
  opts: { courseId?: string; limit?: number },
): Promise<Evidence[]> {
  // Implement and test during Construction.
  throw new Error("Not implemented");
}
```

## Typical test (illustrative Vitest fixture)

```ts
import { expect, it } from "vitest";

it("retains both a syllabus deadline and the later announcement", () => {
  const versions = [
    { source: "syllabus", due: "2026-11-20" },
    { source: "announcement", due: "2026-11-23" },
  ];
  expect(versions).toHaveLength(2);
  expect(versions[0].due).toBe("2026-11-20");
});
```

This is an illustrative example, **not** proof that the actual version-resolution pipeline works.

## AI-DLC extension choices

Mandatory course rubric rules are enabled. Optional extension selections (Security Baseline, Resiliency Baseline, Property-Based Testing) are pending the Requirements Analysis verification question gate (`aidlc-docs/aidlc-state.md`).

## Milestones

Inception through Units Generation due **November 24, 2026, 11:59 PM EST**; do not enter Construction for this milestone. Final implementation/demo due **December 16, 2026**.
