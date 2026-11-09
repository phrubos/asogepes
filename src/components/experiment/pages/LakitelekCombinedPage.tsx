'use client'

import LakitelekInfoPage from './LakitelekInfoPage'
import LakitelekChartPage from './LakitelekChartPage'
import LakitelekPhotosPage from './LakitelekPhotosPage'
import LakitelekSoilLifePage from './LakitelekSoilLifePage'
import FurtherMeasuresPage from './FurtherMeasuresPage'
import { LAKITELEK_YEARS } from '@/lib/seasons'
import { SeasonProvider } from '../season/SeasonContext'
import styles from './CombinedPage.module.css'

/** `phoneHeight`: the block's height on phones, the placeholder size while it is not rendered yet */
const sections: { id: string; component: JSX.Element; phoneHeight?: number }[] = [
    { id: 'lakitelek-info', component: <LakitelekInfoPage /> },
    { id: 'lakitelek-chart', component: <LakitelekChartPage /> },
    { id: 'lakitelek-talajelet', component: <LakitelekSoilLifePage />, phoneHeight: 930 },
    { id: 'lakitelek-meresek', component: <FurtherMeasuresPage site="lakitelek" />, phoneHeight: 730 },
    { id: 'lakitelek-photos', component: <LakitelekPhotosPage /> }
]

export default function LakitelekCombinedPage() {
    return (
        // the site's own season: the ÉV switch in Helyszín adatok sets only Lakitelek
        <SeasonProvider years={LAKITELEK_YEARS} param="evad-lk">
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
        </SeasonProvider>
    )
}
