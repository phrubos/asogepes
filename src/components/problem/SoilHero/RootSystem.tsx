'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'
import styles from './SoilHero.module.css'

interface RootSystemProps {
  onNavigate: (sectionId: string) => void
}

const cards = [
  {
    id: 'tomorodes',
    number: '01',
    title: 'A Tömörödés',
    description: 'Az öntözés okozta tömörödés hatásai',
  },
  {
    id: 'szantas',
    number: '02',
    title: 'A Szántás Korlátai',
    description: 'Miért nem oldja meg a hagyományos szántás?',
  },
  {
    id: 'vizgazdalkodas',
    number: '03',
    title: 'Vízgazdálkodás',
    description: 'Vízelvezetési problémák a talajban',
  },
]

export default function RootSystem({ onNavigate }: RootSystemProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const branch1Ref = useRef<SVGPathElement>(null)
  const branch2Ref = useRef<SVGPathElement>(null)
  const branch3Ref = useRef<SVGPathElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Card positions - right side, at different depths
  const cardPositions = [
    { top: '18%', right: '8%' },
    { top: '42%', right: '5%' },
    { top: '68%', right: '8%' },
  ]

  // SVG coordinates
  const SURFACE_Y = 108 // 10vh of 1080
  const PLANT_X = 960 // center

  // Branch paths from main root to cards
  const branchPaths = [
    `M ${PLANT_X} ${SURFACE_Y + 80} Q ${PLANT_X + 150} ${SURFACE_Y + 70}, ${PLANT_X + 300} ${SURFACE_Y + 85} T ${PLANT_X + 550} ${SURFACE_Y + 95}`,
    `M ${PLANT_X} ${SURFACE_Y + 250} Q ${PLANT_X + 180} ${SURFACE_Y + 240}, ${PLANT_X + 350} ${SURFACE_Y + 260} T ${PLANT_X + 600} ${SURFACE_Y + 340}`,
    `M ${PLANT_X} ${SURFACE_Y + 450} Q ${PLANT_X + 160} ${SURFACE_Y + 470}, ${PLANT_X + 320} ${SURFACE_Y + 500} T ${PLANT_X + 550} ${SURFACE_Y + 580}`,
  ]

  // Animate branch on hover
  const animateBranch = useCallback((pathRef: React.RefObject<SVGPathElement>, show: boolean) => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()

    if (show) {
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
    } else {
      gsap.to(path, {
        strokeDashoffset: length,
        duration: 0.4,
        ease: 'power2.in',
      })
    }
  }, [])

  // Handle card hover
  const handleCardHover = (index: number | null) => {
    setHoveredCard(index)
    const refs = [branch1Ref, branch2Ref, branch3Ref]
    
    refs.forEach((ref, i) => {
      animateBranch(ref, index === i)
    })
  }

  return (
    <div className={styles.rootContainer}>
      <svg
        ref={svgRef}
        className={styles.rootSvg}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="plantGreen" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3B6834" />
            <stop offset="50%" stopColor="#4A8040" />
            <stop offset="100%" stopColor="#5D9B4E" />
          </linearGradient>

          <linearGradient id="leafGreen" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3B6834" />
            <stop offset="100%" stopColor="#5D9B4E" />
          </linearGradient>

          <linearGradient id="rootGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8DFD4" />
            <stop offset="50%" stopColor="#D4C4B0" />
            <stop offset="100%" stopColor="#C9B8A4" />
          </linearGradient>

          <linearGradient id="branchGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4C4B0" />
            <stop offset="100%" stopColor="#C9B8A4" />
          </linearGradient>

          <filter id="plantGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Plant above ground */}
        <g className={styles.plantAboveGround} filter="url(#plantGlow)">
          {/* Main stem */}
          <path
            d={`M ${PLANT_X} ${SURFACE_Y} C ${PLANT_X - 2} ${SURFACE_Y - 40}, ${PLANT_X + 2} ${SURFACE_Y - 80}, ${PLANT_X} ${SURFACE_Y - 120}`}
            stroke="url(#plantGreen)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Secondary stems */}
          <path
            d={`M ${PLANT_X - 3} ${SURFACE_Y - 30} C ${PLANT_X - 20} ${SURFACE_Y - 55}, ${PLANT_X - 30} ${SURFACE_Y - 80}, ${PLANT_X - 25} ${SURFACE_Y - 105}`}
            stroke="url(#plantGreen)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${PLANT_X + 3} ${SURFACE_Y - 35} C ${PLANT_X + 22} ${SURFACE_Y - 58}, ${PLANT_X + 32} ${SURFACE_Y - 82}, ${PLANT_X + 27} ${SURFACE_Y - 108}`}
            stroke="url(#plantGreen)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leaves */}
          <ellipse cx={PLANT_X - 35} cy={SURFACE_Y - 90} rx="14" ry="24" fill="url(#leafGreen)" transform={`rotate(-40 ${PLANT_X - 35} ${SURFACE_Y - 90})`} />
          <ellipse cx={PLANT_X - 25} cy={SURFACE_Y - 65} rx="12" ry="20" fill="url(#leafGreen)" transform={`rotate(-30 ${PLANT_X - 25} ${SURFACE_Y - 65})`} />
          <ellipse cx={PLANT_X - 12} cy={SURFACE_Y - 42} rx="10" ry="17" fill="url(#leafGreen)" transform={`rotate(-20 ${PLANT_X - 12} ${SURFACE_Y - 42})`} />

          <ellipse cx={PLANT_X + 38} cy={SURFACE_Y - 95} rx="15" ry="26" fill="url(#leafGreen)" transform={`rotate(45 ${PLANT_X + 38} ${SURFACE_Y - 95})`} />
          <ellipse cx={PLANT_X + 28} cy={SURFACE_Y - 68} rx="13" ry="22" fill="url(#leafGreen)" transform={`rotate(35 ${PLANT_X + 28} ${SURFACE_Y - 68})`} />
          <ellipse cx={PLANT_X + 15} cy={SURFACE_Y - 45} rx="11" ry="19" fill="url(#leafGreen)" transform={`rotate(25 ${PLANT_X + 15} ${SURFACE_Y - 45})`} />

          {/* Top leaves */}
          <ellipse cx={PLANT_X - 15} cy={SURFACE_Y - 115} rx="11" ry="18" fill="url(#leafGreen)" transform={`rotate(-50 ${PLANT_X - 15} ${SURFACE_Y - 115})`} />
          <ellipse cx={PLANT_X + 17} cy={SURFACE_Y - 118} rx="12" ry="19" fill="url(#leafGreen)" transform={`rotate(55 ${PLANT_X + 17} ${SURFACE_Y - 118})`} />
        </g>

        {/* Main root below ground */}
        <path
          className={styles.mainRoot}
          d={`M ${PLANT_X} ${SURFACE_Y} 
              C ${PLANT_X + 3} ${SURFACE_Y + 80}, ${PLANT_X - 3} ${SURFACE_Y + 160}, ${PLANT_X} ${SURFACE_Y + 250}
              C ${PLANT_X + 5} ${SURFACE_Y + 350}, ${PLANT_X - 5} ${SURFACE_Y + 450}, ${PLANT_X} ${SURFACE_Y + 550}
              C ${PLANT_X + 3} ${SURFACE_Y + 620}, ${PLANT_X - 3} ${SURFACE_Y + 700}, ${PLANT_X} ${SURFACE_Y + 780}`}
          stroke="url(#rootGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Branch paths - animated on hover */}
        <path
          ref={branch1Ref}
          className={styles.branchPath}
          d={branchPaths[0]}
          stroke="url(#branchGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0"
        />
        <path
          ref={branch2Ref}
          className={styles.branchPath}
          d={branchPaths[1]}
          stroke="url(#branchGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0"
        />
        <path
          ref={branch3Ref}
          className={styles.branchPath}
          d={branchPaths[2]}
          stroke="url(#branchGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0"
        />
      </svg>

      {/* Navigation Cards */}
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={styles.navWrapper}
          style={{
            top: cardPositions[index].top,
            right: cardPositions[index].right,
          }}
          onMouseEnter={() => handleCardHover(index)}
          onMouseLeave={() => handleCardHover(null)}
        >
          <motion.div
            className={styles.navCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
            onClick={() => onNavigate(card.id)}
            whileHover={{ scale: 1.03, y: -8 }}
          >
            <div className={styles.cardNumber}>{card.number}</div>
            <div className={styles.cardDivider} />
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDescription}>{card.description}</p>
            <div className={styles.cardArrow}>→</div>
          </motion.div>
        </div>
      ))}
    </div>
  )
}
