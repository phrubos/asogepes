import type { Metadata } from 'next'
import RootDocument from '@/components/layout/RootDocument'
import { pageMetadata } from '@/lib/i18n/metadata'
import { PAGE_TEXT } from '@/lib/i18n/pages'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  // absolute base for og:image URLs
  metadataBase: new URL(SITE_URL),
  twitter: { card: 'summary_large_image' },
  ...pageMetadata('home', 'hu', PAGE_TEXT.home.hu),
}

export default function HungarianRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="hu">{children}</RootDocument>
}
