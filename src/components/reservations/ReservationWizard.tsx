'use client'
import { useState } from 'react'
import { Card, Button } from '@nextui-org/react'
import { DateSelection } from './steps/DateSelection'
import { RoomSelection } from './steps/RoomSelection'
import { AdditionalServices } from './steps/AdditionalServices'
import { GuestInformation } from './steps/GuestInformation'
import { ReservationSummary } from './steps/ReservationSummary'
import type { Reservation } from '../../types'
import { supabase } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'

const STEPS = [
  { title: 'Dates', description: 'Select check-in and check-out dates' },
  { title: 'Room', description: 'Choose your room' },
  { title: 'Extras', description: 'Add additional services' },
  { title: 'Guest Info', description: 'Enter guest details' },
  { title: 'Summary', description: 'Review and confirm' }
]

export function ReservationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [reservation, setReservation] = useState<Reservation>({
    check_in: '',
    check_out: '',
    room_id: '',
    number_of_guests: 1,
    // Otros campos necesarios
  })
  const router = useRouter()

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Dates
        return reservation.check_in && reservation.check_out
      case 1: // Room
        return reservation.room_id
      case 2: // Additional Services
        return true // Siempre puede proceder ya que los servicios son opcionales
      case 3: // Guest Information
        return reservation.guest && 
               reservation.guest.first_name && 
               reservation.guest.last_name && 
               reservation.guest.email && 
               reservation.guest.phone && 
               reservation.guest.document_type && 
               reservation.guest.document_number
      case 4: // Summary
        return true // Si llegó hasta aquí, puede confirmar
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const updateReservation = (data: Partial<Reservation>) => {
    setReservation(prev => ({ 
      ...prev, 
      ...data,
      number_of_guests: data.number_of_guests || prev.number_of_guests || 1
    }))
  }

  const calculateNights = () => {
    const checkIn = dayjs(reservation.check_in)
    const checkOut = dayjs(reservation.check_out)
    return checkOut.diff(checkIn, 'day')
  }

  const calculateRoomRatePerNight = () => {
    if (!reservation.room) {
      console.log('No room data available')
      return 0
    }

    if (reservation.room.rate_type === 'room') {
      console.log('Room rate (per room):', reservation.room.rate)
      return reservation.room.rate
    } else {
      const totalGuests = reservation.number_of_guests || 1
      const perPersonRate = reservation.room.rates_per_person?.[totalGuests - 1] || 0
      console.log('Room rate (per person):', perPersonRate, 'x', totalGuests, 'guests')
      return perPersonRate * totalGuests
    }
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const ratePerNight = calculateRoomRatePerNight()
    console.log('Total nights:', nights)
    console.log('Rate per night:', ratePerNight)
    return ratePerNight * nights
  }

  const handleConfirmReservation = async () => {
    try {
      // Validar que tenemos la información del huésped
      if (!reservation.guest) {
        throw new Error('Guest information is required')
      }

      // Verificar que tenemos los campos requeridos del huésped
      const { first_name, last_name, email, phone } = reservation.guest
      if (!first_name || !last_name || !email || !phone) {
        throw new Error('Missing required guest information')
      }

      console.log('Guest data to upsert:', reservation.guest)

      // Crear o actualizar el huésped
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .upsert([{
          first_name,
          last_name,
          email,
          phone,
          document_type: reservation.guest.document_type || null,
          document_number: reservation.guest.document_number || null,
          address: reservation.guest.address || null,
          city: reservation.guest.city || null,
          country: reservation.guest.country || null,
          updated_at: new Date().toISOString()
        }], {
          onConflict: 'email' // Usar el email como campo único para actualizar
        })
        .select()
        .single()

      if (guestError) {
        console.error('Guest error details:', guestError)
        throw new Error(`Error creating guest: ${guestError.message}`)
      }

      if (!guestData) {
        throw new Error('No guest data returned after upsert')
      }

      // Crear la reservación con mejor manejo de errores
      const reservationData = {
        check_in: reservation.check_in,
        check_out: reservation.check_out,
        room_id: reservation.room_id,
        guest_id: guestData.id,
        status: 'confirmed',
        total_amount: calculateTotal(),
        number_of_guests: reservation.number_of_guests || 1,
        additional_services: reservation.additional_services || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Attempting to create reservation with data:', reservationData)

      const { data: newReservation, error: reservationError } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select('*')
        .single()

      if (reservationError) {
        console.error('Reservation error details:', reservationError)
        throw new Error(`Error creating reservation: ${reservationError.message || 'Unknown error'}`)
      }

      if (!newReservation) {
        throw new Error('No reservation data returned after insert')
      }

      console.log('Successfully created reservation:', newReservation)

      // Actualizar el estado de la habitación
      const { error: roomError } = await supabase
        .from('rooms')
        .update({ 
          status: 'occupied'
        })
        .eq('id', reservation.room_id)

      if (roomError) {
        console.error('Room update error:', roomError)
        throw new Error(`Error updating room status: ${roomError.message}`)
      }

      // Redirigir a la página de confirmación
      router.push(`/reservations/${newReservation.id}`)
    } catch (error) {
      console.error('Error in handleConfirmReservation:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  const calculateTotalAmount = () => {
    // Implementa el cálculo del total según tu lógica de negocio
    return 0
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DateSelection
            checkIn={reservation.check_in}
            checkOut={reservation.check_out}
            onSelect={(dates) => updateReservation(dates)}
          />
        )
      case 1:
        return (
          <RoomSelection
            checkIn={reservation.check_in!}
            checkOut={reservation.check_out!}
            selectedRoomId={reservation.room_id}
            onSelect={(selectedRoom) => updateReservation({
              room_id: selectedRoom.id,
              room: selectedRoom
            })}
          />
        )
      case 2:
        return (
          <AdditionalServices
            services={reservation.additional_services || []}
            onUpdate={(services) => updateReservation({ additional_services: services })}
          />
        )
      case 3:
        return (
          <GuestInformation
            guest={reservation.guest}
            onSubmit={(guest) => updateReservation({ guest })}
          />
        )
      case 4:
        return (
          <ReservationSummary
            reservation={reservation as Reservation}
          />
        )
      default:
        return null
    }
  }

  const updateGuestCount = (totalGuests: number) => {
    setReservation((prev) => ({
      ...prev,
      number_of_guests: totalGuests, // Actualiza el número de huéspedes
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <div className="mb-8">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
          </div>
        </div>

        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            color="default"
            variant="light"
            onPress={handleBack}
            isDisabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            color="primary"
            onPress={currentStep === STEPS.length - 1 ? handleConfirmReservation : handleNext}
            isDisabled={!canProceed()}
          >
            {currentStep === STEPS.length - 1 ? 'Confirm Reservation' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  )
} 