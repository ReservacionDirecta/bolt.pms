'use client'

import { ReservationCalendar } from '@/components/ReservationCalendar'

export default function CalendarPage() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendario</h1>
        <p className="text-gray-600">Vista general de las reservas</p>
      </div>
      
      <ReservationCalendar />
    </div>
  )
} 