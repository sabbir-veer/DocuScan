import { GoogleGenAI } from '@google/genai'
import { useSettingsStore } from '../store/settingsStore'

function getClient(): GoogleGenAI {
  // Prefer user-configured key from settings, fall back to env var
  const key =
    useSettingsStore.getState().geminiApiKey ||
    import.meta.env.VITE_GEMINI_API_KEY

  if (!key)
    throw new Error('Gemini API key not configured. Please add it in Settings.')
  return new GoogleGenAI({ apiKey: key })
}

export async function processDocumentWithAI(rawText: string) {
  const ai = getClient()

  const schemas: Record<string, any> = {
    receipt: {
      vendor: 'string',
      date: 'YYYY-MM-DD',
      total: 'number',
      currency: 'string',
      line_items: [{ description: 'string', total: 'number' }]
    },
    invoice: {
      vendor: 'string',
      invoice_number: 'string',
      date: 'YYYY-MM-DD',
      total: 'number',
      line_items: [{ description: 'string', total: 'number' }]
    },
    id_card: {
      full_name: 'string',
      id_number: 'string',
      id_type: 'string',
      expiry_date: 'YYYY-MM-DD'
    },
    note: {
      title: 'string',
      summary: 'string',
      key_points: ['string']
    },
    form: {
      title: 'string',
      fields: [{ label: 'string', value: 'string' }]
    }
  }

  const prompt = `
    You are a document analysis assistant. Analyze the following OCR text from a scanned document.
    
    Step 1: Classify the document into one of these types: receipt, invoice, id_card, note, form.
    Step 2: Extract structured data based on the identified type.
    
    Expected schemas per type:
    - receipt: ${JSON.stringify(schemas.receipt)}
    - invoice: ${JSON.stringify(schemas.invoice)}
    - id_card: ${JSON.stringify(schemas.id_card)}
    - note: ${JSON.stringify(schemas.note)}
    - form: ${JSON.stringify(schemas.form)}

    Return ONLY a JSON object with this exact structure:
    {
      "type": "the_detected_type",
      "confidence": 0.0,
      "extractedData": { ... matching the schema for that type ... }
    }

    OCR text:
    ${rawText}
  `

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt
  })

  const text = response.text ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
