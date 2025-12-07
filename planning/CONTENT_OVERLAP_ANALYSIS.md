# Tartalmi Átfedések Elemzése és Megoldása

> **Cél:** Minden oldal egyedi, logikusan felépített, redundancia nélküli tartalommal

---

## 📊 Oldalak Tartalmi Térképe

| Oldal | Fő Kérdés | Mit mutat be? | Hangnem |
|-------|-----------|---------------|---------|
| **Probléma** | MIÉRT? | A probléma megértése | Problémafelvető, aggasztó |
| **Technológia** | MI? HOGYAN? | A megoldás bemutatása | Megoldásorientált, technikai |
| **Kutatás** | HOL? MIKOR? HOGYAN? | A tesztelés körülményei | Tudományos, módszertani |
| **Eredmények** | MI TÖRTÉNT? | Az adatok és következtetések | Bizonyító, összegző |

---

## 🔴 Azonosított Átfedések

### 1. Szántás Kritikája — Probléma vs Technológia

| Tartalom | Probléma oldal | Technológia terv |
|----------|----------------|------------------|
| Eketalp képződés | ✅ Részletesen | ✅ Táblázatban |
| Rétegfelcserélés | ✅ Részletesen | ✅ Táblázatban |
| Humusz oxidáció | ✅ Részletesen | ✅ Táblázatban |
| Lassú felmelegedés | ✅ Részletesen | ✅ Táblázatban |

**⚠️ REDUNDANCIA!**

**✅ Megoldás:**
- **Probléma oldal:** Marad a részletes bemutatás — MIT okoz a szántás (egyirányú, probléma-központú)
- **Technológia oldal:** NEM táblázat, hanem **vizuális működési elv** — HOGYAN oldja meg az ásógép
  - Helyette: Lottie animáció az ásógép működéséről
  - A különbség implicit: a működésből látszik, hogy nem forgat, nem kever

---

### 2. Alkalmazási Módok Eredményei — Technológia vs Eredmények

| Tartalom | Technológia terv | Eredmények terv |
|----------|------------------|-----------------|
| Önálló ásógép: -2 cm | ✅ Kártyán | ✅ Táblázatban |
| Lazítás+Ásógép: -7 cm | ✅ Kártyán | ✅ Táblázatban |
| Szántás+Ásógép: -1 cm | ✅ Kártyán (★Legjobb) | ✅ Táblázatban (★) |

**⚠️ REDUNDANCIA!**

**✅ Megoldás:**
- **Technológia oldal:** Alkalmazási módok KONCEPCIONÁLISAN — mikor melyiket használjuk, milyen talajra
  - Nem számok, hanem: "Jó szerkezetű talajra", "Nagyon tömör talajra", "Hagyományos rendszerbe"
  - Vizuális rating (csillagok), nem cm adatok
- **Eredmények oldal:** Számszerű összehasonlítás — konkrét cm értékek, % változások

---

### 3. Helyszíni Adatok — Technológia vs Kutatás

| Tartalom | Technológia (FieldDataModal) | Kutatás terv |
|----------|------------------------------|--------------|
| Lakitelek parcellák | ✅ Chart + kezelések | ✅ Részletes bemutató |
| Szentkirály adatok | ✅ Chart + kezelések | ✅ Részletes bemutató |
| Kecskemét adatok | ✅ Chart + kezelések | ✅ Részletes bemutató |

**⚠️ REDUNDANCIA!**

**✅ Megoldás:**
- **Technológia oldal:** Modellhez kötött ELŐZETES — csak a lényeg, CTA a Kutatásra
  - "38WX: Szentkirályon használtuk vöröshagyma kultúrában → [Részletek a Kutatásban]"
  - Mini chart helyett: 1 kiemelt szám + highlight mondat
- **Kutatás oldal:** Teljes körű módszertani bemutató — térkép, parcellák, kezelések, chart-ok

---

### 4. Mérési Adatok Bemutatása — Kutatás vs Eredmények

| Tartalom | Kutatás terv | Eredmények terv |
|----------|--------------|-----------------|
| Penetrométer adatok | ✅ Bar chart parcellánként | ✅ Interaktív táblázat |
| Hőmérsékleti adatok | ❌ Nincs | ✅ Finding kártya |
| Drónfelvételek | ❌ Csak említés | ✅ Before/After slider |

**✅ EZ RENDBEN VAN** — logikus felosztás:
- Kutatás = NYERS ADATOK parcelláknént
- Eredmények = ÖSSZESÍTETT MEGÁLLAPÍTÁSOK

---

## ✅ Javasolt Végleges Tartalomfelosztás

### Probléma Oldal (01)
```
┌─────────────────────────────────────────────────────────────────┐
│  A PROBLÉMA                                                     │
│                                                                 │
│  1. A Tömörödés                                                 │
│     - Interaktív talajszelvény (0-120 nap)                      │
│     - 3 ok: öntözés, gépek, idő                                 │
│     - 4 következmény                                            │
│                                                                 │
│  2. A Szántás Korlátai                                          │
│     - Szántás vs bolygatatlan vizualizáció                      │
│     - 4 probléma kártya (eketalp, rétegek, humusz, hő)          │
│                                                                 │
│  CTA → "Van kiút? Ismerje meg a technológiát"                   │
└─────────────────────────────────────────────────────────────────┘
```
**Kulcs:** Csak PROBLÉMÁK, nincs megoldás

---

### Technológia Oldal (02) — ÁTSTRUKTURÁLVA
```
┌─────────────────────────────────────────────────────────────────┐
│  A TECHNOLÓGIA                                                  │
│                                                                 │
│  1. Hero: "Lazítás forgatás nélkül"                             │
│     - SplitText animáció                                        │
│     - 3 Folder navigáció (38SX, 38WX, 40SX)                     │
│                                                                 │
│  2. Működési Elv (ÚJ!)                                          │
│     - Lottie animáció: ásógép működik                           │
│     - 3 kulcs jellemző: Függőleges mozgás, Nincs forgatás,      │
│       Rétegek helyükön                                          │
│     ❌ NEM kell: Szántás vs Ásógép táblázat (redundáns!)        │
│                                                                 │
│  3. Imants Modellek                                             │
│     - Sticky tab bar (38SX / 38WX / 40SX)                       │
│     - Modell kép + specifikációk                                │
│     - "Kísérletben használva" badge → link Kutatásra            │
│     ❌ NEM kell: FieldDataModal részletes chart (→ Kutatás)     │
│                                                                 │
│  4. Alkalmazási Útmutató (ÚJ NÉV!)                              │
│     - 3 kártya: Önálló / Kombinált lazítással / Szántás után    │
│     - Vizuális: mikor ajánlott, milyen talajra                  │
│     - Csillagos értékelés (nem cm adatok!)                      │
│     ❌ NEM kell: Konkrét cm eredmények (→ Eredmények)           │
│                                                                 │
│  CTA → "Hogyan teszteltük? Tovább a Kutatásra"                  │
└─────────────────────────────────────────────────────────────────┘
```
**Kulcs:** MEGOLDÁS bemutatása, technikai részletek, NEM eredmények

---

### Kutatás Oldal (03)
```
┌─────────────────────────────────────────────────────────────────┐
│  A KUTATÁS                                                      │
│                                                                 │
│  1. Hero: "3 helyszín, 7 kezelés, 4 hónap"                      │
│                                                                 │
│  2. Interaktív Térkép                                           │
│     - Magyarország SVG + 3 pin                                  │
│     - Hover tooltip                                             │
│                                                                 │
│  3. Helyszínek (Tab rendszer)                                   │
│     - Lakitelek: 7 parcella, részletes kezelések, bar chart     │
│     - Kecskemét: 2 mérés, összehasonlítás                       │
│     - Szentkirály: 4 hónap, gyomosodás megfigyelés              │
│                                                                 │
│  4. Mérési Módszerek                                            │
│     - Penetrométer, hőmérséklet, drón, megfigyelés              │
│                                                                 │
│  5. Timeline                                                    │
│     - Márciustól augusztusig                                    │
│                                                                 │
│  CTA → "Mit találtunk? Tovább az Eredményekre"                  │
└─────────────────────────────────────────────────────────────────┘
```
**Kulcs:** MÓDSZERTAN és körülmények, nyers adatok

---

### Eredmények Oldal (04)
```
┌─────────────────────────────────────────────────────────────────┐
│  EREDMÉNYEK                                                     │
│                                                                 │
│  1. Hero: "Mit találtunk?"                                      │
│                                                                 │
│  2. Fő Megállapítások (4 kártya)                                │
│     - Tartósabb lazaság (5-10 cm)                               │
│     - Gyorsabb felmelegedés (2-4°C)                             │
│     - Jobb vízgazdálkodás                                       │
│     - Látható növényfejlődés                                    │
│                                                                 │
│  3. Művelési Módszerek Összehasonlítása                         │
│     - Interaktív táblázat KONKRÉT SZÁMOKKAL                     │
│     - Kezdeti / Végső / Változás cm-ben                         │
│                                                                 │
│  4. Drónfelvételek                                              │
│     - Before/After slider                                       │
│                                                                 │
│  5. Kutatási Kérdések Válaszai                                  │
│     - Accordion formátum                                        │
│                                                                 │
│  6. Ajánlások                                                   │
│     - 4 gyakorlati tanács                                       │
│                                                                 │
│  7. Végső Következtetés                                         │
└─────────────────────────────────────────────────────────────────┘
```
**Kulcs:** KONKLÚZIÓK, számszerű bizonyítékok, ajánlások

---

## 🔄 Technológia Oldal — Végleges Változtatások

### Eltávolítandó (Redundancia elkerülése)
1. ~~Szántás vs Ásógép összehasonlító táblázat~~ → A Probléma oldalon már részletesen
2. ~~FieldDataModal részletes chart-ok~~ → Kutatás oldalra tartozik
3. ~~Alkalmazási módok konkrét cm adatai~~ → Eredmények oldalra tartozik

### Hozzáadandó
1. **Működési Elv szekció** — Lottie animáció + 3 jellemző kártya
2. **Alkalmazási Útmutató** — Vizuális, nem számszerű (mikor melyik mód)
3. **Modell → Kutatás linkek** — "Lásd a kísérletben" CTA

### Módosítandó
1. **FieldDataModal** → Egyszerűsítés: csak 1 highlight + CTA a Kutatásra
2. **Folder navigáció** → Marad, de a kattintás után kevesebb adat

---

## 📋 Implementációs Terv — Technológia Oldal

### 1. Működési Elv Szekció
```
Komponensek:
├── OperationPrinciple.tsx      # Szekció layout
├── SpadeWorkingAnimation.tsx   # Lottie/SVG animáció wrapper
└── FeatureCard.tsx             # 3 jellemző kártya
```

### 2. Modellek Szekció (Egyszerűsítés)
```
Változtatások:
├── ModelSection.tsx            # Kevesebb chart, több link
└── FieldDataModal.tsx          # Rövidebb, CTA Kutatásra
```

### 3. Alkalmazási Útmutató
```
Komponensek:
├── ApplicationGuide.tsx        # Új komponens
└── ApplicationGuide.module.css
```

---

*Elemzés készült: 2025. december 7.*
