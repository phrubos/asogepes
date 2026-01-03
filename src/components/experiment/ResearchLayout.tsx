'use client'

import { useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { locations } from '@/lib/data'
import MagneticButton from '@/components/ui/MagneticButton'
import ResearchHero from './ResearchHero'
import LocationSection from './LocationSection'
import ScrollIndicator from './ScrollIndicator'
import styles from './ResearchNew.module.css'

// Location keys in display order
const LOCATION_KEYS = ['szentkiraly', 'kecskemet', 'lakitelek'] as const

export default function ResearchLayout() {
  const router = useRouter()
  const ctaRef = useRef(null)
  const isCtaInView = useInView(ctaRef, { once: true })

  // Handle location click from hero map
  const handleLocationClick = useCallback((locationId: string) => {
    const element = document.getElementById(`location-${locationId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <section className={styles.sectionResearch}>
      <div className="container">
        {/* Hero with Hungary Map */}
        <ResearchHero onLocationClick={handleLocationClick} />
      </div>

      {/* Location Sections - Full width for better visual separation */}
      {LOCATION_KEYS.map((key, index) => (
        <LocationSection
          key={key}
          id={`location-${key}`}
          locationKey={key}
          data={locations[key]}
          index={index}
        />
      ))}

      {/* Scroll Indicator - Fixed right side navigation */}
      <ScrollIndicator />

      {/* CTA Section */}
      <div className="container">
        <motion.div
          ref={ctaRef}
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.ctaText}>
            Kérdése van a kutatásról?
          </p>
          <MagneticButton
            variant="primary"
            size="lg"
            showRipple
            showShine
            ariaLabel="Vissza a főoldalra"
            onClick={() => router.push('/')}
          >
            Vissza a főoldalra <ArrowRight size={20} />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
