'use client'

import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Story.module.css'

export interface Chapter {
  title: string
  body: string
}

interface StoryProps {
  /** Names the stepper for screen readers */
  label: string
  chapters: Chapter[]
  /** 1-based */
  step: number
  onStep: (step: number) => void
  /** The chart; it shows what the current chapter talks about */
  stage: ReactNode
  /** Under the chart: picker, legend, source note */
  footer?: ReactNode
  className?: string
}

/**
 * A chart told in steps: numbered chapters on the left (the current one open, the done ones gold),
 * the chart on the right, Vissza / Tovább under the chapters. The reader steps; nothing runs by itself.
 * Phones: the current chapter, the chart, then the buttons.
 */
export default function Story({ label, chapters, step, onStep, stage, footer, className = '' }: StoryProps) {
  const n = chapters.length
  const last = step === n
  return (
    <div className={`${styles.story} ${className}`}>
      <div className={styles.bar} aria-hidden="true">
        {chapters.map((_, i) => (
          <span key={i} className={i < step ? styles.barOn : undefined} />
        ))}
      </div>

      <ol className={styles.chapters} aria-label={label}>
        {chapters.map((c, i) => {
          const on = i + 1 === step
          const done = i + 1 < step
          return (
            <li key={c.title} className={`${styles.chapter} ${on ? styles.chapterOn : ''}`}>
              <button
                type="button"
                className={`${styles.chapterButton} ${done ? styles.done : ''}`}
                aria-current={on ? 'step' : undefined}
                onClick={() => onStep(i + 1)}
              >
                <span className={styles.num}>{i + 1}</span>
                <span className={styles.chapterTitle}>{c.title}</span>
              </button>
              {on && (
                <p key={step} className={styles.body} aria-live="polite">
                  {c.body}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className={styles.stage}>
        {stage}
        {footer}
      </div>

      <div className={styles.nav}>
        <button type="button" className={styles.prev} onClick={() => onStep(step - 1)} disabled={step === 1}>
          <ChevronLeft size={16} aria-hidden="true" />
          Vissza
        </button>
        <span className={styles.count}>
          {step} / {n}
        </span>
        <button type="button" className={styles.next} onClick={() => onStep(last ? 1 : step + 1)}>
          {last ? 'Elölről' : 'Tovább'}
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
