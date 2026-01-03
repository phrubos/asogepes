// SoilHeroInteractive Types - "Interaktív Talajszelvény" Concept

export interface SoilLayer {
  id: string
  name: string
  depth: { start: number; end: number }
  color: string
  hoverColor: string
  problem: string
  description: string
  navId: string
}

export interface NavItem {
  id: string
  number: string
  title: string
  subtitle: string
  depth: string
  color: string
}

export interface SoilHeroInteractiveProps {
  onNavigate: (sectionId: string) => void
}

// Soil layer data
export const SOIL_LAYERS: SoilLayer[] = [
  {
    id: 'topsoil',
    name: 'Termőréteg',
    depth: { start: 0, end: 15 },
    color: '#8B7355',
    hoverColor: '#A0846B',
    problem: 'Tömörödés',
    description: 'Az öntözés okozta talajszerkezet romlás',
    navId: 'compaction',
  },
  {
    id: 'subsoil',
    name: 'Altalaj',
    depth: { start: 15, end: 35 },
    color: '#6B5B4F',
    hoverColor: '#7D6B5A',
    problem: 'Kultivátor határ',
    description: 'A hagyományos lazítás nem éri el',
    navId: 'cultivator',
  },
  {
    id: 'deepsoil',
    name: 'Mélyréteg',
    depth: { start: 35, end: 55 },
    color: '#4A4038',
    hoverColor: '#5C4D3D',
    problem: 'Eketalp zóna',
    description: 'Pangó víz, gyökérakadás',
    navId: 'ploughing',
  },
]

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'compaction',
    number: '01',
    title: 'Tömörödés',
    subtitle: 'Az öntözés okozta talajszerkezet romlás',
    depth: '0-15 cm',
    color: '#A0846B',
  },
  {
    id: 'cultivator',
    number: '02',
    title: 'Nehézkultivátor',
    subtitle: 'A hagyományos lazítás korlátai',
    depth: '15-35 cm',
    color: '#7D6B5A',
  },
  {
    id: 'ploughing',
    number: '03',
    title: 'Szántás',
    subtitle: 'A mélyszántás valódi hatásai',
    depth: '35-55 cm',
    color: '#5C4D3D',
  },
]

export const COLORS = {
  background: '#1a1814',
  backgroundAlt: '#0f0e0c',
  surface: '#2D2A26',
  gold: '#C9A227',
  goldLight: '#D4B342',
  goldDim: 'rgba(201, 162, 39, 0.15)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.4)',
  },
  soil: {
    healthy: '#6B8E4E',
    stressed: '#8B6914',
  },
}

export const DEPTH_MARKERS = [0, 15, 35, 55]
