import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { HydrationErrorBoundary } from '@/components/error/HydrationErrorBoundary'
import MotionProvider from '@/components/providers/MotionProvider'

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
          <a href="#main-content" className="skip-link">
            Ugrás a tartalomhoz
          </a>

          <MotionProvider>
            <Navigation />
            {children}
            <Footer />
          </MotionProvider>
        </body>
      </HydrationErrorBoundary>
    </html>
  )
}
