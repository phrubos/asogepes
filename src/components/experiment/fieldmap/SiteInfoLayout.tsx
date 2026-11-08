'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Layers, Leaf, Droplets, Calendar, Gauge, type LucideIcon } from 'lucide-react'
import { inYear } from '../season/SeasonOnly'
import styles from './SiteInfoLayout.module.css'

/*
 * "Helyszín adatok" for every site (ticket 006): header and a short ruled fact list on the left, the field
 * map on the right; phones and tablets stack header, map, facts. An optional block (treatment cards) runs
 * full width underneath.
 */

export interface Fact {
  icon: LucideIcon
  label: string
  value: string
  sub?: ReactNode
}

interface SiteInfo {
  soil: string
  ka: string
  crop: string
  irrigation: string
  period: string
  measurements: string
}

/** "450 mm (120 nap), lineárral" → ["450 mm", "120 nap, lineárral"]; "kb. 120 mm csapadék + kb. 60 mm öntözés" → split at "+" */
function splitWater(s: string): [string, string?] {
  const plus = s.split(' + ')
  if (plus.length > 1) return [plus[0], `+ ${plus.slice(1).join(' + ')}`]
  const m = s.match(/^(.*?mm)\s*\((.*?)\),?\s*(.*)$/)
  return m ? [m[1], [m[2], m[3]].filter(Boolean).join(', ')] : [s]
}

/** The five facts every site has. `prev` (last season) adds "2025-ben ipari paradicsom" when the crop changed. */
export function siteFacts(info: SiteInfo, prev?: { year: number; crop: string }): Fact[] {
  const [measured, ...rest] = info.measurements.split(', ')
  const [water, waterSub] = splitWater(info.irrigation)
  return [
    { icon: Layers, label: 'Talaj', value: info.soil, sub: <>K<sub>A</sub> {info.ka} (Arany-féle kötöttség)</> },
    { icon: Leaf, label: 'Kultúra', value: info.crop, sub: prev && prev.crop !== info.crop ? `${inYear(prev.year)} ${prev.crop.toLowerCase()}` : undefined },
    { icon: Droplets, label: info.irrigation.includes('csapadék') ? 'Víz' : 'Öntözés', value: water, sub: waterSub },
    { icon: Calendar, label: 'Időszak', value: info.period },
    { icon: Gauge, label: 'Mérések', value: measured, sub: ['penetrométerrel', ...rest].join(', ') },
  ]
}

interface Props {
  badge: string
  /** Season switch or the single-season tag */
  season: ReactNode
  title: string
  lead: ReactNode
  facts: Fact[]
  /** Changes when the season changes: the fact list fades in again */
  factsKey: string | number
  map: ReactNode
  children?: ReactNode
}

export default function SiteInfoLayout({ badge, season, title, lead, facts, factsKey, map, children }: Props) {
  return (
    <div className={`${styles.infoPage} ${children ? styles.withBelow : ''}`}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={styles.headerBadge}>
            <MapPin size={12} />
            <span>{badge}</span>
          </span>
          {season}
        </div>
        <h2 className={styles.headerTitle}>{title}</h2>
        <p className={styles.lead}>{lead}</p>
      </div>

      {/* one list, swapped per season with a short fade (opacity only: Framer owns no transform here) */}
      <motion.ul
        key={`facts-${factsKey}`}
        className={styles.facts}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {facts.map((f) => {
          const Icon = f.icon
          return (
            <li key={f.label} className={styles.fact}>
              <Icon className={styles.factIcon} size={20} strokeWidth={1.5} aria-hidden="true" />
              <span className={styles.factLabel}>{f.label}</span>
              <span className={styles.factValue}>
                {f.value}
                {f.sub && <small>{f.sub}</small>}
              </span>
            </li>
          )
        })}
      </motion.ul>

      <div className={styles.mapCol}>{map}</div>

      {children && <div className={styles.below}>{children}</div>}
    </div>
  )
}
