# Mobil nézet — zsúfoltság, átláthatóság, érthetőség

Dátum: 2026-11-09 · Ág: `preview/megrendelo-2026-11` (`3d6f50d`) · Előzmény: `docs/2026-11-06-ux-heuristika.md`
Módszer: `ux-heuristics` skill (Krug, Nielsen, súlyosság 0–4). Dev szerver, 390 × 844 px, érintőképernyős emuláció; mind a 46 képernyőt végignéztem, és képernyőnként mértem a látható szavakat, a 14 px alatti szöveget és a vezérlők számát.

A kérdés most nem az volt, hogy *működik-e* a mobil nézet (a 11-06-i mérés szerint igen: 0 levágás, 0 kis célterület, egy margó), hanem hogy **egy gazda vagy döntéshozó telefonon megérti-e, mit akarunk átadni**, és nem fullad-e bele.

## 1. Összkép

| Szempont | Pont | Röviden |
|---|---|---|
| Mobil mechanika (margó, célterület, levágás) | **9** | Változatlanul jó |
| Érthetőség, zsúfoltság, a fő üzenet megtalálása | **7** | A `/problema` és a `/technologia` rendben van; a `/kutatas` túl hosszú, és az eredmény a végén van |

**Ami jól működik:** a sticky szekciósáv (helyszín + alszakasz, pl. „Szentkirály · Talajhőmérséklet”) mindig megmutatja, hol tart a látogató. A Story-blokkok („1 / 5”, Vissza / Tovább) egyszerre egy dolgot mutatnak. Minden grafikon alatt van egy egymondatos, kiemelt tanulság („Mindkét évben az ásógépes parcella maradt mélyebben laza…”). A „Tovább” kártyák és az oldalvégek zsákutca nélkül vezetnek tovább.

## 2. Oldalhossz telefonon

| Oldal | Képernyő | 11-06 | Megjegyzés |
|---|---|---|---|
| `/` | 1,9 | — | rendben |
| `/problema` | 7,8 | 7,7 | rendben, jól tagolt |
| `/technologia` | 6,2 | 7,4 | rendben |
| `/kutatas` | **26,7** | 19,3 | **+38 %** három nap alatt (helyszíntérképek, talajélet, térfogattömeg, 2026-os blokkok) |

A `/kutatas` felépítése telefonon (képernyőben):

| Szakasz | Hossz | Kezdete |
|---|---|---|
| Hero | 1,3 | 0 |
| Módszertan | **5,4** | 1,3 |
| Szentkirály | **8,3** | 6,8 |
| Kecskemét-Borbás | 3,2 | 15,1 |
| Lakitelek | 5,5 | 18,4 |
| Összegzés („Mit mutat 2 év mérése?”) | 2,2 | **24,0** |

Az első mért eredményig 8 képernyőt kell görgetni (a módszertan után). Az összegzésig, vagyis ahhoz a részhez, amelyik egy mondatban elmondja, miért jó az ásógép, 24-et.

## 3. Hibák súlyosság szerint

| # | Hiba | Hol | Heurisztika | Súly. | Javaslat |
|---|---|---|---|---|---|
| **K1** | **A fő üzenet a 24. képernyőn van.** A látogató előbb 5 képernyő módszertant kap (7 mért jellemző kártyája, 5 lépéses térfogattömeg-mintavétel, talajélet-módszer, 425 µgC/g példa), csak utána eredményt. Telefonon a legtöbben ennyit nem görgetnek le. | `/kutatas` | Krug 1, Nielsen 8 | **3** | Az Összegzés 3–4 kártyája (a „Részletek ↑” gombokkal együtt) kerüljön közvetlenül a hero alá, „Fő eredmények” címmel. A végén elég egy rövid ismétlés vagy csak a „Tovább” kártya. *(A 11-06-i U3, azóta súlyosbodott.)* |
| **K2** | **A módszertan túl részletes ahhoz, hogy elöl legyen.** Az 5,4 képernyőnyi módszertan nagy része háttéranyag: a jellemzők listája, a mintavételi lépések, a talajélet mérési menete. | `/kutatas` Módszertan | Krug 3 (fele annyi szó) | **2** | Telefonon csak a penetrométer (ami kell a cm-értékek megértéséhez) maradjon nyitva; a „Mit mérünk”, a „Térfogattömeg mérése” és a „Talajélet mérése” legyen lenyitható sor („Részletek ▾”). Ez kb. 3,5 képernyővel rövidít. |
| **K3** | **13 évdoboz egy oldalon.** 5 működő „ÉV 2025 / 2026” kapcsoló (egymáshoz kötve: ha egyet átállít, mind átáll) és 8 ugyanolyan kinézetű, de nem kattintható „ÉV 2026” címke. A látogató a Szentkirály-blokkban 2025-re vált, majd Kecskemétnél azt olvassa, hogy „2026-ban itt nem mértünk”, vagy a kapcsoló „nem csinál semmit”, mert épp címke. | `/kutatas` (`SeasonSwitch` ×5, `SeasonOnly` ×8) | Nielsen 4 (következetesség), 1 (állapot) | **2** | Helyszínenként egy kapcsoló (a helyszín címe alatt); a blokkokon belül a nem kattintható címke legyen sima szöveg az alcímben („2026 · 6 mérési pont”), ne gombnak látszó doboz. |
| **K4** | **Két grafikon túl sűrű telefonon.** Szentkirály talajszerkezet: 4 hónap × 4 kezelés = 16 oszlop számokkal + 4 „1 mérés” címke egy 350 px széles kártyán. Talajhőmérséklet: 2 mélység × 4 hónap × 2 oszlop + 8 eltérés-címke, a kártya 2 képernyő hosszú. | Szentkirály | Nielsen 8 | **2** | Telefonon Story-blokk, ahogy a többi helyen: hónaponként egy lépés, vagy alapból csak az ásógép–kontroll pár, és a mélyásógépes oszlopok egy kapcsoló mögött. A hőmérsékletnél alapból a 3 cm, a 10 cm egy kapcsolóval. |
| **K5** | **A `/technologia` alkalmazási útmutatójában 4 teljes szélességű arany „Lásd a kísérletben” gomb van.** Ez a webhely legerősebb gombstílusa (a főoldalon a fő CTA), itt négyszer egymás alatt, így mindegyik kiabál. | `/technologia` Útmutató | Nielsen 8 (egy fő CTA) | **2** | Telefonon másodlagos stílus (körvonalas vagy szöveges link „Lásd a kísérletben →”), ahogy a „Részletek ↑” gombok az Összegzésben. |
| **K6** | **Csillagok magyarázat nélkül.** „Szerkezet tartóssága ★★★☆☆ / ★★★★★”: nem derül ki, mi alapján, és a kutatás oldalon ilyen pontszám sehol nincs. A „Lazítás + Ásógép” 3 csillag, a „Lazítás + Szántás + Ásógép” 5: ez ellentmondásnak tűnhet, hiszen az eredmények szerint már az önálló ásógép is mélyebben lazít. | `/technologia` Útmutató | Krug 1 („hm?”) | **2** | Egysoros magyarázat a kártyák fölé („szakértői becslés a mérések alapján, 5 = legtartósabb”), vagy a csillagok helyett a mért cm-érték. *Tartalmi döntés a megrendelővel.* |
| **K7** | **Csökkenő számok értelmezés nélkül a modellkártyán.** 38SX „Kísérleti eredmények”: „a laza réteg 22 → 20 cm”, „32 → 31 cm”. A gazda ezt romlásnak olvashatja; nem derül ki, hogy a kontroll ennél jobban tömörödött. Alatta egy belső megjegyzés: „a 2026-os adatokban az ásógép típusa nincs megnevezve, ezért ezeket nem soroljuk ehhez a modellhez”. | `/technologia` Modellek | Nielsen 2 (a felhasználó nyelve) | **2** | Legyen benne a sorban, mihez képest jó (a többi parcella vagy a kontroll értéke), vagy egy félmondat („alig tömörödött vissza”). A belső megjegyzés helyett elég a link: „A 2026-os mérések a Kutatás oldalon →”. |
| **K8** | **Szakszavak magyarázat nélkül.** „KA 28 (Arany-féle kötöttség)”, „V/V%”, „µgC/g”, „MicroBIOMETER”, „tarló”, „kombinátor”, „eketalp”. Gazdának a legtöbb ismerős, a megrendelő döntéshozóinak nem feltétlenül. | `/kutatas`, `/problema` | Nielsen 2 | **1** | Az első előfordulásnál egy rövid zárójel vagy koppintásra nyíló magyarázat (pl. „V/V% = a talaj térfogatának hány százaléka víz”). A KA mellé: „27–28 = homokos vályog” jellegű fordítás. |
| **K9** | **Ismétlődő súgószövegek.** „Lapozni oldalra húzással is lehet” 4×, „Kísérő adat, nem bizonyíték…” 2×, „Szemléltető görbe, nem mért adat” — mindegyik indokolt, de együtt zajt adnak. | `/kutatas` | Krug 3 | **1** | A húzás-tipp csak az első Story-blokkon jelenjen meg (vagy amíg a látogató egyszer nem húzott). A „Kísérő adat” egyszer, a talajélet-blokk elején. |
| **K10** | **Kétféle talajszelvény-összehasonlítás a `/problema`-n.** A kultivátoros szürke fejlécet és ×-et használ, a szántásos piros/zöld címkét és kártyakeretet. | `/problema` | Nielsen 4 | **1** | Mindkettő a szántásos mintát kövesse (piros „× Kultivátorozott talaj”, zöld „✓ Ásógépezett talaj”), ez az erősebb és gyorsabban olvasható. |
| **K11** | **Két címhierarchia.** A fotóblokkok címe (pl. „A kísérleti parcella drónos hőtérképe”, „Ortofotó és hőtérkép…”) nagy arany Fraunces, hangosabb, mint az adatblokkok fehér címe, pedig ezek másodlagosak. | `/kutatas` | Nielsen 8 | **1** | A fotóblokkok címe ugyanaz a fehér h3 legyen, mint a többi blokké. |
| **K12** | **A főoldali fő gomb telefonon a második képernyőn van** (a videó, a cím, a bevezető és a statisztikák alatt). | `/` | Nielsen 8 | **1** | *(A 11-06-i M1, nyitott.)* A gomb a statisztikák fölé, vagy a bevezető egy sorral rövidebb. |

*A képeken látható fekete „N” kör a Next fejlesztői jelzője, élesben nem jelenik meg.*

## 4. Oldalanként

**`/` főoldal** — Tiszta: egy állítás, két szám, egy gomb, egy eredménykártya (2025/2026, kontroll → ásógép). Csak a K12.

**`/problema`** — A legjobban működő oldal. A hero három számozott, lenyíló pontja („1 Az öntözés okozta tömörödés…”) azonnal térképet ad. A kártyák (ikon + cím + 2–3 sor + arany kulcsszám, pl. „20+ bar nyomás”) egységesek és jól szkennelhetők. Csak a K10.

**`/technologia`** — Rövid és logikus (működés → modellek → melyiket válasszam). Gyenge pontja az útmutató (K5, K6) és a modellkártya számai (K7).

**`/kutatas`** — Tartalmilag a legerősebb, de telefonon kimerítő: 26,7 képernyő, kb. 2 000 látható szó, 13 évdoboz, 4 lapozós blokk, 3 fotó-összehasonlító. A blokkok egyenként jók (minden grafikonnak van tanulsága); a gond a sorrend (K1), a mennyiség (K2) és az ismétlődő vezérlők (K3, K9).

## 5. Út a 10/10-hez

| Prioritás | Feladat | Fájlok | Méret | Hatás |
|---|---|---|---|---|
| **P1** | „Fő eredmények” a `/kutatas` hero alá (az Összegzés kártyáinak újrahasznosítása) | `ResearchScrollLayout`, az Összegzés komponense | S–M | K1: a fő üzenet a 2. képernyőn a 24. helyett |
| **P1** | Módszertan telefonon lenyitható sorokkal | `MethodologyPage`, `MeasuredPropertiesPage`, `BulkDensityMethodPage`, `SoilLifeMethodPage` | M | K2: kb. −3,5 képernyő |
| **P2** | Helyszínenként egy évkapcsoló, a címkék sima szövegként | `season/SeasonSwitch`, `season/SeasonOnly`, Szentkirály-oldalak | M | K3 |
| **P2** | Szentkirály talajszerkezet- és hőmérséklet-grafikon telefonon Story-blokkban | `SzentkirályTimelinePage`, `SzentkirályTempPage` | M | K4 |
| **P2** | Útmutató: másodlagos gombok, csillagok magyarázata; modellkártya: kontroll mellé, belső megjegyzés ki | `ApplicationGuide`, `ModelSection`, `technology-data.ts` | S | K5–K7 *(K6: a megrendelővel egyeztetni)* |
| **P3** | Szakszó-magyarázatok, egyszeri súgószövegek, egységes szelvény- és címstílus, főoldali gomb | több fájl | S | K8–K12 |

A P1-es pontokkal a `/kutatas` telefonon kb. 26,7-ről 22–23 képernyőre rövidül, és ami fontosabb, a fő üzenet az első két képernyőn lesz. Ezzel az érthetőség 7 → 9. A P2–P3 hozza a 10-et.

## 6. Hatókörön kívül

- Valódi felhasználói teszt (3–5 gazda telefonnal, feladat: „2 perc alatt: mit csinál jobban az ásógép?”). Ez mutatná meg, hogy a K1 valóban akkora gond-e, amekkorának látszik.
- Az áttekintés nem változtatott a kódon.
