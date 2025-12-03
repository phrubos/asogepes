'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import LocationTabs from '@/components/experiment/LocationTabs'
import styles from '@/components/experiment/Experiment.module.css'

export default function KiserletPage() {
  return (
    <section className={`section ${styles.sectionExperiment}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader number="03" title="A Kísérlet" />
        </motion.div>

        <LocationTabs />
      </div>
    </section>
  )
}
