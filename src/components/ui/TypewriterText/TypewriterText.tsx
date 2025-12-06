'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './TypewriterText.module.css'

interface TypewriterTextProps {
  children: string
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  loopDelay?: number
  cursor?: boolean
  cursorChar?: string
  loop?: boolean
  startDelay?: number
}

export default function TypewriterText({
  children,
  className = '',
  tag: Tag = 'span',
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  loopDelay = 5000,
  cursor = true,
  cursorChar = '|',
  loop = true,
  startDelay = 0
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  const containerRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.5 })
  const prefersReducedMotion = useReducedMotion()
  
  const fullText = children

  const typeText = useCallback(() => {
    if (prefersReducedMotion) {
      setDisplayText(fullText)
      return
    }

    if (!hasStarted) return

    if (isPaused) return

    if (isTyping && !isDeleting) {
      // Typing phase
      if (displayText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1))
        }, typingSpeed)
        return () => clearTimeout(timeout)
      } else {
        // Finished typing, pause
        setIsPaused(true)
        const timeout = setTimeout(() => {
          setIsPaused(false)
          if (loop) {
            setIsDeleting(true)
          }
        }, pauseDuration)
        return () => clearTimeout(timeout)
      }
    } else if (isDeleting) {
      // Deleting phase
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, deletingSpeed)
        return () => clearTimeout(timeout)
      } else {
        // Finished deleting, wait then restart
        setIsDeleting(false)
        setIsPaused(true)
        const timeout = setTimeout(() => {
          setIsPaused(false)
          setIsTyping(true)
        }, loopDelay - pauseDuration)
        return () => clearTimeout(timeout)
      }
    }
  }, [displayText, fullText, isTyping, isDeleting, isPaused, hasStarted, loop, typingSpeed, deletingSpeed, pauseDuration, loopDelay, prefersReducedMotion])

  // Start delay
  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        setHasStarted(true)
      }, startDelay)
      return () => clearTimeout(timeout)
    }
  }, [isInView, hasStarted, startDelay])

  // Main typing effect
  useEffect(() => {
    return typeText()
  }, [typeText])

  // Reset when out of view (optional - for re-triggering)
  useEffect(() => {
    if (!isInView && loop) {
      // Reset state when scrolling away
      setDisplayText('')
      setIsTyping(true)
      setIsDeleting(false)
      setIsPaused(false)
      setHasStarted(false)
    }
  }, [isInView, loop])

  if (prefersReducedMotion) {
    return (
      <Tag className={className}>
        {fullText}
      </Tag>
    )
  }

  return (
    <Tag className={`${styles.typewriter} ${className}`}>
      <span ref={containerRef} className={styles.textContainer}>
        <span className={styles.text}>{displayText}</span>
        {cursor && (
          <motion.span
            className={styles.cursor}
            animate={{ opacity: [1, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          >
            {cursorChar}
          </motion.span>
        )}
      </span>
    </Tag>
  )
}
