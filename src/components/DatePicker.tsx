'use client'

import { Input } from '@nextui-org/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DatePickerProps {
  label: string
  value: Date
  onChange: (date: Date) => void
  errorMessage?: string
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({ 
  label, 
  value, 
  onChange, 
  errorMessage,
  minDate,
  maxDate 
}: DatePickerProps) {
  return (
    <Input
      type="date"
      label={label}
      value={format(value, 'yyyy-MM-dd')}
      onChange={(e) => {
        const date = new Date(e.target.value)
        onChange(date)
      }}
      errorMessage={errorMessage}
      min={minDate ? format(minDate, 'yyyy-MM-dd') : undefined}
      max={maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined}
    />
  )
} 