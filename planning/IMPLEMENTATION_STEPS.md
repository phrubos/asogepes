# ÁSÓGÉP WEBAPP - Implementációs Lépések

**Frissítve:** 2025-01-03
**Kapcsolódó dokumentumok:**
- `REDESIGN_PLAN.md` - Átfogó terv
- `DESIGN_SYSTEM.md` - Design specifikációk

---

## FÁZIS 1: NAVIGÁCIÓ JAVÍTÁSA

### 1.1 Scrolled háttér javítása
**Fájl:** `src/components/layout/Navigation.module.css`

**Jelenlegi probléma:**
```css
/* Gradiens háttér nem elég kontrasztos */
.header::before {
  background: linear-gradient(
    to bottom,
    rgba(45, 37, 30, 0.98) 0%,
    rgba(45, 37, 30, 0.9) 70%,
    rgba(45, 37, 30, 0) 100%
  );
}
```

**Javítás:**
```css
.header::before {
  background: var(--color-earth-900);
  /* Solid háttér a jobb kontrasztért */
}

.header.scrolled::before {
  opacity: 1;
}

/* Pill háttér is sötétebb */
.header.scrolled .nav {
  background: rgba(26, 22, 18, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

**Tesztelés:**
- [ ] Scroll down/up minden oldalon
- [ ] Link szöveg olvasható scrolled állapotban
- [ ] Indicator (arany pill) látható

---

### 1.2 onDark osztály eltávolítása
**Fájl:** `src/components/layout/Navigation.tsx`

**Jelenlegi:**
```tsx
const isDarkPage = true
// ...
className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${isDarkPage ? styles.onDark : ''}`}
```

**Javítás:**
Mivel minden oldal dark, az `onDark` logika egyszerűsíthető. A stílusok legyenek alapértelmezetten dark-ra optimalizálva.

```tsx
// Egyszerűsített className
className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
```

Majd a CSS-ben az alapértelmezett stílusok legyenek világos szövegűek.

---

## FÁZIS 2: EGYSÉGES KOMPONENSEK

### 2.1 PageBadge komponens létrehozása
**Új fájl:** `src/components/ui/PageBadge/PageBadge.tsx`

```tsx
'use client'

import styles from './PageBadge.module.css'

interface PageBadgeProps {
  number: string;  // "01", "02", "03", "04"
  label: string;   // "FŐOLDAL", "A PROBLÉMA", stb.
}

export default function PageBadge({ number, label }: PageBadgeProps) {
  return (
    <div className={styles.badge}>
      <span className={styles.number}>{number}</span>
      <span className={styles.divider} />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
```

**Új fájl:** `src/components/ui/PageBadge/PageBadge.module.css`

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(212, 168, 75, 0.1);
  border: 1px solid rgba(212, 168, 75, 0.3);
  border-radius: 100px;
  margin-bottom: var(--space-lg);
}

.number {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gold);
  letter-spacing: 0.1em;
}

.divider {
  width: 4px;
  height: 4px;
  background: var(--color-gold);
  border-radius: 50%;
  opacity: 0.5;
}

.label {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

**Index fájl:** `src/components/ui/PageBadge/index.ts`
```ts
export { default } from './PageBadge'
```

---

### 2.2 SectionBadge komponens létrehozása
**Új fájl:** `src/components/ui/SectionBadge/SectionBadge.tsx`

```tsx
'use client'

import styles from './SectionBadge.module.css'

interface SectionBadgeProps {
  roman: string;  // "I", "II", "III", "IV"
  label?: string; // Opcionális label
}

export default function SectionBadge({ roman, label }: SectionBadgeProps) {
  return (
    <div className={styles.badge}>
      <span className={styles.roman}>{roman}.</span>
      {label && (
        <>
          <span className={styles.divider} />
          <span className={styles.label}>{label}</span>
        </>
      )}
    </div>
  )
}
```

**Új fájl:** `src/components/ui/SectionBadge/SectionBadge.module.css`

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin-bottom: var(--space-md);
}

.roman {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gold);
  min-width: 32px;
}

.divider {
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, var(--color-gold), transparent);
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

---

### 2.3 Meglévő SectionHeader frissítése
**Fájl:** `src/components/ui/SectionHeader.tsx`

Módosítás: A `number` prop fogadjon római számot is, vagy új `roman` prop.

---

## FÁZIS 3: FŐOLDAL (01)

### 3.1 Badge hozzáadása
**Fájl:** `src/components/home/Hero.tsx`

```tsx
import PageBadge from '@/components/ui/PageBadge'

// A heroBadge helyett:
<PageBadge number="01" label="FŐOLDAL" />
```

### 3.2 Meglévő layout megtartása
A főoldal hero jól működik, csak a badge cseréje szükséges.

---

## FÁZIS 4: PROBLÉMA OLDAL (02)

### 4.1 SoilHeroInteractive átstrukturálás
**Fájl:** `src/components/problem/SoilHeroInteractive/SoilHeroInteractive.tsx`

**Jelenlegi layout:**
```
[Szöveg] | [Talajszelvény] | [Navigáció]
```

**Új layout:**
```
          [Badge + Cím]
[Szöveg]              [Talajszelvény]
     [Navigációs gombok sorban]
```

**Változtatások:**
1. 3 oszlop → 2 oszlop
2. Navigáció az aljára kerül
3. Tartalomszélesség csökkentése

**Fájl:** `src/components/problem/SoilHeroInteractive/SoilHeroInteractive.module.css`

```css
/* Új grid layout */
.contentGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
}

/* Badge és cím - teljes szélesség */
.headerRow {
  grid-column: 1 / -1;
  text-align: center;
}

/* Navigáció alul */
.navRow {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
}
```

### 4.2 Szekciók római számozása
**Fájlok:**
- `src/components/problem/CompactionContent.tsx` (vagy megfelelő)
- `src/components/problem/CultivatorView.tsx`
- `src/components/problem/PloughingContent.tsx`

Mindegyikhez:
```tsx
import SectionBadge from '@/components/ui/SectionBadge'

<SectionBadge roman="I" label="Öntözés okozta tömörödés" />
// stb.
```

---

## FÁZIS 5: TECHNOLÓGIA OLDAL (03)

### 5.1 HubFolder egyszerűsítése
**Probléma:** A HubFolder 580px min-height, túl nagy a hero-hoz

**Megoldás A:** HubFolder méretének csökkentése
```css
.hubScene {
  min-height: 400px; /* 580px helyett */
  padding: 1rem 2rem; /* kisebb padding */
}

.hubFolder {
  width: 220px;  /* 280px helyett */
  height: 320px; /* 400px helyett */
}
```

**Megoldás B:** HubFolder cseréje egyszerűbb kártyákra
Új `NavigationCards` komponens:
```tsx
// 3 egyszerű kártya egymás mellett
<div className={styles.navCards}>
  <NavCard roman="I" title="Működési elv" onClick={scrollToOperation} />
  <NavCard roman="II" title="Modellek" onClick={scrollToModels} />
  <NavCard roman="III" title="Alkalmazás" onClick={scrollToGuide} />
</div>
```

### 5.2 Header layout javítása
**Fájl:** `src/components/solution-v2/SolutionNew.module.css`

```css
.header {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 5% 80px;
  gap: var(--space-3xl);
}

/* Tartalom középre */
.headerContent {
  max-width: 700px;
  text-align: center;
}
```

### 5.3 Szekciók római számozása
Módosítandó komponensek:
- `OperationPrinciple.tsx` → I. jelölés
- Model tabs → II. jelölés
- `ApplicationGuide.tsx` → III. jelölés

---

## FÁZIS 6: KUTATÁS OLDAL (04)

### 6.1 Hero arányok javítása
**Fájl:** `src/components/experiment/ResearchHero/ResearchHero.module.css`

```css
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Egyenlő arányok */
  gap: 3rem;
  align-items: center;
  padding: 120px 5% 80px;
}

/* Térkép méret korlátozása */
.heroMap {
  max-width: 450px;
  max-height: 400px;
  margin: 0 auto;
}
```

### 6.2 Szekciók római számozása
**Fájl:** `src/components/experiment/LocationSection/LocationSection.tsx`

```tsx
// Location index → római szám konverzió
const romanNumerals = ['I', 'II', 'III', 'IV']

<SectionBadge 
  roman={romanNumerals[index]} 
  label={data.name} 
/>
```

---

## FÁZIS 7: VÉGSŐ ELLENŐRZÉS

### 7.1 Checklist minden oldalra

**Főoldal (01):**
- [ ] Badge: "01 · FŐOLDAL"
- [ ] Hero elfér 100vh-ban
- [ ] Navigáció olvasható scrolled állapotban
- [ ] ResearchQuestions szekció rendben

**Probléma (02):**
- [ ] Badge: "02 · A PROBLÉMA"
- [ ] Hero 2 oszlopos layout
- [ ] Talajszelvény nem lóg ki
- [ ] Navigációs gombok alul
- [ ] Szekciók: I, II, III jelölés

**Technológia (03):**
- [ ] Badge: "03 · A TECHNOLÓGIA"
- [ ] Navigációs kártyák elférnek
- [ ] Központosított layout
- [ ] Szekciók: I, II, III jelölés

**Kutatás (04):**
- [ ] Badge: "04 · A KUTATÁS"
- [ ] Térkép megfelelő méretű
- [ ] Grid arányok rendben
- [ ] Szekciók: I, II, III, IV jelölés

### 7.2 Responsive tesztelés

| Képernyő | Szélesség | Tesztelendő |
|----------|-----------|-------------|
| Desktop XL | 1920px | Túl sok whitespace? |
| Desktop | 1440px | Alapvető layout |
| Laptop | 1280px | Grid törések |
| Tablet L | 1024px | 2 oszlop → 1 oszlop |
| Tablet P | 768px | Kártyák mérete |
| Mobile | 375px | Minden olvasható? |

### 7.3 Kontraszt ellenőrzés
- [ ] Navigáció szöveg scrolled állapotban
- [ ] Badge szövegek
- [ ] Kártya szövegek
- [ ] Gombok és linkek

---

## PRIORITÁS ÉS IDŐBECSLÉS

| Fázis | Prioritás | Becsült idő |
|-------|-----------|-------------|
| 1. Navigáció | KRITIKUS | 30 perc |
| 2. Komponensek | MAGAS | 1 óra |
| 3. Főoldal | KÖZEPES | 15 perc |
| 4. Probléma | MAGAS | 1.5 óra |
| 5. Technológia | MAGAS | 1.5 óra |
| 6. Kutatás | KÖZEPES | 1 óra |
| 7. Ellenőrzés | KÖZEPES | 30 perc |

**Összesen:** ~6 óra

---

## KÖVETKEZŐ LÉPÉS

Kezdd a **Fázis 1: Navigáció javítása** feladattal, mivel ez a legkritikusabb probléma és gyorsan megoldható.

