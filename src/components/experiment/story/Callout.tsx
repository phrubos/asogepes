import { useMediaQuery } from '@/hooks/useMediaQuery'
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

/** Break a line into at most two lines of about `max` characters */
function wrap(text: string, max: number): string[] {
  if (text.length <= max) return [text]
  const words = text.split(' ')
  let first = ''
  for (const word of words) {
    const next = first ? `${first} ${word}` : word
    if (next.length > max && first) break
    first = next
  }
  const rest = text.slice(first.length).trim()
  return rest ? [first, rest] : [first]
}

/**
 * An annotation on a mark: a dot on the mark, a leader line and a label box with a value and one line.
 * The box width comes from the text length (mono value, sans line), and it stays inside the drawing.
 * On phones and tablets (<= 1024 px, where the charts switch to their narrow drawing) the box is
 * smaller and a long line breaks in two, so it covers less of the chart. The sizes keep the
 * rendered text at 12 px or more on a 360 px screen.
 */
export default function Callout({ x, y, side, dy = 0, main, sub, fs, w, h, grey, delay = 250 }: CalloutProps) {
  const compact = useMediaQuery('(max-width: 1024px)') === true
  const mainSize = fs * (compact ? 1.05 : 1.3)
  // the line stays at 0.95: smaller would render under 12 px on a 360 px screen
  const subSize = fs * 0.95
  const pad = fs * (compact ? 0.5 : 0.85)
  const subLines = sub ? (compact ? wrap(sub, Math.round((w * 0.42) / (subSize * 0.54))) : [sub]) : []
  const lineH = subSize * 1.25
  const subW = Math.max(0, ...subLines.map((l) => l.length * subSize * 0.54))
  const boxW = Math.max(main.length * mainSize * 0.62, subW) + pad * 2
  const boxH = pad * 2 + mainSize + (subLines.length ? subSize * 0.2 + lineH * subLines.length : 0)
  const gap = fs * (compact ? 1.6 : 2.4)
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
      <rect x={bx} y={by} width={boxW} height={boxH} rx={fs * (compact ? 0.5 : 0.7)} className={styles.calloutBox} />
      <text x={bx + pad} y={by + pad + mainSize * 0.8} fontSize={mainSize} className={styles.calloutMain}>
        {main}
      </text>
      {subLines.map((line, i) => (
        <text key={i} x={bx + pad} y={by + pad + mainSize + subSize * 0.2 + lineH * i + subSize * 0.95} fontSize={subSize} className={styles.calloutSub}>
          {line}
        </text>
      ))}
    </g>
  )
}
