'use client'

export default function Dashboard({ supabase }) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Total Rooms"
          value="20"
          icon="🏠"
          color="blue"
        />
        <DashboardCard 
          title="Available Rooms"
          value="15"
          icon="✅"
          color="green"
        />
        <DashboardCard 
          title="Today's Check-ins"
          value="5"
          icon="📥"
          color="purple"
        />
      </div>
    </div>
  )
}

function DashboardCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <span className={`p-2 rounded-full ${colorClasses[color]}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
} 