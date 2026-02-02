import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import styles from './PhotoViewer.module.css'
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider'
import ThermalOverlays from '../ThermalOverlays/ThermalOverlays'
import SoilLoader from '@/components/ui/SoilLoader'
import { FormattedText } from './FormattedText'

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

interface PhotoViewerModalProps {
    isOpen: boolean
    onClose: () => void
    currentImage: {
        src: string
        alt: string
        title?: string
        description: string
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
        initialSliderPosition?: number
    }
    currentIndex: number
    totalItems: number
    onNext: () => void
    onPrev: () => void
}

export function PhotoViewerModal({
    isOpen,
    onClose,
    currentImage,
    currentIndex,
    totalItems,
    onNext,
    onPrev
}: PhotoViewerModalProps) {
    const [mounted, setMounted] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [sliderPos, setSliderPos] = useState(50)
    const [isLoading, setIsLoading] = useState(true)

    // Reset loading state when index changes
    useEffect(() => {
        setIsLoading(true)
    }, [currentIndex])

    const handleLoadComplete = () => {
        setIsLoading(false)
    }

    useEffect(() => {
        console.log('PhotoViewerModal mounted')
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const imageAreaRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const positionStart = useRef({ x: 0, y: 0 })

    const isComparison = currentImage.type === 'comparison'

    // Reset zoom and position on image change
    useEffect(() => {
        setZoom(1)
        setPosition({ x: 0, y: 0 })
    }, [currentIndex])

    // Lock body AND html scroll properly
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden' // Lock root as well

            return () => {
                document.body.style.overflow = originalStyle
                document.documentElement.style.overflow = ''
            }
        }
    }, [isOpen])

    // Native Wheel Handler for smooth, non-chained Zoom
    useEffect(() => {
        const element = imageAreaRef.current
        if (!element || !isOpen || isComparison) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault() // Stop page scroll
            e.stopPropagation() // Stop bubbling

            const delta = e.deltaY > 0 ? -0.1 : 0.1
            setZoom(prev => Math.max(0.5, Math.min(4, prev + delta)))
        }

        // Add non-passive listener
        element.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            element.removeEventListener('wheel', handleWheel)
        }
    }, [isOpen, isComparison])


    // Escape key handler
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)


    }, [isOpen, onClose])

    // Reset position when zoom changes
    useEffect(() => {
        setPosition({ x: 0, y: 0 })
    }, [zoom])

    // Mouse event handlers for drag-to-pan
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (zoom <= 1 || isComparison) return
        e.preventDefault()
        setIsDragging(true)
        dragStart.current = { x: e.clientX, y: e.clientY }
        positionStart.current = { ...position }
    }, [zoom, position, isComparison])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || zoom <= 1 || isComparison) return
        e.preventDefault()

        const deltaX = e.clientX - dragStart.current.x
        const deltaY = e.clientY - dragStart.current.y

        // Calculate constraints based on zoom
        const containerWidth = imageAreaRef.current?.clientWidth || 800
        const containerHeight = imageAreaRef.current?.clientHeight || 600
        const maxX = (containerWidth * (zoom - 1)) / 2
        const maxY = (containerHeight * (zoom - 1)) / 2

        // Apply new position with constraints
        const newX = Math.max(-maxX, Math.min(maxX, positionStart.current.x + deltaX))
        const newY = Math.max(-maxY, Math.min(maxY, positionStart.current.y + deltaY))

        setPosition({ x: newX, y: newY })
    }, [isDragging, zoom, isComparison])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4))
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5))
    const handleReset = () => setZoom(1)

    if (!isOpen || !mounted) return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.modalOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.modalContent}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image Area (Left) */}
                        <div
                            ref={imageAreaRef}
                            className={styles.modalImageArea}
                        // onWheel removed in favor of native listener
                        >
                            {/* Zoom Wrapper handles clipping */}
                            <div className={styles.zoomWrapper}>
                                <motion.div
                                    key={currentImage.src}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeave}
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
                                                    backgroundColor: '#1A1612', // Slightly dark background
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

                                    {isComparison && currentImage.leftSrc && currentImage.rightSrc ? (
                                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                            <BeforeAfterSlider
                                                leftImage={currentImage.leftSrc}
                                                rightImage={currentImage.rightSrc}
                                                objectFit="contain"
                                                watermark={currentImage.watermark}
                                                altLeft={currentImage.altLeft || currentImage.alt}
                                                altRight={currentImage.altRight || currentImage.alt}
                                                leftLabel={currentImage.leftLabel}
                                                rightLabel={currentImage.rightLabel}
                                                overlays={currentImage.overlays}
                                                leftOverlays={currentImage.leftOverlays}
                                                onSliderChange={setSliderPos}
                                                initialSliderPosition={currentImage.initialSliderPosition}
                                                onLoad={handleLoadComplete}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                                                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                                userSelect: 'none',
                                                pointerEvents: 'auto',
                                                position: 'relative', // Ensure relative positioning for overlays
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <div style={{ position: 'relative', width: 'auto', height: 'auto' }}>
                                                <Image
                                                    src={currentImage.src}
                                                    alt={currentImage.alt}
                                                    width={1600}
                                                    height={1200}
                                                    className={styles.modalImage}
                                                    priority
                                                    draggable={false}
                                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                    onLoad={handleLoadComplete}
                                                />
                                                {currentImage.overlays && (
                                                    <ThermalOverlays overlays={currentImage.overlays} />
                                                )}
                                                {currentImage.watermark && (
                                                    <div className={styles.watermark}>
                                                        {currentImage.watermark.lines.map((line, idx) => (
                                                            <span key={idx} className={styles.watermarkLine}>{line}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Modal Navigation (Bottom Center) */}
                            {totalItems > 1 && (
                                <div className={styles.modalBottomControls}>
                                    <button className={styles.navButton} onClick={(e) => { e.stopPropagation(); onPrev(); }}>
                                        <ChevronLeft size={24} />
                                    </button>

                                    <div className={styles.indicators}>
                                        {Array.from({ length: totalItems }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`${styles.indicator} ${idx === currentIndex ? styles.activeIndicator : ''}`}
                                            />
                                        ))}
                                    </div>

                                    <button className={styles.navButton} onClick={(e) => { e.stopPropagation(); onNext(); }}>
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}

                            {/* Zoom Controls Overlay on Image Area - Hide for comparison */}
                            {!isComparison && (
                                <div className={styles.zoomControls} onClick={(e) => e.stopPropagation()}>
                                    <button className={styles.zoomBtn} onClick={handleZoomOut} disabled={zoom <= 0.5}>
                                        <ZoomOut size={18} />
                                    </button>
                                    <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
                                    <button className={styles.zoomBtn} onClick={handleZoomIn} disabled={zoom >= 4}>
                                        <ZoomIn size={18} />
                                    </button>
                                    <button className={styles.zoomBtn} onClick={handleReset}>
                                        <RotateCcw size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Info Panel (Right) */}
                        <div className={styles.modalInfoPanel}>
                            <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                                <X size={24} />
                            </button>

                            <div className={styles.modalHeader}>
                                {totalItems > 1 && (
                                    <div className={styles.modalMeta}>
                                        KÉP {currentIndex + 1} / {totalItems}
                                    </div>
                                )}
                                <h2 className={styles.modalTitle}>{currentImage.title || 'Foto Részletek'}</h2>
                            </div>
                            <div className={styles.modalDescription}>
                                <FormattedText
                                    text={currentImage.type === 'comparison' && currentImage.leftDescription && currentImage.rightDescription
                                        ? (sliderPos >= 50 ? currentImage.leftDescription : currentImage.rightDescription)
                                        : currentImage.description}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
