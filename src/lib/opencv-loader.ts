let cvInstance: any = null

export async function loadOpenCV(): Promise<any> {
  if (cvInstance) return cvInstance

  // Handle Web Worker environment
  if (typeof importScripts === 'function') {
    return new Promise((resolve) => {
      // @ts-ignore
      importScripts('/opencv.js')
      // @ts-ignore
      const checkCV = () => {
        if (self.cv && self.cv.Mat) {
          cvInstance = self.cv
          resolve(cvInstance)
        } else {
          setTimeout(checkCV, 50)
        }
      }
      checkCV()
    })
  }

  return new Promise((resolve, reject) => {
    if ((window as any).cv && (window as any).cv.then) {
      ;(window as any).cv.then((cv: any) => {
        cvInstance = cv
        resolve(cv)
      })
      return
    }

    const script = document.createElement('script')
    script.src = '/opencv.js'
    script.async = true
    script.onload = () => {
      // Some versions of opencv.js use a promise, some don't
      const checkCV = () => {
        if ((window as any).cv instanceof Promise) {
          ;(window as any).cv.then((cv: any) => {
            cvInstance = cv
            resolve(cv)
          })
        } else if ((window as any).cv && (window as any).cv.Mat) {
          cvInstance = (window as any).cv
          resolve(cvInstance)
        } else {
          setTimeout(checkCV, 100)
        }
      }
      checkCV()
    }
    script.onerror = () => reject(new Error('Failed to load OpenCV.js'))
    document.body.appendChild(script)
  })
}
