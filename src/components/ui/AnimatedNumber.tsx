'use client'

import { useRef, useState, useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export default function AnimatedNumber({
  value,
  duration = 2000,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = ''
}: AnimatedNumberProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Reduced motion: the final value is rendered directly, nothing to animate
    if (reduced || hasAnimated) return

    let animationFrame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some(entry => entry.isIntersecting)) return
        observer.disconnect()

        const startTime = performance.now() + delay

        const animate = (currentTime: number) => {
          if (currentTime < startTime) {
            animationFrame = requestAnimationFrame(animate)
            return
          }

          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Easing function (easeOutExpo)
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

          setCount(easeProgress * value)

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate)
          } else {
            setHasAnimated(true)
          }
        }

        animationFrame = requestAnimationFrame(animate)
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [value, duration, delay, hasAnimated, reduced])

  const shown = reduced ? value : count

  return (
    <span ref={ref} className={className}>
      {prefix}{shown.toFixed(decimals)}{suffix}
    </span>
  )
}
