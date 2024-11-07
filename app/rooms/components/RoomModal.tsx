'use client'

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea
} from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const roomSchema = z.object({
  number: z.string().min(1, 'El número es requerido'),
  type: z.enum(['individual', 'double', 'suite', 'family']),
  capacity: z.number().min(1, 'La capacidad debe ser al menos 1'),
  status: z.enum(['available', 'occupied', 'maintenance']),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  description: z.string().optional()
})

type RoomFormData = z.infer<typeof roomSchema>

interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: RoomFormData) => void
  room?: RoomFormData | null
}

export function RoomModal({ isOpen, onClose, onSave, room }: RoomModalProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: room || {
      number: '',
      type: 'individual',
      capacity: 1,
      status: 'available',
      price: 0,
      description: ''
    }
  })

  const onSubmit = (data: RoomFormData) => {
    onSave(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {room ? 'Editar Habitación' : 'Nueva Habitación'}
          </ModalHeader>
          <ModalBody className="gap-4">
            <Controller
              name="number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Número"
                  placeholder="101"
                  errorMessage={errors.number?.message}
                />
              )}
            />
            
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Tipo"
                  errorMessage={errors.type?.message}
                >
                  <SelectItem key="individual">Individual</SelectItem>
                  <SelectItem key="double">Doble</SelectItem>
                  <SelectItem key="suite">Suite</SelectItem>
                  <SelectItem key="family">Familiar</SelectItem>
                </Select>
              )}
            />

            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Capacidad"
                  placeholder="1"
                  errorMessage={errors.capacity?.message}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Estado"
                  errorMessage={errors.status?.message}
                >
                  <SelectItem key="available">Disponible</SelectItem>
                  <SelectItem key="occupied">Ocupada</SelectItem>
                  <SelectItem key="maintenance">Mantenimiento</SelectItem>
                </Select>
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="Precio"
                  placeholder="1000"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  errorMessage={errors.price?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Descripción"
                  placeholder="Descripción de la habitación"
                  errorMessage={errors.description?.message}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
} 