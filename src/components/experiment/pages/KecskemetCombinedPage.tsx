'use client'

import KecskemétInfoPage from './KecskemétInfoPage'
import KecskemétTimelinePage from './KecskemétTimelinePage'
import KecskemétPhotosPage from './KecskemétPhotosPage'
import SiteBlocks, { type SiteBlock } from '../season/SiteBlocks'
import styles from './CombinedPage.module.css'

/** Measured in 2025 only */
const blocks: SiteBlock[] = [
    { id: 'kecskemet-info', component: <KecskemétInfoPage />, years: [2025], once: true },
    { id: 'kecskemet-timeline', component: <KecskemétTimelinePage />, years: [2025] },
    { id: 'kecskemet-photos', component: <KecskemétPhotosPage />, years: [2025] },
]

export default function KecskemetCombinedPage() {
    return (
        <div className={styles.combinedWrapper}>
            <SiteBlocks site="kecskemet" blocks={blocks} sectionClass={styles.section} />
        </div>
    )
}
