'use client'

import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { getImageProps } from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from './Hero.module.css'
import { RESEARCH_FIELDS, RESEARCH_SITES, RESEARCH_YEARS, szentkiralySeasons } from '@/lib/seasons'
import { useParallax } from '@/hooks/useParallax'
import { useLoopActive } from '@/hooks/useLoopActive'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import { MagneticButton } from '@/components/ui/MagneticButton'

// Typed once in the hero title (see .typeChar in Hero.module.css)
const HERO_ACCENT = 'végtelen erőforrás'

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

// Desktop and tablet: the landscape film. Phones (<768px): a portrait loop of the same real footage
// (Imants 38SX, the brand on the rotor hood kept in frame). Neither with reduced motion or Save-Data;
// on phones not on a 2g/3g connection either. The poster is shown until the video plays, and instead of it.
type HeroVideo = 'desktop' | 'mobile' | null

const HERO_VIDEO_SRC = {
  desktop: '/videos/hero_background_optimized.mp4',
  mobile: '/videos/hero_mobile_imants.mp4',
} as const

type NetworkInfo = { saveData?: boolean; effectiveType?: string }

function useHeroVideo(): HeroVideo {
  const [kind, setKind] = useState<HeroVideo>(null)
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)')
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection
    const update = () => {
      if (!motionOk.matches || conn?.saveData === true) setKind(null)
      else if (wide.matches) setKind('desktop')
      else setKind(/2g|3g/.test(conn?.effectiveType ?? '') ? null : 'mobile')
    }
    update()
    wide.addEventListener('change', update)
    motionOk.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      motionOk.removeEventListener('change', update)
    }
  }, [])
  return kind
}

// Art direction: phones get the portrait poster (the first frame of the mobile loop), the rest the landscape one
const posterDesktop = getImageProps({
  src: '/images/hero-poster-frame.jpg',
  alt: '',
  fill: true,
  priority: true,
  sizes: '100vw',
}).props
const posterMobile = getImageProps({
  src: '/images/hero-poster-mobile.jpg',
  alt: '',
  width: 1080,
  height: 1920,
  priority: true,
  sizes: '100vw',
}).props

export default function Hero() {
  const { style: parallaxStyle } = useParallax({ speed: 0.3, maxOffset: 150 })

  const videoKind = useHeroVideo()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoStarted, setVideoStarted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const loopActive = useLoopActive(heroRef)

  // Load only after the page has loaded, so the video never competes with the poster and the text
  useEffect(() => {
    setIsVideoPlaying(false)
    setVideoStarted(false)
    const video = videoRef.current
    if (!videoKind || !video) return
    const start = () => {
      video.load()
      setVideoStarted(true)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [videoKind])

  // Play only while the hero is on screen
  useEffect(() => {
    const video = videoRef.current
    if (!videoStarted || !video) return
    if (loopActive) video.play().catch(() => {})
    else video.pause()
  }, [videoStarted, loopActive])

  return (
    <header ref={heroRef} className={styles.hero}>
      <div className={styles.heroBg} style={parallaxStyle}>
        <div className={styles.heroMedia}>
          <picture>
            <source media="(max-width: 767px)" srcSet={posterMobile.srcSet} sizes={posterMobile.sizes} />
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps for art direction; alt="" (decorative) is in the props */}
            <img {...posterDesktop} className={styles.heroPoster} />
          </picture>
          {videoKind && (
            <video
              key={videoKind}
              ref={videoRef}
              loop
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              className={`${styles.heroVideo} ${isVideoPlaying ? styles.heroVideoPlaying : ''}`}
              onPlaying={() => setIsVideoPlaying(true)}
            >
              <source src={HERO_VIDEO_SRC[videoKind]} type="video/mp4" />
            </video>
          )}
        </div>
        <div className={styles.heroOverlay}></div>
      </div>
      <div className={styles.heroContent}>
        <div className={`${styles.heroBadge} ${styles.rise}`}>
          Neumann János Egyetem × Agroskill Kft.
        </div>

        <h1 className={styles.heroTitle} aria-label={`A talaj nem ${HERO_ACCENT}`}>
          <span className={`${styles.titleLine} ${styles.rise}`} style={{ animationDelay: '100ms' }}>
            A talaj nem{' '}
            {/* Typed once, by CSS only: every letter is in the server HTML (search, link previews) and
                appears in turn; the caret blinks a few times at the end, then goes. The heading is read
                from aria-label, so screen readers never get it letter by letter. */}
            <span className={styles.titleAccent} aria-hidden="true">
              {[...HERO_ACCENT].map((ch, i) => (
                <span key={i} className={styles.typeChar} style={{ '--i': i } as CSSProperties}>
                  {ch}
                </span>
              ))}
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
