// SoilHeroSlider Types - "Before/After Slider" Concept
// Comparing healthy vs. compacted soil with interactive drag slider

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

export interface SoilState {
  id: 'healthy' | 'damaged'
  label: string
  description: string
  characteristics: string[]
}

export interface ParticleConfig {
  count: number
  minSize: number
  maxSize: number
  speed: number
  opacity: number
}

export interface RootConfig {
  segments: number
  maxDepth: number
  thickness: number
  branches: number
}

export interface SoilHeroSliderProps {
  onNavigate: (sectionId: string) => void
}

export interface SliderVisualizationProps {
  isLoaded: boolean
  sliderPosition: number
  onSliderChange: (position: number) => void
  isDragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
}

export interface SliderHandleProps {
  position: number
  isDragging: boolean
  onDrag: (position: number) => void
  onDragStart: () => void
  onDragEnd: () => void
}

export interface SoilVisualizationProps {
  type: 'healthy' | 'damaged'
  isVisible: boolean
  animationProgress: number
}

export interface HeroContentSliderProps {
  isLoaded: boolean
  sliderPosition: number
}

export interface NavButtonSliderProps {
  item: NavItem
  index: number
  isActive: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}

// Navigation items for the problem sections
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

// Soil states for comparison
export const SOIL_STATES: Record<'healthy' | 'damaged', SoilState> = {
  healthy: {
    id: 'healthy',
    label: 'Egészséges talaj',
    description: 'Laza, jól szellőző szerkezet',
    characteristics: [
      'Porózus struktúra',
      'Szabad vízáramlás',
      'Aktív gyökérzet',
      'Mikroorganizmusok',
    ],
  },
  damaged: {
    id: 'damaged',
    label: 'Tömörödött talaj',
    description: 'Sérült, összepréselődött szerkezet',
    characteristics: [
      'Tömör rétegek',
      'Pangó víz',
      'Satnya gyökerek',
      'Oxigénhiány',
    ],
  },
}

// Color palette
export const COLORS = {
  background: '#0D0B09',
  surface: '#1A1714',
  surfaceLight: '#2D2A26',

  // Healthy soil colors
  healthy: {
    primary: '#4A7C59',
    secondary: '#6B9B7A',
    accent: '#8FBC8F',
    soil: '#8B7355',
    soilLight: '#A08060',
    water: '#5BA3C0',
    root: '#3D6B4F',
  },

  // Damaged soil colors
  damaged: {
    primary: '#8B4513',
    secondary: '#A0522D',
    accent: '#CD853F',
    soil: '#6B4423',
    soilDark: '#4A2F17',
    water: '#4A6A7A',
    root: '#5C4033',
  },

  // UI colors
  accent: {
    gold: '#D4A84B',
    goldGlow: 'rgba(212, 168, 75, 0.4)',
    slider: '#E8C547',
    sliderGlow: 'rgba(232, 197, 71, 0.5)',
  },

  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.75)',
    muted: 'rgba(255, 255, 255, 0.5)',
    dark: '#1A1714',
  },
}

// Animation configurations
export const ANIMATION = {
  // Slider
  sliderDamping: 30,
  sliderStiffness: 400,

  // Particles
  particleSpeed: 0.5,
  particleDensity: {
    healthy: 40,
    damaged: 15,
  },

  // Roots
  rootGrowthDuration: 2,
  rootBreathingSpeed: 3,

  // Water drops
  waterDropInterval: 800,
  waterDropSpeed: 1.5,

  // Morphing
  morphDuration: 0.6,

  // Entrance
  entranceDelay: 0.2,
  entranceStagger: 0.1,
}

// Particle configurations
export const PARTICLE_CONFIG: Record<'healthy' | 'damaged', ParticleConfig> = {
  healthy: {
    count: 60,
    minSize: 3,
    maxSize: 12,
    speed: 0.8,
    opacity: 0.7,
  },
  damaged: {
    count: 25,
    minSize: 8,
    maxSize: 18,
    speed: 0.1,
    opacity: 0.5,
  },
}

// Root configurations
export const ROOT_CONFIG: Record<'healthy' | 'damaged', RootConfig> = {
  healthy: {
    segments: 8,
    maxDepth: 90,
    thickness: 4,
    branches: 5,
  },
  damaged: {
    segments: 4,
    maxDepth: 35,
    thickness: 2,
    branches: 2,
  },
}
