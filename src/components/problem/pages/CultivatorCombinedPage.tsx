'use client'

import React from 'react'
import CultivatorProblemsPage from './CultivatorProblemsPage'
import CultivatorComparisonPage from './CultivatorComparisonPage'
import styles from '../ProblemNew.module.css'

export default function CultivatorCombinedPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Problémák szekció */}
            <div id="cultivator-problems" className={styles.combinedSection}>
                <CultivatorProblemsPage />
            </div>

            <div style={{ height: '0px' }} />

            {/* Összehasonlítás szekció */}
            <div id="cultivator-comparison" className={styles.combinedSection}>
                <CultivatorComparisonPage />
            </div>
        </div>
    )
}
