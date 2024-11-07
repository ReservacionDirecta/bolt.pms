'use client'

import { 
  Input, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem
} from "@nextui-org/react"
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface SearchFiltersProps {
  onSearch: (filters: any) => void
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
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

  const creatorOptions = [
    { label: 'System', value: 'system' },
    { label: 'Staff', value: 'staff' },
    { label: 'Channel Manager', value: 'channel' }
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

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
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
            Clear Filters
          </Button>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Ranges */}
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button 
                variant="flat" 
                startContent={<CalendarIcon className="w-5 h-5" />}
                className="w-full justify-start"
              >
                Creation Date
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <DatePicker
                  selectsRange
                  startDate={filters.dateRange.created.start}
                  endDate={filters.dateRange.created.end}
                  onChange={(range) => handleDateRangeChange(range, 'created')}
                  inline
                />
              </div>
            </PopoverContent>
          </Popover>

          <Popover placement="bottom">
            <PopoverTrigger>
              <Button 
                variant="flat" 
                startContent={<CalendarIcon className="w-5 h-5" />}
                className="w-full justify-start"
              >
                Check-in Date
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <DatePicker
                  selectsRange
                  startDate={filters.dateRange.checkIn.start}
                  endDate={filters.dateRange.checkIn.end}
                  onChange={(range) => handleDateRangeChange(range, 'checkIn')}
                  inline
                />
              </div>
            </PopoverContent>
          </Popover>

          <Popover placement="bottom">
            <PopoverTrigger>
              <Button 
                variant="flat" 
                startContent={<CalendarIcon className="w-5 h-5" />}
                className="w-full justify-start"
              >
                Check-out Date
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4">
                <DatePicker
                  selectsRange
                  startDate={filters.dateRange.checkOut.start}
                  endDate={filters.dateRange.checkOut.end}
                  onChange={(range) => handleDateRangeChange(range, 'checkOut')}
                  inline
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Tercera fila */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <Select
            label="Channel"
            selectionMode="multiple"
            placeholder="Select channel"
            selectedKeys={filters.channel}
            onSelectionChange={(keys) => setFilters(prev => ({ ...prev, channel: keys }))}
          >
            {channelOptions.map((channel) => (
              <SelectItem key={channel.value} value={channel.value}>
                {channel.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Creator"
            selectionMode="multiple"
            placeholder="Select creator"
            selectedKeys={filters.creator}
            onSelectionChange={(keys) => setFilters(prev => ({ ...prev, creator: keys }))}
          >
            {creatorOptions.map((creator) => (
              <SelectItem key={creator.value} value={creator.value}>
                {creator.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
} 