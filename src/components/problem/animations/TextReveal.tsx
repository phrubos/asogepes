'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface TextRevealProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  type?: 'chars' | 'words' | 'lines'
  stagger?: number
  duration?: number
  delay?: number
  className?: string
  once?: boolean
}

export default function TextReveal({
  children,
  as: Tag = 'p',
  type = 'words',
  stagger = 0.05,
  duration = 0.6,
  delay = 0,
  className = '',
  once = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once, margin: '-10% 0px -10% 0px' })
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  // Split text based on type
  const splitText = () => {
    if (type === 'chars') {
      return children.split('').map((char, i) => ({
        content: char === ' ' ? '\u00A0' : char,
        key: i,
      }))
    } else if (type === 'words') {
      return children.split(' ').map((word, i) => ({
        content: word,
        key: i,
      }))
    } else {
      return children.split('\n').map((line, i) => ({
        content: line,
        key: i,
      }))
    }
  }
  
  const items = splitText()
  
  // Simplified animation for mobile
  if (isMobile) {
    return (
      <Tag ref={containerRef as any} className={className}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay }}
        >
          {children}
        </motion.span>
      </Tag>
    )
  }
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      }
    }
  }
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: type === 'lines' ? 40 : 20,
      rotateX: type === 'chars' ? 90 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }

  return (
    <Tag ref={containerRef as any} className={className} style={{ overflow: 'hidden' }}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ 
          display: 'inline-flex', 
          flexWrap: 'wrap',
          perspective: type === 'chars' ? 1000 : undefined,
        }}
      >
        {items.map((item, index) => (
          <motion.span
            key={item.key}
            variants={itemVariants}
            style={{ 
              display: 'inline-block',
              marginRight: type === 'words' ? '0.3em' : undefined,
              transformOrigin: 'center bottom',
              whiteSpace: type === 'lines' ? 'pre-wrap' : 'pre',
            }}
          >
            {item.content}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}

// Typewriter effect for quotes
interface TypewriterProps {
  children: string
  speed?: number
  delay?: number
  className?: string
  cursor?: boolean
  onComplete?: () => void
}

export function Typewriter({
  children,
  speed = 40,
  delay = 0,
  className = '',
  cursor = true,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-20% 0px' })
  
  useEffect(() => {
    if (!isInView) return
    
    let timeoutId: NodeJS.Timeout
    let currentIndex = 0
    
    const startTyping = () => {
      timeoutId = setTimeout(() => {
        if (currentIndex < children.length) {
          setDisplayedText(children.slice(0, currentIndex + 1))
          currentIndex++
          startTyping()
        } else {
          setIsComplete(true)
          onComplete?.()
        }
      }, speed)
    }
    
    const delayTimeout = setTimeout(startTyping, delay)
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(delayTimeout)
    }
  }, [isInView, children, speed, delay, onComplete])

  return (
    <span ref={containerRef} className={className}>
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ marginLeft: 2 }}
        >
          |
        </motion.span>
      )}
    </span>
  )
}

// Highlight text that pulses
interface HighlightTextProps {
  children: string
  color?: string
  className?: string
}

export function HighlightText({
  children,
  color = 'var(--color-green)',
  className = '',
}: HighlightTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ 
        backgroundSize: '0% 100%',
      }}
      animate={isInView ? { 
        backgroundSize: '100% 100%',
      } : {}}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundImage: `linear-gradient(transparent 60%, ${color}40 60%)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0',
        fontWeight: 700,
      }}
    >
      {children}
    </motion.span>
  )
}

// Number counter with morphing effect
interface CounterProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: CounterProps) {
  const [count, setCount] = useState(from)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (!isInView) return
    
    const startTime = Date.now() + delay * 1000
    const endTime = startTime + duration * 1000
    
    const updateCount = () => {
      const now = Date.now()
      
      if (now < startTime) {
        requestAnimationFrame(updateCount)
        return
      }
      
      if (now >= endTime) {
        setCount(to)
        return
      }
      
      const progress = (now - startTime) / (duration * 1000)
      const easedProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = from + (to - from) * easedProgress
      
      setCount(current)
      requestAnimationFrame(updateCount)
    }
    
    requestAnimationFrame(updateCount)
  }, [isInView, from, to, duration, delay])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  )
}
