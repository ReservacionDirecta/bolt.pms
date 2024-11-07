import { ReservationWizard } from '@/components/reservations/ReservationWizard'
import { Sidebar } from '@/components/Sidebar'

export default function NewReservationPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">New Reservation</h1>
          <ReservationWizard />
        </div>
      </div>
    </div>
  )
} 