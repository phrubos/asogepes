# 03 — Technológia

## Útvonal
`/technologia` → `src/app/technologia/page.tsx`

> **Megjegyzés:** Jelenleg `/megoldas` néven létezik. Átnevezés szükséges.

---

## Cél
Bemutatni az ásógépet mint megoldást — működési elv, konkrét modellek és alkalmazási módok.

---

## Oldalszerkezet

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO: "Lazítás forgatás nélkül"                                │
├─────────────────────────────────────────────────────────────────┤
│  MŰKÖDÉSI ELV - Animált bemutató                                │
├─────────────────────────────────────────────────────────────────┤
│  SZÁNTÁS VS ÁSÓGÉP - Összehasonlító táblázat                    │
├─────────────────────────────────────────────────────────────────┤
│  IMANTS MODELLEK - 3 interaktív folder/tab                      │
│  (38SX, 38WX, 40SX)                                             │
├─────────────────────────────────────────────────────────────────┤
│  ALKALMAZÁSI MÓDOK - 3 kártya                                   │
├─────────────────────────────────────────────────────────────────┤
│  ÁTVEZETŐ CTA → Kutatás                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Szekciók

### 1. HERO SZEKCIÓ

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Section Number] 02                                            │
│  [Title] A Technológia                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │        L a z í t á s                                    │    │
│  │        forgatás nélkül                                  │    │
│  │                                                         │    │
│  │  ← Split text reveal animáció                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Az Imants ásógép technológia megőrzi a talaj természetes       │
│  rétegződését, miközben megszünteti a tömörödést.               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Animációk
```typescript
// Split text reveal - karakterenként
const SplitText = ({ text, delay = 0 }) => {
  return (
    <motion.span>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Használat
<h1>
  <SplitText text="Lazítás" delay={0.2} />
  <br />
  <SplitText text="forgatás nélkül" delay={0.5} />
</h1>
```

---

### 2. MŰKÖDÉSI ELV

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  HOGYAN MŰKÖDIK AZ ÁSÓGÉP?                                      │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  [LOTTIE / SVG ANIMÁCIÓ]                                │    │
│  │                                                         │    │
│  │       ┌─────┐                                           │    │
│  │       │     │  ← Rotor                                  │    │
│  │    ╔══╧═════╧══╗                                        │    │
│  │    ║  ↙  ↙  ↙  ║  ← Ásókanalak                          │    │
│  │    ╚═══════════╝                                        │    │
│  │        │ │ │                                            │    │
│  │    ~~~~│~│~│~~~~  ← Talajfelszín                        │    │
│  │    ░░░░│░│░│░░░░                                        │    │
│  │    ░░░░│░│░│░░░░  ← Lazított réteg                      │    │
│  │    ════════════  ← Bolygatatlan altalaj                 │    │
│  │                                                         │    │
│  │  [Play/Pause] gomb az animáció vezérléséhez             │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  KULCS JELLEMZŐK                                                │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Ásókanalak  │  │  Függőleges  │  │  Rétegek     │           │
│  │  forgása     │  │  mozgás      │  │  helyükön    │           │
│  │              │  │              │  │              │           │
│  │  Felemelik   │  │  Nem forgat, │  │  Talajélet   │           │
│  │  és ejtik    │  │  csak lazít  │  │  megmarad    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Lottie Animáció - Működési Elv
```typescript
// SpadeAnimation.tsx
import Lottie from 'lottie-react'
import spadeWorkingAnimation from '@/animations/spade-working.json'

interface Props {
  isPlaying: boolean
  onToggle: () => void
}

export function SpadeAnimation({ isPlaying, onToggle }: Props) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    if (isPlaying) {
      lottieRef.current?.play()
    } else {
      lottieRef.current?.pause()
    }
  }, [isPlaying])

  return (
    <div className={styles.animationContainer}>
      <Lottie
        lottieRef={lottieRef}
        animationData={spadeWorkingAnimation}
        loop
        autoplay={false}
        style={{ width: '100%', maxWidth: 600 }}
      />
      
      <motion.button
        className={styles.playButton}
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? <Pause /> : <Play />}
        {isPlaying ? 'Szünet' : 'Lejátszás'}
      </motion.button>
    </div>
  )
}
```

#### Jellemzők Kártyák - Micro Interactions
```typescript
// Scroll-triggered reveal + icon animáció
const featureVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

// Icon animáció hover-re
<motion.div
  className={styles.featureIcon}
  whileHover={{
    rotate: [0, -10, 10, -5, 5, 0],
    transition: { duration: 0.5 }
  }}
>
  <RotateCcw size={32} />
</motion.div>
```

---

### 3. SZÁNTÁS VS ÁSÓGÉP ÖSSZEHASONLÍTÁS

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  MIÉRT JOBB AZ ÁSÓGÉP?                                          │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  ┌─────────────────┬─────────────────┐                  │    │
│  │  │     SZÁNTÁS     │     ÁSÓGÉP      │                  │    │
│  │  ├─────────────────┼─────────────────┤                  │    │
│  │  │  ✗ Forgat       │  ✓ Csak lazít   │  ← row animáció  │    │
│  │  │  ✗ Eketalp      │  ✓ Nincs        │                  │    │
│  │  │  ✗ Rétegkeverés │  ✓ Rétegmegőrzés│                  │    │
│  │  │  ✗ Barázdás     │  ✓ Sík felszín  │                  │    │
│  │  │  ✗ Lassú felm.  │  ✓ Gyors felm.  │                  │    │
│  │  └─────────────────┴─────────────────┘                  │    │
│  │                                                         │    │
│  │  [Hover: magyarázó tooltip minden sornál]               │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Táblázat Animáció
```typescript
// ComparisonTable.tsx

const rows = [
  { plough: 'Forgat', spade: 'Csak lazít', tooltip: 'A forgatás károsítja a talajéletet' },
  { plough: 'Eketalp képződés', spade: 'Nincs eketalp', tooltip: '25-30 cm mélyen tömör réteg' },
  // ...
]

// Sorok egymás után jelennek meg
{rows.map((row, i) => (
  <motion.tr
    key={i}
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.1, duration: 0.4 }}
    whileHover={{ backgroundColor: 'rgba(212, 168, 75, 0.1)' }}
  >
    <td className={styles.negative}>
      <X size={16} />
      {row.plough}
    </td>
    <td className={styles.positive}>
      <Check size={16} />
      {row.spade}
    </td>
    
    {/* Tooltip hover-re */}
    <Tooltip content={row.tooltip}>
      <Info size={14} />
    </Tooltip>
  </motion.tr>
))}

// Check/X ikonok animációja
<motion.span
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 500 }}
>
  <Check />
</motion.span>
```

---

### 4. IMANTS MODELLEK (FŐ SZEKCIÓ)

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  IMANTS MODELLEK                                                │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [3D FOLDER NAVIGÁCIÓ]                                  │    │
│  │                                                         │    │
│  │    ┌─────────┐    ┌─────────┐    ┌─────────┐            │    │
│  │    │  38SX   │    │  38WX   │    │  40SX   │            │    │
│  │    │ [image] │    │ [image] │    │ [image] │            │    │
│  │    │  Nagy   │    │ Lazító- │    │  Mély-  │            │    │
│  │    │ szériás │    │  késes  │    │ ásógép  │            │    │
│  │    └─────────┘    └─────────┘    └─────────┘            │    │
│  │                                                         │    │
│  │  Hover: 3D folder megnyílik, papírok kiúsznak           │    │
│  │  Click: Scroll a részletes tartalomhoz                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [STICKY TAB BAR]                                       │    │
│  │  ┌──────────┬──────────┬──────────┐                     │    │
│  │  │   38SX   │   38WX   │   40SX   │  ← pill indikátor   │    │
│  │  └──────────┴──────────┴──────────┘                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [AKTÍV MODELL TARTALMA]                                        │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌──────────────────────┬──────────────────────────────────┐    │
│  │                      │                                  │    │
│  │    [MODELL KÉP]      │  38SX — Nagy szériás             │    │
│  │                      │                                  │    │
│  │    ┌────────────┐    │  Munkamélység: 15-35 cm          │    │
│  │    │            │    │  Teljesítmény: 80-150 LE         │    │
│  │    │   38SX     │    │                                  │    │
│  │    │            │    │  Jellemzők:                      │    │
│  │    └────────────┘    │  • Kompakt felépítés             │    │
│  │                      │  • Költséghatékony               │    │
│  │                      │  • Könnyű karbantartás           │    │
│  │                      │                                  │    │
│  │  [Műszaki rajz btn]  │  [Kísérletben →] btn             │    │
│  │                      │                                  │    │
│  └──────────────────────┴──────────────────────────────────┘    │
│                                                                 │
│  KÍSÉRLETI EREDMÉNYEK (adott modellhez)                         │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Lakitelek III. parcella: Ásógép (30 cm)                │    │
│  │  Kezdeti: 22 cm → Végső: 20 cm → Változás: -2 cm ✓      │    │
│  │                                                         │    │
│  │  Lakitelek VII. parcella: Szántás + Ásógép (25 cm)      │    │
│  │  Kezdeti: 32 cm → Végső: 31 cm → Változás: -1 cm ★      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3D Folder Komponens (MÁR LÉTEZIK - fejlesztve)
```typescript
// FolderNavigation.tsx - jelenlegi SolutionLayout-ból

// Folder hover animáció
const folderVariants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: 1.12, 
    y: -25,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  }
}

// Folder front megnyílik
const folderFrontVariants = {
  initial: { rotateY: 0, x: 0, z: 0 },
  hover: { 
    rotateY: -15,
    x: 25,
    z: 25,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
  }
}

// Papírok kiúsznak
const sheetVariants = {
  initial: { x: -10, y: -6, rotate: 0 },
  hover: { 
    x: -30,
    y: -18,
    rotate: -2,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
  }
}

// Kép zoom
const imageVariants = {
  initial: { scale: 1, filter: 'brightness(0.9)' },
  hover: { 
    scale: 1.15,
    filter: 'brightness(1)',
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
}
```

#### Modell Tab Váltás
```typescript
// Sticky tab bar + animated content
const [activeModel, setActiveModel] = useState<'38sx' | '38wx' | '40sx'>('38sx')

// Tab indicator animation
<nav className={styles.modelTabs}>
  {(['38sx', '38wx', '40sx'] as const).map((modelId) => (
    <button
      key={modelId}
      className={`${styles.modelTab} ${activeModel === modelId ? styles.active : ''}`}
      onClick={() => setActiveModel(modelId)}
    >
      {modelId.toUpperCase()}
      {activeModel === modelId && (
        <motion.div
          className={styles.tabIndicator}
          layoutId="activeTabIndicator"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  ))}
</nav>

// Content switch with AnimatePresence
<AnimatePresence mode="wait">
  <motion.div
    key={activeModel}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    <ModelSection modelId={activeModel} />
  </motion.div>
</AnimatePresence>
```

#### Műszaki Rajz Modal
```typescript
// BlueprintModal.tsx
// A modell képére kattintva megnyílik

<AnimatePresence>
  {isOpen && (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={`/images/${modelId}-blueprint.png`}
          alt={`${modelId} műszaki rajz`}
          fill
          className={styles.blueprintImage}
        />
        
        {/* Zoom controls */}
        <div className={styles.zoomControls}>
          <button onClick={() => setZoom(z => z + 0.25)}><ZoomIn /></button>
          <button onClick={() => setZoom(z => z - 0.25)}><ZoomOut /></button>
          <button onClick={() => setZoom(1)}><Maximize /></button>
        </div>
        
        <button className={styles.closeButton} onClick={onClose}>
          <X />
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

---

### 5. ALKALMAZÁSI MÓDOK

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  ALKALMAZÁSI MÓDOK                                              │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ │
│  │                  │ │                  │ │    ★ LEGJOBB    │ │
│  │  ÖNÁLLÓ ÁSÓGÉP   │ │ LAZÍTÁS+ÁSÓGÉP   │ │ SZÁNTÁS+ÁSÓGÉP  │ │
│  │  ──────────────  │ │  ──────────────  │ │  ──────────────  │ │
│  │                  │ │                  │ │                  │ │
│  │  [Lottie ikon]   │ │  [Lottie ikon]   │ │  [Lottie ikon]   │ │
│  │                  │ │                  │ │                  │ │
│  │  Mikor:          │ │  Mikor:          │ │  Mikor:          │ │
│  │  Jó szerkezetű   │ │  Nagyon tömör    │ │  Hagyományos     │ │
│  │  talajokon       │ │  talajokon       │ │  rendszerbe      │ │
│  │                  │ │                  │ │                  │ │
│  │  Mélység:        │ │  Mélység:        │ │  Mélység:        │ │
│  │  30-45 cm        │ │  55+30 cm        │ │  28+25 cm        │ │
│  │                  │ │                  │ │                  │ │
│  │  Eredmény:       │ │  Eredmény:       │ │  Eredmény:       │ │
│  │  -2 cm változás  │ │  -7 cm változás  │ │  -1 cm változás  │ │
│  │  ████████░░      │ │  █████░░░░░      │ │  █████████░      │ │
│  │                  │ │                  │ │                  │ │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘ │
│                                                                 │
│  [Kártya hover: részletek megjelennek]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Alkalmazási Mód Kártyák
```typescript
// ApplicationModeCard.tsx

const applicationModes = [
  {
    id: 'solo',
    title: 'Önálló ásógép',
    icon: 'spade',
    when: 'Jó szerkezetű, nem túl tömör talajokon',
    depth: '30-45 cm',
    result: -2,
    rating: 4,
    examples: ['Lakitelek I.', 'Lakitelek III.'],
    isBest: false
  },
  // ...
]

// Kártya komponens
<motion.div
  className={`${styles.modeCard} ${mode.isBest ? styles.bestMode : ''}`}
  whileHover={{ y: -12, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  {mode.isBest && (
    <motion.div
      className={styles.bestBadge}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
    >
      <Star /> LEGJOBB
    </motion.div>
  )}
  
  {/* Lottie ikon */}
  <Lottie
    animationData={getIconAnimation(mode.icon)}
    loop
    style={{ width: 80, height: 80 }}
  />
  
  <h3>{mode.title}</h3>
  
  {/* Progress bar az eredményhez */}
  <div className={styles.resultBar}>
    <motion.div
      className={styles.resultFill}
      initial={{ width: 0 }}
      whileInView={{ width: `${(10 + mode.result) * 10}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
    <span>{mode.result} cm változás</span>
  </div>
</motion.div>
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
    Hogyan teszteltük ezeket a gyakorlatban?
  </motion.p>
  
  <MagneticButton variant="primary" size="lg" href="/kutatas">
    Tovább a Kutatásra
    <ArrowRight />
  </MagneticButton>
</motion.section>
```

---

## Design Specifikáció

### Színek
```css
/* Sötét háttér - mint a jelenlegi Megoldás oldal */
--page-bg: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.7);

/* Kártyák */
--card-bg: rgba(255, 255, 255, 0.03);
--card-border: rgba(255, 255, 255, 0.08);
--card-hover-bg: rgba(255, 255, 255, 0.06);

/* Modellek színei */
--model-38sx-color: #8B6914;  /* barna */
--model-38wx-color: #2D5A27;  /* zöld */
--model-40sx-color: #1E3A5F;  /* kék */

/* Best badge */
--best-badge-bg: var(--color-accent);
--best-badge-text: #000;
```

### Tipográfia
```css
/* Hero cím - nagy, drámai */
.heroTitle {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}

/* Modell név */
.modelName {
  font-size: 2.5rem;
  font-weight: 700;
}

/* Spec értékek */
.specValue {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-accent);
}
```

---

## Playwright Tesztek

### Fájl: `e2e/technologia.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Technológia oldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/technologia')
  })

  test('Oldal betöltődik', async ({ page }) => {
    await expect(page.getByText('A Technológia')).toBeVisible()
    await expect(page.getByText('Lazítás')).toBeVisible()
  })

  test('Működési elv animáció vezérlése', async ({ page }) => {
    const playButton = page.getByRole('button', { name: /lejátszás/i })
    await expect(playButton).toBeVisible()
    
    // Play
    await playButton.click()
    await expect(page.getByRole('button', { name: /szünet/i })).toBeVisible()
    
    // Pause
    await page.getByRole('button', { name: /szünet/i }).click()
    await expect(page.getByRole('button', { name: /lejátszás/i })).toBeVisible()
  })

  test('Összehasonlító táblázat sorai animálódnak', async ({ page }) => {
    // Scroll a táblázathoz
    await page.getByText('Miért jobb az ásógép?').scrollIntoViewIfNeeded()
    
    // Sorok megjelennek
    const rows = page.locator('table tr')
    await expect(rows).toHaveCount(6) // header + 5 sor
    
    // Tooltip hover-re
    await page.locator('table tr').nth(1).hover()
    await expect(page.getByRole('tooltip')).toBeVisible()
  })

  test('Folder navigáció 3D hover effekt', async ({ page }) => {
    const folder = page.locator('.folder').first()
    
    // Hover
    await folder.hover()
    await page.waitForTimeout(400)
    
    // Transform változott
    const transform = await folder.evaluate(el => 
      window.getComputedStyle(el).transform
    )
    expect(transform).not.toBe('none')
  })

  test('Modell tab váltás animált', async ({ page }) => {
    // Alapértelmezett: 38SX
    await expect(page.getByText('38SX — Nagy szériás')).toBeVisible()
    
    // 38WX tabra kattintás
    await page.getByRole('button', { name: '38WX' }).click()
    
    // Animated content change
    await expect(page.getByText('38WX — Lazítókéses')).toBeVisible()
    await expect(page.getByText('38SX — Nagy szériás')).not.toBeVisible()
  })

  test('Modell specifikációk helyesek', async ({ page }) => {
    // 40SX tab
    await page.getByRole('button', { name: '40SX' }).click()
    
    // Specs ellenőrzés
    await expect(page.getByText('20-50 cm')).toBeVisible()  // mélység
    await expect(page.getByText('100-250 LE')).toBeVisible() // teljesítmény
  })

  test('Műszaki rajz modal megnyílik', async ({ page }) => {
    // Kép kattintás
    const modelImage = page.locator('.modelImage').first()
    await modelImage.click()
    
    // Modal megjelenik
    await expect(page.locator('.modalOverlay')).toBeVisible()
    
    // Zoom működik
    await page.getByRole('button', { name: /zoom in/i }).click()
    
    // Bezárás
    await page.getByRole('button', { name: /close/i }).click()
    await expect(page.locator('.modalOverlay')).not.toBeVisible()
  })

  test('Alkalmazási módok kártyák', async ({ page }) => {
    // Scroll a szekcióhoz
    await page.getByText('Alkalmazási módok').scrollIntoViewIfNeeded()
    
    // 3 kártya látható
    const modeCards = page.locator('.modeCard')
    await expect(modeCards).toHaveCount(3)
    
    // "Legjobb" badge a Szántás+Ásógép kártyán
    await expect(page.getByText('★ LEGJOBB')).toBeVisible()
  })

  test('Átvezető CTA navigál', async ({ page }) => {
    // Scroll az aljára
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // CTA
    await page.getByRole('link', { name: /kutatásra/i }).click()
    await expect(page).toHaveURL('/kutatas')
  })

  test('Mobile: Folder navigáció swipe-olható', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    
    // Folders horizontálisan görgethetők
    const folderContainer = page.locator('.folderNav')
    await expect(folderContainer).toHaveCSS('overflow-x', 'auto')
  })

  test('Accessibility - keyboard navigation', async ({ page }) => {
    // Tab navigáció működik
    await page.keyboard.press('Tab')
    
    const tabs = page.locator('.modelTab')
    await tabs.first().focus()
    
    // Arrow keys
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
│   └── technologia/                    # 🆕 Átnevezés /megoldas-ról
│       └── page.tsx
├── components/
│   └── technology/                     # 🆕 Átnevezés solution-v2-ről
│       ├── TechnologyLayout.tsx
│       ├── SpadeAnimation.tsx          # 🆕 Lottie működési elv
│       ├── ComparisonTable.tsx         # 🆕 Szántás vs Ásógép
│       ├── FolderNavigation.tsx        # ✅ Már létezik
│       ├── ModelSection.tsx            # ✅ Már létezik
│       ├── ApplicationModeCard.tsx     # 🆕 Alkalmazási módok
│       ├── BlueprintModal.tsx          # 🆕 Műszaki rajz modal
│       └── Technology.module.css
├── animations/
│   ├── spade-working.json              # 🆕 Működési elv Lottie
│   ├── spade-icon.json                 # 🆕 Önálló ásógép ikon
│   ├── layers-icon.json                # 🆕 Lazítás+Ásógép ikon
│   └── combine-icon.json               # 🆕 Szántás+Ásógép ikon
└── lib/
    └── data.ts                         # ✅ Létezik - modelDetails
```

---

## Implementációs Prioritás

1. **Magas** - Útvonal átnevezése `/megoldas` → `/technologia`
2. **Magas** - Működési elv szekció + Lottie animáció
3. **Magas** - Összehasonlító táblázat hover tooltipekkel
4. **Közepes** - Folder 3D animációk finomhangolása
5. **Közepes** - Alkalmazási módok kártyák progress bar-ral
6. **Alacsony** - Műszaki rajz modal zoom funkcióval
7. **Alacsony** - Lottie ikonok az alkalmazási módokhoz
