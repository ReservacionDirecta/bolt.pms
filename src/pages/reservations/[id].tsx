'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { 
  Button,
  Table,
  Checkbox,
  Card,
  CardBody,
  CardHeader,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Tooltip,
  Spinner
} from '@nextui-org/react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'
import { 
  FaPrint, 
  FaEnvelope, 
  FaComment, 
  FaCut, 
  FaTimes, 
  FaPencilAlt, 
  FaTrash,
  FaPlus,
  FaInfoCircle
} from 'react-icons/fa'
import Image from 'next/image'

type Reservation = {
  id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  room_number: string
  room_type: string
  room_rate: number
  check_in: string
  check_out: string
  total_amount: number
  status: string
  cancelled_at?: string
  cancellation_reason?: string
}

type Payment = {
  id: string
  amount: number
  payment_method: string
  date: string
  receipt_url?: string
  reference?: string
}

type HistoryEntry = {
  id: string
  date: string
  user: string
  action: string
  details: string
}

type Room = {
  id: string
  room_number: string
  rate_type: string
  status: string
  rate: number
}

export default function ReservationDetails() {
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUploadingPayment, setIsUploadingPayment] = useState(false)
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  // Función para calcular el saldo pendiente
  const calculatePendingAmount = (total: number, payments: Payment[]) => {
    const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    return total - totalPaid
  }

  // Función para formatear montos
  const formatAmount = (amount: number | undefined) => {
    if (amount === undefined) return 'S/ 0.00'
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const fetchReservationHistory = useCallback(async (reservationId: string) => {
    try {
      const { data, error } = await supabase
        .from('reservation_history')
        .select('*')
        .eq('reservation_id', reservationId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setHistoryEntries(data || [])
    } catch (err) {
      console.error('Error fetching history:', err)
      toast.error('Error al cargar el historial')
    }
  }, [])

  const handlePaymentUpload = async (file: File) => {
    try {
      setIsUploadingPayment(true)
      
      // 1. Subir imagen a Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('payment-receipts')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Crear registro de pago
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            reservation_id: reservation?.id,
            amount: 0, // Este valor debe ser ingresado por el usuario
            payment_method: 'transfer', // Debe ser seleccionado por el usuario
            receipt_url: uploadData.path,
            date: new Date().toISOString()
          }
        ])
        .select()
        .single()

      if (paymentError) throw paymentError

      toast.success('Pago registrado correctamente')
      // Actualizar la lista de pagos
      setPayments(prev => [...prev, paymentData])

    } catch (err) {
      console.error('Error uploading payment:', err)
      toast.error('Error al registrar el pago')
    } finally {
      setIsUploadingPayment(false)
    }
  }

  const fetchAvailableRooms = async (checkIn: string, checkOut: string) => {
    setIsLoadingRooms(true)
    try {
      const { data, error } = await supabase
        .rpc('get_available_rooms', { 
          check_in_date: checkIn,
          check_out_date: checkOut,
          exclude_reservation_id: reservation?.id
        })

      if (error) throw error
      setAvailableRooms(data || [])
    } catch (err) {
      console.error('Error fetching available rooms:', err)
      toast.error('Error al cargar habitaciones disponibles')
    } finally {
      setIsLoadingRooms(false)
    }
  }

  const handleRoomChange = async () => {
    if (!selectedRoom || !reservation?.id) return

    try {
      // 1. Actualizar la reservación
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ room_id: selectedRoom })
        .eq('id', reservation.id)

      if (updateError) throw updateError

      // 2. Registrar en el historial
      const { error: historyError } = await supabase
        .from('reservation_history')
        .insert([{
          reservation_id: reservation.id,
          action: 'room_change',
          details: `Cambio de habitación a ${availableRooms.find(r => r.id === selectedRoom)?.room_number}`
        }])

      if (historyError) throw historyError

      // 3. Actualizar la UI
      toast.success('Habitación actualizada correctamente')
      setIsEditingRoom(false)
      // Recargar los datos de la reservación
      router.reload()
    } catch (err) {
      console.error('Error updating room:', err)
      toast.error('Error al actualizar la habitación')
    }
  }

  const handleCancelReservation = async () => {
    if (!reservation?.id || !cancelReason.trim()) {
      toast.error('Por favor ingresa un motivo de cancelación')
      return
    }

    try {
      setIsCancelling(true)

      // 1. Actualizar directamente el estado de la reserva
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: cancelReason.trim()
        })
        .eq('id', reservation.id)

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Error al actualizar la reserva')
      }

      // 2. Registrar en el historial
      const { error: historyError } = await supabase
        .from('reservation_history')
        .insert({
          reservation_id: reservation.id,
          action: 'cancellation',
          details: `Reserva cancelada. Motivo: ${cancelReason.trim()}`
        })

      if (historyError) {
        console.error('History error:', historyError)
        toast.warning('La reserva se canceló pero hubo un error al registrar en el historial')
      }

      // 3. Actualizar el estado local
      setReservation(prev => prev ? {
        ...prev,
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: cancelReason.trim()
      } : null)

      toast.success('Reserva cancelada correctamente')
      setIsCancelModalOpen(false)
      setCancelReason('')

    } catch (err) {
      console.error('Error cancelling reservation:', err)
      toast.error(err instanceof Error ? err.message : 'Error al cancelar la reserva')
    } finally {
      setIsCancelling(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady) return

      try {
        const id = router.query.id
        if (!id || typeof id !== 'string') {
          setError('ID de reserva no válido')
          return
        }

        setIsLoading(true)
        setError(null)

        // Consulta simplificada
        const { data, error: reservationError } = await supabase
          .from('reservations')
          .select(`
            id,
            check_in,
            check_out,
            total_amount,
            status,
            cancelled_at,
            cancellation_reason,
            guest_id,
            room_id
          `)
          .eq('id', id)
          .single()

        if (reservationError) {
          console.error('Error en consulta inicial:', reservationError)
          throw new Error('Error al cargar la reserva')
        }

        if (!data) {
          throw new Error('Reserva no encontrada')
        }

        // Obtener datos del huésped
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('first_name, last_name, email, phone')
          .eq('id', data.guest_id)
          .single()

        if (guestError) {
          console.error('Error al cargar datos del huésped:', guestError)
          throw new Error('Error al cargar datos del huésped')
        }

        // Obtener datos de la habitación
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('room_number, rate_type, rate')
          .eq('id', data.room_id)
          .single()

        if (roomError) {
          console.error('Error al cargar datos de la habitación:', roomError)
          throw new Error('Error al cargar datos de la habitación')
        }

        // Formatear los datos
        const formattedReservation = {
          id: data.id,
          guest_name: `${guestData.first_name} ${guestData.last_name}`,
          guest_email: guestData.email,
          guest_phone: guestData.phone,
          room_number: roomData.room_number,
          room_type: roomData.rate_type,
          room_rate: roomData.rate,
          check_in: data.check_in,
          check_out: data.check_out,
          total_amount: data.total_amount,
          status: data.status,
          cancelled_at: data.cancelled_at,
          cancellation_reason: data.cancellation_reason
        }

        setReservation(formattedReservation)

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar los datos')
        toast.error('Error al cargar los datos de la reserva')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router.isReady, router.query.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button 
            className="mt-4"
            onClick={() => router.push('/reservations')}
          >
            Volver a reservas
          </Button>
        </div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Reserva no encontrada</h2>
          <p className="text-gray-600">La reserva que buscas no existe o fue eliminada</p>
          <Button 
            className="mt-4"
            onClick={() => router.push('/reservations')}
          >
            Volver a reservas
          </Button>
        </div>
      </div>
    )
  }

  const pendingAmount = calculatePendingAmount(reservation.total_amount, payments)

  const columns = [
    { key: "type", label: "TIPO DE HABITACIÓN" },
    { key: "room", label: "HABITACIÓN" },
    { key: "guests", label: "HUÉSPEDES" },
    { key: "actions", label: "EDITAR" },
    { key: "rate", label: "TARIFA" },
    { key: "amount", label: "MONTO" }
  ]

  const rows = [
    {
      key: "1",
      type: "Bungalow A/A",
      room: "Matrimoni 17",
      guests: "2",
      actions: (
        <div className="flex gap-2">
          <Button isIconOnly size="sm"><FaPencilAlt /></Button>
          <Button isIconOnly size="sm"><FaTrash /></Button>
        </div>
      ),
      rate: "177.00 /noche",
      amount: "354.00"
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reserva {reservation?.id}</h1>
        <div className="text-sm text-gray-500">
          Creada el {new Date().toLocaleDateString()} por Usuario
        </div>
      </div>

      {/* Botones de acción superiores */}
      <div className="flex gap-2 mb-4">
        <Button size="sm" startContent={<FaPrint />}>
          Imprimir
        </Button>
        <Button size="sm" startContent={<FaEnvelope />}>
          Enviar email
        </Button>
        <Button size="sm" startContent={<FaComment />}>
          Enviar SMS
        </Button>
        <Button size="sm" startContent={<FaCut />}>
          Dividir la reservación
        </Button>
        {reservation?.status === 'cancelled' ? (
          <div className="flex items-center gap-2 text-danger">
            <FaTimes />
            <span>Reserva cancelada</span>
            {reservation.cancellation_reason && (
              <Tooltip content={`Motivo: ${reservation.cancellation_reason}`}>
                <Button isIconOnly size="sm" variant="light">
                  <FaInfoCircle />
                </Button>
              </Tooltip>
            )}
          </div>
        ) : (
          <Button 
            size="sm" 
            color="danger" 
            startContent={<FaTimes />}
            onClick={() => setIsCancelModalOpen(true)}
            isDisabled={!reservation}
          >
            Cancelar reserva
          </Button>
        )}
      </div>

      <Card className="mb-4">
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Checkbox>Leída</Checkbox>
              <Checkbox>Check-in realizado</Checkbox>
              <Checkbox>Check-out realizado</Checkbox>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-lg">Total: {formatAmount(reservation?.total_amount)}</p>
                <p className="text-sm text-green-600">
                  Saldo adeudado: {formatAmount(pendingAmount)}
                </p>
              </div>
            </div>

            {/* Información del huésped */}
            <div>
              <h3 className="font-medium mb-2">Datos del huésped</h3>
              <div className="space-y-2">
                <p>Nombre: {reservation?.guest_name}</p>
                <p>Pasaporte: {reservation?.passport_number}</p>
                <p>Teléfono: {reservation?.phone}</p>
                <p>Email: {reservation?.email}</p>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Check-in</p>
                <p>{new Date(reservation?.check_in || '').toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Check-out</p>
                <p>{new Date(reservation?.check_out || '').toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabla de detalles */}
      <Card className="mb-4">
        <CardBody>
          <Table aria-label="Detalles de la reserva">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{reservation?.room?.rate_type}</TableCell>
                <TableCell>{reservation?.room?.room_number}</TableCell>
                <TableCell>2</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      isIconOnly 
                      size="sm"
                      onClick={() => {
                        fetchAvailableRooms(reservation?.check_in, reservation?.check_out)
                        setIsEditingRoom(true)
                      }}
                    >
                      <FaPencilAlt />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{formatAmount(reservation?.room?.rate)} /noche</TableCell>
                <TableCell>{formatAmount(reservation?.total_amount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal de edición de habitación */}
      <Modal 
        isOpen={isEditingRoom} 
        onClose={() => setIsEditingRoom(false)}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>Cambiar Habitación</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Selecciona una nueva habitación disponible para las fechas:
                <br />
                Check-in: {new Date(reservation?.check_in || '').toLocaleDateString()}
                <br />
                Check-out: {new Date(reservation?.check_out || '').toLocaleDateString()}
              </p>

              <Select
                label="Habitación disponible"
                placeholder="Selecciona una habitación"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                isLoading={isLoadingRooms}
              >
                {availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.room_number} - {room.rate_type} - {formatAmount(room.rate)}/noche
                  </SelectItem>
                ))}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsEditingRoom(false)}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleRoomChange}>
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Detalles de tarifa */}
      <Card className="mb-4">
        <CardHeader>
          <h3 className="text-lg font-semibold">Detalles de tarifa</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Detalles de tarifa">
            <TableHeader>
              <TableColumn>CONCEPTO</TableColumn>
              <TableColumn>CANTIDAD</TableColumn>
              <TableColumn>TARIFA</TableColumn>
              <TableColumn>SUBTOTAL</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Habitación Matrimonial</TableCell>
                <TableCell>2 noches</TableCell>
                <TableCell>S/ 177.00</TableCell>
                <TableCell>S/ 354.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>IGV</TableCell>
                <TableCell>18%</TableCell>
                <TableCell>-</TableCell>
                <TableCell>S/ 35.40</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">Total: S/ 389.40</p>
          </div>
        </CardBody>
      </Card>

      {/* Módulo de pagos */}
      <Card className="mb-4">
        <CardHeader>
          <h3 className="text-lg font-semibold">Pagos registrados</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Pagos registrados">
            <TableHeader>
              <TableColumn>FECHA</TableColumn>
              <TableColumn>MÉTODO</TableColumn>
              <TableColumn>REFERENCIA</TableColumn>
              <TableColumn>MONTO</TableColumn>
              <TableColumn>COMPROBANTE</TableColumn>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.payment_method}</TableCell>
                  <TableCell>{payment.reference || '-'}</TableCell>
                  <TableCell>{formatAmount(payment.amount)}</TableCell>
                  <TableCell>
                    {payment.receipt_url && (
                      <Button
                        size="sm"
                        onClick={() => window.open(payment.receipt_url, '_blank')}
                      >
                        Ver comprobante
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Formulario de nuevo pago */}
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handlePaymentUpload(file)
              }}
              className="hidden"
              id="payment-receipt"
            />
            <Button
              color="primary"
              onClick={() => document.getElementById('payment-receipt')?.click()}
              isLoading={isUploadingPayment}
            >
              Registrar nuevo pago
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Historial de cambios */}
      <Card className="mb-4">
        <CardHeader>
          <h3 className="text-lg font-semibold">Historial de cambios</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {historyEntries.map((entry) => (
              <div key={entry.id} className="border-b pb-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{new Date(entry.date).toLocaleString()}</span>
                  <span>{entry.user}</span>
                </div>
                <p className="mt-1">{entry.details}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Botones de acción inferiores */}
      <div className="flex gap-2 justify-end">
        <Button size="sm" startContent={<FaPlus />}>
          Añadir habitación
        </Button>
        <Button size="sm" startContent={<FaPlus />}>
          Añadir extras
        </Button>
        <Button size="sm" startContent={<FaPlus />}>
          Agregar recargo
        </Button>
      </div>

      {/* Modal de cancelación */}
      <Modal 
        isOpen={isCancelModalOpen} 
        onClose={() => {
          if (!isCancelling) {
            setIsCancelModalOpen(false)
            setCancelReason('')
          }
        }}
        isDismissable={!isCancelling}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Cancelar Reserva</h3>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Al cancelar la reserva:
                    </p>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      <li>La habitación quedará disponible para otras reservas</li>
                      <li>Se notificará al huésped por email</li>
                      <li>Se registrará en el historial de la reserva</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de cancelación *
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ingresa el motivo de la cancelación..."
                  disabled={isCancelling}
                  required
                />
              </div>

              {/* Detalles de la reserva */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Detalles de la reserva</h4>
                <div className="text-sm text-gray-600">
                  <p>Huésped: {reservation?.guest_name}</p>
                  <p>Check-in: {new Date(reservation?.check_in || '').toLocaleDateString()}</p>
                  <p>Check-out: {new Date(reservation?.check_out || '').toLocaleDateString()}</p>
                  <p>Habitación: {reservation?.room_number}</p>
                  <p>Total: {formatAmount(reservation?.total_amount)}</p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="default" 
              variant="light" 
              onPress={() => {
                setIsCancelModalOpen(false)
                setCancelReason('')
              }}
              isDisabled={isCancelling}
            >
              Volver
            </Button>
            <Button
              color="danger"
              onPress={handleCancelReservation}
              isLoading={isCancelling}
              isDisabled={!cancelReason.trim()}
            >
              Confirmar cancelación
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
} 