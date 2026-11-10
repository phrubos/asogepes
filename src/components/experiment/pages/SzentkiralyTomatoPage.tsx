'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Timeline from '../Timeline'
import { szentkiralyTomato } from '@/lib/seasons'
import SeasonOnly from '../season/SeasonOnly'
import AboveBelowGround from './AboveBelowGround'
// Same page frame as the onion field's loose-layer block
import styles from './SzentkirályTimelinePage.module.css'
import own from './SzentkiralyTomatoPage.module.css'

const site = szentkiralyTomato
const season = site.seasons[site.seasons.length - 1]

/** Szentkirály, the industrial tomato field measured from 2026 */
export default function SzentkiralyTomatoPage() {
  return (
    <div className={styles.timelinePage}>
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
        <h3 className={styles.headerTitle}>Új tábla: ipari paradicsom</h3>
        <div className={styles.seasonRow}>
          <SeasonOnly years={site.seasons.map((s) => s.year)} />
        </div>
        <p className={own.about}>{season.about}</p>
      </motion.div>

      <motion.div
        className={styles.chartContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Timeline
          title="A laza talajréteg mélysége, 3 mérés"
          dates={season.dates}
          scaleMax={site.looseLayerMax}
          series={season.treatments.map((t) => ({
            key: t.id,
            label: t.label,
            short: t.short,
            role: t.role,
            values: season.values[t.id],
          }))}
          cards={season.cards.map((c) => ({ key: c.treatmentId, title: c.title, text: c.text }))}
          summary={season.summary}
        />
      </motion.div>

      <AboveBelowGround />
    </div>
  )
}
