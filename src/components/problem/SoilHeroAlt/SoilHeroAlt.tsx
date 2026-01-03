'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './SoilHeroAlt.module.css'
import XRayVisualization from './XRayVisualization'
import HeroContentAlt from './HeroContentAlt'
import NavButtonAlt from './NavButtonAlt'
import { NAV_ITEMS, SOIL_LAYERS, ANIMATION, SoilHeroAltProps } from './types'

export default function SoilHeroAlt({ onNavigate }: SoilHeroAltProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [revealedLayers, setRevealedLayers] = useState<string[]>([])
  const [activeNavId, setActiveNavId] = useState<string | null>(null)

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle scan animation
  const handleStartScan = useCallback(() => {
    if (isScanning) return

    setIsScanning(true)
    setScanProgress(0)
    setRevealedLayers([])

    // Animate scan progress
    const duration = ANIMATION.scanDuration * 1000
    const startTime = Date.now()

    const animateScan = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setScanProgress(progress)

      // Reveal layers as scan passes through
      if (progress > 0.15 && !revealedLayers.includes('topsoil')) {
        setRevealedLayers(prev => [...prev, 'topsoil'])
      }
      if (progress > 0.4 && !revealedLayers.includes('subsoil')) {
        setRevealedLayers(prev => [...prev, 'subsoil'])
      }
      if (progress > 0.65 && !revealedLayers.includes('deepsoil')) {
        setRevealedLayers(prev => [...prev, 'deepsoil'])
      }

      if (progress < 1) {
        requestAnimationFrame(animateScan)
      } else {
        setIsScanning(false)
      }
    }

    requestAnimationFrame(animateScan)
  }, [isScanning, revealedLayers])

  // Handle layer reveal (from X-Ray hover)
  const handleLayerReveal = useCallback((layerId: string) => {
    if (!revealedLayers.includes(layerId)) {
      setRevealedLayers(prev => [...prev, layerId])
    }
  }, [revealedLayers])

  // Handle navigation hover
  const handleNavHover = useCallback((id: string | null) => {
    setActiveNavId(id)
  }, [])

  // Handle navigation click
  const handleNavClick = useCallback((sectionId: string) => {
    onNavigate(sectionId)
  }, [onNavigate])

  // Map nav items to section IDs
  const getSectionId = (navId: string) => {
    const mapping: Record<string, string> = {
      compaction: 'compaction',
      cultivator: 'cultivator',
      ploughing: 'ploughing',
    }
    return mapping[navId] || navId
  }

  // Check if nav item is revealed
  const isNavRevealed = (navId: string) => {
    const layerMapping: Record<string, string> = {
      compaction: 'topsoil',
      cultivator: 'subsoil',
      ploughing: 'deepsoil',
    }
    return revealedLayers.includes(layerMapping[navId])
  }

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Background Gradient */}
      <div className={styles.backgroundGradient} />

      {/* Ambient particles */}
      <AmbientParticles isLoaded={isLoaded} />

      {/* Main Content Layout */}
      <div className={styles.contentLayout}>
        {/* Left Column - Hero Content */}
        <div className={styles.leftColumn}>
          <HeroContentAlt
            isLoaded={isLoaded}
            onStartScan={handleStartScan}
            isScanning={isScanning}
          />
        </div>

        {/* Center Column - X-Ray Visualization */}
        <div className={styles.centerColumn}>
          <XRayVisualization
            isLoaded={isLoaded}
            scrollProgress={scrollProgress.get()}
            isScanning={isScanning}
            scanProgress={scanProgress}
            revealedLayers={revealedLayers}
            onLayerReveal={handleLayerReveal}
          />
        </div>

        {/* Right Column - Navigation */}
        <div className={styles.rightColumn}>
          {NAV_ITEMS.map((item, index) => (
            <NavButtonAlt
              key={item.id}
              item={item}
              index={index}
              isActive={activeNavId === item.id}
              isRevealed={isNavRevealed(item.id)}
              onHover={handleNavHover}
              onClick={() => handleNavClick(getSectionId(item.id))}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <span className={styles.scrollText}>Görgess</span>
        <motion.div
          className={styles.scrollArrow}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Ambient floating particles component
function AmbientParticles({ isLoaded }: { isLoaded: boolean }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
  }))

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 2,
    }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            background: 'rgba(201, 162, 39, 0.3)',
            filter: 'blur(1px)',
          }}
          initial={{ opacity: 0 }}
          animate={isLoaded ? {
            opacity: [0, 0.6, 0],
            y: [0, -100, -200],
            x: [0, Math.random() * 40 - 20],
          } : {}}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
