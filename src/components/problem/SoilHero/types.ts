// SoilHero Types

export interface NavItem {
  id: string
  number: string
  title: string
  description: string
  depth: string
  soilColor: string
}

export interface RootPath {
  id: string
  path: string
  hairPositions: number[]
  targetY: number
}

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  type: 'pollen' | 'organism' | 'mineral' | 'moisture'
  layer: 'sky' | 'topSoil' | 'middleSoil' | 'deepSoil'
}

export interface SoilHeroProps {
  onNavigate: (sectionId: string) => void
}

export interface NavButtonProps {
  item: NavItem
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}

export interface RootBranchProps {
  path: RootPath
  isActive: boolean
  onComplete?: () => void
}

export interface HeroContentProps {
  isVisible: boolean
}

// Animation configuration types
export interface AnimationConfig {
  duration: number
  delay?: number
  ease?: string
  stagger?: number
}

// Constants
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'tomorodes',
    number: '01',
    title: 'A Tömörödés',
    description: 'Az öntözés okozta tömörödés hatásai a talajra',
    depth: '15 cm',
    soilColor: '#A0846B',
  },
  {
    id: 'szantas',
    number: '02',
    title: 'A Szántás Korlátai',
    description: 'Miért nem oldja meg a hagyományos művelés?',
    depth: '35 cm',
    soilColor: '#7D6B5A',
  },
  {
    id: 'vizgazdalkodas',
    number: '03',
    title: 'Vízgazdálkodás',
    description: 'Vízelvezetési problémák és következményeik',
    depth: '55 cm',
    soilColor: '#5C4D3D',
  },
]

// SVG Constants
// Note: The viewBox is 1920x1080, and we need to match CSS vh percentages
// CSS: sky = 8%, topSoil = 8-28% (20%), middleSoil = 28-48% (20%), deepSoil = 48-100% (52%)
export const SVG_CONFIG = {
  viewBox: '0 0 1920 1080',
  surfaceY: 86, // 8% of 1080 = 86.4
  plantX: 960,   // center
  stemHeight: 80, // Reduced height further to fit in 8% sky
}

// Root paths from main stem to nav buttons (RIGHT direction)
// Positions aimed at:
// - 18% (~194px): first root level (topsoil center)
// - 38% (~410px): second root level (middle soil center)
// - 58% (~626px): third root level (deep soil upper-mid)
export const ROOT_PATHS: RootPath[] = [
  {
    id: 'tomorodes',
    path: `M 960 194 Q 1110 184 1260 199 T 1560 194`,
    hairPositions: [0.2, 0.35, 0.5, 0.65, 0.8],
    targetY: 194,
  },
  {
    id: 'szantas',
    path: `M 960 410 Q 1140 400 1320 420 T 1600 410`,
    hairPositions: [0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
    targetY: 410,
  },
  {
    id: 'vizgazdalkodas',
    path: `M 960 626 Q 1120 646 1280 626 T 1540 626`,
    hairPositions: [0.25, 0.4, 0.55, 0.7, 0.85],
    targetY: 626,
  },
]

// Color palette
export const COLORS = {
  sky: {
    top: '#F5F1EB',
    bottom: '#E8E4DC',
  },
  surface: '#8B7355',
  topSoil: {
    light: '#A0846B',
    dark: '#96785E',
  },
  middleSoil: {
    light: '#7D6B5A',
    dark: '#6B5A4A',
  },
  deepSoil: {
    light: '#5C4D3D',
    dark: '#4A3E32',
  },
  plant: {
    stem: '#3B6834',
    leaf: '#5D9B4E',
  },
  root: {
    main: '#E8DFD4',
    secondary: '#D4C4B0',
    glow: 'rgba(232, 223, 212, 0.4)',
  },
  accent: {
    gold: '#C9A227',
    goldGlow: 'rgba(201, 162, 39, 0.3)',
  },
}
