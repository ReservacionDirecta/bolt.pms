export interface RoomType {
  id: string;
  name: string;
  rate: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: string;
  room_type_id: string;
  room_number: string;
  status: 'available' | 'occupied' | 'maintenance' | 'blocked';
  type: string;
  capacity: number;
  rate: number;
  amenities: any[];
  metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  room_type?: RoomType;
}

export interface Guest {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  document_type?: string
  document_number?: string
  address?: string
  city?: string
  country?: string
  created_at?: string
  updated_at?: string
}

export interface Reservation {
  id?: string
  check_in: string
  check_out: string
  room_id: string
  guest_id: string
  status: string
  total_amount: number
  number_of_guests: number
  additional_services: AdditionalService[]
  created_at?: string
  updated_at?: string
}

export interface AdditionalService {
  id: string
  name: string
  price: number
  selected?: boolean
} 