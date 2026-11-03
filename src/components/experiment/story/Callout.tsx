import styles from './Story.module.css'

interface CalloutProps {
  /** The mark it explains, in SVG units */
  x: number
  y: number
  /** Where the label goes from the mark */
  side: 'left' | 'right'
  /** Vertical shift of the label's centre from the mark */
  dy?: number
  main: string
  sub?: string
  /** Base font size of the chart, in SVG units */
  fs: number
  /** The drawing's size: the label is kept inside it */
  w: number
  h: number
  grey?: boolean
  delay?: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

/**
 * An annotation on a mark: a dot on the mark, a leader line and a label box with a value and one line.
 * The box width comes from the text length (mono value, sans line), and it stays inside the drawing.
 */
export default function Callout({ x, y, side, dy = 0, main, sub, fs, w, h, grey, delay = 250 }: CalloutProps) {
  const mainSize = fs * 1.3
  const subSize = fs * 0.95
  const pad = fs * 0.85
  const boxW = Math.max(main.length * mainSize * 0.62, sub ? sub.length * subSize * 0.54 : 0) + pad * 2
  const boxH = pad * 2 + mainSize + (sub ? subSize * 1.45 : 0)
  const gap = fs * 2.4
  const bx = clamp(side === 'right' ? x + gap : x - gap - boxW, 2, w - boxW - 2)
  let by = clamp(y + dy - boxH / 2, 2, h - boxH - 2)
  // Squeezed against the edge so that it would sit on the mark: move it above (or below) the mark instead
  if (x > bx - fs && x < bx + boxW + fs && y > by - fs && y < by + boxH + fs) {
    by = dy > 0 ? y + fs * 1.4 : y - fs * 1.4 - boxH
    by = clamp(by, 2, h - boxH - 2)
  }
  const ex = clamp(x, bx, bx + boxW)
  const ey = clamp(y, by, by + boxH)
  return (
    <g className={`${styles.callout} ${grey ? styles.calloutGrey : ''}`} style={{ animationDelay: `${delay}ms` }} aria-hidden="true">
      <line x1={x} y1={y} x2={ex} y2={ey} className={styles.calloutLine} />
      <circle cx={x} cy={y} r={fs * 0.3} className={styles.calloutDot} />
      <rect x={bx} y={by} width={boxW} height={boxH} rx={fs * 0.7} className={styles.calloutBox} />
      <text x={bx + pad} y={by + pad + mainSize * 0.8} fontSize={mainSize} className={styles.calloutMain}>
        {main}
      </text>
      {sub && (
        <text x={bx + pad} y={by + pad + mainSize + subSize * 1.15} fontSize={subSize} className={styles.calloutSub}>
          {sub}
        </text>
      )}
    </g>
  )
}
