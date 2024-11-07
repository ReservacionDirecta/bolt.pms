'use client'

import { Card, CardBody } from '@nextui-org/react'
import { FaUsers, FaBed, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa'
import { useState } from 'react'

export default function DashboardPage() {
  const [stats] = useState({
    occupancyRate: 75,
    totalReservations: 12,
    availableRooms: 5,
    todayCheckIns: 3,
    revenue: 1500
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FaBed className="text-2xl text-primary" />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Ocupación</h2>
              <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <FaCalendarCheck className="text-2xl text-success" />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Check-ins Hoy</h2>
              <p className="text-2xl font-bold">{stats.todayCheckIns}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <FaUsers className="text-2xl text-warning" />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Habitaciones Disponibles</h2>
              <p className="text-2xl font-bold">{stats.availableRooms}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <FaMoneyBillWave className="text-2xl text-secondary" />
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Ingresos del Día</h2>
              <p className="text-2xl font-bold">
                ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
} 