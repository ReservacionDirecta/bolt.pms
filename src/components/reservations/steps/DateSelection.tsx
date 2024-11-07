'use client'
import { useState, useEffect } from 'react'
import { Card, Button } from '@nextui-org/react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { FaUser, FaChild, FaMinus, FaPlus } from 'react-icons/fa'
import { supabase } from '../../../lib/supabase/client'
import type { Room } from '../../../types'

interface DateSelectionProps {
  checkIn?: string
  checkOut?: string
  onSelect: (data: {
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
  }) => void
}

export function DateSelection({ checkIn, checkOut, onSelect }: DateSelectionProps) {
  const [dates, setDates] = useState({
    checkIn: checkIn ? dayjs(checkIn) : dayjs(),
    checkOut: checkOut ? dayjs(checkOut) : dayjs().add(1, 'day')
  })

  const [guests, setGuests] = useState({
    adults: 2,
    children: 0
  })

  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [maxCapacity, setMaxCapacity] = useState(0)

  // Constantes base
  const MIN_ADULTS = 1
  const MAX_CHILDREN_RATIO = 0.6 // 60% del máximo total pueden ser niños

  const updateSelection = () => {
    onSelect({
      check_in: dates.checkIn.format('YYYY-MM-DD'),
      check_out: dates.checkOut.format('YYYY-MM-DD'),
      adults: guests.adults,
      children: guests.children
    })
  }

  const adjustGuestsToCapacity = (newMaxCapacity: number) => {
    setGuests(prev => {
      const totalGuests = prev.adults + prev.children
      if (totalGuests > newMaxCapacity) {
        // Primero ajustar niños si exceden el límite
        const maxChildren = Math.floor(newMaxCapacity * MAX_CHILDREN_RATIO)
        const newChildren = Math.min(prev.children, maxChildren)
        
        // Luego ajustar adultos manteniendo al menos uno
        const remainingCapacity = newMaxCapacity - newChildren
        const newAdults = Math.max(MIN_ADULTS, Math.min(prev.adults, remainingCapacity))

        return {
          adults: newAdults,
          children: newChildren
        }
      }
      return prev
    })
  }

  const fetchAvailableRooms = async () => {
    try {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available')

      if (error) throw error

      setAvailableRooms(rooms || [])
      
      // Calcular la capacidad máxima (la habitación con mayor capacidad)
      const maxRoomCapacity = Math.max(...(rooms?.map(room => room.max_occupancy) || [4]))
      setMaxCapacity(maxRoomCapacity)

      // Ajustar huéspedes si exceden la nueva capacidad máxima
      adjustGuestsToCapacity(maxRoomCapacity)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const getMaxAdults = () => {
    return maxCapacity - guests.children
  }

  const getMaxChildren = () => {
    return Math.min(
      maxCapacity - guests.adults,
      Math.floor(maxCapacity * MAX_CHILDREN_RATIO)
    )
  }

  const handleGuestChange = (type: 'adults' | 'children', value: number) => {
    const updatedGuests = {
      ...guests,
      [type]: value
    }
    setGuests(updatedGuests)
    
    // Actualizar el número total de huéspedes en la reserva
    onSelect({
      check_in: dates.checkIn.format('YYYY-MM-DD'),
      check_out: dates.checkOut.format('YYYY-MM-DD'),
      number_of_guests: updatedGuests.adults + updatedGuests.children
    })
  }

  // Effects
  useEffect(() => {
    fetchAvailableRooms()
  }, [dates.checkIn, dates.checkOut])

  useEffect(() => {
    updateSelection()
  }, [dates, guests])

  const GuestCounter = ({ 
    type, 
    value, 
    icon: Icon,
    label 
  }: { 
    type: 'adults' | 'children', 
    value: number,
    icon: any,
    label: string 
  }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="text-gray-500" />
        {label}
      </label>
      <div className="flex items-center justify-between p-2 border rounded-lg">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => handleGuestChange(type, value - 1)}
          isDisabled={type === 'adults' ? value <= MIN_ADULTS : value <= 0}
        >
          <FaMinus />
        </Button>
        <span className="text-lg font-semibold min-w-[3rem] text-center">
          {value}
        </span>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => handleGuestChange(type, value + 1)}
          isDisabled={
            type === 'adults' 
              ? value >= getMaxAdults()
              : value >= getMaxChildren()
          }
        >
          <FaPlus />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select Dates & Guests</h2>
        <p className="text-gray-500">Choose your stay dates and number of guests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker
                  label="Check-in Date"
                  value={dates.checkIn}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDates(prev => ({
                        ...prev,
                        checkIn: newValue,
                        checkOut: newValue.isAfter(prev.checkOut) ? 
                          newValue.add(1, 'day') : prev.checkOut
                      }))
                    }
                  }}
                  minDate={dayjs()}
                />
                <DatePicker
                  label="Check-out Date"
                  value={dates.checkOut}
                  onChange={(newValue) => {
                    if (newValue) {
                      setDates(prev => ({
                        ...prev,
                        checkOut: newValue
                      }))
                    }
                  }}
                  minDate={dates.checkIn.add(1, 'day')}
                />
              </div>
            </LocalizationProvider>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Number of Guests</h3>
            <div className="space-y-4">
              <GuestCounter
                type="adults"
                value={guests.adults}
                icon={FaUser}
                label="Adults"
              />
              <GuestCounter
                type="children"
                value={guests.children}
                icon={FaChild}
                label="Children (2-12 years)"
              />
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <p>Maximum {maxCapacity} guests per room</p>
                <p>Maximum {Math.floor(maxCapacity * MAX_CHILDREN_RATIO)} children allowed</p>
                {availableRooms.length > 0 && (
                  <p>
                    Available room types:{' '}
                    {Array.from(new Set(availableRooms.map(room => room.type))).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2">
              <h3 className="font-medium">Stay Summary</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span>{dates.checkIn.format('MMM DD, YYYY')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span>{dates.checkOut.format('MMM DD, YYYY')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights</span>
                  <span>{dates.checkOut.diff(dates.checkIn, 'day')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests</span>
                  <span>
                    {guests.adults + guests.children} total (
                    {guests.adults} {guests.adults === 1 ? 'adult' : 'adults'}
                    {guests.children > 0 
                      ? `, ${guests.children} ${guests.children === 1 ? 'child' : 'children'}` 
                      : ''
                    })
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 