import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import { Button, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import { FaCalendarAlt } from 'react-icons/fa'

interface DateRange {
  from: Date | null
  to: Date | null
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          variant="bordered"
          startContent={<FaCalendarAlt />}
          className="w-full justify-start"
        >
          {value.from && value.to
            ? `${format(value.from, 'dd/MM/yyyy')} - ${format(value.to, 'dd/MM/yyyy')}`
            : 'Seleccionar fechas'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <DayPicker
          mode="range"
          selected={value.from && value.to ? { from: value.from, to: value.to } : undefined}
          onSelect={(range) => {
            onChange({
              from: range?.from || null,
              to: range?.to || null
            })
            if (range?.from && range?.to) {
              setIsOpen(false)
            }
          }}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
} 