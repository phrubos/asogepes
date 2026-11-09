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
  'osszegzes': -40,             // Fő eredmények (kutatás): past the 100px section padding, the badge just under the top menu
}

// Sections below the first one skip rendering until they near the viewport (content-visibility in the CSS),
// so their height is only an estimate until scrolled past and a target can move during a smooth scroll.
// Re-aim once the scroll stops, until the target sits at its offset; a touch or wheel by the user cancels.
// A far target (more than ~1.5 screens away) is not smooth-scrolled the whole way: the page jumps to
// just short of it and only the last stretch animates, so a click doesn't run through every section between.
function scrollToElement(element: HTMLElement, offset: number) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // 'instant', not 'auto': <html> has scroll-behavior: smooth, which 'auto' would follow
  const behavior: ScrollBehavior = reduced ? 'instant' : 'smooth'
  const targetTop = () => element.getBoundingClientRect().top + window.scrollY - offset
  const aim = () => window.scrollTo({ top: targetTop(), behavior })

  let cancelled = false
  const cancel = () => { cancelled = true }
  window.addEventListener('wheel', cancel, { once: true, passive: true })
  window.addEventListener('touchstart', cancel, { once: true, passive: true })
  const cleanup = () => {
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
  }

  // After the (last) smooth scroll: re-aim whenever the scroll stops short of the target
  const settle = () => {
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

  const distance = targetTop() - window.scrollY
  if (reduced || Math.abs(distance) <= window.innerHeight * 1.5) {
    aim()
    return settle()
  }

  // Each jump renders the sections it lands on, which can move the target by thousands of px:
  // jump again until the target stays put, then animate the last stretch. content-visibility renders
  // the newly visible sections a frame or few after the jump, so "put" means 4 frames without moving.
  const lead = Math.sign(distance) * window.innerHeight * 0.4
  let jumps = 0
  const jump = () => {
    window.scrollTo({ top: targetTop() - lead, behavior: 'instant' })
    let lastTop = targetTop()
    let still = 0
    const wait = () => {
      if (cancelled) return cleanup()
      const top = targetTop()
      if (Math.abs(top - lastTop) > 2) { lastTop = top; still = 0 } else still++
      if (still < 4) return requestAnimationFrame(wait)
      if (Math.abs(top - lead - window.scrollY) > 4 && ++jumps < 8) return jump()
      aim()
      settle()
    }
    requestAnimationFrame(wait)
  }
  jump()
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

  // Track the active section while scrolling. The active block is the one crossing a reading line,
  // a subsection before its section. Desktop: 50% of the viewport. Phones/tablets: 35%, because the
  // last subsections (Fotók) are short and a 50% line switched to them while the previous block still
  // filled the upper half of the screen. A rAF-throttled scroll listener (not IntersectionObserver
  // thresholds) so a crossing is never missed, also for blocks taller than the screen.
  useEffect(() => {
    const subsectionIds = sections.flatMap(s => s.subsections?.map(sub => sub.id) ?? [])
    const sectionIds = sections.map(s => s.id)
    const narrow = window.matchMedia('(max-width: 1024px)')
    let current = ''
    let frame = 0

    const pickActive = () => {
      const line = window.innerHeight * (narrow.matches ? 0.35 : 0.5)
      const contains = (id: string) => {
        const r = document.getElementById(id)?.getBoundingClientRect()
        return !!r && r.top <= line && r.bottom > line
      }
      return subsectionIds.find(contains) ?? sectionIds.find(contains)
    }

    const update = () => {
      frame = 0
      if (isProgrammaticScroll.current) return
      const id = pickActive()
      if (!id || id === current) return
      current = id

      const mainSection = sections.find(s => s.id === id)
      if (mainSection) {
        setActiveSection(id)
        // When main section is in view, activate first subsection
        setActiveSubsection(mainSection.subsections?.[0]?.id || null)
      } else {
        const parent = sections.find(s => s.subsections?.some(sub => sub.id === id))
        if (!parent) return
        setActiveSection(parent.id)
        setActiveSubsection(id)
      }

      // Update URL silently
      const url = new URL(window.location.href)
      url.searchParams.set('section', id)
      window.history.replaceState({}, '', url.pathname + url.search)
    }

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // a programmatic scroll mutes tracking for 1s; re-check once it ends
    window.addEventListener('scrollend', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scrollend', schedule)
    }
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
  // Share of the rail that is filled (0..1); drawn with scaleY so the fill never re-lays out the rail
  const [progressScale, setProgressScale] = useState(0)

  // Calculate the progress fill based on the active element's position
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

      const railHeight = sidebarContentRef.current.clientHeight
      if (targetTop > 0 && railHeight > 0) {
        setProgressScale(Math.min(1, targetTop / railHeight))
      }
    }

    // Run calculation
    calculateProgress()

    // Re-calculate on resize, and whenever the rail itself changes height (subsections opening):
    // the fill is a share of the rail, so a taller rail would otherwise stretch it past the marker
    window.addEventListener('resize', calculateProgress)
    const railObserver = new ResizeObserver(calculateProgress)
    if (sidebarContentRef.current) railObserver.observe(sidebarContentRef.current)

    // Also re-calculate after a short delay to allow for animations (like subpages expanding)
    const timeoutId = setTimeout(calculateProgress, 350)

    return () => {
      railObserver.disconnect()
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
                initial={{ scaleY: 0 }}
                animate={{ scaleY: progressScale }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
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
                  >
                    {/* Marker beside the label, so it stays there when the subsections open.
                        The label row is the button (keyboard); a click anywhere in the group bubbles
                        up to the group's handler, so the subsection buttons are not nested in a button. */}
                    <button
                      type="button"
                      className={styles.headRow}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className={styles.markerWrapper}>
                        <span className={styles.marker} />
                      </span>
                      <span className={styles.sectionHeader}>
                        <span className={styles.sectionNumber}>
                          {String(idx).padStart(2, '0')}
                        </span>
                        <span className={styles.sectionLabel}>{section.label}</span>
                      </span>
                    </button>

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
