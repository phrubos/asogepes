'use client'

import React from 'react'
import CompactionStatsPage from './CompactionStatsPage'

import styles from '../ProblemNew.module.css'

export default function CompactionCombinedPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div id="compaction-stats" className={styles.combinedSection}>
                <CompactionStatsPage />
            </div>


        </div>
    )
}
