'use client'

import { useRef, useState, ReactNode, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './MagneticButton.module.css'

interface RippleType {
  x: number
  y: number
  id: number
}

interface MagneticButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  onClick?: () => void
  magneticStrength?: number
  showRipple?: boolean
  showShine?: boolean
  showGlow?: boolean
  ariaLabel?: string
}

export default function MagneticButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  magneticStrength = 0.3,
  showRipple = true,
  showShine = true,
  showGlow = true,
  ariaLabel
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<RippleType[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Motion values for magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring config for smooth magnetic movement
  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  // Transform for 3D rotation effect
  const rotateX = useTransform(springY, [-20, 20], [5, -5])
  const rotateY = useTransform(springX, [-20, 20], [-5, 5])

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || disabled) return

    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    x.set(distanceX * magneticStrength)
    y.set(distanceY * magneticStrength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    // Create ripple effect
    if (showRipple && !prefersReducedMotion) {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        const ripple = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          id: Date.now()
        }
        setRipples(prev => [...prev, ripple])

        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== ripple.id))
        }, 600)
      }
    }

    onClick?.()
  }

  const buttonClasses = [
    styles.magneticButton,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    isHovered && showGlow && styles.glowing,
    className
  ].filter(Boolean).join(' ')

  return (
    <motion.button
      ref={buttonRef}
      className={buttonClasses}
      style={{
        x: prefersReducedMotion ? 0 : springX,
        y: prefersReducedMotion ? 0 : springY,
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileTap={!disabled && !prefersReducedMotion ? { scale: 0.97 } : undefined}
    >
      {/* Shine sweep effect */}
      {showShine && !prefersReducedMotion && (
        <span className={`${styles.shine} ${isHovered ? styles.shineActive : ''}`} />
      )}

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      {/* Button content */}
      <span className={styles.content}>
        {children}
      </span>
    </motion.button>
  )
}
