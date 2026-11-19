# Marketing Campaign Asset Copilot — Vision

Draft for Group 17 review.

## Problem and users

Small marketing teams reuse product and campaign imagery across channels. A marketer preparing a campaign needs to find an image that fits the audience and look of the brief, see whether its subject will survive a crop, and prepare several variants without moving back and forth between a file browser, editor, and slide deck. The copilot puts that workflow in a Chrome Side Panel alongside Google Slides.

The primary user is a marketer assembling a campaign with a small local image library. A teammate reviewing the campaign can use the same crop preview and approve or reject a variant. The MVP uses a single Chrome profile for the demo, so that review may happen on the same laptop.

## MVP scope

| Step | What the MVP does |
| --- | --- |
| Set up | The user selects one local folder. Index supported JPEG and PNG files with a description, content and style tags, subject placement, and suitability for each supported format. Show indexing progress and report files that could not be read or analyzed. |
| Define a campaign | Capture the target audience, desired visual style, and channels. Start with demo presets for square (1080 × 1080), vertical (1080 × 1920), and widescreen (1280 × 720). These are export targets used for the demo. |
| Find images | Recommend up to three indexed images per format with short reasons based on the brief and image metadata. If none is suitable, say which format lacks a match and allow the user to revise the brief, add assets, or pick an alternate to preview. An empty result leaves the Slides deck untouched. |
| Prepare variants | Suggest a crop around the subject and render the requested dimensions. Let the user reposition the crop in a preview. Flag a cut-off subject or inadequate source resolution for review. Preserve the original file. |
| Refine | Approve, reject, or request a different crop. Record feedback locally and let later rankings for the campaign reflect explicit preferences, such as preferring a clean background. Preview a revised crop before approving it. |
| Export or insert | Download the approved variant. With an editable Slides deck open, let the user put an approved image directly onto the intended slide from the side panel. Test drag and drop as the first approach. |

## Demo acceptance targets

- Index a test folder of at least 30 JPEG and PNG assets and keep the index after reopening the panel, with a clear reauthorization prompt if folder access was lost.
- Try three sample briefs. For briefs with a known suitable asset, the team judges at least one of the first three recommendations suitable for each tested brief. Include a separate case with no eligible image and verify that the app reports the gap.
- Export approved variants at all three preset dimensions and check that the selected subject is visible in the preview and output. Reject a variant or request a crop adjustment and verify that an unapproved variant cannot be inserted or exported.
- Show a subsequent ranking that reflects a recorded preference. Place one approved PNG directly on an editable Google Slides page and verify the intended slide and asset visually.

## Out of scope

- Google Drive as an asset library, multi-user sync, and shared approval queues.
- Generated images or ads, campaign copywriting, or automated publishing.
- Training or fine-tuning a model from user feedback, custom presets, and support for other design tools.

## Open questions for team review

- Which real campaign and licensed demo assets should the team use to judge relevance and crop quality?
- What indexing and search wait times are acceptable on the demo laptop? Measure the proposed local model before agreeing on performance targets.
- Can the side panel hand the prepared PNG to Google Slides using a native drop on the demo Chrome version? If it cannot, evaluate an authorized Slides integration and agree on its impact on the deadline.
- Should feedback carry over to future campaigns? The draft limits it to the current campaign until the team has a reason to share preferences across briefs.
