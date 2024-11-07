'use client'
import { useState } from 'react'
import { Card } from '@nextui-org/react'

export function ReservationCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Reservation Calendar</h2>
        {/* Agregar controles de navegación del calendario */}
      </div>
      {/* Aquí irá la implementación del calendario */}
    </Card>
  )
} 