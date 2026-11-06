'use client'

import { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface ParallaxOptions {
  speed?: number
  maxOffset?: number
  /** false: no scroll listener, no transform (e.g. phones) */
  enabled?: boolean
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.3, maxOffset = 100, enabled = true } = options
  const [offset, setOffset] = useState(0)
  const isReduced = useReducedMotion()
  const active = enabled && !isReduced

  const handleScroll = useCallback(() => {
    if (!active) return

    const scrollY = window.scrollY
    const newOffset = Math.min(scrollY * speed, maxOffset)
    setOffset(newOffset)
  }, [speed, maxOffset, active])

  useEffect(() => {
    if (!active) {
      setOffset(0)
      return
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, active])

  return {
    offset,
    style: active ? { transform: `translateY(${offset}px)` } : {}
  }
}
