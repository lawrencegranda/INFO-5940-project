# Course Copilot — User Stories

**Stage:** Inception / User Stories / Part 2: Generation

**Status:** Generated from the explicitly approved story plan; awaiting generated-artifact review. These stories describe required behavior, not implemented or tested functionality.

**Baseline:** Requirements approved at `485c52531f004b1e184fb595abe771cfbcd17003`. All 43 decisions and eight clarifications remain in force.

**Persona:** [P-01: a student managing several courses](personas.md). Context C is **Capture and organize**; context R is **Retrieve and verify**. These are contexts of one person, not separate account types.

**Inputs:** [Approved requirements](../requirements/requirements.md), [decision register](../requirements/decision-register.md), [approved story plan](../plans/story-generation-plan.md).

## Reading and acceptance conventions

- Each story has one student-visible outcome, requirement references, explicit acceptance criteria and a future evidence expectation.
- Given/When/Then criteria are specifications. No scenario below is reported as already passing.
- Dependencies identify prerequisite data or another capability; they do not prescribe implementation units, sprint order or estimates. A story can be checked against controlled prerequisite fixtures, but its live integration still requires actual evidence.
- Every returned citation identifies the original URL when one exists, otherwise the local-import source identity, plus the saved document/version and passage or segment, with capture time available. Summaries and generated text do not replace source evidence.
- An extraction status describes the selected resource's outcome: `complete` means its requested accessible content was processed; `partial` means usable content exists with disclosed omissions; `failed` means an attempted operation did not produce usable requested content; `unsupported` means the pipeline cannot process that resource type or access path. A successful parent-page extraction does not hide an incomplete child resource.
- The phrase **latest applicable saved evidence** never asserts that an LMS has been checked since the last explicit capture. Capture time alone is not source authority or an instruction's effective date.
- Synthetic examples and future fixtures are labeled. A fixture for an LMS page or MCP host does not establish a successful authenticated-site or actual Codex connection test.

## E1 — Collect accessible material

### US-01 — Save the course page I am viewing

**Persona/context:** P-01 / C. **Requirements:** FR-02, FR-04; NFR-02, NFR-03, NFR-04. **Depends on:** a user-accessible page and a selected course or the filing flow in US-09.

As a student, I want to explicitly save the course page I am viewing, so that I can retrieve it later without repeatedly copying it into an assistant.

- **Given** an accessible page on Canvas, Gradescope, EdStem or an ordinary website, **when** I choose Save in Chrome, **then** the library records that selected page's available content or permitted snapshot, original URL, stable source identity and capture time.
- **Given** the extension is installed, **when** I browse without selecting Save, **then** it does not ingest pages automatically or initiate an LMS login.
- **Given** a save operation, **when** the captured record is inspected, **then** login credentials, cookies and LMS session tokens are absent from the saved record and its exportable content.
- **Given** the source is inaccessible or the save cannot finish, **when** the operation returns, **then** its limitation is visible through US-23 rather than a false saved/complete claim.

**Future evidence:** Actual user-authorized save on each of the three named LMS sites and one ordinary webpage; capture-record inspection and a no-explicit-save negative case. Controlled pages can isolate failures but do not replace these site checks.

### US-02 — Import a paper or local document

**Persona/context:** P-01 / C. **Requirements:** FR-02, FR-04, FR-05; NFR-03, NFR-04. **Depends on:** selected course and an authorized file/source.

As a student, I want to import a paper, PDF or local file, so that useful material outside my LMS belongs in the same course library.

- **Given** an accessible paper/PDF link or a local file I select, **when** I import it, **then** the original permitted asset, source identity, capture time and extraction outcome are retained.
- **Given** an online original URL, **when** I inspect the imported item, **then** that URL remains available; a local-only file is identified as a local import without an invented web address.
- **Given** an import that cannot be processed, **when** the result appears, **then** I can see the failed/unsupported outcome and use the recovery flow without losing unrelated saved material.

**Future evidence:** An accessible external paper/PDF, a native-text local file and an unsupported or invalid input. Verify that original file bytes and source metadata can be inspected.

### US-03 — Choose which embedded resources to capture

**Persona/context:** P-01 / C. **Requirements:** FR-03, FR-04; NFR-02, NFR-04. **Depends on:** US-01 or US-02.

As a student, I want to see discovered embedded files and media and authorize their capture, so that I control what enters my library.

- **Given** a saved page containing an embedded or linked PDF/media resource, **when** discovery finishes, **then** the resource is listed with its source and a way to select permitted capture.
- **Given** a discovered resource I have not selected, **when** the parent page is saved, **then** discovery alone does not authorize fetching every linked resource or unrelated content.
- **Given** a selected resource that is inaccessible, **when** capture is attempted, **then** the item remains listed with its limitation and a manual upload path; the parent does not imply that the missing child was fully indexed.

**Future evidence:** Accessible embedded PDF, discovered-but-unselected resource, and inaccessible embed with manual fallback. Actual authenticated/cross-origin cases are recorded separately from controlled fixtures.

### US-04 — Search text extracted from pages and documents

**Persona/context:** P-01 / C and R. **Requirements:** FR-05; NFR-03, NFR-04. **Depends on:** US-01 or US-02.

As a student, I want readable text from saved pages and documents to be searchable, so that I can find the passage I need rather than only the file title.

- **Given** a saved page or PDF with native machine-readable text, **when** extraction finishes, **then** a phrase from its body can retrieve the corresponding saved passage.
- **Given** a returned passage, **when** I open its evidence, **then** it identifies the saved original and available page or passage location.
- **Given** text that was not successfully extracted, **when** extraction status is displayed, **then** the omitted portion is disclosed and is not represented as searchable content.

**Future evidence:** Controlled HTML and native-text PDF with known body phrases and page/passage references; include missing-text and extraction-failure cases.

### US-05 — Find text inside scans and images

**Persona/context:** P-01 / C and R. **Requirements:** FR-05; NFR-03, NFR-04. **Depends on:** authorized image/scan import.

As a student, I want legible text in scans and images to be searchable while keeping the originals, so that photographed or scanned course material is useful alongside text files.

- **Given** a selected readable scan or image, **when** OCR completes, **then** a known visible phrase can retrieve derived text linked to the original image/page.
- **Given** the derived result, **when** I inspect it, **then** I can open the original and distinguish extracted text from source pixels.
- **Given** unreadable, incomplete or failed OCR, **when** I view the resource, **then** its limitation is visible; missing words are not presented as verified transcription.

**Future evidence:** Permission-cleared scanned page and image, an unreadable example and inspection of source-to-text linkage. OCR quality is measured on these examples, not assumed from successful upload.

### US-06 — Retrieve evidence from accessible audio or video

**Persona/context:** P-01 / C and R. **Requirements:** FR-03, FR-05; NFR-02, NFR-03, NFR-04. **Depends on:** authorized accessible media capture/import.

As a student, I want accessible saved media to have searchable transcription when needed, so that spoken course material can support a sourced answer.

- **Given** selected, accessible audio/video that needs transcription, **when** transcription succeeds, **then** a known spoken phrase retrieves text associated with the original media and an available segment/time reference.
- **Given** a transcript passage, **when** I inspect it, **then** its source media and extraction status are visible rather than implying an unverified exact transcript.
- **Given** inaccessible/protected media or unsupported processing, **when** the result appears, **then** the limitation and permitted manual alternative remain visible; the system does not bypass access restrictions or claim successful transcription.

**Future evidence:** Short permission-cleared audio and video examples with known spoken content, plus an inaccessible/unsupported case. A controlled media fixture is not evidence that every LMS embed can be captured.

### US-07 — Inspect original equations and diagrams

**Persona/context:** P-01 / C and R. **Requirements:** FR-04, FR-05; NFR-03, NFR-04. **Depends on:** saved material containing a formula or diagram.

As a student, I want original equations and diagrams preserved beside reliable extracted text, so that text processing does not erase the meaning of technical course material.

- **Given** an imported page containing equations or diagrams, **when** processing finishes, **then** the original visual/source remains available even if derived text is incomplete.
- **Given** reliable text or notation can be extracted, **when** it is indexed, **then** a result links back to the corresponding saved original region or page where available.
- **Given** uncertain notation or a diagram that cannot be represented as text, **when** I inspect the result, **then** the limitation is disclosed and a generated interpretation is not substituted for the original.

**Future evidence:** Permission-cleared math source and diagram with original inspection and derived-text checks; record the exact portions successfully extracted and any limitation.

## E2 — Organize and correct

### US-08 — Keep courses and topics separate

**Persona/context:** P-01 / C and R. **Requirements:** FR-01; NFR-01. **Depends on:** none.

As a student, I want separate course libraries with folders/topics and tags, so that material from one course is not confused with another.

- **Given** two courses, **when** I file documents in each, **then** their course, folder/topic and tag assignments are visible and persist after reopening the local library.
- **Given** I am browsing one course, **when** I use its scoped view, **then** the other course's documents are excluded unless I deliberately change the scope.
- **Given** the same document title or topic label in two courses, **when** I inspect an item, **then** its course identity remains explicit and does not silently collapse the courses together.

**Future evidence:** Two-course fixture with overlapping titles/tags, local restart and scoped browsing checks.

### US-09 — Review uncertain filing suggestions

**Persona/context:** P-01 / C. **Requirements:** FR-06; NFR-02, NFR-05. **Depends on:** US-08 and the hosted-use controls in US-24 when Jev is used.

As a student, I want to review uncertain course/folder suggestions, so that automatic organization does not hide incorrect filing.

- **Given** classification is enabled and permitted, **when** an item is assessed, **then** the suggested course/folder and its review state are visible.
- **Given** a suggestion meets the configured and validated acceptance condition, **when** automatic filing is used, **then** the final destination is visible and remains correctable through US-10.
- **Given** uncertainty or no permitted/available classifier, **when** I save the item, **then** I can confirm or choose its destination manually without requiring a hosted request.

**Future evidence:** Controlled confident, uncertain and unavailable classifier outcomes; actual permitted Jev behavior is verified separately. No confidence threshold value is invented in this story.

### US-10 — Correct an item's metadata

**Persona/context:** P-01 / C. **Requirements:** FR-06, FR-09; NFR-03. **Depends on:** a saved document and US-08.

As a student, I want to correct course, folder, title, tags and authority notes after saving, so that a classification mistake is recoverable.

- **Given** a saved item, **when** I edit any of those permitted metadata fields, **then** the corrected values persist and are reflected in subsequent browsing and retrieval.
- **Given** a metadata edit, **when** I inspect the original saved content and prior versions, **then** their bytes, source provenance and identities have not been rewritten by that edit.
- **Given** I move an item between courses, **when** I search with the old and new course scopes, **then** current filing is reflected consistently without deleting the original snapshot.

**Future evidence:** Deliberately misfiled item, metadata correction and before/after source-identity checks.

### US-11 — Receive source-linked incremental summaries

**Persona/context:** P-01 / C and R. **Requirements:** FR-07; NFR-03, NFR-07. **Depends on:** saved/extracted material and the agreed local model path.

As a student, I want course, topic and document summaries and the search index to update when relevant saved material changes, so that my library stays navigable without reprocessing everything.

- **Given** a new item or changed saved version, **when** processing completes, **then** its passage index and affected source-linked course, topic and document summaries reflect that saved material.
- **Given** unrelated unchanged documents, **when** one item is updated, **then** they are not all re-ingested merely to refresh that item; verification records the affected versus unaffected processing.
- **Given** a generated summary, **when** I follow its source reference, **then** I can inspect supporting saved material and distinguish the summary from original evidence.
- **Given** the local model fails, **when** summary generation cannot finish, **then** that failure is disclosed and original content plus local keyword retrieval remain available through US-25.

**Future evidence:** Incremental update fixture with observable processing records, source-link checks and actual local-model smoke test. Model compatibility and latency remain measurements to perform.

## E3 — Preserve and inspect sources

### US-12 — Inspect original source and capture details

**Persona/context:** P-01 / R. **Requirements:** FR-04; NFR-03. **Depends on:** saved material.

As a student, I want to inspect an item's original source and capture details, so that I can verify where a passage came from.

- **Given** a saved online source, **when** I open its details, **then** I can see a clickable original URL, capture timestamp, document/version identifiers and known publication/effective dates with their meanings kept distinct.
- **Given** an original snapshot or file, **when** I open it, **then** it is the saved version supporting the item rather than a generated reconstruction.
- **Given** an unknown publication/effective date or a local-only import, **when** details are displayed, **then** the missing value is represented honestly rather than inferred from capture time or an invented URL.

**Future evidence:** Online and local source fixtures, original file/snapshot inspection and unknown-date cases.

### US-13 — Recapture without losing history

**Persona/context:** P-01 / C and R. **Requirements:** FR-04, FR-09; NFR-03, NFR-06. **Depends on:** stable saved source identity.

As a student, I want unchanged recaptures recognized and changed content saved as a new version, so that updates do not erase the material I previously used.

- **Given** the same source identity and unchanged content hash, **when** I capture it again, **then** no redundant content version is created and existing original content is preserved.
- **Given** the same source identity with changed captured content, **when** I save it, **then** a new immutable version is associated with that source and the prior version remains retrievable.
- **Given** a failed recapture or a different source with similar wording, **when** processing runs, **then** existing originals are not overwritten and semantic similarity alone does not assign shared identity.

**Future evidence:** Unchanged/changed/failed recapture fixtures and pure version/serialization invariant properties using generated valid source records in later tests.

### US-14 — Understand relationships without silent merging

**Persona/context:** P-01 / C and R. **Requirements:** FR-08, FR-09; NFR-03. **Depends on:** two or more saved records.

As a student, I want related documents and update relationships to remain traceable, so that I can follow context without losing the separate originals.

- **Given** an established `related`, `updates` or `supersedes` relationship, **when** I inspect it, **then** its endpoints identify the saved records and supporting passages or documented basis.
- **Given** semantic matching suggests a duplicate/relationship, **when** the suggestion appears, **then** it is distinguishable from an established fact and does not automatically merge, delete or overwrite the original records.
- **Given** two distinct source URLs about the same assignment, **when** I inspect their relationship, **then** I can still retrieve each source and version independently.

**Future evidence:** Separate syllabus/announcement records and a duplicate-suggestion fixture; confirm original identities and evidence links remain intact.

### US-15 — Browse saved versions and default to applicable evidence

**Persona/context:** P-01 / R. **Requirements:** FR-09, FR-15; NFR-03. **Depends on:** US-13 and applicable evidence rules in US-17.

As a student, I want ordinary retrieval to favor applicable saved evidence while letting me inspect older versions, so that history remains available without obscuring current known instructions.

- **Given** several saved versions, **when** I open an item's history, **then** each retained version and its capture/source details can be inspected.
- **Given** an established applicable saved update, **when** I perform ordinary retrieval, **then** that update is favored while earlier supporting history remains accessible.
- **Given** only a saved source with no observed update, **when** I view it, **then** an old capture date alone does not produce a stale/conflict warning or a claim that unseen LMS changes have been checked.

**Future evidence:** Multi-version browsing and default-retrieval fixtures. Arbitrary historical "as-of" querying remains outside this MVP.

## E4 — Understand changed instructions

### US-16 — Inspect substantive extracted course claims

**Persona/context:** P-01 / R. **Requirements:** FR-10; NFR-03, NFR-04. **Depends on:** extracted, sourced text.

As a student, I want important deadlines, exam logistics and assignment instructions tied to their source passages, so that I can verify the facts used to compare course rules.

- **Given** a saved passage containing a clear substantive instruction, **when** a structured claim is extracted, **then** its subject, claim type, value and supporting saved passage are available for inspection.
- **Given** a passage with an ambiguous assignment reference, value or date, **when** extraction is uncertain, **then** that uncertainty is retained rather than inventing a definite instruction or effective date.
- **Given** two claims, **when** they are compared for a change/conflict, **then** course, subject and claim type must match sufficiently to avoid treating different assignments or courses as contradictory.

**Future evidence:** Deadline, exam-location and assignment-policy fixtures, an ambiguous date/reference and a non-conflicting different-assignment control.

### US-17 — Follow an explicit authoritative update

**Persona/context:** P-01 / R. **Requirements:** FR-08, FR-10, FR-15; NFR-03, NFR-06. **Depends on:** US-14 and US-16.

As a student, I want a grounded change to course instructions to take precedence in retrieved evidence, so that I do not act on a superseded saved requirement.

- **Given** a synthetic saved syllabus saying an assignment is due November 20 and a later saved authoritative announcement explicitly moving that same assignment to November 22, **when** I retrieve its deadline, **then** the result favors November 22 with the announcement's supporting evidence and an accessible link to the earlier syllabus.
- **Given** the older syllabus is recaptured after that announcement, **when** I retrieve the deadline again, **then** its newer capture timestamp alone does not reverse the established supersession.
- **Given** the available authority, applicability, known dates and supersession evidence do not establish precedence, **when** the result is assembled, **then** the system follows US-18 instead of manufacturing a single winner from an LLM assertion. An unknown separate effective date does not by itself negate an otherwise explicit authoritative update.

**Future evidence:** Controlled explicit-supersession and later-recapture regression scenarios, plus missing-authority/effective-date cases. Source/precedence invariants are carried into later selected property tests.

### US-18 — See unresolved conflicts with competing evidence

**Persona/context:** P-01 / R. **Requirements:** FR-08, FR-11; NFR-03. **Depends on:** US-16 and saved evidence.

As a student, I want unresolved substantive conflicts shown with both sources, so that I can make an informed decision or seek clarification.

- **Given** incompatible claims about the same course subject without established precedence, **when** I inspect the result, **then** both claims and their source passages are visible with an unresolved-conflict indication.
- **Given** I open a conflict's evidence, **when** I inspect either side, **then** its original source, saved version and relevant dates remain available; the other source is not deleted or hidden.
- **Given** an old unchanged document or claims about different assignments, **when** evidence is checked, **then** age or superficial similarity alone does not create a substantive-conflict alert.

**Future evidence:** Same-assignment conflicting dates without precedence, different-assignment control and ordinary old static document control. Broader semantic contradiction detection remains best-effort, not a universal guarantee.

## E5 — Retrieve evidence progressively

### US-19 — Search within a course using words or meaning

**Persona/context:** P-01 / R. **Requirements:** FR-01, FR-12, FR-15; NFR-03, NFR-05. **Depends on:** indexed saved material.

As a student, I want lexical and semantic retrieval with course/topic and evidence filters, so that I can locate relevant saved material without loading the entire library.

- **Given** saved material in two courses, **when** I search within one course, **then** candidates remain in that requested scope, including when both courses use the same topic words.
- **Given** a controlled saved corpus with an expected passage identified in advance for an exact-phrase query and a paraphrase query, **when** I search through the required lexical and semantic/vector retrieval paths, **then** the expected saved evidence appears in bounded results with source references and the requested course scope; verification records which path contributed.
- **Given** indexed material with known course/topic, source, date and saved-version metadata, **when** I apply each required filter, **then** results contain only matching saved evidence. An explicit saved-version filter refers to retained versions; it does not introduce excluded historical-as-of querying.
- **Given** optional Jev reranking is unavailable or not authorized, **when** I search, **then** the local keyword/metadata path remains usable and its mode is visible through US-25.

**Future evidence:** Labeled exact/paraphrase queries, overlapping two-course fixtures, filter controls and Jev-disabled retrieval. Actual semantic integration is tested rather than inferred from keyword success.

### US-20 — Inspect compact search previews before fetching

**Persona/context:** P-01 / R. **Requirements:** FR-11, FR-13; NFR-03. **Depends on:** US-19.

As a student using an external assistant, I want compact ranked evidence previews first, so that I can select relevant material without sending the whole course into context.

- **Given** a course search, **when** the preview tool returns, **then** each candidate has a stable reference plus title/course, summary or snippet, original source, capture/version information and any relevant conflict indication.
- **Given** a large saved library, **when** a bounded preview result is requested, **then** it returns the requested bounded candidate set and does not automatically include all full documents.
- **Given** no matching saved evidence, **when** search finishes, **then** the result clearly reports no match rather than inventing a source, summary or citation.

**Future evidence:** MCP response-shape checks, bounded-result and no-match cases, then the actual host flow in US-22.

### US-21 — Fetch the exact saved evidence I selected

**Persona/context:** P-01 / R. **Requirements:** FR-01, FR-13; NFR-03, NFR-04. **Depends on:** a valid saved evidence reference, normally from US-20.

As a student using an external assistant, I want to fetch a selected passage or available full extracted content, so that the answer can be grounded in the original saved evidence.

- **Given** a valid document/version/passage reference, **when** the fetch tool is called, **then** it returns the selected saved content with the original URL when one exists, otherwise its local-import source identity, plus course and exact version/capture provenance; a generated summary is not substituted for that source text.
- **Given** a request scoped to course A but a reference for course B, **when** fetch validates the request, **then** it does not silently return B as evidence for A and clearly requires the intended course context.
- **Given** an unknown reference, missing version or partially extracted resource, **when** fetch runs, **then** it reports the limitation accurately and never fabricates the missing passage or claims complete coverage.

**Future evidence:** Search-to-fetch reference round trip, exact-version comparison, scoped-mismatch/unknown-reference cases and partial-content response. Include an actual Codex fetch in US-22.

### US-22 — Use the local library through read-only Codex MCP

**Persona/context:** P-01 / R. **Requirements:** FR-13, FR-14; NFR-01, NFR-02, NFR-03. **Depends on:** US-20 and US-21.

As a student, I want Codex CLI to connect to my local course library through read-only MCP tools, so that I can use my existing assistant with attributable course context.

- **Given** the documented local setup, **when** I connect actual Codex CLI, **then** it can discover the available read-only tools, search for previews and fetch selected saved evidence in an end-to-end demonstration.
- **Given** the MCP connection, **when** available tools and their behavior are inspected, **then** they cannot ingest, edit or delete library records; ingestion and corrections remain in the extension/local interface.
- **Given** the local service, **when** its connection boundaries are checked, **then** access remains on the intended laptop with the approved loopback/request controls and no required hosted MCP or new product chatbot.

**Future evidence:** Actual Codex CLI connection transcript with search-then-fetch results, before/after library-state comparison, tool-capability inspection and local access-control checks. A simulated host alone does not satisfy this story.

## E6 — Stay in control during failures

### US-23 — Understand incomplete processing and recover

**Persona/context:** P-01 / C and R. **Requirements:** FR-03, FR-05; NFR-04. **Depends on:** a capture/import attempt.

As a student, I want clear processing outcomes and a recovery path, so that missing material does not silently become a gap in my course knowledge.

- **Given** an ingestion attempt, **when** its result is shown, **then** each selected resource has an understandable `complete`, `partial`, `failed` or `unsupported` outcome and disclosed omissions or failure reasons.
- **Given** a successful parent page with an inaccessible child or incomplete extraction, **when** I inspect the item or retrieve its evidence, **then** the available content and outstanding limitation are both visible.
- **Given** a permitted manual file upload or retry, **when** recovery succeeds, **then** the newly processed content is associated with the correct source/course and existing saved originals remain preserved.

**Future evidence:** Controlled complete/partial/failed/unsupported cases across the applicable source formats and an actual manual recovery flow.

### US-24 — Control hosted processing and keep captured text as data

**Persona/context:** P-01 / C and R. **Requirements:** FR-06, FR-12; NFR-02. **Depends on:** optional Jev integration and saved material.

As a student, I want control over which course excerpts leave my laptop, so that optional AI assistance follows my informed choices.

- **Given** the default local setup without Jev opt-in, **when** I save, classify or search, **then** course content is not transmitted to hosted Jev and local/manual alternatives remain available.
- **Given** a proposed hosted classification/reranking request, **when** I authorize it, **then** the destination and selected minimal title/metadata/excerpt scope are disclosed and the actual request stays within that authorized scope; complete original files and credentials are not implicitly included.
- **Given** I decline, revoke or exceed the authorized scope, **when** further hosted processing would be needed, **then** that transmission is skipped or awaits the required permission while the local library remains usable.
- **Given** saved content containing instructions to disclose secrets, run tools or change permissions, **when** it is processed or returned, **then** it remains labeled source data and does not itself authorize those actions or broaden access.

**Future evidence:** Captured request inspection for denied/allowed/revoked consent, content-minimization cases and controlled adversarial source text. Do not send real course content to a hosted service merely to create this evidence.

### US-25 — Keep using the library when AI or the network is unavailable

**Persona/context:** P-01 / C and R. **Requirements:** FR-06, FR-12; NFR-01, NFR-05, NFR-07. **Depends on:** saved local material.

As a student, I want local browsing, manual filing and keyword/metadata search to keep working when optional AI fails, so that my saved material remains available without paid requests.

- **Given** the saved library and no network or hosted Jev, **when** I browse or run keyword/metadata search, **then** stored content and source references remain available locally without a required cloud account, LMS API key or paid model call.
- **Given** unavailable Jev or local summary/classification processing, **when** I save or organize a permitted item, **then** I can file it manually and see which AI enhancement is unavailable rather than losing access to the original.
- **Given** the chosen local model is installed for later runtime verification, **when** the team performs its smoke test, **then** recorded hardware/model/version and observed behavior/latency support the feasibility claim; missing tests or failures are disclosed instead of fabricated performance numbers.

**Future evidence:** Network/AI-disabled save-browse-search flow and local persistence check; actual local Ollama smoke test with its measured environment. Core fallback success does not establish that the AI enhancement itself works.

## Functional requirement coverage

| Requirement | Stories | Acceptance focus |
|---|---|---|
| FR-01 | US-08, US-19, US-21 | Multi-course organization and scoped search/fetch. |
| FR-02 | US-01, US-02 | Explicit three-LMS/ordinary-web save and external/local import. |
| FR-03 | US-03, US-06, US-23 | Discovered resources, authorization and honest recovery. |
| FR-04 | US-01, US-02, US-03, US-07, US-12, US-13 | Originals, URLs, identities, dates and immutable saved versions. |
| FR-05 | US-02, US-04, US-05, US-06, US-07, US-23 | Native text, OCR, media transcription and math/visual fidelity. |
| FR-06 | US-09, US-10, US-24, US-25 | Permitted suggestions, review, correction and manual fallback. |
| FR-07 | US-11 | Incremental source-linked summaries and passage indexing. |
| FR-08 | US-14, US-17, US-18 | Typed relationships and supporting change/conflict evidence. |
| FR-09 | US-10, US-13, US-14, US-15 | Metadata separation, deterministic identity and preserved history. |
| FR-10 | US-16, US-17 | Substantive sourced claims and grounded precedence. |
| FR-11 | US-18, US-20 | Unresolved competing evidence without age-only alarms. |
| FR-12 | US-19, US-24, US-25 | Hybrid/filter behavior, permitted reranking and local fallback. |
| FR-13 | US-20, US-21, US-22 | Bounded previews followed by exact sourced fetch. |
| FR-14 | US-22 | Actual local read-only Codex MCP integration. |
| FR-15 | US-15, US-17, US-19 | Inspectable history and applicable saved-evidence defaults. |

## Shared quality and evidence coverage

| Requirement | Stories | Verification obligation |
|---|---|---|
| NFR-01 | US-08, US-22, US-25 | Laptop-local persistence and operation without required cloud hosting. |
| NFR-02 | US-01, US-03, US-06, US-09, US-22, US-24 | Explicit capture/hosted authorization, no credential capture, untrusted-data and local access boundaries. |
| NFR-03 | US-01, US-02, US-04–US-07, US-10–US-22 | Exact saved-source and version traceability; no invented freshness or precedence. |
| NFR-04 | US-01–US-07, US-16, US-21, US-23 | Visible incomplete/failed/unsupported results and no fabricated extraction. |
| NFR-05 | US-09, US-19, US-25 | Jev-disabled manual organization and local retrieval. |
| NFR-06 | All stories; especially US-13, US-17, US-21, US-22 | Repeatable examples for critical behavior; selected properties for pure transformations, version invariants and serialization/evidence-reference round trips. |
| NFR-07 | US-11, US-25 | Incremental processing, actual local-model measurements and no paid-call dependency for core access. |

Future selected property tests retain the approved partial enforcement: realistic domain generators, shrinking and reproducible seeds for applicable round trips/invariants. Framework selection/configuration and executable tests belong in their later design/Construction stages; this artifact does not assert that such tests exist.

## INVEST review and dependencies

- **Independent:** Each story expresses one observable student outcome. Its listed prerequisites can be supplied by controlled fixtures for isolated acceptance; end-to-end integration obligations remain explicit.
- **Negotiable:** Stories retain product outcomes without freezing schemas, thresholds, algorithms, final MCP tool names or UI layouts that belong to subsequent design.
- **Valuable:** Every story states the student's benefit and maps to the approved persona and requirements; no unrelated administrator or cloud-account role is introduced.
- **Estimable:** Required source/format cases, success/failure conditions and evidence expectations make scope discussable. Estimation and scheduling remain later team work.
- **Small:** Page capture, individual extraction modes, filing, version preservation, supersession, preview and fetch are separate outcomes rather than one giant library story.
- **Testable:** Criteria identify explicit preconditions, actions and observable results, including negative controls and limitations. No story is marked accepted solely because a mock or fixture returns valid JSON.

The important cross-story dependencies are capture/import before extraction; saved evidence before versions/claims; claims and grounded relationships before precedence; and search previews plus exact fetch before actual Codex integration. The story IDs above identify these prerequisites without prescribing a sprint or implementation-unit design.

## Future source/format evidence register

| Capability | Minimum evidence retained from approved scope | Status at this stage |
|---|---|---|
| Canvas save | Actual user-authorized saved page. | Specified; not run. |
| Gradescope save | Actual user-authorized saved page. | Specified; not run. |
| EdStem save | Actual user-authorized saved page. | Specified; not run. |
| Ordinary web/paper/local import | Actual accessible webpage/PDF and local import. | Specified; not run. |
| Embedded resources | Accessible resource plus inaccessible/unselected controls and recovery. | Specified; not run. |
| Native extraction | Known HTML/PDF body text with source/page linkage. | Specified; not run. |
| OCR/visual material | Scan/image plus original equations/diagrams and disclosed extraction limits. | Specified; not run. |
| Audio/video | Accessible permitted media, searchable transcript/segment linkage and failure case. | Specified; not run. |
| Hybrid retrieval | Labeled exact/paraphrase queries and course/filter isolation. | Specified; not run. |
| Changes/conflicts | Explicit deadline supersession, later old-source recapture and unresolved competing evidence. | Specified; not run. |
| Codex MCP | Actual local Codex CLI search-then-fetch and read-only inspection. | Specified; not run. |
| Local model/fallback | Actual Ollama environment measurement plus AI/network-disabled core flow. | Specified; not run. |

## Review boundary

This file and `personas.md` implement the approved story-generation plan as documentation. The user/team must review the generated artifacts separately before User Stories is marked complete or Workflow Planning starts. Application code, runtime capability claims and Construction remain outside this stage.

## Generated-artifact review

### Q1 — Review the 25 stories and P-01 persona

A) **Approve these generated stories and persona, then continue to Workflow Planning.** Their approval will be recorded before the User Stories stage is marked complete. Later design and Construction gates remain separate.

B) **Request changes before approval.** Identify the story, acceptance criterion, persona detail or missing behavior to revise.

C) **Other.** Describe the requested review outcome after the answer tag.

[Answer]:

This unanswered field is the current review gate. It is not a missing product decision or permission to infer approval from the earlier planning answer.

## Extension compliance at generation review

| Rule | Status | Evidence or applicability |
|---|---|---|
| INFO5940-01 | Compliant | Generation follows the approved plan; approval, actions and review prompt are appended to the audit. |
| INFO5940-02 | Compliant | Inception documentation only; no application code or Construction. |
| INFO5940-03 | Compliant at the current boundary | The prior 43 answers, eight clarifications and plan approval are recorded; the generated-artifact answer is pending and no dependent stage proceeds. |
| INFO5940-04 | Compliant | The approved local-first Ollama, optional permitted Jev and read-only MCP scope is preserved. |
| INFO5940-05 | Compliant | Documentation only; no credentials or source application code. |
| INFO5940-06 | Compliant | Single-writer Draft PR #5 is the active review location; remote state and all available feedback channels were checked. |
| PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 | N/A to executable implementation in this stage | The partial-testing obligations remain explicit acceptance work for later stages; no framework configuration or runtime results are claimed. |
