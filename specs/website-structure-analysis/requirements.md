# Weboldal Struktúra Elemzés és Újratervezés

## Projekt Célja
Az Imants ásógépek talajra gyakorolt hatásának tudományos igényű, de közérthető bemutatása.

## Három Fő Kutatási Kérdés (a felhasználó által megadott)
1. **Ásógépezett talajok szerkezete hogyan változik egy termesztési ciklus alatt**
2. **Ásógépek alkalmazása önmagukban, és más művelő eszközzel**
3. **Különböző művelési módszerek összehasonlítása**

---

## Jelenlegi Weboldal Struktúra

| Útvonal | Szekció | Tartalom |
|---------|---------|----------|
| `/` | Hero | "A talaj nem végtelen erőforrás" + statisztikák |
| `/problema` | 01 - A Probléma | Öntözéses termesztés kihívásai + hagyományos művelés problémái |
| `/megoldas` | 02 - A Megoldás | Imants ásógép bemutatása, működési elv, előnyök |
| `/kiserlet` | 03 - A Kísérlet | 3 helyszín (Szentkirály, Kecskemét, Lakitelek) adatai |
| `/eredmenyek` | 04 - Eredmények | 4 fő megállapítás összefoglalása |

---

## Elemzés: Mi Működik Jól

✅ **Logikus felépítés** - Probléma → Megoldás → Kísérlet → Eredmények narratíva követhető

✅ **Tudományos megalapozottság** - Konkrét helyszínek, mérési adatok, százalékos változások

✅ **Vizuális elemek** - Interaktív talajszelvény, grafikonok, összehasonlító képek terve

✅ **Hero szekció** - Erős üzenet, jó statisztikák

---

## Elemzés: Fejlesztendő Területek

### 1. A három kutatási kérdés nem jelenik meg tisztán
A felhasználó által megadott 3 fő kérdés nem különül el egyértelműen:
- A "szerkezetváltozás egy ciklus alatt" részben benne van, de nem hangsúlyos
- Az "önmagában vs. kombinálva" kérdés csak Lakiteleken jelenik meg
- A "művelési módszerek összehasonlítása" elszórtan van

### 2. Lakitelek kísérlet kiemelt jelentősége
A Lakitelek helyszín **7 különböző kezelést** hasonlít össze - ez a leggazdagabb adat, de a jelenlegi struktúrában egyenrangú a másik két helyszínnel.

### 3. Hiányzó kontextus
- Mi az ásógép előnye a **szántással** szemben? (eketalp, rétegkeverés)
- Miért fontos a **nem forgatásos** művelés?
- Hogyan kapcsolódik a **fenntartható gazdálkodáshoz**?

### 4. Eredmények oldal túl rövid
4 pont nem elegendő a kutatás mélységének bemutatásához.

---

## Javasolt Új Struktúra

### Opció A: Jelenlegi struktúra finomhangolása (ajánlott)
A Hero és az alapstruktúra marad, de az oldalak tartalma átszerveződik.

| Útvonal | Szekció | Új Fókusz |
|---------|---------|-----------|
| `/` | Hero | Marad |
| `/problema` | 01 - Miért Kell Változtatni? | Tömörödés problémája + hagyományos vs. modern művelés |
| `/megoldas` | 02 - Az Ásógép Technológia | Működési elv + **ásógép önmagában vs. kombinációban** |
| `/kiserlet` | 03 - A Kutatás | Helyszínek + **művelési módszerek összehasonlítása** |
| `/eredmenyek` | 04 - Összefoglalás | Fő megállapítások + **szerkezetváltozás időbeli vizualizáció** |

### Opció B: Kutatási kérdések szerinti struktúra
Minden fő kérdés külön oldal.

| Útvonal | Tartalom |
|---------|----------|
| `/` | Hero |
| `/bevezetes` | A probléma + Az ásógép megoldás |
| `/szerkezetvaltozas` | Egy termesztési ciklus alatti változások (idővonalas) |
| `/alkalmazas` | Ásógép önmagában vs. más eszközökkel |
| `/osszehasonlitas` | Művelési módszerek teljes összehasonlítása |
| `/kovetkeztetesek` | Eredmények, javaslatok |

---

## Forrásanyagok Alapján Szükséges Tartalom

A PDF és PPTX fájlok túl nagyok a közvetlen olvasáshoz. A `data.ts` alapján a következő adatok már rendelkezésre állnak:

### Helyszínek
- **Szentkirály**: Vöröshagyma, réti csernozjom, 4 mérés (márc-jún)
- **Kecskemét-Borbás**: Ipari paradicsom, réti csernozjom, 2 mérés (máj-jún)
- **Lakitelek**: Ipari paradicsom, humuszos homok, 7 kezelés (máj-aug)

### Kezelési Kombinációk (Lakitelek)
| # | Kezelés | Máj. | Aug. | Változás |
|---|---------|------|------|----------|
| I. | Mélyásógép (40 cm) | 33 | 31 | -2 ✓ |
| II. | Lazítás + Ásógép (30 cm) | 35 | 28 | -7 |
| III. | Ásógép (30 cm) | 22 | 20 | -2 ✓ |
| IV. | Lazítás + Szántás + Kombinátor | 35 | 28 | -7 |
| V. | Szántás + Kombinátor | 28 | 32 | +4 ✓ |
| VI. | Lazítás + Szántás + Ásógép | 36 | 29 | -7 |
| VII. | Szántás + Ásógép (25 cm) | 32 | 31 | -1 ✓ |

**Kulcs megállapítás**: A mélyásógép (I.) és a szántás+ásógép (VII.) adta a legstabilabb eredményt!

---

## Döntésre Váró Kérdések

1. **Melyik struktúra opciót választjuk?** (A finomhangolás vagy B új struktúra)
2. **Van-e hozzáférés a PDF/PPTX tartalmához?** (képek, ábrák, további adatok)
3. **Kell-e külön oldal a géptípusoknak?** (38SX, 38WX, 40SX)
4. **Lesz-e "Rólunk" vagy "Kapcsolat" oldal?**
