'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useScrollNav } from './ScrollLayout'
import { oneLine } from './MobileSectionBar'
import styles from './ScrollLayout.module.css'

export default function NextSectionIndicator() {
    const { activeSection, activeSubsection, sections, scrollToSection } = useScrollNav()

    const nextInfo = useMemo(() => {
        const currentSectionIndex = sections.findIndex(s => s.id === activeSection)
        if (currentSectionIndex === -1) return null

        const currentSection = sections[currentSectionIndex]
        const subsections = currentSection.subsections || []

        // Find current subsection index within current section
        const currentSubIndex = activeSubsection
            ? subsections.findIndex(s => s.id === activeSubsection)
            : -1

        // Check if there's a next subsection in current section
        if (currentSubIndex !== -1 && currentSubIndex < subsections.length - 1) {
            const nextSub = subsections[currentSubIndex + 1]
            return {
                sectionName: oneLine(currentSection.label),
                subsectionName: nextSub.label,
                id: nextSub.id
            }
        }

        // Otherwise, go to next section (if exists)
        if (currentSectionIndex < sections.length - 1) {
            const nextSection = sections[currentSectionIndex + 1]
            // If next section has subsections, go to first subsection
            const firstSub = nextSection.subsections?.[0]
            return {
                sectionName: oneLine(nextSection.label),
                subsectionName: firstSub?.label || null,
                id: firstSub?.id || nextSection.id
            }
        }

        return null
    }, [activeSection, activeSubsection, sections])

    if (!nextInfo) return null

    // Hide indicator when on hero sections (Bevezető)
    if (activeSection === 'hero') return null

    const displayTitle = nextInfo.subsectionName
        ? `${nextInfo.sectionName} · ${nextInfo.subsectionName}`
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
                                <span className={styles.indicatorSubsection}>{nextInfo.subsectionName}</span>
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
