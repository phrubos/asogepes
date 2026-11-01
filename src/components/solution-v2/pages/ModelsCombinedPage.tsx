'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ModelSection from '../ModelSection'
import { modelData, type ModelId } from '@/lib/technology-data'
import { SCROLL_TARGET_EVENT } from '@/components/shared/ScrollLayout/ScrollLayout'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './ModelsCombinedPage.module.css'

const models = modelData.map(m => m.id)
const BAR_HEIGHT = 56 // MobileSectionBar

/**
 * Desktop: the three models one under the other. Phones and tablets: one model at a time,
 * picked with a segmented switcher at the top of the model (CSS hides the others).
 */
export default function ModelsCombinedPage() {
    const [selected, setSelected] = useState<ModelId>('38sx')
    const isCompact = useMediaQuery('(max-width: 1024px)') === true
    const reduced = useReducedMotion()
    const focusAfterSwitch = useRef(false)
    const rootRef = useRef<HTMLDivElement>(null)

    // the section bar, the contents sheet and ?section= deep links jump to `model-*`: show that model first
    useEffect(() => {
        const onTarget = (e: Event) => {
            const id = (e as CustomEvent<string>).detail
            const model = models.find(m => `model-${m}` === id)
            if (model) flushSync(() => setSelected(model))
        }
        window.addEventListener(SCROLL_TARGET_EVENT, onTarget)
        return () => window.removeEventListener(SCROLL_TARGET_EVENT, onTarget)
    }, [])

    // keyboard switching moves focus to the same tab in the newly shown switcher
    useEffect(() => {
        if (!focusAfterSwitch.current) return
        focusAfterSwitch.current = false
        rootRef.current?.querySelector<HTMLElement>(`#model-${selected} [role="tab"][aria-selected="true"]`)?.focus({ preventScroll: true })
    }, [selected])

    const select = (model: ModelId) => {
        if (model === selected) return
        setSelected(model)
        const url = new URL(window.location.href)
        url.searchParams.set('section', `model-${model}`)
        window.history.replaceState({}, '', url.pathname + url.search)
        // when the reader is further down the old model, start the new one from its top
        const top = rootRef.current?.getBoundingClientRect().top ?? 0
        if (top < BAR_HEIGHT) {
            window.scrollTo({ top: window.scrollY + top - BAR_HEIGHT - 8, behavior: reduced ? 'auto' : 'smooth' })
        }
    }

    const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
        const i = models.indexOf(selected)
        const next =
            e.key === 'ArrowRight' ? models[(i + 1) % models.length] :
            e.key === 'ArrowLeft' ? models[(i - 1 + models.length) % models.length] :
            e.key === 'Home' ? models[0] :
            e.key === 'End' ? models[models.length - 1] : null
        if (!next) return
        e.preventDefault()
        focusAfterSwitch.current = true
        select(next)
    }

    return (
        <div ref={rootRef} className={styles.models}>
            {models.map((modelId, index) => {
                const nextModel = modelData[index + 1]
                return (
                    <div
                        key={modelId}
                        id={`model-${modelId}`}
                        className={styles.model}
                        data-selected={modelId === selected || undefined}
                        role={isCompact ? 'tabpanel' : undefined}
                        aria-labelledby={isCompact ? `model-tab-${modelId}` : undefined}
                    >
                        <div className={styles.switcher} role="tablist" aria-label="Modell">
                            {modelData.map(m => {
                                const isSelected = m.id === selected
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        role="tab"
                                        // only the tablist that is shown carries the ids the panels point to
                                        id={modelId === selected ? `model-tab-${m.id}` : undefined}
                                        aria-selected={isSelected}
                                        aria-controls={`model-${m.id}`}
                                        tabIndex={isSelected ? 0 : -1}
                                        className={styles.tab}
                                        onClick={() => select(m.id)}
                                        onKeyDown={onTabKey}
                                    >
                                        <span className={styles.tabName}>{m.name}</span>
                                        <span className={styles.tabType}>{m.type}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <motion.div
                            className="mobile-static"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            viewport={{ once: false, amount: 0.2 }}
                        >
                            <ModelSection modelId={modelId} />
                        </motion.div>

                        {nextModel && (
                            <button type="button" className={styles.nextModel} onClick={() => { focusAfterSwitch.current = true; select(nextModel.id) }}>
                                Következő modell: {nextModel.name}
                                <ArrowRight size={18} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
