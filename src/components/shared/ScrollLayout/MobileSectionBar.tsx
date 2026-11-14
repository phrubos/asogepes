'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { useScrollNav, YearChips } from './ScrollLayout'
import styles from './MobileSectionBar.module.css'

// "Kecskemét-\nBorbás" joins without a space after the hyphen; other line breaks become a space
export const oneLine = (label: string) =>
    label.replace(/-\s*\n\s*/g, '-').replace(/\s*\n\s*/g, ' ')

// the sheet closes when dragged down further than this, or flicked faster than this (px/s)
const CLOSE_DISTANCE = 80
const CLOSE_VELOCITY = 500

/**
 * Phones and tablets: one sticky bar that names where the reader is, and opens a sheet with every
 * section and subsection. Replaces the bottom dot rail and the "scroll down" pill below 1025px.
 */
export default function MobileSectionBar() {
  const { sections, activeSection, activeSubsection, activePart, scrollToSection } = useScrollNav()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  const section = sections.find(s => s.id === activeSection) ?? sections[0]
  const sub = section?.subsections?.find(s => s.id === activeSubsection)
  const part = sub?.parts?.find(p => p.id === activePart)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // open the sheet where the reader is: the current subsection (else section) a third of the way down
    const sheet = sheetRef.current
    const current =
      sheet?.querySelector<HTMLElement>('[aria-current="true"]') ??
      sheet?.querySelector<HTMLElement>('[data-active]')
    if (sheet && current) {
      const offset = current.getBoundingClientRect().top - sheet.getBoundingClientRect().top
      sheet.scrollTop = Math.max(0, sheet.scrollTop + offset - sheet.clientHeight / 3)
    }
    ;(current ?? sheet?.querySelector<HTMLElement>('button'))?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      // keep Tab inside the sheet
      if (e.key === 'Tab' && sheetRef.current) {
        const items = sheetRef.current.querySelectorAll<HTMLElement>('button')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      triggerRef.current?.focus()
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // let the sheet release the scroll lock before scrolling
    requestAnimationFrame(() => scrollToSection(id))
  }

  if (!section) return null

  return (
    <>
      <div className={styles.bar}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`Tartalom — most: ${oneLine(section.label)}${sub ? `, ${sub.label}` : ''}${part ? ` ${part.label}` : ''}`}
        >
          <span className={styles.where}>
            <span className={styles.section}>{oneLine(section.label)}</span>
            {sub && (
              <span className={styles.sub}>
                {sub.label}
                {part && <>{' · '}<span className={styles.subYear}>{part.label}</span></>}
              </span>
            )}
          </span>
          <ChevronDown size={18} className={styles.chevron} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className={styles.backdrop}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              ref={sheetRef}
              className={styles.sheet}
              role="dialog"
              aria-modal="true"
              aria-label="Tartalom"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              // closing is quicker than opening and accelerates away (ticket 021)
              exit={{ y: '100%', transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
              transition={{ type: 'spring', stiffness: 420, damping: 40 }}
              // drag down from the header to close; the list itself keeps its own scrolling
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 1 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > CLOSE_DISTANCE || info.velocity.y > CLOSE_VELOCITY) setOpen(false)
              }}
            >
              <div className={styles.sheetHeader} onPointerDown={e => dragControls.start(e)}>
                <span className={styles.grabber} aria-hidden="true" />
                <span className={styles.sheetTitle}>Tartalom</span>
                <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Bezárás">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <ol className={styles.list}>
                {sections.map(s => (
                  <li key={s.id}>
                    <div className={styles.itemRow}>
                      <button
                        type="button"
                        className={styles.item}
                        aria-current={s.id === activeSection && !activeSubsection ? 'true' : undefined}
                        data-active={s.id === activeSection || undefined}
                        onClick={() => go(s.id)}
                      >
                        {oneLine(s.label)}
                      </button>
                      {/* the site's years (ticket 015), the same choice as in the desktop rail */}
                      <YearChips section={s} className={styles.yearChips} chipClass={styles.yearChip} onClass={styles.yearChipOn} />
                    </div>
                    {s.subsections && s.subsections.length > 0 && (
                      <ol className={styles.subList}>
                        {s.subsections.map(ss => {
                          const parentOfCurrent = !!activePart && !!ss.parts?.some(p => p.id === activePart)
                          const subItem = (
                            <button
                              type="button"
                              className={styles.subItem}
                              aria-current={ss.id === activeSubsection && !parentOfCurrent ? 'true' : undefined}
                              data-parent-current={parentOfCurrent || undefined}
                              onClick={() => go(ss.id)}
                            >
                              {ss.label}
                            </button>
                          )
                          return (
                            <li key={ss.id}>
                              {ss.parts && ss.parts.length > 0 ? (
                                <div className={styles.subRow}>
                                  {subItem}
                                  <span className={styles.subParts} role="group" aria-label={`${ss.label}: évek`}>
                                    {ss.parts.map(p => (
                                      <button
                                        key={p.id}
                                        type="button"
                                        className={styles.subPart}
                                        aria-current={p.id === activePart ? 'true' : undefined}
                                        onClick={() => go(p.id)}
                                      >
                                        <span>{p.label}</span>
                                      </button>
                                    ))}
                                  </span>
                                </div>
                              ) : (
                                subItem
                              )}
                            </li>
                          )
                        })}
                      </ol>
                    )}
                  </li>
                ))}
              </ol>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
