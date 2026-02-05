'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import HungaryMap from '../ResearchHero/HungaryMap'
import styles from './HeroPage.module.css'

import { useBookNav } from '../BookLayout/BookLayout'

// Mapping from map ID to page ID
const LOCATION_PAGE_MAP: Record<string, string> = {
  'szentkiraly': 'szentkiraly-info',
  'kecskemet': 'kecskemet-info',
  'lakitelek': 'lakitelek-info',
}

export default function HeroPage() {
  const { goToPage, pages } = useBookNav()

  const handleLocationClick = (locationId: string) => {
    const targetPageId = LOCATION_PAGE_MAP[locationId]
    if (targetPageId) {
      const pageIndex = pages.findIndex(p => p.id === targetPageId)
      if (pageIndex !== -1) {
        goToPage(pageIndex)
      }
    }
  }

  return (
    <div className={styles.heroPage}>
      <div className={styles.content}>
        {/* Left Column - Text */}
        <div className={styles.textColumn}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PageBadge label="A KUTATÁS" />
          </motion.div>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Szántóföldi talajszerkezet
            <span className={styles.titleAccent}>vizsgálatok</span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Három helyszínen, 9 különböző művelési kombinációval,
            hat hónapon át mértük a talajszerkezet változását.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
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
          </motion.div>
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
