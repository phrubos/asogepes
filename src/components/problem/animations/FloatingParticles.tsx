'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  type: 'soil' | 'root' | 'water'
}

interface FloatingParticlesProps {
  variant?: 'soil' | 'root' | 'water' | 'mixed'
  count?: number
  speed?: 'slow' | 'normal' | 'fast'
  direction?: 'up' | 'down' | 'random'
  className?: string
}

const particleColors = {
  soil: ['#8D6E63', '#A1887F', '#6D4C41', '#5D4037', '#BCAAA4'],
  root: ['#D7CCC8', '#EFEBE9', '#A1887F', '#8D6E63'],
  water: ['#4FC3F7', '#29B6F6', '#81D4FA', '#B3E5FC'],
}

const speedSettings = {
  slow: { durationRange: [8, 15], delayRange: [0, 5] },
  normal: { durationRange: [5, 10], delayRange: [0, 3] },
  fast: { durationRange: [3, 6], delayRange: [0, 2] },
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  // Round to avoid hydration mismatches from floating point precision
  return Math.round((x - Math.floor(x)) * 10000) / 10000
}

export default function FloatingParticles({
  variant = 'soil',
  count = 20,
  speed = 'normal',
  direction = 'up',
  className = '',
}: FloatingParticlesProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Generate particles only on client to avoid hydration mismatch
  const particles = (() => {
    if (!mounted) return []
    const settings = speedSettings[speed]
    const actualCount = isMobile ? Math.floor(count / 2) : count
    const result: Particle[] = []
    
    for (let i = 0; i < actualCount; i++) {
      const seed = i * 100
      const types: Particle['type'][] = variant === 'mixed' 
        ? ['soil', 'root', 'water']
        : [variant]
      
      result.push({
        id: i,
        x: seededRandom(seed) * 100,
        y: seededRandom(seed + 1) * 100,
        size: 4 + seededRandom(seed + 2) * 8,
        opacity: 0.3 + seededRandom(seed + 3) * 0.5,
        duration: settings.durationRange[0] + seededRandom(seed + 4) * (settings.durationRange[1] - settings.durationRange[0]),
        delay: settings.delayRange[0] + seededRandom(seed + 5) * (settings.delayRange[1] - settings.delayRange[0]),
        type: types[Math.floor(seededRandom(seed + 6) * types.length)],
      })
    }
    
    return result
  })()

  const getParticleColor = (type: Particle['type'], seed: number) => {
    const colors = particleColors[type]
    return colors[Math.floor(seededRandom(seed) * colors.length)]
  }

  const getAnimationY = (particle: Particle) => {
    if (direction === 'up') {
      return [particle.y + 120, particle.y - 20]
    } else if (direction === 'down') {
      return [particle.y - 20, particle.y + 120]
    } else {
      return seededRandom(particle.id) > 0.5 
        ? [particle.y + 120, particle.y - 20]
        : [particle.y - 20, particle.y + 120]
    }
  }

  // Don't render until mounted, or if mobile with high count
  if (!mounted || (isMobile && count > 10)) {
    return null
  }

  return (
    <div 
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: particle.type === 'water' ? '50% 50% 50% 50% / 60% 60% 40% 40%' : '50%',
            background: particle.type === 'water'
              ? `linear-gradient(180deg, ${getParticleColor(particle.type, particle.id)}, transparent)`
              : getParticleColor(particle.type, particle.id),
            opacity: particle.opacity,
            boxShadow: particle.type === 'water' 
              ? `0 0 ${particle.size / 2}px ${getParticleColor(particle.type, particle.id)}`
              : 'none',
          }}
          initial={{ 
            y: `${getAnimationY(particle)[0]}vh`,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{ 
            y: `${getAnimationY(particle)[1]}vh`,
            opacity: [0, particle.opacity, particle.opacity, 0],
            scale: [0.5, 1, 1, 0.5],
            x: [0, seededRandom(particle.id + 10) * 40 - 20, seededRandom(particle.id + 20) * 30 - 15, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Soil particles floating up
export function SoilParticles({ className }: { className?: string }) {
  return <FloatingParticles variant="soil" count={15} speed="slow" direction="up" className={className} />
}

// Water drops falling
export function WaterDrops({ className }: { className?: string }) {
  return <FloatingParticles variant="water" count={12} speed="normal" direction="down" className={className} />
}

// Root fibers
export function RootFibers({ className }: { className?: string }) {
  return <FloatingParticles variant="root" count={10} speed="slow" direction="random" className={className} />
}
