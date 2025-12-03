'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseCountUpOptions {
  start?: number
  end: number
  duration?: number
  delay?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals = 0
}: UseCountUpOptions) {
  const [count, setCount] = useState(start)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  // Intersection Observer to trigger animation when element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsInView(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [hasAnimated])

  // Animation logic
  useEffect(() => {
    if (!isInView || hasAnimated) return

    const startTime = performance.now() + delay
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (currentTime < startTime) {
        animationFrame = requestAnimationFrame(animate)
        return
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const currentValue = start + (end - start) * easeProgress
      setCount(currentValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setHasAnimated(true)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isInView, hasAnimated, start, end, duration, delay])

  const formattedCount = `${prefix}${count.toFixed(decimals)}${suffix}`

  return {
    count,
    formattedCount,
    elementRef,
    isAnimating: isInView && !hasAnimated
  }
}

export default useCountUp
