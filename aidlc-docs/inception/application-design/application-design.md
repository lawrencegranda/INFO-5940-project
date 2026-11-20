# Course Copilot — Consolidated Application Design

**Status:** Approved on 2026-11-20T03:43:36Z. These documents describe proposed interfaces and behavior, not implemented or verified capabilities.

**Baseline:** Approved requirements at `485c52531f004b1e184fb595abe771cfbcd17003`; P-01/25 stories approved; execution plan explicitly approved on 2026-11-20T03:18:17Z. **Review:** [Draft PR #7](https://github.com/lawrencegranda/INFO-5940-project/pull/7), branch `inception/04-application-design`. Integrate approved #5, then #6, then this dependent stage into `candidate/course-copilot` under the same single writer, xiaolonglin1124-bit.

## 1. Design outcome and document set

One student saves accessible materials from several courses into a private local library. Original evidence, immutable saved versions and editable organization are distinct. The extension/local UI writes through a controlled local API; Codex uses a separate read-only stdio MCP process for compact search followed by exact saved evidence fetch. There is no built-in chatbot or required cloud service.

| Artifact | Contents |
|---|---|
| [Design plan](../plans/application-design-plan.md) | Five question-category assessments, authorized engineering direction and generation/review checklist. |
| [Components](components.md) | C-01–C-12 responsibilities, boundaries, interfaces and scope. |
| [Component methods](component-methods.md) | Contract types, method signatures, scoped results/errors and read/write capabilities. Type declarations describe interfaces; they are not application implementation. |
| [Services](services.md) | S-01–S-04 orchestration, original-first persistence, processing, review and progressive query/failure flows. |
| [Component dependencies](component-dependency.md) | Full direct dependency matrix, communication, data flows and trust boundaries. |
| This consolidation | Architectural decisions, complete story/requirement mappings, feasibility limits and generated-artifact approval. |

## 2. Architectural decisions and rationale

These are concrete engineering choices under the approved execution plan and delegated Q36 technology choice. They remain reviewable proposals; no separate approval of unseen interfaces is asserted.

| Decision | Selected design and implication |
|---|---|
| Local organization | Modular Node/TypeScript library runtime with logical services, Chrome MV3 capture, local browser UI and a separate stdio MCP adapter. No independently hosted microservices. Final units/code organization are established later. |
| Component composition | C-01 capture, C-02 UI, C-03 local API, C-04 ingestion, C-05 store, C-06 extraction, C-07 local AI, C-08 hosted Jev, C-09 organization/summaries, C-10 claims/relations, C-11 index/retrieval, C-12 MCP. |
| Logical orchestration | S-01 Capture/Ingest; S-02 Processing/Index; S-03 Metadata/Review; S-04 Evidence Query. Background derived processing is coordinated, rather than independently writing from the UI. |
| Persistence | SQLite/FTS5 + local originals with separate read, processing and write ports. Source identity is independent of course memberships and editable filing metadata. Atomic staging/recovery details remain later design. |
| Versions and observations | Deterministic stable source ID/content hash defines observed original versions. A CaptureReceipt records unchanged recapture without changing the version's original capturedAt. Re-extraction is a derived revision, not a new original version. |
| Evidence identity | Course-scoped EvidenceRef pins source/document/version; exact derived-text fetch additionally requires extractionRevisionId, and passage fetch requires passageId; citations expose URL/import identity, capture/published/effective dates, location and status. Earlier references never silently resolve to newer versions or extraction passages. |
| Pending originals | Before confirmed filing, IngestionItemRef identifies an authorized pending run item. Processing/UI read it through a private run-bound port; it is not a synthetic course or MCP-visible document. Course index publication waits for accepted membership; lexical indexing then precedes optional AI enrichment. |
| Extraction | Native text first when present; local OCR for scans/images, reliable math/diagram text with originals retained, local transcription for accessible authorized audio/video. Individual capture/extraction outcomes remain visible. |
| AI boundaries | Local Ollama gemma3:4b is the first generative candidate, not an asserted working model. Local embedding/OCR/STT choices await later stack decisions and measurement. Jev is a separate minimal classification/routing/rerank gateway under matching explicit permission, with no automatic hosted fallback. |
| Claims/precedence | Claims have subject/scope and supporting passages. Evidence-based authority/effect/supersession rules apply to particular claims; model confidence or capture time alone cannot select truth. Preserve unresolved competing evidence and unrelated source facts. |
| Retrieval | Required lexical + semantic retrieval with consistent course/topic/source/date/version filters; bounded previews followed by exact fetched evidence. Semantic outage is disclosed and local lexical/metadata fallback remains. No historical as-of feature added. |
| MCP isolation | Local stdio composition receives query/read-only persistence ports, never mutation APIs/jobs/index writers/migrations. Read operations cannot repair or persist enrichment. Actual isolation remains a future test obligation, not an OS sandbox claim. |
| Local API control | Loopback binding plus locally generated pairing/client/request controls; validate input, membership and paths. An arbitrary webpage or source instruction is not an authorized library client. No LMS cookies/tokens/session headers forwarded. Exact setup belongs to later infrastructure/NFR design. |
| External host | Codex receives fetched evidence and can pass it to its configured model. Local MCP/storage does not guarantee host-side local inference; this boundary is disclosed separately from Jev grants. |

All three named LMS sources, ordinary web/papers/PDFs/local imports and all approved extraction formats remain required. Inaccessible/protected embeds have an honest failure/manual recovery path; such a case does not replace a successful accessible-format demonstration.

## 3. Contract and consistency summary

The component-methods document is the detailed signature/type reference. Every query except list_courses takes explicit courseId, and fetch/history/conflict access checks actual document membership. Source/version identifiers alone do not authorize crossing that scope. Original bytes/version records remain immutable while metadata revisions, extraction revisions, summary provenance and indexes are distinct.

Run progress (queued/running/succeeded/completed_with_issues/failed/cancelled) is separate from item capture/extraction outcomes (complete/partial/failed/unsupported). Pending work has no fabricated complete outcome. Failed AI or indexing cannot erase saved evidence or prevent manual filing/native keyword search. Returning a processing acknowledgement is not a successful extraction claim.

Expected MCP tools are list_courses, search_course, fetch_document, fetch_passages, get_document_history and get_conflicts, with exact schemas in component-methods.md. Search returns compact scoped candidates and stable citations; exact fetch returns saved passages/full content where supported, with explicit pagination/truncation/status. No tool grants Jev permission, changes filing or rewrites sources. Source-embedded text remains untrusted data.

## 4. Story-to-design coverage

| Story | Primary components | Logical services and design focus |
|---|---|---|
| US-01 | C-01/C-03/C-04/C-05 | S-01 explicit LMS/ordinary-page save and source preservation. |
| US-02 | C-01/C-02/C-03/C-04/C-05/C-06 | S-01/S-02 external paper/PDF/local import. |
| US-03 | C-01/C-03/C-04/C-06 | S-01/S-02 embedded discovery, individual selection and recovery. |
| US-04 | C-06/C-11/C-05 | S-02/S-04 native searchable extraction. |
| US-05 | C-06/C-11/C-05 | S-02/S-04 scans/image OCR with originals/status. |
| US-06 | C-01/C-06/C-11/C-05 | S-01/S-02/S-04 accessible audio/video and segment evidence. |
| US-07 | C-06/C-05/C-02/C-11 | S-02/S-04 preserved equations/diagrams and reliable derivation. |
| US-08 | C-02/C-03/C-05/C-11 | S-01/S-03/S-04 separate course filing and scoped access. |
| US-09 | C-02/C-07/C-08/C-09 | S-02/S-03 uncertain classification review. |
| US-10 | C-02/C-03/C-05/C-04 | S-03 correction and affected S-02 recomputation. |
| US-11 | C-07/C-09/C-11/C-05 | S-02 incremental source-linked course/topic/document summaries. |
| US-12 | C-02/C-05/C-11/C-12 | S-04 exact original/capture/version details. |
| US-13 | C-01/C-04/C-05 | S-01 immutable changed versions and unchanged capture observations. |
| US-14 | C-05/C-10/C-02 | S-02/S-03 typed evidence-linked relations, no similarity merge. |
| US-15 | C-05/C-10/C-11/C-12 | S-04 inspectable history and applicable saved-evidence default. |
| US-16 | C-06/C-07/C-10/C-05 | S-02 substantive structured sourced claims. |
| US-17 | C-10/C-11/C-05/C-02 | S-02/S-04 claim-scoped authoritative update. |
| US-18 | C-10/C-11/C-05/C-12 | S-02/S-04 unresolved competing evidence. |
| US-19 | C-11/C-07/C-08/C-05 | S-04 required hybrid/filter retrieval with lexical fallback. |
| US-20 | C-11/C-12/C-10 | S-04 compact progressive previews/conflict flags. |
| US-21 | C-11/C-05/C-12 | S-04 exact version/passage fetch with membership check. |
| US-22 | C-12/C-11/C-05 | S-04 actual local read-only Codex integration obligation. |
| US-23 | C-02/C-03/C-04/C-06/C-05 | S-01/S-02/S-03 honest processing, retry/manual recovery. |
| US-24 | C-01/C-03/C-07/C-08/C-12 | All services' permission/untrusted-input boundaries. |
| US-25 | C-02/C-05/C-09/C-11 | Manual filing, local saved-content/lexical access and measured AI feasibility. |

## 5. Requirement-to-design coverage

| Requirement | Design responsibility |
|---|---|
| FR-01 | C-02/C-03/C-05/C-11, membership-aware organization and all scoped query methods. |
| FR-02 | C-01–C-06, all named LMS and ordinary web/paper/PDF/local capture/import. |
| FR-03 | C-01/C-04/C-06, selected embedded-resource discovery/access/status/recovery. |
| FR-04 | C-05 evidence/version/capture records and C-11 exact citation outputs. |
| FR-05 | C-06 native/OCR/visual/media adapters; C-05 originals and C-11 passages/status. |
| FR-06 | C-09/C-07/C-08 suggestions plus C-02/C-03 review/correction. |
| FR-07 | C-04/C-09/C-11 affected-only summary/index updates with evidence references. |
| FR-08 | C-10/C-05 typed relations among saved evidence and claims. |
| FR-09 | C-05 immutable original identity/version and separate metadata/derived revisions. |
| FR-10 | C-10 sourced substantive claims, applicability/authority/explicit supersession; C-11 query view. |
| FR-11 | C-10 competing evidence; C-02/C-11/C-12 conflict display without age-only alarms. |
| FR-12 | C-11 hybrid search/all filters, C-07 local query embedding and optional permitted C-08; local fallback. |
| FR-13 | C-11/C-12 compact search then exact fetch, with bounded/explicit full-content responses. |
| FR-14 | C-12 stdio read-only Codex composition; no write tools. |
| FR-15 | C-05/C-10/C-11 history and latest applicable saved evidence, no unseen-update claim. |
| NFR-01 | Local runtime/UI/extension/MCP, SQLite/files; no mandatory hosting/paid AI. |
| NFR-02 | C-01/C-03 local capture/control, C-07/C-08 data boundaries and C-12 read-only/external-host boundary. |
| NFR-03 | C-05 evidence identity and all C-09/C-10/C-11/C-12 outputs pin supporting versions. |
| NFR-04 | C-04/C-06 stage/run/item statuses and all viewer/query result limitations. |
| NFR-05 | C-08 denied/unavailable path does not block C-02 manual filing or C-11 lexical retrieval. |
| NFR-06 | All components retain future fixture/manual integration obligations; selected pure/round-trip/version properties. |
| NFR-07 | Incremental C-04/C-09/C-11 processing, local C-07 measurement; no paid-call dependency. |

## 6. Verification limits and future evidence

No implementation, model call, LMS capture, OCR/transcription/embedding benchmark or Codex runtime test has run in this stage. Coverage tables assign design responsibility; they do not claim acceptance criteria have passed. Carry the approved [execution-plan evidence matrix](../plans/execution-plan.md#7-acceptance-and-evidence-plan) and story evidence register forward into Units and tests.

Required later checks include all three actual authorized LMS saves; ordinary web/PDF/local and selected accessible embeds; successful native/scan/image/math/audio/video examples plus failures; same/changed source identity; exact-version/extraction reference round trips; two-course shared-source separation; claim-specific November 20 → November 22 supersession with later old-source recapture; unresolved competing evidence; every hybrid filter; actual Codex search/fetch/read-only state comparison; denied/revoked Jev and AI/network-disabled fallback. Measure generative/embedding/extraction resource use and quality on a team laptop.

High-risk open implementation choices are concrete OCR/STT/embedding tools, model feasibility, exact adapter/page behavior, confidence/claim-matching calibration, SQLite migration/staging/recovery details and capability-isolation verification. These are future engineering/measurement work, not unresolved product direction or permission to reduce scope. If evidence shows the approved breadth is infeasible, request an explicit scope decision.

## 7. Extension compliance and next gate

| Rule | Current result |
|---|---|
| INFO5940-01 | Resumed approved AI-DLC stage; concrete plan evaluates all five categories; generation, decisions and review logged in audit/state. No unseen plan approval is invented. |
| INFO5940-02 | Application Design documentation only; Units follows after approval, then STOP before Construction for the course milestone. |
| INFO5940-03 | All inherited product/gate answers complete; zero new unresolved product questions. The separate generated-design answer below is explicitly recorded before Units planning. |
| INFO5940-04 | Local model candidate, local library and concrete progressive read-only Codex MCP; optional minimal-permission Jev. |
| INFO5940-05 | Documentation/contracts only, no application implementation, keys or credentials. |
| INFO5940-06 | Same driver; prior stages approved/ready, one active Draft stage PR with explicit #5→#6→#7 dependency. Check all feedback before approval; no manual audit/state merge. |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | Partial properties retained for pure transformations, round trips and immutable version invariants; framework implementation deferred. |

Security and Resiliency Baseline extensions remain disabled; approved core safety/error requirements remain applicable. Units are not generated or assigned by this component map. Whole-team candidate selection is not implied.

## 8. Generated-design approval

### Q1 — Review all five Application Design artifacts

A) **Approve the generated Application Design and continue to Units Generation.** Accept the component/contracts/service/dependency direction and retain the full approved scope and later milestone stop. Unit planning/generation approvals and Construction authorization remain separate.

B) **Request changes before approval.** Identify the component, contract, flow, coverage or trust boundary to revise.

C) **Other.** Describe the requested outcome after the answer tag.

[Answer]: A

**Historical approval response (English translation):** A: Approve the application design and proceed to Units Generation. The original raw response is preserved in the [audit](../../audit.md#application-design--explicit-generated-design-approval). This translation records the historical choice; it is not a new approval. The [current review hold](../../aidlc-state.md#current-checkpoint-and-handoff) remains in force.

Approval recorded on 2026-11-20T03:43:36Z. Application Design is complete. Units Generation begins with its separate decomposition plan and explicit plan-approval gate; Construction remains stopped at the milestone.
