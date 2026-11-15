'use client'

import PloughingEffectsPage from '../pages/PloughingEffectsPage'
import PloughingStructurePage from '../pages/PloughingStructurePage'
import styles from '../ProblemNew.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TITLE = bilingual('A szántás korlátai', 'The limits of ploughing')

export default function PloughingSection() {
    const title = TITLE[useLocale()]
    return (
        <div className={styles.scrollSection}>
            <div className={styles.contentWrapper}>
                {/* section heading for screen readers and the outline (the visible titles are the hero cards) */}
                <h2 className="sr-only">{title}</h2>
                {/* Effects subsection */}
                <div id="ploughing-effects" className={styles.combinedSectionCompact}>
                    <PloughingEffectsPage />
                </div>

                <div className={styles.subsectionSpacer} style={{ height: '15vh' }} />

                {/* Structure comparison subsection */}
                <div id="ploughing-structure" className={styles.combinedSectionCompact}>
                    <PloughingStructurePage />
                </div>
            </div>
        </div>
    )
}
