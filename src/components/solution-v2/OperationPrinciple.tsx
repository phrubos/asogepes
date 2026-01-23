'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowDown, Sprout } from 'lucide-react'
import styles from './OperationPrinciple.module.css'

interface FeatureItem {
  icon: React.ReactNode
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: <ArrowDown size={24} />,
    title: 'Függőleges lazítás',
    description: 'Az ásókanalak mélyen belemerülnek a talajba, fellazítják és sekélyen átkeverik a talajfelszínt'
  },
  {
    icon: <Sprout size={24} />,
    title: 'Optimális magágy',
    description: 'Az elmunkáló henger egyenletes, vetésre vagy ültetésre kész felületet hagy'
  }
]

export default function OperationPrinciple() {
  const sectionRef = useRef<HTMLElement>(null)

  // Reuse existing animation variants...
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className={styles.badge}>MŰKÖDÉSI ELV</span>
        <h2 className={styles.title}>Hogyan működik a duplarotoros ásógép?</h2>
        <p className={styles.subtitle}>
          Az ásórotor lazít és átkever, a meghajtott elmunkáló henger aprómorzsás magágyat készít.
        </p>
      </motion.div>

      <div className={styles.content}>

        {/* Left Column: Features */}
        <motion.div
          className={styles.featuresGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              variants={itemVariants}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column: Animation */}
        <motion.div
          className={styles.animationWrapper}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <video
            src="/videos/Andornak.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={styles.video}
          />

          {/* Overlay Labels */}
          <div className={`${styles.overlayLabel} ${styles.labelLeft}`}>
            <div className={styles.labelDot} />
            <span>Ásórotor</span>
          </div>

          <div className={`${styles.overlayLabel} ${styles.labelRight}`}>
            <div className={styles.labelDot} />
            <span>Elmunkáló henger</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
