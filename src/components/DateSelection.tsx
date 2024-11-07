import { useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import { FaMinus, FaPlus } from 'react-icons/fa'

interface GuestCounterProps {
  adults: number
  children: number
  onAdultsChange: (value: number) => void
  onChildrenChange: (value: number) => void
}

const GuestCounter: React.FC<GuestCounterProps> = ({
  adults,
  children: childrenCount,
  onAdultsChange,
  onChildrenChange
}) => {
  const handleIncrement = (type: 'adults' | 'children') => {
    if (type === 'adults' && adults < 10) {
      onAdultsChange(adults + 1)
    } else if (type === 'children' && childrenCount < 10) {
      onChildrenChange(childrenCount + 1)
    }
  }

  const handleDecrement = (type: 'adults' | 'children') => {
    if (type === 'adults' && adults > 1) {
      onAdultsChange(adults - 1)
    } else if (type === 'children' && childrenCount > 0) {
      onChildrenChange(childrenCount - 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Contador de Adultos */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Adultos</div>
          <div className="text-sm text-gray-500">13+ años</div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onPress={() => handleDecrement('adults')}
            isDisabled={adults <= 1}
            aria-label="Reducir número de adultos"
          >
            <FaMinus className="text-sm" />
          </Button>
          <span className="w-8 text-center">{adults || 1}</span>
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onPress={() => handleIncrement('adults')}
            isDisabled={adults >= 10}
            aria-label="Aumentar número de adultos"
          >
            <FaPlus className="text-sm" />
          </Button>
        </div>
      </div>

      {/* Contador de Niños */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Niños</div>
          <div className="text-sm text-gray-500">2-12 años</div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onPress={() => handleDecrement('children')}
            isDisabled={childrenCount <= 0}
            aria-label="Reducir número de niños"
          >
            <FaMinus className="text-sm" />
          </Button>
          <span className="w-8 text-center">{childrenCount || 0}</span>
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onPress={() => handleIncrement('children')}
            isDisabled={childrenCount >= 10}
            aria-label="Aumentar número de niños"
          >
            <FaPlus className="text-sm" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const DateSelection: React.FC = () => {
  const [adults, setAdults] = useState<number>(1)
  const [children, setChildren] = useState<number>(0)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium">
          Huéspedes
        </label>
        <GuestCounter
          adults={adults}
          children={children}
          onAdultsChange={setAdults}
          onChildrenChange={setChildren}
        />
      </div>

      <div className="text-sm text-gray-600">
        Total huéspedes: {adults + children}
      </div>
    </div>
  )
}

export default DateSelection 