'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function RouteLoadingProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Show loading on initial page load (optional - remove if not wanted)
  useEffect(() => {
    // Small delay to show loader only if page takes time to load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Track route changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  return (
    <>
      <LoadingScreen isLoading={isLoading || isPending} />
      {children}
    </>
  )
}
