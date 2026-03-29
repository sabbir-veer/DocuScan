import { create } from 'zustand'

interface ArchiveFilters {
  searchQuery: string
  documentType: string | null
  startDate: string | null
  endDate: string | null
  tags: string[]
}

interface ArchiveState {
  filters: ArchiveFilters
  setSearchQuery: (query: string) => void
  setDocumentType: (type: string | null) => void
  setDateRange: (start: string | null, end: string | null) => void
  toggleTag: (tag: string) => void
  clearFilters: () => void
}

export const useArchiveStore = create<ArchiveState>((set) => ({
  filters: {
    searchQuery: '',
    documentType: null,
    startDate: null,
    endDate: null,
    tags: []
  },
  setSearchQuery: (query) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: query } })),
  setDocumentType: (type) =>
    set((state) => ({ filters: { ...state.filters, documentType: type } })),
  setDateRange: (start, end) =>
    set((state) => ({
      filters: { ...state.filters, startDate: start, endDate: end }
    })),
  toggleTag: (tag) =>
    set((state) => ({
      filters: {
        ...state.filters,
        tags: state.filters.tags.includes(tag)
          ? state.filters.tags.filter((t) => t !== tag)
          : [...state.filters.tags, tag]
      }
    })),
  clearFilters: () =>
    set({
      filters: {
        searchQuery: '',
        documentType: null,
        startDate: null,
        endDate: null,
        tags: []
      }
    })
}))
