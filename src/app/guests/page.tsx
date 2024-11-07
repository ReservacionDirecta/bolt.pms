'use client'

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input } from "@nextui-org/react"
import { SearchIcon } from './SearchIcon'

export default function GuestsPage() {
  const guests = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      lastStay: "2024-01-15",
      totalStays: 3
    },
    // Más datos de ejemplo...
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Guests</h1>
        <Button color="primary">Add Guest</Button>
      </div>

      <div className="flex justify-end mb-4">
        <Input
          className="w-64"
          placeholder="Search guests..."
          startContent={<SearchIcon />}
        />
      </div>

      <Table aria-label="Guests table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE</TableColumn>
          <TableColumn>LAST STAY</TableColumn>
          <TableColumn>TOTAL STAYS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.lastStay}</TableCell>
              <TableCell>{guest.totalStays}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" color="primary">Edit</Button>
                  <Button size="sm" color="danger">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 