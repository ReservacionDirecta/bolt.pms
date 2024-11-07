'use client'

import { useState } from 'react'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Button,
  Chip,
  useDisclosure,
  Tooltip
} from '@nextui-org/react'
import { FaEdit, FaTrash, FaPlus, FaCheckCircle, FaSignOutAlt, FaEye } from 'react-icons/fa'
import { GlobalSearch } from '@/components/GlobalSearch'
import { StatCard } from '@/components/StatCard'
import { ReservationModal } from './components/ReservationModal'

interface Reservation {
  id: string
  guest: string
  room: string
  checkIn: string
  checkOut: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  payment: 'pending' | 'paid' | 'refunded'
  total: number
  notes?: string
}

const STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'primary',
  checked_in: 'success',
  checked_out: 'default',
  cancelled: 'danger'
} as const

const PAYMENT_COLORS = {
  pending: 'warning',
  paid: 'success',
  refunded: 'default'
} as const

export default function ReservationsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const reservations: Reservation[] = [
    {
      id: '1',
      guest: 'Juan Pérez',
      room: '101',
      checkIn: '2024-02-20',
      checkOut: '2024-02-25',
      status: 'confirmed',
      payment: 'paid',
      total: 1500,
      notes: 'Solicita late check-out'
    },
    {
      id: '2',
      guest: 'María García',
      room: '102',
      checkIn: '2024-02-22',
      checkOut: '2024-02-24',
      status: 'pending',
      payment: 'pending',
      total: 1000
    }
  ]

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    onOpen()
  }

  const handleDelete = (reservationId: string) => {
    console.log('Eliminar reserva:', reservationId)
  }

  const handleCheckIn = (reservationId: string) => {
    console.log('Check-in reserva:', reservationId)
  }

  const handleCheckOut = (reservationId: string) => {
    console.log('Check-out reserva:', reservationId)
  }

  const handleSearch = (filters: any) => {
    console.log('Filtros de búsqueda:', filters)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reservas</h1>
          <p className="text-gray-600">Gestiona las reservas del hotel</p>
        </div>
        <Button 
          color="primary"
          onPress={() => {
            setSelectedReservation(null)
            onOpen()
          }}
          startContent={<FaPlus />}
        >
          Nueva Reserva
        </Button>
      </div>

      <div className="mb-6">
        <GlobalSearch 
          onSearch={handleSearch}
          variant="full"
          className="max-w-xs md:max-w-2xl"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Reservas"
          value="125"
          icon="📊"
        />
        <StatCard
          title="Check-ins Hoy"
          value="12"
          icon="📥"
        />
        <StatCard
          title="Pendientes"
          value="5"
          icon="⏳"
        />
        <StatCard
          title="Habitaciones Disponibles"
          value="8"
          icon="🏠"
        />
      </div>

      <Table aria-label="Tabla de reservas">
        <TableHeader>
          <TableColumn>HUÉSPED</TableColumn>
          <TableColumn>HABITACIÓN</TableColumn>
          <TableColumn>ENTRADA</TableColumn>
          <TableColumn>SALIDA</TableColumn>
          <TableColumn>ESTADO</TableColumn>
          <TableColumn>PAGO</TableColumn>
          <TableColumn>TOTAL</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.guest}</TableCell>
              <TableCell>{reservation.room}</TableCell>
              <TableCell>{reservation.checkIn}</TableCell>
              <TableCell>{reservation.checkOut}</TableCell>
              <TableCell>
                <Chip
                  color={STATUS_COLORS[reservation.status]}
                  variant="flat"
                >
                  {reservation.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip
                  color={PAYMENT_COLORS[reservation.payment]}
                  variant="flat"
                >
                  {reservation.payment}
                </Chip>
              </TableCell>
              <TableCell>${reservation.total}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="Check-in">
                    <Button
                      isIconOnly
                      size="sm"
                      color="success"
                      variant="light"
                      onPress={() => handleCheckIn(reservation.id)}
                      isDisabled={reservation.status !== 'confirmed'}
                    >
                      <FaCheckCircle />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Check-out">
                    <Button
                      isIconOnly
                      size="sm"
                      color="warning"
                      variant="light"
                      onPress={() => handleCheckOut(reservation.id)}
                      isDisabled={reservation.status !== 'checked_in'}
                    >
                      <FaSignOutAlt />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Editar">
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      variant="light"
                      onPress={() => handleEdit(reservation)}
                    >
                      <FaEdit />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Eliminar" color="danger">
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => handleDelete(reservation.id)}
                    >
                      <FaTrash />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ReservationModal
        isOpen={isOpen}
        onClose={onClose}
        reservation={selectedReservation}
      />
    </div>
  )
} 