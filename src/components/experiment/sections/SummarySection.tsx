'use client'

import { ArrowUp } from 'lucide-react'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import {
  szentkiralySeasons,
  szentkiralyGrowth,
  szentkiralyTomato,
  lakitelekSeasons,
  formatCm,
  RESEARCH_YEARS,
} from '@/lib/seasons'
import { dateText } from '../season/DateLabel'
import frame from '../pages/SzentkirályTimelinePage.module.css'
import styles from './SummarySection.module.css'

// Every figure here is computed from seasons.ts, so a new season updates the summary too.

const last = <T,>(a: T[]) => a[a.length - 1]
const signed = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '') + formatCm(Math.abs(Math.round(v * 10) / 10))
const range = (vs: number[]) => {
  const lo = Math.round(Math.min(...vs))
  const hi = Math.round(Math.max(...vs))
  return lo === hi ? `${lo}` : `${lo}–${hi}`
}

interface Finding {
  id: string
  where: string
  title: string
  /** Big figures: label, control → spade */
  rows: { label: string; value: string }[]
  text: string
  /** Subsection with the details */
  target: string
  /** Shown as a caveat, not a result */
  caveat?: boolean
}

function buildFindings(): Finding[] {
  // 1. Loose layer at the end of the season, Szentkirály onion: the one value measured every year
  const ends = szentkiralySeasons.seasons
  const everyYear = ends.every((s) => s.seasonEnd.spade > s.seasonEnd.control)
  const looseLayer: Finding = {
    id: 'laza',
    where: `Szentkirály · vöröshagyma · ${ends.map((s) => s.year).join(', ')}`,
    title: everyYear
      ? `A tenyészidő végén mélyebben laza${ends.length > 1 ? ', minden évben' : ''}`
      : 'A laza réteg a tenyészidő végén',
    rows: ends.map((s) => ({
      label: `${s.year}, ${dateText(s.seasonEnd.when)}`,
      value: `${formatCm(s.seasonEnd.control)} → ${formatCm(s.seasonEnd.spade)} cm`,
    })),
    text: 'Ennyi cm mélységig maradt laza a talaj (20 bar alatt), kontroll → ásógép.',
    target: 'szentkiraly-timeline',
  }

  // 2. Soil temperature, latest season with several measurement days, shallowest depth
  const tempSeason = last(szentkiralySeasons.seasons.filter((s) => s.temperature.depths[0].points.length > 1))
  const findings: Finding[] = [looseLayer]
  if (tempSeason) {
    const depth = tempSeason.temperature.depths[0]
    const diffs = depth.points.map((p) => ({ when: p.when, d: p.spade - p.control }))
    const warmest = diffs.reduce((a, b) => (b.d > a.d ? b : a))
    const coolest = diffs.reduce((a, b) => (b.d < a.d ? b : a))
    findings.push({
      id: 'ho',
      where: `Szentkirály · ${tempSeason.year} · ${depth.label} mélyen, dél körül`,
      title: 'Tavasszal melegebb, a nyári hőségben hűvösebb',
      rows: [
        { label: dateText(warmest.when), value: `${signed(warmest.d)} °C` },
        { label: dateText(coolest.when), value: `${signed(coolest.d)} °C` },
      ],
      text: 'Az ásógépes talaj hőmérséklete a kontrollhoz képest.',
      target: 'szentkiraly-temp',
    })
  }

  // 3. Onion growth: the same bulb size a month apart
  const growth = last(szentkiralyGrowth.seasons)
  if (growth) {
    const { mm, spadeDate, controlDate } = growth.catchUp
    findings.push({
      id: 'hagyma',
      where: `Szentkirály · vöröshagyma · ${growth.year}`,
      title: 'Az ásógépes hagyma előrébb jár',
      rows: [
        { label: 'Ásógép', value: dateText(spadeDate) },
        { label: 'Kontroll', value: dateText(controlDate) },
      ],
      text: `Ekkor mértünk ${mm} mm-es hagymafejet.`,
      target: 'szentkiraly-fejlodes',
    })
  }

  // 4. The tomato field: the date with the largest loose-layer difference, plus shoot length
  const tomato = last(szentkiralyTomato.seasons)
  if (tomato) {
    const control = tomato.treatments.find((t) => t.role === 'control')!
    const spade = tomato.treatments.find((t) => t.role === 'spade')!
    const k = tomato.values[control.id]
    const a = tomato.values[spade.id]
    const i = a.reduce((best, _, j) => (a[j] - k[j] > a[best] - k[best] ? j : best), 0)
    const shoot = tomato.facts.find((f) => f.label === 'Hajtáshossz')
    findings.push({
      id: 'paradicsom',
      where: `Szentkirály · ipari paradicsom · ${tomato.year}`,
      title: 'Az új táblán is az ásógépes talaj lazább',
      rows: [
        { label: `Laza réteg, ${dateText(tomato.dates[i])}`, value: `${formatCm(k[i])} → ${formatCm(a[i])} cm` },
        ...(shoot ? [{ label: `${shoot.label}, ${dateText(shoot.when)}`, value: `${shoot.control} → ${shoot.spade} ${shoot.unit}` }] : []),
      ],
      text: `${control.short} → ásógép.`,
      target: 'szentkiraly-paradicsom',
    })
  }

  // 5. Lakitelek, latest season: the spread of the 7 parcels per date (a caveat, not a win)
  const lk = last(lakitelekSeasons.seasons)
  if (lk) {
    const spreads = lk.dates.map((d, j) => ({ when: d, flag: lk.dateFlags?.[j], vs: lk.parcels.map((p) => p.values[j]) }))
    findings.push({
      id: 'lakitelek',
      where: `Lakitelek · ${lk.info.crop.toLowerCase()} · ${lk.year}`,
      title: `A ${lk.parcels.length} kombináció tavasszal eltér, nyárra kiegyenlítődik`,
      rows: spreads.map((s) => ({
        label: dateText(s.when) + (s.flag ? ` (${s.flag})` : ''),
        value: `${range(s.vs)} cm`,
      })),
      text: 'A laza réteg mélysége a hét parcellán (legkisebb–legnagyobb). A tarlón mért érték nem vethető össze más évek tenyészidő végi mérésével.',
      target: 'lakitelek-chart',
      caveat: true,
    })
  }

  return findings
}

const findings = buildFindings()

/** Összegzés: the main results of all seasons on one screen, each with a jump to its details */
export default function SummarySection() {
  const { scrollToSection } = useScrollNav()

  return (
    <div className={`${frame.timelinePage} ${styles.page}`}>
      <div className={frame.header}>
        <div className={frame.headerBadge}>
          <span>Összegzés · {RESEARCH_YEARS.join('–')}</span>
        </div>
        <h2 className={`${frame.headerTitle} ${styles.title}`}>Mit mutat {RESEARCH_YEARS.length} év mérése?</h2>
      </div>

      <ul className={styles.grid}>
        {findings.map((f) => (
          <li key={f.id} className={`${styles.card} ${f.caveat ? styles.caveat : ''}`}>
            <span className={styles.where}>{f.where}</span>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <dl className={styles.rows}>
              {f.rows.map((r) => (
                <div key={r.label} className={styles.row}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.text}>{f.text}</p>
            <button type="button" className={styles.more} onClick={() => scrollToSection(f.target)}>
              Részletek
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        A talajélet (MicroBIOMETER) kísérő adat: egyértelmű ásógépes előnyt nem mutat, ezért nem szerepel az eredmények között.
      </p>
    </div>
  )
}
