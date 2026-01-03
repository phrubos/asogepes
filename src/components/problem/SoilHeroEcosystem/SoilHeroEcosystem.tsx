'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './SoilHeroEcosystem.module.css'
import EcosystemVisualization from './EcosystemVisualization'
import HeroContentEco from './HeroContentEco'
import NavButtonEco from './NavButtonEco'
import { NAV_ITEMS, ANIMATION, SoilHeroEcosystemProps } from './types'

export default function SoilHeroEcosystem({ onNavigate }: SoilHeroEcosystemProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRaining, setIsRaining] = useState(false)
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
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

  // Handle rain animation
  const handleStartRain = useCallback(() => {
    if (isRaining) return

    setIsRaining(true)

    // Stop raining after duration
    setTimeout(() => {
      setIsRaining(false)
    }, ANIMATION.rainDuration)
  }, [isRaining])

  // Handle layer hover from visualization
  const handleLayerHover = useCallback((layerId: string | null) => {
    setActiveLayer(layerId)
  }, [])

  // Handle navigation hover
  const handleNavHover = useCallback((id: string | null) => {
    setActiveNavId(id)
    // Sync with visualization layers
    if (id) {
      const layerMapping: Record<string, string> = {
        compaction: 'topsoil',
        cultivator: 'subsoil',
        ploughing: 'hardpan',
      }
      setActiveLayer(layerMapping[id] || null)
    } else {
      setActiveLayer(null)
    }
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

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Background Gradient */}
      <div className={styles.backgroundGradient} />
      <div className={styles.backgroundNoise} />

      {/* Ambient floating particles */}
      <AmbientParticles isLoaded={isLoaded} />

      {/* Main Content Layout */}
      <div className={styles.contentLayout}>
        {/* Left Column - Hero Content */}
        <div className={styles.leftColumn}>
          <HeroContentEco
            isLoaded={isLoaded}
            onStartRain={handleStartRain}
            isRaining={isRaining}
          />
        </div>

        {/* Center Column - Ecosystem Visualization */}
        <div className={styles.centerColumn}>
          <EcosystemVisualization
            isLoaded={isLoaded}
            isRaining={isRaining}
            scrollProgress={scrollProgress.get()}
            activeLayer={activeLayer}
            onLayerHover={handleLayerHover}
          />
        </div>

        {/* Right Column - Navigation */}
        <div className={styles.rightColumn}>
          {NAV_ITEMS.map((item, index) => (
            <NavButtonEco
              key={item.id}
              item={item}
              index={index}
              isActive={activeNavId === item.id}
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

// Ambient floating particles component - organic, bio-luminescent feel
function AmbientParticles({ isLoaded }: { isLoaded: boolean }) {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    duration: 20 + Math.random() * 30,
    delay: Math.random() * 10,
    type: Math.random() > 0.7 ? 'glow' : 'dust',
  }))

  return (
    <div className={styles.ambientParticles}>
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
            background: particle.type === 'glow'
              ? 'rgba(0, 212, 255, 0.4)'
              : 'rgba(201, 162, 39, 0.25)',
            filter: particle.type === 'glow' ? 'blur(1px)' : 'blur(0.5px)',
            boxShadow: particle.type === 'glow'
              ? '0 0 8px rgba(0, 212, 255, 0.3)'
              : 'none',
          }}
          initial={{ opacity: 0 }}
          animate={isLoaded ? {
            opacity: [0, 0.8, 0.4, 0.8, 0],
            y: [0, -50, -100],
            x: [0, Math.random() * 30 - 15, Math.random() * 40 - 20],
            scale: [1, 1.2, 0.8, 1.1, 0.5],
          } : {}}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Occasional larger glowing orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          style={{
            position: 'absolute',
            left: `${20 + i * 15}%`,
            top: `${60 + Math.random() * 30}%`,
            width: 6 + Math.random() * 4,
            height: 6 + Math.random() * 4,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(90, 143, 90, 0.6) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={isLoaded ? {
            opacity: [0, 0.6, 0.3, 0.6, 0],
            scale: [0.5, 1, 1.2, 1, 0.5],
          } : {}}
          transition={{
            duration: 15 + Math.random() * 10,
            delay: 3 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
