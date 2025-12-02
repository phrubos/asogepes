'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import styles from './Hero.module.css'
import { heroStats } from '@/lib/data'

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBg}>
        <Image
          src="/images/hero-bg-final.png"
          alt="Ásógép munkában - kontrasztos mezőgazdasági tájkép"
          fill
          priority
          className={styles.heroImage}
          sizes="100vw"
        />
        <div className={styles.heroOverlay}></div>
      </div>
      <div className={styles.heroContent}>
        <motion.div
          className={styles.heroBadge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span>Neumann János Egyetem × Agroskill Kft.</span>
          <span className={styles.badgeYear}>2025</span>
        </motion.div>

        <h1 className={styles.heroTitle}>
          <motion.span
            className={styles.titleLine}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            A talaj nem
          </motion.span>
          <motion.span
            className={`${styles.titleLine} ${styles.titleAccent}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            végtelen erőforrás
          </motion.span>
        </h1>

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Tudományos kutatás a szántóföldi ásógép talajszerkezetre gyakorolt hatásáról öntözött kertészeti kultúrákban
        </motion.p>

        <motion.div
          className={styles.heroStats}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {heroStats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={styles.stat}
            >
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
              {stat.sublabel && (
                <span className={styles.statSublabel}>{stat.sublabel}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </header>
  )
}
