import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import styles from './PhotoViewer.module.css'

interface PhotoViewerModalProps {
    isOpen: boolean
    onClose: () => void
    currentImage: {
        src: string
        alt: string
        title?: string
        description: string
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
        if (!element || !isOpen) return

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
    }, [isOpen])


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
        if (zoom <= 1) return
        e.preventDefault()
        setIsDragging(true)
        dragStart.current = { x: e.clientX, y: e.clientY }
        positionStart.current = { ...position }
    }, [zoom, position])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging || zoom <= 1) return
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
    }, [isDragging, zoom])

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
                        {/* Close Button Area - Top Right of Content? Or Fixed? 
                            With 2-column layout, button should probably be on the text panel side or fixed to screen.
                            Let's keep it generally top-right.
                        */}

                        {/* Image Area (Left) */}
                        <div
                            ref={imageAreaRef}
                            className={styles.modalImageArea}
                        // onWheel removed in favor of native listener
                        >
                            <button className={`${styles.navButton} ${styles.prevButton}`} onClick={(e) => { e.stopPropagation(); onPrev(); }}>
                                <ChevronLeft size={24} />
                            </button>

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
                                <div
                                    style={{
                                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                        userSelect: 'none',
                                        pointerEvents: 'auto'
                                    }}
                                >
                                    <Image
                                        src={currentImage.src}
                                        alt={currentImage.alt}
                                        width={1600}
                                        height={1200}
                                        className={styles.modalImage}
                                        priority
                                        draggable={false}
                                    />
                                </div>
                            </motion.div>

                            <button className={`${styles.navButton} ${styles.nextButton}`} onClick={(e) => { e.stopPropagation(); onNext(); }}>
                                <ChevronRight size={24} />
                            </button>

                            {/* Zoom Controls Overlay on Image Area */}
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
                        </div>

                        {/* Info Panel (Right) */}
                        <div className={styles.modalInfoPanel}>
                            <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                                <X size={24} />
                            </button>

                            <div className={styles.modalHeader}>
                                <div className={styles.modalMeta}>
                                    IMAGE {currentIndex + 1} / {totalItems}
                                </div>
                                <h2 className={styles.modalTitle}>{currentImage.title || 'Foto Részletek'}</h2>
                            </div>
                            <div className={styles.modalDescription}>
                                <p>{currentImage.description}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
