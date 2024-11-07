'use client'

import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Badge,
  Card,
  CardBody
} from "@nextui-org/react"
import { PlusIcon } from '@heroicons/react/24/outline'
import { GlobalSearch } from "@/components/GlobalSearch"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function ReservationsPage() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters)
  }

  const reservations = [
    {
      id: "1",
      guest: "Juan Pérez",
      room: "101",
      checkIn: "2024-02-10",
      checkOut: "2024-02-15",
      status: "confirmada",
      payment: "pagado",
      total: "$750"
    },
    // ... más reservaciones
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>
          <p className="text-gray-600">Gestiona las reservas del hotel</p>
        </div>
        <Button 
          color="primary" 
          startContent={<PlusIcon className="w-5 h-5" />}
        >
          Nueva Reserva
        </Button>
      </div>

      {/* Search Filters */}
      <div className="mb-6">
        <GlobalSearch 
          onSearch={handleSearch} 
          variant={isMobile ? 'compact' : 'full'} 
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Bookings"
          value="125"
          icon="📊"
        />
        <StatCard
          title="Today's Check-ins"
          value="12"
          icon="📥"
        />
        <StatCard
          title="Pending"
          value="5"
          icon="⏳"
        />
        <StatCard
          title="Available Rooms"
          value="8"
          icon="🏠"
        />
      </div>

      {/* Reservations List/Table */}
      <Card>
        <CardBody>
          {/* Mobile View */}
          <div className="block md:hidden space-y-4">
            {reservations.map((reservation) => (
              <div 
                key={reservation.id}
                className="border-b border-gray-200 last:border-0 pb-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{reservation.guest}</h3>
                    <p className="text-sm text-gray-600">Room {reservation.room}</p>
                  </div>
                  <Badge color={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                  <div>
                    <p>Check-in:</p>
                    <p className="font-medium">{reservation.checkIn}</p>
                  </div>
                  <div>
                    <p>Check-out:</p>
                    <p className="font-medium">{reservation.checkOut}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-lg">{reservation.total}</span>
                  <div className="flex gap-2">
                    <Button size="sm" color="primary">Edit</Button>
                    <Button size="sm" color="danger">Cancel</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
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
                      <Badge color={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color={getPaymentColor(reservation.payment)}>
                        {reservation.payment}
                      </Badge>
                    </TableCell>
                    <TableCell>{reservation.total}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" color="primary">Edit</Button>
                        <Button size="sm" color="danger">Cancel</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-xl font-bold mt-1">{value}</p>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardBody>
    </Card>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmada': return 'success'
    case 'pendiente': return 'warning'
    case 'cancelada': return 'danger'
    default: return 'default'
  }
}

function getPaymentColor(payment: string) {
  switch (payment) {
    case 'pagado': return 'success'
    case 'pendiente': return 'warning'
    case 'reembolsado': return 'danger'
    default: return 'default'
  }
} 