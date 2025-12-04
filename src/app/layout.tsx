import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PageNavigation from '@/components/ui/PageNavigation'
import ScrollProgress from '@/components/ui/ScrollProgress'
import BackToTop from '@/components/ui/BackToTop'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: 'Ásógépes Talajművelés | Tudományos Kutatás 2025',
  description: 'Tudományos kutatás a szántóföldi ásógép talajszerkezetre gyakorolt hatásáról öntözött kertészeti kultúrákban. Neumann János Egyetem × Agroskill Kft. együttműködés.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Ugrás a tartalomhoz
        </a>
        <ScrollProgress color="green" />
        <Navigation />
        <PageNavigation />
        {children}
        <Footer />
        <BackToTop threshold={400} />
      </body>
    </html>
  )
}
