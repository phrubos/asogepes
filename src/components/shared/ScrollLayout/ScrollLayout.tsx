'use client'

import { Fragment, useState, useCallback, useEffect, useRef, createContext, useContext, type ReactNode } from 'react'
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
    /** parts of one subsection shown one under the other (/kutatas year parts, ticket 024); the rail and the sheet list them as jump links */
    parts?: { id: string; label: string }[]
  }[]
  /** Year chips beside the section number (/kutatas sites, ticket 015): every year measured there, */
  years?: number[]
  /** the chosen ones, */
  chosenYears?: number[]
  /** and what a chip does (the last chosen year stays on) */
  onToggleYear?: (year: number) => void
}

/** 25 / 26 chips of a site: one year, the other or both; a single-year site shows one locked chip */
export function YearChips({ section, className, chipClass, onClass }: { section: ScrollSection; className: string; chipClass: string; onClass: string }) {
  const { years, chosenYears = [], onToggleYear } = section
  if (!years?.length) return null
  const name = section.label.replace(/-\s*\n\s*/g, '-').replace(/\s*\n\s*/g, ' ')
  return (
    <span className={className} role="group" aria-label={`${name}: évek`} onClick={(e) => e.stopPropagation()}>
      {years.map((y) => {
        const on = chosenYears.includes(y)
        const locked = years.length === 1 || (on && chosenYears.length === 1)
        return (
          <button
            key={y}
            type="button"
            className={`${chipClass} ${on ? onClass : ''}`}
            aria-pressed={on}
            aria-disabled={locked || undefined}
            aria-label={`${y}`}
            title={years.length === 1 ? `Csak ${y}-ben mértünk` : locked ? 'Legalább egy év mindig látszik' : undefined}
            onClick={() => !locked && onToggleYear?.(y)}
          >
            {String(y).slice(2)}
          </button>
        )
      })}
    </span>
  )
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
  activePart: string | null
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
// <html> has scroll-behavior: smooth; turn it off for one call instead of passing behavior 'instant',
// which older Safari rejects (the far jump then never happened)
function jumpTo(top: number) {
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, top)
  html.style.scrollBehavior = previous
}

// Only one navigation runs at a time: a new one stops the previous re-aim loop,
// which would otherwise pull the page back to the old target
let cancelRunning: (() => void) | null = null

function scrollToElement(element: HTMLElement, offset: number) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const targetTop = () => element.getBoundingClientRect().top + window.scrollY - offset
  const aim = () => (reduced ? jumpTo(targetTop()) : window.scrollTo({ top: targetTop(), behavior: 'smooth' }))

  cancelRunning?.()
  let cancelled = false
  const cancel = () => { cancelled = true; cleanup() }
  // the reader takes over: wheel, touch, or a press on the scrollbar
  window.addEventListener('wheel', cancel, { once: true, passive: true })
  window.addEventListener('touchstart', cancel, { once: true, passive: true })
  window.addEventListener('mousedown', cancel, { once: true, passive: true })
  cancelRunning = cancel
  function cleanup() {
    window.removeEventListener('wheel', cancel)
    window.removeEventListener('touchstart', cancel)
    window.removeEventListener('mousedown', cancel)
    if (cancelRunning === cancel) cancelRunning = null
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
        // the top section (Bevezető) can't rise to the offset: done once the page is at the top
        const atTop = window.scrollY <= 0 && targetTop() <= 0
        if (Math.abs(element.getBoundingClientRect().top - offset) <= 2 || atBottom || atTop || corrections >= 4) return cleanup()
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
    jumpTo(targetTop() - lead)
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
  const [activePart, setActivePart] = useState<string | null>(null)
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
    setActivePart(null)

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
  const handleSubsectionClick = useCallback((subsectionId: string, parentSectionId: string, partId?: string) => {
    isProgrammaticScroll.current = true

    setActiveSection(parentSectionId)
    setActiveSubsection(subsectionId)
    // a block with year parts starts with its first part
    const firstPart = sections.find(s => s.id === parentSectionId)?.subsections?.find(s => s.id === subsectionId)?.parts?.[0]?.id
    setActivePart(partId ?? firstPart ?? null)

    const targetId = partId ?? subsectionId
    announceTarget(targetId)
    const element = document.getElementById(targetId)
    if (element) {
      // Dynamic offset - some sections need to appear higher
      scrollToElement(element, getScrollOffset(subsectionId))

      // Update URL
      const url = new URL(window.location.href)
      url.searchParams.set('section', targetId)
      router.replace(url.pathname + url.search, { scroll: false })
    }

    setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 1000)
  }, [router, sections, getScrollOffset])

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
        const parent = section.subsections?.find(s => s.parts?.some(p => p.id === sectionId))
        if (parent) {
          handleSubsectionClick(parent.id, section.id, sectionId)
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
      // resolved after the delay, from the latest sections: a year filter from the URL is applied after the first render
      setTimeout(() => {
        const { sections: current, scrollToSection: scrollTo } = latest.current
        const subsections = current.flatMap(s => s.subsections || [])
        const known = (id: string) =>
          current.some(s => s.id === id) || subsections.some(sub => sub.id === id || sub.parts?.some(p => p.id === id))
        // a part of a year that is filtered out falls back to its block
        const target = known(sectionId) ? sectionId : sectionId.match(/^(.*)-\d{4}$/)?.[1]
        if (target && known(target)) scrollTo(target)
      }, 100)
    }
  }, [])

  const latest = useRef({ sections, scrollToSection })
  latest.current = { sections, scrollToSection }

  // Track the active section while scrolling. The active block is the one crossing a reading line,
  // a subsection before its section. Desktop: 50% of the viewport. Phones/tablets: 35%, because the
  // last subsections (Fotók) are short and a 50% line switched to them while the previous block still
  // filled the upper half of the screen. A rAF-throttled scroll listener (not IntersectionObserver
  // thresholds) so a crossing is never missed, also for blocks taller than the screen.
  useEffect(() => {
    const partsOf = new Map<string, string[]>()
    for (const sub of sections.flatMap(s => s.subsections ?? [])) {
      if (sub.parts?.length) partsOf.set(sub.id, sub.parts.map(p => p.id))
    }
    const narrow = window.matchMedia('(max-width: 1024px)')
    let current = ''
    let frame = 0

    const pickActive = () => {
      const line = window.innerHeight * (narrow.matches ? 0.35 : 0.5)
      const contains = (id: string) => {
        const r = document.getElementById(id)?.getBoundingClientRect()
        return !!r && r.top <= line && r.bottom > line
      }
      // the section first: a block inside a section that is not rendered (content-visibility) keeps a stale rect
      const section = sections.find(s => contains(s.id))
      if (!section) return undefined
      return section.subsections?.find(sub => contains(sub.id))?.id ?? section.id
    }

    // the last part that has reached the line, else the first
    const pickPart = (subId: string) => {
      const parts = partsOf.get(subId)
      if (!parts) return null
      const line = window.innerHeight * (narrow.matches ? 0.35 : 0.5)
      let part = parts[0]
      for (const id of parts) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= line) part = id
      }
      return part
    }

    const update = () => {
      frame = 0
      if (isProgrammaticScroll.current) return
      const id = pickActive()
      if (!id) return
      const partId = pickPart(id)
      const key = partId ?? id
      if (key === current) return
      current = key

      const mainSection = sections.find(s => s.id === id)
      if (mainSection) {
        setActiveSection(id)
        // When main section is in view, activate first subsection
        setActiveSubsection(mainSection.subsections?.[0]?.id || null)
        setActivePart(null)
      } else {
        const parent = sections.find(s => s.subsections?.some(sub => sub.id === id))
        if (!parent) return
        setActiveSection(parent.id)
        setActiveSubsection(id)
        setActivePart(partId)
      }

      // Update URL silently
      const url = new URL(window.location.href)
      url.searchParams.set('section', key)
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

      // If we have an active subsection, target it (its year part first)
      if (activeSubsection) {
        const subBtn =
          (activePart && document.querySelector(`[data-sidebar-part="${activePart}"]`)) ||
          document.querySelector(`[data-sidebar-subsection="${activeSubsection}"]`)
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
  }, [activeSection, activeSubsection, activePart, sections])

  return (
    <ScrollContext.Provider value={{ scrollToSection, activeSection, activeSubsection, activePart, sections }}>
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
                    <div className={section.years?.length ? styles.headLine : undefined} data-two-line={section.label.includes('\n') || undefined}>
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
                    {/* small 25 / 26 on the name's (first) line, not the number's, right after it (ticket 015) */}
                    <YearChips section={section} className={styles.yearChips} chipClass={styles.yearChip} onClass={styles.yearChipOn} />
                    </div>

                    {/* Sub-sections List (Only for active section) */}
                    {isActive && section.subsections && section.subsections.length > 0 && (
                      <div className={styles.subPages}>
                        {section.subsections.map((sub) => {
                          const isSubActive = activeSubsection === sub.id
                          return (
                            <Fragment key={sub.id}>
                              <button
                                data-sidebar-subsection={sub.id}
                                className={`${styles.subPageBtn} ${isSubActive ? styles.activeBtn : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSubsectionClick(sub.id, section.id)
                                }}
                              >
                                {sub.label}
                              </button>
                              {isSubActive && sub.parts && sub.parts.length > 0 && (
                                <div className={styles.subParts} role="group" aria-label={`${sub.label}: évek`}>
                                  <span className={styles.subPartsBend} aria-hidden="true">└</span>
                                  {sub.parts.map((p, i) => {
                                    const on = activePart === p.id
                                    return (
                                      <Fragment key={p.id}>
                                        {i > 0 && <span aria-hidden="true">·</span>}
                                        <button
                                          type="button"
                                          data-sidebar-part={p.id}
                                          aria-current={on ? 'true' : undefined}
                                          className={`${styles.subPartBtn} ${on ? styles.subPartOn : ''}`}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleSubsectionClick(sub.id, section.id, p.id)
                                          }}
                                        >
                                          {p.label}
                                        </button>
                                      </Fragment>
                                    )
                                  })}
                                </div>
                              )}
                            </Fragment>
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
