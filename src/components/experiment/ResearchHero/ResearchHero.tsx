'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Gauge, Info } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import HungaryMap from './HungaryMap'
import styles from './ResearchHero.module.css'

interface ResearchHeroProps {
  onLocationClick?: (locationId: string) => void
}

export default function ResearchHero({ onLocationClick }: ResearchHeroProps) {
  const heroRef = useRef(null)
  const isInView = useInView(heroRef, { once: true, margin: '-100px' })
  const [showPenetrometer, setShowPenetrometer] = useState(false)

  return (
    <div className={styles.hero} ref={heroRef}>
      <div className={styles.heroContent}>
        {/* Left column - Text content */}
        <div className={styles.heroText}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <PageBadge label="A KUTATÁS" />
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            Szántóföldi talajszerkezet<br />
            <span className={styles.titleAccent}>vizsgálatok</span>
          </motion.h1>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Három helyszínen, 9 különböző művelési kombinációval,
            négy hónapon át mértük a talajszerkezet változását —{' '}
            <em>az eredmények egyértelműek.</em>
          </motion.p>

          {/* Penetrometer Info - Hover Trigger */}
          <motion.div
            className={styles.penetrometerTrigger}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            onMouseEnter={() => setShowPenetrometer(true)}
            onMouseLeave={() => setShowPenetrometer(false)}
          >
            <div className={styles.triggerIcon}>
              <Gauge size={20} />
            </div>
            <span className={styles.triggerText}>A penetrométeres mérés</span>
            <Info size={14} className={styles.triggerInfo} />

            {/* Popup on hover */}
            <AnimatePresence>
              {showPenetrometer && (
                <motion.div
                  className={styles.penetrometerPopup}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.popupHeader}>
                    <div className={styles.popupIconWrapper}>
                      <Gauge size={32} />
                    </div>
                    <div>
                      <h4 className={styles.popupTitle}>A penetrométeres mérés</h4>
                      <span className={styles.popupBadge}>Módszertan</span>
                    </div>
                  </div>
                  
                  <p className={styles.popupText}>
                    A készülék acél szondatüskéjét kézi erővel, függőlegesen a talajba szúrjuk, egyenletesen haladva.
                    A fogantyú közepén elhelyezett manométer mutatja a talaj ellenállását a szonda csúcsánál,
                    lent, az adott mélységben. A talaj szerkezete <strong>20 bar nyomásig</strong> tekinthető optimálisnak,
                    tömörödésmentesnek.
                  </p>

                  <div className={styles.popupImagePlaceholder}>
                    <Gauge size={40} strokeWidth={1.5} />
                    <span>Penetrométer</span>
                    <span className={styles.placeholderSub}>Kép helye</span>
                  </div>

                  <div className={styles.scaleBar}>
                    <div className={styles.scaleOptimal}>
                      <span>Optimális</span>
                      <span className={styles.scaleValue}>0-20 bar</span>
                    </div>
                    <div className={styles.scaleCompacted}>
                      <span>Tömörödött</span>
                      <span className={styles.scaleValue}>&gt;20 bar</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right column - Map */}
        <motion.div
          className={styles.heroMap}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <HungaryMap onLocationClick={onLocationClick} />
        </motion.div>
      </div>
    </div>
  )
}
