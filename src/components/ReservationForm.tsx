'use client'

import { useState, useEffect } from 'react'
import { Input, Button, Select, SelectItem } from '@nextui-org/react'
import { supabase } from '../lib/supabase'

interface ReservationFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

interface Guest {
  id: number
  name: string
}

interface Room {
  id: number
  number: string
  status: string
}

export function ReservationForm({ initialData, onSubmit, onCancel }: ReservationFormProps) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [formData, setFormData] = useState({
    guest_id: initialData?.guest_id || '',
    room_id: initialData?.room_id || '',
    check_in: initialData?.check_in?.split('T')[0] || '',
    check_out: initialData?.check_out?.split('T')[0] || '',
    status: initialData?.status || 'pending',
    payment_status: initialData?.payment_status || 'pending',
    total_amount: initialData?.total_amount || ''
  })

  useEffect(() => {
    fetchGuests()
    fetchRooms()
  }, [])

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('id, name')
        .order('name')

      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error fetching guests:', error)
    }
  }

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, number, status')
        .eq('status', 'available')
        .order('number')

      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Huésped"
        value={formData.guest_id}
        onChange={(e) => handleChange('guest_id', e.target.value)}
        required
      >
        {guests.map((guest) => (
          <SelectItem key={guest.id} value={guest.id}>
            {guest.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Habitación"
        value={formData.room_id}
        onChange={(e) => handleChange('room_id', e.target.value)}
        required
      >
        {rooms.map((room) => (
          <SelectItem key={room.id} value={room.id}>
            {room.number}
          </SelectItem>
        ))}
      </Select>

      <Input
        type="date"
        label="Check-in"
        value={formData.check_in}
        onChange={(e) => handleChange('check_in', e.target.value)}
        required
      />

      <Input
        type="date"
        label="Check-out"
        value={formData.check_out}
        onChange={(e) => handleChange('check_out', e.target.value)}
        required
      />

      <Select
        label="Estado"
        value={formData.status}
        onChange={(e) => handleChange('status', e.target.value)}
        required
      >
        <SelectItem value="pending">Pendiente</SelectItem>
        <SelectItem value="active">Activa</SelectItem>
        <SelectItem value="completed">Completada</SelectItem>
        <SelectItem value="cancelled">Cancelada</SelectItem>
      </Select>

      <Select
        label="Estado de Pago"
        value={formData.payment_status}
        onChange={(e) => handleChange('payment_status', e.target.value)}
        required
      >
        <SelectItem value="pending">Pendiente</SelectItem>
        <SelectItem value="partial">Parcial</SelectItem>
        <SelectItem value="paid">Pagado</SelectItem>
      </Select>

      <Input
        type="number"
        label="Monto Total"
        value={formData.total_amount}
        onChange={(e) => handleChange('total_amount', e.target.value)}
        required
      />

      <div className="flex justify-end gap-2">
        <Button color="danger" variant="light" onPress={onCancel}>
          Cancelar
        </Button>
        <Button color="primary" type="submit">
          {initialData ? 'Actualizar' : 'Crear'} Reservación
        </Button>
      </div>
    </form>
  )
} 