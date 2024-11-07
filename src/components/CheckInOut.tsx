'use client'
import { Button, Card, Input } from '@nextui-org/react'

export function CheckInOut() {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Quick Check-in/out</h2>
      <div className="space-y-4">
        <Input
          label="Reservation ID or Guest Name"
          placeholder="Enter reservation ID or guest name"
        />
        <div className="flex gap-2">
          <Button color="success">Check-in</Button>
          <Button color="danger">Check-out</Button>
        </div>
      </div>
    </Card>
  )
} 