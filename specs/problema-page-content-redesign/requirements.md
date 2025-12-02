# Probléma Oldal Tartalom Újratervezése - Követelmények

## Áttekintés

A "Probléma" oldal jelenlegi tartalma nem illeszkedik megfelelően a kutatás céljához. Az oldalt át kell dolgozni, hogy pontosan bemutassa az öntözéses kertészeti termesztés specifikus kihívásait és azt, hogy miért volt szükséges különböző talajművelési módszerek összehasonlítása.

## Kutatás Célja (Kontextus)

**Fő cél:** Az Imants ásógépek talajra gyakorolt hatásának elemzése
- Ásógépezett talajok szerkezete hogyan változik egy termesztési ciklus alatt
- Ásógépek alkalmazása önmagukban, és más művelő eszközzel
- Különböző művelési módszerek összehasonlítása

## Jelenlegi Problémák

### 1. Fókusz és Üzenet
- ❌ Túl általános - nem specifikusan az ásógép kutatásra fókuszál
- ❌ Eketalp-központú - csak egy probléma, nem a teljes kontextus
- ❌ Hiányzó kutatási kontextus - nem mondja el, miért készült ez a kutatás
- ❌ Nem építi fel a narratívát - nem vezeti be az összehasonlítás szükségességét

### 2. Tartalom
- ❌ "A Láthatatlan Fal" cím túl dramatikus és nem releváns
- ❌ "Miért fullad meg..." idézet nem kapcsolódik a kutatáshoz
- ❌ Consequence kártyák túl általánosak
- ❌ Hiányoznak a konkrét mérési adatok a szakdolgozatból

### 3. Logikai Folyam
- ❌ Nem világos, hogy ez egy 2025-ös kutatás bemutatása
- ❌ Nem készít elő a következő oldalakra (Megoldás → Kísérletek → Eredmények)

## Követelmények

### FR1: Két Tab Struktúra Megtartása
- **Prioritás:** MUST
- A jelenlegi 2 tabes felépítés működik, megtartandó
- Tab animációk és UX megmarad

### FR2: Tab 1 - "Öntözéses Termesztés Kihívása"

#### FR2.1: Kontextus Bemutató Szekció
- **Prioritás:** MUST
- Statisztika kiemelés: 350-450 mm öntözővíz / szezon
- Bevezető szöveg: Intenzív öntözéses kertészeti kultúrák (paradicsom, hagyma)
- Fő probléma: Talaj gyorsan tömörödik a nagy mennyiségű víz hatására

#### FR2.2: Kihívás Kártyák (3 db)
- **Prioritás:** MUST
- **Kártya 1:** Gyakori öntözés
  - Icon: droplet vagy clock
  - Leírás: 4-7 naponként szükséges öntözés
  - Adat: "6-7 nap" vagy "4-5 nap" konkrét helyszínektől függően

- **Kártya 2:** Nagy gépek súlya
  - Icon: tractor vagy weight
  - Leírás: Nehéz gépek taposása tömöríti a talajt
  - Adat: Öntözőgépek, traktorok

- **Kártya 3:** Talajszerkezet romlása
  - Icon: layers vagy compress
  - Leírás: A szerkezet fokozatosan romlik a szezon során
  - Adat: "20-50% romlás" konkrét mérésekből

#### FR2.3: Központi Kérdés Kiemelés
- **Prioritás:** MUST
- Blockquote vagy highlighted box
- Szöveg: "A kérdés: Melyik művelési módszer tudja LEGJOBBAN megőrizni a talaj laza szerkezetét egy teljes termesztési ciklus alatt?"

#### FR2.4: InteractiveSoil Vizualizáció
- **Prioritás:** MUST
- Megtartani a jelenlegi InteractiveSoil komponenst
- VAGY: Módosítás "előtte-utána" összehasonlításra
  - Bal oldal: Öntözés előtt (laza szerkezet)
  - Jobb oldal: Öntözés után (tömör szerkezet)

### FR3: Tab 2 - "Hagyományos Művelés Problémái"

#### FR3.1: Új ConsequenceCard Tartalom (4 db)
- **Prioritás:** MUST

**Kártya 1: Gyors tömörödés**
- Title: "Gyors tömörödés"
- Description: "Szántott talajon 30 nap alatt 20-50%-os szerkezetromlás intenzív öntözés mellett"
- Icon: compress
- Data badge: "Szentkirály: 35cm → 5cm (június)"
- Forrás: Szakdolgozat 13. ábra, 32. oldal

**Kártya 2: Biológiai élet károsodása**
- Title: "Biológiai élet károsodása"
- Description: "A forgatás során az aerob és anaerob rétegek felcserélése károsítja a talajéletet"
- Icon: activity
- Data badge: "Széntartalom oxidálódása"
- Forrás: Szakdolgozat 7. oldal (2.3.2. Az eke története)

**Kártya 3: Lassú tavaszi felmelegedés**
- Title: "Lassú tavaszi felmelegedés"
- Description: "Tömör talajszerkezet → késleltetett növényfejlődés. 2025 hideg tavaszán kritikus volt."
- Icon: thermometer
- Data badge: "2-4°C különbség mérve"
- Forrás: Szakdolgozat 14., 16. ábra

**Kártya 4: Nem egyenletes vízgazdálkodás**
- Title: "Nem egyenletes vízgazdálkodás"
- Description: "A tömör rétegek akadályozzák a víz egyenletes eloszlását a talajban"
- Icon: droplet
- Data badge: "Pangóvíz ÉS kiszáradás"
- Forrás: Szakdolgozat 11., 17. ábra

#### FR3.2: ConsequenceImage Fejléc
- **Prioritás:** SHOULD
- Megtartani a jelenlegi ConsequenceImage komponenst
- VAGY: Lecserélni relevánsabb képre (pl. tömörödött talaj, összehasonlító fotó)

#### FR3.3: Lezárás Szekció
- **Prioritás:** MUST
- Alert/figyelmeztetés box
- Szöveg: "Ezért kellett megvizsgálni: Különböző művelési módszerek (szántás, kultivátor, ásógép, lazítás) hogyan hatnak a talaj szerkezetének változására egy teljes termesztési ciklus alatt."
- CTA gomb: "→ Tovább a megoldásra" (link a /megoldas oldalra)

### FR4: Adatintegráció a Szakdolgozatból

#### FR4.1: Konkrét Mérési Adatok Használata
- **Prioritás:** MUST
- Szentkirály penetrométer adatok (13. ábra)
- Kecskemét penetrométer adatok (15. ábra)
- Talajhőmérséklet adatok (14., 16. ábra)
- Öntözési mennyiségek (17. oldal, 3.1.9)

#### FR4.2: Statisztikák Formázása
- **Prioritás:** SHOULD
- Számok kiemelése: nagy betűméret, bold
- Mértékegységek: kisebb, light font
- Példa: "350-450 mm" vagy "2-4°C"

### FR5: Vizuális Konzisztencia

#### FR5.1: Színséma
- **Prioritás:** SHOULD
- Probléma szekció: Meleg színek (narancs, piros árnyalatok)
- Figyelmeztető elemek: Sárga/narancs
- Adatok: Semleges színek (zöld, kék mint kiegészítő)

#### FR5.2: Ikonográfia
- **Prioritás:** MUST
- Lucide-react ikonok használata (konzisztencia)
- Javasolt ikonok:
  - droplet (víz)
  - compress (tömörödés)
  - thermometer (hőmérséklet)
  - activity (biológiai élet)
  - alert-triangle (figyelmeztetés)
  - layers (talajrétegek)

### FR6: Responsivitás
- **Prioritás:** MUST
- Mobile: Egy oszlopos elrendezés
- Tablet: Két oszlopos grid
- Desktop: Grid layout (konzekvencia kártyák 2x2)

### FR7: Animációk és Átmenetek
- **Prioritás:** SHOULD
- Megtartani a jelenlegi Framer Motion animációkat
- Tab váltás: 3D flip animáció (jelenlegi)
- Kártyák: Stagger animáció betöltéskor
- Hover effektek: Subtle scale és shadow

## Nem Funkcionális Követelmények

### NFR1: Teljesítmény
- **Prioritás:** MUST
- Oldal betöltési idő < 2 másodperc
- Smooth animációk (60 FPS)

### NFR2: Hozzáférhetőség
- **Prioritás:** SHOULD
- Szemantikus HTML használata
- Alt szövegek képekhez
- Keyboard navigation támogatása

### NFR3: SEO
- **Prioritás:** SHOULD
- Meta description frissítése az új tartalomhoz
- Megfelelő heading hierarchy (h1, h2, h3)

## Kizárások (Out of Scope)

- ❌ Unit tesztek (a create-feature workflow szerint)
- ❌ E2E tesztek
- ❌ Új komponensek létrehozása (kivéve, ha szükséges)
- ❌ Navigation módosítása
- ❌ Más oldalak módosítása (csak Probléma oldal)

## Sikerkritériumok

1. ✅ A tartalom egyértelműen bemutatja a kutatás kontextusát
2. ✅ A látogató megérti, miért volt szükséges a különböző művelési módszerek összehasonlítása
3. ✅ Konkrét adatok (számok) szerepelnek a szakdolgozatból
4. ✅ Logikus átmenet a következő oldalra (Megoldás)
5. ✅ Vizuálisan vonzó és professzionális megjelenés
6. ✅ Működik minden képernyőméreten

## Hivatkozások

- Szakdolgozat PDF: `inputs/Szakdolgozat végleges verzió.pdf`
- Jelenlegi implementáció: `src/app/problema/page.tsx`
- Adatok: `src/lib/data.ts`
- Komponensek: `src/components/problem/`
