'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { benefits } from '@/lib/data'
import TiltCard from '@/components/ui/TiltCard'
import styles from './BenefitsGrid.module.css'
import { Check } from 'lucide-react'

export default function BenefitsGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Technológiai Előnyök</h3>
        <span className={styles.badge}>AGRONOMY 2.0</span>
      </div>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <TiltCard
              tiltAmount={10}
              glowColor="rgba(212, 168, 75, 0.15)"
              scale={1.03}
              className={styles.card}
            >
              <div 
                className={styles.cardInner}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={styles.cardHeader}>
                  <motion.div
                    className={styles.iconWrapper}
                    animate={hoveredIndex === index ? {
                      rotate: 360,
                      scale: 1.2,
                      backgroundColor: 'var(--color-gold)'
                    } : {
                      rotate: 0,
                      scale: 1,
                      backgroundColor: 'rgba(212, 168, 75, 0.15)'
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Check size={16} className={styles.cardIcon} />
                  </motion.div>
                  <span className={styles.benefitNumber}>BENEFIT_0{index + 1}</span>
                </div>
                <h4 className={styles.cardTitle}>{benefit.title}</h4>
                <p className={styles.cardDescription}>{benefit.description}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
