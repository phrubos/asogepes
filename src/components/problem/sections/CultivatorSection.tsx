'use client'

import CultivatorProblemsPage from '../pages/CultivatorProblemsPage'
import CultivatorComparisonPage from '../pages/CultivatorComparisonPage'
import styles from '../ProblemNew.module.css'

export default function CultivatorSection() {
    return (
        <div className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                {/* section heading for screen readers and the outline (the visible titles are the hero cards) */}
                <h2 className="sr-only">A szántóföldi nehézkultivátor korlátai</h2>
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
