'use client'

import { Play, RotateCcw, Square } from 'lucide-react'
import type { PlayState } from './useSoilPlayback'
import styles from './SoilPlayButton.module.css'

const LABEL: Record<PlayState, string> = {
    idle: 'Animáció lejátszása',
    playing: 'Megállítás, a kész kép mutatása',
    done: 'Animáció újrajátszása',
}

/** Small, quiet play / stop / replay button in the sky corner of a soil profile; a 44px tap target. */
export default function SoilPlayButton({ state, onClick }: { state: PlayState; onClick: () => void }) {
    return (
        <button type="button" className={styles.button} aria-label={LABEL[state]} title={LABEL[state]} data-state={state} onClick={onClick}>
            <span className={styles.icon} aria-hidden="true">
                {state === 'playing' ? <Square size={10} fill="currentColor" strokeWidth={2} />
                    : state === 'done' ? <RotateCcw size={13} strokeWidth={2.4} />
                        : <Play size={12} fill="currentColor" strokeWidth={2} />}
            </span>
        </button>
    )
}
