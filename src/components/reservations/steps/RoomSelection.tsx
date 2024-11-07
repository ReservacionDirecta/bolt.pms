'use client'
import { useEffect, useState } from 'react'
import { Card, Radio, RadioGroup } from '@nextui-org/react'
import { supabase } from '../../../lib/supabase/client'
import type { Room } from '../../../types'

interface RoomSelectionProps {
  checkIn: string
  checkOut: string
  selectedRoomId?: string
  onSelect: (room: Room) => void
}

export function RoomSelection({ checkIn, checkOut, selectedRoomId, onSelect }: RoomSelectionProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailableRooms()
  }, [checkIn, checkOut])

  const fetchAvailableRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available')

      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoomSelect = (roomId: string) => {
    const selectedRoom = rooms.find(room => room.id === roomId)
    if (selectedRoom) {
      onSelect(selectedRoom)
    }
  }

  if (loading) return <div>Loading available rooms...</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select Room</h2>
        <p className="text-gray-500">Choose from available rooms</p>
      </div>

      <RadioGroup
        value={selectedRoomId}
        onValueChange={handleRoomSelect}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <Card key={room.id} className="p-4">
              <Radio value={room.id}>
                <div className="ml-2">
                  <h3 className="font-semibold">Room {room.room_number}</h3>
                  <p className="text-sm text-gray-500">{room.type}</p>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm">
                      Rate Type: {room.rate_type === 'room' ? 'Per Room' : 'Per Person'}
                    </p>
                    {room.rate_type === 'room' ? (
                      <p className="text-sm font-medium">
                        Rate: ${room.rate}/night
                      </p>
                    ) : (
                      <div className="text-sm">
                        <p className="font-medium">Rates per person:</p>
                        {room.rates_per_person?.map((rate, index) => (
                          <p key={index}>
                            {index + 1} {index + 1 === 1 ? 'person' : 'people'}: ${rate}/night
                          </p>
                        ))}
                      </div>
                    )}
                    <p className="text-sm">
                      Max Occupancy: {room.max_occupancy} people
                    </p>
                  </div>
                </div>
              </Radio>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
} 