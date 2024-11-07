import { useEffect, useState } from 'react'
import { Table, Button, Spinner, Card, Badge } from '@nextui-org/react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { formatAmount } from '@/utils/format'

type Reservation = {
  id: string
  guest_name: string
  room_number: string
  check_in: string
  check_out: string
  total_amount: number
  status: string
}

export default function ReservationList() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true)
        
        const { data, error } = await supabase
          .from('reservations')
          .select(`
            id,
            check_in,
            check_out,
            total_amount,
            status,
            guest_id (
              id,
              first_name,
              last_name
            ),
            room_id (
              id,
              room_number
            )
          `)

        if (error) {
          console.error('Error fetching reservations:', error)
          throw error
        }

        console.log('Datos crudos:', data) // Debug

        const formattedReservations = data?.map(reservation => ({
          id: reservation.id,
          guest_name: reservation.guest_id ? 
            `${reservation.guest_id.first_name} ${reservation.guest_id.last_name}` : 
            'Sin nombre',
          room_number: reservation.room_id?.room_number || 'Sin asignar',
          check_in: reservation.check_in,
          check_out: reservation.check_out,
          total_amount: reservation.total_amount || 0,
          status: reservation.status || 'pending'
        })) || []

        console.log('Reservas formateadas:', formattedReservations) // Debug
        setReservations(formattedReservations)

      } catch (err) {
        console.error('Error completo:', err)
        toast.error('Error al cargar las reservaciones')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'danger'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservaciones</h1>
        <Button 
          color="primary"
          onClick={() => router.push('/reservations/new')}
        >
          Nueva Reserva
        </Button>
      </div>

      {reservations.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-gray-600">No hay reservaciones registradas</p>
        </Card>
      ) : (
        <Table aria-label="Listado de reservaciones">
          <Table.Header>
            <Table.Column>HUÉSPED</Table.Column>
            <Table.Column>HABITACIÓN</Table.Column>
            <Table.Column>CHECK-IN</Table.Column>
            <Table.Column>CHECK-OUT</Table.Column>
            <Table.Column>TOTAL</Table.Column>
            <Table.Column>ESTADO</Table.Column>
            <Table.Column>ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body>
            {reservations.map((reservation) => (
              <Table.Row key={reservation.id}>
                <Table.Cell>{reservation.guest_name}</Table.Cell>
                <Table.Cell>{reservation.room_number}</Table.Cell>
                <Table.Cell>
                  {new Date(reservation.check_in).toLocaleDateString('es-PE')}
                </Table.Cell>
                <Table.Cell>
                  {new Date(reservation.check_out).toLocaleDateString('es-PE')}
                </Table.Cell>
                <Table.Cell>{formatAmount(reservation.total_amount)}</Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    size="sm"
                    onClick={() => router.push(`/reservations/${reservation.id}`)}
                  >
                    Ver detalles
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
} 