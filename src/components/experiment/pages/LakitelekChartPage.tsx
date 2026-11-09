'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Maximize2, X, TrendingUp, Layers, Play } from 'lucide-react'
import { lakitelekSeasons, formatCm } from '@/lib/seasons'
import { useDisclosureTrigger } from '@/hooks/useDisclosureTrigger'
import { useSeason } from '../season/SeasonContext'
import { SeasonLabel } from '../season/SeasonOnly'
import { monthName } from '@/lib/months'
import styles from './LakitelekChartPage.module.css'

const FieldChart3DCanvas = dynamic(() => import('../FieldChart3DCanvas'), { ssr: false })

/**
 * Parcel description in the results table: clamped to two lines on desktop; when it is cut off,
 * the whole text appears in a tooltip on hover, tap or Enter (phones show it in full, no tooltip).
 * The tooltip goes to <body> with fixed coordinates, so the scrolling side panel cannot clip it.
 */
function ResultDesc({ id, text, isOpen, onOpen, onClose }: { id: string; text?: string; isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<{ left: number; top: number; width: number; above: boolean } | null>(null)
  const { hover, trigger } = useDisclosureTrigger({ isOpen, onOpen, onClose })

  useEffect(() => {
    const el = ref.current
    if (!isOpen || !el || el.scrollHeight <= el.clientHeight + 1) { setPos(null); return }
    const r = el.getBoundingClientRect()
    const width = Math.min(320, Math.max(r.width + 24, 240), window.innerWidth - 32)
    const left = Math.max(16, Math.min(r.left - 12, window.innerWidth - width - 16))
    const above = r.bottom + 120 > window.innerHeight
    setPos({ left, top: above ? r.top - 8 : r.bottom + 8, width, above })
    // the panel or the page scrolled: the fixed tooltip would drift away from its row
    const close = () => onClose()
    window.addEventListener('scroll', close, { capture: true, passive: true, once: true })
    return () => window.removeEventListener('scroll', close, { capture: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <>
      <span
        ref={ref}
        {...hover}
        {...trigger}
        aria-describedby={pos ? id : undefined}
        className={`${styles.resultDesc} ${isOpen ? styles.resultDescActive : ''}`}
      >
        {text}
      </span>
      {pos && createPortal(
        <span
          id={id}
          role="tooltip"
          className={`${styles.descTooltip} ${pos.above ? styles.descTooltipAbove : ''}`}
          style={{ left: pos.left, top: pos.top, width: pos.width }}
        >
          {text}
        </span>,
        document.body,
      )}
    </>
  )
}

export default function LakitelekChartPage() {
  const { year } = useSeason()
  const season = lakitelekSeasons.seasons.find((s) => s.year === year) ?? lakitelekSeasons.seasons[lakitelekSeasons.seasons.length - 1]
  const parcels = season.parcels
  // memoised: a new object on every render (e.g. a tooltip opening) rebuilt the 3D scene and restarted its intro
  const conclusions = useMemo(() => ({ summary: season.summary, bestResults: season.bestResults }), [season])
  // 2025 has the researchers' rating per parcel; later seasons show the measured values
  const rated = parcels.every((p) => p.rating !== undefined)
  const [isChartFullscreen, setIsChartFullscreen] = useState(false)
  const [isChartLoaded, setIsChartLoaded] = useState(false)
  const [showResults, setShowResults] = useState(false)
  // the results table lives in an inline component, so the open description is kept here
  const [openDesc, setOpenDesc] = useState<string | null>(null)
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
                  {monthName(d)}
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
                        <ResultDesc
                          id={`lk-desc-${parcel.num}`}
                          text={parcel.description}
                          isOpen={openDesc === parcel.num}
                          onOpen={() => setOpenDesc(parcel.num)}
                          onClose={() => setOpenDesc((o) => (o === parcel.num ? null : o))}
                        />
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
              <SeasonLabel switchAt="lakitelek-info" />
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
                {/* called, not <ResultsContent />: an inline component type remounts on every render and drops focus */}
                {ResultsContent()}
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

              {/* Legend: centred on wide screens, its own row under the title when the window is narrower */}
              <div className={styles.fullscreenLegend}>
                <span className={styles.fullscreenLegendLabel}>Laza réteg:</span>
                {/* same colours as the cylinders in FieldChart3DCanvas */}
                {([['#d0563f', '≤ 10 cm'], ['#e2b93b', '10–25 cm'], ['#74ad5c', '> 25 cm']] as const).map(([color, text]) => (
                  <span key={text} className={styles.fullscreenLegendItem}>
                    <span className={styles.fullscreenLegendSwatch} style={{ background: color }} />
                    {text}
                  </span>
                ))}
                {season.bestResults.length > 0 && (
                  <span className={`${styles.fullscreenLegendItem} ${styles.fullscreenLegendBest}`}>
                    <span className={styles.fullscreenLegendStar}>★</span>
                    Legnagyobb hatékonyság
                  </span>
                )}
              </div>
              <div className={styles.fullscreenActions}>
                <motion.button
                  className={styles.actionButton}
                  onClick={() => setShowResults(!showResults)}
                  whileTap={{ scale: 0.97 }}
                >
                  <Layers size={18} />
                  <span>{showResults ? 'Eredmények elrejtése' : 'Eredmények mutatása'}</span>
                </motion.button>
                <button className={styles.closeButton} onClick={toggleFullscreen} aria-label="Bezárás">
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
                      {/* called, not <ResultsContent />: an inline component type remounts on every render and drops focus */}
                      {ResultsContent()}
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
