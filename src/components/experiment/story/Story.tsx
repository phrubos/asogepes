'use client'

import { useEffect, useRef, type ReactNode, type TouchEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import styles from './Story.module.css'

/** Height of the sticky MobileSectionBar (shared/ScrollLayout) plus a little air */
const STICKY_TOP = 56 + 12
/** A swipe: at least this far sideways, and clearly more sideways than up or down */
const SWIPE_MIN = 50

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
 * Phones: the current chapter, the chart, then the buttons; a sideways swipe steps too, and after a
 * step the block scrolls back into view if the chapter text has gone above the sticky bar.
 */
export default function Story({ label, chapters, step, onStep, stage, footer, className = '' }: StoryProps) {
  const n = chapters.length
  const last = step === n
  const rootRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const stepped = useRef(false)
  const compact = useMediaQuery('(max-width: 1024px)')
  const reduced = useReducedMotion()

  const go = (s: number) => {
    stepped.current = true
    onStep(s)
  }

  // After a step on a phone: keep the chapter text in view (the buttons sit under the chart)
  useEffect(() => {
    if (!stepped.current) return
    stepped.current = false
    const root = rootRef.current
    if (!compact || !root) return
    const top = root.getBoundingClientRect().top
    if (top < STICKY_TOP) window.scrollBy({ top: top - STICKY_TOP, behavior: reduced ? 'auto' : 'smooth' })
  }, [step, compact, reduced])

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null
  }
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < 1.5 * Math.abs(dy)) return
    if (dx < 0 && step < n) go(step + 1)
    else if (dx > 0 && step > 1) go(step - 1)
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.story} ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => { touchStart.current = null }}
    >
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
                onClick={() => go(i + 1)}
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
        <button type="button" className={styles.prev} onClick={() => go(step - 1)} disabled={step === 1}>
          <ChevronLeft size={16} aria-hidden="true" />
          Vissza
        </button>
        <span className={styles.count}>
          {step} / {n}
        </span>
        <button type="button" className={styles.next} onClick={() => go(last ? 1 : step + 1)}>
          {last ? 'Elölről' : 'Tovább'}
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      <p className={styles.swipeHint} aria-hidden="true">
        Lapozni oldalra húzással is lehet
      </p>
    </div>
  )
}
