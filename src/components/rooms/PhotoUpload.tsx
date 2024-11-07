'use client'
import { useState } from 'react'
import { Button, Image } from '@nextui-org/react'
import { supabase } from '../../lib/supabase/client'
import { FaTrash, FaUpload } from 'react-icons/fa'

interface PhotoUploadProps {
  photos: string[]
  onChange: (photos: string[]) => void
  roomId?: string
}

export function PhotoUpload({ photos, onChange, roomId }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const files = e.target.files
      if (!files || files.length === 0) return

      const newPhotos = [...photos]

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 5MB`)
          continue
        }

        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image`)
          continue
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif']
        
        if (!validExtensions.includes(fileExt)) {
          alert(`Invalid file extension. Allowed: ${validExtensions.join(', ')}`)
          continue
        }

        const fileName = `${roomId || 'new'}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        console.log('Uploading file:', fileName)

        const { error: uploadError, data } = await supabase.storage
          .from('room-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          alert(`Error uploading ${file.name}: ${uploadError.message}`)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('room-photos')
          .getPublicUrl(filePath)

        console.log('File uploaded successfully:', publicUrl)
        newPhotos.push(publicUrl)
      }

      onChange(newPhotos)
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error uploading photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async (photoUrl: string) => {
    try {
      const fileName = photoUrl.split('/').pop()
      if (!fileName) {
        console.error('Could not extract filename from URL:', photoUrl)
        return
      }

      console.log('Removing file:', fileName)

      const { error } = await supabase.storage
        .from('room-photos')
        .remove([fileName])

      if (error) {
        console.error('Remove error:', error)
        throw error
      }

      const newPhotos = photos.filter(p => p !== photoUrl)
      onChange(newPhotos)
    } catch (error) {
      console.error('Error removing photo:', error)
      alert('Error removing photo. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          color="primary"
          startContent={<FaUpload />}
          as="label"
          htmlFor="photo-upload"
          isLoading={uploading}
        >
          Upload Photos
        </Button>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <Image
              src={photo}
              alt={`Room photo ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              size="sm"
              color="danger"
              isIconOnly
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onPress={() => handleRemove(photo)}
            >
              <FaTrash />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 