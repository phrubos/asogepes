# Mobil újratervezés — napló

Spec: `docs/superpowers/specs/2026-11-01-mobile-redesign-design.md`. Döntések (felhasználó, 2026-11-01): felső sáv + Tartalom lap; márka marad, fegyelmezve; csak ≤1024 px.

## 1. fázis — közös keret
- `MobileSectionBar` (új): 56 px-es tapadó sáv az aktuális szekció + alszekció nevével; koppintásra alsó lap (role=dialog, fókuszcsapda, Esc / háttér zár, body-scroll lock) minden szekcióval és alszekcióval. ≤1024 px-en a pöttysor (sidebar) és a „Görgess lejjebb” korong eltűnik; a `NextSectionIndicator` mobilon nem is mountol.
- Szekciók ≤1024 px: `min-height: 0`, 20 px oldalmargó, 64 px köz; az első szekció 56 px-rel lejjebb kezd. Ugrás után a cél 64 px-re a tetejétől (a sáv alatt).
- `Navigation`: hamburger 1024 px-től (eddig 900), az 56 px-es sáv jobb szélén; a fejléc üres része átengedi a koppintást (`pointer-events`).
- FINDING + mitigáció: a képoptimalizáló hosszan futó, memóriahiányos szerveren ismét elakadt (két 1920 px-es Lakitelek-ortofotó, mögöttük minden képkérés). Friss szerveren 15 egyidejű hideg kódolás sem akadt el → nem reprodukálható determinisztikusan. Mitigáció: a 2560 px-nél nagyobb forrásképek (8 db) 2560 px-re méretezve (arány megtartva, ±0,0004; a hőkép-jelölők %-osak) — 21,5 → 7,9 MB, kevesebb memória dekódoláskor. A hero-háttér maradt (nagyobb lett volna).
- QA: nav-, touch-, motion-, type-check zöld; clip-check 7 méret × 4 oldal = 0.

## 2. fázis — /problema
- Új `scripts/qa/mobile-check.js` (390 és 360 px): üres sáv > 300 px, egymásra rajzolt szövegek (overflow-val levágott szöveg nem számít), 44 px alatti érintési célok. Kiindulás: 69 hiba a 4 oldalon.
- Hero: a három „ásó” kártya helyett `HeroTopicList` (közös komponens, a /technologia is ezt használja): cím + mélység („0–20 cm mélyen”), koppintásra ugrik; hero szöveg balra zárva.
- `ProblemNew`: `.scrollSection` / `.contentWrapper` / `.combinedSection` / `.ploughPageContainer` mobilon a tartalomhoz nő (eddig 100vh + 100/120 px padding).
- Tömörödés: a szimuláció felirata a kép alá kerül; a három lenyitható kártya mobilon `StaticChallenge` lista (ikon, cím, szöveg, arany adat) — a szántás-hatások ugyanígy; a kultivátor-problémák CSS-sel ugyanerre a mintára. A szimulált állapot egy oszlopban.
- Kultivátor- és szántásfotó 16:10 (eddig 4:5, 50–60vh); az idézet balra zárt, arany függőleges vonallal.
- Eredmény: /problema 8665 → 6786 px (−22%); mobile-check 0 hiba (eddig 9).

## 3. fázis — /technologia
- FINDING + fix (minden oldal): 20 `@media (max-height: …)` laptop-szabály (125%-os skálázás) telefonon is érvényesült (844 px magas kijelző) — pl. a modellfotó ettől lett apró. Mind `and (min-width: 1025px)`-re szűkítve; asztali nézet változatlan.
- Új globális `.mobile-static` (≤1024 px: `opacity: 1; transform: none !important`) a Framer-belépőkre, amelyek görgetésig elrejtik a tartalmat. A `ModelsCombinedPage` inline stílusai CSS-modulba kerültek; a modellek mobilon a tartalomhoz nőnek.
- Hero balra zárt, alatta témalista; `sections.module.css` `.scrollSection` mobilon a tartalomhoz nő.
- Működési elv: balra zárt fejléc, a videó két címkéje a kép alatt jelmagyarázatként (a gépet takarták), a jellemzők listaként.
- Alkalmazási útmutató: a csak hoverre megjelenő „Lásd a kísérletben” link mobilon mindig látható gomb a kártya alján; az alcímek tördelődnek (eddig levágva).
- „Részletek” link 44 px magas.
- Eltérés a spectől: a modellek közti szegmens-váltó nem készült el (a 3 modell egymás alatt olvasható, a `model-*` mélylinkek változatlanok) → oldalhossz 7786 → 7408 px (−5%, a cél −25% volt).
- mobile-check /technologia 0 hiba (eddig 8).

## 4. fázis — /kutatas
- Hero: balra zárt; a három szám soronként (szám + mit számol), a térkép a tartalomhoz méretezve.
- Szekciók és oldalblokkok (`sections.module.css`, 11 oldal-modul, `CombinedPage`) mobilon a tartalomhoz nőnek: nincs `height: 100%` + belső görgetés, nincs saját oldalpadding (a margót a layout adja), alszekciók között 64 px.
- Módszertan balra zárt.
- `PhotoViewer` (közös): mobilon 4:3 előnézet; a sűrű feliratokat (értékek, vonal- és nyílfeliratok, vízjel) az előnézet elrejti — `[data-preview]` hatókör, a teljes képernyős nézetben (portál) megmaradnak; alatta „Teljes kép a mért értékekkel” gomb (44 px). A leírás a lapfolyamban olvasható (eddig 560 px-es belső görgetődoboz, a B–E pontok nem látszottak).
- Lakitelek: fejléc egymás alatt, „Teljes képernyő” 44 px, az eredménylista teljes szöveggel (eddig egysoros levágás + 2 soros clamp). A 3D modell eddig is csak a lejátszás gombra töltődik be.
- mobile-check /kutatas 0 hiba (eddig 31).

## 5. fázis — főoldal
- A CTA link a gomb méretét kapja (eddig 250×20 px-es inline link volt a gomb körül), aláhúzás nélkül.

## Ellenőrzés (QA build, :3100)
- mobile-check 8/8 ok (4 oldal × 390/360 px); touch-check (telefonon a kártyaszöveg koppintás nélkül látszik, a /problema témalista ugrik; touch laptop / egér / billentyű változatlan), nav-, motion-, type-, hero-, clip-check zöld.
- perf mobile4g: TBT 218 / 345 / 353 / 437 ms, CLS 0.000 mind a 4 oldalon (cél ≤ 450 ms, ≤ 0.05). Desktop CLS ≤ 0.038.
- `mobile-check.js`: a `html`/`body` overflow nem számít vágásnak (a viewportra hat); új `--debug=y0-y1` kapcsoló.
- Oldalhossz 390 px-en (QA build): / 1173, /problema 6944, /technologia 7408, /kutatas 10741 px. Csökkenés a fázis elején mért állapothoz képest: /problema −20%, /technologia −5%, /kutatas −14%. A −25%-os cél csak részben teljesült; a fő ok, hogy a szöveg és az adat megmaradt, csak az üres sávok és a dobozok tűntek el.
- Nyitott: a Lakitelek-eredménysor értékcsíkja keskenyíti a szöveget, a MagneticButton `<a>`-n belüli `<button>` (beágyazott interaktív elem, régi).

## 6. fázis — /technologia modellváltó
- Mobilon (≤1024 px) egyszerre egy modell látszik; felül háromgombos szegmens-váltó (név + típus, `role="tablist"`, nyilak / Home / End), a modell végén „Következő modell” gomb. Ha az olvasó a modell közepén vált, az új modell tetejére ugrik (reduced motion alatt azonnal). Asztali nézet változatlan (3 modell egymás alatt, a váltó nem jelenik meg).
- A modell fejléce mobilon csak képernyőolvasónak marad meg (a kiválasztott fül már megnevezi).
- Mélylinkek: a `ScrollLayout` ugrás előtt `scroll-layout-target` eseményt küld (`SCROLL_TARGET_EVENT`); a modellek oldala erre `flushSync`-kel kiválasztja a célmodellt, így a `?section=model-*`, a Tartalom lap és a hero témalista a megfelelő modellt nyitja meg, és a 64 px-es pozícióra ugrik.
- touch-check: új telefonos tesztek (csak az első modell látszik, a 38WX fül átvált, a `?section=model-40sx` megnyitja és odaugrik).
- Eredmény: /technologia 7408 → 4859 px (−34%, a −25%-os cél teljesült); mobile4g TBT 436 ms, CLS 0.000; desktop CLS 0.038 (változatlan). A teljes QA-sor zöld.

## 7. fázis — nyitott pontok
- **Főoldali CTA:** a `MagneticButton` új `href` propja `motion.create(Link)`-et renderel; a CTA egyetlen link (eddig `<a>`-ban `<button>`, két tab-stop).
- **Lakitelek eredménysorok:** mobilon az értékcsík a kezelés neve mellett, a leírás alatta teljes szélességben (eddig a csík a jobb oldalon keskenyítette a szöveget).
- **Oldalhossz, valódi kiindulóponttal mérve:** a redesign előtti commitot (`d8f4daa`) külön worktree-ben buildeltem, `content-visibility` nélkül mértem. A korábbi számokat a `content-visibility` becsült magassága torzította. Kiindulás: /problema 8665, /technologia 7785, /kutatas 13263 px.
  - /problema: a szimulált állapot kártyái egysorosak, a „VS” elválasztó eltűnt, a kultivátor-lapok paddingje a layoutból jön, a két talajszelvény között 16 px.
  - /kutatas: idővonal egy sorban (a sávnevek helyett a színkulcs), hőmérséklet két oszlopban, művelési lépések egymás mellett, tényadatlap ikon nélkül, műszer + skála egy panelben, 16:10 fotók, 3D helykitöltő 16:9 a betöltésig, alszekciók között 48 px, a lapok függőleges paddingje 0; a helyszín-címke, a „Módszertan” címke és a dekoratív címvonalak mobilon rejtve (a felső sáv kiírja).
  - Eredmény (QA build): /problema 6463 (−25,4%), /technologia 4859 (−37,6%), /kutatas 9924 (−25,2%).
- **FINDING (perf):** a rövidebb módszertani blokk miatt a Szentkirály-szekció (kb. 3360 px) betöltéskor a `content-visibility` renderelési sávjába került; minden képbetöltés újra-layoutolta, /kutatas TBT ~300 → ~520 ms (A/B a `cca0370`-hoz, Chrome-trace: Layout 175 → 475–585 ms). Javítás: mobilon a helyszínek 2. alszekciójától `content-visibility: auto` (`CombinedPage.module.css`). Ezzel ~340 ms.
- Ellenőrzés: a teljes QA-sor zöld; mobile4g TBT 250 / 409–450 / 353–390 / 325–338 ms, CLS 0.000; desktop CLS ≤ 0.038.
