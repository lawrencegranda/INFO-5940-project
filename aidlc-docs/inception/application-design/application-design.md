# Course Copilot — Consolidated Application Design

**Current review (2026-11-23):** Step 2 corrective draft with local Ask and local MCP in the MVP and retained Jev/media capabilities scheduled for later work. The 2026-11-20 approval applies to the historical baseline only; approval of these revisions is pending. No Construction or runtime acceptance is claimed.

**Delivery phases:** The current MVP includes native HTML/text/PDF capture and import, local organization and retrieval, source/version/authority handling, grounded Ask and read-only local MCP. Jev, scan/image OCR, advanced equation/diagram recognition, and audio/video extraction/transcription remain planned **post-MVP** features. Original preservation/viewing and honest extraction status remain in the MVP. C-08 and all hosted-permission/provider paths are retained design contracts but are not composed into the MVP. See the [MVP and later-work scope](../requirements/mvp-scope.md).

**Baseline and current review:** The original requirements at `485c52531f004b1e184fb595abe771cfbcd17003`, 25 stories and Nov 20 design approval are historical inputs. The current corrective draft covers 26 stories, 16 functional requirements and seven non-functional requirements, including FR-16/US-26 local Ask. Revisions are assembled on existing `inception/05-units-generation` / [PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8) by the same single writer, xiaolonglin1124-bit. Stage PRs #5–#8 remain subject to team review and the documented merge sequence.

## 1. Design outcome and document set

One student saves accessible materials from several courses into a private local library. Original evidence, immutable saved versions and editable organization are distinct. The extension/local UI writes through a controlled local API; Codex uses a separate read-only stdio MCP process for compact search followed by exact saved evidence fetch. The built-in Ask path answers focused course questions with local generation and exact saved evidence; a required cloud service or remote ChatGPT MCP integration is not introduced.

| Artifact | Contents |
|---|---|
| [Design plan](../plans/application-design-plan.md) | Five question-category assessments, authorized engineering direction and generation/review checklist. |
| [Components](components.md) | C-01–C-13 responsibilities, boundaries, interfaces and scope. |
| [Component methods](component-methods.md) | Contract types, method signatures, scoped results/errors and read/write capabilities. Type declarations describe interfaces; they are not application implementation. |
| [Services](services.md) | S-01–S-05 orchestration, original-first persistence, processing, review and progressive query/failure flows. |
| [Component dependencies](component-dependency.md) | Full direct dependency matrix, communication, data flows and trust boundaries. |
| This consolidation | Architectural decisions, complete story/requirement mappings, feasibility limits and generated-artifact approval. |

## 2. Architectural decisions and rationale

These are concrete engineering choices under the approved execution plan and delegated Q36 technology choice. They remain reviewable proposals; no separate approval of unseen interfaces is asserted.

| Decision | Selected design and implication |
|---|---|
| Local organization | Modular Node/TypeScript library runtime with logical services, Chrome MV3 capture, local browser UI and a separate stdio MCP adapter. No independently hosted microservices. Final units/code organization are established later. |
| Component composition | C-01 capture, C-02 UI, C-03 local API, C-04 ingestion, C-05 store, C-06 extraction, C-07 local AI, C-08 hosted Jev (retained post-MVP), C-09 organization/summaries, C-10 claims/relations, C-11 index/retrieval, C-12 MCP, C-13 course Ask. |
| Logical orchestration | S-01 Capture/Ingest; S-02 Processing/Index; S-03 Metadata/Review; S-04 Evidence Query; S-05 Local Course Ask. Background derived processing is coordinated, rather than independently writing from the UI. |
| Persistence | SQLite/FTS5 + local originals with separate read, processing and write ports. Source identity is independent of course memberships and editable filing metadata. Atomic staging/recovery details remain later design. |
| Versions and observations | Deterministic stable source ID/content hash defines observed original versions. A CaptureReceipt records unchanged recapture without changing the version's original capturedAt. Re-extraction is a derived revision, not a new original version. |
| Evidence identity | Course-scoped EvidenceRef pins source/document/version; exact derived-text fetch additionally requires extractionRevisionId, and passage fetch requires passageId; citations expose URL/import identity, capture/published/effective dates, location and status. Earlier references never silently resolve to newer versions or extraction passages. |
| Pending originals | Before confirmed filing, IngestionItemRef identifies an authorized pending run item. Processing/UI read it through a private run-bound port; it is not a synthetic course or MCP-visible document. Course index publication waits for accepted membership; lexical indexing then precedes optional AI enrichment. |
| Extraction | MVP native HTML/text/PDF extraction and original viewing with honest per-item status. Scan/image OCR, advanced mathematical/diagram recognition and authorized audio/video acquisition/transcription remain planned post-MVP capabilities. |
| AI boundaries | Local Ollama gemma3:4b is the first generative candidate, not an asserted working model. Local embedding choices await later MVP design and measurement. OCR/STT/advanced recognition and the permission-checked hosted Jev gateway remain post-MVP. The MVP never instantiates C-08 or uses an automatic hosted fallback. |
| Claims/precedence | Publisher role requires inspectable saved provenance; student notes/replies and unverified publishers cannot supersede instructor claims by platform, recency or confidence. Claims have subject/scope and supporting passages. Evidence-based authority/effect/supersession rules apply to particular claims; model confidence or capture time alone cannot select truth. Preserve unresolved competing evidence and unrelated source facts. |
| Retrieval | Required lexical + semantic retrieval with consistent course/topic/source/date/version filters; bounded previews followed by exact fetched evidence. Semantic outage is disclosed and local lexical/metadata fallback remains. No historical as-of feature added. |
| MCP isolation | Local stdio composition receives query/read-only persistence ports, never mutation APIs/jobs/index writers/migrations. Read operations cannot repair or persist enrichment. Actual isolation remains a future test obligation, not an OS sandbox claim. |
| Local API control | Loopback binding plus locally generated pairing/client/request controls; validate input, membership and paths. An arbitrary webpage or source instruction is not an authorized library client. No LMS cookies/tokens/session headers forwarded. Exact setup belongs to later infrastructure/NFR design. |
| Local Ask | C-02/C-03 → C-13 uses local-only C-11/C-05 reads and C-07 generation. Validate every answer segment against fetched exact passages; expose insufficient evidence, conflicting claims and retrieval-only mode if the model is unavailable. No saved-library write or hosted fallback. Course-keyed UI state survives tab navigation and rejects late cross-course/request responses. |
| External host | Codex receives fetched evidence and can pass it to its configured model. Local MCP/storage does not guarantee host-side local inference; this boundary is disclosed separately from Jev grants. |

All three named LMS sources, ordinary web/native PDFs/local imports remain MVP source paths. OCR, advanced visual recognition and audio/video processing remain in the planned product with post-MVP delivery. Original preservation/viewing and explicit deferred/unsupported extraction status stay in the MVP; those statuses do not establish future adapter acceptance.

## 3. Contract and consistency summary

The component-methods document is the detailed signature/type reference. Every query except list_courses takes explicit courseId, and fetch/history/conflict access checks actual document membership. Source/version identifiers alone do not authorize crossing that scope. Original bytes/version records remain immutable while metadata revisions, extraction revisions, summary provenance and indexes are distinct.

Run progress (queued/running/succeeded/completed_with_issues/failed/cancelled) is separate from item capture/extraction outcomes (complete/partial/failed/unsupported). Pending work has no fabricated complete outcome. Failed AI or indexing cannot erase saved evidence or prevent manual filing/native keyword search. Returning a processing acknowledgement is not a successful extraction claim.

Expected MCP tools are list_courses, search_course, fetch_document, fetch_passages, get_document_history and get_conflicts, with exact schemas in component-methods.md. Search returns compact scoped candidates and stable citations; exact fetch returns saved passages/full content where supported, with explicit pagination/truncation/status. No tool grants Jev permission, changes filing or rewrites sources. Source-embedded text remains untrusted data. Ask does not add an MCP tool: C-13 composes local-only read/generation ports behind the controlled UI API. AskRequest/AskResult bind course/request identity, and answer citations must belong to the fetched exact evidence set. A valid reference is not itself proof of semantic support; later answer-quality tests remain necessary.

## 4. Story-to-design coverage

| Story | Primary components | Logical services and design focus | Delivery phase |
|---|---|---|---|
| US-01 | C-01/C-03/C-04/C-05 | S-01 explicit LMS/ordinary-page save and source preservation. | MVP. |
| US-02 | C-01/C-02/C-03/C-04/C-05/C-06 | S-01/S-02 external paper/PDF/local import. | MVP. |
| US-03 | C-01/C-03/C-04/C-06 | S-01/S-02 embedded discovery, individual selection and recovery. | MVP. |
| US-04 | C-06/C-11/C-05 | S-02/S-04 native searchable extraction. | MVP. |
| US-05 | C-06/C-11/C-05 | S-02/S-04 scans/image OCR with originals/status. | Post-MVP OCR. |
| US-06 | C-01/C-06/C-11/C-05 | S-01/S-02/S-04 accessible audio/video and segment evidence. | Post-MVP media acquisition/transcription. |
| US-07 | C-06/C-05/C-02/C-11 | S-02/S-04 preserved equations/diagrams and reliable derivation. | MVP original preservation/viewing; advanced recognition post-MVP. |
| US-08 | C-02/C-03/C-05/C-11 | S-01/S-03/S-04 separate course filing and scoped access. | MVP. |
| US-09 | C-02/C-07/C-08/C-09 | S-02/S-03 uncertain classification review. | MVP local/manual filing; Jev post-MVP. |
| US-10 | C-02/C-03/C-05/C-04 | S-03 correction and affected S-02 recomputation. | MVP. |
| US-11 | C-07/C-09/C-11/C-05 | S-02 incremental source-linked course/topic/document summaries. | MVP. |
| US-12 | C-02/C-05/C-11/C-12 | S-04 exact original/capture/version details. | MVP. |
| US-13 | C-01/C-04/C-05 | S-01 immutable changed versions and unchanged capture observations. | MVP. |
| US-14 | C-05/C-10/C-02 | S-02/S-03 typed evidence-linked relations, no similarity merge. | MVP. |
| US-15 | C-05/C-10/C-11/C-12 | S-04 inspectable history and applicable saved-evidence default. | MVP. |
| US-16 | C-06/C-07/C-10/C-05 | S-02 substantive structured sourced claims. | MVP. |
| US-17 | C-10/C-11/C-05/C-02 | S-02/S-04 claim-scoped authoritative update. | MVP. |
| US-18 | C-10/C-11/C-05/C-12 | S-02/S-04 unresolved competing evidence. | MVP. |
| US-19 | C-11/C-07/C-08/C-05 | S-04 required hybrid/filter retrieval with lexical fallback. | MVP local hybrid retrieval; Jev post-MVP. |
| US-20 | C-11/C-12/C-10 | S-04 compact progressive previews/conflict flags. | MVP. |
| US-21 | C-11/C-05/C-12 | S-04 exact version/passage fetch with membership check. | MVP. |
| US-22 | C-12/C-11/C-05 | S-04 actual local read-only Codex integration obligation. | MVP. |
| US-23 | C-02/C-03/C-04/C-06/C-05 | S-01/S-02/S-03 honest processing, retry/manual recovery. | MVP. |
| US-24 | C-01/C-03/C-07/C-08/C-12 | All services' permission/untrusted-input boundaries. | MVP untrusted-data boundaries; hosted permissions post-MVP. |
| US-25 | C-02/C-05/C-09/C-11 | Manual filing, local saved-content/lexical access and measured AI feasibility. | MVP. |
| US-26 | C-02/C-03/C-05/C-07/C-11/C-13 | S-05 local Ask with exact citations, visible insufficiency/conflicts, local-model fallback and per-course navigation/request isolation. | MVP. |


## 5. Requirement-to-design coverage

| Requirement | Design responsibility |
|---|---|
| FR-01 | C-02/C-03/C-05/C-11, membership-aware organization and all scoped query methods. |
| FR-02 | C-01–C-06, all named LMS and ordinary web/paper/PDF/local capture/import. |
| FR-03 | C-01/C-04/C-06, selected embedded-resource discovery/access/status/recovery. |
| FR-04 | C-05 evidence/version/capture records and C-11 exact citation outputs. |
| FR-05 | MVP C-06 native HTML/text/PDF extraction, C-05 original preservation/viewing and C-11 passages/status; OCR/advanced recognition/media adapters retained post-MVP. |
| FR-06 | MVP C-09/C-07 local suggestions and C-02/C-03 manual review/correction; C-08 suggestions retained post-MVP. |
| FR-07 | C-04/C-09/C-11 affected-only summary/index updates with evidence references. |
| FR-08 | C-10/C-05 typed relations among saved evidence and claims. |
| FR-09 | C-05 immutable original identity/version and separate metadata/derived revisions. |
| FR-10 | C-10 sourced substantive claims, applicability/authority/explicit supersession; C-11 query view. |
| FR-11 | C-10 competing evidence; C-02/C-11/C-12 conflict display without age-only alarms. |
| FR-12 | MVP C-11 hybrid search/all filters, C-07 local query embedding and local fallback; permitted C-08 routing/reranking retained post-MVP. |
| FR-13 | C-11/C-12 compact search then exact fetch, with bounded/explicit full-content responses. |
| FR-14 | C-12 stdio read-only Codex composition; no write tools. |
| FR-15 | C-05/C-10/C-11 history and latest applicable saved evidence, no unseen-update claim. |
| FR-16 | C-02/C-03/C-13 local course Ask over C-11/C-05 reads and C-07 local generation, with validated citations, honest fallback and course-keyed UI session continuity. |
| NFR-01 | Local runtime/UI/extension/MCP, SQLite/files; no mandatory hosting/paid AI. |
| NFR-02 | MVP C-01/C-03 local capture/control, C-07 local generation and C-12 read-only/external-host boundary. C-08 consent/data protections are retained post-MVP. |
| NFR-03 | C-05 evidence identity and all C-09/C-10/C-11/C-12/C-13 outputs pin supporting versions. |
| NFR-04 | C-04/C-06 stage/run/item statuses and all viewer/query result limitations. |
| NFR-05 | MVP local/manual filing and lexical access work without C-08; denied/unavailable hosted-call behavior is tested when Jev is introduced post-MVP. |
| NFR-06 | All components retain future fixture/manual integration obligations; selected pure/round-trip/version properties. |
| NFR-07 | Incremental C-04/C-09/C-11 processing, local C-07 measurement; no paid-call dependency. |

## 6. Verification limits and future evidence

No implementation, model call, LMS capture, OCR/transcription/embedding benchmark or Codex runtime test has run in this stage. Coverage tables assign design responsibility; they do not claim acceptance criteria have passed. Carry the approved [execution-plan evidence matrix](../plans/execution-plan.md#7-acceptance-and-evidence-plan) and story evidence register forward into Units and tests.

Required MVP Construction checks include all three actual authorized LMS saves; ordinary web/native PDF/local and selected embedded native documents; successful native extraction/original viewing plus honest unsupported cases; same/changed source identity; exact-version/extraction reference round trips; two-course shared-source separation; claim-specific November 20 → November 22 supersession with later old-source recapture; unresolved competing evidence; every hybrid filter; actual Codex search/fetch/read-only state comparison and AI/network-disabled local fallback. Also verify local Ask answer support, exact-citation rejection, empty/conflicting evidence, model outage, no query-time evidence writes and tab/course/in-flight isolation. Measure local generative/embedding/native-extraction resource use and quality on a team laptop. Post-MVP acceptance additionally requires successful scan/image OCR, advanced recognition, accessible media acquisition/transcription and denied/allowed/revoked Jev payload tests.

Open MVP engineering choices include local embeddings/model feasibility, native adapter/page behavior, confidence/claim matching, SQLite migration/staging/recovery and capability isolation. Jev/OCR/STT/advanced-recognition tools remain later-iteration choices for retained post-MVP features. Deferral changes delivery phase, not the feature catalogue; further scope changes require explicit review.

## 7. Extension compliance and next gate

| Rule | Current result |
|---|---|
| INFO5940-01 | Resumed approved AI-DLC stage; concrete plan evaluates all five categories; generation, decisions and review logged in audit/state. No unseen plan approval is invented. |
| INFO5940-02 | Application Design documentation only; Units follows after approval, then STOP before Construction for the course milestone. |
| INFO5940-03 | Historical answers are retained as history. The reported Ask + local MCP decision authorizes this corrective draft; revised artifact/team approval remains pending and is not filled with a historical A answer. Local model selection remains future MVP validation; Jev/media delivery is explicitly post-MVP and retained in the roadmap. |
| INFO5940-04 | Local Ask, local model candidate, local library and concrete progressive read-only Codex MCP; minimal-permission Jev remains a separate retained post-MVP path, not a current runtime dependency. |
| INFO5940-05 | Documentation/contracts only, no application implementation, keys or credentials. |
| INFO5940-06 | Same driver, existing PR #8 branch, and #5→#6→#7→#8 dependency. Conversation and inline feedback are incorporated for review; Ready/merge status awaits actual revised-artifact approval. |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | Partial properties retained for pure transformations, round trips and immutable version invariants; framework implementation deferred. |

Security and Resiliency Baseline extensions remain disabled; approved core safety/error requirements remain applicable. Units are not generated or assigned by this component map. No new owner acceptance or full-team meeting is implied by this draft.

## 8. Generated-design approval

### Historical Q1 — Review all five Application Design artifacts

A) **Approve the generated Application Design and continue to Units Generation.** Accept the component/contracts/service/dependency direction and retain the full approved scope and later milestone stop. Unit planning/generation approvals and Construction authorization remain separate.

B) **Request changes before approval.** Identify the component, contract, flow, coverage or trust boundary to revise.

C) **Other.** Describe the requested outcome after the answer tag.

[Answer]: A

**Historical approval response (English translation):** A: Approve the application design and proceed to Units Generation. The original raw response is preserved in the [audit](../../audit.md#application-design--explicit-generated-design-approval). This translation records the historical choice; it is not a new approval. The [current review hold](../../aidlc-state.md#current-checkpoint-and-handoff) remains in force.

Historical approval recorded on 2026-11-20T03:43:36Z completed the original design stage. It does not approve the Nov 23 corrective draft. The current review package must receive actual revised-artifact approval before current correction completion/Ready status; Construction remains stopped at the milestone.

## 9. Corrective-design review scope

Review the local Ask path, exact-citation/authority rules, failure modes, course/request continuity and explicit MVP/post-MVP allocations alongside requirements, stories and the unit map. The team may request changes or approve the concrete revisions after review; no team answer is preselected here. This draft records neither a meeting attendance list nor a vote that was not supplied. The current approval gate is tracked in the [Step 2 review package](../reviews/step2-review-package.md).
