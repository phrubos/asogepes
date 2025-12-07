'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowDown, Layers } from 'lucide-react'
import styles from './OperationPrinciple.module.css'
import SpadeAnimation from './SpadeAnimation'

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: <ArrowDown size={28} />,
    title: 'Függőleges lazítás',
    description: 'Az ásókanalak mélyen belemerülnek a talajba és fellazítják'
  },
  {
    icon: <Layers size={28} />,
    title: 'Simított felszín',
    description: 'A henger egyenletes, vetésre kész felületet hagy'
  }
]

export default function OperationPrinciple() {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const featureVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.4 + i * 0.15,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }

  return (
    <section ref={sectionRef} id="operation-principle" className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.badge}>MŰKÖDÉSI ELV</span>
        <h2 className={styles.title}>Hogyan működik az ásógép?</h2>
        <p className={styles.subtitle}>
          Lazítás forgatás nélkül — a talajrétegek megőrzése
        </p>
      </motion.div>

      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Animation Area - New SpadeAnimation component */}
        <motion.div className={styles.animationWrapper} variants={itemVariants}>
          <SpadeAnimation />
        </motion.div>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              custom={index}
              variants={featureVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ 
                y: -6, 
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                borderColor: 'var(--color-gold)'
              }}
            >
              <motion.div 
                className={styles.featureIcon}
                whileHover={{
                  rotate: [0, -10, 10, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
