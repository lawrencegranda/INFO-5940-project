# Chrome capture extension

After building the app, open `chrome://extensions` in Chrome, enable Developer mode and choose **Load unpacked**, selecting `dist/extension`. This is a manual user action; the app does not install an extension or change Chrome permissions.

Start the local Course Copilot app at `http://127.0.0.1:4310`, copy its extension pairing code from Settings, and paste it into the extension's **Connect your local library** panel. Open an accessible webpage, invoke the extension, choose the destination course and explicitly select **Save to library**.

The extension saves a bounded, sanitized HTML snapshot without scripts, form controls, hidden fields, request headers, cookies or LMS tokens. It discovers linked/embedded resources but saves only checked resources. Same-origin file acquisition uses the active page's existing authorized context; cross-origin public-file acquisition requests permission for each selected host from the Save click and sends no credentials. Protected resources, unsupported extraction and failed individual files remain visible; use permitted manual file upload in the library when needed. Keep the popup open while a save is running.

Limits: 2 MB page HTML, 25 discovered resources and 8 MB per captured asset. A file can be preserved even when its OCR/transcription format is currently unavailable; inspect its extraction status in the library. Actual Canvas, Gradescope, EdStem and user-authenticated media behavior still require user-authorized testing; this implementation does not claim those integrations were verified.
