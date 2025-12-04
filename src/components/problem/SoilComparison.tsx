'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './SoilComparison.module.css'

export default function SoilComparison() {
  const [hoveredSide, setHoveredSide] = useState<'bad' | 'good' | null>(null)
  const [hoveredProblem, setHoveredProblem] = useState<number | null>(null)
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)

  const problems = [
    'Eketalp akadályozza a gyökereket',
    'Víz nem jut mélyebb rétegekbe',
    'Talajélet károsodik'
  ]

  const benefits = [
    'Nincs tömör réteg',
    'Víz egyenletesen oszlik el',
    'Talajélet megmarad'
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h3 
        className={styles.title}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        Talajszelvény Összehasonlítás
      </motion.h3>
      <motion.p 
        className={styles.subtitle}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Szántott vs. ásógépezett talaj szerkezete
      </motion.p>
      
      <div className={styles.comparison}>
        {/* Szántott talaj */}
        <motion.div 
          className={styles.side}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onHoverStart={() => setHoveredSide('bad')}
          onHoverEnd={() => setHoveredSide(null)}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 40px -10px rgba(183, 28, 28, 0.15)',
          }}
        >
          <div className={styles.label}>
            <motion.span 
              className={styles.labelBad}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Szántott talaj
            </motion.span>
          </div>
          <div className={styles.soilProfile}>
            <div className={styles.placeholder}>
              <motion.div 
                className={styles.layer} 
                style={{ height: '25%', background: 'linear-gradient(180deg, #8B7355 0%, #6B5344 100%)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <span className={styles.layerLabel}>Művelt réteg</span>
                <span className={styles.layerDepth}>0-25 cm</span>
              </motion.div>
              
              {/* Animated Eketalp layer */}
              <motion.div 
                className={styles.compactedLayer}
                animate={{ 
                  boxShadow: hoveredSide === 'bad' 
                    ? '0 0 20px rgba(183, 28, 28, 0.5)' 
                    : '0 0 0px rgba(183, 28, 28, 0)'
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.span 
                  className={styles.compactedLabel}
                  animate={{ 
                    scale: hoveredSide === 'bad' ? [1, 1.05, 1] : 1 
                  }}
                  transition={{ duration: 0.5, repeat: hoveredSide === 'bad' ? Infinity : 0 }}
                >
                  ⚠️ EKETALP
                </motion.span>
                <span className={styles.compactedNote}>20+ bar nyomás</span>
              </motion.div>
              
              <motion.div 
                className={styles.layer} 
                style={{ height: '60%', background: 'linear-gradient(180deg, #5D4037 0%, #4E342E 100%)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <span className={styles.layerLabel}>Tömör altalaj</span>
                <span className={styles.layerDepth}>30+ cm</span>
                <motion.div 
                  className={styles.blockedRoots}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>↓ Gyökerek nem jutnak át</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className={styles.problems}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {problems.map((problem, index) => (
              <motion.div 
                key={index}
                className={styles.problemItem}
                variants={itemVariants}
                onHoverStart={() => setHoveredProblem(index)}
                onHoverEnd={() => setHoveredProblem(null)}
                whileHover={{ 
                  x: 4,
                  background: 'rgba(198, 40, 40, 0.15)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <motion.span
                  animate={{ 
                    scale: hoveredProblem === index ? 1.2 : 1,
                    rotate: hoveredProblem === index ? -10 : 0,
                  }}
                  style={{ display: 'inline-block', marginRight: '0.5rem' }}
                >
                  ❌
                </motion.span>
                {problem}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* VS divider */}
        <div className={styles.divider}>
          <motion.span 
            className={styles.vs}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15,
              delay: 0.4 
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 10,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            VS
          </motion.span>
        </div>

        {/* Ásógépezett talaj */}
        <motion.div 
          className={styles.side}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onHoverStart={() => setHoveredSide('good')}
          onHoverEnd={() => setHoveredSide(null)}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 40px -10px rgba(76, 175, 80, 0.15)',
          }}
        >
          <div className={styles.label}>
            <motion.span 
              className={styles.labelGood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ásógépezett talaj
            </motion.span>
          </div>
          <div className={styles.soilProfile}>
            <div className={styles.placeholder}>
              <motion.div 
                className={styles.layer} 
                style={{ height: '100%', background: 'linear-gradient(180deg, #8B7355 0%, #6D5C4D 50%, #5D4F42 100%)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <span className={styles.layerLabel}>Egyenletesen lazított</span>
                <span className={styles.layerDepth}>0-45 cm</span>
                <motion.div 
                  className={styles.healthyRoots}
                  animate={{ 
                    y: hoveredSide === 'good' ? [0, -3, 0] : 0 
                  }}
                  transition={{ duration: 1.5, repeat: hoveredSide === 'good' ? Infinity : 0 }}
                >
                  <span>✓ Gyökerek szabadon fejlődnek</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className={styles.benefits}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className={styles.benefitItem}
                variants={itemVariants}
                onHoverStart={() => setHoveredBenefit(index)}
                onHoverEnd={() => setHoveredBenefit(null)}
                whileHover={{ 
                  x: 4,
                  background: 'rgba(76, 175, 80, 0.15)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <motion.span
                  animate={{ 
                    scale: hoveredBenefit === index ? 1.2 : 1,
                    rotate: hoveredBenefit === index ? 10 : 0,
                  }}
                  style={{ display: 'inline-block', marginRight: '0.5rem' }}
                >
                  ✅
                </motion.span>
                {benefit}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className={styles.caption}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <strong>Forrás:</strong> Szakdolgozat 13. ábra, 32. oldal — Penetrométeres mérések alapján
      </motion.div>
    </motion.div>
  )
}
