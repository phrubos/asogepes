'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './SoilHero.module.css'
import SoilLayers from './SoilLayers'
import PlantSystem from './PlantSystem'
import NavButton from './NavButton'
import HeroContent from './HeroContent'
import ParticleSystem from './ParticleSystem'
import { NAV_ITEMS, SoilHeroProps } from './types'

gsap.registerPlugin(ScrollTrigger)

export default function SoilHero({ onNavigate }: SoilHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const soilLayersRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null)

  // Initialize loading state
  useEffect(() => {
    // Small delay to ensure smooth entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Setup scroll trigger for parallax
  useGSAP(() => {
    if (!sectionRef.current) return

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  // Handle nav button hover
  const handleNavHover = useCallback((id: string | null) => {
    setHoveredNavId(id)
  }, [])

  // Handle nav button click
  const handleNavClick = useCallback((sectionId: string) => {
    onNavigate(sectionId)
  }, [onNavigate])

  // Handle root animation complete
  const handleRootAnimationComplete = useCallback((id: string) => {
    // Optional: trigger additional effects when root reaches button
  }, [])

  return (
    <section ref={sectionRef} className={styles.heroSection}>
      {/* Background soil layers with parallax */}
      <SoilLayers
        ref={soilLayersRef}
        scrollProgress={scrollProgress}
        isLoaded={isLoaded}
      />

      {/* Particle effects */}
      <ParticleSystem isLoaded={isLoaded} activeRootId={hoveredNavId} />

      {/* Plant and root system SVG */}
      <PlantSystem
        isLoaded={isLoaded}
        hoveredNavId={hoveredNavId}
        onRootAnimationComplete={handleRootAnimationComplete}
      />

      {/* Navigation buttons - LEFT side */}
      <div className={styles.navButtonsContainer}>
        {NAV_ITEMS.map((item, index) => (
          <NavButton
            key={item.id}
            item={item}
            index={index}
            isHovered={hoveredNavId === item.id}
            onHover={handleNavHover}
            onClick={() => handleNavClick(item.id)}
          />
        ))}
      </div>

      {/* Hero content - RIGHT side */}
      <HeroContent isLoaded={isLoaded} />

      {/* Optional: Connection lines visualization */}
      {hoveredNavId && (
        <svg className={styles.connectionLines} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="connectionGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C9A227" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </section>
  )
}
