'use client'

// ... mismo contenido que providers.tsx 'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NextIntlClientProvider } from 'next-intl'
import { ES } from '@/constants/translations/es'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <NextIntlClientProvider 
          locale="es" 
          messages={ES}
          timeZone="America/Mexico_City"
          formats={{
            number: {
              currency: {
                style: 'currency',
                currency: 'MXN'
              },
              percent: {
                style: 'percent',
                minimumFractionDigits: 2
              }
            },
            dateTime: {
              short: {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              },
              long: {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long'
              }
            }
          }}
        >
          {children}
        </NextIntlClientProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
