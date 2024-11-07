import { 
  FaWifi, 
  FaTv, 
  FaSnowflake, 
  FaCoffee, 
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaCocktail,
  FaHotTub,
  FaDumbbell
} from 'react-icons/fa'

export const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: FaWifi },
  { id: 'tv', label: 'TV', icon: FaTv },
  { id: 'ac', label: 'Air Conditioning', icon: FaSnowflake },
  { id: 'coffee', label: 'Coffee Maker', icon: FaCoffee },
  { id: 'pool', label: 'Pool Access', icon: FaSwimmingPool },
  { id: 'parking', label: 'Parking', icon: FaParking },
  { id: 'restaurant', label: 'Restaurant', icon: FaUtensils },
  { id: 'minibar', label: 'Minibar', icon: FaCocktail },
  { id: 'jacuzzi', label: 'Jacuzzi', icon: FaHotTub },
  { id: 'gym', label: 'Gym Access', icon: FaDumbbell }
] as const

export type AmenityId = typeof AMENITIES[number]['id'] 