import { useEffect, useCallback } from 'react'
import { useCamera } from '../../hooks/useCamera'
import { Camera, RefreshCw, AlertCircle } from 'lucide-react'
import { useScanStore } from '../../store/scanStore'
import { useNavigate } from 'react-router-dom'

export default function CameraCapture() {
  const { videoRef, startCamera, stopCamera, captureFrame, isReady, error } =
    useCamera()
  const addToQueue = useScanStore((state) => state.addToQueue)
  const navigate = useNavigate()

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  const handleCapture = useCallback(async () => {
    const blob = await captureFrame()
    if (blob) {
      const id = addToQueue(blob)
      navigate(`/review/${id}`)
    }
  }, [captureFrame, addToQueue, navigate])

  if (error) {
    return (
      <div className='flex flex-col items-center gap-4 text-center p-8'>
        <div className='bg-red-50 dark:bg-red-900/10 p-4 rounded-full'>
          <AlertCircle className='w-8 h-8 text-red-500' />
        </div>
        <div>
          <h3 className='text-lg font-semibold text-text-primary'>
            Camera Error
          </h3>
          <p className='text-text-secondary max-w-xs'>{error}</p>
        </div>
        <button
          onClick={startCamera}
          className='bg-brand text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-hover'>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className='relative w-full h-full min-h-[500px] bg-black'>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className='w-full h-full object-cover'
      />

      {/* Overlay Frame */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none p-8 md:p-12'>
        <div className='w-full h-full max-w-lg border-2 border-white/50 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]'>
          {/* Corner Markers */}
          <div className='absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg' />
          <div className='absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg' />
          <div className='absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg' />
          <div className='absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg' />
        </div>
      </div>

      {/* Controls */}
      <div className='absolute bottom-12 left-0 w-full flex justify-center px-4'>
        <div className='bg-white/10 backdrop-blur-md rounded-full p-2 flex items-center gap-4 border border-white/20 shadow-2xl'>
          <button
            onClick={handleCapture}
            disabled={!isReady}
            className='group bg-brand hover:bg-brand-hover p-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
            <div className='bg-white rounded-full p-0.5 group-active:scale-95 transition-transform'>
              <Camera className='w-8 h-8 text-brand' />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
