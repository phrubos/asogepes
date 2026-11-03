'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Timeline from '../Timeline'
import { szentkiralySeasons, findSeason } from '@/lib/seasons'
import { useSeason } from '../season/SeasonContext'
import SeasonSwitch from '../season/SeasonSwitch'
import YearBridge from '../season/YearBridge'
import styles from './SzentkirályTimelinePage.module.css'

const site = szentkiralySeasons
const siteYears = site.seasons.map((s) => s.year)

export default function SzentkirályTimelinePage() {
  const { year } = useSeason()
  const season = findSeason(site, year) ?? site.seasons[site.seasons.length - 1]
  const ll = season.looseLayer

  return (
    <div className={styles.timelinePage}>
      {/* Compact Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerBadge}>
          <MapPin size={12} />
          <span>Szentkirály</span>
        </div>
        <h3 className={styles.headerTitle}>A talajszerkezet változása</h3>
        <div className={styles.seasonRow}>
          <SeasonSwitch years={siteYears} small />
        </div>
      </motion.div>

      {/* Timeline Chart: remounted per season so the bars grow again */}
      <motion.div
        className={styles.chartContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Timeline
          key={season.year}
          title={ll.title}
          dates={ll.dates}
          scaleMax={site.looseLayerMax}
          series={season.treatments.map((t) => ({
            key: t.id,
            label: t.label,
            short: t.short,
            role: t.role,
            deep: t.deep,
            flag: t.flag,
            values: ll.values[t.id],
          }))}
          cards={ll.cards.map((c) => ({ key: c.treatmentId, title: c.title, text: c.text }))}
          summary={ll.summary}
          aside={<YearBridge site={site} />}
        />
      </motion.div>
    </div>
  )
}
