# 📄 DocuScan

**DocuScan** is a high-performance, privacy-focused document scanning and analysis web application. It allows users to scan documents using their camera, perform OCR (Optical Character Recognition), and extract structured data using AI—all while maintaining a sleek, modern interface.

## ✨ Key Features

- 📸 **Smart Camera Capture**: Responsive camera interface with real-time feedback.
- 🖼️ **Image Preprocessing**: High-performance image enhancement using the Canvas 2D API (grayscale, contrast, brightness).
- 🔍 **OCR Extraction**: Robust text extraction using Tesseract.js.
- 🤖 **AI Content Analysis**: Intelligent document classification and data extraction (Receipts, Invoices, ID Cards, Notes) powered by **Google Gemini AI**.
- 🛠️ **Customizable Settings**: Flexible API key management and language support (English & Bengali).
- 🌓 **Themes**: Premium Dark and Light mode support with a modern aesthetic.
- 💾 **Local Storage**: Securely store scanned documents locally using IndexedDB (Dexie).
- 📄 **PDF Generation**: Export scanned results directly to PDF.

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **AI**: @google/genai (Gemini 2.0 Flash Lite)
- **OCR**: Tesseract.js
- **Database**: Dexie.js (IndexedDB)
- **PDF**: jsPDF

## 📦 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **NPM**: Or Yarn/Pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd DocuScan
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Google Gemini API Key.

   ```bash
   cp .env.example .env
   ```

   Open `.env` and replace `YOUR_GEMINI_API_KEY_HERE` with your actual key from [Google AI Studio](https://aistudio.google.com/).

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🛠️ Commands

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint to check code quality.

## 📄 License

This project is for academic/personal use. Please check the license for further details.
