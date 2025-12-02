'use client'

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

export default function PageNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  
  const currentIndex = pages.findIndex(p => p.path === pathname)
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  // Determine page theme for navigation visibility
  // Home, Megoldás, Eredmények are dark. Probléma, Kísérletek are light.
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
          >
            <div className={styles.navButton}>
              <ChevronLeft strokeWidth={1.5} />
            </div>
            <span className={styles.tooltip}>{prevPage.label}</span>
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
          >
            <div className={styles.navButton}>
              <ChevronRight strokeWidth={1.5} />
            </div>
            <span className={styles.tooltip}>{nextPage.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
