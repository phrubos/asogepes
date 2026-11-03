'use client'

import type { SiteSeasons } from '@/lib/seasons'
import { formatCm } from '@/lib/seasons'
import { useSeason } from './SeasonContext'
import { dateText } from './DateLabel'
import styles from './YearBridge.module.css'

/**
 * "Évek" strip: the one value comparable across years (loose layer at the end of the season),
 * one row per year on the same scale. A row is a button that selects that season.
 */
export default function YearBridge({ site }: { site: SiteSeasons }) {
  const { year, setYear } = useSeason()
  const max = site.looseLayerMax
  const pct = (v: number) => `${(v / max) * 100}%`

  return (
    <div className={styles.bridge}>
      <span className={styles.heading}>Évek · a tenyészidő végén</span>
      <div className={styles.rows}>
        {site.seasons.map((s) => {
          const { control, spade, when } = s.seasonEnd
          const lo = Math.min(control, spade)
          const hi = Math.max(control, spade)
          const active = s.year === year
          return (
            <button
              key={s.year}
              type="button"
              className={`${styles.row} ${active ? styles.active : ''}`}
              aria-pressed={active}
              aria-label={`${s.year}, ${dateText(when)}: kontroll ${formatCm(control)} cm, ásógép ${formatCm(spade)} cm`}
              onClick={() => setYear(s.year)}
            >
              <span className={styles.year}>{s.year}</span>
              <span className={styles.track} aria-hidden="true">
                <span className={styles.span} style={{ left: pct(lo), width: `calc(${pct(hi)} - ${pct(lo)})` }} />
                <span className={`${styles.dot} ${styles.dotControl}`} style={{ left: pct(control) }} />
                <span className={`${styles.dot} ${styles.dotSpade}`} style={{ left: pct(spade) }} />
              </span>
              <span className={styles.value} aria-hidden="true">
                {formatCm(control)} → {formatCm(spade)} cm
              </span>
            </button>
          )
        })}
      </div>
      <span className={styles.note}>Kontroll → ásógép, 0–{max} cm. Évente egy új sor.</span>
    </div>
  )
}
