'use client'

import { Input } from '@nextui-org/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface GlobalSearchProps {
  onSearch: (filters: any) => void
  variant?: 'full' | 'compact'
}

export function GlobalSearch({ onSearch, variant = 'full' }: GlobalSearchProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch({ search: e.target.value })
  }

  return (
    <Input
      type="search"
      placeholder="Buscar reservas..."
      startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
      className={variant === 'compact' ? 'max-w-xs' : 'max-w-2xl'}
      onChange={handleChange}
    />
  )
} 