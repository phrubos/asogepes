'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './BookLayout.module.css'

export interface BookPage {
  id: string
  section: string
  sectionIndex: number
  title: string
  component: React.ReactNode
}

interface BookLayoutProps {
  pages: BookPage[]
  children?: React.ReactNode
}

// Page flip animation variants
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    rotateY: direction > 0 ? -15 : 15,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    rotateY: direction < 0 ? -15 : 15,
    scale: 0.95,
  }),
}

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

export default function BookLayout({ pages }: BookLayoutProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Navigate to page
  const goToPage = useCallback((pageIndex: number) => {
    if (isAnimating || pageIndex === currentPage) return
    if (pageIndex < 0 || pageIndex >= pages.length) return

    setDirection(pageIndex > currentPage ? 1 : -1)
    setIsAnimating(true)
    setCurrentPage(pageIndex)
  }, [currentPage, pages.length, isAnimating])

  // Navigation functions
  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, pages.length, goToPage])

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, goToPage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        nextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prevPage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextPage, prevPage])

  // Wheel navigation (debounced)
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout | null = null

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (wheelTimeout || isAnimating) return

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null
      }, 500)

      if (e.deltaY > 30) {
        nextPage()
      } else if (e.deltaY < -30) {
        prevPage()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
      if (wheelTimeout) clearTimeout(wheelTimeout)
    }
  }, [nextPage, prevPage, isAnimating])

  // Get unique sections for navigation
  const sections = pages.reduce((acc, page) => {
    if (!acc.find(s => s.section === page.section)) {
      acc.push({ section: page.section, sectionIndex: page.sectionIndex, firstPageIndex: pages.findIndex(p => p.section === page.section) })
    }
    return acc
  }, [] as { section: string; sectionIndex: number; firstPageIndex: number }[])

  const currentPageData = pages[currentPage]

  return (
    <div ref={containerRef} className={styles.bookContainer}>
      {/* Left Navigation Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          {/* Section indicators */}
          <div className={styles.sectionNav}>
            {sections.map((section, idx) => {
              const isActive = currentPageData?.section === section.section
              const sectionPages = pages.filter(p => p.section === section.section)
              const currentSectionPageIndex = sectionPages.findIndex(p => p.id === currentPageData?.id)

              return (
                <div key={section.section} className={styles.sectionGroup}>
                  <button
                    className={`${styles.sectionButton} ${isActive ? styles.active : ''}`}
                    onClick={() => goToPage(section.firstPageIndex)}
                    aria-label={`Go to ${section.section}`}
                  >
                    <span className={styles.sectionNumber}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.sectionLabel}>{section.section}</span>
                  </button>

                  {/* Page dots within section */}
                  {isActive && sectionPages.length > 1 && (
                    <motion.div
                      className={styles.pageDots}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {sectionPages.map((page, pageIdx) => (
                        <button
                          key={page.id}
                          className={`${styles.pageDot} ${currentSectionPageIndex === pageIdx ? styles.dotActive : ''}`}
                          onClick={() => goToPage(pages.findIndex(p => p.id === page.id))}
                          aria-label={`Page ${pageIdx + 1}`}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Page counter */}
          <div className={styles.pageCounter}>
            <span className={styles.currentPageNum}>{currentPage + 1}</span>
            <span className={styles.pageDivider}>/</span>
            <span className={styles.totalPages}>{pages.length}</span>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className={styles.navArrows}>
          <button
            className={`${styles.navArrow} ${styles.navPrev}`}
            onClick={prevPage}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className={`${styles.navArrow} ${styles.navNext}`}
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            aria-label="Next page"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Book Content Area */}
      <main className={styles.bookContent}>
        <div className={styles.pageWrapper}>
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="wait"
            onExitComplete={() => setIsAnimating(false)}
          >
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className={styles.page}
            >
              {/* Page corner decoration */}
              <div className={styles.pageCorner} />

              {/* Page content */}
              <div className={styles.pageContent}>
                {currentPageData?.component}
              </div>

              {/* Page shadow effect */}
              <div className={styles.pageShadow} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation hint */}
        <motion.div
          className={styles.navHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className={styles.hintKey}>←</span>
          <span className={styles.hintKey}>→</span>
          <span className={styles.hintText}>vagy görgess a lapozáshoz</span>
        </motion.div>
      </main>
    </div>
  )
}
