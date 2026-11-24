# Course Copilot — Technical Environment

**Course:** Cornell INFO 5940, Fall 2026 — Group 17  
**Method:** AWS AI-DLC v1.0.1. Historical input approval for the `candidate/course-copilot` Inception track: 2026-11-19T19:26:39Z. Runtime model and integration benchmarks remain unverified; proposed evaluation timing is distinguished below.

**Approved corrective review:** November 23 on existing PR #8. The MVP includes local Ask and local MCP; Jev and advanced media capabilities are retained for later iterations. The revised Inception artifacts were approved in [Lawrence’s approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) at 2026-11-23T22:37:29Z. This accepts the documented evaluation approach, not a final model, compatibility result or benchmark. The six MCP tools/course scope reconcile existing contracts; focused local Ask is the separate FR-16/US-26 amendment. Safi's [three technical-review comments](https://github.com/lawrencegranda/INFO-5940-project/pull/7#discussion_r4669544807) supply named technical baselines and example feedback. Following Iris's review, a manual model probe is proposed during authorized early Construction as input to NFR Requirements; real-pipeline checks follow later. This pass runs no model or integration benchmark.

## Language, framework, package management

| Component | Proposed stack for technical review |
|---|---|
| Chrome extension | TypeScript 5.x, Chrome Manifest V3, user-triggered page capture, minimal permissions |
| Local runtime and API | Node.js 22.x, npm, TypeScript 5.x, Express 4.x |
| Input validation | Zod 4.x, proposed in Safi's technical review |
| Local library UI | React 18.x; capture, organization, evidence inspection and focused local course Ask |
| Local MCP | `@modelcontextprotocol/sdk` 1.x, read-only local stdio |
| Persistent storage | SQLite + FTS5, local immutable file/snapshot directory; semantic index for required hybrid acceptance, with keyword fallback |
| Native PDF/HTML extraction | pdf.js 4.8.x and linkedom 0.18.x, matching the existing manifest as a compatibility starting point |
| Local LLM | Ollama with `gemma3:4b` as an initial candidate (performance unverified) |
| Deferred structured classifier | Jev retained for post-MVP classification/routing/reranking with explicit minimal-payload permission; not connected in the current MVP |
| Tests | Vitest 5.x, fast-check 3.x for the inherited partial PBT scope, and supertest 7.x for local API fixtures; later manual Chrome/Codex smoke tests |

These ranges are Safi's proposed technical direction, checked against the separately developed prototype's declared dependencies, not claims about latest releases, verified compatibility or whole-team adoption. Exact versions/lockfile, a Node 22 patch supporting the selected native SQLite API, SQLite/FTS5 capabilities, Ollama runtime/model tags and extraction adapters remain to be recorded and validated through the appropriate reviews. Safi supports comparing the Gemma baseline against Qwen and DeepSeek candidates before choosing; no comparison result or final model choice is inferred. The current [delivery allocation](../aidlc-docs/inception/requirements/mvp-scope.md) retains Jev and advanced media design for later delivery and removes those paths from current MVP acceptance.

The MVP uses typed links between course, topic, source, document, version, passage, and fact records; a dedicated graph database is not necessary.

**Jev definition:** Jev is TypeSafe AI's typed-decision model/API, retained as a later hosted classifier or candidate reranker, distinct from the local text-generating Ollama model. The provider's [playground](https://github.com/TypeSafeAI/typesafe-playground) and [reranker example](https://github.com/TypeSafeAI/typesafe-playground/blob/main/docs/reranker.md) show server-side API-key use and closed-set relevance decisions (checked November 23). A valid response/score is not proof of correctness, source authority or permission. This integration is deferred beyond the current MVP. Its design/privacy requirements remain in the backlog; no current price or implementation result is asserted.

## Deployment / cloud provider

**No cloud provider is required.** Run the extension, local API, SQLite storage, Ollama, and a read-only MCP server on the team's laptop. **Codex CLI** is the initial target MCP host. No Jev calls or hosted-permission setup are required in the current MVP. When the deferred integration is implemented, requests must be specifically authorized and minimized. Cloud deployment, hosted MCP and sharing are deferred.

The main library/Ask user uses the local UI without a terminal. The technical pilot still verifies an actual Codex CLI MCP connection. Local Ask uses the local model; the external Codex model/provider is configured separately and may process retrieved passages outside the laptop. Remote ChatGPT MCP integration/tunnels are not part of this amendment.

## Data, capture and processing

A student explicitly selects **Save** on a page already accessible in Chrome, or imports a file. Do not automate login or capture secrets. Save the original accessible source, source URL, capture timestamp, content hash, discovered embedded-file references, and processing status. For linked/embedded native-text PDFs, attempt permitted capture; disclose inaccessible items and manual import. Media-specific acquisition/processing is retained for later work.

The current MVP extracts available native HTML/PDF text with page/passage provenance, preserves supported originals and discloses non-text gaps. Scan/image OCR, advanced math/diagram recognition and audio/video transcription are deferred adapters; storing an original does not mean those capabilities have run. A user can edit course, folder, title, tags and source-authority metadata. Never label incomplete or deferred extraction as complete.

Version identity is based on explicit source identity and content hashes; changing content creates a new immutable saved version. AI similarity may suggest relationships but cannot silently merge originals. Store source-linked facts and relations such as `related`, `updates`, and `supersedes`. Retrieve the latest applicable **saved** evidence by default, while exposing previous versions and substantive conflicts. For most static documents show URL and capture date without generalized freshness warnings; do not imply external sources have been checked since capture.

## Retrieval and MCP

Local indexed retrieval combines exact/full-text queries, semantic embeddings, course/topic filters, and version/authority rules. FR-12 requires both lexical and semantic acceptance; temporary embedding unavailability must not block deterministic keyword/metadata fallback, but keyword success alone does not satisfy semantic acceptance. Local retrieval operates independently of Jev; hosted classification/routing/reranking is retained for a later iteration. Fail closed on unsupported evidence and preserve native-text/metadata access when the local model or embeddings are unavailable.

The six tools established in [Application Design](../aidlc-docs/inception/application-design/component-methods.md) are:

- `list_courses` — available local courses; the only unscoped tool.
- `search_course` — course-scoped compact ranked previews with pinned references, snippets, source/capture/version information, processing status and conflict markers.
- `fetch_document` — bounded/paginated extracted text for an exact saved document/version/extraction revision, with citations and omissions.
- `fetch_passages` — selected exact passages pinned to document/version, extraction revision and passage identity.
- `get_document_history` — preserved versions/capture history, checked against current course membership.
- `get_conflicts` — claim-scoped applicable/competing evidence and unresolved status; it does not accept or resolve a relationship.

Every tool except `list_courses` requires `courseId`; exact references must not bypass current course-membership checks or silently redirect to newer versions. Read-only tools do not initiate ingestion, metadata writes, index repair, model enrichment or hosted-permission grants. The external Codex/model provider remains a separate boundary: a local library/MCP server does not mean the assistant's model also runs locally.

MCP cannot mutate or delete course materials. Ingestion and metadata correction happen through the extension/local interface, not MCP.

## Local course Ask

FR-16/US-26 add C-13 Course Ask Orchestrator and S-05 Local Course Ask. The controlled C-02/C-03 UI request carries course/request identity and composes C-11/C-05 query/read capabilities with C-07 local generation. It does not add an MCP tool or gain ingestion, metadata, consent or index-write dependencies. Ask uses a local-only retrieval composition. Deferred Jev routing is not part of either MVP Ask or MVP MCP query composition.

Use bounded search previews then fetch selected exact passages before generating. Validate answer citation IDs against that request's retrieved course/source/document/version/extraction/passage set. Insufficient evidence stays explicit; substantive conflicts show competing evidence and the source-authority limitation. A student note or unknown publisher cannot become an instructor update through recency or model confidence. Invalid model output is rejected, and a missing model offers clearly labeled retrieval-only evidence.

Keep draft, pending request identity, answer/evidence and errors per course during navigation within the running app. An old request cannot overwrite a newer request or another course's view. This is UI state, not a persistent library write; reload-persistent conversation history is not required. Future acceptance must exercise citation validation, no-evidence/model-failure paths, conflict display, tab/course switching and out-of-order responses. This document does not claim those implementation checks have passed.

## Testing and evaluation

Use fixed, permission-cleared sample pages and documents. Automated tests should cover document identity, immutable versions, source citations, precedence/supersession rules, conflict flagging, course isolation, full-text fallback, input validation, and read-only MCP. Partial property-based tests may cover pure version/serialization invariants. Demo scenarios include deadline changes between a syllabus and later announcement, concept retrieval from course documents, and handling of inaccessible embeds. Perform an actual Codex MCP connection test and local LLM benchmark during authorized Construction. Current MVP checks cover native-text/PDF inputs, local filing/retrieval/Ask and source/failure boundaries. Jev provider tests, OCR/advanced-recognition quality and media transcription/segment tests remain later acceptance work, not MVP gates.

## Prohibited libraries / patterns

| Avoid in the MVP | Reason | Alternative |
|---|---|---|
| LMS credential harvesters, browser cookie extraction, headless login bots | Security and policy risk | User-initiated capture of already-authorized pages |
| Required managed cloud database or hosting | Unnecessary complexity for a laptop demo | SQLite, local files and localhost services |
| Front-end embedded provider/API secrets | Public exposure | Server-side ignored environment configuration, with explicit opt-in |
| Large autonomous orchestration frameworks without demonstrated value | Opaque behavior and cost | Explicit typed retrieval/indexing/validation pipeline |
| Silent semantic document merging or invented citations | Risks factual integrity | Preserve sources, typed links, ambiguity flags |

## Security basics

Use minimal extension permissions and explicit saving, loopback binding for the local server, origin/request checks, bounded file sizes, safe parsing, and prompt-injection resistance when extracting untrusted course pages. Never store LMS tokens or passwords; never commit secrets. The current MVP makes no Jev requests. Retain the minimal-payload explicit-permission requirement for that later integration; originals and full-document model processing stay local by default. Handle student records and copyrighted materials conservatively.

## Typical local endpoint (illustrative)

The route and HTTP encoding are proposals, not implemented endpoints. Port 4310 follows Safi's correction and the prototype's actual default; its separate review preview may use another port. Pairing/origin validation and bounded input validation are prerequisites; no credential value is embedded here. `contentText` is a proposed wire encoding that would become UTF-8 `CapturedItem.bytes` in the reviewed API, not a replacement for the canonical ingestion contract.

**Prototype distinction:** The current prototype uses `/api/capture` or `/api/import`, a `content` field and an import result containing `document` plus `disposition`. Safi's proposed plural `/api/captures`, `capturedText` and flat receipt are not that implemented contract. The example below illustrates the approved design's preserved-original/queued-processing distinction; it is not a request to paste into the existing prototype. A synchronous import may legitimately return 201 after extraction; a queued receipt must not claim extraction is already complete.

```http
POST http://127.0.0.1:4310/api/captures
Content-Type: application/json
Origin: chrome-extension://<paired-extension-id>

{
  "selectedCourseId": "info5940",
  "items": [{
    "itemKey": "page",
    "origin": {
      "kind": "web",
      "sourceUrl": "https://canvas.example.edu/courses/123/pages/syllabus"
    },
    "capturedAt": "2026-11-23T15:00:00Z",
    "mediaType": "text/plain",
    "contentText": "Final project is due November 20, 2026.",
    "outcome": "complete",
    "limitations": []
  }],
  "discoveredResources": []
}
```

```http
HTTP/1.1 202 Accepted
Content-Type: application/json

{
  "ok": true,
  "value": {
    "runId": "run-001",
    "state": "queued",
    "items": [{
      "itemRef": {"runId": "run-001", "itemKey": "page"},
      "versionRef": {
        "courseId": "info5940",
        "sourceId": "source-001",
        "documentId": "document-001",
        "versionId": "version-001"
      },
      "captureOutcome": "complete",
      "steps": {
        "extraction": "pending",
        "organization": "pending",
        "summary": "pending",
        "claims": "pending",
        "indexing": "pending"
      },
      "omissions": [],
      "errors": []
    }]
  },
  "warnings": []
}
```

This proposed receipt identifies the preserved original and queued work. Capture success is not extraction completion; capture provenance remains associated with the stored version. Each selected inaccessible child needs its own partial/failed/unsupported outcome. No parent success hides a missing child.

## Typical function and paired test (illustrative proposal)

The following two blocks form one isolated example fixture. They demonstrate an already-validated, same-instruction old/new pair, not the complete multi-update production algorithm. Dates and references are validated upstream. `authorityEvidenceRef` must point to captured provenance or a documented review basis already checked by the caller; a submitted role label or an LLM assertion cannot establish that evidence. The fields below are a proposed example projection, not a change to the canonical application-design schema. Actual role/provenance handling requires technical review.

```ts
type DeadlineClaim = Readonly<{
  factId: string;
  courseId: string;
  subjectKey: string;
  due: string;
  documentId: string;
  versionId: string;
  publisherRole: "instructor" | "student" | "unknown";
  authorityEvidenceRef?: string;
  publishedAt: string | null;
  replacesFactId?: string;
}>;

function resolveDeadline(previous: DeadlineClaim, candidate: DeadlineClaim) {
  if (
    previous.courseId !== candidate.courseId ||
    previous.subjectKey !== candidate.subjectKey
  ) {
    throw new Error("Claims are not comparable");
  }
  const evidence = [previous, candidate] as const;
  const oldTime = Date.parse(previous.publishedAt ?? "");
  const newTime = Date.parse(candidate.publishedAt ?? "");
  const supportedUpdate =
    candidate.publisherRole === "instructor" &&
    Boolean(candidate.authorityEvidenceRef) &&
    candidate.replacesFactId === previous.factId &&
    Number.isFinite(oldTime) &&
    Number.isFinite(newTime) &&
    newTime >= oldTime;

  return supportedUpdate
    ? { status: "established_update" as const, applicable: candidate, evidence }
    : { status: "unresolved" as const, evidence };
}
```

```ts
import { expect, it } from "vitest";

it("applies a supported instructor update and preserves both sources", () => {
  const syllabus: DeadlineClaim = Object.freeze({
    factId: "fact-syllabus",
    courseId: "info5940",
    subjectKey: "final-project/deadline",
    due: "2026-11-20",
    documentId: "doc-syllabus",
    versionId: "version-syllabus-1",
    publisherRole: "instructor",
    authorityEvidenceRef: "provenance-syllabus",
    publishedAt: "2026-11-01T15:00:00Z",
  });
  const announcement: DeadlineClaim = Object.freeze({
    ...syllabus,
    factId: "fact-announcement",
    due: "2026-11-22",
    documentId: "doc-announcement",
    versionId: "version-announcement-1",
    authorityEvidenceRef: "provenance-announcement",
    publishedAt: "2026-11-19T16:00:00Z",
    replacesFactId: syllabus.factId,
  });

  expect(resolveDeadline(syllabus, announcement)).toMatchObject({
    status: "established_update",
    applicable: {
      due: "2026-11-22",
      documentId: "doc-announcement",
      versionId: "version-announcement-1",
    },
    evidence: [syllabus, announcement],
  });
  const studentReply: DeadlineClaim = {
    ...announcement,
    factId: "fact-student-reply",
    due: "2026-11-24",
    documentId: "doc-student-reply",
    versionId: "version-student-reply-1",
    publisherRole: "student",
    authorityEvidenceRef: undefined,
  };
  expect(resolveDeadline(syllabus, studentReply)).toMatchObject({
    status: "unresolved",
    evidence: [syllabus, studentReply],
  });
  expect(syllabus.due).toBe("2026-11-20");
});
```

This example calls the illustrated function, checks the applicable date and exact document/version, retains both sources and rejects a student-authored override. It does not verify publisher identity, arbitrary update chains, real LMS capture, general claim extraction or the application pipeline. These Markdown examples are not application source and do not start Construction. Any isolated syntax/example check must be reported separately from future application acceptance.

**Disposition of Safi's example:** His [function and two tests](https://github.com/lawrencegranda/INFO-5940-project/pull/7#discussion_r4669553328) improve on the old stub and were independently re-run as isolated examples: both pass. Additional synthetic probes show that his function selects a student note when it supplies a matching `supersedes` reference, and can choose November 22 instead of a later November 25 update depending on array order. Therefore it is not copied as a complete authority/precedence algorithm. The limited pair example above retains explicit same-course and prevalidated-authority conditions; later design/acceptance must cover student-supplied replacement claims, unknown publishers, course isolation and update chains. No prototype code is changed by this review.

## AI-DLC extension choices

Mandatory course rubric rules are enabled. Security and resiliency *optional* extensions are disabled; essential privacy/security still apply. Property-based testing is partially enabled. These choices match `aidlc-docs/inception/requirements/decision-register.md` and `aidlc-docs/aidlc-state.md`.

## Milestones

Inception through Units Generation due **November 24, 2026, 11:59 PM EST**; do not enter Construction for this milestone. Final implementation/demo due **December 16, 2026**.
