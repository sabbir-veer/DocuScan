# DocuScan — Complete Project Plan
> **Smart Document Scanner & Data Extractor**  
> A fully browser-based React application for scanning, preprocessing, OCR, AI-powered data extraction, archiving, and exporting physical documents.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Libraries](#2-tech-stack--libraries)
3. [Folder Structure](#3-folder-structure)
4. [UI Design System](#4-ui-design-system)
5. [Application Pages & Navigation](#5-application-pages--navigation)
6. [Feature Specifications](#6-feature-specifications)
   - 6.1 [Image Capture](#61-image-capture)
   - 6.2 [Perspective Correction & Preprocessing](#62-perspective-correction--preprocessing)
   - 6.3 [OCR Text Extraction](#63-ocr-text-extraction)
   - 6.4 [AI Document Structuring (Gemini)](#64-ai-document-structuring-gemini)
   - 6.5 [Document Type Detection](#65-document-type-detection)
   - 6.6 [OCR Word Highlighting](#66-ocr-word-highlighting)
   - 6.7 [Handwriting Mode (Gemini Vision)](#67-handwriting-mode-gemini-vision)
   - 6.8 [Searchable Local Archive](#68-searchable-local-archive)
   - 6.9 [Smart Auto-Tagging](#69-smart-auto-tagging)
   - 6.10 [Batch Processing](#610-batch-processing)
   - 6.11 [CSV / JSON Export](#611-csv--json-export)
   - 6.12 [PDF Report Export](#612-pdf-report-export)
   - 6.13 [Expense Summarizer](#613-expense-summarizer)
7. [AI Integration — Gemini API](#7-ai-integration--gemini-api)
8. [Data Flow — End to End](#8-data-flow--end-to-end)
9. [State Management](#9-state-management)
10. [IndexedDB Schema](#10-indexeddb-schema)
11. [Implementation Rules & Constraints](#11-implementation-rules--constraints)
12. [Case Studies](#12-case-studies)
13. [Error Handling Strategy](#13-error-handling-strategy)
14. [Performance Guidelines](#14-performance-guidelines)
15. [Build & Environment Setup](#15-build--environment-setup)

---

## 1. Project Overview

DocuScan is a **100% frontend, zero-backend** React application. Every computation — image processing, OCR, data storage — runs inside the browser. The only outbound network call is to the **Google Gemini API** for AI-powered text structuring, document classification, smart tagging, and handwriting recognition.

### Core Value Proposition

| Problem | DocuScan Solution |
|---|---|
| Physical receipts fade and get lost | Scan → extract → archive locally, forever |
| Manual data entry from invoices is slow | AI extracts all fields automatically |
| Exported spreadsheets need clean data | One-click CSV/JSON with structured fields |
| Handwritten notes are unsearchable | Gemini Vision reads handwriting into structured text |
| No internet? No problem | All processing except AI runs fully offline |

### What Makes It a Strong University Project

- Covers **image processing** fundamentals: edge detection, morphological operations, perspective transforms, binarization.
- Integrates a **modern LLM API** (Gemini) in a practical, justified way.
- Demonstrates **in-browser computation** (WebAssembly, Web Workers) — not just React forms.
- The archive and search feature shows **local database design** skills.
- End-to-end data pipeline: raw photo → structured JSON → exported CSV.

---

## 2. Tech Stack & Libraries

### Core Framework

| Tool | Version | Role |
|---|---|---|
| **React** | 18.x | UI component framework, component tree, hooks |
| **TypeScript** | 5.x | Type safety across the entire codebase |
| **Vite** | 5.x | Build tool, dev server, HMR, code splitting |
| **React Router DOM** | 6.x | Client-side routing between views |

### Image Processing

| Library | Role | Why This One |
|---|---|---|
| **OpenCV.js** | Perspective correction, deskewing, denoising, binarization, contour detection | The gold-standard computer vision library compiled to WebAssembly. Runs entirely in the browser with no server. |
| **Canvas API** (native) | Image rendering, crop UI, OCR word highlight overlays | Built into every browser. Used for pixel-level operations and drawing bounding boxes over images. |

**OpenCV.js loading strategy:** The WASM binary is ~8MB. Do NOT import it at the top of the app. Lazy-load it only when the scanner page is first visited using a dynamic import wrapper. Store a singleton reference in a module-level variable once loaded.

```ts
// src/lib/opencv-loader.ts
let cvInstance: any = null;

export async function loadOpenCV(): Promise<any> {
  if (cvInstance) return cvInstance;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = '/opencv.js'; // place opencv.js in /public
    script.onload = () => {
      (window as any).cv.then((cv: any) => {
        cvInstance = cv;
        resolve(cv);
      });
    };
    document.body.appendChild(script);
  });
}
```

### OCR

| Library | Role | Why This One |
|---|---|---|
| **Tesseract.js** | Full in-browser OCR. Returns extracted text AND word-level bounding boxes. | Most mature browser OCR. The bounding box data is essential for the word-highlight feature. Supports many languages. |

**Tesseract language packs:** Default to English (`eng`). If Bengali support is needed, also load `ben`. Language packs are downloaded on first use and cached by the browser. Always run Tesseract inside a **Web Worker** (Tesseract.js does this automatically via `createWorker`) to keep the UI thread responsive.

### AI Integration

| Library | Role |
|---|---|
| **@google/generative-ai** (Gemini SDK) | Official JavaScript SDK for calling Gemini API. Used for document classification, field extraction, tagging, handwriting recognition, and expense summarization. |

See [Section 7](#7-ai-integration--gemini-api) for full Gemini integration details.

### Storage

| Library | Role | Why This One |
|---|---|---|
| **Dexie.js** | IndexedDB wrapper for local document archive | Raw IndexedDB is verbose and callback-based. Dexie provides a clean promise/async API, compound indexes, and a query builder. All data stays on-device — no backend needed. |

### Export

| Library | Role |
|---|---|
| **papaparse** | Serialize structured document JSON records into CSV. Used for bulk export of the archive. |
| **jsPDF** | Generate single-document PDF reports combining the cleaned image and a table of extracted fields. |

### State Management

| Library | Role |
|---|---|
| **Zustand** | Lightweight global state. Manages the scan queue, current document in progress, archive filter state, and user settings (API key, language, theme). No Redux boilerplate. |

### UI & Styling

| Tool | Role |
|---|---|
| **Tailwind CSS** | Utility-first styling. All component styles written as class strings. No separate CSS files per component. |
| **Lucide React** | Icon set. Clean, consistent SVG icons throughout the UI. |
| **React Hot Toast** | Non-blocking toast notifications for scan success, OCR completion, AI errors, export done. |

---

## 3. Folder Structure

```
docuscan/
├── public/
│   └── opencv.js                    # OpenCV WASM binary (download separately)
├── src/
│   ├── main.tsx                     # App entry, React root
│   ├── App.tsx                      # Router setup, global providers
│   │
│   ├── pages/
│   │   ├── ScannerPage.tsx          # Camera capture + file upload UI
│   │   ├── ReviewPage.tsx           # Preprocessing controls + OCR results + AI output
│   │   ├── ArchivePage.tsx          # Browse, search, filter saved documents
│   │   ├── DocumentDetailPage.tsx   # Single document view + re-extract option
│   │   ├── ExportPage.tsx           # Batch export to CSV / JSON
│   │   └── SettingsPage.tsx         # API key, language, theme, storage info
│   │
│   ├── components/
│   │   ├── scanner/
│   │   │   ├── CameraCapture.tsx    # getUserMedia live preview
│   │   │   ├── FileUpload.tsx       # Drag-and-drop zone
│   │   │   ├── CropOverlay.tsx      # Manual corner selection canvas overlay
│   │   │   └── BatchQueue.tsx       # Queue display for multiple files
│   │   ├── review/
│   │   │   ├── ImagePreview.tsx     # Cleaned image + OCR word highlight overlay
│   │   │   ├── FieldEditor.tsx      # Editable extracted fields panel
│   │   │   ├── RawTextPanel.tsx     # Raw OCR text display
│   │   │   └── ConfidenceBar.tsx    # Per-field AI confidence indicator
│   │   ├── archive/
│   │   │   ├── DocumentCard.tsx     # Thumbnail + metadata card in grid
│   │   │   ├── SearchBar.tsx        # Full-text search input
│   │   │   ├── FilterPanel.tsx      # Filter by type, tags, date range
│   │   │   └── TagChip.tsx          # Reusable tag badge component
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ProgressSteps.tsx    # 5-step pipeline progress indicator
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── lib/
│   │   ├── opencv-loader.ts         # Lazy OpenCV singleton loader
│   │   ├── preprocessing.ts         # All OpenCV image pipeline functions
│   │   ├── ocr.ts                   # Tesseract.js worker wrapper
│   │   ├── gemini.ts                # All Gemini API call functions
│   │   └── export.ts                # CSV, JSON, PDF export functions
│   │
│   ├── db/
│   │   ├── schema.ts                # Dexie table definitions and types
│   │   └── queries.ts               # All database read/write/search functions
│   │
│   ├── store/
│   │   ├── scanStore.ts             # Zustand: active scan state + queue
│   │   ├── archiveStore.ts          # Zustand: filter/search state
│   │   └── settingsStore.ts         # Zustand: user preferences, API key
│   │
│   ├── types/
│   │   └── index.ts                 # All shared TypeScript interfaces
│   │
│   └── hooks/
│       ├── useCamera.ts             # Camera stream lifecycle hook
│       ├── useOpenCV.ts             # OpenCV load state hook
│       └── useDebounce.ts           # Search debounce hook
│
├── .env.local                       # VITE_GEMINI_API_KEY=your_key_here
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 4. UI Design System

### Design Philosophy

DocuScan should feel **calm, focused, and trustworthy** — like a professional tool, not a toy. The user is handling important documents (receipts, bills, IDs), so the interface must feel stable and deliberate. Avoid flashy animations or cluttered layouts.

Design keywords: **Clean. Structured. Confident. Minimal chrome, maximum clarity.**

### Color Palette

#### Light Mode

| Role | Name | Hex | Usage |
|---|---|---|---|
| Brand primary | Slate Blue | `#3B5BDB` | Primary buttons, active nav item, links |
| Brand hover | Deep Blue | `#2F4AC0` | Button hover state |
| Background | Off-white | `#F8F9FC` | Page background |
| Surface | White | `#FFFFFF` | Cards, panels, modals |
| Surface alt | Soft gray | `#F1F3F9` | Input backgrounds, secondary panels |
| Border | Light gray | `#E2E6F0` | Card borders, dividers |
| Text primary | Near-black | `#1A1D2E` | Headings, primary labels |
| Text secondary | Medium gray | `#6B7280` | Subtitles, helper text, placeholders |
| Text muted | Light gray | `#9CA3AF` | Disabled, timestamps |
| Success | Teal green | `#0F9E78` | Completed steps, saved indicator, confidence high |
| Warning | Amber | `#D97706` | Medium confidence, processing warning |
| Danger | Soft red | `#DC2626` | Errors, low confidence, delete actions |
| AI accent | Indigo | `#6366F1` | Anything AI-generated — field badges, Gemini indicator |
| AI light | Indigo tint | `#EEF2FF` | AI-generated field background |

#### Dark Mode

| Role | Hex | Usage |
|---|---|---|
| Background | `#0F1117` | Page background |
| Surface | `#1A1D2E` | Cards, panels |
| Surface alt | `#252840` | Input backgrounds, secondary panels |
| Border | `#2E3248` | Card borders, dividers |
| Text primary | `#F1F3F9` | Headings |
| Text secondary | `#9CA3AF` | Subtitles |
| Brand primary | `#4E6EF2` | Buttons (slightly lighter for contrast) |
| Success | `#10B981` | |
| Warning | `#F59E0B` | |
| Danger | `#EF4444` | |
| AI accent | `#818CF8` | |
| AI light | `#1E1F3B` | |

**Implementation:** Define all colors as CSS custom properties on `:root` and `[data-theme="dark"]`. Use Tailwind's `dark:` prefix. Never hardcode hex values directly in component className strings — always use the semantic token names defined in `tailwind.config.ts`.

```ts
// tailwind.config.ts — extend colors
colors: {
  brand: { DEFAULT: '#3B5BDB', hover: '#2F4AC0' },
  surface: { DEFAULT: '#FFFFFF', alt: '#F1F3F9' },
  ai: { DEFAULT: '#6366F1', light: '#EEF2FF' },
  // ... etc
}
```

### Typography

| Role | Font | Size | Weight |
|---|---|---|---|
| Display heading | Inter | 28px | 700 |
| Section heading | Inter | 20px | 600 |
| Card title | Inter | 15px | 500 |
| Body text | Inter | 14px | 400 |
| Caption / label | Inter | 12px | 400 |
| Monospace (raw OCR text) | JetBrains Mono | 13px | 400 |

Import Inter and JetBrains Mono from Google Fonts in `index.html`.

### Spacing Scale

Use Tailwind's default spacing scale. Key values:
- Component internal padding: `p-4` (16px)
- Card gap in grid: `gap-4` (16px)
- Section vertical spacing: `mb-8` (32px)
- Tight list spacing: `gap-2` (8px)

### Component Style Rules

**Cards:** `bg-surface rounded-xl border border-border shadow-sm p-4`

**Primary Button:** `bg-brand text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-hover transition-colors`

**Secondary Button:** `bg-surface-alt text-text-primary border border-border rounded-lg px-4 py-2 text-sm`

**Danger Button:** `bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-2 text-sm`

**AI Badge:** `bg-ai-light text-ai text-xs font-medium px-2 py-0.5 rounded-full` — attach to every field that was populated by Gemini.

**Tag Chip:** `bg-surface-alt text-text-secondary text-xs px-2.5 py-1 rounded-full border border-border`

**Input field:** `bg-surface-alt border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30`

**Progress step (active):** Circle with `bg-brand text-white`, connector line `bg-brand`
**Progress step (done):** `bg-success text-white` with checkmark icon
**Progress step (pending):** `bg-surface-alt text-text-muted border border-border`

### Iconography

Use **Lucide React** exclusively. Icon sizes: `16px` for inline labels, `20px` for navigation, `24px` for feature sections. Always pair icons with visible text labels — do not use icon-only buttons except for the close (X) action on modals.

Key icons to use:
- `Camera` — scanner page
- `Upload` — file upload
- `ScanLine` — processing indicator
- `FileText` — document / OCR
- `Sparkles` — AI / Gemini actions
- `Archive` — archive page
- `Search` — search
- `Tag` — tagging
- `Download` — export
- `Settings` — settings
- `CheckCircle` — success
- `AlertCircle` — warning/error
- `Trash2` — delete

### Pipeline Progress Indicator

Show a 5-step horizontal stepper at the top of the ReviewPage, reflecting the current processing state. Steps:

1. **Captured** — image received
2. **Enhanced** — OpenCV preprocessing done
3. **Text read** — Tesseract OCR done
4. **AI structured** — Gemini extraction done
5. **Saved** — stored to IndexedDB

Each step shows: icon + label. Active step pulses. Completed steps show a green checkmark. Failed steps show a red alert icon with a retry button.

---

## 5. Application Pages & Navigation

### Navbar (persistent)

Bottom navigation bar on mobile, left sidebar on desktop.

| Item | Icon | Route |
|---|---|---|
| Scan | `Camera` | `/scan` |
| Archive | `Archive` | `/archive` |
| Export | `Download` | `/export` |
| Settings | `Settings` | `/settings` |

Default route: `/scan`

### Page Descriptions

#### `/scan` — ScannerPage

The landing experience. Two modes via tab toggle:

- **Camera mode:** Live video preview using `getUserMedia`. A document-shaped overlay (white frame with corner markers) guides the user to align their document. A capture button takes a photo. Captured image is then sent to the crop/correction step.
- **Upload mode:** Drag-and-drop zone + file browser button. Accepts `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf` (PDF: extract first page as image using a canvas trick). Multiple files can be queued from here.

After capture: navigate to `/review/:id` with the raw image data in Zustand store.

#### `/review/:id` — ReviewPage

The main processing workspace. Left panel shows the document image (cleaned or raw). Right panel shows processing results.

Top area: the 5-step progress indicator.

Left panel:
- Processed image (or raw if preprocessing failed)
- OCR highlight overlay canvas (toggleable)
- Controls: Zoom in/out, toggle highlights, rotate 90°

Right panel:
- Extracted fields display (editable)
- Document type badge
- Raw OCR text expandable section
- AI confidence indicators
- Action buttons: Save to Archive, Re-run AI, Download PDF

#### `/archive` — ArchivePage

Grid of DocumentCard components (thumbnail + key fields). Top bar has search input and filter controls.

Filter options: document type, tags, date range, has-AI-data vs OCR-only.

Clicking a card opens `/document/:id`.

#### `/document/:id` — DocumentDetailPage

Full view of one saved document. Shows cleaned image, all extracted fields, raw OCR, tags. Options: edit fields manually, re-run AI extraction, delete, export as PDF, copy field values.

#### `/export` — ExportPage

Select documents from a list (checkbox grid). Choose format: CSV, JSON, or PDF batch. Configure CSV column mapping. Download.

#### `/settings` — SettingsPage

- Gemini API key input (stored in `localStorage`, never sent anywhere except Gemini API)
- OCR language selector (English, Bengali, or both)
- Theme toggle (light / dark)
- Storage info: number of documents, estimated storage used
- Clear all data button (with confirmation dialog)

---

## 6. Feature Specifications

---

### 6.1 Image Capture

#### Purpose
Acquire a raw image of the physical document either from the device camera or from a file upload.

#### Camera Capture

**How it works:**
1. Call `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })` to access the rear camera on mobile or the webcam on desktop.
2. Stream the live video into a `<video>` element inside `CameraCapture.tsx`.
3. Render a semi-transparent document frame overlay on a `<canvas>` layered on top of the video. This overlay has corner markers showing the user where to align the document.
4. When the user taps "Capture", draw the current video frame onto an offscreen `<canvas>` using `ctx.drawImage(videoEl, 0, 0)`. Convert to Blob via `canvas.toBlob('image/jpeg', 0.92)`.
5. Store the resulting Blob as a raw image in the scan store. Navigate to ReviewPage.

**Hook — `useCamera.ts`:**
```ts
// Manages stream start, stop, and cleanup on unmount
// Returns: { videoRef, startCamera, stopCamera, captureFrame, isReady, error }
```

**Edge cases:**
- If `getUserMedia` is denied: show a clear permission prompt card with instructions for each browser. Offer a fallback to file upload.
- If no camera device found: automatically switch to upload tab.
- On iOS Safari: `facingMode: 'environment'` may need `{ exact: 'environment' }` — handle both.

#### File Upload

**How it works:**
1. Drag-and-drop or file input accepting `image/*` and `application/pdf`.
2. For images: read with `FileReader.readAsDataURL()`, decode into an `<img>`, draw onto a canvas at max 2400px width (downscale larger files to save memory).
3. For PDFs: use `PDF.js` (optional, lower priority) or inform the user to take a screenshot/photo of the PDF. If implementing PDF: render page 1 to a canvas via PDF.js and treat the canvas output as the input image.
4. Multiple files: each file is added to the batch queue (array in Zustand store). They are processed sequentially, one at a time.

**Constraints:**
- Maximum file size: 10MB per image.
- Maximum batch size: 20 files per session.
- Supported formats: JPEG, PNG, WEBP. PDF support is optional and lower priority.

---

### 6.2 Perspective Correction & Preprocessing

#### Purpose
Transform a skewed, warped, or noisy photo of a document into a clean, flat, high-contrast image that maximises OCR accuracy.

#### Step-by-Step Pipeline

All OpenCV operations run in a **Web Worker** via a `preprocessing.ts` module. The main thread posts the image data to the worker and receives the processed image data back.

**Step 1 — Grayscale conversion**
```
cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY)
```
Convert the RGBA canvas image to grayscale. All subsequent operations work on a single channel, which is faster.

**Step 2 — Noise reduction**
```
cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0)
```
A 5×5 Gaussian blur removes high-frequency noise (grain, compression artifacts) before edge detection. This prevents false edges from being detected.

**Step 3 — Edge detection**
```
cv.Canny(blurred, edges, 50, 150)
```
Canny edge detection with low threshold 50 and high threshold 150. Returns a binary image where edges are white. These edges are what OpenCV will use to find the document boundary.

**Step 4 — Contour detection**
```
cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
```
Find all external contours in the edge image. Sort contours by area descending. The largest contour is almost certainly the document outline.

**Step 5 — Quadrilateral approximation**
```
cv.approxPolyDP(largestContour, approx, epsilon, true)
```
Approximate the largest contour to a polygon. Use `epsilon = 0.02 * perimeter`. If the result has exactly 4 vertices, it is the document corners. If not 4 vertices, skip perspective correction and proceed with just the image cleanup steps.

**Step 6 — Perspective transform**
```
cv.getPerspectiveTransform(srcPoints, dstPoints)
cv.warpPerspective(src, warped, M, dstSize)
```
Map the 4 detected corner points to a perfect rectangle. `dstSize` is computed from the detected document dimensions. This "unwarps" the photo to a flat top-down view.

**Step 7 — Binarization (adaptive thresholding)**
```
cv.adaptiveThreshold(warped, binary, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2)
```
Adaptive thresholding handles uneven lighting (a common problem with photographed documents). The image is converted to pure black and white text on a white background. This dramatically improves OCR accuracy.

**Step 8 — Deskew (if perspective correction was skipped)**
If no 4-corner contour was found, detect text skew using the Hough line transform. Rotate the image to correct the skew angle. This handles flat documents that are slightly tilted.

**Step 9 — Morphological cleanup**
```
cv.morphologyEx(binary, cleaned, cv.MORPH_CLOSE, kernel)
```
A small closing operation fills minor gaps in text characters that might confuse the OCR engine.

**Output:** A clean, flat, high-contrast grayscale image as a canvas `ImageData` object. Pass this to both:
- The image display (show the cleaned image in the review panel)
- The Tesseract OCR engine

#### Manual Corner Selection (Fallback UI)

If automatic corner detection fails (returns fewer than 4 clear corners), show a manual crop interface:
- Display the original image with 4 draggable corner handles positioned at the image corners.
- User drags handles to the actual document corners.
- On confirm, run `warpPerspective` with the manually selected points.
- Show a "Try auto-detect again" button.

#### Preprocessing Controls (ReviewPage UI)

Let the user fine-tune before running OCR:
- **Binarization toggle:** Show cleaned black/white vs original color image.
- **Contrast slider:** ±50% brightness/contrast adjustment applied before binarization.
- **Rotate buttons:** 90° clockwise / counterclockwise.
- **Re-run preprocessing:** After adjusting controls, re-run the preprocessing pipeline.

---

### 6.3 OCR Text Extraction

#### Purpose
Convert the cleaned document image into machine-readable text, with word-level position data for the highlight overlay feature.

#### Implementation

**Library:** Tesseract.js

**Worker initialization:**
```ts
// src/lib/ocr.ts
import { createWorker } from 'tesseract.js';

let worker: Awaited<ReturnType<typeof createWorker>> | null = null;

export async function getOCRWorker(lang = 'eng') {
  if (worker) return worker;
  worker = await createWorker(lang, 1, {
    logger: (m) => console.log(m), // progress logging
  });
  return worker;
}

export async function extractText(imageData: string, lang = 'eng') {
  const w = await getOCRWorker(lang);
  const result = await w.recognize(imageData);
  return {
    text: result.data.text,
    words: result.data.words, // array of { text, bbox: {x0,y0,x1,y1}, confidence }
    confidence: result.data.confidence,
  };
}
```

**The `words` array** — each word object contains:
- `text`: the recognized string
- `bbox`: `{ x0, y0, x1, y1 }` pixel coordinates on the image
- `confidence`: 0–100 score for this word's recognition quality

**Language support:**
- Default: `eng` (English)
- Optional: `ben` (Bengali/Bangla)
- If both are selected in settings, pass `'eng+ben'` to Tesseract

**Progress reporting:**
- Tesseract's logger fires with `{ status, progress }` during recognition.
- Wire the progress value to the step 3 progress indicator and a percentage label.
- Typical stages: `loading tesseract core`, `initializing api`, `recognizing text`.

**Output stored per document:**
```ts
{
  rawText: string,           // full OCR text as plain string
  words: Word[],             // word objects with bboxes
  ocrConfidence: number,     // 0-100 overall confidence
  ocrLanguage: string,       // 'eng' | 'ben' | 'eng+ben'
  ocrCompletedAt: Date,
}
```

**When to skip OCR:**
- Handwriting mode is active → skip Tesseract, send image directly to Gemini Vision.
- The user clicks "Skip OCR" and pastes text manually (edge case override).

---

### 6.4 AI Document Structuring (Gemini)

#### Purpose
Transform raw, unordered OCR text into a clean, structured JSON object with named fields appropriate for the document type.

#### Gemini Model Used

`gemini-1.5-flash` — Fast, cost-efficient, excellent for structured text extraction. Use `gemini-1.5-pro` only if flash gives poor results on complex documents.

#### Full Prompt Template

The system instruction sets the extraction rules. The user message contains the OCR text and document type hint.

```
SYSTEM:
You are a document data extraction assistant. Your job is to parse raw OCR text from scanned documents and return a structured JSON object. 

Rules:
- Return ONLY valid JSON. No markdown, no explanation, no code fences.
- If a field is not present in the text, set its value to null.
- Normalize all dates to ISO 8601 format (YYYY-MM-DD). If year is missing, use the current year.
- Normalize all monetary amounts to numeric values (no currency symbols in the value field). Store the currency code separately.
- For line_items arrays, each item must have: { description, quantity, unit_price, total }
- If quantity or unit_price is unclear, set them to null but keep description and total.
- Confidence score (0.0 to 1.0) reflects how complete and clear the extraction is.
- Return the detected document language as an ISO 639-1 code.

USER:
Document type hint: {documentType}

Raw OCR text:
---
{rawOcrText}
---

Extract all relevant information and return JSON matching this schema:
{jsonSchema}
```

#### JSON Schemas by Document Type

**Receipt schema:**
```json
{
  "type": "receipt",
  "vendor": "string | null",
  "address": "string | null",
  "phone": "string | null",
  "date": "YYYY-MM-DD | null",
  "time": "HH:MM | null",
  "receipt_number": "string | null",
  "line_items": [{ "description": "", "quantity": null, "unit_price": null, "total": null }],
  "subtotal": "number | null",
  "tax": "number | null",
  "discount": "number | null",
  "total": "number | null",
  "currency": "BDT | USD | ...",
  "payment_method": "string | null",
  "confidence": 0.0
}
```

**Invoice schema:**
```json
{
  "type": "invoice",
  "invoice_number": "string | null",
  "vendor": "string | null",
  "vendor_address": "string | null",
  "client": "string | null",
  "client_address": "string | null",
  "date_issued": "YYYY-MM-DD | null",
  "date_due": "YYYY-MM-DD | null",
  "line_items": [{ "description": "", "quantity": null, "unit_price": null, "total": null }],
  "subtotal": "number | null",
  "tax": "number | null",
  "total": "number | null",
  "currency": "string",
  "notes": "string | null",
  "confidence": 0.0
}
```

**ID Card schema:**
```json
{
  "type": "id_card",
  "id_type": "national_id | passport | driver_license | student_id | other",
  "full_name": "string | null",
  "id_number": "string | null",
  "date_of_birth": "YYYY-MM-DD | null",
  "date_of_issue": "YYYY-MM-DD | null",
  "date_of_expiry": "YYYY-MM-DD | null",
  "address": "string | null",
  "nationality": "string | null",
  "issuing_authority": "string | null",
  "confidence": 0.0
}
```

**Form schema (generic):**
```json
{
  "type": "form",
  "form_title": "string | null",
  "fields": [{ "label": "string", "value": "string | null" }],
  "date": "YYYY-MM-DD | null",
  "confidence": 0.0
}
```

**Handwritten note schema:**
```json
{
  "type": "note",
  "title": "string | null",
  "content": "string",
  "date": "YYYY-MM-DD | null",
  "key_points": ["string"],
  "confidence": 0.0
}
```

#### Implementation

```ts
// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

function getClient(): GoogleGenerativeAI {
  const key = localStorage.getItem('gemini_api_key');
  if (!key) throw new Error('Gemini API key not configured. Go to Settings.');
  return new GoogleGenerativeAI(key);
}

export async function structureDocument(
  rawText: string,
  documentType: string,
  schema: object
): Promise<ExtractedData> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = buildExtractionPrompt(rawText, documentType, schema);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip any accidental markdown fences before parsing
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as ExtractedData;
}
```

**Retry logic:** If JSON parsing fails on the first attempt, make a second call with an additional instruction: "Your previous response was not valid JSON. Return ONLY the raw JSON object with no surrounding text."

---

### 6.5 Document Type Detection

#### Purpose
Automatically classify the document before attempting field extraction so the correct schema and prompt template are used.

#### Implementation

This is a **separate, short Gemini call** made before the full extraction call. It is fast (usually under 1 second on `gemini-1.5-flash`).

**Prompt:**
```
Look at the following OCR text from a scanned document. Classify it into exactly one of these categories:

- receipt (store purchase receipt, restaurant bill)
- invoice (business invoice, supplier bill)
- id_card (national ID, passport, driver's license, student ID)
- form (application form, questionnaire, registration form)
- note (handwritten or typed note, memo)
- unknown (cannot determine)

Return ONLY a JSON object: { "type": "category", "confidence": 0.0 }

OCR text:
{rawText}
```

**Output handling:**
- If `type === 'unknown'` or `confidence < 0.5`: show the user a type selector dropdown (receipt / invoice / id_card / form / note) and let them pick manually before proceeding.
- If classification succeeds: show the detected type as a badge and auto-proceed to extraction.
- Store the detected type in the document record.

---

### 6.6 OCR Word Highlighting

#### Purpose
Create a visual link between the extracted text fields in the right panel and the corresponding region in the document image on the left panel. When a user clicks a field (e.g., "Total: 450"), the word "450" on the document image is highlighted.

#### Implementation

**Data requirement:** Tesseract.js `words` array — each word has `{ text, bbox: { x0, y0, x1, y1 }, confidence }`. Store this array in the document record.

**Canvas overlay (`ImagePreview.tsx`):**
1. Render the cleaned document image in a `<canvas>` element (or `<img>` with an overlay `<canvas>`).
2. Track the scale factor: `scaleX = displayWidth / originalImageWidth`, `scaleY = displayHeight / originalImageHeight`.
3. When a field is focused/clicked in the right panel, search the `words` array for all words that appear in that field's value (case-insensitive substring match).
4. For each matched word, draw a highlight rectangle on the overlay canvas:
   ```ts
   ctx.fillStyle = 'rgba(99, 102, 241, 0.25)'; // indigo with 25% opacity
   ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
   ctx.lineWidth = 1.5;
   const x = word.bbox.x0 * scaleX;
   const y = word.bbox.y0 * scaleY;
   const w = (word.bbox.x1 - word.bbox.x0) * scaleX;
   const h = (word.bbox.y1 - word.bbox.y0) * scaleY;
   ctx.fillRect(x, y, w, h);
   ctx.strokeRect(x, y, w, h);
   ```
5. Clear all highlights when no field is focused.

**Bidirectional interaction:**
- User clicks a region on the image → compute which word bbox contains the click coordinates → find the extracted field that contains that word → scroll to and highlight that field in the right panel.

**Toggle:** A "Show highlights" toggle button controls whether the overlay canvas is visible. Default: ON.

---

### 6.7 Handwriting Mode (Gemini Vision)

#### Purpose
Handle handwritten documents, which Tesseract handles poorly. Send the image directly to Gemini's multimodal (vision) capability for both reading and structuring in one API call.

#### When to Use

- User toggles "Handwriting mode" in the review page.
- OCR confidence is below 40% (auto-suggest switching to handwriting mode).
- Document type was detected as "note" with confidence < 0.6 via the first classification call.

#### Implementation

```ts
// src/lib/gemini.ts
export async function processHandwrittenDocument(
  imageBase64: string,
  mimeType: 'image/jpeg' | 'image/png'
): Promise<ExtractedData> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are a document analysis assistant. Read this handwritten or printed document image carefully.

1. First, transcribe ALL text you can read from the image, exactly as written.
2. Then, classify the document type (receipt, invoice, note, form, id_card, unknown).
3. Finally, extract structured data based on the type.

Return ONLY a JSON object with this structure:
{
  "type": "note|receipt|invoice|form|id_card|unknown",
  "transcription": "full text you read from the image",
  "structured": { /* type-appropriate fields */ },
  "confidence": 0.0
}

Do not include any explanation outside the JSON.
  `;

  const imagePart = {
    inlineData: {
      data: imageBase64, // base64 string without the data: prefix
      mimeType: mimeType,
    },
  };

  const result = await model.generateContent([prompt, imagePart]);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}
```

**Base64 conversion from canvas:**
```ts
const canvas = document.getElementById('processed-canvas') as HTMLCanvasElement;
const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
const base64 = dataUrl.split(',')[1]; // strip the "data:image/jpeg;base64," prefix
```

**Image size constraint for Gemini:** Gemini Vision accepts images up to 4MB. Downscale the image canvas to max 1600px width before converting to base64 if the document image is larger. This is usually fine for document clarity.

---

### 6.8 Searchable Local Archive

#### Purpose
Store every scanned and processed document locally (no server) and provide fast full-text search across all saved documents.

#### Dexie.js Database Setup

See [Section 10 — IndexedDB Schema](#10-indexeddb-schema) for the full schema.

#### Saving a Document

When the user clicks "Save to Archive" on the ReviewPage:
1. Assemble the `Document` record object from Zustand store state.
2. Generate a unique ID with `crypto.randomUUID()`.
3. Store the cleaned image as a base64 string in the record (or as a Blob in a separate `images` object store for memory efficiency).
4. Call `db.documents.add(record)`.
5. Show a success toast. Navigate to the archive or stay on review.

#### Search Implementation

Build a simple **inverted index** on save:

```ts
// On save, extract searchable tokens
function buildSearchIndex(doc: Document): string {
  const parts = [
    doc.structured?.vendor,
    doc.structured?.total?.toString(),
    doc.rawText,
    doc.tags?.join(' '),
    doc.type,
  ].filter(Boolean);
  return parts.join(' ').toLowerCase();
}
// Store this as a `searchIndex` field on the document record
```

**Search query:**
```ts
// src/db/queries.ts
export async function searchDocuments(query: string): Promise<Document[]> {
  const terms = query.toLowerCase().split(' ').filter(Boolean);
  const all = await db.documents.toArray();
  return all.filter(doc =>
    terms.every(term => doc.searchIndex?.includes(term))
  );
}
```

For simple term matching this performs well up to ~500 documents (all in IndexedDB, read into memory). For larger collections, Dexie supports proper indexed queries — add a `where('searchIndex').startsWith(term)` using a Dexie `MultiEntry` index.

#### Archive Filters

Filter controls in the ArchivePage sidebar:

| Filter | Implementation |
|---|---|
| Document type | `db.documents.where('type').equals(type)` |
| Tag | `all.filter(doc => doc.tags.includes(tag))` |
| Date range | `db.documents.where('createdAt').between(start, end)` |
| Has AI data | `all.filter(doc => doc.structured !== null)` |
| Sort | By `createdAt` desc (default), or `type`, or `total` |

---

### 6.9 Smart Auto-Tagging

#### Purpose
Automatically suggest 2–4 descriptive tags for each document to make it easier to filter and find later.

#### Implementation

This is a **third Gemini API call**, made after document classification and extraction. It is fast and the prompt is short.

**Prompt:**
```
You are a document tagging assistant. Based on the following document data, suggest 2 to 4 short, lowercase tags that would help a user find this document later.

Tag rules:
- Tags should be 1-3 words, lowercase, no special characters.
- Include the year if a date is present (e.g., "2024").
- Include the vendor name if present.
- Include a category like "food", "utility", "medical", "transport", "telecom", "shopping".
- Include "pending" if a due date is in the future.
- Do NOT repeat the document type as a tag.
- Return ONLY a JSON array of strings: ["tag1", "tag2", "tag3"]

Document data:
{structuredJson}
```

**Example output:** `["grameenphone", "telecom", "2024", "monthly-bill"]`

**UI behavior:**
- Tags appear below the extracted fields as chips.
- Each chip has an "×" to remove it.
- An "Add tag" input lets the user type custom tags.
- On save, the final tag list is stored with the document.

---

### 6.10 Batch Processing

#### Purpose
Allow users to upload multiple documents at once and process them sequentially.

#### Implementation

**Batch queue state (Zustand `scanStore`):**
```ts
interface ScanStore {
  queue: RawScanItem[];         // array of { id, file, status, result }
  currentIndex: number;
  addToQueue: (files: File[]) => void;
  processNext: () => void;
  markDone: (id: string, result: ProcessedDoc) => void;
  markError: (id: string, error: string) => void;
}
```

**Processing flow:**
1. User drops 5 files. All 5 enter the queue with `status: 'pending'`.
2. `processNext()` picks the first pending item. Sets its status to `'processing'`.
3. Runs the full pipeline: preprocess → OCR → classify → extract → tag.
4. On success: `markDone()`. On error: `markError()` with error message.
5. Automatically calls `processNext()` again for the next pending item.
6. Show a BatchQueue panel on the ScannerPage with a progress bar per item.

**Important:** Do not run multiple documents in parallel. The OpenCV WASM instance and Tesseract worker are both single-threaded. Parallel processing would cause race conditions and out-of-memory errors.

**Batch queue UI:**
- List of queued files with filename, thumbnail (if image), and status badge.
- Status: `Queued → Processing → Done / Error`
- Each error item has a "Retry" button.
- A global "Process all" button starts the queue.

---

### 6.11 CSV / JSON Export

#### Purpose
Allow users to download extracted data from one or many documents for use in spreadsheets or other tools.

#### UI — ExportPage

1. Show a grid of all archived documents with checkboxes.
2. "Select all" button. Show selected count.
3. Format selector: **CSV**, **JSON**, or **PDF batch**.
4. For CSV: a column mapping UI — checkboxes for which fields to include (vendor, date, total, tax, type, tags, etc.).
5. "Download" button triggers the export.

#### CSV Export

```ts
// src/lib/export.ts
import Papa from 'papaparse';

export function exportCSV(docs: Document[], columns: string[]): void {
  const rows = docs.map(doc => {
    const row: Record<string, any> = {};
    columns.forEach(col => {
      row[col] = getNestedValue(doc.structured, col) ?? '';
    });
    return row;
  });

  const csv = Papa.unparse(rows, { header: true });
  downloadFile(csv, 'docuscan-export.csv', 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

#### JSON Export

```ts
export function exportJSON(docs: Document[]): void {
  const payload = docs.map(doc => ({
    id: doc.id,
    type: doc.type,
    createdAt: doc.createdAt,
    tags: doc.tags,
    structured: doc.structured,
    ocrText: doc.rawText,
    ocrConfidence: doc.ocrConfidence,
  }));
  const json = JSON.stringify(payload, null, 2);
  downloadFile(json, 'docuscan-export.json', 'application/json');
}
```

---

### 6.12 PDF Report Export

#### Purpose
Generate a single, shareable PDF file containing the cleaned document image and a table of all extracted fields.

#### Implementation

```ts
// src/lib/export.ts
import jsPDF from 'jspdf';

export async function exportPDF(doc: Document): Promise<void> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 15;

  // Header
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DocuScan Report', margin, 20);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Type: ${doc.type}`, margin, 28);
  pdf.text(`Scanned: ${new Date(doc.createdAt).toLocaleDateString()}`, margin, 34);
  pdf.text(`Tags: ${doc.tags.join(', ') || 'None'}`, margin, 40);

  // Document image (scaled to fit page width)
  const imgData = doc.processedImageBase64; // base64 JPEG
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = imgWidth * 1.3; // approximate A4 ratio
  pdf.addImage(imgData, 'JPEG', margin, 50, imgWidth, imgHeight);

  // Extracted fields table on a new page
  pdf.addPage();
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Extracted Data', margin, 20);

  let y = 32;
  const fields = flattenStructured(doc.structured);
  fields.forEach(({ label, value }) => {
    if (y > 270) { pdf.addPage(); y = 20; }
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(label + ':', margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(value ?? 'N/A'), margin + 45, y);
    y += 8;
  });

  pdf.save(`docuscan-${doc.id}.pdf`);
}
```

---

### 6.13 Expense Summarizer

#### Purpose
Let users select multiple receipts and ask Gemini to analyze spending patterns, totals by category, and generate insights — rendered as a mini dashboard.

#### UI Flow

1. In the ArchivePage, a "Summarize selection" button appears when 2+ receipts are checked.
2. Opens a side panel or modal with a "Analyze spending" button.
3. On click, pack all structured JSON records into a Gemini prompt.
4. Render the returned analysis as a simple dashboard (total spent, breakdown by category, largest single expense, date range).

#### Gemini Prompt

```
You are a personal finance assistant. Analyze the following receipt data and provide a spending summary.

Return ONLY a JSON object with this structure:
{
  "total_spent": number,
  "currency": "string",
  "date_range": { "from": "YYYY-MM-DD", "to": "YYYY-MM-DD" },
  "document_count": number,
  "by_category": [{ "category": "string", "total": number, "count": number }],
  "largest_expense": { "vendor": "string", "amount": number, "date": "YYYY-MM-DD" },
  "insights": ["string", "string"] // 2-3 plain language observations
}

Receipt records:
{jsonArrayOfStructuredDocs}
```

**Implementation notes:**
- Only include documents with `type === 'receipt'` and non-null `total` values.
- If more than 20 receipts are selected, warn the user that the prompt might be large (Gemini 1.5 Flash has a 1M token context — not a problem in practice, but worth noting).
- Cap at 50 receipts per summarization call.

---

## 7. AI Integration — Gemini API

### Setup

Install the official SDK:
```bash
npm install @google/generative-ai
```

Configure API key via environment variable AND localStorage (for user-provided key):
```env
# .env.local
VITE_GEMINI_API_KEY=your_key_here
```

Priority order: `localStorage('gemini_api_key')` > `import.meta.env.VITE_GEMINI_API_KEY`. This lets users enter their own key in Settings without rebuilding the app.

### Gemini API Calls Summary

| Feature | Model | Type | Approximate tokens |
|---|---|---|---|
| Document type detection | `gemini-1.5-flash` | Text only | ~200 in, ~20 out |
| Data extraction (receipt/invoice) | `gemini-1.5-flash` | Text only | ~500 in, ~300 out |
| Auto-tagging | `gemini-1.5-flash` | Text only | ~150 in, ~30 out |
| Handwriting mode | `gemini-1.5-flash` | Image + text | ~200 in + image, ~400 out |
| Expense summarizer | `gemini-1.5-flash` | Text only | ~1000 in, ~200 out |

All calls are made **client-side** from the React app directly to the Gemini REST API via the SDK. No backend proxy is required. The API key is stored in the user's browser `localStorage` only.

### Role of Gemini in DocuScan

**1. Document Classifier**
Gemini reads the messy, unordered OCR text and makes a judgment call about what kind of document it is. This is a task that rules-based regex cannot do reliably — Gemini understands context (e.g., the word "Invoice No." doesn't always appear; Gemini can still infer it's an invoice from the overall structure).

**2. Field Extractor**
Gemini understands that "Total Amount" and "Grand Total" and "Amount Due" all mean the same thing. It normalizes synonyms, corrects common OCR errors (e.g., "O" misread as "0"), and fills in the structured JSON schema. This replaces hundreds of lines of document-type-specific regex that would still fail on edge cases.

**3. Tagger**
Gemini assigns semantic tags (not just keyword matches) — e.g., it can tag a "Grameenphone" receipt as "telecom" even if the word "telecom" never appears in the text.

**4. Vision Reader (Handwriting)**
Gemini 1.5 Flash is a multimodal model that can read both images and text in a single call. For handwritten documents, sending the image directly to Gemini Vision (instead of running Tesseract first) produces dramatically better results. Tesseract is trained on printed fonts and fails on handwriting; Gemini understands handwritten language naturally.

**5. Expense Analyst**
Gemini can reason across multiple documents and produce narrative insights ("You spent 23% more on food this month compared to last month") — something that would require building a full analytics engine to replicate with code alone.

### API Error Handling

| Error | Cause | User-facing message | Recovery |
|---|---|---|---|
| `API_KEY_INVALID` | Wrong key in settings | "Your Gemini API key is invalid. Please check Settings." | Link to Settings page |
| `QUOTA_EXCEEDED` | Daily free tier limit hit | "Gemini API quota reached. Try again tomorrow or use a different key." | Save document with OCR only, skip AI fields |
| `SAFETY_BLOCKED` | Content policy (unlikely for documents) | "AI declined to process this document." | Show OCR-only result |
| `JSON parse error` | Model returned non-JSON | Retry once with stricter prompt | Fallback: show raw OCR text |
| Network error | No internet | "No internet connection. AI features require internet." | Graceful degradation to OCR-only mode |

### Graceful Degradation

If the Gemini API call fails for any reason, DocuScan should still save and display the OCR text. The document is stored with `structured: null`. The user can retry AI extraction from the document detail page later when the API is available. All offline features (preprocessing, OCR, storage, export) continue to work without AI.

---

## 8. Data Flow — End to End

```
User action: photograph or upload a document
         │
         ▼
[1. CAPTURE]
  Raw image Blob/File
  → Stored in Zustand scanStore.rawImage
  → Navigate to ReviewPage
         │
         ▼
[2. PREPROCESS] (Web Worker + OpenCV.js)
  Input: raw image canvas ImageData
  Operations: grayscale → blur → Canny edges → findContours
              → approxPolyDP → getPerspectiveTransform
              → warpPerspective → adaptiveThreshold → morphClose
  Output: cleaned image canvas ImageData
  → Stored in Zustand scanStore.processedImage
  → Displayed in ImagePreview component
         │
         ▼
[3. OCR] (Tesseract.js Web Worker)
  Input: processedImage as base64 data URL
  Output: { rawText: string, words: Word[], confidence: number }
  → Stored in Zustand scanStore.ocrResult
  → Displayed in RawTextPanel
         │
         ├── IF handwriting mode: skip steps 3 and send image directly to step 4b
         │
         ▼
[4a. AI CLASSIFY] (Gemini API call #1)
  Input: rawText
  Output: { type: DocumentType, confidence: number }
  → Selects appropriate schema for next call
         │
         ▼
[4b. AI EXTRACT] (Gemini API call #2)
  Input: rawText + documentType + JSON schema template
  Output: structured JSON matching schema
  → Stored in Zustand scanStore.structuredData
  → Displayed in FieldEditor component
         │
         ▼
[4c. AI TAG] (Gemini API call #3)
  Input: structured JSON
  Output: string[] of tags
  → Stored in Zustand scanStore.tags
  → Displayed as TagChip components
         │
         ▼
[5. USER REVIEW]
  User can: edit fields, add/remove tags, adjust highlights,
            retry preprocessing, re-run AI, rotate image
         │
         ▼
[6. SAVE] (Dexie.js / IndexedDB)
  Assembled Document record:
  {
    id, type, createdAt, rawText, words, ocrConfidence,
    structured, tags, processedImageBase64, searchIndex
  }
  → db.documents.add(document)
  → Toast: "Document saved"
  → Navigate to /archive or stay on /review for next in queue
         │
         ▼
[7. EXPORT] (optional, user-triggered)
  CSV: papaparse.unparse(selectedDocs) → .csv file download
  JSON: JSON.stringify(selectedDocs) → .json file download
  PDF: jsPDF render of image + fields table → .pdf file download
```

---

## 9. State Management

### Zustand Stores

#### `scanStore.ts` — Active scan pipeline state

```ts
interface ScanStore {
  // Pipeline state
  rawImage: string | null;                // base64 data URL of captured image
  processedImage: string | null;          // base64 data URL of cleaned image
  ocrResult: OCRResult | null;            // { rawText, words, confidence }
  documentType: DocumentType | null;      // classified type
  structuredData: ExtractedData | null;   // Gemini extraction output
  tags: string[];                         // auto + user tags
  
  // Pipeline progress
  steps: StepStatus[];                    // array of 5 step statuses
  
  // Batch queue
  queue: QueueItem[];                     // pending files
  currentQueueIndex: number;
  
  // Actions
  setRawImage: (img: string) => void;
  setProcessedImage: (img: string) => void;
  setOCRResult: (result: OCRResult) => void;
  setStructuredData: (data: ExtractedData) => void;
  setTags: (tags: string[]) => void;
  updateStep: (index: number, status: StepStatus) => void;
  addToQueue: (files: File[]) => void;
  resetScan: () => void;
}
```

#### `archiveStore.ts` — Archive filter and selection state

```ts
interface ArchiveStore {
  searchQuery: string;
  filterType: DocumentType | 'all';
  filterTags: string[];
  dateRange: { from: Date | null; to: Date | null };
  selectedIds: string[];
  sortBy: 'createdAt' | 'type' | 'total';
  
  setSearchQuery: (q: string) => void;
  toggleSelectedId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  resetFilters: () => void;
}
```

#### `settingsStore.ts` — User preferences

```ts
interface SettingsStore {
  apiKey: string;                         // Gemini API key
  ocrLanguage: 'eng' | 'ben' | 'eng+ben';
  theme: 'light' | 'dark' | 'system';
  autoTag: boolean;                       // auto-run tagging on save
  autoClassify: boolean;                  // auto-run classification
  
  setApiKey: (key: string) => void;
  setTheme: (theme: string) => void;
  // etc.
}
```

**Persistence:** Use Zustand's `persist` middleware with `localStorage` for `settingsStore`. Do not persist `scanStore` (in-progress scan state should reset on refresh).

---

## 10. IndexedDB Schema

### Database: `DocuScanDB` (Dexie.js)

```ts
// src/db/schema.ts
import Dexie, { Table } from 'dexie';

export interface DocumentRecord {
  id: string;                          // crypto.randomUUID()
  type: 'receipt' | 'invoice' | 'id_card' | 'form' | 'note' | 'unknown';
  createdAt: number;                   // Date.now() timestamp
  updatedAt: number;
  
  // Image data
  processedImageBase64: string;        // cleaned image as base64 JPEG (quality 0.8)
  rawImageBase64?: string;             // optional: keep original for re-processing
  
  // OCR data
  rawText: string;                     // plain text from Tesseract
  words: WordBbox[];                   // word bounding boxes from Tesseract
  ocrConfidence: number;               // 0-100
  ocrLanguage: string;
  
  // AI data
  structured: ExtractedData | null;    // Gemini extraction output
  aiModel: string | null;              // which model was used
  
  // Archive metadata
  tags: string[];
  searchIndex: string;                 // concatenated searchable text
  notes: string;                       // user manual notes
}

export interface WordBbox {
  text: string;
  x0: number; y0: number; x1: number; y1: number;
  confidence: number;
}

class DocuScanDB extends Dexie {
  documents!: Table<DocumentRecord, string>;

  constructor() {
    super('DocuScanDB');
    this.version(1).stores({
      documents: 'id, type, createdAt, *tags, searchIndex',
      // 'id' is the primary key
      // 'type', 'createdAt' are indexed for filtering/sorting
      // '*tags' is a multi-entry index (each tag is individually indexed)
      // 'searchIndex' allows startsWith queries
    });
  }
}

export const db = new DocuScanDB();
```

### Key Query Patterns

```ts
// src/db/queries.ts

// Get all documents sorted by date
export const getAllDocuments = () =>
  db.documents.orderBy('createdAt').reverse().toArray();

// Filter by type
export const getByType = (type: string) =>
  db.documents.where('type').equals(type).toArray();

// Filter by tag
export const getByTag = (tag: string) =>
  db.documents.where('tags').equals(tag).toArray();

// Date range
export const getByDateRange = (from: number, to: number) =>
  db.documents.where('createdAt').between(from, to).toArray();

// Full text search (client-side for now)
export const search = async (query: string) => {
  const terms = query.toLowerCase().split(' ');
  const all = await db.documents.toArray();
  return all.filter(doc => terms.every(t => doc.searchIndex.includes(t)));
};

// Get storage estimate
export const getStorageInfo = async () => {
  const count = await db.documents.count();
  const estimate = await navigator.storage?.estimate();
  return { count, usedBytes: estimate?.usage ?? 0, quotaBytes: estimate?.quota ?? 0 };
};
```

---

## 11. Implementation Rules & Constraints

### Mandatory Rules

1. **No backend.** Every feature must run in the browser. The only allowed external call is to the Gemini API from the frontend directly.

2. **API key security:** The Gemini API key must never be logged, displayed in full, or sent to any server other than `generativelanguage.googleapis.com`. In the Settings UI, show the key as a password field with a toggle to reveal. Store only in `localStorage`.

3. **Web Workers for heavy tasks.** OpenCV preprocessing and Tesseract OCR must run in Web Workers. If either runs on the main thread, the UI will freeze during processing. This is a hard requirement, not optional.

4. **TypeScript strict mode.** Enable `strict: true` in `tsconfig.json`. No `any` types except where absolutely necessary (OpenCV.js interop). All API response types must be defined in `src/types/index.ts`.

5. **Graceful degradation.** If Gemini API is unavailable (no key, quota exceeded, network error), the app must still function for capture, OCR, storage, and export. AI features simply remain unavailable with a clear message.

6. **Error boundaries.** Wrap each major section (ScannerPage, ReviewPage, ArchivePage) in a React Error Boundary component. A crash in one section must not crash the entire app.

7. **Image size limits.** Before any processing, downscale images larger than 2400px in width/height. Large images slow down all subsequent steps significantly. Use canvas downscaling before passing to OpenCV.

8. **Sequential batch processing.** Never process two documents simultaneously. The queue must process one at a time.

9. **No hardcoded API endpoints.** The Gemini base URL is managed by the SDK. If switching models or API versions, only change the model string in `gemini.ts`, not spread across files.

10. **Confirmation dialogs for destructive actions.** Delete document, clear all data, and overwrite existing records must all show a `ConfirmDialog` before executing.

### Limits & Constraints

| Constraint | Value | Reason |
|---|---|---|
| Max image input size | 10 MB | Memory and processing performance |
| Max batch queue size | 20 files | UX and memory |
| Max image width (processing) | 2400 px | OpenCV performance |
| Max image size for Gemini Vision | 4 MB (base64) | Gemini API limit |
| Max receipts for expense summarizer | 50 | Prompt size + latency |
| Max documents in archive (recommended) | 500 | IndexedDB + search performance |
| Gemini model for all calls | `gemini-1.5-flash` | Free tier, fast |
| Retry attempts on Gemini failure | 2 | Avoid quota burn |
| OCR languages loaded simultaneously | 2 | Tesseract memory |
| Saved image quality (JPEG) | 0.80 | Balance quality vs storage |

### What NOT to Build

- No user accounts or authentication system.
- No cloud sync or remote storage.
- No real-time collaboration.
- No mobile app (React web only, but must be responsive).
- No PDF.js integration (lower priority — photo of printed PDFs is sufficient).
- No handwriting-to-LaTeX or formula detection.
- No payment or subscription system.

---

## 12. Case Studies

### Case Study 1 — Monthly Utility Bill (Printed)

**Scenario:** A student photographs their Grameenphone monthly bill with their phone camera.

**Flow:**
1. Camera capture via `getUserMedia`. Document is slightly tilted.
2. OpenCV detects 4 corners of the bill, runs perspective correction. The tilted photo becomes a flat, aligned image.
3. Adaptive thresholding converts the image to crisp black-and-white. Text is now highly legible for OCR.
4. Tesseract extracts the text with 87% confidence.
5. Gemini classifies: `{ type: "invoice", confidence: 0.95 }`.
6. Gemini extracts: `{ vendor: "Grameenphone", date: "2024-11-01", total: 499, currency: "BDT", invoice_number: "INV-2024-11-00234" }`.
7. Auto-tags: `["grameenphone", "telecom", "november-2024"]`.
8. User saves. Document is archived and searchable by "grameenphone" or "499" or "telecom".

### Case Study 2 — Restaurant Receipt (Crumpled, Low Light)

**Scenario:** A crumpled receipt from a restaurant, photographed in dim lighting.

**Flow:**
1. File upload (photo taken earlier).
2. OpenCV applies Gaussian blur to reduce noise from grain. Adaptive thresholding handles the uneven lighting. Perspective correction runs but finds only 3 corners — skips warping, applies deskew only.
3. Tesseract runs with 61% confidence. Some line item descriptions are garbled.
4. Gemini classifies: `{ type: "receipt", confidence: 0.88 }`.
5. Gemini extracts what it can: `{ vendor: "Star Kabab", total: 1250, currency: "BDT", date: "2024-11-15" }`. Line items are partially readable; Gemini marks the ones it could not confirm as `null`.
6. `confidence: 0.68` — displayed as a yellow "Medium confidence" badge.
7. User manually corrects two line items using the FieldEditor.
8. Saved with user corrections.

### Case Study 3 — Handwritten Prescription

**Scenario:** A doctor's handwritten prescription. Tesseract cannot reliably read doctor's handwriting.

**Flow:**
1. User uploads photo. OCR runs first (Tesseract). Confidence: 22%.
2. App shows "Low OCR confidence — try handwriting mode?" toast with one-click switch.
3. User switches to handwriting mode.
4. Image is base64-encoded and sent directly to Gemini Vision (no OCR step).
5. Gemini returns: `{ type: "form", transcription: "Tab. Napa 500mg — 1+0+1, Tab. Antacid — 0+1+0, ...", structured: { fields: [...] } }`.
6. Transcription displayed in RawTextPanel. Structured fields displayed in FieldEditor.
7. Tags: `["medical", "prescription", "2024"]`.

### Case Study 4 — Batch of 10 Supermarket Receipts (Monthly Expense Tracking)

**Scenario:** User scans 10 receipts from Shwapno supermarket over a month to track grocery spending.

**Flow:**
1. 10 photos uploaded as a batch. All enter the queue.
2. Each receipt processed sequentially: preprocess → OCR → classify → extract → tag → save.
3. Entire batch takes approximately 3-5 minutes (10 × 20-30 seconds per document).
4. All 10 saved to archive with type `receipt` and tag `shwapno`.
5. User selects all 10 in archive, clicks "Summarize selection".
6. Gemini returns: `{ total_spent: 12450, currency: "BDT", by_category: [{ category: "food", total: 12450 }], largest_expense: { vendor: "Shwapno", amount: 2100, date: "2024-11-22" }, insights: ["Your largest grocery trip was on Nov 22.", "Average spend per trip: BDT 1,245."] }`.
7. Mini dashboard displayed in a side panel.
8. User exports all 10 as CSV for a spreadsheet.

### Case Study 5 — National ID Card

**Scenario:** User scans their National ID card to archive a digital copy.

**Flow:**
1. Camera capture. Card is flat on a table, well-lit.
2. OpenCV detects the card edges (4 corners). Perspective correction produces a perfect frontal view.
3. OCR extracts name, ID number, date of birth, address with 91% confidence.
4. Gemini classifies: `{ type: "id_card", confidence: 0.99 }`.
5. Gemini extracts into id_card schema: name, id_number, dob, address, issuing_authority.
6. Tag: `["national-id", "identity"]`.
7. Document is saved locally. No data leaves the device except to the Gemini API (and the user agreed to this by entering their own API key).

---

## 13. Error Handling Strategy

### Error Types and Responses

| Layer | Error | UI Response | Technical Recovery |
|---|---|---|---|
| Camera | Permission denied | Modal explaining how to grant camera access per browser | Fallback to file upload |
| Camera | No camera found | Auto-switch to file upload tab | — |
| OpenCV | WASM load failure | "Image enhancement unavailable. OCR will run on original image." | Skip preprocessing, use raw image for OCR |
| OpenCV | No contours found | Skip perspective correction, apply binarization only | Soft fallback, still usable |
| Tesseract | Worker crash | "OCR failed. Try re-uploading the image." | Reinitialize Tesseract worker, offer retry |
| Tesseract | Very low confidence | Show warning badge, suggest handwriting mode | Continue with low-confidence result |
| Gemini | API key missing | Banner: "Add your Gemini API key in Settings to enable AI features." | OCR-only mode |
| Gemini | 429 Quota exceeded | Toast with quota message, save with OCR only | Queue retry after cooldown |
| Gemini | Invalid JSON response | Retry once with stricter prompt. If still fails: show raw text | — |
| Dexie | Storage quota full | "Local storage is full. Export and delete some documents." | Block saving, offer export + delete |
| Export | File too large | "PDF is too large. Try exporting fewer documents." | — |

### User-Facing Error Principles

- Errors must always suggest a next action (retry, switch mode, go to settings).
- Never show a raw JavaScript error message or stack trace to the user.
- Use toast notifications for transient errors (disappear after 5 seconds).
- Use inline error states (inside the component) for persistent errors that block workflow.
- Color code: red border + red icon for blocking errors, yellow for warnings, blue for informational notices.

---

## 14. Performance Guidelines

### Image Processing

- Downscale input images to ≤2400px before OpenCV (use `canvas.drawImage` with target dimensions).
- Run OpenCV in a dedicated Web Worker. Terminate the worker after the preprocessing job completes (don't keep it alive permanently — OpenCV WASM consumes ~80MB of memory).
- Cache the OpenCV module load so it only parses the WASM binary once per session.

### OCR

- Reuse the Tesseract worker across multiple documents in a batch (do not reinitialize per document).
- Terminate the Tesseract worker when the user navigates away from the review page.
- Pass the preprocessed (binarized, high-contrast) image rather than the color original — this halves OCR time.

### Gemini API

- Classify, extract, and tag are three separate API calls. Do them sequentially, not in parallel (parallel calls risk hitting rate limits faster on free tier).
- Cache the classification result — if the user re-runs extraction without changing the document, reuse the stored type instead of calling classification again.
- Do not call Gemini automatically on every OCR result change. Only call when the user explicitly triggers it or when the scan pipeline reaches that step for the first time.

### Archive & Search

- Lazy-load the archive data: fetch only the first 20 documents on load. Load more on scroll (virtual infinite scroll).
- For search: debounce the search input by 300ms before querying IndexedDB.
- Store thumbnail images separately at reduced resolution (max 300px width) if memory becomes a concern.

### React Rendering

- Use `React.memo` on `DocumentCard`, `TagChip`, and `ConfidenceBar` — these are rendered in long lists.
- Use `useCallback` for event handlers passed to list item children.
- Avoid storing large image base64 strings directly in React state. Keep them in Zustand (outside React's render cycle) and reference them by ID.

---

## 15. Build & Environment Setup

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Installation Steps

```bash
# 1. Create the project
npm create vite@latest docuscan -- --template react-ts
cd docuscan

# 2. Install all dependencies
npm install @google/generative-ai tesseract.js dexie zustand react-router-dom papaparse jspdf react-hot-toast lucide-react

# 3. Install dev dependencies
npm install -D tailwindcss autoprefixer postcss @types/papaparse

# 4. Initialize Tailwind
npx tailwindcss init -p

# 5. Download OpenCV.js (run once, then place in /public)
# Download from: https://docs.opencv.org/4.x/opencv.js
# Place at: public/opencv.js

# 6. Configure environment
cp .env.example .env.local
# Edit .env.local to add VITE_GEMINI_API_KEY
```

### `tailwind.config.ts` (minimal setup)

```ts
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#3B5BDB', hover: '#2F4AC0' },
        surface: { DEFAULT: '#FFFFFF', alt: '#F1F3F9' },
        border: '#E2E6F0',
        ai: { DEFAULT: '#6366F1', light: '#EEF2FF' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

### `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['opencv.js'], // OpenCV is loaded via script tag, not bundled
  },
  build: {
    target: 'es2020', // required for top-level await (Dexie, Tesseract)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ai: ['@google/generative-ai'],
          storage: ['dexie'],
          ocr: ['tesseract.js'],
          export: ['jspdf', 'papaparse'],
        },
      },
    },
  },
});
```

### Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

### Development Order (Recommended)

Build features in this order to maintain a working app at each stage:

1. Project scaffold + Tailwind + routing setup + Navbar
2. SettingsPage — API key input + localStorage
3. ScannerPage — file upload only (camera later)
4. ReviewPage skeleton — display raw uploaded image
5. OpenCV integration — preprocessing pipeline
6. Tesseract OCR integration
7. Gemini — classification + extraction
8. FieldEditor component — display and edit extracted fields
9. Dexie — save + archive
10. ArchivePage — browse + search
11. Export — CSV + JSON
12. OCR word highlights
13. Camera capture (`getUserMedia`)
14. Handwriting mode (Gemini Vision)
15. Batch processing queue
16. PDF export (jsPDF)
17. Expense summarizer
18. Auto-tagging
19. Dark mode polish
20. Error boundaries + edge case handling

---

*End of DocuScan Project Plan*  
*Generated for academic use — Last updated: March 2026*
