'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Box, Layers, CheckCircle, Award, Maximize2, X } from 'lucide-react'
import TreatmentIcon, { getTreatmentIconType } from './TreatmentIcon'
import styles from './LakitelekCharts.module.css'

const FieldChart3DCanvas = dynamic(() => import('./FieldChart3DCanvas'), { ssr: false })

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

interface LakitelekChartsProps {
    parcels: ParcelData[]
    conclusions?: {
        summary: string
        bestResults: string[]
    }
}

export default function LakitelekCharts({ parcels, conclusions }: LakitelekChartsProps) {
    const [activeTab, setActiveTab] = useState<'2d' | '3d'>('3d')
    const [selectedMonth, setSelectedMonth] = useState<'may' | 'jun' | 'aug'>('aug')
    const [hoveredParcel, setHoveredParcel] = useState<number | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: '-50px' })

    // Handle Escape key to exit fullscreen
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
            setIsFullscreen(false)
        }
    }, [isFullscreen])

    useEffect(() => {
        if (isFullscreen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isFullscreen, handleKeyDown])

    const maxValue = 45
    const months = [
        { key: 'may' as const, label: 'Május' },
        { key: 'jun' as const, label: 'Június' },
        { key: 'aug' as const, label: 'Augusztus' },
    ]

    const getBarHeight = (value: number) => (value / maxValue) * 100
    const isBestResult = (num: string) => conclusions?.bestResults.includes(num)

    return (
        <>
            <div ref={containerRef} className={`${styles.container} ${isFullscreen ? styles.containerFullscreen : ''}`}>
                {/* Close button for fullscreen */}
                {isFullscreen && (
                    <button
                        className={styles.closeButton}
                        onClick={() => setIsFullscreen(false)}
                        aria-label="Kilépés a teljes képernyőből"
                    >
                        <X size={24} />
                    </button>
                )}

                {/* Header with title and 2D/3D toggle */}
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: -10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.headerContent}>
                        <div className={styles.headerText}>
                            <h4 className={styles.title}>7 művelési kombináció összehasonlítása</h4>
                            <p className={styles.subtitle}>
                                A laza talajréteg mélységének változása 3-4 hónap alatt
                            </p>
                        </div>

                        {/* Fullscreen Legend - Centered */}
                        {isFullscreen && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '6px 16px',
                                borderRadius: '100px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                marginLeft: 'auto',
                                marginRight: 'auto'
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
                        )}
                        <div className={styles.headerActions}>
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${activeTab === '2d' ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab('2d')}
                                >
                                    <Box size={16} />
                                    <span>2D</span>
                                    {activeTab === '2d' && (
                                        <motion.div className={styles.activeIndicator} layoutId="activeTab" />
                                    )}
                                </button>
                                <button
                                    className={`${styles.tab} ${activeTab === '3d' ? styles.tabActive : ''}`}
                                    onClick={() => setActiveTab('3d')}
                                >
                                    <Layers size={16} />
                                    <span>3D</span>
                                    {activeTab === '3d' && (
                                        <motion.div className={styles.activeIndicator} layoutId="activeTab" />
                                    )}
                                </button>
                            </div>
                            {!isFullscreen && (
                                <button
                                    className={styles.fullscreenButton}
                                    onClick={() => setIsFullscreen(true)}
                                    aria-label="Teljes képernyő"
                                >
                                    <Maximize2 size={18} />
                                    <span>Teljes képernyő</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Main content area - different layout for fullscreen */}
                <div className={`${styles.mainContent} ${isFullscreen ? styles.mainContentFullscreen : ''}`}>
                    {/* Chart Content */}
                    <div className={`${styles.content} ${isFullscreen ? styles.contentFullscreen : ''}`}>
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

                                                        {/* Treatment name - full name */}
                                                        <div className={styles.treatmentName}>{parcel.treatment}</div>

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
                                    className={`${styles.chartArea} ${isFullscreen ? styles.chartAreaFullscreen : ''}`}
                                >
                                    <FieldChart3DCanvas parcels={parcels} conclusions={conclusions} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Results Section - sidebar in fullscreen */}
                    <div className={`${styles.resultsWrapper} ${isFullscreen ? styles.resultsWrapperFullscreen : ''}`}>
                        {/* Results Table - all 7 treatments */}
                        <motion.div
                            className={`${styles.resultsSection} ${isFullscreen ? styles.resultsSectionFullscreen : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.8 }}
                        >
                            <h5 className={styles.resultsTitle}>Eredmények</h5>
                            <div className={styles.resultsTable}>
                                {parcels.map((parcel, index) => {
                                    const isBest = isBestResult(parcel.num)
                                    return (
                                        <motion.div
                                            key={parcel.num}
                                            className={`${styles.resultRow} ${isBest ? styles.resultRowBest : ''}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                                            transition={{ delay: 0.9 + index * 0.05 }}
                                        >
                                            <div className={styles.resultLeft}>
                                                <span className={styles.resultNum}>
                                                    {isBest && <CheckCircle size={14} className={styles.resultCheckIcon} />}
                                                    {parcel.num}
                                                </span>
                                                <span className={styles.resultTreatment}>{parcel.treatment}</span>
                                            </div>
                                            <div className={styles.resultRight}>
                                                <span className={`${styles.resultDesc} ${isFullscreen ? styles.resultDescFullscreen : ''}`}>{parcel.description}</span>
                                                <span className={`${styles.resultRating} ${parcel.rating >= 90 ? styles.resultRatingGood : ''}`}>
                                                    {parcel.rating}%
                                                </span>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Summary Box */}
                        {conclusions && (
                            <motion.div
                                className={`${styles.summaryBox} ${isFullscreen ? styles.summaryBoxFullscreen : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 1.2 }}
                            >
                                <h6 className={styles.summaryTitle}>Következtetés</h6>
                                <p>{conclusions.summary}</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen overlay backdrop */}
            {isFullscreen && <div className={styles.fullscreenBackdrop} onClick={() => setIsFullscreen(false)} />}
        </>
    )
}
