'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Timeline from '../Timeline'
import { locations } from '@/lib/data'
import SeasonOnly from '../season/SeasonOnly'
import styles from './KecskemétTimelinePage.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { useResearchData } from '@/lib/i18n/useResearchData'


export default function KecskemétTimelinePage() {
  const data = useResearchData(locations).kecskemet
  const en = useLocale() === 'en'
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
          <span>Kecskemét-Borbás</span>
        </div>
        <div className={styles.seasonRow}>
          <SeasonOnly years={[2025]} />
        </div>
        <h3 className={styles.headerTitle}>{en ? 'Change in soil structure' : 'A talajszerkezet változása'}</h3>
      </motion.div>

      {/* Timeline Chart */}
      <motion.div
        className={styles.chartContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {data.chartData && (
          <Timeline
            data={data.chartData}
            title={en ? `Change in the depth of the loose soil layer over ${data.chartData.length} months` : `A laza talajréteg mélységének változása ${data.chartData.length} hónap alatt`}
            evaluations={data.evaluations}
          />
        )}
      </motion.div>
    </div>
  )
}
