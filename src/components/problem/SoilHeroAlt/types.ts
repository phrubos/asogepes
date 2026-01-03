// SoilHeroAlt Types - "Talaj Röntgen" Concept

export interface NavItem {
  id: string
  number: string
  title: string
  description: string
  depth: string
  depthCm: number
  color: string
  problem: string
}

export interface SoilLayer {
  id: string
  name: string
  depth: { start: number; end: number }
  color: string
  problemColor: string
  description: string
}

export interface ScanState {
  isScanning: boolean
  scanProgress: number
  revealedLayers: string[]
}

export interface XRayReveal {
  isActive: boolean
  mouseX: number
  mouseY: number
  radius: number
}

export interface SoilHeroAltProps {
  onNavigate: (sectionId: string) => void
}

export interface XRayVisualizationProps {
  isLoaded: boolean
  scrollProgress: number
  xrayReveal: XRayReveal
  onMouseMove: (x: number, y: number) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export interface ScanLineProps {
  isActive: boolean
  progress: number
  onScanComplete?: () => void
}

export interface SoilBlockProps {
  layers: SoilLayer[]
  revealedProblems: string[]
  scrollProgress: number
}

export interface HeroContentAltProps {
  isLoaded: boolean
}

export interface NavButtonAltProps {
  item: NavItem
  index: number
  isActive: boolean
  isRevealed: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}

// Constants
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'compaction',
    number: '01',
    title: 'Tömörödés',
    description: 'Az öntözés okozta talajszerkezet romlás',
    depth: '0-15 cm',
    depthCm: 15,
    color: '#A0846B',
    problem: 'A víz nyomása összenyomja a talajszemcséket',
  },
  {
    id: 'cultivator',
    number: '02',
    title: 'Nehézkultivátor',
    description: 'A hagyományos lazítás korlátai',
    depth: '15-35 cm',
    depthCm: 35,
    color: '#7D6B5A',
    problem: 'Nem éri el a kritikus mélységet',
  },
  {
    id: 'ploughing',
    number: '03',
    title: 'Szántás',
    description: 'A mélyszántás valódi hatásai',
    depth: '35-55 cm',
    depthCm: 55,
    color: '#5C4D3D',
    problem: 'Eketalp képződés, pangó víz',
  },
]

export const SOIL_LAYERS: SoilLayer[] = [
  {
    id: 'topsoil',
    name: 'Termőréteg',
    depth: { start: 0, end: 15 },
    color: '#A0846B',
    problemColor: '#8B6914',
    description: 'Tömörödött felső réteg',
  },
  {
    id: 'subsoil',
    name: 'Altalaj',
    depth: { start: 15, end: 35 },
    color: '#7D6B5A',
    problemColor: '#6B4A14',
    description: 'Kultivátor határa',
  },
  {
    id: 'deepsoil',
    name: 'Mélyréteg',
    depth: { start: 35, end: 55 },
    color: '#5C4D3D',
    problemColor: '#4A3214',
    description: 'Eketalp zóna',
  },
  {
    id: 'bedrock',
    name: 'Alapkőzet',
    depth: { start: 55, end: 100 },
    color: '#4A3E32',
    problemColor: '#3A2E22',
    description: 'Elérhetetlen mélység',
  },
]

export const COLORS = {
  background: '#1a1814',
  surface: '#2D2A26',
  accent: {
    gold: '#C9A227',
    goldGlow: 'rgba(201, 162, 39, 0.4)',
    scan: '#00D4FF',
    scanGlow: 'rgba(0, 212, 255, 0.3)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
  },
  xray: {
    healthy: 'rgba(100, 200, 100, 0.3)',
    problem: 'rgba(255, 100, 100, 0.4)',
    highlight: 'rgba(0, 212, 255, 0.2)',
  },
}

// Animation configs
export const ANIMATION = {
  scanDuration: 2.5,
  revealDelay: 0.15,
  xrayRadius: 150,
  parallaxIntensity: 0.3,
}
