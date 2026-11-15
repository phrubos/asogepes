import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import '@/app/globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { HydrationErrorBoundary } from '@/components/error/HydrationErrorBoundary'
import MotionProvider from '@/components/providers/MotionProvider'
import { LocaleProvider } from '@/lib/i18n/LocaleProvider'
import type { Locale } from '@/lib/i18n/config'

// Self-hosted at build time (no request to fonts.googleapis.com); exposed as CSS variables for globals.css
const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-inter' })
const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-fraunces' })
// Dates, values and chips (var(--font-mono)); not preloaded: no LCP text uses it, the fallback is any monospace
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-mono', preload: false })

const SKIP_LINK: Record<Locale, string> = { hu: 'Ugrás a tartalomhoz', en: 'Skip to content' }

/**
 * The <html> document shared by both root layouts (ticket 025): app/(hu)/layout.tsx and
 * app/(en)/layout.tsx render it with their language, so <html lang> is right in the server HTML.
 */
export default function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}>
      <HydrationErrorBoundary>
        <body>
          <a href="#main-content" className="skip-link">
            {SKIP_LINK[locale]}
          </a>

          <LocaleProvider locale={locale}>
            <MotionProvider>
              <Navigation />
              {children}
              <Footer />
            </MotionProvider>
          </LocaleProvider>
        </body>
      </HydrationErrorBoundary>
    </html>
  )
}
