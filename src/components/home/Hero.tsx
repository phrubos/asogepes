'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './Hero.module.css'
import { heroStats } from '@/lib/data'

export default function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBg}>
        <div className={styles.heroGrain}></div>
        <div className={styles.heroGradient}></div>
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
            <div key={index} className={styles.stat}>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href="/problema" className={styles.heroScroll}>
            <span>Görgess lejjebb</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </header>
  )
}
