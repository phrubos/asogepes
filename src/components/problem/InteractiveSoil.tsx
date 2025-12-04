'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeftRight, Droplets, Wind } from 'lucide-react'
import styles from './InteractiveSoil.module.css'

export default function InteractiveSoil() {
  const [isPloughed, setIsPloughed] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Root paths
  const rootPathHealthy = "M100,50 L100,150 C100,200 80,250 60,300 M100,150 C110,200 140,250 150,320 M100,100 C90,120 80,140 70,160"
  const rootPathDamaged = "M100,50 L100,120 C100,125 110,128 140,125 M100,110 C90,115 60,118 40,115"

  // Particles
  const particleCount = 8
  const [particles, setParticles] = useState<Array<{id: number, x: number, type: 'water' | 'air', delay: number}>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount * 2 }).map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 160,
      type: i < particleCount ? 'water' : 'air' as 'water' | 'air',
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  // Button spring animation
  const buttonScale = useSpring(1, { stiffness: 400, damping: 20 })

  const handleToggle = () => {
    buttonScale.set(0.95)
    setTimeout(() => buttonScale.set(1), 100)
    setIsPloughed(!isPloughed)
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h3 
          className={styles.title}
          key={isPloughed ? 'damaged' : 'healthy'}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isPloughed ? 'Tömörödött talaj (Eketalp)' : 'Egészséges szerkezet'}
        </motion.h3>
        <motion.button 
          className={`${styles.toggle} ${!isPloughed ? styles.toggleActive : ''}`}
          onClick={handleToggle}
          style={{ scale: buttonScale }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={{ rotate: isPloughed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex' }}
          >
            <ArrowLeftRight size={16} />
          </motion.span>
          <AnimatePresence mode="wait">
            <motion.span
              key={isPloughed ? 'fix' : 'break'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {isPloughed ? 'Javítás' : 'Rontás'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <motion.div 
        className={styles.soilSection}
        animate={{ 
          boxShadow: isHovered 
            ? 'inset 0 0 30px rgba(0,0,0,0.2)' 
            : 'inset 0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sky - always blue, but brighter when healthy */}
        <motion.div 
          className={styles.sky}
          animate={{ 
            background: isPloughed 
              ? 'linear-gradient(180deg, #B3E5FC 0%, #81D4FA 100%)'
              : 'linear-gradient(180deg, #81D4FA 0%, #4FC3F7 100%)'
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Sun effect - only visible in healthy state (no rays) */}
        <motion.div
          style={{
            position: 'absolute',
            top: 6,
            right: 15,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFD54F 0%, #FFCA28 60%, transparent 100%)',
            zIndex: 3,
            pointerEvents: 'none',
            boxShadow: '0 0 20px rgba(255, 213, 79, 0.5)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: isPloughed ? 0 : 1, 
            scale: isPloughed ? 0.5 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        
        {/* Cloud overlay for damaged state */}
        <motion.div
          style={{
            position: 'absolute',
            top: 5,
            left: 15,
            width: 50,
            height: 25,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 3,
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: isPloughed ? 0.7 : 0, 
            x: isPloughed ? 0 : -20,
          }}
          transition={{ duration: 0.5 }}
        />
        
        <div className={styles.texture} />

        {/* Plough Pan Overlay */}
        <AnimatePresence>
          {isPloughed && (
            <motion.div 
              className={styles.ploughPan}
              initial={{ opacity: 0, scaleY: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleY: 0, scaleX: 0.8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span 
                className={styles.panLabel}
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: ['0 2px 10px rgba(0,0,0,0.3)', '0 4px 20px rgba(183,28,28,0.5)', '0 2px 10px rgba(0,0,0,0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Eketalp (20 bar+)
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plant & Roots SVG */}
        <div className={styles.plantContainer}>
          <svg width="200" height="390" viewBox="0 0 200 390" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stem with animation */}
            <motion.path 
              d="M100,50 L100,0" 
              stroke="#81C784" 
              strokeWidth="4"
              animate={{ 
                stroke: isPloughed ? '#81C784' : '#4CAF50',
                strokeWidth: isPloughed ? 4 : 5
              }}
              transition={{ duration: 0.5 }}
            />
            {/* Leaves with sway animation */}
            <motion.path 
              d="M100,20 Q60,0 50,30 M100,30 Q140,10 150,40" 
              stroke="#81C784" 
              strokeWidth="4" 
              fill="none"
              animate={{ 
                stroke: isPloughed ? '#81C784' : '#4CAF50',
                d: isHovered 
                  ? "M100,20 Q55,0 45,30 M100,30 Q145,10 155,40"
                  : "M100,20 Q60,0 50,30 M100,30 Q140,10 150,40"
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            
            {/* Roots with smooth morphing */}
            <motion.path
              d={isPloughed ? rootPathDamaged : rootPathHealthy}
              stroke="#D7CCC8"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={false}
              animate={{ 
                d: isPloughed ? rootPathDamaged : rootPathHealthy,
                stroke: isPloughed ? '#BCAAA4' : '#A1887F',
                strokeWidth: isPloughed ? 3 : 4
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>

        {/* Particles with improved animation */}
        <div className={styles.particleContainer}>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className={`${styles.particle} ${p.type === 'water' ? styles.water : styles.air}`}
              style={{ left: `${(p.x / 200) * 100}%` }}
              animate={{
                y: [0, isPloughed ? (p.type === 'water' ? 120 : 100) : 340],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1, 1, 0.5],
              }}
              transition={{
                duration: isPloughed ? 2 : 4,
                repeat: Infinity,
                delay: p.delay,
                ease: isPloughed ? "easeOut" : "linear"
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className={styles.stats}>
        <motion.div 
          className={styles.statItem}
          whileHover={{ background: 'rgba(250, 249, 246, 1)' }}
        >
          <span className={styles.statLabel}>Gyökérzóna</span>
          <AnimatePresence mode="wait">
            <motion.div 
              className={`${styles.statValue} ${isPloughed ? styles.statBad : styles.statGood}`}
              key={isPloughed ? 'shallow' : 'deep'}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {isPloughed ? 'Sekély (25cm)' : 'Mély (60cm+)'}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.div 
          className={styles.statItem}
          whileHover={{ background: 'rgba(250, 249, 246, 1)' }}
        >
          <span className={styles.statLabel}>Vízgazdálkodás</span>
          <AnimatePresence mode="wait">
            <motion.div 
              className={`${styles.statValue} ${isPloughed ? styles.statBad : styles.statGood}`}
              key={isPloughed ? 'bad' : 'good'}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {isPloughed ? 'Pangóvíz' : 'Kiegyensúlyozott'}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
