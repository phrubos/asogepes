'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useBookNav } from './BookLayout'
import styles from './BookLayout.module.css'

export default function ScrollProgressIndicator() {
    const { currentPage, pages, goToPage } = useBookNav()

    const nextSectionInfo = useMemo(() => {
        const currentPageData = pages[currentPage]

        // Safety check
        if (!currentPageData) return null
        if (!currentPageData.viewGroupId) return null

        // Find all pages in this group
        const groupPages = pages.filter(p => p.viewGroupId === currentPageData.viewGroupId)

        // Find index of current page within the group
        const currentIndexInGroup = groupPages.findIndex(p => p.id === currentPageData.id)

        // If not found or is the last one, return null
        if (currentIndexInGroup === -1 || currentIndexInGroup >= groupPages.length - 1) return null

        // Get next page
        const nextPage = groupPages[currentIndexInGroup + 1]

        // Find global index to jump to
        const globalNextIndex = pages.findIndex(p => p.id === nextPage.id)

        if (globalNextIndex === -1) return null

        // Additional check: If the next page is actually the same "combined" component but just scrolling,
        // we want to show the title of that next section.

        return {
            title: nextPage.title,
            index: globalNextIndex
        }
    }, [currentPage, pages])

    return (
        <AnimatePresence>
            {nextSectionInfo && (
                <motion.div
                    initial={{ opacity: 0, y: 20, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className={styles.scrollIndicator}
                    onClick={() => goToPage(nextSectionInfo.index)}
                    role="button"
                    aria-label={`Görgess ehhez: ${nextSectionInfo.title}`}
                >
                    <div className={styles.pulseContainer}>
                        <div className={styles.pulseDot} />
                        <div className={styles.pulseRing} />
                        <div className={styles.pulseRing} />
                    </div>

                    <div className={styles.indicatorText}>
                        <span className={styles.indicatorLabel}>Görgess lejjebb</span>
                        <span className={styles.indicatorTitle}>{nextSectionInfo.title}</span>
                    </div>

                    <ArrowDown size={18} className={styles.indicatorIcon} />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
