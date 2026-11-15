'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Sprout } from 'lucide-react'
import styles from './OperationPrinciple.module.css'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TEXT = bilingual(
  {
    features: [
      { title: 'Függőleges lazítás', description: 'Az ásókanalak mélyen belemerülnek a talajba, fellazítják és sekélyen átkeverik a talajfelszínt' },
      { title: 'Optimális magágy', description: 'Az elmunkáló henger egyenletes, vetésre vagy ültetésre kész felületet hagy' },
    ],
    badge: 'MŰKÖDÉSI ELV',
    title: 'Hogyan működik a duplarotoros ásógép?',
    subtitle: 'Az ásórotor lazít és átkever, a meghajtott elmunkáló henger aprómorzsás magágyat készít.',
    rotor: 'Ásórotor',
    roller: 'Elmunkáló henger',
  },
  {
    features: [
      { title: 'Vertical loosening', description: 'The spades dig deep into the soil, loosen it and mix the topsoil to a shallow depth' },
      { title: 'An ideal seedbed', description: 'The finishing roller leaves an even surface, ready for sowing or planting' },
    ],
    badge: 'OPERATING PRINCIPLE',
    title: 'How does the twin-rotor spading machine work?',
    subtitle: 'The spading rotor loosens and mixes the soil; the driven finishing roller prepares a fine, crumbly seedbed.',
    rotor: 'Spading rotor',
    roller: 'Finishing roller',
  },
)

interface FeatureItem {
  icon: React.ReactNode
}

const features: FeatureItem[] = [
  {
    icon: <ArrowDown size={24} />
  },
  {
    icon: <Sprout size={24} />
  }
]

export default function OperationPrinciple() {
  const t = TEXT[useLocale()]
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  // Load and play the loop only while it is on screen; with reduced motion the viewer starts it
  useEffect(() => {
    const video = videoRef.current
    if (!video || reduced) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.25 })
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [reduced])

  // Reuse existing animation variants...
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
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
        <span className={styles.badge}>{t.badge}</span>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.subtitle}>
          {t.subtitle}
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
              key={index}
              className={styles.featureCard}
              variants={itemVariants}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{t.features[index].title}</h3>
                <p className={styles.featureDescription}>{t.features[index].description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column: Animation */}
        <motion.div
          className={`${styles.animationWrapper} ${reduced ? styles.withControls : ''}`}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <video
            ref={videoRef}
            src="/videos/Andornak.mp4"
            poster="/images/andornak-poster.webp"
            width={1920}
            height={1080}
            loop
            muted
            playsInline
            preload="none"
            controls={reduced}
            className={styles.video}
          />

          {/* Overlay Labels */}
          <div className={`${styles.overlayLabel} ${styles.labelLeft}`}>
            <div className={styles.labelDot} />
            <span>{t.rotor}</span>
          </div>

          <div className={`${styles.overlayLabel} ${styles.labelRight}`}>
            <div className={styles.labelDot} />
            <span>{t.roller}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
