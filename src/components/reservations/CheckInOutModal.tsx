'use client'
import { useState } from 'react'
import { Modal, Button, Input } from '@nextui-org/react'
import { supabase } from '../../lib/supabase/client'
import type { Reservation } from '../../types'

interface CheckInOutModalProps {
  isOpen: boolean
  onClose: () => void
  reservation: Reservation
  type: 'check-in' | 'check-out'
  onSuccess: () => void
}

export function CheckInOutModal({
  isOpen,
  onClose,
  reservation,
  type,
  onSuccess
}: CheckInOutModalProps) {
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    try {
      // Actualizar el estado de la reservación
      await supabase
        .from('reservations')
        .update({
          status: type === 'check-in' ? 'checked_in' : 'checked_out',
          notes: notes
        })
        .eq('id', reservation.id)

      // Actualizar el estado de la habitación
      await supabase
        .from('rooms')
        .update({
          status: type === 'check-in' ? 'occupied' : 'cleaning'
        })
        .eq('id', reservation.room_id)

      onSuccess()
      onClose()
    } catch (error) {
      console.error(`Error during ${type}:`, error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h3 className="text-lg font-bold">
          {type === 'check-in' ? 'Check-in' : 'Check-out'}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <p>Guest: {reservation.guest?.first_name} {reservation.guest?.last_name}</p>
            <p>Room: {reservation.room?.room_number}</p>
          </div>
          <Input
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="danger" variant="light" onPress={onClose}>
          Cancel
        </Button>
        <Button color="primary" onPress={handleSubmit}>
          Confirm {type === 'check-in' ? 'Check-in' : 'Check-out'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
} 