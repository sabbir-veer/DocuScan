/**
 * preprocessing.ts
 *
 * Fast, OpenCV-free image enhancement using the Canvas 2D API.
 * Typical runtime: < 500ms for most invoice/document images.
 *
 * Pipeline:
 *  1. Downscale to max 1500px (preserves OCR quality, cuts CPU cost)
 *  2. Auto-levels (histogram stretch for contrast)
 *  3. Sharpen (3×3 unsharp-mask convolution)
 *  4. Convert to grayscale (reduces file size & helps Tesseract accuracy)
 */

const MAX_DIM = 1500

/** Apply a 3×3 convolution kernel to RGBA ImageData (in-place on a copy). */
function applyKernel(
  src: ImageData,
  kernel: number[],
  weight: number
): ImageData {
  const { width, height, data } = src
  const out = new Uint8ClampedArray(data)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0,
        g = 0,
        b = 0
      let ki = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const k = kernel[ki++]
          r += data[idx] * k
          g += data[idx + 1] * k
          b += data[idx + 2] * k
        }
      }
      const i = (y * width + x) * 4
      out[i] = Math.min(255, Math.max(0, r / weight))
      out[i + 1] = Math.min(255, Math.max(0, g / weight))
      out[i + 2] = Math.min(255, Math.max(0, b / weight))
      out[i + 3] = data[i + 3]
    }
  }
  return new ImageData(out, width, height)
}

/** Stretch the histogram so the darkest pixel → 0 and brightest → 255. */
function autoLevels(imageData: ImageData): ImageData {
  const { data, width, height } = imageData
  let minL = 255,
    maxL = 0

  for (let i = 0; i < data.length; i += 4) {
    // Perceived luminance
    const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    if (l < minL) minL = l
    if (l > maxL) maxL = l
  }

  const range = maxL - minL || 1
  const out = new Uint8ClampedArray(data)
  for (let i = 0; i < out.length; i += 4) {
    out[i] = Math.min(255, ((data[i] - minL) / range) * 255)
    out[i + 1] = Math.min(255, ((data[i + 1] - minL) / range) * 255)
    out[i + 2] = Math.min(255, ((data[i + 2] - minL) / range) * 255)
  }
  return new ImageData(out, width, height)
}

/** Convert to grayscale in-place for document clarity + smaller file size. */
function toGrayscale(imageData: ImageData): ImageData {
  const { data, width, height } = imageData
  const out = new Uint8ClampedArray(data)
  for (let i = 0; i < out.length; i += 4) {
    const gray = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    )
    out[i] = out[i + 1] = out[i + 2] = gray
    out[i + 3] = 255
  }
  return new ImageData(out, width, height)
}

export async function preprocessImage(imageBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const imgUrl = URL.createObjectURL(imageBlob)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(imgUrl)

      // 1. Downscale to MAX_DIM
      const scale = Math.min(MAX_DIM / img.width, MAX_DIM / img.height, 1)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas context unavailable'))

      ctx.drawImage(img, 0, 0, w, h)
      let imageData = ctx.getImageData(0, 0, w, h)

      // 2. Auto-levels (contrast stretch)
      imageData = autoLevels(imageData)

      // 3. Sharpen — unsharp-mask style kernel
      //    [ 0, -1,  0 ]
      //    [-1,  5, -1 ]
      //    [ 0, -1,  0 ]
      imageData = applyKernel(
        imageData,
        [0, -1, 0, -1, 5, -1, 0, -1, 0],
        1 // weight=1 because kernel sums to 1
      )

      // 4. Grayscale (document look + helps Tesseract)
      imageData = toGrayscale(imageData)

      // Write result back and export
      ctx.putImageData(imageData, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to export processed image'))
        },
        'image/jpeg',
        0.92
      )
    }

    img.onerror = () =>
      reject(new Error('Failed to load image for preprocessing'))
    img.src = imgUrl
  })
}
