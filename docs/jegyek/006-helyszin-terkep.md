# 006 · Helyszín adatok térképpel (mindhárom helyszín)

**Státusz:** kész · **Létrehozva:** 2026-11-08 · **Méret:** L

## Cél

A Kutatás oldal „Helyszín adatok” blokkjai hat egyforma kártya helyett: balra a helyszín adatai rövid listában, jobbra egy ferdén felragasztott, kockás papírfecni, amin a térkép a Duna–Tisza közéről Kecskemét környékén át ráközelít a helyszín táblájára vagy tábláira. A látogató látja, hol van a kísérlet és hogyan néz ki a tábla.

## Hatókör

- `experiment/pages/LakitelekInfoPage`, `SzentkirályInfoPage`, `KecskemétInfoPage` átírva a közös elrendezésre; Szentkirály és Borbás művelési kártyái alatta, teljes szélességben maradnak (a régi fejléc- és kártyarács-CSS törölve).
- Új: `experiment/fieldmap/FieldMapCard` (térkép, animáció), `experiment/fieldmap/SiteInfoLayout` (fejléc + adatlista + térkép + alsó blokk; a Lakitelek CSS ide költözött), `src/lib/field-maps.ts` (vetület, határ, folyók, városok, helyszín-koordináták, táblageometria).
- Asztali és mobil (≤1024 px) is.

## Nem nyúlunk hozzá

- A Bevezető térképe (`ResearchHeroSection`), a `ScrollLayout` (csak a meglévő `SCROLL_TARGET_EVENT` jelzést használjuk).
- Az eredmények (3D, idővonalak), talajélet, fotók.

## Döntések

- 2026-11-08 (felhasználó, minta: claude.ai/artifact/LfojbhTXMbt6UHDzeqzuKp, 12. verzió):
  - Papír: a háttér barnájában, kockás, szakadt szélű, kissé ferde, ragasztócsíkkal. A papír maga nem animálódik (forgatott + árnyékolt elem animálva elmosódik).
  - Animáció: 1) Duna–Tisza köze (nem az egész ország, azt a Bevezető már megmutatja), kb. 2,4 s kitartva, jelölő a helyszínen, szaggatott keret a következő kivágáson; 2) Kecskemét környéke (a többi helyszín halvány karika); 3) a tábla/táblák. Kb. 6,3 s. ↻ ikonnal újrajátszható.
  - Térképkeret, a kiegészítők a kereten kívül: fent a nagyítás szintje és a koordináta, lent észak-nyíl és egy végig ugyanott álló, 1–2–5 lépésben változó lépték.
  - Lakitelek: a parcellák műveléseit a papír nem részletezi (az eredménytábla egy görgetéssel lejjebb megteszi), csak a színkód és I.–VII.
  - Bal oldal: 5 sor (Talaj + Kₐ, Kultúra, Víz/Öntözés, Időszak, Mérések), évváltóval; a bevezető mondat évenként.
- 2026-11-08 (felhasználó): az utolsó kép léptéke nem kötött (nem kell 50 m): a kivágás a tábla/táblák befoglaló téglalapjához igazodik. Szentkirály: mindkét tábla egy képen (kb. 500 m-es lépték), szaggatott összekötő a távolsággal („2,3 km”), előbb a vonal húzódik ki, utána jön a felirat. Évváltó 2025: a paradicsomos tábla szaggatott és halvány (csak 2026-tól van).
- 2026-11-08 (felhasználó): a helyszín felirata a nagy nézetben a pont fölött, a régiós nézetben (ahol kell) mellette áll; a kettő között a zoommal együtt csúszik, nem ugrik. Szűk térképen, ha oldalt nincs hely, fölötte marad.
- 2026-11-08 (felhasználó): az animáció lejátszódik, amikor a látogató először odagörget, és mindig elölről, amikor odaugrik (oldalsó navigáció, mobil tartalomjegyzék, Bevezető térkép, `?section=` link). Kézi visszagörgetéskor a munkamenetben egyszer játszik, utána a kész térkép áll.
- 2026-11-08: Koordináták (kutatói My Maps): Szentkirály hagyma: két átellenes sarok + a hosszoldal iránya a műholdképről (≈ 336 × 220 m). Borbás: két átellenes sarok (≈ 480 × 128 m). Szentkirály paradicsom: a két pont a hossztengely két vége (≈ 410 m), a szélesség a 2 × 1,4 ha-ból (68 m).

- 2026-11-09 (felhasználó): Lakitelek négy sarka (É 46,91345° K 20,0051°; É 46,91406° K 20,00579°; É 46,91198° K 20,00968°; É 46,91137° K 20,00899°): a tábla 376 × 86 m, a hosszoldal 38°-kal DK felé fut; 7 parcella, egyenként kb. 12,3 m. A hosszabb tábla miatt a sávok keskenyebbek, ezért minden szélességen I., IV., VII. a felirat. Lépték: 100 m.
- 2026-11-09: mobilon az utolsó Lakitelek-kép GPU-memória hiányában félig rajzolódott ki és a lap más részei eltűntek: az országos rétegek (határ, folyók, nagy és régiós feliratok) mezőléptéken kikerülnek a kirajzolásból (`cull()`).
- 2026-11-09: görgetéskor továbbra is eltűntek részek (Lakitelek): a térkép méterben, Kecskemét körüli origóval rajzolódik, így a nyugalmi, utolsó kép kb. 1 px/egység léptékű (eddig kb. 1300×-os nagyítás); a nagy szorzó csak a kicsinyített országos nézetben van.

## Nyitott kérdések

- [ ] Lakitelek: a parcellák sorrendje (az I. az ÉK-i szélen van-e). A méret a négy sarokból megvan (376 × 86 m).
- [ ] Szentkirály paradicsom: a két pont iránya (≈ 49° DK) nem egyezik a műholdkép táblairányával (≈ 31°); pontosítani kell a sarkokat.

## Kész, ha

- [x] Mindhárom helyszínen 1440 px-en két oszlop (balra fejléc + 5 adatsor, jobbra a papír, Szentkirály/Borbás: alatta a művelési kártyák); 390 px-en egymás alatt: fejléc, papír, adatok, (kártyák)
- [x] Az animáció három lépésben ér a táblához; a végén Lakitelek 7 sáv + I., IV., VII., Szentkirály két tábla + „2,3 km” vonal (előbb a vonal, aztán a felirat), Borbás egy tábla; `prefers-reduced-motion` mellett rögtön a kész állapot (`motion-check.js` zöld)
- [x] A helyszín felirata zoom közben folyamatosan mozog (nincs ugrás); a három álló állapotban egyetlen látható térképfelirat sem lóg ki a keretből és nem fedi a másikat 360, 390, 1366, 1440 és 1536 px-en
- [x] Indítás: első odagörgetéskor játszik; oldalsó navigáció / mobil tartalomjegyzék / Bevezető térkép ugrásakor már lejátszott állapotból is elölről indul; másik alszakaszra (pl. Fotók) ugrás nem indítja újra
- [x] Évváltó: Lakitelek és Szentkirály 2025 ↔ 2026: az adatok és a bevezető mondat cserélődnek; Szentkirály 2025-ben a paradicsomos tábla halvány, a térkép nem játszik újra
- [x] Nincs 12 px alatti szöveg (`type-check.js` zöld); a `clip-check.js` a térképen kívül nem talál levágott szöveget a `/kutatas` oldalon (a térkép SVG-jében a zoom közben kicsúszó feliratokat jelzi, ez szándékos)
- [x] ≤1024 px: `layout-check.js` és `mobile-check.js` zöld; nincs vízszintes görgetés 360 és 390 px-en
- [x] `npx tsc --noEmit` hibamentes (a `src/` alatt), `npm run lint` 0 hiba

## Eredmény

2026-11-08, checker (dev szerver): minden pont rendben.
- Elrendezés: 1440 px két oszlop mindhárom helyszínen (adatok x≈308–800, papír x 856–1372), 390 px egymás alatt, 20 px gutter, vízszintes görgetés 0.
- Animáció: Szentkirály „Duna–Tisza köze” 0 s → „Kecskemét környéke” ~3,7 s → „Táblák” ~6,2 s; a 2,3 km-es vonal 0 → 245 px (1440), a felirat utána, ~7,1–7,5 s. Reduced motion: rögtön a kész állapot.
- Felirat csúszása: képkockánként legfeljebb 7,4 px (Szentkirály) és 21,6 px (Lakitelek, a 2. zoom csúcsán), folyamatos, ugrás nincs. Álló állapotokban kilógó / átfedő felirat 0 (360–1536 px).
- Indítás: első görgetéskor játszik; Bevezető, oldalsó sín és mobil tartalomjegyzék ugrásakor elölről; a Fotók alszakaszra ugrás nem indítja újra.
- Évváltó: Szentkirály 2025-ben a paradicsomos tábla `fieldOff`, a térkép nem játszik újra.
- QA: layout-check, mobile-check (3×), type-check, motion-check zöld; clip-check csak a térkép SVG-szövegeit jelzi (szándékos); tsc a src/ alatt 0 hiba, lint 0 error.
- Képek: a scratchpadben (final-*, sz-hold*-*, sz-2025-*).
