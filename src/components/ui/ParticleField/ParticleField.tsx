'use client'

import { useRef, useEffect, useCallback, useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './ParticleField.module.css'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
}

interface ParticleFieldProps {
  /** Number of particles */
  density?: number
  /** Particle colors (will be randomly selected) */
  colors?: string[]
  /** Particle speed multiplier */
  speed?: number
  /** Minimum particle size */
  minSize?: number
  /** Maximum particle size */
  maxSize?: number
  /** Whether to connect nearby particles with lines */
  connectParticles?: boolean
  /** Connection distance threshold */
  connectionDistance?: number
  /** Connection line opacity */
  connectionOpacity?: number
  /** Additional CSS class */
  className?: string
  /** Static fallback for reduced motion */
  staticFallback?: boolean
}

export default function ParticleField({
  density = 50,
  colors = ['rgba(212, 168, 75, 0.6)', 'rgba(107, 139, 94, 0.5)', 'rgba(74, 103, 65, 0.4)'],
  speed = 0.5,
  minSize = 1,
  maxSize = 3,
  connectParticles = true,
  connectionDistance = 120,
  connectionOpacity = 0.15,
  className = '',
  staticFallback = true
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const prefersReducedMotion = useReducedMotion()

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * (maxSize - minSize) + minSize,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    return particles
  }, [density, speed, minSize, maxSize, colors])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const particles = particlesRef.current

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Wrap around edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.globalAlpha = particle.opacity
      ctx.fill()

      // Draw connections
      if (connectParticles) {
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * connectionOpacity
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = opacity
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    })

    ctx.globalAlpha = 1
    animationRef.current = requestAnimationFrame(animate)
  }, [connectParticles, connectionDistance, connectionOpacity])

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const { width, height } = parent.getBoundingClientRect()
    canvas.width = width
    canvas.height = height

    // Reinitialize particles on resize
    particlesRef.current = initParticles(width, height)
  }, [initParticles])

  useEffect(() => {
    if (prefersReducedMotion && !staticFallback) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Initial setup
    handleResize()

    // Start animation only if motion is allowed
    if (!prefersReducedMotion) {
      animate()
    } else {
      // Draw static particles once
      const ctx = canvas.getContext('2d')
      if (ctx) {
        particlesRef.current.forEach(particle => {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.opacity
          ctx.fill()
        })
      }
    }

    // Handle resize
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [prefersReducedMotion, staticFallback, handleResize, animate])

  // Don't render if reduced motion and no static fallback
  if (prefersReducedMotion && !staticFallback) {
    return null
  }

  return (
    <div className={`${styles.container} ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </div>
  )
}
