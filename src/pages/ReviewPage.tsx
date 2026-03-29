import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useScanStore } from '../store/scanStore'
import { preprocessImage } from '../lib/preprocessing'
import { extractText } from '../lib/ocr'
import { processDocumentWithAI } from '../lib/gemini'
import { saveDocument } from '../db/queries'
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Save,
  ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { queue, updateStatus } = useScanStore()
  const item = queue.find((i) => i.id === id)
  const processingRef = useRef<string | null>(null)

  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null)
  const [ocrData, setOcrData] = useState<any>(null)
  const [aiData, setAiData] = useState<any>(null)
  const [docType, setDocType] = useState<string>('unknown')
  const [isProcessing, setIsProcessing] = useState(false)

  const runPipeline = useCallback(async () => {
    if (
      !item ||
      item.status !== 'captured' ||
      processingRef.current === item.id
    )
      return
    processingRef.current = item.id
    setIsProcessing(true)

    try {
      // Step 2: Preprocessing
      updateStatus(item.id, 'enhancing')
      const enhanced = await preprocessImage(item.blob)
      setProcessedBlob(enhanced)

      // Step 3: OCR
      updateStatus(item.id, 'ocr')
      const ocr = await extractText(enhanced)
      setOcrData(ocr)

      // Step 4: AI (Merged)
      updateStatus(item.id, 'ai')
      const result = await processDocumentWithAI(ocr.text)
      setDocType(result.type)
      setAiData(result.extractedData)

      updateStatus(item.id, 'done')
      toast.success('Document processed successfully!')
    } catch (err: any) {
      console.error(err)
      processingRef.current = null // Allow retry on failure
      updateStatus(item.id, 'failed', err.message)
      toast.error('Failed to process document: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }, [item, updateStatus])

  useEffect(() => {
    if (item && item.status === 'captured') {
      runPipeline()
    }
  }, [item, runPipeline])

  const handleSave = async () => {
    if (!item || !processedBlob || !aiData) return

    try {
      updateStatus(item.id, 'saving')
      await saveDocument({
        blob: item.blob, // Original
        thumbnail: processedBlob, // Enhanced
        type: docType as any,
        extractedData: aiData,
        rawText: ocrData?.text || '',
        ocrConfidence: ocrData?.confidence || 0,
        tags: [docType]
      })
      toast.success('Saved to archive')
      navigate('/archive')
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message)
    }
  }

  if (!item) return <div>Document not found.</div>

  const steps = [
    { key: 'captured', label: 'Captured', icon: ImageIcon },
    { key: 'enhancing', label: 'Enhanced', icon: RefreshCw },
    { key: 'ocr', label: 'OCR', icon: FileText },
    { key: 'ai', label: 'AI AI', icon: Sparkles },
    { key: 'done', label: 'Ready', icon: CheckCircle }
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === item.status)

  return (
    <div className='flex flex-col gap-8 max-w-6xl mx-auto pb-24'>
      {/* Progress Stepper */}
      <div className='bg-surface dark:bg-surface-alt p-6 rounded-2xl border border-border shadow-sm'>
        <div className='flex items-center justify-between'>
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isCompleted = idx < currentStepIndex || item.status === 'done'
            const isActive = idx === currentStepIndex
            const isFailed = item.status === 'failed' && isActive

            return (
              <div
                key={step.key}
                className='flex items-center flex-1 last:flex-none'>
                <div className='flex flex-col items-center gap-2'>
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${isCompleted ? 'bg-success border-success text-white' : ''}
                    ${isActive ? 'bg-brand border-brand text-white animate-pulse' : ''}
                    ${isFailed ? 'bg-danger border-danger text-white' : ''}
                    ${!isCompleted && !isActive && !isFailed ? 'bg-surface-alt border-border text-text-secondary' : ''}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className='w-5 h-5' />
                    ) : (
                      <Icon className='w-5 h-5' />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${isActive ? 'text-brand' : 'text-text-secondary'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 rounded-full ${idx < currentStepIndex ? 'bg-success' : 'bg-border'}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left Column: Image Preview */}
        <div className='flex flex-col gap-4'>
          <div className='bg-surface dark:bg-surface-alt rounded-2xl border border-border overflow-hidden shadow-sm aspect-[3/4] flex items-center justify-center relative'>
            {processedBlob ? (
              <img
                src={URL.createObjectURL(processedBlob)}
                alt='Processed'
                className='w-full h-full object-contain'
              />
            ) : item.blob ? (
              <img
                src={URL.createObjectURL(item.blob)}
                alt='Original'
                className='w-full h-full object-contain opacity-50 gray-grayscale'
              />
            ) : (
              <ImageIcon className='w-16 h-16 text-text-muted' />
            )}

            {isProcessing && (
              <div className='absolute inset-0 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3'>
                <Loader2 className='w-10 h-10 text-white animate-spin' />
                <span className='text-white font-medium bg-black/40 px-4 py-1.5 rounded-full text-sm'>
                  {item.status.toUpperCase()}...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Data & Actions */}
        <div className='flex flex-col gap-6'>
          <div className='bg-surface dark:bg-surface-alt rounded-2xl border border-border shadow-sm p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold flex items-center gap-2'>
                <Sparkles className='w-5 h-5 text-ai' />
                Extracted Data
              </h2>
              {docType !== 'unknown' && (
                <span className='bg-brand/10 text-brand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider'>
                  {docType}
                </span>
              )}
            </div>

            {aiData ? (
              <div className='space-y-4'>
                {Object.entries(aiData).map(([key, value]: [string, any]) => (
                  <div key={key} className='group'>
                    <label className='text-xs font-bold text-text-secondary uppercase tracking-tight mb-1 block'>
                      {key.replace(/_/g, ' ')}
                    </label>
                    <div className='bg-surface-alt dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm font-medium group-hover:border-brand/40 transition-colors'>
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value || 'N/A')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-text-muted gap-3'>
                <FileText className='w-12 h-12 opacity-20' />
                <p className='text-sm'>Waiting for AI extraction...</p>
              </div>
            )}
          </div>

          <div className='flex gap-4'>
            <button
              onClick={() => navigate('/scan')}
              className='flex-1 px-6 py-4 rounded-2xl font-bold border border-border bg-surface dark:bg-surface-alt text-text-secondary hover:bg-surface-alt transition-all flex items-center justify-center gap-2'>
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!aiData || isProcessing}
              className='flex-[2] px-6 py-4 rounded-2xl font-bold bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none'>
              <Save className='w-5 h-5' />
              Save to Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper types & missing icons
const RefreshCw = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'>
    <path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' />
    <path d='M21 3v5h-5' />
    <path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' />
    <path d='M8 16H3v5' />
  </svg>
)
