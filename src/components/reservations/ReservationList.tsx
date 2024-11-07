'use client'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Card, Chip, Button, Input, Select, SelectItem } from '@nextui-org/react'
import { supabase } from '../../lib/supabase/client'
import type { Reservation } from '../../types'

export function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchReservations()
  }, [search, statusFilter])

  const fetchReservations = async () => {
    try {
      let query = supabase
        .from('reservations')
        .select(`
          *,
          room:rooms(*),
          guest:guests(*)
        `)
        .order('check_in', { ascending: true })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      if (search) {
        query = query.or(`
          guest.first_name.ilike.%${search}%,
          guest.last_name.ilike.%${search}%,
          room.room_number.ilike.%${search}%
        `)
      }

      const { data, error } = await query

      if (error) throw error
      setReservations(data || [])
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'checked_in':
        return 'primary'
      case 'checked_out':
        return 'default'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search reservations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-xs"
        >
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="checked_in">Checked In</SelectItem>
          <SelectItem value="checked_out">Checked Out</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </Select>
      </div>

      {loading ? (
        <div>Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <div>No reservations found</div>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {reservation.guest?.first_name} {reservation.guest?.last_name}
                    </h3>
                    <Chip
                      color={getStatusColor(reservation.status)}
                      size="sm"
                    >
                      {reservation.status}
                    </Chip>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>Room: {reservation.room?.room_number}</div>
                    <div>
                      Check-in: {dayjs(reservation.check_in).format('MMM DD, YYYY')}
                    </div>
                    <div>
                      Check-out: {dayjs(reservation.check_out).format('MMM DD, YYYY')}
                    </div>
                    <div>Total Amount: ${reservation.total_amount}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {reservation.status === 'confirmed' && (
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => handleCheckIn(reservation.id)}
                    >
                      Check In
                    </Button>
                  )}
                  {reservation.status === 'checked_in' && (
                    <Button
                      color="secondary"
                      size="sm"
                      onPress={() => handleCheckOut(reservation.id)}
                    >
                      Check Out
                    </Button>
                  )}
                  <Button
                    color="default"
                    size="sm"
                    onPress={() => handleViewDetails(reservation.id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Funciones auxiliares para manejar acciones
const handleCheckIn = async (reservationId: string) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'checked_in' })
      .eq('id', reservationId)

    if (error) throw error
    // Recargar la lista después de actualizar
    window.location.reload()
  } catch (error) {
    console.error('Error during check-in:', error)
    alert('Error during check-in')
  }
}

const handleCheckOut = async (reservationId: string) => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'checked_out' })
      .eq('id', reservationId)

    if (error) throw error
    // Recargar la lista después de actualizar
    window.location.reload()
  } catch (error) {
    console.error('Error during check-out:', error)
    alert('Error during check-out')
  }
}

const handleViewDetails = (reservationId: string) => {
  window.location.href = `/reservations/${reservationId}`
} 