'use client'

import { Card, CardBody } from "@nextui-org/react"
import { GlobalSearch } from "@/components/GlobalSearch"
import { 
  ChartBarIcon, 
  UsersIcon, 
  CreditCardIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'

export default function Home() {
  const handleSearch = (filters: any) => {
    console.log('Global search filters:', filters)
    // Implementar lógica de búsqueda
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your hotel today.</p>
      </div>

      {/* Global Search */}
      <div className="mb-8">
        <GlobalSearch onSearch={handleSearch} variant="compact" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value="125"
          change="+12%"
          icon={CalendarIcon}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value="$12,426"
          change="+8%"
          icon={CreditCardIcon}
          color="green"
        />
        <StatCard
          title="New Guests"
          value="48"
          change="+18%"
          icon={UsersIcon}
          color="purple"
        />
        <StatCard
          title="Occupancy Rate"
          value="76%"
          change="+5%"
          icon={ChartBarIcon}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-4">Today's Check-ins</h2>
            {/* Implementar lista de check-ins */}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            {/* Implementar lista de reservas recientes */}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-sm text-green-600 mt-1">{change} from last month</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  )
} 