'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import styles from './OptimizedImage.module.css'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  placeholderColor?: string
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  placeholderColor = 'var(--color-cream-dark)',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div 
      className={`${styles.imageWrapper} ${className}`}
      style={{ '--placeholder-color': placeholderColor } as React.CSSProperties}
    >
      {!isLoaded && !hasError && (
        <div className={styles.placeholder} />
      )}
      {hasError ? (
        <div className={styles.errorState}>
          <span>Kép nem elérhető</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  )
}
