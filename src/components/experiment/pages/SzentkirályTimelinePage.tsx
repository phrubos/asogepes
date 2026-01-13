'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import Timeline from '../Timeline'
import { locations } from '@/lib/data'
import styles from './SzentkirályTimelinePage.module.css'

const data = locations.szentkiraly

export default function SzentkirályTimelinePage() {
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
            title={`A laza talajréteg mélységének változása ${data.chartData.length} hónap alatt`}
            evaluations={data.evaluations}
          />
        )}
      </motion.div>
    </div>
  )
}
