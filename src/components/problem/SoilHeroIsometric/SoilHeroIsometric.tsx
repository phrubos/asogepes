'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './SoilHeroIsometric.module.css'
import IsometricBlock from './IsometricBlock'
import HeroContentIsometric from './HeroContentIsometric'
import NavButtonIsometric from './NavButtonIsometric'
import {
  NAV_ITEMS,
  SOIL_LAYERS,
  SoilHeroIsometricProps,
  DrawerState,
  MousePosition,
} from './types'

export default function SoilHeroIsometric({ onNavigate }: SoilHeroIsometricProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeNavId, setActiveNavId] = useState<string | null>(null)
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null)
  const [openDrawers, setOpenDrawers] = useState<DrawerState[]>([])
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle mouse move for 3D rotation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const normalizedX = (x / rect.width) * 2 - 1 // -1 to 1
    const normalizedY = (y / rect.height) * 2 - 1 // -1 to 1

    setMousePosition({ x, y, normalizedX, normalizedY })
  }, [])

  // Handle layer click (toggle drawer)
  const handleLayerClick = useCallback((layerId: string) => {
    setOpenDrawers((prev) => {
      const existing = prev.find((d) => d.layerId === layerId)
      if (existing) {
        // Toggle off
        return prev.filter((d) => d.layerId !== layerId)
      } else {
        // Toggle on
        return [...prev, { layerId, isOpen: true, openAmount: 1 }]
      }
    })
  }, [])

  // Handle layer hover
  const handleLayerHover = useCallback((layerId: string | null) => {
    setActiveLayerId(layerId)
  }, [])

  // Handle nav hover
  const handleNavHover = useCallback((id: string | null) => {
    setActiveNavId(id)
    // Also highlight corresponding layer
    if (id) {
      const layerMapping: Record<string, string> = {
        compaction: 'topsoil',
        cultivator: 'subsoil',
        ploughing: 'hardpan',
      }
      setActiveLayerId(layerMapping[id] || null)
    } else {
      setActiveLayerId(null)
    }
  }, [])

  // Handle navigation click
  const handleNavClick = useCallback(
    (sectionId: string) => {
      // Also open the corresponding drawer
      const layerMapping: Record<string, string> = {
        compaction: 'topsoil',
        cultivator: 'subsoil',
        ploughing: 'hardpan',
      }
      const layerId = layerMapping[sectionId]
      if (layerId) {
        handleLayerClick(layerId)
      }
      // Navigate after a short delay for visual feedback
      setTimeout(() => {
        onNavigate(sectionId)
      }, 400)
    },
    [onNavigate, handleLayerClick]
  )

  // Check if drawer is open
  const isDrawerOpen = useCallback(
    (navId: string) => {
      const layerMapping: Record<string, string> = {
        compaction: 'topsoil',
        cultivator: 'subsoil',
        ploughing: 'hardpan',
      }
      const layerId = layerMapping[navId]
      return openDrawers.some((d) => d.layerId === layerId)
    },
    [openDrawers]
  )

  // Get active layer object
  const activeLayer = useMemo(() => {
    return SOIL_LAYERS.find((l) => l.id === activeLayerId) || null
  }, [activeLayerId])

  // Dust particles for atmosphere - use deterministic values to avoid hydration mismatch
  const dustParticles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        // Use deterministic pseudo-random based on index
        const seed = i * 9301 + 49297
        const random = () => ((seed * 9301 + 49297) % 233280) / 233280
        return {
          id: i,
          x: random() * 100,
          y: random() * 100,
          size: 2 + random() * 3,
          duration: 20 + random() * 15,
          delay: random() * 8,
        }
      }),
    []
  )

  return (
    <section
      ref={sectionRef}
      className={styles.heroSection}
      onMouseMove={handleMouseMove}
    >
      {/* Background Elements */}
      <div className={styles.backgroundMesh} />
      <div className={styles.grainOverlay} />
      <div className={styles.gridPattern} />

      {/* Dust Particles */}
      <div className={styles.dustParticles}>
        {isLoaded && dustParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={styles.dustParticle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -150, -300],
              x: [0, (particle.id * 7) % 60 - 30], // Deterministic value based on particle id
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main Content Layout */}
      <div className={styles.contentLayout}>
        {/* Left Column - Hero Content */}
        <div className={styles.leftColumn}>
          <HeroContentIsometric isLoaded={isLoaded} activeLayer={activeLayer} />
        </div>

        {/* Center Column - Isometric Block */}
        <div className={styles.centerColumn}>
          <IsometricBlock
            isLoaded={isLoaded}
            mousePosition={mousePosition}
            openDrawers={openDrawers}
            activeLayer={activeLayerId}
            onLayerClick={handleLayerClick}
            onLayerHover={handleLayerHover}
          />
        </div>

        {/* Right Column - Navigation */}
        <div className={styles.rightColumn}>
          {NAV_ITEMS.map((item, index) => (
            <NavButtonIsometric
              key={item.id}
              item={item}
              index={index}
              isActive={activeNavId === item.id}
              isOpen={isDrawerOpen(item.id)}
              onHover={handleNavHover}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.2, duration: 0.5 }}
      >
        <span className={styles.scrollText}>Görgess</span>
        <div className={styles.scrollLine}>
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 35, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}
