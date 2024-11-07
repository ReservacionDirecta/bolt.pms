'use client'

import { useState } from 'react'
import { Card, CardBody, Button, Badge } from "@nextui-org/react"
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarDaysIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { useMediaQuery } from "@/hooks/useMediaQuery"

type CalendarView = 'week' | 'month'

export default function CalendarPage() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('week')

  // Datos de ejemplo
  const rooms = [
    { id: '101', number: '101', type: 'Standard', floor: '1' },
    { id: '102', number: '102', type: 'Deluxe', floor: '1' },
    { id: '201', number: '201', type: 'Suite', floor: '2' },
    // Añade más habitaciones según necesites
  ]

  const reservations = [
    {
      id: '1',
      guestName: 'John Doe',
      roomId: '101',
      checkIn: new Date(2024, 1, 10),
      checkOut: new Date(2024, 1, 15),
      status: 'confirmed',
      color: 'bg-blue-100 border-blue-300'
    },
    // Añade más reservaciones
  ]

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (view === 'week') {
      const days = direction === 'prev' ? -7 : 7
      newDate.setDate(newDate.getDate() + days)
    } else {
      const months = direction === 'prev' ? -1 : 1
      newDate.setMonth(newDate.getMonth() + months)
    }
    setCurrentDate(newDate)
  }

  const getWeekDates = () => {
    const dates = []
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay()) // Comenzar desde domingo
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getMonthDates = () => {
    const dates = []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1)
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0)
    
    // Obtener todos los días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day))
    }
    
    return dates
  }

  const isReservationVisible = (room: any, date: Date) => {
    const reservation = reservations.find(res => 
      res.roomId === room.id &&
      date >= res.checkIn &&
      date <= res.checkOut
    )

    if (!reservation) return null

    return {
      ...reservation,
      isStart: isReservationStart(reservation, date),
      isEnd: isReservationEnd(reservation, date)
    }
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6 // 0 es domingo, 6 es sábado
  }

  // Configuración de formato de fecha consistente
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const weekDayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short'
  })

  const monthFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendario</h1>
          <p className="text-gray-600">Gestiona las reservas en el calendario</p>
        </div>
        <Button 
          color="primary" 
          startContent={<PlusIcon className="w-5 h-5" />}
        >
          Nueva Reserva
        </Button>
      </div>

      {/* Calendar Controls */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="flat"
                onClick={() => navigateCalendar('prev')}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
              <span className="text-lg font-semibold min-w-[200px] text-center">
                {view === 'week' 
                  ? `${dateFormatter.format(getWeekDates()[0])} - ${dateFormatter.format(getWeekDates()[6])}`
                  : monthFormatter.format(currentDate)
                }
              </span>
              <Button
                isIconOnly
                variant="flat"
                onClick={() => navigateCalendar('next')}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'week' ? 'solid' : 'flat'}
                onClick={() => setView('week')}
                color={view === 'week' ? 'primary' : 'default'}
              >
                Semana
              </Button>
              <Button
                variant={view === 'month' ? 'solid' : 'flat'}
                onClick={() => setView('month')}
                color={view === 'month' ? 'primary' : 'default'}
              >
                Mes
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <div className={`min-w-[1200px]`}>
              {view === 'week' ? (
                <>
                  {/* Encabezados de días */}
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="font-semibold">Rooms</div>
                    {getWeekDates().map((date, index) => (
                      <div 
                        key={index} 
                        className={`text-center p-2 rounded-t-lg
                          ${isWeekend(date) ? 'bg-gray-50' : ''}`}
                      >
                        <div className="font-semibold">
                          {weekDayFormatter.format(date)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {date.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Filas de habitaciones */}
                  {rooms.map(room => (
                    <div 
                      key={room.id} 
                      className="grid grid-cols-8 gap-2 mb-2"
                    >
                      <div className="font-medium">
                        {room.number}
                        <div className="text-sm text-gray-600">{room.type}</div>
                      </div>
                      {getWeekDates().map((date, index) => {
                        const reservation = isReservationVisible(room, date)
                        return (
                          <div 
                            key={index}
                            className={`h-16 rounded-lg border ${
                              reservation 
                                ? reservation.color 
                                : isWeekend(date)
                                  ? 'border-gray-200 bg-gray-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {reservation && (
                              <div className="p-2 text-xs">
                                <div className="font-medium truncate">
                                  {reservation.guestName}
                                </div>
                                <Badge color="primary" size="sm">
                                  {reservation.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {/* Encabezados de días */}
                  <div className="grid grid-cols-[200px_repeat(31,1fr)] gap-1 mb-4">
                    <div className="font-semibold p-2">Rooms</div>
                    {getMonthDates().map((date, index) => (
                      <div 
                        key={index} 
                        className={`text-center p-2 rounded-t-lg
                          ${isWeekend(date) ? 'bg-gray-50' : ''}`}
                      >
                        <div className="font-semibold text-xs">
                          {weekDayFormatter.format(date)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {date.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Filas de habitaciones */}
                  {rooms.map(room => (
                    <div 
                      key={room.id} 
                      className="grid grid-cols-[200px_repeat(31,1fr)] gap-1 mb-1"
                    >
                      <div className="font-medium p-2">
                        <div>{room.number}</div>
                        <div className="text-sm text-gray-600">{room.type}</div>
                      </div>
                      {getMonthDates().map((date, index) => {
                        const reservation = isReservationVisible(room, date)
                        return (
                          <div 
                            key={index}
                            className={`h-16 rounded-lg border relative
                              ${reservation 
                                ? reservation.color 
                                : isWeekend(date)
                                  ? 'border-gray-200 bg-gray-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }
                              ${reservation?.isStart ? 'rounded-l-lg' : ''}
                              ${reservation?.isEnd ? 'rounded-r-lg' : ''}
                            `}
                          >
                            {reservation && (
                              <div className="p-1 text-xs absolute inset-0 overflow-hidden">
                                {reservation.isStart && (
                                  <>
                                    <div className="font-medium truncate">
                                      {reservation.guestName}
                                    </div>
                                    <Badge 
                                      color="primary" 
                                      size="sm"
                                      className="mt-1"
                                    >
                                      {reservation.status}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

// Función auxiliar para determinar si una reservación comienza en esta fecha
function isReservationStart(reservation: any, date: Date) {
  return reservation?.checkIn.getDate() === date.getDate() &&
         reservation?.checkIn.getMonth() === date.getMonth() &&
         reservation?.checkIn.getFullYear() === date.getFullYear()
}

// Función auxiliar para determinar si una reservación termina en esta fecha
function isReservationEnd(reservation: any, date: Date) {
  return reservation?.checkOut.getDate() === date.getDate() &&
         reservation?.checkOut.getMonth() === date.getMonth() &&
         reservation?.checkOut.getFullYear() === date.getFullYear()
}