import { useState, useEffect } from 'react'

/**
 * Custom hook for responsive media queries
 * @param query - CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Handle SSR - return false during server-side rendering
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Create event listener
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } 
    // Legacy browsers
    else if (media.addListener) {
      media.addListener(listener)
      return () => media.removeListener(listener)
    }
  }, [query])

  return matches
}

/**
 * Hook to detect mobile devices (max-width: 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

/**
 * Hook to detect tablet devices (max-width: 1024px)
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(max-width: 1024px)')
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Hook to get responsive particle count based on viewport
 * @param baseCount - Base particle count for desktop
 * @returns Optimized particle count
 */
export function useResponsiveParticleCount(baseCount: number): number {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  
  if (isMobile) return Math.floor(baseCount * 0.3) // 30% on mobile
  if (isTablet) return Math.floor(baseCount * 0.6) // 60% on tablet
  return baseCount // 100% on desktop
}