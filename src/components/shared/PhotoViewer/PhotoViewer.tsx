import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Image from 'next/image'
import styles from './PhotoViewer.module.css'
import { usePhotoNavigation } from './usePhotoNavigation'
import { PhotoViewerModal } from './PhotoViewerModal'
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider'
import ThermalOverlays from '../ThermalOverlays/ThermalOverlays'
import SoilLoader from '@/components/ui/SoilLoader'
import { FormattedText } from './FormattedText'
import PhotoCredit from '@/components/ui/PhotoCredit/PhotoCredit'

interface ThermalOverlay {
    scale?: {
        min: number
        max: number
        unit: string
        gradient?: string
        right?: number
    }
    points?: {
        x: number // percentage
        y: number // percentage
        label: string
        value: string
        hideRing?: boolean
    }[]
    lines?: {
        y: number
        label?: string
        xStart?: number
        xEnd?: number
        color?: string
        alwaysVisible?: boolean
        hasArrows?: boolean
    }[]
    verticalLines?: {
        x: number
        label?: string
        style?: 'dashed' | 'solid'
    }[]
    arrows?: {
        x: number
        y: number
        direction: 'left' | 'right' | 'down' | 'none'
        label?: string
        subLabel?: string
    }[]
}

export interface PhotoItem {
    src: string
    alt: string
    description: string
    title?: string
    /** where and when, shown as "Fotó: Lakitelek, 2025. május 2." */
    credit?: string
    type?: 'image' | 'comparison'
    leftSrc?: string
    rightSrc?: string
    leftLabel?: string
    rightLabel?: string
    altLeft?: string
    altRight?: string
    leftDescription?: string
    rightDescription?: string
    overlays?: ThermalOverlay
    leftOverlays?: ThermalOverlay
    watermark?: {
        lines: string[]
    }
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
    aspectRatio?: string
    initialSliderPosition?: number
}

interface PhotoViewerProps {
    items: PhotoItem[]
}

export default function PhotoViewer({ items }: PhotoViewerProps) {
    const { currentIndex, next, prev } = usePhotoNavigation({ totalItems: items.length })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sliderPos, setSliderPos] = useState(50)
    const [isLoading, setIsLoading] = useState(true)

    // Reset loading state when index changes
    useEffect(() => {
        setIsLoading(true)
    }, [currentIndex])

    const handleLoadComplete = () => {
        setIsLoading(false)
    }

    if (!items || items.length === 0) return null
    const currentItem = items[currentIndex] || items[0]
    const hasMarks = Boolean(currentItem.overlays && Object.keys(currentItem.overlays).length)

    const displayDescription = currentItem.type === 'comparison' && currentItem.leftDescription && currentItem.rightDescription
        ? (sliderPos >= 50 ? currentItem.leftDescription : currentItem.rightDescription)
        : currentItem.description

    return (
        <div className={styles.container}>
            {/* Main Image Viewer: a click on the photo opens the fullscreen view; keyboard users get the
                expand button below (the wrapper holds the prev/next buttons, so it can't be a button itself) */}
            <div
                className={styles.imageWrapper}
                onClick={() => setIsModalOpen(true)}
                data-preview
                style={{ aspectRatio: currentItem.aspectRatio }}
            >
                <button
                    type="button"
                    className={styles.expandButton}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsModalOpen(true)
                    }}
                >
                    <Maximize2 size={16} aria-hidden="true" />
                    Teljes képernyős nézet
                </button>

                {/* Loading Indicator Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 50,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                backgroundColor: '#1A1612',
                                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(107, 139, 94, 0.2), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(212, 168, 75, 0.1), transparent), #1A1612',
                            }}
                        >
                            <SoilLoader size="md" />
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'rgba(240, 245, 240, 0.6)',
                                letterSpacing: '0.05em',
                                fontWeight: 500,
                            }}>
                                Betöltés...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className={styles.contentContainer}
                    >
                        {/* Ambient Background Layer */}
                        <div className={styles.ambientBackground}>
                            <Image
                                src={currentItem.type === 'comparison' ? currentItem.leftSrc! : currentItem.src}
                                alt="Ambient background"
                                fill
                                className={styles.ambientImage}
                                priority
                            />
                            <div className={styles.ambientOverlay} />
                        </div>

                        {/* Main Content Layer */}
                        <div className={styles.mainContent}>
                            {currentItem.type === 'comparison' && currentItem.leftSrc && currentItem.rightSrc ? (
                                <div className={styles.contentContainer}>
                                    <BeforeAfterSlider
                                        leftImage={currentItem.leftSrc}
                                        rightImage={currentItem.rightSrc}
                                        altLeft={currentItem.leftLabel || 'Before'}
                                        altRight={currentItem.rightLabel || 'After'}
                                        leftLabel={currentItem.leftLabel}
                                        rightLabel={currentItem.rightLabel}
                                        overlays={currentItem.overlays}
                                        leftOverlays={currentItem.leftOverlays}
                                        watermark={currentItem.watermark}
                                        onSliderChange={setSliderPos}
                                        onLoad={handleLoadComplete}
                                        objectFit="cover"
                                        sizes="100vw"
                                        initialSliderPosition={currentItem.initialSliderPosition}
                                    />
                                </div>
                            ) : (
                                <>
                                    <Image
                                        src={currentItem.src}
                                        alt={currentItem.alt}
                                        fill
                                        className={styles.image}
                                        priority
                                        sizes="100vw"
                                        style={{ objectFit: currentItem.objectFit || 'cover' }}
                                        onLoad={handleLoadComplete}
                                    />
                                    {currentItem.overlays && (
                                        <ThermalOverlays overlays={currentItem.overlays} />
                                    )}
                                    {currentItem.watermark && (
                                        <div className={styles.watermark}>
                                            {currentItem.watermark.lines.map((line, idx) => (
                                                <span key={idx} className={styles.watermarkLine}>{line}</span>
                                            ))}
                                        </div>
                                    )}
                                    {currentItem.leftLabel && (
                                        <div className={`${styles.label} ${styles.labelLeft}`}>{currentItem.leftLabel}</div>
                                    )}
                                    {currentItem.rightLabel && (
                                        <div className={`${styles.label} ${styles.labelRight}`}>{currentItem.rightLabel}</div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Overlay */}
                {/* Bottom Navigation Controls */}
                {items.length > 1 && (
                    <div className={styles.bottomControls} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.navButton}
                            onClick={prev}
                            aria-label="Előző kép"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className={styles.indicators}>
                            {items.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.indicator} ${idx === currentIndex ? styles.activeIndicator : ''}`}
                                />
                            ))}
                        </div>

                        <button
                            className={styles.navButton}
                            onClick={next}
                            aria-label="Következő kép"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Phones: the preview is a clean photo with its title; marks and text are in the fullscreen view */}
            <button type="button" className={styles.zoomHint} onClick={() => setIsModalOpen(true)}>
                <Maximize2 size={16} aria-hidden="true" />
                {hasMarks ? 'Teljes kép a mért értékekkel' : 'Teljes kép és leírás'}
            </button>

            {/* Description Area */}
            {/* Desktop: a fixed-height scroll box, so it takes keyboard focus to be scrolled */}
            <div
                className={styles.descriptionArea}
                tabIndex={0}
                role="region"
                aria-label={`${currentItem.title || 'Fotó'} – leírás`}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className={styles.textContainer}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className={styles.title}>{currentItem.title || 'Fotó'}</h3>
                        <FormattedText className={styles.description} text={displayDescription} />
                        {currentItem.credit && <PhotoCredit>{currentItem.credit}</PhotoCredit>}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modal */}
            <PhotoViewerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentImage={currentItem}
                currentIndex={currentIndex}
                totalItems={items.length}
                onNext={next}
                onPrev={prev}
            />
        </div >
    )
}
