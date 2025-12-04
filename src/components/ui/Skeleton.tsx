'use client'

import styles from './Skeleton.module.css'

interface SkeletonProps {
  variant?: 'text' | 'title' | 'card' | 'image' | 'circle'
  width?: string
  height?: string
  className?: string
}

export default function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  className = '' 
}: SkeletonProps) {
  const variantClass = styles[variant] || styles.text

  return (
    <div 
      className={`${styles.skeleton} ${variantClass} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

// Predefined skeleton layouts
export function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <Skeleton variant="image" height="200px" />
      <div className={styles.cardSkeletonContent}>
        <Skeleton variant="title" width="70%" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className={styles.statSkeleton}>
      <Skeleton variant="title" width="60%" height="3rem" />
      <Skeleton variant="text" width="40%" />
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className={styles.heroSkeleton}>
      <Skeleton variant="text" width="200px" />
      <Skeleton variant="title" width="80%" height="4rem" />
      <Skeleton variant="title" width="60%" height="4rem" />
      <Skeleton variant="text" width="70%" height="1.5rem" />
      <div className={styles.heroStatsSkeleton}>
        <StatSkeleton />
        <StatSkeleton />
      </div>
    </div>
  )
}
