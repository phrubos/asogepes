'use client'

import CompactionStatsPage from '../pages/CompactionStatsPage'
import styles from '../ProblemNew.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TITLE = bilingual('Az öntözés okozta tömörödés', 'Irrigation-induced compaction')

export default function CompactionSection() {
    const title = TITLE[useLocale()]
    return (
        <div id="compaction-stats" className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                {/* section heading for screen readers and the outline (the visible titles are the hero cards) */}
                <h2 className="sr-only">{title}</h2>
                <CompactionStatsPage />
            </div>
        </div>
    )
}
