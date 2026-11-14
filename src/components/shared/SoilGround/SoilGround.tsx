import styles from './SoilGround.module.css'

/** The irregular soil surface line on top of a footer that composes `.ground` (SoilGround.module.css).
   Two drawings, so the waves keep their size: a dense one for desktop widths, a short one for phones. */
export default function SoilHorizon() {
  return (
    <>
      <svg className={`${styles.horizon} ${styles.wide}`} viewBox="0 0 1440 18" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 7c17 2 26-4 48-3s20 6 36 5s33-7 60-6s20 2 36 3s23-4 42-3s40 3 72 4s36 2 66 1s20-5 36-4s26 1 48 2s33-2 60-1s33 3 60 2s20-1 36 0s33-2 60-3s40 2 72 1s26-1 48 0s36 3 66 4s33-3 60-4s36 0 66 1s20 0 36 1s40-1 72-2s30-1 54-2s26 6 48 5s33 0 60 1s40-5 72-6s36 4 66 5s33 1 60 0" />
      </svg>
      <svg className={`${styles.horizon} ${styles.narrow}`} viewBox="0 0 390 18" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 7c18-2 34 1 52-1s30-4 48-2 36 4 54 2 28-5 46-4 34 4 52 3 30-3 46-3 34 3 50 2 26-2 42-1" />
      </svg>
    </>
  )
}
