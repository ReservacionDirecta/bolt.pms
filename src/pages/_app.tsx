'use client'

import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/components/Sidebar'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50">
          <Component {...pageProps} />
        </main>
      </div>
      <Toaster position="top-right" />
    </NextUIProvider>
  )
}
