'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  reservation?: any
}

export function ReservationModal({ isOpen, onClose, onSave, reservation }: ReservationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{reservation ? 'Editar Reserva' : 'Nueva Reserva'}</ModalHeader>
        <ModalBody>
          <Input
            label="Huésped"
            placeholder="Nombre del huésped"
            defaultValue={reservation?.guestName}
          />
          <Select
            label="Habitación"
            placeholder="Selecciona una habitación"
            defaultSelectedKeys={reservation ? [reservation.roomId] : []}
          >
            <SelectItem key="101">101 - Individual</SelectItem>
            <SelectItem key="102">102 - Doble</SelectItem>
            <SelectItem key="103">103 - Suite</SelectItem>
          </Select>
          <Input
            label="Check-in"
            type="datetime-local"
            defaultValue={reservation?.start}
          />
          <Input
            label="Check-out"
            type="datetime-local"
            defaultValue={reservation?.end}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="primary" onPress={() => onSave({})}>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 