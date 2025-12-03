'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            // Start animation
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
              
              setCount(easeProgress * value)

              if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
              } else {
                setHasAnimated(true)
              }
            }

            animationFrame = requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.3 }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [value, duration, delay, hasAnimated])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{count.toFixed(decimals)}{suffix}
    </motion.span>
  )
}
