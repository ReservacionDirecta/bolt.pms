'use client'

import { FaHome, FaCalendar, FaBed, FaUsers, FaCog } from 'react-icons/fa'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FaCalendar, label: 'Reservaciones', href: '/reservations' },
    { icon: FaBed, label: 'Habitaciones', href: '/rooms' },
    { icon: FaUsers, label: 'Huéspedes', href: '/guests' },
    { icon: FaCog, label: 'Configuración', href: '/settings' },
  ]

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Hotel Manager</h1>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700'
                    }`}
                >
                  <Icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
} 