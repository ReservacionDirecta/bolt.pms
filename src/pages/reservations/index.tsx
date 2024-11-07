'use client'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FaPlus } from 'react-icons/fa'
import { ReservationList } from '@/components/reservations/ReservationList'
import { Sidebar } from '@/components/Sidebar'

export default function ReservationsPage() {
  const router = useRouter()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Reservations</h1>
            <Button
              color="primary"
              startContent={<FaPlus />}
              onPress={() => router.push('/reservations/new')}
            >
              New Reservation
            </Button>
          </div>
          <ReservationList />
        </div>
      </div>
    </div>
  )
} 