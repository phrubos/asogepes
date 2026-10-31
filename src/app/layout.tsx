import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { HydrationErrorBoundary } from '@/components/error/HydrationErrorBoundary'
import MotionProvider from '@/components/providers/MotionProvider'

// Self-hosted at build time (no request to fonts.googleapis.com); exposed as CSS variables for globals.css
const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-inter' })
const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-fraunces' })

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
    <html lang="hu" className={`${inter.variable} ${fraunces.variable}`}>
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
