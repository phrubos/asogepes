'use client'

import React from 'react'
import PloughingEffectsPage from './PloughingEffectsPage'
import PloughingStructurePage from './PloughingStructurePage'
import styles from '../ProblemNew.module.css'

export default function PloughingCombinedPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Hatások szekció */}
            <div id="ploughing-effects" className={styles.combinedSectionCompact}>
                <PloughingEffectsPage />
            </div>

            <div style={{ height: '15vh' }} />

            {/* Struktúra összehasonlítás szekció */}
            <div id="ploughing-structure" className={styles.combinedSectionCompact}>
                <PloughingStructurePage />
            </div>
        </div>
    )
}
