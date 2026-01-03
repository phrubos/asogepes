'use client'

import { useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './PageNavigation.module.css'

const pages = [
  { path: '/', label: 'Főoldal' },
  { path: '/problema', label: 'Probléma' },
  { path: '/technologia', label: 'Technológia' },
  { path: '/kutatas', label: 'Kutatás' },
]

export default function PageNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  
  const currentIndex = pages.findIndex(p => p.path === pathname)
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      if (e.key === 'ArrowLeft' && prevPage) {
        handleNavigate(prevPage.path)
      } else if (e.key === 'ArrowRight' && nextPage) {
        handleNavigate(nextPage.path)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prevPage, nextPage, handleNavigate])

  return (
    <>
      {/* Left Arrow */}
      {prevPage && (
        <div
          className={`${styles.navZone} ${styles.leftZone}`}
          onClick={() => handleNavigate(prevPage.path)}
        >
          <div className={styles.navArrow}>
            <ChevronLeft size={28} strokeWidth={2} />
          </div>
        </div>
      )}

      {/* Right Arrow */}
      {nextPage && (
        <div
          className={`${styles.navZone} ${styles.rightZone}`}
          onClick={() => handleNavigate(nextPage.path)}
        >
          <div className={styles.navArrow}>
            <ChevronRight size={28} strokeWidth={2} />
          </div>
        </div>
      )}
    </>
  )
}
