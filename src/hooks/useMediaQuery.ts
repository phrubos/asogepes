'use client'

import { useState, useEffect } from 'react'

/**
 * Tracks a CSS media query. Returns null until mounted (the server cannot know the viewport),
 * so callers can render the layout that CSS already shows and mount heavy extras only when it matches.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
