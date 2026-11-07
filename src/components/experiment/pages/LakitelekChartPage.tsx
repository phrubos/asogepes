'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Maximize2, X, TrendingUp, Layers, Play } from 'lucide-react'
import { lakitelekSeasons, LAKITELEK_YEARS, formatCm } from '@/lib/seasons'
import { useSeason } from '../season/SeasonContext'
import SeasonSwitch from '../season/SeasonSwitch'
import styles from './LakitelekChartPage.module.css'

const FieldChart3DCanvas = dynamic(() => import('../FieldChart3DCanvas'), { ssr: false })

export default function LakitelekChartPage() {
  const { year } = useSeason()
  const season = lakitelekSeasons.seasons.find((s) => s.year === year) ?? lakitelekSeasons.seasons[lakitelekSeasons.seasons.length - 1]
  const parcels = season.parcels
  const conclusions = { summary: season.summary, bestResults: season.bestResults }
  // 2025 has the researchers' rating per parcel; later seasons show the measured values
  const rated = parcels.every((p) => p.rating !== undefined)
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

      {/* scrolls inside the desktop panel, so it takes keyboard focus */}
      <div
        className={styles.resultsTableWrapper}
        tabIndex={0}
        role="region"
        aria-label="Eredmények összefoglalása – táblázat"
      >
        {!rated && (
          <div className={styles.seasonNote}>
            <p>{season.summary}</p>
            {season.flagNote && (
              <p className={styles.seasonFlagNote}>
                <span className={styles.flag}>tarló</span>
                {season.flagNote}
              </p>
            )}
          </div>
        )}
        {!rated && (
          <div className={styles.valuesHead} aria-hidden="true">
            <span>cm</span>
            <div className={styles.resultValues}>
              {season.dates.map((d, i) => (
                <span key={i} className={styles.valuesHeadCell}>
                  {d.month}
                  {d.third && <span className={styles.valuesHeadThird}>{d.third}</span>}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className={styles.resultsTable}>
          {parcels.map((parcel, index) => {
            const isBest = isBestResult(parcel.num)
            return (
              <motion.div
                key={parcel.num}
                className={`${styles.resultRow} ${isBest ? styles.resultRowBest : ''} ${rated ? '' : styles.resultRowCompact}`}
                // the table arrives as one block; Framer animates only opacity, the hover nudge is CSS's
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <div className={styles.resultLeft}>
                  <span className={`${styles.resultNum} ${isBest ? styles.resultNumBest : ''}`}>
                    {parcel.num}
                    {isBest && <sup className={styles.bestGridStar}>★</sup>}
                  </span>
                  <div className={styles.resultInfo}>
                    {rated ? (
                      <>
                        <span className={styles.resultTreatment}>{parcel.treatment}</span>
                        <span className={styles.resultDesc}>{parcel.description}</span>
                      </>
                    ) : (
                      <span className={`${styles.resultTreatment} ${styles.resultTreatmentWrap}`}>{parcel.detail}</span>
                    )}
                  </div>
                </div>
                {!rated ? (
                  <div
                    className={styles.resultValues}
                    aria-label={season.dates.map((_, i) => `${formatCm(parcel.values[i])} cm`).join(', ')}
                  >
                    {parcel.values.map((v, i) => (
                      <span key={i} className={`${styles.resultValue} ${season.dateFlags?.[i] ? styles.resultValueFlagged : ''}`}>
                        {formatCm(v)}
                      </span>
                    ))}
                  </div>
                ) : (
                <div className={styles.resultRight}>
                  <div className={`${styles.ratingBar} ${isBest ? styles.ratingBarBest : ''}`}>
                    <motion.div
                      className={styles.ratingFill}
                      style={{ originX: 0 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: (parcel.rating ?? 0) / 100 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className={`${styles.resultRating} ${(parcel.rating ?? 0) >= 90 ? styles.resultRatingGood : ''}`}>
                    {/* Percentage removed */}
                  </span>
                </div>
                )}
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
            <div className={styles.badgeRow}>
              <div className={styles.headerBadge}>
                <MapPin size={10} />
                <span>Lakitelek</span>
              </div>
              <SeasonSwitch years={LAKITELEK_YEARS} small />
            </div>
            <div className={styles.titleGroup}>
              <h3 className={styles.headerTitle}>{season.title} · {season.info.crop.toLowerCase()}</h3>
              <span className={styles.headerSubtitle}>7 művelési kombináció összehasonlítása</span>
            </div>
          </div>

          <motion.button
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            whileTap={{ scale: 0.97 }}
            title="Teljes képernyő"
          >
            <Maximize2 size={18} />
            <span>Teljes képernyő</span>
          </motion.button>
        </motion.div>

        {/* Embedded Content */}
        {!isChartFullscreen && (
          <div className={styles.mainContent}>
            <motion.div className={styles.visualizationArea} data-loaded={isChartLoaded || undefined}>
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
                          className={styles.playButton}
                          onClick={() => setIsChartLoaded(true)}
                          aria-label="3D modell betöltése"
                          whileTap={{ scale: 0.97 }}
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
                      <FieldChart3DCanvas key={season.year} parcels={parcels} conclusions={conclusions} monthLabels={season.chartLabels} showMachines={rated} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className={styles.sidePanel}>
              {/* Keyed wrapper: the values fade in when the season changes, not on every re-render */}
              <div key={season.year} className={styles.seasonFade}>
                <ResultsContent />
              </div>
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
                <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>Laza réteg:</span>
                {/* same colours as the cylinders in FieldChart3DCanvas */}
                {([['#d0563f', '≤ 10 cm'], ['#e2b93b', '10–25 cm'], ['#74ad5c', '> 25 cm']] as const).map(([color, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginLeft: '-12px' }}>
                    <span style={{ width: '12px', height: '12px', background: color, borderRadius: '3px' }}></span>
                    <span>{text}</span>
                  </div>
                ))}
{season.bestResults.length > 0 && (
                  <>
                <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.15)' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  <span style={{ color: '#d4a84b', fontSize: '14px', lineHeight: 1 }}>★</span>
                  <span>Legnagyobb hatékonyság</span>
                </div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <motion.button
                  className={styles.actionButton}
                  onClick={() => setShowResults(!showResults)}
                  whileTap={{ scale: 0.97 }}
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
                    key={season.year}
                    parcels={parcels}
                    conclusions={conclusions}
                    monthLabels={season.chartLabels}
                    showMachines={rated}
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
                    <div key={season.year} className={styles.seasonFade}>
                      <ResultsContent />
                    </div>
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
