# Campaign Asset Copilot feasibility report

Tested November 19, 2026 on an Apple M2 Max Mac with 32 GB RAM, Chrome 157, and Ollama 0.40.16. The local model was `qwen3-vl:8b-instruct` (ID `70e58e37beb1`, Q4_K_M). Before testing, `ollama show` confirmed vision support. The browser used `POST http://127.0.0.1:11435/api/chat` for all inference and `GET /api/tags` for model discovery.

Ollama also reported vision support for the installed `qwen3.5:2b`, `qwen3.5:9b`, and `qwen3.8:27b`. The installed `qwen3:8b` did not report vision support. The full test used the 8B vision model.

## Phase 1 results

Chrome loaded the Manifest V3 extension, and triggering the toolbar action opened a native side panel. The browser smoke test used the panel's extension page, the 44 stock photos, and actual Ollama responses. It verified thumbnail display, all seven visible metadata fields, IndexedDB reload, three crop ratios, three recommendations with fit and layout explanations for each scenario, editable slide text, and feedback-driven replacement. The rejected candidate was excluded and the UI displayed the new result and rank changes. The build and all four deterministic unit tests passed.

| Operation | Measured wall time |
| --- | ---: |
| Full indexing of 44 photographs | 291.6 s, 44 indexed and 0 errors |
| Vision request | 5.90 s median, 5.12–12.28 s range |
| First vision request, including model load | 12.28 s |
| Recruit engineering students | 7.3 s |
| Showcase research and innovation | 7.7 s |
| Promote a student club event | 7.3 s |
| Interpret feedback, then rerank | 3.3 s + 6.9 s |

The browser sent 44 successful image analysis requests and five successful text requests across the indexing and recommendation tests. The full indexing time includes preview preparation for model input and saving results. The text timings reflect calls with the model already loaded.

## What to trust and what to check

- **Observed model strengths.** The model produced usable structured metadata for all 44 photos, valid ranked lists for all three briefs, and actionable feedback criteria. For the research brief, it ranked pipette and microscope imagery and tied its explanations to the requested visible research process. This run checked output validity and behavior. A human-labeled relevance benchmark is still needed.
- **Observed model misses.** The engineering brief requested headline space on the left. The first two recommendations cited top-right space, so the reranker did not reliably honor that placement preference. Feedback about a professional look and left-side space introduced extra criteria about adults, attire, and youthfulness. These were stronger than the requested change. Treat reasons, inferred focus, and negative-space claims as suggestions and review the actual image. The lexical shortlist can also miss synonyms or omit a useful candidate.
- **Keep mechanical checks in code.** Use local storage for the index, keyword retrieval for a bounded candidate set, and deterministic ID validation, rejection exclusion, source bounds, aspect ratios, and Canvas rendering. The model suggests the crop focus. Code guarantees in-bounds coordinates and a valid preview; preservation of a subject or readable label needs visual confirmation. A future version can enforce hard layout constraints against verified regions before reranking.
- **Connection issue encountered.** The ordinary Ollama listener returned HTTP 403 for the Chrome extension's origin. The verified launcher starts a dedicated loopback listener, adds the extension's specific origin, and disables Ollama cloud inference for that listener.

## Phase 1 usage

Codex implemented, debugged, and tested the software and wrote this report. Library images were processed on this Mac by Ollama. Codex received test state and timing output and did not analyze the stock images. The extension's captured HTTP requests all went to `127.0.0.1:11435`. Development used public technical documentation and the npm registry for build tools. Google Drive, Google Slides, and hosted LLM APIs received no runtime calls. No new Ollama models were downloaded. The official project checkout, branches, and AI-DLC records were left untouched.

## Phase 2 verification

The build and ten unit tests passed. The Chrome regression passed against all 44 previously indexed photos, including the three Phase 1 briefs, manual brief editing, persisted library, all three aspect ratios, and feedback-based replacement. Reselecting the source folder restored full-resolution files while retaining indexed metadata. A fresh Chrome profile also indexed one real JPEG in 6.2 s with zero errors. Runtime reasoning stayed on `qwen3-vl:8b-instruct` at `127.0.0.1:11435`.

| What we measured | Result |
| --- | --- |
| Platform and placement | **11/12** exact raw model decisions on hand-labeled briefs. Qwen turned a generic research slide into a 4:3 Google Slides request. A check against the actual brief preserved the generic flow, yielding **12/12** final decisions on this set. The ambiguous Instagram and Facebook briefs requested a format. Direct local calls took **1.07–1.66 s**. |
| Render and adjust | Chrome rendered a Story at **1080 × 1920**, verified that crop pan and zoom changed pixels, and decoded an exported PNG with those exact dimensions. An edited X preset rendered at **1440 × 810**. |
| Subject preservation | In a controlled geometry test, a centered vertical crop retained **0%** of an off-center subject box. Manual pan and padding each retained **100%**. On a real source photo in Chrome, padding retained **100% of the tester-marked area** and reserved the left quarter for a headline. The test covered region preservation, and the visual suitability of the real photo remains a human judgment. |
| Same brief, different placement | Story had **three pad** strategies. The X version had **two pad and one crop**. Two of three assets changed and the first-ranked asset changed. Story interpretation plus ranking took **9.3 s**. X reranking reused the interpretation and took **6.7 s**. |
| Slides detection, reading, and recommendations | Chrome verified the missing-client setup message and tested active-tab detection, selection from the URL, explicit slide switching, text and image bounds, and a simulated expired-token refresh. The fixture's 4:3 deck produced a **1920 × 1440** target and three actual local model recommendations in **10.0 s**. The fixture used simulated Google authentication and returned sample slide data. |
| Live Google authentication and reading | An unauthenticated GET to Google's official endpoint returned **401 CREDENTIALS_MISSING** in **0.293 s**. The handoff build includes the verified Chrome Extension OAuth client. Live sign-in, token renewal, and reads of a real deck are still pending a test user and deck. |
| Insertion success | Exact PNG export passed. Insertion and replacement in a real presentation are pending live read verification and explicit approval for the specific write. |

The 12-brief benchmark is a small, hand-labeled test. The model can still overinterpret feedback, conflate the left and right sides of a photo, or recommend an asset that lacks space in the requested location. In the Story test it described top-right space as matching the left-side request in one explanation. The padding code reserves the requested side independently of that explanation. Crop coordinates, bounds, aspect ratio, exact dimensions, and marked-area coverage are deterministic. Final layout and subject visibility still need review.

The Google client requests `presentations.readonly` only. It uses the toolbar-granted active tab for URL detection and asks for the Slides API host only when the user reads a deck. URL selection is a hint matched to IDs returned by the API. The explicit slide picker is the source of truth when the editor URL lacks a current slide ID. The panel lists shape and table text and image metadata with bounds, keeping Google image links out of displayed and saved context. [Chrome activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab/) · [Slides scopes](https://developers.google.com/workspace/slides/api/scopes) · [Slides page resource](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations.pages)

## Insertion and replacement feasibility

| Option | Fit for a private local asset | Dependencies and risks |
| --- | --- | --- |
| Slides REST API `batchUpdate` | `createImage` and `replaceImage` target known slide or image object IDs. Google's fetch needs an accessible URL. A local path or Chrome blob URL cannot satisfy it, and this prototype keeps private assets off publicly fetchable URLs. | Requires a write scope and explicit target approval. Replacement can remove existing image effects. [Slides image insertion](https://developers.google.com/workspace/slides/api/guides/add-image) · [Slides request reference](https://developers.google.com/workspace/slides/api/reference/rest/v1/presentations/request#ReplaceImageRequest) |
| Apps Script blob | Accept approved image bytes over an authenticated request, then use `Slide.insertImage(blob)` or `Image.replace(blob)`. The bytes go to the authorized Google script for the approved deck without a public file URL. | `scripts.run` requires an API-executable deployment, a shared standard Google Cloud project and appropriate user scopes. Verify target IDs, script limits, authorized accounts, and replacement geometry before relying on it. [Apps Script execution](https://developers.google.com/apps-script/api/how-tos/execute) · [Insert a blob](https://developers.google.com/apps-script/reference/slides/slide#insertImage(BlobSource)) · [Replace a blob](https://developers.google.com/apps-script/reference/slides/image#replace(BlobSource)) |
| User-initiated browser upload | After approving the result, download the exact PNG and use Slides **Insert → Image → Upload from computer** in a test deck. This is the simplest handoff for the deadline and does not require an extension write scope. | The user chooses the slide and confirms the insertion. Paste and panel-to-editor drag-and-drop also need a live trial. Avoid automating editor clicks or depending on private editor DOM. [Google Slides image upload](https://support.google.com/docs/answer/97447) |

First follow the [read-only Google Slides test](README.md#test-google-slides-in-read-only-mode) and verify reads from a real deck. For an insertion trial, agree on the specific test deck, slide and asset, and confirm the operation before writing. Verify the image appears on the intended slide and can be undone. Use the browser upload path for the first test. Evaluate Apps Script if the team needs a user-confirmed insertion button.

## Phase 2 development usage

Codex worked on implementation, debugging, test results, and documentation. The library and generated images stayed on this Mac. Campaign and recommendation inference used the original Ollama listener. The Chrome integration tests intercepted Google requests with fixtures. The only live Slides endpoint request was the unauthenticated reachability probe. Development consulted public documentation. No hosted model, new model download, or Slides document write was used.
