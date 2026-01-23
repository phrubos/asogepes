'use client'

import CompactionStatsPage from '../pages/CompactionStatsPage'
import styles from '../ProblemNew.module.css'

export default function CompactionSection() {
    return (
        <div id="compaction-stats" className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                <CompactionStatsPage />
            </div>
        </div>
    )
}
