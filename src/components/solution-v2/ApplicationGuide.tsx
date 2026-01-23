'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
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
    subtitle: 'Őszi szántás után tavaszi ásógép',
    icon: <Combine size={32} />,
    when: 'Ősszel nagy tömegű szármaradvány vagy szervestrágya',
    soilType: 'Bármely talajtípus',
    rating: 5,
    isBest: false,
    color: '#5A7A8B'
  }
]

// Separate card component with hover state for micro-interactions
function CardWithHover({
  mode,
  cardVariants,
  isInView
}: {
  mode: ApplicationMode
  cardVariants: any
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.15,
      rotate: [0, -8, 8, -4, 4, 0],
      transition: {
        scale: { duration: 0.3, ease: 'easeOut' },
        rotate: { duration: 0.6, ease: 'easeInOut' }
      }
    }
  }

  const glowVariants = {
    idle: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: [0, 0.6, 0.3],
      scale: [0.8, 1.4, 1.2],
      transition: { duration: 0.5 }
    }
  }

  const infoItemVariants = {
    idle: { x: 0, opacity: 1 },
    hover: (i: number) => ({
      x: 4,
      opacity: 1,
      transition: { delay: i * 0.05, duration: 0.2 }
    })
  }

  const starHoverVariants = {
    idle: { scale: 1, y: 0 },
    hover: (i: number) => ({
      scale: [1, 1.3, 1],
      y: [0, -3, 0],
      transition: {
        delay: i * 0.08,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  }

  const shimmerVariants = {
    idle: { x: '-100%', opacity: 0 },
    hover: {
      x: '200%',
      opacity: [0, 0.3, 0],
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  }

  const ctaVariants = {
    idle: { opacity: 0, y: 20 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.article
      className={`${styles.card} ${mode.isBest ? styles.bestCard : ''}`}
      variants={cardVariants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -12,
        boxShadow: `0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px ${mode.isBest ? 'var(--color-gold)' : 'rgba(255,255,255,0.15)'}`,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className={styles.shimmer}
        variants={shimmerVariants}
        initial="idle"
        animate={isHovered ? "hover" : "idle"}
      />

      {/* Best badge */}
      {mode.isBest && (
        <motion.div
          className={styles.bestBadge}
          initial={{ scale: 0, rotate: -10 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.8, type: 'spring', stiffness: 400 }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.span
            animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Star size={14} fill="currentColor" />
          </motion.span>
          <span>LEGJOBB</span>
        </motion.div>
      )}

      {/* Icon with glow effect */}
      <div className={styles.iconContainer}>
        {/* Glow behind icon */}
        <motion.div
          className={styles.iconGlow}
          style={{ backgroundColor: mode.color }}
          variants={glowVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
        />
        <motion.div
          className={styles.iconWrapper}
          style={{ backgroundColor: `${mode.color}20`, borderColor: `${mode.color}40` }}
          variants={iconVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
        >
          <motion.span
            style={{ color: mode.color }}
            animate={isHovered ? {
              filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
            } : {}}
            transition={{ duration: 0.4 }}
          >
            {mode.icon}
          </motion.span>
        </motion.div>
      </div>

      {/* Title with subtle animation */}
      <motion.h3
        className={styles.cardTitle}
        animate={isHovered ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {mode.title}
      </motion.h3>
      <motion.p
        className={styles.cardSubtitle}
        animate={isHovered ? { opacity: 0.8 } : { opacity: 0.5 }}
        transition={{ duration: 0.2 }}
      >
        {mode.subtitle}
      </motion.p>

      {/* Info rows with staggered animation */}
      <div className={styles.infoGrid}>
        {[
          { label: 'Mikor ajánlott?', value: mode.when },
          { label: 'Milyen talajra?', value: mode.soilType }
        ].map((info, i) => (
          <motion.div
            key={info.label}
            className={styles.infoItem}
            variants={infoItemVariants}
            custom={i}
            initial="idle"
            animate={isHovered ? "hover" : "idle"}
          >
            <span className={styles.infoLabel}>{info.label}</span>
            <motion.span
              className={styles.infoValue}
              animate={isHovered ? { color: 'rgba(255, 255, 255, 1)' } : { color: 'rgba(255, 255, 255, 0.85)' }}
            >
              {info.value}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Rating with bouncing stars on hover */}
      <div className={styles.ratingRow}>
        <span className={styles.ratingLabel}>Szerkezet tartossága</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + star * 0.1 }}
            >
              <motion.span
                variants={starHoverVariants}
                custom={star}
                initial="idle"
                animate={isHovered && star <= mode.rating ? "hover" : "idle"}
                style={{ display: 'inline-block' }}
              >
                <Star
                  size={16}
                  className={star <= mode.rating ? styles.starFilled : styles.starEmpty}
                  fill={star <= mode.rating ? 'currentColor' : 'none'}
                />
              </motion.span>
            </motion.span>
          ))}
        </div>
      </div>

      {/* Hover CTA sliding up */}
      <Link href="/kutatas?section=lakitelek" style={{ display: 'contents' }}>
        <motion.div
          className={styles.hoverCta}
          variants={ctaVariants}
          initial="idle"
          animate={isHovered ? "hover" : "idle"}
        >
          <span>Lásd a kísérletben</span>
          <motion.span
            animate={isHovered ? { x: [0, 4, 0] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
          >
            <ChevronRight size={16} />
          </motion.span>
        </motion.div>
      </Link>
    </motion.article>
  )
}

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
          <CardWithHover key={mode.id} mode={mode} cardVariants={cardVariants} isInView={isInView} />
        ))}
      </motion.div>


    </section>
  )
}
