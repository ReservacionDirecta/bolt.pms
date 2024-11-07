'use client'
import { Checkbox } from '@nextui-org/react'
import { AMENITIES } from '../../constants/amenities'

interface AmenitiesListProps {
  selectedAmenities: string[]
  onToggle: (amenityId: string) => void
}

export function AmenitiesList({ selectedAmenities, onToggle }: AmenitiesListProps) {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-3">Amenities</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {AMENITIES.map((amenity) => {
          const Icon = amenity.icon
          return (
            <div 
              key={amenity.id}
              className="flex items-center gap-2"
            >
              <Checkbox
                isSelected={selectedAmenities.includes(amenity.id)}
                onValueChange={() => onToggle(amenity.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="text-xl" />
                  <span>{amenity.label}</span>
                </div>
              </Checkbox>
            </div>
          )
        })}
      </div>
    </div>
  )
} 