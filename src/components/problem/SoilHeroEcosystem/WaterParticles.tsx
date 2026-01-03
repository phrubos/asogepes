'use client'

import { useRef, useEffect, useCallback } from 'react'
import { PHYSICS, COLORS, SoilLayer, Particle } from './types'

interface WaterParticlesProps {
  isRaining: boolean
  layers: SoilLayer[]
  activeLayer: string | null
  width: number
  height: number
}

export default function WaterParticles({
  isRaining,
  layers,
  activeLayer,
  width,
  height,
}: WaterParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const particleIdRef = useRef(0)

  // Get layer at Y position
  const getLayerAtY = useCallback((y: number): SoilLayer | null => {
    const heightPercent = (y / height) * 100
    return layers.find(layer =>
      heightPercent >= layer.depth.start && heightPercent < layer.depth.end
    ) || null
  }, [height, layers])

  // Get compaction level at Y position
  const getCompactionAtY = useCallback((y: number): number => {
    const layer = getLayerAtY(y)
    if (!layer) return 0

    // Increase compaction if this layer is actively hovered
    if (activeLayer === layer.id) {
      return Math.min(layer.compactionLevel + 0.3, 1)
    }
    return layer.compactionLevel
  }, [getLayerAtY, activeLayer])

  // Create a new particle
  const createParticle = useCallback((burst: boolean = false): Particle => {
    const baseRadius = PHYSICS.particleRadius.min +
      Math.random() * (PHYSICS.particleRadius.max - PHYSICS.particleRadius.min)

    return {
      id: particleIdRef.current++,
      x: Math.random() * width * 0.8 + width * 0.1, // Keep within center 80%
      y: burst ? -20 - Math.random() * 50 : -10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: burst ? Math.random() * 2 + 1 : Math.random() * 0.5 + 0.5,
      radius: baseRadius,
      opacity: 0.6 + Math.random() * 0.4,
      stuck: false,
      stuckTime: 0,
      layer: null,
    }
  }, [width])

  // Update particle physics
  const updateParticle = useCallback((particle: Particle, deltaTime: number): boolean => {
    if (particle.stuck) {
      particle.stuckTime += deltaTime
      // Particles slowly fade and sink when stuck
      particle.opacity -= 0.002
      particle.y += 0.1

      // Remove if faded or sunk too deep
      if (particle.opacity <= 0 || particle.y > height + 20) {
        return false
      }
      return true
    }

    // Apply gravity
    particle.vy += PHYSICS.gravity

    // Get compaction at current position
    const compaction = getCompactionAtY(particle.y)

    // Compaction affects particle movement
    if (compaction > 0.5) {
      // High compaction - particles slow down and may get stuck
      particle.vy *= (1 - compaction * 0.1)
      particle.vx *= 0.95

      // Random chance to get stuck based on compaction
      if (Math.random() < compaction * 0.05) {
        particle.stuck = true
        particle.vx = 0
        particle.vy = 0
      }
    }

    // Apply friction
    particle.vx *= PHYSICS.friction
    particle.vy *= PHYSICS.friction

    // Update position
    particle.x += particle.vx
    particle.y += particle.vy

    // Bounce off walls
    if (particle.x < particle.radius) {
      particle.x = particle.radius
      particle.vx *= -PHYSICS.bounce
    }
    if (particle.x > width - particle.radius) {
      particle.x = width - particle.radius
      particle.vx *= -PHYSICS.bounce
    }

    // Update current layer
    const currentLayer = getLayerAtY(particle.y)
    particle.layer = currentLayer?.id || null

    // Remove if off bottom
    if (particle.y > height + 20) {
      return false
    }

    return true
  }, [width, height, getCompactionAtY, getLayerAtY])

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || width === 0 || height === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTime = performance.now()
    let spawnAccumulator = 0

    const animate = (currentTime: number) => {
      const deltaTime = Math.min(currentTime - lastTime, 32) // Cap at ~30fps minimum
      lastTime = currentTime

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Spawn new particles
      const spawnRate = isRaining ? PHYSICS.spawnRate : PHYSICS.drizzleRate
      spawnAccumulator += spawnRate

      while (spawnAccumulator >= 1 && particlesRef.current.length < PHYSICS.maxParticles) {
        particlesRef.current.push(createParticle(isRaining))
        spawnAccumulator -= 1
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        const alive = updateParticle(particle, deltaTime)

        if (alive) {
          drawParticle(ctx, particle)
        }

        return alive
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [width, height, isRaining, createParticle, updateParticle])

  // Draw a single particle with glow effect
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, radius, opacity, stuck } = particle

    // Outer glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3)
    gradient.addColorStop(0, `rgba(0, 212, 255, ${opacity * 0.8})`)
    gradient.addColorStop(0.4, `rgba(0, 180, 220, ${opacity * 0.4})`)
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0)')

    ctx.beginPath()
    ctx.arc(x, y, radius * 3, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // Inner bright core
    const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
    coreGradient.addColorStop(0.5, `rgba(0, 220, 255, ${opacity * 0.9})`)
    coreGradient.addColorStop(1, `rgba(0, 180, 220, ${opacity * 0.6})`)

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = coreGradient
    ctx.fill()

    // If stuck, add red tint
    if (stuck) {
      ctx.beginPath()
      ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 100, 100, ${opacity * 0.3})`
      ctx.fill()
    }
  }

  // Trigger burst of particles when rain starts
  useEffect(() => {
    if (isRaining) {
      // Create initial burst
      for (let i = 0; i < 30; i++) {
        if (particlesRef.current.length < PHYSICS.maxParticles) {
          particlesRef.current.push(createParticle(true))
        }
      }
    }
  }, [isRaining, createParticle])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    />
  )
}
