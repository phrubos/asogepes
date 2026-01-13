'use client'

import { motion } from 'framer-motion'
import { MapPin, Layers, Ruler, Leaf, Droplets, Calendar } from 'lucide-react'
import { locations } from '@/lib/data'
import styles from './SzentkirályInfoPage.module.css'

const data = locations.szentkiraly

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

export default function SzentkirályInfoPage() {
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
          <span>01. helyszín</span>
        </div>
        <h2 className={styles.headerTitle}>{data.name}</h2>
        <div className={styles.headerLine} />
      </motion.div>

      {/* Info Grid */}
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

      {/* Treatment Comparison */}
      <motion.div
        className={styles.treatmentComparison}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className={styles.treatmentMainHeader}>MŰVELÉSI LÉPÉSEK</h3>

        {/* Control Treatment */}
        <div className={`${styles.treatment} ${styles.treatmentControl}`}>
          <div className={styles.treatmentHeader}>
            <span className={styles.treatmentBadge}>Kontroll</span>
          </div>
          <ul className={styles.treatmentList}>
            {data.control?.treatments.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        {/* VS Divider */}
        <div className={styles.treatmentVs}>
          <span>VS</span>
        </div>

        {/* Spade Treatment */}
        <div className={`${styles.treatment} ${styles.treatmentSpade}`}>
          <div className={styles.treatmentHeader}>
            <span className={styles.treatmentBadge}>Ásógépezett</span>
          </div>
          <ul className={styles.treatmentList}>
            {data.spade?.treatments.map((t, i) => (
              <li key={i}>
                {t.toLowerCase().includes('ásógép') || t.toLowerCase().includes('mélylazítás')
                  ? <strong>{t}</strong>
                  : t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
