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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isBestResult = (num: string) => conclusions?.bestResults.includes(num)

  // Track client-side mounting for portal
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  return (
    <>
      <div ref={containerRef} className={styles.container}>
        {/* Header - Minimal */}
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
            <h3 className={styles.headerTitle}>7 kezelés összehasonlítása</h3>
          </div>
        </motion.div>

        {/* Main Content - 3D Chart fills the space */}
        <div className={styles.mainContent}>
          <motion.div
            className={styles.visualizationArea}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative corner accents */}
            <div className={styles.cornerTL} />
            <div className={styles.cornerBR} />

            <div className={styles.canvasWrapper}>
              <FieldChart3DCanvas parcels={parcels} conclusions={conclusions} />
            </div>

            {/* Fullscreen Button - Floating */}
            <motion.button
              className={styles.fullscreenButton}
              onClick={() => setIsFullscreen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Maximize2 size={16} />
              <span>Teljes képernyő</span>
            </motion.button>
          </motion.div>

          {/* Summary Box - Elegant highlight */}
          <motion.div
            className={styles.summaryBox}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={styles.summaryIcon}>
              <Sparkles size={16} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryLabel}>Következtetés</span>
              <p className={styles.summaryText}>
                {conclusions?.summary || "Ezen a talajon önmagában csak a mélyásógép javasolható. A kombinációk közül a szántott és normál mélységben ásógépezett variációk bizonyultak a legtartósabbnak."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Modal - Rendered via Portal to escape stacking context */}
      {isMounted && createPortal(
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              className={styles.fullscreenOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Backdrop blur layer */}
              <div className={styles.backdropBlur} onClick={() => setIsFullscreen(false)} />

              <motion.div
                className={styles.fullscreenContainer}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Fullscreen Header */}
                <div className={styles.fullscreenHeader}>
                  <div className={styles.fullscreenHeaderLeft}>
                    <div className={styles.headerBadge}>
                      <MapPin size={12} />
                      <span>Lakitelek</span>
                    </div>
                    <div className={styles.fullscreenTitleGroup}>
                      <h3 className={styles.fullscreenTitle}>Laza talajréteg mélysége</h3>
                      <span className={styles.fullscreenSubtitle}>7 művelési kombináció összehasonlítása a mérési időszakban</span>
                    </div>
                  </div>
                  <motion.button
                    className={styles.closeButton}
                    onClick={() => setIsFullscreen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Fullscreen Content - Split Layout */}
                <div className={styles.fullscreenContent}>
                  {/* Left: 3D Visualization */}
                  <div className={styles.fullscreenVisualization}>
                    <div className={styles.vizHeader}>
                      <Layers size={16} />
                      <span>3D Vizualizáció</span>
                    </div>
                    <div className={styles.vizCanvas}>
                      <FieldChart3DCanvas parcels={parcels} conclusions={conclusions} />
                    </div>
                  </div>

                  {/* Right: Results Panel */}
                  <div className={styles.fullscreenSidePanel}>
                    {/* Results Table */}
                    <div className={styles.resultsPanel}>
                      <div className={styles.resultsPanelHeader}>
                        <div className={styles.resultsTitleGroup}>
                          <TrendingUp size={16} className={styles.resultsIcon} />
                          <h4>Eredmények összefoglalása</h4>
                        </div>
                        <div className={styles.resultsBadge}>7 kezelés</div>
                      </div>

                      <div className={styles.resultsTableWrapper}>
                        <div className={styles.resultsTable}>
                          {parcels.map((parcel, index) => {
                            const isBest = isBestResult(parcel.num)
                            return (
                              <motion.div
                                key={parcel.num}
                                className={`${styles.resultRow} ${isBest ? styles.resultRowBest : ''}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                              >
                                <div className={styles.resultLeft}>
                                  <span className={`${styles.resultNum} ${isBest ? styles.resultNumBest : ''}`}>
                                    {isBest && <CheckCircle size={12} className={styles.checkIcon} />}
                                    {parcel.num}
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
                                      transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
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
                        transition={{ delay: 0.6 }}
                      >
                        <div className={styles.conclusionHeader}>
                          <Award size={18} />
                          <span>Következtetés</span>
                        </div>
                        <p className={styles.conclusionText}>{conclusions.summary}</p>
                        <div className={styles.conclusionBestList}>
                          <span className={styles.conclusionBestLabel}>Legjobb eredmények:</span>
                          <div className={styles.conclusionBestItems}>
                            {conclusions.bestResults.map((num) => (
                              <span key={num} className={styles.conclusionBestItem}>{num}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Escape hint */}
                <motion.div
                  className={styles.escapeHint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <kbd>ESC</kbd>
                  <span>billentyű a kilépéshez</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
