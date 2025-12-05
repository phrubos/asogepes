'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './ImageLightbox.module.css'

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
  images?: { src: string; alt: string }[]
  initialIndex?: number
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

export default function ImageLightbox({ 
  isOpen, 
  onClose, 
  src, 
  alt,
  images,
  initialIndex = 0
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  
  // Motion values for pan
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Get current image
  const currentImage = images ? images[currentIndex] : { src, alt }
  const hasMultiple = images && images.length > 1

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset zoom and position when image changes
  useEffect(() => {
    setZoom(1)
    x.set(0)
    y.set(0)
  }, [currentIndex, x, y])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (hasMultiple) navigatePrev()
          break
        case 'ArrowRight':
          if (hasMultiple) navigateNext()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
        case '0':
          handleReset()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, hasMultiple, currentIndex])

  const navigateNext = useCallback(() => {
    if (!images) return
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images])

  const navigatePrev = useCallback(() => {
    if (!images) return
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    x.set(0)
    y.set(0)
  }

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(0.5, Math.min(4, prev + delta)))
  }

  // Handle double click to zoom
  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(2)
    } else {
      handleReset()
    }
  }

  // Don't render on server
  if (!mounted) return null

  // Use portal to render at document body level
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={styles.lightbox} ref={containerRef}>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Controls */}
          <div className={styles.controls}>
            <motion.button
              className={styles.controlBtn}
              onClick={handleZoomOut}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Kicsinyítés"
              disabled={zoom <= 0.5}
            >
              <ZoomOut size={20} />
            </motion.button>
            <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
            <motion.button
              className={styles.controlBtn}
              onClick={handleZoomIn}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Nagyítás"
              disabled={zoom >= 4}
            >
              <ZoomIn size={20} />
            </motion.button>
            <motion.button
              className={styles.controlBtn}
              onClick={handleReset}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Visszaállítás"
            >
              <RotateCcw size={20} />
            </motion.button>
          </div>

          {/* Close button - same style as FieldDataModal */}
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Bezárás"
          >
            <X size={20} />
          </button>

          {/* Navigation arrows */}
          {hasMultiple && (
            <>
              <button
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={navigatePrev}
                aria-label="Előző kép"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={navigateNext}
                aria-label="Következő kép"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image container */}
          <motion.div
            className={styles.imageContainer}
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
          >
            <motion.div
              ref={imageRef}
              className={styles.imageWrapper}
              style={{ 
                scale: zoom,
                x: zoom > 1 ? x : 0,
                y: zoom > 1 ? y : 0,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
              }}
              drag={zoom > 1}
              dragConstraints={containerRef}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={800}
                className={styles.image}
                priority
              />
            </motion.div>
          </motion.div>

          {/* Image counter */}
          {hasMultiple && (
            <div className={styles.counter}>
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Keyboard hints */}
          <div className={styles.hints}>
            <span>ESC bezárás</span>
            {hasMultiple && <span>← → navigáció</span>}
            <span>+/- zoom</span>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
