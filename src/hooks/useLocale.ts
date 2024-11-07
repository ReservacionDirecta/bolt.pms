import { es } from '@/locales/es'

export function useLocale() {
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = es
    
    for (const k of keys) {
      value = value[k]
      if (!value) return key
    }
    
    return value
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  return { t, formatCurrency, formatDate }
} 