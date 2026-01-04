'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Droplets, Calendar, Layers, Leaf, Ruler } from 'lucide-react'
import Timeline from '../Timeline'
import TemperatureChart from '../TemperatureChart'
import IsometricFieldChart from '../IsometricFieldChart'
import styles from './LocationSection.module.css'

interface LocationData {
  name: string
  crop: string
  soil: string
  ka: string
  irrigation: string
  period: string
  measurements: string
  measurementLabel?: string
  treatmentCount?: string
  spade?: {
    treatments: string[]
  }
  control?: {
    treatments: string[]
  }
  chartData?: { month: string; spade: number; control: number }[]
  evaluations?: {
    control: string
    spade: string
    summary: string
  }
  temperatureData?: {
    depth1cm: { spade: number; control: number }
    depth5cm: { spade: number; control: number }
  }
  highlight?: { title: string; text: string }
  parcels?: {
    num: string
    treatment: string
    shortName: string
    may: number
    jun: number
    aug: number
    rating: number
    description: string
    good: boolean
  }[]
  conclusions?: {
    summary: string
    bestResults: string[]
  }
}

interface LocationSectionProps {
  id: string
  locationKey: string
  data: LocationData
  index: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function LocationSection({ id, locationKey, data, index }: LocationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const isLakitelek = locationKey === 'lakitelek'
  const isSzentkiraly = locationKey === 'szentkiraly'

  // Info items for the grid
  const infoItems = [
    { icon: Layers, label: 'Talaj', value: data.soil },
    { icon: Ruler, label: 'KA érték', value: data.ka },
    { icon: Leaf, label: 'Kultúra', value: data.crop },
    { icon: Droplets, label: 'Öntözés', value: data.irrigation },
    { icon: Calendar, label: 'Időszak', value: data.period },
    {
      icon: MapPin,
      label: data.measurementLabel || (isLakitelek ? 'Parcellák' : 'Mérések'),
      value: data.measurements
    },
  ]

  if (isLakitelek && data.treatmentCount) {
    infoItems.push({
      icon: Layers,
      label: 'Művelések',
      value: data.treatmentCount
    })
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className={styles.section}
      data-location={locationKey}
    >
      <div className={styles.sectionInner}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerBadge}>
            <MapPin size={14} />
            <span>{String(index + 1).padStart(2, '0')}. helyszín</span>
          </div>
          <h2 className={styles.headerTitle}>{data.name}</h2>
          <div className={styles.headerLine} />
        </motion.div>

        {/* Info Grid */}
        <motion.div
          className={styles.infoGrid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {infoItems.map((item, idx) => {
            const IconComponent = item.icon
            const isMeasurement = item.label.includes('mérések') || item.label.includes('Mérések') || item.label.includes('Parcellák')
            return (
              <motion.div
                key={idx}
                className={`${styles.infoCard} ${isMeasurement ? styles.measurement : ''}`}
                variants={itemVariants}
              >
                <div className={styles.infoIcon}>
                  <IconComponent size={18} strokeWidth={1.5} />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  <span className={styles.infoValue}>{item.value}</span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Treatment Comparison (Szentkirály & Kecskemét) */}
        {!isLakitelek && data.spade && data.control && (
          <motion.div
            className={styles.treatmentComparison}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Control Treatment */}
            <div className={`${styles.treatment} ${styles.treatmentControl}`}>
              <div className={styles.treatmentHeader}>
                <span className={styles.treatmentBadge}>Kontroll</span>
              </div>
              <ul className={styles.treatmentList}>
                {data.control.treatments.map((t, i) => (
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
                {data.spade.treatments.map((t, i) => (
                  <li key={i}>
                    {t.toLowerCase().includes('ásógép') || t.toLowerCase().includes('mélylazítás')
                      ? <strong>{t}</strong>
                      : t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Timeline Chart (Szentkirály & Kecskemét) */}
        {!isLakitelek && data.chartData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Timeline
              data={data.chartData}
              title={`A talaj tömörödése ${data.chartData.length} hónap alatt`}
              evaluations={data.evaluations}
            />
          </motion.div>
        )}

        {/* Temperature Chart (Szentkirály only) */}
        {isSzentkiraly && data.temperatureData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <TemperatureChart data={data.temperatureData} />
          </motion.div>
        )}

        {/* Highlight Section (Szentkirály & Kecskemét) */}
        {!isLakitelek && data.highlight && (
          <motion.div
            className={styles.highlight}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={styles.highlightImage}>
              <div className={styles.imagePlaceholder}>
                <span>Összehasonlító fotó</span>
                <span className={styles.placeholderSub}>
                  {isSzentkiraly ? 'Gyomborítottság különbsége' : 'Paradicsom állomány júniusban'}
                </span>
              </div>
            </div>
            <div className={styles.highlightContent}>
              <h4 className={styles.highlightTitle}>{data.highlight.title}</h4>
              <p
                className={styles.highlightText}
                dangerouslySetInnerHTML={{
                  __html: data.highlight.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Isometric Field Chart (Lakitelek only) */}
        {isLakitelek && data.parcels && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <IsometricFieldChart
              parcels={data.parcels}
              conclusions={data.conclusions}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
