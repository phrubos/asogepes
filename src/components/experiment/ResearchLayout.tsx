'use client'

import { useMemo } from 'react'
import BookLayout, { BookPage } from './BookLayout'
import {
  HeroPage,
  MethodologyPage,
  SzentkirályInfoPage,
  SzentkirályTimelinePage,
  SzentkirályTempPage,
  SzentkirályPhotosPage
} from './pages'
// import { locations } from '@/lib/data'
// import LocationSection from './LocationSection'
// import ScrollIndicator from './ScrollIndicator'

export default function ResearchLayout() {
  // Define all book pages
  const pages: BookPage[] = useMemo(() => [
    // Hero page
    {
      id: 'hero',
      section: 'Bevezető',
      sectionIndex: 0,
      title: 'Kutatás áttekintés',
      component: <HeroPage />,
    },
    // Methodology page
    {
      id: 'methodology',
      section: 'Módszertan',
      sectionIndex: 1,
      title: 'Penetrométeres mérés',
      component: <MethodologyPage />,
    },
    // Szentkirály pages
    {
      id: 'szentkiraly-info',
      section: 'Szentkirály',
      sectionIndex: 2,
      title: 'Helyszín adatok',
      component: <SzentkirályInfoPage />,
    },
    {
      id: 'szentkiraly-timeline',
      section: 'Szentkirály',
      sectionIndex: 2,
      title: 'Talajszerkezet változás',
      component: <SzentkirályTimelinePage />,
    },
    {
      id: 'szentkiraly-temp',
      section: 'Szentkirály',
      sectionIndex: 2,
      title: 'Talajhőmérséklet vizsgálat',
      component: <SzentkirályTempPage />,
    },
    {
      id: 'szentkiraly-photos',
      section: 'Szentkirály',
      sectionIndex: 2,
      title: 'Fotók',
      component: <SzentkirályPhotosPage />,
    },
    // TODO: Kecskemét pages (commented out for now)
    // {
    //   id: 'kecskemet-info',
    //   section: 'Kecskemét',
    //   sectionIndex: 2,
    //   title: 'Helyszín adatok',
    //   component: <KecskemétInfoPage />,
    // },
    // TODO: Lakitelek pages (commented out for now)
    // {
    //   id: 'lakitelek-info',
    //   section: 'Lakitelek',
    //   sectionIndex: 3,
    //   title: 'Helyszín adatok',
    //   component: <LakitelekInfoPage />,
    // },
  ], [])

  return <BookLayout pages={pages} />
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
