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
  Input,
  useDisclosure,
  Tooltip
} from '@nextui-org/react'
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa'
import { GuestModal } from './components/GuestModal'

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  document_type: 'dni' | 'passport' | 'other'
  document_number: string
  nationality: string
  address?: string
  notes?: string
  total_stays: number
  last_stay?: string
}

export default function GuestsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Datos de ejemplo
  const guests: Guest[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+52 123 456 7890',
      document_type: 'dni',
      document_number: '12345678',
      nationality: 'México',
      address: 'Calle Principal 123',
      total_stays: 3,
      last_stay: '2024-02-15'
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      phone: '+52 987 654 3210',
      document_type: 'passport',
      document_number: 'AB123456',
      nationality: 'España',
      total_stays: 1,
      last_stay: '2024-01-20'
    }
  ]

  const handleEdit = (guest: Guest) => {
    setSelectedGuest(guest)
    onOpen()
  }

  const handleDelete = (guestId: string) => {
    console.log('Eliminar huésped:', guestId)
  }

  const handleSave = (guestData: Partial<Guest>) => {
    console.log('Guardar huésped:', guestData)
    onClose()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Huéspedes</h1>
          <p className="text-gray-600">Gestiona los huéspedes del hotel</p>
        </div>
        <Button 
          color="primary"
          onPress={() => {
            setSelectedGuest(null)
            onOpen()
          }}
          startContent={<FaPlus />}
        >
          Nuevo Huésped
        </Button>
      </div>

      <div className="flex justify-end mb-4">
        <Input
          className="w-64"
          placeholder="Buscar huéspedes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaSearch />}
        />
      </div>

      <Table aria-label="Tabla de huéspedes">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>TELÉFONO</TableColumn>
          <TableColumn>DOCUMENTO</TableColumn>
          <TableColumn>ÚLTIMA ESTANCIA</TableColumn>
          <TableColumn>TOTAL ESTANCIAS</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.document_type.toUpperCase()} - {guest.document_number}</TableCell>
              <TableCell>{guest.last_stay || 'N/A'}</TableCell>
              <TableCell>{guest.total_stays}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="Editar">
                    <Button 
                      isIconOnly
                      color="primary"
                      variant="light"
                      onPress={() => handleEdit(guest)}
                    >
                      <FaEdit />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Eliminar" color="danger">
                    <Button 
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => handleDelete(guest.id)}
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

      <GuestModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSave}
        guest={selectedGuest}
      />
    </div>
  )
} 