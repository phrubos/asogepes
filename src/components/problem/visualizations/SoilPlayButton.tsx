'use client'

import { Play, RotateCcw, Square } from 'lucide-react'
import type { PlayState } from './useSoilPlayback'
import styles from './SoilPlayButton.module.css'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { bilingual } from '@/lib/i18n/config'

const TEXT = bilingual(
    {
        label: { idle: 'Animáció lejátszása', playing: 'Megállítás, a kész kép mutatása', done: 'Animáció újrajátszása' } as Record<PlayState, string>,
        again: 'Újra',
    },
    {
        label: { idle: 'Play animation', playing: 'Stop and show the final picture', done: 'Replay animation' },
        again: 'Replay',
    },
)

/** Quiet play / stop button in the sky corner of a soil profile; once played it becomes a labelled "Újra" pill. A 44px tap target. */
export default function SoilPlayButton({ state, onClick }: { state: PlayState; onClick: () => void }) {
    const t = TEXT[useLocale()]
    return (
        <button type="button" className={styles.button} aria-label={t.label[state]} title={t.label[state]} data-state={state} onClick={onClick}>
            <span className={styles.icon} aria-hidden="true">
                {state === 'playing' ? <Square size={10} fill="currentColor" strokeWidth={2} />
                    : state === 'done' ? <RotateCcw size={13} strokeWidth={2.4} />
                        : <Play size={12} fill="currentColor" strokeWidth={2} />}
                {state === 'done' && <span className={styles.label}>{t.again}</span>}
            </span>
        </button>
    )
}
