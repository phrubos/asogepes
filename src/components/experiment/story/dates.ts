import type { MeasureDate } from '@/lib/seasons'
import { monthIn, monthLower, monthName } from '@/lib/months'

type Lang = 'hu' | 'en'

/** Short, as on the axes: "Június" */
export const short = (d: MeasureDate, locale: Lang = 'hu') => monthName(d, locale)
/** In a sentence: "június" / "June" */
export const named = (d: MeasureDate, locale: Lang = 'hu') => monthLower(d, locale)
/** In a sentence, "when": "júniusban" / "in June" */
export const namedIn = (d: MeasureDate, locale: Lang = 'hu') => monthIn(d, locale)
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
