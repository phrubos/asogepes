'use client'

import { useSeason } from './SeasonContext'
import styles from './SeasonSwitch.module.css'

const MAX_BUTTONS = 4

/**
 * ÉVAD control under a block title. It sets the page-wide season, so every block follows.
 * Up to four years are buttons; from five, the older ones move into a "Korábbi" menu.
 */
/** `small`: badge height on desktop, to sit next to a page badge. */
export default function SeasonSwitch({ years: available, small }: { years?: number[]; small?: boolean }) {
  const { year, years: all, setYear } = useSeason()
  const years = available ?? all
  if (years.length < 2) return null

  const many = years.length > MAX_BUTTONS
  const buttons = many ? years.slice(-(MAX_BUTTONS - 1)) : years
  const older = many ? years.slice(0, years.length - (MAX_BUTTONS - 1)) : []

  return (
    <div className={`${styles.switch} ${small ? styles.small : ''}`} role="group" aria-label="Évad">
      <span className={styles.label} aria-hidden="true">Évad</span>
      {older.length > 0 && (
        <select
          className={`${styles.option} ${styles.select} ${older.includes(year) ? styles.active : ''}`}
          value={older.includes(year) ? year : ''}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="Korábbi évad"
        >
          <option value="" disabled>Korábbi</option>
          {older.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      )}
      {buttons.map((y) => (
        <button
          key={y}
          type="button"
          className={`${styles.option} ${y === year ? styles.active : ''}`}
          aria-pressed={y === year}
          onClick={() => setYear(y)}
        >
          {y}
        </button>
      ))}
    </div>
  )
}
