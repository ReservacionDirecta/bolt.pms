'use client'

import { Card, CardBody, CardFooter, Button, Badge } from "@nextui-org/react"

export default function RoomsPage() {
  const rooms = [
    {
      id: "101",
      type: "Deluxe King",
      status: "available",
      price: "$150/night",
      capacity: "2 guests",
      amenities: ["WiFi", "TV", "Mini Bar"]
    },
    // Más datos de ejemplo...
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <Button color="primary">Add Room</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardBody>
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Room {room.id}</h3>
                  <p className="text-gray-600">{room.type}</p>
                </div>
                <Badge color={room.status === 'available' ? 'success' : 'warning'}>
                  {room.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <p>Price: {room.price}</p>
                <p>Capacity: {room.capacity}</p>
                <div className="flex flex-wrap gap-1">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="flat">{amenity}</Badge>
                  ))}
                </div>
              </div>
            </CardBody>
            <CardFooter className="justify-end gap-2">
              <Button size="sm" color="primary">Edit</Button>
              <Button size="sm" color="danger">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 