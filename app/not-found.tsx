'use client'

import { Button } from '@nextui-org/react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Página no encontrada</p>
      <Link href="/">
        <Button color="primary">
          Volver al inicio
        </Button>
      </Link>
    </div>
  )
} 