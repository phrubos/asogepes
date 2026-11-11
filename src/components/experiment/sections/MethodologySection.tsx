'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronDown } from 'lucide-react'
import RevealBlock from '../season/RevealBlock'
import { MethodologyPage } from '../pages'
import MeasuredPropertiesPage from '../pages/MeasuredPropertiesPage'
import SoilLifeMethodPage from '../pages/SoilLifeMethodPage'
import BulkDensityMethodPage from '../pages/BulkDensityMethodPage'
import { SCROLL_TARGET_EVENT } from '@/components/shared/ScrollLayout/ScrollLayout'
import combined from '../pages/CombinedPage.module.css'
import styles from './sections.module.css'

/** Módszertan: the penetrometer, what else is measured, bulk-density sampling and the soil-life test */
// phoneHeight: measured height at 390px (collapsed for the collapsible blocks), the content-visibility
// placeholder until the block renders.
// collapsible: on phones/tablets only the block's header (title + lead) shows, with a "Részletek" button;
// the penetrometer stays open because the cm values of every chart rest on it (mobile UX review 11-09, K2).
const blocks: { id: string; component: JSX.Element; phoneHeight?: number; collapsible?: boolean }[] = [
    { id: 'methodology-penetrometer', component: <MethodologyPage /> },
    { id: 'methodology-meresek', component: <MeasuredPropertiesPage />, phoneHeight: 260, collapsible: true },
    { id: 'methodology-terfogattomeg', component: <BulkDensityMethodPage />, phoneHeight: 230, collapsible: true },
    { id: 'methodology-talajelet', component: <SoilLifeMethodPage />, phoneHeight: 150, collapsible: true },
]

function Block({ id, component, phoneHeight, collapsible }: (typeof blocks)[number]) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // A jump from the menu, the contents sheet or a ?section= link opens the block first,
    // so it lands on the content, not on a closed row
    useEffect(() => {
        if (!collapsible) return
        const onTarget = (e: Event) => {
            if ((e as CustomEvent<string>).detail === id) setOpen(true)
        }
        window.addEventListener(SCROLL_TARGET_EVENT, onTarget)
        return () => window.removeEventListener(SCROLL_TARGET_EVENT, onTarget)
    }, [collapsible, id])

    const toggle = () => {
        const closing = open
        setOpen(!open)
        // closing from the bottom of a long block: bring its title back instead of leaving the reader far below
        if (closing && ref.current) {
            const top = ref.current.getBoundingClientRect().top
            if (top < 0) window.scrollTo({ top: window.scrollY + top - 64, behavior: 'instant' as ScrollBehavior })
        }
    }

    return (
        <RevealBlock
            innerRef={ref}
            id={id}
            className={`${combined.section} ${collapsible ? styles.collapsible : ''}`}
            data-open={collapsible ? open || undefined : undefined}
            style={phoneHeight ? ({ '--phone-h': `${phoneHeight}px` } as CSSProperties) : undefined}
        >
            <div id={`${id}-body`} className={styles.collapseBody}>
                {component}
            </div>
            {collapsible && (
                <button
                    type="button"
                    className={styles.collapseToggle}
                    aria-expanded={open}
                    aria-controls={`${id}-body`}
                    onClick={toggle}
                >
                    {open ? 'Kevesebb' : 'Részletek'}
                    <ChevronDown size={18} aria-hidden="true" className={styles.collapseIcon} />
                </button>
            )}
        </RevealBlock>
    )
}

export default function MethodologySection() {
    return (
        <div className={`${styles.scrollSection} ${combined.combinedWrapper}`}>
            {blocks.map((b) => (
                <Block key={b.id} {...b} />
            ))}
        </div>
    )
}
