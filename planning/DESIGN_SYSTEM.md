# ÁSÓGÉP WEBAPP - Design System Specifikáció

**Verzió:** 2.0
**Frissítve:** 2025-01-03

---

## 1. OLDALAK SZÁMOZÁSA

### Arab számok az oldalakhoz
| Szám | Oldal | Route | Badge szöveg |
|------|-------|-------|--------------|
| 01 | Főoldal | `/` | `01 · FŐOLDAL` |
| 02 | Probléma | `/problema` | `02 · A PROBLÉMA` |
| 03 | Technológia | `/technologia` | `03 · A TECHNOLÓGIA` |
| 04 | Kutatás | `/kutatas` | `04 · A KUTATÁS` |

### Római számok a szekciókhoz

#### Probléma oldal (02) szekciói:
| Szám | Szekció | ID |
|------|---------|-----|
| I. | Öntözés okozta tömörödés | `#compaction` |
| II. | Nehézkultivátor korlátai | `#cultivator` |
| III. | Szántás korlátai | `#ploughing` |

#### Technológia oldal (03) szekciói:
| Szám | Szekció | ID |
|------|---------|-----|
| I. | Működési elv | `#operation-principle` |
| II. | Modell választék | `#content-area` |
| III. | Alkalmazási útmutató | `#application-guide` |

#### Kutatás oldal (04) szekciói:
| Szám | Szekció | ID |
|------|---------|-----|
| I. | Penetrometria info | `#penetrometria` |
| II. | Szentkirály | `#location-szentkiraly` |
| III. | Kecskemét | `#location-kecskemet` |
| IV. | Lakitelek | `#location-lakitelek` |

---

## 2. BADGE KOMPONENSEK

### 2.1 Oldal Badge (PageBadge)
```tsx
// Használat: <PageBadge number="02" label="A PROBLÉMA" />

interface PageBadgeProps {
  number: string;  // "01", "02", stb.
  label: string;   // "FŐOLDAL", "A PROBLÉMA", stb.
}
```

**CSS:**
```css
.pageBadge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(212, 168, 75, 0.1);
  border: 1px solid rgba(212, 168, 75, 0.3);
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-lg);
}

.pageBadgeNumber {
  font-weight: 700;
}

.pageBadgeDivider {
  width: 4px;
  height: 4px;
  background: var(--color-gold);
  border-radius: 50%;
  opacity: 0.5;
}
```

### 2.2 Szekció Badge (SectionBadge)
```tsx
// Használat: <SectionBadge roman="I" title="Öntözés okozta tömörödés" />

interface SectionBadgeProps {
  roman: string;  // "I", "II", "III", stb.
  title: string;
}
```

**CSS:**
```css
.sectionBadge {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  margin-bottom: var(--space-md);
}

.sectionRoman {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-gold);
  min-width: 32px;
}

.sectionDivider {
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, var(--color-gold), transparent);
}

.sectionLabel {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

---

## 3. TIPOGRÁFIA

### 3.1 Címek

| Típus | Font | Méret | Súly | Szín |
|-------|------|-------|------|------|
| Page Title (H1) | Fraunces | clamp(2.5rem, 5vw, 4rem) | 800 | white |
| Section Title (H2) | Fraunces | clamp(1.75rem, 3.5vw, 2.5rem) | 700 | white |
| Subsection (H3) | Fraunces | clamp(1.25rem, 2.5vw, 1.75rem) | 600 | white |
| Card Title (H4) | Fraunces | 1.125rem | 600 | white |

### 3.2 Szövegtörzsek

| Típus | Font | Méret | Szín |
|-------|------|-------|------|
| Lead / Subtitle | Inter | 1.125rem | rgba(255,255,255,0.85) |
| Body | Inter | 1rem | rgba(255,255,255,0.7) |
| Small | Inter | 0.875rem | rgba(255,255,255,0.6) |
| Caption | Inter | 0.75rem | rgba(255,255,255,0.5) |

### 3.3 Speciális

| Típus | Font | Méret | Szín |
|-------|------|-------|------|
| Badge Text | Monospace | 0.8125rem | gold |
| Statisztika szám | Fraunces | 2.5rem - 3rem | white |
| Statisztika label | Inter | 0.875rem | gold |

---

## 4. SZÍNEK

### 4.1 Háttér színek
```css
--bg-page: #2D251E;          /* var(--color-earth-800) */
--bg-card: rgba(26, 23, 20, 0.8);
--bg-card-hover: rgba(35, 30, 25, 0.9);
--bg-overlay: rgba(0, 0, 0, 0.5);
```

### 4.2 Szöveg színek
```css
--text-primary: #FDFCFA;     /* var(--color-white) */
--text-secondary: rgba(255, 255, 255, 0.85);
--text-muted: rgba(255, 255, 255, 0.7);
--text-subtle: rgba(255, 255, 255, 0.5);
```

### 4.3 Akcentus színek
```css
--accent-gold: #D4A84B;      /* var(--color-gold) */
--accent-gold-light: #E8C87A;
--accent-gold-subtle: rgba(212, 168, 75, 0.1);
--accent-gold-border: rgba(212, 168, 75, 0.3);
```

### 4.4 Kontraszt követelmények
- Szöveg / háttér: minimum 4.5:1 (WCAG AA)
- Nagy szöveg (18px+): minimum 3:1
- Interaktív elemek: minimum 3:1

---

## 5. TÉRKÖZÖK

### 5.1 Alap térközök
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
--space-4xl: 6rem;     /* 96px */
--space-5xl: 8rem;     /* 128px */
```

### 5.2 Hero térközök
```css
--hero-padding-top: 120px;      /* Header + extra space */
--hero-padding-bottom: 80px;
--hero-padding-x: 5%;           /* Responsive side padding */
```

### 5.3 Szekció térközök
```css
--section-padding-y: var(--space-4xl);  /* 96px */
--section-gap: var(--space-3xl);        /* 64px */
```

---

## 6. HERO LAYOUT SPECIFIKÁCIÓK

### 6.1 Általános Hero
```css
.hero {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--hero-padding-top) var(--hero-padding-x) var(--hero-padding-bottom);
  position: relative;
  overflow: hidden;
}

.heroContent {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
```

### 6.2 Hero Grid variánsok

**Centered (alapértelmezett):**
```css
.heroContentCentered {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

**Split (szöveg + vizualizáció):**
```css
.heroContentSplit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 1023px) {
  .heroContentSplit {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

**Asymmetric (főoldal stílus):**
```css
.heroContentAsymmetric {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
}
```

---

## 7. KÁRTYA STÍLUSOK

### 7.1 Alap kártya
```css
.card {
  background: linear-gradient(135deg, rgba(26, 23, 20, 0.8), rgba(35, 30, 25, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: var(--space-xl);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: rgba(212, 168, 75, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

### 7.2 Navigációs kártya (Hero-ban)
```css
.navCard {
  background: linear-gradient(135deg, rgba(26, 23, 20, 0.9), rgba(35, 30, 25, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--space-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 280px;
  max-height: 300px;
}

.navCard:hover {
  border-color: var(--color-gold);
  transform: translateY(-8px);
}
```

---

## 8. NAVIGÁCIÓ SPECIFIKÁCIÓ

### 8.1 Állapotok
```css
/* Alapállapot (hero tetején) */
.header {
  background: transparent;
}

/* Scrolled állapot */
.header.scrolled {
  background: var(--color-earth-900);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 8.2 Link stílusok
```css
.navLink {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 8px 16px;
  transition: color 0.2s ease;
}

.navLink:hover,
.navLink.active {
  color: var(--color-white);
}

/* Aktív indikátor */
.navIndicator {
  background: var(--color-gold);
  border-radius: 100px;
}
```

---

## 9. ANIMÁCIÓK

### 9.1 Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease forwards;
}
```

### 9.2 Stagger delay-ek
```css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

### 9.3 Hover transitions
```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;
```

---

## 10. RESPONSIVE TÖRÉSPONTOK

| Név | Min | Max | Használat |
|-----|-----|-----|-----------|
| Desktop XL | 1400px | - | Extra wide layouts |
| Desktop | 1024px | 1399px | Standard desktop |
| Tablet | 768px | 1023px | Tablet landscape/portrait |
| Mobile | 480px | 767px | Smartphones |
| Mobile SM | - | 479px | Small phones |

### Használat:
```css
/* Mobile first approach */
.element { /* mobile styles */ }

@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1400px) { /* desktop xl */ }
```

---

## 11. KOMPONENS MÉRETEK

### 11.1 Maximum szélességek
| Elem | Max-width |
|------|-----------|
| Container | 1400px |
| Hero content | 1200px |
| Text block | 800px |
| Card grid | 1200px |
| Single card | 400px |

### 11.2 Minimum magasságok
| Elem | Min-height |
|------|------------|
| Hero | 100vh |
| Section | 400px |
| Card | 200px |
| Nav card | 250px |

---

## MEGJEGYZÉSEK

- Ez a dokumentum a design rendszer alapja
- Minden új komponens ezeket a szabályokat kövesse
- Változtatás előtt konzultálni kell a tervvel
- A színek és méretek CSS változókként használandók

