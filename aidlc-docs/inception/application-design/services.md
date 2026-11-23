# Course Copilot — Logical Services and Orchestration

**Current review (2026-11-23):** Step 2 corrective draft with local Ask and local MCP in the MVP and retained Jev/media capabilities scheduled for later work. The 2026-11-20 approval applies to the historical baseline only; approval of these revisions is pending. No Construction or runtime acceptance is claimed.

**Delivery phases:** The current MVP includes native HTML/text/PDF capture and import, local organization and retrieval, source/version/authority handling, grounded Ask and read-only local MCP. Jev, scan/image OCR, advanced equation/diagram recognition, and audio/video extraction/transcription remain planned **post-MVP** features. Original preservation/viewing and honest extraction status remain in the MVP. C-08 and all hosted-permission/provider paths are retained design contracts but are not composed into the MVP. See the [MVP and later-work scope](../requirements/mvp-scope.md).

Inputs: [design plan](../plans/application-design-plan.md), [components](components.md), [component methods](component-methods.md) and [stories](../user-stories/stories.md). Component IDs C-01–C-13 and logical services S-01–S-05 follow the plan. A logical service is orchestration inside the local runtime, not a separately deployed microservice or an approved Unit of Work.

## 1. Service boundaries

| ID | Service | Entry points and responsibilities | Write capability |
|---|---|---|---|
| S-01 | Capture and Ingest | C-01/C-02 → controlled C-03 → C-04/C-05. Validate selected bytes/resources and course membership, preserve original, establish source/version/capture records and durable processing runs. | Authorized library writes only; no MCP entry. |
| S-02 | Processing and Index | C-04 coordinates C-06/C-07/C-09/C-10/C-11 and C-05. MVP native extraction, local/manual filing, incremental summaries, evidence-linked claims/relations and lexical/vector indexes. OCR/transcription and permission-checked C-08 remain post-MVP branches. | Writes derived artifacts/status; cannot replace originals. |
| S-03 | Metadata and Review | C-02 → C-03 → C-05 metadata writes; C-04 schedules C-09/C-10/C-11 recomputation through S-02. Course/topic/title/tag/authority correction, uncertain local filing and proposed-relation review. Per-operation hosted permission is retained for post-MVP. | Editable metadata/review decisions; changes schedule scoped derived recomputation. No source-history rewriting. |
| S-04 | Evidence Query | C-02/C-03 query path or C-12 stdio → C-11 query-only + C-05 read-only ports; optional local C-07 query embedding. List courses, compact search, exact fetch, history and conflicts. | None: no ingestion, correction, regeneration or persistent AI side effects. |
| S-05 | Local Course Ask | C-02 → controlled C-03 → C-13; local-only S-04/C-11 and C-05 read ports retrieve exact evidence; C-07 generates a grounded answer. | None on saved library; UI session continuity is separate transient state. |

One Node library process hosts mutation orchestration, controlled loopback API and local UI delivery. Bounded extraction workers/subprocesses and Ollama are local dependencies, with exact process/resource choices reserved for later infrastructure and performance design. The separate MCP process composes only query/read capabilities; shared source files do not confer runtime write capability.

## 2. Shared orchestration rules

- All queries except list_courses carry explicit courseId. Authenticate/control the local entry point and authorize document-to-course membership before returning search, fetch, history, conflict or original-resource data. Source identity is independent of membership; saving a source for one course never grants another course access implicitly.
- EvidenceRef pins courseId, sourceId, documentId and versionId; derived-text fetch additionally requires the exact extractionRevisionId, with passageId required for passage fetch. Original-only fetch may use the saved version without an extraction revision. Citation output includes original URL when present, capture time, known published/effective dates, location and completeness. Local-only originals retain an identity/import record without inventing a public URL.
- An unfiled original is addressed internally as IngestionItemRef {runId, itemKey}, bound to the authorized run. Only the controlled UI/processing service can access it through a separate ProcessingEvidencePort. It is not a synthetic course and cannot enter MCP/search before a course membership is established. The retained post-MVP hosted permission may bind that exact pending item without inventing a course; the MVP does not expose hosted grants.
- Original versions are immutable. A later extraction/OCR/summary/index revision is derived data attached to a specific original version, never a rewrite of it. Previously issued passage references remain bound to their original text/location or explicitly become unavailable; they never silently resolve to a newer extraction or version.
- RunState is separate from an item's final outcome. Runs progress through queued/running/succeeded/completed_with_issues/failed/cancelled. Item outcomes are complete/partial/failed/unsupported; pending processing does not pretend to be complete. Track capture and each extraction stage separately and derive an honest aggregate without hiding an unavailable embedded asset.
- Originals and native text are committed before optional expensive AI work. Durable step records, stable IDs and bounded retries support recovery without duplicate source versions or duplicate index records. Re-running derived work cannot create a new original version when content is unchanged.
- Source normalization/hash identity is deterministic. Semantic suggestions may propose related/duplicate-suggestion links for review; they do not merge source identity, originals or course memberships.
- PublishedAt, EffectiveAt and CapturedAt are distinct. Unknown dates are explicit. A later capture is not greater authority; an explicit applicable announcement by a source-provenance-confirmed instructor can supersede a matching deadline claim without superseding unrelated syllabus content. A student reply/personal note or unverified publisher never gains that authority from platform, recency, confidence or a free-form note; retain substantive discrepancies for review.

## 3. S-01 — Capture and ingest sequence

1. Student selects an accessible page/file in C-01 or imports a local file through C-02. C-01 discovers linked/embedded resources and shows selection/availability; each capture is deliberate. Credentials, cookies, tokens and browser authorization headers are never included in the backend envelope.
2. Browser-authorized resource acquisition stays within C-01's permitted context. Send selected content bytes or permitted snapshot plus source identity/context. The backend does not replay a logged-in session or promise it can fetch an arbitrary authenticated URL. If a resource cannot be acquired, record its observed failure/unsupported status and offer manual upload.
3. C-03 validates origin/pairing capability, allowed input and course scope, then C-04 opens an ingestion run with resource items. Do not trust source-embedded instructions, arbitrary paths or a content-provided destination course as permission.
4. C-05 stages original bytes and records their content hash/source identity. Publish a consistent original/version reference only when file and database metadata are durable. The detailed transaction/recovery protocol is specified in Functional/NFR Design; no claim of atomic cross-filesystem transactions is made here.
5. Same source + same original content reuses its saved version and records the new CaptureReceipt observation. The existing version retains its original capturedAt; the latest observation is shown separately. Changed original content creates a new immutable version. New editable metadata or derived extraction alone is not a changed original. Source identity is not keyed by course membership.
6. Expose source/run status immediately, then queue required derived work for S-02. Preserve each selected accessible MVP page/native document; unavailable items remain visible. A user may correct course/folder later without changing original evidence.

**Acceptance:** US-01–US-03, US-12–US-13, US-23–US-24. Native-page success alone is insufficient: all three LMS sites, ordinary web/PDF/local import and selected embedded content retain their own future acceptance evidence.

## 4. S-02 — Processing and index sequence

1. C-04 dispatches bounded jobs for the exact stored version/resource. C-06 uses supported native HTML/text/PDF extraction and preserves original equations/diagrams for viewing. Scan/image OCR, advanced recognition and audio/video acquisition/transcription are retained post-MVP adapters. Unsupported deferred extraction is disclosed. Native adapter/model selection remains unbenchmarked later MVP design work.
2. Save extraction output with revision, locations, format/stage status and explicit reasons. An unsupported encrypted/DRM/protected embed is not a successful transcript. A manual imported original may recover the missing item with linked provenance; do not erase the failed observation.
3. C-11 incrementally indexes available extracted text with its exact evidence references once course membership is accepted. Before filing, extraction remains private run-bound output and no course search projection is published. After accepted filing, publish the lexical projection before optional AI enrichment. Lexical indexing/manual filing do not depend on Ollama, embedding or Jev success. Failed derived capabilities are visible rather than reported as complete.
4. C-09 proposes course/folder metadata and source-linked document/topic/course summaries. Local C-07 is the default private full-content model path. Low confidence requires user review; only the agreed confidence policy permits auto-filing. Its actual threshold/calibration belongs to later design and validation. A source-proposed course cannot bypass membership checks.
5. Post-MVP only: if an operation is configured for Jev, C-08 validates an explicit still-applicable permission grant for the operation and minimal selected text/metadata before any request. Denied/expired/out-of-scope/unavailable means local/manual fallback. A generic MCP question, course save or model instruction cannot create consent.
6. C-10 associates substantive claims with supporting passages, subject and scope. Propose typed relations with evidence. Deterministic identity/authority/effect rules or explicit review establish accepted precedence; model confidence alone cannot establish source authority or supersession. Unresolved claims remain a conflict set with competing references.
7. Update only affected derived document/topic/course summaries, claim/conflict views and search entries. Retain contributing version IDs for every summary; correction/retry never silently replaces a citation's saved evidence.
8. Complete the run according to resource/stage results, with distinct failed/partial capabilities. Report retryable failures and manual recovery in C-02. Native search/original viewing remains usable when local AI/embedding is unavailable. Post-MVP transcription failure follows the same original-preservation rule.

**Acceptance:** MVP portions of US-04, US-07–US-11, US-14, US-16–US-19 and US-23–US-25. US-05/US-06 and advanced recognition in US-07 are retained post-MVP. Their later acceptance requires successful OCR/transcription/recognition evidence; an MVP unsupported status does not close those future stories.

## 5. S-03 — Metadata and review sequence

1. Load exact document/course metadata and current revision through controlled library access. Student corrects course/folder/title/tags/authority notes or reviews a low-confidence suggestion. Changes are explicit; stale edits return a conflict/reload result rather than overwrite newer metadata silently.
2. Validate requested destination membership and accepted typed relation endpoints. Source identity/version bytes remain immutable; moving a document does not redefine its original source or rewrite historical evidence.
3. Record metadata/review revision with origin (student correction or accepted suggestion). Authority notes are evidence/context, not an unconditional switch overriding every conflicting fact. Supersession remains claim-scoped and attributable.
4. Schedule affected summary/index/claim-view recomputation through S-02. Mark derived views pending/outdated until current; do not claim updated completeness merely because metadata saved. Previously issued exact evidence references keep their identity.
5. Post-MVP only: hosted grants disclose destination, operation, selected payload scope and revocation. Revocation prevents later calls; it cannot recall material already sent. Core library use requires no grant or paid call. Grant creation/changes remain in the user-controlled library interface, not MCP tools.

**Acceptance:** US-08–US-10, US-14, US-17–US-18, US-24. No deletion/export-all or new collaboration permission feature is introduced by these methods.

## 6. S-04 — Progressive read-only evidence query

1. Codex connects to C-12 by local stdio. The startup composition opens a read-only database/file/query view; it does not start migrations, ingestion workers, vector-index writers or summary refresh. Missing/incompatible storage returns explicit setup/not-ready status; a mutating setup action is performed through the library runtime separately.
2. list_courses enumerates locally saved course handles. Every subsequent tool requires courseId and validates course membership for requested document/version/passage references. A valid global source ID alone is insufficient for a scoped fetch.
3. search_course applies course/topic/source/date/version filters consistently to both lexical and semantic candidates. Use local query embedding where available; preserve keyword/metadata fallback and report the semantic capability's availability. The read path cannot persist a generated query embedding or rebuilt index.
4. Return bounded compact candidates, source/version IDs, source-linked previews/summaries, extraction/index status and substantive conflict flags. Default to latest applicable saved evidence using explicit precedence. Include older competing claim references where needed; avoid suppressing the whole source because one claim changed. Date filters do not introduce excluded historical as-of querying.
5. fetch_document/fetch_passages accepts selected exact EvidenceRefs and returns supported saved content, citations, original-resource references where supported and honest status. Full-content fetch is available where supported but bounded/paginated explicitly; do not silently truncate while claiming full content. An old reference fetches that saved evidence, never automatically redirects to latest.
6. get_document_history lists observed preserved versions/captures and relations; get_conflicts returns competing supported claims with their scope and resolution state. These are read-only inspection tools, not approval/mutation endpoints.
7. The MVP uses local retrieval only and does not instantiate C-08 or hosted permission lookup. Post-MVP Jev query routing/rerank must satisfy an existing exact-scope permission policy; without it, retain local retrieval. MCP cannot promptlessly approve hosted processing or expand the selected payload. Untrusted retrieved instructions cannot invoke write/hosted capabilities.
8. Codex receives the selected passages. The student's external host/model can process them under that host's configuration; local MCP only describes local transport/storage, not a guarantee that external AI processing is local. The separate built-in Ask path uses local generation through S-05; this does not change Codex host configuration or silently send the entire course to any hosted provider.

**Acceptance:** US-12, US-15, US-18–US-22, US-24–US-25. Future validation must include actual Codex CLI search then fetch plus read-only behavior and cross-course denial cases, not just tool registration.

## 7. S-05 — Local course Ask sequence

1. C-02 submits an explicit question with courseId, requestId and bounded limits to C-03. The controlled API validates local client/context and course membership before C-13 receives the request. Ordinary Ask use does not require the student to run Codex CLI.
2. C-13 uses a local-only C-11 query composition to obtain compact candidates, then fetches only bounded exact source passages through C-11/C-05. Read saved claim precedence/conflict views relevant to those passages; disclose semantic fallback and partial extraction. No C-08 hosted adapter or writable capability is injected.
3. If saved evidence cannot support an answer, return insufficient_evidence with honest available evidence/limitations. Do not invent a course fact from the model's general knowledge. Missing saved material does not imply that the LMS has no answer.
4. Pass scoped passages and precedence/conflicts as untrusted data to C-07 local generation. The model receives no browser, ingestion, metadata, consent or writer tools. It cannot establish publisher role or accept an update relation by assertion.
5. Validate the answer shape, limits and each segment's supporting references against the exact fetched passage set; recheck current membership before returning. Reject invalid/foreign/missing citations. Preserve source/version/extraction/location details and unresolved competing claims. Valid references alone do not prove semantic accuracy; later acceptance tests inspect answer support.
6. Return grounded_answer, or retrieval_only with no generated answer when local generation is unavailable. No automatic remote ChatGPT/Jev fallback is introduced. Other validation/runtime failures return a safe typed error while saved materials remain accessible.
7. C-02 records the result/error only in the originating course/request UI state. Switching tabs and returning preserves draft, result and pending status within the running app. A late answer cannot appear under another course or overwrite a newer question. This does not write course evidence, create persistent chat history or promise reload recovery.

**Acceptance:** US-26 / FR-16 together with US-17–US-22, US-24–US-25. Future checks cover a supported answer with exact citations, no-evidence and conflicting-authority cases, invalid references, model outage, read-only state comparison and course/navigation/in-flight isolation. No such application checks are claimed as executed in Inception.

## 8. Failure and consistency matrix

| Failure | Preserve/report | Recovery and availability |
|---|---|---|
| Page/embedded resource acquisition denied | Source/selection and exact failed/unsupported item; no fabricated content. | Retry authorized capture or manual import; saved items remain available. |
| Original staging interrupted | Incomplete run/staged artifact state; never expose a nonexistent committed original. | Reconcile staged metadata/files; detailed recovery in later NFR Design. |
| Post-MVP OCR/transcription failure | Original and any reliable partial output, stage status/reason. | Scoped retry/manual supplement; original viewer and existing text search remain. |
| Local Ollama unavailable/invalid; post-MVP Jev unavailable/invalid | Original, extraction, manual classification and lexical index; no unsupported summary/claim marked accepted. | Local/manual fallback; retry only bounded authorized work. |
| Embedding/vector index unavailable | Available lexical/metadata results and explicit semantic unavailable status. | Index rebuilding is a library write job, not an MCP query side effect. |
| Ask local generation unavailable | Retrieved exact evidence and disclosed retrieval_only/model limitation; no generated answer. | Keep Materials/search usable; retry local Ask explicitly after setup. |
| Ask evidence insufficient or model citations invalid | Disclosed insufficiency or safe invalid_model_output; never a fabricated answer. | Inspect saved sources, add missing permitted material or revise question. |
| Unresolved or incomparable authority | Both claims and source evidence, uncertainty and scope. | Review/evidence acquisition; no arbitrary capture-time tie-break. |
| Database/schema incompatible in MCP | Clear not-ready/error response; no auto-migration. | Start authorized library setup/migration separately. |
| Out-of-course/missing exact reference | Scoped not-found/denied response with no foreign evidence content. | Correct scope or select an existing reference; no latest-version substitution. |

These phase-specific design proposals await artifact review. Native ingestion/local AI/embedding, Ask and MCP algorithms, benchmarks and implementation are later authorized MVP Construction work. OCR/STT/advanced recognition and Jev implementation are retained post-MVP work, with no committed delivery date. The Inception checkpoint still stops before Construction.
