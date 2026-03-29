import { useState } from 'react'
import CameraCapture from '../components/scanner/CameraCapture'
import FileUpload from '../components/scanner/FileUpload'
import { Camera, Upload } from 'lucide-react'

export default function ScannerPage() {
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null)

  return (
    <div className='flex flex-col gap-8 max-w-4xl mx-auto'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-text-primary'>Scan Document</h1>
        <p className='text-text-secondary'>
          Capture or upload a document to begin extraction
        </p>
      </div>

      <div className='bg-surface dark:bg-surface-alt p-1 rounded-xl flex gap-1 self-start border border-border shadow-sm'>
        <button
          onClick={() => setMode('camera')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'camera'
              ? 'bg-brand text-white shadow-md'
              : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
          }`}>
          <Camera className='w-4 h-4' />
          Camera
        </button>
        <button
          onClick={() => setMode('upload')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'upload'
              ? 'bg-brand text-white shadow-md'
              : 'text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
          }`}>
          <Upload className='w-4 h-4' />
          Upload
        </button>
      </div>

      <div className='bg-surface dark:bg-surface-alt rounded-2xl border border-border overflow-hidden min-h-[500px] flex items-center justify-center shadow-sm relative'>
        {mode === 'camera' ? (
          <CameraCapture />
        ) : mode === 'upload' ? (
          <FileUpload />
        ) : (
          <div className='text-center flex flex-col items-center gap-4 p-8 animate-in fade-in zoom-in duration-300'>
            <div className='w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center'>
              <Camera className='w-8 h-8 text-brand' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-text-primary'>
                Ready to scan?
              </h3>
              <p className='text-text-secondary max-w-[250px]'>
                Choose an option above to start capturing or uploading documents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
