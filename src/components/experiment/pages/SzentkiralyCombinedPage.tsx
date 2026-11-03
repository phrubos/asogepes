'use client'

import SzentkirályInfoPage from './SzentkirályInfoPage'
import SzentkirályTimelinePage from './SzentkirályTimelinePage'
import SzentkirályTempPage from './SzentkirályTempPage'
import SzentkirályPhotosPage from './SzentkirályPhotosPage'
import SzentkiralyTomatoPage from './SzentkiralyTomatoPage'
import SzentkiralyGrowthPage from './SzentkiralyGrowthPage'
import FurtherMeasuresPage from './FurtherMeasuresPage'
import styles from './CombinedPage.module.css'

/** `phoneHeight`: the block's height on phones, the placeholder size while it is not rendered yet */
const sections: { id: string; component: JSX.Element; phoneHeight?: number }[] = [
    { id: 'szentkiraly-info', component: <SzentkirályInfoPage /> },
    { id: 'szentkiraly-timeline', component: <SzentkirályTimelinePage /> },
    { id: 'szentkiraly-temp', component: <SzentkirályTempPage /> },
    { id: 'szentkiraly-fejlodes', component: <SzentkiralyGrowthPage />, phoneHeight: 760 },
    { id: 'szentkiraly-paradicsom', component: <SzentkiralyTomatoPage /> },
    { id: 'szentkiraly-meresek', component: <FurtherMeasuresPage site="szentkiraly" />, phoneHeight: 790 },
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
                    style={section.phoneHeight ? ({ '--phone-h': `${section.phoneHeight}px` } as React.CSSProperties) : undefined}
                >
                    {section.component}
                </div>
            ))}
        </div>
    )
}
