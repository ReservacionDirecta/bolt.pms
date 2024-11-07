import { useState } from 'react'
import { 
  Card, 
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@nextui-org/react'
import { DateRangePicker } from '../common/DateRangePicker'
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'

interface DateRange {
  from: Date | null
  to: Date | null
}

interface SearchFilters {
  dateRanges: {
    created: DateRange
    checkIn: DateRange
    checkOut: DateRange
    cancelled: DateRange
    confirmed: DateRange
  }
  status: string[]
  searchTerm: string
}

const INITIAL_FILTERS: SearchFilters = {
  dateRanges: {
    created: { from: null, to: null },
    checkIn: { from: null, to: null },
    checkOut: { from: null, to: null },
    cancelled: { from: null, to: null },
    confirmed: { from: null, to: null }
  },
  status: [],
  searchTerm: ''
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'completed', label: 'Completada' }
]

export function ReservationSearch({ onSearch }: { onSearch: (filters: SearchFilters) => void }) {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS)
  const [isOpen, setIsOpen] = useState(false)

  const handleDateRangeChange = (type: keyof SearchFilters['dateRanges']) => (range: DateRange) => {
    setFilters(prev => ({
      ...prev,
      dateRanges: {
        ...prev.dateRanges,
        [type]: range
      }
    }))
  }

  const handleStatusChange = (values: string[]) => {
    setFilters(prev => ({
      ...prev,
      status: values
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
    onSearch(INITIAL_FILTERS)
  }

  return (
    <Card className="mb-6">
      <CardBody>
        <div className="flex flex-col gap-4">
          {/* Barra de búsqueda principal */}
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nombre, email o número de habitación..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              startContent={<FaSearch className="text-gray-400" />}
              className="flex-1"
            />
            <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger>
                <Button 
                  variant="flat"
                  startContent={<FaFilter />}
                >
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-4">
                <div className="space-y-4">
                  {/* Filtros de fechas */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Fecha de Creación</h3>
                    <DateRangePicker
                      value={filters.dateRanges.created}
                      onChange={handleDateRangeChange('created')}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Check-in</h3>
                    <DateRangePicker
                      value={filters.dateRanges.checkIn}
                      onChange={handleDateRangeChange('checkIn')}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Check-out</h3>
                    <DateRangePicker
                      value={filters.dateRanges.checkOut}
                      onChange={handleDateRangeChange('checkOut')}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Fecha de Cancelación</h3>
                    <DateRangePicker
                      value={filters.dateRanges.cancelled}
                      onChange={handleDateRangeChange('cancelled')}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Fecha de Confirmación</h3>
                    <DateRangePicker
                      value={filters.dateRanges.confirmed}
                      onChange={handleDateRangeChange('confirmed')}
                    />
                  </div>

                  {/* Estado de la reserva */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Estado</h3>
                    <Select
                      selectionMode="multiple"
                      placeholder="Seleccionar estados"
                      selectedKeys={filters.status}
                      onSelectionChange={(keys) => handleStatusChange(Array.from(keys) as string[])}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="light"
                      startContent={<FaTimes />}
                      onPress={handleReset}
                    >
                      Limpiar
                    </Button>
                    <Button
                      color="primary"
                      startContent={<FaSearch />}
                      onPress={() => {
                        handleSearch()
                        setIsOpen(false)
                      }}
                    >
                      Buscar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Chips de filtros activos */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters.dateRanges).map(([key, range]) => {
              if (range.from && range.to) {
                return (
                  <Chip
                    key={key}
                    onClose={() => handleDateRangeChange(key as keyof SearchFilters['dateRanges'])({ from: null, to: null })}
                    variant="flat"
                    size="sm"
                  >
                    {`${key}: ${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`}
                  </Chip>
                )
              }
              return null
            })}
            {filters.status.map((status) => (
              <Chip
                key={status}
                onClose={() => handleStatusChange(filters.status.filter(s => s !== status))}
                variant="flat"
                size="sm"
              >
                {STATUS_OPTIONS.find(opt => opt.value === status)?.label}
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
} 