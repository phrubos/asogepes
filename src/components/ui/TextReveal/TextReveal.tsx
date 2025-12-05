'use client'

import { useRef, useMemo } from 'react'
import { motion, useInView, Variants } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './TextReveal.module.css'

type RevealType = 'char' | 'word' | 'line' | 'blur' | 'gradient'

interface TextRevealProps {
  children: string
  type?: RevealType
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  delay?: number
  duration?: number
  staggerDelay?: number
  highlightWords?: string[]
  highlightClassName?: string
  once?: boolean
  threshold?: number
}

export default function TextReveal({
  children,
  type = 'word',
  className = '',
  tag: Tag = 'div',
  delay = 0,
  duration = 0.5,
  staggerDelay,
  highlightWords = [],
  highlightClassName = '',
  once = true,
  threshold = 0.3
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once, amount: threshold })
  const prefersReducedMotion = useReducedMotion()

  // Calculate stagger based on type
  const defaultStagger = useMemo(() => {
    switch (type) {
      case 'char': return 0.02
      case 'word': return 0.08
      case 'line': return 0.15
      case 'blur': return 0.06
      default: return 0.05
    }
  }, [type])

  const actualStagger = staggerDelay ?? defaultStagger

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: actualStagger,
        delayChildren: delay
      }
    }
  }

  const getItemVariants = (): Variants => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
      }
    }

    switch (type) {
      case 'char':
      case 'word':
        return {
          hidden: { 
            opacity: 0, 
            y: 20,
            rotateX: 20
          },
          visible: { 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            transition: { 
              duration,
              ease: [0.22, 1, 0.36, 1]
            }
          }
        }
      case 'line':
        return {
          hidden: { 
            y: '100%'
          },
          visible: { 
            y: 0,
            transition: { 
              duration: duration * 1.2,
              ease: [0.22, 1, 0.36, 1]
            }
          }
        }
      case 'blur':
        return {
          hidden: { 
            opacity: 0, 
            filter: 'blur(10px)',
            scale: 1.05
          },
          visible: { 
            opacity: 1, 
            filter: 'blur(0px)',
            scale: 1,
            transition: { 
              duration: duration * 1.2,
              ease: [0.22, 1, 0.36, 1]
            }
          }
        }
      case 'gradient':
        return {
          hidden: { 
            backgroundPosition: '100% 0'
          },
          visible: { 
            backgroundPosition: '0% 0',
            transition: { 
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1]
            }
          }
        }
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration } }
        }
    }
  }

  const itemVariants = getItemVariants()

  // Split text based on type
  const renderContent = () => {
    if (type === 'gradient') {
      return (
        <motion.span
          className={styles.gradientText}
          variants={itemVariants}
        >
          {children}
        </motion.span>
      )
    }

    if (type === 'line') {
      const lines = children.split('\n').filter(Boolean)
      return lines.map((line, lineIndex) => (
        <span key={lineIndex} className={styles.lineWrapper}>
          <motion.span 
            className={styles.lineInner}
            variants={itemVariants}
          >
            {line}
          </motion.span>
        </span>
      ))
    }

    if (type === 'char') {
      const words = children.split(' ')
      return words.map((word, wordIndex) => (
        <span key={wordIndex} className={styles.word}>
          {word.split('').map((char, charIndex) => {
            const isHighlight = highlightWords.some(hw => 
              word.toLowerCase().includes(hw.toLowerCase())
            )
            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className={`${styles.char} ${isHighlight ? highlightClassName || styles.highlight : ''}`}
                variants={itemVariants}
              >
                {char}
              </motion.span>
            )
          })}
          {wordIndex < words.length - 1 && <span className={styles.space}>&nbsp;</span>}
        </span>
      ))
    }

    // Default: word-based
    const words = children.split(' ')
    return words.map((word, index) => {
      const isHighlight = highlightWords.some(hw => 
        word.toLowerCase().includes(hw.toLowerCase())
      )
      return (
        <motion.span
          key={index}
          className={`${styles.word} ${type === 'blur' ? styles.blurWord : ''} ${isHighlight ? highlightClassName || styles.highlight : ''}`}
          variants={itemVariants}
        >
          {word}
          {index < words.length - 1 && <span>&nbsp;</span>}
        </motion.span>
      )
    })
  }

  const containerClass = [
    styles.textReveal,
    styles[type],
    className
  ].filter(Boolean).join(' ')

  return (
    <Tag className={containerClass}>
      <motion.span
        ref={containerRef}
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {renderContent()}
      </motion.span>
    </Tag>
  )
}
