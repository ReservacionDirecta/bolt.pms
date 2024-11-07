'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ES } from '@/constants/translations/es'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
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
  )
} 