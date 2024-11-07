import { useState, useEffect } from 'react'
import { Card, Button, Input, Spinner } from '@nextui-org/react'
import { supabase } from '../lib/supabase/client'
import { toast } from 'react-hot-toast'

interface RoomType {
  id: string
  name: string
  rate: number
  description: string
}

interface RoomInventory {
  roomTypeId: string
  currentQuantity: number
  newQuantity: number
}

export default function RoomInventorySetup() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [inventory, setInventory] = useState<RoomInventory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchRoomTypes()
  }, [])

  const fetchRoomTypes = async () => {
    try {
      // Obtener tipos de habitación
      const { data: types, error: typesError } = await supabase
        .from('room_types')
        .select('*')
        .order('rate')

      if (typesError) throw typesError

      setRoomTypes(types || [])

      // Obtener inventario actual
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('room_type_id, room_number')

      if (roomsError) throw roomsError

      // Contar habitaciones por tipo
      const currentInventory = types?.map(type => ({
        roomTypeId: type.id,
        currentQuantity: rooms?.filter(room => room.room_type_id === type.id).length || 0,
        newQuantity: 0
      })) || []

      setInventory(currentInventory)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching data:', err)
      toast.error('Error al cargar los datos')
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (roomTypeId: string, value: number) => {
    setInventory(prev => prev.map(item => 
      item.roomTypeId === roomTypeId 
        ? { ...item, newQuantity: value } 
        : item
    ))
  }

  const handleUpdateInventory = async () => {
    try {
      setIsSaving(true)

      for (const item of inventory) {
        if (item.newQuantity === 0) continue

        const roomType = roomTypes.find(rt => rt.id === item.roomTypeId)
        if (!roomType) continue

        // Generar nuevos números de habitación
        const newRooms = Array.from({ length: item.newQuantity }, (_, index) => ({
          room_type_id: item.roomTypeId,
          room_number: `${roomType.name.charAt(0)}${String(item.currentQuantity + index + 1).padStart(2, '0')}`,
          status: 'available',
          rate_type: 'per_night',
          rate: 0,
          amenities: []
        }))

        const { error } = await supabase
          .from('rooms')
          .insert(newRooms)

        if (error) throw error
      }

      toast.success('Inventario actualizado correctamente')
      fetchRoomTypes() // Recargar datos
    } catch (err) {
      console.error('Error updating inventory:', err)
      toast.error('Error al actualizar el inventario')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuración de Inventario</h2>
        <Button
          color="primary"
          onClick={handleUpdateInventory}
          isLoading={isSaving}
          isDisabled={!inventory.some(item => item.newQuantity > 0)}
        >
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roomTypes.map(roomType => {
          const inventoryItem = inventory.find(item => item.roomTypeId === roomType.id)
          
          return (
            <Card key={roomType.id} className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{roomType.name}</h3>
                  <p className="text-sm text-gray-600">{roomType.description}</p>
                  <p className="text-sm font-medium mt-1">
                    Tarifa: {new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN'
                    }).format(roomType.rate)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Habitaciones existentes:</span>
                    <span>{inventoryItem?.currentQuantity || 0}</span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-sm">Agregar:</span>
                    <Input
                      type="number"
                      min="0"
                      value={inventoryItem?.newQuantity || 0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value) && value >= 0) {
                          handleQuantityChange(roomType.id, value)
                        }
                      }}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">
                      Total: {(inventoryItem?.currentQuantity || 0) + (inventoryItem?.newQuantity || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 