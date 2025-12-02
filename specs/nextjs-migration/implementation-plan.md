# Next.js Migráció - Implementációs Terv

## Fázis 1: Projekt inicializálás

### 1.1 Next.js projekt létrehozása
- [x] Package.json létrehozása Next.js 14 függőségekkel
- [x] TypeScript konfiguráció (tsconfig.json)
- [x] Next.js konfiguráció (next.config.js)
- [x] Framer Motion és Lucide React telepítése

### 1.2 Mappastruktúra
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── problema/page.tsx
│   ├── megoldas/page.tsx
│   ├── kiserlet/page.tsx
│   └── eredmenyek/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── Navigation.module.css
│   │   ├── Footer.tsx
│   │   └── Footer.module.css
│   ├── ui/
│   │   ├── SectionHeader.tsx
│   │   └── SectionHeader.module.css
│   ├── home/
│   │   ├── Hero.tsx
│   │   └── Hero.module.css
│   ├── problem/
│   │   ├── SoilInfographic.tsx
│   │   ├── SoilInfographic.module.css
│   │   ├── ConsequenceCard.tsx
│   │   └── Problem.module.css
│   ├── solution/
│   │   ├── MachineShowcase.tsx
│   │   ├── BenefitCard.tsx
│   │   ├── TypeCard.tsx
│   │   └── Solution.module.css
│   ├── experiment/
│   │   ├── LocationTabs.tsx
│   │   ├── LocationContent.tsx
│   │   ├── TreatmentComparison.tsx
│   │   ├── BarChart.tsx
│   │   ├── ParcelTable.tsx
│   │   └── Experiment.module.css
│   └── results/
│       ├── FindingCard.tsx
│       ├── ComparisonVisual.tsx
│       └── Results.module.css
├── hooks/
│   └── useScrollAnimation.ts
└── lib/
    └── data.ts
```

---

## Fázis 2: CSS migráció

### 2.1 Globális CSS (`src/app/globals.css`)
- [x] CSS változók átvitele `:root`-ba (styles.css:7-53)
- [x] Reset és alap stílusok (styles.css:55-116)
- [x] Typography alap stílusok
- [x] Keyframe animációk:
  - [x] `fadeInUp`
  - [x] `bounce`
  - [x] `fadeIn`
  - [x] `growBar`
  - [x] `growBarHorizontal`

### 2.2 CSS Modules
- [x] Navigation.module.css (styles.css:118-173)
- [x] Hero.module.css (styles.css:175-330)
- [x] SectionHeader.module.css (styles.css:332-360)
- [x] Problem.module.css (styles.css:362-795)
- [x] Solution.module.css (styles.css:797-1020)
- [x] Experiment.module.css (styles.css:1022-1576)
- [x] Results.module.css (styles.css:1578-1716)
- [x] Footer.module.css (styles.css:1718-1777)

---

## Fázis 3: Layout komponensek

### 3.1 Root Layout (`src/app/layout.tsx`)
- [x] Google Fonts beállítása (Fraunces + Inter)
- [x] Font CSS változók
- [x] Navigation komponens beágyazása
- [x] Footer komponens beágyazása
- [x] Metadata konfiguráció

### 3.2 Navigation komponens
- [x] Logo link főoldalra
- [x] Next.js Link komponensek minden menüponthoz
- [x] `usePathname()` aktív oldal jelzésére
- [x] Scroll-based `.scrolled` class
- [ ] Mobil reszponzív kezelés

### 3.3 Footer komponens
- [x] Egyetem logo és név
- [x] Cég logo és név
- [x] Kutatói credits
- [x] Év megjelenítés

---

## Fázis 4: Oldal implementáció

### 4.1 Főoldal (`src/app/page.tsx`)
- [x] Hero komponens
  - [x] Háttér (grain texture + gradient)
  - [x] Badge (egyetem + cég + év)
  - [x] Kétsoros cím
  - [x] Alcím
  - [x] Statisztikák (3 szám)
- [ ] Opcionális: navigációs kártyák a többi oldalhoz

### 4.2 Probléma oldal (`src/app/problema/page.tsx`)
- [x] SectionHeader: "01" / "A Probléma"
- [x] Problem grid layout
  - [x] Bal oldal: idézet + magyarázó szöveg
  - [x] Jobb oldal: SoilInfographic
- [x] SoilInfographic komponens (inputs/soilgraph.tsx alapján)
  - [x] Toggle gomb
  - [x] Animált rétegek
  - [x] Eketalp megjelenítés
  - [x] Gyökér overlay
- [x] Következmények szekció
  - [x] 4 ConsequenceCard komponens

### 4.3 Megoldás oldal (`src/app/megoldas/page.tsx`)
- [x] Sötét háttér beállítás
- [x] SectionHeader: "02" / "A Megoldás" (light variant)
- [x] Bevezető szekció
  - [x] Headline: "Lazítás forgatás nélkül"
  - [x] Leírás szöveg
- [x] MachineShowcase komponens
  - [x] Kép placeholder
  - [x] Rotor diagram (első + hátsó)
- [x] Benefits grid (4 BenefitCard)
- [x] Machine types grid (3 TypeCard: 38SX, 38WX, 40SX)

### 4.4 Kísérlet oldal (`src/app/kiserlet/page.tsx`)
- [x] SectionHeader: "03" / "A Kísérlet"
- [x] Bevezető bekezdés
- [x] LocationTabs komponens (client component)
  - [x] 3 tab gomb
  - [x] useState az aktív tab-hoz
- [x] Szentkirály LocationContent
  - [x] Header (térkép + info grid)
  - [x] TreatmentComparison
  - [x] BarChart (4 hónap adatai)
  - [x] Highlight szekció
- [x] Kecskemét LocationContent
  - [x] Header (térkép + info grid)
  - [x] TreatmentComparison
  - [x] BarChart (2 hónap adatai)
  - [x] Result callout (10 cm különbség)
  - [x] Highlight szekció
- [x] Lakitelek LocationContent
  - [x] Header (térkép + info grid)
  - [x] ParcelTable (7 parcella)
  - [x] HorizontalBarChart (multi-row)

### 4.5 Eredmények oldal (`src/app/eredmenyek/page.tsx`)
- [x] Sötét háttér beállítás
- [x] SectionHeader: "04" / "Eredmények" (light variant)
- [x] Key findings grid
  - [x] 4 FindingCard komponens
- [x] ComparisonVisual
  - [x] Két kép placeholder
  - [x] VS divider
- [x] Conclusion szekció
  - [x] Idézet
  - [x] Összefoglaló szöveg

---

## Fázis 5: Interaktivitás

### 5.1 Custom hooks
- [x] `useScrollAnimation` hook
  - [x] IntersectionObserver
  - [x] isVisible state
  - [x] ref visszaadása

### 5.2 Animációk
- [x] Framer Motion page transitions
- [x] Chart bar animációk (staggered)
- [x] Card fade-in animációk
- [x] SoilInfographic layer swap animáció

### 5.3 Adatok kiszervezése (`src/lib/data.ts`)
- [x] Location adatok (Szentkirály, Kecskemét, Lakitelek)
- [x] Chart adatok
- [x] Parcella táblázat adatok
- [x] Finding szövegek

---

## Fázis 6: Befejezés

### 6.1 Reszponzív tesztelés
- [ ] Desktop nézet (1200px+)
- [ ] Tablet nézet (1024px)
- [ ] Mobil nézet (768px)
- [ ] Kis mobil (480px)

### 6.2 Optimalizáció
- [ ] Metadata minden oldalon
- [ ] next/image használata (ha vannak képek)
- [ ] Build teszt: `npm run build`

### 6.3 Takarítás
- [ ] Régi fájlok archiválása vagy törlése
  - [ ] index.html
  - [ ] styles.css
  - [ ] script.js
- [ ] README.md frissítése

---

## Kritikus fájlok referencia

| Forrás fájl | Sorszámok | Cél |
|-------------|-----------|-----|
| `styles.css` | 7-53 | CSS változók -> globals.css |
| `styles.css` | 118-173 | Navigation stílusok |
| `styles.css` | 175-330 | Hero stílusok |
| `styles.css` | 362-795 | Problem szekció stílusok |
| `styles.css` | 797-1020 | Solution szekció stílusok |
| `styles.css` | 1022-1576 | Experiment szekció stílusok |
| `styles.css` | 1578-1716 | Results szekció stílusok |
| `inputs/soilgraph.tsx` | teljes | SoilInfographic komponens alap |
| `index.html` | 29-68 | Hero HTML struktúra |
| `index.html` | 70-208 | Problem szekció struktúra |
| `index.html` | 210-305 | Solution szekció struktúra |
| `index.html` | 307-747 | Experiment szekció + adatok |
| `index.html` | 749-817 | Results szekció struktúra |
| `script.js` | 18-41 | Tab váltás logika |
| `script.js` | 152-170 | Chart animáció logika |
| `script.js` | 241-286 | Soil infographic logika |

---

## Függőségek

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.2.0"
  }
}
```
