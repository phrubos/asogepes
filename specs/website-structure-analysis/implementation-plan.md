# Implementációs Terv: Weboldal Logikai Újratervezés

## Javasolt Megközelítés
**Opció A**: A jelenlegi struktúra finomhangolása - a Hero és design marad, a tartalmi fókusz változik.

---

## Fázis 1: Probléma Oldal Átdolgozás
> **Cél**: A "miért kell változtatni?" kérdés tisztább bemutatása

### [x] 1.1 Probléma oldal struktúra átszervezése
Jelenlegi tabok:
- "Öntözéses Termesztés Kihívása" 
- "Hagyományos Művelés Problémái"

Javasolt új tabok:
- **"A Tömörödés Problémája"** - öntözés + gépek hatása
- **"Miért Nem Elég a Szántás?"** - eketalp, rétegkeverés, talajélet

### [x] 1.2 Új vizuális elem: Talajszelvény összehasonlítás (placeholder kész)
Szántott vs. ásógépezett talaj szerkezete (cross-section ábra)

### [x] 1.3 Tudományos hivatkozások hozzáadása
Források megjelölése a szakdolgozatból (oldal, ábra számok)

---

## Fázis 2: Megoldás Oldal Bővítés
> **Cél**: Az "ásógép önmagában vs. kombinációban" kérdés bemutatása

### [x] 2.1 Működési elv részletezése
- Dupla rotor rendszer vizualizáció javítása
- "Forgatás nélküli lazítás" koncepció kiemelése

### [x] 2.2 Új szekció: Alkalmazási Módok
| Mód | Leírás | Mikor ajánlott? |
|-----|--------|-----------------|
| Önálló ásógép | Csak ásógép, mélyen | Jó szerkezetű talajokon |
| Lazítás + Ásógép | Előtte mélylazítás | Tömör, nehéz talajokon |
| Szántás + Ásógép | Őszi szántás után | Hagyományos gazdálkodásban |

### [x] 2.3 Géptípusok vizuális összehasonlítása
38SX, 38WX, 40SX kártyák képekkel és specifikációkkal

---

## Fázis 3: Kísérlet Oldal Fejlesztés
> **Cél**: A "művelési módszerek összehasonlítása" központba helyezése

### [x] 3.1 Lakitelek helyszín kiemelése
A 7 kezeléses kísérlet részletes bemutatása:
- Interaktív táblázat vagy grouped bar chart
- Kezelések magyarázata (mit jelent a "lazítás + szántás + ásógép"?)
- Legjobb eredmények kiemelése (I, III, V, VII)

### [x] 3.2 Idővonalas vizualizáció
Szerkezetváltozás egy termesztési ciklus alatt:
```
Március → Április → Május → Június → (Július) → Augusztus
   │         │         │        │                    │
   ▼         ▼         ▼        ▼                    ▼
[Lazaság csökkenés vizualizáció ásógép vs. kontroll]
```

### [x] 3.3 Szentkirály és Kecskemét adatok frissítése
- Grafikonok javítása (chart data már megvan)
- "Látható különbség" fotók placeholder → valódi képek

---

## Fázis 4: Eredmények Oldal Kibővítés
> **Cél**: Tudományos következtetések részletes bemutatása

### [x] 4.1 Négy fő megállapítás vizuális javítása
1. Tartósabb lazaság (5-10 cm különbség)
2. Gyorsabb felmelegedés (2-4°C)
3. Jobb vízgazdálkodás
4. Látható növényfejlődés

### [x] 4.2 Új szekció: Számokban
Összesített statisztikák:
- 3 helyszín
- 4 hónap
- 7 kezelés
- X mérés összesen

### [x] 4.3 Új szekció: Ajánlások
Mikor érdemes ásógépet használni?
- Öntözéses kultúrák
- Kertészeti termesztés
- Tömör talajok
- Eketalp-problémák esetén

### [x] 4.4 Összehasonlító táblázat
| Kezelés | Lazaság megőrzés | Ajánlott |
|---------|------------------|----------|
| Csak szántás | ⭐⭐ | Nem |
| Ásógép önmagában | ⭐⭐⭐⭐ | Igen |
| Szántás + Ásógép | ⭐⭐⭐⭐⭐ | Legjobb |

---

## Fázis 5: Navigáció és UX Javítások

### [x] 5.1 Oldalak közötti navigáció
Minden oldal végén: "Előző" / "Következő" gombok

### [ ] 5.2 Progress indicator (opcionális)
Vizuális jelzés, hogy a látogató hol tart a "történetben"

### [ ] 5.3 Anchor linkek (opcionális)
Hosszabb oldalakon belüli navigáció (pl. Kísérlet oldalon helyszín-választó)

---

## Fázis 6: Adatbővítés (opcionális)

### [ ] 6.1 PDF/PPTX tartalom kinyerése
Ha a felhasználó elérhetővé teszi a fájlok tartalmát:
- Ábrák exportálása
- Táblázatok adatai
- Fotók a helyszínekről

### [ ] 6.2 Új adatok integrálása `data.ts`-be

---

## Prioritási Sorrend

1. **Magas**: Fázis 3 (Kísérlet) - a legtöbb adat itt van, de nincs jól kihasználva
2. **Magas**: Fázis 4 (Eredmények) - túl rövid jelenleg
3. **Közepes**: Fázis 2 (Megoldás) - alkalmazási módok hiányoznak
4. **Közepes**: Fázis 1 (Probléma) - jó alapok, finomhangolás kell
5. **Alacsony**: Fázis 5-6 - UX és extra adatok

---

## Állapot: IMPLEMENTÁLVA ✅

**Opció A választva és megvalósítva** - 2024.12.02

### Elkészült módosítások:
- ✅ Probléma oldal új tabokkal („A Tömörödés Problémája”, „Miért Nem Elég a Szántás?”)
- ✅ Talajszelvény összehasonlító komponens (SoilComparison) placeholder ábrákkal
- ✅ Megoldás oldal Alkalmazási Módok szekcióval bővítve
- ✅ Kísérlet oldal idővonal vizualizációval (Timeline komponens)
- ✅ Lakitelek 7 kezelés kiemelt bemutatása következtetésekkel
- ✅ Eredmények oldal összehasonlító táblázattal, statisztikákkal, ajánlásokkal
- ✅ Oldalak közötti navigáció (PageNavigation) integrálva

### Következő lépések (opcionális):
- [ ] Valódi ábrák/fotók hozzáadása a placeholder-ek helyére
- [ ] PDF/PPTX tartalom kinyerése további adatokhoz
- [ ] Progress indicator hozzáadása
