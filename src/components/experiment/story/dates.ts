import type { MeasureDate } from '@/lib/seasons'
import { monthIn, monthLower, monthName } from '@/lib/months'

/** Short, as on the axes: "Június" */
export const short = (d: MeasureDate) => monthName(d)
/** In a sentence: "június" */
export const named = (d: MeasureDate) => monthLower(d)
/** In a sentence, "when": "júniusban" */
export const namedIn = (d: MeasureDate) => monthIn(d)
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
