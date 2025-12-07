# Ásógépes Kutatás Weboldal — Struktúra Terv

## Célkitűzés
Interaktív tudományos munka bemutatása, amely válaszol a következő kutatási kérdésekre:
1. Az Imants ásógépek talajra gyakorolt hatásának elemzése
2. Ásógépezett talajok szerkezetváltozása egy termesztési ciklus alatt
3. Ásógépek alkalmazása önmagukban és más művelő eszközzel
4. Különböző művelési módszerek összehasonlítása

---

## Javasolt Oldal Struktúra

```
┌─────────────────────────────────────────────────────────────────┐
│  FŐOLDAL                                                        │
│  ├── Bevezető hook + kutatás fókusza                           │
│  └── Gyors navigáció a fő szekciókhoz                          │
├─────────────────────────────────────────────────────────────────┤
│  PROBLÉMA                                                       │
│  ├── A tömörödés problémája                                    │
│  └── A hagyományos szántás korlátai                            │
├─────────────────────────────────────────────────────────────────┤
│  TECHNOLÓGIA                                                    │
│  ├── Az ásógép működési elve                                   │
│  ├── Imants modellek (38SX, 38WX, 40SX)                        │
│  └── Alkalmazási módok                                         │
├─────────────────────────────────────────────────────────────────┤
│  KUTATÁS                                                        │
│  ├── Helyszínek áttekintése                                    │
│  │   ├── Lakitelek                                             │
│  │   ├── Kecskemét-Borbás                                      │
│  │   └── Szentkirály                                           │
│  ├── Mérési módszerek                                          │
│  └── Időbeli lefolyás                                          │
├─────────────────────────────────────────────────────────────────┤
│  EREDMÉNYEK                                                     │
│  ├── Fő megállapítások                                         │
│  ├── Művelési módszerek összehasonlítása                       │
│  ├── Drónfelvételek elemzése                                   │
│  └── Következtetések & Ajánlások                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. FŐOLDAL

### Cél
Azonnal megragadni a figyelmet és világossá tenni, miről szól a kutatás.

### Tartalom
```
┌─────────────────────────────────────────────────────────┐
│  HERO SZEKCIÓ                                           │
│  ─────────────────────────────────────────────────────  │
│  Címsor: "A talaj nem végtelen erőforrás"               │
│  Alcím: Tudományos kutatás az ásógépes talajművelés     │
│         hatásairól öntözött kertészeti kultúrákban      │
│                                                         │
│  Gyors számok:                                          │
│  • 3 helyszín                                           │
│  • 7 kezelési mód                                       │
│  • 4 hónap megfigyelés                                  │
│  • 450 mm öntözővíz                                     │
│                                                         │
│  CTA: "Fedezd fel a kutatást" → Probléma oldalra        │
├─────────────────────────────────────────────────────────┤
│  KUTATÁSI KÉRDÉSEK (vizuális kártyák)                   │
│  ─────────────────────────────────────────────────────  │
│  4 kártya, mindegyik egy kutatási kérdéssel:            │
│  1. Hatáselemzés → linkel Eredményekre                  │
│  2. Szerkezetváltozás → linkel Kutatásra                │
│  3. Alkalmazási módok → linkel Technológiára            │
│  4. Összehasonlítás → linkel Eredményekre               │
├─────────────────────────────────────────────────────────┤
│  PARTNEREK                                              │
│  ─────────────────────────────────────────────────────  │
│  Neumann János Egyetem × Agroskill Kft. — 2025          │
└─────────────────────────────────────────────────────────┘
```

---

## 2. PROBLÉMA

### Cél
Megértetni, MIÉRT van szükség alternatív talajművelésre.

### Tartalom
```
┌─────────────────────────────────────────────────────────┐
│  BEVEZETŐ                                               │
│  ─────────────────────────────────────────────────────  │
│  "Az intenzív öntözéses kertészetben a talaj folyamatos │
│   terhelésnek van kitéve. A hagyományos művelés nem     │
│   tartja lépést ezzel a stresszel."                     │
├─────────────────────────────────────────────────────────┤
│  TAB 1: A TÖMÖRÖDÉS                                     │
│  ─────────────────────────────────────────────────────  │
│  Probléma források:                                     │
│  • Öntözés hatása (350-450 mm/szezon)                   │
│  • Gépek taposása (folyamatos terhelés)                 │
│  • Szerkezetromlás üteme (30 nap alatt kritikus)        │
│                                                         │
│  Következmények:                                        │
│  • Gyökérzóna beszűkülése                               │
│  • Pangóvíz és kiszáradás egyidejűleg                   │
│  • Lassabb felmelegedés                                 │
│                                                         │
│  [INTERAKTÍV] Talajszelvény vizualizáció                │
│  → Csúszkával állítható idő, látszik a tömörödés        │
├─────────────────────────────────────────────────────────┤
│  TAB 2: A SZÁNTÁS KORLÁTAI                              │
│  ─────────────────────────────────────────────────────  │
│  Strukturális problémák:                                │
│  • Eketalp képződés (25-30 cm, 20+ bar nyomás)          │
│  • Rétegek felcserélése → talajélet károsodás           │
│  • Humusz oxidálódása                                   │
│  • Lassú tavaszi felmelegedés                           │
│                                                         │
│  [VIZUÁLIS] Szántott vs. Bolygatatlan talaj             │
│  összehasonlító infografika                             │
├─────────────────────────────────────────────────────────┤
│  ÁTVEZETŐ                                               │
│  ─────────────────────────────────────────────────────  │
│  "Van-e olyan módszer, amely lazít anélkül, hogy        │
│   forgatna? → Igen: az ásógép."                         │
│  CTA: "Ismerje meg a technológiát"                      │
└─────────────────────────────────────────────────────────┘
```

---

## 3. TECHNOLÓGIA

### Cél
Bemutatni az ásógépet mint megoldást — működés + konkrét modellek.

### Tartalom
```
┌─────────────────────────────────────────────────────────┐
│  MŰKÖDÉSI ELV                                           │
│  ─────────────────────────────────────────────────────  │
│  Címsor: "Lazítás forgatás nélkül"                      │
│                                                         │
│  Kulcs különbségek:                                     │
│  ┌────────────────┬────────────────┐                    │
│  │ SZÁNTÁS        │ ÁSÓGÉP         │                    │
│  ├────────────────┼────────────────┤                    │
│  │ Forgat         │ Csak lazít     │                    │
│  │ Eketalp képzés │ Nincs eketalp  │                    │
│  │ Rétegkeverés   │ Rétegmegőrzés  │                    │
│  │ Barázdás       │ Sík felszín    │                    │
│  └────────────────┴────────────────┘                    │
│                                                         │
│  [ANIMÁCIÓ] Működési elv — ásókanalak mozgása           │
├─────────────────────────────────────────────────────────┤
│  IMANTS MODELLEK                                        │
│  ─────────────────────────────────────────────────────  │
│  [Tab rendszer vagy kártya választó]                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 38SX — Nagy szériás                             │    │
│  │ ───────────────────────────────────────────     │    │
│  │ Munkamélység: 15-35 cm                          │    │
│  │ Teljesítményigény: 80-150 LE                    │    │
│  │ Jellemző: Kompakt, költséghatékony              │    │
│  │                                                 │    │
│  │ Kutatásban: Lakitelek III., VII. parcella       │    │
│  │ Eredmény: Legjobb stabilitás (-1 cm változás)   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 38WX — Lazítókéses                              │    │
│  │ ───────────────────────────────────────────     │    │
│  │ Munkamélység: 35 cm + 55 cm lazítás             │    │
│  │ Teljesítményigény: 100-180 LE                   │    │
│  │ Jellemző: Dupla mélység, tömör talajokra        │    │
│  │                                                 │    │
│  │ Kutatásban: Szentkirály (hagyma)                │    │
│  │ Eredmény: Látható különbség a gyomosodásban     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 40SX — Mélyásógép                               │    │
│  │ ───────────────────────────────────────────     │    │
│  │ Munkamélység: 20-50 cm                          │    │
│  │ Teljesítményigény: 100-250 LE                   │    │
│  │ Jellemző: Legnagyobb mélység, heavy duty        │    │
│  │                                                 │    │
│  │ Kutatásban: Kecskemét-Borbás, Lakitelek I.      │    │
│  │ Eredmény: 10 cm különbség a kontrollhoz képest  │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  ALKALMAZÁSI MÓDOK                                      │
│  ─────────────────────────────────────────────────────  │
│  3 kártya:                                              │
│                                                         │
│  1. Önálló ásógép                                       │
│     Mikor: Jó szerkezetű talajokon                      │
│     Példa: Lakitelek I., III. parcella                  │
│     Eredmény: Stabil (-2 cm változás)                   │
│                                                         │
│  2. Lazítás + Ásógép                                    │
│     Mikor: Nagyon tömör, mély eketalpas talajokon       │
│     Példa: Lakitelek II., Szentkirály                   │
│     Eredmény: Nagy kezdeti lazaság, de gyorsabb         │
│               visszatömörödés (-7 cm)                   │
│                                                         │
│  3. Szántás + Ásógép ★ LEGJOBB                          │
│     Mikor: Hagyományos rendszerbe illeszkedve           │
│     Példa: Lakitelek VII., Kecskemét-Borbás             │
│     Eredmény: Legjobb stabilitás (-1 cm változás)       │
├─────────────────────────────────────────────────────────┤
│  ÁTVEZETŐ                                               │
│  ─────────────────────────────────────────────────────  │
│  "Hogyan teszteltük ezeket a gyakorlatban?"             │
│  CTA: "Ismerje meg a kísérletet"                        │
└─────────────────────────────────────────────────────────┘
```

---

## 4. KUTATÁS

### Cél
Bemutatni a kísérleti helyszíneket, körülményeket és a mérési módszertant.

### Tartalom
```
┌─────────────────────────────────────────────────────────┐
│  BEVEZETŐ                                               │
│  ─────────────────────────────────────────────────────  │
│  "3 helyszín, 7 kezelési mód, 4 hónap — tudományos      │
│   igényességgel vizsgáltuk az ásógép hatását."          │
│                                                         │
│  [TÉRKÉP] Magyarország térképe a 3 helyszínnel          │
├─────────────────────────────────────────────────────────┤
│  HELYSZÍNEK [Tab vagy kártya rendszer]                  │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ═══════════════════════════════════════════════════    │
│  LAKITELEK — Fő kísérleti terület                       │
│  ═══════════════════════════════════════════════════    │
│  Kultúra: Ipari paradicsom                              │
│  Talaj: Humuszos homok (KA: 27)                         │
│  Öntözés: 450 mm                                        │
│  Időszak: Május – Augusztus                             │
│                                                         │
│  7 parcella, 7 különböző kezelés:                       │
│  ┌────┬─────────────────────────────────────────────┐   │
│  │ I. │ Mélyásógép (40 cm)                          │   │
│  │II. │ Lazítás + Ásógép (30 cm)                    │   │
│  │III.│ Ásógép (30 cm)                              │   │
│  │IV. │ Lazítás + Szántás + Kombinátor (kontroll)   │   │
│  │ V. │ Szántás + Kombinátor (kontroll)             │   │
│  │VI. │ Lazítás + Szántás + Ásógép                  │   │
│  │VII.│ Szántás + Ásógép (25 cm)                    │   │
│  └────┴─────────────────────────────────────────────┘   │
│                                                         │
│  [DRÓNKÉP] Légifelvétel a parcellákról                  │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ═══════════════════════════════════════════════════    │
│  KECSKEMÉT-BORBÁS                                       │
│  ═══════════════════════════════════════════════════    │
│  Kultúra: Ipari paradicsom                              │
│  Talaj: Réti csernozjom (KA: 28)                        │
│  Öntözés: 400 mm                                        │
│  Időszak: Május – Június                                │
│                                                         │
│  Kezelések:                                             │
│  • Ásógépezett: Őszi szántás → Simítózás →              │
│                 Ásóborona → 40SX mélyásógép (45 cm)     │
│  • Kontroll: Őszi szántás → Simítózás → Ásóborona       │
│                                                         │
│  [FOTÓ] Növényzeti különbség júniusban                  │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ═══════════════════════════════════════════════════    │
│  SZENTKIRÁLY                                            │
│  ═══════════════════════════════════════════════════    │
│  Kultúra: Vöröshagyma                                   │
│  Talaj: Réti csernozjom (KA: 28,5)                      │
│  Öntözés: 350 mm                                        │
│  Időszak: Március – Június                              │
│                                                         │
│  Kezelések:                                             │
│  • Ásógépezett: Nehézkultivátor → 38WX (30 cm + 55 cm)  │
│  • Kontroll: Nehézkultivátor → Kombinátor               │
│                                                         │
│  [FOTÓ] Gyomosodási különbség                           │
├─────────────────────────────────────────────────────────┤
│  MÉRÉSI MÓDSZEREK                                       │
│  ─────────────────────────────────────────────────────  │
│  [Interaktív blokkok]                                   │
│                                                         │
│  1. PENETROMÉTERES MÉRÉS                                │
│     Mit mér: Talajok tömörödését (bar/cm²)              │
│     Gyakoriság: Havonta                                 │
│     Mélység: 0-60 cm                                    │
│     [Diagram] Példa penetrométeres görbe                │
│                                                         │
│  2. TALAJHŐMÉRSÉKLET MÉRÉS                              │
│     Mit mér: Felmelegedési sebesség                     │
│     Mélység: 5 cm, 10 cm, 20 cm                         │
│     Jelentősége: Korai tavaszi palántázás               │
│                                                         │
│  3. DRÓNFELVÉTELEK                                      │
│     Mit mér: Növényzeti index (NDVI)                    │
│     Gyakoriság: Havi rendszerességgel                   │
│     Jelentősége: Objektív összehasonlítás               │
│                                                         │
│  4. HELYSZÍNI MEGFIGYELÉS                               │
│     Mit vizsgál: Gyomosodás, növényfejlődés             │
│     Dokumentáció: Fotók, feljegyzések                   │
├─────────────────────────────────────────────────────────┤
│  IDŐBELI LEFOLYÁS                                       │
│  ─────────────────────────────────────────────────────  │
│  [TIMELINE vizualizáció]                                │
│                                                         │
│  MÁRCIUS ──── ÁPRILIS ──── MÁJUS ──── JÚNIUS ────       │
│     │            │           │          │               │
│     │         ┌──┴──┐     ┌──┴──┐    ┌──┴──┐            │
│  Szentkirály  │     │  Lakitelek  Kecskemét             │
│  indulás      │     │   indulás    │                    │
│               │     │              │                    │
│            Mérések              Végső                   │
│                                 mérések                 │
│                                                         │
│  ──── JÚLIUS ──── AUGUSZTUS                             │
│         │            │                                  │
│      Lakitelek    Végső                                 │
│      folytatás    értékelés                             │
├─────────────────────────────────────────────────────────┤
│  ÁTVEZETŐ                                               │
│  ─────────────────────────────────────────────────────  │
│  "Mit mutattak az adatok?"                              │
│  CTA: "Tekintse meg az eredményeket"                    │
└─────────────────────────────────────────────────────────┘
```

---

## 5. EREDMÉNYEK

### Cél
Összefoglalni a kutatás megállapításait és gyakorlati következtetéseit.

### Tartalom
```
┌─────────────────────────────────────────────────────────┐
│  FŐ MEGÁLLAPÍTÁSOK                                      │
│  ─────────────────────────────────────────────────────  │
│  [4 kiemelt kártya, számozva]                           │
│                                                         │
│  01 │ TARTÓSABB LAZASÁG                                 │
│     │ Az ásógépezett parcellák 5-10 cm-rel mélyebben    │
│     │ maradtak lazák a teljes tenyészidőszak alatt.     │
│                                                         │
│  02 │ GYORSABB FELMELEGEDÉS                             │
│     │ 2-4°C-kal melegebb talaj tavasszal —              │
│     │ kritikus a hideg 2025-ös tavaszban.               │
│                                                         │
│  03 │ JOBB VÍZGAZDÁLKODÁS                               │
│     │ A víz egyenletesebben oszlott el,                 │
│     │ mélyebb rétegekbe is lejutott.                    │
│                                                         │
│  04 │ LÁTHATÓ NÖVÉNYFEJLŐDÉS                            │
│     │ A paradicsom és hagyma állományok szemmel         │
│     │ láthatóan fejlettebbek voltak.                    │
├─────────────────────────────────────────────────────────┤
│  MŰVELÉSI MÓDSZEREK ÖSSZEHASONLÍTÁSA                    │
│  ─────────────────────────────────────────────────────  │
│  [Interaktív táblázat — Lakitelek adatai alapján]       │
│                                                         │
│  ┌───────────────────────────┬────────┬────────┬──────┐ │
│  │ Kezelés                   │Kezdeti │ Végső  │Válto-│ │
│  │                           │  (cm)  │  (cm)  │ zás  │ │
│  ├───────────────────────────┼────────┼────────┼──────┤ │
│  │ ★ Szántás + Ásógép        │   32   │   31   │  -1  │ │
│  │ Mélyásógép (40 cm)        │   33   │   31   │  -2  │ │
│  │ Ásógép (30 cm)            │   22   │   20   │  -2  │ │
│  │ Lazítás + Ásógép          │   35   │   28   │  -7  │ │
│  │ Lazítás + Szántás + Komb. │   35   │   28   │  -7  │ │
│  │ Csak szántás + Komb.      │   28   │   32   │  +4  │ │
│  └───────────────────────────┴────────┴────────┴──────┘ │
│                                                         │
│  Megjegyzés: A "Változás" oszlop a lazasági mélység     │
│  csökkenését mutatja. Minél kisebb a negatív szám,      │
│  annál stabilabb a talajszerkezet.                      │
├─────────────────────────────────────────────────────────┤
│  DRÓNFELVÉTELEK ELEMZÉSE                                │
│  ─────────────────────────────────────────────────────  │
│  [Előtte-Utána csúszka / Galéria]                       │
│                                                         │
│  LAKITELEK — Parcellák összehasonlítása                 │
│  ┌────────────────────┬────────────────────┐            │
│  │   ÁSÓGÉPEZETT      │    KONTROLL        │            │
│  │   parcellák        │    parcellák       │            │
│  │   (I., III., VII.) │    (IV., V.)       │            │
│  │                    │                    │            │
│  │   [DRÓNKÉP]        │    [DRÓNKÉP]       │            │
│  │                    │                    │            │
│  │   Sötétebb zöld =  │   Világosabb =     │            │
│  │   fejlettebb       │   gyengébb         │            │
│  │   növényzet        │   növényzet        │            │
│  └────────────────────┴────────────────────┘            │
│                                                         │
│  KECSKEMÉT-BORBÁS — Növekedési különbség                │
│  [Side-by-side fotó] 10 cm különbség júniusban          │
│                                                         │
│  SZENTKIRÁLY — Gyomosodás                               │
│  [Fotó] Kevesebb gyom az ásógépezett parcellán          │
├─────────────────────────────────────────────────────────┤
│  KÖVETKEZTETÉSEK                                        │
│  ─────────────────────────────────────────────────────  │
│  [Idézet doboz]                                         │
│  "A mélyásógép és a szántás+ásógép kombináció adta      │
│   a legstabilabb, legegyenletesebb eredményt a teljes   │
│   tenyészidőszak alatt."                                │
│                                                         │
│  A kutatás 4 kutatási kérdésre adott válasz:            │
│                                                         │
│  1. HATÁS A TALAJRA                                     │
│     → Tartósabb lazaság, jobb víz- és hőgazdálkodás     │
│                                                         │
│  2. SZERKEZETVÁLTOZÁS                                   │
│     → Az ásógépezett talaj stabilabb maradt, kisebb     │
│       visszatömörödés intenzív öntözés mellett is       │
│                                                         │
│  3. ÖNÁLLÓ VS. KOMBINÁLT ALKALMAZÁS                     │
│     → A szántás+ásógép kombináció a legjobb             │
│     → Önálló ásógép is jó eredményt ad                  │
│     → Lazítás+ásógép gyors visszatömörödést mutat       │
│                                                         │
│  4. MÓDSZEREK ÖSSZEHASONLÍTÁSA                          │
│     → Ásógépes kezelések egyértelműen jobbak            │
│     → A stabilitás fontosabb, mint a kezdeti mélység    │
├─────────────────────────────────────────────────────────┤
│  AJÁNLÁSOK                                              │
│  ─────────────────────────────────────────────────────  │
│  [4 ajánlási kártya ikonokkal]                          │
│                                                         │
│  💧 ÖNTÖZÉSES KULTÚRÁK                                  │
│     Paradicsom, hagyma, paprika — ahol gyakori          │
│     öntözés tömöríti a talajt                           │
│                                                         │
│  📐 EKETALP PROBLÉMÁK                                   │
│     Ahol a szántás tömör réteget hozott létre           │
│     25-30 cm mélyen                                     │
│                                                         │
│  🌡️ HIDEG TAVASZ                                        │
│     Gyorsabb felmelegedés = korábbi ültetés,            │
│     jobb kelés                                          │
│                                                         │
│  🌱 IGÉNYES NÖVÉNYEK                                    │
│     Mély gyökérzetű, talajigényes kertészeti kultúrák   │
├─────────────────────────────────────────────────────────┤
│  LEZÁRÁS                                                │
│  ─────────────────────────────────────────────────────  │
│  [Badge] Neumann János Egyetem × Agroskill Kft. — 2025  │
│                                                         │
│  [Opcionális] Letölthető PDF összefoglaló               │
│  [Opcionális] Kapcsolat / További információ            │
└─────────────────────────────────────────────────────────┘
```

---

## Változások a Jelenlegi Struktúrához Képest

| Jelenlegi | Javasolt | Miért jobb? |
|-----------|----------|-------------|
| Probléma | Probléma | Marad — ez jó |
| Megoldás (gépek bemutatása) | Technológia | Átnevezés + bővítés működési elvvel |
| Kísérletek (csak helyszínek) | Kutatás | Helyszínek + módszertan + timeline |
| Eredmények | Eredmények | Bővítés drónkép elemzéssel |
| — | — | Logikusabb sorrend: Techno → Kutatás |

### Főbb Struktúra Változások

1. **"Megoldás" → "Technológia"**
   - Először a működési elv, aztán a modellek
   - Egyértelmű kapcsolat a problémával

2. **"Kísérletek" → "Kutatás"**
   - Bővebb tartalom: helyszínek + módszertan + timeline
   - Tudományosabb megközelítés

3. **Sorrend csere: Technológia ELŐTT van a Kutatás ELŐTT**
   - Jelenlegi: Probléma → Megoldás → Kísérletek → Eredmények
   - Javasolt: Probléma → Technológia → Kutatás → Eredmények
   - Logika: Először megértem a gépet, aztán látom, hol használták

4. **Drónképek integrálása az Eredményekbe**
   - Vizuális bizonyítékok a szöveges adatok mellett

---

## Navigáció

```
┌────────────────────────────────────────────────────────────────┐
│  FŐOLDAL  │  PROBLÉMA  │  TECHNOLÓGIA  │  KUTATÁS  │ EREDMÉNYEK│
└────────────────────────────────────────────────────────────────┘
```

Vagy rövidebb címekkel:
```
┌────────────────────────────────────────────────────────────────┐
│  KEZDŐ  │  MIÉRT?  │  HOGYAN?  │  HOL?  │  EREDMÉNY  │
└────────────────────────────────────────────────────────────────┘
```

---

## Következő Lépések

1. [ ] Döntés a struktúráról (elfogadod / módosítasz?)
2. [ ] Drónképek és fotók összegyűjtése
3. [ ] Hiányzó tartalmak azonosítása
4. [ ] Komponens tervezés az új oldalakhoz
5. [ ] Implementáció
