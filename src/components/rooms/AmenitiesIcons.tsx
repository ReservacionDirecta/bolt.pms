'use client'
import { AMENITIES } from '../../constants/amenities'

interface AmenitiesIconsProps {
  amenities: string[]
}

export function AmenitiesIcons({ amenities }: AmenitiesIconsProps) {
  return (
    <div className="flex gap-1">
      {amenities?.map(amenityId => {
        const amenity = AMENITIES.find(a => a.id === amenityId)
        if (amenity) {
          const Icon = amenity.icon
          return (
            <div key={amenityId} title={amenity.label}>
              <Icon className="text-gray-500" />
            </div>
          )
        }
        return null
      })}
    </div>
  )
} 