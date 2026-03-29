import { useEffect, useState } from 'react'
import { getDocuments } from '../db/queries'
import { exportToCSV, exportToJSON } from '../lib/export'
import {
  Download,
  FileJson,
  Table,
  CheckSquare,
  Square,
  Search
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ExportPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true)
      const docs = await getDocuments()
      setDocuments(docs)
      setLoading(false)
    }
    fetchDocs()
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDocs.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredDocs.map((d) => d.id!))
    }
  }

  const filteredDocs = documents.filter((doc) =>
    `${doc.type} ${doc.rawText} ${JSON.stringify(doc.extractedData)}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  const handleExport = (format: 'csv' | 'json') => {
    if (selectedIds.length === 0) {
      toast.error('Please select documents to export')
      return
    }

    const dataToExport = documents
      .filter((d) => selectedIds.includes(d.id!))
      .map((d) => ({
        id: d.id,
        type: d.type,
        createdAt: new Date(d.createdAt).toISOString(),
        ...d.extractedData
      }))

    if (format === 'csv') {
      exportToCSV(dataToExport, `docuscan-export-${Date.now()}.csv`)
    } else {
      exportToJSON(dataToExport, `docuscan-export-${Date.now()}.json`)
    }
    toast.success(
      `Exported ${selectedIds.length} documents as ${format.toUpperCase()}`
    )
  }

  return (
    <div className='flex flex-col gap-8 max-w-6xl mx-auto'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-text-primary'>Export Data</h1>
        <p className='text-text-secondary'>
          Select documents and choose an export format
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Left: Selection & List */}
        <div className='lg:col-span-3 flex flex-col gap-6'>
          <div className='bg-surface dark:bg-surface-alt rounded-2xl border border-border shadow-sm overflow-hidden'>
            <div className='p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between bg-surface-alt/50'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary' />
                <input
                  type='text'
                  placeholder='Filter documents...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 bg-surface dark:bg-surface-alt border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium'
                />
              </div>
              <button
                onClick={toggleSelectAll}
                className='flex items-center gap-2 text-sm font-bold text-brand hover:bg-brand/5 px-4 py-2 rounded-xl transition-all'>
                {selectedIds.length === filteredDocs.length &&
                filteredDocs.length > 0 ? (
                  <CheckSquare className='w-4 h-4' />
                ) : (
                  <Square className='w-4 h-4' />
                )}
                {selectedIds.length === filteredDocs.length &&
                filteredDocs.length > 0
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            <div className='divide-y divide-border max-h-[600px] overflow-y-auto'>
              {loading ? (
                <div className='p-8 text-center text-text-secondary'>
                  Loading documents...
                </div>
              ) : filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => toggleSelect(doc.id!)}
                    className={`flex items-center gap-4 p-4 hover:bg-surface-alt transition-colors cursor-pointer ${selectedIds.includes(doc.id!) ? 'bg-brand/5' : ''}`}>
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedIds.includes(doc.id!) ? 'bg-brand border-brand text-white shadow-md' : 'border-border'}`}>
                      {selectedIds.includes(doc.id!) && (
                        <CheckSquare className='w-4 h-4' />
                      )}
                    </div>
                    <div className='w-12 h-12 rounded-lg overflow-hidden bg-black/5 flex-shrink-0'>
                      <img
                        src={URL.createObjectURL(doc.thumbnail)}
                        alt=''
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-bold text-sm text-text-primary truncate'>
                        {doc.extractedData.vendor ||
                          doc.extractedData.title ||
                          `Document #${doc.id}`}
                      </h4>
                      <p className='text-xs text-text-secondary flex items-center gap-2'>
                        <span className='capitalize'>{doc.type}</span> •{' '}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='p-12 text-center text-text-secondary'>
                  No documents to export.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className='lg:col-span-1 flex flex-col gap-6 sticky top-8'>
          <div className='bg-surface dark:bg-surface-alt rounded-3xl border border-border shadow-xl p-8 flex flex-col gap-6'>
            <div className='flex flex-col gap-1'>
              <h3 className='font-black text-xs uppercase tracking-widest text-text-secondary mb-2'>
                Export Summary
              </h3>
              <div className='flex items-center justify-between text-lg font-black text-text-primary'>
                <span>Selected</span>
                <span className='text-brand'>{selectedIds.length}</span>
              </div>
            </div>

            <div className='h-px bg-border' />

            <div className='flex flex-col gap-3'>
              <button
                onClick={() => handleExport('csv')}
                disabled={selectedIds.length === 0}
                className='w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-alt dark:bg-brand/10 border border-border hover:border-brand/40 hover:bg-brand/5 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed group'>
                <div className='bg-success/10 p-2 rounded-xl group-hover:scale-110 transition-transform'>
                  <Table className='w-5 h-5 text-success' />
                </div>
                Export to CSV
              </button>

              <button
                onClick={() => handleExport('json')}
                disabled={selectedIds.length === 0}
                className='w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-surface-alt dark:bg-brand/10 border border-border hover:border-brand/40 hover:bg-brand/5 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed group'>
                <div className='bg-warning/10 p-2 rounded-xl group-hover:scale-110 transition-transform'>
                  <FileJson className='w-5 h-5 text-warning' />
                </div>
                Export to JSON
              </button>
            </div>

            <p className='text-[10px] text-text-secondary leading-relaxed text-center mt-2 px-2'>
              Images are not included in CSV/JSON exports. Use PDF export for
              document images.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
