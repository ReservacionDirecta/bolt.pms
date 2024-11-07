'use client'
import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Radio, RadioGroup } from '@nextui-org/react'
import { supabase } from '../../lib/supabase/client'
import { AmenitiesList } from './AmenitiesList'
import { PhotoUpload } from './PhotoUpload'
import type { Room } from '../../types'

interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  room?: Room
  onSuccess: () => void
}

export function RoomModal({ isOpen, onClose, room, onSuccess }: RoomModalProps) {
  const [formData, setFormData] = useState({
    room_number: '',
    type: '',
    status: 'available',
    rate: '',
    rate_type: 'room' as 'room' | 'person',
    max_occupancy: '1',
    rates_per_person: [] as Array<{ occupancy: number; rate: string }>,
    description: '',
    amenities: [] as string[],
    photos: [] as string[]
  })

  useEffect(() => {
    if (isOpen && room) {
      const ratesPerPerson = Array.from(
        { length: parseInt(room.max_occupancy.toString()) }, 
        (_, i) => ({
          occupancy: i + 1,
          rate: room.rates_per_person?.[i]?.toString() || ''
        })
      )

      setFormData({
        room_number: room.room_number || '',
        type: room.type || '',
        status: room.status || 'available',
        rate: room.rate?.toString() || '',
        rate_type: room.rate_type || 'room',
        max_occupancy: room.max_occupancy?.toString() || '1',
        rates_per_person: ratesPerPerson,
        description: room.description || '',
        amenities: room.amenities || [],
        photos: room.photos || []
      })
    } else if (isOpen) {
      // Reset form for new room
      setFormData({
        room_number: '',
        type: '',
        status: 'available',
        rate: '',
        rate_type: 'room',
        max_occupancy: '1',
        rates_per_person: [{ occupancy: 1, rate: '' }],
        description: '',
        amenities: [],
        photos: []
      })
    }
  }, [isOpen, room])

  const handleSubmit = async () => {
    try {
      // Validar datos requeridos
      if (!formData.room_number.trim()) {
        alert('Room number is required')
        return
      }

      // Preparar los datos limpiando cualquier referencia circular
      const cleanRatesPerPerson = formData.rate_type === 'person' 
        ? formData.rates_per_person.map(rate => ({
            occupancy: rate.occupancy,
            rate: parseFloat(rate.rate) || 0
          }))
        : []

      // Crear objeto limpio para enviar
      const dataToSubmit = {
        room_number: formData.room_number.trim(),
        type: formData.type.trim(),
        status: formData.status,
        rate_type: formData.rate_type,
        max_occupancy: parseInt(formData.max_occupancy),
        // Si es tarifa por habitación, usar rate, si no, 0
        rate: formData.rate_type === 'room' ? parseFloat(formData.rate) || 0 : 0,
        // Convertir el array de objetos a array simple de números
        rates_per_person: cleanRatesPerPerson.map(r => r.rate),
        description: formData.description?.trim() || '',
        amenities: formData.amenities,
        photos: formData.photos
      }

      console.log('Clean data to submit:', dataToSubmit)

      if (room?.id) {
        const { error } = await supabase
          .from('rooms')
          .update(dataToSubmit)
          .eq('id', room.id)

        if (error) {
          console.error('Update error:', error)
          throw error
        }
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert([dataToSubmit])

        if (error) {
          console.error('Insert error:', error)
          throw error
        }
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving room:', error)
      if (error instanceof Error) {
        alert(`Error saving room: ${error.message}`)
      } else {
        alert('An unexpected error occurred while saving the room')
      }
    }
  }

  // Manejar el cambio de tipo de tarifa
  const handleRateTypeChange = (value: string) => {
    const newRateType = value as 'room' | 'person'
    const maxOcc = parseInt(formData.max_occupancy)

    setFormData(prev => ({
      ...prev,
      rate_type: newRateType,
      // Reiniciar las tarifas según el tipo seleccionado
      rate: newRateType === 'room' ? prev.rate : '',
      rates_per_person: newRateType === 'person' 
        ? Array.from({ length: maxOcc }, (_, i) => ({
            occupancy: i + 1,
            rate: ''
          }))
        : []
    }))
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h3 className="text-lg font-bold">
                {room ? `Edit Room ${room.room_number}` : 'New Room'}
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Room Number"
                  value={formData.room_number}
                  onChange={(e) => setFormData(prev => ({...prev, room_number: e.target.value}))}
                />
                <Input
                  label="Type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({...prev, type: e.target.value}))}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rate Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rate_type"
                        value="room"
                        checked={formData.rate_type === 'room'}
                        onChange={(e) => handleRateTypeChange(e.target.value)}
                        className="form-radio"
                      />
                      <span>Per Room</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rate_type"
                        value="person"
                        checked={formData.rate_type === 'person'}
                        onChange={(e) => handleRateTypeChange(e.target.value)}
                        className="form-radio"
                      />
                      <span>Per Person</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="Max Occupancy"
                  type="number"
                  min="1"
                  value={formData.max_occupancy}
                  onChange={(e) => {
                    const value = e.target.value
                    const maxOcc = parseInt(value) || 1
                    setFormData(prev => ({
                      ...prev,
                      max_occupancy: value,
                      rates_per_person: prev.rate_type === 'person'
                        ? Array.from({ length: maxOcc }, (_, i) => ({
                            occupancy: i + 1,
                            rate: prev.rates_per_person[i]?.rate || ''
                          }))
                        : prev.rates_per_person
                    }))
                  }}
                />

                {formData.rate_type === 'room' ? (
                  <Input
                    label="Room Rate"
                    type="number"
                    min="0"
                    value={formData.rate}
                    onChange={(e) => setFormData(prev => ({...prev, rate: e.target.value}))}
                  />
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Rates per Person</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.rates_per_person.map((rate) => (
                        <Input
                          key={rate.occupancy}
                          label={`Rate for ${rate.occupancy} ${rate.occupancy === 1 ? 'person' : 'people'}`}
                          type="number"
                          min="0"
                          value={rate.rate}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              rates_per_person: prev.rates_per_person.map(r =>
                                r.occupancy === rate.occupancy
                                  ? { ...r, rate: e.target.value }
                                  : r
                              )
                            }))
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Input
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Photos</p>
                  <PhotoUpload
                    photos={formData.photos}
                    onChange={(photos) => setFormData(prev => ({...prev, photos}))}
                    roomId={room?.id}
                  />
                </div>

                <AmenitiesList
                  selectedAmenities={formData.amenities}
                  onToggle={(amenityId) => {
                    setFormData(prev => ({
                      ...prev,
                      amenities: prev.amenities.includes(amenityId)
                        ? prev.amenities.filter(id => id !== amenityId)
                        : [...prev.amenities, amenityId]
                    }))
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
} 