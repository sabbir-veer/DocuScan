import { useCallback, useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { useScanStore } from '../../store/scanStore'
import { useNavigate } from 'react-router-dom'

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const addToQueue = useScanStore((state) => state.addToQueue)
  const navigate = useNavigate()

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        // Support for PDF could be added here later as per plan
        return
      }

      // In a real app, we'd handle large files with a canvas resize here
      const id = addToQueue(file as unknown as Blob)
      navigate(`/review/${id}`)
    },
    [addToQueue, navigate]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) processFile(files[0])
    },
    [processFile]
  )

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) processFile(files[0])
    },
    [processFile]
  )

  return (
    <div className='w-full max-w-xl p-8'>
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`
          relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all cursor-pointer
          ${
            isDragging
              ? 'border-brand bg-brand/5 scale-[1.02]'
              : 'border-border bg-surface-alt hover:border-brand/50 hover:bg-brand/5'
          }
        `}>
        <input
          type='file'
          className='hidden'
          accept='image/*'
          onChange={onFileSelect}
        />

        <div className='bg-brand/10 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform'>
          <Upload className='w-8 h-8 text-brand' />
        </div>

        <div className='text-center'>
          <p className='text-lg font-semibold text-text-primary'>
            Click to upload or drag & drop
          </p>
          <p className='text-sm text-text-secondary mt-1'>
            JPG, PNG or WEBP (Max 10MB)
          </p>
        </div>

        <div className='mt-8 flex items-center gap-2 text-xs font-medium text-text-secondary bg-surface dark:bg-surface-alt px-3 py-1.5 rounded-full border border-border shadow-sm'>
          <FileText className='w-3.5 h-3.5' />
          Supports multiple documents
        </div>
      </label>
    </div>
  )
}
