'use client'

import { MethodologyPage } from '../pages'
import MeasuredPropertiesPage from '../pages/MeasuredPropertiesPage'
import SoilLifeMethodPage from '../pages/SoilLifeMethodPage'
import type { CSSProperties } from 'react'
import combined from '../pages/CombinedPage.module.css'
import styles from './sections.module.css'

/** Módszertan: the penetrometer, what else is measured, and the soil-life test */
// phoneHeight: measured height at 390px, the content-visibility placeholder until the block renders
const blocks: { id: string; component: JSX.Element; phoneHeight?: number }[] = [
    { id: 'methodology-penetrometer', component: <MethodologyPage /> },
    { id: 'methodology-meresek', component: <MeasuredPropertiesPage />, phoneHeight: 1240 },
    { id: 'methodology-talajelet', component: <SoilLifeMethodPage />, phoneHeight: 930 },
]

export default function MethodologySection() {
    return (
        <div className={`${styles.scrollSection} ${combined.combinedWrapper}`}>
            {blocks.map((b) => (
                <div
                    key={b.id}
                    id={b.id}
                    className={combined.section}
                    style={b.phoneHeight ? ({ '--phone-h': `${b.phoneHeight}px` } as CSSProperties) : undefined}
                >
                    {b.component}
                </div>
            ))}
        </div>
    )
}
