'use client'

import { motion } from 'framer-motion'

/*
 * Side view of the soil for the bulk-density steps. 8 px = 1 cm; the surface is at y = 60,
 * so 10 cm is y = 140 and 15 cm is y = 180; the view ends just under 20 cm (y = 228). The cylinder (5 × 5 cm) samples the 10–15 cm band.
 */
const CM = 8
const SURFACE = 60
const y = (cm: number) => SURFACE + cm * CM
const CYL = { x: 116, w: 40, h: 40 }

/** Cylinder offset per step: on the pit floor, pressed in, pressed in (dug around), lifted out, lifted out */
const CYL_POS = [
  { x: 0, y: -CYL.h },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 120, y: SURFACE - 8 - y(10) - CYL.h },
  { x: 120, y: SURFACE - 8 - y(10) - CYL.h },
]

const LABEL = [
  'a henger a gödör alján áll',
  'a henger 10–15 cm mélyen a talajban',
  'a henger körül kiásott föld',
  'a kiemelt, lezárt henger a felszínen',
  '100 cm³ talaj a hengerben',
]

export default function BulkDensityDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const t = reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  const fade = reduced ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' as const }
  const pos = CYL_POS[step]
  const filled = step >= 1
  const capped = step >= 3

  return (
    <svg
      viewBox="0 0 360 228"
      role="img"
      aria-label={`Metszet: ${LABEL[step]}`}
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
    >
      <defs>
        <pattern id="bd-loose" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#5a4634" />
          <circle cx="3" cy="4" r="1.3" fill="#7a624a" />
          <circle cx="10" cy="10" r="1.6" fill="#6c5640" />
        </pattern>
        <pattern id="bd-dense" width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#3d3024" />
          <circle cx="2" cy="2" r="1" fill="#54432f" />
          <circle cx="5.5" cy="5.5" r="1" fill="#4b3b2a" />
        </pattern>
        <linearGradient id="bd-steel" x1="0" x2="1">
          <stop offset="0" stopColor="#8d8a84" />
          <stop offset="0.45" stopColor="#d9d5cc" />
          <stop offset="1" stopColor="#7b7770" />
        </linearGradient>
      </defs>

      {/* soil: loose top layer, denser layer from 10 cm */}
      <rect x="0" y={SURFACE} width="300" height={y(10) - SURFACE} fill="url(#bd-loose)" />
      <rect x="0" y={y(10)} width="300" height={228 - y(10)} fill="url(#bd-dense)" />
      <line x1="0" x2="300" y1={SURFACE} y2={SURFACE} stroke="#8a7257" strokeWidth="1.5" />

      {/* grass on the surface */}
      {[18, 30, 284, 294].map((gx) => (
        <path
          key={gx}
          d={`M${gx} ${SURFACE} q-3 -10 -7 -16 M${gx} ${SURFACE} q1 -12 2 -20 M${gx} ${SURFACE} q4 -9 9 -14`}
          stroke="#6b8b5e"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      ))}

      {/* the pit, dug down to 10 cm */}
      <path d={`M56 ${SURFACE} L72 ${y(10)} L238 ${y(10)} L250 ${SURFACE} Z`} fill="#1f1a16" />

      {/* dug around the cylinder (step 3 on) */}
      <motion.path
        d={`M${CYL.x + CYL.w} ${y(10)} L${CYL.x + CYL.w} ${y(15) + 4} L${CYL.x + CYL.w + 44} ${y(15) + 4} L${CYL.x + CYL.w + 56} ${y(10)} Z`}
        fill="#1f1a16"
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={fade}
      />

      {/* where the sample came from (after lifting) */}
      <motion.rect
        x={CYL.x}
        y={y(10)}
        width={CYL.w}
        height={CYL.h}
        fill="#1f1a16"
        stroke="#d4a84b"
        strokeOpacity="0.5"
        strokeDasharray="3 3"
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        transition={fade}
      />

      {/* the 10–15 cm band */}
      <motion.rect
        x="0"
        y={y(10)}
        width="300"
        height={y(15) - y(10)}
        fill="rgba(212,168,75,0.08)"
        stroke="#d4a84b"
        strokeWidth="1.2"
        strokeDasharray="5 4"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={fade}
      />

      {/* depth scale */}
      <g fontFamily="var(--font-body)" fontSize="13" fill="rgba(245,240,232,0.75)">
        <line x1="310" x2="310" y1={SURFACE} y2={y(20)} stroke="rgba(245,240,232,0.35)" />
        {[0, 10, 15, 20].map((cm) => (
          <g key={cm}>
            <line x1="306" x2="314" y1={y(cm)} y2={y(cm)} stroke={cm === 10 || cm === 15 ? '#d4a84b' : 'rgba(245,240,232,0.35)'} />
            <text x="320" y={y(cm) + 4.5} fill={cm === 10 || cm === 15 ? '#e8c87a' : undefined}>
              {cm} cm
            </text>
          </g>
        ))}
      </g>

      {/* the cylinder */}
      <motion.g initial={false} animate={{ x: pos.x, y: pos.y }} transition={t}>
        <rect x={CYL.x} y={y(10)} width={CYL.w} height={CYL.h} fill={filled ? 'url(#bd-dense)' : '#1f1a16'} />
        <rect x={CYL.x} y={y(10)} width={CYL.w} height={CYL.h} fill="none" stroke="url(#bd-steel)" strokeWidth="3" />
        <motion.g initial={false} animate={{ opacity: capped ? 1 : 0 }} transition={fade}>
          <rect x={CYL.x - 3} y={y(10) - 6} width={CYL.w + 6} height="7" rx="2" fill="#e8e0d4" />
          <rect x={CYL.x - 3} y={y(10) + CYL.h - 1} width={CYL.w + 6} height="7" rx="2" fill="#e8e0d4" />
        </motion.g>
      </motion.g>

      {/* volume label on the lifted cylinder */}
      <motion.text
        x={CYL.x + CYL.w + 120 + 12}
        y={SURFACE - 8 - CYL.h / 2 + 4.5}
        fontFamily="var(--font-body)"
        fontSize="14"
        fontWeight="600"
        fill="#e8c87a"
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0 }}
        transition={fade}
      >
        100 cm³
      </motion.text>
    </svg>
  )
}
