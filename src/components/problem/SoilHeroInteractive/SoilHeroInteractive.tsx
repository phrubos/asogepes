'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import styles from './SoilHeroInteractive.module.css'
import InteractiveSoilProfile from './InteractiveSoilProfile'
import { NAV_ITEMS, SoilHeroInteractiveProps } from './types'
import PageBadge from '@/components/ui/PageBadge'

export default function SoilHeroInteractive({ onNavigate }: SoilHeroInteractiveProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleLayerHover = useCallback((layerId: string | null) => {
    setActiveLayer(layerId)
    // Map layer ID to nav ID
    const layerToNav: Record<string, string> = {
      topsoil: 'compaction',
      subsoil: 'cultivator',
      deepsoil: 'ploughing',
    }
    setHoveredNav(layerId ? layerToNav[layerId] : null)
  }, [])

  const handleNavHover = useCallback((navId: string | null) => {
    setHoveredNav(navId)
    // Map nav ID to layer ID
    const navToLayer: Record<string, string> = {
      compaction: 'topsoil',
      cultivator: 'subsoil',
      ploughing: 'deepsoil',
    }
    setActiveLayer(navId ? navToLayer[navId] : null)
  }, [])

  const handleNavClick = useCallback((navId: string) => {
    onNavigate(navId)
  }, [onNavigate])

  // Stagger animation for content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Background layers */}
      <div className={styles.backgroundBase} />
      <div className={styles.backgroundGradient} />
      <div className={styles.backgroundNoise} />

      {/* Grid pattern overlay */}
      <div className={styles.gridPattern} />

      {/* Main content */}
      <div className={styles.contentWrapper}>
        <motion.div
          className={styles.contentGrid}
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
        >
          {/* Left Column - Hero Text */}
          <div className={styles.leftColumn}>
            <motion.div variants={itemVariants}>
              <PageBadge number="02" label="A PROBLÉMA" />
            </motion.div>

            <motion.h1 className={styles.headline} variants={itemVariants}>
              Fedezd fel a{' '}
              <br />
              talaj{' '}
              <span className={styles.headlineAccent}>rétegeit</span>
            </motion.h1>

            <motion.p className={styles.description} variants={itemVariants}>
              A talaj több mint föld a lábunk alatt. Három kritikus réteg
              határozza meg a termésmennyiséget — és mindhárom{' '}
              <strong>veszélyben van</strong>.
            </motion.p>

            <motion.div className={styles.ctaGroup} variants={itemVariants}>
              <span className={styles.ctaHint}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                  <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Vidd az egeret a rétegekre
              </span>
            </motion.div>
          </div>

          {/* Right Column - Soil Profile */}
          <div className={styles.rightColumn}>
            <InteractiveSoilProfile
              isLoaded={isLoaded}
              activeLayer={activeLayer}
              onLayerHover={handleLayerHover}
              onLayerClick={handleNavClick}
            />
          </div>
        </motion.div>

        {/* Navigation Row - Below the grid */}
        <motion.div
          className={styles.navRow}
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.navList} variants={containerVariants}>
            {NAV_ITEMS.map((item, index) => {
              const isActive = hoveredNav === item.id

              return (
                <motion.button
                  key={item.id}
                  className={`${styles.navButton} ${isActive ? styles.navActive : ''}`}
                  style={{
                    '--nav-color': item.color,
                  } as React.CSSProperties}
                  variants={itemVariants}
                  onMouseEnter={() => handleNavHover(item.id)}
                  onMouseLeave={() => handleNavHover(null)}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={styles.navIndicator}>
                    <motion.div
                      className={styles.navIndicatorFill}
                      animate={{ scaleY: isActive ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  <div className={styles.navContent}>
                    <div className={styles.navHeader}>
                      <span className={styles.navNumber}>{item.number}</span>
                      <span className={styles.navDepth}>{item.depth}</span>
                    </div>
                    <h3 className={styles.navTitle}>{item.title}</h3>
                    <p className={styles.navSubtitle}>{item.subtitle}</p>
                  </div>

                  <motion.div
                    className={styles.navArrow}
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </motion.button>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className={styles.scrollText}>Görgess a folytatáshoz</span>
        <motion.div
          className={styles.scrollIcon}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

      {/* Connection lines from profile to nav (decorative) */}
      <svg className={styles.connectionLines} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(201, 162, 39, 0.3)" />
            <stop offset="100%" stopColor="rgba(201, 162, 39, 0)" />
          </linearGradient>
        </defs>
        {[15, 45, 75].map((y, i) => (
          <motion.line
            key={i}
            x1="45"
            y1={y}
            x2="55"
            y2={y}
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isLoaded && hoveredNav === NAV_ITEMS[i].id ? {
              pathLength: 1,
              opacity: 0.6,
            } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </svg>
    </section>
  )
}
