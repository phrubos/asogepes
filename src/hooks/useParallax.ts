'use client'

import { useState, useEffect, useCallback } from 'react'

interface ParallaxOptions {
  speed?: number
  maxOffset?: number
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.3, maxOffset = 100 } = options
  const [offset, setOffset] = useState(0)
  const [isReduced, setIsReduced] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReduced(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleScroll = useCallback(() => {
    if (isReduced) return

    const scrollY = window.scrollY
    const newOffset = Math.min(scrollY * speed, maxOffset)
    setOffset(newOffset)
  }, [speed, maxOffset, isReduced])

  useEffect(() => {
    if (isReduced) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll, isReduced])

  return {
    offset,
    style: isReduced ? {} : { transform: `translateY(${offset}px)` }
  }
}
