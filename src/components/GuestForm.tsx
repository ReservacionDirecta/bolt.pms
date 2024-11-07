'use client'

import { useState } from 'react'
import { Input, Button, Select, SelectItem } from '@nextui-org/react'

interface GuestFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function GuestForm({ initialData, onSubmit, onCancel }: GuestFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    document_type: initialData?.document_type || 'dni',
    document_number: initialData?.document_number || '',
    nationality: initialData?.nationality || '',
    address: initialData?.address || '',
    emergency_contact: initialData?.emergency_contact || '',
    emergency_phone: initialData?.emergency_phone || ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre Completo"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />

      <Input
        type="email"
        label="Correo Electrónico"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />

      <Input
        label="Teléfono"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        required
      />

      <div className="flex gap-4">
        <Select
          label="Tipo de Documento"
          value={formData.document_type}
          onChange={(e) => handleChange('document_type', e.target.value)}
          className="flex-1"
          required
        >
          <SelectItem value="dni">DNI</SelectItem>
          <SelectItem value="passport">Pasaporte</SelectItem>
          <SelectItem value="other">Otro</SelectItem>
        </Select>

        <Input
          label="Número de Documento"
          value={formData.document_number}
          onChange={(e) => handleChange('document_number', e.target.value)}
          className="flex-1"
          required
        />
      </div>

      <Input
        label="Nacionalidad"
        value={formData.nationality}
        onChange={(e) => handleChange('nationality', e.target.value)}
        required
      />

      <Input
        label="Dirección"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
      />

      <div className="flex gap-4">
        <Input
          label="Contacto de Emergencia"
          value={formData.emergency_contact}
          onChange={(e) => handleChange('emergency_contact', e.target.value)}
          className="flex-1"
        />

        <Input
          label="Teléfono de Emergencia"
          value={formData.emergency_phone}
          onChange={(e) => handleChange('emergency_phone', e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button color="danger" variant="light" onPress={onCancel}>
          Cancelar
        </Button>
        <Button color="primary" type="submit">
          {initialData ? 'Actualizar' : 'Crear'} Huésped
        </Button>
      </div>
    </form>
  )
} 