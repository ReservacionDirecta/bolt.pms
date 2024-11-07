'use client'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'

export function ReservationTable() {
  const [reservations, setReservations] = useState([
    {
      id: "1",
      guest: "John Doe",
      room: "101",
      checkIn: "2024-01-20",
      checkOut: "2024-01-25",
      status: "confirmed"
    },
    {
      id: "2",
      guest: "Jane Smith",
      room: "102",
      checkIn: "2024-01-21",
      checkOut: "2024-01-23",
      status: "checked_in"
    }
  ])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Guest</th>
            <th className="px-4 py-2 text-left">Room</th>
            <th className="px-4 py-2 text-left">Check-in</th>
            <th className="px-4 py-2 text-left">Check-out</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b">
              <td className="px-4 py-2">{reservation.guest}</td>
              <td className="px-4 py-2">{reservation.room}</td>
              <td className="px-4 py-2">{reservation.checkIn}</td>
              <td className="px-4 py-2">{reservation.checkOut}</td>
              <td className="px-4 py-2">{reservation.status}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button size="sm" color="primary">Edit</Button>
                  <Button size="sm" color="secondary">Check-in</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 