// SoilHeroIsometric Types - "Izometrikus Talaj Blokk" Concept

export interface NavItem {
  id: string
  number: string
  title: string
  description: string
  depth: string
  depthCm: number
  color: string
  problem: string
  icon: 'droplet' | 'layers' | 'shovel'
}

export interface SoilLayer {
  id: string
  name: string
  depth: { start: number; end: number }
  color: string
  darkColor: string
  sideColor: string
  problemColor: string
  description: string
  problemDetails: string[]
}

export interface DrawerState {
  layerId: string
  isOpen: boolean
  openAmount: number // 0-1
}

export interface MousePosition {
  x: number
  y: number
  normalizedX: number // -1 to 1
  normalizedY: number // -1 to 1
}

export interface SoilHeroIsometricProps {
  onNavigate: (sectionId: string) => void
}

export interface IsometricBlockProps {
  isLoaded: boolean
  mousePosition: MousePosition
  openDrawers: DrawerState[]
  activeLayer: string | null
  onLayerClick: (layerId: string) => void
  onLayerHover: (layerId: string | null) => void
}

export interface LayerDrawerProps {
  layer: SoilLayer
  index: number
  isOpen: boolean
  isActive: boolean
  openAmount: number
  onToggle: () => void
  onHover: (hovering: boolean) => void
}

export interface HeroContentIsometricProps {
  isLoaded: boolean
  activeLayer: SoilLayer | null
}

export interface NavButtonIsometricProps {
  item: NavItem
  index: number
  isActive: boolean
  isOpen: boolean
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
    color: '#B8956B',
    problem: 'A víz nyomása összenyomja a talajszemcséket',
    icon: 'droplet',
  },
  {
    id: 'cultivator',
    number: '02',
    title: 'Nehézkultivátor',
    description: 'A hagyományos lazítás korlátai',
    depth: '15-35 cm',
    depthCm: 35,
    color: '#8B7355',
    problem: 'Nem éri el a kritikus mélységet',
    icon: 'layers',
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
    icon: 'shovel',
  },
]

export const SOIL_LAYERS: SoilLayer[] = [
  {
    id: 'topsoil',
    name: 'Termőréteg',
    depth: { start: 0, end: 15 },
    color: '#B8956B',
    darkColor: '#9A7B56',
    sideColor: '#7D6344',
    problemColor: '#C4A055',
    description: 'Felső humuszos réteg',
    problemDetails: [
      'Tömörödött szerkezet',
      'Csökkent porozitás',
      'Gyenge vízáteresztés',
    ],
  },
  {
    id: 'subsoil',
    name: 'Altalaj',
    depth: { start: 15, end: 35 },
    color: '#8B7355',
    darkColor: '#6E5A42',
    sideColor: '#574834',
    problemColor: '#9B8045',
    description: 'Átmeneti zóna',
    problemDetails: [
      'Kultivátor nem ér ide',
      'Gyökérzóna határa',
      'Tápanyag-felhalmozódás',
    ],
  },
  {
    id: 'hardpan',
    name: 'Eketalp',
    depth: { start: 35, end: 55 },
    color: '#5C4D3D',
    darkColor: '#463A2E',
    sideColor: '#352B21',
    problemColor: '#6B5530',
    description: 'Kritikus tömör réteg',
    problemDetails: [
      'Vízzáró réteg',
      'Pangó víz felette',
      'Gyökér nem hatol át',
    ],
  },
  {
    id: 'deepsoil',
    name: 'Mélyréteg',
    depth: { start: 55, end: 80 },
    color: '#4A3E32',
    darkColor: '#3A3028',
    sideColor: '#2A231C',
    problemColor: '#554530',
    description: 'Alsó talajréteg',
    problemDetails: [
      'Elérhetetlen mélység',
      'Természetes állapot',
      'Alapkőzet közelében',
    ],
  },
]

export const COLORS = {
  background: {
    primary: '#0D0B09',
    secondary: '#1A1614',
    tertiary: '#252019',
  },
  accent: {
    gold: '#C9A227',
    goldLight: '#E5C34A',
    goldDark: '#A68520',
    goldGlow: 'rgba(201, 162, 39, 0.4)',
  },
  text: {
    primary: '#F5F0E8',
    secondary: 'rgba(245, 240, 232, 0.7)',
    muted: 'rgba(245, 240, 232, 0.4)',
  },
  ui: {
    border: 'rgba(201, 162, 39, 0.15)',
    borderHover: 'rgba(201, 162, 39, 0.3)',
    surface: 'rgba(255, 255, 255, 0.03)',
    surfaceHover: 'rgba(255, 255, 255, 0.06)',
  },
}

export const ANIMATION = {
  drawerOpenDistance: 120, // px to pull out
  rotationIntensity: 15, // degrees max rotation
  transitionDuration: 0.6,
  staggerDelay: 0.08,
}
