'use client'

import { useState, useCallback, useEffect, useRef, createContext, useContext, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import styles from './ScrollLayout.module.css'
import NextSectionIndicator from './NextSectionIndicator'
import MobileSectionBar from './MobileSectionBar'
import { useMediaQuery } from '@/hooks/useMediaQuery'

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
  /** After the last section: where to go next (not a section, so not in the nav) */
  end?: ReactNode
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
  'methodology': -60,           // Módszertan - feljebb (1 scroll)
  'osszegzes': -40,             // Összegzés: past the 100px section padding, the badge just under the top menu
}

// Sections below the first one skip rendering until they near the viewport (content-visibility in the CSS),
// so their height is only an estimate until scrolled past and a target can move during a smooth scroll.
// Re-aim once the scroll stops, until the target sits at its offset; a touch or wheel by the user cancels.
function scrollToElement(element: HTMLElement, offset: number) {
  const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  const aim = () => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - offset, behavior })
  aim()

  let cancelled = false
  const cancel = () => { cancelled = true }
  window.addEventListener('wheel', cancel, { once: true, passive: true })
  window.addEventListener('touchstart', cancel, { once: true, passive: true })
  const cleanup = () => {
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
  }

  let lastY = -1
  let stillFrames = 0
  let corrections = 0
  let frames = 0
  const tick = () => {
    if (cancelled || ++frames > 600) return cleanup()
    if (window.scrollY === lastY) stillFrames++
    else { stillFrames = 0; lastY = window.scrollY }
    if (stillFrames >= 6) {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (Math.abs(element.getBoundingClientRect().top - offset) <= 2 || atBottom || corrections >= 4) return cleanup()
      corrections++
      stillFrames = 0
      aim()
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Fired (synchronously) before jumping to a section, so a target that is hidden, e.g. a
 *  model behind the phone switcher, can show itself first. detail = the target element id. */
export const SCROLL_TARGET_EVENT = 'scroll-layout-target'

function announceTarget(id: string) {
  window.dispatchEvent(new CustomEvent(SCROLL_TARGET_EVENT, { detail: id }))
}

export default function ScrollLayout({ sections, resetEventName, end }: ScrollLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')
  const [activeSubsection, setActiveSubsection] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isProgrammaticScroll = useRef(false)
  const router = useRouter()
  const didInitFromUrl = useRef(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  // Get scroll offset based on target
  const getScrollOffset = useCallback((targetId: string) => {
    // phones and tablets: every target lands just below the 56px section bar
    if (window.matchMedia('(max-width: 1024px)').matches) return 64
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
    announceTarget(targetId)
    const element = document.getElementById(targetId)

    if (element) {
      // Dynamic offset - some sections need to appear higher
      scrollToElement(element, getScrollOffset(targetId))

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

    announceTarget(subsectionId)
    const element = document.getElementById(subsectionId)
    if (element) {
      // Dynamic offset - some sections need to appear higher
      scrollToElement(element, getScrollOffset(subsectionId))

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

  // Initialize from URL
  useEffect(() => {
    if (didInitFromUrl.current) return
    didInitFromUrl.current = true
    const sectionId = new URLSearchParams(window.location.search).get('section')
    if (sectionId) {
      const section = sections.find(s => s.id === sectionId)
      const subsection = sections.flatMap(s => s.subsections || []).find(sub => sub.id === sectionId)

      if (section || subsection) {
        setTimeout(() => {
          scrollToSection(sectionId)
        }, 100)
      }
    }
  }, [sections, scrollToSection])

  // IntersectionObserver for tracking active section during scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -50% 0px', // Top 15%, bottom 50% excluded - focus on upper-middle area
      threshold: [0, 0.1, 0.25]
    }

    // The active block is the one crossing the bottom edge of the focus band (50% of the viewport),
    // a subsection before its section. Comparing intersectionRatio of the changed entries failed for
    // sections taller than a few screens (their ratio never reaches a threshold, so a neighbour kept winning).
    const subsectionIds = sections.flatMap(s => s.subsections?.map(sub => sub.id) ?? [])
    const pickActive = () => {
      const line = window.innerHeight * 0.5
      const contains = (id: string) => {
        const r = document.getElementById(id)?.getBoundingClientRect()
        return !!r && r.top <= line && r.bottom > line
      }
      return subsectionIds.find(contains) ?? sections.map(s => s.id).find(contains)
    }

    const observerCallback: IntersectionObserverCallback = () => {
      if (isProgrammaticScroll.current) return

      const sectionId = pickActive()
      if (!sectionId) return

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

  const activeSectionIndex = sections.findIndex(s => s.id === activeSection)

  // Ref for the sidebar content container to verify positions relative to it
  const sidebarContentRef = useRef<HTMLDivElement>(null)
  const [progressHeight, setProgressHeight] = useState(0)

  // Calculate progress bar height based on active element position
  useEffect(() => {
    const calculateProgress = () => {
      if (!sidebarContentRef.current) return

      const containerRect = sidebarContentRef.current.getBoundingClientRect()
      let targetTop = 0

      // If we have an active subsection, target it
      if (activeSubsection) {
        const subBtn = document.querySelector(`[data-sidebar-subsection="${activeSubsection}"]`)
        if (subBtn) {
          const rect = subBtn.getBoundingClientRect()
          // Target middle of the subsection button
          targetTop = rect.top + (rect.height / 2) - containerRect.top
        }
      }
      // Otherwise fallback to main section marker
      else if (activeSection) {
        // Find the marker wrapper within the active section group
        const sectionGroup = document.querySelector(`[data-sidebar-section="${activeSection}"]`)
        if (sectionGroup) {
          // The marker is usually vertically centered or at a specific spot. 
          // We can try to find the marker element itself if possible, or assume center.
          // Looking at CSS, .markerWrapper is top: 50% translateY(-50%)
          // So center of sectionGroup should be correct IF the section group only contains the header?
          // BUT, sectionGroup grows when subsections expand?
          // No, .subPages is inside .sectionGroup (lines 325 in original file).
          // So top: 50% of sectionGroup moves down as height increases!
          // We need specifically the marker's position.
          // Let's rely on finding the marker element or calculating based on known structure.
          // The markerWrapper is the first child div usually? 
          // Let's add a data attribute to markerWrapper to be safe? 
          // Or just querySelector('.markerWrapper') inside the group.
          const marker = sectionGroup.querySelector('[class*="markerWrapper"]')
          if (marker) {
            const rect = marker.getBoundingClientRect()
            targetTop = rect.top + (rect.height / 2) - containerRect.top
          }
        }
      }

      if (targetTop > 0) {
        setProgressHeight(targetTop)
      }
    }

    // Run calculation
    calculateProgress()

    // Re-calculate on resize
    window.addEventListener('resize', calculateProgress)

    // Also re-calculate after a short delay to allow for animations (like subpages expanding)
    const timeoutId = setTimeout(calculateProgress, 350)

    return () => {
      window.removeEventListener('resize', calculateProgress)
      clearTimeout(timeoutId)
    }
  }, [activeSection, activeSubsection, sections])

  return (
    <ScrollContext.Provider value={{ scrollToSection, activeSection, activeSubsection, sections }}>
      <div ref={containerRef} className={styles.scrollContainer}>
        {/* Left Sidebar Navigation (Timeline) */}
        <nav className={styles.sidebar}>
          <div className={styles.sidebarContent} ref={sidebarContentRef}>
            {/* Timeline Track Line */}
            <div className={styles.timelineTrack}>
              <motion.div
                className={styles.timelineProgress}
                initial={{ height: 0 }}
                animate={{ height: progressHeight }}
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
                    data-sidebar-section={section.id}
                    className={`${styles.sectionGroup} ${isActive ? styles.active : ''} ${isPast ? styles.past : ''}`}
                    onClick={() => handleSectionClick(section.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Marker beside the label, so it stays there when the subsections open */}
                    <div className={styles.headRow}>
                      <div className={styles.markerWrapper}>
                        <div className={styles.marker} />
                      </div>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>
                          {String(idx).padStart(2, '0')}
                        </span>
                        <span className={styles.sectionLabel}>{section.label}</span>
                      </div>
                    </div>

                    {/* Sub-sections List (Only for active section) */}
                    {isActive && section.subsections && section.subsections.length > 0 && (
                      <div className={styles.subPages}>
                        {section.subsections.map((sub) => {
                          const isSubActive = activeSubsection === sub.id
                          return (
                            <button
                              key={sub.id}
                              data-sidebar-subsection={sub.id}
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
        <main id="main-content" className={styles.mainContent}>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              {section.component}
            </section>
          ))}
          {end}
        </main>

        {/* Desktop: next-section pill; phones and tablets: section bar + contents sheet */}
        {isMobile === false && <NextSectionIndicator />}
        <MobileSectionBar />
      </div>
    </ScrollContext.Provider>
  )
}
