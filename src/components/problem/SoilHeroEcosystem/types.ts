// SoilHeroEcosystem Types - "Élő Ökoszisztéma" Concept

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
  compactionLevel: number // 0-1, how compacted (affects particle flow)
  description: string
}

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  stuck: boolean
  stuckTime: number
  layer: string | null
}

export interface RootBranch {
  id: string
  startX: number
  startY: number
  segments: RootSegment[]
  health: number // 0-1
  growing: boolean
}

export interface RootSegment {
  endX: number
  endY: number
  thickness: number
  angle: number
}

export interface MicroOrganism {
  id: number
  x: number
  y: number
  type: 'bacteria' | 'nematode' | 'protozoa'
  size: number
  speed: number
  angle: number
  wobble: number
}

export interface SoilHeroEcosystemProps {
  onNavigate: (sectionId: string) => void
}

export interface EcosystemVisualizationProps {
  isLoaded: boolean
  isRaining: boolean
  scrollProgress: number
  activeLayer: string | null
  onLayerHover: (layerId: string | null) => void
}

export interface WaterParticlesProps {
  isRaining: boolean
  layers: SoilLayer[]
  activeLayer: string | null
  width: number
  height: number
}

export interface RootSystemProps {
  isLoaded: boolean
  activeLayer: string | null
  containerHeight: number
}

export interface MicroOrganismsProps {
  isLoaded: boolean
  layers: SoilLayer[]
}

export interface HeroContentEcoProps {
  isLoaded: boolean
  onStartRain: () => void
  isRaining: boolean
}

export interface NavButtonEcoProps {
  item: NavItem
  index: number
  isActive: boolean
  onHover: (id: string | null) => void
  onClick: () => void
}

// Navigation Items
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

// Soil Layers with compaction levels
export const SOIL_LAYERS: SoilLayer[] = [
  {
    id: 'topsoil',
    name: 'Termőréteg',
    depth: { start: 0, end: 20 },
    color: '#A0846B',
    compactionLevel: 0.3,
    description: 'Felszíni tömörödés',
  },
  {
    id: 'subsoil',
    name: 'Altalaj',
    depth: { start: 20, end: 45 },
    color: '#7D6B5A',
    compactionLevel: 0.6,
    description: 'Kultivátor határa',
  },
  {
    id: 'hardpan',
    name: 'Eketalp',
    depth: { start: 45, end: 60 },
    color: '#5C4D3D',
    compactionLevel: 0.95,
    description: 'Kritikus tömörödés',
  },
  {
    id: 'deepsoil',
    name: 'Mélyréteg',
    depth: { start: 60, end: 100 },
    color: '#4A3E32',
    compactionLevel: 0.4,
    description: 'Természetes állapot',
  },
]

// Color Constants
export const COLORS = {
  background: '#0D0B09',
  surface: '#1a1814',
  surfaceLight: '#2D2A26',
  accent: {
    gold: '#C9A227',
    goldGlow: 'rgba(201, 162, 39, 0.4)',
    water: '#00D4FF',
    waterGlow: 'rgba(0, 212, 255, 0.6)',
    waterDark: '#0099CC',
  },
  root: {
    healthy: '#5A8F5A',
    stressed: '#8B7355',
    tip: '#7CB87C',
  },
  organism: {
    bacteria: 'rgba(180, 200, 160, 0.6)',
    nematode: 'rgba(200, 180, 160, 0.5)',
    protozoa: 'rgba(160, 200, 180, 0.4)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
  },
}

// Physics Constants
export const PHYSICS = {
  gravity: 0.15,
  friction: 0.98,
  bounce: 0.3,
  particleRadius: { min: 2, max: 5 },
  maxParticles: 200,
  spawnRate: 3, // particles per frame when raining
  drizzleRate: 0.3, // particles per frame ambient
}

// Animation Constants
export const ANIMATION = {
  rainDuration: 5000,
  rootGrowthDuration: 2000,
  layerTransition: 0.4,
  staggerDelay: 0.1,
}
