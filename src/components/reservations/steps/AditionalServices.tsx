'use client'
import { Checkbox, Card } from '@nextui-org/react'
import type { AdditionalService } from '../../../types'

const AVAILABLE_SERVICES: AdditionalService[] = [
  { id: 'breakfast', name: 'Breakfast', price: 15 },
  { id: 'parking', name: 'Parking', price: 10 },
  { id: 'airport_shuttle', name: 'Airport Shuttle', price: 25 },
  { id: 'late_checkout', name: 'Late Checkout', price: 30 },
  { id: 'spa_access', name: 'Spa Access', price: 20 },
  { id: 'minibar', name: 'Minibar Package', price: 40 }
]

interface AdditionalServicesProps {
  services: AdditionalService[]
  onUpdate: (services: AdditionalService[]) => void
}

export function AdditionalServices({ services, onUpdate }: AdditionalServicesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Additional Services</h2>
        <p className="text-gray-500">Enhance your stay with our additional services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_SERVICES.map((service) => (
          <Card key={service.id} className="p-4">
            <Checkbox
              isSelected={services.some(s => s.id === service.id)}
              onValueChange={(isSelected) => {
                const updatedServices = isSelected
                  ? [...services, service]
                  : services.filter(s => s.id !== service.id)
                onUpdate(updatedServices)
              }}
            >
              <div className="ml-2">
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-500">${service.price} per night</p>
              </div>
            </Checkbox>
          </Card>
        ))}
      </div>
    </div>
  )
}
