'use client'
import { useEffect, useState } from 'react'
import { Button, Input, Card } from '@nextui-org/react'
import { supabase } from '../../lib/supabase/client'
import { RoomModal } from './RoomModal'
import { AmenitiesIcons } from './AmenitiesIcons'
import type { Room } from '../../types'

export function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>()

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number')

      if (error) {
        throw error
      }

      console.log('Fetched rooms:', data) // Debug log
      setRooms(data || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
      alert('Error fetching rooms. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleEdit = (room: Room) => {
    console.log('Editing room:', room) // Debug log
    setSelectedRoom(room)
    setModalOpen(true)
  }

  const formatPrice = (room: Room) => {
    if (room.rate_type === 'room') {
      return `$${room.rate}/night`
    } else {
      const rates = room.rates_per_person || []
      if (rates.length === 0) return 'No rates set'
      
      return (
        <div className="space-y-1">
          {rates.map((rate, index) => (
            <div key={index} className="text-sm">
              {index + 1} {index + 1 === 1 ? 'person' : 'people'}: ${rate}/night
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Input
          className="max-w-xs"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button 
          color="primary" 
          onPress={() => {
            setSelectedRoom(undefined)
            setModalOpen(true)
          }}
        >
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-4">
            <div className="space-y-3">
              {/* Encabezado de la tarjeta */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Room {room.room_number}</h3>
                  <p className="text-sm text-gray-500">{room.type}</p>
                </div>
                <div className="px-2 py-1 rounded text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    room.status === 'available' ? 'bg-green-100 text-green-800' :
                    room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                    room.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {room.status}
                  </span>
                </div>
              </div>

              {/* Información de tarifa */}
              <div className="border-t border-b py-2">
                <div className="text-sm text-gray-500 mb-1">
                  Tipo de Tarifa: {
                    room.rate_type === 'per_night' ? 'Por Noche' :
                    room.rate_type === 'per_hour' ? 'Por Hora' :
                    room.rate_type === 'per_day' ? 'Por Día' : 'N/A'
                  }
                </div>
                <div className="font-medium">
                  ${room.rate.toFixed(2)} MXN
                </div>
                {room.rate_type === 'person' && (
                  <div className="text-sm text-gray-500 mt-1">
                    Max Occupancy: {room.max_occupancy} people
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Amenities</p>
                <AmenitiesIcons amenities={room.amenities || []} />
              </div>

              {/* Photos preview */}
              {room.photos && room.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {room.photos.slice(0, 3).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Room ${room.room_number}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                  {room.photos.length > 3 && (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-sm text-gray-500">+{room.photos.length - 3}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  color="primary"
                  variant="light"
                  onPress={() => handleEdit(room)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <RoomModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedRoom(undefined)
        }}
        room={selectedRoom}
        onSuccess={() => {
          fetchRooms()
          setModalOpen(false)
          setSelectedRoom(undefined)
        }}
      />
    </div>
  )
} 