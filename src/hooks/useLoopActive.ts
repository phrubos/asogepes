'use client'

import type { RefObject } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

/**
 * Whether an endless (decorative) animation should run: only while its element is near the viewport
 * and the user has not asked for reduced motion. Offscreen loops otherwise keep the main thread busy
 * on phones (Framer writes attributes every frame even when nothing is visible).
 */
export function useLoopActive(ref: RefObject<Element | null>): boolean {
  const inView = useInView(ref, { margin: '100px' })
  const reduced = useReducedMotion()
  return inView && !reduced
}
