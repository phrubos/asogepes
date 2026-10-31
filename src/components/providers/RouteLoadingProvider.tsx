'use client'

import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { useNavigation } from './NavigationContext'

export default function RouteLoadingProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isNavigating } = useNavigation()
  const [isMounting, setIsMounting] = useState(true)

  // Initial mounting loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounting(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingScreen isLoading={isMounting || isNavigating} />
      {children}
    </>
  )
}
