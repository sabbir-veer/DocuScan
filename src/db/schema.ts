import Dexie, { type Table } from 'dexie'

export interface DocumentRecord {
  id?: number
  blob: Blob // Original/Processed image
  thumbnail: Blob
  type: 'receipt' | 'invoice' | 'id_card' | 'form' | 'note' | 'unknown'
  extractedData: any
  rawText: string
  ocrConfidence: number
  tags: string[]
  createdAt: number
  updatedAt: number
}

export class DocuScanDB extends Dexie {
  documents!: Table<DocumentRecord>

  constructor() {
    super('DocuScanDB')
    this.version(1).stores({
      documents: '++id, type, createdAt, *tags' // Primary key and indexed fields
    })
  }
}

export const db = new DocuScanDB()
