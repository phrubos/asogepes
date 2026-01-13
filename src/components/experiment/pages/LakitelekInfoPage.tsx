'use client'

import { motion } from 'framer-motion'
import { MapPin, Layers, Ruler, Leaf, Droplets, Calendar, Grid3X3 } from 'lucide-react'
import { locations } from '@/lib/data'
import styles from './LakitelekInfoPage.module.css'

const data = locations.lakitelek

const infoItems = [
  { icon: Layers, label: 'Talaj', value: data.soil },
  { icon: Ruler, label: 'KA érték', value: data.ka },
  { icon: Leaf, label: 'Kultúra', value: data.crop },
  { icon: Droplets, label: 'Öntözés', value: data.irrigation },
  { icon: Calendar, label: 'Vizsgált időszak', value: data.period },
  { icon: MapPin, label: data.measurementLabel || 'Mérések', value: data.measurements },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function LakitelekInfoPage() {
  return (
    <div className={styles.infoPage}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.headerBadge}>
          <MapPin size={12} />
          <span>03. helyszín</span>
        </div>
        <h2 className={styles.headerTitle}>{data.name}</h2>
        <div className={styles.headerLine} />
      </motion.div>

      {/* Info Grid - 6 cards in 2 rows */}
      <motion.div
        className={styles.infoGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {infoItems.map((item, idx) => {
          const IconComponent = item.icon
          const isMeasurement = item.label.includes('mérések') || item.label.includes('Mérések')
          const isKA = item.label === 'KA érték'

          return (
            <motion.div
              key={idx}
              className={`${styles.infoCard} ${isMeasurement ? styles.measurement : ''}`}
              variants={itemVariants}
            >
              <div className={styles.infoIcon}>
                <IconComponent size={16} strokeWidth={1.5} />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  {isKA ? <>Arany-féle kötöttség (K<sub>A</sub>)</> : item.label}
                </span>
                <span className={styles.infoValue}>{item.value}</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Special card: 7 treatments */}
      {/* Special card: 7 treatments */}
      <motion.div
        className={styles.treatmentsWrapper}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className={styles.treatmentMainHeader}>MŰVELÉSI LÉPÉSEK</h3>

        <div className={styles.treatmentsCard}>
          <div className={styles.treatmentsContentRow}>
            <div className={styles.treatmentsIconWrapper}>
              <div className={styles.treatmentsIcon}>
                <Grid3X3 size={20} strokeWidth={1.5} />
              </div>
            </div>
            <div className={styles.treatmentsContent}>
              <span className={styles.treatmentsLabel}>7 művelési kombináció összehasonlítása</span>
              <p className={styles.treatmentsDescription}>
                Lakiteleken 7 különböző művelési kombinációt vizsgáltunk egymás mellett, azonos körülmények között. A vizsgálati eredmények feltárják, hogy melyik művelési technológia őrzi meg legjobban a talaj optimálisan laza szerkezetét.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
