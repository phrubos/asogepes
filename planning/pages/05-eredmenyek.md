# 05 — Eredmények

## Útvonal
`/eredmenyek` → `src/app/eredmenyek/page.tsx`

---

## Cél
Összefoglalni a kutatás megállapításait, vizuálisan bemutatni az adatokat, és levonni a gyakorlati következtetéseket.

---

## Oldalszerkezet

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "Mit találtunk?"                                         │
├─────────────────────────────────────────────────────────────────┤
│  FŐ MEGÁLLAPÍTÁSOK - 4 kiemelt kártya                           │
├─────────────────────────────────────────────────────────────────┤
│  MŰVELÉSI MÓDSZEREK ÖSSZEHASONLÍTÁSA - Interaktív táblázat      │
├─────────────────────────────────────────────────────────────────┤
│  DRÓNFELVÉTELEK ELEMZÉSE - Before/After slider                  │
├─────────────────────────────────────────────────────────────────┤
│  KUTATÁSI KÉRDÉSEK VÁLASZAI - 4 szekció                         │
├─────────────────────────────────────────────────────────────────┤
│  AJÁNLÁSOK - 4 kártya                                           │
├─────────────────────────────────────────────────────────────────┤
│  VÉGSŐ KÖVETKEZTETÉS + Lezárás                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Szekciók

### 1. HERO SZEKCIÓ

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Section Number] 04                                            │
│  [Title] Eredmények                                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │   Mit találtunk?                                        │    │
│  │                                                         │    │
│  │   4 hónap, 3 helyszín, 7 kezelési mód —                 │    │
│  │   az adatok egyértelműen beszélnek.                     │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Background: sötét, kontrasztos - ahogy most is van]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Animációk
```typescript
// Text reveal - szavanként
<motion.h1>
  {['Mit', 'találtunk?'].map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
    >
      {word}{' '}
    </motion.span>
  ))}
</motion.h1>
```

---

### 2. FŐ MEGÁLLAPÍTÁSOK

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  FŐ MEGÁLLAPÍTÁSOK                                              │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │                      │  │                      │             │
│  │  01 ────────────     │  │  02 ────────────     │             │
│  │                      │  │                      │             │
│  │  TARTÓSABB           │  │  GYORSABB            │             │
│  │  LAZASÁG             │  │  FELMELEGEDÉS        │             │
│  │                      │  │                      │             │
│  │  [Lottie: soil]      │  │  [Lottie: temp]      │             │
│  │                      │  │                      │             │
│  │  Az ásógépezett      │  │  2-4°C-kal           │             │
│  │  parcellák 5-10      │  │  melegebb talaj      │             │
│  │  cm-rel mélyebben    │  │  tavasszal           │             │
│  │  maradtak lazák      │  │                      │             │
│  │                      │  │  [+2-4°C badge]      │             │
│  │  [5-10 cm badge]     │  │                      │             │
│  │                      │  │                      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │                      │  │                      │             │
│  │  03 ────────────     │  │  04 ────────────     │             │
│  │                      │  │                      │             │
│  │  JOBB                │  │  LÁTHATÓ             │             │
│  │  VÍZGAZDÁLKODÁS      │  │  NÖVÉNYFEJLŐDÉS      │             │
│  │                      │  │                      │             │
│  │  [Lottie: water]     │  │  [Lottie: plant]     │             │
│  │                      │  │                      │             │
│  │  A víz egyenleteseb- │  │  A paradicsom és     │             │
│  │  ben oszlott el,     │  │  hagyma állományok   │             │
│  │  mélyebb rétegekbe   │  │  szemmel láthatóan   │             │
│  │  is lejutott         │  │  fejlettebbek        │             │
│  │                      │  │                      │             │
│  │  [Egyenletes badge]  │  │  [Vizuális badge]    │             │
│  │                      │  │                      │             │
│  └──────────────────────┘  └──────────────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Finding Kártya Komponens
```typescript
// FindingCard.tsx

interface Finding {
  number: string
  title: string
  description: string
  highlight: string
  icon: string  // Lottie animation name
}

const findings: Finding[] = [
  {
    number: '01',
    title: 'Tartósabb lazaság',
    description: 'Az ásógépezett parcellák 5-10 cm-rel mélyebben maradtak lazák a teljes tenyészidőszak alatt.',
    highlight: '5-10 cm',
    icon: 'soil-layers'
  },
  // ...
]

export function FindingCard({ finding, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const lottieRef = useRef()

  return (
    <motion.div
      className={styles.findingCard}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -12, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
      onHoverStart={() => {
        setIsHovered(true)
        lottieRef.current?.play()
      }}
      onHoverEnd={() => {
        setIsHovered(false)
        lottieRef.current?.pause()
      }}
    >
      {/* Szám */}
      <motion.span
        className={styles.findingNumber}
        animate={{ 
          scale: isHovered ? 1.1 : 1,
          color: isHovered ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)'
        }}
      >
        {finding.number}
      </motion.span>
      
      {/* Lottie ikon */}
      <div className={styles.findingIcon}>
        <Lottie
          lottieRef={lottieRef}
          animationData={getAnimation(finding.icon)}
          loop
          autoplay={false}
          style={{ width: 80, height: 80 }}
        />
      </div>
      
      {/* Tartalom */}
      <h3>{finding.title}</h3>
      <p dangerouslySetInnerHTML={{ __html: finding.description }} />
      
      {/* Highlight badge */}
      <motion.span
        className={styles.highlightBadge}
        initial={{ scale: 0.9, opacity: 0.7 }}
        whileHover={{ scale: 1.05, opacity: 1 }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(212, 168, 75, 0.4)',
            '0 0 0 8px rgba(212, 168, 75, 0)',
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {finding.highlight}
      </motion.span>
    </motion.div>
  )
}
```

---

### 3. MŰVELÉSI MÓDSZEREK ÖSSZEHASONLÍTÁSA

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  MŰVELÉSI MÓDSZEREK ÖSSZEHASONLÍTÁSA                            │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  Lakitelek kísérlet eredményei (450 mm öntözés után)            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  ┌──────────────────────┬────────┬────────┬──────┬────┐ │    │
│  │  │ Kezelés              │Kezdeti │ Végső  │Válto-│Sta-│ │    │
│  │  │                      │  (cm)  │  (cm)  │ zás  │bil?│ │    │
│  │  ├──────────────────────┼────────┼────────┼──────┼────┤ │    │
│  │  │★ Szántás + Ásógép    │   32   │   31   │  -1  │ ✓  │ │    │
│  │  │  Mélyásógép (40 cm)  │   33   │   31   │  -2  │ ✓  │ │    │
│  │  │  Ásógép (30 cm)      │   22   │   20   │  -2  │ ✓  │ │    │
│  │  │  Lazítás + Ásógép    │   35   │   28   │  -7  │ ✗  │ │    │
│  │  │  Laz+Szánt+Kombinátor│   35   │   28   │  -7  │ ✗  │ │    │
│  │  │  Szántás+Kombinátor  │   28   │   32   │  +4  │ ✓  │ │    │
│  │  └──────────────────────┴────────┴────────┴──────┴────┘ │    │
│  │                                                         │    │
│  │  [Sor hover: highlight + részletek]                     │    │
│  │  [Kattintás: kiválasztás → chart frissül]               │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  [VIZUALIZÁCIÓ - Animated comparison]                   │    │
│  │                                                         │    │
│  │  MÁJUS                        AUGUSZTUS                 │    │
│  │  ┌─────┐                      ┌─────┐                   │    │
│  │  │     │                      │     │                   │    │
│  │  │ 32  │  ────────────────▶   │ 31  │   -1 cm ★         │    │
│  │  │     │                      │     │                   │    │
│  │  └─────┘                      └─────┘                   │    │
│  │                                                         │    │
│  │  [Animated bars with morph transition]                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Interaktív Táblázat Komponens
```typescript
// ComparisonTable.tsx - MÁR LÉTEZIK, de fejlesztendő

const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null)
const [hoveredRow, setHoveredRow] = useState<number | null>(null)

<div className={styles.tableContainer}>
  <motion.table className={styles.comparisonTable}>
    <thead>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <th>Kezelés</th>
        <th>Kezdeti (cm)</th>
        <th>Végső (cm)</th>
        <th>Változás</th>
        <th>Stabil?</th>
      </motion.tr>
    </thead>
    <tbody>
      {treatmentComparison.map((row, i) => (
        <motion.tr
          key={row.treatment}
          className={`
            ${row.stable ? styles.stableRow : styles.unstableRow}
            ${selectedTreatment === row.treatment ? styles.selectedRow : ''}
            ${row.treatment.includes('Szántás + Ásógép') ? styles.bestRow : ''}
          `}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          onHoverStart={() => setHoveredRow(i)}
          onHoverEnd={() => setHoveredRow(null)}
          onClick={() => setSelectedTreatment(row.treatment)}
          whileHover={{ 
            backgroundColor: 'rgba(212, 168, 75, 0.1)',
            x: 5
          }}
        >
          <td>
            {row.treatment.includes('Szántás + Ásógép') && (
              <motion.span 
                className={styles.bestBadge}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ★
              </motion.span>
            )}
            {row.treatment}
          </td>
          <td>{row.initial}</td>
          <td>{row.final}</td>
          <td className={row.stable ? styles.goodChange : styles.badChange}>
            <motion.span
              animate={{ 
                scale: hoveredRow === i ? 1.2 : 1,
                color: row.stable ? '#22C55E' : '#EF4444'
              }}
            >
              {row.change > 0 ? '+' : ''}{row.change}
            </motion.span>
          </td>
          <td>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: i * 0.1 + 0.3 }}
            >
              {row.stable ? (
                <Check className={styles.iconGood} />
              ) : (
                <X className={styles.iconBad} />
              )}
            </motion.span>
          </td>
        </motion.tr>
      ))}
    </tbody>
  </motion.table>
</div>
```

#### Comparison Visualization
```typescript
// ComparisonVisualization.tsx

export function ComparisonVisualization({ selectedTreatment }) {
  const data = treatmentComparison.find(t => t.treatment === selectedTreatment)
  
  return (
    <div className={styles.visualization}>
      <div className={styles.beforeAfter}>
        {/* Május */}
        <div className={styles.valueBlock}>
          <span className={styles.label}>MÁJUS</span>
          <motion.div
            className={styles.valueBar}
            initial={{ height: 0 }}
            animate={{ height: `${data?.initial * 3}px` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <AnimatedNumber value={data?.initial || 0} suffix=" cm" />
          </motion.div>
        </div>
        
        {/* Nyíl + változás */}
        <motion.div
          className={styles.changeArrow}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.span
            className={`${styles.changeValue} ${data?.stable ? styles.good : styles.bad}`}
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {data?.change > 0 ? '+' : ''}{data?.change} cm
          </motion.span>
          <ArrowRight size={32} />
        </motion.div>
        
        {/* Augusztus */}
        <div className={styles.valueBlock}>
          <span className={styles.label}>AUGUSZTUS</span>
          <motion.div
            className={styles.valueBar}
            initial={{ height: 0 }}
            animate={{ height: `${data?.final * 3}px` }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <AnimatedNumber value={data?.final || 0} suffix=" cm" delay={300} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
```

---

### 4. DRÓNFELVÉTELEK ELEMZÉSE

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  DRÓNFELVÉTELEK ELEMZÉSE                                        │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  [BEFORE/AFTER COMPARISON SLIDER]                       │    │
│  │                                                         │    │
│  │  ┌─────────────────────┬─────────────────────┐          │    │
│  │  │                     │                     │          │    │
│  │  │   KONTROLL         ←│→  ÁSÓGÉPEZETT       │          │    │
│  │  │   PARCELLÁK         │   PARCELLÁK         │          │    │
│  │  │                     │                     │          │    │
│  │  │   [Drón fotó]       │   [Drón fotó]       │          │    │
│  │  │                     │                     │          │    │
│  │  │   Világosabb =      │   Sötétebb zöld =   │          │    │
│  │  │   gyengébb          │   fejlettebb        │          │    │
│  │  │   növényzet         │   növényzet         │          │    │
│  │  │                     │                     │          │    │
│  │  └─────────────────────┴─────────────────────┘          │    │
│  │                    ↑                                    │    │
│  │               [Drag slider]                             │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  HELYSZÍNEK                                                     │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  LAKITELEK   │  │  KECSKEMÉT   │  │  SZENTKIRÁLY │           │
│  │  ──────────  │  │  ──────────  │  │  ──────────  │           │
│  │  7 parcella  │  │  10 cm       │  │  Kevesebb    │           │
│  │  összehason- │  │  különbség   │  │  gyom        │           │
│  │  lítás       │  │  júniusban   │  │              │           │
│  │              │  │              │  │              │           │
│  │  [Thumbnail] │  │  [Thumbnail] │  │  [Thumbnail] │           │
│  │              │  │              │  │              │           │
│  │  [Nagyítás]  │  │  [Nagyítás]  │  │  [Nagyítás]  │           │
│  │              │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Before/After Slider Komponens
```typescript
// BeforeAfterSlider.tsx

export function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel, afterLabel }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100)
    setSliderPosition(percentage)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={styles.sliderContainer}
      onMouseDown={() => isDragging.current = true}
      onMouseUp={() => isDragging.current = false}
      onMouseLeave={() => isDragging.current = false}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* Before (bal) */}
      <div className={styles.beforeSide}>
        <Image src={beforeImage} alt={beforeLabel} fill />
        <span className={styles.sideLabel}>{beforeLabel}</span>
      </div>
      
      {/* After (jobb) - clipPath-tel vágva */}
      <motion.div 
        className={styles.afterSide}
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <Image src={afterImage} alt={afterLabel} fill />
        <span className={styles.sideLabel}>{afterLabel}</span>
      </motion.div>
      
      {/* Slider handle */}
      <motion.div
        className={styles.sliderHandle}
        style={{ left: `${sliderPosition}%` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={styles.sliderLine} />
        <div className={styles.sliderKnob}>
          <ChevronLeft size={16} />
          <ChevronRight size={16} />
        </div>
      </motion.div>
    </div>
  )
}
```

#### Helyszín Galéria Kártya
```typescript
// LocationGalleryCard.tsx

export function LocationGalleryCard({ location, thumbnail, title, highlight, onOpen }) {
  return (
    <motion.div
      className={styles.galleryCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
    >
      {/* Thumbnail with zoom effect */}
      <motion.div 
        className={styles.thumbnailContainer}
        whileHover={{ scale: 1.05 }}
      >
        <Image src={thumbnail} alt={title} fill />
        
        {/* Overlay on hover */}
        <motion.div
          className={styles.thumbnailOverlay}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <ZoomIn size={32} />
          <span>Nagyítás</span>
        </motion.div>
      </motion.div>
      
      <h4>{title}</h4>
      <p>{highlight}</p>
      
      <motion.button
        className={styles.openButton}
        onClick={() => onOpen(location)}
        whileHover={{ x: 5 }}
      >
        Megtekintés →
      </motion.button>
    </motion.div>
  )
}
```

#### Lightbox Galéria
```typescript
// ImageLightbox.tsx

export function ImageLightbox({ images, initialIndex, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.lightboxOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.lightboxContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fő kép */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={styles.lightboxImage}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Image 
                  src={images[currentIndex].src} 
                  alt={images[currentIndex].alt}
                  fill
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigáció */}
            <button 
              className={styles.prevButton}
              onClick={() => setCurrentIndex(i => i > 0 ? i - 1 : images.length - 1)}
            >
              <ChevronLeft size={32} />
            </button>
            
            <button 
              className={styles.nextButton}
              onClick={() => setCurrentIndex(i => i < images.length - 1 ? i + 1 : 0)}
            >
              <ChevronRight size={32} />
            </button>
            
            {/* Thumbnails */}
            <div className={styles.lightboxThumbs}>
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  className={`${styles.thumb} ${i === currentIndex ? styles.active : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  whileHover={{ scale: 1.1 }}
                  animate={{ opacity: i === currentIndex ? 1 : 0.5 }}
                >
                  <Image src={img.src} alt="" fill />
                </motion.button>
              ))}
            </div>
            
            {/* Close */}
            <button className={styles.closeButton} onClick={onClose}>
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

### 5. KUTATÁSI KÉRDÉSEK VÁLASZAI

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  KUTATÁSI KÉRDÉSEINKRE ADOTT VÁLASZOK                           │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  01  MILYEN HATÁSA VAN AZ ÁSÓGÉPNEK A TALAJRA?          │    │
│  │  ─────────────────────────────────────────────────      │    │
│  │                                                         │    │
│  │  → Tartósabb lazaság                                    │    │
│  │  → Jobb víz- és hőgazdálkodás                           │    │
│  │  → Megmaradó talajélet                                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  02  HOGYAN VÁLTOZIK A SZERKEZET EGY SZEZON ALATT?      │    │
│  │  ─────────────────────────────────────────────────      │    │
│  │                                                         │    │
│  │  → Ásógépezett: stabil, minimális visszatömörödés       │    │
│  │  → Kontroll: jelentős visszatömörödés öntözés hatására  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  03  ÖNÁLLÓ VAGY KOMBINÁLT ALKALMAZÁS JOBB?             │    │
│  │  ─────────────────────────────────────────────────      │    │
│  │                                                         │    │
│  │  → ★ Szántás + Ásógép: LEGJOBB stabilitás               │    │
│  │  → Önálló ásógép: jó eredmény                           │    │
│  │  → Lazítás + ásógép: gyors visszatömörödés              │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  04  MELYIK MÓDSZER A LEGHATÉKONYABB?                   │    │
│  │  ─────────────────────────────────────────────────      │    │
│  │                                                         │    │
│  │  → Ásógépes kezelések egyértelműen jobbak               │    │
│  │  → A stabilitás fontosabb, mint a kezdeti mélység       │    │
│  │  → 4 hónap intenzív öntözés után is megőrzik lazaságukat│    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Accordion Komponens
```typescript
// ResearchAnswers.tsx

const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

{questions.map((q, i) => (
  <motion.div
    key={i}
    className={styles.answerBlock}
    layout
  >
    <motion.button
      className={styles.answerHeader}
      onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
      whileHover={{ x: 5 }}
    >
      <span className={styles.questionNumber}>{q.number}</span>
      <h3>{q.question}</h3>
      <motion.span
        animate={{ rotate: expandedIndex === i ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown />
      </motion.span>
    </motion.button>
    
    <AnimatePresence>
      {expandedIndex === i && (
        <motion.div
          className={styles.answerContent}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul>
            {q.answers.map((answer, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: j * 0.1 }}
              >
                {answer.isBest && <Star className={styles.bestIcon} />}
                {answer.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
))}
```

---

### 6. AJÁNLÁSOK

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  MIKOR AJÁNLOTT AZ ÁSÓGÉP?                                      │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────  │
│  │              │ │              │ │              │ │           │
│  │  💧         │ │  📐         │ │  🌡️         │ │  🌱       │
│  │              │ │              │ │              │ │           │
│  │  ÖNTÖZÉSES   │ │  EKETALP     │ │  HIDEG       │ │  IGÉNYES  │
│  │  KULTÚRÁK    │ │  PROBLÉMÁK   │ │  TAVASZ      │ │  NÖVÉNYEK │
│  │  ──────────  │ │  ──────────  │ │  ──────────  │ │  ──────── │
│  │              │ │              │ │              │ │           │
│  │  Paradicsom, │ │  Ahol 25-30  │ │  Gyorsabb    │ │  Mély gyö-│
│  │  hagyma,     │ │  cm-en tömör │ │  felmelegedés│ │  kérzetű  │
│  │  paprika     │ │  réteg van   │ │  = korábbi   │ │  kultúrák │
│  │              │ │              │ │  ültetés     │ │           │
│  │              │ │              │ │              │ │           │
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Recommendation Kártya
```typescript
// RecommendationCard.tsx

const recommendations = [
  {
    icon: <Droplets />,
    title: 'Öntözéses kultúrák',
    description: 'Paradicsom, hagyma, paprika — ahol gyakori öntözés tömöríti a talajt',
    color: '#3B82F6'  // blue
  },
  // ...
]

<div className={styles.recGrid}>
  {recommendations.map((rec, i) => (
    <motion.div
      key={rec.title}
      className={styles.recCard}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ 
        y: -10,
        boxShadow: `0 20px 40px ${rec.color}20`
      }}
    >
      <motion.div
        className={styles.recIcon}
        style={{ backgroundColor: `${rec.color}15`, color: rec.color }}
        whileHover={{ 
          scale: 1.15,
          rotate: [0, -10, 10, 0]
        }}
      >
        {rec.icon}
      </motion.div>
      
      <h4>{rec.title}</h4>
      <p>{rec.description}</p>
    </motion.div>
  ))}
</div>
```

---

### 7. VÉGSŐ KÖVETKEZTETÉS

```
┌─────────────────────────────────────────────────────────────────┐
│  KÖVETKEZTETÉS                                                  │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  „A mélyásógép és a szántás+ásógép kombináció adta      │    │
│  │   a legstabilabb, legegyenletesebb eredményt a teljes   │    │
│  │   tenyészidőszak alatt."                                │    │
│  │                                                         │    │
│  │  [Animated quote marks]                                 │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  A kutatás igazolta: az ásógépes talajművelés hatékonyan        │
│  csökkenti a tömörödést, javítja a vízgazdálkodást, és          │
│  elősegíti a növények fejlődését.                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🎯 Neumann János Egyetem × Agroskill Kft. — 2025       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Opcionális: PDF letöltés gomb]                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```typescript
// Conclusion.tsx

<motion.section
  className={styles.conclusion}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  {/* Quote */}
  <motion.blockquote
    className={styles.quote}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <motion.span
      className={styles.quoteMarkLeft}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      "
    </motion.span>
    
    A mélyásógép és a szántás+ásógép kombináció adta a legstabilabb, 
    legegyenletesebb eredményt a teljes tenyészidőszak alatt.
    
    <motion.span
      className={styles.quoteMarkRight}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      "
    </motion.span>
  </motion.blockquote>
  
  {/* Summary text */}
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    A kutatás igazolta: az ásógépes talajművelés hatékonyan csökkenti 
    a tömörödést, javítja a vízgazdálkodást, és elősegíti a növények fejlődését.
  </motion.p>
  
  {/* Badge */}
  <motion.div
    className={styles.badge}
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.6, type: 'spring' }}
    whileHover={{ scale: 1.05 }}
  >
    <Target size={20} />
    <span>Neumann János Egyetem × Agroskill Kft. — 2025</span>
  </motion.div>
</motion.section>
```

---

## Design Specifikáció

### Színek
```css
/* Sötét háttér */
--page-bg: linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.7);

/* Kártyák */
--card-bg: rgba(255, 255, 255, 0.03);
--card-border: rgba(255, 255, 255, 0.08);
--card-hover-bg: rgba(255, 255, 255, 0.06);

/* Táblázat */
--table-header-bg: rgba(255, 255, 255, 0.05);
--table-row-hover: rgba(212, 168, 75, 0.1);
--table-best-row: rgba(34, 197, 94, 0.1);

/* Státusz színek */
--color-good: #22C55E;
--color-bad: #EF4444;
--color-neutral: #F59E0B;

/* Before/After slider */
--slider-handle: var(--color-accent);
--slider-line: rgba(255, 255, 255, 0.5);
```

### Tipográfia
```css
/* Finding number */
.findingNumber {
  font-size: 4rem;
  font-weight: 800;
  opacity: 0.3;
}

/* Quote */
.quote {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  line-height: 1.6;
}

/* Quote marks */
.quoteMark {
  font-size: 4rem;
  color: var(--color-accent);
  font-family: Georgia, serif;
}
```

---

## Playwright Tesztek

### Fájl: `e2e/eredmenyek.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Eredmények oldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/eredmenyek')
  })

  test('Oldal betöltődik', async ({ page }) => {
    await expect(page.getByText('Eredmények')).toBeVisible()
    await expect(page.getByText('Mit találtunk?')).toBeVisible()
  })

  test('Fő megállapítások kártyák animálódnak', async ({ page }) => {
    const cards = page.locator('.findingCard')
    await expect(cards).toHaveCount(4)
    
    // Első kártya látható
    await expect(cards.first()).toBeVisible()
    await expect(page.getByText('Tartósabb lazaság')).toBeVisible()
  })

  test('Táblázat sor hover és select', async ({ page }) => {
    // Scroll a táblázathoz
    await page.getByText('Művelési módszerek összehasonlítása').scrollIntoViewIfNeeded()
    
    const row = page.locator('tbody tr').first()
    
    // Hover
    await row.hover()
    await expect(row).toHaveCSS('background-color', /.+/)
    
    // Click select
    await row.click()
    await expect(row).toHaveClass(/selected/)
  })

  test('Before/After slider működik', async ({ page }) => {
    // Scroll a szekcióhoz
    await page.getByText('Drónfelvételek elemzése').scrollIntoViewIfNeeded()
    
    const slider = page.locator('.sliderHandle')
    const container = page.locator('.sliderContainer')
    
    // Drag slider
    const box = await container.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2)
      await page.mouse.up()
    }
    
    // Slider position changed
    const left = await slider.evaluate(el => el.style.left)
    expect(parseInt(left)).toBeGreaterThan(50)
  })

  test('Kutatási kérdések accordion', async ({ page }) => {
    // Scroll a szekcióhoz
    await page.getByText('Kutatási kérdéseinkre adott válaszok').scrollIntoViewIfNeeded()
    
    // Első alapból nyitva
    await expect(page.getByText('Tartósabb lazaság').first()).toBeVisible()
    
    // Második kérdés megnyitása
    await page.getByText('Hogyan változik a szerkezet').click()
    await expect(page.getByText('stabil, minimális visszatömörödés')).toBeVisible()
  })

  test('Galéria lightbox megnyílik', async ({ page }) => {
    // Scroll a galériához
    await page.getByText('Drónfelvételek elemzése').scrollIntoViewIfNeeded()
    
    // Kártya kattintás
    await page.locator('.galleryCard').first().click()
    
    // Lightbox megjelenik
    await expect(page.locator('.lightboxOverlay')).toBeVisible()
    
    // Navigáció működik
    await page.locator('.nextButton').click()
    
    // Bezárás
    await page.locator('.closeButton').click()
    await expect(page.locator('.lightboxOverlay')).not.toBeVisible()
  })

  test('Ajánlások kártyák hover animáció', async ({ page }) => {
    // Scroll a szekcióhoz
    await page.getByText('Mikor ajánlott az ásógép?').scrollIntoViewIfNeeded()
    
    const card = page.locator('.recCard').first()
    
    // Hover
    await card.hover()
    await page.waitForTimeout(300)
    
    // Transform változott
    const transform = await card.evaluate(el => window.getComputedStyle(el).transform)
    expect(transform).not.toBe('none')
  })

  test('Végső következtetés idézet animáció', async ({ page }) => {
    // Scroll az aljára
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Quote látható
    await expect(page.locator('.quote')).toBeVisible()
    
    // Badge látható
    await expect(page.getByText('Neumann János Egyetem')).toBeVisible()
  })

  test('Mobile: Táblázat horizontálisan görgethető', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    
    await page.getByText('Művelési módszerek').scrollIntoViewIfNeeded()
    
    const tableContainer = page.locator('.tableContainer')
    await expect(tableContainer).toHaveCSS('overflow-x', 'auto')
  })

  test('Accessibility - ARIA labels', async ({ page }) => {
    // Accordion buttons
    const accordionButtons = page.locator('[aria-expanded]')
    await expect(accordionButtons.first()).toHaveAttribute('aria-expanded', /.+/)
    
    // Table has proper structure
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('thead')).toBeVisible()
    await expect(page.locator('tbody')).toBeVisible()
  })
})
```

---

## Fájl Struktúra

```
src/
├── app/
│   └── eredmenyek/
│       └── page.tsx                    # ✅ Létezik - fejlesztendő
├── components/
│   └── results/
│       ├── ResultsLayout.tsx           # 🆕 Új
│       ├── FindingCard.tsx             # 🆕 Új
│       ├── ComparisonTable.tsx         # ✅ Létezik - fejlesztendő
│       ├── ComparisonVisualization.tsx # 🆕 Új
│       ├── BeforeAfterSlider.tsx       # 🆕 Új
│       ├── LocationGalleryCard.tsx     # 🆕 Új
│       ├── ImageLightbox.tsx           # 🆕 Új
│       ├── ResearchAnswers.tsx         # 🆕 Új (accordion)
│       ├── RecommendationCard.tsx      # 🆕 Új
│       ├── Conclusion.tsx              # 🆕 Új
│       └── Results.module.css          # ✅ Létezik - fejlesztendő
├── animations/
│   ├── soil-layers.json                # 🆕 Lottie
│   ├── temperature.json                # 🆕 Lottie
│   ├── water-flow.json                 # 🆕 Lottie
│   └── plant-growth.json               # 🆕 Lottie
└── lib/
    └── data.ts                         # ✅ Létezik - findings, treatmentComparison
```

---

## Implementációs Prioritás

1. **Magas** - Finding kártyák Lottie animációkkal
2. **Magas** - Interaktív összehasonlító táblázat
3. **Magas** - Before/After drón slider
4. **Közepes** - Kutatási kérdések accordion
5. **Közepes** - Galéria lightbox
6. **Közepes** - Ajánlások kártyák
7. **Alacsony** - Comparison visualization (bar morph)
8. **Alacsony** - Végső következtetés animáció
