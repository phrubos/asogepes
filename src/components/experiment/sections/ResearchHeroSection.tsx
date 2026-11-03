'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import HungaryMap from '../ResearchHero/HungaryMap'
import { RESEARCH_FIELDS, RESEARCH_SITES as HERO_SITES, RESEARCH_YEARS as HERO_YEARS } from '@/lib/seasons'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import styles from '../pages/HeroPage.module.css'

// Mapping from map ID to section ID
const LOCATION_SECTION_MAP: Record<string, string> = {
  'szentkiraly': 'szentkiraly',
  'kecskemet': 'kecskemet',
  'lakitelek': 'lakitelek',
}

const STATS = [
  { value: HERO_SITES.length, label: 'Helyszín', detail: 'Kecskemét környékén' },
  { value: HERO_YEARS.length, label: 'Tenyészidő', detail: HERO_YEARS.join(' és ') },
  { value: RESEARCH_FIELDS, label: 'Kísérleti tábla', detail: 'Szentkirályon kettő' },
]

export default function ResearchHeroSection() {
  const { scrollToSection } = useScrollNav()

  const handleLocationClick = (locationId: string) => {
    const targetSectionId = LOCATION_SECTION_MAP[locationId]
    if (targetSectionId) {
      scrollToSection(targetSectionId)
    }
  }

  return (
    <div id="research-intro" className={styles.heroPage}>
      <div className={styles.content}>
        {/* Left Column - Text */}
        <div className={styles.textColumn}>
          <div className="hero-rise">
            <PageBadge label="A KUTATÁS" />
          </div>

          <h1 className={`${styles.title} hero-rise`} style={{ animationDelay: '100ms' }}>
            Szántóföldi talajszerkezet
            <span className={styles.titleAccent}>vizsgálatok</span>
          </h1>

          <p className={`${styles.description} hero-rise`} style={{ animationDelay: '200ms' }}>
            Három helyszínen, {HERO_YEARS.length === 2 ? 'két' : HERO_YEARS.length} tenyészidőn át mértük, hogyan változik a talaj
            ásógépes és hagyományos művelés után.
          </p>

          {/* Figures true for every season; the seasons themselves are on the map */}
          <div className={`${styles.statsRow} hero-rise`} style={{ animationDelay: '300ms' }}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statItem}>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statInfo}>
                  <div className={styles.statLabel}>{s.label}</div>
                  <div className={styles.statDetail}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Map */}
        <motion.div
          className={styles.mapColumn}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className={styles.mapContainer}>
            <HungaryMap onLocationClick={handleLocationClick} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
