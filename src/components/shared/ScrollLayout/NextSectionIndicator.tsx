'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useScrollNav } from './ScrollLayout'
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
                sectionName: currentSection.label.replace('\n', ' '),
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
                sectionName: nextSection.label.replace('\n', ' '),
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={styles.scrollIndicator}
                    onClick={() => scrollToSection(nextInfo.id)}
                    role="button"
                    aria-label={`Görgess ehhez: ${displayTitle}`}
                >
                    <div className={styles.pulseContainer}>
                        <div className={styles.pulseDot} />
                        <div className={styles.pulseRing} />
                        <div className={styles.pulseRing} />
                    </div>

                    <div className={styles.indicatorText}>
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

                    <ArrowDown size={18} className={styles.indicatorIcon} />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
