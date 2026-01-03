'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { CheckCircle, Award } from 'lucide-react'
import TreatmentIcon, { getTreatmentIconType } from './TreatmentIcon'
import styles from './IsometricFieldChart.module.css'

interface ParcelData {
  num: string
  treatment: string
  shortName: string
  may: number
  jun: number
  aug: number
  rating: number
  description: string
  good: boolean
}

interface IsometricFieldChartProps {
  parcels: ParcelData[]
  conclusions?: {
    summary: string
    bestResults: string[]
  }
}

export default function IsometricFieldChart({ parcels, conclusions }: IsometricFieldChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })
  const [hoveredParcel, setHoveredParcel] = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<'may' | 'jun' | 'aug'>('aug')

  const maxValue = 45 // Maximum depth for scaling

  const months = [
    { key: 'may' as const, label: 'Május' },
    { key: 'jun' as const, label: 'Június' },
    { key: 'aug' as const, label: 'Augusztus' },
  ]

  const getBarHeight = (value: number) => (value / maxValue) * 100

  const isBestResult = (num: string) => conclusions?.bestResults.includes(num)

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h4 className={styles.title}>7 művelési kombináció összehasonlítása</h4>
        <p className={styles.subtitle}>
          Laza talajréteg mélysége a mérési időszakban (cm)
        </p>
      </motion.div>

      {/* Month selector */}
      <motion.div
        className={styles.monthSelector}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
      >
        {months.map((month) => (
          <button
            key={month.key}
            className={`${styles.monthButton} ${selectedMonth === month.key ? styles.monthActive : ''}`}
            onClick={() => setSelectedMonth(month.key)}
          >
            {month.label}
          </button>
        ))}
      </motion.div>

      {/* Isometric Field */}
      <div className={styles.fieldWrapper}>
        <div className={styles.isometricField}>
          {/* Grid lines for perspective */}
          <svg className={styles.gridSvg} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
            {/* Horizontal lines */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.line
                key={`h-${i}`}
                x1={50 + i * 12}
                y1={200 - i * 25}
                x2={750 - i * 12}
                y2={200 - i * 25}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
            {/* Vertical separators */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.line
                key={`v-${i}`}
                x1={50 + i * 87.5}
                y1={200}
                x2={50 + i * 87.5 + 30}
                y2={25}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
              />
            ))}
          </svg>

          {/* Parcels */}
          <div className={styles.parcelsContainer}>
            {parcels.map((parcel, index) => {
              const value = parcel[selectedMonth]
              const isHovered = hoveredParcel === index
              const isBest = isBestResult(parcel.num)

              return (
                <motion.div
                  key={parcel.num}
                  className={`${styles.parcel} ${isHovered ? styles.parcelHovered : ''} ${isBest ? styles.parcelBest : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
                  onMouseEnter={() => setHoveredParcel(index)}
                  onMouseLeave={() => setHoveredParcel(null)}
                >
                  {/* Parcel number badge */}
                  <div className={styles.parcelBadge}>
                    {parcel.num}
                    {isBest && <Award size={12} className={styles.bestIcon} />}
                  </div>

                  {/* Bar visualization */}
                  <div className={styles.barWrapper}>
                    {/* Reference bar (total depth) */}
                    <div className={styles.referenceBar} />

                    {/* Compacted zone (red) */}
                    <motion.div
                      className={styles.compactedZone}
                      initial={{ height: 0 }}
                      animate={{ height: `${100 - getBarHeight(value)}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.08 }}
                    />

                    {/* Loose zone (green) */}
                    <motion.div
                      className={styles.looseZone}
                      initial={{ height: 0 }}
                      animate={{ height: `${getBarHeight(value)}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.08 }}
                    >
                      <span className={styles.valueLabel}>{value}</span>
                    </motion.div>
                  </div>

                  {/* Treatment icon */}
                  <div className={styles.treatmentIcon}>
                    {getTreatmentIconType(parcel.treatment) && (
                      <TreatmentIcon
                        type={getTreatmentIconType(parcel.treatment)!}
                        size={24}
                        color="rgba(255,255,255,0.5)"
                      />
                    )}
                  </div>

                  {/* Short name */}
                  <div className={styles.shortName}>{parcel.shortName}</div>

                  {/* Tooltip on hover */}
                  <AnimatePresence mode="wait">
                    {isHovered && (
                      <motion.div
                        key={`tooltip-${parcel.num}`}
                        className={styles.tooltip}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.tooltipHeader}>
                          <span className={styles.tooltipNum}>{parcel.num}</span>
                          <span className={styles.tooltipTreatment}>{parcel.treatment}</span>
                        </div>
                        <div className={styles.tooltipValues}>
                          <div className={styles.tooltipValue}>
                            <span>Május</span>
                            <strong>{parcel.may} cm</strong>
                          </div>
                          <div className={styles.tooltipValue}>
                            <span>Június</span>
                            <strong>{parcel.jun} cm</strong>
                          </div>
                          <div className={styles.tooltipValue}>
                            <span>Augusztus</span>
                            <strong>{parcel.aug} cm</strong>
                          </div>
                        </div>
                        <div className={styles.tooltipRating}>
                          <span>Eredmény:</span>
                          <span className={`${styles.ratingValue} ${parcel.rating >= 90 ? styles.ratingGood : ''}`}>
                            {parcel.rating}%
                          </span>
                        </div>
                        <p className={styles.tooltipDesc}>{parcel.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        className={styles.legend}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.legendGreen}`} />
          <span>Laza talaj (optimális)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendColor} ${styles.legendRed}`} />
          <span>Tömörödött talaj</span>
        </div>
        <div className={styles.legendItem}>
          <Award size={14} className={styles.legendBestIcon} />
          <span>Legjobb eredmény (95%)</span>
        </div>
      </motion.div>

      {/* Results Summary */}
      {conclusions && (
        <motion.div
          className={styles.conclusions}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
        >
          <div className={styles.conclusionCards}>
            {parcels
              .filter((p) => isBestResult(p.num))
              .map((parcel) => (
                <div key={parcel.num} className={styles.conclusionCard}>
                  <div className={styles.conclusionHeader}>
                    <CheckCircle size={18} className={styles.conclusionIcon} />
                    <span className={styles.conclusionNum}>{parcel.num}</span>
                    <span className={styles.conclusionRating}>{parcel.rating}%</span>
                  </div>
                  <p className={styles.conclusionText}>{parcel.treatment}</p>
                  <p className={styles.conclusionDesc}>{parcel.description}</p>
                </div>
              ))}
          </div>

          <div className={styles.summaryBox}>
            <p>{conclusions.summary}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
