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
