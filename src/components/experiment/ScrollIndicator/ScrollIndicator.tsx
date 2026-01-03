'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ScrollIndicator.module.css'

interface Location {
  id: string
  name: string
}

const LOCATIONS: Location[] = [
  { id: 'szentkiraly', name: 'Szentkirály' },
  { id: 'kecskemet', name: 'Kecskemét' },
  { id: 'lakitelek', name: 'Lakitelek' },
]

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const locationId = entry.target.getAttribute('data-location')
          if (locationId) {
            setActiveSection(locationId)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all location sections
    LOCATIONS.forEach((location) => {
      const element = document.getElementById(`location-${location.id}`)
      if (element) {
        observer.observe(element)
      }
    })

    // Show/hide indicator based on scroll position
    const handleScroll = () => {
      const firstSection = document.getElementById('location-szentkiraly')
      const lastSection = document.getElementById('location-lakitelek')

      if (firstSection && lastSection) {
        const firstRect = firstSection.getBoundingClientRect()
        const lastRect = lastSection.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Show when first section is in view, hide after last section
        const shouldShow = firstRect.top < viewportHeight * 0.5 && lastRect.bottom > viewportHeight * 0.3
        setIsVisible(shouldShow)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMounted])

  const handleClick = (locationId: string) => {
    const element = document.getElementById(`location-${locationId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Don't render on server
  if (!isMounted) return null

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.nav
          key="scroll-indicator"
          className={styles.indicator}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          aria-label="Helyszín navigáció"
        >
          <div className={styles.track}>
            {/* Progress line */}
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: activeSection
                    ? (LOCATIONS.findIndex(l => l.id === activeSection) + 1) / LOCATIONS.length
                    : 0
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Location dots */}
            {LOCATIONS.map((location, index) => {
              const isActive = activeSection === location.id
              const isPast = activeSection
                ? LOCATIONS.findIndex(l => l.id === activeSection) >= index
                : false

              return (
                <button
                  key={location.id}
                  className={`${styles.dot} ${isActive ? styles.dotActive : ''} ${isPast ? styles.dotPast : ''}`}
                  onClick={() => handleClick(location.id)}
                  aria-label={`Ugrás: ${location.name}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {/* Dot */}
                  <motion.span
                    className={styles.dotInner}
                    animate={{
                      scale: isActive ? 1.3 : 1,
                      backgroundColor: isActive ? 'var(--color-gold)' : isPast ? 'rgba(212, 168, 75, 0.6)' : 'rgba(255, 255, 255, 0.3)'
                    }}
                    transition={{ duration: 0.25 }}
                  />

                  {/* Pulse ring for active - using CSS animation instead */}
                  <span
                    className={styles.dotPulse}
                    style={{ opacity: isActive ? 1 : 0 }}
                  />

                  {/* Label */}
                  <motion.span
                    className={styles.label}
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {location.name}
                  </motion.span>
                </button>
              )
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
