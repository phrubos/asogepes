# Megoldás Oldal Átalakítás - Modell-Alapú Szekciók

## Összefoglaló

A Megoldás oldalt 3 modell-alapú szekcióra bontjuk át a szakdolgozat alapján. Minden szekció tartalmazza a műszaki adatokat **ÉS** a konkrét felhasználási helyszínt/eredményeket.

---

## A 3 Modell és Alkalmazási Területük

| Modell | Típus | Munkamélység | Helyszín | Kultúra |
|--------|-------|--------------|----------|---------|
| **38SX** | Nagy szériás | 15-35 cm | Lakitelek (III., VII. parcella) | Ipari paradicsom |
| **38WX** | Lazítókéses | 35 cm + 55 cm lazítás | Szentkirály | Vöröshagyma |
| **40SX** | Mélyásógép | 20-50 cm | Kecskemét-Borbás, Lakitelek (I.) | Ipari paradicsom |

---

## Jelenlegi Oldal Struktúra

```
SolutionLayout
├── Hero Header
│   ├── Section Header ("02 A Megoldás")
│   ├── Main Title ("Lazítás forgatás nélkül")
│   ├── Subtitle
│   └── Nav Buttons (2 db)
│       ├── "Technológiai Előnyök" → #tech-benefits
│       └── "Modellválaszték" → #model-range
│
├── Content Wrapper
│   ├── #tech-benefits
│   │   ├── MachineBlueprint
│   │   └── BenefitsGrid
│   │
│   └── #model-range
│       └── ModelComparison (2 modell: 40SX, 38SX)
│
└── Footer CTA → /kiserlet
```

---

## Új Oldal Struktúra

```
SolutionLayout
├── Hero Header
│   ├── Section Header ("02 A Megoldás")
│   ├── Main Title ("Lazítás forgatás nélkül")
│   ├── Subtitle
│   └── Nav Buttons (3 db) ← MÓDOSÍTÁS
│       ├── "38SX" → #model-38sx
│       ├── "38WX" → #model-38wx
│       └── "40SX" → #model-40sx
│
├── Content Wrapper
│   ├── #model-38sx ← ÚJ SZEKCIÓ
│   │   └── ModelSection (38SX adatokkal)
│   │
│   ├── #model-38wx ← ÚJ SZEKCIÓ
│   │   └── ModelSection (38WX adatokkal)
│   │
│   └── #model-40sx ← ÚJ SZEKCIÓ
│       └── ModelSection (40SX adatokkal)
│
└── Footer CTA → /kiserlet
```

---

## Részletes Szekció Tartalmak

### Szekció 1: **38SX** - Nagy Szériás

#### Műszaki Adatok
- **Típus:** Standard Spader / Nagy szériás
- **Munkamélység:** 15-35 cm
- **Teljesítmény igény:** 80-150 LE
- **Jellemzők:**
  - Kompakt felépítés
  - Költséghatékony
  - Könnyű karbantartás

#### Terepen Alkalmazva
- **Helyszín:** Lakitelek (III., VII. parcella)
- **Kultúra:** Ipari paradicsom
- **Talaj:** Humuszos homok
- **Arany-féle kötöttség:** KA 27
- **Öntözés:** 450 mm
- **Időszak:** Május – Augusztus

#### Kezelések & Eredmények

| Parcella | Kezelés | Május | Augusztus | Változás |
|----------|---------|-------|-----------|----------|
| III. | Ásógép (30 cm) önállóan | 22 cm | 20 cm | -2 cm ✓ |
| VII. | Szántás + Ásógép (25 cm) | 32 cm | 31 cm | -1 cm ✓ |

#### Főbb Megállapítás
> A **szántás + ásógép kombináció** (VII. parcella) adta a **legjobb stabilitást** (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.

---

### Szekció 2: **38WX** - Lazítókéses

#### Műszaki Adatok
- **Típus:** Spader with Subsoiler / Lazítókéses
- **Munkamélység:** 35 cm ásógép + 55 cm lazítókés
- **Teljesítmény igény:** 100-180 LE
- **Jellemzők:**
  - Dupla működési mélység
  - Mélylazító kések
  - Nagyon tömör talajokra optimalizált

#### Terepen Alkalmazva
- **Helyszín:** Szentkirály
- **Kultúra:** Vöröshagyma
- **Talaj:** Réti csernozjom
- **Arany-féle kötöttség:** KA 28,5
- **Öntözés:** 350 mm
- **Időszak:** Március – Június
- **Mérések:** 4 alkalom

#### Kezelés Részletei
**Ásógépes parcella:**
1. Őszi nehézkultivátor
2. Tavaszi nehézkultivátor
3. **38WX ásógép (30 cm + 55 cm lazítókés)**

**Kontroll parcella:**
1. Őszi nehézkultivátor
2. Tavaszi nehézkultivátor
3. Kombinátor

#### Eredmények

| Hónap | Ásógép | Kontroll | Különbség |
|-------|--------|----------|-----------|
| Március | 35 cm | 8 cm | +27 cm |
| Április | 30 cm | 25 cm | +5 cm |
| Május | 22 cm | 23 cm | -1 cm |
| Június | 17 cm | 5 cm | +12 cm |

#### Főbb Megállapítás
> A júniusi helyszíni bejáráson **szemmel látható** volt: az ásógépezett parcellán **jelentősen kevesebb gyom** fejlődött, mint a hagyományos művelésű területen.

---

### Szekció 3: **40SX** - Mélyásógép

#### Műszaki Adatok
- **Típus:** Heavy Duty Spader / Mélyásógép
- **Munkamélység:** 20-50 cm
- **Teljesítmény igény:** 100-250 LE
- **Jellemzők:**
  - Dupla rotor rendszer
  - Automata kenés
  - Beépített kővédelem

#### Terepen Alkalmazva (2 helyszín)

##### Helyszín A: Kecskemét-Borbás
- **Kultúra:** Ipari paradicsom
- **Talaj:** Réti csernozjom
- **Arany-féle kötöttség:** KA 28
- **Öntözés:** 400 mm
- **Időszak:** Május – Június
- **Mérések:** 2 alkalom

**Kezelés részletei:**
1. Őszi szántás (28 cm)
2. Simítózás
3. Ásóborona
4. **40SX mélyásógép (45 cm)**

**Eredmények:**

| Hónap | Ásógép | Kontroll |
|-------|--------|----------|
| Május | 40 cm | 35 cm |
| Június | 37 cm | 27 cm |

**Kiemelés:** `10 cm különbség` júniusban az ásógépezett parcella javára

##### Helyszín B: Lakitelek (I. parcella)
- **Kultúra:** Ipari paradicsom
- **Talaj:** Humuszos homok
- **Kezelés:** Mélyásógép (40 cm) önállóan
- **Eredmény:** 33 cm → 31 cm (-2 cm, stabil)

#### Főbb Megállapítás
> A júniusi fotón jól látható: az ásógépezett sorok **paradicsomjai nagyobbak és fejlettebbek**, mint a hagyományos művelésű terület növényei. A **szembetűnő növekedési különbség** egyértelműen bizonyítja a mélyásógép hatékonyságát.

---

## UI/UX Követelmények

### Hero Navigációs Gombok

#### Jelenlegi (2 gomb)
```
┌─────────────────┐
│ Technológiai    │
│ Előnyök         │
└─────────────────┘
     ┌─────────────────┐
     │ Modellválaszték │
     │                 │
     └─────────────────┘
```

#### Új (3 gomb)
```
┌─────────────────┐
│     38SX        │
│  Nagy szériás   │
└─────────────────┘
     ┌─────────────────┐
     │     38WX        │
     │  Lazítókéses    │
     └─────────────────┘
          ┌─────────────────┐
          │     40SX        │
          │  Mélyásógép     │
          └─────────────────┘
```

- Minden gombhoz a megfelelő modell képe (`/images/38SX.png`, stb.)
- Hover effekt: arany keret + enyhe emelkedés
- Lépcsőzetes elrendezés desktop-on

### Szekció Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  [SECTION HEADER]                                                    │
│  ═══════════════                                                     │
│  38SX                                              badge: Nagy szériás│
│                                                                      │
│  ┌──────────────────────────┐  ┌────────────────────────────────────┐│
│  │                          │  │  MŰSZAKI ADATOK                    ││
│  │                          │  │  ───────────────                   ││
│  │      [GÉP KÉP]           │  │                                    ││
│  │      38SX.png            │  │  Munkamélység    15-35 cm          ││
│  │                          │  │  Teljesítmény    80-150 LE         ││
│  │                          │  │                                    ││
│  │                          │  │  Jellemzők:                        ││
│  │                          │  │  • Kompakt felépítés               ││
│  │                          │  │  • Költséghatékony                 ││
│  │                          │  │  • Könnyű karbantartás             ││
│  └──────────────────────────┘  └────────────────────────────────────┘│
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐│
│  │  TEREPEN ALKALMAZVA                                              ││
│  │  ══════════════════                                              ││
│  │                                                                  ││
│  │  ┌─────────────────────────────────────────────────────────────┐ ││
│  │  │ 📍 Lakitelek   🌱 Ipari paradicsom   🌍 Humuszos homok      │ ││
│  │  │ 💧 450 mm      📅 Május – Augusztus                         │ ││
│  │  └─────────────────────────────────────────────────────────────┘ ││
│  │                                                                  ││
│  │  KEZELÉSEK & EREDMÉNYEK                                          ││
│  │  ──────────────────────                                          ││
│  │                                                                  ││
│  │  ┌───────────────────────────────────────────────────────────┐   ││
│  │  │  III. PARCELLA                                            │   ││
│  │  │  Ásógép (30 cm) önállóan                                  │   ││
│  │  │  ┌────────┐ → ┌────────┐ = ┌────────┐                     │   ││
│  │  │  │ 22 cm  │   │ 20 cm  │   │ -2 cm  │ ✓ Stabil            │   ││
│  │  │  │ Május  │   │ Aug.   │   │        │                     │   ││
│  │  │  └────────┘   └────────┘   └────────┘                     │   ││
│  │  └───────────────────────────────────────────────────────────┘   ││
│  │                                                                  ││
│  │  ┌───────────────────────────────────────────────────────────┐   ││
│  │  │  VII. PARCELLA                                            │   ││
│  │  │  Szántás + Ásógép (25 cm)                                 │   ││
│  │  │  ┌────────┐ → ┌────────┐ = ┌────────┐                     │   ││
│  │  │  │ 32 cm  │   │ 31 cm  │   │ -1 cm  │ ✓ Legjobb           │   ││
│  │  │  │ Május  │   │ Aug.   │   │        │                     │   ││
│  │  │  └────────┘   └────────┘   └────────┘                     │   ││
│  │  └───────────────────────────────────────────────────────────┘   ││
│  │                                                                  ││
│  │  ┌───────────────────────────────────────────────────────────┐   ││
│  │  │  💡 FŐBB MEGÁLLAPÍTÁS                                     │   ││
│  │  │  A szántás + ásógép kombináció adta a legjobb             │   ││
│  │  │  stabilitást (-1 cm változás)                             │   ││
│  │  └───────────────────────────────────────────────────────────┘   ││
│  └──────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

### Vizuális Elemek

1. **Szín kódolás modellekhez** (opcionális, finom árnyalat)
   - 38SX: Semleges (alapértelmezett)
   - 38WX: Enyhe zöld árnyalat (lazítókés = extra mélység)
   - 40SX: Enyhe arany árnyalat (prémium/heavy duty)

2. **Ikonok** (Lucide React)
   - `MapPin` - Helyszín
   - `Leaf` / `Sprout` - Kultúra
   - `Layers` - Talaj típus
   - `Droplets` - Öntözés
   - `Calendar` - Időszak
   - `BarChart3` - Mérések
   - `CheckCircle2` - Stabil eredmény
   - `AlertCircle` - Figyelmeztető eredmény
   - `Lightbulb` - Megállapítás

3. **Eredmény vizualizáció**
   - Horizontális progress bar a lazaság értékekhez
   - Szín: zöld = stabil, sárga = közepes, piros = gyors tömörödés
   - Változás megjelenítése: +/- érték badge-ként

4. **Highlight doboz**
   - Arany keret bal oldalon
   - Sötétebb háttér
   - Villanykörte ikon

---

## Technikai Implementáció

### Új/Módosított Fájlok

| Fájl | Művelet | Leírás |
|------|---------|--------|
| `src/lib/data.ts` | MÓDOSÍTÁS | Új `modelDetails` objektum hozzáadása |
| `src/components/solution-v2/SolutionLayout.tsx` | MÓDOSÍTÁS | 3 navigációs gomb |
| `src/components/solution-v2/ModelSection.tsx` | ÚJ | Újrafelhasználható modell szekció |
| `src/components/solution-v2/ModelSection.module.css` | ÚJ | Szekció stílusok |
| `src/components/solution-v2/SolutionNew.module.css` | MÓDOSÍTÁS | 3 gombos layout |
| `src/app/megoldas/page.tsx` | MÓDOSÍTÁS | 3 ModelSection beillesztése |

### Adatstruktúra (`data.ts`)

```typescript
export const modelDetails = {
  '38sx': {
    id: '38sx',
    name: '38SX',
    type: 'Nagy szériás',
    typeEn: 'Standard Spader',
    image: '/images/38SX.png',
    specs: {
      depth: '15-35 cm',
      power: '80-150 LE',
      features: ['Kompakt felépítés', 'Költséghatékony', 'Könnyű karbantartás']
    },
    fieldApplication: {
      location: 'Lakitelek',
      parcels: 'III., VII. parcella',
      crop: 'Ipari paradicsom',
      soil: 'Humuszos homok',
      ka: '27',
      irrigation: '450 mm',
      period: 'Május – Augusztus',
      treatments: [
        {
          parcel: 'III.',
          description: 'Ásógép (30 cm) önállóan',
          initial: 22,
          final: 20,
          change: -2,
          stable: true
        },
        {
          parcel: 'VII.',
          description: 'Szántás + Ásógép (25 cm)',
          initial: 32,
          final: 31,
          change: -1,
          stable: true,
          best: true
        }
      ],
      highlight: {
        title: 'Legjobb stabilitás',
        text: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.'
      }
    }
  },
  '38wx': {
    // ... hasonló struktúra
  },
  '40sx': {
    // ... hasonló struktúra, 2 helyszínnel
  }
}
```

### Komponens Props

```typescript
interface ModelSectionProps {
  modelId: '38sx' | '38wx' | '40sx'
}
```

---

## Tesztelési Kritériumok

1. **Funkcionális**
   - [ ] 3 navigációs gomb megjelenik a hero-ban
   - [ ] Minden gomb a megfelelő szekcióra scrolloz
   - [ ] Scroll offset megfelelő (sticky header nem takarja)
   - [ ] Minden szekció tartalmazza a műszaki adatokat
   - [ ] Minden szekció tartalmazza a terep alkalmazási adatokat

2. **Vizuális**
   - [ ] Gombok lépcsőzetes elrendezése desktop-on
   - [ ] Responzív: mobil-on egymás alatt
   - [ ] Képek megfelelően jelennek meg
   - [ ] Ikonok láthatóak
   - [ ] Highlight dobozok kiemelkednek

3. **Accessibility**
   - [ ] Gombok `aria-label` attribútumokkal
   - [ ] Megfelelő kontraszt
   - [ ] Billentyűzet navigáció működik

---

## Elfogadási Kritériumok

- Az oldal 3 modell-alapú szekcióra bomlik
- Minden szekció tartalmaz műszaki adatokat ÉS terep alkalmazási információkat
- A hero 3 navigációs gombot tartalmaz a modell nevekkel
- A design illeszkedik a meglévő sötét "blueprint" stílushoz
- Responzív működés mobil eszközökön
