'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './SoilHeroInteractive.module.css'
import { SOIL_LAYERS, DEPTH_MARKERS, SoilLayer } from './types'

interface InteractiveSoilProfileProps {
  isLoaded: boolean
  activeLayer: string | null
  onLayerHover: (layerId: string | null) => void
  onLayerClick: (navId: string) => void
}

export default function InteractiveSoilProfile({
  isLoaded,
  activeLayer,
  onLayerHover,
  onLayerClick,
}: InteractiveSoilProfileProps) {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null)

  const handleLayerEnter = useCallback((layerId: string) => {
    setHoveredLayer(layerId)
    onLayerHover(layerId)
  }, [onLayerHover])

  const handleLayerLeave = useCallback(() => {
    setHoveredLayer(null)
    onLayerHover(null)
  }, [onLayerHover])

  // Calculate layer height percentage
  const getLayerHeight = (layer: SoilLayer) => {
    const totalDepth = 55
    const layerDepth = layer.depth.end - layer.depth.start
    return (layerDepth / totalDepth) * 100
  }

  // Generate deterministic grass heights and particle positions
  const grassData = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      left: 8 + i * 8,
      height: 12 + (i * 0.7) % 8, // Deterministic pseudo-random based on index
      duration: 3 + (i * 0.3) % 2,
    })), []
  )

  const particleData = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      left: 10 + (i * 13.7) % 80, // Deterministic pseudo-random based on index
      top: 10 + (i * 17.3) % 80,
      width: 3 + (i * 0.8) % 5,
      height: 3 + (i * 1.2) % 5,
    })), []
  )

  // Generate root paths
  const rootPaths = useMemo(() => [
    { d: 'M50 0 Q45 20, 40 45 Q38 60, 35 80', delay: 0 },
    { d: 'M50 0 Q55 15, 60 35 Q62 50, 58 70', delay: 0.1 },
    { d: 'M50 0 Q48 25, 52 50 Q55 65, 50 85', delay: 0.2 },
    { d: 'M40 45 Q30 55, 25 70', delay: 0.3 },
    { d: 'M60 35 Q70 45, 75 60', delay: 0.4 },
    { d: 'M52 50 Q45 60, 42 75', delay: 0.5 },
  ], [])

  // Animation variants
  const profileVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const layerVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: 0.6,
        delay: 0.4 + i * 0.15,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <motion.div
      className={styles.profileContainer}
      variants={profileVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
    >
      {/* Depth Scale */}
      <div className={styles.depthScale}>
        {DEPTH_MARKERS.map((depth, index) => (
          <motion.div
            key={depth}
            className={styles.depthMarker}
            style={{ top: `${(depth / 55) * 100}%` }}
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
          >
            <span className={styles.depthValue}>{depth}</span>
            <span className={styles.depthUnit}>cm</span>
            <div className={styles.depthLine} />
          </motion.div>
        ))}
      </div>

      {/* Soil Profile Block */}
      <div className={styles.soilProfile}>
        {/* Surface grass indicator */}
        <motion.div
          className={styles.surfaceGrass}
          initial={{ opacity: 0, y: -10 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {grassData.map((grass, i) => (
            <motion.div
              key={i}
              className={styles.grassBlade}
              style={{
                left: `${grass.left}%`,
                height: `${grass.height}px`,
              }}
              animate={{
                rotate: [0, -3, 0, 3, 0],
              }}
              transition={{
                duration: grass.duration,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Soil Layers */}
        <div className={styles.layersContainer}>
          {SOIL_LAYERS.map((layer, index) => {
            const isHovered = hoveredLayer === layer.id || activeLayer === layer.id
            const height = getLayerHeight(layer)

            return (
              <motion.div
                key={layer.id}
                className={`${styles.soilLayer} ${isHovered ? styles.layerActive : ''}`}
                style={{
                  height: `${height}%`,
                  '--layer-color': layer.color,
                  '--layer-hover-color': layer.hoverColor,
                } as React.CSSProperties}
                custom={index}
                variants={layerVariants}
                initial="hidden"
                animate={isLoaded ? 'visible' : 'hidden'}
                onMouseEnter={() => handleLayerEnter(layer.id)}
                onMouseLeave={handleLayerLeave}
                onClick={() => onLayerClick(layer.navId)}
              >
                {/* Layer texture */}
                <div className={styles.layerTexture} />

                {/* Soil particles */}
                <div className={styles.soilParticles}>
                  {particleData.map((particle, i) => (
                    <motion.div
                      key={i}
                      className={styles.particle}
                      style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        width: `${particle.width}px`,
                        height: `${particle.height}px`,
                      }}
                      animate={isHovered ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>

                {/* Problem indicator line */}
                <motion.div
                  className={styles.problemLine}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Layer info popup */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className={styles.layerInfo}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className={styles.infoDepth}>
                        {layer.depth.start}-{layer.depth.end} cm
                      </div>
                      <div className={styles.infoProblem}>{layer.problem}</div>
                      <div className={styles.infoDesc}>{layer.description}</div>
                      <div className={styles.infoAction}>
                        <span>Kattints a részletekért</span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Root Network SVG Overlay */}
        <svg className={styles.rootNetwork} viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6B8E4E" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#5A7A42" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#4A6A35" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {rootPaths.map((root, i) => (
            <motion.path
              key={i}
              d={root.d}
              fill="none"
              stroke="url(#rootGradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isLoaded ? {
                pathLength: hoveredLayer ? 1 : 0.7,
                opacity: hoveredLayer ? 0.9 : 0.5,
              } : { pathLength: 0, opacity: 0 }}
              transition={{
                pathLength: { duration: 1.5, delay: root.delay + 0.8 },
                opacity: { duration: 0.5 },
              }}
            />
          ))}
        </svg>

        {/* Compaction indicator zones */}
        <motion.div
          className={styles.compactionZone}
          style={{ top: '0%', height: '27%' }}
          animate={{
            opacity: hoveredLayer === 'topsoil' ? 0.4 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.compactionLines}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.compactionLine} />
            ))}
          </div>
        </motion.div>

        {/* Profile frame */}
        <div className={styles.profileFrame}>
          <div className={`${styles.frameCorner} ${styles.topLeft}`} />
          <div className={`${styles.frameCorner} ${styles.topRight}`} />
          <div className={`${styles.frameCorner} ${styles.bottomLeft}`} />
          <div className={`${styles.frameCorner} ${styles.bottomRight}`} />
        </div>
      </div>

      {/* Profile label */}
      <motion.div
        className={styles.profileLabel}
        initial={{ opacity: 0, y: 10 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <span className={styles.labelIcon}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="7" cy="7" r="2" fill="currentColor"/>
          </svg>
        </span>
        <span>Talajszelvény metszet</span>
      </motion.div>
    </motion.div>
  )
}
