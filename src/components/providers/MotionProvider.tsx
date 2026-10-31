'use client'

import { MotionConfig } from 'framer-motion'

// Framer Motion follows the OS "reduce motion" setting (transform and layout animations are skipped)
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
