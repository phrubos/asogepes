'use client'

import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Page transition template
 * Note: In Next.js App Router, AnimatePresence exit animations don't work
 * because the old page is immediately unmounted. We only animate the entrance.
 */
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 15,
  },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  
  // Skip animation if user prefers reduced motion
  if (prefersReducedMotion) {
    return <>{children}</>
  }
  
  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
