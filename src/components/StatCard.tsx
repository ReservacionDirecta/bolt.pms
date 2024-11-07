'use client'

import { Card, CardBody } from '@nextui-org/react'

interface StatCardProps {
  title: string
  value: string
  icon?: string
  change?: string
}

export function StatCard({ title, value, icon, change }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex flex-row items-center gap-4">
        {icon && <div className="text-2xl">{icon}</div>}
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${
              change.startsWith('+') ? 'text-green-500' : 'text-red-500'
            }`}>
              {change}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  )
} 