'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, MapPin, Calendar, Beaker } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import MagneticButton from '@/components/ui/MagneticButton'
import LocationTabs from './LocationTabs'
import styles from './ResearchNew.module.css'

// Kutatás statisztikák
const researchStats = [
  { value: 3, label: 'Helyszín', sublabel: 'Szentkirály · Kecskemét · Lakitelek', icon: MapPin },
  { value: 7, label: 'Kezelés', sublabel: 'Különböző művelési kombinációk', icon: Beaker },
  { value: 4, label: 'Hónap', sublabel: 'Március – Augusztus', icon: Calendar },
]

// Animációs variánsok
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function ResearchLayout() {
  const router = useRouter()
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  return (
    <section className={styles.sectionResearch}>
      <div className="container">
        {/* Hero */}
        <div className={styles.hero} ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader number="03" title="A Kutatás" />
          </motion.div>

          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Tudományos igényességgel vizsgáltuk<br />
            <span className={styles.heroAccent}>az ásógép hatását</span>
          </motion.h1>

          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Három helyszínen, hét különböző kezelési móddal, négy hónapon át mértük 
            a talajszerkezet változását — az eredmények egyértelműek.
          </motion.p>

          {/* Statisztika kártyák */}
          <motion.div 
            className={styles.statsGrid}
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
          >
            {researchStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className={styles.statCard}
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.statIcon}>
                    <IconComponent size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <AnimatedNumber 
                      value={stat.value} 
                      className={styles.statNumber}
                      duration={1500}
                      delay={index * 150}
                    />
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span className={styles.statSublabel}>{stat.sublabel}</span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Helyszínek szekció cím */}
        <motion.div 
          className={styles.locationsSectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>Helyszínek</span>
          <h2 className={styles.sectionTitle}>Válassz egy helyszínt a részletekért</h2>
        </motion.div>

        {/* Location Tabs - meglévő komponens */}
        <LocationTabs />

        {/* Átvezető CTA */}
        <motion.div 
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.ctaText}>
            Mit mutatnak az adatok összességében?
          </p>
          <MagneticButton
            variant="primary"
            size="lg"
            showRipple
            showShine
            ariaLabel="Tovább az Eredményekre"
            onClick={() => router.push('/eredmenyek')}
          >
            Tekintsd meg az eredményeket <ArrowRight size={20} />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
