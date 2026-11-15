'use client'

import CultivatorProblemsPage from '../pages/CultivatorProblemsPage'
import CultivatorComparisonPage from '../pages/CultivatorComparisonPage'
import styles from '../ProblemNew.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TITLE = bilingual('A szántóföldi nehézkultivátor korlátai', 'The limits of the heavy field cultivator')

export default function CultivatorSection() {
    const title = TITLE[useLocale()]
    return (
        <div className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                {/* section heading for screen readers and the outline (the visible titles are the hero cards) */}
                <h2 className="sr-only">{title}</h2>
                {/* Problems subsection */}
                <div id="cultivator-problems" className={styles.combinedSection}>
                    <CultivatorProblemsPage />
                </div>

                <div className={styles.subsectionSpacer} style={{ height: '10vh' }} />

                {/* Comparison subsection */}
                <div id="cultivator-comparison" className={styles.combinedSection}>
                    <CultivatorComparisonPage />
                </div>
            </div>
        </div>
    )
}
