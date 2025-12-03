# UX & Design Elemzés - Követelmények
## Fókusz: Probléma és Megoldás Oldalak

**Verzió:** 2.0
**Dátum:** 2024. december 3.

---

## 1. Áttekintés

Ez a dokumentum a **Probléma** (`/problema`) és **Megoldás** (`/megoldas`) oldalak UX és Design elemzésének követelményeit és eredményeit foglalja össze.

### Célok
1. **Átfogó UX Audit** - Jelenlegi állapot értékelése pontszámokkal
2. **Design Konzisztencia Vizsgálat** - A két oldal közötti összhang elemzése
3. **Navigációs Flow Elemzés** - User journey értékelése
4. **Alternatív Design Javaslatok** - Több megközelítés felvázolása
5. **Implementációs Terv** - Prioritási sorrendben

---

## 2. Elemzési Szempontok

### 2.1 Vizuális Hierarchia
- Főcímek és alárendelt tartalmak elválasztása
- CTA gombok kiemelése
- Információs sűrűség kezelése

### 2.2 Design Konzisztencia
- Színhasználat (Light vs Dark theme átmenetek)
- Tipográfia (Fraunces + Inter párosítás)
- Térközök (spacing változók használata)
- Kártya design (border-radius, shadow, padding)

### 2.3 Interaktivitás
- Hover állapotok
- Scroll-triggered animációk (Framer Motion)
- Kattintható elemek feedback-je
- SVG vizualizációk (InteractiveSoil, MachineBlueprint)

### 2.4 Reszponzivitás
- Desktop (>1200px)
- Laptop (1024-1200px)
- Tablet (768-1024px)
- Mobile (640-768px)
- Small Mobile (<640px)

### 2.5 Navigációs UX
- Oldalakon belüli szekciónavigáció
- Oldalak közötti átmenetek
- Progress jelzés
- Back-to-top lehetőség

### 2.6 Kód Minőség
- CSS Module használat vs inline style-ok
- Komponens újrafelhasználhatóság
- Karbantarthatóság

---

## 3. Vizsgált Oldalak és Komponensek

### Probléma Oldal (`/problema`)
| Komponens | Fájl | Funkció |
|-----------|------|--------|
| ProblemLayout | `components/problem/ProblemLayout.tsx` | Fő layout, header, footer |
| CompactionView | `components/problem/CompactionView.tsx` | Tömörödés szekció |
| PloughingView | `components/problem/PloughingView.tsx` | Szántás korlátai szekció |
| InteractiveSoil | `components/problem/InteractiveSoil.tsx` | SVG talaj animáció |
| SoilComparison | `components/problem/SoilComparison.tsx` | Összehasonlító vizualizáció |
| ProblemNew.module.css | CSS module | Stílusok |

### Megoldás Oldal (`/megoldas`)
| Komponens | Fájl | Funkció |
|-----------|------|--------|
| SolutionLayout | `components/solution-v2/SolutionLayout.tsx` | Fő layout, header, footer |
| MachineBlueprint | `components/solution-v2/MachineBlueprint.tsx` | Interaktív gép ábra |
| BenefitsGrid | `components/solution-v2/BenefitsGrid.tsx` | Előnyök grid |
| ModelComparison | `components/solution-v2/ModelComparison.tsx` | Modell összehasonlítás |
| SolutionNew.module.css | CSS module | Stílusok |

---

## 4. Eredmény Pontszámok

| Kritérium | Probléma | Megoldás |
|-----------|----------|----------|
| Vizuális Hierarchia | 9/10 | 7/10 |
| Konzisztencia | 8/10 | 6/10 |
| Interaktivitás | 9/10 | 8/10 |
| Reszponzivitás | 8/10 | 5/10 |
| Navigáció | 8/10 | 7/10 |
| Kód Minőség | 7/10 | 5/10 |
| **ÖSSZESEN** | **8.5/10** | **6.5/10** |

---

## 5. Azonosított Problémák Összefoglalása

### Magas Prioritás
1. **Megoldás oldal inline style-ok** - Kód karbantarthatóság és reszponzivitás
2. **SoilComparison placeholder** - Befejezetlen vizualizáció
3. **Mobile spacing issues** - Térközök nem optimálisak kis képernyőn

### Közepes Prioritás
4. **Nincs scroll progress** - User nem tudja hol tart
5. **Inkonzisztens accent színek** - Green vs Gold használat
6. **Kártya design eltérések** - Padding, shadow különbségek

### Alacsony Prioritás
7. **Back-to-top hiányzik**
8. **Parallax effektek hiánya**
9. **Number count-up animációk**

---

## 6. Alternatív Design Irányok

### A: Unified Editorial (3/5 ⭐)
Mindkét oldal világos háttér, csak blokkok színezve.

### B: Gradient Transition (5/5 ⭐) ✅ Ajánlott
Simulékony színátmenet Probléma → Megoldás között.

### C: Single Page App (2/5 ⭐)
Egyesített tab-alapú oldal.

---

## 7. Kimenetek

| Dokumentum | Leírás | Státusz |
|------------|--------|--------|
| `requirements.md` | Ez a dokumentum | ✅ Kész |
| `ux-audit.md` | Részletes elemzés | ✅ Kész |
| `implementation-plan.md` | Fejlesztési terv | ✅ Kész |

---

## 8. Következő Lépések

1. **Review** - Dokumentáció áttekintése
2. **Prioritás választás** - Phase 2 (Critical Fixes) indítása
3. **Implementáció** - BenefitsGrid és ModelComparison refactor
4. **Testing** - Reszponzivítás tesztelése
5. **Iteráció** - További fázisok
