'use client'

import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
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
  scrollToId?: string
  viewGroupId?: string
}

interface BookLayoutProps {
  pages: BookPage[]
  children?: React.ReactNode
  resetEventName?: string
}

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

export default function BookLayout({ pages, resetEventName }: BookLayoutProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)
  const isPopState = useRef(false)
  const navigationSource = useRef<'manual' | 'scroll'>('manual')
  const searchParams = useSearchParams()

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
    type: 'tween',
    duration: 0.4,
    ease: 'easeInOut',
  }

  // Initialize state from URL
  useEffect(() => {
    const pageId = searchParams.get('page')
    if (pageId) {
      const index = pages.findIndex(p => p.id === pageId)
      if (index !== -1 && index !== currentPage) {
        setCurrentPage(index)
        // Replace initial state so back button works correctly to leave the app or go to prev page
        // Only do this if we haven't already set up state (check if history.state matches?)
        // Safe to replace to ensure consistency
        if (!window.history.state || typeof window.history.state.pageIndex !== 'number') {
          window.history.replaceState({ pageIndex: index }, '', window.location.href)
        }
      }
    }
  }, [searchParams, pages]) // React to searchParams changes too!

  // Sync URL with currentPage
  useEffect(() => {
    if (isPopState.current) {
      isPopState.current = false
      return
    }

    const page = pages[currentPage]
    if (!page) return

    const url = new URL(window.location.href)

    // GUARD: Prevent overwriting initial deep link with default page 0 (hero)
    // If we are at page 0, but the URL has a different valid page ID, skip the sync
    // This allows the initialization effect to pick up the correct page first
    const urlPageId = url.searchParams.get('page')
    if (currentPage === 0 && urlPageId && urlPageId !== page.id) {
      const targetIndex = pages.findIndex(p => p.id === urlPageId)
      if (targetIndex !== -1) {
        return
      }
    }

    url.searchParams.set('page', page.id)

    if (navigationSource.current === 'manual') {
      window.history.pushState({ pageIndex: currentPage }, '', url)
    } else {
      window.history.replaceState({ pageIndex: currentPage }, '', url)
    }
  }, [currentPage, pages])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.pageIndex === 'number') {
        isPopState.current = true
        navigationSource.current = 'manual' // Treat popstate as manual nav
        setCurrentPage(event.state.pageIndex)
      } else {
        // Fallback to URL parsing if state is missing (e.g. external link return)
        const params = new URLSearchParams(window.location.search)
        const pageId = params.get('page')
        if (pageId) {
          const index = pages.findIndex(p => p.id === pageId)
          if (index !== -1) {
            isPopState.current = true
            navigationSource.current = 'manual'
            setCurrentPage(index)
          }
        } else {
          // If no state and no param, go to 0?
          // Only if we are not at 0?
          if (currentPage !== 0) {
            isPopState.current = true
            navigationSource.current = 'manual'
            setCurrentPage(0)
          }
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [pages, currentPage])

  // Disable browser auto-scroll restoration as we handle it manually
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  // Navigate to page
  const goToPage = useCallback((pageIndex: number) => {
    if (isAnimating || pageIndex === currentPage) return
    if (pageIndex < 0 || pageIndex >= pages.length) return

    navigationSource.current = 'manual' // Mark as manual navigation

    const targetPage = pages[pageIndex]
    const currentPageData = pages[currentPage]

    // Check if we are staying in the same view group
    const isSameGroup = targetPage.viewGroupId && currentPageData.viewGroupId &&
      targetPage.viewGroupId === currentPageData.viewGroupId

    // Lock scroll-spy to prevent reverting navigation
    isProgrammaticScroll.current = true
    setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 1000)

    if (isSameGroup) {
      setCurrentPage(pageIndex)
      return
    }

    setDirection(pageIndex > currentPage ? 1 : -1)
    setIsAnimating(true)
    setCurrentPage(pageIndex)

    // Robustly reset animation state after duration + buffer
    setTimeout(() => {
      setIsAnimating(false)
    }, 450)
  }, [currentPage, pages, isAnimating])

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

  // Listen for global reset event (from Navigation)
  useEffect(() => {
    if (!resetEventName) return

    const handleReset = () => {
      goToPage(0)
    }

    window.addEventListener(resetEventName, handleReset)
    return () => window.removeEventListener(resetEventName, handleReset)
  }, [goToPage, resetEventName])

  // Failsafe: Reset isAnimating if it gets stuck (reduced to 800ms for faster recovery)
  useEffect(() => {
    if (!isAnimating) return

    const failsafe = setTimeout(() => {
      console.warn('Animation failsafe triggered in BookLayout')
      setIsAnimating(false)
    }, 800)

    return () => clearTimeout(failsafe)
  }, [isAnimating])

  // Handle scrolling to section within a view group
  useEffect(() => {
    const page = pages[currentPage]
    const scrollContainer = document.querySelector(`.${styles.pageContent}`)

    if (page.scrollToId) {
      setTimeout(() => {
        // Skip programmatic scrolling if the user arrived here by scrolling
        if (navigationSource.current === 'scroll') return

        // Special check: If this is the first page of the group, force scroll to top
        // This avoids layout alignment issues with scrollIntoView for the top section
        const isFirstInGroup = page.viewGroupId
          ? pages.find(p => p.viewGroupId === page.viewGroupId)?.id === page.id
          : true

        if (isFirstInGroup && scrollContainer) {
          isProgrammaticScroll.current = true
          scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
          setTimeout(() => {
            isProgrammaticScroll.current = false
          }, 1000)
          return
        }

        const element = document.getElementById(page.scrollToId!)
        if (element) {
          isProgrammaticScroll.current = true
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })

          // Reset lock after scroll animation finishes (approx 800-1000ms)
          setTimeout(() => {
            isProgrammaticScroll.current = false
          }, 1000)
        } else {
          // Retry once if not found (optional, but good for safety)
          setTimeout(() => {
            const retryEl = document.getElementById(page.scrollToId!)
            if (retryEl) {
              isProgrammaticScroll.current = true
              retryEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setTimeout(() => { isProgrammaticScroll.current = false }, 1000)
            }
          }, 300)
        }
      }, 300) // Increased from 100 to 300 for stability
    } else {
      // If no ID specified, ensure we are at the top (important for new pages)
      if (scrollContainer) {
        scrollContainer.scrollTop = 0
      }
    }
  }, [currentPage, pages])

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

  // Handle scroll events for sidebar sync and header interaction
  const handlePageScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const scrollTop = target.scrollTop

    // 1. Dispatch custom event for global Header
    window.dispatchEvent(new CustomEvent('book-scroll', { detail: { scrollTop } }))

    // 2. Sync Sidebar with Scroll Position
    if (isProgrammaticScroll.current) return

    // Only proceed if we are in a view group
    const currentPageData = pages[currentPage]
    if (!currentPageData?.viewGroupId) return

    // Find all pages in the current group
    const groupPages = pages.filter(p => p.viewGroupId === currentPageData.viewGroupId)

    // Find which section is currently most visible
    // We assume sections are in order
    for (const page of groupPages) {
      if (!page.scrollToId) continue

      const element = document.getElementById(page.scrollToId)
      if (element) {
        const rect = element.getBoundingClientRect()
        // If the top of the element is within the viewport (or close to top)
        // logic: if element top is < viewport height / 2 AND element bottom > 100
        if (rect.top <= window.innerHeight / 2 && rect.bottom > 100) {
          // This is the active section
          const newIndex = pages.findIndex(p => p.id === page.id)
          if (newIndex !== -1 && newIndex !== currentPage) {
            // Update state without triggering scroll-to-element logic again ideally
            // But for now, standard setState is fine as long as we guard the effect
            navigationSource.current = 'scroll'
            setCurrentPage(newIndex)
          }
          break
        }
      }
    }
  }, [currentPage, pages])

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
              onExitComplete={() => {
                // No-op: handled by robust timeout in goToPage
              }}
            >
              <motion.div
                key={currentPageData?.viewGroupId || currentPage}
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
                <div
                  className={styles.pageContent}
                  onScroll={handlePageScroll}
                >
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
      </div >
    </BookContext.Provider >
  )
}
