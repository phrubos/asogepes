'use client'

import { motion } from 'framer-motion'

interface TreatmentIconProps {
  type: 'spade' | 'deep-spade' | 'loosener' | 'plough' | 'combinator' | 'cultivator' | 'harrow'
  size?: number
  color?: string
  className?: string
  animated?: boolean
}

export default function TreatmentIcon({
  type,
  size = 48,
  color = 'currentColor',
  className = '',
  animated = false
}: TreatmentIconProps) {
  const iconVariants = {
    initial: { opacity: animated ? 0 : 1, y: animated ? 5 : 0 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, y: -2 }
  }

  const renderIcon = () => {
    switch (type) {
      // Ásógép (normál)
      case 'spade':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Váz */}
            <path
              d="M8 16h48v4H8z"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            {/* Ásólapátok */}
            <path
              d="M12 20v24c0 2 1 4 3 4h2c2 0 3-2 3-4V20"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M24 20v28c0 2 1 4 3 4h2c2 0 3-2 3-4V20"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M36 20v24c0 2 1 4 3 4h2c2 0 3-2 3-4V20"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M48 20v20c0 2 1 4 3 4h2c2 0 3-2 3-4V20"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            {/* Tengelyek */}
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
            <circle cx="52" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
          </svg>
        )

      // Mélyásógép
      case 'deep-spade':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Váz */}
            <path
              d="M8 12h48v4H8z"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            {/* Mélyebb ásólapátok */}
            <path
              d="M14 16v32c0 3 2 6 4 6h2c2 0 4-3 4-6V16"
              stroke={color}
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M28 16v36c0 3 2 6 4 6h2c2 0 4-3 4-6V16"
              stroke={color}
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M42 16v32c0 3 2 6 4 6h2c2 0 4-3 4-6V16"
              stroke={color}
              strokeWidth="2.5"
              fill="none"
            />
            {/* Erősebb tengely */}
            <rect x="6" y="8" width="52" height="6" rx="2" stroke={color} strokeWidth="2" fill="none" />
          </svg>
        )

      // Lazító/Mélylazító
      case 'loosener':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Főgerenda */}
            <path
              d="M8 16h48"
              stroke={color}
              strokeWidth="3"
            />
            {/* Lazítókések */}
            <path
              d="M16 16L12 52"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M32 16L28 56"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M48 16L44 52"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Kés hegyek */}
            <path d="M10 52l2-4 2 4z" fill={color} />
            <path d="M26 56l2-4 2 4z" fill={color} />
            <path d="M42 52l2-4 2 4z" fill={color} />
          </svg>
        )

      // Eke (szántás)
      case 'plough':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Főváz */}
            <path
              d="M8 20h48"
              stroke={color}
              strokeWidth="2"
            />
            {/* Ekevasak - klasszikus forma */}
            <path
              d="M16 20c0 0-4 8-4 16c0 4 2 8 8 10c4 1 8-2 8-8c0-4-2-10-4-14"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M32 20c0 0-4 8-4 16c0 4 2 8 8 10c4 1 8-2 8-8c0-4-2-10-4-14"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M48 20c0 0-4 8-4 16c0 4 2 8 8 10c2 0.5 4-1 4-4c0-4-2-12-4-18"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            {/* Kormánylemezek */}
            <path d="M12 36c4-2 8-2 12 0" stroke={color} strokeWidth="1.5" />
            <path d="M28 36c4-2 8-2 12 0" stroke={color} strokeWidth="1.5" />
            <path d="M44 36c4-2 6-2 8 0" stroke={color} strokeWidth="1.5" />
          </svg>
        )

      // Kombinátor
      case 'combinator':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Vázkeret */}
            <rect x="6" y="12" width="52" height="8" rx="2" stroke={color} strokeWidth="2" fill="none" />
            {/* Első sor - tárcsák */}
            <circle cx="14" cy="28" r="6" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="32" cy="28" r="6" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="28" r="6" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Második sor - simítóvas */}
            <path d="M8 42h48" stroke={color} strokeWidth="2" />
            {/* Harmadik sor - henger */}
            <ellipse cx="32" cy="52" rx="24" ry="6" stroke={color} strokeWidth="2" fill="none" />
            {/* Összekötők */}
            <path d="M14 20v2M32 20v2M50 20v2" stroke={color} strokeWidth="1.5" />
            <path d="M14 34v6M32 34v6M50 34v6" stroke={color} strokeWidth="1.5" />
          </svg>
        )

      // Nehézkultivátor
      case 'cultivator':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Főváz */}
            <path d="M4 16h56" stroke={color} strokeWidth="3" />
            {/* Kultivátorkapák - lúdláb forma */}
            <path
              d="M10 16v12l-4 8h8l-4-8"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M22 16v16l-5 10h10l-5-10"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M34 16v12l-4 8h8l-4-8"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M46 16v16l-5 10h10l-5-10"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M58 16v12l-4 8h8l-4-8"
              stroke={color}
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
        )

      // Ásóborona
      case 'harrow':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Vázkeret */}
            <rect x="8" y="14" width="48" height="6" rx="1" stroke={color} strokeWidth="2" fill="none" />
            {/* Ásófogak - két sor */}
            <g>
              <path d="M12 20v14c0 1 0.5 2 1.5 2s1.5-1 1.5-2V20" stroke={color} strokeWidth="1.5" fill="none" />
              <path d="M20 20v18c0 1 0.5 2 1.5 2s1.5-1 1.5-2V20" stroke={color} strokeWidth="1.5" fill="none" />
              <path d="M28 20v14c0 1 0.5 2 1.5 2s1.5-1 1.5-2V20" stroke={color} strokeWidth="1.5" fill="none" />
              <path d="M36 20v18c0 1 0.5 2 1.5 2s1.5-1 1.5-2V20" stroke={color} strokeWidth="1.5" fill="none" />
              <path d="M44 20v14c0 1 0.5 2 1.5 2s1.5-1 1.5-2V20" stroke={color} strokeWidth="1.5" fill="none" />
              <path d="M52 20v18c0 1 0.5 2 1.5 2s1.5-1 1.5-2V20" stroke={color} strokeWidth="1.5" fill="none" />
            </g>
            {/* Tengely jelölés */}
            <circle cx="10" cy="10" r="2" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="54" cy="10" r="2" stroke={color} strokeWidth="1.5" fill="none" />
            <path d="M10 12v2M54 12v2" stroke={color} strokeWidth="1.5" />
          </svg>
        )

      default:
        return null
    }
  }

  if (animated) {
    return (
      <motion.div
        className={className}
        variants={iconVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        transition={{ duration: 0.3 }}
      >
        {renderIcon()}
      </motion.div>
    )
  }

  return <div className={className}>{renderIcon()}</div>
}

// Helper function to get icon type from treatment name
export function getTreatmentIconType(treatment: string): TreatmentIconProps['type'] | null {
  const lowerTreatment = treatment.toLowerCase()

  if (lowerTreatment.includes('mélyásógép') || lowerTreatment.includes('mély.ág')) {
    return 'deep-spade'
  }
  if (lowerTreatment.includes('ásógép') || lowerTreatment.includes('ásóborona')) {
    return 'spade'
  }
  if (lowerTreatment.includes('lazít')) {
    return 'loosener'
  }
  if (lowerTreatment.includes('szántás') || lowerTreatment.includes('eke')) {
    return 'plough'
  }
  if (lowerTreatment.includes('kombinátor')) {
    return 'combinator'
  }
  if (lowerTreatment.includes('kultivátor')) {
    return 'cultivator'
  }

  return null
}
