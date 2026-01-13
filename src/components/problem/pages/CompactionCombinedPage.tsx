'use client'

import React from 'react'
import CompactionStatsPage from './CompactionStatsPage'
import CompactionInteractivePage from './CompactionInteractivePage'
import styles from '../ProblemNew.module.css'

export default function CompactionCombinedPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div id="compaction-stats" className={styles.combinedSection} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <CompactionStatsPage />
            </div>

            <div style={{ height: '0px' }} />

            <div id="compaction-interactive" className={styles.combinedSection} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '100px' }}>
                <CompactionInteractivePage />
            </div>
        </div>
    )
}
