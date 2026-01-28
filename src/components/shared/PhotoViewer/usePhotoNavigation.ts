import { useState, useCallback, useEffect } from 'react'

interface UsePhotoNavigationProps {
    totalItems: number
    initialIndex?: number
}

export function usePhotoNavigation({ totalItems, initialIndex = 0 }: UsePhotoNavigationProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems)
    }, [totalItems])

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems)
    }, [totalItems])

    const setIndex = useCallback((index: number) => {
        if (index >= 0 && index < totalItems) {
            setCurrentIndex(index)
        }
    }, [totalItems])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [next, prev])

    return {
        currentIndex,
        next,
        prev,
        setIndex
    }
}
