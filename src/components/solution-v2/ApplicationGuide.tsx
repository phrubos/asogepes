'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shovel, Layers, Combine, Star, ChevronRight } from 'lucide-react'
import styles from './ApplicationGuide.module.css'

interface ApplicationMode {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  when: string
  soilType: string
  rating: number
  isBest: boolean
  color: string
}

const applicationModes: ApplicationMode[] = [
  {
    id: 'solo',
    title: 'Önálló ásógép',
    subtitle: 'Csak ásógép, más eszköz nélkül',
    icon: <Shovel size={32} />,
    when: 'Első alkalmazás, jó szerkezetű talaj',
    soilType: 'Homokos, lazább talajok',
    rating: 4,
    isBest: false,
    color: '#8B7355'
  },
  {
    id: 'with-loosening',
    title: 'Lazítás + Ásógép',
    subtitle: 'Előzetes mélylazítás után ásógép',
    icon: <Layers size={32} />,
    when: 'Nagyon tömör, mély eketalpas talaj',
    soilType: 'Kötött, agyagos talajok',
    rating: 3,
    isBest: false,
    color: '#6B8B6B'
  },
  {
    id: 'with-ploughing',
    title: 'Szántás + Ásógép',
    subtitle: 'Őszi szántás után tavaszi ásógép',
    icon: <Combine size={32} />,
    when: 'Hagyományos gazdálkodásba illeszkedve',
    soilType: 'Bármely talajtípus',
    rating: 5,
    isBest: true,
    color: '#5A7A8B'
  }
]

export default function ApplicationGuide() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <section ref={sectionRef} id="application-guide" className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.badge}>ALKALMAZÁSI ÚTMUTATÓ</span>
        <h2 className={styles.title}>Melyik módszert válasszam?</h2>
        <p className={styles.subtitle}>
          Az ásógép önállóan és más művelőeszközökkel kombinálva is használható — 
          a talaj állapota határozza meg a legjobb stratégiát.
        </p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {applicationModes.map((mode) => (
          <motion.article
            key={mode.id}
            className={`${styles.card} ${mode.isBest ? styles.bestCard : ''}`}
            variants={cardVariants}
            whileHover={{ 
              y: -12, 
              boxShadow: `0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px ${mode.isBest ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {/* Best badge */}
            {mode.isBest && (
              <motion.div
                className={styles.bestBadge}
                initial={{ scale: 0, rotate: -10 }}
                animate={isInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ delay: 0.8, type: 'spring', stiffness: 400 }}
              >
                <Star size={14} fill="currentColor" />
                <span>LEGJOBB</span>
              </motion.div>
            )}

            {/* Icon */}
            <motion.div 
              className={styles.iconWrapper}
              style={{ backgroundColor: `${mode.color}20`, borderColor: `${mode.color}40` }}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <span style={{ color: mode.color }}>{mode.icon}</span>
            </motion.div>

            {/* Title */}
            <h3 className={styles.cardTitle}>{mode.title}</h3>
            <p className={styles.cardSubtitle}>{mode.subtitle}</p>

            {/* Info rows */}
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Mikor ajánlott?</span>
                <span className={styles.infoValue}>{mode.when}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ideális talaj</span>
                <span className={styles.infoValue}>{mode.soilType}</span>
              </div>
            </div>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <span className={styles.ratingLabel}>Stabilitás</span>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.span
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + star * 0.1 }}
                  >
                    <Star
                      size={16}
                      className={star <= mode.rating ? styles.starFilled : styles.starEmpty}
                      fill={star <= mode.rating ? 'currentColor' : 'none'}
                    />
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Hover CTA */}
            <motion.div 
              className={styles.hoverCta}
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              <span>Lásd a kísérletben</span>
              <ChevronRight size={16} />
            </motion.div>
          </motion.article>
        ))}
      </motion.div>

      {/* Conclusion */}
      <motion.div
        className={styles.conclusion}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className={styles.conclusionIcon}>💡</div>
        <p className={styles.conclusionText}>
          <strong>Tipp:</strong> A <em>szántás + ásógép</em> kombináció adta a legstabilabb szerkezetet 
          a kísérleteink során — de az önálló ásógép is kiváló választás jó szerkezetű talajokon.
        </p>
      </motion.div>
    </section>
  )
}
