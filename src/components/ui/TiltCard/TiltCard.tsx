'use client'

import { useRef, ReactNode, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './TiltCard.module.css'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  glowColor?: string
  showGlow?: boolean
  scale?: number
  perspective?: number
}

export default function TiltCard({
  children,
  className = '',
  tiltAmount = 15,
  glowColor = 'rgba(212, 168, 75, 0.15)',
  showGlow = true,
  scale = 1.02,
  perspective = 1000
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Motion values for tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring config for smooth movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Transform mouse position to rotation
  const rotateX = useTransform(springY, [-0.5, 0.5], [tiltAmount, -tiltAmount])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-tiltAmount, tiltAmount])

  // Glow position
  const glowX = useTransform(springX, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(springY, [-0.5, 0.5], [0, 100])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return

    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    // Normalize mouse position to -0.5 to 0.5
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  if (prefersReducedMotion) {
    return (
      <div className={`${styles.tiltCard} ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.tiltCard} ${className}`}
      style={{
        rotateX,
        rotateY,
        transformPerspective: perspective,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
    >
      {/* Glow effect layer */}
      {showGlow && (
        <motion.div 
          className={styles.glow}
          style={{
            background: `radial-gradient(600px circle at ${glowX}% ${glowY}%, ${glowColor}, transparent 40%)`
          }}
        />
      )}

      {/* Content with z-depth effect */}
      <div className={styles.content} style={{ transform: 'translateZ(30px)' }}>
        {children}
      </div>
    </motion.div>
  )
}
