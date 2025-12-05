'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './SectionIndicator.module.css'

interface Section {
  id: string
  label: string
}

interface SectionIndicatorProps {
  sections: Section[]
  offset?: number
  showLabels?: boolean
  position?: 'left' | 'right'
}

export default function SectionIndicator({
  sections,
  offset = 200,
  showLabels = true,
  position = 'right'
}: SectionIndicatorProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredDot, setHoveredDot] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  // Track scroll position and determine active section
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY

    // Show/hide indicator based on scroll position
    const firstSection = document.getElementById(sections[0]?.id)
    if (firstSection) {
      const rect = firstSection.getBoundingClientRect()
      setIsVisible(rect.top < window.innerHeight * 0.5)
    }

    // Find the active section
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = document.getElementById(sections[i].id)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= offset) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }
  }, [sections, offset])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -120
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: position === 'right' ? 20 : -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0, x: position === 'right' ? 20 : -20 }
  }

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  }

  const labelVariants = {
    hidden: { opacity: 0, x: position === 'right' ? 10 : -10, width: 0 },
    visible: { 
      opacity: 1, 
      x: 0,
      width: 'auto',
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  }

  if (prefersReducedMotion) {
    return (
      <nav 
        className={`${styles.indicator} ${styles[position]}`}
        aria-label="Szekció navigáció"
      >
        <ul className={styles.dotList}>
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`${styles.dotButton} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => scrollToSection(section.id)}
                aria-label={`Ugrás: ${section.label}`}
                aria-current={activeSection === section.id ? 'true' : undefined}
              >
                <span className={styles.dot} />
                {showLabels && <span className={styles.label}>{section.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className={`${styles.indicator} ${styles[position]}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-label="Szekció navigáció"
        >
          {/* Progress line */}
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressLine}
              style={{
                height: `${(sections.findIndex(s => s.id === activeSection) / (sections.length - 1)) * 100}%`
              }}
              layoutId="progressLine"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          <ul className={styles.dotList}>
            {sections.map((section, index) => (
              <motion.li
                key={section.id}
                variants={dotVariants}
              >
                <motion.button
                  className={`${styles.dotButton} ${activeSection === section.id ? styles.active : ''}`}
                  onClick={() => scrollToSection(section.id)}
                  onMouseEnter={() => setHoveredDot(section.id)}
                  onMouseLeave={() => setHoveredDot(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Ugrás: ${section.label}`}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                >
                  <motion.span
                    className={styles.dot}
                    animate={{
                      scale: activeSection === section.id ? 1.3 : 1,
                      backgroundColor: activeSection === section.id 
                        ? 'var(--color-gold)' 
                        : 'var(--color-earth-300, #a89c8c)'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  />
                  
                  {/* Active ring indicator */}
                  {activeSection === section.id && (
                    <motion.span
                      className={styles.activeRing}
                      layoutId="activeRing"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}

                  {/* Label on hover */}
                  <AnimatePresence>
                    {showLabels && (hoveredDot === section.id || activeSection === section.id) && (
                      <motion.span
                        className={styles.label}
                        variants={labelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {section.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
