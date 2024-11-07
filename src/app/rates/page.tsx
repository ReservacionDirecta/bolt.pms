'use client'

import { 
  Button,
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell,
  Card,
  CardBody
} from "@nextui-org/react"
import { 
  PlusIcon, 
  PencilSquareIcon, 
  CalendarDaysIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { useLocale } from '@/hooks/useLocale'

export default function RatesPage() {
  const { t, formatCurrency } = useLocale()

  const roomTypes = [
    {
      id: '1',
      name: 'Habitación Estándar',
      baseRate: 1000,
      weekendRate: 1200,
      seasonalRates: []
    },
    {
      id: '2',
      name: 'Habitación Superior',
      baseRate: 1500,
      weekendRate: 1800,
      seasonalRates: []
    }
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('rates.title')}
          </h1>
          <p className="text-gray-600">
            {t('rates.subtitle')}
          </p>
        </div>
        <Button 
          color="primary" 
          startContent={<PlusIcon className="w-5 h-5" />}
        >
          {t('rates.addRoom')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Tarifa Promedio</h3>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(1200)}</p>
            <p className="text-sm text-gray-600 mt-2">Últimos 30 días</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Temporadas Activas</h3>
            </div>
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-gray-600 mt-2">Tarifas especiales</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-4">
              <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Premium Fin de Semana</h3>
            </div>
            <p className="text-3xl font-bold">+20%</p>
            <p className="text-sm text-gray-600 mt-2">Incremento promedio</p>
          </CardBody>
        </Card>
      </div>

      {/* Rates Table */}
      <Card>
        <CardBody>
          <Table aria-label="Tabla de tarifas">
            <TableHeader>
              <TableColumn>TIPO DE HABITACIÓN</TableColumn>
              <TableColumn>TARIFA BASE</TableColumn>
              <TableColumn>TARIFA FIN DE SEMANA</TableColumn>
              <TableColumn>TEMPORADAS</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {roomTypes.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{formatCurrency(room.baseRate)}</TableCell>
                  <TableCell>{formatCurrency(room.weekendRate)}</TableCell>
                  <TableCell>{room.seasonalRates.length} activas</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<PencilSquareIcon className="w-4 h-4" />}
                    >
                      {t('common.actions.edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
} 