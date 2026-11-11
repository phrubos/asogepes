import type { Metadata } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { HydrationErrorBoundary } from '@/components/error/HydrationErrorBoundary'
import MotionProvider from '@/components/providers/MotionProvider'
import { SITE_NAME, SITE_URL } from '@/lib/site'

// Self-hosted at build time (no request to fonts.googleapis.com); exposed as CSS variables for globals.css
const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-inter' })
const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-fraunces' })
// Dates, values and chips (var(--font-mono)); not preloaded: no LCP text uses it, the fallback is any monospace
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-mono', preload: false })

export const metadata: Metadata = {
  // absolute base for og:image URLs
  metadataBase: new URL(SITE_URL),
  openGraph: { type: 'website', locale: 'hu_HU', siteName: SITE_NAME },
  twitter: { card: 'summary_large_image' },
  title: 'Ásógépes Talajművelés | Tudományos kutatás 2025 óta',
  description: 'Tudományos kutatás a szántóföldi ásógép talajszerkezetre gyakorolt hatásáról, öntözött kertészeti kultúrákban. Neumann János Egyetem × Agroskill Kft. együttműködés.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}>
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
