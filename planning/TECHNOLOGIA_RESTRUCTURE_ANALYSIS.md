# Technológia Oldal — Átstrukturálási Elemzés

> **Cél:** Tudományosabb, logikusabb, konzekvensebb oldal létrehozása gazdag mikro-interakciókkal

---

## 📊 Összefoglaló: Terv vs. Jelenlegi Állapot

| Szekció | Terv szerint | Jelenlegi állapot | Prioritás |
|---------|--------------|-------------------|-----------|
| **1. Hero** | Split text reveal animáció | ✅ Létezik, de egyszerű fade-in | 🔴 Magas |
| **2. Működési Elv** | Lottie animáció + kulcs jellemzők | ❌ HIÁNYZIK | 🔴 Magas |
| **3. Szántás vs Ásógép** | Összehasonlító táblázat tooltipekkel | ❌ HIÁNYZIK | 🔴 Magas |
| **4. Imants Modellek** | 3D Folder nav + Tab váltás | ✅ Létezik, finomítandó | 🟡 Közepes |
| **5. Alkalmazási Módok** | Kártyák progress bar-ral | ⚠️ Létezik (`/solution/ApplicationModes.tsx`), de NEM HASZNÁLT | 🟡 Közepes |
| **6. Átvezető CTA** | Kutatásra navigáció | ✅ Létezik | ✅ OK |

---

## 🔴 KRITIKUS HIÁNYOSSÁGOK

### 1. Működési Elv Szekció — TELJESEN HIÁNYZIK

**A terv szerint:**
- Lottie/SVG animáció az ásógép működéséről
- Play/Pause vezérlés
- 3 kulcs jellemző kártya (Ásókanalak forgása, Függőleges mozgás, Rétegek helyükön)
- Scroll-triggered reveal animációk

**Jelenlegi állapot:**
- Az oldal rögtön a modellek bemutatásával kezd
- Nincs semmi, ami elmagyarázná a működési elvet
- A látogató nem érti, MI az ásógép és HOGYAN működik

**Ajánlás:**
```
┌─────────────────────────────────────────────────────────────────┐
│  HOGYAN MŰKÖDIK AZ ÁSÓGÉP?                                      │
│                                                                 │
│  ┌────────────────────┐    ┌────────────────────────────────┐   │
│  │                    │    │  KULCS JELLEMZŐK               │   │
│  │  [LOTTIE ANIMÁCIÓ] │    │                                │   │
│  │                    │    │  ✓ Ásókanalak felemelik        │   │
│  │   ● Play/Pause     │    │    és ejtik a talajt           │   │
│  │                    │    │                                │   │
│  └────────────────────┘    │  ✓ Függőleges mozgás,          │   │
│                            │    nem forgat                  │   │
│                            │                                │   │
│                            │  ✓ Talajrétegek a helyükön     │   │
│                            │    maradnak                    │   │
│                            └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Szükséges fájlok:**
- `src/animations/spade-working.json` — Lottie animáció (készítendő)
- `src/components/technology/SpadeAnimation.tsx` — Komponens
- `src/components/technology/OperationPrinciple.tsx` — Teljes szekció

---

### 2. Szántás vs Ásógép Összehasonlítás — TELJESEN HIÁNYZIK

**A terv szerint:**
- Interaktív táblázat
- Hover tooltipek minden sornál
- Sor-animációk scroll-ra
- Vizuális X/✓ ikonok

**Jelenlegi állapot:**
- Nincs direkt összehasonlítás a két technológia között
- A látogató nem látja a konkrét előnyöket egymás mellett

**Ajánlás — Animált Táblázat:**
```typescript
const comparisonRows = [
  { 
    plough: 'Forgat és kever', 
    spade: 'Csak lazít', 
    tooltip: 'A forgatás felcseréli az aerob és anaerob rétegeket, károsítva a talajéletet' 
  },
  { 
    plough: 'Eketalp képződik', 
    spade: 'Nincs eketalp', 
    tooltip: '25-30 cm mélyen tömör réteg alakul ki, ami akadályozza a gyökérnövekedést' 
  },
  { 
    plough: 'Humusz oxidálódik', 
    spade: 'Humusz megmarad', 
    tooltip: 'A felforgatott szerves anyag gyorsabban lebomlik' 
  },
  { 
    plough: 'Barázdás felszín', 
    spade: 'Sík, azonnal vethető', 
    tooltip: 'Nem kell további elmunkálás' 
  },
  { 
    plough: 'Lassú felmelegedés', 
    spade: 'Gyorsabb felmelegedés', 
    tooltip: 'Mérések szerint 2-4°C különbség tavasszal' 
  },
]
```

**Szükséges fájlok:**
- `src/components/technology/ComparisonTable.tsx`
- `src/components/technology/ComparisonTable.module.css`

---

### 3. Alkalmazási Módok — LÉTEZIK, DE NEM HASZNÁLT

**Jelenlegi állapot:**
- `src/components/solution/ApplicationModes.tsx` létezik
- Tartalmazza a 3 alkalmazási módot (Önálló, Lazítás+Ásógép, Szántás+Ásógép)
- **DE:** A `SolutionLayout.tsx` nem rendereli ki!

**Probléma:**
- Ez kritikus információ, ami segít a gazdáknak dönteni
- A "Legjobb" badge a Szántás+Ásógép kombón logikus választást ad
- Progress bar-ok vizualizálnák az eredményeket

**Ajánlás:**
- Integrálni a szekciót a Technológia oldalba
- Frissíteni az animációkat a terv szerint (Lottie ikonok)
- Progress bar hozzáadása az eredményekhez

---

## 🟡 FINOMÍTANDÓ ELEMEK

### 4. Hero Szekció — Animáció Fejlesztés

**Jelenlegi:**
```tsx
<h1 className={styles.mainTitle}>
  Lazítás<br />
  forgatás nélkül
</h1>
```
- Egyszerű `opacity: 0 → 1` fade

**Terv szerint — Split Text Reveal:**
```tsx
// Karakterenként megjelenő szöveg
<h1>
  <SplitText text="Lazítás" delay={0.2} />
  <br />
  <SplitText text="forgatás nélkül" delay={0.5} />
</h1>
```

**Szükséges:**
- Már van `TextReveal` komponens a `/ui/TextReveal` mappában
- Használni kell a Hero-ban

---

### 5. Folder Navigáció — Kis Finomítások

**Jelenlegi állapot:** ✅ Nagyon jó!
- 3D transform működik
- Papírlapok kiúsznak
- Hover effektek megvannak

**Javítandó:**
- Folder képekre kattintva nem nyílik modal (csak a tab váltás)
- Staggered elrendezés konzisztensebbé tehető

---

### 6. Model Section — Tab Váltás Animáció

**Jelenlegi:** ✅ AnimatePresence + layoutId működik

**Javítandó:**
- Műszaki rajz modal (BlueprintModal) — létezik koncepció, de nincs implementálva
- A képre kattintva lightbox nyílik, de nem műszaki rajz

---

## 📐 AJÁNLOTT ÚJ STRUKTÚRA

```
┌─────────────────────────────────────────────────────────────────┐
│  1. HERO                                                        │
│  ════════════════════════════════════════════════════════       │
│  [02] A Technológia                                             │
│                                                                 │
│       L a z í t á s           ← SplitText animáció              │
│       forgatás nélkül                                           │
│                                                                 │
│  [3 Folder kártya: 38SX | 38WX | 40SX]                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  2. MŰKÖDÉSI ELV (ÚJ!)                                          │
│  ════════════════════════════════════════════════════════       │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────┐     │
│  │  [LOTTIE ANIMÁCIÓ]   │  │  Ásókanalak               ✓  │     │
│  │                      │  │  Függőleges mozgás        ✓  │     │
│  │   ▶ Lejátszás        │  │  Rétegek helyükön        ✓  │     │
│  └──────────────────────┘  └──────────────────────────────┘     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  3. SZÁNTÁS VS ÁSÓGÉP (ÚJ!)                                     │
│  ════════════════════════════════════════════════════════       │
│                                                                 │
│  ┌────────────────────┬────────────────────┐                    │
│  │     SZÁNTÁS ✗      │     ÁSÓGÉP ✓       │                    │
│  ├────────────────────┼────────────────────┤                    │
│  │  Forgat            │  Csak lazít    [i] │  ← tooltip         │
│  │  Eketalp           │  Nincs         [i] │                    │
│  │  Rétegkeverés      │  Rétegmegőrzés [i] │                    │
│  │  Barázdás          │  Sík felszín   [i] │                    │
│  │  Lassú felmelegedés│  Gyors felm.   [i] │                    │
│  └────────────────────┴────────────────────┘                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  4. IMANTS MODELLEK (sticky tab)                                │
│  ════════════════════════════════════════════════════════       │
│                                                                 │
│  [38SX] [38WX] [40SX]  ← pill indikátor                         │
│                                                                 │
│  ┌──────────────────────┬──────────────────────────────────┐    │
│  │    [MODELL KÉP]      │  38SX — Nagy szériás             │    │
│  │                      │  Munkamélység: 15-35 cm          │    │
│  │    🔍 Nagyítás       │  Teljesítmény: 80-150 LE         │    │
│  │                      │                                  │    │
│  │                      │  • Kompakt felépítés             │    │
│  │                      │  • Költséghatékony               │    │
│  │                      │  • Könnyű karbantartás           │    │
│  └──────────────────────┴──────────────────────────────────┘    │
│                                                                 │
│  [Terep Eredmények kártya — kattintható modal]                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  5. ALKALMAZÁSI MÓDOK (ÚJ INTEGRÁCIÓ!)                          │
│  ════════════════════════════════════════════════════════       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐       │
│  │ ÖNÁLLÓ       │  │ LAZÍTÁS+     │  │  ★ SZÁNTÁS+      │       │
│  │ ÁSÓGÉP       │  │ ÁSÓGÉP       │  │    ÁSÓGÉP        │       │
│  │              │  │              │  │                  │       │
│  │ -2 cm        │  │ -7 cm        │  │ -1 cm LEGJOBB    │       │
│  │ ████████░░   │  │ █████░░░░░   │  │ █████████░       │       │
│  └──────────────┘  └──────────────┘  └──────────────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  6. ÁTVEZETŐ CTA                                                │
│  ════════════════════════════════════════════════════════       │
│                                                                 │
│     "Hogyan teszteltük ezeket a gyakorlatban?"                  │
│                                                                 │
│           [Tovább a Kutatásra →]  MagneticButton                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 MIKRO-INTERAKCIÓK CHECKLIST

### Meglévő ✅
- [x] Folder 3D hover + papírok kiúsznak
- [x] Tab váltás `layoutId` animáció
- [x] Spec progress bar-ok
- [x] Feature lista staggered reveal
- [x] Mini chart animált bar-ok
- [x] Modal backdrop blur + spring animáció
- [x] Icon hover rotate/scale

### Hozzáadandó 🆕
- [ ] **SplitText** — Hero címhez karakterenkénti reveal
- [ ] **Lottie** — Működési elv animáció (spade-working.json)
- [ ] **Table row stagger** — Összehasonlító táblázat sorai
- [ ] **Tooltip** — Táblázat info ikonokhoz
- [ ] **Progress bar** — Alkalmazási módok eredményeihez
- [ ] **Lottie ikonok** — Alkalmazási mód kártyákhoz
- [ ] **Parallax** — Hero háttér rétegek (opcionális)

---

## 🔧 IMPLEMENTÁCIÓS TERV

### Fázis 1: Hiányzó Szekciók (Magas prioritás)
1. **Működési Elv** szekció létrehozása
   - `SpadeAnimation.tsx` komponens
   - `OperationPrinciple.tsx` layout
   - Lottie animáció készítése/beszerzése

2. **Összehasonlító Táblázat** létrehozása
   - `ComparisonTable.tsx` komponens
   - Tooltip integráció
   - Sor animációk

3. **Alkalmazási Módok** integráció
   - Meglévő komponens importálása
   - Progress bar hozzáadása
   - Elhelyezés a struktúrában

### Fázis 2: Animáció Fejlesztések (Közepes prioritás)
4. **Hero SplitText** animáció
5. **Táblázat tooltipek** implementáció
6. **Lottie ikonok** alkalmazási módokhoz

### Fázis 3: Finomhangolás (Alacsony prioritás)
7. Műszaki rajz modal zoom funkcióval
8. Keyboard navigáció (accessibility)
9. Mobile swipe gestures

---

## 📁 ÚJ FÁJL STRUKTÚRA

```
src/
├── components/
│   └── technology/              # ÚJ MAPPA (solution-v2 átnevezése)
│       ├── TechnologyLayout.tsx  # Fő layout (SolutionLayout.tsx-ből)
│       ├── OperationPrinciple.tsx # 🆕 Működési elv szekció
│       ├── SpadeAnimation.tsx     # 🆕 Lottie működési animáció
│       ├── ComparisonTable.tsx    # 🆕 Szántás vs Ásógép
│       ├── FolderNavigation.tsx   # Folder kártyák (kiemelés)
│       ├── ModelSection.tsx       # ✅ Meglévő
│       ├── ApplicationModes.tsx   # solution/-ból áthelyezve
│       ├── FieldDataModal.tsx     # ✅ Meglévő
│       └── Technology.module.css
├── animations/
│   ├── spade-working.json        # 🆕 Működési elv
│   ├── spade-icon.json           # 🆕 Alkalmazási mód ikon
│   ├── layers-icon.json          # 🆕 Alkalmazási mód ikon
│   └── combine-icon.json         # 🆕 Alkalmazási mód ikon
```

---

## 🧪 TESZTELÉSI CHECKLIST

```typescript
// e2e/technologia.spec.ts kiegészítések

test('Működési elv animáció Play/Pause', async ({ page }) => {
  const playBtn = page.getByRole('button', { name: /lejátszás/i })
  await expect(playBtn).toBeVisible()
  await playBtn.click()
  await expect(page.getByRole('button', { name: /szünet/i })).toBeVisible()
})

test('Összehasonlító táblázat tooltipek', async ({ page }) => {
  await page.getByText('Miért jobb az ásógép?').scrollIntoViewIfNeeded()
  await page.locator('[data-tooltip]').first().hover()
  await expect(page.getByRole('tooltip')).toBeVisible()
})

test('Alkalmazási módok "Legjobb" badge', async ({ page }) => {
  await page.getByText('Alkalmazási módok').scrollIntoViewIfNeeded()
  await expect(page.getByText('LEGJOBB')).toBeVisible()
})
```

---

## 🎯 KÖVETKEZŐ LÉPÉSEK

1. **Döntés a Lottie animációról:**
   - Készítünk egyedi animációt? (After Effects → Bodymovin)
   - Vagy SVG + Framer Motion kombináció?

2. **Tooltip library kiválasztása:**
   - Radix UI Tooltip (ajánlott, accessible)
   - Framer Motion custom tooltip

3. **Folder struktúra átszervezés:**
   - `solution-v2` → `technology` átnevezés?
   - Vagy marad külön a backward compatibility miatt?

---

*Készítette: Cascade AI | Dátum: 2025. december 7.*
