'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import HungaryMap from '../ResearchHero/HungaryMap'
import { useScrollNav } from '@/components/shared/ScrollLayout'
import styles from '../pages/HeroPage.module.css'

// Mapping from map ID to section ID
const LOCATION_SECTION_MAP: Record<string, string> = {
  'szentkiraly': 'szentkiraly',
  'kecskemet': 'kecskemet',
  'lakitelek': 'lakitelek',
}

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
            Három helyszínen, 9 különböző művelési kombinációval,
            hat hónapon át mértük a talajszerkezet változását.
          </p>

          {/* Stats Row */}
          <div className={`${styles.statsRow} hero-rise`} style={{ animationDelay: '300ms' }}>
            {/* Stat 1 */}
            <div className={styles.statItem}>
              <div className={styles.statValue}>3</div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>HELYSZÍN</div>
                <div className={styles.statDetail}>Szentkirály · Kecskemét · Lakitelek</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className={styles.statItem}>
              <div className={styles.statValue}>9</div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>KEZELÉS KOMBINÁCIÓ</div>
                <div className={styles.statDetail}>Különböző művelési módok</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className={styles.statItem}>
              <div className={styles.statValue}>6</div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>HÓNAP</div>
                <div className={styles.statDetail}>Március – Augusztus</div>
              </div>
            </div>
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
