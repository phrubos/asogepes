'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './SoilHero.module.css'
import { NavButtonProps } from './types'

export default function NavButton({
  item,
  index,
  isHovered,
  onHover,
  onClick,
}: NavButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    onHover(item.id)
  }

  const handleMouseLeave = () => {
    onHover(null)
  }

  const handleClick = (e: React.MouseEvent) => {
    // Add ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }
      setRipples((prev) => [...prev, newRipple])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
      }, 800)
    }
    onClick()
  }

  // Calculate vertical position based on soil depth
  // Matches: sky=22%, topSoil=22-48%, middleSoil=48-74%, deepSoil=74%+
  const getTopPosition = () => {
    // Adjusted positions to ensure all buttons are visible within viewport
    // Aligned with new compressed soil layers (Sky 8%, Layers 20%)
    // Targets: ~18% (Top), ~38% (Middle), ~58% (Deep)
    const positions = ['18%', '38%', '58%']
    return positions[index] || '50%'
  }

  return (
    <motion.div
      ref={buttonRef}
      className={styles.navButtonWrapper}
      style={{
        top: getTopPosition(),
        right: '4%',
        transform: 'translateY(-50%)',
      }}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 1.6 + index * 0.12,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Subtle glow effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.navButtonGlow}
            style={{ backgroundColor: item.soilColor }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Main button card */}
      <motion.div
        className={styles.navButton}
        style={{
          borderLeftColor: item.soilColor,
        }}
        animate={{
          scale: isPressed ? 0.98 : isHovered ? 1.03 : 1,
          y: isHovered ? -6 : 0,
          boxShadow: isHovered
            ? '0 20px 50px rgba(92, 77, 61, 0.25)'
            : '0 8px 32px rgba(92, 77, 61, 0.12)',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      >
        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: `${item.soilColor}40`,
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Depth badge */}
        <motion.span
          className={styles.depthBadge}
          style={{ backgroundColor: item.soilColor }}
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {item.depth}
        </motion.span>

        {/* Number */}
        <div className={styles.navNumber}>{item.number}</div>

        {/* Divider line with animation */}
        <motion.div
          className={styles.navDivider}
          style={{ backgroundColor: item.soilColor }}
          animate={{
            width: isHovered ? 50 : 36,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Title */}
        <h3 className={styles.navTitle}>{item.title}</h3>

        {/* Description */}
        <p className={styles.navDescription}>{item.description}</p>

        {/* Arrow indicator */}
        <motion.div
          className={styles.navArrow}
          animate={{
            x: isHovered ? 6 : 0,
            opacity: isHovered ? 1 : 0.6,
          }}
          transition={{ duration: 0.2 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10H16M16 10L11 5M16 10L11 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Connection line indicator (shows when hovered) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className={styles.connectionIndicator}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: item.soilColor }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle highlight effect - no animation loop */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.pulseRing}
            style={{ borderColor: item.soilColor }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1.02, opacity: 0.3 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
