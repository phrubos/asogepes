import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import RouteLoadingProvider from '@/components/providers/RouteLoadingProvider'
import { NavigationProvider } from '@/components/providers/NavigationContext'
import { HydrationErrorBoundary } from '@/components/error/HydrationErrorBoundary'

export const metadata: Metadata = {
  title: 'Ásógépes Talajművelés | Tudományos Kutatás 2025',
  description: 'Tudományos kutatás a szántóföldi ásógép talajszerkezetre gyakorolt hatásáról, öntözött kertészeti kultúrákban. Neumann János Egyetem × Agroskill Kft. együttműködés.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <HydrationErrorBoundary>
        <body>
          <Suspense fallback={null}>
            <NavigationProvider>
              <RouteLoadingProvider>
                <a href="#main-content" className="skip-link">
                  Ugrás a tartalomhoz
                </a>

                <Navigation />
                {children}
                <Footer />
              </RouteLoadingProvider>
            </NavigationProvider>
          </Suspense>
        </body>
      </HydrationErrorBoundary>
    </html>
  )
}
