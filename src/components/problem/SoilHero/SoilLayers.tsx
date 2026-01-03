'use client'

import { forwardRef, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './SoilHero.module.css'

interface SoilLayersProps {
  scrollProgress: number
  isLoaded: boolean
}

const SoilLayers = forwardRef<HTMLDivElement, SoilLayersProps>(
  ({ scrollProgress, isLoaded }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)

    // Parallax transforms based on scroll
    const skyOffset = scrollProgress * -30
    const topSoilOffset = scrollProgress * -50
    const middleSoilOffset = scrollProgress * -70
    const deepSoilOffset = scrollProgress * -90

    // Entrance animation variants
    const layerVariants = {
      hidden: (custom: number) => ({
        y: '100%',
        opacity: 0,
      }),
      visible: (custom: number) => ({
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.6,
          delay: custom * 0.1,
          ease: [0.22, 1, 0.36, 1],
        },
      }),
    }

    const surfaceVariants = {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.8,
          delay: 0.5,
          ease: 'easeOut',
        },
      },
    }

    return (
      <div ref={ref} className={styles.soilLayersContainer}>
        {/* Sky layer with subtle grain */}
        <motion.div
          className={styles.skyLayer}
          style={{ transform: `translateY(${skyOffset}px)` }}
          custom={0}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          variants={layerVariants}
        >
          {/* Atmospheric particles will be added separately */}
          <div className={styles.skyGrain} />
        </motion.div>

        {/* Surface line - organic wavy line */}
        <motion.div className={styles.surfaceLine}>
          <svg width="100%" height="6" preserveAspectRatio="none" viewBox="0 0 1920 6">
            <defs>
              <linearGradient id="surfaceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B7355" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8B7355" stopOpacity="1" />
                <stop offset="100%" stopColor="#8B7355" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,3 Q240,1 480,3 T960,3 T1440,3 T1920,3"
              stroke="url(#surfaceGradient)"
              strokeWidth="3"
              fill="none"
              variants={surfaceVariants}
              initial="hidden"
              animate={isLoaded ? 'visible' : 'hidden'}
            />
          </svg>
        </motion.div>

        {/* Top soil layer - rich organic matter */}
        <motion.div
          className={styles.topSoilLayer}
          style={{ transform: `translateY(${topSoilOffset}px)` }}
          custom={1}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          variants={layerVariants}
        >
          <div className={styles.soilTexture} data-layer="top" />
          {/* Subtle moisture patches */}
          <div className={styles.moisturePatches}>
            <div className={styles.moisturePatch} style={{ left: '15%', top: '30%' }} />
            <div className={styles.moisturePatch} style={{ left: '45%', top: '60%' }} />
            <div className={styles.moisturePatch} style={{ left: '75%', top: '20%' }} />
          </div>
        </motion.div>

        {/* Middle soil layer - mineral rich */}
        <motion.div
          className={styles.middleSoilLayer}
          style={{ transform: `translateY(${middleSoilOffset}px)` }}
          custom={2}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          variants={layerVariants}
        >
          <div className={styles.soilTexture} data-layer="middle" />
          {/* Subtle cracks */}
          <svg className={styles.soilCracks} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M20,0 L22,30 L18,60 L25,100" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" fill="none" />
            <path d="M60,0 L58,25 L65,55 L60,100" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" fill="none" />
            <path d="M85,0 L82,40 L88,70 L85,100" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" fill="none" />
          </svg>
        </motion.div>

        {/* Deep soil layer - compacted */}
        <motion.div
          className={styles.deepSoilLayer}
          style={{ transform: `translateY(${deepSoilOffset}px)` }}
          custom={3}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          variants={layerVariants}
        >
          <div className={styles.soilTexture} data-layer="deep" />
          {/* Mineral sparkles */}
          <div className={styles.mineralSparkles}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={styles.sparkle}
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  opacity: [0.1, 0.4, 0.1],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Depth indicator on the side */}
        <motion.div
          className={styles.depthIndicator}
          initial={{ opacity: 0, x: -20 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className={styles.depthLine} />
          <div className={styles.depthMarker} style={{ top: '0%' }}>
            <span>0 cm</span>
          </div>
          <div className={styles.depthMarker} style={{ top: '30%' }}>
            <span>25 cm</span>
          </div>
          <div className={styles.depthMarker} style={{ top: '65%' }}>
            <span>50 cm</span>
          </div>
        </motion.div>
      </div>
    )
  }
)

SoilLayers.displayName = 'SoilLayers'

export default SoilLayers
