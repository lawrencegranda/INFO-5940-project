# Marketing Campaign Asset Copilot — Technical Environment

Draft for Group 17 review. The following choices target a laptop demo.

## Language, package manager, and framework

| Area | Proposed environment |
| --- | --- |
| Extension | Desktop Chrome stable, Manifest V3, and the Chrome Side Panel API. |
| Build | TypeScript 5.9 with strict typing, plain DOM and CSS, and Vite. Use Node.js 24 LTS and npm with a committed lockfile during Construction. |
| Local storage | IndexedDB for directory handles, asset metadata, campaign briefs, and feedback. The user grants folder access and renews it if needed. |
| Image processing | Decode JPEG and PNG in the browser. Use Canvas to crop, resize, and encode PNG variants. Store approved crop parameters alongside the source reference. |
| Model and provider | Google Gemma 3 4B (`gemma3:4b`) served locally through Ollama. Use vision input to propose descriptive tags and a normalized subject region. Use structured text output to rank a bounded shortlist of indexed assets and explain each result. |

## Cloud provider and deployment model

Load an unpacked extension from a local build and run Ollama on `127.0.0.1:11434`. The extension is the application runtime and uses no hosted backend or database. During indexing it sends resized previews to the loopback model. During search it filters the local index by format and resolution, supplies a shortlist and brief to the model, and validates the returned asset IDs. Geometry checks and Canvas determine whether the suggested crop fits and what gets rendered.

Google Slides is the destination for a user-approved image. First test whether a pre-rendered PNG `File` in the side panel's native drag payload can be dropped onto the intended slide. Google documents dragging images into Slides, but the Chrome side panel to Slides path needs a demo-device test. The Slides REST image API requires a fetchable public URL. If the native drop fails, assess authorized Apps Script image-blob insertion with the team before adopting an integration. PNG download is independently available.

## Test framework

Use Vitest for crop geometry, output dimensions, ranking and preference rules, schema validation, and local model client behavior with controlled responses. Use a fixed set of licensed example images for relevance checks. Use a Chrome smoke test for folder permission renewal, Ollama availability, PNG download, and direct insertion into a team-owned test deck. Run the model on the demo laptop before agreeing on thresholds for indexing and ranking latency.

## Libraries to avoid

| Library | Reason | Alternative |
| --- | --- | --- |
| `sharp` | The extension runtime cannot load its native Node.js addon. | Browser Canvas and bitmap decoding. |
| `axios` | This app makes a small number of JSON model calls. | Browser `fetch` with `AbortController`. |
| Browser CDN builds of UI libraries | Manifest V3 expects executable code to ship in the extension bundle. | Local DOM code bundled by Vite. |

## Security basics

- Open only the user-selected folder with read access. Validate file type, decoded dimensions, and file size before processing. Handle revoked access and allow the user to clear the local index and feedback.
- Restrict model requests to the loopback Ollama address. Allow the installed extension's origin specifically where Ollama requires it. Bundle extension code locally and request only the permissions the implemented paths use.
- Treat file names, briefs, image text, and model output as untrusted. Validate replies against a schema, reject unknown asset IDs and out-of-range crop coordinates, and render returned text as text. Model output cannot trigger file writes or Slides actions.
- Require the user to approve a prepared variant and choose its destination before it leaves the panel. Keep full library imagery, briefs, and feedback local. Use sample assets cleared for sharing in the public course repository and leave credentials out of source and logs.

## Typical endpoint, function, and test

**Endpoint example.** The extension calls Ollama's loopback `POST /api/chat` to describe a preview. The adapter attaches the base64 preview to `messages[0].images` and provides an asset-description JSON Schema as `format`.

```json
{
  "model": "gemma3:4b",
  "stream": false,
  "format": {
    "type": "object",
    "properties": {
      "description": { "type": "string" },
      "contentTags": { "type": "array", "items": { "type": "string" } },
      "styleTags": { "type": "array", "items": { "type": "string" } },
      "subjectBox": {
        "type": "array",
        "items": { "type": "number", "minimum": 0, "maximum": 1 },
        "minItems": 4,
        "maxItems": 4
      }
    },
    "required": ["description", "contentTags", "styleTags", "subjectBox"]
  },
  "messages": [
    {
      "role": "user",
      "content": "Describe the image and give content and style tags. Return the primary subject box as normalized [left, top, width, height].",
      "images": ["<base64-encoded JPEG preview>"]
    }
  ]
}
```

**Function example.** The crop review applies this check to decide whether a proposed crop needs to be flagged for insufficient source resolution. Inputs are positive integer pixel dimensions validated by the caller.

```ts
export function hasEnoughPixels(
  crop: { width: number; height: number },
  target: { width: number; height: number },
): boolean {
  return crop.width >= target.width && crop.height >= target.height
}
```

**Test example.** A crop with enough width still needs enough height for the vertical preset.

```ts
import { expect, it } from 'vitest'
import { hasEnoughPixels } from './crop'

it('flags a crop that would need upscaling', () => {
  const crop = { width: 1200, height: 1800 }
  const target = { width: 1080, height: 1920 }
  expect(hasEnoughPixels(crop, target)).toBe(false)
})
```

## Technical references

- [Chrome Side Panel](https://developer.chrome.com/docs/extensions/reference/api/sidePanel) and [File System Access](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access).
- [Gemma 3 4B on Ollama](https://ollama.com/library/gemma3:4b) and [Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs).
- [Google Slides image insertion](https://support.google.com/docs/answer/97447), [Slides API image requirements](https://developers.google.com/workspace/slides/api/guides/add-image), and [Apps Script Slides image-blob insertion](https://developers.google.com/apps-script/reference/slides/slide#insertImage(BlobSource)).
