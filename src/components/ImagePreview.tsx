import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@nextui-org/react'
import { FaImage, FaTrash } from 'react-icons/fa'

interface ImagePreviewProps {
  src: string
  index: number
  onRemove: (index: number) => void
}

export function ImagePreview({ src, index, onRemove }: ImagePreviewProps) {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
      {hasError ? (
        <div className="relative w-full h-full">
          <Image
            src="/images/placeholder.jpg"
            alt="Imagen no disponible"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white p-2">
              <FaImage className="text-3xl mx-auto mb-2" />
              <p className="text-xs">Error al cargar imagen</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={`Vista previa ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setHasError(true)}
            unoptimized
          />
        </div>
      )}
      <Button
        isIconOnly
        size="sm"
        color="danger"
        variant="flat"
        className="absolute top-2 right-2 z-10"
        onPress={() => onRemove(index)}
      >
        <FaTrash className="text-sm" />
      </Button>
    </div>
  )
} 