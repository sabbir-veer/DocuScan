# DocuScan — Academic Project Report Directive
> **How to use this file:** This is a writing directive, not the report itself. Every section below tells you *what to write*, *how long it should be*, *what to include*, and *what tone to use*. Follow this structure chapter by chapter to produce a complete, submission-ready academic report. Replace every `[placeholder]` with your actual content.

---

## Report Identity

| Field | Value |
|---|---|
| **Report Title** | DocuScan: A Browser-Based Intelligent Document Scanner with AI-Powered Data Extraction |
| **Subtitle** | Final Year Project Report — [Your Department Name] |
| **Course Code** | [e.g., CSE 499 / SWE 400] |
| **Submitted to** | [Supervisor Name], [Designation], [Department], [University Name] |
| **Submitted by** | [Your Full Name], ID: [Student ID] |
| **Submission Date** | [Month Year] |
| **Word Count Target** | 8,000 – 12,000 words (excluding figures, tables, code, and references) |

---

## Preliminary Pages (Before Chapter 1)

These pages come before the main chapters and are numbered with Roman numerals (i, ii, iii...).

---

### P1 — Cover Page

**What to include:**
- University logo (centered, top)
- Full title of the report (large, centered)
- Subtitle
- Department name and university name
- Course name and code
- Submitted to: supervisor's name and designation
- Submitted by: your name and student ID
- Date of submission

**Formatting rules:**
- No paragraph text on this page — only structured labels and values
- Font: consistent with the rest of the report (typically Times New Roman 12pt for body, larger for title)
- No page number displayed on this page (but counted as page i)

---

### P2 — Declaration

**What to write (approx. 150 words):**

A formal declaration paragraph stating:
- This report is your own original work
- You have not plagiarized from any source without proper citation
- This project has not been submitted elsewhere for any other degree or award
- You understand the university's academic integrity policy

End with:
- Your signature (hand-signed if printing, or a typed name block)
- Date
- Your supervisor's signature block (countersigned)

**Tone:** Formal, first-person singular.

---

### P3 — Acknowledgements

**What to write (approx. 200–250 words):**

Express genuine gratitude to:
1. Your supervisor — mention specifically what guidance they provided (topic selection, technical mentoring, review feedback)
2. Your university / department — for providing the resources, lab access, or software licenses
3. Any peers who helped during testing or provided feedback
4. Open-source community — acknowledge the creators of OpenCV, Tesseract, React, and other libraries that made this project possible
5. Google — for providing the Gemini API with a free tier that enabled the AI features

**Tone:** Warm but professional. Avoid sounding overly casual. This is not a social media thank-you note.

---

### P4 — Abstract

**What to write (exactly 250–300 words, single paragraph or split into 2):**

Structure the abstract in this exact order:

1. **Context sentence** (1 sentence): What is the broader domain? (e.g., "Document digitization has become an essential process in modern information management…")
2. **Problem statement** (2 sentences): What specific problem does this project address? Physical documents are perishable, data entry from them is manual and error-prone, and existing solutions require backend infrastructure.
3. **Proposed solution** (2–3 sentences): Introduce DocuScan — what it is, how it works at a high level. Mention that it is entirely browser-based, uses computer vision for preprocessing, OCR for text extraction, and the Gemini AI API for intelligent field extraction.
4. **Key technologies** (1–2 sentences): React, OpenCV.js, Tesseract.js, Google Gemini API, Dexie.js — mention them by name.
5. **Key features** (2 sentences): Briefly name the standout features — perspective correction, handwriting recognition, searchable archive, CSV/PDF export.
6. **Results / outcomes** (1–2 sentences): What did the system achieve? (e.g., "The system demonstrated accurate text extraction across [X] document types, with AI-powered structuring achieving [X]% accuracy on printed receipts and invoices.")
7. **Concluding statement** (1 sentence): What is the significance or potential impact?

**Do not cite references in the abstract. Do not use bullet points. Write in past tense for what was done, present tense for what the system does.**

---

### P5 — Table of Contents

**What to include:**
- Auto-generated (if using Word) or manually created
- Show all chapters, all numbered sections (down to 3rd level: 2.3.1 is fine, 2.3.1.1 is too deep for TOC)
- Include preliminary pages (Declaration, Acknowledgements, Abstract) as unnumbered entries
- Include List of Figures as a separate entry
- Include List of Tables as a separate entry
- Include List of Abbreviations as a separate entry
- Page numbers aligned to the right with dot leaders

**Chapter entries format:**
```
Chapter 1: Introduction ........................................................ 1
  1.1 Background and Motivation ............................................... 1
  1.2 Problem Statement ........................................................ 2
  ...
```

---

### P6 — List of Figures

List every figure in the report with caption and page number. Format:

```
Figure 2.1   Comparison of document scanner approaches ..................... 12
Figure 3.1   System architecture of DocuScan ............................... 18
...
```

Number figures as [Chapter].[Figure number] — e.g., Figure 3.2 is the second figure in Chapter 3.

---

### P7 — List of Tables

Same format as List of Figures but for all tables in the report.

---

### P8 — List of Abbreviations

Alphabetically sorted. Include at minimum:

| Abbreviation | Full Form |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CSS | Cascading Style Sheets |
| DOM | Document Object Model |
| HTML | HyperText Markup Language |
| IndexedDB | Indexed Database API |
| JSON | JavaScript Object Notation |
| LLM | Large Language Model |
| OCR | Optical Character Recognition |
| PDF | Portable Document Format |
| REST | Representational State Transfer |
| SDK | Software Development Kit |
| UI | User Interface |
| UX | User Experience |
| WASM | WebAssembly |
| CSV | Comma-Separated Values |

---

---

## Chapter 1 — Introduction

**Target length:** 1,000 – 1,400 words  
**Purpose:** Orient the reader. Establish why this project exists, what it does, and what this report covers.

---

### 1.1 Background and Motivation

**What to write (300–400 words):**

Paint the real-world picture of why document digitization matters. Include:

- The volume of physical documents still produced and handled daily in Bangladesh and globally — bills, receipts, invoices, ID documents, prescriptions, forms.
- The problem of document decay: ink fades, paper tears, receipts printed on thermal paper are especially fragile.
- The cost of manual data entry: time-consuming, error-prone, requires trained staff.
- The gap between existing tools: most powerful document OCR tools (like Adobe Acrobat, ABBYY FineReader) are either expensive desktop software or require cloud infrastructure.
- The opportunity: modern browsers support powerful APIs (Canvas, WebAssembly, IndexedDB, getUserMedia) that make it possible to run sophisticated image processing entirely on the client side — no server, no subscription, no data leaving the user's device.
- The rise of LLM APIs (specifically Google Gemini) with free tiers that make AI-powered text understanding accessible to students and developers without significant cost.

**Tone:** Motivational and evidence-based. Use 1–2 cited statistics if possible (e.g., market size of document management software, percentage of businesses still relying on paper records).

---

### 1.2 Problem Statement

**What to write (200–250 words):**

Clearly and specifically state the problems this project addresses. Format as a short paragraph followed by a numbered list:

Opening paragraph: Explain that while document scanning hardware exists, the software side of the problem — extracting *structured, usable data* from scanned images — remains largely unsolved for individual users without enterprise software subscriptions.

Then list the specific problems:

1. Physical documents photographed with phone cameras suffer from perspective distortion, uneven lighting, noise, and skew — making raw photos unsuitable for OCR.
2. Generic OCR engines (including Tesseract) produce raw text output without structure — dates, totals, and vendor names are mixed into an unordered blob of text.
3. Handwritten documents are essentially unreadable by conventional OCR.
4. Extracted data is rarely stored in a format that can be searched, filtered, or exported to spreadsheets.
5. Existing browser-based tools handle one part of the problem (e.g., scanning, or OCR, or storage) but not the full end-to-end pipeline in a single, integrated, offline-capable application.

**Tone:** Problem-focused, specific, and grounded. Avoid vague statements like "document management is hard."

---

### 1.3 Objectives

**What to write (150–200 words):**

List the specific, measurable objectives of the project. These should directly address the problems stated in 1.2.

Format as a numbered list:

1. To design and implement a browser-based document image acquisition system using the device camera and file upload.
2. To build an image preprocessing pipeline using OpenCV.js that corrects perspective distortion, removes noise, and enhances contrast for OCR readability.
3. To integrate Tesseract.js for in-browser OCR with support for English and Bengali text.
4. To implement AI-powered document classification and structured field extraction using the Google Gemini API.
5. To provide a local, searchable archive of processed documents using IndexedDB via Dexie.js.
6. To enable export of extracted data in CSV, JSON, and PDF formats.
7. To support handwriting recognition through Gemini's multimodal vision capability.
8. To design a clean, accessible, and responsive user interface suitable for both desktop and mobile browsers.

**Tone:** Direct, action-oriented. Start each objective with an infinitive verb ("To design", "To implement", "To integrate").

---

### 1.4 Scope and Limitations

**What to write (200–250 words):**

**Scope** — what the project covers:
- Document types supported: printed receipts, invoices, ID cards, forms, handwritten notes.
- Languages: English and Bengali (Bangla) OCR support.
- Platform: any modern browser (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+).
- Data storage: entirely local (on-device via IndexedDB).
- AI features: require an active internet connection and a valid Gemini API key.

**Limitations** — be honest about what the system cannot do:
- It cannot process multi-page documents in a single scan.
- OCR accuracy degrades significantly on documents with very small fonts (below ~10pt equivalent in the photo), heavy stamps over text, or complex two-column layouts.
- The Gemini API free tier has daily request limits; heavy usage may exhaust the quota.
- All data is stored locally; there is no synchronization between devices.
- The system does not validate extracted data (e.g., it cannot verify if an ID number is genuinely valid).
- Performance on low-end mobile devices may be slower due to WebAssembly execution limits.

**Tone:** Balanced. Acknowledging limitations is a sign of academic maturity, not failure.

---

### 1.5 Report Organization

**What to write (100–150 words):**

A brief paragraph describing what each chapter covers, so the reader knows what to expect. Follow this template:

> The remainder of this report is organized as follows. Chapter 2 reviews related work and existing tools in the domain of document scanning, OCR, and AI-powered data extraction. Chapter 3 describes the system design, including the overall architecture, technology stack, and data flow. Chapter 4 presents the implementation details of each major component. Chapter 5 discusses the results, including testing methodology and observed performance. Chapter 6 concludes the report and outlines directions for future work. Supporting materials including full source code references, API configuration details, and supplementary screenshots are provided in the appendices.

---

---

## Chapter 2 — Literature Review and Related Work

**Target length:** 1,200 – 1,800 words  
**Purpose:** Show that you understand the existing landscape. Demonstrate that your approach is informed by, but distinct from, prior work.

---

### 2.1 Overview of Document Digitization

**What to write (200–300 words):**

Introduce the history and evolution of document digitization:
- Early flatbed scanners required dedicated hardware.
- Mobile scanning apps (CamScanner, Adobe Scan, Microsoft Lens) brought scanning to smartphones but rely on cloud servers for processing.
- The shift toward browser-based computation — enabled by WebAssembly — opens a new class of entirely client-side applications.

Cite 2–3 academic papers or industry reports on document digitization trends. If you cannot find specific papers, cite the OpenCV documentation, the Tesseract GitHub repository, and a review article on OCR systems.

---

### 2.2 Image Preprocessing Techniques for Document Scanning

**What to write (300–400 words):**

Discuss the established image processing techniques used in document scanning research:

**Perspective correction:**
- Explain that document photos taken at an angle suffer from projective distortion. The standard approach uses homography estimation — detecting the four corners of the document and computing a perspective transform matrix to "unwarp" the image.
- Reference: the theory behind `getPerspectiveTransform` in OpenCV. Optionally cite a paper on document boundary detection (e.g., SmartDoc challenge papers, or Javed et al.).

**Binarization:**
- Global thresholding (Otsu's method) works for evenly lit documents but fails under non-uniform lighting.
- Adaptive thresholding (used in this project) computes a local threshold for each pixel neighborhood — far more robust for real-world document photos.
- Cite: Niblack's method, or Sauvola's method, as the academic foundations of adaptive thresholding.

**Denoising:**
- Gaussian blur removes high-frequency noise before edge detection.
- Morphological operations (dilation, erosion, closing) are used post-binarization to close gaps in text characters.

**Skew correction:**
- Hough line transform to detect dominant line angles in the document.
- Rotating the image by the negative of the detected skew angle.

This section establishes the theoretical basis for your preprocessing pipeline. You are not inventing these techniques — you are applying established methods.

---

### 2.3 Optical Character Recognition (OCR) Systems

**What to write (300–400 words):**

Survey OCR technology:

**Traditional OCR:**
- Character segmentation followed by pattern matching or neural classifier.
- Tesseract (originally developed at HP, now maintained by Google) is the most widely used open-source OCR engine.
- Describe Tesseract's architecture: it uses an LSTM neural network trained on thousands of fonts. It outputs text along with word-level bounding boxes and confidence scores.
- Tesseract.js is the JavaScript/WebAssembly port that runs Tesseract in the browser without any server.

**Limitations of OCR for handwriting:**
- Tesseract is trained on printed fonts and performs poorly on handwriting.
- This motivates the use of a multimodal LLM (Gemini Vision) as a fallback for handwritten documents.

**Recent advances:**
- End-to-end OCR models (e.g., TrOCR by Microsoft, PaddleOCR) achieve higher accuracy but are too large to run in a browser (100MB+ model weights).
- This is why Tesseract.js (a manageable ~10MB download) remains the pragmatic choice for browser deployment.

---

### 2.4 AI-Powered Document Understanding

**What to write (300–400 words):**

Discuss AI/LLM-based document understanding:

**From OCR to understanding:**
- Raw OCR text is unstructured. Converting it to structured data requires understanding of document semantics — knowing that "Grand Total" and "Amount Due" mean the same thing in different document formats.
- Rule-based approaches (regex, keyword matching) are brittle and fail on new document formats.
- Machine learning classifiers (trained on labeled document datasets) generalize better but require large datasets and training infrastructure.
- LLMs (Large Language Models) represent the state of the art: they can be prompted in natural language to perform extraction, classification, and normalization without domain-specific training.

**Google Gemini:**
- Gemini 1.5 Flash is a fast, cost-efficient multimodal model (text + vision).
- It supports long-context prompting (up to 1M tokens), making it suitable for batch document analysis.
- Its vision capability enables direct reading of image content — critical for handwriting recognition.
- The free API tier makes it accessible for academic projects without budget.

**Comparison with alternatives:**
Briefly compare why Gemini was chosen over alternatives:

| Model | Reason not chosen |
|---|---|
| GPT-4o (OpenAI) | No free tier for sustained use |
| Claude (Anthropic) | Limited free tier; no free API for direct integration |
| Llama 3 (local) | Too large to run in browser; requires local server |
| Gemini 1.5 Flash | Free API tier, fast, multimodal — chosen |

---

### 2.5 Existing Document Scanner Applications

**What to write (200–300 words):**

Review existing tools and identify the gap:

| Tool | Strengths | Weaknesses relevant to this project |
|---|---|---|
| Adobe Scan | High-quality OCR, cloud sync | Paid subscription for structured extraction; cloud-dependent |
| Microsoft Lens | Good integration with Office | Sends data to Microsoft cloud; no local-only mode |
| CamScanner | Popular, multi-platform | Cloud-based; free tier adds watermarks |
| DocuSign | Document signing and workflow | Not a scanner; no data extraction |
| Genius Scan | Clean mobile UI | No AI extraction; no export to CSV |

**The gap:** No existing free, browser-based, privacy-first tool combines preprocessing + OCR + AI extraction + local archive + export in a single unified pipeline. DocuScan fills this gap.

---

### 2.6 Summary

**What to write (100–150 words):**

One paragraph summarizing what the literature review revealed:
- Established techniques exist for each individual component (preprocessing, OCR, AI extraction).
- No existing browser-based tool integrates all components end-to-end.
- The combination of WebAssembly (for OpenCV), Tesseract.js, and the Gemini API makes this integration feasible without backend infrastructure.
- This project builds on these established foundations and combines them in a novel, practical way.

---

---

## Chapter 3 — System Design

**Target length:** 1,500 – 2,200 words  
**Purpose:** Explain *what* the system is and *how* it is designed — architecture, components, data flow, and design decisions.

---

### 3.1 System Architecture Overview

**What to write (300–400 words):**

Describe the high-level architecture. DocuScan is a Single-Page Application (SPA) with no backend. Draw and include **Figure 3.1 — System Architecture Diagram**.

The architecture has three layers:

**1. Presentation layer (React components)**
- All UI components organized by page: Scanner, Review, Archive, Export, Settings.
- State managed by Zustand stores.
- Routing via React Router DOM.

**2. Processing layer (browser APIs and WASM)**
- OpenCV.js (WebAssembly): image preprocessing pipeline.
- Tesseract.js (Web Worker): OCR engine.
- Canvas API: image rendering, crop UI, highlight overlays.
- Google Gemini SDK: AI calls for classification, extraction, tagging, and vision.

**3. Persistence layer (IndexedDB)**
- Dexie.js wraps the browser's IndexedDB.
- All document data stored on-device.
- No backend database, no cloud storage.

Describe the single key external dependency: **the Gemini API** (HTTPS REST call from the browser to `generativelanguage.googleapis.com`). All other computation is local.

Include the architecture diagram as a figure. Caption: *Figure 3.1: DocuScan three-layer system architecture.*

---

### 3.2 Technology Stack

**What to write (400–500 words):**

Justify each technology choice. This is different from simply listing the stack — explain *why* each was chosen.

Organize as a table followed by a justification paragraph for each major decision:

**Table 3.1 — Technology Stack**

| Layer | Technology | Version | Role |
|---|---|---|---|
| Framework | React | 18.x | Component-based UI, state management lifecycle |
| Language | TypeScript | 5.x | Type safety, refactoring support |
| Build tool | Vite | 5.x | Fast HMR, code splitting, ES modules |
| Routing | React Router DOM | 6.x | Client-side navigation |
| Image processing | OpenCV.js | 4.x | Computer vision operations via WebAssembly |
| OCR | Tesseract.js | 5.x | In-browser OCR with bounding box output |
| AI / LLM | Google Gemini API | 1.5 Flash | Document understanding, extraction, vision |
| AI SDK | @google/generative-ai | latest | Official JavaScript client for Gemini |
| Local storage | Dexie.js | 4.x | IndexedDB wrapper for local document archive |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Icons | Lucide React | latest | SVG icon set |
| CSV export | papaparse | 5.x | CSV serialization |
| PDF export | jsPDF | 2.x | Client-side PDF generation |
| State | Zustand | 4.x | Lightweight global state management |
| Notifications | React Hot Toast | 2.x | Non-blocking toast messages |

**Justification paragraphs to write:**
- Why React over Vue/Angular: ecosystem maturity, hooks-based design, team familiarity.
- Why TypeScript: compile-time safety for complex data types (OCR word bboxes, Gemini response schemas, IndexedDB records) prevents runtime errors that are hard to debug.
- Why Vite over CRA: faster build times, better code splitting, native ESM.
- Why OpenCV.js: the only full-featured computer vision library available in WebAssembly. Alternatives (Jimp, sharp) do not support contour detection or perspective transforms.
- Why Tesseract.js: only mature in-browser OCR engine with word-level bounding box output. This output is required for the word-highlight feature.
- Why Gemini over OpenAI/Claude: free API tier allows use in academic project without financial cost. Gemini 1.5 Flash is fast and multimodal.
- Why Dexie over raw IndexedDB: dramatically reduces boilerplate code while providing a clean async API and compound index support.
- Why Zustand over Redux: far less boilerplate for the state complexity required; no need for Redux's full action/reducer pattern.

---

### 3.3 Data Flow Design

**What to write (400–500 words) + diagram:**

Describe the complete data flow from image acquisition to final storage. Include **Figure 3.2 — End-to-End Data Flow Diagram**.

Walk through each stage of the pipeline:

**Stage 1 — Capture**
Image enters the system as a raw Blob (camera) or File object (upload). It is drawn onto a Canvas element, downscaled to max 2400px width, and converted to an ImageData object. This is stored in the Zustand `scanStore` as a base64 data URL.

**Stage 2 — Preprocessing (OpenCV.js, Web Worker)**
Input: raw ImageData. The processing sequence: grayscale → Gaussian blur → Canny edge detection → contour finding → quadrilateral approximation → perspective transform → adaptive thresholding → morphological closing.
Output: cleaned, flat, high-contrast ImageData. Stored in `scanStore.processedImage`.

**Stage 3 — OCR (Tesseract.js, Web Worker)**
Input: processed image as base64. Tesseract runs recognition.
Output: `{ rawText, words[], confidence }`. Stored in `scanStore.ocrResult`.

**Stage 4 — AI Classification (Gemini API)**
Input: rawText. A short Gemini call classifies document type.
Output: `{ type, confidence }`. Stored in `scanStore.documentType`.

**Stage 5 — AI Extraction (Gemini API)**
Input: rawText + type + schema template. A full extraction call.
Output: structured JSON object matching the document type's schema. Stored in `scanStore.structuredData`.

**Stage 6 — AI Tagging (Gemini API)**
Input: structured JSON. A tag suggestion call.
Output: `string[]` of tags. Stored in `scanStore.tags`.

**Stage 7 — Save (Dexie.js / IndexedDB)**
A complete `DocumentRecord` is assembled from all Zustand state. A search index string is built by concatenating all searchable text. The record is written to IndexedDB via `db.documents.add()`.

**Stage 8 — Export (optional)**
User selects documents in the archive. Papaparse converts structured JSON to CSV, or jsPDF renders image + fields into a PDF report.

---

### 3.4 Database Design

**What to write (300–400 words) + schema table:**

Describe the IndexedDB schema.

Include **Table 3.2 — DocumentRecord Schema**:

| Field | Type | Description |
|---|---|---|
| `id` | string (UUID) | Primary key, generated with `crypto.randomUUID()` |
| `type` | string enum | Document type: receipt, invoice, id_card, form, note, unknown |
| `createdAt` | number | Unix timestamp in milliseconds |
| `updatedAt` | number | Last modification timestamp |
| `processedImageBase64` | string | Cleaned document image as base64 JPEG (quality 0.80) |
| `rawImageBase64` | string? | Original unprocessed image (optional, for re-processing) |
| `rawText` | string | Plain text output from Tesseract OCR |
| `words` | WordBbox[] | Array of word objects with pixel bounding boxes |
| `ocrConfidence` | number | Overall OCR confidence score (0–100) |
| `ocrLanguage` | string | Language code used: 'eng', 'ben', or 'eng+ben' |
| `structured` | object? | Gemini-extracted structured data (null if AI skipped) |
| `aiModel` | string? | Gemini model version used |
| `tags` | string[] | Array of tag strings (multi-entry indexed) |
| `searchIndex` | string | Concatenated lowercase string of all searchable fields |
| `notes` | string | User-written free-text notes |

**Indexes defined in Dexie:**
- `id` — primary key
- `type` — for type-based filtering
- `createdAt` — for date sorting and range queries
- `*tags` — multi-entry index (each tag individually indexed)
- `searchIndex` — for `startsWith` full-text queries

**Rationale:** The `searchIndex` field is a denormalized, pre-computed text blob containing vendor name, raw OCR text, tags, document type, and extracted values. This enables fast client-side full-text search without needing a dedicated search engine.

---

### 3.5 User Interface Design

**What to write (300–400 words) + UI diagram:**

Describe the UI structure and design decisions. Include **Figure 3.3 — Application Navigation Map** (a simple diagram showing pages and how they connect via navigation).

**Pages overview:**

| Page | Route | Primary purpose |
|---|---|---|
| Scanner | `/scan` | Capture or upload a document |
| Review | `/review/:id` | Preprocessing controls, OCR results, AI extraction output, save |
| Archive | `/archive` | Browse, search, and filter all saved documents |
| Document Detail | `/document/:id` | View, edit, re-process, or delete one document |
| Export | `/export` | Select and download documents as CSV, JSON, or PDF |
| Settings | `/settings` | API key, OCR language, theme, storage management |

**Key design decisions:**
- The pipeline progress indicator (5-step stepper) at the top of the Review page gives the user continuous feedback about what the system is doing.
- The dual-panel layout on the Review page (image left, extracted data right) allows the user to visually verify AI output against the source document.
- The OCR word highlight overlay creates a direct visual connection between extracted field values and their position in the document image.
- Bottom navigation bar on mobile, left sidebar on desktop — standard responsive navigation pattern.
- The AI badge (indigo color) on every AI-generated field makes it immediately clear which values were machine-generated vs. manually entered — supporting user trust and correction.

**Color palette summary:**
- Brand / primary actions: Slate Blue (`#3B5BDB`)
- AI-generated content marker: Indigo (`#6366F1`)
- Success / completed: Teal Green (`#0F9E78`)
- Warning / low confidence: Amber (`#D97706`)
- Error / danger: Soft Red (`#DC2626`)
- Background: Off-white (`#F8F9FC`) in light mode, Near-black (`#0F1117`) in dark mode

Include at least one UI screenshot or wireframe of the Review page as **Figure 3.4 — Review Page Layout.**

---

### 3.6 AI Integration Design

**What to write (300–400 words):**

Explain how the AI integration is designed as a layered service, not a monolithic call.

Describe the three-tier approach to AI calls:

**Tier 1 — Classification call** (lightweight, ~200 tokens total)
Determines document type. Fast, cheap, always runs first.

**Tier 2 — Extraction call** (medium, ~800 tokens total)
Takes the classified type and selects the appropriate JSON schema. Sends raw OCR text with a structured extraction prompt. Returns a fully typed JSON object.

**Tier 3 — Tagging call** (lightweight, ~180 tokens total)
Takes the extracted structured data and returns 2–4 semantic tags. This always runs last because it benefits from knowing the structured fields.

**Special case — Handwriting mode** (Tier 2b, replaces Tiers 1+2)
A single multimodal call that receives the document image and returns both transcription and structured data in one response. Used when OCR confidence falls below 40% or when the user manually enables it.

**Graceful degradation design:**
If any AI call fails (network error, quota exceeded, invalid key), the system:
1. Logs the error internally.
2. Shows a user-facing toast notification with the specific reason.
3. Saves the document with `structured: null` and `aiModel: null`.
4. Preserves all other data (image, OCR text, tags manually added by user).
5. Exposes a "Retry AI extraction" button on the Document Detail page.

This design ensures the system remains fully functional as an OCR scanner even if all AI features are unavailable.

---

---

## Chapter 4 — Implementation

**Target length:** 2,000 – 2,800 words  
**Purpose:** Show the technical implementation. How each component was built. Key code, algorithms, and decisions.

---

### 4.1 Project Setup and Configuration

**What to write (200–250 words):**

Describe the project initialization and configuration:
- Vite project setup with `npm create vite@latest` using the `react-ts` template.
- TypeScript strict mode configuration in `tsconfig.json`.
- Tailwind CSS setup with custom color tokens and font configuration.
- Environment variable configuration for the Gemini API key using `.env.local`.
- The public directory setup for OpenCV.js (the WASM binary cannot be bundled — it is served as a static file from `/public/opencv.js`).
- Code splitting configuration in `vite.config.ts` to split vendor, AI SDK, OCR, and export libraries into separate chunks (improving initial load time).

Include the project folder structure as a code block (tree format). This gives reviewers a clear picture of how the codebase is organized.

---

### 4.2 Image Capture Module

**What to write (300–400 words):**

Describe the implementation of image acquisition:

**Camera capture:**
- `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })` to access the rear camera.
- The video stream is displayed in a `<video>` element.
- A canvas overlay renders the document alignment guide frame.
- On capture, `ctx.drawImage(videoEl, 0, 0)` draws the current frame to a canvas.
- `canvas.toBlob()` converts to JPEG at 0.92 quality.
- Permission error handling: a clear instruction card is shown if camera access is denied.

**File upload:**
- HTML drag-and-drop with `dragover` and `drop` event listeners.
- `FileReader.readAsDataURL()` for image files.
- Validation: check MIME type, maximum file size (10MB), and image dimensions.
- Image downscaling: if width > 2400px, draw to a canvas at the target dimensions using `ctx.drawImage(img, 0, 0, targetWidth, targetHeight)`.

Include a relevant code snippet (10–20 lines) showing the image downscaling logic or the camera stream initialization. Label it as a code listing:

*Listing 4.1: Camera stream initialization in `useCamera.ts`*

---

### 4.3 Image Preprocessing Pipeline

**What to write (500–600 words):**

This is the most technically complex section. Describe each step of the OpenCV pipeline:

**Web Worker architecture:**
- OpenCV's WASM binary is ~8MB and computationally intensive. Running it on the main thread would freeze the UI.
- A dedicated Web Worker is created for preprocessing. The main thread posts an `ImageData` object to the worker via `postMessage`. The worker processes and returns the result.
- Describe how `transferable objects` are used to avoid copying large image data: `postMessage(imageData, [imageData.data.buffer])`.

**Pipeline steps with code snippets:**
For each step (grayscale, blur, Canny, findContours, approxPolyDP, warpPerspective, adaptiveThreshold), write 2–3 sentences explaining what it does and why, followed by the key OpenCV function call.

Example format:

> **Step 4 — Contour detection.** After Canny edge detection produces a binary edge map, `findContours` extracts closed regions (contours) from the edges. The largest contour by area is assumed to be the document boundary. Contours are sorted by area in descending order to identify the primary document outline.
>
> *Listing 4.2: Contour detection and sorting*
> ```ts
> const contours = new cv.MatVector();
> const hierarchy = new cv.Mat();
> cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
> // Sort by area descending, take the largest
> const areas = Array.from({ length: contours.size() }, (_, i) =>
>   cv.contourArea(contours.get(i))
> );
> const largestIdx = areas.indexOf(Math.max(...areas));
> ```

**Manual corner fallback:**
Describe the UI for when automatic corner detection fails (confidence below threshold). The user sees draggable corner handles on the image. The handle positions are mapped to perspective transform input coordinates.

**Memory management note:**
OpenCV.js requires explicit memory management. Every `cv.Mat` object must be deleted after use. Describe how your implementation handles this with a try-finally pattern.

---

### 4.4 OCR Integration

**What to write (300–400 words):**

Describe the Tesseract.js integration:

**Worker lifecycle:**
- A Tesseract worker is created once and reused across multiple documents in a batch.
- The worker loads the language data on first use (downloaded from a CDN and cached by the browser).
- The worker is terminated when the user navigates away from the scanner/review area.

**The recognition call:**
- Input: the processed image as a base64 data URL.
- The key output: not just the text, but `result.data.words` — the array of word objects with bounding box coordinates.
- Each word object: `{ text, bbox: { x0, y0, x1, y1 }, confidence }`.

**Why the bounding boxes matter:**
Explain that the word bounding boxes are stored in the database alongside the text. They enable the word-highlight feature in the Review page — when the user clicks on an extracted field, the system finds all matching words in the `words` array and renders highlight rectangles at their pixel coordinates on the image canvas.

**OCR progress reporting:**
The Tesseract logger callback fires with `{ status, progress }`. This is wired to the progress indicator component: percentage displayed updates in real time as Tesseract recognizes each text block.

Include *Listing 4.3: Tesseract.js worker usage and output handling* (10–15 lines showing the `recognize()` call and result destructuring).

---

### 4.5 AI Integration with Google Gemini API

**What to write (500–600 words):**

This section is critical. Describe the full implementation of all Gemini API calls.

**SDK setup and API key handling:**
- The `@google/generative-ai` npm package provides the JavaScript client.
- The API key is read from `localStorage` (user-provided via Settings page) with a fallback to the `VITE_GEMINI_API_KEY` environment variable.
- A `getClient()` helper function returns a configured `GoogleGenerativeAI` instance, throwing a clear error if no key is available.

**Call 1 — Document classification:**
Show the prompt structure. Describe how the output `{ type, confidence }` is parsed. Explain the handling if confidence is below 0.5: a type-selection UI is shown to the user.

**Call 2 — Field extraction:**
Describe the prompt engineering approach:
- A system instruction sets strict rules: return only JSON, normalize dates to ISO 8601, use null for missing fields.
- The user message contains the raw OCR text and the JSON schema for the detected document type.
- Five schema variants: receipt, invoice, id_card, form, note. Show the receipt schema fields.
- Post-processing: JSON parsing with error handling. If parsing fails, retry once with a stricter prompt.

Include *Listing 4.4: Gemini extraction call with retry logic* (15–20 lines showing the call, JSON parsing, and retry).

**Call 3 — Auto-tagging:**
The prompt instructs Gemini to return a simple JSON array of 2–4 tag strings. Rules: lowercase, no special characters, include year, category, and vendor name.

**Call 4 — Handwriting mode (multimodal):**
Describe how the image is converted to base64 and included in the Gemini request as `inlineData` with `mimeType`. A single call to `gemini-1.5-flash` returns both the transcription and structured data. Explain the image size constraint (4MB after base64 encoding) and the downscaling applied before encoding.

**Call 5 — Expense summarizer:**
Multiple receipt JSON records are serialized and included in a single prompt. Gemini returns a summary JSON with totals, category breakdown, and narrative insights.

**Error handling:**
Describe your error classification: API key invalid, quota exceeded, safety block, JSON parse failure, network error. Each maps to a specific user-facing message and recovery action (retry, save OCR-only, link to settings).

---

### 4.6 Local Storage and Archive

**What to write (300–400 words):**

Describe the Dexie.js implementation:

**Database initialization:**
The `DocuScanDB` class extends `Dexie`. The schema is defined in the constructor using Dexie's version API. The `*tags` multi-entry index allows Dexie to index each tag individually — supporting queries like "find all documents with tag 'telecom'".

**Saving a document:**
Describe the `saveDocument()` function. It assembles the `DocumentRecord` from Zustand state, builds the `searchIndex` string, and calls `db.documents.add(record)`.

**Search implementation:**
Describe the two-tier search: Dexie index queries for type and date range filters; client-side filtering for full-text search using the `searchIndex` field. Include the debounce hook (300ms) applied to the search input.

**Storage estimate:**
The `navigator.storage.estimate()` API returns used and quota bytes. This is surfaced on the Settings page so users know how much space their archive is consuming.

**Delete and clear:**
A `deleteDocument(id)` function removes the record from IndexedDB. A `clearAllDocuments()` function calls `db.documents.clear()`. Both require confirmation before execution.

---

### 4.7 Export Features

**What to write (200–300 words):**

Describe the three export modes:

**CSV export (papaparse):**
- The user selects documents and configures which fields to include in a column mapping UI.
- `Papa.unparse()` converts the array of field objects to a CSV string.
- A hidden `<a>` element with `href = URL.createObjectURL(blob)` triggers the browser's download dialog.

**JSON export:**
- Selected documents are serialized to a clean JSON array with `JSON.stringify(data, null, 2)`.
- Same download mechanism as CSV.

**PDF export (jsPDF):**
- A new `jsPDF` instance in A4 portrait format.
- Page 1: report header (title, type, date, tags) + the processed document image (scaled to fit the page width).
- Page 2: a table of all extracted fields (label + value pairs).
- `pdf.save(filename)` triggers browser download.
- For batch PDF export: each document is added as a new page group within the same PDF file.

---

### 4.8 Key Implementation Challenges and Solutions

**What to write (200–300 words):**

Reflect on real challenges encountered during implementation and how they were solved. Write at least 4:

1. **OpenCV WASM memory management:** OpenCV.js requires calling `.delete()` on every `cv.Mat` object. Forgetting this caused memory leaks that grew with each processed document. Solution: wrapped all preprocessing in try-finally blocks.

2. **Tesseract bounding box coordinate scaling:** Tesseract returns bounding boxes relative to the image's original pixel dimensions. When the image is displayed at a smaller size on screen, the coordinates must be scaled. Solution: computed a scale factor (`displayWidth / originalWidth`) and applied it to all bounding box coordinates before rendering.

3. **Gemini returning non-JSON responses:** Despite explicit instructions, Gemini occasionally wraps its JSON response in markdown code fences (```json ... ```). Solution: a post-processing step strips these fences before `JSON.parse()`. A retry prompt was added for persistent failures.

4. **OpenCV.js load time:** The WASM binary is ~8MB, causing a 2–3 second delay on first load. Solution: lazy-loaded only on the Scanner page, with a loading state shown during WASM initialization.

5. **Web Worker and React state:** Web Workers cannot directly access React state or Zustand. Solution: the worker communicates only via `postMessage`/`onmessage`, receiving serializable data in and posting serializable results out. The React component handles state updates on receiving the worker's response.

---

---

## Chapter 5 — Testing and Results

**Target length:** 1,200 – 1,800 words  
**Purpose:** Present what was tested, how it was tested, and what results were observed.

---

### 5.1 Testing Methodology

**What to write (200–300 words):**

Describe your testing approach:

- **Unit testing scope:** Core utility functions in `src/lib/` — particularly the preprocessing pipeline, JSON parsing logic, and the search index builder. Use Vitest (the Vite-native test runner) or Jest.
- **Integration testing:** Test the full pipeline end-to-end with a set of sample documents spanning each supported type.
- **Manual testing:** UI-level testing performed by the developer and 3–5 volunteer users.
- **Test documents used:** Describe your test set — how many documents, what types, what conditions (good lighting, bad lighting, crumpled, handwritten, etc.).

State clearly that automated end-to-end browser testing was not implemented due to time constraints and the complexity of testing WebAssembly modules. Manual testing was the primary validation method.

---

### 5.2 Preprocessing Performance

**What to write (200–300 words) + results table:**

Test the preprocessing pipeline on a set of documents. Measure:

- **Edge detection accuracy:** Did the system correctly identify the document's 4 corners? Record success rate across your test set.
- **Processing time:** How long does the full OpenCV pipeline take? Test on at least 3 device types (low-end mobile, mid-range mobile, desktop).

Include **Table 5.1 — Preprocessing Results on Test Document Set**:

| Document condition | Corner detection | Preprocessing time (avg) | Notes |
|---|---|---|---|
| Flat surface, good lighting | [X/Y correct] | [X ms] | |
| Tilted 15° angle | | | |
| Crumpled document | | | |
| Low light condition | | | |
| Very small document | | | |

**Discussion:** Where did the system succeed? Where did it fail? What were the common failure modes (e.g., corner detection fails when the document is on a patterned background)?

---

### 5.3 OCR Accuracy

**What to write (200–300 words) + results table:**

Test OCR accuracy on your document set. Measure:

- **Character Error Rate (CER):** For a selection of documents where the ground truth text is known, compare the OCR output character by character.
- **Word Error Rate (WER):** Same but word-level.
- **Confidence scores reported by Tesseract** vs. actual accuracy.

Include **Table 5.2 — OCR Accuracy Results**:

| Document type | Avg. Tesseract confidence | Estimated CER | Notes |
|---|---|---|---|
| Printed receipt | | | |
| Laser-printed invoice | | | |
| Thermal paper receipt | | | |
| Handwritten note | | | |
| Bengali printed text | | | |

**Note:** If you cannot compute exact CER, report the Tesseract confidence scores and subjective assessment of readability.

---

### 5.4 AI Extraction Accuracy

**What to write (300–400 words) + results table:**

This is the most important test section. Evaluate Gemini's extraction quality:

**Metric: Field Extraction Accuracy**
For a set of test documents with known ground truth (you read the document manually and record what the correct field values should be), compare the Gemini output field by field.

Include **Table 5.3 — Gemini Extraction Accuracy by Document Type**:

| Document type | Fields tested | Correctly extracted | Accuracy | Common errors |
|---|---|---|---|---|
| Printed receipt | Vendor, date, total, items | [X]/[Y] | [%] | |
| Invoice | Invoice no., date due, total | | | |
| ID card | Name, ID number, DOB | | | |
| Handwriting (Gemini Vision) | Content, key points | | | |

**Discussion topics:**
- Which fields did Gemini consistently extract correctly?
- Which fields were most error-prone? (Common: dates in non-standard formats, handwritten amounts, blurry totals)
- Did the document type hint improve accuracy?
- How did handwriting mode (Gemini Vision) compare to standard mode (Tesseract → Gemini text)?

---

### 5.5 User Testing

**What to write (200–300 words):**

Describe informal user testing with 3–5 volunteer participants:

- **Task given:** Scan 3 documents (one receipt, one bill, one handwritten note). Save them to the archive. Search for one of them. Export as CSV.
- **What was observed:** Note any UI confusion, unexpected errors, feature gaps discovered.
- **User feedback quotes** (paraphrase, not necessarily direct quotes): e.g., "The highlight feature made it easy to check if the total was correctly read", "The camera alignment guide was helpful but I wasn't sure if the photo was taken when I pressed the button."
- **Changes made based on feedback** (if any).

Include **Table 5.4 — User Testing Task Completion Rate**:

| Task | Participants completing without help | Participants needing guidance |
|---|---|---|
| Capture document with camera | | |
| Upload a file | | |
| Locate extracted fields in Review | | |
| Save to archive | | |
| Search for a document | | |
| Export CSV | | |

---

### 5.6 Performance Analysis

**What to write (200–250 words) + table:**

Report end-to-end processing times for the full pipeline (capture to saved):

Include **Table 5.5 — End-to-End Processing Times**:

| Stage | Time (desktop) | Time (mid-range mobile) | Notes |
|---|---|---|---|
| OpenCV preprocessing | | | Includes WASM execution time |
| Tesseract OCR | | | First run includes language pack download |
| Gemini classification | | | Network-dependent |
| Gemini extraction | | | Network-dependent |
| Gemini tagging | | | Network-dependent |
| IndexedDB save | | | |
| **Total (typical receipt)** | | | |

**Note:** First-run times are higher due to WASM compilation and Tesseract language pack download. Subsequent runs benefit from browser caching.

---

---

## Chapter 6 — Conclusion and Future Work

**Target length:** 600 – 900 words  
**Purpose:** Summarize what was achieved, reflect critically, and describe what could be done next.

---

### 6.1 Summary of Achievements

**What to write (250–350 words):**

Revisit the objectives stated in Section 1.3 and confirm which were achieved:

Write a paragraph-form assessment, not a checklist. Example:

> This project successfully designed and implemented DocuScan, a browser-based intelligent document scanner that achieves all eight stated objectives. A functional camera capture system was implemented using the MediaDevices API, with a document alignment overlay to guide users. The OpenCV.js preprocessing pipeline — comprising Gaussian blur, Canny edge detection, contour analysis, perspective transformation, and adaptive binarization — was implemented and demonstrated reliable results on printed documents photographed under normal lighting conditions. Tesseract.js integration provides in-browser OCR with word-level bounding box output, enabling the word-highlight overlay feature...

Continue through all objectives. Mention specific results from Chapter 5 (accuracy rates, processing times).

---

### 6.2 Limitations Encountered

**What to write (200–300 words):**

Honest reflection on what did not work as well as expected. Address at minimum:

- **OCR accuracy on thermal receipts:** Thermal paper fades and the low contrast makes binarization produce noisy output. OCR confidence on these documents was lower than expected.
- **Corner detection on patterned backgrounds:** When the document was placed on a patterned surface (e.g., a patterned tablecloth), OpenCV's contour detection sometimes picked up the background pattern instead of the document edges. Manual corner selection was required.
- **Gemini API rate limits:** The free tier imposes request limits. During intensive testing, the daily quota was exhausted, requiring testing to resume the following day.
- **Mobile performance:** On lower-end Android devices, the OpenCV WASM pipeline took noticeably longer (4–6 seconds vs. ~1 second on desktop), which affected the user experience.

---

### 6.3 Future Work

**What to write (200–300 words):**

Suggest concrete improvements and extensions:

1. **Multi-page document support:** Scan multiple pages and assemble them into a single document record with per-page OCR and a combined extracted data object.

2. **Fine-tuned model integration:** Replace the general-purpose Gemini call for field extraction with a model fine-tuned specifically on Bangladeshi document formats (utility bills, bank statements, NID cards) for higher accuracy.

3. **Progressive Web App (PWA):** Add a service worker and web app manifest so DocuScan can be installed on mobile home screens and run with limited offline capability (full offline except AI features).

4. **Automated category-based expense reporting:** A monthly dashboard that automatically groups all receipts by category and presents a spending summary without requiring the user to manually trigger the summarizer.

5. **Cross-device sync via encrypted cloud storage:** An optional feature to export and import the archive as an encrypted file (AES-256) to allow transfer between devices without exposing document contents.

6. **Bengali handwriting model:** Tesseract's Bengali support for handwriting is limited. A specialized handwriting recognition model for Bangla, integrated via Gemini Vision or a dedicated model, would significantly improve utility in the Bangladeshi context.

7. **Receipt splitting:** For group expenses, a feature to split a restaurant receipt total across multiple people and export the splits.

---

### 6.4 Closing Remarks

**What to write (100–150 words):**

A brief closing paragraph that reflects on the learning outcomes of the project:
- What you learned technically (WebAssembly, computer vision, LLM prompt engineering, browser storage)
- What you learned about the software development process (planning, handling scope, debugging across library boundaries)
- The broader significance: DocuScan demonstrates that powerful, privacy-respecting document intelligence tools can be built without cloud infrastructure — a meaningful contribution to accessible and affordable technology.

---

---

## References

**Format:** Use a consistent citation style throughout. IEEE format is standard for computer science projects. APA is acceptable if your department specifies it. Do not mix styles.

**Minimum number of references:** 15. Target 20–25.

**What to include:**

1. Official library documentation:
   - OpenCV Documentation: https://docs.opencv.org
   - Tesseract.js GitHub repository
   - Google Gemini API Documentation
   - Dexie.js Documentation
   - React Documentation

2. Academic papers (search Google Scholar for these topics):
   - Document image binarization methods (Sauvola, Niblack)
   - OCR accuracy benchmarks (ICDAR competition papers)
   - Perspective correction / document rectification papers
   - LLM-based information extraction papers
   - WebAssembly performance papers

3. Industry references:
   - Gemini 1.5 technical report (Google DeepMind)
   - Tesseract: An Overview — Ray Smith (original paper)

**IEEE format example:**
```
[1] R. Smith, "An Overview of the Tesseract OCR Engine," in Proc. 9th Int. Conf. Document Analysis Recognition, 2007, pp. 629-633.

[2] J. Sauvola and M. Pietikainen, "Adaptive document image binarization," Pattern Recognition, vol. 33, no. 2, pp. 225-236, 2000.

[3] Google DeepMind, "Gemini 1.5: Unlocking multimodal understanding across millions of tokens of context," Technical Report, 2024. [Online]. Available: https://arxiv.org/abs/2403.05530
```

---

---

## Appendices

Appendices are labeled A, B, C... They contain supporting material that is too detailed for the main body but necessary for completeness.

---

### Appendix A — Source Code Repository

**Include:**
- The GitHub (or GitLab) repository URL
- A brief description of the repository structure
- Instructions for running the project locally (3–5 steps)
- The commit history summary (number of commits, date range) to demonstrate development progress

---

### Appendix B — Complete API Prompt Templates

**Include:**
All five Gemini API prompt templates in full, formatted as code blocks:
- Document classification prompt
- Receipt extraction prompt (with full JSON schema)
- Invoice extraction prompt (with full JSON schema)
- Handwriting mode prompt (multimodal)
- Expense summarizer prompt

---

### Appendix C — Full Database Schema

**Include:**
The complete TypeScript interfaces for all types:
- `DocumentRecord`
- `WordBbox`
- `ExtractedData` (union type for all document types)
- `ReceiptData`, `InvoiceData`, `IDCardData`, `FormData`, `NoteData`
- The Dexie database class definition

---

### Appendix D — UI Screenshots

**Include:**
At minimum 8 screenshots of the working application:

1. Scanner page — camera mode with alignment overlay
2. Scanner page — file upload mode with drag-and-drop zone
3. Review page — showing the 5-step progress indicator mid-processing
4. Review page — showing extracted fields with AI badges and OCR confidence
5. Review page — showing the OCR word highlight overlay active
6. Archive page — document grid with search bar
7. Document detail page — full field view with edit option
8. Settings page — API key configuration
9. Export page — document selection with format options
10. Mobile view — showing the responsive bottom navigation

Caption every screenshot: *Figure A.D.1: [Description of what is shown]*

---

### Appendix E — Testing Data

**Include:**
- The list of test documents used (without reproducing personal information): e.g., "5 grocery receipts, 3 utility bills, 2 restaurant receipts, 2 handwritten notes, 1 NID card photocopy (personal information redacted)"
- The ground truth values used for accuracy testing (the correct values for each field in each test document)
- The raw accuracy calculation (number correct / number tested per field type)

---

## Formatting and Submission Guidelines

### Page Formatting

| Element | Specification |
|---|---|
| Paper size | A4 |
| Margins | Top: 1 inch, Bottom: 1 inch, Left: 1.5 inch (for binding), Right: 1 inch |
| Body font | Times New Roman 12pt |
| Heading 1 (Chapter) | Times New Roman 16pt Bold |
| Heading 2 (Section) | Times New Roman 14pt Bold |
| Heading 3 (Subsection) | Times New Roman 12pt Bold |
| Line spacing | 1.5 (body), 1.0 (code blocks, tables) |
| Code blocks | Courier New 10pt, shaded background |
| Paragraph spacing | 6pt after each paragraph |
| Page numbering | Roman numerals (i, ii, iii) for preliminary pages; Arabic numerals (1, 2, 3) starting from Chapter 1 |

### Figure and Table Formatting

- Every figure and table must be referenced in the main text before it appears. Never place a figure without referencing it: *"...as shown in Figure 3.1"*.
- Every figure needs a caption below it: *Figure 3.1: [Description]*
- Every table needs a caption above it: *Table 3.2: [Description]*
- Figures and tables must be numbered by chapter (e.g., Figure 4.2 is the second figure in Chapter 4).

### Code Listing Formatting

- Code listings are numbered separately from figures and tables: *Listing 4.1: [Description]*
- Use a monospace font at 10pt.
- Apply a light gray background (`#F5F5F5` equivalent in Word).
- Limit line length to approximately 80 characters to avoid horizontal overflow on the printed page.
- Include only the most relevant 10–25 lines per listing. Full code goes in Appendix A (repository link).

### Word Count Distribution

| Chapter | Target Word Count |
|---|---|
| Chapter 1 — Introduction | 1,000 – 1,400 |
| Chapter 2 — Literature Review | 1,200 – 1,800 |
| Chapter 3 — System Design | 1,500 – 2,200 |
| Chapter 4 — Implementation | 2,000 – 2,800 |
| Chapter 5 — Testing and Results | 1,200 – 1,800 |
| Chapter 6 — Conclusion | 600 – 900 |
| **Total** | **7,500 – 10,900** |

Preliminary pages and appendices are not counted toward the word limit.

---

*End of Report Directive — DocuScan Academic Project*  
*Follow this document section by section. Every writing instruction tells you exactly what content to produce and how long it should be. Do not skip any section. Chapters 3 and 4 carry the most technical weight — spend the most time on those.*
