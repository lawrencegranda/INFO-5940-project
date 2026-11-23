# Course Copilot — Components

**Stage:** Inception / Application Design

**Current review (2026-11-23):** Step 2 corrective draft with local Ask and local MCP in the MVP and retained Jev/media capabilities scheduled for later work. The 2026-11-20 approval applies to the historical baseline only; approval of these revisions is pending. No Construction or runtime acceptance is claimed.

**Delivery phases:** The current MVP includes native HTML/text/PDF capture and import, local organization and retrieval, source/version/authority handling, grounded Ask and read-only local MCP. Jev, scan/image OCR, advanced equation/diagram recognition, and audio/video extraction/transcription remain planned **post-MVP** features. Original preservation/viewing and honest extraction status remain in the MVP. C-08 and all hosted-permission/provider paths are retained design contracts but are not composed into the MVP. See the [MVP and later-work scope](../requirements/mvp-scope.md).

**Scope:** Thirteen logical components in a local-first, single-user application. Final implementation packages and Units of Work are determined later; the component map does not introduce hosted microservices.

**Inputs:** [Application-design plan](../plans/application-design-plan.md), [requirements](../requirements/requirements.md), [stories](../user-stories/stories.md) and [persona](../user-stories/personas.md).

## 1. Runtime and trust boundaries

The Chrome extension and library UI are clients of a controlled loopback library API. A local library runtime owns ingestion, evidence storage, extraction, organization, claims and index updates. SQLite and local original files remain the authoritative store.

The local stdio MCP adapter is a separate process with only read-only persistence and query bindings. Opening that adapter must not initialize a writable store, migrate a schema, create processing jobs, rebuild indexes or regenerate summaries. A missing or incompatible library produces an explicit diagnostic and requires the authorized library runtime to prepare it.

Local Ollama is the MVP generation/embedding boundary; compatibility and performance remain unverified. The retained post-MVP Jev gateway is a separate hosted destination for permitted, minimized classification/routing/reranking and is not instantiated in the MVP. A local library/MCP server does not establish that Codex's configured model is local: the selected external assistant may process retrieved content using its configured provider. Client setup must disclose that boundary before use; a Jev permission is not a blanket permission for other destinations.

## 2. Shared identity and evidence concepts

| Concept | Meaning and ownership rule |
|---|---|
| CourseId | A stable local course identity. Every evidence query except listing courses requires an explicit course scope. |
| SourceId | A stable identity for an origin, independent of its current course membership. Normalized source identity is deterministic; similarity or a matching title does not create shared identity. |
| DocumentId | A logical saved item associated with a source. A document is attached to courses by separate membership records; course IDs are not embedded in source identity. |
| VersionId | An immutable observed original/snapshot version of a document. Its identity, original bytes/hash and capture provenance are not rewritten by metadata edits or reprocessing. |
| ExtractionRevisionId | An immutable derived extraction output for an exact saved version. Re-extraction creates another revision; it does not retarget existing passage IDs. |
| PassageId | A stable passage/segment in a specific extraction revision and saved version. A citation to an old passage remains pinned to that passage rather than silently resolving to newly extracted text. |
| FactId / RelationshipId | Evidence-linked derived facts and typed links. Their course/subject/claim scope and supporting exact references remain inspectable. Proposed model associations are distinct from established relationships. |
| IngestionRunId / IngestionItemRef | A durable processing run and its selected item key. Pre-filing originals may be processed within this authorized run; they are not publicly queryable course evidence before membership exists. |
| EvidenceRef | A course-scoped reference containing courseId, sourceId, documentId, versionId and optional passageId. Exact fetch additionally pins the extraction revision where derived text is requested. |
| SourceCitation | EvidenceRef plus the safe original URL or local-import identity, distinct captured/published/effective dates, available location, extraction status and omissions. A generated summary cannot replace this evidence. |
| Course membership / editable metadata | Current course/folder/topic/tag/title/authority-note associations maintained separately from immutable originals. Membership is checked on every read, including exact fetch, history and conflicts. |
| Capture receipt | A record of a capture attempt or repeat observation. An unchanged recapture may add a receipt without creating a content version or changing the original version's capture provenance. |

A current course membership permits access within that course; knowing a source, document, version, passage, fact or relationship ID is not itself permission to retrieve it. Metadata moves update the relevant membership/projections. Query authorization uses current membership even if an index update is pending.

## 3. State and failure conventions

- **RunState:** queued, running, succeeded, completed_with_issues, failed or cancelled. This describes work progress, not extraction completeness.
- **Resource outcome:** complete, partial, failed or unsupported for each selected resource's capture/extraction result. A result is absent while the relevant operation is pending/running. Parent-page success cannot hide a selected child resource's failure.
- **Step state:** pending, running, succeeded, failed or skipped for extraction, organization, summary, claims and indexing work. A failed optional summary is disclosed separately from successfully preserved originals/native text.
- Every operation returns a typed success/failure result with safe diagnostic codes. Scope failures use a non-disclosing not_found_in_scope result; they must not reveal whether a hidden identifier exists elsewhere.
- Original persistence, derived extraction, AI output and indexing are separate outcomes. A model or index failure does not delete already preserved evidence. Retry targets an authorized failed/incomplete step and retains prior evidence.
- Source text, OCR and transcripts remain untrusted data, including text that resembles agent instructions. They cannot authorize tool calls, consent changes or broader access.

## 4. Component registry

| ID | Component | Main responsibility | Persistence authority |
|---|---|---|---|
| C-01 | Capture Extension | Select and capture user-opened pages/authorized resources. | No direct store access; submits through C-03. |
| C-02 | Local Library UI | Browse, import, review filing, inspect evidence/history/conflicts and use course-scoped Ask. | No direct store access; submits through C-03. |
| C-03 | Local Library API | Validate paired local requests, commands and scoped UI queries. | Authorized command/service entry point only. |
| C-04 | Ingestion Coordinator | Preserve originals and manage durable bounded processing/recovery. | Write/runtime bindings of C-05 and write-side processing components. |
| C-05 | Evidence Store | Persist originals, identities, memberships, derivations, relationships and processing state. | Explicit query-read, processing-read and mutation ports. |
| C-06 | Extraction Pipeline | MVP native text and original preservation; post-MVP OCR, advanced visual recognition and media transcription. | Produces extraction drafts; coordinator persists them. |
| C-07 | Local AI Gateway | Local Ollama generation and a separately verified local embedding abstraction. | No evidence-store writes. |
| C-08 | Hosted Jev Gateway — post-MVP | Retained scoped/minimized classification, routing and reranking contracts after matching permission; not composed into the MVP. | No evidence-store writes or consent grants. |
| C-09 | Organization and Summary | Correctable filing suggestions and source-linked incremental summaries. | Produces suggestions/derived drafts for authorized persistence. |
| C-10 | Claims and Relations | Evidence-linked facts, proposed links and claim-scoped precedence/conflict views. | Enrichment drafts use write services; query views are pure/read-only. |
| C-11 | Index and Retrieval | Incremental FTS5/vector indexing and scoped progressive evidence retrieval. | Separate writer and query bindings; query cannot acquire writer access. |
| C-12 | Read-only MCP Adapter | Expose bounded course search/fetch/history/conflicts to the configured external client. | Read-only store/query bindings only. |
| C-13 | Course Ask Orchestrator | Retrieve course evidence and validate a local model answer with exact citations. | Read-only local query/model capabilities; no library writes. |

## 5. Component responsibilities and interfaces

### C-01 — Capture Extension

**Purpose:** Let the student explicitly save the accessible material they are viewing.

**Responsibilities:** Read the selected Chrome page, retain an allowed snapshot/body and safe source provenance, discover linked/embedded resources, show which resources are selected and submit only authorized content. Canvas, Gradescope, EdStem, ordinary webpages and external papers/PDFs all remain required source paths. Discovery does not authorize fetching every link.

**Interfaces:** User capture intent, discovered-resource descriptors and captured byte/content envelopes enter C-03. Ingestion receipts and per-resource progress/results return for display. Browser-authorized reads remain inside the extension boundary; cookies, passwords, session tokens and credential-bearing headers are never exported to the library. Stable source links must exclude authentication secrets.

**Failure boundary:** Inaccessible/cross-origin/protected resources, rejected local pairing and interrupted capture are visible, independently associated with the relevant item and recoverable through permitted retry/manual upload. Site-specific behavior must be verified on actual user-authorized sources.

**Traceability:** US-01, US-02, US-03, US-06; FR-02, FR-03, FR-04; NFR-02, NFR-04.

### C-02 — Local Library UI

**Purpose:** Give P-01 control of the private library and a course-scoped Ask entry without requiring a CLI for ordinary questions.

**Responsibilities:** Browse courses/folders/topics; select local imports; review uncertain local filing; correct editable metadata/membership; inspect originals, extraction gaps, exact passages, versions, substantive claims, relationships and unresolved conflicts. Hosted-request disclosure/consent controls are retained for the post-MVP Jev path. Distinguish dates, generated summaries and source evidence. Keep Ask question drafts, result, errors and pending-request identity keyed by course while navigating Materials, Ask and Deadlines within the running UI; never apply a response to a different course. This UI session state does not mutate saved library evidence or promise cross-reload history.

**Interfaces:** C-03 command/query operations, including course-scoped Ask, and their typed results. The UI may display the scope of data that would leave the laptop but cannot infer permission from a saved document or model suggestion.

**Failure boundary:** Retain visible original availability and step errors. Do not present queued work as complete or an old capture date as proof of stale external information. Recovery controls invoke authorized commands rather than editing stored files directly.

**Traceability:** US-02, US-08–US-18, US-20–US-26; FR-01, FR-04, FR-06–FR-16; NFR-01–NFR-05.

### C-03 — Local Library API

**Purpose:** Provide the controlled command boundary for the UI and locally paired extension, plus scoped UI queries.

**Responsibilities:** Restrict binding to loopback; validate local client pairing/capability, expected origins, request sizes/schema and requested scope; dispatch MVP capture/import/review commands through the logical services. Hosted-consent commands are post-MVP contracts. Loopback reachability alone is not authorization. Accept only explicitly selected resource bytes/identities, not arbitrary source-provided executable actions.

**Interfaces:** Command operations reach S-01 Capture/Ingest or S-03 Metadata/Review and C-04/C-05 as appropriate. UI evidence queries reach S-04 Evidence Query/C-11 with a mandatory course scope except course listing. Ask dispatches to S-05/C-13 after the same entry and course checks; the request does not convey command capabilities to the Ask orchestrator. Return durable run identifiers and safe status responses.

**Failure boundary:** Reject unpaired/invalid-origin/invalid-input/scope-mismatched requests before mutation or disclosure. No endpoint accepts consent inferred from source text. Client secrets and token values are neither documented nor persisted in the repository. C-12 does not obtain command capabilities through this API.

**Traceability:** All user-facing stories; especially US-01, US-03, US-10, US-21–US-26; NFR-02–NFR-05.

### C-04 — Ingestion Coordinator

**Purpose:** Turn one authorized capture/import into durable, observable processing.

**Responsibilities:** Register selected items, preserve their originals before derived processing, maintain run/item/step state, invoke bounded extraction and optional enrichment, and persist the resulting immutable extraction revisions and affected index updates. Publish available native text to lexical indexing before optional AI/embedding work so those failures cannot block basic retrieval. Selected embedded resources retain independent records. Schedule authorized retries/recovery without replacing a successfully saved original.

**Interfaces:** Authorized capture/import/retry commands; C-05 processing/write ports; C-06 extraction; C-09/C-10 enrichment; C-11 write binding. Use C-07 only through designated consumers in the MVP. C-08 and its permission checks are retained for post-MVP composition. IngestionItemRef permits processing a selected pre-filing item without exposing it through course queries.

**Failure boundary:** A failed model/index step leaves preserved originals and known available text accessible. Run progress and per-resource quality are distinct. Durable receipts identify which operation can be retried. Cancellation, interruption and partial child completion remain visible; no successful-run label fabricates resource completeness.

**Traceability:** US-01–US-07, US-09, US-11, US-13, US-23, US-25; FR-02–FR-07, FR-09; NFR-03–NFR-07.

### C-05 — Evidence Store

**Purpose:** Own the persistent truth and enforce immutable evidence plus scoped access.

**Responsibilities:** Store source/document identity, byte-preserving original versions, capture receipts, distinct date provenance, course memberships/metadata, immutable extraction revisions/passages, source-linked summary revisions, facts/relations and processing state. Consent records/ports are retained for the post-MVP hosted path. SQLite/local files are explicit storage boundaries; later Functional Design specifies transaction, file-commit and recovery mechanics.

**Interfaces:** EvidenceReadPort checks current course membership for every read and never writes. ProcessingEvidencePort permits the authorized ingestion runtime to read an exact original selected for a run, including a pre-filing item; it is not available to MCP. EvidenceWritePort accepts controlled mutations from the command/processing services and never overwrites an immutable original/version/passage. Index data has separately restricted write/read bindings.

**Failure boundary:** Missing/corrupt original bytes, mismatched source/version/passage references, library-not-initialized/incompatible-schema state and persistence errors are explicit. Read-only access must not create directories, databases, migrations or caches. A course move cannot make stale search projections authorize an old-scope fetch.

**Traceability:** US-01–US-26; especially US-08, US-10, US-12–US-15, US-21; FR-01, FR-04, FR-08, FR-09, FR-13, FR-15; NFR-01–NFR-06.

### C-06 — Extraction Pipeline

**Purpose:** Derive searchable content while keeping the selected original and its limitations inspectable.

**Responsibilities:** In the MVP, select native HTML/text/PDF extraction and preserve originals, including original equations/diagrams. Retain page/text locations and report unextracted regions honestly. OCR, advanced equation/diagram recognition and media extraction/transcription adapters remain post-MVP work, with their region/segment provenance contracts retained. Discoveries inside an imported document become resource candidates requiring selection before new resource fetches.

**Interfaces:** An exact immutable original or authorized IngestionItemRef plus requested extraction kinds enters; extraction drafts with passages, source locations, omissions, adapter provenance and per-resource outcomes return to C-04. Adapter capabilities are explicit rather than inferred from upload success.

**Failure boundary:** MVP native-text failure or a deferred extraction capability produces honest partial/failed/unsupported status. Post-MVP unreadable OCR, unsupported codecs or inaccessible media follows the same status rules. Generated prose is not substituted for source pixels or verified transcription. Any re-extraction creates a new output revision; previous cited passages remain addressable.

**Traceability:** US-02–US-07, US-23; FR-03–FR-05; NFR-03, NFR-04.

### C-07 — Local AI Gateway

**Purpose:** Isolate local generation and embeddings behind explicit capability/result contracts.

**Responsibilities:** Submit bounded untrusted-data envelopes to local Ollama for summaries, structured extraction and grounded Ask answers, and to a separately verified local embedding capability. Validate response shape and referenced evidence; preserve uncertainty and provenance. The first generative candidate is gemma3:4b, pending actual compatibility/quality/latency checks; this is not an assertion that the same model supports embeddings.

**Interfaces:** C-09/C-10 supply exact evidence inputs for generation; C-13 supplies bounded course passages and saved precedence/conflicts for Ask. C-11 may request transient local query embeddings. Outputs are validated drafts or unavailable/invalid/timeout/unsupported results; they cannot directly commit facts or overwrite evidence.

**Failure boundary:** Original storage, manual filing and lexical retrieval do not require success from this gateway. Query-time calls must not persist an index, summary or embedding cache in the evidence store. No automatic hosted fallback is implied.

**Traceability:** US-11, US-16, US-19, US-25, US-26; FR-07, FR-10, FR-12, FR-16; NFR-01, NFR-03, NFR-05, NFR-07.

### C-08 — Hosted Jev Gateway

**Delivery:** Post-MVP retained feature; no gateway, permission UI or provider dependency is composed into the current MVP.

**Purpose:** Make optional structured decisions within a specific disclosed data permission.

**Responsibilities:** Enforce the recipient, purpose, selected course/item/evidence scope, allowed fields/excerpts and permission validity before any external classification, routing or reranking request. The payload contains only the disclosed minimal content; complete originals and credentials are excluded.

**Interfaces:** AuthorizedJevRequest is built from a stored active permission and a matching minimized payload. Input references may identify selected captured items for initial classification or already scoped evidence for retrieval. The gateway returns a structured decision with confidence/probabilities where provided, or denied/revoked/expired/scope-mismatch/unavailable/invalid results.

**Failure boundary:** No consent-creation method exists in this gateway or MCP. Changed requested content/scope must match an existing permission or return control to the local review flow. Model outputs cannot expand permitted course IDs, execute source instructions, establish source authority by themselves or disable local fallback.

**Traceability:** US-09, US-19, US-24, US-25; FR-06, FR-12; NFR-02, NFR-05, NFR-07.

### C-09 — Organization and Summary

**Purpose:** Produce correctable organization and incremental navigational summaries grounded in saved evidence.

**Responsibilities:** Suggest a course/folder only within known allowed destinations; distinguish confident/review-required/unavailable states; accept the student's manual filing through the authorized review service. Generate document/topic/course summary drafts with exact supporting references and an affected-input set. Summaries are derived artifacts, not replacements for original passages.

**Interfaces:** Ingestion/review context and approved course/folder metadata; C-07 local generation in the MVP, with C-08 permitted classification retained for post-MVP; read-only evidence inputs; filing/summary drafts returned to S-02/S-03 for authorized persistence. Automatic filing can occur only after a configured acceptance condition is later validated, and remains correctable.

**Failure boundary:** Wrong/uncertain provider IDs are rejected; unavailable suggestions lead to manual filing. A failed summary leaves existing evidence and usable local search intact. Changed inputs mark the affected summary projection pending/rebuild-needed without query-time generation.

**Traceability:** US-08–US-11, US-24, US-25; FR-01, FR-06, FR-07; NFR-03, NFR-05, NFR-07.

### C-10 — Claims and Relations

**Purpose:** Keep substantive course claims and their applicability decisions tied to evidence.

**Responsibilities:** Produce inspectable fact drafts for deadlines, exam logistics and assignment instructions, retaining ambiguous subject/type/value/date information. Suggest typed links and distinguish proposals from established relations. Match claim context by course, subject and claim type. A superseding assignment deadline affects that claim; it does not erase unrelated syllabus facts.

**Interfaces:** Exact saved passages and explicit source/authority/effective-date evidence enter enrichment; fact/relationship drafts return for controlled persistence. A separate pure read-only view evaluates available claims/established bases for query results and returns supported precedence or unresolved competing evidence. No detailed business algorithm or arbitrary numeric authority threshold is fixed here.

**Failure boundary:** Semantic similarity alone cannot merge sources or establish authority. Capture time alone cannot settle precedence; unknown effective date alone does not invalidate an otherwise explicit authoritative update. Unsupported assertions remain uncertain, with both sources available. Course moves/changed evidence can invalidate affected projections for later write-side recomputation; query authorization remains current.

**Traceability:** US-14–US-18, US-20; FR-08, FR-10, FR-11, FR-15; NFR-03, NFR-04, NFR-06.

### C-11 — Index and Retrieval

**Purpose:** Make saved evidence discoverable and fetchable within its course and exact reference.

**Responsibilities:** Write-side operations incrementally publish lexical/vector projections for changed extraction outputs and membership changes. Query-side operations provide bounded lexical/semantic candidates, explicit topic/source/date/version filters, applicable saved-evidence views, exact document/passage fetch, history and conflicts. Recheck current membership after candidate retrieval and before returning any exact evidence.

**Interfaces:** IndexWritePort accepts committed extraction/projection changes only from the S-02 coordinator. S-03 metadata/review commands schedule affected index work through C-04; they do not call the writer directly. EvidenceQueryPort accepts course-scoped requests and only receives C-05 read bindings, C-10 pure views and the local read-side C-07 adapter. The C-08 read-side adapter is post-MVP and absent from the MVP composition. Query methods cannot acquire writer/jobs/ingestion capabilities.

**Failure boundary:** Missing vectors/AI fall back to a disclosed lexical mode; keyword success is not proof that semantic retrieval works. Stale/incomplete projections are labeled and can be rebuilt only through the authorized write runtime. An exact old reference stays exact, even if a new extraction/version exists. Unknown or out-of-course IDs return not_found_in_scope.

**Traceability:** US-04, US-08, US-11, US-15, US-19–US-22, US-25, US-26; FR-01, FR-07, FR-11–FR-16; NFR-03, NFR-05–NFR-07.

### C-12 — Read-only MCP Adapter

**Purpose:** Let the configured Codex client progressively retrieve evidence without library mutation authority.

**Responsibilities:** Advertise scoped read tools, validate their input/result envelopes and return compact previews before requested exact content. Provide course listing, search, document/passage fetch, history and conflicts. Preserve source-data labeling, processing limitations and external-client disclosure in returned metadata where appropriate.

**Interfaces:** Separate local stdio process composed exclusively from C-05 EvidenceReadPort, C-11 EvidenceQueryPort and pure helpers. Only list_courses is unscoped; search_course, fetch_document, fetch_passages, get_document_history and get_conflicts require courseId. Source/version/passage consistency and course membership are enforced behind every query, not only in search.

**Failure boundary:** No save/import/update/delete/consent/retry/reindex tools or writable dependencies. It must not create a library when one is absent, regenerate summaries during fetch or mutate consent/use counters through a query. The MVP has no hosted query processing. The retained post-MVP path may use only a preexisting exact-scope permission; denial leaves local retrieval available. Actual Codex CLI integration remains a future verification task.

**Traceability:** US-19–US-25; FR-12–FR-15; NFR-01–NFR-05.

### C-13 — Course Ask Orchestrator

**Purpose:** Answer a student's question about saved materials in the selected course through local generation, with inspectable evidence and uncertainty.

**Responsibilities:** Validate bounded question/scope, search the local-only C-11 query binding, fetch bounded exact passages, inspect saved precedence/conflicts and ask C-07 for a grounded answer. Treat retrieved text as data. Validate each answer segment's supporting passage references against the fetched set and recheck membership before returning results. Do not accept a model's source IDs, authority inference or tool instructions as permission or evidence.

**Interfaces:** C-03 exposes a controlled Ask entry for C-02. C-13 receives only C-11 query operations, scoped C-05 evidence reads and C-07 local answer generation. It does not receive ingestion, metadata, consent, processing or index writers. This path disables optional hosted query adapters; it neither calls C-08 nor adds an MCP tool. C-12 remains independently usable with its six existing tools.

**Failure boundary:** Empty or inadequate supporting evidence returns insufficient_evidence. Local-model unavailability returns explicitly labeled retrieval_only material and a model-unavailable limitation, with no invented generated answer or automatic hosted fallback. Invalid references/schema return invalid_model_output. An answer may explain an established instructor update while showing a conflicting student note; unknown or student authorship cannot establish instructor authority by age, confidence or platform name. The app cannot promise complete contradiction detection or that every generated statement is correct.

**Traceability:** US-26 with US-17–US-22, US-24–US-25; FR-16 with FR-10–FR-15; NFR-01–NFR-04, NFR-06–NFR-07.

## 6. Source and format coverage retained

| Source/format | Delivery phase and responsibility |
|---|---|
| Canvas, Gradescope, EdStem and ordinary webpages | C-01/C-03/C-04 preserve explicitly selected accessible pages; each actual authenticated source requires its own integration evidence. |
| External papers, PDFs and local files | C-01/C-02 submit permitted originals; C-06 selects native extraction or explicit fallback. Local-only sources do not receive invented web URLs. |
| Linked/embedded documents and media | MVP: selected native PDF/document capture and independent status. Audio/video acquisition and derived processing remain post-MVP; discovery alone never implies successful capture/transcription. |
| Scans and images | Post-MVP: C-06 OCR with original-pixel/page-region provenance. MVP may preserve/view an authorized original and explicitly mark text extraction unsupported. |
| Equations and diagrams | MVP: C-05 original preservation/viewing and any existing native text. Post-MVP: advanced recognition with reliable notation/region provenance. |
| Accessible audio/video | Post-MVP: permitted acquisition/transcription and segment/time provenance. MVP clearly reports unavailable extraction; a failure/status-only case is not a passing future transcription test. |

No adapter, runtime result, permission path or source integration is claimed as already implemented or passing. Detailed extraction/provider algorithms and measured resource limits belong to later Functional/NFR Design and Construction.

## 7. Related artifacts

- [Component methods and shared contracts](component-methods.md).
- The companion services, dependency and consolidated design documents use the same C-01–C-13 IDs and S-01–S-05 logical services.
- The [design plan](../plans/application-design-plan.md) records the separate generated-design approval gate; these component definitions do not mark that gate complete.
