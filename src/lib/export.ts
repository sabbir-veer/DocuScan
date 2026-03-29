import Papa from 'papaparse'
import { jsPDF } from 'jspdf'

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function exportToPDF(doc: any) {
  const pdf = new jsPDF()
  const margin = 20
  let y = margin

  // Header
  pdf.setFillColor(67, 97, 238) // Brand color
  pdf.rect(0, 0, 210, 40, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DocuScan Report', margin, 25)

  // Meta Info
  pdf.setTextColor(200, 200, 200)
  pdf.setFontSize(10)
  pdf.text(`Document ID: #${doc.id}`, 150, 25)

  y = 55
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.text('Document Metadata', margin, y)
  y += 10

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Type: ${doc.type.toUpperCase()}`, margin, y)
  pdf.text(
    `Date: ${new Date(doc.createdAt).toLocaleDateString()}`,
    margin + 60,
    y
  )
  y += 15

  // Extracted Data
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Extracted Insights', margin, y)
  y += 10

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  Object.entries(doc.extractedData).forEach(([key, value]) => {
    if (y > 270) {
      pdf.addPage()
      y = margin
    }
    const label = key.replace(/_/g, ' ').toUpperCase()
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${label}:`, margin, y)
    pdf.setFont('helvetica', 'normal')

    const valStr =
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    const lines = pdf.splitTextToSize(valStr, 120)
    pdf.text(lines, margin + 40, y)
    y += Math.max(lines.length * 5, 8)
  })

  // Image Section
  if (doc.blob) {
    y += 10
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Document Image', margin, y)
    y += 10

    try {
      const base64 = await blobToBase64(doc.blob)

      // Measure image to calculate proper aspect ratio
      const imgProps = await new Promise<{ w: number; h: number }>(
        (resolve) => {
          const img = new Image()
          img.onload = () => resolve({ w: img.width, h: img.height })
          img.src = base64
        }
      )

      const pdfWidth = 210
      const pdfHeight = 297
      const maxWidth = pdfWidth - margin * 2
      const maxHeight = pdfHeight - margin * 2

      let finalWidth = maxWidth
      let finalHeight = (imgProps.h * finalWidth) / imgProps.w

      // If calculated height exceeds a full page, scale down based on height
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight
        finalWidth = (imgProps.w * finalHeight) / imgProps.h
      }

      // If it doesn't fit on the current page, start a new one
      if (y + finalHeight > pdfHeight - margin) {
        pdf.addPage()
        y = margin
      }

      pdf.addImage(
        base64,
        'JPEG',
        (pdfWidth - finalWidth) / 2,
        y,
        finalWidth,
        finalHeight
      )
    } catch (err) {
      console.error('Failed to add image to PDF:', err)
    }
  }

  pdf.save(`docuscan-${doc.id}.pdf`)
}
