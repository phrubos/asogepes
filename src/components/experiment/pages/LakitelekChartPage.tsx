'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Maximize2, X, CheckCircle, Award, Sparkles, TrendingUp, Layers, Play } from 'lucide-react'
import { locations } from '@/lib/data'
import styles from './LakitelekChartPage.module.css'

const FieldChart3DCanvas = dynamic(() => import('../FieldChart3DCanvas'), { ssr: false })

const data = locations.lakitelek
const parcels = data.parcels || []
const conclusions = data.conclusions

export default function LakitelekChartPage() {
  const [isChartFullscreen, setIsChartFullscreen] = useState(false)
  const [isChartLoaded, setIsChartLoaded] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isBestResult = (num: string) => conclusions?.bestResults.includes(num)

  // Auto-load chart on fullscreen
  useEffect(() => {
    if (isChartFullscreen && !isChartLoaded) {
      setIsChartLoaded(true)
    }
  }, [isChartFullscreen, isChartLoaded])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChartFullscreen) {
        setIsChartFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isChartFullscreen])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsChartFullscreen(!isChartFullscreen)
    // Reset sidebar state when entering/exiting
    if (!isChartFullscreen) setShowResults(false)
  }

  // Common Results Panel Content (reusable)
  const ResultsContent = () => (
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
                    {/* Percentage removed */}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )



  return (
    <>
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
              <h3 className={styles.headerTitle}>A laza talajréteg mélységének változása 4 hónap alatt</h3>
              <span className={styles.headerSubtitle}>7 művelési kombináció összehasonlítása</span>
            </div>
          </div>

          <motion.button
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Teljes képernyő"
          >
            <Maximize2 size={18} />
            <span>Teljes képernyő</span>
          </motion.button>
        </motion.div>

        {/* Embedded Content */}
        {!isChartFullscreen && (
          <div className={styles.mainContent}>
            <motion.div className={styles.visualizationArea}>
              <div className={styles.vizCanvas}>
                <AnimatePresence mode="wait">
                  {!isChartLoaded ? (
                    <motion.div
                      key="placeholder"
                      className={styles.customPlaceholder}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.5 } }}
                    >
                      <div className={styles.fakeChartBlur} />
                      <div className={styles.playButtonContainer}>
                        <motion.button
                          className={`${styles.playButton} ${styles.playButtonPulse}`}
                          onClick={() => setIsChartLoaded(true)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play size={40} className={styles.playIcon} fill="currentColor" />
                        </motion.button>
                        <motion.div
                          className={styles.playLabel}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className={styles.playLabelTitle}>3D Modell Betöltése</span>
                          <span className={styles.playLabelSubtitle}>Interaktív vizualizáció</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <FieldChart3DCanvas parcels={parcels} conclusions={conclusions} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className={styles.sidePanel}>
              <ResultsContent />
              {/* Conclusion hidden in embedded view per user request */}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Portal */}
      {isChartFullscreen && createPortal(
        <div className={styles.fullscreenOverlay}>
          <div className={styles.backdropBlur} onClick={toggleFullscreen} />
          <motion.div
            className={styles.fullscreenContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className={styles.fullscreenHeader}>
              <div className={styles.fullscreenHeaderLeft}>
                <div className={styles.fullscreenTitleGroup}>
                  <h3 className={styles.fullscreenTitle}>Lakitelek</h3>
                  <span className={styles.fullscreenSubtitle}>Részletes elemzés és összehasonlítás</span>
                </div>
              </div>

              {/* Fullscreen Legend - Centered */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '6px 16px',
                borderRadius: '100px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                margin: '0 32px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span style={{ width: '12px', height: '12px', background: 'linear-gradient(180deg, rgba(129, 199, 132, 0.8) 0%, rgba(74, 103, 65, 0.9) 100%)', borderRadius: '3px' }}></span>
                  <span>Optimális szerkezetű talaj mélysége</span>
                </div>
                <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.15)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span style={{ color: '#d4a84b', fontSize: '14px', lineHeight: 1 }}>★</span>
                  <span>Legnagyobb hatékonyság</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <motion.button
                  className={styles.actionButton}
                  onClick={() => setShowResults(!showResults)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layers size={18} />
                  <span>{showResults ? 'Eredmények elrejtése' : 'Eredmények mutatása'}</span>
                </motion.button>
                <button className={styles.closeButton} onClick={toggleFullscreen}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className={styles.fullscreenContent}>
              <div className={styles.fullscreenVisualization}>
                <div className={styles.vizCanvas}>
                  <FieldChart3DCanvas
                    parcels={parcels}
                    conclusions={conclusions}
                    isFullscreen={true}
                  />
                </div>
              </div>

              <AnimatePresence>
                {showResults && (
                  <motion.div
                    className={styles.fullscreenSidePanel}
                    initial={{ x: 420, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 420, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ResultsContent />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  )
}
