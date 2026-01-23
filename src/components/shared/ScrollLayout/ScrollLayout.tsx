'use client'

import { useState, useCallback, useEffect, useRef, createContext, useContext, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import styles from './ScrollLayout.module.css'
import NextSectionIndicator from './NextSectionIndicator'

export interface ScrollSection {
  id: string
  label: string
  component: React.ReactNode
  subsections?: {
    id: string
    label: string
  }[]
}

interface ScrollLayoutProps {
  sections: ScrollSection[]
  resetEventName?: string
}

interface ScrollContextType {
  scrollToSection: (sectionId: string) => void
  activeSection: string
  activeSubsection: string | null
  sections: ScrollSection[]
}

const ScrollContext = createContext<ScrollContextType | null>(null)

export const useScrollNav = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScrollNav must be used within a ScrollLayout')
  }
  return context
}

export default function ScrollLayout({ sections, resetEventName }: ScrollLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize from URL
  useEffect(() => {
    const sectionId = searchParams.get('section')
    if (sectionId) {
      const section = sections.find(s => s.id === sectionId)
      const subsection = sections.flatMap(s => s.subsections || []).find(sub => sub.id === sectionId)

      if (section || subsection) {
        setTimeout(() => {
          scrollToSection(sectionId)
        }, 100)
      }
    }
  }, [])

  // Custom scroll offsets per section (lower = appears higher on screen)
  const sectionOffsets: Record<string, number> = {
    // Probléma page
    'compaction': -40,            // Öntözés és Tömörödés - OK
    'cultivator-comparison': -20, // Kultivátorozott vs. ásógépezett - OK
    'ploughing-effects': 150,      // Szántás hatásai - lejjebb
    'ploughing-structure': -20,   // Szántott vs. ásógépezett - OK
    // Technológia page
    'operation': -80,             // Működési elv - OK
    'model-38sx': 100,            // Modellek - feljebb (2 scroll)
    'model-38wx': 100,
    'model-40sx': 100,
    'application': -10,            // Alkalmazás - lejjebb
    'application-guide': -10,
    // Kutatás page
    'methodology': -40,           // Módszertan - feljebb (1 scroll)
  }

  // Get scroll offset based on target
  const getScrollOffset = useCallback((targetId: string) => {
    return sectionOffsets[targetId] ?? 80  // default 80 for unlisted sections
  }, [])

  // Handle main section click - activates section AND first subsection
  const handleSectionClick = useCallback((sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return

    isProgrammaticScroll.current = true
    
    // Set active states - main section + first subsection if exists
    setActiveSection(sectionId)
    const firstSubsection = section.subsections?.[0]
    setActiveSubsection(firstSubsection?.id || null)

    // Determine scroll target: first subsection element if exists, otherwise section wrapper
    const targetId = firstSubsection?.id || sectionId
    const element = document.getElementById(targetId)
    
    if (element) {
      // Dynamic offset - some sections need to appear higher
      const scrollOffset = getScrollOffset(targetId)
      const y = element.getBoundingClientRect().top + window.scrollY - scrollOffset
      window.scrollTo({ top: y, behavior: 'smooth' })

      // Update URL
      const url = new URL(window.location.href)
      url.searchParams.set('section', sectionId)
      router.replace(url.pathname + url.search, { scroll: false })
    }

    setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 1000)
  }, [router, sections, getScrollOffset])

  // Handle subsection click - scroll to subsection content
  const handleSubsectionClick = useCallback((subsectionId: string, parentSectionId: string) => {
    isProgrammaticScroll.current = true
    
    setActiveSection(parentSectionId)
    setActiveSubsection(subsectionId)

    const element = document.getElementById(subsectionId)
    if (element) {
      // Dynamic offset - some sections need to appear higher
      const scrollOffset = getScrollOffset(subsectionId)
      const y = element.getBoundingClientRect().top + window.scrollY - scrollOffset
      window.scrollTo({ top: y, behavior: 'smooth' })

      // Update URL
      const url = new URL(window.location.href)
      url.searchParams.set('section', subsectionId)
      router.replace(url.pathname + url.search, { scroll: false })
    }

    setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 1000)
  }, [router, getScrollOffset])

  // Legacy function for context - used by NextSectionIndicator
  const scrollToSection = useCallback((sectionId: string) => {
    // Check if it's a main section or subsection
    const isMainSection = sections.some(s => s.id === sectionId)
    if (isMainSection) {
      handleSectionClick(sectionId)
    } else {
      // Find parent section
      for (const section of sections) {
        const sub = section.subsections?.find(s => s.id === sectionId)
        if (sub) {
          handleSubsectionClick(sectionId, section.id)
          break
        }
      }
    }
  }, [handleSectionClick, handleSubsectionClick, sections])

  // IntersectionObserver for tracking active section during scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -50% 0px', // Top 15%, bottom 50% excluded - focus on upper-middle area
      threshold: [0, 0.1, 0.25]
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isProgrammaticScroll.current) return

      // Filter intersecting entries and find the one with highest ratio
      const intersecting = entries.filter(e => e.isIntersecting)
      if (intersecting.length === 0) return

      const bestEntry = intersecting.reduce((best, current) => 
        current.intersectionRatio > best.intersectionRatio ? current : best
      )

      const sectionId = bestEntry.target.id

      // Check if it's a main section
      const mainSection = sections.find(s => s.id === sectionId)
      if (mainSection) {
        setActiveSection(sectionId)
        // When main section is in view, activate first subsection
        const firstSub = mainSection.subsections?.[0]
        setActiveSubsection(firstSub?.id || null)

        // Update URL silently
        const url = new URL(window.location.href)
        url.searchParams.set('section', sectionId)
        window.history.replaceState({}, '', url.pathname + url.search)
      } else {
        // Check if it's a subsection
        for (const section of sections) {
          const sub = section.subsections?.find(s => s.id === sectionId)
          if (sub) {
            setActiveSection(section.id)
            setActiveSubsection(sectionId)

            // Update URL silently
            const url = new URL(window.location.href)
            url.searchParams.set('section', sectionId)
            window.history.replaceState({}, '', url.pathname + url.search)
            break
          }
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections and subsections
    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)

      section.subsections?.forEach(sub => {
        const subElement = document.getElementById(sub.id)
        if (subElement) observer.observe(subElement)
      })
    })

    return () => observer.disconnect()
  }, [sections])

  // Listen for reset event
  useEffect(() => {
    if (!resetEventName) return

    const handleReset = () => {
      scrollToSection(sections[0]?.id || '')
    }

    window.addEventListener(resetEventName, handleReset)
    return () => window.removeEventListener(resetEventName, handleReset)
  }, [resetEventName, sections, scrollToSection])

  // Dispatch scroll event for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      window.dispatchEvent(new CustomEvent('book-scroll', { detail: { scrollTop } }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate progress for timeline - including subsections
  const activeSectionIndex = sections.findIndex(s => s.id === activeSection)
  
  // Calculate total "steps" (each section counts as 1, we track which section we're on)
  // The progress should be based on section position in the nav
  const progressPercentage = useMemo(() => {
    if (sections.length <= 1) return 0
    
    // Base progress from section index
    const sectionProgress = activeSectionIndex / (sections.length - 1)
    
    // Add subsection progress within current section
    const currentSection = sections[activeSectionIndex]
    const subsections = currentSection?.subsections || []
    
    if (subsections.length > 0 && activeSubsection) {
      const subIndex = subsections.findIndex(s => s.id === activeSubsection)
      if (subIndex > 0) {
        // Add fractional progress for subsections (small increment within section)
        const subProgress = (subIndex / subsections.length) * (1 / (sections.length - 1)) * 0.5
        return Math.min((sectionProgress + subProgress) * 100, 100)
      }
    }
    
    return sectionProgress * 100
  }, [activeSectionIndex, activeSubsection, sections])

  return (
    <ScrollContext.Provider value={{ scrollToSection, activeSection, activeSubsection, sections }}>
      <div ref={containerRef} className={styles.scrollContainer}>
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
              {sections.map((section, idx) => {
                const isActive = activeSection === section.id
                const isPast = activeSectionIndex > idx

                return (
                  <div
                    key={section.id}
                    className={`${styles.sectionGroup} ${isActive ? styles.active : ''} ${isPast ? styles.past : ''}`}
                    onClick={() => handleSectionClick(section.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Circle Marker */}
                    <div className={styles.markerWrapper}>
                      <div className={styles.marker} />
                    </div>

                    {/* Label Header */}
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionNumber}>
                        {String(idx).padStart(2, '0')}
                      </span>
                      <span className={styles.sectionLabel}>{section.label}</span>
                    </div>

                    {/* Sub-sections List (Only for active section) */}
                    {isActive && section.subsections && section.subsections.length > 0 && (
                      <div className={styles.subPages}>
                        {section.subsections.map((sub) => {
                          const isSubActive = activeSubsection === sub.id
                          return (
                            <button
                              key={sub.id}
                              className={`${styles.subPageBtn} ${isSubActive ? styles.activeBtn : ''}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSubsectionClick(sub.id, section.id)
                              }}
                            >
                              {sub.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              {section.component}
            </section>
          ))}
        </main>

        {/* Next Section Indicator */}
        <NextSectionIndicator />
      </div>
    </ScrollContext.Provider>
  )
}
