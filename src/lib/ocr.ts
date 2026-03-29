import { createWorker } from 'tesseract.js'

let worker: any = null

export async function getOCRWorker(lang = 'eng') {
  if (worker) return worker
  worker = await createWorker(lang, 1, {
    // logger: (m) => console.log(m),
  })
  return worker
}

export async function extractText(imageBlob: Blob, lang = 'eng') {
  const w = await getOCRWorker(lang)
  const imageUrl = URL.createObjectURL(imageBlob)
  const result = await w.recognize(imageUrl)
  URL.revokeObjectURL(imageUrl)

  return {
    text: result.data.text ?? '',
    words:
      result.data.words?.map((w: any) => ({
        text: w.text,
        bbox: w.bbox,
        confidence: w.confidence
      })) ?? [],
    confidence: result.data.confidence ?? 0
  }
}
