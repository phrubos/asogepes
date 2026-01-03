'use client'

import { motion } from 'framer-motion'
import styles from './SoilHero.module.css'

interface HeroContentProps {
  isLoaded: boolean
}

export default function HeroContent({ isLoaded }: HeroContentProps) {
  // Text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.8,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Character stagger for headline
  const headlineText = 'Miért veszítjük el a gyökértömeget?'
  const words = headlineText.split(' ')

  return (
    <motion.div
      className={styles.heroContent}
      initial={{ opacity: 0, x: -50 }}
      animate={isLoaded ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 1.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Section indicator */}
      <motion.div
        className={styles.sectionIndicator}
        initial={{ opacity: 0, y: 10 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.9, duration: 0.4 }}
      >
        <span className={styles.sectionNumber}>01</span>
        <span className={styles.sectionDot} />
        <span className={styles.sectionLabel}>A Probléma</span>
      </motion.div>

      {/* Headline with word-by-word animation */}
      <motion.h1
        className={styles.heroHeadline}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? 'visible' : 'hidden'}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={styles.headlineWord}
            variants={itemVariants}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
          >
            {word}
            {/* Line break after certain words for better layout */}
            {(i === 2 || i === 4) && <br />}
          </motion.span>
        ))}
      </motion.h1>

      {/* Description */}
      <motion.p
        className={styles.heroDescription}
        initial={{ opacity: 0, y: 15 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.3, duration: 0.5 }}
      >
        Az intenzív öntözés láthatatlanul teszi tönkre a talajszerkezetet,
        homok és vályog talajon egyaránt. <strong>Három fő ellenséggel</strong> küzdünk.
      </motion.p>

      {/* Stats/highlights */}
      <motion.div
        className={styles.heroStats}
        initial={{ opacity: 0, y: 15 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <div className={styles.statItem}>
          <span className={styles.statNumber}>350+</span>
          <span className={styles.statLabel}>mm öntözés/szezon</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNumber}>30</span>
          <span className={styles.statLabel}>nap alatt kritikus</span>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 2.7, duration: 0.5 }}
      >
        <motion.div
          className={styles.scrollArrowContainer}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M10 16L5 11M10 16L15 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <span>Görgess a felfedezéshez</span>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className={styles.heroDecoration}
        initial={{ scaleY: 0 }}
        animate={isLoaded ? { scaleY: 1 } : {}}
        transition={{ delay: 2.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}
