'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './BookPage.module.css'

interface BookPageProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  badge?: string
  variant?: 'default' | 'hero' | 'chart' | 'comparison'
  className?: string
}

export default function BookPage({
  children,
  title,
  subtitle,
  badge,
  variant = 'default',
  className = ''
}: BookPageProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(pageRef, { once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div
      ref={pageRef}
      className={`${styles.bookPage} ${styles[variant]} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Page Header */}
      {(badge || title || subtitle) && (
        <motion.header className={styles.pageHeader} variants={itemVariants}>
          {badge && (
            <span className={styles.badge}>{badge}</span>
          )}
          {title && (
            <h2 className={styles.title}>{title}</h2>
          )}
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
          <div className={styles.headerLine} />
        </motion.header>
      )}

      {/* Page Body */}
      <motion.div className={styles.pageBody} variants={itemVariants}>
        {children}
      </motion.div>

      {/* Decorative elements */}
      <div className={styles.pageDecoration}>
        <div className={styles.cornerTopLeft} />
        <div className={styles.cornerBottomRight} />
      </div>
    </motion.div>
  )
}
