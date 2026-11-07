/** Site name and absolute base URL, shared by metadata, robots.txt and sitemap.xml */
export const SITE_NAME = 'Ásógépes Talajművelés'

// NEXT_PUBLIC_SITE_URL overrides (e.g. a custom domain); dev serves locally
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://neumann-agroskill.vercel.app')

/** The content pages, in menu order (sitemap) */
export const SITE_PAGES = ['/', '/problema', '/technologia', '/kutatas'] as const
