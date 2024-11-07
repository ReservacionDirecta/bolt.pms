'use client'
import { Input, Select, SelectItem } from '@nextui-org/react'
import type { Guest } from '../../../types'

interface GuestInformationProps {
  guest?: Partial<Guest>
  onSubmit: (guest: Guest) => void
}

export function GuestInformation({ guest, onSubmit }: GuestInformationProps) {
  const handleChange = (field: keyof Guest, value: string) => {
    onSubmit({
      ...(guest as Guest),
      [field]: value
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Guest Information</h2>
        <p className="text-gray-500">Please provide the guest details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={guest?.first_name || ''}
          onChange={(e) => handleChange('first_name', e.target.value)}
        />
        <Input
          label="Last Name"
          value={guest?.last_name || ''}
          onChange={(e) => handleChange('last_name', e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={guest?.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <Input
          label="Phone"
          type="tel"
          value={guest?.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        <Select
          label="Document Type"
          value={guest?.document_type || ''}
          onChange={(e) => handleChange('document_type', e.target.value)}
        >
          <SelectItem value="passport">Passport</SelectItem>
          <SelectItem value="id">ID Card</SelectItem>
          <SelectItem value="driver">Driver's License</SelectItem>
        </Select>
        <Input
          label="Document Number"
          value={guest?.document_number || ''}
          onChange={(e) => handleChange('document_number', e.target.value)}
        />
      </div>
    </div>
  )
} 