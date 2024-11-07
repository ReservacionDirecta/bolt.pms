import { useTranslations as useNextIntlTranslations } from 'next-intl'

export function useTranslations() {
  const t = useNextIntlTranslations()

  const formatCurrency = (amount: number) => {
    return t.format('number', amount, { style: 'currency' })
  }

  const formatDate = (date: Date, format: 'short' | 'long' = 'short') => {
    return t.format('dateTime', date, format)
  }

  const formatPercent = (value: number) => {
    return t.format('number', value, { style: 'percent' })
  }

  return {
    t,
    formatCurrency,
    formatDate,
    formatPercent
  }
} 