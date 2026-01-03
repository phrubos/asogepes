'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './SoilHero.module.css'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  layer: 'sky' | 'topSoil' | 'middleSoil' | 'deepSoil'
}

interface ParticleSystemProps {
  isLoaded: boolean
  activeRootId: string | null
}

const PARTICLE_COUNTS = {
  sky: 10,
  topSoil: 12,
  middleSoil: 8,
  deepSoil: 5,
}

// Matches CSS: sky=0-15%, topSoil=15-40%, middleSoil=40-70%, deepSoil=70-100%
const LAYER_BOUNDS = {
  sky: { top: 0, bottom: 15 },
  topSoil: { top: 15, bottom: 40 },
  middleSoil: { top: 40, bottom: 70 },
  deepSoil: { top: 70, bottom: 100 },
}

export default function ParticleSystem({ isLoaded, activeRootId }: ParticleSystemProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize particles
  useEffect(() => {
    if (!isLoaded) return

    const initParticles: Particle[] = []
    let id = 0

    Object.entries(PARTICLE_COUNTS).forEach(([layer, count]) => {
      const bounds = LAYER_BOUNDS[layer as keyof typeof LAYER_BOUNDS]
      for (let i = 0; i < count; i++) {
        initParticles.push({
          id: id++,
          x: Math.random() * 100,
          y: bounds.top + Math.random() * (bounds.bottom - bounds.top),
          size: layer === 'sky' ? 2 + Math.random() * 2 : 1.5 + Math.random() * 1.5,
          opacity: layer === 'sky' ? 0.3 + Math.random() * 0.3 : 0.2 + Math.random() * 0.3,
          speed: 0.02 + Math.random() * 0.03,
          layer: layer as Particle['layer'],
        })
      }
    })

    setParticles(initParticles)
  }, [isLoaded])

  // Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate particles
  useEffect(() => {
    if (!isLoaded || particles.length === 0) return

    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16.67 // Normalize to ~60fps
      lastTime = currentTime

      setParticles(prev => prev.map(particle => {
        const bounds = LAYER_BOUNDS[particle.layer]
        let newX = particle.x
        let newY = particle.y

        // Different movement patterns per layer
        switch (particle.layer) {
          case 'sky':
            // Slow drift with mouse parallax
            newX += particle.speed * deltaTime + (mousePos.x - 0.5) * 0.02
            newY += Math.sin(currentTime * 0.001 + particle.id) * 0.02
            break
          case 'topSoil':
            // Random walk (microorganisms)
            newX += (Math.random() - 0.5) * 0.15 * deltaTime
            newY += (Math.random() - 0.5) * 0.15 * deltaTime
            break
          case 'middleSoil':
            // Subtle sparkle movement
            newX += Math.sin(currentTime * 0.002 + particle.id * 0.5) * 0.01
            newY += Math.cos(currentTime * 0.002 + particle.id * 0.5) * 0.01
            break
          case 'deepSoil':
            // Very slow, heavy movement
            newY += Math.sin(currentTime * 0.0005 + particle.id) * 0.005
            break
        }

        // Wrap around horizontally
        if (newX > 100) newX = 0
        if (newX < 0) newX = 100

        // Keep within layer bounds
        newY = Math.max(bounds.top, Math.min(bounds.bottom, newY))

        return {
          ...particle,
          x: newX,
          y: newY,
        }
      }))

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isLoaded, particles.length, mousePos])

  // Get particle color based on layer
  const getParticleColor = (layer: Particle['layer']) => {
    switch (layer) {
      case 'sky':
        return 'rgba(201, 162, 39, 0.4)' // Gold pollen
      case 'topSoil':
        return 'rgba(139, 115, 85, 0.5)' // Brown organisms
      case 'middleSoil':
        return 'rgba(201, 162, 39, 0.3)' // Mineral glints
      case 'deepSoil':
        return 'rgba(201, 162, 39, 0.2)' // Deep crystals
    }
  }

  return (
    <div ref={containerRef} className={styles.particleContainer}>
      <AnimatePresence>
        {isLoaded && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: getParticleColor(particle.layer),
              opacity: particle.opacity,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: particle.opacity, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 2.4 + particle.id * 0.02, duration: 0.3 }}
          />
        ))}
      </AnimatePresence>

      {/* Moisture drops - occasional */}
      <MoistureDrops isLoaded={isLoaded} />
    </div>
  )
}

// Sub-component for occasional moisture drops
function MoistureDrops({ isLoaded }: { isLoaded: boolean }) {
  const [drops, setDrops] = useState<{ id: number; x: number }[]>([])

  useEffect(() => {
    if (!isLoaded) return

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newDrop = {
          id: Date.now(),
          x: 20 + Math.random() * 60, // Middle area only
        }
        setDrops(prev => [...prev, newDrop])

        // Remove drop after animation
        setTimeout(() => {
          setDrops(prev => prev.filter(d => d.id !== newDrop.id))
        }, 1500)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoaded])

  return (
    <AnimatePresence>
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className={styles.moistureDrop}
          style={{ left: `${drop.x}%` }}
          initial={{ top: '10%', opacity: 0.6, scale: 1 }}
          animate={{
            top: '25%',
            opacity: 0,
            scale: 0.5,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeIn' }}
        />
      ))}
    </AnimatePresence>
  )
}
