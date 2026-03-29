import { useEffect, useState } from 'react'
import { useArchiveStore } from '../store/archiveStore'
import { getDocuments, searchDocuments } from '../db/queries'
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Tag,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ArchivePage() {
  const { filters, setSearchQuery } = useArchiveStore()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true)
      const docs = filters.searchQuery
        ? await searchDocuments(filters.searchQuery)
        : await getDocuments()
      setDocuments(docs)
      setLoading(false)
    }
    fetchDocs()
  }, [filters.searchQuery])

  return (
    <div className='flex flex-col gap-8 max-w-6xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold text-text-primary'>
            Document Archive
          </h1>
          <p className='text-text-secondary'>
            Browse and search your extracted documents
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary' />
          <input
            type='text'
            placeholder='Search by text, tags, or type...'
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-12 pr-4 py-4 rounded-2xl bg-surface dark:bg-surface-alt border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium'
          />
        </div>
        <button className='hidden md:flex items-center gap-2 px-6 py-4 rounded-2xl bg-surface dark:bg-surface-alt border border-border text-text-secondary hover:bg-surface-alt transition-all font-bold'>
          <Filter className='w-5 h-5' />
          Filters
        </button>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className='h-48 bg-surface-alt rounded-2xl border border-border'
            />
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {documents.map((doc) => (
            <Link
              key={doc.id}
              to={`/document/${doc.id}`}
              className='group bg-surface dark:bg-surface-alt rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
              <div className='aspect-[16/9] bg-black/5 dark:bg-black/20 relative overflow-hidden'>
                <img
                  src={URL.createObjectURL(doc.thumbnail)}
                  alt={doc.type}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute top-4 left-4'>
                  <span className='bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-lg'>
                    {doc.type}
                  </span>
                </div>
              </div>
              <div className='p-5 flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-bold text-text-primary line-clamp-1'>
                    {doc.extractedData.vendor ||
                      doc.extractedData.title ||
                      `Document #${doc.id}`}
                  </h3>
                  <ArrowRight className='w-4 h-4 text-brand opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all' />
                </div>
                <div className='flex flex-col gap-1.5 text-xs text-text-secondary'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-3.5 h-3.5' />
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Tag className='w-3.5 h-3.5' />
                    {doc.tags.join(', ')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-24 text-center gap-4 bg-surface dark:bg-surface-alt rounded-3xl border border-border border-dashed'>
          <div className='bg-surface-alt dark:bg-brand/5 p-6 rounded-full'>
            <FileText className='w-12 h-12 text-text-secondary' />
          </div>
          <div>
            <h3 className='text-xl font-bold'>No documents found</h3>
            <p className='text-text-secondary'>
              Try searching for something else or scan a new document
            </p>
          </div>
          <Link
            to='/scan'
            className='px-6 py-2 bg-brand text-white rounded-xl font-bold hover:bg-brand-hover transition-all'>
            Scan Now
          </Link>
        </div>
      )}
    </div>
  )
}
