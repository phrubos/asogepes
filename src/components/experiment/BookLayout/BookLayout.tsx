'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SoilLoader from '@/components/ui/SoilLoader'
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

// Context for child components to control navigation
import { createContext, useContext } from 'react'

interface BookContextType {
  goToPage: (index: number) => void
  pages: BookPage[]
  currentPage: number
}

const BookContext = createContext<BookContextType | null>(null)

export const useBookNav = () => {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error('useBookNav must be used within a BookLayout')
  }
  return context
}

export default function BookLayout({ pages }: BookLayoutProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollCountRef = useRef(0)
  const scrollDirectionRef = useRef<'up' | 'down' | null>(null)

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

  // Wheel navigation (requires 3 scrolls to change page)
  useEffect(() => {
    let resetTimeout: NodeJS.Timeout | null = null
    const SCROLLS_REQUIRED = 3

    const handleWheel = (e: WheelEvent) => {
      // Allow normal scrolling inside page content if it has scrollable area
      const target = e.target as HTMLElement
      const scrollable = target.closest(`.${styles.pageContent}`)
      if (scrollable) {
        if (e.deltaY > 0 && scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight) return
        if (e.deltaY < 0 && scrollable.scrollTop > 0) return
      }

      if (isAnimating) return

      // Determine scroll direction
      const currentDirection = e.deltaY > 0 ? 'down' : 'up'

      // Reset counter if direction changed or timeout expired
      if (scrollDirectionRef.current !== currentDirection) {
        scrollCountRef.current = 0
        scrollDirectionRef.current = currentDirection
      }

      // Clear previous reset timeout
      if (resetTimeout) clearTimeout(resetTimeout)

      // Reset counter after 800ms of no scrolling
      resetTimeout = setTimeout(() => {
        scrollCountRef.current = 0
        scrollDirectionRef.current = null
      }, 800)

      // Only count significant scroll events
      if (Math.abs(e.deltaY) > 30) {
        scrollCountRef.current++

        // Change page after required number of scrolls
        if (scrollCountRef.current >= SCROLLS_REQUIRED) {
          scrollCountRef.current = 0
          scrollDirectionRef.current = null

          if (currentDirection === 'down') {
            nextPage()
          } else {
            prevPage()
          }
        }
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
      if (resetTimeout) clearTimeout(resetTimeout)
    }
  }, [nextPage, prevPage, isAnimating])

  // Failsafe: Reset isAnimating if it gets stuck
  useEffect(() => {
    if (!isAnimating) return

    const failsafe = setTimeout(() => {
      console.warn('Animation failsafe triggered in BookLayout')
      setIsAnimating(false)
    }, 3000)

    return () => clearTimeout(failsafe)
  }, [isAnimating])

  // Get unique sections for navigation
  const sections = pages.reduce((acc, page) => {
    if (!acc.find(s => s.section === page.section)) {
      acc.push({ section: page.section, sectionIndex: page.sectionIndex, firstPageIndex: pages.findIndex(p => p.section === page.section) })
    }
    return acc
  }, [] as { section: string; sectionIndex: number; firstPageIndex: number }[])

  const currentPageData = pages[currentPage]

  // Calculate progress for the timeline line
  const activeSectionIndex = sections.findIndex(s => s.section === currentPageData?.section)
  const progressPercentage = ((activeSectionIndex) / (sections.length - 1)) * 100

  return (
    <BookContext.Provider value={{ goToPage, pages, currentPage }}>
      <div ref={containerRef} className={styles.bookContainer}>
        {/* Left Sidebar Navigation (Timeline) */}
        <nav className={styles.sidebar}>
          <div className={styles.sidebarContent}>

            {/* Timeline Track Line */}
            <div className={styles.timelineTrack}>
              <motion.div
                className={styles.timelineProgress}
                initial={{ height: 0 }}
                animate={{ height: `${progressPercentage}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>

            {/* Sections List */}
            <div className={styles.sectionNav}>
              <LayoutGroup>
                {sections.map((section, idx) => {
                  const isActive = currentPageData?.section === section.section
                  const isPast = activeSectionIndex > idx
                  const sectionPages = pages.filter(p => p.section === section.section)

                  return (
                    <div
                      key={section.section}
                      className={`${styles.sectionGroup} ${isActive ? styles.active : ''} ${isPast ? styles.past : ''}`}
                      onClick={() => goToPage(section.firstPageIndex)}
                    >
                      {/* Circle Marker */}
                      <div className={styles.markerWrapper}>
                        <motion.div
                          className={styles.marker}
                          layoutId={`marker-${section.section}`}
                        />
                      </div>

                      {/* Label Header */}
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>
                          {String(idx).padStart(2, '0')}
                        </span>
                        <span className={styles.sectionLabel}>{section.section}</span>
                      </div>

                      {/* Sub-pages List (Only for active section) */}
                      <AnimatePresence>
                        {isActive && sectionPages.length > 0 && (
                          <motion.div
                            className={styles.subPages}
                            initial={{ opacity: 0, height: 0, x: -10 }}
                            animate={{ opacity: 1, height: 'auto', x: 0 }}
                            exit={{ opacity: 0, height: 0, x: -10 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          >
                            {sectionPages.map((page, pageIdx) => {
                              const isPageActive = page.id === currentPageData?.id
                              return (
                                <button
                                  key={page.id}
                                  className={`${styles.subPageBtn} ${isPageActive ? styles.activeBtn : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent clicking parent section
                                    goToPage(pages.findIndex(p => p.id === page.id))
                                  }}
                                >
                                  {page.title}
                                </button>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </LayoutGroup>
            </div>
          </div>
        </nav>

        {/* Book Content Area */}
        <main className={styles.bookContent}>
          <div className={styles.pageWrapper}>
            <AnimatePresence
              initial={true}
              custom={direction}
              mode="wait"
              onExitComplete={() => {
                // Short delay to ensure the new page is ready and to show the loader meaningfully
                setTimeout(() => setIsAnimating(false), 400)
              }}
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

            {/* Premium Loading State Overlay */}
            <AnimatePresence>
              {isAnimating && (
                <motion.div
                  className={styles.loaderOverlay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.loaderContent}>
                    <SoilLoader size="lg" />
                    <motion.span
                      className={styles.loaderText}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Betöltés....
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Premium Interactive Navigation Control Bar */}
          <motion.div
            className={styles.navControlBar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 120, damping: 20 }}
          >
            <button
              className={styles.navBtn}
              onClick={prevPage}
              disabled={currentPage === 0 || isAnimating}
              aria-label="Előző oldal"
              title="Előző oldal"
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.navDivider} />

            <div className={styles.navInfo}>
              <span className={styles.navLabel}>OLDAL</span>
              <span className={styles.navCounter}>
                {currentPage + 1} / {pages.length}
              </span>
            </div>

            <div className={styles.navDivider} />

            <button
              className={styles.navBtn}
              onClick={nextPage}
              disabled={currentPage === pages.length - 1 || isAnimating}
              aria-label="Következő oldal"
              title="Következő oldal"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        </main>
      </div>
    </BookContext.Provider>
  )
}
