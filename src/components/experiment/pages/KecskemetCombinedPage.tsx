'use client'

import KecskemétInfoPage from './KecskemétInfoPage'
import KecskemétTimelinePage from './KecskemétTimelinePage'
import KecskemétPhotosPage from './KecskemétPhotosPage'
import { SeasonProvider } from '../season/SeasonContext'
import styles from './CombinedPage.module.css'

const KB_YEARS = [2025]

const sections = [
    { id: 'kecskemet-info', component: <KecskemétInfoPage /> },
    { id: 'kecskemet-timeline', component: <KecskemétTimelinePage /> },
    { id: 'kecskemet-photos', component: <KecskemétPhotosPage /> }
]

export default function KecskemetCombinedPage() {
    return (
        // measured in 2025 only: its own provider keeps it on 2025 whatever the other sites show
        <SeasonProvider years={KB_YEARS} param="evad-kb">
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
        </SeasonProvider>
    )
}
