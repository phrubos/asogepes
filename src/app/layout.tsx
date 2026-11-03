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

// Absolute base for og:image URLs: NEXT_PUBLIC_SITE_URL overrides (e.g. a custom domain), dev serves locally
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://neumann-agroskill.vercel.app')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: { type: 'website', locale: 'hu_HU', siteName: 'Ásógépes Talajművelés' },
  twitter: { card: 'summary_large_image' },
  title: 'Ásógépes Talajművelés | Tudományos Kutatás 2025 óta',
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
