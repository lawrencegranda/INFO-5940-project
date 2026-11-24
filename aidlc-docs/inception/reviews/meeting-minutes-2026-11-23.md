# Course Copilot — Team Meeting Minutes

**Date:** November 23, 2026
**Time:** 10:00–10:10 AM EST (America/New_York)
**Format:** Zoom
**Attendees:** Lawrence Granda Zarzuela, Jiaxin (Iris) Li, Xiaolong Lin, Safiullah Safdariyan, Chloe Wang
**Project:** INFO 5940, Group 17 — Course Copilot
**Sources:** [Expanded minutes published by Iris on PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7119034325) and the [original minutes published on PR #8](https://github.com/lawrencegranda/INFO-5940-project/pull/8#issuecomment-7115423294).

## Purpose

Discuss the problems students face when managing course information and decide what Course Copilot should prioritize for the December 16 MVP.

## Problem Discussion

### Fragmented course information

Students taking several courses have to check Canvas, Gradescope, EdStem, PDFs, and email from instructors or TAs. Updates can appear in one place while the original instructions stay unchanged elsewhere. For example, an instructor might email a new deadline while Canvas still shows the original date. Students have to piece together which instructions are current before they can adjust their plans.

### Changes, version history, and exam-week workload

The team discussed how hard it can be to see whether a Canvas page changed, when it changed, or what the previous version said. A student working from an older syllabus could miss a later announcement, submit late, or spend time on the wrong task. During exam weeks, several deadlines compete for attention, and students can lose track of an earlier message or where they left off.

Searching each platform manually takes time. A keyword search can find the original instruction and miss a later update phrased differently. Google Calendar helps students track dates alongside personal events. The team wanted a course-specific view that also records why a date changed and where the update came from.

### A dedicated workspace for each course

The team wanted students to have one place per course to revisit saved materials, announcements, relevant communications, and previous versions. Students should be able to return to a course, see what changed, and pick up where they left off. Keeping originals and source links would let students check which instructor message or document supports an answer when sources disagree.

### Why use an LLM

An instructor or TA may describe a change informally and use different wording from the original assignment. A language model can connect related passages, extract dates and requirements, and help students ask questions in their own words. The system uses explicit source-authority rules, timestamps, and version history to determine which instructions apply. When the evidence is insufficient or conflicting, students should be able to inspect the sources and see what remains unresolved.

These needs informed the choice to prioritize **local Ask** and **read-only local MCP**. Both give students access to the same saved course evidence and citations through different interfaces.

## MVP Scope Discussion

The team discussed the trade-off between the project's intended scope and the limited time available to build and demonstrate a reliable MVP. Several proposed features are valuable, but implementing them all by the final deadline may leave too little time for integration and testing.

The team favored concentrating the MVP on a usable **local Ask experience** and **local MCP integration**. These provide two ways to access course materials: students can ask questions in the local interface, while an external AI client can retrieve saved course evidence through the local, read-only MCP server. Other proposed features can remain in the longer-term product plan and be prioritized separately.

## Decisions

- **Include local Ask and local read-only MCP in the MVP.** Focus implementation and testing on making these paths work reliably with saved course materials and source-linked evidence.
- **Keep the broader product ideas under consideration for later work.** The meeting's scope decision does not, by itself, approve every proposed deferral or change to individual requirements.

## Follow-up

- Confirm and record the precise MVP versus post-MVP feature allocation, including remote ChatGPT integration, Jev and advanced extraction formats, through the team's AI-DLC review process.
- Confirm the local model and embedding evaluation plan. No benchmark result or final model selection is claimed in these minutes.
- Review and approve the revised Inception artifacts in the separate AI-DLC approval gate. The meeting's product-direction decision does not constitute artifact approval.

This meeting did not approve implementation or a repository merge. Itemized deferrals, model choices and revised artifacts require their applicable separate confirmation.
