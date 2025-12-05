'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Activity, Leaf, Thermometer, AlertTriangle } from 'lucide-react'
import SoilComparison from '@/components/problem/SoilComparison'
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

  // Severity levels for progress bars
  const severityLevels = [90, 75, 65, 55]

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div 
        className={styles.centeredTextBlock}
        variants={textRevealVariants}
      >
        <motion.p className={styles.subTitle}>
          A hagyományos szántás rövid távon megoldásnak tűnik, de valójában egy{' '}
          <motion.strong
            style={{ 
              display: 'inline-block',
              background: 'linear-gradient(135deg, var(--color-gold), #D4AF37)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            ördögi kört
          </motion.strong>{' '}
          tart fenn. A forgatás tönkreteszi azt, amit védeni kellene.
        </motion.p>
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
                    color: hoveredCard === index ? 'var(--color-earth-900)' : 'var(--color-earth-800)' 
                  }}
                >
                  {problem.title}
                </motion.h3>
                
                <p className={styles.cardDesc}>{problem.description}</p>

                {/* Severity progress bar */}
                <motion.div
                  style={{
                    marginTop: '1.25rem',
                    height: 4,
                    background: 'var(--color-earth-100)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-gold), var(--color-warning, #E57373))',
                      borderRadius: 2,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${severityLevels[index]}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className={styles.comparisonWrapper}
        variants={itemVariants}
      >
        <motion.div 
          className={styles.comparisonCard}
          whileHover={{ 
            boxShadow: '0 30px 60px -20px rgba(0,0,0,0.12)',
          }}
          transition={{ duration: 0.4 }}
        >
          <SoilComparison />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
