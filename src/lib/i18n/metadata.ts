import type { Metadata } from 'next'
import { SITE_NAME_BY_LOCALE, SITE_URL } from '@/lib/site'
import { OG_LOCALE, PAGE_PATHS, type Locale, type PageKey } from './config'

/**
 * Page metadata with the language alternates (hreflang hu / en / x-default) and the canonical URL.
 * Hungarian is x-default: it is the original and what a visitor without a language match gets.
 */
export function pageMetadata(
  page: PageKey,
  locale: Locale,
  { title, description }: { title: string; description: string },
): Metadata {
  const paths = PAGE_PATHS[page]
  return {
    title,
    description,
    alternates: {
      canonical: paths[locale],
      languages: {
        hu: `${SITE_URL}${paths.hu === '/' ? '' : paths.hu}`,
        en: `${SITE_URL}${paths.en}`,
        'x-default': `${SITE_URL}${paths.hu === '/' ? '' : paths.hu}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[locale === 'hu' ? 'en' : 'hu'],
      siteName: SITE_NAME_BY_LOCALE[locale],
      title,
      description,
      url: paths[locale],
    },
  }
}
