'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftRight, Droplets, Wind } from 'lucide-react'
import styles from './InteractiveSoil.module.css'

export default function InteractiveSoil() {
  const [isPloughed, setIsPloughed] = useState(true)

  // Root paths
  const rootPathHealthy = "M100,50 L100,150 C100,200 80,250 60,300 M100,150 C110,200 140,250 150,320 M100,100 C90,120 80,140 70,160"
  const rootPathDamaged = "M100,50 L100,120 C100,125 110,128 140,125 M100,110 C90,115 60,118 40,115"

  // Particles
  const particleCount = 8
  const [particles, setParticles] = useState<Array<{id: number, x: number, type: 'water' | 'air', delay: number}>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount * 2 }).map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 160, // within 200px width container
      type: i < particleCount ? 'water' : 'air' as 'water' | 'air',
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {isPloughed ? 'Tömörödött talaj (Eketalp)' : 'Egészséges szerkezet'}
        </h3>
        <button 
          className={`${styles.toggle} ${!isPloughed ? styles.toggleActive : ''}`}
          onClick={() => setIsPloughed(!isPloughed)}
        >
          <ArrowLeftRight size={16} />
          {isPloughed ? 'Javítás' : 'Rontás'}
        </button>
      </div>

      <div className={styles.soilSection}>
        <div className={styles.sky} />
        <div className={styles.texture} />

        {/* Plough Pan Overlay */}
        <AnimatePresence>
          {isPloughed && (
            <motion.div 
              className={styles.ploughPan}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.panLabel}>Eketalp (20 bar+)</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plant & Roots SVG */}
        <div className={styles.plantContainer}>
          <svg width="200" height="390" viewBox="0 0 200 390" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stem */}
            <path d="M100,50 L100,0" stroke="#81C784" strokeWidth="4" />
            {/* Leaves */}
            <path d="M100,20 Q60,0 50,30 M100,30 Q140,10 150,40" stroke="#81C784" strokeWidth="4" fill="none" />
            
            {/* Roots */}
            <motion.path
              d={isPloughed ? rootPathDamaged : rootPathHealthy}
              stroke="#D7CCC8"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{ d: isPloughed ? rootPathDamaged : rootPathHealthy }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* Particles */}
        <div className={styles.particleContainer}>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className={`${styles.particle} ${p.type === 'water' ? styles.water : styles.air}`}
              style={{ left: `${(p.x / 200) * 100}%` }}
              animate={{
                y: [0, isPloughed ? (p.type === 'water' ? 120 : 100) : 340],
                opacity: [0, 1, 1, 0]
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
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Gyökérzóna</span>
          <motion.div 
            className={`${styles.statValue} ${isPloughed ? styles.statBad : styles.statGood}`}
            key={isPloughed ? 'shallow' : 'deep'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isPloughed ? 'Sekély (25cm)' : 'Mély (60cm+)'}
          </motion.div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Vízgazdálkodás</span>
          <motion.div 
            className={`${styles.statValue} ${isPloughed ? styles.statBad : styles.statGood}`}
            key={isPloughed ? 'bad' : 'good'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isPloughed ? 'Pangóvíz' : 'Kiegyensúlyozott'}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
