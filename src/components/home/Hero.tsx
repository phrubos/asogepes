'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './Hero.module.css'
import { heroStats } from '@/lib/data'
import { useParallax } from '@/hooks/useParallax'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import { MagneticButton } from '@/components/ui/MagneticButton'

const VIDEO_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'

function useHeroVideo() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(VIDEO_QUERY)
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    const update = () => setEnabled(mq.matches && !saveData)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return enabled
}

export default function Hero() {
  const { style: parallaxStyle } = useParallax({ speed: 0.3, maxOffset: 150 })

  // Typewriter effect
  const typewriterText = useTypewriter({
    text: 'végtelen erőforrás',
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseBeforeDelete: 10000,
    pauseBeforeRestart: 500
  })

  const reducedMotion = useReducedMotion()
  const showVideo = useHeroVideo()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!showVideo || !video) return
    const start = () => {
      video.load()
      video.play().catch(() => {})
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [showVideo])

  return (
    <header className={styles.hero}>
      <div className={styles.heroBg} style={parallaxStyle}>
        <Image
          src="/images/hero-bg-final-optimized.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroPoster}
        />
        {showVideo && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            className={`${styles.heroVideo} ${isVideoPlaying ? styles.heroVideoPlaying : ''}`}
            onPlaying={() => setIsVideoPlaying(true)}
          >
            <source src="/videos/hero_background_optimized.mp4" type="video/mp4" />
          </video>
        )}
        <div className={styles.heroOverlay}></div>
      </div>
      <div className={styles.heroContent}>
        <div className={`${styles.heroBadge} ${styles.rise}`}>
          Neumann János Egyetem × Agroskill Kft.
        </div>

        <h1 className={styles.heroTitle}>
          <span className={`${styles.titleLine} ${styles.rise}`} style={{ animationDelay: '100ms' }}>
            A talaj nem{' '}
            <span className={styles.titleAccent}>
              {typewriterText}
              {!reducedMotion && (
                <motion.span
                  className={styles.cursor}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                >
                  |
                </motion.span>
              )}
            </span>
          </span>
        </h1>

        <p className={`${styles.heroSubtitle} ${styles.rise}`} style={{ animationDelay: '400ms' }}>
          Tudományos kutatás a szántóföldi ásógép talajszerkezetre gyakorolt hatásáról, öntözött kertészeti kultúrákban
        </p>

        <div className={`${styles.heroStats} ${styles.rise}`} style={{ animationDelay: '500ms' }}>
          {heroStats.map((stat, index) => (
            <div
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
            </div>
          ))}
        </div>

        <div className={`${styles.heroCta} ${styles.rise}`} style={{ animationDelay: '600ms' }}>
          <Link href="/kutatas">
            <MagneticButton
              variant="primary"
              size="lg"
              magneticStrength={0.25}
            >
              Fedezd fel a kutatást
              <ArrowRight size={20} />
            </MagneticButton>
          </Link>
        </div>
      </div>
    </header>
  )
}
