# Marketing Campaign Asset Copilot

This standalone Cornell INFO 5940 prototype recommends and prepares campaign images from a local library. The Chrome side panel uses the installed `qwen3-vl:8b-instruct` through Ollama. You can enter a campaign brief or connect a Google Slides presentation with read-only access.

## Try the prototype from this branch

From the root of your local checkout, confirm Ollama already has `qwen3-vl:8b-instruct` installed with `ollama list`. You need at least four local JPEG, PNG, or WebP photos to follow the browser test. Use a folder of test images you have permission to use.

1. In a terminal, start the local-only Ollama listener.

   ```sh
   cd prototype
   ./start-ollama.sh
   ```

   Leave that terminal open. The launcher uses the installed model store and binds to `127.0.0.1:11435` with Ollama cloud inference disabled. If you already started this listener, open the panel and click **Check**.

2. At `chrome://extensions`, enable **Developer mode** and click **Load unpacked**. Select the `prototype/dist` folder inside your checkout. Pin **Marketing Campaign Asset Copilot** and click its toolbar icon. To pick up a rebuilt version, click **Reload** on the extension card.
3. In the panel, click **Choose folder** and select your local test images. Click **Index images** for photos that still need metadata. The index and full-resolution image copies stay in this Chrome profile.

## Prepare campaign images

1. On **Recommend**, enter a brief such as “I need an Instagram Story promoting an engineering student research event. Find a polished lab image and leave space on the left for a headline.” You can also choose one of the three sample briefs.
2. Click **Find images**. Review the interpreted purpose, audience, and layout. A brief with an ambiguous placement offers choices before ranking. You can manually choose an **Output placement** and set exact pixel dimensions. Dimensions must be whole numbers from 64 through 4096. Custom values are remembered for that preset.
3. Review the fit and layout risk for each recommendation. **Reject & refine** applies your feedback to the current brief. **Preview crop** opens the selected format with the suggested crop or pad strategy.
4. Adjust horizontal framing, vertical framing, and zoom. **Try model focus** applies the model's suggested center for review. Under **Check subject preservation**, drag a box around the parts that must stay visible. The preview reports the percentage of that box in frame. **Download PNG** saves the rendered image at the shown dimensions.

| Placement | Editable starting size |
| --- | --- |
| Instagram Feed | 1080 × 1080 square or 1080 × 1350 portrait |
| Instagram Stories | 1080 × 1920 |
| Facebook Feed | 1200 × 630 landscape or 1080 × 1080 square |
| X / Twitter landscape post | 1600 × 900 |
| Google Slides | 1920 × 1080 widescreen or 1600 × 1200 standard. An imported deck uses its actual aspect ratio. |

These are prototype export presets. Check the requirements of the destination account and placement before publishing.

## Test Google Slides in read-only mode

The build includes the team's public OAuth client ID for `info5940-asset-copilot`. The extension ID is `amgmmlmejpmclbcciahcpfbaijepimgn`. Ask the Google Cloud project owner to add the Google account you use in Chrome under **Google Auth Platform → Audience → Test users**. That account also needs viewer access to the test deck. Campaign mode works without Google access.

1. Open a deck with a text box and an image. Click the extension icon and expand **Read a Google Slides deck**. Paste the deck's editor link if the panel does not detect it.
2. Click **Read deck**. Allow access to `slides.googleapis.com` and accept the `presentations.readonly` consent prompt.
3. Choose the slide in the picker. Check that the panel shows the expected text, image element count, and positions. Click **Use this slide → Find images** to get recommendations from local Qwen.

If Google returns a 403, check that the Slides API is enabled, your Chrome account is an allowed test user, and you have deck access. A published presentation link should be replaced with its normal editor or view link. The extension uses read-only requests and stores authorization in Chrome's account cache.

To use your own Cloud project, enable the Slides API, add your test accounts and the read-only scope, and create a **Chrome Extension** OAuth client with the extension ID above as its **Item ID**. Run the following from `prototype` with Node 24, then reload the extension. Use the public client ID. [Chrome OAuth setup](https://developer.chrome.com/docs/extensions/how-to/integrate/oauth) · [Slides scopes](https://developers.google.com/workspace/slides/api/scopes)

```sh
npm run configure:slides -- 'YOUR_CLIENT_ID.apps.googleusercontent.com'
npm run build
```

## Build and test

Run from the prototype folder with Node 24.

```sh
npm ci
npm run build
npm test
npm run test:chrome -- "/absolute/path/to/your/test-photos"
npm run benchmark:campaign
SPIKE_CHROME_PROFILE="/absolute/path/to/closed/indexed/test/profile" npm run test:phase2
```

The Chrome regression uses the installed local model and writes test results to `.test-output/`. A fresh test profile reindexes photos. To reuse them, set `SPIKE_CHROME_PROFILE` to an **unused or closed test profile** containing the index. The Phase 2 browser test uses that profile to verify source-image rendering, exact PNG dimensions and the Slides UI with simulated Google responses. The campaign benchmark uses actual local model responses. Set `CHROME_PATH` if Chrome is installed outside the macOS default location.

[Feasibility report and evidence](FEASIBILITY.md)
