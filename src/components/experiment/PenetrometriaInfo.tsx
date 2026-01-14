'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Info, Gauge } from 'lucide-react'
import styles from './PenetrometriaInfo.module.css'

export default function PenetrometriaInfo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={containerRef}
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Gauge size={32} className={styles.icon} />
        </div>

        <div className={styles.textContent}>
          <div className={styles.header}>
            <h4 className={styles.title}>A penetrométeres mérés</h4>
            <div className={styles.badge}>
              <Info size={14} />
              <span>Módszertan</span>
            </div>
          </div>

          <p className={styles.description}>
            A készülék acél szondatüskéjét kézi erővel, függőlegesen a talajba szúrjuk, egyenletesen haladva.
            A fogantyú közepén elhelyezett manométer mutatja a talaj ellenállását a szonda csúcsánál,
            lent, az adott mélységben. A talaj szerkezete <strong>20 bar nyomásig</strong> tekinthető optimálisnak,
            tömörödésmentesnek.
          </p>
        </div>

        <div className={styles.imagePlaceholder}>
          <div className={styles.imageWrapper}>
            <img
              src="/images/penetrometer_premium.png"
              alt="Penetrométer"
              className={styles.image}
            />
          </div>
        </div>
      </div>

      {/* Scale indicator */}
      <motion.div
        className={styles.scaleIndicator}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
      >
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
    </motion.div>
  )
}
