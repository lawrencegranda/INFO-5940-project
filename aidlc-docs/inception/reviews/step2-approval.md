# Step 2 — Revised Artifact Review

**Status:** Awaiting actual team review. No option is selected and no approval is inferred.
**Branch/PR:** Existing `inception/05-units-generation` / [PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8).

## Concrete changes to review

1. [Requirements and decision record](../requirements/requirements.md): local Ask + local MCP replaces the historical no-chat exclusion through a separate recorded amendment. Existing IDs are retained and FR-16 is added. The [delivery allocation](../requirements/mvp-scope.md) retains Jev, advanced media processing and remote ChatGPT/hosted MCP for post-MVP work.
2. [Persona](../user-stories/personas.md) and [26 stories](../user-stories/stories.md): synthetic Maya, UI versus CLI-pilot distinction, source-authority criteria and US-26 grounded Ask with per-course progress and in-flight isolation.
3. [Execution plan](../plans/execution-plan.md) and [technical environment](../../../docs/technical-environment.md): model/extraction checkpoints, named proposed versions, six scoped tools, illustrative capture response and a meaningful paired function/test. No runtime benchmark or product acceptance is claimed.
4. [Application Design](../application-design/application-design.md): C-13/S-05 local Ask with read-only retrieval/local generation, validated exact citations and honest failure/uncertainty. The six MCP tools remain unchanged.
5. [Unit definition](../application-design/unit-of-work.md), [dependencies](../application-design/unit-of-work-dependency.md) and [story map](../application-design/unit-of-work-story-map.md): U-01/nine modules retained; 26 stories, 16 FRs and seven NFRs mapped. Module leads remain proposed pending acceptance. Current MVP acceptance is separated from the retained deferred story/provider/format backlog.
6. [Vision](../../../docs/vision.md), current [README summary](../../../README.md) and [feedback ledger](step2-review-package.md): coherent Ask scope, attributed Open questions, per-comment dispositions and four historical web-commit explanations. Iris still owns the final README after integration.

## Q1 — Review the coordinated corrective artifacts

A) Request Changes. Identify the artifact, specific change and reason. Keep this gate pending while the correction is reviewed.

B) Approve the revised Inception artifacts through Units Generation, including the itemized MVP/later-work allocation and the local generation/embedding evaluation plan described below. Retain the documented Open questions. STOP before Construction. Record the actual reviewer(s), response source and rationale; do not imply approval by absent teammates.

C) Other. State the specific decision and rationale to record.

[Answer]: Pending actual team response; no option selected.

**Reviewer(s), date, source and rationale:** Not yet received. No names, votes or attendance are pre-filled.

## Specific follow-up confirmation from the minutes

The [November 23 meeting minutes](meeting-minutes-2026-11-23.md) require separate confirmation of the precise allocation and model plan. Option B above concerns this concrete package:

1. **MVP:** Local Ask and read-only local MCP, with native-text/PDF collection, local/manual organization, source/version/authority handling, local hybrid retrieval and cited evidence.
2. **Retained later work:** Jev/provider permissions, scan/image OCR, advanced math/diagram recognition, audio/video processing and remote ChatGPT/hosted MCP, as itemized in [mvp-scope.md](../requirements/mvp-scope.md). These are retained, not removed, with no later delivery date committed.
3. **Evaluation plan:** Use the unbenchmarked local Ollama `gemma3:4b` candidate as a starting point; compare appropriate Qwen/DeepSeek candidates and select embeddings separately during authorized early Construction, with quality, valid structured output, latency and memory evidence. This approves the evaluation approach, not a final model or claimed benchmark result.
4. **Artifact consistency:** Requirements, stories, design, units, inputs, review records and the Inception-only milestone boundary agree with that allocation. Proposed module leads and other documented Open questions retain their stated status.

## Meeting evidence and next gate

The project discussion took place on November 23, 2026, 10:00–10:10 AM EST on Zoom with all five members. [Iris's source comment](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115423294) and the incorporated [minutes](meeting-minutes-2026-11-23.md) record the discussion and follow-ups. Meetings are scheduled as needed, based on project needs and team availability.

Meeting incorporation is complete. The meeting's product-direction decision does not constitute approval of the itemized allocation, evaluation plan, revised artifacts, implementation or merging. Team members can record their review response on PR #8, referring to this package; only actual responses are entered in the answer above.

After approval, record corrected Inception complete through Units Generation, STOP before Construction, and follow Issue #9's Ready/ordered-merge sequence. This prompt does not itself mark PRs Ready or merge/submit the repository.
