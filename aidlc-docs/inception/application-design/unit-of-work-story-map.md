# Course Copilot — Unit of Work Story Map

**Stage:** Inception / Units Generation / Part 2: Generation

**Status:** Generated from the approved plan and explicitly approved with the other unit artifacts on 2026-11-20T04:20:19Z. Evidence below is a future acceptance obligation, not an implemented capability or passing test.

**Unit:** U-01 — Local Course Copilot. All 25 stories, 15 functional requirements and seven non-functional requirements belong to this one integrated local product.

**Inputs:** [Approved unit plan](../plans/unit-of-work-plan.md), [approved stories](../user-stories/stories.md), [requirements](../requirements/requirements.md), [approved design](application-design.md) and [component contracts](component-methods.md).

## 1. Responsibility conventions

- Each story has exactly one unit and one primary module. Supporting modules are dependencies/integration participants, not additional units or duplicate primary assignments.
- A primary module gathers its story evidence. U-01 owns integrated acceptance; isolated module/fixture success cannot close a story requiring actual source or host integration.
- Named module and integrated-acceptance owners remain **Unassigned** for later team claiming. The single AI-DLC driver maintains audit/state and is not implicitly assigned all engineering work.
- Shared root types/tests/configuration support the nine modules without creating another module, Unit of Work or independently hosted service.

## 2. Approved modules inside U-01

| Module | Component responsibility | Named owner |
|---|---|---|
| M-01 Capture | C-01; deliberate Chrome page/selected embedded-resource capture. | Unassigned |
| M-02 Library UI | C-02; browse/import/review and original/history/conflict viewing. | Unassigned |
| M-03 API and Workflow | C-03/C-04; controlled local commands, durable original-first ingestion, status and recovery. | Unassigned |
| M-04 Evidence | C-05; local persistence, independent membership/identity, immutable evidence and separated ports. | Unassigned |
| M-05 Extraction | C-06; native text, OCR, original math/diagram fidelity and accessible media transcription. | Unassigned |
| M-06 Model Gateways | C-07/C-08; local generation/embedding and separate permission-checked minimal Jev decisions. | Unassigned |
| M-07 Knowledge | C-09/C-10; filing/summary/fact/relation drafts and pure claim-scoped precedence/conflicts. | Unassigned |
| M-08 Index and Query | C-11; incremental lexical/vector writer and separately composed scoped read-only retrieval. | Unassigned |
| M-09 MCP | C-12; six local stdio read tools and optional scoped original-resource handler. | Unassigned |

## 3. Story allocation and future acceptance evidence

The evidence column summarizes rather than replaces each story's complete Given/When/Then conditions. Success/failure controls remain required. Every row has status **Specified; not run**.

| Story and outcome | Unit | Primary module | Supporting modules | Required future acceptance evidence |
|---|---|---|---|---|
| US-01 Save the viewed course page | U-01 | M-01 | M-03, M-04, M-05 | Actual selected save on all three LMS sites and ordinary web; source/capture/original inspection, credential exclusion and no-save control. |
| US-02 Import a paper/local document | U-01 | M-02 | M-03, M-04, M-05 | Actual external paper/PDF and local import; original bytes/provenance; invalid/unsupported input. |
| US-03 Select embedded resources | U-01 | M-01 | M-02, M-03, M-04, M-05 | Accessible selected PDF, unselected discovery and inaccessible embed; independent child result and permitted manual recovery. |
| US-04 Search native extracted text | U-01 | M-05 | M-03, M-04, M-08 | Known HTML/PDF body phrases retrieve exact source/page passages; missing-text and extraction-failure controls. |
| US-05 Find scan/image text | U-01 | M-05 | M-02, M-03, M-04, M-08 | Cleared scan/image known phrases, original-to-text locations, unreadable case and measured extraction limits. |
| US-06 Retrieve accessible media evidence | U-01 | M-05 | M-01, M-03, M-04, M-08 | Actual permitted audio/video transcription with known spoken phrases/segments; protected/unsupported case without access bypass. |
| US-07 Inspect equations/diagrams | U-01 | M-05 | M-02, M-04, M-08 | Original math/diagram viewing and reliable notation/text retrieval; uncertain regions disclosed and originals unchanged. |
| US-08 Separate courses/topics | U-01 | M-04 | M-02, M-03, M-08 | Two courses with overlapping titles/tags, persistent filing after restart and scoped browsing without leakage. |
| US-09 Review uncertain filing | U-01 | M-07 | M-02, M-03, M-04, M-06 | Confident/uncertain/unavailable suggestions and manual correction; actual permitted Jev behavior checked separately. |
| US-10 Correct metadata | U-01 | M-04 | M-02, M-03, M-07, M-08 | Edit permitted fields/move course, reject stale edits, retain originals/versions and check old/new scope consistency. |
| US-11 Incremental sourced summaries | U-01 | M-07 | M-03, M-04, M-06, M-08 | Affected/unaffected processing, exact summary citations and actual local-model smoke test; failure preserves lexical/original access. |
| US-12 Inspect source/capture details | U-01 | M-04 | M-02, M-08 | Web/local-only originals, exact saved-version viewing and distinct captured/published/effective dates; unknown values remain unknown. |
| US-13 Recapture with history | U-01 | M-04 | M-01, M-03, M-08 | Same/changed/failed recapture, unchanged CaptureReceipt, retained originals and generated valid-record version/serialization invariants. |
| US-14 Inspect relationships | U-01 | M-07 | M-02, M-03, M-04, M-08 | Separate syllabus/announcement and proposed duplicate link; exact endpoints/basis without source or original merging. |
| US-15 Browse history/applicable evidence | U-01 | M-08 | M-02, M-04, M-07, M-09 | Saved-version browsing, applicable-evidence default and old unchanged-document control; no inferred live freshness. |
| US-16 Inspect substantive claims | U-01 | M-07 | M-02, M-04, M-05, M-06 | Deadline/exam-location/assignment-policy evidence; ambiguous subject/date and different-assignment non-conflict controls. |
| US-17 Follow authoritative updates | U-01 | M-07 | M-04, M-08, M-09 | Explicit 11/20-to-11/22 update, later old-syllabus recapture and uncertain-authority controls; claim-scoped precedence with both sources. |
| US-18 Inspect unresolved conflicts | U-01 | M-07 | M-02, M-04, M-08, M-09 | Same-assignment competing claims without precedence; retain both sources; different-assignment and age-only controls. |
| US-19 Search by words/meaning | U-01 | M-08 | M-04, M-06, M-07, M-09 | Labeled exact/paraphrase lexical and actual semantic paths; course/filter isolation and disclosed Jev-disabled fallback. |
| US-20 Inspect compact previews | U-01 | M-08 | M-04, M-07, M-09 | Bounded sourced previews, summary labels, conflict flags and no-match control; no implicit whole-course/full-document response. |
| US-21 Fetch exact selected evidence | U-01 | M-08 | M-04, M-05, M-09 | Reference round trip, pinned version/extraction/passage, bounded full-content pagination, partial response and direct scope denial. |
| US-22 Use read-only Codex MCP | U-01 | M-09 | M-03, M-04, M-08 | Actual Codex CLI search/fetch; six tools, local access boundary, unchanged persistent state and external host/model disclosure. |
| US-23 Recover processing gaps | U-01 | M-03 | M-01, M-02, M-04, M-05, M-06, M-08 | Independent complete/partial/failed/unsupported items, separate run/step progress and actual manual recovery without original loss. |
| US-24 Control hosted/untrusted processing | U-01 | M-06 | M-01, M-02, M-03, M-04, M-07, M-08, M-09 | Denied/allowed/revoked exact-scope payload inspection and adversarial source data; no implicit full-file/secret upload or MCP consent grant. |
| US-25 Operate without AI/network | U-01 | M-03 | M-02, M-04, M-06, M-07, M-08, M-09 | AI/network-disabled local import/manual-file and saved-library browse/search after restart; actual Ollama hardware/model/version/latency record, including failures. |

## 4. Functional coverage and verification responsibility

All rows belong to U-01. Verification lead means an internal technical responsibility, not an assigned person or separate unit. Supporting participation follows the story table.

| Requirement | Mapped stories | Verification lead | Acceptance responsibility |
|---|---|---|---|
| FR-01 Multi-course organization | US-08, US-19, US-21 | M-04, with M-08 | Independent membership; isolate browsing/search/direct fetch with overlapping labels. |
| FR-02 Page/file capture | US-01, US-02 | M-01, with M-02 | Actual three-LMS and ordinary web/paper/PDF/local import coverage; explicit selection. |
| FR-03 Embedded resources | US-03, US-06, US-23 | M-01, with M-03/M-05 | Discovery/selection, permitted capture, independent omissions and manual recovery. |
| FR-04 Original provenance | US-01, US-02, US-03, US-07, US-12, US-13 | M-04 | Preserve original, source/import identity, capture provenance and distinct known dates. |
| FR-05 Accessible extraction | US-02, US-04, US-05, US-06, US-07, US-23 | M-05 | Native/OCR/visual/math/media successes with exact locations and honest limits. |
| FR-06 Filing/correction | US-09, US-10, US-24, US-25 | M-07, with M-04/M-06 | Review/correct metadata and membership, hosted permission and manual fallback. |
| FR-07 Incremental knowledge | US-11 | M-07, with M-08 | Update affected sourced summaries/passages; actual local generation and retained fallback. |
| FR-08 Typed relationships | US-14, US-17, US-18 | M-07 | Inspect proposed/established endpoints/basis without silent identity merging. |
| FR-09 Immutable history | US-10, US-13, US-14, US-15 | M-04 | Metadata/re-extraction preserve originals; distinguish observations and content versions. |
| FR-10 Substantive precedence | US-16, US-17 | M-07 | Matching course/subject/claim and explicit authority/update evidence; retain uncertainty. |
| FR-11 Unresolved conflicts | US-18, US-20 | M-07, with M-08 | Both competing sources and relevant preview flags; no age-only alert. |
| FR-12 Hybrid filtered retrieval | US-19, US-24, US-25 | M-08 | Both lexical/semantic paths, required filters, permitted reranking and fallback. |
| FR-13 Progressive access | US-20, US-21, US-22 | M-08, with M-09 | Bounded preview, exact cited fetch/pagination and actual client integration. |
| FR-14 Read-only Codex | US-22 | M-09 | Actual local stdio flow without commands, ingestion, migrations or query-time writes/regeneration. |
| FR-15 Applicable saved evidence | US-15, US-17, US-19 | M-08, with M-04/M-07 | Retain history/unrelated facts; no unseen-update claim or historical as-of feature. |

## 5. Non-functional coverage and verification responsibility

| Requirement | Mapped stories | Verification lead and supports | Required future verification |
|---|---|---|---|
| NFR-01 Local-first | US-08, US-22, US-25 | M-03; M-02/M-04/M-09 | Local persistence/restart and core use without cloud hosting/account, LMS key or paid-model dependency. |
| NFR-02 Controlled boundaries | US-01, US-03, US-06, US-09, US-22, US-24 | M-03; M-01/M-04/M-06/M-08/M-09 | Pairing/origin/input control, credential exclusion, scoped reads, minimal consent and untrusted-data handling. |
| NFR-03 Traceable evidence | US-01, US-02, US-04–US-07, US-10–US-22 | M-04; M-05/M-07/M-08/M-09 | Exact source/version/extraction/passage/location round trips and date meaning; no invented freshness/authority. |
| NFR-04 Honest completeness | US-01–US-07, US-16, US-21, US-23 | M-03; M-01/M-02/M-04/M-05/M-07/M-08 | Independent item outcomes and run/step state; disclose partial children/fetches and uncertainty with recovery. |
| NFR-05 Jev fallback | US-09, US-19, US-25 | M-08; M-03/M-04/M-06/M-07 | Deny/disable/fail Jev; retain manual filing and local keyword/metadata access with visible mode. |
| NFR-06 Repeatable acceptance | All US-01–US-25 | M-03 integration; M-04/M-07/M-08/M-09 | Repeatable fixtures, actual source/Codex evidence and partial property obligations below; no mock-only closure. |
| NFR-07 Practical cost/latency | US-11, US-25 | M-06; M-03/M-07/M-08 | Actual local model/hardware/version and observed behavior/latency; incremental work and core availability survive AI failure. |

## 6. Source and format evidence retained

This register makes the approved breadth explicit. Each row remains required within U-01; an inaccessible control or valid JSON response alone cannot satisfy a required successful accessible case.

| Source or format | Primary verification area | Required future evidence |
|---|---|---|
| Canvas | M-01/M-03 | Actual user-authorized selected page save and provenance inspection. |
| Gradescope | M-01/M-03 | Actual user-authorized selected page save and provenance inspection. |
| EdStem | M-01/M-03 | Actual user-authorized selected page save and provenance inspection. |
| Ordinary web and external papers | M-01/M-02 | Actual accessible page/paper import linked to its safe original URL. |
| PDF and local file import | M-02/M-05 | Actual selected bytes, source/import identity and native-text or disclosed extraction outcome. |
| Linked/embedded resources | M-01/M-05 | Accessible selected resource, unselected discovery, inaccessible child and permitted manual recovery. |
| Native HTML/PDF text | M-05/M-08 | Known body phrase retrieved with exact original/version/page or passage. |
| Scans/images/OCR | M-05 | Cleared readable scan/image and unreadable control; original linkage and quality limits. |
| Equations/diagrams | M-05/M-02 | Exact original visual viewing, reliable extracted notation/text and explicit uncertain regions. |
| Accessible audio | M-05/M-08 | Permitted spoken phrase, searchable transcript and media/segment provenance. |
| Accessible video | M-05/M-08 | Permitted spoken phrase, original media/segment reference and unavailable/protected control. |

## 7. U-01 integrated acceptance

- **Conceptual evidence:** Deliberate capture/import, accepted course filing, honest extraction, source-linked indexing and compact search/exact fetch through actual Codex. Direct out-of-course IDs fail even when an index is stale.
- **Changed instructions:** Preserve syllabus and explicit later announcement, favor the supported changed deadline and retain unrelated syllabus facts. Recapturing old material cannot reverse established precedence; absent a grounded winner, show both claims.
- **Integrity and recovery:** Pending originals stay private to the authorized run until membership is accepted. After accepted filing, lexical publication follows available extraction before optional summary/claim/vector enrichment; permitted pre-filing classification can still suggest a destination with manual fallback. Retry/re-extraction retain originals, exact older references and capture receipts; stale edits do not overwrite silently.
- **Trust and fallback:** Exercise denied/revoked/mismatched hosted permission, source instructions as untrusted data, AI/network outage, restart and actual read-only stdio. Disclose external Codex/model processing independently of Jev grants.
- **Evidence closure:** M-03 coordinates technical integration records, M-09 supplies actual host evidence and primary modules supply results/limitations. Complete unit acceptance needs their combined record; named integration owner remains Unassigned.

The source/format register and every approved story criterion remain part of this combined acceptance. The early native-text slice is integration order only, not scope reduction.

## 8. Partial property-testing obligations

The approved partial scope covers pure transformations, serialization/evidence-reference round trips and version invariants, using realistic domain generators, shrinking and reproducible seeds.

M-04 leads identity/version/extraction-reference properties; M-07 leads claim/precedence invariants; M-08/M-09 lead scope-preserving query/reference serialization and read-only boundary cases; M-03 integrates the evidence.

Include unchanged recapture without duplicate originals, metadata/re-extraction without original mutation, stable exact references, matching-course/subject claim comparison and exclusion of out-of-course results.

Properties supplement actual integration evidence. They do not establish authenticated LMS access, OCR/STT quality, semantic relevance, hosted-provider behavior or actual Codex compatibility. Executable tests, framework setup and measurements belong to later authorized Construction.

## 9. Review boundary

This story map allocates the complete approved scope. It introduces no application code/directories, additional persona, independent service, assigned person or runtime success claim.

The single generated-unit review is in [unit-of-work.md](unit-of-work.md); this map adds no question or approval field. Separate generated-artifact approval is recorded; Inception documentation is complete and the workflow stops before Construction for the November 24 checkpoint.
