'use client'

import CultivatorProblemsPage from '../pages/CultivatorProblemsPage'
import CultivatorComparisonPage from '../pages/CultivatorComparisonPage'
import styles from '../ProblemNew.module.css'

export default function CultivatorSection() {
    return (
        <div className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                {/* Problems subsection */}
                <div id="cultivator-problems" className={styles.combinedSection}>
                    <CultivatorProblemsPage />
                </div>

                <div style={{ height: '10vh' }} />

                {/* Comparison subsection */}
                <div id="cultivator-comparison" className={styles.combinedSection}>
                    <CultivatorComparisonPage />
                </div>
            </div>
        </div>
    )
}
