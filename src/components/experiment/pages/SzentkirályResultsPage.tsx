'use client'

import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import TemperatureChart from '../TemperatureChart'
import { locations } from '@/lib/data'
import styles from './SzentkirályResultsPage.module.css'

const data = locations.szentkiraly

export default function SzentkirályResultsPage() {
  return (
    <div className={styles.resultsPage}>
      {/* Section 1: Temperature */}
      <div className={styles.section}>
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
          <h3 className={styles.headerTitle}>Talajhőmérséklet vizsgálat</h3>
        </motion.div>

        {data.temperatureData && (
          <motion.div
            className={styles.chartContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TemperatureChart data={data.temperatureData} />
          </motion.div>
        )}
      </div>

      {/* Section 2: Photos */}
      <div className={styles.section}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className={styles.headerTitle}>Fotók</h3>
        </motion.div>

        {data.highlight && (
          <motion.div
            className={styles.highlight}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.highlightImage}>
              <div className={styles.imagePlaceholder}>
                <span>Összehasonlító fotó</span>
                <span className={styles.placeholderSub}>Gyomborítottság különbsége</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
