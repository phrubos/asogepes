'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  variant?: 'fade' | 'slide' | 'scale'
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.98, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.99, y: -5 }
  }
}

const pageTransition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1], // Custom ease-out-expo
  duration: 0.4,
}

const reducedMotionTransition = {
  duration: 0
}

export default function PageTransition({ 
  children, 
  variant = 'scale' 
}: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion()
  
  if (prefersReducedMotion) {
    return <div style={{ width: '100%' }}>{children}</div>
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
      transition={prefersReducedMotion ? reducedMotionTransition : pageTransition}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
