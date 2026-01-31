import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import styles from './PhotoViewer.module.css'
import { usePhotoNavigation } from './usePhotoNavigation'
import { PhotoViewerModal } from './PhotoViewerModal'
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider'
import ThermalOverlays from '../ThermalOverlays/ThermalOverlays'
import SoilLoader from '@/components/ui/SoilLoader'

interface ThermalOverlay {
    scale?: {
        min: number
        max: number
        unit: string
        gradient?: string
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
    }[]
    verticalLines?: {
        x: number
        label?: string
        style?: 'dashed' | 'solid'
    }[]
    arrows?: {
        x: number
        y: number
        direction: 'left' | 'right'
        label: string
        subLabel?: string
    }[]
}

export interface PhotoItem {
    src: string
    alt: string
    description: string
    title?: string
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
    const { currentIndex, next, prev, setIndex } = usePhotoNavigation({ totalItems: items.length })
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

    const displayDescription = currentItem.type === 'comparison' && currentItem.leftDescription && currentItem.rightDescription
        ? (sliderPos > 50 ? currentItem.leftDescription : currentItem.rightDescription)
        : currentItem.description

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true)
        }
    }

    return (
        <div className={styles.container}>
            {/* Main Image Viewer */}
            <div
                className={styles.imageWrapper}
                onClick={() => setIsModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                aria-label="Open fullscreen view"
                style={{ aspectRatio: currentItem.aspectRatio }}
            >
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
                                        sizes="(max-width: 768px) 100vw, 800px"
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
                                        sizes="(max-width: 768px) 100vw, 800px"
                                        style={{ objectFit: currentItem.objectFit || 'cover' }}
                                        onLoadingComplete={handleLoadComplete}
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
                            aria-label="Previous image"
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
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Description Area */}
            <div className={styles.descriptionArea}>
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
                        <p className={styles.description}>{displayDescription}</p>
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
