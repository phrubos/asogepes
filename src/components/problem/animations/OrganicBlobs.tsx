'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface BlobConfig {
  id: string
  color: string
  size: number
  x: number
  y: number
  blur: number
  opacity: number
  speed: number
}

interface OrganicBlobsProps {
  variant?: 'earth' | 'green' | 'gold' | 'mixed'
  intensity?: 'subtle' | 'medium' | 'strong'
  animated?: boolean
  parallax?: boolean
  className?: string
}

const colorPalettes = {
  earth: [
    'rgba(141, 110, 99, 0.25)',
    'rgba(93, 64, 55, 0.2)',
    'rgba(62, 39, 35, 0.15)',
    'rgba(188, 170, 164, 0.2)',
  ],
  green: [
    'rgba(107, 139, 94, 0.25)',
    'rgba(129, 199, 132, 0.2)',
    'rgba(76, 175, 80, 0.15)',
    'rgba(200, 230, 201, 0.2)',
  ],
  gold: [
    'rgba(212, 168, 75, 0.25)',
    'rgba(255, 193, 7, 0.2)',
    'rgba(255, 160, 0, 0.15)',
    'rgba(255, 224, 130, 0.2)',
  ],
  mixed: [
    'rgba(107, 139, 94, 0.2)',
    'rgba(141, 110, 99, 0.2)',
    'rgba(212, 168, 75, 0.15)',
    'rgba(93, 64, 55, 0.15)',
  ],
}

const intensitySettings = {
  subtle: { count: 3, sizeRange: [150, 300], blurRange: [60, 100], opacityRange: [0.1, 0.2] },
  medium: { count: 5, sizeRange: [200, 400], blurRange: [80, 120], opacityRange: [0.15, 0.3] },
  strong: { count: 7, sizeRange: [250, 500], blurRange: [100, 150], opacityRange: [0.2, 0.4] },
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  // Round to avoid hydration mismatches from floating point precision
  return Math.round((x - Math.floor(x)) * 10000) / 10000
}

export default function OrganicBlobs({
  variant = 'mixed',
  intensity = 'medium',
  animated = true,
  parallax = true,
  className = '',
}: OrganicBlobsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])
  const [mounted, setMounted] = useState(false)
  
  // Only render after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Generate blobs only on client
  const blobs = (() => {
    if (!mounted) return []
    const settings = intensitySettings[intensity]
    const colors = colorPalettes[variant]
    const result: BlobConfig[] = []
    
    for (let i = 0; i < settings.count; i++) {
      const seed = i * 1000
      result.push({
        id: `blob-${i}`,
        color: colors[i % colors.length],
        size: settings.sizeRange[0] + seededRandom(seed) * (settings.sizeRange[1] - settings.sizeRange[0]),
        x: seededRandom(seed + 1) * 100,
        y: seededRandom(seed + 2) * 100,
        blur: settings.blurRange[0] + seededRandom(seed + 3) * (settings.blurRange[1] - settings.blurRange[0]),
        opacity: settings.opacityRange[0] + seededRandom(seed + 4) * (settings.opacityRange[1] - settings.opacityRange[0]),
        speed: 0.2 + seededRandom(seed + 5) * 0.6,
      })
    }
    
    return result
  })()

  // GSAP parallax effect
  useEffect(() => {
    if (!parallax || !containerRef.current) return
    
    // Skip on mobile
    if (window.innerWidth < 768) return
    
    const ctx = gsap.context(() => {
      blobRefs.current.forEach((blob, i) => {
        if (!blob) return
        
        const speed = blobs[i]?.speed || 0.3
        
        gsap.to(blob, {
          y: `${speed * 100}%`,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        })
      })
    }, containerRef)
    
    return () => ctx.revert()
  }, [parallax, blobs])

  // Morphing animation paths
  const morphVariants = {
    initial: (i: number) => ({
      borderRadius: `${30 + seededRandom(i) * 40}% ${60 - seededRandom(i + 1) * 30}% ${40 + seededRandom(i + 2) * 30}% ${50 - seededRandom(i + 3) * 20}%`,
    }),
    animate: (i: number) => ({
      borderRadius: [
        `${30 + seededRandom(i) * 40}% ${60 - seededRandom(i + 1) * 30}% ${40 + seededRandom(i + 2) * 30}% ${50 - seededRandom(i + 3) * 20}%`,
        `${50 - seededRandom(i + 4) * 20}% ${40 + seededRandom(i + 5) * 30}% ${60 - seededRandom(i + 6) * 30}% ${30 + seededRandom(i + 7) * 40}%`,
        `${40 + seededRandom(i + 8) * 30}% ${50 - seededRandom(i + 9) * 20}% ${30 + seededRandom(i + 10) * 40}% ${60 - seededRandom(i + 11) * 30}%`,
        `${30 + seededRandom(i) * 40}% ${60 - seededRandom(i + 1) * 30}% ${40 + seededRandom(i + 2) * 30}% ${50 - seededRandom(i + 3) * 20}%`,
      ],
      transition: {
        duration: 15 + seededRandom(i + 12) * 10,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    }),
  }

  const floatVariants = {
    animate: (i: number) => ({
      x: [0, seededRandom(i) * 30 - 15, seededRandom(i + 1) * 20 - 10, 0],
      y: [0, seededRandom(i + 2) * 20 - 10, seededRandom(i + 3) * 30 - 15, 0],
      scale: [1, 1 + seededRandom(i + 4) * 0.1, 1 - seededRandom(i + 5) * 0.05, 1],
      transition: {
        duration: 20 + seededRandom(i + 6) * 15,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    }),
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={blob.id}
          ref={el => { blobRefs.current[i] = el }}
          custom={i}
          variants={animated ? floatVariants : undefined}
          animate={animated ? 'animate' : undefined}
          style={{
            position: 'absolute',
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: blob.size,
            height: blob.size,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
          }}
        >
          <motion.div
            custom={i}
            variants={animated ? morphVariants : undefined}
            initial="initial"
            animate={animated ? 'animate' : undefined}
            style={{
              width: '100%',
              height: '100%',
              background: blob.color,
              filter: `blur(${blob.blur}px)`,
              opacity: blob.opacity,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Preset configurations for specific sections
export function EarthBlobs({ className }: { className?: string }) {
  return <OrganicBlobs variant="earth" intensity="medium" className={className} />
}

export function GreenBlobs({ className }: { className?: string }) {
  return <OrganicBlobs variant="green" intensity="subtle" className={className} />
}

export function GoldBlobs({ className }: { className?: string }) {
  return <OrganicBlobs variant="gold" intensity="subtle" className={className} />
}

export function HeroBlobs({ className }: { className?: string }) {
  return <OrganicBlobs variant="mixed" intensity="strong" className={className} />
}
