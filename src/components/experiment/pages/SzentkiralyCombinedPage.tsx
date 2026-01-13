'use client'

import SzentkirályInfoPage from './SzentkirályInfoPage'
import SzentkirályTimelinePage from './SzentkirályTimelinePage'
import SzentkirályTempPage from './SzentkirályTempPage'
import SzentkirályPhotosPage from './SzentkirályPhotosPage'
import styles from './CombinedPage.module.css'

const sections = [
    { id: 'szentkiraly-info', component: <SzentkirályInfoPage /> },
    { id: 'szentkiraly-timeline', component: <SzentkirályTimelinePage /> },
    { id: 'szentkiraly-temp', component: <SzentkirályTempPage /> },
    { id: 'szentkiraly-photos', component: <SzentkirályPhotosPage /> }
]

export default function SzentkiralyCombinedPage() {
    return (
        <div className={styles.combinedWrapper}>
            {sections.map((section) => (
                <div
                    key={section.id}
                    id={section.id}
                    className={styles.section}
                >
                    {section.component}
                </div>
            ))}
        </div>
    )
}
