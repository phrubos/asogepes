# Mobil újratervezés (≤1024 px) — spec

Dátum: 2026-11-01 · Alap: telefonos audit (390 px, production build, mind a 4 oldal), `frontend-design`, `ux-heuristics`, `information-architecture`, `apple-design` elvek.

## Kinek, mire
- **Kik:** kertészek, gazdálkodók, szaktanácsadók — gyakran a táblán, telefonon, napfényben, egy kézzel; plusz egyetemi/szakmai olvasók.
- **Fő feladat:** megérteni a problémát (tömörödés) → a megoldást (ásógép) → a bizonyítékot (mérések), és megtalálni egy konkrét adatot (pl. „Lakitelek, melyik kombináció lett a legjobb”).
- **Elv:** telefonon a tartalom *olvasható dokumentum*, nem asztali látványelem lekicsinyítve. Minden információ koppintás nélkül vagy egyetlen, egyértelmű koppintással elérhető.

## Audit — amit javítani kell
| # | Hol | Probléma |
|---|---|---|
| A1 | minden tartalmi oldal | Két navigáció alul (pöttysor + feliratok) **és** a „Görgess lejjebb” korong — eltakarják a tartalmat, kicsik, nem mondják meg, hol vagyok |
| A2 | minden | `min-height: 100vh` szekciók → 600–1500 px üres sávok (pl. a kultivátor-összehasonlítás után, az Alkalmazási útmutató előtt) |
| A3 | minden | `whileInView` belépők: a tartalom félig átlátszó/hiányzik, amíg nem animál (a 38SX modell szinte láthatatlan volt a képen) |
| A4 | /problema hero | A három „ásó” kártya rálóg az alcímre; alatta ~400 px üres talajdoboz |
| A5 | /problema, kártyák | Lenyitható kártyák 1–2 mondatnyi tartalommal (a hover-örökség) — fölösleges koppintás |
| A6 | /problema, InteractiveSoil | A felirat-doboz eltakarja a szimulációt; a „szimulált állapot” kártyák szétesnek (2+1 rács) |
| A7 | /technologia, működési elv | A diagram feliratai egymásra csúsznak; a szekció nagy része üres |
| A8 | /technologia, modellek | Asztali kétoszlopos elrendezés összenyomva: apró fotó, apró adatok |
| A9 | /kutatas, statisztika | 3 oszlop 390 px-en: tördelt, nehezen olvasható |
| A10 | /kutatas, helyszín-adatok | 2 oszlopos adatrács hosszú címkékkel („ARANY-FÉLE KÖTÖTTSÉG (KA)”) — zsúfolt |
| A11 | /kutatas, hőkép | A kép 330 px széles, a mérési pontok (A–E) és nyilak egymásra kerülnek; a magyarázat lent, elválasztva a képtől |
| A12 | /kutatas, Lakitelek | 3D-modell helyőrző ~450 px; az eredménylista szövegei levágva („…”) |
| A13 | mindenhol | Középre zárt hosszú bekezdések (rossz olvashatóság), versal címkék minden blokk fölött |

## Tervezési rendszer (mobil)
A márka marad (földszínek, arany, Fraunces + Inter) — a rendszer **fegyelmezi**, nem cseréli.

**Szín** (meglévő tokenek, szerepek rögzítve)
- `--color-earth-900 #1A1612` alap háttér · `--color-earth-800 #2D251E` felület (blokkok) · `--color-cream #F5F0E8` szöveg · `rgba(245,240,232,.72)` másodlagos szöveg
- `--color-gold #D4A84B` **csak** interakció + kiemelt adat (egy jelentés: „ezt nézd / ezt nyomd meg”)
- adat-páros: kontroll = `#8A7F72` (semleges kő), ásógép = `--color-gold`. Hibát/rosszat jelző piros csak ott, ahol a tartalom figyelmeztet (eketalp).
- a talaj-SVG-k világoskék ege → hajnali föld-ég (`#C9B79C` → `#E8DCC4`), kék kikerül.

**Tipográfia**
- Fraunces: H1 30/34 px, H2 24/30, H3 19/26 — címek balra zárva.
- Inter: törzs 16/26 px, másodlagos 15/22, adatcímke 13/18 (mondatbetűs, nem versal), szám-adat `font-variant-numeric: tabular-nums`.
- Hosszú szöveg balra zárva, max. ~65 karakter. Középre zárás csak 1 soros címkén.

**Térköz és ritmus**
- oldalmargó 20 px; szekciók között 64 px; blokkon belül 16/24 px.
- nincs `100vh` — minden szekció a tartalmához nő.
- egy lekerekítés-skála: 12 px blokk, 999 px gomb/chip; árnyék csak a lebegő elemen (navigáció, lap).

**Mozgás**
- Telefonon nincs belépő animáció (a tartalom azonnal ott van). Mozgás csak válaszként: lap nyílik, akkordeon nyílik, szekcióugrás. Végtelen díszanimáció csak látótérben (`useLoopActive`), reduce esetén sehol.

**Érintés**
- célpont ≥ 44 px; semmi nem függ hovertől; minden interaktív elem `button`/`a`.

## Minták
1. **Szekciónavigáció (A1).** Egyetlen vékony, tapadó sáv az oldal tetején: bal oldalt az aktuális szekció neve (pl. „Szántás korlátai · Hatások”), jobb oldalt „Tartalom” gomb → alsó lap (bottom sheet) a szekciók és alszekciók listájával, az aktuális kiemelve. A pöttysor és a „Görgess lejjebb” korong ≤1024 px-en megszűnik. A lap: fókuszcsapda, Esc/háttér-koppintás zár, `?section=` mélylinkek változatlanok.
2. **Statikus tartalom a lenyitható helyett (A5).** 3 mondat alatt: a szöveg mindig látszik (ikon + cím + szöveg lista). Hosszabbnál: akkordeon, teljes szélességű, 48 px-es fejléc, chevron.
3. **Adatpár (A9, A10).** Címke fölötte, érték alatta, egy oszlopban, finom elválasztóvonallal (definíciós lista) — nem kártyarács.
4. **Összehasonlítás.** Kontroll vs. ásógép mindig ugyanabban a sorrendben és színben; a különbség számszerűen kiírva (pl. „+3,0 °C”).
5. **Kép + jelölések (A11).** A kép teljes szélességben (kilóg a margóból), alatta a jelölések listája (A–E: érték + leírás); koppintásra teljes képernyős nézet nagyítással.
6. **Nehéz interaktív elem (A12).** Előnézeti kép + „3D modell megnyitása” gomb; a lista alapból teljes szöveggel, levágás nélkül.

## Oldalankénti döntések
- **Főoldal:** marad (jó állapotban); a statisztika 3 oszlopa egy sorba kerül kompakt formában; lábléc rendezése.
- **/problema:** hero = cím + alcím + három sor „ellenség” lista (szám nélkül nem — itt sorrend: mélység szerint 0–20 / 20–35 / 35+ cm, így a mélység a jelölő), koppintásra ugrik. Az InteractiveSoil: felirat a kép alá, a szimulált állapot 3 sorban. Kultivátor-fotó 16:10 vágás. Kártyák → 2. minta.
- **/technologia:** hero témalista (kész). Működési elv: a diagram egyszerűsített mobil változata, feliratok számozott jelölőkkel a kép alatt. Modellek: fotó teljes szélességben, adatok adatpárként, modellek között vízszintes váltó (38SX / 38WX / 40SX szegmens-vezérlő). Útmutató: 4 blokk megmarad, csillag helyett „Szerkezet tartóssága: 4/5” szöveg + sáv.
- **/kutatas:** statisztika 3 sorban (szám + magyarázat). Térkép kisebb, a helyszínek alatta gombként. Helyszín-adatok → 3. minta. Diagramok teljes szélesség. Hőkép → 5. minta. Lakitelek: 3D → 6. minta; eredménylista teljes szöveggel, rangsor szerint.

## Hatókör
- Csak ≤1024 px. Az asztali nézet nem változik (minden új stílus `@media (max-width: 1024px)` alatt vagy mobil-only komponensben).
- Adatok, szövegek tartalma nem változik (csak elrendezés, címkék írásmódja).
- Nem része: 2026-os adatok, évválasztó, asztali újratervezés.

## Elfogadás (mérhető)
- `clip-check`, `type-check` (+ új: törzsszöveg ≥ 16 px telefonon), `touch-check`, `motion-check`, `nav-check` zöld.
- Új `mobile-check.js`: 390 px-en (a) nincs 300 px-nél magasabb üres sáv a tartalom között, (b) nincs átfedő szöveg, (c) minden interaktív célpont ≥ 44 px, (d) egyetlen lebegő navigációs elem.
- Oldalhossz telefonon legalább 25%-kal rövidebb a mostaninál (/problema 8665, /technologia 7786, /kutatas 13263 px) úgy, hogy tartalom nem vész el.
- Mobil TBT nem nő (≤ 450 ms), CLS ≤ 0,05.
- Képernyőkép-összevetés minden oldalról előtte/utána.
