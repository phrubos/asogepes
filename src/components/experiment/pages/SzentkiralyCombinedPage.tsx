'use client'

import SzentkirályInfoPage from './SzentkirályInfoPage'
import SzentkirályTimelinePage from './SzentkirályTimelinePage'
import SzentkirályTempPage from './SzentkirályTempPage'
import SzentkirályPhotosPage from './SzentkirályPhotosPage'
import SzentkiralyTomatoPage from './SzentkiralyTomatoPage'
import SzentkiralyGrowthPage from './SzentkiralyGrowthPage'
import FurtherMeasuresPage from './FurtherMeasuresPage'
import SiteBlocks, { type SiteBlock } from '../season/SiteBlocks'
import styles from './CombinedPage.module.css'

/** Each block with the seasons it has; the 25 / 26 chips of the site narrow them (ticket 015) */
const blocks: SiteBlock[] = [
    { id: 'szentkiraly-info', component: <SzentkirályInfoPage />, years: [2025, 2026], once: true },
    { id: 'szentkiraly-timeline', component: <SzentkirályTimelinePage />, years: [2025, 2026] },
    { id: 'szentkiraly-temp', component: <SzentkirályTempPage />, years: [2025, 2026] },
    { id: 'szentkiraly-fejlodes', component: <SzentkiralyGrowthPage />, years: [2026], phoneHeight: 760 },
    { id: 'szentkiraly-paradicsom', component: <SzentkiralyTomatoPage />, years: [2026] },
    { id: 'szentkiraly-meresek', component: <FurtherMeasuresPage site="szentkiraly" />, years: [2026], phoneHeight: 790 },
    { id: 'szentkiraly-photos', component: <SzentkirályPhotosPage />, years: [2025] },
]

export default function SzentkiralyCombinedPage() {
    return (
        <div className={`${styles.combinedWrapper} ${styles.site}`}>
            <SiteBlocks site="szentkiraly" blocks={blocks} sectionClass={styles.section} />
        </div>
    )
}
