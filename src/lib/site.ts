/** Site name and absolute base URL, shared by metadata, robots.txt and sitemap.xml */
export const SITE_NAME = 'Ásógépes Talajművelés'

/** Site name per language (og:site_name) */
export const SITE_NAME_BY_LOCALE = { hu: SITE_NAME, en: 'Spading-Machine Tillage' } as const

// NEXT_PUBLIC_SITE_URL overrides (e.g. a custom domain); dev serves locally
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://neumann-agroskill.vercel.app')
