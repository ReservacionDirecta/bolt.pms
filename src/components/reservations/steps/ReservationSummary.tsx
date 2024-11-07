'use client'
import { Card } from '@nextui-org/react'
import dayjs from 'dayjs'
import type { Reservation } from '../../../types'
import { GuestSelection } from './steps/GuestSelection';

const IGV_RATE = 0.10 // 10% IGV
const SERVICE_FEE_RATE = 0.03 // 3% Fee

interface ReservationSummaryProps {
  reservation: Reservation
}

export function ReservationSummary({ reservation }: ReservationSummaryProps) {
  // Verificar que tenemos los datos necesarios
  console.log('Room data:', reservation.room)
  console.log('Number of guests:', reservation.number_of_guests)

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

  const calculateRoomTotal = () => {
    const nights = calculateNights()
    const ratePerNight = calculateRoomRatePerNight()
    console.log('Total nights:', nights)
    console.log('Rate per night:', ratePerNight)
    return ratePerNight * nights
  }

  const calculateServicesPerNight = () => {
    return reservation.additional_services?.reduce(
      (sum, service) => sum + service.price,
      0
    ) || 0
  }

  const calculateServicesTotal = () => {
    const nights = calculateNights()
    return calculateServicesPerNight() * nights
  }

  const calculateSubtotal = () => {
    return calculateRoomTotal() + calculateServicesTotal()
  }

  const calculateIGV = () => {
    return calculateSubtotal() * IGV_RATE
  }

  const calculateServiceFee = () => {
    return calculateSubtotal() * SERVICE_FEE_RATE
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateIGV() + calculateServiceFee()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return dayjs(date).format('MMM DD, YYYY')
  }

  // Calcular la tarifa total
  const totalAmount = calculateRoomTotal();
  const guests = reservation.number_of_guests || 1;
  const ratePerNight = calculateRoomRatePerNight() / guests; // Tarifa por huésped

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Reservation Summary</h2>
        <p className="text-gray-500">Review your reservation details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detalles de la estancia */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Stay Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Check-in</span>
              <span>{formatDate(reservation.check_in)}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span>{formatDate(reservation.check_out)}</span>
            </div>
            <div className="flex justify-between">
              <span>Nights</span>
              <span>{calculateNights()}</span>
            </div>
            <div className="flex justify-between">
              <span>Room</span>
              <span>{reservation.room?.room_number}</span>
            </div>
            <div className="flex justify-between">
              <span>Room Type</span>
              <span>{reservation.room?.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests</span>
              <span>{guests}</span>
            </div>
          </div>
        </Card>

        {/* Detalles de tarifa por noche */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Rate Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span>Room Rate</span>
              <div className="text-right">
                <div>{formatCurrency(calculateRoomRatePerNight())}/night</div>
                <div className="text-sm text-gray-500">
                  {reservation.room?.rate_type === 'room' ? 
                    'Fixed room rate' : 
                    `Rate for ${reservation.number_of_guests} guests`
                  }
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <span>Stay Duration</span>
              <div className="text-right">
                <div>{calculateNights()} nights</div>
                <div className="text-sm text-gray-500">
                  {formatDate(reservation.check_in)} - {formatDate(reservation.check_out)}
                </div>
              </div>
            </div>

            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Room Total</span>
              <div className="text-right">
                <div>{formatCurrency(calculateRoomTotal())}</div>
                <div className="text-sm text-gray-500">
                  ({formatCurrency(calculateRoomRatePerNight())} × {calculateNights()} nights)
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Servicios adicionales */}
        {reservation.additional_services && reservation.additional_services.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium mb-4">Additional Services</h3>
            <div className="space-y-3">
              {reservation.additional_services.map((service) => (
                <div key={service.id} className="flex justify-between items-start">
                  <span>{service.name}</span>
                  <div className="text-right">
                    <div>{formatCurrency(service.price * calculateNights())}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(service.price)}/night × {calculateNights()} nights
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Resumen final de costos */}
        <Card className="p-4 bg-gray-50">
          <h3 className="font-medium mb-4">Cost Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Room Charges</span>
              <span>{formatCurrency(calculateRoomTotal())}</span>
            </div>

            {calculateServicesTotal() > 0 && (
              <div className="flex justify-between">
                <span>Additional Services</span>
                <span>{formatCurrency(calculateServicesTotal())}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>IGV (10%)</span>
              <span>{formatCurrency(calculateIGV())}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Service Fee (3%)</span>
              <span>{formatCurrency(calculateServiceFee())}</span>
            </div>

            <div className="flex justify-between font-bold pt-2 border-t text-lg">
              <span>Total Amount</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>

            <div className="text-xs text-gray-500 space-y-1 mt-2">
              <p>* Rates include IGV (10%)</p>
              <p>* Service fee of 3% applies to subtotal</p>
              {reservation.room?.rate_type === 'person' && (
                <p>* Rate calculated based on {reservation.number_of_guests} guests</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 