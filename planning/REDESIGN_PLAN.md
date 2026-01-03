# ÁSÓGÉP WEBAPP - Teljes Újratervezési Terv

**Létrehozva:** 2025-01-03
**Státusz:** Tervezés alatt
**Cél:** Egységes design rendszer, megfelelő méretek és arányok, tiszta tipográfia

---

## 1. JELENLEGI PROBLÉMÁK ÖSSZEFOGLALÁSA

### 1.1 Navigáció problémák
- [ ] **Kontraszt hiba görgetéskor**: A `header.scrolled` állapotban a háttér gradiens nem elég kontrasztos a szöveggel
- [ ] A navigáció háttere (`rgba(45, 37, 30, 0.98)`) nem illeszkedik jól a dark témához görgetéskor
- [ ] Hiányzik a solid háttér scrolled állapotban

### 1.2 Hero szekció problémák
- [ ] **Technológia oldal**: A HubFolder komponens (580px min-height) túl nagy, kilóg a hero szekcióból
- [ ] **Technológia oldal**: A grid elrendezés (1fr 1.2fr) nem megfelelő - a jobb oldali komponens levágódik
- [ ] **Problem oldal**: A 3 oszlopos grid (1fr 1.1fr 1fr) túl szűk kisebb képernyőkön
- [ ] **Research oldal**: A térkép és a szöveg arányai nem optimálisak
- [ ] Nincs egységes padding-top a header-hez igazítva (most 100px, de a header magassága változó)

### 1.3 Tipográfia és számozás problémák
- [ ] **Inkonzisztens számozás**: 
  - Főoldal: nincs számozás
  - Probléma: "01", "02", "03" arab számokkal
  - Technológia: "02" badge-ben
  - Kutatás: nincs egységes számozás
- [ ] **Badge design inkonzisztencia**: Különböző stílusú badge-ek az oldalakon
- [ ] **Címek hierarchiája** nem tiszta

### 1.4 Elrendezési problémák
- [ ] Container szélesség (1600px) túl nagy bizonyos tartalmakhoz
- [ ] Szövegblokkok nem mindig középre igazítottak
- [ ] Responsive töréspontok nem egységesek

---

## 2. ÚJ DESIGN RENDSZER

### 2.1 Oldalak számozása (Arab számok)
```
01 - Főoldal (Home)
02 - Probléma (Problem)  
03 - Technológia (Solution/Technology)
04 - Kutatás (Research)
```

### 2.2 Szekciók számozása (Római számok)
Minden oldalon belül a szekciók római számokat kapnak:
```
I.   - Első szekció
II.  - Második szekció
III. - Harmadik szekció
IV.  - Negyedik szekció
```

### 2.3 Egységes Badge Design
```css
/* Oldal szám badge */
.pageNumberBadge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(212, 168, 75, 0.1);
  border: 1px solid rgba(212, 168, 75, 0.3);
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* Szekció szám (római) */
.sectionNumber {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gold);
  letter-spacing: 0.1em;
}
```

### 2.4 Egységes Cím Hierarchia
```css
/* Oldal fő címe (H1) */
.pageTitle {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--color-white);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-align: center;
}

/* Szekció címe (H2) */
.sectionTitle {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 700;
  color: var(--color-white);
  line-height: 1.2;
  text-align: center;
}

/* Alcím / Leírás */
.pageSubtitle {
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
```

---

## 3. HERO SZEKCIÓK ÚJRATERVEZÉSE

### 3.1 Közös Hero Specifikációk
```css
.heroSection {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 5% 80px; /* Header space + bottom padding */
  position: relative;
  overflow: hidden;
}

/* Tartalom wrapper - középre igazított */
.heroContent {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
```

### 3.2 Főoldal Hero (01)
**Jelenlegi:** Bal oldalra igazított szöveg + jobb oldali kép
**Új terv:** Megtartjuk, mert jól működik
- Háttérkép: `hero-bg-final_new.png`
- Szöveg bal oldalon, max-width: 800px
- Statisztikák alul

### 3.3 Probléma Hero (02)
**Jelenlegi:** 3 oszlopos grid (szöveg | talajszelvény | navigáció)
**Probléma:** Túl zsúfolt, komponensek kilógnak
**Új terv:**
```
┌─────────────────────────────────────────────────────┐
│                    [02 BADGE]                       │
│              A PROBLÉMA                             │
│         Fedezd fel a talaj rejtett rétegeit         │
├─────────────────────────────────────────────────────┤
│                                                     │
│     [Szöveg]              [Talajszelvény]           │
│     max-width: 400px      max-width: 500px          │
│                                                     │
├─────────────────────────────────────────────────────┤
│        [Navigációs gombok egymás mellett]           │
│    I. Tömörödés   II. Kultivátor   III. Szántás     │
└─────────────────────────────────────────────────────┘
```
- 2 oszlopos layout szöveg + vizualizáció
- Navigáció alul, horizontálisan

### 3.4 Technológia Hero (03)
**Jelenlegi:** Grid (szöveg | HubFolder) - HubFolder túl nagy (580px)
**Probléma:** HubFolder kilóg, nem fér el
**Új terv:**
```
┌─────────────────────────────────────────────────────┐
│                    [03 BADGE]                       │
│              A TECHNOLÓGIA                          │
│      Lazítás és forgatás, optimális arányban        │
├─────────────────────────────────────────────────────┤
│                                                     │
│              [Navigációs kártyák]                   │
│     ┌─────┐   ┌─────┐   ┌─────┐                     │
│     │ I.  │   │ II. │   │III. │                     │
│     │Műkö-│   │Mode-│   │Alkal│                     │
│     │dés  │   │llek │   │mazás│                     │
│     └─────┘   └─────┘   └─────┘                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```
- Középre igazított tartalom
- HubFolder helyett egyszerűbb kártyák (max 300px magasság)

### 3.5 Kutatás Hero (04)
**Jelenlegi:** Grid (szöveg | térkép)
**Új terv:**
```
┌─────────────────────────────────────────────────────┐
│                    [04 BADGE]                       │
│              A KUTATÁS                              │
│         Penetrométeres talajvizsgálat               │
├─────────────────────────────────────────────────────┤
│                                                     │
│     [Statisztikák]        [Magyarország térkép]     │
│     max-width: 450px      max-width: 500px          │
│                                                     │
└─────────────────────────────────────────────────────┘
```
- Kiegyensúlyozottabb arányok
- Térkép mérete csökkentve

---

## 4. NAVIGÁCIÓ JAVÍTÁSA

### 4.1 Scrolled állapot javítása
```css
.header.scrolled::before {
  background: var(--color-earth-900); /* Solid háttér */
  opacity: 1;
}

/* Jobb kontraszt biztosítása */
.header.scrolled .nav {
  background: rgba(26, 22, 18, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 4.2 Pill-style navigáció megtartása
- Háttér: solid dark amikor scrolled
- Link szín: rgba(255, 255, 255, 0.8)
- Active link: var(--color-gold)

---

## 5. RESPONSIVE TÖRÉSPONTOK

### 5. Egységes breakpointok
```css
/* Desktop Large */
@media (min-width: 1400px) { }

/* Desktop */
@media (min-width: 1024px) and (max-width: 1399px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Mobile */
@media (max-width: 767px) { }

/* Small Mobile */
@media (max-width: 480px) { }
```

### 5.2 Hero responsive viselkedés
```css
/* Tablet és kisebb */
@media (max-width: 1023px) {
  .heroSection {
    min-height: auto;
    padding: 120px 5% 60px;
  }
  
  .heroGrid {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
}
```

---

## 6. IMPLEMENTÁCIÓS LÉPÉSEK

### Fázis 1: Navigáció javítása
- [ ] 1.1 `Navigation.module.css` scrolled háttér javítása
- [ ] 1.2 Kontraszt növelése (solid háttér)
- [ ] 1.3 Tesztelés minden oldalon

### Fázis 2: Egységes komponensek létrehozása
- [ ] 2.1 Új `PageHeader` komponens létrehozása (badge + cím + alcím)
- [ ] 2.2 Új `SectionHeader` komponens frissítése (római számozás)
- [ ] 2.3 Badge stílusok egységesítése

### Fázis 3: Főoldal (01)
- [ ] 3.1 Badge hozzáadása: "01 · FŐOLDAL"
- [ ] 3.2 Hero megtartása jelenlegi formában
- [ ] 3.3 ResearchQuestions szekció ellenőrzése

### Fázis 4: Probléma oldal (02)
- [ ] 4.1 SoilHeroInteractive átstrukturálása
- [ ] 4.2 3 oszlop → 2 oszlop + alul navigáció
- [ ] 4.3 Szekciók római számozása (I, II, III)
- [ ] 4.4 Responsive ellenőrzés

### Fázis 5: Technológia oldal (03)
- [ ] 5.1 HubFolder egyszerűsítése/kicserélése
- [ ] 5.2 Kisebb kártyák (max 300px magasság)
- [ ] 5.3 Központosított elrendezés
- [ ] 5.4 Szekciók római számozása

### Fázis 6: Kutatás oldal (04)
- [ ] 6.1 Hero arányok kiegyensúlyozása
- [ ] 6.2 Térkép méret csökkentése
- [ ] 6.3 Szekciók római számozása
- [ ] 6.4 LocationSection elrendezés ellenőrzése

### Fázis 7: Végső ellenőrzés
- [ ] 7.1 Minden oldal átfutása
- [ ] 7.2 Responsive tesztelés (1920px, 1440px, 1024px, 768px, 375px)
- [ ] 7.3 Kontraszt ellenőrzés (WCAG AA)
- [ ] 7.4 Animációk ellenőrzése

---

## 7. FÁJLOK LISTÁJA MÓDOSÍTÁSHOZ

### Navigáció
- `src/components/layout/Navigation.tsx`
- `src/components/layout/Navigation.module.css`

### Közös komponensek
- `src/components/ui/SectionHeader.tsx` (létezik, módosítandó)
- `src/components/ui/PageHeader.tsx` (új komponens)
- `src/app/globals.css`

### Főoldal (01)
- `src/components/home/Hero.tsx`
- `src/components/home/Hero.module.css`
- `src/components/home/ResearchQuestions.tsx`

### Probléma oldal (02)
- `src/components/problem/SoilHeroInteractive/SoilHeroInteractive.tsx`
- `src/components/problem/SoilHeroInteractive/SoilHeroInteractive.module.css`
- `src/components/problem/ProblemLayout.tsx`
- `src/components/problem/ProblemNew.module.css`

### Technológia oldal (03)
- `src/components/solution-v2/SolutionLayout.tsx`
- `src/components/solution-v2/SolutionNew.module.css`
- `src/components/solution-v2/HubFolder.tsx`
- `src/components/solution-v2/HubFolder.module.css`

### Kutatás oldal (04)
- `src/components/experiment/ResearchLayout.tsx`
- `src/components/experiment/ResearchNew.module.css`
- `src/components/experiment/ResearchHero/ResearchHero.tsx`
- `src/components/experiment/ResearchHero/ResearchHero.module.css`

---

## 8. DESIGN TOKENS (CSS VÁLTOZÓK)

### Új változók hozzáadása a globals.css-hez
```css
:root {
  /* Hero méretek */
  --hero-min-height: 100vh;
  --hero-padding-top: 120px;
  --hero-padding-bottom: 80px;
  --hero-content-max-width: 1200px;
  
  /* Számozás színek */
  --number-color: var(--color-gold);
  --number-bg: rgba(212, 168, 75, 0.1);
  --number-border: rgba(212, 168, 75, 0.3);
  
  /* Navigáció */
  --nav-height: 80px;
  --nav-height-scrolled: 64px;
  --nav-bg-scrolled: var(--color-earth-900);
}
```

---

## 9. TESZTELÉSI CHECKLIST

### Minden oldalra:
- [ ] Hero elfér a képernyőn görgetés nélkül (100vh)
- [ ] Komponensek nem lógnak ki
- [ ] Szövegek olvashatók (kontraszt OK)
- [ ] Badge-ek egységesek
- [ ] Számozás helyes (arab oldalak, római szekciók)
- [ ] Responsive működik (tablet, mobil)
- [ ] Navigáció scrolled állapotban jól látható

### Képernyőméretek:
- [ ] 1920x1080 (Full HD)
- [ ] 1440x900 (Laptop)
- [ ] 1024x768 (Tablet landscape)
- [ ] 768x1024 (Tablet portrait)
- [ ] 375x667 (iPhone SE)
- [ ] 390x844 (iPhone 14)

---

## 10. PRIORITÁS SORREND

1. **KRITIKUS**: Navigáció kontraszt javítása
2. **MAGAS**: Technológia hero HubFolder méret
3. **MAGAS**: Egységes badge és számozás rendszer
4. **KÖZEPES**: Hero szekciók újratervezése
5. **KÖZEPES**: Responsive javítások
6. **ALACSONY**: Animációk finomhangolása

---

## MEGJEGYZÉSEK

- A terv folyamatosan frissítendő az implementáció során
- Minden változtatás után tesztelés szükséges
- A design tokenek használata kötelező az egységesség érdekében
- Commitolás fázisonként ajánlott

