import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { LOCALES, PAGE_KEYS, PAGE_PATHS } from '@/lib/i18n/config'

const abs = (path: string) => `${SITE_URL}${path === '/' ? '' : path}`

/** Every page in both languages, each listing its counterpart (hreflang in the sitemap) */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_KEYS.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: abs(PAGE_PATHS[page][locale]),
      changeFrequency: 'monthly' as const,
      priority: page === 'home' ? 1 : 0.8,
      alternates: {
        languages: { hu: abs(PAGE_PATHS[page].hu), en: abs(PAGE_PATHS[page].en) },
      },
    })),
  )
}
