'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Activity, Leaf, Thermometer, AlertTriangle } from 'lucide-react'
import PloughingSoilComparison from '@/components/problem/PloughingSoilComparison'
import TiltCard from '@/components/ui/TiltCard'
import { ploughingProblems } from '@/lib/data'
import styles from './ProblemNew.module.css'

export default function PloughingView() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const iconMap: Record<string, JSX.Element> = {
    layers: <Layers size={24} />,
    activity: <Activity size={24} />,
    leaf: <Leaf size={24} />,
    thermometer: <Thermometer size={24} />,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: -12,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  }

  const badgeVariants = {
    idle: { scale: 1, y: 0 },
    hover: {
      scale: 1.1,
      y: -2,
      transition: { type: 'spring', stiffness: 400, damping: 15 }
    }
  }

  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Section Badge */}
      {/* Section Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}
      >
        <span className={styles.pillBadge}>Szántás korlátai</span>
      </motion.div>

      {/* Kiemelt idézet blokk */}
      <motion.div
        className={styles.quoteBlock}
        variants={textRevealVariants}
      >
        <motion.div
          className={styles.quoteIcon}
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 8C10 10.21 8.21 12 6 12C5.27 12 4.59 11.8 4 11.46V16C4 17.1 4.9 18 6 18H10V8ZM20 8C20 10.21 18.21 12 16 12C15.27 12 14.59 11.8 14 11.46V16C14 17.1 14.9 18 16 18H20V8Z" fill="currentColor" />
          </svg>
        </motion.div>
        <motion.blockquote className={styles.quoteText}>
          <span>A hagyományos szántás rövid távon megoldásnak tűnik, de valójában egy </span>
          <motion.strong
            className={styles.quoteHighlight}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            ördögi kört
          </motion.strong>
          <span> tart fenn.</span>
        </motion.blockquote>
        <motion.p className={styles.quoteSubtext}>
          A forgatás tönkreteszi azt, amit védeni kellene.
        </motion.p>
        <motion.div
          className={styles.quoteLine}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      <div className={styles.ploughGrid}>
        {ploughingProblems.map((problem, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <TiltCard
              tiltAmount={10}
              glowColor="rgba(212, 168, 75, 0.2)"
              scale={1.02}
              className={styles.consequenceCard}
            >
              <div
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ padding: 'var(--space-lg)', height: '100%', position: 'relative' }}
              >
                {/* Animated border glow on hover */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 4,
                    height: '100%',
                    background: 'linear-gradient(180deg, var(--color-gold), #D4AF37)',
                    transformOrigin: 'top',
                    borderRadius: '4px 0 0 4px',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: hoveredCard === index ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />

                <div className={styles.cardHeader}>
                  <motion.div
                    className={styles.cardIcon}
                    variants={iconVariants}
                    animate={hoveredCard === index ? 'hover' : 'idle'}
                    style={{ position: 'relative' }}
                  >
                    {/* Icon glow */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: -6,
                        background: 'var(--color-gold)',
                        borderRadius: 'var(--radius-md)',
                        filter: 'blur(10px)',
                        zIndex: -1,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === index ? 0.4 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    {iconMap[problem.icon] || <AlertTriangle size={24} />}
                  </motion.div>

                  <motion.div
                    className={styles.cardBadge}
                    variants={badgeVariants}
                    animate={hoveredCard === index ? 'hover' : 'idle'}
                    whileHover={{
                      background: 'var(--color-gold)',
                      color: 'white',
                    }}
                  >
                    {problem.dataBadge}
                  </motion.div>
                </div>

                <motion.h3
                  className={styles.cardTitle}
                  animate={{
                    color: 'var(--color-white)'
                  }}
                >
                  {problem.title}
                </motion.h3>

                <p className={styles.cardDesc}>{problem.description}</p>

              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Eke bevezető szekció */}
      <motion.div
        className={styles.ploughIntroSection}
        variants={itemVariants}
      >
        <div className={styles.ploughIntroGrid}>
          <motion.div
            className={styles.ploughImageWrapper}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img
              src="/images/eke.jpg"
              alt="American mouldboard eke"
              className={styles.ploughImage}
            />
            <div className={styles.ploughImageOverlay}>
              <span className={styles.ploughImageLabel}>American mouldboard</span>
            </div>
          </motion.div>

          <div className={styles.ploughIntroText}>
            <p className={styles.ploughIntroDesc}>
              A rögösebb és nehezebben elmunkálható talajfelszín megnehezíti a precíz magvetést és
              palántaültetést, ezen felül tavasszal lassabban és egyenetlenül melegszik fel az ilyen
              talajfelszín, lassítva a tavasszal vetett vagy ültetett kultúrnövények csírázását, kezdeti
              vegetatív fejlődését.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Új prémium talajszelvény összehasonlítás */}
      <motion.div variants={itemVariants}>
        <PloughingSoilComparison />
      </motion.div>
    </motion.div>
  )
}
