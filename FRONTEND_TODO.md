# Frontend Fejlesztési Terv - 3 Fázis

> Utolsó frissítés: 2025.12.05 - Fázis 2 & 3 befejezve ✅

---

## 📋 Fázis 1: Core Micro-interactions (1-2 hét)

### 1.1 MagneticButton Komponens
- [x] `MagneticButton.tsx` létrehozása `src/components/ui/`
- [x] Framer Motion `useMotionValue` + `useSpring` integráció
- [x] Mágneses követő effekt (cursor pozíció alapján)
- [x] Ripple effekt click-re
- [x] Shine sweep hover-re
- [x] Glow effekt (box-shadow animáció)
- [x] Variánsok: primary, secondary, outline, icon-only
- [x] `MagneticButton.module.css` stílusok

### 1.2 AnimatedCounter Komponens
- [x] `AnimatedNumber.tsx` (már létező) `src/components/ui/`
- [x] `useInView` hook scroll-trigger-hez
- [x] Easing: ease-out-expo
- [x] Props: `target`, `duration`, `suffix`, `prefix`, `decimals`
- [ ] Formázás (ezer elválasztó) - opcionális

### 1.3 TextReveal Komponens
- [x] `TextReveal.tsx` létrehozása `src/components/ui/`
- [x] Variánsok: `char`, `word`, `line`, `blur`
- [x] `staggerChildren` támogatás
- [x] `useInView` trigger
- [x] Highlight szín támogatás

### 1.4 Hero CTA Redesign
- [x] Hero.tsx CTA gomb cseréje MagneticButton-ra
- [x] Shine sweep effekt hozzáadása
- [x] Arrow animáció hover-re
- [x] Stats számok AnimatedCounter-re cserélése

---

## 📋 Fázis 2: Page Enhancements (2-3 hét)

### 2.1 Solution Tabs AnimatePresence
- [x] `SolutionLayout.tsx` refaktor
- [x] `AnimatePresence` + `mode="wait"` hozzáadása
- [x] Tab content fade + slide animáció
- [x] `layoutId` a tab indicator-hoz

### 2.2 Modal Spring Animation
- [x] `FieldDataModal` refaktor
- [x] Spring config: `stiffness: 300, damping: 30`
- [x] Backdrop blur animáció
- [x] Scale + opacity entrance
- [x] ARIA role és labelledby hozzáadása

### 2.3 Challenge Cards 3D Tilt
- [x] `TiltCard.tsx` komponens létrehozása
- [x] `useMotionValue` X/Y tracking
- [x] `rotateX`, `rotateY` transform
- [x] Radial gradient glow (cursor követő)
- [ ] CompactionView és PloughingView kártyák cseréje (opcionális)

### 2.4 Scroll Section Indicators
- [x] `SectionIndicator.tsx` komponens létrehozása
- [x] Active section tracking (scroll-based)
- [x] Smooth scroll navigáció
- [x] Progress bar animáció
- ⚠️ Problem page-ről eltávolítva (ütközik PageNavigation-nel)

---

## 📋 Fázis 3: Polish & Effects (1-2 hét)

### 3.1 Page Transitions
- [x] `template.tsx` entrance animáció
- [x] Route change animációk (pathname key)
- [x] Fade + slide variáns
- [x] Reduced motion támogatás
- ⚠️ Exit animáció nem támogatott Next.js App Router-ban

### 3.2 Loading States
- [x] Skeleton komponensek (már létezett)
- [x] Shimmer effekt
- [x] `OptimizedImage` blur placeholder + motion effekt
- [x] AnimatePresence placeholder eltűnéshez

### 3.3 Particle Backgrounds
- [x] `ParticleField.tsx` komponens
- [x] Canvas alapú animáció
- [x] Konfiguráció: density, speed, colors, connections
- [x] Reduced motion: statikus fallback
- [ ] Hero és Problem page integráció (opcionális)

### 3.4 Accessibility Review
- [x] `prefers-reduced-motion` minden animációnál
- [x] Focus visible stílusok (globals.css)
- [x] ARIA labels (Navigation, Modal, SectionIndicator)
- [x] `aria-current="page"` navigációban
- [x] High contrast mode támogatás
- [x] `.sr-only` utility class

---

## 🎯 Prioritás Sorrend

| # | Komponens | Hatás | Komplexitás | Státusz |
|---|-----------|-------|-------------|---------|
| 1 | AnimatedCounter | ⭐⭐⭐⭐⭐ | Alacsony | ✅ |
| 2 | MagneticButton | ⭐⭐⭐⭐⭐ | Közepes | ✅ |
| 3 | TextReveal | ⭐⭐⭐⭐ | Közepes | ✅ |
| 4 | Solution Tabs AP | ⭐⭐⭐⭐ | Alacsony | ✅ |
| 5 | TiltCard | ⭐⭐⭐ | Közepes | ✅ |
| 6 | Hero CTA | ⭐⭐⭐⭐ | Alacsony | ✅ |
| 7 | Modal Spring | ⭐⭐⭐ | Alacsony | ✅ |
| 8 | SectionIndicator | ⭐⭐⭐ | Közepes | ✅ |
| 9 | PageTransition | ⭐⭐⭐⭐ | Alacsony | ✅ |
| 10 | OptimizedImage | ⭐⭐⭐ | Közepes | ✅ |
| 11 | ParticleField | ⭐⭐ | Magas | ✅ |
| 12 | Accessibility | ⭐⭐⭐⭐⭐ | Közepes | ✅ |

---

## 📁 Új Fájlok Struktúra

```
src/
├── components/
│   └── ui/
│       ├── MagneticButton/
│       │   ├── MagneticButton.tsx
│       │   ├── MagneticButton.module.css
│       │   └── index.ts
│       ├── TextReveal/
│       │   ├── TextReveal.tsx
│       │   ├── TextReveal.module.css
│       │   └── index.ts
│       ├── TiltCard/
│       │   ├── TiltCard.tsx
│       │   ├── TiltCard.module.css
│       │   └── index.ts
│       ├── SectionIndicator/
│       │   ├── SectionIndicator.tsx
│       │   ├── SectionIndicator.module.css
│       │   └── index.ts
│       ├── ParticleField/
│       │   ├── ParticleField.tsx
│       │   ├── ParticleField.module.css
│       │   └── index.ts
│       ├── PageTransition.tsx
│       ├── OptimizedImage.tsx
│       ├── OptimizedImage.module.css
│       ├── Skeleton.tsx
│       └── Skeleton.module.css
├── hooks/
│   └── useReducedMotion.ts
└── app/
    └── template.tsx
```

---

## ✅ Elkészült

### Fázis 1
- `useReducedMotion.ts` hook
- `MagneticButton` komponens (primary, secondary, outline, ghost, icon variánsok)
- `TextReveal` komponens (char, word, line, blur, gradient típusok)
- `TiltCard` komponens (3D tilt + glow)
- Hero.tsx frissítés (MagneticButton + AnimatedNumber + TextReveal)

### Fázis 2
- SolutionLayout.tsx AnimatePresence integráció
- Tab váltás slide animáció
- layoutId tab indicator
- `FieldDataModal` spring animáció + backdrop blur
- `SectionIndicator` komponens (Problem page dots + progress)

### Fázis 3
- `PageTransition` komponens (fade, slide, scale variánsok)
- `template.tsx` route animációk
- `OptimizedImage` blur placeholder + motion effektek
- `ParticleField` canvas alapú particle rendszer
- Accessibility: focus stílusok, ARIA labels, high contrast, sr-only

---

## 📝 Megjegyzések

- Minden animáció figyelembe veszi a `prefers-reduced-motion` beállítást
- Framer Motion `useSpring` használata smooth easing-hez
- CSS változók a `globals.css`-ből konzisztens színekhez
- High contrast mode támogatás `@media (forced-colors: active)`
- Keyboard navigation tesztelve minden interaktív elemen
