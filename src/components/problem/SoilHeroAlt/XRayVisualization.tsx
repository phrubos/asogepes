'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import styles from './SoilHeroAlt.module.css'
import { SOIL_LAYERS, COLORS, ANIMATION } from './types'

interface XRayVisualizationProps {
  isLoaded: boolean
  scrollProgress: number
  isScanning: boolean
  scanProgress: number
  revealedLayers: string[]
  onLayerReveal: (layerId: string) => void
}

export default function XRayVisualization({
  isLoaded,
  scrollProgress,
  isScanning,
  scanProgress,
  revealedLayers,
  onLayerReveal,
}: XRayVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Mouse position for X-Ray effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animation for mouse following
  const springConfig = { damping: 25, stiffness: 200 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // X-Ray reveal radius
  const revealRadius = useSpring(0, { damping: 20, stiffness: 150 })

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  // Handle mouse enter/leave
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
    revealRadius.set(ANIMATION.xrayRadius)
  }, [revealRadius])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    revealRadius.set(0)
  }, [revealRadius])

  // Calculate layer positions
  const getLayerStyle = (index: number) => {
    const totalLayers = SOIL_LAYERS.length
    const heightPercent = 100 / totalLayers
    const topPercent = index * heightPercent

    // Parallax effect based on scroll
    const parallaxOffset = scrollProgress * (index + 1) * 15

    return {
      top: `${topPercent}%`,
      height: `${heightPercent + 2}%`, // Slight overlap to prevent gaps
      transform: `translateY(${parallaxOffset}px)`,
    }
  }

  // Check if layer is revealed by scan
  const isLayerRevealed = (layerId: string) => {
    return revealedLayers.includes(layerId)
  }

  // Entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const layerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.5 + i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <motion.div
      ref={containerRef}
      className={styles.xrayContainer}
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Soil Block with Layers */}
      <div className={styles.soilBlock}>
        {SOIL_LAYERS.map((layer, index) => (
          <motion.div
            key={layer.id}
            className={styles.soilLayer}
            style={getLayerStyle(index)}
            custom={index}
            variants={layerVariants}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
          >
            {/* Normal soil appearance */}
            <div
              className={styles.soilLayerInner}
              style={{
                background: `linear-gradient(180deg, ${layer.color} 0%, ${layer.color}dd 100%)`,
              }}
            >
              <div className={styles.soilTexture} />
            </div>

            {/* Problem overlay (revealed by X-Ray) */}
            <motion.div
              className={`${styles.problemOverlay} ${isLayerRevealed(layer.id) ? styles.revealed : ''}`}
              style={{
                background: `linear-gradient(180deg, ${layer.problemColor} 0%, ${layer.problemColor}cc 100%)`,
              }}
              animate={{
                opacity: isLayerRevealed(layer.id) ? 0.7 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Problem pattern overlay */}
              <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.3 }}>
                <defs>
                  <pattern id={`cracks-${layer.id}`} patternUnits="userSpaceOnUse" width="60" height="60">
                    <path
                      d="M0 30 L15 25 L30 35 L45 28 L60 30"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M30 0 L28 15 L35 30 L30 45 L32 60"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#cracks-${layer.id})`} />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* X-Ray Reveal Circle (follows mouse) */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className={styles.xrayMask}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.xrayReveal}
              style={{
                left: smoothX,
                top: smoothY,
                width: revealRadius,
                height: revealRadius,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Line */}
      <AnimatePresence>
        {isScanning && (
          <div className={styles.scanLineContainer}>
            <motion.div
              className={styles.scanLine}
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              exit={{ opacity: 0 }}
              transition={{
                duration: ANIMATION.scanDuration,
                ease: 'linear',
              }}
            />
            <motion.div
              className={styles.scanLineGlow}
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{
                duration: ANIMATION.scanDuration,
                ease: 'linear',
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Problem Indicators */}
      <div className={styles.problemIndicators}>
        {SOIL_LAYERS.slice(0, 3).map((layer, index) => (
          <motion.div
            key={`indicator-${layer.id}`}
            className={`${styles.problemIndicator} ${isLayerRevealed(layer.id) ? styles.visible : ''}`}
            style={{
              top: `${(index + 0.5) * 25}%`,
            }}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{
              opacity: isLayerRevealed(layer.id) ? 1 : 0,
              scale: isLayerRevealed(layer.id) ? 1 : 0.8,
              x: isLayerRevealed(layer.id) ? 0 : -20,
            }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <motion.span
              className={styles.problemDot}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {layer.description}
          </motion.div>
        ))}
      </div>

      {/* Depth Indicator */}
      <motion.div
        className={styles.depthIndicator}
        initial={{ opacity: 0, x: -20 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {[0, 15, 35, 55].map((depth) => (
          <div key={depth} className={styles.depthMarker}>
            <div className={styles.depthLine} />
            <span className={styles.depthLabel}>{depth} cm</span>
          </div>
        ))}
      </motion.div>

      {/* Frame Border with Corners */}
      <div className={styles.frameBorder}>
        <div className={`${styles.frameCorner} ${styles.topLeft}`} />
        <div className={`${styles.frameCorner} ${styles.topRight}`} />
        <div className={`${styles.frameCorner} ${styles.bottomLeft}`} />
        <div className={`${styles.frameCorner} ${styles.bottomRight}`} />
      </div>
    </motion.div>
  )
}
