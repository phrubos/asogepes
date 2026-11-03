# Több év egy oldalon: adatok és design-rendszer

2026-11-02. Forrás: Google Drive „Ásógép-2026” mappa (megosztva), a repó `src/lib/data.ts` (2025).
Minden szám a forrásfájlokból van kiolvasva; ahol a forrás bizonytalan, az külön jelölve van.

## 1. Mi van a mappában

| Fájl | Helyszín | Év | Tartalom |
|---|---|---|---|
| `HalasiErnő-Vöröshagyma-MK-2026-kész.xlsx` | Szentkirály, Dugár tanya (Halasi Ernő) | 2026 | 10 mérési pont, 4 kezelés, 4 mérés (03.06–06.26), fenológia (06.26, 07.22) |
| `VD-paradicsom-2026-kész.xlsx` | Szentkirály, „Geo pont” (Vörös Dezső) | 2026 | 6 pont, 2 kezelés, 3 mérés (04.14, 06.10, 07.22), hajtáshossz (07.02) |
| `Lakitelek ásógépes kísérlet 1-7-2026-kész.xlsx` | Lakitelek 061/30-32 hrsz. (Univer-Agro Kft.) | 2026 | 7 parcella × 5 pont, 3 mérés (04.10, 05.19, 07.21), fenológia (05.19) |
| `MikrobioMeter-2025-2026.xlsx` | Lakitelek (2025, 2026), Szentkirály mindkét tábla (2026) | 2025 + 2026 | Élő mikrobiális szén (µgC/g), gomba:baktérium arány, 3 párhuzamos minta |
| `Képek-HE-vöröshagyma`, `Képek-VD-ip_paradicsom`, `Képek-Univ-Lakitelek` | | 2026 | fotók (a Drive-csatolón keresztül nem olvashatók be) |

2027-es adat még nincs. Kecskemét-Borbásról nincs 2026-os mérés.

### Helyszín × év lefedettség

| Helyszín | 2025 | 2026 | Kultúra |
|---|---|---|---|
| Szentkirály · vöröshagyma (Halasi E.) | ✔ | ✔ | vöröshagyma mindkét évben |
| Kecskemét-Borbás | ✔ | – | ipari paradicsom (2025) |
| Lakitelek | ✔ | ✔ | 2025 ipari paradicsom → 2026 rozs |
| Szentkirály · paradicsom (Vörös D.) | – | ✔ új | ipari paradicsom |

Következmény: a helyszínek évről évre ki- és belépnek, és a kultúra is változhat. A design nem feltételezheti, hogy minden helyszínnek minden éve megvan.

## 2. Ellenőrzött 2026-os adatok

### Szentkirály · vöröshagyma

A teljes tábla 2025 őszén kultivátort + ásógépet kapott. A kezelések csak a 2026. februári munkában térnek el:

| Kezelés | 2026. február | Mérési pontok |
|---|---|---|
| Kontroll (K) | kultivátor | 3 (K-1, K-2, K-4) |
| Ásógép (Á) | ásógép | 4 (Á-1, Á-2, Á-4, Á-6) |
| Kontroll + mélyásógép (K-m) | kultivátor + mélyásógép | **1** (K-3m) |
| Ásógép + mélyásógép (Á-m) | ásógép + mélyásógép | 2 (Á-3m, Á-5m) |

Laza réteg (>20 bar alatt), cm, pontátlag:

| | 03.06 | 04.14 | 05.19 | 06.26 |
|---|---|---|---|---|
| K | 28,0 | 37,0 | 35,7 | 7,0 |
| Á | 33,5 | 39,2 | 38,8 | 17,6 |
| K-m | 45,0 | 39,3 | 38,3 | 32,0 |
| Á-m | 43,0 | 44,3 | 43,7 | 26,0 |

Talajhőmérséklet (3 cm / 10 cm, °C) és léghőmérséklet:

| | K | Á | Levegő |
|---|---|---|---|
| 03.06 | 15,7 / 10,5 | 15,9 / 10,2 | 10,5 |
| 04.14 | 16,7 / 15,3 | 18,3 / 16,7 | 15,0 |
| 05.19 | 24,4 / 20,8 | 24,4 / 20,9 | 17,5 |
| 06.26 | 32,0 / 27,6 | 28,0 / 25,3 | 30,0 |

- Víztelítettség 06.26, 10 cm: K-pontok 22,0–28,3 V/V%, Á-pontok 30,6–40,1 V/V%.
- Térfogattömeg (g/cm³), 03.06 → 05.19 → 06.26: K 1,26 → 1,32 → 1,46; Á 1,27 → 1,33 → 1,35.
- Humusz (m/m%), 04.14 → 07.22: K 2,61 → 2,59; Á 2,77 → 2,59.

Fenológia:

| | Levélhossz | Levélszám | Fejátmérő |
|---|---|---|---|
| 06.26 kontroll | 23–36 cm | 5–7 | 25 mm |
| 06.26 ásógép | 38–65 cm | 8–9 | 55 mm |
| 07.22 kontroll | 50 cm | 6–8 | 55 mm |
| 07.22 ásógép | 60–70 cm | 12 | 85 mm |

### Szentkirály · ipari paradicsom (új, 2026)

A kontroll 2026 áprilisában kombinátort kapott, az ásógépes parcella ásógépet. Két tábla, egyenként 1,4 ha (a Mikrobio fájl szerint).

| | 04.14 | 06.10 | 07.22 |
|---|---|---|---|
| Laza réteg K / Á, cm | 37,8 / 33,4 | 22,7 / 36,7 | 33,0 / 35,2 |
| Térfogattömeg K / Á, g/cm³ | 1,35 / 1,17 | 1,38 / 1,35 | 1,53 / 1,41 |
| Talajhő 10 cm, K / Á, °C | 16,6 / 16,4 | 24,2 / 23,7 | 18,7 / 19,3 |
| Levegő, °C | 15,0 | 27,0 | 22,7 |

- Humusz: K 1,62 (04.14) → 1,70 (08.11); Á 1,63 (04.14) → **1,89** (08.11).
- Hajtáshossz 07.02: K 65 cm, Á 90 cm.
- Mélység: **10 cm és 20 cm** (döntés 11.02.). Az összesítő tábla „3 cm / 10 cm” fejléce a hagymás sablonból maradt (a fájl címsora is „H.E. Vöröshagyma”), az értékei pedig pontosan a pontonkénti 10 és 20 cm-es mérések átlagai (pl. K 04.14: 16,40 / 16,90 / 16,60 → 16,6).

### Lakitelek (2026: rozs)

Humuszos homok; művelés 2025 októberében; kb. 120 mm csapadék és kb. 60 mm öntözés. A rövidítések jelentése a fájl szerint: mély = mélyásógép, laz/l = mélylazítás, ásó = ásógép 30 cm, sz = szántás, **k = kombinátorozás** (nem kultivátor).

A MikrobioMeter fájl pontos mélységeket is ad:

| Parcella | Kezelés |
|---|---|
| I | mélyásógép 45 cm (a forrásban 45–50 cm; döntés: 45) |
| II | lazítás 50 cm + ásógép 30 cm |
| III | ásógép 30 cm |
| IV | lazítás 50 + szántás 30 + kombinátor 8 cm |
| V | szántás 30 + kombinátor 8 cm |
| VI | lazítás 50 + szántás 30 + ásógép 25 cm |
| VII | szántás 30 + ásógép 25 cm |

Laza réteg, cm (5 pont átlaga):

| | 04.10 | 05.19 | 07.21 (tarló) |
|---|---|---|---|
| I | 41,0 | 22,7 | 7,6 |
| II | 27,6 | 20,6 | 8,1 |
| III | 23,0 | 19,6 | 10,4 |
| IV | 32,8 | 21,3 | 9,1 |
| V | 34,0 | 22,7 | 8,9 |
| VI | 35,0 | 22,9 | 7,6 |
| VII | 32,4 | 20,9 | 7,1 |

- ⚠ A 07.21-es oszlop a fájlban **„tarló”** jelölésű: a rozs betakarítása utáni tarlón mérték. Ez nem tenyészidő-végi állapot a 2025-ös augusztusi méréssel azonos értelemben, ezért a 2025-ös augusztusi értékkel nem szabad egy oszlopba tenni.
- Térfogattömeg 04.10 / 07.21: I 1,44/1,43 · II 1,46/1,46 · III 1,43/1,41 · IV 1,50/1,43 · V 1,39/1,46 · VI 1,39/1,45 · VII 1,43/1,44.
- Humusz 04.10 / 07.21 (m/m%): I 0,564/0,473 · II 0,596/0,677 · III 0,663/0,858 · IV 0,715/0,935 · V 0,695/0,697 · VI 0,726/0,846 · VII 0,759/0,747.
- Víztelítettség 10 cm (parcellaátlagok tartománya): 04.10 6,1–10,6 · 05.19 15,6–18,0 · 07.21 8,6–12,1 V/V%.
- Fenológia 05.19, hajtás / gyökér (cm): I 110/8 · II 115/7 · III 110/6 · IV 110/10 · V 120/6 · VI 125/12 · VII 125/8.
- Léghőmérséklet: 11,7 · 18,6 · 29,0 °C.

### Talajélet (MicroBIOMETER), µgC/g, 3 minta átlaga

| | 2025.05.07 | 2025.09.18 | 2026.04.10 | 2026.07.21 |
|---|---|---|---|---|
| Lakitelek I | 282,7 | 342,0 | 298,7 | 230,0 |
| II | 237,7 | 299,7 | 401,7 | 309,0 |
| III | 430,3 | 411,7 | 423,7 | 315,3 |
| IV | 353,7 | 505,0 | 374,0 | 260,7 |
| V | 443,0 | 466,3 | 590,0 | 251,7 |
| VI | 486,3 | 518,0 | 381,0 | 250,5 |
| VII | 462,3 | 488,7 | 507,0 | 278,0 |
| **Átlag** | 385,1 | 433,0 | 425,1 | 271,4 |

Szentkirály, 2026 (tavasz → nyár):

| Tábla | Tavasz | Nyár |
|---|---|---|
| Paradicsom, ásógép | 361,3 (04.10) | 601,5 (08.11) |
| Paradicsom, kombinátor | 483,7 (04.10) | 555,0 (08.11) |
| Hagyma MK-1 ásógép | 569,7 (04.14) | 612,5 (07.22) |
| Hagyma MK-2 ásógép | 642,0 (04.14) | nincs mérés |
| Hagyma MK-3 kontroll | 593,0 (04.14) | 702,0 (07.22) |

- Gomba:baktérium arány: Lakitelek 0,44–0,95 (2025.05), 0,52–0,97 (2025.09), 0,55–1,15 (2026.04), 0,44–0,59 (2026.07); Szentkirály 0,65–1,36.
- Egyes mintákon nagy a szórás: Lakitelek VI, 2025.05: ±173,9; hagyma MK-1, 2026.07: ±253,9, mindössze 2 minta.

## 3. Új 2025-ös adat az oldalhoz képest

Az oldal 2025-ös adatai (`data.ts`) a Drive-hoz képest teljesek. Ami még nincs fent:

1. **Talajélet, Lakitelek 2025** (05.07 és 09.18), lásd fent. Ez két évet összekötő idősor (4 mintavétel), az egyetlen ilyen adatsor.
2. **A lakiteleki kezelések pontos mélységei.** A mélyásógép 45 cm (döntés 11.02.); a `data.ts` két helyén 40 → 45 cm-re javítva.

## 4. Javítandó a v2 vásznon

| Tábla | Javítandó |
|---|---|
| Lakitelek | A IV. és V. kezelésben a „k” **kombinátor**, nem kultivátor. |
| Lakitelek, Két év | A 07.21-es mérés **tarlón** készült; a „júliusra minden parcellán 7–10 cm” szöveget így kell jelölni. |
| VD paradicsom | Humusz: az ásógépes 1,63 → **1,89**, a kontroll 1,62 → 1,70 (08.11). |
| Szentkirály talajszerkezet | A K-m oszlop egyetlen mérési pontból áll (n = 1); ezt jelölni kell. |
| Két év, talajélet | A talajélet nem mutat egyértelmű ásógépes előnyt (a hagyma kontrollja a legmagasabb, 702); a szöveg ne sugalljon ilyet. |

## 5. Fő megállapítások (amit az oldal mondhat)

1. **A tenyészidő végén az ásógépes talaj mélyebben laza, mindkét évben** (Szentkirály, hagyma): 2025-ben 6 → 11 cm, 2026-ban 7 → 17,6 cm. A mélyásógép 26–32 cm-t tartott, de a kontroll + mélyásógép csak 1 pont.
2. **Tavasszal melegebb, a nyári hőségben hűvösebb az ásógépes talaj.** 2025 márciusában +3,0 °C (1 cm-en). 2026 áprilisában +1,6 °C, júniusban −4,0 °C (3 cm-en). Júniusban nedvesebb is volt.
3. **A hagyma kb. egy hónappal előrébb jár:** a kontroll 07.22-re ért el 55 mm-es fejet, az ásógépes ennyit már 06.26-án mért.
4. **Új paradicsom tábla, ugyanaz az irány:** júniusban +14 cm laza réteg, a hajtás 38%-kal hosszabb, a térfogattömeg minden mérésnél kisebb.
5. **Lakitelek:** a mélyásógép (I) indul a legmélyebbről (2026 áprilisában 41 cm). Májusra a különbségek 20–23 cm-re szűkülnek, a tarlón eltűnnek.
6. **Talajélet:** a mintavételek között nagyobb a különbség, mint a kezelések között; 2026 júliusára (tarló) Lakitelek minden parcellája visszaesett. Ez kísérő adat, nem az ásógép mellett szóló bizonyíték.

## 6. Design-rendszer több évre (2027, 2028…)

Cél: minden új évad **adatfelvitel legyen, ne újratervezés**, és az oldal négy év után se legyen zsúfolt. Semmi új navigáció, új token vagy szín: a meglévő ScrollLayout-ot, sávot, jelvényeket, színeket használjuk.

### 6.1 Szabályok

1. **A szín a kezelést jelöli, nem az évet.** Szürke = kontroll, arany = ásógép, csíkozás = + mélyásógép. Az év mindig felirat és pozíció, soha nem szín. Így egy 4. év sem kér új színt.
2. **Egy kép = egy évad.** A fő diagram mindig egy évet mutat; alapértéke a legfrissebb év. Váltás az ÉVAD-kapcsolóval. Az előző évek nem rétegződnek egymásra.
3. **Évek összevetése csak összehasonlítható mutatón.** Minden helyszínen egy mutató az évek közötti híd: a laza réteg a *tenyészidő végén*, illetve a *tavaszi indulásnál*. Ez egy „Évek” sávban jelenik meg (évenként egy sor, kontroll → ásógép súlyzó-diagram). A sor évente bővül, a szélesség nem.
4. **Hónap + harmad.** A felirat a hónap rövid neve, mellette kisebb, arany betűvel a harmad: *eleje* (1–10.), *közepe* (11–20.), *vége* (21–31.). Pl. „MÁRC. eleje”. A 2025-ös napok nem ismertek, ott csak a hónap áll (döntés 11.02.).
5. **A hiányzó év nem üres hely.** Nincs „0” és nincs üres oszlop: a hiányzó év egyszerűen nem szerepel a kapcsolóban, a sávban pedig üres körként jelenik meg.
6. **A bizonytalanság látszik.** Kis jelölő a szám mellett: `n=1`, `tarló`, `mélység?`. Ugyanaz a jelölőstílus minden táblán.
7. **Ugyanaz a skála minden évben** egy helyszínen belül (pl. 0–50 cm), hogy a kapcsolás ne torzítson.

### 6.2 Komponensek

| Komponens | 2 év | 3–4 év | 5+ év |
|---|---|---|---|
| ÉVAD-kapcsoló (cím alatt) | 2 gomb | 3–4 gomb | legördülő, a legutóbbi 3 év gombként |
| Bal sáv, év-lefedettség | évenként egy pont (● mért, ○ nincs mérés), alatta a legutóbbi évszám | ugyanaz | az utolsó 4 év pontja + „+N” |
| „Évek” sáv (súlyzó) | 2 sor | 3–4 sor | a legutóbbi 4 év, a többi lenyitható |
| Kezelés-jelmagyarázat | évadonként a saját kezelései | ugyanaz | ugyanaz |
| Mobil | ÉVAD szegmens 44 px | szegmens | vízszintesen görgethető szegmens |

### 6.3 Adatszerkezet (javaslat a `data.ts`-hez)

```ts
type Evad = {
  ev: number                  // 2026
  helyszin: HelyszinId        // 'szk-hagyma' | 'szk-paradicsom' | 'kecskemet' | 'lakitelek'
  kultura: string
  muveles: string             // pl. '2025. október'
  kezelesek: Kezeles[]        // { id, nev, szerep: 'kontroll' | 'asogep', mely?: boolean, pontok: number }
  meresek: Meres[]            // { datum: '2026-06-26', mutato, melyseg?, kezeles, ertek, n, megjegyzes?: 'tarlo' }
  hid?: { tavasz?: string; idenyveg?: string }  // mely dátumok az évek közötti összevetés pontjai
}
```

Az ÉVAD-kapcsoló, a sáv pontjai és az „Évek” sáv mind ebből számolódik. Egy 2027-es évad felvitele ennyi: egy új `Evad` rekord.

## 7. Nyitott kérdések a kutatóknak

Eldöntve 11.02.: a VD talajhő 10/20 cm; a lakiteleki mélyásógép 45 cm; a dátumok hónap + harmad formában.

1. Melyik gép (38SX / 38WX / 40SX) volt a 2026-os „ásógép” és „mélyásógép” Szentkirályon és Lakiteleken?
2. Kecskemét-Borbás: lesz még mérés, vagy lezárt helyszín?
3. Melyik mérés számítson „tenyészidő-végi” hídnak Lakiteleken, ha a nyári mérés tarlón van?

## 8. Megvalósítva az oldalon (2026-11-02)

- Kecskemét-Borbás: idén nem lesz több mérés (döntés 11.02.). A blokkok a 2025-ös adatot mutatják „ÉVAD 2025 · 2026-ban itt nem mértünk” jelöléssel.
- A szentkirályi paradicsomtábla (Vörös D.) Szentkirály alatt kapott helyet: „Paradicsomtábla (2026)” alszakasz, laza réteg 3 mérés, további mérések (hajtáshossz, térfogattömeg, humusz). A talajhő itt nem szerepel: a különbségek kicsik (±0,5 °C), és a mélység bizonytalan volt.
- Lakitelek 2026 (rozs): a 3D-s diagram és az eredménylista évadfüggő. 2026-ra nincs kutatói értékelés, ezért nincs pontszám és csillag; a lista a mért értékeket mutatja, a július végi oszlop „tarló” jelöléssel. A gépnevek (38SX, 40SX) csak 2025-ben látszanak, a 2026-os géptípusok nem ismertek.
- A fotóblokkok 2025-ösek; a 2026-os fotók feltöltése még hátravan.
- Még nyitott: Lakiteleken melyik mérés legyen az évek közötti híd (a 2026-os július végi érték tarlón készült, a 2025-ös augusztusival nem vethető össze); a 2026-os géptípusok helyszínenként.
- Szentkirály „Fejlődés (2026)” alszakasz: a két hagyma mozgással nő a JÚN. vége / JÚL. vége váltásra; júliusban szaggatott körvonal mutatja az ásógépes fejet egy hónappal korábban (55 mm).
- Lakitelek „Talajélet (2025–2026)” alszakasz: egy idővonal, parcellák pontként, átlag és szórás. Helyesbítés: dátumon belül a 7 parcella szórása (85–291 µgC/g) nagyobb, mint az átlagok közti különbség (162); a „mintavételek között nagyobb a különbség, mint a kezelések között” mondat hibás volt. A „Mit látunk” tények a data-ból számolódnak.

### 8.x Lépésenkénti blokkok (canvas v3, „Lépésenként” sor, jóváhagyva 11.02.)

- A Fejlődés, a Talajélet és az új „További mérések” (Szentkirály + Lakitelek) blokk a közös `experiment/story/Story` keretet használja: számozott fejezetek balra, egyszerre egy fókusz a diagramon, a magyarázat a jelölésen ül (`story/Callout`), az olvasó léptet (Vissza / Tovább). Telefonon csak a mostani fejezet látszik, alatta a diagram.
- Az új adatok (`szentkiralyOnionSoil`, `lakitelekSoil2026` a `seasons.ts`-ben) a Drive táblázataiból, újraellenőrizve 11.02.
- Javítás a canvashoz képest: Lakitelek víztelítettség – az áprilisi és a júliusi tartomány átfed, ezért a szöveg csak azt mondja, hogy májusban mind a 7 parcella nedvesebb volt.

### 8.y A Drive maradék adatai (2026-11-03)

- Átnézve a Drive mappa: csak a 4 xlsx tartalmaz adatot; a `Képek-VD-ip_paradicsom` mappában lévő `2026_07_02-Dorina-VD-paradicsom.pptx` fotós összevetés, a fotókhoz tartozik.
- Szentkirály „További mérések (2026)”: **Tábla: Hagyma | Paradicsom** kapcsoló. A hagyma kapott egy 4. fejezetet (Talajélet MK-1/2/3, júliusban 2 minta, MK-2 nyáron nincs mérés). A paradicsom 4 fejezete: térfogattömeg mind a 3 mérésnél, humusz, hajtáshossz, talajélet (`szentkiralyTomatoSoil` a `seasons.ts`-ben). A blokk a Paradicsomtábla alszakasz után áll.
- A Paradicsomtábla alszakaszból kikerült a KeyFacts doboz (és a komponens): csak a laza réteg és a kártyák maradtak, így egy képernyőre fér.
- Lakitelek: „További mérések” 4. fejezet a humusz (parcellánként egy átlagminta, ezért „csak irány”); a Talajélet blokk új 6. fejezete a gomba : baktérium arány.
