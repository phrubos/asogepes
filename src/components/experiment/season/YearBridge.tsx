'use client'

import type { SiteSeasons } from '@/lib/seasons'
import { formatCm } from '@/lib/seasons'
import { useSeason } from './SeasonContext'
import { dateText } from './DateLabel'
import styles from './YearBridge.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'

/**
 * "Évek" strip: the one value comparable across years (loose layer at the end of the season),
 * one row per year on the same scale. Read-only: the row of the block's own season is highlighted.
 */
export default function YearBridge({ site }: { site: SiteSeasons }) {
  const { year } = useSeason()
  const locale = useLocale()
  const en = locale === 'en'
  const cm = (v: number) => formatCm(v, locale)
  const max = site.looseLayerMax
  const pct = (v: number) => `${(v / max) * 100}%`

  return (
    <div className={styles.bridge}>
      <span className={styles.heading}>{en ? 'Years · end of the growing season' : 'Évek · a tenyészidő végén'}</span>
      <ul className={styles.rows}>
        {site.seasons.map((s) => {
          const { control, spade, when } = s.seasonEnd
          const lo = Math.min(control, spade)
          const hi = Math.max(control, spade)
          const active = s.year === year
          return (
            <li
              key={s.year}
              className={`${styles.row} ${active ? styles.active : ''}`}
              aria-current={active ? 'true' : undefined}
              aria-label={en ? `${s.year}, ${dateText(when, locale)}: control ${cm(control)} cm, spading machine ${cm(spade)} cm` : `${s.year}, ${dateText(when)}: kontroll ${cm(control)} cm, ásógép ${cm(spade)} cm`}
            >
              <span className={styles.year}>{s.year}</span>
              <span className={styles.track} aria-hidden="true">
                <span className={styles.span} style={{ left: pct(lo), width: `calc(${pct(hi)} - ${pct(lo)})` }} />
                <span className={`${styles.dot} ${styles.dotControl}`} style={{ left: pct(control) }} />
                <span className={`${styles.dot} ${styles.dotSpade}`} style={{ left: pct(spade) }} />
              </span>
              <span className={styles.value} aria-hidden="true">
                {cm(control)} → {cm(spade)} cm
              </span>
            </li>
          )
        })}
      </ul>
      <span className={styles.note}>{en ? `Control → spading machine, 0–${max} cm. One new row each year.` : `Kontroll → ásógép, 0–${max} cm. Évente egy új sor.`}</span>
    </div>
  )
}
