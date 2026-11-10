'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { useScrollNav, YearChips } from './ScrollLayout'
import styles from './MobileSectionBar.module.css'

// "Kecskemét-\nBorbás" joins without a space after the hyphen; other line breaks become a space
export const oneLine = (label: string) =>
    label.replace(/-\s*\n\s*/g, '-').replace(/\s*\n\s*/g, ' ')

/**
 * Phones and tablets: one sticky bar that names where the reader is, and opens a sheet with every
 * section and subsection. Replaces the bottom dot rail and the "scroll down" pill below 1025px.
 */
export default function MobileSectionBar() {
  const { sections, activeSection, activeSubsection, scrollToSection } = useScrollNav()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const section = sections.find(s => s.id === activeSection) ?? sections[0]
  const sub = section?.subsections?.find(s => s.id === activeSubsection)

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
          aria-label={`Tartalom — most: ${oneLine(section.label)}${sub ? `, ${sub.label}` : ''}`}
        >
          <span className={styles.where}>
            <span className={styles.section}>{oneLine(section.label)}</span>
            {sub && <span className={styles.sub}>{sub.label}</span>}
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
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            >
              <div className={styles.sheetHeader}>
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
                        {s.subsections.map(ss => (
                          <li key={ss.id}>
                            <button
                              type="button"
                              className={styles.subItem}
                              aria-current={ss.id === activeSubsection ? 'true' : undefined}
                              onClick={() => go(ss.id)}
                            >
                              {ss.label}
                            </button>
                          </li>
                        ))}
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
