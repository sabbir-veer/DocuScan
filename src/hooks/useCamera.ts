import { useState, useRef, useCallback } from 'react'

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isActiveRef = useRef(false)

  const startCamera = useCallback(async () => {
    isActiveRef.current = true
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })

      // If we were stopped while waiting for the stream, stop it immediately
      if (!isActiveRef.current) {
        mediaStream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = mediaStream
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch (err) {
      if (isActiveRef.current) {
        console.error('Error accessing camera:', err)
        setError('Could not access camera. Please check permissions.')
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    isActiveRef.current = false
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  const captureFrame = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current) return resolve(null)

      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(null)

      ctx.drawImage(videoRef.current, 0, 0)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.92)
    })
  }, [])

  return {
    videoRef,
    startCamera,
    stopCamera,
    captureFrame,
    isReady: !!stream,
    error
  }
}
