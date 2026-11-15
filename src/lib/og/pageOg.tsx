import { ogContentType, ogSize, renderOgImage } from './renderOgImage'
import { OG_BACKGROUND, PAGE_TEXT } from '@/lib/i18n/pages'
import type { Locale, PageKey } from '@/lib/i18n/config'

/** Everything an opengraph-image.tsx route exports, for one page in one language (ticket 025) */
export function pageOg(page: PageKey, locale: Locale) {
  const t = PAGE_TEXT[page][locale].og
  return {
    alt: t.alt,
    size: ogSize,
    contentType: ogContentType,
    render: () =>
      renderOgImage({ background: OG_BACKGROUND[page], eyebrow: t.eyebrow, title: t.title, subtitle: t.subtitle }),
  }
}
