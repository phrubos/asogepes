'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { getImageProps } from 'next/image'
import { ChevronLeft, ChevronRight, Cylinder, Expand, Scale, Thermometer } from 'lucide-react'
import ImageLightbox from '@/components/ui/ImageLightbox/ImageLightbox'
import SoilPlayButton from '@/components/problem/visualizations/SoilPlayButton'
import { useLoopActive } from '@/hooks/useLoopActive'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { BULK_DENSITY_EXAMPLE as EX, BULK_DENSITY_IMAGE_DIR as DIR, BULK_DENSITY_STEPS as STEPS } from '@/lib/methodology'
import BulkDensityDiagram from './BulkDensityDiagram'
import styles from './SzentkirályTimelinePage.module.css'
import own from './MethodologyBlocks.module.css'
import bd from './BulkDensityMethodPage.module.css'

const hu = (v: number, d = 2) => v.toFixed(d).replace('.', ',')
const STEP_MS = 5000
const LAST = STEPS.length - 1

/* Art direction: 3:2 crop on desktop, 1:1 on phones and tablets (same framing on every step) */
const PHOTOS = STEPS.map((s) => {
  if (!s.image) return null
  const wide = getImageProps({
    src: `${DIR}/${s.image}-wide.jpg`,
    alt: s.alt,
    width: 1800,
    height: 1200,
    sizes: '(min-width: 1025px) 56vw, 100vw',
    loading: 'lazy',
  }).props
  const square = getImageProps({
    src: `${DIR}/${s.image}-square.jpg`,
    alt: s.alt,
    width: 1080,
    height: 1080,
    sizes: '100vw',
    loading: 'lazy',
  }).props
  return { wide, square, full: `${DIR}/${s.image}-wide.jpg` }
})
const LIGHTBOX = PHOTOS.flatMap((p, i) => (p ? [{ src: p.full, alt: STEPS[i].alt }] : []))

/** Módszertan: how bulk density is sampled (cylinder core method), step by step on the Lakitelek photos */
export default function BulkDensityMethodPage() {
  const ref = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const reduced = useReducedMotion()
  const visible = useLoopActive(ref)
  const [step, setStep] = useState(0)
  // plays through the steps once while in view; any interaction stops it for good
  const [auto, setAuto] = useState(true)
  const [lightbox, setLightbox] = useState(false)
  const playing = auto && visible && !reduced && step < LAST

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setStep((s) => Math.min(s + 1, LAST)), STEP_MS)
    return () => window.clearTimeout(id)
  }, [playing, step])

  useEffect(() => {
    if (step === LAST) setAuto(false)
  }, [step])

  const go = useCallback((i: number, focus = false) => {
    setAuto(false)
    const next = Math.max(0, Math.min(LAST, i))
    setStep(next)
    if (focus) tabs.current[next]?.focus()
  }, [])

  // "Újra": back to step 1 and play through again (reduced motion: just step 1)
  const restart = useCallback(() => {
    setStep(0)
    setAuto(true)
  }, [])

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: step + 1, ArrowLeft: step - 1, Home: 0, End: LAST }
    if (e.key in map) {
      e.preventDefault()
      go(map[e.key], true)
    }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40 || info.velocity.x < -400) go(step + 1)
    else if (info.offset.x > 40 || info.velocity.x > 400) go(step - 1)
  }

  const fade = reduced ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }
  const photoIndex = PHOTOS.slice(0, step + 1).filter(Boolean).length - 1
  const current = STEPS[step]

  return (
    <div ref={ref} className={`${styles.timelinePage} ${own.page}`}>
      <motion.div
        className={`${styles.header} mobile-static`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerBadge}>
          <Cylinder size={12} />
          <span>Módszertan</span>
        </div>
        <h3 className={styles.headerTitle}>A térfogattömeg mérése</h3>
        <p className={own.lead}>
          Megmutatja, mennyire tömör a talaj: hány gramm száraz föld van egy köbcentiméterben. Kisebb szám = lazább
          talaj.
        </p>
      </motion.div>

      <div className={bd.layout}>
        <motion.div
            className={bd.frame}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            {PHOTOS.map((p, i) =>
              p ? (
                <motion.div
                  key={i}
                  className={bd.layer}
                  initial={false}
                  animate={{ opacity: i === step ? 1 : 0, scale: i === step || reduced ? 1 : 1.03 }}
                  transition={i === step ? fade : { duration: reduced ? 0 : 0.45 }}
                  aria-hidden={i !== step}
                >
                  <picture>
                    <source media="(max-width: 1024px)" srcSet={p.square.srcSet} sizes={p.square.sizes} />
                    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- getImageProps for art direction; alt is in the props */}
                    <img {...p.wide} className={bd.photo} draggable={false} />
                  </picture>
                </motion.div>
              ) : null,
            )}

            <motion.div
              className={`${bd.layer} ${bd.lab}`}
              initial={false}
              animate={{ opacity: step === LAST ? 1 : 0 }}
              transition={fade}
              aria-hidden={step !== LAST}
            >
              <ol className={bd.labFlow} aria-label="Laborlépések">
                <li>
                  <Cylinder size={22} aria-hidden />
                  <span>100 cm³ minta</span>
                </li>
                <li>
                  <Thermometer size={22} aria-hidden />
                  <span>szárítás 105 °C-on</span>
                </li>
                <li>
                  <Scale size={22} aria-hidden />
                  <span>mérés</span>
                </li>
              </ol>
              <p className={bd.formula}>
                <span>{EX.grams} g</span>
                <span className={bd.op}>÷</span>
                <span>100 cm³</span>
                <span className={bd.op}>=</span>
                <strong>
                  {hu(EX.value)} <small>g/cm³</small>
                </strong>
              </p>
              <p className={bd.labCaption}>
                {EX.place}, {EX.when}, a {EX.parcels} parcella átlaga
              </p>
            </motion.div>

            {!auto && step > 0 && <SoilPlayButton state="done" onClick={restart} />}

            {current.image && (
              <button
                type="button"
                className={bd.zoom}
                onClick={() => {
                  setAuto(false)
                  setLightbox(true)
                }}
                aria-label="Fotó nagyítása"
              >
                <Expand size={18} />
              </button>
            )}
        </motion.div>

        <div className={bd.steps} role="tablist" aria-label="A mintavétel lépései" onKeyDown={onKey}>
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`bd-tab-${i}`}
                aria-selected={i === step}
                aria-controls="bd-panel"
                aria-label={`${i + 1}. ${s.title}`}
                tabIndex={i === step ? 0 : -1}
                className={`${bd.stepBtn} ${i === step ? bd.stepOn : ''} ${i < step ? bd.stepDone : ''}`}
                onClick={() => go(i)}
              >
                <span className={bd.bar}>{i === step && playing && <span key={step} className={bd.fill} />}</span>
                <span className={bd.stepNum}>{i + 1}</span>
                <span className={bd.stepName}>{s.title}</span>
              </button>
            ))}
        </div>

        {/* the explanation card: the step's text on top, the section diagram under it */}
        <div className={bd.card}>
          {!reduced && (
            <motion.span
              key={step}
              className={bd.cardFlash}
              aria-hidden
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          )}
          {/* phones/tablets: the card sits below the photo, so it gets its own prev/next (desktop: hidden by CSS) */}
          <div className={bd.cardNav}>
            <button type="button" className={bd.navBtn} onClick={() => go(step - 1)} disabled={step === 0} aria-label="Előző lépés">
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button type="button" className={bd.navBtn} onClick={() => go(step + 1)} disabled={step === LAST} aria-label="Következő lépés">
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
          <div
            id="bd-panel"
            role="tabpanel"
            aria-labelledby={`bd-tab-${step}`}
            aria-live={playing ? 'off' : 'polite'}
            className={bd.stepText}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }}
              >
                <span className={bd.eyebrow}>
                  {String(step + 1).padStart(2, '0')} <span aria-hidden>/</span> {String(STEPS.length).padStart(2, '0')}
                </span>
                <h4 className={bd.stepTitle}>{current.title}</h4>
                <p className={bd.stepBody}>{current.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={bd.diagram}>
            <BulkDensityDiagram step={step} reduced={reduced} />
          </div>
        </div>

        <p className={bd.foot}>
          Táblánként több ponton veszünk mintát, és ezek átlagát közöljük. A szezonban 2–3 mérésnapon ismételjük meg, így
          látszik, hogyan tömörödik vissza a talaj a művelés után.
          <span className={bd.credit}>Fotók: {EX.place}, {EX.photoDate}</span>
        </p>
      </div>

      <ImageLightbox
        isOpen={lightbox}
        onClose={() => setLightbox(false)}
        src={LIGHTBOX[Math.max(0, photoIndex)].src}
        alt={LIGHTBOX[Math.max(0, photoIndex)].alt}
        images={LIGHTBOX}
        initialIndex={Math.max(0, photoIndex)}
      />
    </div>
  )
}
