'use client'

import LakitelekInfoPage from './LakitelekInfoPage'
import LakitelekChartPage from './LakitelekChartPage'
import LakitelekPhotosPage from './LakitelekPhotosPage'
import LakitelekSoilLifePage from './LakitelekSoilLifePage'
import FurtherMeasuresPage from './FurtherMeasuresPage'
import SiteBlocks, { type SiteBlock } from '../season/SiteBlocks'
import styles from './CombinedPage.module.css'

/** Each block with the seasons it has; the 25 / 26 chips of the site narrow them (ticket 015) */
const blocks: SiteBlock[] = [
    { id: 'lakitelek-info', component: <LakitelekInfoPage />, years: [2025, 2026], once: true },
    { id: 'lakitelek-chart', component: <LakitelekChartPage />, years: [2025, 2026] },
    { id: 'lakitelek-talajelet', component: <LakitelekSoilLifePage />, years: [2025, 2026], once: true, phoneHeight: 930 },
    { id: 'lakitelek-meresek', component: <FurtherMeasuresPage site="lakitelek" />, years: [2026], phoneHeight: 730 },
    { id: 'lakitelek-photos', component: <LakitelekPhotosPage />, years: [2025, 2026] },
]

export default function LakitelekCombinedPage() {
    return (
        <div className={`${styles.combinedWrapper} ${styles.site}`}>
            <SiteBlocks site="lakitelek" blocks={blocks} sectionClass={styles.section} />
        </div>
    )
}
