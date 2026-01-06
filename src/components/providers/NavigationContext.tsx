'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface NavigationContextType {
    isNavigating: boolean
    startNavigating: () => void
    stopNavigating: () => void
}

const NavigationContext = createContext<NavigationContextType | null>(null)

export const useNavigation = () => {
    const context = useContext(NavigationContext)
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider')
    }
    return context
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [isNavigating, setIsNavigating] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const startNavigating = useCallback(() => {
        setIsNavigating(true)
    }, [])

    const stopNavigating = useCallback(() => {
        setIsNavigating(false)
    }, [])

    // Stop navigating when route changes
    useEffect(() => {
        setIsNavigating(false)
    }, [pathname, searchParams])

    return (
        <NavigationContext.Provider value={{ isNavigating, startNavigating, stopNavigating }}>
            {children}
        </NavigationContext.Provider>
    )
}
