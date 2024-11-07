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
  Textarea,
  Card,
  CardBody,
  CardHeader
} from '@nextui-org/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DatePicker } from '@/components/DatePicker'

const reservationSchema = z.object({
  // Información del huésped
  guestName: z.string().min(1, 'El nombre es requerido'),
  guestLastName: z.string().min(1, 'El apellido es requerido'),
  documentType: z.enum(['dni', 'passport', 'other'], {
    required_error: 'Seleccione un tipo de documento'
  }),
  documentNumber: z.string().min(1, 'El número de documento es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  city: z.string().min(1, 'La ciudad es requerida'),
  region: z.string().min(1, 'La región es requerida'),
  
  // Información de la reserva
  roomId: z.string().min(1, 'La habitación es requerida'),
  checkIn: z.date(),
  checkOut: z.date(),
  adults: z.number().min(1, 'Debe haber al menos 1 adulto'),
  children: z.number().min(0, 'No puede ser negativo'),
  status: z.enum(['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled']),
  payment: z.enum(['pending', 'paid', 'refunded']),
  total: z.number().min(0, 'El total debe ser mayor a 0'),
  notes: z.string().optional()
}).refine(data => {
  return data.checkOut > data.checkIn
}, {
  message: "La fecha de salida debe ser posterior a la fecha de entrada",
  path: ["checkOut"]
})

type ReservationFormData = z.infer<typeof reservationSchema>

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  reservation?: ReservationFormData | null
}

export function ReservationModal({ isOpen, onClose, reservation }: ReservationModalProps) {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: reservation || {
      guestName: '',
      guestLastName: '',
      documentType: 'dni',
      documentNumber: '',
      email: '',
      phone: '',
      city: '',
      region: '',
      roomId: '',
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
      adults: 1,
      children: 0,
      status: 'pending',
      payment: 'pending',
      total: 0,
      notes: ''
    }
  })

  const onSubmit = (data: ReservationFormData) => {
    console.log('Datos de la reserva:', data)
    onClose()
  }

  // Datos de ejemplo - estos vendrían de tu base de datos
  const rooms = [
    { id: '101', name: 'Habitación 101 - Individual' },
    { id: '102', name: 'Habitación 102 - Doble' }
  ]

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              {reservation ? 'Editar Reserva' : 'Nueva Reserva'}
            </h2>
          </ModalHeader>
          <ModalBody className="gap-4 p-6">
            {/* Información del Huésped */}
            <Card className="p-4">
              <CardHeader className="px-4 py-0">
                <h3 className="text-lg font-semibold">Información del Huésped</h3>
              </CardHeader>
              <CardBody className="gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="guestName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Nombre"
                        placeholder="Juan"
                        errorMessage={errors.guestName?.message}
                      />
                    )}
                  />

                  <Controller
                    name="guestLastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Apellidos"
                        placeholder="Pérez"
                        errorMessage={errors.guestLastName?.message}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="documentType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Tipo de Documento"
                        errorMessage={errors.documentType?.message}
                      >
                        <SelectItem key="dni">DNI</SelectItem>
                        <SelectItem key="passport">Pasaporte</SelectItem>
                        <SelectItem key="other">Otro</SelectItem>
                      </Select>
                    )}
                  />

                  <Controller
                    name="documentNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Número de Documento"
                        placeholder="12345678"
                        errorMessage={errors.documentNumber?.message}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Email"
                        placeholder="juan@ejemplo.com"
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
                        placeholder="+34 123 456 789"
                        errorMessage={errors.phone?.message}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Ciudad"
                        placeholder="Madrid"
                        errorMessage={errors.city?.message}
                      />
                    )}
                  />

                  <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Región"
                        placeholder="Comunidad de Madrid"
                        errorMessage={errors.region?.message}
                      />
                    )}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Detalles de la Reserva */}
            <Card className="p-4">
              <CardHeader className="px-4 py-0">
                <h3 className="text-lg font-semibold">Detalles de la Reserva</h3>
              </CardHeader>
              <CardBody className="gap-4">
                <Controller
                  name="roomId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Habitación"
                      placeholder="Selecciona una habitación"
                      errorMessage={errors.roomId?.message}
                    >
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="checkIn"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Fecha de entrada"
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={errors.checkIn?.message}
                      />
                    )}
                  />

                  <Controller
                    name="checkOut"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Fecha de salida"
                        value={field.value}
                        onChange={field.onChange}
                        errorMessage={errors.checkOut?.message}
                        minDate={watch('checkIn')}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="adults"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Adultos"
                        min={1}
                        errorMessage={errors.adults?.message}
                      />
                    )}
                  />

                  <Controller
                    name="children"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        label="Niños"
                        min={0}
                        errorMessage={errors.children?.message}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Estado"
                        errorMessage={errors.status?.message}
                      >
                        <SelectItem key="pending">Pendiente</SelectItem>
                        <SelectItem key="confirmed">Confirmada</SelectItem>
                        <SelectItem key="checked_in">Check-in</SelectItem>
                        <SelectItem key="checked_out">Check-out</SelectItem>
                        <SelectItem key="cancelled">Cancelada</SelectItem>
                      </Select>
                    )}
                  />

                  <Controller
                    name="payment"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Estado de pago"
                        errorMessage={errors.payment?.message}
                      >
                        <SelectItem key="pending">Pendiente</SelectItem>
                        <SelectItem key="paid">Pagado</SelectItem>
                        <SelectItem key="refunded">Reembolsado</SelectItem>
                      </Select>
                    )}
                  />
                </div>

                <Controller
                  name="total"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      label="Total"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                      errorMessage={errors.total?.message}
                    />
                  )}
                />

                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Notas"
                      placeholder="Notas adicionales sobre la reserva"
                      errorMessage={errors.notes?.message}
                    />
                  )}
                />
              </CardBody>
            </Card>
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