'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './SectionScrollIndicator.module.css'

interface Section {
  id: string
  name: string
}

interface SectionScrollIndicatorProps {
  sections: Section[]
  observeAttribute?: string // 'id' or custom data attribute
}

export default function SectionScrollIndicator({ 
  sections,
  observeAttribute = 'id'
}: SectionScrollIndicatorProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || sections.length === 0) return

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          if (sectionId) {
            setActiveSection(sectionId)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    // Show/hide indicator based on scroll position
    const handleScroll = () => {
      const firstSection = document.getElementById(sections[0].id)
      const lastSection = document.getElementById(sections[sections.length - 1].id)

      if (firstSection && lastSection) {
        const firstRect = firstSection.getBoundingClientRect()
        const lastRect = lastSection.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Show when first section is in view, hide after last section
        const shouldShow = firstRect.top < viewportHeight * 0.7 && lastRect.bottom > viewportHeight * 0.3
        setIsVisible(shouldShow)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMounted, sections])

  const handleClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const yOffset = -120
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  // Don't render on server
  if (!isMounted) return null

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.nav
          key="section-scroll-indicator"
          className={styles.indicator}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          aria-label="Szekció navigáció"
        >
          <div className={styles.track}>
            {/* Progress line */}
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: activeSection
                    ? (sections.findIndex(s => s.id === activeSection) + 1) / sections.length
                    : 0
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Section dots */}
            {sections.map((section, index) => {
              const isActive = activeSection === section.id
              const isPast = activeSection
                ? sections.findIndex(s => s.id === activeSection) >= index
                : false

              return (
                <button
                  key={section.id}
                  className={`${styles.dot} ${isActive ? styles.dotActive : ''} ${isPast ? styles.dotPast : ''}`}
                  onClick={() => handleClick(section.id)}
                  aria-label={`Ugrás: ${section.name}`}
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

                  {/* Pulse ring for active */}
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
                    {section.name}
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
