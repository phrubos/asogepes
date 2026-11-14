'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useScrollNav, type ScrollSection } from './ScrollLayout'
import { oneLine } from './MobileSectionBar'
import styles from './ScrollLayout.module.css'

export default function NextSectionIndicator() {
    const { activeSection, activeSubsection, activePart, sections, scrollToSection } = useScrollNav()

    const nextInfo = useMemo(() => {
        const currentSectionIndex = sections.findIndex(s => s.id === activeSection)
        if (currentSectionIndex === -1) return null

        // a subsection is one step, or one step per part (year)
        const stepsOf = (section: ScrollSection) =>
            (section.subsections ?? []).flatMap(sub =>
                sub.parts?.length
                    ? sub.parts.map(p => ({ id: p.id, name: sub.label, part: p.label as string | null }))
                    : [{ id: sub.id, name: sub.label, part: null as string | null }]
            )

        const currentSection = sections[currentSectionIndex]
        const steps = stepsOf(currentSection)
        const currentId = activePart ?? activeSubsection
        const currentIndex = currentId ? steps.findIndex(s => s.id === currentId) : -1

        // Check if there's a next step in current section
        if (currentIndex !== -1 && currentIndex < steps.length - 1) {
            const next = steps[currentIndex + 1]
            return {
                sectionName: oneLine(currentSection.label),
                subsectionName: next.name,
                part: next.part,
                id: next.id
            }
        }

        // Otherwise, go to next section (if exists)
        if (currentSectionIndex < sections.length - 1) {
            const nextSection = sections[currentSectionIndex + 1]
            // If next section has subsections, go to its first step
            const first = stepsOf(nextSection)[0]
            return {
                sectionName: oneLine(nextSection.label),
                subsectionName: first?.name || null,
                part: first?.part ?? null,
                id: first?.id || nextSection.id
            }
        }

        return null
    }, [activeSection, activeSubsection, activePart, sections])

    if (!nextInfo) return null

    // Hide indicator when on hero sections (Bevezető)
    if (activeSection === 'hero') return null

    const displayTitle = nextInfo.subsectionName
        ? `${nextInfo.sectionName} · ${nextInfo.subsectionName}${nextInfo.part ? ` ${nextInfo.part}` : ''}`
        : nextInfo.sectionName

    return (
        <AnimatePresence>
            {nextInfo && (
                // Collapsed to a small arrow button in the corner, so it never covers content;
                // hover or keyboard focus opens the "Görgess lejjebb" label. Framer animates only
                // opacity here: the CSS owns the transform.
                <motion.button
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.scrollIndicator}
                    onClick={() => scrollToSection(nextInfo.id)}
                    aria-label={`Görgess ehhez: ${displayTitle}`}
                >
                    <div className={styles.indicatorText} aria-hidden="true">
                        <span className={styles.indicatorLabel}>Görgess lejjebb</span>
                        <div className={styles.indicatorTitleWrapper}>
                            <span className={styles.indicatorSection}>
                                {nextInfo.sectionName}
                                {nextInfo.subsectionName && <span className={styles.indicatorDivider}> ›</span>}
                            </span>
                            {nextInfo.subsectionName && (
                                <span className={styles.indicatorSubsection}>{nextInfo.subsectionName}
                                    {nextInfo.part && <>{' · '}<span className={styles.indicatorYear}>{nextInfo.part}</span></>}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* No looping pulse: the arrow nods once when the target changes (keyed remount),
                        then stays still while the reader reads */}
                    <span className={styles.indicatorButton} aria-hidden="true">
                        <ArrowDown key={nextInfo.id} size={18} className={styles.indicatorIcon} />
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    )
}
