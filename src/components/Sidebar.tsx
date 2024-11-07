'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/context/SidebarContext'
import { 
  HomeIcon, 
  CalendarIcon, 
  UsersIcon, 
  CreditCardIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()

  const menuItems = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', path: '/', icon: HomeIcon },
        { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
        { label: 'Reservations', path: '/reservations', icon: DocumentTextIcon },
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Rooms', path: '/rooms', icon: BuildingOfficeIcon },
        { label: 'Guests', path: '/guests', icon: UsersIcon },
        { label: 'Payments', path: '/payments', icon: CreditCardIcon },
      ]
    },
    {
      title: 'Administration',
      items: [
        { label: 'Reports', path: '/reports', icon: ChartBarIcon },
        { label: 'Settings', path: '/settings', icon: CogIcon },
      ]
    }
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 md:p-6">
          <h1 className="text-2xl font-bold text-gray-800">HotelHub</h1>
          <button 
            onClick={toggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            toggle()
                          }
                        }}
                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors
                          ${pathname === item.path
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
