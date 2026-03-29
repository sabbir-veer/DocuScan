import { db, type DocumentRecord } from './schema'

export async function saveDocument(
  record: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt'>
) {
  const timestamp = Date.now()
  return await db.documents.add({
    ...record,
    createdAt: timestamp,
    updatedAt: timestamp
  })
}

export async function getDocuments() {
  return await db.documents.orderBy('createdAt').reverse().toArray()
}

export async function getDocumentById(id: string | number) {
  const numericId = typeof id === 'string' ? Number(id) : id
  if (isNaN(numericId as number)) return null
  return await db.documents.get(numericId)
}

export async function deleteDocument(id: string | number) {
  const numericId = typeof id === 'string' ? Number(id) : id
  if (isNaN(numericId as number)) return
  return await db.documents.delete(numericId)
}

export async function updateDocument(
  id: string | number,
  updates: Partial<DocumentRecord>
) {
  const numericId = typeof id === 'string' ? Number(id) : id
  if (isNaN(numericId as number)) return
  return await db.documents.update(numericId, {
    ...updates,
    updatedAt: Date.now()
  })
}

export async function searchDocuments(query: string) {
  return await db.documents
    .filter((doc) => {
      const searchStr =
        `${doc.rawText} ${doc.tags.join(' ')} ${doc.type}`.toLowerCase()
      return searchStr.includes(query.toLowerCase())
    })
    .toArray()
}
