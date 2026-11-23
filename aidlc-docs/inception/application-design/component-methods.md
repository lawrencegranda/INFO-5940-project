# Course Copilot — Component Methods and Contracts

**Stage:** Inception / Application Design

**Current review (2026-11-23):** Step 2 corrective draft with local Ask and local MCP in the MVP and retained Jev/media capabilities scheduled for later work. The 2026-11-20 approval applies to the historical baseline only; approval of these revisions is pending. No Construction or runtime acceptance is claimed.

**Delivery phases:** The current MVP includes native HTML/text/PDF capture and import, local organization and retrieval, source/version/authority handling, grounded Ask and read-only local MCP. Jev, scan/image OCR, advanced equation/diagram recognition, and audio/video extraction/transcription remain planned **post-MVP** features. Original preservation/viewing and honest extraction status remain in the MVP. C-08 and all hosted-permission/provider paths are retained design contracts but are not composed into the MVP. See the [MVP and later-work scope](../requirements/mvp-scope.md).

**Inputs:** [Component definitions](components.md), [design plan](../plans/application-design-plan.md), [requirements](../requirements/requirements.md) and [stories](../user-stories/stories.md).

Detailed business algorithms, schema migrations, source normalization rules, confidence thresholds, worker limits, OCR/STT packages and index scoring remain for later Functional/NFR Design. Method names identify responsibilities; concrete module packaging remains for Units Generation.

## Delivery status of retained contracts

The method catalogue covers the full planned product. MVP composition uses local capture/import, native text/PDF extraction, original viewing, local organization/AI, scoped retrieval, Ask and the six read-only MCP tools. JevPermission/AuthorizedJevRequest/HostedJevGateway, PermissionReadPort, savePermission, reviewHostedPermission, setJevPermission and hostedRequest parameters are post-MVP contracts only; the MVP neither exposes those commands nor injects those capabilities. OCR/transcription request variants, media locations and advanced visual-recognition outputs are retained for later work. Requesting a deferred adapter in the MVP returns an explicit unsupported capability status rather than a fabricated result.

## 1. Shared identity, scope and result types

IDs are opaque stable design types represented as strings here. Runtime validation must verify their existence, relationships and scope; a string-shaped identifier is not an authorization proof.

```typescript
type CourseId = string;
type SourceId = string;
type DocumentId = string;
type VersionId = string;
type ExtractionRevisionId = string;
type PassageId = string;
type FactId = string;
type RelationshipId = string;
type IngestionRunId = string;
type ConsentId = string;
type FolderId = string;
type IsoDateTime = string;
type Cursor = string;
type Json = null | boolean | number | string | readonly Json[]
  | { readonly [key: string]: Json };

interface CourseScope { courseId: CourseId; }
interface StoredVersionIdentity {
  sourceId: SourceId;
  documentId: DocumentId;
  versionId: VersionId;
}
interface VersionRef extends StoredVersionIdentity, CourseScope {}
type EvidenceRef = VersionRef & (
  | { extractionRevisionId?: never; passageId?: never }
  | { extractionRevisionId: ExtractionRevisionId; passageId?: PassageId }
);
interface PassageRef extends VersionRef {
  extractionRevisionId: ExtractionRevisionId;
  passageId: PassageId;
}
interface OriginalResourceRef extends VersionRef {
  resourceKey: string;
  mediaType: string;
}
interface IngestionItemRef {
  runId: IngestionRunId;
  itemKey: string;
}

type FailureCode =
  | "unpaired_client" | "origin_denied" | "invalid_input"
  | "not_found_in_scope" | "reference_mismatch"
  | "library_unavailable" | "schema_incompatible"
  | "original_unavailable" | "processing_not_ready" | "unsupported"
  | "local_model_unavailable" | "hosted_denied" | "hosted_unavailable"
  | "invalid_model_output" | "index_unavailable"
  | "metadata_conflict" | "persistence_failed" | "cancelled";
interface Failure {
  code: FailureCode;
  message: string;
  retryable: boolean;
  itemRef?: IngestionItemRef;
}
interface Warning { code: string; message: string; }
type Result<T> =
  | { ok: true; value: T; warnings: readonly Warning[] }
  | { ok: false; error: Failure };
```

Scope and reference rules apply behind every method, not only at the UI/MCP envelope:

1. Only course listing is unscoped. Search, document/passage fetch, history, conflicts and original-resource metadata require courseId.
2. A scoped read checks current document-to-course membership and validates every source/document/version/extraction/passage relationship. A supplied outer courseId must match every nested reference.
3. A missing or foreign reference returns not_found_in_scope without disclosing another course's content or identifiers. Invalid combinations within authorized evidence return a safe reference_mismatch.
4. Course membership is independent of source identity. Moving filing changes membership/metadata and schedules affected derived work; it does not change the original source/version/passage.
5. Historical version and extraction references never redirect silently to latest. A new extraction revision receives new passage identities; previously returned passage text/location is not overwritten.
6. An unfiled IngestionItemRef is readable only through the authorized ingestion/review context. It is never accepted as a public MCP evidence reference or treated as a synthetic course.

## 2. Evidence, completeness and bounded reads

```typescript
type ResourceOutcome = "complete" | "partial" | "failed" | "unsupported";
type RunState =
  | "queued" | "running" | "succeeded"
  | "completed_with_issues" | "failed" | "cancelled";
type StepState = "pending" | "running" | "succeeded" | "failed" | "skipped";

type SourceOrigin =
  | { kind: "web"; sourceUrl: string }
  | { kind: "local_file"; importIdentity: string; displayName: string };
type EvidenceLocation =
  | { kind: "text"; start: number; end: number }
  | { kind: "page"; page: number; region?: readonly number[] }
  | { kind: "media"; startSeconds: number; endSeconds: number }
  | { kind: "original"; label: string };
interface PublisherEvidence {
  role: "instructor" | "student" | "unknown";
  identity?: string;
  verification: "source_provenance_confirmed" | "unverified";
  basis: readonly EvidenceRef[];
}
interface SourceCitation {
  ref: EvidenceRef;
  origin: SourceOrigin;
  publisher?: PublisherEvidence;
  capturedAt: IsoDateTime;
  publishedAt?: IsoDateTime;
  effectiveAt?: IsoDateTime;
  location?: EvidenceLocation;
  outcome: ResourceOutcome;
  omissions: readonly string[];
}
interface ItemReport {
  itemRef: IngestionItemRef;
  versionRef?: VersionRef;
  captureOutcome?: ResourceOutcome;
  extractionOutcome?: ResourceOutcome;
  steps: Readonly<Record<string, StepState>>;
  omissions: readonly string[];
  errors: readonly Failure[];
}
interface RunReport {
  runId: IngestionRunId;
  state: RunState;
  items: readonly ItemReport[];
}
interface PageRequest { limit: number; cursor?: Cursor; }
interface Page<T> {
  items: readonly T[];
  hasMore: boolean;
  nextCursor?: Cursor;
  appliedLimit: number;
}
interface CourseView { courseId: CourseId; title: string; }
interface DocumentView {
  documentId: DocumentId;
  sourceId: SourceId;
  courseId: CourseId;
  title: string;
  metadataRevision: string;
  availableVersions: readonly VersionId[];
}
interface HistoryEntry {
  ref: VersionRef;
  capturedAt: IsoDateTime;
  extractionRevisions: readonly ExtractionRevisionId[];
}
interface CaptureReceipt {
  itemRef: IngestionItemRef;
  observedAt: IsoDateTime;
  identity?: StoredVersionIdentity;
  ref?: VersionRef;
  disposition: "new_version" | "unchanged" | "not_stored";
}
```

ResourceOutcome is a completed resource operation's quality/result, while RunState describes the durable run's progress. Pending/running extraction has no invented final outcome. Child items retain their own outcomes, errors and omissions even if the parent succeeds. AI/index step failure is separately reported rather than rewriting successfully captured original evidence.

CaptureReceipt records a later unchanged observation without changing an existing version's original capturedAt or creating a duplicate content version. Published/effective dates remain unknown when the source does not establish them. Original source URLs must be safe stable links, not exported credentials or authenticated request headers.

```typescript
interface SearchRequest extends CourseScope {
  query: string;
  page: PageRequest;
  filters?: {
    folderIds?: readonly FolderId[];
    tags?: readonly string[];
    sourceIds?: readonly SourceId[];
    versionIds?: readonly VersionId[];
    capturedRange?: { from?: IsoDateTime; to?: IsoDateTime };
    publishedRange?: { from?: IsoDateTime; to?: IsoDateTime };
    effectiveRange?: { from?: IsoDateTime; to?: IsoDateTime };
  };
}
type CandidatePreview = {
  title: string;
  citations: readonly SourceCitation[];
  conflictIds: readonly RelationshipId[];
  limitations: readonly string[];
} & (
  | { ref: PassageRef; preview: { kind: "source_excerpt"; text: string } }
  | { ref: EvidenceRef; preview: { kind: "generated_summary"; text: string } }
  | { ref: VersionRef; preview: { kind: "source_metadata"; text: string } }
);
interface SearchPage extends Page<CandidatePreview> {
  retrievalMode: "hybrid" | "lexical_fallback";
  semanticStatus: "available" | "unavailable" | "not_ready";
}
type FetchDocumentRequest = CourseScope & {
  ref: VersionRef;
} & (
  | { content: "original_metadata" }
  | {
      content: "extracted_text";
      extractionRevisionId: ExtractionRevisionId;
      maxCharacters: number;
      cursor?: Cursor;
    }
);
interface FetchedDocument {
  ref: VersionRef;
  extractionRevisionId?: ExtractionRevisionId;
  originalAvailable: boolean;
  originalResource?: OriginalResourceRef;
  text?: string;
  hasMore: boolean;
  nextCursor?: Cursor;
  citations: readonly SourceCitation[];
  limitations: readonly string[];
}
interface FetchPassagesRequest extends CourseScope {
  refs: readonly PassageRef[];
}
interface FetchedPassage {
  ref: PassageRef;
  text: string;
  citation: SourceCitation;
}
interface OriginalReadRequest extends CourseScope {
  ref: OriginalResourceRef;
  offset: number;
  maxBytes: number;
}
interface OriginalResourceChunk {
  ref: OriginalResourceRef;
  mediaType: string;
  bytes: Uint8Array;
  hasMore: boolean;
  nextOffset?: number;
  citation: SourceCitation;
}
interface HistoryRequest extends CourseScope {
  documentId: DocumentId;
  page: PageRequest;
}
interface ConflictRequest extends CourseScope {
  documentId?: DocumentId;
  subjectKey?: string;
  claimType?: string;
  page: PageRequest;
}
```

Search results are bounded previews, not implicit full-course retrieval. Extracted full-document content is explicitly paginated: maxCharacters and a ref-bound cursor control each response, hasMore/nextCursor disclose remaining content, and no truncated page is labeled the entire document. Cursor validation binds course, version, extraction revision and requested content mode. Missing extraction returns its honest status/original availability rather than generated replacement text.

A source excerpt's citation pins its immutable extraction revision/passage. A generated summary has a distinct label and exact supporting source references. Required filters apply to both lexical and semantic candidates; date filters specify their date meaning and do not introduce historical as-of querying.

## 3. Capture, mutation and enrichment vocabulary

These are input/draft contracts; provider output is validated before a write service accepts it.

```typescript
interface LocalCommandContext {
  requestId: string;
  pairedClientId: string;
  capabilityRef: string;
}
interface ResourceCandidate {
  itemKey: string;
  parentItemKey?: string;
  label: string;
  mediaType?: string;
  sourceUrl?: string;
  selected: boolean;
}
interface CapturedItem {
  itemKey: string;
  parentItemKey?: string;
  origin: SourceOrigin;
  capturedAt: IsoDateTime;
  mediaType: string;
  bytes?: Uint8Array;
  outcome: ResourceOutcome;
  limitations: readonly string[];
}
interface IngestionRequest {
  items: readonly CapturedItem[];
  selectedCourseId?: CourseId;
  selectedFolderId?: FolderId;
  discoveredResources: readonly ResourceCandidate[];
}
interface MetadataPatch {
  title?: string;
  folderId?: FolderId;
  tags?: readonly string[];
  authorityNotes?: string;
  moveToCourseId?: CourseId;
}
interface MetadataEdit extends CourseScope {
  documentId: DocumentId;
  expectedRevision: string;
  patch: MetadataPatch;
}
type ReviewRequest =
  | {
      kind: "filing";
      itemRef: IngestionItemRef;
      targetCourseId: CourseId;
      targetFolderId?: FolderId;
      expectedReviewRevision: string;
    }
  | {
      kind: "relationship";
      courseId: CourseId;
      relationshipId: RelationshipId;
      decision: "accept" | "reject";
      expectedRevision: string;
    };
interface ExtractionDraft {
  itemRef: IngestionItemRef;
  identity?: StoredVersionIdentity;
  outcome: ResourceOutcome;
  passages: readonly {
    text: string;
    location: EvidenceLocation;
    uncertainty: readonly string[];
  }[];
  omissions: readonly string[];
  adapterProvenance: Readonly<Record<string, Json>>;
}
interface SummaryDraft {
  scope: CourseScope;
  level: "document" | "topic" | "course";
  text: string;
  supportingRefs: readonly PassageRef[];
  affectedInputVersions: readonly VersionRef[];
  limitations: readonly string[];
}
interface FactDraft {
  scope: CourseScope;
  subjectKey?: string;
  claimType: string;
  value?: Json;
  citation: SourceCitation;
  uncertainty: readonly string[];
}
interface FactRef extends CourseScope {
  factId: FactId;
  citation: SourceCitation;
}
interface RelationshipDraft {
  scope: CourseScope;
  kind: "related" | "duplicate-suggestion" | "updates" | "supersedes";
  endpoints: readonly (EvidenceRef | FactRef)[];
  status: "proposed" | "established";
  basis: readonly SourceCitation[];
  subjectKey?: string;
  claimType?: string;
}
interface PrecedenceView {
  scope: CourseScope;
  subjectKey: string;
  claimType: string;
  status: "established" | "unresolved" | "insufficient";
  applicable: readonly FactRef[];
  competing: readonly FactRef[];
  basis: readonly SourceCitation[];
}
interface FilingSuggestion {
  destinations: readonly { courseId: CourseId; folderId?: FolderId }[];
  review: "eligible_for_auto_filing" | "requires_review" | "unavailable";
  providerConfidence?: number;
  limitations: readonly string[];
}
```

LocalCommandContext denotes a context established by C-03's actual request checks; clients cannot obtain authority by supplying that object themselves. Mutation validation covers local pairing/capability, expected origin, input limits and explicit selected resources. No credential value is specified in this document.

Metadata updates use expectedRevision to reject stale edits. A course move validates the destination and current membership. It queues affected summary/claims/index work through C-04 rather than synchronously running writers in C-03. FactDraft/RelationshipDraft remain untrusted proposals until evidence/rules or explicit review establish a basis; provider confidence alone is insufficient. A supersedes relation is limited to the matching course/subject/claim, not a blanket suppression of the entire source document.

```typescript
type JevPurpose = "classification" | "routing" | "rerank";
interface JevPermissionScope {
  destination: string;
  purpose: JevPurpose;
  courseIds: readonly CourseId[];
  inputRefs: readonly (EvidenceRef | IngestionItemRef)[];
  permittedFields: readonly string[];
  payloadDigest: string;
}
interface JevPermission {
  consentId: ConsentId;
  scope: JevPermissionScope;
  state: "active" | "revoked";
  expiresAt?: IsoDateTime;
}
interface AuthorizedJevRequest {
  consentId: ConsentId;
  expectedScope: JevPermissionScope;
  payload: Readonly<Record<string, Json>>;
}
interface JevDecision {
  purpose: JevPurpose;
  decision: Json;
  probabilities?: Readonly<Record<string, number>>;
  confidence?: number;
}
```

Consent matches the disclosed destination, purpose, exact selected input/excerpt/field scope and payload. InputRefs may refer to a selected pending capture for classification without inventing a course membership. Query-side requests first filter/authorize stored evidence, then use only a preexisting matching grant. A changed/expired/revoked/mismatched request returns hosted_denied; it never broadens the permission or uploads full originals. A denied hosted request does not prevent local/manual fallback.

## 4. C-01 — Capture Extension methods

```typescript
interface CaptureExtension {
  discoverResources(userSelectedTabId: string): Promise<Result<readonly ResourceCandidate[]>>;
  captureSelected(
    userSelectedTabId: string,
    selectedItemKeys: readonly string[]
  ): Promise<Result<IngestionRequest>>;
  submitCapture(request: IngestionRequest): Promise<Result<RunReport>>;
}
```

- discoverResources inventories relevant embedded/linked content without authorizing every resource fetch.
- captureSelected reads only the user-selected accessible page/resources in the browser's authorized context, preserves permitted bytes/snapshots and source provenance, and excludes cookies/tokens/passwords/request credentials.
- submitCapture uses the paired C-03 path. An inaccessible selected child is represented explicitly; it cannot disappear from the request/report because the parent succeeded.
- Acquisition failures return item-level limitations or a safe transport failure. No method performs unattended login or bypasses a protected embed.

## 5. C-02 — Local Library UI methods

```typescript
interface LocalLibraryUI {
  loadCourses(): Promise<Result<readonly CourseView[]>>;
  browseCourse(scope: CourseScope, page: PageRequest): Promise<Result<Page<DocumentView>>>;
  importSelectedFiles(request: IngestionRequest): Promise<Result<RunReport>>;
  saveMetadata(edit: MetadataEdit): Promise<Result<DocumentView>>;
  inspectDocument(request: FetchDocumentRequest): Promise<Result<FetchedDocument>>;
  inspectOriginal(request: OriginalReadRequest): Promise<Result<OriginalResourceChunk>>;
  inspectHistory(request: HistoryRequest): Promise<Result<Page<HistoryEntry>>>;
  inspectConflicts(request: ConflictRequest): Promise<Result<Page<PrecedenceView>>>;
  askCourse(request: AskRequest): Promise<Result<AskResult>>;
  reviewHostedPermission(
    disclosure: JevPermissionScope,
    decision: "allow" | "deny"
  ): Promise<Result<JevPermission | null>>;
}
```

These are UI actions backed by C-03, not direct database access. Source selection, review of filing/relationships and per-resource run status are presented through the corresponding controlled API contracts. The UI distinguishes original text, generated summaries, uncertain claims and pending work. Hosted disclosure/decision remains a deliberate library action; no retrieved document or MCP request is treated as that decision.

## 6. C-03 — Local Library API methods

```typescript
interface LocalLibraryAPI {
  askCourse(ctx: LocalCommandContext, request: AskRequest): Promise<Result<AskResult>>;
  createCourse(ctx: LocalCommandContext, title: string): Promise<Result<CourseView>>;
  createFolder(
    ctx: LocalCommandContext, scope: CourseScope, title: string
  ): Promise<Result<{ folderId: FolderId }>>;
  ingest(ctx: LocalCommandContext, request: IngestionRequest): Promise<Result<RunReport>>;
  editMetadata(ctx: LocalCommandContext, edit: MetadataEdit): Promise<Result<DocumentView>>;
  applyReview(
    ctx: LocalCommandContext,
    review: ReviewRequest
  ): Promise<Result<DocumentView>>;
  readOriginalResource(
    ctx: LocalCommandContext, request: OriginalReadRequest
  ): Promise<Result<OriginalResourceChunk>>;
  setJevPermission(
    ctx: LocalCommandContext,
    scope: JevPermissionScope,
    decision: "allow" | "deny" | "revoke"
  ): Promise<Result<JevPermission | null>>;
  getRun(ctx: LocalCommandContext, runId: IngestionRunId): Promise<Result<RunReport>>;
  retryItem(
    ctx: LocalCommandContext, itemRef: IngestionItemRef, step: string
  ): Promise<Result<RunReport>>;
}
```

C-03 validates the actual transport before constructing LocalCommandContext, including local pairing/capability and expected origin. Pairing setup is a deliberate local-user operation, not an open wildcard-origin endpoint; exact credential storage/rotation is reserved for later security design. Input records cannot command arbitrary filesystem paths, URLs or source-provided executable actions.

applyReview accepts only a validated filing/relationship variant and checks exact endpoints/current review revision. Pending filing uses IngestionItemRef plus the explicit target course/folder and review revision; the authorized run owner can confirm membership without inventing a prior course-scoped EvidenceRef. Authority-note edits use MetadataEdit. C-03 writes MVP editable/review data through C-05 and schedules derived work through C-04. Consent writes remain a post-MVP contract. It never calls C-09/C-10 enrichment or C-11 writers directly. UI query operations, including bounded original-resource reading, delegate to EvidenceQueryPort after the same local entry checks; MCP has no command access.

## 7. C-04 — Ingestion Coordinator methods

```typescript
interface IngestionCoordinator {
  accept(ctx: LocalCommandContext, request: IngestionRequest): Promise<Result<RunReport>>;
  advance(runId: IngestionRunId): Promise<Result<RunReport>>;
  retry(
    ctx: LocalCommandContext, itemRef: IngestionItemRef, step: string
  ): Promise<Result<RunReport>>;
  inspect(ctx: LocalCommandContext, runId: IngestionRunId): Promise<Result<RunReport>>;
  cancel(ctx: LocalCommandContext, runId: IngestionRunId): Promise<Result<RunReport>>;
}
```

accept establishes the selected items and durable run/receipt state, preserving originals before derived work. advance is an internal bounded processing operation available only in the authorized library runtime, never an MCP method. It processes exact versions/items, commits immutable extraction output, publishes available lexical text before optional AI/embedding work, and records each independent step result.

retry validates that the selected step/item belongs to the authorized run, retains prior originals and issues new derivation identities when needed. A derived retry does not create a new original content version. cancel stops further run work without deleting evidence already preserved. Detailed scheduling, atomicity, retry limits and recovery algorithms are deferred.

## 8. C-05 — Evidence Store ports

```typescript
interface EvidenceReadPort {
  listCourses(): Promise<Result<readonly CourseView[]>>;
  listDocuments(scope: CourseScope, page: PageRequest): Promise<Result<Page<DocumentView>>>;
  readDocument(scope: CourseScope, documentId: DocumentId): Promise<Result<DocumentView>>;
  readOriginalMetadata(ref: VersionRef): Promise<Result<SourceCitation>>;
  readOriginalBytes(request: OriginalReadRequest): Promise<Result<OriginalResourceChunk>>;
  readExtractedPage(request: FetchDocumentRequest): Promise<Result<FetchedDocument>>;
  readPassage(ref: PassageRef): Promise<Result<FetchedPassage>>;
  readHistory(request: HistoryRequest): Promise<Result<Page<HistoryEntry>>>;
  readClaims(request: ConflictRequest): Promise<Result<Page<FactRef>>>;
  readRelations(
    scope: CourseScope, documentId: DocumentId, page: PageRequest
  ): Promise<Result<Page<RelationshipDraft>>>;
}
interface PermissionReadPort {
  validateExistingPermission(request: AuthorizedJevRequest): Promise<Result<JevPermission>>;
}
interface ProcessingEvidencePort {
  readSelectedOriginal(
    itemRef: IngestionItemRef
  ): Promise<Result<{ bytes: Uint8Array; identity: StoredVersionIdentity }>>;
}
interface EvidenceWritePort {
  createCourse(title: string): Promise<Result<CourseView>>;
  createFolder(scope: CourseScope, title: string): Promise<Result<{ folderId: FolderId }>>;
  preserveOriginal(item: CapturedItem, itemRef: IngestionItemRef): Promise<Result<CaptureReceipt>>;
  attachMembership(scope: CourseScope, documentId: DocumentId, folderId?: FolderId): Promise<Result<DocumentView>>;
  commitExtraction(
    itemRef: IngestionItemRef, draft: ExtractionDraft
  ): Promise<Result<{ identity: StoredVersionIdentity; extractionRevisionId: ExtractionRevisionId; passageIds: readonly PassageId[] }>>;
  editMetadata(edit: MetadataEdit): Promise<Result<DocumentView>>;
  commitReview(review: ReviewRequest): Promise<Result<DocumentView>>;
  commitDerived(
    runId: IngestionRunId,
    output: readonly (SummaryDraft | FactDraft | RelationshipDraft)[]
  ): Promise<Result<readonly string[]>>;
  recordRun(report: RunReport): Promise<Result<RunReport>>;
  savePermission(permission: JevPermission): Promise<Result<JevPermission>>;
}
```

These are distinct capabilities; EvidenceReadPort and ProcessingEvidencePort do not inherit or resolve a write port. The stdio process receives only EvidenceReadPort plus query-side bindings. Post-MVP C-08 decisions use PermissionReadPort internally to validate an already scoped request; this is not a public unscoped grant-lookup tool. The permission reader does not enumerate grants, expose credentials, update counters or confer authority merely because it returns a record.

The processing port additionally requires runtime-established ownership of the authorized run/item; it cannot be reached by an EvidenceRef, URL or arbitrary file path supplied through MCP. It is never injected into C-12.

preserveOriginal publishes a consistent saved identity only after original bytes/metadata are durable. Same source plus unchanged hash reuses the existing version and returns an unchanged CaptureReceipt. A pending item has StoredVersionIdentity, not a fabricated course-scoped EvidenceRef. attachMembership establishes the accepted filing separately. Changed originals create new versions. The physical file/database transaction and interrupted-staging recovery are later design details. commitExtraction creates immutable revision/passage records; it cannot retarget an existing PassageId. Its private receipt contains identity/revision/passage IDs; a course-scoped PassageRef is materialized only after membership is established. commitDerived is restricted to validated exact evidence/allowed scope. Original content, source identity and original dates have no update method.

## 9. C-06 — Extraction Pipeline methods

```typescript
interface ExtractionPipeline {
  capabilities(): Promise<Result<Readonly<Record<string, "available" | "unavailable" | "unsupported">>>>;
  discoverEmbedded(itemRef: IngestionItemRef): Promise<Result<readonly ResourceCandidate[]>>;
  extract(
    itemRef: IngestionItemRef,
    requested: readonly ("native_text" | "ocr" | "transcription" | "original_visual")[]
  ): Promise<Result<ExtractionDraft>>;
}
```

The input resolves only an authorized selected original through ProcessingEvidencePort. New embedded candidates require review before acquisition. Native HTML/text/PDF extraction and original math/diagram preservation/viewing are MVP paths. Scan/image OCR, advanced mathematical/diagram recognition and accessible audio/video acquisition/transcription remain required planned post-MVP paths; their successful operation is not a current MVP acceptance condition. Capability discovery does not claim that an adapter has passed actual-source tests. Outputs include original-relative text/page/region/media locations and disclosed uncertainty. Unsupported/unreadable processing returns the per-resource outcome and reliable partial content where available; it does not substitute a model interpretation for original pixels or verified transcript.

## 10. C-07 — Local AI Gateway methods

```typescript
interface LocalAIGateway {
  capabilities(): Promise<Result<Readonly<Record<"generation" | "embeddings", "available" | "unavailable" | "unsupported">>>>;
  answerGrounded(request: GroundedAnswerInput): Promise<Result<GroundedAnswerDraft>>;
  summarize(
    scope: CourseScope, passages: readonly FetchedPassage[]
  ): Promise<Result<SummaryDraft>>;
  extractFacts(
    scope: CourseScope, passages: readonly FetchedPassage[]
  ): Promise<Result<readonly FactDraft[]>>;
  embed(text: readonly string[], purpose: "index" | "query"): Promise<Result<readonly (readonly number[])[]>>;
}
```

Each request labels source material as untrusted data and validates schema, supporting references, output count and intended scope. No output directly commits facts or grants authority. Local generation and embedding capabilities are measured separately; gemma3:4b is only the initial generative candidate. An unavailable/invalid/timeout result preserves original access and manual/lexical fallback, with no implicit hosted fallback. Query embeddings are transient: this adapter cannot persist query-time caches or acquire index-writer access.

## 11. C-08 — Hosted Jev Gateway methods (post-MVP)

```typescript
interface HostedJevGateway {
  classify(request: AuthorizedJevRequest): Promise<Result<JevDecision>>;
  routeQuery(request: AuthorizedJevRequest): Promise<Result<JevDecision>>;
  rerank(request: AuthorizedJevRequest): Promise<Result<JevDecision>>;
}
```

When the post-MVP gateway is implemented, every method loads and validates the matching active permission before transmission, then checks purpose, destination, current selected-input access, minimized fields/excerpts, payload binding and expiry/revocation. Invalid output IDs/options or unexpected result shapes return invalid_model_output; they are never accepted as new course memberships, commands or source authority. No gateway method creates or expands consent. Missing permission, disallowed data or revoked/expired scope returns hosted_denied, and optional-provider unavailability returns hosted_unavailable. A new authorization must come from C-02/C-03, never from MCP.

## 12. C-09 — Organization and Summary methods

```typescript
interface OrganizationAndSummary {
  suggestFiling(
    itemRef: IngestionItemRef,
    allowedDestinations: readonly { courseId: CourseId; folderId?: FolderId }[],
    hostedRequest?: AuthorizedJevRequest // Post-MVP; omitted from MVP composition.
  ): Promise<Result<FilingSuggestion>>;
  buildSummary(
    scope: CourseScope,
    level: "document" | "topic" | "course",
    supportingPassages: readonly FetchedPassage[],
    affectedInputVersions: readonly VersionRef[]
  ): Promise<Result<SummaryDraft>>;
}
```

suggestFiling cannot invent destinations outside the allowed set. Any provider-assisted automatic filing uses a later configured/validated acceptance condition and remains correctable; uncertain/unavailable results require manual review. buildSummary produces a source-linked draft only for affected inputs. C-04 persists valid output through C-05. Neither method mutates originals, writes indexes or starts a full-library rebuild. Manual metadata/review commands remain in S-03/C-03/C-05 rather than an implicit enrichment call.

## 13. C-10 — Claims and Relations methods

```typescript
interface ClaimsAndRelations {
  draftFacts(scope: CourseScope, passages: readonly FetchedPassage[]): Promise<Result<readonly FactDraft[]>>;
  proposeRelations(
    scope: CourseScope, claims: readonly FactRef[]
  ): Promise<Result<readonly RelationshipDraft[]>>;
  viewPrecedence(
    scope: CourseScope,
    subjectKey: string,
    claimType: string,
    claims: readonly FactRef[],
    establishedRelations: readonly RelationshipDraft[]
  ): Promise<Result<PrecedenceView>>;
}
```

draftFacts and proposeRelations are processing-side draft operations; C-04 validates/persists their output. viewPrecedence is a separate pure query-side binding that reads established evidence and cannot invoke enrichment, store an assessment or accept an LLM assertion as authority.

Only sufficiently matching course/subject/claim contexts are compared. Supporting source/authority/date/supersession evidence must be present for established precedence; capture time or age alone cannot establish it. A known explicit authoritative deadline change may apply even when a separate effective-date field is unknown. Publisher role is established from saved source provenance, with its basis inspectable in PublisherEvidence; a platform label, free-form authority note or model confidence alone is insufficient. Missing/unverified publisher evidence is treated as unknown. A student reply or personal note never supersedes an instructor claim, even if later or explicitly claiming to replace it; a substantive discrepancy remains visible as unresolved competing evidence unless an applicable verified instructor update establishes precedence. Otherwise the view retains competing facts and uncertainty. Exact precedence algorithms and manual-review rules are specified later.

## 14. C-11 — Index and Retrieval ports

```typescript
interface IndexWritePort {
  publishLexical(
    runId: IngestionRunId,
    refs: readonly PassageRef[]
  ): Promise<Result<{ indexed: readonly PassageRef[]; limitations: readonly string[] }>>;
  publishSemantic(
    runId: IngestionRunId,
    refs: readonly PassageRef[]
  ): Promise<Result<{ indexed: readonly PassageRef[]; limitations: readonly string[] }>>;
  refreshMembership(
    runId: IngestionRunId, documentId: DocumentId
  ): Promise<Result<{ documentId: DocumentId }>>;
}
interface EvidenceQueryPort {
  listCourses(): Promise<Result<readonly CourseView[]>>;
  searchCourse(request: SearchRequest): Promise<Result<SearchPage>>;
  fetchDocument(request: FetchDocumentRequest): Promise<Result<FetchedDocument>>;
  fetchPassages(request: FetchPassagesRequest): Promise<Result<readonly FetchedPassage[]>>;
  fetchOriginalResource(request: OriginalReadRequest): Promise<Result<OriginalResourceChunk>>;
  getDocumentHistory(request: HistoryRequest): Promise<Result<Page<HistoryEntry>>>;
  getConflicts(request: ConflictRequest): Promise<Result<Page<PrecedenceView>>>;
}
```

Only S-02's authorized coordinator receives IndexWritePort. S-03 metadata edits enqueue affected work through C-04. Extraction may finish privately for an unfiled item, but course-index publishing first requires an accepted current membership. After that check, lexical publishing follows committed available extraction without waiting for optional summary or embeddings; Jev is not composed into the MVP. Manual filing remains available when those optional capabilities fail. publishSemantic requests local index-purpose embeddings through C-07 inside the writer binding; C-04 does not acquire a direct provider capability. Repeated publishing addresses the same immutable references; identity/duplicate-handling details are later Functional Design.

EvidenceQueryPort composes only read-side dependencies, applies every required filter and checks current membership before returning candidates or exact evidence. In the MVP it may use transient local query embeddings; existing-scope Jev decisions are retained for post-MVP composition only. In either phase it cannot persist embeddings, initialize/migrate stores, create jobs, regenerate summaries or rebuild indexes. Missing/stale projections remain visible and require write-side repair. A keyword fallback success does not satisfy the separate semantic-retrieval acceptance obligation.

getConflicts uses the pure C-10 view with current scoped claims/established evidence. It does not mark a proposal accepted. Returning an applicable claim does not suppress unrelated facts in an earlier syllabus. Failed exact lookup never redirects to latest.

## 15. C-12 — Read-only MCP Adapter methods

```typescript
interface ReadOnlyMCPTools {
  list_courses(): Promise<Result<readonly CourseView[]>>;
  search_course(request: SearchRequest): Promise<Result<SearchPage>>;
  fetch_document(request: FetchDocumentRequest): Promise<Result<FetchedDocument>>;
  fetch_passages(request: FetchPassagesRequest): Promise<Result<readonly FetchedPassage[]>>;
  get_document_history(request: HistoryRequest): Promise<Result<Page<HistoryEntry>>>;
  get_conflicts(request: ConflictRequest): Promise<Result<Page<PrecedenceView>>>;
}
```

These are the six application tool names for the first local stdio integration. Transport lifecycle/message framing is handled by the selected MCP adapter in later implementation; it is not an additional business tool. Schema validation, bounded outputs, safe errors and source-data labels wrap EvidenceQueryPort without adding writes.

All requests other than list_courses require courseId. Exact fetched text pins VersionId and ExtractionRevisionId; passage fetch also pins PassageId. History/conflict results contain only current-scope accessible endpoints. Any original-resource reference returned where supported is opaque/scoped and does not expose arbitrary filesystem paths or grant access outside the selected evidence.

OriginalResourceRef is an opaque handle for an exact course/document/version, never an arbitrary filesystem path. The controlled UI uses the bounded readOriginalResource/fetchOriginalResource path. Where the selected MCP host supports original resources, its optional read-resource handler maps a scoped handle to the same OriginalReadRequest and OriginalResourceChunk contract; it does not add a seventh application tool or bypass membership/range checks. Missing or mismatched handles fail safely. Original viewing uses the saved bytes, with explicit MIME and remaining-range information.

The adapter is constructed without EvidenceWritePort, ProcessingEvidencePort, IngestionCoordinator, IndexWritePort, migration or consent-grant capabilities. Starting it against an absent/incompatible library reports library_unavailable/schema_incompatible and does not create or repair persistence. No saved evidence, permission record, index, summary or use counter changes during a query. Safe operational diagnostics must not dump course content or secrets.

## 16. C-13 — Course Ask contracts

These contracts describe a focused, local course question-and-answer capability, not a general agent with browser or mutation tools. Limits are validated by the runtime; concrete thresholds and cancellation implementation belong to later design.

```typescript
interface AskRequest extends CourseScope {
  requestId: string;
  question: string;
  limits: { maxPassages: number; maxEvidenceCharacters: number; maxAnswerCharacters: number };
}
interface GroundedAnswerInput extends CourseScope {
  question: string;
  passages: readonly FetchedPassage[];
  precedence: readonly PrecedenceView[];
  maxAnswerCharacters: number;
}
interface GroundedAnswerSegment {
  text: string;
  supportingRefs: readonly PassageRef[];
}
interface GroundedAnswerDraft {
  segments: readonly GroundedAnswerSegment[];
  limitations: readonly string[];
}
interface AskResultBase extends CourseScope {
  requestId: string;
  question: string;
  evidence: readonly FetchedPassage[];
  conflicts: readonly PrecedenceView[];
  retrievalMode: SearchPage["retrievalMode"];
  limitations: readonly string[];
}
type AskResult = AskResultBase & (
  | { status: "grounded_answer"; answer: GroundedAnswerDraft }
  | { status: "insufficient_evidence"; answer?: never }
  | { status: "retrieval_only"; reason: "local_model_unavailable"; answer?: never }
);
interface CourseAskOrchestrator {
  ask(request: AskRequest): Promise<Result<AskResult>>;
}
interface AskSessionState extends CourseScope {
  draftQuestion: string;
  activeRequestId?: string;
  result?: AskResult;
  error?: Failure;
}
```

C-03 verifies its actual local client/request context before dispatching to C-13. C-13 uses a local-only EvidenceQueryPort binding: no Jev permission lookup/transmission path is injected. It fetches bounded exact passages, never an automatic full-course upload. Source text is untrusted model input. Empty or inadequate evidence produces insufficient_evidence; an unavailable model produces retrieval_only with actual retrieved passages, not a simulated answer. A runtime failure other than model unavailability returns Result's safe failure branch.

Every grounded answer segment must have at least one validated supporting reference from the fetched set, within the same course and the exact source/document/version/extraction/passage identities. Unknown references, empty grounding, inconsistent scope and invalid shape fail as invalid_model_output; no unvalidated segment is displayed. Reference validation proves reference membership, not semantic entailment: answer quality and faithful support still require later acceptance fixtures. Established updates and unresolved conflicts are taken from saved evidence/precedence views, not invented by the answer model. Insufficient or contradictory evidence is stated plainly rather than silently selecting a date.

C-02 keeps AskSessionState in the app session keyed by courseId while switching tabs. On completion, requestId and courseId must match the originating session before its result/error is stored; it must not overwrite another course or a newer request. Revisiting the originating course restores its draft/result/error and honest pending state. Navigation need not cancel the request, but a cancelled request cannot later replace a completed one. This is transient UI state, not a new persistent conversation, shared-user content or library write. Reload/restart history is not promised by this contract.

C-13 is not composed into C-12. Ask does not add a seventh MCP tool or grant the local model write, browser, network, capture, permission or index-regeneration authority. Current source membership must be revalidated before returning evidence; removal/move during an in-flight request yields a safe scoped failure.

## 17. Failure handling and validation obligations

| Condition | Required contract behavior |
|---|---|
| Wrong course or hidden/missing ID | not_found_in_scope; no foreign evidence or existence disclosure. |
| Inconsistent authorized version/passage/revision | reference_mismatch; no silent reinterpretation. |
| Pending/partial/unsupported resource | Return exact status and available evidence/limitations; no fabricated successful extraction. |
| Missing original or extraction revision | original_unavailable/processing_not_ready or the resource's explicit limitation; previously issued IDs do not change meaning. |
| Stale metadata edit | metadata_conflict with safe reload guidance; immutable original remains unchanged. |
| Local generation or embedding unavailable | local_model_unavailable or unsupported; preserve original/lexical/manual operations. |
| Post-MVP Jev denied/revoked/expired/mismatched | hosted_denied before transmission; local/manual alternative remains available. |
| Post-MVP Jev/network/shape failure | hosted_unavailable/invalid_model_output; no unvalidated IDs or invented source facts. |
| Missing/stale index in query process | index_unavailable or visible not-ready/fallback state; no automatic index writer. |
| Incompatible/missing local store in MCP | schema_incompatible/library_unavailable; no query-time initialization or migration. |
| Ask model unavailable or evidence inadequate | Explicit retrieval_only or insufficient_evidence; no invented answer or hosted fallback. |
| Ask returns an unknown/foreign/ungrounded citation | invalid_model_output or scoped failure; never display the invalid answer. |
| Selected child failure after parent success | Independent child report and run issues remain visible; parent completeness cannot hide it. |

MVP verification must exercise Ask grounding, empty evidence, unresolved conflicts, invalid citations, local-model outage, no query-time library writes and two-course/navigation/in-flight isolation. Later verification must exercise exact-reference serialization/round trips, version/passages immutability, unchanged/changed recaptures, cross-course search and direct-fetch/history/conflict denial, semantic versus lexical mode and actual Codex CLI search-then-fetch. Post-MVP verification additionally covers denied/allowed/revoked hosted payload inspection, OCR/recognition and media acquisition/transcription. These are future acceptance obligations, not reported test results.

All planned original/source formats in [components](components.md) and US-01–US-07 remain in the product catalogue with explicit delivery phases. Native extraction and original viewing are MVP work; US-05/US-06 and advanced-recognition portions of US-07 are post-MVP. Concrete deferred OCR/transcription/provider adapters will be designed and validated in that later iteration; local embedding, API transport, physical database and business-rule detail remain later authorized MVP design work.
