# Course Copilot — Unit of Work Story Map

> **Approved corrective Inception artifacts - November 23, 2026:** [Lawrence's maintainer approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) at 2026-11-23T22:37:29Z covers the revised artifacts through Units Generation, including Ask/local MCP and documented Jev/media deferrals. Historical approvals remain recorded separately. STOP before Construction.

**Stage:** Inception / Units Generation / Part 2: Generation

**Status:** Corrective story map approved by Lawrence at 2026-11-23T22:37:29Z as part of Inception through Units Generation. The earlier approval on 2026-11-20T04:20:19Z remains historical. Evidence below is a future runtime acceptance obligation, not an implemented capability or passing test.

**Unit:** U-01 — Local Course Copilot. The retained planning catalog contains 26 stories, 16 functional requirements and seven NFRs in one integrated local product. The phase columns below distinguish current-MVP obligations from post-MVP work; retained features are not cancelled.

**Inputs:** [Unit plan](../plans/unit-of-work-plan.md), [stories](../user-stories/stories.md), [requirements](../requirements/requirements.md), [design](application-design.md) and [component contracts](component-methods.md).

**Delivery phases:** The [MVP scope and deferred-feature catalog](../requirements/mvp-scope.md) distinguishes current acceptance from retained post-MVP work. All 26 story IDs, 16 FRs, seven NFRs, 13 component IDs, five services and U-01/nine modules remain in the planning catalog. A retained future contract is not a current-MVP dependency or acceptance blocker.

## 1. Responsibility conventions

- Each story has exactly one unit and one primary module. Supporting modules are dependencies/integration participants, not additional units or duplicate primary assignments.
- A primary module gathers its story evidence. U-01 owns integrated acceptance; isolated module/fixture success cannot close a story requiring actual source or host integration.
- Named module leads below are **Proposed; acceptance pending**. Integrated-acceptance ownership still requires confirmation. The single AI-DLC driver maintains audit/state and is not implicitly assigned all engineering work.
- Shared root types/tests/configuration support the nine modules without creating another module, Unit of Work or independently hosted service.

## 2. Current draft modules inside U-01

| Module | Component responsibility | Proposed lead; acceptance pending |
|---|---|---|
| M-01 Capture | C-01; deliberate Chrome page/selected embedded-resource capture. | Safi; pending |
| M-02 Library UI | C-02; browse/import/review, original/history/conflict viewing and per-course Ask state. | Iris; pending |
| M-03 API and Workflow | C-03/C-04/C-13; controlled ingestion/recovery and separately composed read-only local Ask. | Lawrence; pending |
| M-04 Evidence | C-05; local persistence, independent membership/identity, immutable evidence and separated ports. | Lawrence; pending |
| M-05 Extraction | C-06; MVP native text/PDF and original visual fidelity; post-MVP OCR, advanced visual recognition and media transcription. | Chloe; pending |
| M-06 Model Gateways | C-07/C-08; MVP local generation/embedding; C-08/Jev and its hosted-consent path retained post-MVP. | Xiaolong; pending |
| M-07 Knowledge | C-09/C-10; filing/summary/fact/relation drafts and pure claim-scoped precedence/conflicts. | Chloe; pending |
| M-08 Index and Query | C-11; incremental lexical/vector writer and separately composed scoped read-only retrieval. | Xiaolong; pending |
| M-09 MCP | C-12; six local stdio read tools and optional scoped original-resource handler. | Safi; pending |

These names come from Lawrence's [review proposal](https://github.com/lawrencegranda/INFO-5940-project/pull/8#discussion_r4660293171), not recorded personal commitments. Added Ask work does not establish accepted capacity.

## 3. Story allocation and future acceptance evidence

The evidence column summarizes the retained story criteria. The delivery phase controls current acceptance: post-MVP criteria remain planned without blocking the MVP. Every evidence item has status **Specified; not run**.

| Story and outcome | Unit | Primary module | Supporting modules | Required future acceptance evidence | Delivery phase |
|---|---|---|---|---|---|
| US-01 Save the viewed course page | U-01 | M-01 | M-03, M-04, M-05 | Actual selected save on all three LMS sites and ordinary web; source/capture/original inspection, credential exclusion and no-save control. | MVP |
| US-02 Import a paper/local document | U-01 | M-02 | M-03, M-04, M-05 | Actual external paper/PDF and local import; original bytes/provenance; invalid/unsupported input. | MVP |
| US-03 Select embedded resources | U-01 | M-01 | M-02, M-03, M-04, M-05 | Accessible selected PDF, unselected discovery and inaccessible embed; independent child result and permitted manual recovery. | MVP |
| US-04 Search native extracted text | U-01 | M-05 | M-03, M-04, M-08 | Known HTML/PDF body phrases retrieve exact source/page passages; missing-text and extraction-failure controls. | MVP |
| US-05 Find scan/image text | U-01 | M-05 | M-02, M-03, M-04, M-08 | Retained later OCR evidence: cleared scan/image phrases, original-to-text locations, unreadable controls and extraction limits. | Post-MVP |
| US-06 Retrieve accessible media evidence | U-01 | M-05 | M-01, M-03, M-04, M-08 | Retained later media evidence: permitted acquisition/transcription, spoken phrases/segments and protected/unsupported controls without bypass. | Post-MVP |
| US-07 Inspect equations/diagrams | U-01 | M-05 | M-02, M-04, M-08 | MVP original math/diagram viewing without fabricated extraction; later reliable notation/visual recognition with uncertain regions disclosed. | MVP original viewing; recognition post-MVP |
| US-08 Separate courses/topics | U-01 | M-04 | M-02, M-03, M-08 | Two courses with overlapping titles/tags, persistent filing after restart and scoped browsing without leakage. | MVP |
| US-09 Review uncertain filing | U-01 | M-07 | M-02, M-03, M-04, M-06 | MVP local suggestions, uncertainty and manual correction; retained Jev provider/consent behavior is verified after MVP. | MVP local/manual; Jev post-MVP |
| US-10 Correct metadata | U-01 | M-04 | M-02, M-03, M-07, M-08 | Edit permitted fields/move course, reject stale edits, retain originals/versions and check old/new scope consistency. | MVP |
| US-11 Incremental sourced summaries | U-01 | M-07 | M-03, M-04, M-06, M-08 | Affected/unaffected processing, exact summary citations and actual local-model smoke test; failure preserves lexical/original access. | MVP |
| US-12 Inspect source/capture details | U-01 | M-04 | M-02, M-08 | Web/local-only originals, exact saved-version viewing and distinct captured/published/effective dates; unknown values remain unknown. | MVP |
| US-13 Recapture with history | U-01 | M-04 | M-01, M-03, M-08 | Same/changed/failed recapture, unchanged CaptureReceipt, retained originals and generated valid-record version/serialization invariants. | MVP |
| US-14 Inspect relationships | U-01 | M-07 | M-02, M-03, M-04, M-08 | Separate syllabus/announcement and proposed duplicate link; exact endpoints/basis without source or original merging. | MVP |
| US-15 Browse history/applicable evidence | U-01 | M-08 | M-02, M-04, M-07, M-09 | Saved-version browsing, applicable-evidence default and old unchanged-document control; no inferred live freshness. | MVP |
| US-16 Inspect substantive claims | U-01 | M-07 | M-02, M-04, M-05, M-06 | Deadline/exam-location/assignment-policy evidence; ambiguous subject/date and different-assignment non-conflict controls. | MVP |
| US-17 Follow authoritative updates | U-01 | M-07 | M-04, M-08, M-09 | Supported instructor 11/20-to-11/22 update, later old-syllabus recapture, student note claiming 11/24 and unknown-publisher controls; platform/type/recency alone cannot establish authority. | MVP |
| US-18 Inspect unresolved conflicts | U-01 | M-07 | M-02, M-04, M-08, M-09 | Same-assignment competing claims without precedence; retain roles, uncertainty and both sources. A later student note/reply cannot supersede instructor evidence. Include different-assignment and age-only controls. | MVP |
| US-19 Search by words/meaning | U-01 | M-08 | M-04, M-06, M-07, M-09 | Labeled exact/paraphrase lexical and actual semantic paths with course/filter isolation. Later Jev reranking is not needed for MVP acceptance. | MVP local hybrid; Jev reranking post-MVP |
| US-20 Inspect compact previews | U-01 | M-08 | M-04, M-07, M-09 | Bounded sourced previews, summary labels, conflict flags and no-match control; no implicit whole-course/full-document response. | MVP |
| US-21 Fetch exact selected evidence | U-01 | M-08 | M-04, M-05, M-09 | Reference round trip, pinned version/extraction/passage, bounded full-content pagination, partial response and direct scope denial. | MVP |
| US-22 Use read-only Codex MCP | U-01 | M-09 | M-03, M-04, M-08 | Actual Codex CLI search/fetch; six tools, local access boundary, unchanged persistent state and external host/model disclosure. | MVP |
| US-23 Recover processing gaps | U-01 | M-03 | M-01, M-02, M-04, M-05, M-06, M-08 | Independent complete/partial/failed/unsupported items, separate run/step progress and actual manual recovery without original loss. | MVP |
| US-24 Control hosted/untrusted processing | U-01 | M-06 | M-01, M-02, M-03, M-04, M-07, M-08, M-09 | MVP adversarial-source and read-only/no-implicit-upload controls; later hosted consent adds denied/allowed/revoked exact-scope payload checks. | MVP untrusted-data controls; hosted consent post-MVP |
| US-25 Operate without AI/network | U-01 | M-03 | M-02, M-04, M-06, M-07, M-08, M-09 | AI/network-disabled local import/manual-file and saved-library browse/search after restart; actual Ollama hardware/model/version/latency record, including failures. | MVP |
| US-26 Ask about the selected course locally | U-01 | M-03 | M-02, M-04, M-06, M-08 | Grounded answer with validated exact saved citations; insufficient/conflicting evidence; invalid/unavailable local model gives disclosed retrieval-only/error; per-course draft/result/error retention and in-flight course-switch isolation; no library mutations or remote ChatGPT integration. | MVP |

## 4. Functional coverage and verification responsibility

All rows belong to U-01. Verification lead means an internal technical responsibility, not an assigned person or separate unit. Supporting participation follows the story table.

| Requirement | Mapped stories | Verification lead | Acceptance responsibility | Delivery phase |
|---|---|---|---|---|
| FR-01 Multi-course organization | US-08, US-19, US-21 | M-04, with M-08 | Independent membership; isolate browsing/search/direct fetch with overlapping labels. | MVP |
| FR-02 Page/file capture | US-01, US-02 | M-01, with M-02 | Actual three-LMS and ordinary web/paper/PDF/local import coverage; explicit selection. | MVP |
| FR-03 Embedded resources | US-03, US-06, US-23 | M-01, with M-03/M-05 | Discovery/selection, permitted capture, independent omissions and manual recovery. | MVP embedded PDF; media processing post-MVP |
| FR-04 Original provenance | US-01, US-02, US-03, US-07, US-12, US-13 | M-04 | Preserve original, source/import identity, capture provenance and distinct known dates. | MVP |
| FR-05 Accessible extraction | US-02, US-04, US-05, US-06, US-07, US-23 | M-05 | MVP native text/PDF success with exact locations, preserved originals and honest limits; later OCR/advanced visual/media success retains its own acceptance. | MVP native text/PDF; OCR/advanced media post-MVP |
| FR-06 Filing/correction | US-09, US-10, US-24, US-25 | M-07, with M-04/M-06 | MVP local/manual filing, metadata/membership correction and fallback; hosted Jev permission is post-MVP. | MVP local/manual; Jev post-MVP |
| FR-07 Incremental knowledge | US-11 | M-07, with M-08 | Update affected sourced summaries/passages; actual local generation and retained fallback. | MVP |
| FR-08 Typed relationships | US-14, US-17, US-18 | M-07 | Inspect proposed/established endpoints/basis without silent identity merging. | MVP |
| FR-09 Immutable history | US-10, US-13, US-14, US-15 | M-04 | Metadata/re-extraction preserve originals; distinguish observations and content versions. | MVP |
| FR-10 Substantive precedence | US-16, US-17 | M-07 | Matching course/subject/claim and explicit authority/update evidence; retain uncertainty. | MVP |
| FR-11 Unresolved conflicts | US-18, US-20 | M-07, with M-08 | Both competing sources and relevant preview flags; no age-only alert. | MVP |
| FR-12 Hybrid filtered retrieval | US-19, US-24, US-25 | M-08 | MVP lexical/semantic paths, required filters and fallback; hosted reranking remains planned for later work. | MVP local hybrid; Jev reranking post-MVP |
| FR-13 Progressive access | US-20, US-21, US-22 | M-08, with M-09 | Bounded preview, exact cited fetch/pagination and actual client integration. | MVP |
| FR-14 Read-only Codex | US-22 | M-09 | Actual local stdio flow without commands, ingestion, migrations or query-time writes/regeneration. | MVP |
| FR-15 Applicable saved evidence | US-15, US-17, US-19 | M-08, with M-04/M-07 | Retain history/unrelated facts; no unseen-update claim or historical as-of feature. | MVP |
| FR-16 Local course Ask | US-26 | M-03, with M-02/M-04/M-06/M-08 | Bound selected-course retrieval/local generation, validated exact citations, insufficient/conflicting evidence, per-course navigation continuity and honest model-failure behavior without library-write capabilities. | MVP |

## 5. Non-functional coverage and verification responsibility

| Requirement | Mapped stories | Verification lead and supports | Required future verification | Delivery phase |
|---|---|---|---|---|
| NFR-01 Local-first | US-08, US-22, US-25, US-26 | M-03; M-02/M-04/M-09 | Local persistence/restart and core use without cloud hosting/account, LMS key or paid-model dependency. | MVP, applied again to later retained features |
| NFR-02 Controlled boundaries | US-01, US-03, US-06, US-09, US-22, US-24, US-26 | M-03; M-01/M-04/M-06/M-08/M-09 | MVP pairing/origin/input control, credential exclusion, scoped reads and untrusted-data handling; hosted consent is verified later. | MVP local controls/fallback; hosted Jev verification post-MVP |
| NFR-03 Traceable evidence | US-01, US-02, US-04–US-07, US-10–US-22, US-26 | M-04; M-05/M-07/M-08/M-09 | Exact source/version/extraction/passage/location round trips and date meaning; no invented freshness/authority. | MVP, applied again to later retained features |
| NFR-04 Honest completeness | US-01–US-07, US-16, US-21, US-23, US-26 | M-03; M-01/M-02/M-04/M-05/M-07/M-08 | Independent item outcomes and run/step state; disclose partial children/fetches and uncertainty with recovery. | MVP, applied again to later retained features |
| NFR-05 Local and future hosted fallback | US-09, US-19, US-25 | M-08; M-03/M-04/M-06/M-07 | MVP manual filing/local retrieval remain usable without hosted services; future Jev integration separately verifies denial/disable/failure fallback. | MVP local controls/fallback; hosted Jev verification post-MVP |
| NFR-06 Repeatable acceptance | All US-01–US-26 | M-03 integration; M-04/M-07/M-08/M-09 | Repeatable fixtures, current-MVP source/Codex/Ask evidence and partial properties; deferred cases remain separately planned. | MVP, applied again to later retained features |
| NFR-07 Practical cost/latency | US-11, US-25, US-26 | M-06; M-03/M-07/M-08 | Actual local model/hardware/version and observed behavior/latency; incremental work and core availability survive AI failure. | MVP, applied again to later retained features |

## 6. Source and format evidence retained

This register retains the complete format roadmap. Current-MVP rows require successful evidence; post-MVP rows remain planned and do not block MVP completion. Unsupported status cannot be misrepresented as successful extraction.

| Source or format | Primary verification area | Required future evidence | Delivery phase |
|---|---|---|---|
| Canvas | M-01/M-03 | Actual user-authorized selected page save and provenance inspection. | MVP |
| Gradescope | M-01/M-03 | Actual user-authorized selected page save and provenance inspection. | MVP |
| EdStem | M-01/M-03 | Actual user-authorized selected page save and provenance inspection. | MVP |
| Ordinary web and external papers | M-01/M-02 | Actual accessible page/paper import linked to its safe original URL. | MVP |
| PDF and local file import | M-02/M-05 | Actual selected bytes, source/import identity and native-text or disclosed extraction outcome. | MVP |
| Linked/embedded resources | M-01/M-05 | Accessible selected resource, unselected discovery, inaccessible child and permitted manual recovery. | MVP PDF/native resources; media acquisition/transcription post-MVP |
| Native HTML/PDF text | M-05/M-08 | Known body phrase retrieved with exact original/version/page or passage. | MVP |
| Scans/images/OCR | M-05 | Cleared readable scan/image and unreadable control; original linkage and quality limits. | Post-MVP |
| Equations/diagrams | M-05/M-02 | Exact original visual viewing in MVP; reliable recognition and extracted notation/text retained for later work. | MVP original viewing; recognition post-MVP |
| Accessible audio | M-05/M-08 | Permitted spoken phrase, searchable transcript and media/segment provenance. | Post-MVP |
| Accessible video | M-05/M-08 | Permitted spoken phrase, original media/segment reference and unavailable/protected control. | Post-MVP |

## 7. U-01 integrated acceptance

- **Conceptual evidence:** Deliberate capture/import, accepted course filing, honest extraction, source-linked indexing and compact search/exact fetch through actual Codex and grounded local Ask with validated citations. Direct out-of-course IDs fail even when an index is stale.
- **Changed instructions:** Preserve syllabus and explicit later announcement, favor the supported changed deadline and retain unrelated syllabus facts. Recapturing old material cannot reverse established precedence; absent a grounded winner, show both claims.
- **Integrity and recovery:** Pending originals stay private to the authorized run until membership is accepted. After accepted filing, lexical publication follows available extraction before optional summary/claim/vector enrichment; permitted pre-filing classification can still suggest a destination with manual fallback. Retry/re-extraction retain originals, exact older references and capture receipts; stale edits do not overwrite silently.
- **Trust and fallback:** Exercise source instructions as untrusted data, AI/network outage, restart and actual read-only stdio in the MVP. Disclose external Codex/model processing separately. Jev permission/denial/revocation cases remain planned for its later integration.
- **Ask continuity and honesty:** Retain each course's draft/result/error when navigating away and back; in-flight results stay attached to their originating course. No evidence gives insufficient-evidence status; conflicting evidence is surfaced. Invalid or unavailable local generation never appears as a verified answer or triggers remote processing.
- **Evidence closure:** M-03 coordinates technical integration records, M-09 supplies actual host evidence and primary modules supply results/limitations. Current-MVP unit acceptance needs their combined record; named integration owner remains Unassigned.

Current-MVP acceptance uses the MVP portions of this map and source/format register. US-05/06 and advanced recognition/Jev/hosted-consent portions remain in the catalog with separate post-MVP acceptance; they do not block current-MVP completion.

## 8. Partial property-testing obligations

The approved partial scope covers pure transformations, serialization/evidence-reference round trips and version invariants, using realistic domain generators, shrinking and reproducible seeds.

M-04 leads identity/version/extraction-reference properties; M-07 leads claim/precedence invariants; M-08/M-09 lead scope-preserving query/reference serialization and read-only boundary cases; M-03 integrates the evidence.

Include unchanged recapture without duplicate originals, metadata/re-extraction without original mutation, stable exact references, matching-course/subject claim comparison and exclusion of out-of-course results.

Properties supplement actual integration evidence. They do not establish authenticated LMS access, OCR/STT quality, semantic relevance, hosted-provider behavior or actual Codex compatibility. Executable tests, framework setup and measurements belong to later authorized Construction.

## 9. Review boundary

This story map allocates the complete retained catalog with explicit delivery phases. It introduces no application code/directories, independent deployed service, accepted personal assignment or runtime success claim. The new Ask story is a documented scope revision, not evidence of implementation.

The historical generated-unit review remains in [unit-of-work.md](unit-of-work.md). [Lawrence's maintainer approval](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115984386) separately approves the revised map and companion Inception artifacts through Units Generation. This records the named maintainer's response without attributing approval to every teammate. The workflow stops before Construction for the November 24 checkpoint; ordered integration remains separate.
