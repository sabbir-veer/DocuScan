import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDocumentById, deleteDocument, updateDocument } from '../db/queries'
import { exportToPDF } from '../lib/export'
import {
  Trash2,
  Download,
  Tag as TagIcon,
  Calendar,
  Sparkles,
  ChevronLeft,
  Copy,
  Check,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DocumentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    const fetchDoc = async () => {
      if (!id) return
      setLoading(true)
      const data = await getDocumentById(id)
      setDoc(data)
      setLoading(false)
    }
    fetchDoc()
  }, [id])

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this document?'))
      return
    await deleteDocument(id)
    toast.success('Document deleted')
    navigate('/archive')
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleExportPDF = async () => {
    if (!doc) return
    const toastId = toast.loading('Generating PDF...')
    try {
      await exportToPDF(doc)
      toast.success('PDF Exported', { id: toastId })
    } catch (err: any) {
      toast.error('Failed to export PDF: ' + err.message, { id: toastId })
    }
  }

  if (loading)
    return (
      <div className='animate-pulse flex flex-col gap-8 h-screen bg-surface-alt rounded-3xl' />
    )
  if (!doc) return <div className='text-center py-24'>Document not found.</div>

  return (
    <div className='flex flex-col gap-8 max-w-6xl mx-auto pb-24'>
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigate('/archive')}
          className='flex items-center gap-2 text-text-secondary hover:text-brand transition-colors font-medium'>
          <ChevronLeft className='w-5 h-5' />
          Back to Archive
        </button>
        <div className='flex items-center gap-3'>
          <button
            onClick={handleDelete}
            className='p-3 rounded-xl text-danger hover:bg-danger/10 transition-all border border-transparent hover:border-danger/20'>
            <Trash2 className='w-5 h-5' />
          </button>
          <button
            onClick={handleExportPDF}
            className='flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all'>
            <Download className='w-5 h-5' />
            Export PDF
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
        {/* Left Column: Image */}
        <div className='flex flex-col gap-6 sticky top-8'>
          <div className='bg-surface dark:bg-surface-alt rounded-3xl border border-border overflow-hidden shadow-sm aspect-[3/4]'>
            <img
              src={URL.createObjectURL(doc.thumbnail)}
              alt='Cleaned Document'
              className='w-full h-full object-contain'
            />
          </div>

          <div className='bg-surface dark:bg-surface-alt rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-4'>
            <h3 className='font-bold flex items-center gap-2 uppercase text-xs tracking-widest text-text-secondary'>
              Metadata
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 text-sm text-text-secondary'>
                <Calendar className='w-4 h-4 text-brand' />
                {new Date(doc.createdAt).toLocaleDateString()}
              </div>
              <div className='flex items-center gap-3 text-sm text-text-secondary'>
                <TagIcon className='w-4 h-4 text-brand' />
                {doc.type}
              </div>
            </div>
            <div className='flex flex-wrap gap-2 pt-2'>
              {doc.tags.map((tag: string) => (
                <span
                  key={tag}
                  className='px-3 py-1 bg-surface-alt dark:bg-brand/5 border border-border rounded-full text-xs font-medium text-text-secondary'>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Data */}
        <div className='flex flex-col gap-8'>
          <div className='bg-surface dark:bg-surface-alt rounded-3xl border border-border shadow-sm overflow-hidden mb-8'>
            <div className='p-8 border-b border-border bg-brand/5'>
              <div className='flex items-center gap-3 mb-2'>
                <Sparkles className='w-6 h-6 text-ai' />
                <h2 className='text-2xl font-black text-text-primary'>
                  AI Insights
                </h2>
              </div>
              <p className='text-sm text-text-secondary'>
                Structured data extracted from the document using Gemini AI.
              </p>
            </div>

            <div className='p-8 space-y-6'>
              {Object.entries(doc.extractedData).map(
                ([key, value]: [string, any]) => (
                  <div key={key} className='group relative'>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-[10px] font-black text-text-secondary uppercase tracking-[0.1em]'>
                        {key.replace(/_/g, ' ')}
                      </label>
                      <button
                        onClick={() => copyToClipboard(String(value), key)}
                        className='opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-brand/10 text-brand transition-all'>
                        {copiedKey === key ? (
                          <Check className='w-3.5 h-3.5' />
                        ) : (
                          <Copy className='w-3.5 h-3.5' />
                        )}
                      </button>
                    </div>
                    <div className='bg-surface-alt dark:bg-white/5 border border-border rounded-2xl px-5 py-4 text-sm font-bold text-text-primary group-hover:border-brand/30 transition-all shadow-inner'>
                      {typeof value === 'object' ? (
                        <pre className='whitespace-pre-wrap font-mono text-[11px] leading-relaxed'>
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        String(value || 'N/A')
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className='bg-surface dark:bg-surface-alt rounded-3xl border border-border shadow-sm p-8'>
            <h3 className='font-bold text-text-primary mb-4 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-text-muted' />
              Raw OCR Text
            </h3>
            <div className='bg-surface-alt dark:bg-black/20 p-6 rounded-2xl font-mono text-xs leading-relaxed text-text-secondary overflow-x-auto max-h-[400px]'>
              {doc.rawText}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
