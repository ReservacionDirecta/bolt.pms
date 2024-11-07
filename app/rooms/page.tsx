'use client'

import { useState } from 'react'
import { 
  Card, 
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  useDisclosure
} from '@nextui-org/react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { RoomModal } from './components/RoomModal'

interface Room {
  id: string
  number: string
  type: 'individual' | 'double' | 'suite' | 'family'
  capacity: number
  status: 'available' | 'occupied' | 'maintenance'
  price: number
  description?: string
}

const ROOM_TYPES = {
  individual: 'Individual',
  double: 'Doble',
  suite: 'Suite',
  family: 'Familiar'
}

const STATUS_COLORS = {
  available: 'success',
  occupied: 'danger',
  maintenance: 'warning'
} as const

export default function RoomsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  // Datos de ejemplo
  const rooms: Room[] = [
    {
      id: '1',
      number: '101',
      type: 'individual',
      capacity: 1,
      status: 'available',
      price: 1000,
      description: 'Habitación individual con vista a la ciudad'
    },
    {
      id: '2',
      number: '102',
      type: 'double',
      capacity: 2,
      status: 'occupied',
      price: 1500,
      description: 'Habitación doble con balcón'
    }
  ]

  const handleEdit = (room: Room) => {
    setSelectedRoom(room)
    onOpen()
  }

  const handleDelete = (roomId: string) => {
    console.log('Eliminar habitación:', roomId)
  }

  const handleSave = (roomData: Partial<Room>) => {
    console.log('Guardar habitación:', roomData)
    onClose()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Habitaciones</h1>
          <p className="text-gray-600">Gestiona las habitaciones del hotel</p>
        </div>
        <div>
          <Button 
            isIconOnly 
            color="primary"
            auto
            onClick={onOpen}
          >
            <FaPlus className="text-xl" />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>Número</TableColumn>
          <TableColumn>Tipo</TableColumn>
          <TableColumn>Capacidad</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Precio</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.number}</TableCell>
              <TableCell>{ROOM_TYPES[room.type]}</TableCell>
              <TableCell>{room.capacity}</TableCell>
              <TableCell>
                <Chip 
                  color={STATUS_COLORS[room.status]}
                  variant="flat"
                >
                  {room.status}
                </Chip>
              </TableCell>
              <TableCell>{room.price}</TableCell>
              <TableCell>
                <Tooltip content="Editar">
                  <Button 
                    isIconOnly 
                    color="primary"
                    auto
                    onClick={() => handleEdit(room)}
                  >
                    <FaEdit className="text-xl" />
                  </Button>
                </Tooltip>
                <Tooltip content="Eliminar">
                  <Button 
                    isIconOnly 
                    color="error"
                    auto
                    onClick={() => handleDelete(room.id)}
                  >
                    <FaTrash className="text-xl" />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RoomModal 
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        room={selectedRoom}
      />
    </div>
  )
} 