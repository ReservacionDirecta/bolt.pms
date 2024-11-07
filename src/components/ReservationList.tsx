'use client'
import { Table, Button } from '@nextui-org/react'

export function ReservationList() {
  const reservations = [
    // Aquí irían tus datos de reservaciones desde Supabase
  ]

  return (
    <Table
      aria-label="Reservations table"
    >
      <Table.Header>
        <Table.Column>Guest</Table.Column>
        <Table.Column>Room</Table.Column>
        <Table.Column>Check-in</Table.Column>
        <Table.Column>Check-out</Table.Column>
        <Table.Column>Status</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body>
        {/* Aquí irían las filas de reservaciones */}
      </Table.Body>
    </Table>
  )
} 