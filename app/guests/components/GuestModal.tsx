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

const guestSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  document_type: z.enum(['dni', 'passport', 'other']),
  document_number: z.string().min(1, 'El número de documento es requerido'),
  nationality: z.string().min(1, 'La nacionalidad es requerida'),
  address: z.string().optional(),
  notes: z.string().optional()
})

type GuestFormData = z.infer<typeof guestSchema>

interface GuestModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: GuestFormData) => void
  guest?: GuestFormData | null
}

export function GuestModal({ isOpen, onClose, onSave, guest }: GuestModalProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: guest || {
      name: '',
      email: '',
      phone: '',
      document_type: 'dni',
      document_number: '',
      nationality: '',
      address: '',
      notes: ''
    }
  })

  const onSubmit = (data: GuestFormData) => {
    onSave(data)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {guest ? 'Editar Huésped' : 'Nuevo Huésped'}
          </ModalHeader>
          <ModalBody className="gap-4">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre"
                  placeholder="Juan Pérez"
                  errorMessage={errors.name?.message}
                />
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email"
                    placeholder="juan@example.com"
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Teléfono"
                    placeholder="+52 123 456 7890"
                    errorMessage={errors.phone?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="document_type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Tipo de Documento"
                    errorMessage={errors.document_type?.message}
                  >
                    <SelectItem key="dni">DNI</SelectItem>
                    <SelectItem key="passport">Pasaporte</SelectItem>
                    <SelectItem key="other">Otro</SelectItem>
                  </Select>
                )}
              />

              <Controller
                name="document_number"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Número de Documento"
                    placeholder="12345678"
                    errorMessage={errors.document_number?.message}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nacionalidad"
                    placeholder="México"
                    errorMessage={errors.nationality?.message}
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Dirección"
                    placeholder="Calle Principal 123"
                    errorMessage={errors.address?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Notas"
                  placeholder="Notas adicionales"
                  errorMessage={errors.notes?.message}
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={handleSubmit(onSubmit)}>
              Guardar
            </Button>
            <Button color="default" onPress={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
} 