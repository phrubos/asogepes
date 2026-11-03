import type { MeasureDate } from '@/lib/seasons'

const MONTHS: Record<string, string> = {
  'JAN.': 'január',
  'FEBR.': 'február',
  'MÁRC.': 'március',
  'ÁPR.': 'április',
  'MÁJ.': 'május',
  'JÚN.': 'június',
  'JÚL.': 'július',
  'AUG.': 'augusztus',
  'SZEPT.': 'szeptember',
  'OKT.': 'október',
  'NOV.': 'november',
  'DEC.': 'december',
}
const IN_THIRD: Record<string, string> = { eleje: 'elején', közepe: 'közepén', vége: 'végén' }

/** Short, as on the axes: "JÚN. vége" */
export const short = (d: MeasureDate) => `${d.month} ${d.third ?? ''}`.trim()
/** In a sentence: "június vége" */
export const named = (d: MeasureDate) => `${MONTHS[d.month] ?? d.month} ${d.third ?? ''}`.trim()
/** In a sentence, "when": "június végén" */
export const namedIn = (d: MeasureDate) => `${MONTHS[d.month] ?? d.month} ${d.third ? IN_THIRD[d.third] ?? d.third : ''}`.trim()
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
