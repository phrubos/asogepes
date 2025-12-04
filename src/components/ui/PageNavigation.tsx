'use client'

import { useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './PageNavigation.module.css'

const pages = [
  { path: '/', label: 'Főoldal' },
  { path: '/problema', label: 'A Probléma' },
  { path: '/megoldas', label: 'Megoldás' },
  { path: '/kiserlet', label: 'Kísérletek' },
  { path: '/eredmenyek', label: 'Eredmények' },
]

const lineWidths = [24, 40, 32, 20]

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

  const isLightPage = pathname === '/problema' || pathname === '/kiserlet'

  return (
    <>
      {/* Left Navigation Zone */}
      <AnimatePresence>
        {prevPage && (
          <motion.div
            key="prev-zone"
            className={`${styles.navZone} ${styles.leftZone} ${isLightPage ? styles.lightMode : ''}`}
            onClick={() => handleNavigate(prevPage.path)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow Effect */}
            <div className={styles.navGlow} />
            
            {/* Decorative Lines */}
            <div className={styles.navLines}>
              {lineWidths.map((width, i) => (
                <div
                  key={i}
                  className={styles.navLine}
                  style={{ width, transitionDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>

            {/* Expanding Ring */}
            <div className={styles.navRing} />

            {/* Button */}
            <div className={styles.navButton}>
              <ChevronLeft strokeWidth={1.5} />
            </div>

            {/* Tooltip */}
            <span className={styles.tooltip}>{prevPage.label}</span>

            {/* Progress Dots */}
            <div className={styles.navProgress}>
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.progressDot} ${i === currentIndex ? styles.active : ''}`}
                  style={{ transitionDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Navigation Zone */}
      <AnimatePresence>
        {nextPage && (
          <motion.div
            key="next-zone"
            className={`${styles.navZone} ${styles.rightZone} ${isLightPage ? styles.lightMode : ''}`}
            onClick={() => handleNavigate(nextPage.path)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow Effect */}
            <div className={styles.navGlow} />
            
            {/* Decorative Lines */}
            <div className={styles.navLines}>
              {lineWidths.map((width, i) => (
                <div
                  key={i}
                  className={styles.navLine}
                  style={{ width, transitionDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>

            {/* Expanding Ring */}
            <div className={styles.navRing} />

            {/* Button */}
            <div className={styles.navButton}>
              <ChevronRight strokeWidth={1.5} />
            </div>

            {/* Tooltip */}
            <span className={styles.tooltip}>{nextPage.label}</span>

            {/* Progress Dots */}
            <div className={styles.navProgress}>
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.progressDot} ${i === currentIndex ? styles.active : ''}`}
                  style={{ transitionDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
