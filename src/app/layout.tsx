import { Providers } from './providers'
import { I18nProvider } from '@/providers/i18n-provider'
import { Navbar } from '@/components/Navbar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          <I18nProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="md:ml-64 pb-16 md:pb-0">
                {children}
              </main>
            </div>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
} 