# Course Copilot — Logical Services and Orchestration

**Status:** Proposed Application Design artifacts for separate review; not application code or verified runtime behavior.

Inputs: [design plan](../plans/application-design-plan.md), [components](components.md), [component methods](component-methods.md) and [approved stories](../user-stories/stories.md). Component IDs C-01–C-12 and logical services S-01–S-04 follow the plan. A logical service is orchestration inside the local runtime, not a separately deployed microservice or an approved Unit of Work.

## 1. Service boundaries

| ID | Service | Entry points and responsibilities | Write capability |
|---|---|---|---|
| S-01 | Capture and Ingest | C-01/C-02 → controlled C-03 → C-04/C-05. Validate selected bytes/resources and course membership, preserve original, establish source/version/capture records and durable processing runs. | Authorized library writes only; no MCP entry. |
| S-02 | Processing and Index | C-04 coordinates C-06/C-07/C-09/C-10/C-11 and C-05. Native/OCR/transcription, correctable filing, incremental summaries, evidence-linked claims/relations and lexical/vector indexes. Optional C-08 only under matching consent. | Writes derived artifacts/status; cannot replace originals. |
| S-03 | Metadata and Review | C-02 → C-03 → C-05 metadata writes; C-04 schedules C-09/C-10/C-11 recomputation through S-02. Course/topic/title/tag/authority correction, uncertain filing and proposed-relation review, explicit per-operation hosted permission. | Editable metadata/review decisions; changes schedule scoped derived recomputation. No source-history rewriting. |
| S-04 | Evidence Query | C-02/C-03 query path or C-12 stdio → C-11 query-only + C-05 read-only ports; optional local C-07 query embedding. List courses, compact search, exact fetch, history and conflicts. | None: no ingestion, correction, regeneration or persistent AI side effects. |

One Node library process hosts mutation orchestration, controlled loopback API and local UI delivery. Bounded extraction workers/subprocesses and Ollama are local dependencies, with exact process/resource choices reserved for later infrastructure and performance design. The separate MCP process composes only query/read capabilities; shared source files do not confer runtime write capability.

## 2. Shared orchestration rules

- All queries except list_courses carry explicit courseId. Authenticate/control the local entry point and authorize document-to-course membership before returning search, fetch, history, conflict or original-resource data. Source identity is independent of membership; saving a source for one course never grants another course access implicitly.
- EvidenceRef pins courseId, sourceId, documentId and versionId; derived-text fetch additionally requires the exact extractionRevisionId, with passageId required for passage fetch. Original-only fetch may use the saved version without an extraction revision. Citation output includes original URL when present, capture time, known published/effective dates, location and completeness. Local-only originals retain an identity/import record without inventing a public URL.
- An unfiled original is addressed internally as IngestionItemRef {runId, itemKey}, bound to the authorized run. Only the controlled UI/processing service can access it through a separate ProcessingEvidencePort. It is not a synthetic course and cannot enter MCP/search before a course membership is established. Hosted permission may bind that exact pending item without inventing a course.
- Original versions are immutable. A later extraction/OCR/summary/index revision is derived data attached to a specific original version, never a rewrite of it. Previously issued passage references remain bound to their original text/location or explicitly become unavailable; they never silently resolve to a newer extraction or version.
- RunState is separate from an item's final outcome. Runs progress through queued/running/succeeded/completed_with_issues/failed/cancelled. Item outcomes are complete/partial/failed/unsupported; pending processing does not pretend to be complete. Track capture and each extraction stage separately and derive an honest aggregate without hiding an unavailable embedded asset.
- Originals and native text are committed before optional expensive AI work. Durable step records, stable IDs and bounded retries support recovery without duplicate source versions or duplicate index records. Re-running derived work cannot create a new original version when content is unchanged.
- Source normalization/hash identity is deterministic. Semantic suggestions may propose related/duplicate-suggestion links for review; they do not merge source identity, originals or course memberships.
- PublishedAt, EffectiveAt and CapturedAt are distinct. Unknown dates are explicit. A later capture is not greater authority; an explicit applicable announcement can supersede a deadline claim without superseding unrelated syllabus content.

## 3. S-01 — Capture and ingest sequence

1. Student selects an accessible page/file in C-01 or imports a local file through C-02. C-01 discovers linked/embedded resources and shows selection/availability; each capture is deliberate. Credentials, cookies, tokens and browser authorization headers are never included in the backend envelope.
2. Browser-authorized resource acquisition stays within C-01's permitted context. Send selected content bytes or permitted snapshot plus source identity/context. The backend does not replay a logged-in session or promise it can fetch an arbitrary authenticated URL. If a resource cannot be acquired, record its observed failure/unsupported status and offer manual upload.
3. C-03 validates origin/pairing capability, allowed input and course scope, then C-04 opens an ingestion run with resource items. Do not trust source-embedded instructions, arbitrary paths or a content-provided destination course as permission.
4. C-05 stages original bytes and records their content hash/source identity. Publish a consistent original/version reference only when file and database metadata are durable. The detailed transaction/recovery protocol is specified in Functional/NFR Design; no claim of atomic cross-filesystem transactions is made here.
5. Same source + same original content reuses its saved version and records the new CaptureReceipt observation. The existing version retains its original capturedAt; the latest observation is shown separately. Changed original content creates a new immutable version. New editable metadata or derived extraction alone is not a changed original. Source identity is not keyed by course membership.
6. Expose source/run status immediately, then queue required derived work for S-02. Preserve every selected accessible item; unavailable items remain visible. A user may correct course/folder later without changing original evidence.

**Acceptance:** US-01–US-03, US-12–US-13, US-23–US-24. Native-page success alone is insufficient: all three LMS sites, ordinary web/PDF/local import and selected embedded content retain their own future acceptance evidence.

## 4. S-02 — Processing and index sequence

1. C-04 dispatches bounded jobs for the exact stored version/resource. C-06 chooses the supported native extraction adapter; OCR scans/images where needed; transcribe accessible authorized audio/video where needed; preserve original equations/diagrams/media and reliable location/notation links. Adapter/tool/model selection remains unbenchmarked future work.
2. Save extraction output with revision, locations, format/stage status and explicit reasons. An unsupported encrypted/DRM/protected embed is not a successful transcript. A manual imported original may recover the missing item with linked provenance; do not erase the failed observation.
3. C-11 incrementally indexes available extracted text with its exact evidence references once course membership is accepted. Before filing, extraction remains private run-bound output and no course search projection is published. After accepted filing, publish the lexical projection before optional AI enrichment. Lexical indexing/manual filing do not depend on Ollama, embedding or Jev success. Failed derived capabilities are visible rather than reported as complete.
4. C-09 proposes course/folder metadata and source-linked document/topic/course summaries. Local C-07 is the default private full-content model path. Low confidence requires user review; only the agreed confidence policy permits auto-filing. Its actual threshold/calibration belongs to later design and validation. A source-proposed course cannot bypass membership checks.
5. If an operation is configured for Jev, C-08 validates an explicit still-applicable permission grant for the operation and minimal selected text/metadata before any request. Denied/expired/out-of-scope/unavailable means local/manual fallback. A generic MCP question, course save or model instruction cannot create consent.
6. C-10 associates substantive claims with supporting passages, subject and scope. Propose typed relations with evidence. Deterministic identity/authority/effect rules or explicit review establish accepted precedence; model confidence alone cannot establish source authority or supersession. Unresolved claims remain a conflict set with competing references.
7. Update only affected derived document/topic/course summaries, claim/conflict views and search entries. Retain contributing version IDs for every summary; correction/retry never silently replaces a citation's saved evidence.
8. Complete the run according to resource/stage results, with distinct failed/partial capabilities. Report retryable failures and manual recovery in C-02. Native search/original viewing remains usable even when AI/embedding/transcription is unavailable.

**Acceptance:** US-04–US-11, US-14, US-16–US-19, US-23–US-25. Required accessible-format success remains required; honest unsupported status is necessary but not a substitute for successful OCR/transcription cases.

## 5. S-03 — Metadata and review sequence

1. Load exact document/course metadata and current revision through controlled library access. Student corrects course/folder/title/tags/authority notes or reviews a low-confidence suggestion. Changes are explicit; stale edits return a conflict/reload result rather than overwrite newer metadata silently.
2. Validate requested destination membership and accepted typed relation endpoints. Source identity/version bytes remain immutable; moving a document does not redefine its original source or rewrite historical evidence.
3. Record metadata/review revision with origin (student correction or accepted suggestion). Authority notes are evidence/context, not an unconditional switch overriding every conflicting fact. Supersession remains claim-scoped and attributable.
4. Schedule affected summary/index/claim-view recomputation through S-02. Mark derived views pending/outdated until current; do not claim updated completeness merely because metadata saved. Previously issued exact evidence references keep their identity.
5. Hosted grants disclose destination, operation, selected payload scope and revocation. Revocation prevents later calls; it cannot recall material already sent. Core library use requires no grant or paid call. Grant creation/changes remain in the user-controlled library interface, not MCP tools.

**Acceptance:** US-08–US-10, US-14, US-17–US-18, US-24. No deletion/export-all or new collaboration permission feature is introduced by these methods.

## 6. S-04 — Progressive read-only evidence query

1. Codex connects to C-12 by local stdio. The startup composition opens a read-only database/file/query view; it does not start migrations, ingestion workers, vector-index writers or summary refresh. Missing/incompatible storage returns explicit setup/not-ready status; a mutating setup action is performed through the library runtime separately.
2. list_courses enumerates locally saved course handles. Every subsequent tool requires courseId and validates course membership for requested document/version/passage references. A valid global source ID alone is insufficient for a scoped fetch.
3. search_course applies course/topic/source/date/version filters consistently to both lexical and semantic candidates. Use local query embedding where available; preserve keyword/metadata fallback and report the semantic capability's availability. The read path cannot persist a generated query embedding or rebuilt index.
4. Return bounded compact candidates, source/version IDs, source-linked previews/summaries, extraction/index status and substantive conflict flags. Default to latest applicable saved evidence using explicit precedence. Include older competing claim references where needed; avoid suppressing the whole source because one claim changed. Date filters do not introduce excluded historical as-of querying.
5. fetch_document/fetch_passages accepts selected exact EvidenceRefs and returns supported saved content, citations, original-resource references where supported and honest status. Full-content fetch is available where supported but bounded/paginated explicitly; do not silently truncate while claiming full content. An old reference fetches that saved evidence, never automatically redirects to latest.
6. get_document_history lists observed preserved versions/captures and relations; get_conflicts returns competing supported claims with their scope and resolution state. These are read-only inspection tools, not approval/mutation endpoints.
7. Optional Jev query routing/rerank must satisfy an existing exact-scope permission policy; without it, use local retrieval. MCP cannot promptlessly approve hosted processing or expand the selected payload. Untrusted retrieved instructions cannot invoke write/hosted capabilities.
8. Codex receives the selected passages. The student's external host/model can process them under that host's configuration; local MCP only describes local transport/storage, not a guarantee that external AI processing is local. The library does not add a built-in assistant or silently send the entire course to a hosted provider.

**Acceptance:** US-12, US-15, US-18–US-22, US-24–US-25. Future validation must include actual Codex CLI search then fetch plus read-only behavior and cross-course denial cases, not just tool registration.

## 7. Failure and consistency matrix

| Failure | Preserve/report | Recovery and availability |
|---|---|---|
| Page/embedded resource acquisition denied | Source/selection and exact failed/unsupported item; no fabricated content. | Retry authorized capture or manual import; saved items remain available. |
| Original staging interrupted | Incomplete run/staged artifact state; never expose a nonexistent committed original. | Reconcile staged metadata/files; detailed recovery in later NFR Design. |
| OCR/transcription failure | Original and any reliable partial output, stage status/reason. | Scoped retry/manual supplement; original viewer and existing text search remain. |
| Ollama/Jev unavailable/invalid | Original, extraction, manual classification and lexical index; no unsupported summary/claim marked accepted. | Local/manual fallback; retry only bounded authorized work. |
| Embedding/vector index unavailable | Available lexical/metadata results and explicit semantic unavailable status. | Index rebuilding is a library write job, not an MCP query side effect. |
| Unresolved or incomparable authority | Both claims and source evidence, uncertainty and scope. | Review/evidence acquisition; no arbitrary capture-time tie-break. |
| Database/schema incompatible in MCP | Clear not-ready/error response; no auto-migration. | Start authorized library setup/migration separately. |
| Out-of-course/missing exact reference | Scoped not-found/denied response with no foreign evidence content. | Correct scope or select an existing reference; no latest-version substitution. |

All capabilities here are design proposals pending artifact review. Detailed algorithms, concrete local OCR/STT/embedding packages, benchmarks, physical deployment and implementation tests are future Construction work after the course checkpoint.
