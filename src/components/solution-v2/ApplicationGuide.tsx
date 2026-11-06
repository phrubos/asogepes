'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, type Variants } from 'framer-motion'
import { Shovel, Layers, Combine, Star, ChevronRight, ChevronsDown } from 'lucide-react'
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
    title: 'Ásógép',
    subtitle: 'Csak ásógép, más eszköz nélkül',
    icon: <Shovel size={32} />,
    when: 'Első alkalmazás, jó szerkezetű talaj',
    soilType: 'Laza szerkezetű talajok',
    rating: 4,
    isBest: false,
    color: '#8B7355'
  },
  {
    id: 'with-loosening',
    title: 'Lazítás + Ásógép',
    subtitle: 'Mélylazítás után ásógép',
    icon: <Layers size={32} />,
    when: 'Tömör, eketalpas talaj',
    soilType: 'Középkötött, kötött talajok',
    rating: 3,
    isBest: false,
    color: '#6B8B6B'
  },
  {
    id: 'deep-spading',
    title: 'Mélyásógép',
    subtitle: 'Csak mélyásógép, más eszköz nélkül',
    icon: <ChevronsDown size={32} />,
    when: 'Intenzíven öntözött, nagy gyökértömegű kultúrák',
    soilType: 'Középkötött, kötött talaj',
    rating: 5,
    isBest: false,
    color: '#CD853F'
  },
  {
    id: 'with-ploughing',
    title: 'Lazítás + Szántás + Ásógép',
    subtitle: 'Lazítás és őszi szántás után tavaszi ásógép',
    icon: <Combine size={32} />,
    when: 'Ősszel nagy tömegű szármaradvány vagy szervestrágya',
    soilType: 'Bármely talajtípus',
    rating: 5,
    isBest: false,
    color: '#5A7A8B'
  }
]

// One card per application mode. Hover is a 3px lift + shadow (CSS); the "see it in the trial" link
// is always visible, so nothing the reader needs is hidden behind hover.
function ModeCard({
  mode,
  cardVariants,
  isInView
}: {
  mode: ApplicationMode
  cardVariants: Variants
  isInView: boolean
}) {
  return (
    <motion.article
      className={`${styles.card} ${mode.isBest ? styles.bestCard : ''}`}
      variants={cardVariants}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
    >
      {mode.isBest && (
        <motion.div
          className={styles.bestBadge}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <Star size={14} fill="currentColor" aria-hidden="true" />
          <span>LEGJOBB</span>
        </motion.div>
      )}

      <div className={styles.iconContainer}>
        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: `${mode.color}20`, borderColor: `${mode.color}40`, color: mode.color }}
        >
          {mode.icon}
        </div>
      </div>

      <h3 className={styles.cardTitle}>{mode.title}</h3>
      <p className={styles.cardSubtitle}>{mode.subtitle}</p>

      <div className={styles.infoGrid}>
        {[
          { label: 'Mikor ajánlott?', value: mode.when },
          { label: 'Milyen talajra?', value: mode.soilType }
        ].map((info) => (
          <div key={info.label} className={styles.infoItem}>
            <span className={styles.infoLabel}>{info.label}</span>
            <span className={styles.infoValue}>{info.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.ratingLabel}>Szerkezet tartossága</span>
        <div className={styles.stars} role="img" aria-label={`${mode.rating} / 5`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              aria-hidden="true"
              className={star <= mode.rating ? styles.starFilled : styles.starEmpty}
              fill={star <= mode.rating ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      </div>

      <Link href="/kutatas?section=lakitelek" className={styles.cta}>
        <span>Lásd a kísérletben</span>
        <ChevronRight size={16} aria-hidden="true" />
      </Link>
    </motion.article>
  )
}

export default function ApplicationGuide() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // The four cards arrive together: they are alternatives, not a sequence
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <section ref={sectionRef} className={styles.section}>
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
          <ModeCard key={mode.id} mode={mode} cardVariants={cardVariants} isInView={isInView} />
        ))}
      </motion.div>


    </section>
  )
}
