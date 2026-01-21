'use client'

import { useMemo } from 'react'
import BookLayout from './BookLayout'
import { researchPages } from './research-pages'

export default function ResearchLayout() {
  // Define all book pages
  const pages = useMemo(() => researchPages, [])

  return <BookLayout pages={pages} resetEventName="reset-research-book" />
}

/* OLD LAYOUT - Kept for reference
export default function ResearchLayoutOld() {
  const router = useRouter()
  const ctaRef = useRef(null)
  const isCtaInView = useInView(ctaRef, { once: true })

  const handleLocationClick = useCallback((locationId: string) => {
    const element = document.getElementById(`location-${locationId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <section className={styles.sectionResearch}>
      <div className="container">
        <ResearchHero onLocationClick={handleLocationClick} />
      </div>

      {LOCATION_KEYS.map((key, index) => (
        <LocationSection
          key={key}
          id={`location-${key}`}
          locationKey={key}
          data={locations[key]}
          index={index}
        />
      ))}

      <ScrollIndicator />

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
*/
