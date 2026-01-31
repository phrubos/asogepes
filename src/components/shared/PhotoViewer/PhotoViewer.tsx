'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import Image from 'next/image'
import styles from './PhotoViewer.module.css'
import { usePhotoNavigation } from './usePhotoNavigation'
import { PhotoViewerModal } from './PhotoViewerModal'
import BeforeAfterSlider from '../BeforeAfterSlider/BeforeAfterSlider'

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
    overlays?: {
        scale?: {
            min: number
            max: number
            unit: string
        }
        points?: {
            x: number
            y: number
            label: string
            value: string
        }[]
        points?: {
            x: number
            y: number
            label: string
            value: string
        }[]
    }
    leftOverlays?: {
        scale?: {
            min: number
            max: number
            unit: string
        }
        points?: {
            x: number
            y: number
            label: string
            value: string
        }[]
    }
    watermark?: {
        lines: string[]
    }
}

interface PhotoViewerProps {
    items: PhotoItem[]
}

export default function PhotoViewer({ items }: PhotoViewerProps) {
    const { currentIndex, next, prev, setIndex } = usePhotoNavigation({ totalItems: items.length })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const currentItem = items[currentIndex]

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
            >
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
                                    objectFit="cover"
                                />
                            ) : (
                                <Image
                                    src={currentItem.src}
                                    alt={currentItem.alt}
                                    fill
                                    className={styles.image}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    style={{ objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Overlay */}
                {/* Bottom Navigation Controls */}
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
                        <p className={styles.description}>{currentItem.description}</p>
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
        </div>
    )
}
