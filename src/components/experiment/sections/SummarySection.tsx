'use client'

import { ArrowDown } from 'lucide-react'
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
import { useLocale } from '@/lib/i18n/LocaleProvider'
import type { Locale } from '@/lib/i18n/config'
import { researchData } from '@/lib/i18n/useResearchData'
import frame from '../pages/SzentkirályTimelinePage.module.css'
import styles from './SummarySection.module.css'

// Every figure here is computed from seasons.ts, so a new season updates the summary too.

const last = <T,>(a: T[]) => a[a.length - 1]
const signed = (v: number, locale: Locale) => (v > 0 ? '+' : v < 0 ? '−' : '') + formatCm(Math.abs(Math.round(v * 10) / 10), locale)
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

function buildFindings(locale: Locale): Finding[] {
  const en = locale === 'en'
  const cm = (v: number) => formatCm(v, locale)
  const when = (d: Parameters<typeof dateText>[0]) => dateText(d, locale)
  // 1. Loose layer at the end of the season, Szentkirály onion: the one value measured every year
  const ends = researchData(szentkiralySeasons, locale).seasons
  const everyYear = ends.every((s) => s.seasonEnd.spade > s.seasonEnd.control)
  const looseLayer: Finding = {
    id: 'laza',
    where: `Szentkirály · ${en ? 'onion' : 'vöröshagyma'} · ${ends.map((s) => s.year).join(', ')}`,
    title: everyYear
      ? en
        ? `Loose to a greater depth at the end of the season${ends.length > 1 ? ', every year' : ''}`
        : `A tenyészidő végén mélyebben laza${ends.length > 1 ? ', minden évben' : ''}`
      : en
        ? 'The loose layer at the end of the season'
        : 'A laza réteg a tenyészidő végén',
    rows: ends.map((s) => ({
      label: `${s.year}, ${when(s.seasonEnd.when)}`,
      value: `${cm(s.seasonEnd.control)} → ${cm(s.seasonEnd.spade)} cm`,
    })),
    text: en
      ? 'Depth to which the soil stayed loose (below 20 bar), control → spading machine.'
      : 'Ennyi cm mélységig maradt laza a talaj (20 bar alatt), kontroll → ásógép.',
    target: 'szentkiraly-timeline',
  }

  // 2. Soil temperature, latest season with several measurement days, shallowest depth
  const tempSeason = last(ends.filter((s) => s.temperature.depths[0].points.length > 1))
  const findings: Finding[] = [looseLayer]
  if (tempSeason) {
    const depth = tempSeason.temperature.depths[0]
    const diffs = depth.points.map((p) => ({ when: p.when, d: p.spade - p.control }))
    const warmest = diffs.reduce((a, b) => (b.d > a.d ? b : a))
    const coolest = diffs.reduce((a, b) => (b.d < a.d ? b : a))
    findings.push({
      id: 'ho',
      where: en
        ? `Szentkirály · ${tempSeason.year} · ${depth.label} deep, around midday`
        : `Szentkirály · ${tempSeason.year} · ${depth.label} mélyen, dél körül`,
      title: en ? 'Warmer in spring, cooler in the summer heat' : 'Tavasszal melegebb, a nyári hőségben hűvösebb',
      rows: [
        { label: when(warmest.when), value: `${signed(warmest.d, locale)} °C` },
        { label: when(coolest.when), value: `${signed(coolest.d, locale)} °C` },
      ],
      text: en ? 'Temperature of the spaded soil compared with the control.' : 'Az ásógépes talaj hőmérséklete a kontrollhoz képest.',
      target: 'szentkiraly-temp',
    })
  }

  // 3. Onion growth: the same bulb size a month apart
  const growth = last(szentkiralyGrowth.seasons)
  if (growth) {
    const { mm, spadeDate, controlDate } = growth.catchUp
    findings.push({
      id: 'hagyma',
      where: `Szentkirály · ${en ? 'onion' : 'vöröshagyma'} · ${growth.year}`,
      title: en ? 'The spaded onion is ahead' : 'Az ásógépes hagyma előrébb jár',
      rows: [
        { label: en ? 'Spading machine' : 'Ásógép', value: when(spadeDate) },
        { label: en ? 'Control' : 'Kontroll', value: when(controlDate) },
      ],
      text: en ? `When we measured a ${mm} mm bulb.` : `Ekkor mértünk ${mm} mm-es hagymafejet.`,
      target: 'szentkiraly-fejlodes',
    })
  }

  // 4. The tomato field: the date with the largest loose-layer difference, plus shoot length
  const tomato = last(researchData(szentkiralyTomato, locale).seasons)
  const tomatoHu = last(szentkiralyTomato.seasons)
  if (tomato) {
    const control = tomato.treatments.find((t) => t.role === 'control')!
    const spade = tomato.treatments.find((t) => t.role === 'spade')!
    const k = tomato.values[control.id]
    const a = tomato.values[spade.id]
    const i = a.reduce((best, _, j) => (a[j] - k[j] > a[best] - k[best] ? j : best), 0)
    const shoot = tomato.facts[tomatoHu.facts.findIndex((f) => f.label === 'Hajtáshossz')]
    findings.push({
      id: 'paradicsom',
      where: `Szentkirály · ${en ? 'processing tomato' : 'ipari paradicsom'} · ${tomato.year}`,
      title: en ? 'The spaded soil is looser on the new field too' : 'Az új táblán is az ásógépes talaj lazább',
      rows: [
        { label: `${en ? 'Loose layer' : 'Laza réteg'}, ${when(tomato.dates[i])}`, value: `${cm(k[i])} → ${cm(a[i])} cm` },
        ...(shoot ? [{ label: `${shoot.label}, ${when(shoot.when)}`, value: `${shoot.control} → ${shoot.spade} ${shoot.unit}` }] : []),
      ],
      text: en ? 'Combination cultivator → spading machine.' : `${control.short} → ásógép.`,
      target: 'szentkiraly-paradicsom',
    })
  }

  // 5. Lakitelek, latest season: the spread of the 7 parcels per date (a caveat, not a win)
  const lk = last(researchData(lakitelekSeasons, locale).seasons)
  if (lk) {
    const spreads = lk.dates.map((d, j) => ({ when: d, flag: lk.dateFlags?.[j], vs: lk.parcels.map((p) => p.values[j]) }))
    findings.push({
      id: 'lakitelek',
      where: `Lakitelek · ${lk.info.crop.toLowerCase()} · ${lk.year}`,
      title: en
        ? `The ${lk.parcels.length} combinations differ in spring and even out by summer`
        : `A ${lk.parcels.length} kombináció tavasszal eltér, nyárra kiegyenlítődik`,
      rows: spreads.map((s) => ({
        label: when(s.when) + (s.flag ? ` (${s.flag})` : ''),
        value: `${range(s.vs)} cm`,
      })),
      text: en
        ? 'Depth of the loose layer on the seven plots (lowest–highest). The value measured on stubble cannot be compared with the end-of-season measurements of other years.'
        : 'A laza réteg mélysége a hét parcellán (legkisebb–legnagyobb). A tarlón mért érték nem vethető össze más évek tenyészidő végi mérésével.',
      target: 'lakitelek-chart',
      caveat: true,
    })
  }

  return findings
}

const FINDINGS = { hu: buildFindings('hu'), en: buildFindings('en') }

const TEXT = {
  hu: {
    badge: 'Fő eredmények',
    title: `Mit mutat ${RESEARCH_YEARS.length} év mérése?`,
    more: 'Részletek',
    note: 'A talajélet (MicroBIOMETER) kísérő adat: egyértelmű ásógépes előnyt nem mutat, ezért nem szerepel az eredmények között.',
  },
  en: {
    badge: 'Key results',
    title: `What do ${RESEARCH_YEARS.length} years of measurements show?`,
    more: 'Details',
    note: 'Soil life (MicroBIOMETER) is supporting data: it shows no clear advantage for the spading machine, so it is not listed among the results.',
  },
}

/** Fő eredmények (right after the hero): the main results of all seasons, each with a jump down to its details */
export default function SummarySection() {
  const { scrollToSection } = useScrollNav()
  const locale = useLocale()
  const findings = FINDINGS[locale]
  const t = TEXT[locale]

  return (
    <div className={`${frame.timelinePage} ${styles.page}`}>
      <div className={frame.header}>
        <div className={frame.headerBadge}>
          <span>{t.badge} · {RESEARCH_YEARS.join('–')}</span>
        </div>
        <h2 className={`${frame.headerTitle} ${styles.title}`}>{t.title}</h2>
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
              {t.more}
              <ArrowDown size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        {t.note}
      </p>
    </div>
  )
}
