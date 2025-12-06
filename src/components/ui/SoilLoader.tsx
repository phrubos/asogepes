'use client'

import { motion } from 'framer-motion'

interface SoilLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 40,
  md: 60,
  lg: 80
}

export default function SoilLoader({ size = 'md', className = '' }: SoilLoaderProps) {
  const dimension = sizes[size]
  const ringWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4
  const centerSize = size === 'sm' ? 8 : size === 'md' ? 12 : 16

  return (
    <div 
      className={className}
      style={{ 
        width: dimension, 
        height: dimension, 
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Outer ring - Gold */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          border: `${ringWidth}px solid transparent`,
          borderTopColor: 'var(--color-gold, #d4a84b)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Middle ring - Green */}
      <motion.div
        style={{
          position: 'absolute',
          inset: dimension * 0.13,
          border: `${ringWidth}px solid transparent`,
          borderTopColor: 'var(--color-sage, #6b8b5e)',
          borderRadius: '50%',
        }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Inner ring - Muted */}
      <motion.div
        style={{
          position: 'absolute',
          inset: dimension * 0.27,
          border: `${ringWidth}px solid transparent`,
          borderTopColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Center dot - Pulsing */}
      <motion.div
        style={{
          width: centerSize,
          height: centerSize,
          background: 'var(--color-gold, #d4a84b)',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 0.8, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
