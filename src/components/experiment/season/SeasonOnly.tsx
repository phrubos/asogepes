'use client'

import { useSeason } from './SeasonContext'
import { ArrowUp } from 'lucide-react'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import styles from './SeasonOnly.module.css'

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

/**
 * Which season a block shows, as plain text, not a control (mobile UX review 11-09, K3: the old
 * pill looked exactly like the ÉV switch, so readers tapped it and nothing happened).
 * For a block measured in fewer seasons than its site offers, it also says when the site's
 * selected season has no data here, instead of showing an empty chart.
 * `missingNote` replaces the default text, e.g. for photos: (year) => `a ${yearAdj(year)} fotók még nincsenek fent`
 */
export default function SeasonOnly({ years, missingNote }: { years: number[]; missingNote?: (year: number) => string }) {
  const { year } = useSeason()
  const missing = !years.includes(year)
  return (
    <p className={styles.only}>
      <span className={styles.label}>Év:</span> <span className={styles.year}>{years.join(', ')}</span>
      {missing && <span className={styles.note}> · {missingNote ? missingNote(year) : `${inYear(year)} itt nem mértünk`}</span>}
    </p>
  )
}

/**
 * The selected season of a multi-season block, as plain text, plus a link up to the site's one
 * ÉV switch (in Helyszín adatok, `switchAt`) instead of a second, third switch per site.
 */
export function SeasonLabel({ switchAt }: { switchAt: string }) {
  const { year, years, divided } = useSeason()
  const { scrollToSection } = useScrollNav()
  // under a year divider the year is already said (ticket 015)
  if (divided) return null
  return (
    <p className={styles.only}>
      <span className={styles.label}>Év:</span> <span className={styles.year}>{year}</span>
      {years.length > 1 && (
        <>
          {' · '}
          <button type="button" className={styles.switchLink} onClick={() => scrollToSection(switchAt)}>
            másik év
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </>
      )}
    </p>
  )
}
