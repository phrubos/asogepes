'use client'

import { motion } from 'framer-motion'
import { MapPin, Layers, Ruler, Leaf, Droplets, Calendar } from 'lucide-react'
import { locations } from '@/lib/data'
import { szentkiralySeasons, findSeason, type Treatment } from '@/lib/seasons'
import { useSeason } from '../season/SeasonContext'
import SeasonSwitch from '../season/SeasonSwitch'
import styles from './SzentkirályInfoPage.module.css'

const data = locations.szentkiraly
const site = szentkiralySeasons
const siteYears = site.seasons.map((s) => s.year)

// The site facts arrive together as one block (no stagger): they are a table, not a sequence
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
}

function TreatmentCard({ t }: { t: Treatment }) {
  const spade = t.role === 'spade'
  return (
    <div className={`${styles.treatment} ${spade ? styles.treatmentSpade : styles.treatmentControl} ${t.deep ? styles.treatmentDeep : ''}`}>
      <div className={styles.treatmentHeader}>
        <span className={styles.treatmentBadge}>{t.label}</span>
      </div>
      <ul className={styles.treatmentList}>
        {t.steps.map((step, i) => (
          <li key={i}>
            {/ásógép|mélylazítás/i.test(step) ? <strong>{step}</strong> : step}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SzentkirályInfoPage() {
  const { year } = useSeason()
  const season = findSeason(site, year) ?? site.seasons[site.seasons.length - 1]
  const info = season.info
  const control = season.treatments.find((t) => t.role === 'control' && !t.deep)
  const spade = season.treatments.find((t) => t.role === 'spade' && !t.deep)
  const twoWay = season.treatments.length === 2 && control && spade

  const infoItems = [
    { icon: Layers, label: 'Talaj', value: info.soil },
    { icon: Ruler, label: 'KA érték', value: info.ka },
    { icon: Leaf, label: 'Kultúra', value: info.crop },
    { icon: Droplets, label: 'Öntözés', value: info.irrigation },
    { icon: Calendar, label: 'Vizsgált időszak', value: info.period },
    { icon: MapPin, label: data.measurementLabel || 'Mérések', value: info.measurements },
  ]

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
        <div className={styles.seasonRow}>
          <SeasonSwitch years={siteYears} small />
        </div>
      </motion.div>

      {/* Info Grid */}
      <motion.div
        key={`grid-${season.year}`}
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

      {/* Treatments: kontroll vs ásógép (two), or a shared base plus every treatment (more) */}
      <motion.div
        key={`treat-${season.year}`}
        className={twoWay ? styles.treatmentComparison : styles.treatmentMulti}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className={styles.treatmentMainHeader}>MŰVELÉSI LÉPÉSEK</h3>

        {twoWay ? (
          <>
            <TreatmentCard t={control} />
            <div className={styles.treatmentVs}>
              <span>VS</span>
            </div>
            <TreatmentCard t={spade} />
          </>
        ) : (
          <>
            {info.base && (
              <div className={styles.treatmentBase}>
                <span className={styles.treatmentBaseLabel}>Közös alap</span>
                <span className={styles.treatmentBaseText}>{info.base}</span>
                {info.treatmentNote && <span className={styles.treatmentBaseNote}>{info.treatmentNote}</span>}
              </div>
            )}
            {season.treatments.map((t) => <TreatmentCard key={t.id} t={t} />)}
          </>
        )}
      </motion.div>
    </div>
  )
}
