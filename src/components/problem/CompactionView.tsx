'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplet, Weight, Layers } from 'lucide-react'
import InteractiveSoil from '@/components/problem/InteractiveSoil'
import { problemStatistics, compactionChallenges } from '@/lib/data'
import styles from './ProblemNew.module.css'

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: string, suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {value}{suffix}
    </motion.span>
  )
}

// Animated water drops for stat card
function WaterDropAnimation() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 20, 
      right: 20, 
      width: 80, 
      height: 100,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${20 + i * 25}%`,
            width: 8,
            height: 12,
            background: 'linear-gradient(180deg, rgba(107, 139, 94, 0.6), rgba(107, 139, 94, 0.2))',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          }}
          animate={{
            y: [0, 80],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

export default function CompactionView() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const iconMap: Record<string, JSX.Element> = {
    droplet: <Droplet size={24} />,
    weight: <Weight size={24} />,
    layers: <Layers size={24} />,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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
      scale: 1.1, 
      rotate: -10,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  }

  return (
    <motion.div 
      className={styles.gridContainer}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className={styles.leftColumn}>
        <motion.div 
          className={styles.statCard}
          variants={itemVariants}
          whileHover={{ 
            boxShadow: '0 25px 50px -15px rgba(0,0,0,0.12)',
          }}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Water drop animation inside card */}
          <WaterDropAnimation />
          
          {/* Animated gradient bar */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, var(--color-green-light), var(--color-green))',
              transformOrigin: 'left',
              borderRadius: '6px 6px 0 0',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          
          <div className={styles.mainStat}>
            <AnimatedCounter 
              value={`${problemStatistics.irrigation.min}-${problemStatistics.irrigation.max}`} 
            />
            <motion.span 
              className={styles.statUnit}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {problemStatistics.irrigation.unit}
            </motion.span>
          </div>
          <motion.div 
            className={styles.statDescription}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {problemStatistics.irrigation.label} évente. Ennyi vizet kell a talajnak elnyelnie és megtartania szerkezetromlás nélkül.
          </motion.div>
        </motion.div>

        <div className={styles.challengesList}>
          {compactionChallenges.map((challenge, index) => (
            <motion.div 
              key={index} 
              className={styles.challengeItem}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ 
                y: -6,
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
                borderColor: 'var(--color-green-light)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div 
                className={styles.iconBox}
                variants={iconVariants}
                animate={hoveredIndex === index ? 'hover' : 'idle'}
                style={{ 
                  background: hoveredIndex === index 
                    ? 'linear-gradient(135deg, var(--color-green-light), var(--color-green))' 
                    : 'var(--color-cream)',
                  color: hoveredIndex === index ? '#ffffff' : 'var(--color-green)',
                }}
                transition={{ duration: 0.3 }}
              >
                {iconMap[challenge.icon]}
              </motion.div>
              <div className={styles.itemContent}>
                <motion.h3
                  animate={{ 
                    color: hoveredIndex === index ? 'var(--color-green-dark)' : 'var(--color-earth-900)' 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {challenge.title}
                </motion.h3>
                <p>{challenge.description}</p>
                
                {/* Data badge with micro-animation */}
                {challenge.data && (
                  <motion.span
                    style={{
                      display: 'inline-block',
                      marginTop: '0.75rem',
                      padding: '0.25rem 0.75rem',
                      background: 'var(--color-earth-50)',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-earth-600)',
                    }}
                    whileHover={{ 
                      background: 'var(--color-green-light)',
                      color: 'var(--color-green-dark)',
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {challenge.data}
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.rightColumn}>
        <motion.div 
          className={styles.interactiveWrapper}
          variants={itemVariants}
        >
          <motion.div 
            className={styles.interactiveCard}
            whileHover={{ 
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.15)',
            }}
            transition={{ duration: 0.3 }}
          >
            <InteractiveSoil />
            <motion.p 
              className={styles.interactiveCaption}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ↔
              </motion.span>
              {' '}Kattints a gombra az állapotváltáshoz
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
