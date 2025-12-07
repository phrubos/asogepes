# 04 — Kutatás

## Útvonal
`/kutatas` → `src/app/kutatas/page.tsx`

> **Megjegyzés:** Jelenleg `/kiserlet` néven létezik. Átnevezés + bővítés szükséges.

---

## Cél
Bemutatni a kísérleti helyszíneket, körülményeket és a mérési módszertant — tudományos igényességgel, de vizuálisan vonzó módon.

---

## Oldalszerkezet

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "3 helyszín, 7 kezelés, 4 hónap"                         │
├─────────────────────────────────────────────────────────────────┤
│  TÉRKÉP - Interaktív Magyarország térkép                        │
├─────────────────────────────────────────────────────────────────┤
│  HELYSZÍNEK - Tab/Kártya rendszer                               │
│  (Lakitelek, Kecskemét-Borbás, Szentkirály)                     │
├─────────────────────────────────────────────────────────────────┤
│  MÉRÉSI MÓDSZEREK - 4 interaktív blokk                          │
├─────────────────────────────────────────────────────────────────┤
│  IDŐBELI LEFOLYÁS - Animated timeline                           │
├─────────────────────────────────────────────────────────────────┤
│  ÁTVEZETŐ CTA → Eredmények                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Szekciók

### 1. HERO SZEKCIÓ

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Section Number] 03                                            │
│  [Title] A Kutatás                                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │    3 helyszín · 7 kezelési mód · 4 hónap                │    │
│  │                                                         │    │
│  │    Tudományos igényességgel vizsgáltuk                  │    │
│  │    az ásógép hatását.                                   │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │  450 mm  │  │    7     │  │    4     │                       │
│  │  öntözés │  │ parcella │  │  mérés   │                       │
│  │  max     │  │ Lakitelek│  │ /helysz. │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Animációk
```typescript
// Számok split animációja
<motion.div className={styles.statGrid}>
  {stats.map((stat, i) => (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
    >
      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
      <span>{stat.label}</span>
    </motion.div>
  ))}
</motion.div>
```

---

### 2. INTERAKTÍV TÉRKÉP

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  KUTATÁSI HELYSZÍNEK                                            │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │           [MAGYARORSZÁG TÉRKÉP - SVG]                   │    │
│  │                                                         │    │
│  │                    ┌───┐                                │    │
│  │                    │ 2 │ ← Szentkirály                  │    │
│  │                    └───┘                                │    │
│  │              ┌───┐                                      │    │
│  │              │ 1 │ ← Lakitelek                          │    │
│  │              └───┘                                      │    │
│  │                ┌───┐                                    │    │
│  │                │ 3 │ ← Kecskemét-Borbás                 │    │
│  │                └───┘                                    │    │
│  │                                                         │    │
│  │  [Hover: tooltip a helyszín adataival]                  │    │
│  │  [Click: scroll a részletes szekcióhoz]                 │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Interaktív Térkép Komponens
```typescript
// HungaryMap.tsx
import { motion } from 'framer-motion'

interface LocationPin {
  id: string
  name: string
  coordinates: { x: number; y: number }
  crop: string
  period: string
}

const locations: LocationPin[] = [
  { id: 'lakitelek', name: 'Lakitelek', coordinates: { x: 52, y: 58 }, crop: 'Paradicsom', period: 'Máj-Aug' },
  { id: 'kecskemet', name: 'Kecskemét-Borbás', coordinates: { x: 50, y: 62 }, crop: 'Paradicsom', period: 'Máj-Jún' },
  { id: 'szentkiraly', name: 'Szentkirály', coordinates: { x: 54, y: 55 }, crop: 'Hagyma', period: 'Már-Jún' },
]

export function HungaryMap({ onLocationClick, activeLocation }) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)

  return (
    <div className={styles.mapContainer}>
      {/* SVG térkép háttér */}
      <svg viewBox="0 0 100 100" className={styles.mapSvg}>
        <path d={HUNGARY_PATH} className={styles.countryPath} />
      </svg>
      
      {/* Helyszín pinek */}
      {locations.map((location, i) => (
        <motion.button
          key={location.id}
          className={`${styles.locationPin} ${activeLocation === location.id ? styles.active : ''}`}
          style={{ 
            left: `${location.coordinates.x}%`, 
            top: `${location.coordinates.y}%` 
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.2, type: 'spring' }}
          whileHover={{ scale: 1.3 }}
          onMouseEnter={() => setHoveredLocation(location.id)}
          onMouseLeave={() => setHoveredLocation(null)}
          onClick={() => onLocationClick(location.id)}
        >
          <span className={styles.pinNumber}>{i + 1}</span>
          
          {/* Pulse animáció */}
          <motion.span
            className={styles.pinPulse}
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      ))}
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredLocation && (
          <motion.div
            className={styles.mapTooltip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              left: `${locations.find(l => l.id === hoveredLocation)?.coordinates.x}%`,
              top: `${locations.find(l => l.id === hoveredLocation)?.coordinates.y}%`
            }}
          >
            <strong>{locations.find(l => l.id === hoveredLocation)?.name}</strong>
            <span>{locations.find(l => l.id === hoveredLocation)?.crop}</span>
            <span>{locations.find(l => l.id === hoveredLocation)?.period}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

#### Pin Pulse Animáció (CSS)
```css
.pinPulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--color-accent);
  z-index: -1;
}

.locationPin.active .pinPulse {
  animation: none;
  background: var(--color-accent);
  opacity: 0.3;
  transform: scale(2);
}
```

---

### 3. HELYSZÍNEK RÉSZLETES BEMUTATÓ

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  HELYSZÍNEK                                                     │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  [TAB NAVIGÁCIÓ]                                                │
│  ┌──────────────┬──────────────┬──────────────┐                 │
│  │  LAKITELEK   │  KECSKEMÉT   │  SZENTKIRÁLY │                 │
│  │     ●        │              │              │                 │
│  └──────────────┴──────────────┴──────────────┘                 │
│                                                                 │
│  ═══════════════════════════════════════════════════════════    │
│  LAKITELEK — Fő kísérleti terület                               │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌────────────────────────┬────────────────────────────────┐    │
│  │                        │                                │    │
│  │  [DRÓNKÉP / FOTÓ]      │  ALAPADATOK                    │    │
│  │                        │  ─────────────────────────     │    │
│  │  ┌──────────────────┐  │  Kultúra: Ipari paradicsom     │    │
│  │  │                  │  │  Talaj: Humuszos homok         │    │
│  │  │    Légifelvétel  │  │  KA érték: 27                  │    │
│  │  │    a parcellák-  │  │  Öntözés: 450 mm               │    │
│  │  │    ról           │  │  Időszak: Máj - Aug            │    │
│  │  │                  │  │                                │    │
│  │  └──────────────────┘  │  [Animated data cards]         │    │
│  │                        │                                │    │
│  │  [Image zoom hover]    │                                │    │
│  │                        │                                │    │
│  └────────────────────────┴────────────────────────────────┘    │
│                                                                 │
│  7 PARCELLA, 7 KEZELÉS                                          │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │  │
│  │  │  I. │ │ II. │ │III. │ │ IV. │ │  V. │ │ VI. │ │VII. │  │  │
│  │  │     │ │     │ │     │ │     │ │     │ │     │ │  ★  │  │  │
│  │  │Mély-│ │Laz+ │ │Ásó- │ │Kont-│ │Kont-│ │Laz+ │ │Szánt│  │  │
│  │  │ásó  │ │Ásó  │ │gép  │ │roll │ │roll │ │Sz+Á │ │+Ásó │  │  │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │  │
│  │                                                           │  │
│  │  [Hover: részletes kezelés info + eredmény]               │  │
│  │  [Click: kiválasztás + highlight a chart-on]              │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  LAZASÁGI MÉLYSÉG VÁLTOZÁSA                                     │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  40 ─┬─────────────────────────────────────────────────   │  │
│  │      │   ██                                               │  │
│  │  35 ─┤   ██ ██          ██                   ██           │  │
│  │      │   ██ ██          ██    ██             ██    ██     │  │
│  │  30 ─┤   ██ ██          ██    ██             ██    ██ ██  │  │
│  │      │   ██ ██    ██    ██    ██    ██       ██    ██ ██  │  │
│  │  25 ─┤   ██ ██    ██    ██    ██    ██       ██    ██ ██  │  │
│  │      │   ██ ██    ██    ██    ██    ██       ██    ██ ██  │  │
│  │  20 ─┤   ██ ██    ██    ██    ██    ██       ██    ██ ██  │  │
│  │      │                                                    │  │
│  │   0 ─┴───I.─II.──III.──IV.───V.───VI.──────VII.───────   │  │
│  │                                                           │  │
│  │  █ Május   █ Augusztus                                    │  │
│  │                                                           │  │
│  │  [Animated bar chart - Framer Motion]                     │  │
│  │  [Hover: tooltip with exact values]                       │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  KIEMELÉS                                                       │
│  ─────────────────────────────────────────────────────────      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  💡 A VII. parcella (Szántás + Ásógép) adta a legjobb     │  │
│  │     stabilitást: mindössze -1 cm változás 4 hónap alatt!  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Helyszín Tab Komponens
```typescript
// LocationTabs.tsx - MÁR LÉTEZIK, de fejlesztendő

const [activeLocation, setActiveLocation] = useState('lakitelek')
const [selectedParcels, setSelectedParcels] = useState<string[]>([])

// Tab váltás animáció
<motion.div className={styles.tabContent}>
  <AnimatePresence mode="wait">
    <motion.div
      key={activeLocation}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <LocationContent location={locations[activeLocation]} />
    </motion.div>
  </AnimatePresence>
</motion.div>
```

#### Parcella Selector
```typescript
// ParcelSelector.tsx
interface Parcel {
  num: string
  treatment: string
  initial: number
  final: number
  change: number
  isBest: boolean
}

const parcels: Parcel[] = [
  { num: 'I.', treatment: 'Mélyásógép (40 cm)', initial: 33, final: 31, change: -2, isBest: false },
  { num: 'VII.', treatment: 'Szántás + Ásógép (25 cm)', initial: 32, final: 31, change: -1, isBest: true },
  // ...
]

<div className={styles.parcelGrid}>
  {parcels.map((parcel, i) => (
    <motion.button
      key={parcel.num}
      className={`${styles.parcelCard} ${selectedParcels.includes(parcel.num) ? styles.selected : ''} ${parcel.isBest ? styles.best : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ 
        y: -8, 
        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
        borderColor: 'var(--color-accent)'
      }}
      onClick={() => toggleParcel(parcel.num)}
    >
      <span className={styles.parcelNum}>{parcel.num}</span>
      {parcel.isBest && <Star className={styles.bestIcon} />}
      
      {/* Hover tooltip */}
      <motion.div
        className={styles.parcelTooltip}
        initial={{ opacity: 0, scale: 0.9 }}
        whileHover={{ opacity: 1, scale: 1 }}
      >
        <strong>{parcel.treatment}</strong>
        <span>Kezdeti: {parcel.initial} cm</span>
        <span>Végső: {parcel.final} cm</span>
        <span className={parcel.change > -3 ? styles.good : styles.bad}>
          Változás: {parcel.change} cm
        </span>
      </motion.div>
    </motion.button>
  ))}
</div>
```

#### Animált Bar Chart
```typescript
// BarChart.tsx - MÁR LÉTEZIK, de fejlesztendő

interface ChartData {
  label: string
  may: number
  aug: number
  highlighted?: boolean
}

export function BarChart({ data, highlightedBars }: Props) {
  return (
    <div className={styles.chart}>
      {data.map((item, i) => (
        <div 
          key={item.label} 
          className={`${styles.barGroup} ${highlightedBars?.includes(item.label) ? styles.highlighted : ''}`}
        >
          {/* Május bar */}
          <motion.div
            className={styles.bar}
            initial={{ height: 0 }}
            whileInView={{ height: `${item.may * 2.5}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              className={styles.barValue}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.5 }}
            >
              {item.may}
            </motion.span>
          </motion.div>
          
          {/* Augusztus bar */}
          <motion.div
            className={`${styles.bar} ${styles.barAug}`}
            initial={{ height: 0 }}
            whileInView={{ height: `${item.aug * 2.5}%` }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span className={styles.barValue}>{item.aug}</motion.span>
          </motion.div>
          
          <span className={styles.barLabel}>{item.label}</span>
        </div>
      ))}
      
      {/* Y axis */}
      <div className={styles.yAxis}>
        {[40, 35, 30, 25, 20, 0].map(val => (
          <span key={val}>{val}</span>
        ))}
      </div>
    </div>
  )
}
```

---

### 4. MÉRÉSI MÓDSZEREK

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  MÉRÉSI MÓDSZEREK                                               │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │                  │  │                  │                     │
│  │  [Lottie anim]   │  │  [Lottie anim]   │                     │
│  │                  │  │                  │                     │
│  │  PENETROMÉTER    │  │  TALAJHŐMÉRSÉKLET│                     │
│  │  ──────────────  │  │  ──────────────  │                     │
│  │                  │  │                  │                     │
│  │  Mit mér:        │  │  Mit mér:        │                     │
│  │  Tömörödés       │  │  Felmelegedés    │                     │
│  │  (bar/cm²)       │  │  sebesség        │                     │
│  │                  │  │                  │                     │
│  │  Mélység:        │  │  Mélységek:      │                     │
│  │  0-60 cm         │  │  5, 10, 20 cm    │                     │
│  │                  │  │                  │                     │
│  │  [Expand →]      │  │  [Expand →]      │                     │
│  │                  │  │                  │                     │
│  └──────────────────┘  └──────────────────┘                     │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │                  │  │                  │                     │
│  │  [Lottie anim]   │  │  [Lottie anim]   │                     │
│  │                  │  │                  │                     │
│  │  DRÓNFELVÉTEL    │  │  HELYSZÍNI       │                     │
│  │  ──────────────  │  │  MEGFIGYELÉS     │                     │
│  │                  │  │  ──────────────  │                     │
│  │  Mit mér:        │  │                  │                     │
│  │  NDVI index      │  │  Mit vizsgál:    │                     │
│  │                  │  │  Gyomosodás,     │                     │
│  │  Gyakoriság:     │  │  növényfejlődés  │                     │
│  │  Havonta         │  │                  │                     │
│  │                  │  │  Dokumentáció:   │                     │
│  │  [Expand →]      │  │  Fotók           │                     │
│  │                  │  │                  │                     │
│  └──────────────────┘  └──────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Mérési Módszer Kártya
```typescript
// MeasurementMethodCard.tsx

interface Method {
  id: string
  title: string
  icon: string  // Lottie animation name
  measures: string
  depth?: string
  frequency?: string
  details: string
}

const methods: Method[] = [
  {
    id: 'penetrometer',
    title: 'Penetrométeres mérés',
    icon: 'penetrometer',
    measures: 'Talajok tömörödése (bar/cm²)',
    depth: '0-60 cm',
    frequency: 'Havonta',
    details: 'A penetrométer egy szúrópróba-szerű eszköz...'
  },
  // ...
]

export function MeasurementMethodCard({ method, isExpanded, onToggle }) {
  return (
    <motion.div
      className={styles.methodCard}
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Lottie ikon */}
      <div className={styles.methodIcon}>
        <Lottie
          animationData={getMethodAnimation(method.icon)}
          loop
          style={{ width: 80, height: 80 }}
        />
      </div>
      
      <h3>{method.title}</h3>
      
      <div className={styles.methodInfo}>
        <p><strong>Mit mér:</strong> {method.measures}</p>
        {method.depth && <p><strong>Mélység:</strong> {method.depth}</p>}
        {method.frequency && <p><strong>Gyakoriság:</strong> {method.frequency}</p>}
      </div>
      
      {/* Expand/collapse */}
      <motion.button
        className={styles.expandButton}
        onClick={onToggle}
        whileHover={{ x: 5 }}
      >
        {isExpanded ? 'Bezárás' : 'Részletek'} →
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.methodDetails}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{method.details}</p>
            
            {/* Példa diagram/kép */}
            {method.id === 'penetrometer' && (
              <div className={styles.exampleChart}>
                <PenetrometricCurve />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

---

### 5. IDŐBELI LEFOLYÁS (TIMELINE)

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  IDŐBELI LEFOLYÁS                                               │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  MÁRCIUS      ÁPRILIS      MÁJUS      JÚNIUS            │    │
│  │     │            │           │           │              │    │
│  │     ●────────────●───────────●───────────●              │    │
│  │     │            │           │           │              │    │
│  │  ┌──┴──┐      ┌──┴──┐     ┌──┴──┐     ┌──┴──┐           │    │
│  │  │Szent│      │Méré-│     │Laki-│     │Kecs-│           │    │
│  │  │királ│      │sek  │     │telek│     │kemét│           │    │
│  │  │indít│      │     │     │start│     │     │           │    │
│  │  └─────┘      └─────┘     └─────┘     └─────┘           │    │
│  │                                                         │    │
│  │        JÚLIUS      AUGUSZTUS                            │    │
│  │           │            │                                │    │
│  │  ─────────●────────────●                                │    │
│  │           │            │                                │    │
│  │        ┌──┴──┐      ┌──┴──┐                             │    │
│  │        │Folyt│      │Végső│                             │    │
│  │        │atás │      │érték│                             │    │
│  │        └─────┘      └─────┘                             │    │
│  │                                                         │    │
│  │  [Scroll-triggered animáció]                            │    │
│  │  [Hover: részletek tooltip-ben]                         │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Timeline Komponens
```typescript
// Timeline.tsx - MÁR LÉTEZIK, de fejlesztendő

interface TimelineEvent {
  month: string
  title: string
  description: string
  location?: string
  type: 'start' | 'measurement' | 'end'
}

const events: TimelineEvent[] = [
  { month: 'Március', title: 'Szentkirály indulás', description: 'Hagyma ültetés...', location: 'szentkiraly', type: 'start' },
  { month: 'Május', title: 'Lakitelek indulás', description: 'Paradicsom...', location: 'lakitelek', type: 'start' },
  // ...
]

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // Vonal progressz animáció
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  
  return (
    <div ref={containerRef} className={styles.timeline}>
      {/* Animált vonal */}
      <motion.div
        className={styles.timelineLine}
        style={{ width: lineWidth }}
      />
      
      {/* Események */}
      {events.map((event, i) => (
        <motion.div
          key={event.month}
          className={styles.timelineEvent}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: i * 0.1 }}
        >
          {/* Pont */}
          <motion.div
            className={styles.timelineDot}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: i * 0.1 + 0.2 }}
          />
          
          {/* Kártya */}
          <motion.div
            className={styles.eventCard}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
          >
            <span className={styles.eventMonth}>{event.month}</span>
            <h4>{event.title}</h4>
            <p>{event.description}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
```

---

### 6. ÁTVEZETŐ CTA

```typescript
<motion.section
  className={styles.transitionSection}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    Mit mutattak az adatok?
  </motion.p>
  
  <MagneticButton variant="primary" size="lg" href="/eredmenyek">
    Tekintse meg az eredményeket
    <ArrowRight />
  </MagneticButton>
</motion.section>
```

---

## Design Specifikáció

### Színek
```css
/* Világos háttér */
--page-bg: #F8F7F4;

/* Térkép */
--map-bg: #FFFFFF;
--map-country: #E8E6E1;
--map-pin: var(--color-accent);
--map-pin-pulse: rgba(212, 168, 75, 0.4);

/* Helyszín kártyák */
--location-card-bg: #FFFFFF;
--location-card-border: rgba(0, 0, 0, 0.08);

/* Parcella kártyák */
--parcel-bg: rgba(255, 255, 255, 0.8);
--parcel-selected: var(--color-accent);
--parcel-best: #22C55E;

/* Chart */
--chart-bar-may: var(--color-primary);
--chart-bar-aug: var(--color-accent);
--chart-grid: rgba(0, 0, 0, 0.1);

/* Timeline */
--timeline-line: #E5E5E5;
--timeline-line-active: var(--color-accent);
--timeline-dot: var(--color-accent);
```

### Tipográfia
```css
/* Helyszín név */
.locationName {
  font-size: 2rem;
  font-weight: 700;
}

/* Parcella szám */
.parcelNum {
  font-size: 1.25rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

/* Chart értékek */
.chartValue {
  font-size: 0.875rem;
  font-weight: 600;
}
```

---

## Playwright Tesztek

### Fájl: `e2e/kutatas.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Kutatás oldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kutatas')
  })

  test('Oldal betöltődik', async ({ page }) => {
    await expect(page.getByText('A Kutatás')).toBeVisible()
    await expect(page.getByText('3 helyszín')).toBeVisible()
  })

  test('Térkép pinek interaktívak', async ({ page }) => {
    // Pin hover
    const lakitelekPin = page.locator('.locationPin').first()
    await lakitelekPin.hover()
    
    // Tooltip megjelenik
    await expect(page.getByText('Lakitelek')).toBeVisible()
    await expect(page.getByText('Paradicsom')).toBeVisible()
    
    // Pin click scrolls
    await lakitelekPin.click()
    await page.waitForTimeout(500)
    
    // Helyszín szekció látható
    await expect(page.getByText('LAKITELEK — Fő kísérleti terület')).toBeInViewport()
  })

  test('Helyszín tab váltás', async ({ page }) => {
    // Alapértelmezett: Lakitelek
    await expect(page.getByText('Ipari paradicsom')).toBeVisible()
    
    // Kecskemét tabra kattintás
    await page.getByRole('tab', { name: /kecskemét/i }).click()
    
    // Kecskemét tartalom
    await expect(page.getByText('Kecskemét-Borbás')).toBeVisible()
    await expect(page.getByText('400 mm')).toBeVisible()  // öntözés
  })

  test('Parcella selector működik', async ({ page }) => {
    const parcelCard = page.locator('.parcelCard').first()
    
    // Hover tooltip
    await parcelCard.hover()
    await expect(page.locator('.parcelTooltip')).toBeVisible()
    
    // Click kiválaszt
    await parcelCard.click()
    await expect(parcelCard).toHaveClass(/selected/)
  })

  test('Bar chart animálódik scroll-ra', async ({ page }) => {
    // Scroll a chart-hoz
    await page.getByText('Lazasági mélység változása').scrollIntoViewIfNeeded()
    
    // Bars animálódtak
    await page.waitForTimeout(1000)
    const bars = page.locator('.bar')
    const firstBarHeight = await bars.first().evaluate(el => el.offsetHeight)
    expect(firstBarHeight).toBeGreaterThan(0)
  })

  test('Mérési módszer kártya expand', async ({ page }) => {
    // Scroll a szekcióhoz
    await page.getByText('Mérési módszerek').scrollIntoViewIfNeeded()
    
    // Expand button
    const expandBtn = page.getByRole('button', { name: /részletek/i }).first()
    await expandBtn.click()
    
    // Details megjelennek
    await expect(page.locator('.methodDetails').first()).toBeVisible()
    
    // Collapse
    await page.getByRole('button', { name: /bezárás/i }).first().click()
    await expect(page.locator('.methodDetails').first()).not.toBeVisible()
  })

  test('Timeline scroll animáció', async ({ page }) => {
    // Scroll a timeline-hoz
    await page.getByText('Időbeli lefolyás').scrollIntoViewIfNeeded()
    
    // Vonal animálódik
    const line = page.locator('.timelineLine')
    await page.waitForTimeout(500)
    
    const width = await line.evaluate(el => window.getComputedStyle(el).width)
    expect(parseInt(width)).toBeGreaterThan(0)
  })

  test('Chart hover tooltip', async ({ page }) => {
    // Scroll a chart-hoz
    await page.getByText('Lazasági mélység változása').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1000)
    
    // Bar hover
    await page.locator('.bar').first().hover()
    
    // Tooltip érték
    await expect(page.locator('.barValue')).toBeVisible()
  })

  test('Mobile: Térkép scrollolható', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    
    const mapContainer = page.locator('.mapContainer')
    await expect(mapContainer).toHaveCSS('overflow-x', 'auto')
  })

  test('Accessibility - keyboard navigation', async ({ page }) => {
    // Tab navigáció
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Helyszín tabok elérhetők
    const tabs = page.locator('[role="tab"]')
    await expect(tabs.first()).toBeFocused()
    
    // Arrow key navigáció
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
  })
})
```

---

## Fájl Struktúra

```
src/
├── app/
│   └── kutatas/                        # 🆕 Átnevezés /kiserlet-ről
│       └── page.tsx
├── components/
│   └── research/                       # 🆕 Átnevezés experiment-ről
│       ├── ResearchLayout.tsx
│       ├── HungaryMap.tsx              # 🆕 Interaktív térkép
│       ├── LocationTabs.tsx            # ✅ Már létezik
│       ├── LocationContent.tsx         # ✅ Már létezik
│       ├── ParcelSelector.tsx          # 🆕 Parcella választó
│       ├── BarChart.tsx                # ✅ Már létezik - fejlesztendő
│       ├── MeasurementMethodCard.tsx   # 🆕 Mérési módszer kártya
│       ├── Timeline.tsx                # ✅ Már létezik - fejlesztendő
│       └── Research.module.css
├── animations/
│   ├── penetrometer.json               # 🆕 Lottie
│   ├── thermometer.json                # 🆕 Lottie
│   ├── drone.json                      # 🆕 Lottie
│   └── observation.json                # 🆕 Lottie
└── lib/
    └── data.ts                         # ✅ Létezik - locations
```

---

## Implementációs Prioritás

1. **Magas** - Útvonal átnevezése `/kiserlet` → `/kutatas`
2. **Magas** - Interaktív Magyarország térkép
3. **Magas** - Parcella selector komponens
4. **Közepes** - Bar chart fejlesztés (animáció + tooltip)
5. **Közepes** - Timeline scroll animáció
6. **Közepes** - Mérési módszer kártyák expand/collapse
7. **Alacsony** - Lottie animációk a módszerekhez
