'use client'

import PloughingEffectsPage from '../pages/PloughingEffectsPage'
import PloughingStructurePage from '../pages/PloughingStructurePage'
import styles from '../ProblemNew.module.css'

export default function PloughingSection() {
    return (
        <div className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                {/* Effects subsection */}
                <div id="ploughing-effects" className={styles.combinedSectionCompact}>
                    <PloughingEffectsPage />
                </div>

                <div style={{ height: '15vh' }} />

                {/* Structure comparison subsection */}
                <div id="ploughing-structure" className={styles.combinedSectionCompact}>
                    <PloughingStructurePage />
                </div>
            </div>
        </div>
    )
}
