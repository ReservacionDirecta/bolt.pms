'use client'

import { Card, CardBody } from '@nextui-org/react'
import { FaBed, FaUsers, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa'

export default function HomePage() {
  // Estos datos vendrían de tu backend
  const stats = [
    {
      title: 'Habitaciones Ocupadas',
      value: '15/20',
      icon: FaBed,
      color: 'text-blue-500',
      percentage: '75%',
      trend: 'up'
    },
    {
      title: 'Huéspedes Actuales',
      value: '32',
      icon: FaUsers,
      color: 'text-green-500',
      percentage: '+12%',
      trend: 'up'
    },
    {
      title: 'Reservas Hoy',
      value: '8',
      icon: FaCalendarCheck,
      color: 'text-purple-500',
      percentage: '+3',
      trend: 'up'
    },
    {
      title: 'Ingresos del Día',
      value: '$2,500',
      icon: FaMoneyBillWave,
      color: 'text-yellow-500',
      percentage: '+15%',
      trend: 'up'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bienvenido al panel de control</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-none">
              <CardBody className="flex flex-row items-center gap-4">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className={`text-2xl ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-semibold">{stat.value}</h3>
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.percentage}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-none">
          <CardBody>
            <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Check-in: Habitación 101</p>
                    <p className="text-xs text-gray-500">Hace 30 minutos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none">
          <CardBody>
            <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Nueva Reserva', icon: FaCalendarCheck, color: 'bg-blue-500' },
                { title: 'Nuevo Huésped', icon: FaUsers, color: 'bg-green-500' },
                { title: 'Check-in', icon: FaBed, color: 'bg-purple-500' },
                { title: 'Check-out', icon: FaMoneyBillWave, color: 'bg-yellow-500' }
              ].map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    className="p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 
                             flex flex-col items-center gap-2 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${action.color} bg-opacity-10`}>
                      <Icon className={`text-xl ${action.color} text-opacity-90`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                  </button>
                )
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
} 