'use client'

import { useMemo } from 'react'
import BookLayout, { BookPage } from './BookLayout'
import {
  HeroPage,
  MethodologyPage,
} from './pages'
import SzentkiralyCombinedPage from './pages/SzentkiralyCombinedPage'
import KecskemetCombinedPage from './pages/KecskemetCombinedPage'
import LakitelekCombinedPage from './pages/LakitelekCombinedPage'
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
      component: <SzentkiralyCombinedPage />,
      viewGroupId: 'szentkiraly-group',
      scrollToId: 'szentkiraly-info'
    },
    {
      id: 'szentkiraly-timeline',
      section: 'Szentkirály',
      sectionIndex: 2,
      title: 'A talajszerkezet változása',
      component: <SzentkiralyCombinedPage />,
      viewGroupId: 'szentkiraly-group',
      scrollToId: 'szentkiraly-timeline'
    },
    {
      id: 'szentkiraly-temp',
      section: 'Szentkirály',
      sectionIndex: 2,
      title: 'Talajhőmérséklet',
      component: <SzentkiralyCombinedPage />,
      viewGroupId: 'szentkiraly-group',
      scrollToId: 'szentkiraly-temp'
    },
    {
      id: 'szentkiraly-photos',
      section: 'Szentkirály',
      sectionIndex: 2,
      title: 'Fotók',
      component: <SzentkiralyCombinedPage />,
      viewGroupId: 'szentkiraly-group',
      scrollToId: 'szentkiraly-photos'
    },
    // Kecskemét-Borbás pages
    {
      id: 'kecskemet-info',
      section: 'KECSKEMÉT-BORBÁS',
      sectionIndex: 3,
      title: 'Helyszín adatok',
      component: <KecskemetCombinedPage />,
      viewGroupId: 'kecskemet-group',
      scrollToId: 'kecskemet-info'
    },
    {
      id: 'kecskemet-timeline',
      section: 'KECSKEMÉT-BORBÁS',
      sectionIndex: 3,
      title: 'A talajszerkezet változása',
      component: <KecskemetCombinedPage />,
      viewGroupId: 'kecskemet-group',
      scrollToId: 'kecskemet-timeline'
    },
    {
      id: 'kecskemet-photos',
      section: 'KECSKEMÉT-BORBÁS',
      sectionIndex: 3,
      title: 'Fotók',
      component: <KecskemetCombinedPage />,
      viewGroupId: 'kecskemet-group',
      scrollToId: 'kecskemet-photos'
    },
    // Lakitelek pages
    {
      id: 'lakitelek-info',
      section: 'Lakitelek',
      sectionIndex: 4,
      title: 'Helyszín adatok',
      component: <LakitelekCombinedPage />,
      viewGroupId: 'lakitelek-group',
      scrollToId: 'lakitelek-info'
    },
    {
      id: 'lakitelek-chart',
      section: 'Lakitelek',
      sectionIndex: 4,
      title: '7 művelési kombináció eredménye',
      component: <LakitelekCombinedPage />,
      viewGroupId: 'lakitelek-group',
      scrollToId: 'lakitelek-chart'
    },
    {
      id: 'lakitelek-photos',
      section: 'Lakitelek',
      sectionIndex: 4,
      title: 'Fotók',
      component: <LakitelekCombinedPage />,
      viewGroupId: 'lakitelek-group',
      scrollToId: 'lakitelek-photos'
    },
  ], [])

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
