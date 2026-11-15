'use client'

import { useYearFilter, type SiteId } from './YearFilter'
import styles from './SeasonSwitch.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TEXT = bilingual({ group: 'Év, egy vagy mindkettő', year: 'Év', keep: 'Legalább egy év mindig látszik' }, { group: 'Year, one or both', year: 'Year', keep: 'At least one year is always shown' })

/**
 * ÉV control in Helyszín adatok (ticket 015): the same choice as the 25 / 26 chips in the rail,
 * one year, the other or both. The last chosen year cannot be switched off.
 */
export default function SiteYearSwitch({ site, small }: { site: SiteId; small?: boolean }) {
  const t = TEXT[useLocale()]
  const { all, selected, toggle } = useYearFilter()
  const years = all[site]
  if (years.length < 2) return null
  const chosen = selected[site]
  return (
    <div className={`${styles.switch} ${small ? styles.small : ''}`} role="group" aria-label={t.group}>
      <span className={styles.label} aria-hidden="true">{t.year}</span>
      {years.map((y) => {
        const on = chosen.includes(y)
        const last = on && chosen.length === 1
        return (
          <button
            key={y}
            type="button"
            className={`${styles.option} ${on ? styles.active : ''}`}
            aria-pressed={on}
            aria-disabled={last || undefined}
            title={last ? t.keep : undefined}
            onClick={() => toggle(site, y)}
          >
            {y}
          </button>
        )
      })}
    </div>
  )
}
