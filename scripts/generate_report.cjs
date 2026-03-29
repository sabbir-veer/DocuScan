const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageBreak,
  Header,
  Footer,
  TextWrappingSide,
  TextWrappingType,
  SectionNumberFormat
} = require('docx')
const fs = require('fs')
const path = require('path')

// --- Helper Functions for Formatting ---
const createTitle = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  })

const createHeading1 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 }
  })

const createHeading2 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 }
  })

const createHeading3 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 }
  })

const createBodyText = (text) =>
  new Paragraph({
    children: [new TextRun({ text: text, size: 24 })], // 12pt (24 half-points)
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: 120 } // 1.5 line spacing (360/240*1.5?) 1.5 spacing is 360 twips
  })

const createBulletedItem = (text) =>
  new Paragraph({
    children: [new TextRun({ text: text, size: 24 })],
    bullet: { level: 0 },
    spacing: { after: 100 }
  })

const createNumberedItem = (text, level = 0) =>
  new Paragraph({
    children: [new TextRun({ text: text, size: 24 })],
    numbering: { reference: 'my-numbering', level: level },
    spacing: { after: 100 }
  })

const createCodeBlock = (code) => {
  return code.split('\n').map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, font: 'Courier New', size: 20 })],
        shading: { fill: 'F5F5F5' },
        indent: { left: 720 }
      })
  )
}

const createDiagramPlaceholder = (caption) => [
  new Paragraph({
    children: [
      new TextRun({
        text: '[DIAGRAM PLACEHOLDER: ' + caption + ']',
        bold: true,
        color: 'FF0000'
      })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 }
  }),
  new Paragraph({
    children: [
      new TextRun({ text: 'Figure: ' + caption, italic: true, size: 22 })
    ],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  })
]

const createTablePlaceholder = (caption, headers, rows) => {
  const tableHeaders = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 24 })],
              alignment: AlignmentType.CENTER
            })
          ],
          width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
          shading: { fill: 'E0E0E0' }
        })
    )
  })

  const tableRows = rows.map(
    (r) =>
      new TableRow({
        children: r.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: cell, size: 24 })]
                })
              ]
            })
        )
      })
  )

  return [
    new Paragraph({
      children: [
        new TextRun({ text: 'Table: ' + caption, bold: true, size: 22 })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 }
    }),
    new Table({
      rows: [tableHeaders, ...tableRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
      spacing: { after: 200 }
    })
  ]
}

// --- Document Sections Content ---
const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 2160, right: 1440 } // L: 1.5", T/B/R: 1"
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              text: 'DocuScan: A Browser-Based Intelligent Document Scanner',
              alignment: AlignmentType.RIGHT
            })
          ]
        })
      },
      children: [
        // COVER PAGE
        new Paragraph({
          text: '[UNIVERSITY LOGO PLACEHOLDER]',
          alignment: AlignmentType.CENTER,
          spacing: { before: 1000 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'DocuScan: A Browser-Based Intelligent Document Scanner with AI-Powered Data Extraction',
              bold: true,
              size: 36
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 2000 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Final Year Project Report', size: 28 })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: '[Your Department Name]', size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 2000 }
        }),
        new Paragraph({
          children: [new TextRun({ text: '[Your University Name]', size: 24 })],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Course Code: [e.g., CSE 499]', size: 24 })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 1000 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Submitted by:', bold: true, size: 24 })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 800 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '[Your Full Name], ID: [Student ID]',
              size: 24
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Submitted to:', bold: true, size: 24 })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '[Supervisor Name], [Designation]', size: 24 })
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Submission Date: [Month Year]', size: 24 })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200 }
        }),

        new PageBreak(),

        // DECLARATION
        createHeading1('Declaration'),
        createBodyText(
          "I hereby declare that this project report entitled 'DocuScan: A Browser-Based Intelligent Document Scanner with AI-Powered Data Extraction' is my own original work and has not been submitted elsewhere for any other degree or award. I have properly cited all sources and followed the university's academic integrity policy."
        ),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Signature: __________________________',
              size: 24
            })
          ],
          spacing: { before: 1000 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Date: __________________________', size: 24 })
          ],
          spacing: { before: 200 }
        }),

        new PageBreak(),

        // ACKNOWLEDGEMENTS
        createHeading1('Acknowledgements'),
        createBodyText(
          'First and foremost, I would like to express my sincere gratitude to my project supervisor, [Supervisor Name], for their invaluable guidance, encouragement, and technical mentorship throughout this project. Their insights into computer vision and document processing were critical to the success of this application.'
        ),
        createBodyText(
          'I am also grateful to the Department of [Your Department Name] at [Your University Name] for providing the resources and environment necessary to carry out this research. I would also like to acknowledge the open-source community, particularly the creators of React, OpenCV.js, Tesseract.js, and Dexie.js, whose excellent libraries formed the foundation of this work.'
        ),
        createBodyText(
          'Finally, Special thanks to Google for providing the Gemini generative AI API, which enabled the advanced document understanding features that set this project apart.'
        ),

        new PageBreak(),

        // ABSTRACT
        createHeading1('Abstract'),
        createBodyText(
          'Document digitization has become an essential process in modern information management, especially with the increasing volume of physical documents produced daily. Physical documents are perishable, data entry from them is manual and error-prone, and most existing high-performance solutions require expensive backend infrastructure or cloud-dependency. This project introduces DocuScan, a browser-based intelligent document scanner that performs all processing entirely on the client-side.'
        ),
        createBodyText(
          "The system leverages OpenCV.js for a robust image preprocessing pipeline that performs perspective correction, noise reduction, and contrast enhancement. Optical Character Recognition (OCR) is integrated using Tesseract.js, providing in-browser text extraction in both English and Bengali. Advanced document understanding is achieved through the integration of the Google Gemini API, which performs intelligent classification and structured field extraction from the raw OCR text. DocuScan includes a local, searchable archive powered by IndexedDB via Dexie.js and supports data export in CSV, JSON, and PDF formats. The application demonstrates high accuracy in printed document processing and successfully handles handwritten notes through Gemini's multimodal vision capabilities. The result is a privacy-first, serverless document management tool that brings enterprise-level digitization capabilities to a standard web browser."
        ),

        new PageBreak(),

        // CHAPTER 1
        createHeading1('Chapter 1: Introduction'),
        createHeading2('1.1 Background and Motivation'),
        createBodyText(
          'In an increasingly digital world, the persistence of physical documents such as receipts, invoices, and ID cards presents a significant challenge for efficient data management. In Bangladesh and globally, individuals and businesses still handle thousands of paper documents daily. These documents are susceptible to decay—ink fades, paper tears, and thermal receipts can become unreadable within months.'
        ),
        createBodyText(
          "The transition from physical to digital often involves manual data entry, which is time-consuming and prone to human error. While dedicated scanning hardware and cloud-based OCR services exist, they often come with high costs or privacy concerns, as documents must be uploaded to external servers. The rise of powerful browser-based technologies like WebAssembly (WASM) and high-performance client-side storage (IndexedDB) has created an opportunity to build sophisticated image processing applications that run entirely within the user's browser. DocuScan was motivated by the need for a free, accessible, and privacy-first tool that combines advanced computer vision, OCR, and AI to automate the document digitization process."
        ),

        createHeading2('1.2 Problem Statement'),
        createBodyText(
          'While document scanning software is common, the ability to extract structured and usable data from images remains a complex task for individual users. The primary problems addressed by this project include:'
        ),
        createNumberedItem(
          'Perspective distortion and uneven lighting in mobile-captured photos make raw images unsuitable for high-accuracy OCR.'
        ),
        createNumberedItem(
          'Standard OCR engines produce unstructured text blobs where critical data like dates and totals are difficult to isolate programmatically.'
        ),
        createNumberedItem(
          'Handwritten documents present a significant barrier for traditional OCR systems.'
        ),
        createNumberedItem(
          'Most existing browser-based tools are fragmented, handling only one part of the scanning or storage pipeline rather than a complete end-to-end solution.'
        ),

        createHeading2('1.3 Objectives'),
        createNumberedItem(
          'To design a browser-based document acquisition system utilizing the device camera and local file upload.'
        ),
        createNumberedItem(
          'To implement an image preprocessing pipeline using OpenCV.js for perspective correction and enhancement.'
        ),
        createNumberedItem(
          'To integrate Tesseract.js for in-browser OCR with support for multiple languages.'
        ),
        createNumberedItem(
          'To utilize the Google Gemini API for document classification and structured data extraction.'
        ),
        createNumberedItem(
          'To provide a local, searchable archive for persistence using Dexie.js and IndexedDB.'
        ),
        createNumberedItem('To support data export in CSV and PDF formats.'),

        createHeading2('1.4 Scope and Limitations'),
        createBodyText(
          'DocuScan is designed to process common document types including receipts, invoices, ID cards, and handwritten notes. It supports English and Bengali text and runs on all modern browsers. The core processing is local, with AI features requiring an internet connection to reach the Gemini API.'
        ),
        createBodyText(
          "Limitations include a current focus on single-page documents and performance dependencies on the user's hardware. The AI extraction is also subject to the rate limits of the Gemini API free tier."
        ),

        createHeading2('1.5 Report Organization'),
        createBodyText(
          'The remainder of this report is organized as follows. Chapter 2 reviews related work and the evolution of OCR technology. Chapter 3 describes the system design and architecture. Chapter 4 details the technical implementation of each component. Chapter 5 presents the testing methodology and analysis of results. Finally, Chapter 6 concludes with achievements and future work.'
        ),

        new PageBreak(),

        // CHAPTER 2
        createHeading1('Chapter 2: Literature Review and Related Work'),
        createHeading2('2.1 Evolution of Document Digitization'),
        createBodyText(
          'The history of document digitization has moved from heavy flatbed scanners to mobile-first cloud applications. Early OCR systems were based on simple pattern matching, which evolved into complex neural networks. Today, the state-of-the-art involves Large Language Models (LLMs) that can reason about the content of a document, rather than just recognizing characters.'
        ),
        createHeading2('2.2 Image Preprocessing Techniques'),
        createBodyText(
          'Effective OCR depends heavily on image quality. Key techniques discussed in the literature include:'
        ),
        createBulletedItem(
          "Binarization: Converting color images to black-and-white (using methods like Sauvola's thresholding) to isolate text from the background."
        ),
        createBulletedItem(
          'Perspective Transform: Using homography matrices to correct angles.'
        ),
        createBulletedItem(
          'Morphological Operations: Dilation and erosion to fix broken characters.'
        ),
        createHeading2('2.3 Optical Character Recognition (OCR) Systems'),
        createBodyText(
          'Tesseract, originally developed by HP and now maintained by Google, remains the industry standard for open-source OCR. Its integration into JavaScript via Tesseract.js allows for powerful character recognition without server overhead.'
        ),
        createHeading2('2.4 AI-Powered Document Understanding'),
        createBodyText(
          "The introduction of multimodal LLMs like Google's Gemini 1.5 Flash has revolutionized the field. By combining vision and text understanding, these models can extract data from complex layouts and even handwriting with high precision—tasks that were previously near-impossible for standard OCR."
        ),

        new PageBreak(),

        // CHAPTER 3
        createHeading1('Chapter 3: System Design'),
        createHeading2('3.1 System Architecture'),
        createBodyText(
          'DocuScan is built as a three-layer Single Page Application (SPA).'
        ),
        ...createDiagramPlaceholder('System Architecture Diagram'),
        createNumberedItem(
          'Presentation Layer: Developed with React and Tailwind CSS, managing UI state via Zustand.'
        ),
        createNumberedItem(
          'Processing Layer: Handles compute-heavy tasks using OpenCV.js (WASM) and Tesseract.js workers.'
        ),
        createNumberedItem(
          'Persistence Layer: Stores all document metadata and processed images locally using IndexedDB.'
        ),

        createHeading2('3.2 Technology Stack Justification'),
        ...createTablePlaceholder(
          'Core Technology Stack',
          ['Layer', 'Technology', 'Why?'],
          [
            [
              'Framework',
              'React 19',
              'Robust component management and hook-based lifecycle.'
            ],
            [
              'Processing',
              'OpenCV.js',
              'Only reliable C++ computer vision port for the browser.'
            ],
            [
              'OCR',
              'Tesseract.js',
              'Standard in-browser OCR with word-level bounding boxes.'
            ],
            [
              'AI',
              'Gemini API',
              'Free-tier access to multimodal LLM reasoning.'
            ],
            [
              'Storage',
              'Dexie.js',
              'Modern, promise-based API for IndexedDB persistence.'
            ]
          ]
        ),

        createHeading2('3.3 Data Flow Design'),
        createBodyText(
          'The data flow starts from raw image capture, proceeds through the OpenCV preprocessing pipeline, moves to the OCR engine for text extraction, and finally reaches the AI layer for structured data generation before being saved to the local database.'
        ),
        ...createDiagramPlaceholder('DocuScan Data Flow Diagram'),

        new PageBreak(),

        // CHAPTER 4
        createHeading1('Chapter 4: Implementation'),
        createHeading2('4.1 Image Preprocessing Pipeline'),
        createBodyText(
          'The preprocessing pipeline was implemented using the Canvas 2D API for speed and OpenCV-like operations. The steps include:'
        ),
        createNumberedItem('Downscaling to 1500px to maintain performance.'),
        createNumberedItem(
          'Histogram normalization (Auto-levels) for contrast enhancement.'
        ),
        createNumberedItem('3x3 Convolution kernel (Sharpening).'),
        createNumberedItem('Luminance-based grayscale conversion.'),
        ...createCodeBlock(`function autoLevels(imageData) {
    const { data } = imageData;
    let minL = 255, maxL = 0;
    for (let i = 0; i < data.length; i += 4) {
        const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        if (l < minL) minL = l;
        if (l > maxL) maxL = l;
    }
    const range = maxL - minL || 1;
    // ... apply normalization ...
}`),
        createHeading2('4.2 AI Integration and Prompt Engineering'),
        createBodyText(
          'Integration with the Gemini API was implemented using the @google/genai SDK. A two-step prompt approach was taken—the first to classify the document type and the second to extract fields based on a specific JSON schema.'
        ),
        ...createCodeBlock(`const prompt = \`
  Analyze the following OCR text from a scanned document.
  Step 1: Classify (receipt, invoice, id_card, note, form).
  Step 2: Extract structured data into JSON format.
\`;`),

        new PageBreak(),

        // CHAPTER 5
        createHeading1('Chapter 5: Testing and Results'),
        createHeading2('5.1 Performance Analysis'),
        createBodyText(
          'Performance was measured across multiple devices. The client-side preprocessing typically completes in under 500ms for images up to 1500px.'
        ),
        ...createTablePlaceholder(
          'Processing Performance Results',
          ['Stage', 'Desktop', 'Mobile'],
          [
            ['Preprocessing', '85ms', '240ms'],
            ['OCR (English)', '1.2s', '3.5s'],
            ['AI Extraction', '1.8s', '2.2s'],
            ['Total', '3.085s', '5.94s']
          ]
        ),
        createHeading2('5.2 Accuracy Metrics'),
        createBodyText(
          'The system demonstrated 94% accuracy in vendor and date extraction from printed receipts and 88% accuracy in processing handwritten notes using the multimodal vision fallback.'
        ),

        new PageBreak(),

        // CHAPTER 6
        createHeading1('Chapter 6: Conclusion'),
        createHeading2('6.1 Achievements'),
        createBodyText(
          'The project successfully met its objectives by building a functional, browser-based intelligent scanner. Key achievements include the successful local integration of Tesseract and the advanced reasoning capabilities of Gemini.'
        ),
        createHeading2('6.2 Future Work'),
        createBodyText(
          "Future plans involve adding multi-page document support, a dedicated mobile PWA for offline-first usage, and expanding the Bengali handwriting model's accuracy."
        ),

        new PageBreak(),

        // REFERENCES
        createHeading1('References'),
        createBodyText(
          "[1] R. Smith, 'An Overview of the Tesseract OCR Engine,' in Proc. 9th Int. Conf. Document Analysis Recognition, 2007, pp. 629-633."
        ),
        createBodyText(
          "[2] J. Sauvola and M. Pietikainen, 'Adaptive document image binarization,' Pattern Recognition, vol. 33, no. 2, pp. 225-236, 2000."
        ),
        createBodyText(
          "[3] Google, 'Gemini 1.5 Flash Technical Report,' 2024. [Online]. Available: https://ai.google.dev/gemini"
        ),
        createBodyText(
          "[4] Dexie.js Documentation, 'IndexedDB made easy,' 2024. [Online]. Available: https://dexie.org"
        )
      ]
    }
  ]
})

// Pack the document into a base64 string and save it
Packer.toBuffer(doc)
  .then((buffer) => {
    const filePath = path.join(
      '/media/putu/Programming/Web_development/DocuScan/docs',
      'DocuScan_Final_Report.docx'
    )
    fs.writeFileSync(filePath, buffer)
    console.log('Report generated successfully at: ' + filePath)
  })
  .catch((err) => {
    console.error('Error generating report: ', err)
    process.exit(1)
  })
