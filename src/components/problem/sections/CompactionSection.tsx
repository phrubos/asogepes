'use client'

import CompactionStatsPage from '../pages/CompactionStatsPage'
import styles from '../ProblemNew.module.css'

export default function CompactionSection() {
    return (
        <div id="compaction-stats" className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                {/* section heading for screen readers and the outline (the visible titles are the hero cards) */}
                <h2 className="sr-only">Az öntözés okozta tömörödés</h2>
                <CompactionStatsPage />
            </div>
        </div>
    )
}
