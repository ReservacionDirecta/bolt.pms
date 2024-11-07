'use client'

import { useState } from 'react'
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUsers, 
  FaCog, 
  FaBed, 
  FaBookmark,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa'
import { IoMenu } from 'react-icons/io5'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Drawer, 
  DrawerContent, 
  DrawerBody,
  Avatar,
  Button
} from '@nextui-org/react'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const mainMenuItems = [
    { icon: FaHome, label: 'Dashboard', href: '/' },
    { icon: FaBookmark, label: 'Reservas', href: '/reservations' },
    { icon: FaBed, label: 'Habitaciones', href: '/rooms' },
    { icon: FaUsers, label: 'Huéspedes', href: '/guests' },
  ]

  const configMenuItems = [
    { icon: FaCog, label: 'Configuración', href: '/settings' },
    { icon: FaSignOutAlt, label: 'Cerrar Sesión', href: '/logout' },
  ]

  // Componente para el menú móvil (bottom navigation)
  const MobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {mainMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className="relative group"
            >
              <div className={`flex flex-col items-center ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}>
                <Icon className="text-xl mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </div>
            </Link>
          )
        })}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center text-gray-500 hover:text-blue-600"
          type="button"
        >
          <IoMenu className="text-xl mb-1" />
          <span className="text-xs font-medium">Menú</span>
        </button>
      </div>
    </nav>
  )

  // Componente para el menú desktop
  const DesktopNav = () => (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bolt PMS</h1>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 space-y-1">
          {mainMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
              >
                <Icon className={`text-xl ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-6 rounded-full bg-blue-600" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Menu */}
        <div className="mt-auto pt-4 border-t border-gray-200 space-y-1">
          {configMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
              >
                <Icon className="text-xl text-gray-400" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* User Profile */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-2">
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <DesktopNav />
      <MobileNav />
      
      {/* Mobile Menu Drawer */}
      <Drawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        placement="bottom"
        size="sm"
      >
        <DrawerContent>
          <DrawerBody className="py-6 px-4">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                size="md"
              />
              <div>
                <p className="font-medium text-gray-900">Admin User</p>
                <p className="text-sm text-gray-500">admin@example.com</p>
              </div>
            </div>

            <div className="space-y-4">
              {configMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.href}
                    startContent={<Icon className="text-xl" />}
                    className="w-full justify-start"
                    variant="light"
                    onPress={() => {
                      setIsOpen(false)
                      // Aquí iría la navegación
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
} 