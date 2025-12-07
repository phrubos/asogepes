# Weboldal Specifikáció — Áttekintés

## Oldal Struktúra

| # | Oldal | Útvonal | Státusz | Prioritás |
|---|-------|---------|---------|-----------|
| 1 | [Főoldal](./01-fooldal.md) | `/` | ✅ Létezik | Frissítés |
| 2 | [Probléma](./02-problema.md) | `/problema` | ✅ Létezik | Finomhangolás |
| 3 | [Technológia](./03-technologia.md) | `/technologia` | 🔄 Átnevezés | `/megoldas` → `/technologia` |
| 4 | [Kutatás](./04-kutatas.md) | `/kutatas` | 🔄 Átnevezés | `/kiserlet` → `/kutatas` |
| 5 | [Eredmények](./05-eredmenyek.md) | `/eredmenyek` | ✅ Létezik | Bővítés |

---

## Navigáció Frissítés

```typescript
// Navigation.tsx - navItems frissítése
const navItems = [
  { href: '/', label: 'Főoldal' },
  { href: '/problema', label: 'Probléma' },
  { href: '/technologia', label: 'Technológia' },  // volt: /megoldas
  { href: '/kutatas', label: 'Kutatás' },          // volt: /kiserlet
  { href: '/eredmenyek', label: 'Eredmények' },
]
```

---

## Közös Komponensek

### UI Komponensek (már léteznek)
| Komponens | Fájl | Használat |
|-----------|------|-----------|
| `AnimatedNumber` | `ui/AnimatedNumber.tsx` | Számok count-up animáció |
| `MagneticButton` | `ui/MagneticButton.tsx` | CTA gombok |
| `SectionHeader` | `ui/SectionHeader.tsx` | Szekció fejlécek |
| `TextReveal` | `ui/TextReveal.tsx` | Szöveg reveal animáció |

### Új Közös Komponensek
| Komponens | Használat | Oldalak |
|-----------|-----------|---------|
| `BeforeAfterSlider` | Kép összehasonlítás | Eredmények |
| `ImageLightbox` | Galéria modal | Kutatás, Eredmények |
| `Accordion` | Expand/collapse tartalom | Eredmények |
| `Tooltip` | Hover információk | Technológia, Eredmények |
| `ProgressBar` | Vizuális progress | Technológia |

---

## Animációs Könyvtár

### Framer Motion Patterns

```typescript
// 1. Staggered Entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

// 2. Scroll-triggered
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
/>

// 3. Tab/Content Switch
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  />
</AnimatePresence>

// 4. Hover Micro-interactions
whileHover={{ 
  y: -8, 
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  transition: { duration: 0.3 }
}}

// 5. Layout Animation (pill indicator)
<motion.div
  layoutId="activeIndicator"
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
/>
```

### Lottie Animációk

| Animáció | Fájl | Használat |
|----------|------|-----------|
| `spade-working.json` | Ásógép működés | Technológia |
| `soil-layers.json` | Talajrétegek | Eredmények |
| `temperature.json` | Hőmérséklet | Eredmények |
| `water-flow.json` | Vízáramlás | Eredmények |
| `plant-growth.json` | Növénynövekedés | Eredmények |
| `penetrometer.json` | Penetrométer | Kutatás |
| `drone.json` | Drón | Kutatás |
| `pulse.json` | Általános pulse | Több helyen |

### CSS Animációk

```css
/* Pulse effect */
@keyframes pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(212, 168, 75, 0.4);
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(212, 168, 75, 0);
  }
}

/* Floating */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Gradient shift */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## Playwright Teszt Struktúra

```
e2e/
├── home.spec.ts          # Főoldal tesztek
├── problema.spec.ts      # Probléma oldal tesztek
├── technologia.spec.ts   # Technológia oldal tesztek
├── kutatas.spec.ts       # Kutatás oldal tesztek
├── eredmenyek.spec.ts    # Eredmények oldal tesztek
├── navigation.spec.ts    # Navigáció tesztek (cross-page)
├── accessibility.spec.ts # A11y tesztek (minden oldal)
└── performance.spec.ts   # Performance tesztek
```

### Teszt Kategóriák (minden oldalon)

1. **Betöltés** - Oldal betöltődik, fő elemek láthatók
2. **Interakciók** - Kattintások, hover, drag működnek
3. **Animációk** - Framer Motion animációk lefutnak
4. **Navigáció** - CTA-k, linkek működnek
5. **Reszponzivitás** - Mobile/Tablet nézetek
6. **Accessibility** - Keyboard nav, ARIA labels

### Közös Test Utilities

```typescript
// e2e/utils/test-helpers.ts

export async function waitForAnimation(page: Page, selector: string, timeout = 1000) {
  await page.locator(selector).waitFor({ state: 'visible' })
  await page.waitForTimeout(timeout)
}

export async function checkHoverEffect(page: Page, selector: string) {
  const element = page.locator(selector)
  const beforeTransform = await element.evaluate(el => 
    window.getComputedStyle(el).transform
  )
  
  await element.hover()
  await page.waitForTimeout(300)
  
  const afterTransform = await element.evaluate(el => 
    window.getComputedStyle(el).transform
  )
  
  return beforeTransform !== afterTransform
}

export async function testScrollAnimation(page: Page, triggerSelector: string, animatedSelector: string) {
  await page.locator(triggerSelector).scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  
  const element = page.locator(animatedSelector)
  const opacity = await element.evaluate(el => 
    window.getComputedStyle(el).opacity
  )
  
  return parseFloat(opacity) === 1
}
```

---

## Implementációs Sorrend

### Fázis 1: Struktúra (1-2 nap)
- [ ] Útvonalak átnevezése (`/megoldas` → `/technologia`, `/kiserlet` → `/kutatas`)
- [ ] Navigáció frissítése
- [ ] Alap layout komponensek

### Fázis 2: Főoldal (1 nap)
- [ ] Hero frissítés (új statisztikák)
- [ ] ResearchQuestions szekció
- [ ] 3D tilt kártyák

### Fázis 3: Probléma (1 nap)
- [ ] InteractiveSoil fejlesztés
- [ ] SoilComparison animáció
- [ ] Floating nav finomhangolás

### Fázis 4: Technológia (2 nap)
- [ ] Működési elv szekció + Lottie
- [ ] Összehasonlító táblázat
- [ ] Alkalmazási módok kártyák
- [ ] Műszaki rajz modal

### Fázis 5: Kutatás (2 nap)
- [ ] Interaktív térkép
- [ ] Parcella selector
- [ ] Bar chart fejlesztés
- [ ] Timeline animáció
- [ ] Mérési módszer kártyák

### Fázis 6: Eredmények (2 nap)
- [ ] Finding kártyák + Lottie
- [ ] Interaktív táblázat
- [ ] Before/After slider
- [ ] Galéria lightbox
- [ ] Kutatási kérdések accordion
- [ ] Ajánlások kártyák

### Fázis 7: Tesztelés (1-2 nap)
- [ ] Playwright tesztek írása
- [ ] Cross-browser tesztelés
- [ ] Mobile tesztelés
- [ ] Performance audit

### Fázis 8: Polish (1 nap)
- [ ] Lottie animációk finomhangolása
- [ ] Micro-interakciók
- [ ] Loading states
- [ ] Error states

---

## Design Rendszer Referencia

### Színek
```css
:root {
  /* Primary */
  --color-primary: #1a1a1a;
  --color-accent: #D4A84B;
  
  /* Text */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-light: #FFFFFF;
  
  /* Background */
  --bg-light: #F8F7F4;
  --bg-dark: #0d0d0d;
  
  /* Status */
  --color-success: #22C55E;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
}
```

### Tipográfia
```css
:root {
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Playfair Display', serif;
  
  /* Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;
  --text-5xl: 3.5rem;
}
```

### Spacing
```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-8: 3rem;
  --space-10: 4rem;
  --space-12: 6rem;
}
```

### Breakpoints
```css
/* Mobile first */
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

---

## Összefoglalás

Ez a specifikáció 5 oldal teljes újragondolását tartalmazza:

1. **Főoldal** - Hook + kutatási kérdések kártyák
2. **Probléma** - Interaktív talajszelvény + floating tabs
3. **Technológia** - Működési elv + 3D folder nav + modellek
4. **Kutatás** - Térkép + helyszínek + mérési módszerek + timeline
5. **Eredmények** - Megállapítások + táblázat + drónképek + következtetések

Minden oldalon:
- Framer Motion animációk
- Lottie mikro-animációk
- Hover interakciók
- Scroll-triggered effects
- Reszponzív design
- Playwright tesztek
