'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Maximize2, X, CheckCircle, Award, Sparkles, TrendingUp, Layers } from 'lucide-react'
import { locations } from '@/lib/data'
import styles from './LakitelekChartPage.module.css'

const FieldChart3DCanvas = dynamic(() => import('../FieldChart3DCanvas'), { ssr: false })

const data = locations.lakitelek
const parcels = data.parcels || []
const conclusions = data.conclusions

export default function LakitelekChartPage() {
  const [isChartFullscreen, setIsChartFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isBestResult = (num: string) => conclusions?.bestResults.includes(num)

  // Handle escape key to exit fullscreen chart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChartFullscreen) {
        setIsChartFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isChartFullscreen])

  // Toggle fullscreen (pure chart mode)
  const toggleFullscreen = () => {
    setIsChartFullscreen(!isChartFullscreen)
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerLeft}>
          <div className={styles.headerBadge}>
            <MapPin size={10} />
            <span>Lakitelek</span>
          </div>
          <div className={styles.titleGroup}>
            <h3 className={styles.headerTitle}>A laza talajréteg mélységének változása 3 hónap alatt</h3>
            <span className={styles.headerSubtitle}>7 művelési kombináció összehasonlítása</span>
          </div>
        </div>

        {/* Fullscreen Toggle Button */}
        <motion.button
          className={styles.fullscreenButton}
          onClick={toggleFullscreen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isChartFullscreen ? "Vissza" : "Teljes képernyő"}
        >
          {isChartFullscreen ? <X size={18} /> : <Maximize2 size={18} />}
          <span>{isChartFullscreen ? "Normál nézet" : "Teljes képernyő"}</span>
        </motion.button>
      </motion.div>

      {/* Main Content - Split Layout */}
      <div className={`${styles.mainContent} ${isChartFullscreen ? styles.modeFullscreen : ''}`}>

        {/* Left: 3D Visualization */}
        <motion.div
          className={styles.visualizationArea}
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className={styles.vizCanvas}>
            <FieldChart3DCanvas parcels={parcels} conclusions={conclusions} />
          </div>

          {/* Legend overlay is inside Canvas component for now, or we can overlay here if needed */}
        </motion.div>

        {/* Right: Results Panel */}
        <AnimatePresence mode="popLayout">
          {!isChartFullscreen && (
            <motion.div
              className={styles.sidePanel}
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '400px' }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className={styles.resultsPanel}>
                <div className={styles.resultsPanelHeader}>
                  <div className={styles.resultsTitleGroup}>
                    <TrendingUp size={16} className={styles.resultsIcon} />
                    <h4>Eredmények összefoglalása</h4>
                  </div>
                </div>

                <div className={styles.resultsTableWrapper}>
                  <div className={styles.resultsTable}>
                    {parcels.map((parcel, index) => {
                      const isBest = isBestResult(parcel.num)
                      return (
                        <motion.div
                          key={parcel.num}
                          className={`${styles.resultRow} ${isBest ? styles.resultRowBest : ''}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                        >
                          <div className={styles.resultLeft}>
                            <span className={`${styles.resultNum} ${isBest ? styles.resultNumBest : ''}`}>
                              {parcel.num}
                              {isBest && <sup className={styles.bestGridStar}>★</sup>}
                            </span>
                            <div className={styles.resultInfo}>
                              <span className={styles.resultTreatment}>{parcel.treatment}</span>
                              <span className={styles.resultDesc}>{parcel.description}</span>
                            </div>
                          </div>
                          <div className={styles.resultRight}>
                            <div className={`${styles.ratingBar} ${isBest ? styles.ratingBarBest : ''}`}>
                              <motion.div
                                className={styles.ratingFill}
                                initial={{ width: 0 }}
                                animate={{ width: `${parcel.rating}%` }}
                                transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                              />
                            </div>
                            <span className={`${styles.resultRating} ${parcel.rating >= 90 ? styles.resultRatingGood : ''}`}>
                              {parcel.rating}%
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Conclusion Box */}
              {conclusions && (
                <motion.div
                  className={styles.conclusionBox}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className={styles.conclusionHeader}>
                    <Award size={18} />
                    <span>Következtetés</span>
                  </div>
                  <p className={styles.conclusionText}>{conclusions.summary}</p>
                  <div className={styles.conclusionBestList}>
                    <span className={styles.conclusionBestLabel}>Legnagyobb hatékonyság:</span>
                    <div className={styles.conclusionBestItems}>
                      {conclusions.bestResults.map((num) => (
                        <span key={num} className={styles.conclusionBestItem}>{num}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
