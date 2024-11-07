import React, { useState } from 'react'
import DateSelection from './DateSelection'

export default function ReservationWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    checkIn: null as Date | null,
    checkOut: null as Date | null,
    adults: 1,
    children: 0
  })

  const handleDateSelectionChange = (data: {
    checkIn?: Date | null,
    checkOut?: Date | null,
    adults?: number,
    children?: number
  }) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {step === 1 && (
        <DateSelection
          checkIn={formData.checkIn}
          checkOut={formData.checkOut}
          adults={formData.adults}
          children={formData.children}
          onChange={handleDateSelectionChange}
        />
      )}
      {/* ... otros pasos ... */}
    </div>
  )
} 