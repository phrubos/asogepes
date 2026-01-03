'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './SoilHeroEcosystem.module.css'
import { SOIL_LAYERS, COLORS } from './types'
import WaterParticles from './WaterParticles'
import RootSystem from './RootSystem'
import MicroOrganisms from './MicroOrganisms'

interface EcosystemVisualizationProps {
  isLoaded: boolean
  isRaining: boolean
  scrollProgress: number
  activeLayer: string | null
  onLayerHover: (layerId: string | null) => void
}

export default function EcosystemVisualization({
  isLoaded,
  isRaining,
  scrollProgress,
  activeLayer,
  onLayerHover,
}: EcosystemVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Mouse position for interactive effects
  const mouseY = useMotionValue(0)
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 })

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Handle mouse move for layer detection
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const yPercent = (y / rect.height) * 100

    mouseY.set(y)

    // Find which layer is being hovered
    const layer = SOIL_LAYERS.find(l =>
      yPercent >= l.depth.start && yPercent < l.depth.end
    )

    onLayerHover(layer?.id || null)
  }, [mouseY, onLayerHover])

  const handleMouseLeave = useCallback(() => {
    onLayerHover(null)
  }, [onLayerHover])

  // Calculate layer positions with parallax
  const getLayerStyle = (index: number) => {
    const layer = SOIL_LAYERS[index]
    const parallaxOffset = scrollProgress * (index + 1) * 10

    return {
      top: `${layer.depth.start}%`,
      height: `${layer.depth.end - layer.depth.start + 1}%`,
      transform: `translateY(${parallaxOffset}px)`,
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
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
        duration: 0.6,
        delay: 0.4 + i * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <motion.div
      ref={containerRef}
      className={styles.ecoContainer}
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Soil Layers Background */}
      <div className={styles.soilBlock}>
        {SOIL_LAYERS.map((layer, index) => (
          <motion.div
            key={layer.id}
            className={`${styles.soilLayer} ${activeLayer === layer.id ? styles.activeLayer : ''}`}
            style={getLayerStyle(index)}
            custom={index}
            variants={layerVariants}
            initial="hidden"
            animate={isLoaded ? 'visible' : 'hidden'}
          >
            {/* Layer gradient background */}
            <div
              className={styles.soilLayerInner}
              style={{
                background: `linear-gradient(180deg, ${layer.color} 0%, ${layer.color}dd 100%)`,
              }}
            >
              {/* Soil texture overlay */}
              <div className={styles.soilTexture} />

              {/* Compaction indicator */}
              {layer.compactionLevel > 0.5 && (
                <motion.div
                  className={styles.compactionOverlay}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeLayer === layer.id ? 0.4 : 0.15,
                  }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>

            {/* Layer label (visible on hover) */}
            <motion.div
              className={styles.layerLabel}
              initial={{ opacity: 0, x: 10 }}
              animate={{
                opacity: activeLayer === layer.id ? 1 : 0,
                x: activeLayer === layer.id ? 0 : 10,
              }}
              transition={{ duration: 0.2 }}
            >
              <span className={styles.layerName}>{layer.name}</span>
              <span className={styles.layerDepth}>
                {layer.depth.start}-{layer.depth.end} cm
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Micro-organisms layer */}
      <MicroOrganisms isLoaded={isLoaded} activeLayer={activeLayer} />

      {/* Root system */}
      <RootSystem
        isLoaded={isLoaded}
        activeLayer={activeLayer}
        containerHeight={dimensions.height}
      />

      {/* Water particles (canvas) */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <WaterParticles
          isRaining={isRaining}
          layers={SOIL_LAYERS}
          activeLayer={activeLayer}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}

      {/* Rain cloud indicator */}
      <motion.div
        className={styles.rainCloud}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isRaining ? 1 : 0.3,
          y: isRaining ? 0 : -10,
          scale: isRaining ? 1.1 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <svg width="80" height="40" viewBox="0 0 80 40">
          <defs>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(200,200,200,0.1)" />
            </linearGradient>
          </defs>
          <ellipse cx="40" cy="25" rx="35" ry="12" fill="url(#cloudGrad)" />
          <ellipse cx="25" cy="20" rx="20" ry="10" fill="url(#cloudGrad)" />
          <ellipse cx="55" cy="18" rx="18" ry="9" fill="url(#cloudGrad)" />
        </svg>

        {/* Rain drops from cloud */}
        {isRaining && (
          <div className={styles.rainDrops}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.rainDrop}
                style={{ left: `${15 + i * 15}%` }}
                animate={{
                  y: [0, 30],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Depth indicator */}
      <motion.div
        className={styles.depthIndicator}
        initial={{ opacity: 0, x: -20 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {[0, 20, 45, 60].map((depth) => (
          <div key={depth} className={styles.depthMarker} style={{ top: `${depth}%` }}>
            <div className={styles.depthLine} />
            <span className={styles.depthLabel}>{depth} cm</span>
          </div>
        ))}
      </motion.div>

      {/* Water pooling indicator (when layer is compacted) */}
      {activeLayer === 'hardpan' && (
        <motion.div
          className={styles.waterPoolIndicator}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{ top: '42%' }}
        >
          <span className={styles.warningDot} />
          Pangó víz
        </motion.div>
      )}

      {/* Frame border with eco styling */}
      <div className={styles.frameBorder}>
        <div className={`${styles.frameCorner} ${styles.topLeft}`} />
        <div className={`${styles.frameCorner} ${styles.topRight}`} />
        <div className={`${styles.frameCorner} ${styles.bottomLeft}`} />
        <div className={`${styles.frameCorner} ${styles.bottomRight}`} />
      </div>

      {/* Ecosystem health indicator */}
      <motion.div
        className={styles.healthIndicator}
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
      >
        <div className={styles.healthLabel}>Talaj egészség</div>
        <div className={styles.healthBar}>
          <motion.div
            className={styles.healthFill}
            initial={{ width: '0%' }}
            animate={{
              width: activeLayer === 'hardpan' ? '25%' : activeLayer ? '50%' : '65%',
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className={styles.healthStatus}>
          {activeLayer === 'hardpan' ? 'Kritikus' : activeLayer ? 'Korlátozott' : 'Mérsékelt'}
        </div>
      </motion.div>
    </motion.div>
  )
}
