'use client'

import { 
  Input, 
  Button, 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  Select, 
  SelectItem,
} from "@nextui-org/react"
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface GlobalSearchProps {
  onSearch: (filters: any) => void
  variant?: 'full' | 'compact'
}

export function GlobalSearch({ onSearch, variant = 'full' }: GlobalSearchProps) {
  const [filters, setFilters] = useState({
    search: '',
    dateRange: {
      created: { start: null, end: null },
      checkIn: { start: null, end: null },
      checkOut: { start: null, end: null }
    },
    status: new Set([]),
    channel: new Set([]),
    creator: new Set([])
  })

  const statusOptions = [
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Checked In', value: 'checked_in' },
    { label: 'Checked Out', value: 'checked_out' }
  ]

  const channelOptions = [
    { label: 'Direct', value: 'direct' },
    { label: 'Booking.com', value: 'booking' },
    { label: 'Expedia', value: 'expedia' },
    { label: 'Airbnb', value: 'airbnb' }
  ]

  const handleDateRangeChange = (range: [Date | null, Date | null], type: string) => {
    const [start, end] = range
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: { start, end }
      }
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      dateRange: {
        created: { start: null, end: null },
        checkIn: { start: null, end: null },
        checkOut: { start: null, end: null }
      },
      status: new Set([]),
      channel: new Set([]),
      creator: new Set([])
    })
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="Search reservations..."
            startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button variant="flat">Advanced Search</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4 w-80">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <DateRangeSelector
                      label="Check-in"
                      startDate={filters.dateRange.checkIn.start}
                      endDate={filters.dateRange.checkIn.end}
                      onChange={(range) => handleDateRangeChange(range, 'checkIn')}
                    />
                    <DateRangeSelector
                      label="Check-out"
                      startDate={filters.dateRange.checkOut.start}
                      endDate={filters.dateRange.checkOut.end}
                      onChange={(range) => handleDateRangeChange(range, 'checkOut')}
                    />
                    <Select
                      label="Status"
                      selectionMode="multiple"
                      placeholder="Select status"
                      selectedKeys={filters.status}
                      onSelectionChange={(keys) => setFilters(prev => ({ ...prev, status: keys }))}
                    >
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="flat" onClick={clearFilters}>Clear</Button>
                    <Button color="primary" onClick={handleSearch}>Search</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="space-y-4">
        {/* Primera fila */}
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            className="flex-1"
            placeholder="Search by guest name, room, or reservation ID..."
            startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Button 
            color="primary" 
            className="w-full md:w-auto"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button 
            variant="flat" 
            className="w-full md:w-auto"
            onClick={clearFilters}
            startContent={<XMarkIcon className="w-5 h-5" />}
          >
            Clear
          </Button>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateRangeSelector
            label="Check-in"
            startDate={filters.dateRange.checkIn.start}
            endDate={filters.dateRange.checkIn.end}
            onChange={(range) => handleDateRangeChange(range, 'checkIn')}
          />
          <DateRangeSelector
            label="Check-out"
            startDate={filters.dateRange.checkOut.start}
            endDate={filters.dateRange.checkOut.end}
            onChange={(range) => handleDateRangeChange(range, 'checkOut')}
          />
          <Select
            label="Status"
            selectionMode="multiple"
            placeholder="Select status"
            selectedKeys={filters.status}
            onSelectionChange={(keys) => setFilters(prev => ({ ...prev, status: keys }))}
          >
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}

function DateRangeSelector({ label, startDate, endDate, onChange }) {
  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button 
          variant="flat" 
          startContent={<CalendarIcon className="w-5 h-5" />}
          className="w-full justify-start"
        >
          {label}: {startDate ? `${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString() || 'Select'}` : 'Select dates'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={onChange}
            inline
          />
        </div>
      </PopoverContent>
    </Popover>
  )
} 