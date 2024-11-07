import { useState } from 'react'
import Image from 'next/image'

interface ReceiptViewerProps {
  url: string
  onError?: () => void
}

export function ReceiptViewer({ url, onError }: ReceiptViewerProps) {
  const [error, setError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!url) return null

  const fileExtension = url.split('.').pop()?.toLowerCase()
  const isPDF = fileExtension === 'pdf'

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Error al cargar el archivo</p>
      </div>
    )
  }

  if (isPDF) {
    return (
      <div className="border rounded-lg p-4">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg 
            className="w-6 h-6 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
          Ver PDF
        </a>
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        className={`relative ${isExpanded ? 'fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center' : 'w-full h-48'}`}
        onClick={() => isExpanded && setIsExpanded(false)}
      >
        <div className={`relative ${isExpanded ? 'max-w-4xl max-h-[90vh]' : 'w-full h-full'}`}>
          <Image
            src={url}
            alt="Recibo de pago"
            fill
            style={{ objectFit: 'contain' }}
            className={`rounded-lg ${isExpanded ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onError={() => {
              setError(true)
              onError?.()
            }}
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          />
        </div>
      </div>
    </div>
  )
} 