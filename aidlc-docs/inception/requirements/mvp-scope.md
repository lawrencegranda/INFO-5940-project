# Course Copilot — MVP and Later Work

**Status:** Current scope allocation for the coordinated Inception draft. Revised artifact approval remains pending on PR #8.
**Delivery:** The current MVP targets December 16, 2026. Later work is retained in the product backlog without a committed delivery date. The November 24 milestone remains Inception only.

## Current MVP

The MVP centers on **local course Ask and read-only local MCP**, supported by the evidence library they need.

| Capability | Current MVP commitment |
| --- | --- |
| Material collection | Explicit authorized capture of native-text pages from Canvas, Gradescope, EdStem and ordinary websites; local text/native-PDF imports and accessible linked/embedded native-text PDFs. |
| Organization | Private course separation, folders/topics, editable metadata, manual filing and local-model filing suggestions with review when uncertain. |
| Evidence | Preserved originals/permitted snapshots, source identity and dates, immutable observed versions, exact extracted passages and original-resource viewing where supported. |
| Knowledge and retrieval | Local source-linked summaries, substantive claims and supported authority/update/conflict handling; local hybrid lexical/semantic search and filters. |
| Ask | Course-scoped local answers, validated source citations, visible uncertainty, per-course navigation continuity and request isolation. Model unavailability yields disclosed retrieval-only evidence; invalid output yields a safe error. |
| Local MCP | The existing six read-only local tools, with actual Codex integration and course/reference checks. No query-induced library mutation; the external Codex/model's processing follows its separately disclosed configuration. |
| Failure handling | Honest extraction/processing status, available native-text search and manual recovery. Unprocessed formats are not presented as searchable or complete. |

The input/original-viewing path may preserve a selected supported original without extracting its non-text regions. A saved scan, diagram or recording does not establish OCR, mathematical interpretation or transcription support.

## Deferred, retained for later iterations

| Capability | Retained later work | Traceability |
| --- | --- | --- |
| Jev | Hosted classification, query routing and reranking, with minimal payloads, explicit permission and fallback. It is not connected or required in the current MVP. | FR-06/FR-12, NFR-02/NFR-05; Jev portions of US-09/US-19/US-24; C-08. |
| Scan/image OCR | Searchable text extracted from images and scanned pages. | FR-05; US-05; deferred C-06 adapters. |
| Advanced math/diagram recognition | Interpretation and reliable extraction of non-text equations/visuals. Original preservation/viewing and native text remain in the MVP. | FR-05; advanced-recognition portion of US-07. |
| Audio/video processing | Media-specific acquisition, captions/transcription, timestamped retrieval and related processing/resource coordination. | FR-03/FR-05; US-06; deferred C-01/C-06 adapters. |
| Remote assistant integration | ChatGPT-specific remote/hosted MCP and tunnels. | Later integration backlog; current FR-14 remains local Codex MCP. |

These capabilities are **deferred, not removed or rejected**. Their requirements, stories and design contracts remain available for later implementation and review. They do not block acceptance of the current MVP, and they are not counted as implemented merely because originals or interface contracts exist.

## Stable catalog and acceptance

- Preserve FR-01–FR-16, NFR-01–NFR-07, US-01–US-26, C-01–C-13, S-01–S-05 and U-01/nine modules. Counts describe the retained design catalog, not a promise that every deferred path ships in the MVP.
- US-05 and US-06 are post-MVP stories. US-07 has MVP original-viewing/native-text obligations and later recognition obligations. US-09/US-19 retain local behavior while Jev-assisted portions are deferred; US-24 retains untrusted-data controls while hosted-permission behavior is deferred.
- Acceptance evidence must state its delivery phase. Current MVP acceptance covers native text/PDF, grounded Ask, local MCP, provenance, scope isolation, supported conflicts and fallback. Deferred-format/provider tests belong to later iterations.
- The detailed future contracts preserve intended privacy, authority, citation and read-only boundaries. Deferred capabilities require later design/validation before activation; this allocation is not approval to enter Construction now.

See the [requirements](requirements.md), [stories](../user-stories/stories.md), [design](../application-design/application-design.md) and [unit/story map](../application-design/unit-of-work-story-map.md).
