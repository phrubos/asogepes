// Month names for the measurement dates. The site shows only the month ("Április"), not the third
// of the month (eleje / közepe / vége): client decision, 2026-11-08. The third stays in the data.

import type { MeasureDate } from './seasons'

const NAMES: Record<string, string> = {
  'JAN.': 'január', 'FEBR.': 'február', 'MÁRC.': 'március', 'ÁPR.': 'április', 'MÁJ.': 'május', 'JÚN.': 'június',
  'JÚL.': 'július', 'AUG.': 'augusztus', 'SZEPT.': 'szeptember', 'OKT.': 'október', 'NOV.': 'november', 'DEC.': 'december',
}
const IN: Record<string, string> = {
  'JAN.': 'januárban', 'FEBR.': 'februárban', 'MÁRC.': 'márciusban', 'ÁPR.': 'áprilisban', 'MÁJ.': 'májusban', 'JÚN.': 'júniusban',
  'JÚL.': 'júliusban', 'AUG.': 'augusztusban', 'SZEPT.': 'szeptemberben', 'OKT.': 'októberben', 'NOV.': 'novemberben', 'DEC.': 'decemberben',
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "április" */
export const monthLower = (d: MeasureDate) => NAMES[d.month] ?? d.month.toLowerCase()
/** "Április", as on axes and labels */
export const monthName = (d: MeasureDate) => cap(monthLower(d))
/** "áprilisban" */
export const monthIn = (d: MeasureDate) => IN[d.month] ?? monthLower(d)
