'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { MapPin, Box, Layers, Award, Info, CheckCircle, X } from 'lucide-react'
import TreatmentIcon, { getTreatmentIconType } from '../TreatmentIcon'
import { locations } from '@/lib/data'
import styles from './LakitelekChartPage.module.css'

const FieldChart3DCanvas = dynamic(() => import('../FieldChart3DCanvas'), { ssr: false })

const data = locations.lakitelek
const parcels = data.parcels || []
const conclusions = data.conclusions

export default function LakitelekChartPage() {
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d')
  const [selectedMonth, setSelectedMonth] = useState<'may' | 'jun' | 'aug'>('aug')
  const [hoveredParcel, setHoveredParcel] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  const maxValue = 45
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerLeft}>
          <div className={styles.headerBadge}>
            <MapPin size={12} />
            <span>Lakitelek</span>
          </div>
          <h3 className={styles.headerTitle}>7 művelési kombináció összehasonlítása</h3>
          <p className={styles.headerSubtitle}>Laza talajréteg mélysége a mérési időszakban (cm)</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === '2d' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('2d')}
            >
              <Box size={16} />
              <span>2D</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === '3d' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('3d')}
            >
              <Layers size={16} />
              <span>3D</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chart Content */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {activeTab === '2d' ? (
            <motion.div
              key="2d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.chartArea}
            >
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

              {/* 2D Chart */}
              <div className={styles.fieldWrapper}>
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
                          <div className={styles.referenceBar} />
                          <motion.div
                            className={styles.compactedZone}
                            initial={{ height: 0 }}
                            animate={{ height: `${100 - getBarHeight(value)}%` }}
                            transition={{ duration: 0.8, delay: 0.4 + index * 0.08 }}
                          />
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

                        {/* Treatment name */}
                        <div className={styles.treatmentName}>{parcel.treatment}</div>
                      </motion.div>
                    )
                  })}
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
            </motion.div>
          ) : (
            <motion.div
              key="3d"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.chart3DArea}
            >
              <FieldChart3DCanvas parcels={parcels} conclusions={conclusions} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Button + Tooltip */}
      <div className={styles.resultsButtonWrapper}>
        <motion.button
          className={styles.resultsButton}
          onClick={() => setShowResults(!showResults)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Info size={16} />
          <span>Eredmények összefoglalása</span>
        </motion.button>

        {/* Results Tooltip/Modal */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              className={styles.resultsTooltip}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.resultsHeader}>
                <h5>Eredmények összefoglalása</h5>
                <button className={styles.closeButton} onClick={() => setShowResults(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className={styles.resultsTable}>
                {parcels.map((parcel) => {
                  const isBest = isBestResult(parcel.num)
                  return (
                    <div
                      key={parcel.num}
                      className={`${styles.resultRow} ${isBest ? styles.resultRowBest : ''}`}
                    >
                      <div className={styles.resultLeft}>
                        <span className={styles.resultNum}>
                          {isBest && <CheckCircle size={12} className={styles.resultCheckIcon} />}
                          {parcel.num}
                        </span>
                        <span className={styles.resultTreatment}>{parcel.treatment}</span>
                      </div>
                      <div className={styles.resultRight}>
                        <span className={styles.resultDesc}>{parcel.description}</span>
                        <span className={`${styles.resultRating} ${parcel.rating >= 90 ? styles.resultRatingGood : ''}`}>
                          {parcel.rating}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Box */}
      {conclusions && (
        <motion.div
          className={styles.summaryBox}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
        >
          <p>{conclusions.summary}</p>
        </motion.div>
      )}
    </div>
  )
}
