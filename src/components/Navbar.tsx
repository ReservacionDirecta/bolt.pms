'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  HomeIcon, 
  CalendarIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  EllipsisHorizontalIcon,
  ClipboardIcon
} from '@heroicons/react/24/outline'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from "@nextui-org/react"
import { useLocale } from '@/hooks/useLocale'

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLocale()

  // Menú principal
  const mainNavItems = [
    { name: t('menu.dashboard'), icon: HomeIcon, path: '/' },
    { name: t('menu.calendar'), icon: CalendarIcon, path: '/calendar' },
    { name: t('menu.reservations'), icon: ClipboardDocumentListIcon, path: '/reservations' },
    { name: t('menu.rooms'), icon: BuildingOfficeIcon, path: '/rooms' },
    { name: t('menu.guests'), icon: UsersIcon, path: '/guests' }
  ]

  // Opciones adicionales para el menú More
  const moreOptions = [
    { name: 'Huéspedes', icon: UsersIcon, path: '/guests' },
    { name: 'Tarifas', icon: CurrencyDollarIcon, path: '/rates' },
    { name: 'Limpieza', icon: ClipboardIcon, path: '/housekeeping' },
    { name: 'Estadísticas', icon: ChartBarIcon, path: '/statistics' },
    { name: 'Configuración', icon: Cog6ToothIcon, path: '/settings' }
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
        <div className="w-full p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-8">HotelHub</h1>
          <nav className="space-y-1">
            {mainNavItems.slice(0, -1).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                    ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <div className="pt-4 border-t border-gray-200">
              {moreOptions.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                      ${isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            
            if (item.name === 'Más') {
              return (
                <Dropdown key={item.name} placement="top">
                  <DropdownTrigger>
                    <button className="flex flex-col items-center justify-center w-full h-full text-gray-600">
                      <Icon className="w-6 h-6" />
                      <span className="text-xs mt-1">{item.name}</span>
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="More options">
                    {moreOptions.map((option) => {
                      const OptionIcon = option.icon
                      return (
                        <DropdownItem
                          key={option.name}
                          startContent={<OptionIcon className="w-5 h-5" />}
                          as={Link}
                          href={option.path}
                          className={isActive(option.path) ? 'text-blue-600' : ''}
                        >
                          {option.name}
                        </DropdownItem>
                      )
                    })}
                  </DropdownMenu>
                </Dropdown>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex flex-col items-center justify-center w-full h-full
                  ${isActive(item.path) ? 'text-blue-600' : 'text-gray-600'}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
} 