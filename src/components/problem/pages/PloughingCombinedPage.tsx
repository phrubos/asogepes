'use client'

import React from 'react'
import PloughingEffectsPage from './PloughingEffectsPage'
import PloughingStructurePage from './PloughingStructurePage'
import styles from '../ProblemNew.module.css'

export default function PloughingCombinedPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Hatások szekció */}
            <div id="ploughing-effects" className={styles.combinedSection} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <PloughingEffectsPage />
            </div>

            <div style={{ height: '0px' }} />

            {/* Struktúra összehasonlítás szekció */}
            <div id="ploughing-structure" className={styles.combinedSection} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '100px' }}>
                <PloughingStructurePage />
            </div>
        </div>
    )
}
