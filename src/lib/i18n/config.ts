/**
 * Languages and localized routes (ticket 025). Hungarian lives at the unprefixed URLs it always had,
 * English under /en with English slugs. Server- and client-safe (no React here).
 */
export type Locale = 'hu' | 'en'
export const LOCALES: readonly Locale[] = ['hu', 'en']
export const DEFAULT_LOCALE: Locale = 'hu'

export type PageKey = 'home' | 'problem' | 'technology' | 'research'

export const PAGE_PATHS: Record<PageKey, Record<Locale, string>> = {
  home: { hu: '/', en: '/en' },
  problem: { hu: '/problema', en: '/en/problem' },
  technology: { hu: '/technologia', en: '/en/technology' },
  research: { hu: '/kutatas', en: '/en/research' },
}

export const PAGE_KEYS = Object.keys(PAGE_PATHS) as PageKey[]

/** og:locale per language */
export const OG_LOCALE: Record<Locale, string> = { hu: 'hu_HU', en: 'en_GB' }

/** Path of a page in a language, optionally with a deep link (`?section=`) */
export function pagePath(page: PageKey, locale: Locale, section?: string): string {
  const base = PAGE_PATHS[page][locale]
  return section ? `${base}?section=${section}` : base
}

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'hu'
}

/** Which page a pathname is (null off the menu, e.g. a 404) */
export function pageFromPath(pathname: string): PageKey | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  for (const key of PAGE_KEYS) {
    if (PAGE_PATHS[key].hu === clean || PAGE_PATHS[key].en === clean) return key
  }
  return null
}

/** The same page in the other language (its home page when the path is not a known page) */
export function counterpartPath(pathname: string): string {
  const target: Locale = localeFromPath(pathname) === 'en' ? 'hu' : 'en'
  return PAGE_PATHS[pageFromPath(pathname) ?? 'home'][target]
}

/**
 * A `{ hu, en }` pair of the same shape: TypeScript flags a key missing from (or extra in) the English
 * side, so no string is left untranslated. Use at module scope, pick with `pair[locale]`.
 */
export function bilingual<T>(hu: T, en: NoInfer<T>): Record<Locale, T> {
  return { hu, en }
}

/** Number with the language's decimal mark (17,6 / 17.6) */
export function formatNumber(value: number, locale: Locale, digits = 0): string {
  return value.toLocaleString(locale === 'hu' ? 'hu-HU' : 'en-GB', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/**
 * Data rows (lib/data.ts, lib/seasons.ts …) keep their Hungarian fields and carry the English ones in an
 * `en` overlay of the same shape; this returns the row in the asked language.
 */
export function localize<T extends object>(row: T & { en?: Partial<Omit<T, 'en'>> }, locale: Locale): T {
  return locale === 'en' && row.en ? { ...row, ...row.en } : row
}
