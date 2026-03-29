import { create } from 'zustand'

interface ScanItem {
  id: string
  blob: Blob
  status: 'captured' | 'enhancing' | 'ocr' | 'ai' | 'saving' | 'done' | 'failed'
  error?: string
}

interface ScanState {
  queue: ScanItem[]
  activeId: string | null
  addToQueue: (blob: Blob) => string
  updateStatus: (id: string, status: ScanItem['status'], error?: string) => void
  removeFromQueue: (id: string) => void
  clearQueue: () => void
}

export const useScanStore = create<ScanState>((set) => ({
  queue: [],
  activeId: null,
  addToQueue: (blob) => {
    const id = crypto.randomUUID()
    set((state) => ({
      queue: [...state.queue, { id, blob, status: 'captured' }],
      activeId: state.activeId || id
    }))
    return id
  },
  updateStatus: (id, status, error) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, status, error } : item
      )
    })),
  removeFromQueue: (id) =>
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
      activeId: state.activeId === id ? null : state.activeId
    })),
  clearQueue: () => set({ queue: [], activeId: null })
}))
