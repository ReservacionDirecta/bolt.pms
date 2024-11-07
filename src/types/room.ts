export interface Room {
  id: string
  room_type_id: string
  room_number: string
  status: 'available' | 'occupied' | 'maintenance' | 'blocked'
  type: string
  capacity: number
  amenities: any[]
  metadata: Record<string, any>
  rate: number
  room_type: {
    id: string
    name: string
    rate: number
    description: string
  }
} 