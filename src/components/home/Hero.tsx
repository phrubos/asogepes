'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './Hero.module.css'
import { RESEARCH_FIELDS, RESEARCH_SITES, RESEARCH_YEARS, szentkiralySeasons } from '@/lib/seasons'
import { useParallax } from '@/hooks/useParallax'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import { MagneticButton } from '@/components/ui/MagneticButton'

// Figures true for every season (same source as the research page)
const heroStats = [
  { number: String(RESEARCH_SITES.length), label: 'Helyszín', sublabel: 'Szentkirály · Kecskemét · Lakitelek' },
  { number: String(RESEARCH_YEARS.length), label: 'Tenyészidő', sublabel: RESEARCH_YEARS.join(' és ') },
  { number: String(RESEARCH_FIELDS), label: 'Kísérleti tábla', sublabel: 'Szentkirályon kettő' },
]

// The one result measured in every season: Szentkirály onion, loose layer at the end of the season
const seasonEnds = szentkiralySeasons.seasons.map((s) => ({ year: s.year, ...s.seasonEnd }))
const endMax = Math.max(...seasonEnds.map((s) => s.spade))
const cm = (v: number) => String(v).replace('.', ',')

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
          src="/images/hero-poster-frame.jpg"
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
          {RESEARCH_YEARS.length === 2 ? 'Két' : RESEARCH_YEARS.length} tenyészidő szántóföldi mérései az ásógép talajszerkezetre gyakorolt hatásáról, öntözött kertészeti kultúrákban
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
          <MagneticButton
            href="/kutatas"
            variant="primary"
            size="lg"
            magneticStrength={0.25}
          >
            Fedezd fel a kutatást
            <ArrowRight size={20} />
          </MagneticButton>
        </div>
      </div>

      {/* Every season in one glance: the loose layer at the end of the season, control vs spader */}
      <Link href="/kutatas?section=szentkiraly-timeline" className={`${styles.seasonCard} ${styles.rise}`} style={{ animationDelay: '700ms' }}>
        <span className={styles.seasonCardHead}>Szentkirály · laza réteg a tenyészidő végén</span>
        <span className={styles.seasonRows}>
          {seasonEnds.map((s) => (
            <span key={s.year} className={styles.seasonRow}>
              <span className={styles.seasonYear}>{s.year}</span>
              <span className={styles.seasonBars} aria-hidden="true">
                <span className={styles.barControl} style={{ width: `${(s.control / endMax) * 100}%` }} />
                <span className={styles.barSpade} style={{ width: `${(s.spade / endMax) * 100}%` }} />
              </span>
              <span className={styles.seasonValue}>
                {cm(s.control)} → {cm(s.spade)} cm
              </span>
            </span>
          ))}
        </span>
        <span className={styles.seasonFoot}>
          <span><i className={styles.keyControl} />kontroll</span>
          <span><i className={styles.keySpade} />ásógép</span>
          <span className={styles.seasonMore}>Részletek <ArrowRight size={14} /></span>
        </span>
      </Link>
    </header>
  )
}
