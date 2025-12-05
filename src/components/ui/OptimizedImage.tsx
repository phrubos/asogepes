'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image, { ImageProps } from 'next/image'
import styles from './OptimizedImage.module.css'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  placeholderColor?: string
  blurDataURL?: string
  showBlurPlaceholder?: boolean
  animateOnLoad?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  placeholderColor = 'var(--color-cream-dark)',
  blurDataURL,
  showBlurPlaceholder = true,
  animateOnLoad = true,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Animation variants
  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 1.05,
      filter: showBlurPlaceholder ? 'blur(10px)' : 'none'
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const placeholderVariants = {
    visible: { opacity: 1 },
    hidden: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }

  // If reduced motion and already has blur data, use Next.js built-in blur
  if (prefersReducedMotion && blurDataURL) {
    return (
      <div 
        className={`${styles.imageWrapper} ${className}`}
        style={{ '--placeholder-color': placeholderColor } as React.CSSProperties}
      >
        {hasError ? (
          <div className={styles.errorState}>
            <span>Kép nem elérhető</span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            className={styles.image}
            placeholder="blur"
            blurDataURL={blurDataURL}
            onError={() => setHasError(true)}
            loading="lazy"
            {...props}
          />
        )}
      </div>
    )
  }

  return (
    <div 
      className={`${styles.imageWrapper} ${className}`}
      style={{ '--placeholder-color': placeholderColor } as React.CSSProperties}
    >
      {/* Animated placeholder */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div 
            className={styles.placeholder}
            variants={placeholderVariants}
            initial="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>

      {hasError ? (
        <div className={styles.errorState}>
          <span>Kép nem elérhető</span>
        </div>
      ) : (
        <motion.div
          className={styles.imageContainer}
          variants={animateOnLoad ? imageVariants : undefined}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
        >
          <Image
            src={src}
            alt={alt}
            className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            loading="lazy"
            {...props}
          />
        </motion.div>
      )}
    </div>
  )
}
