'use client'

import KecskemétInfoPage from './KecskemétInfoPage'
import KecskemétTimelinePage from './KecskemétTimelinePage'
import KecskemétPhotosPage from './KecskemétPhotosPage'
import styles from './CombinedPage.module.css'

const sections = [
    { id: 'kecskemet-info', component: <KecskemétInfoPage /> },
    { id: 'kecskemet-timeline', component: <KecskemétTimelinePage /> },
    { id: 'kecskemet-photos', component: <KecskemétPhotosPage /> }
]

export default function KecskemetCombinedPage() {
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
