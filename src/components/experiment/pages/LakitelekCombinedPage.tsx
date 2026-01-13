'use client'

import LakitelekInfoPage from './LakitelekInfoPage'
import LakitelekChartPage from './LakitelekChartPage'
import LakitelekPhotosPage from './LakitelekPhotosPage'
import styles from './CombinedPage.module.css'

const sections = [
    { id: 'lakitelek-info', component: <LakitelekInfoPage /> },
    { id: 'lakitelek-chart', component: <LakitelekChartPage /> },
    { id: 'lakitelek-photos', component: <LakitelekPhotosPage /> }
]

export default function LakitelekCombinedPage() {
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
