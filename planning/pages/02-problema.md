# 02 — Probléma

## Útvonal
`/problema` → `src/app/problema/page.tsx`

---

## Cél
Megértetni, MIÉRT van szükség alternatív talajművelésre. A látogató értse meg a problémát, mielőtt a megoldást látná.

---

## Oldalszerkezet

```
┌─────────────────────────────────────────────────────────────────┐
│  BEVEZETŐ HERO                                                  │
├─────────────────────────────────────────────────────────────────┤
│  TAB NAVIGÁCIÓ (floating, alul)                                 │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │  A Tömörödés        │  │  A Szántás Korlátai │               │
│  └─────────────────────┘  └─────────────────────┘               │
├─────────────────────────────────────────────────────────────────┤
│  TAB 1: TÖMÖRÖDÉS TARTALMA                                      │
│  vagy                                                           │
│  TAB 2: SZÁNTÁS TARTALMA                                        │
├─────────────────────────────────────────────────────────────────┤
│  ÁTVEZETŐ CTA                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Szekciók

### 1. BEVEZETŐ HERO

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Section Number] 01                                            │
│  [Title] A Probléma                                             │
│                                                                 │
│  Az intenzív öntözéses kertészetben a talaj folyamatos          │
│  terhelésnek van kitéve. A hagyományos művelés nem              │
│  tartja lépést ezzel a stresszel.                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  "A talaj él. De az élet megfojtható."                  │    │
│  │  — ha túl gyakran és rosszul műveljük                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Animációk
```typescript
// Szekció header staggered entrance
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <SectionHeader number="01" title="A Probléma" />
</motion.div>

// Idézet reveal - line-by-line
<TextReveal delay={0.4}>
  "A talaj él. De az élet megfojtható."
</TextReveal>
```

---

### 2. TAB NAVIGÁCIÓ (Floating)

#### Design
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│           ┌───────────────────────────────────────┐             │
│           │  ● A Tömörödés  │  A Szántás Korlátai │             │
│           └───────────────────────────────────────┘             │
│                        ↑                                        │
│                  Floating bar                                   │
│                  position: fixed                                │
│                  bottom: 24px                                   │
│                  glassmorphism háttér                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Komponens
```typescript
// PageNavigation.tsx - már létezik, de frissíteni kell

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

const tabs: TabItem[] = [
  { id: 'tomorodes', label: 'A Tömörödés', icon: <Layers /> },
  { id: 'szantas', label: 'A Szántás Korlátai', icon: <AlertTriangle /> }
]
```

#### Animációk
```typescript
// Tab váltás - sliding pill indikátor
<motion.div
  className={styles.activeIndicator}
  layoutId="activeTab"
  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
/>

// Tab kattintás → smooth scroll a tartalomhoz
const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const yOffset = -120  // header + nav magasság
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
```

---

### 3. TAB 1: A TÖMÖRÖDÉS

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  A TÖMÖRÖDÉS                                                    │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [INTERAKTÍV TALAJSZELVÉNY]                             │    │
│  │                                                         │    │
│  │  ← Csúszka: 0 nap ──────────────────── 120 nap →        │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  ░░░░░░░░░░░░░░░░░░░░░░  Felső réteg (0-10cm)   │    │    │
│  │  │  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  Közép réteg (10-25cm)  │    │    │
│  │  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  Tömör réteg (25-40cm)  │    │    │
│  │  │  ████████████████████████ Eketalp (40cm+)       │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │                                                         │    │
│  │  Penetrométer érték: 25 bar → vizuálisan mutatva        │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  PROBLÉMA FORRÁSOK                                              │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  💧         │  │  🚜         │  │  ⏱️         │           │
│  │  Öntözés     │  │  Gépek       │  │  Idő         │           │
│  │  hatása      │  │  taposása    │  │  múlása      │           │
│  │              │  │              │  │              │           │
│  │  350-450     │  │  Folyamatos  │  │  30 nap      │           │
│  │  mm/szezon   │  │  terhelés    │  │  alatt       │           │
│  │              │  │              │  │  kritikus    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
│  KÖVETKEZMÉNYEK                                                 │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Gyökérzóna │ Vízelvezetés │ Hőgazdálkodás │ Élővilág   │    │
│  │  beszűkül   │ romlik       │ lassul        │ károsodik  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Komponensek
| Komponens | Típus | Fájl |
|-----------|-------|------|
| `CompactionView` | Section | `components/problem/CompactionView.tsx` |
| `InteractiveSoil` | Interactive | `components/problem/InteractiveSoil.tsx` |
| `ChallengeCard` | Card | `components/problem/ChallengeCard.tsx` |
| `ConsequenceCard` | Card | `components/problem/ConsequenceCard.tsx` |

#### Interaktív Talajszelvény Animáció

```typescript
// InteractiveSoil.tsx - MÁR LÉTEZIK, de fejleszthető

interface SoilLayer {
  id: string
  name: string
  depthStart: number
  depthEnd: number
  compactionLevel: number  // 0-100, idővel változik
  color: string
}

const [dayIndex, setDayIndex] = useState(0)
const days = [0, 30, 60, 90, 120]

// Csúszka változáskor a rétegek animálódnak
<motion.div
  className={styles.soilLayer}
  animate={{
    height: `${layer.thickness}%`,
    backgroundColor: interpolateColor(layer.compactionLevel)
  }}
  transition={{ duration: 0.5, ease: 'easeInOut' }}
/>
```

**Lottie Animáció - Vízcsepp szivárgás**
```typescript
// A talajszelvény mellett/alatt
import waterDropAnimation from '@/animations/water-seep.json'

<Lottie 
  animationData={waterDropAnimation}
  loop
  style={{ 
    position: 'absolute',
    top: '20%',
    left: '50%',
    width: 100,
    opacity: 1 - compactionLevel / 100  // tömörödéssel eltűnik
  }}
/>
```

#### Probléma Kártyák Animáció
```typescript
// Scroll-triggered staggered reveal
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

// Kártya hover - icon bounce
<motion.div 
  className={styles.cardIcon}
  whileHover={{ 
    scale: 1.2,
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.4 }
  }}
>
  <Droplet size={32} />
</motion.div>

// Data badge - pulse effekt
<motion.span
  className={styles.dataBadge}
  animate={{ 
    boxShadow: [
      '0 0 0 0 rgba(212, 168, 75, 0.4)',
      '0 0 0 10px rgba(212, 168, 75, 0)',
    ]
  }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  350-450 mm/szezon
</motion.span>
```

---

### 4. TAB 2: A SZÁNTÁS KORLÁTAI

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│  A SZÁNTÁS KORLÁTAI                                             │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [ANIMÁLT ÖSSZEHASONLÍTÁS]                              │    │
│  │                                                         │    │
│  │  ┌─────────────────┐     ┌─────────────────┐            │    │
│  │  │   SZÁNTÁS       │     │  BOLYGATATLAN   │            │    │
│  │  │                 │     │                 │            │    │
│  │  │  ↻ Forgatás     │     │  ── Rétegek     │            │    │
│  │  │  ═══ Eketalp    │     │     helyükön    │            │    │
│  │  │  ↓↓ Tömörödés   │     │                 │            │    │
│  │  │                 │     │  ✓ Talajélet    │            │    │
│  │  └─────────────────┘     └─────────────────┘            │    │
│  │                                                         │    │
│  │  [Toggle: Animáció indítása]                            │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  STRUKTURÁLIS PROBLÉMÁK (4 kártya, 4 oszlop desktop)            │
│  ─────────────────────────────────────────────────────────      │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│  │  Eketalp   │ │  Rétegek   │ │  Humusz    │ │  Lassú     │    │
│  │  képződés  │ │  felcseré- │ │  oxidáló-  │ │  felmelege-│    │
│  │            │ │  lése      │ │  dása      │ │  dés       │    │
│  │  20+ bar   │ │  Talajélet │ │  Humusz    │ │  2-4°C     │    │
│  │  nyomás    │ │  károsodás │ │  veszteség │ │  különbség │    │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Komponensek
| Komponens | Típus | Fájl |
|-----------|-------|------|
| `PloughingView` | Section | `components/problem/PloughingView.tsx` |
| `SoilComparison` | Interactive | `components/problem/SoilComparison.tsx` |
| `ProblemCard` | Card | benne a PloughingView-ban |

#### Szántás vs Bolygatatlan Animáció

```typescript
// SoilComparison.tsx - komplex animáció

// 1. Szántás oldal - rétegek forgatása
const ploughVariants = {
  initial: {
    // Rétegek eredeti pozícióban
  },
  animate: {
    // Rétegek felcserélődnek, rotálnak
    rotate: 180,
    y: [0, -20, 0],
    transition: { duration: 1.5, ease: 'easeInOut' }
  }
}

// 2. Eketalp megjelenése
<motion.div
  className={styles.ploughPan}
  initial={{ opacity: 0, scaleX: 0 }}
  animate={{ opacity: 1, scaleX: 1 }}
  transition={{ delay: 1.5, duration: 0.8 }}
/>

// 3. Lottie - forgató mozgás
import ploughAnimation from '@/animations/plough-rotate.json'

<Lottie 
  animationData={ploughAnimation}
  loop={false}
  autoplay={isAnimating}
/>
```

#### Kártyák Grid
```typescript
// 4 oszlop desktop, 2 tablet, 1 mobile
<motion.div 
  className={styles.problemGrid}
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-100px' }}
>
  {ploughingProblems.map((problem, i) => (
    <motion.div
      key={problem.title}
      variants={cardVariants}
      custom={i}
      className={styles.problemCard}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
    >
      <div className={styles.cardIcon}>
        {getIcon(problem.icon)}
      </div>
      <h3>{problem.title}</h3>
      <p>{problem.description}</p>
      <span className={styles.dataBadge}>{problem.dataBadge}</span>
    </motion.div>
  ))}
</motion.div>
```

---

### 5. ÁTVEZETŐ CTA

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Van-e olyan módszer, amely lazít anélkül,              │    │
│  │  hogy forgatna?                                         │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────┐                │    │
│  │  │  Igen. Ismerje meg a technológiát →  │                │    │
│  │  └─────────────────────────────────────┘                │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

```typescript
// Átvezető animáció
<motion.section
  className={styles.transition}
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  <motion.p
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    Van-e olyan módszer, amely lazít anélkül, hogy forgatna?
  </motion.p>
  
  <MagneticButton variant="primary" size="lg">
    Igen. Ismerje meg a technológiát
    <motion.span
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      →
    </motion.span>
  </MagneticButton>
</motion.section>
```

---

## Design Specifikáció

### Színek
```css
/* Oldal háttér - világos */
--page-bg: #F8F7F4;

/* Szekció fejléc */
--section-number: var(--color-accent);
--section-title: var(--color-text-primary);

/* Kártyák */
--card-bg: #FFFFFF;
--card-border: rgba(0, 0, 0, 0.06);
--card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
--card-hover-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);

/* Interaktív elemek */
--slider-track: #E5E5E5;
--slider-thumb: var(--color-accent);
--slider-active: var(--color-primary);

/* Tömörödés színskála */
--soil-loose: #8B7355;      /* laza */
--soil-medium: #6B5344;     /* közepes */
--soil-compact: #4A3728;    /* tömör */
--soil-hardpan: #2D1F14;    /* eketalp */
```

### Tipográfia
```css
/* Szekció cím */
.sectionTitle {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
}

/* Kártya cím */
.cardTitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Data badge */
.dataBadge {
  font-size: 0.875rem;
  font-weight: 700;
  background: var(--color-accent);
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
}
```

---

## Reszponzivitás

### Breakpoints
| Elem | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| Probléma kártyák | 3 oszlop | 2 oszlop | 1 oszlop |
| Szántás kártyák | 4 oszlop | 2 oszlop | 1 oszlop |
| Floating nav | Alul középen | Alul középen | Alul, teljes széles |
| Interaktív talaj | Nagy | Közepes | Kisebb + scroll |

---

## Playwright Tesztek

### Fájl: `e2e/problema.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Probléma oldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/problema')
  })

  test('Oldal betöltődik és header látható', async ({ page }) => {
    await expect(page.getByText('A Probléma')).toBeVisible()
    await expect(page.locator('.sectionNumber')).toContainText('01')
  })

  test('Tab navigáció működik', async ({ page }) => {
    // Alapértelmezett: Tömörödés tab aktív
    const tomorodesTab = page.getByRole('button', { name: /tömörödés/i })
    await expect(tomorodesTab).toHaveClass(/active/)
    
    // Kattintás a Szántás tabra
    const szantasTab = page.getByRole('button', { name: /szántás/i })
    await szantasTab.click()
    
    // Szántás tartalom látható
    await expect(page.getByText('A Szántás Korlátai')).toBeVisible()
    await expect(page.getByText('Eketalp képződés')).toBeVisible()
  })

  test('Interaktív talajszelvény csúszka működik', async ({ page }) => {
    const slider = page.locator('input[type="range"]')
    
    // Kezdeti érték
    await expect(slider).toHaveValue('0')
    
    // Csúszka mozgatása
    await slider.fill('60')
    
    // Vizuális változás ellenőrzése (tömörödés növekedett)
    const compactLayer = page.locator('.soilLayer.compact')
    await expect(compactLayer).toBeVisible()
  })

  test('Kártyák hover animációval rendelkeznek', async ({ page }) => {
    const card = page.locator('.challengeCard').first()
    
    // Hover előtt
    const beforeShadow = await card.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    )
    
    // Hover
    await card.hover()
    await page.waitForTimeout(300)
    
    // Hover után
    const afterShadow = await card.evaluate(el => 
      window.getComputedStyle(el).boxShadow
    )
    
    expect(beforeShadow).not.toBe(afterShadow)
  })

  test('Átvezető CTA navigál a Technológia oldalra', async ({ page }) => {
    // Scroll az oldal aljára
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // CTA kattintás
    const ctaButton = page.getByRole('link', { name: /technológiát/i })
    await ctaButton.click()
    
    await expect(page).toHaveURL('/technologia')
  })

  test('Floating nav fix pozícióban marad scroll-ra', async ({ page }) => {
    const floatingNav = page.locator('.floatingNav')
    
    // Kezdeti pozíció
    const initialTop = await floatingNav.evaluate(el => el.getBoundingClientRect().bottom)
    
    // Scroll
    await page.evaluate(() => window.scrollBy(0, 500))
    await page.waitForTimeout(100)
    
    // Pozíció ellenőrzés - közel kell maradjon a viewport aljához
    const afterTop = await floatingNav.evaluate(el => el.getBoundingClientRect().bottom)
    const viewportHeight = await page.evaluate(() => window.innerHeight)
    
    expect(afterTop).toBeCloseTo(viewportHeight - 24, 10)  // 24px padding
  })

  test('Scroll-to-section működik tab kattintásra', async ({ page }) => {
    // Szántás tabra kattintás
    await page.getByRole('button', { name: /szántás/i }).click()
    
    // Várjuk a smooth scroll-t
    await page.waitForTimeout(500)
    
    // Ellenőrizzük, hogy a szántás szekció látható
    const szantasSection = page.locator('#szantas-korlatai')
    await expect(szantasSection).toBeInViewport()
  })

  test('Mobile: Floating nav teljes szélességű', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    
    const floatingNav = page.locator('.floatingNav')
    const navWidth = await floatingNav.evaluate(el => el.offsetWidth)
    
    // Közel teljes szélesség (padding-et leszámítva)
    expect(navWidth).toBeGreaterThan(340)
  })

  test('Accessibility - tab navigáció billentyűzettel', async ({ page }) => {
    // Tab gombokra fókusz
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')  // Skip to content után
    
    const tomorodesTab = page.getByRole('button', { name: /tömörödés/i })
    await expect(tomorodesTab).toBeFocused()
    
    // Arrow key navigáció
    await page.keyboard.press('ArrowRight')
    const szantasTab = page.getByRole('button', { name: /szántás/i })
    await expect(szantasTab).toBeFocused()
    
    // Enter aktiválja
    await page.keyboard.press('Enter')
    await expect(page.getByText('A Szántás Korlátai')).toBeVisible()
  })
})
```

---

## Fájl Struktúra

```
src/
├── app/
│   └── problema/
│       └── page.tsx                    # ✅ Létezik
├── components/
│   └── problem/
│       ├── ProblemLayout.tsx           # ✅ Létezik
│       ├── CompactionView.tsx          # ✅ Létezik
│       ├── PloughingView.tsx           # ✅ Létezik
│       ├── InteractiveSoil.tsx         # ✅ Létezik - fejlesztendő
│       ├── SoilComparison.tsx          # ✅ Létezik - fejlesztendő
│       ├── ChallengeCard.tsx           # 🆕 Új (refactor)
│       └── Problem.module.css          # ✅ Létezik
├── animations/
│   ├── water-seep.json                 # 🆕 Lottie - víz szivárgás
│   └── plough-rotate.json              # 🆕 Lottie - szántás forgás
└── lib/
    └── data.ts                         # ✅ Létezik
```

---

## Implementációs Prioritás

1. **Magas** - InteractiveSoil fejlesztése (csúszka + vizualizáció)
2. **Magas** - Floating tab navigáció finomhangolása
3. **Közepes** - SoilComparison animáció (szántás vs bolygatatlan)
4. **Közepes** - Kártya hover animációk
5. **Alacsony** - Lottie animációk (víz, szántás)
6. **Alacsony** - Átvezető szekció
