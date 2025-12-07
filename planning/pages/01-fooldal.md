# 01 — Főoldal (Home)

## Útvonal
`/` → `src/app/page.tsx`

---

## Cél
Azonnal megragadni a figyelmet, világossá tenni a kutatás lényegét, és továbbvezetni a részletekhez.

---

## Szekciók

### 1. HERO SZEKCIÓ

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Badge] Neumann János Egyetem × Agroskill Kft. — 2025          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  A talaj nem                                            │    │
│  │  végtelen erőforrás|  ← typewriter animáció             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Tudományos kutatás az ásógépes talajművelés                    │
│  hatásairól öntözött kertészeti kultúrákban                     │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │    3     │  │    7     │  │    4     │  │   450    │         │
│  │ Helyszín │  │ Kezelés  │  │  Hónap   │  │ mm víz   │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│       ↑ AnimatedNumber komponens, count-up effekttel            │
│                                                                 │
│  ┌─────────────────────────────────────────┐                    │
│  │  Fedezd fel a kutatást  →               │  ← MagneticButton  │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
│  [Háttér: Parallax kép - ásógép munkában]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Komponensek
| Komponens | Típus | Fájl |
|-----------|-------|------|
| `Hero` | Section | `components/home/Hero.tsx` |
| `AnimatedNumber` | UI | `components/ui/AnimatedNumber.tsx` |
| `MagneticButton` | UI | `components/ui/MagneticButton.tsx` |
| `TextReveal` | UI | `components/ui/TextReveal.tsx` |

#### Animációk

**A) Parallax Háttér**
```typescript
// useParallax hook
const { style } = useParallax({ speed: 0.3, maxOffset: 150 })

// Alkalmazás
<div className={styles.heroBg} style={parallaxStyle}>
  <Image ... />
</div>
```

**B) Typewriter Effekt**
```typescript
// Framer Motion + useState
const fullText = 'végtelen erőforrás'

useEffect(() => {
  // Karakter-by-karakter megjelenítés (80ms)
  // 10s várakozás
  // Karakter-by-karakter törlés (40ms)
  // Újrakezdés
}, [])

<span className={styles.titleAccent}>
  {typewriterText}
  <motion.span
    className={styles.cursor}
    animate={{ opacity: [1, 0] }}
    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
  >
    |
  </motion.span>
</span>
```

**C) Staggered Reveal**
```typescript
// Badge, cím, alcím, statisztikák, CTA - egymás után
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: index * 0.1 }}
>
```

**D) AnimatedNumber - Count Up**
```typescript
// Intersection Observer + requestAnimationFrame
interface Props {
  value: number
  suffix?: string
  duration?: number  // default: 2000ms
  delay?: number
}

// Easing: easeOutExpo a természetes lassulásért
```

**E) MagneticButton**
```typescript
// Egér követés + enyhe "vonzás" effekt
const magneticStrength = 0.25

onMouseMove={(e) => {
  const { left, top, width, height } = ref.current.getBoundingClientRect()
  const x = (e.clientX - left - width / 2) * magneticStrength
  const y = (e.clientY - top - height / 2) * magneticStrength
  // Framer Motion animate
}}
```

---

### 2. KUTATÁSI KÉRDÉSEK SZEKCIÓ (ÚJ)

#### Tartalom
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Section Header] Mire kerestük a választ?                      │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │  01             │  │  02             │                       │
│  │  ───────────    │  │  ───────────    │                       │
│  │  Milyen hatása  │  │  Hogyan változik│                       │
│  │  van az ásógép- │  │  a talajszerke- │                       │
│  │  nek a talajra? │  │  zet egy szezon │                       │
│  │                 │  │  alatt?         │                       │
│  │  → Eredmények   │  │  → Kutatás      │                       │
│  └─────────────────┘  └─────────────────┘                       │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │  03             │  │  04             │                       │
│  │  ───────────    │  │  ───────────    │                       │
│  │  Önmagában vagy │  │  Melyik művelési│                       │
│  │  kombinálva jobb│  │  módszer a      │                       │
│  │  az ásógép?     │  │  leghatékonyabb?│                       │
│  │                 │  │                 │                       │
│  │  → Technológia  │  │  → Eredmények   │                       │
│  └─────────────────┘  └─────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Komponensek
| Komponens | Típus | Fájl |
|-----------|-------|------|
| `ResearchQuestions` | Section | `components/home/ResearchQuestions.tsx` |
| `QuestionCard` | Card | `components/home/QuestionCard.tsx` |

#### Animációk

**A) Kártyák Staggered Entrance**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}
```

**B) Kártya Hover - 3D Tilt**
```typescript
// Mouse position tracking
const handleMouseMove = (e: MouseEvent) => {
  const rect = cardRef.current.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const rotateX = (y - centerY) / 20  // max ~10deg
  const rotateY = (centerX - x) / 20
  
  setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
}

// Visszaállás smooth-an
onMouseLeave={() => {
  setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)')
}}
```

**C) Szám Highlight - Lottie**
```typescript
// Lottie JSON a számok mellett - kis "pulse" vagy "glow" animáció
import Lottie from 'lottie-react'
import pulseAnimation from '@/animations/pulse.json'

<div className={styles.questionNumber}>
  <Lottie animationData={pulseAnimation} loop style={{ width: 60, height: 60 }} />
  <span>01</span>
</div>
```

**D) Arrow Hover Animation**
```typescript
// Nyíl jobbra mozdul hover-re
<motion.span
  className={styles.arrow}
  initial={{ x: 0 }}
  whileHover={{ x: 8 }}
  transition={{ type: 'spring', stiffness: 400 }}
>
  →
</motion.span>
```

---

### 3. SCROLL INDIKÁTOR (ÚJ - opcionális)

```typescript
// A hero alján, pattogó nyíl lefelé
<motion.div
  className={styles.scrollIndicator}
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
>
  <ChevronDown size={24} />
  <span>Görgess</span>
</motion.div>
```

---

## Design Specifikáció

### Színek
```css
/* Hero háttér */
--hero-overlay: linear-gradient(
  to bottom,
  rgba(0, 0, 0, 0.4) 0%,
  rgba(0, 0, 0, 0.6) 100%
);

/* Kártya háttér */
--card-bg: rgba(255, 255, 255, 0.03);
--card-border: rgba(255, 255, 255, 0.08);
--card-hover-border: var(--color-accent);

/* Szöveg */
--hero-title: #FFFFFF;
--hero-subtitle: rgba(255, 255, 255, 0.8);
--stat-number: var(--color-accent);  /* arany */
```

### Tipográfia
```css
/* Hero cím */
.heroTitle {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Typewriter accent */
.titleAccent {
  color: var(--color-accent);
  font-style: italic;
}

/* Statisztika számok */
.statNumber {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
```

### Spacing
```css
/* Hero */
.hero {
  min-height: 100vh;
  padding: var(--space-6) var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Statisztikák */
.heroStats {
  display: flex;
  gap: var(--space-6);
  margin-top: var(--space-8);
}

/* Kutatási kérdések grid */
.questionsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

---

## Reszponzivitás

### Breakpoints
| Breakpoint | Hero cím | Statisztikák | Kérdések grid |
|------------|----------|--------------|---------------|
| Desktop (1200px+) | 5rem | 4 oszlop | 2×2 |
| Tablet (768-1199px) | 3.5rem | 2×2 | 2×2 |
| Mobile (< 768px) | 2.5rem | 2×2 | 1×4 |

### Mobile Specifikus
```css
@media (max-width: 768px) {
  .heroStats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .stat {
    flex: 0 0 45%;
  }
  
  .heroCta {
    width: 100%;
  }
  
  .heroCta button {
    width: 100%;
  }
}
```

---

## Playwright Tesztek

### Fájl: `e2e/home.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Főoldal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Hero szekció megjelenik', async ({ page }) => {
    // Badge látható
    await expect(page.getByText('Neumann János Egyetem')).toBeVisible()
    
    // Cím látható
    await expect(page.getByRole('heading', { level: 1 })).toContainText('A talaj nem')
    
    // CTA gomb működik
    const ctaButton = page.getByRole('link', { name: /fedezd fel/i })
    await expect(ctaButton).toBeVisible()
    await ctaButton.click()
    await expect(page).toHaveURL('/problema')
  })

  test('Statisztikák animálódnak', async ({ page }) => {
    // Várjuk meg az animáció végét
    await page.waitForTimeout(2500)
    
    // Ellenőrizzük a végső értékeket
    await expect(page.getByText('3').first()).toBeVisible()  // Helyszín
    await expect(page.getByText('7')).toBeVisible()          // Kezelés
    await expect(page.getByText('4')).toBeVisible()          // Hónap
    await expect(page.getByText('450')).toBeVisible()        // mm víz
  })

  test('Typewriter animáció működik', async ({ page }) => {
    // Kezdetben üres
    const accent = page.locator('.titleAccent')
    
    // Várjuk meg, hogy a teljes szöveg megjelenjen
    await expect(accent).toContainText('végtelen erőforrás', { timeout: 5000 })
    
    // Kurzor villog
    const cursor = page.locator('.cursor')
    await expect(cursor).toBeVisible()
  })

  test('Kutatási kérdések kártyák navigálnak', async ({ page }) => {
    // Scroll a szekcióhoz
    await page.evaluate(() => window.scrollBy(0, window.innerHeight))
    
    // Első kártya kattintás
    const firstCard = page.getByText('Milyen hatása van az ásógépnek').locator('..')
    await firstCard.click()
    await expect(page).toHaveURL('/eredmenyek')
  })

  test('Parallax effekt működik scroll-ra', async ({ page }) => {
    const heroBg = page.locator('.heroBg')
    
    // Kezdeti pozíció
    const initialTransform = await heroBg.evaluate(el => 
      window.getComputedStyle(el).transform
    )
    
    // Scroll
    await page.evaluate(() => window.scrollBy(0, 300))
    await page.waitForTimeout(100)
    
    // Új pozíció
    const newTransform = await heroBg.evaluate(el => 
      window.getComputedStyle(el).transform
    )
    
    expect(initialTransform).not.toBe(newTransform)
  })

  test('Mobile nézet megfelelően jelenik meg', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    
    // Statisztikák 2×2 grid-ben
    const statsContainer = page.locator('.heroStats')
    await expect(statsContainer).toHaveCSS('flex-wrap', 'wrap')
    
    // CTA teljes szélességű
    const ctaButton = page.getByRole('link', { name: /fedezd fel/i })
    const buttonBox = await ctaButton.boundingBox()
    expect(buttonBox?.width).toBeGreaterThan(300)
  })

  test('Accessibility - ARIA címkék', async ({ page }) => {
    // Main content
    await expect(page.locator('main#main-content')).toBeVisible()
    
    // Navigációs link
    const ctaButton = page.getByRole('link', { name: /fedezd fel/i })
    await expect(ctaButton).toHaveAttribute('href', '/problema')
  })

  test('Performance - LCP < 2.5s', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Hero kép betöltődött
    await page.waitForSelector('.heroImage')
    
    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(2500)
  })
})
```

---

## Fájl Struktúra

```
src/
├── app/
│   └── page.tsx                      # Főoldal entry
├── components/
│   └── home/
│       ├── Hero.tsx                  # ✅ Létezik
│       ├── Hero.module.css           # ✅ Létezik
│       ├── ResearchQuestions.tsx     # 🆕 Új
│       ├── ResearchQuestions.module.css
│       └── QuestionCard.tsx          # 🆕 Új
├── animations/
│   └── pulse.json                    # 🆕 Lottie animáció
└── hooks/
    └── useParallax.ts                # ✅ Létezik
```

---

## Implementációs Prioritás

1. **Magas** - Hero szekció frissítése (statisztikák bővítése: 7 kezelés)
2. **Magas** - ResearchQuestions szekció létrehozása
3. **Közepes** - 3D tilt hover effekt a kártyákon
4. **Alacsony** - Lottie animációk a számokhoz
5. **Alacsony** - Scroll indikátor
