'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './Hero.module.css'
import { heroStats } from '@/lib/data'
import { useParallax } from '@/hooks/useParallax'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { TextReveal } from '@/components/ui/TextReveal'

export default function Hero() {
  const { style: parallaxStyle } = useParallax({ speed: 0.3, maxOffset: 150 })
  
  // Typewriter effect for "végtelen erőforrás"
  const [typewriterText, setTypewriterText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasInitialDelay, setHasInitialDelay] = useState(true)
  
  const fullText = 'végtelen erőforrás'
  
  useEffect(() => {
    // Initial delay before starting
    if (hasInitialDelay) {
      const initialTimeout = setTimeout(() => {
        setHasInitialDelay(false)
      }, 1000)
      return () => clearTimeout(initialTimeout)
    }
    
    let timeout: NodeJS.Timeout
    
    if (isTyping && !isDeleting) {
      if (typewriterText.length < fullText.length) {
        timeout = setTimeout(() => {
          setTypewriterText(fullText.slice(0, typewriterText.length + 1))
        }, 80)
      } else {
        // Finished typing, wait 10 seconds then delete
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 10000)
      }
    } else if (isDeleting) {
      if (typewriterText.length > 0) {
        timeout = setTimeout(() => {
          setTypewriterText(typewriterText.slice(0, -1))
        }, 40)
      } else {
        // Finished deleting, restart typing
        timeout = setTimeout(() => {
          setIsDeleting(false)
          setIsTyping(true)
        }, 500)
      }
    }
    
    return () => clearTimeout(timeout)
  }, [typewriterText, isTyping, isDeleting, hasInitialDelay, fullText])

  return (
    <header className={styles.hero}>
      <div className={styles.heroBg} style={parallaxStyle}>
        <Image
          src="/images/hero-bg-final.png"
          alt="Ásógép munkában - kontrasztos mezőgazdasági tájkép"
          fill
          priority
          className={styles.heroImage}
          sizes="100vw"
        />
        <div className={styles.heroOverlay}></div>
      </div>
      <div className={styles.heroContent}>
        <motion.div
          className={styles.heroBadge}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span>Neumann János Egyetem × Agroskill Kft.</span>
          <span className={styles.badgeYear}>2025</span>
        </motion.div>

        <h1 className={styles.heroTitle}>
          <motion.span 
            className={styles.titleLine}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            A talaj nem{' '}
            <span className={styles.titleAccent}>
              {typewriterText}
              <motion.span
                className={styles.cursor}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              >
                |
              </motion.span>
            </span>
          </motion.span>
        </h1>

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Tudományos kutatás a szántóföldi ásógép talajszerkezetre gyakorolt hatásáról öntözött kertészeti kultúrákban
        </motion.p>

        <motion.div
          className={styles.heroStats}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {heroStats.map((stat, index) => (
            <motion.div 
              key={index} 
              className={styles.stat}
            >
              <span className={styles.statNumber}>
                <AnimatedNumber 
                  value={parseInt(stat.number.replace(/\D/g, '')) || 0} 
                  suffix={stat.number.replace(/[0-9]/g, '')}
                  duration={2000}
                  delay={index * 150}
                />
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
              {stat.sublabel && (
                <span className={styles.statSublabel}>{stat.sublabel}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.heroCta}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/problema">
            <MagneticButton 
              variant="primary" 
              size="lg"
              magneticStrength={0.25}
            >
              Fedezd fel a kutatást
              <ArrowRight size={20} />
            </MagneticButton>
          </Link>
        </motion.div>
      </div>
    </header>
  )
}
