'use client'

import { useSeason } from './SeasonContext'
import switchStyles from './SeasonSwitch.module.css'
import styles from './SeasonOnly.module.css'

/**
 * For a site measured in fewer seasons than the page offers: shows which season the block is
 * from (same look as the ÉV switch, but not a control), and says so when the page-wide
 * season has no data here, instead of showing an empty chart.
 */
/** Hungarian inessive suffix for a year: 2026-ban, 2027-ben, 2030-ban. */
export function inYear(y: number): string {
  const one = ['ben', 'ben', 'ben', 'ban', 'ben', 'ben', 'ban', 'ben', 'ban', 'ben']
  const ten = ['ben', 'ben', 'ban', 'ban', 'ben', 'ben', 'ban', 'ben', 'ban', 'ben']
  const last = y % 10
  const suffix = last !== 0 ? one[last] : y % 100 !== 0 ? ten[(y % 100) / 10] : y % 1000 === 0 ? 'ben' : 'ban'
  return `${y}-${suffix}`
}

/** Hungarian adjective form of a year: 2025-ös, 2026-os, 2027-es, 2030-as. */
export function yearAdj(y: number): string {
  const one = ['', 'es', 'es', 'as', 'es', 'ös', 'os', 'es', 'as', 'es']
  const ten = ['', 'es', 'as', 'as', 'es', 'es', 'as', 'es', 'as', 'es']
  const last = y % 10
  const suffix = last !== 0 ? one[last] : y % 100 !== 0 ? ten[(y % 100) / 10] : y % 1000 === 0 ? 'es' : 'as'
  return `${y}-${suffix}`
}

/** `missingNote` replaces the default text, e.g. for photos: (year) => `a ${yearAdj(year)} fotók még nincsenek fent` */
export default function SeasonOnly({ years, missingNote }: { years: number[]; missingNote?: (year: number) => string }) {
  const { year } = useSeason()
  const missing = !years.includes(year)
  return (
    <div className={styles.only}>
      <span className={`${switchStyles.label} ${styles.label}`}>Év</span>
      {years.map((y) => (
        <span key={y} className={styles.year}>{y}</span>
      ))}
      {missing && <span className={styles.note}>{missingNote ? missingNote(year) : `${inYear(year)} itt nem mértünk`}</span>}
    </div>
  )
}
