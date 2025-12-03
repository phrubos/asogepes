'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import styles from './ScrollProgress.module.css'

interface ScrollProgressProps {
  color?: 'green' | 'gold'
}

export default function ScrollProgress({ color = 'green' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div 
      className={`${styles.progressBar} ${styles[color]}`}
      style={{ scaleX }}
    />
  )
}
