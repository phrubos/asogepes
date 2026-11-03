# Ásógépes Talajművelés — UI/UX audit (második kör)

Dátum: 2026-11-03 · Ág: `chore/cleanup-2026` (a 2026-os adatokkal, commitolatlan munkával együtt) · Előzmény: `docs/2026-10-31-ui-ux-performance-analysis.md`

A 2026-os fotók hiánya szándékos (feltöltésre várnak), ezért nem számít hibának és nem von le pontot.

## 1. Összefoglaló

| Terület | 10-31 | **11-03** | Legsúlyosabb mostani gond |
|---|---|---|---|
| UX-heurisztikák (Nielsen/Krug) | 4 | **8** | A tartalmi oldalak vége zsákutca: nincs „merre tovább”, nincs eredmény-összegzés |
| Mobil nézet | 3 | **9** | A `/kutatas` 20 képernyő hosszú; a lenti alszakaszokra mutató deep linkek későn érnek célba |
| Layout / vizuális design | 6 | **8** | `/problema` szántás: 1440 px-en az idézet ~170 px-es oszlopba szorul, szavanként tör |
| Tipográfia | 3 | **9** | — (minden mérés zöld) |
| Akadálymentesség | 5 | **7** | A skip-link 3 oldalon célpont nélküli; a 3D-modell gombjának nincs neve |
| Teljesítmény | 4 | *nem mérve újra* | Csak dev szerver futott (lásd 9.); a 11-01-i production értékek az irányadók |
| Biztonság / karbantartás | 5 | **8** | Halott `BookLayout` + `HeroPage`; 2025-ös e2e tesztek; 48 fájl commitolatlan |

**A 10/10-hez vezető legfontosabb lépések** (részletek a 10. fejezetben):
1. Záró blokk a tartalmi oldalak végére: `/problema` → Technológia, `/technologia` → Kutatás, `/kutatas` → összegzés (2025 vs 2026) + kapcsolat (P1).
2. A szántás-idézet rácsa 1025–1600 px között (P1).
3. Skip-link célpont a `ScrollLayout` `<main>`-jén, név a 3D-modell gombjának, a `Timeline` `span` `aria-label`-jei (P1).
4. SEO-alapok és a „2025” cím (P2).

## 2. Módszertan

- **Szerver**: a futó `npm run dev` (localhost:3000), production build nem készült (a dev szerveren mérünk, lásd memória). A dev szerver lassabb, ezért az időzítéses eredmények (deep link, TBT) óvatosan kezelendők.
- **Skillek**: `ux-heuristics` (Nielsen/Krug, Quick Diagnostic, súlyosság 0–4), `performance-optimization` és `review-animations` szempontok, `information-architecture` (oldalvégek, összegzés).
- **QA-szkriptek** (`scripts/qa/`): `clip-check`, `type-check`, `mobile-check`, `layout-check`, `nav-check`, `motion-check`, `touch-check`, `hero-check` — **mind zöld**.
- **Új mérések**: axe-core (WCAG 2 A/AA + best practice) 1440 és 390 px-en, mind a 4 oldal; képsorozat (`shots.js`, 72 kép); deep link időzítés 10 alszakaszra; lábléc- és oldalvég-ellenőrzés; DOM-méret.
- **Kód**: `tsc --noEmit` (0 hiba), `npm run lint` (0 hiba, 4 figyelmeztetés), `npm audit --omit=dev`.

## 3. Ami azóta javult (10-31 → 11-03)

| 10-31-i tétel | Most |
|---|---|
| 4.1 Hero-betöltő a videóhoz kötve (57 s) | Poster azonnal, cím 117–276 ms alatt látszik, telefonon 0 videókérés (`hero-check`) |
| 4.2 / M1 Kilógó, levágott szöveg (117 elem) | 0 levágott elem 5 szélességen × 4 oldalon (`clip-check`) |
| 7. Törzsszöveg 10–11 px | Medián 15–20 px, 12 px alatti szöveg nincs (`type-check`) |
| M2–M5 Mobil navigáció (pöttyök, lebegő pirula, hamburger) | Egy sticky szekciósáv + Tartalom-lap; 44 px alatti célterület nincs (`mobile-check`) |
| M6 / A2 Hover-only kártyák | Koppintás, egér, Enter mind nyit/zár (`touch-check`) |
| L1 100vh-s holt képernyők | 300 px-nél nagyobb üres sáv telefonon nincs; szekciók a tartalomhoz igazodnak |
| A1 Reduced motion | `MotionConfig` + CSS; a főoldal reduced motion mellett állókép (`motion-check`) |
| P2 Mesterséges betöltők | Nincs teljes képernyős réteg; menü → új oldal ~730 ms (dev) |
| 4.3 Next 15.5.7 kritikus sebezhetőségek | Next 15.5.28; maradt egy build idejű `postcss` figyelmeztetés (lásd 8.) |
| 12. Duplikált hero-számok | A főoldal és a `/kutatas` hero is adatból számol (3 helyszín · 2 tenyészidő · 4 tábla) |
| Új: 2026-os adatok | ÉVAD-kapcsoló, „Lépésenként” (Story) blokkok, jelölők (`n=1`, `tarló`), Évek-sáv — következetesen a 11-02-i design-rendszer szerint |

A 2026-os blokkok UX-e erős: egyszerre egy fókusz, az olvasó léptet (Vissza / Tovább, „1 / 3”), a magyarázat a jelölésen ül, a bizonytalanság látszik. Ez a webhely eddigi legjobb mintája.

## 4. Új és nyitva maradt hibák

### 4.1 Oldalvégek: zsákutca, nincs összegzés — súlyosság 3 (IA)
- **Mért**: a `/problema`, `/technologia`, `/kutatas` alján egyetlen belső link sincs a látótérben, és lábléc sincs (a `Footer` csak a főoldalon jelenik meg; a `kutatas/layout.tsx` ráadásul DOM-manipulációval rejti).
- A `/problema` a szántott/ásógépezett szelvénnyel ér véget, nem vezet a megoldásra (Technológia). A `/kutatas` a lakiteleki fotókkal ér véget: két tenyészidő, 4 tábla adata után **nincs „mit tanultunk” blokk**. A fő állítások (a 11-02-i dokumentum 5. fejezete: mélyebb laza réteg mindkét évben, tavasszal melegebb / nyáron hűvösebb talaj, a hagyma egy hónappal előrébb jár) szétszórva, alszakaszokban vannak.
- **Javítás**: közös `PageEnd` blokk (következő oldal kártya + kapcsolat/partnerek) a `ScrollLayout` végére; a `/kutatas` végére „Összegzés: két év eredményei” szekció a meglévő Évek-sáv komponensekből. A `kutatas/layout.tsx` DOM-trükk törlése.

### 4.2 `/problema` szántás-idézet 1440 px-en szavanként tör — súlyosság 2 (layout)
- **Mért**: 1440×900-on és 1366×768-on a „A hagyományos szántás rövid távon…” idézet ~170 px széles, 22 sorra tör, a szekció 977–1015 px magas (a képernyőnél magasabb). 1920 px-en rendben (7 sor).
- **Ok**: háromoszlopos rács (fotó · idézet · kártyák), a középső oszlop kapja a maradékot. A jobb oszlop zárt kártyái közben 140–220 px magas, üres testtel foglalják a helyet.
- **Javítás**: 1025–1599 px között kétoszlopos rács (fotó + idézet felül, kártyák alatta vagy fordítva), vagy `minmax(320px, 1fr)` a középső oszlopra; zárt kártya csak a fejléc magasságú legyen.
- A `clip-check` ezt nem fogja meg (nem levágás). Javaslat: a `layout-check` kapjon egy „szövegoszlop < 240 px asztali nézetben” szabályt.

### 4.3 Skip-link célpont nélkül — súlyosság 2 (a11y)
`app/layout.tsx` `href="#main-content"`, de csak a főoldal `<main>`-je kapta meg az `id`-t; a `ScrollLayout` `<main className={styles.mainContent}>` nem (`ScrollLayout.tsx:444`). Billentyűzettel a három tartalmi oldalon az „Ugrás a tartalomhoz” semmit nem csinál. **Javítás**: `id="main-content"` a `ScrollLayout` `<main>`-jére.

### 4.4 Névtelen gomb: „3D Modell Betöltése” — súlyosság 2 (a11y, axe: critical)
`LakitelekChartPage.tsx:204` `motion.button` csak ikont tartalmaz; a felirat mellette van. Képernyőolvasó „gomb”-ot mond. **Javítás**: `aria-label="3D modell betöltése"` (vagy a felirat a gombon belül). Ugyanitt a `whileHover scale` a lejátszó ikonon (motion-szabály: kis ikont ne skálázzunk) — elég az árnyék/szín.

### 4.5 További axe-találatok — súlyosság 1–2
| # | Szabály | Hol | Javítás |
|---|---|---|---|
| A1 | `aria-prohibited-attr` ×7 | `Timeline` hónap-felirat: `<span aria-label="március eleje">` | A `span`-re `role="text"` helyett: látható „MÁRC.” mellé `sr-only` „március eleje”, a vizuális rövidítés `aria-hidden` |
| A2 | `nested-interactive` ×3 | `PhotoViewer` előnézet (`role=button`, benne lapozó gombok); `ScrollLayout` aktív navigációs elem | Az előnézet „Teljes kép” gombja legyen a nyitó, ne a teljes kép; a sín-elemben ne legyen gomb a gombban |
| A3 | `scrollable-region-focusable` ×3 | `Timeline` vízszintes görgetés (telefon), Lakitelek eredménytábla, fotóleírás | `tabIndex={0}` + `role="region"` + `aria-label` a görgethető dobozra |
| A4 | `heading-order` | `/problema` hero-kártyák, StaticChallenge címek, Módszertan „Mit mérünk” | h2 → h3 sorrend, vagy a kártyacímek `p`/`h3` |
| A5 | Angol akadálymentes feliratok | `PhotoViewer`/lightbox: „Open fullscreen view”, „Previous image”, „Next image”, „Close modal” | „Teljes képernyő”, „Előző kép”, „Következő kép”, „Bezárás” |
| A6 | `color-contrast` ×5–7 a Lakitelek Talajélet / További mérések fejlécein | valószínűleg álpozitív: a mérés a Framer-belépő (opacity) közben futott, a képeken a szöveg olvasható | ellenőrizni a belépő után; nem javítandó, ha a valós kontraszt ≥ 4,5 |

### 4.6 A hero `<h1>` szerveroldalon csonka — súlyosság 2 (SEO, a11y)
A gépírás-effekt (`useTypewriter`) üres szövegről indul, így a szerver HTML-ben az `<h1>` csak „A talaj nem” — a lényeg („végtelen erőforrás”) hiányzik a keresőnek, a JS nélküli olvasónak és a képernyőolvasónak az első pillanatban; 10 s-onként ki is törlődik. **Javítás**: a teljes cím legyen a DOM-ban (`sr-only` vagy kezdőállapot = teljes szöveg), az effekt csak vizuális réteg (`aria-hidden`); vagy egyszeri begépelés, törlés nélkül.

### 4.7 Krém színű villanás ugráskor — súlyosság 1
A `?section=` deep link ugrás közben (desktopon 85 px, telefonon 220 px magas sávban) a `body` krém háttere (`--color-cream`) látszik, mert a `content-visibility` miatt még nem rajzolt szekciók átlátszók. **Javítás**: a tartalmi oldalakon a `html`/`body` (vagy a `ScrollLayout` gyökér) háttere a sötét szekció-háttér.

### 4.8 Deep link a lenti alszakaszokra telefonon későn ér célba — súlyosság 1–2 (dev szerveren mérve)
| Alszakasz (390 px) | 1 s | 2,5 s | 5 s |
|---|---|---|---|
| `szentkiraly-fejlodes` | 517 px | 64 ✔ | 64 ✔ |
| `lakitelek-talajelet` | 6808 | 894 | 64 ✔ |
| `lakitelek-meresek` | 7805 | 2453 | 64 ✔ |
| `lakitelek-photos` | 8583 | 3159 | **388** ✘ |

Asztalon minden 2,5 s-on belül célba ér. A `nav-check` csak szekció-szintű linket (`?section=lakitelek`) teszt; javasolt egy alszakasz-eset (`lakitelek-photos`) is. Production buildön újramérendő; ha ott is > 2 s: nem sima görgetés, hanem azonnali ugrás + a célpont fölötti szekciók `contain-intrinsic-size`-ának pontosítása.

## 5. Mobil (≤1024 px)

Minden szkript zöld (0 levágás, 0 átfedés, 0 kicsi célterület, egy 20 px-es margó, balra zárt címek). Az új 2026-os blokkok (Story, ÉVAD-szegmens, Évek-sáv) a mobil mintákat követik.

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| M1 | `/kutatas` telefonon 16 666 px ≈ **20 képernyő** (a 2026-os alszakaszokkal nőtt) | 2 | A 4.1-es összegzés az elejére is (rövid „Fő eredmények” a hero alá, linkekkel); a Fotók alszakaszok összecsukva |
| M2 | Lenti deep linkek késése (4.8) | 1–2 | lásd 4.8 |
| M3 | `/problema` 2899 SVG-csomópont (talajrögök) — a DOM 87%-a | 1 | Ha a mobil TBT újra nő: a rögök egy `<image>`/raszter rétegként |

## 6. Layout és vizuális design (asztali)

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| L1 | Szántás-idézet (4.2) | 2 | lásd 4.2 |
| L2 | `/problema` szántás jobb oszlop: zárt „Szántás hatásai” kártyák nagy, üres testtel | 1 | zárt állapotban fejléc-magasság |
| L3 | `/technologia` Alkalmazási útmutató: a kártyák alcíme „…más eszköz nél” ellipszissel levágva 1440 px-en | 1 | két sor engedése (`line-clamp: 2`) vagy rövidebb alcím |
| L4 | Az útmutató kártyáin a „Lásd a kísérletben” gomb telefonon látszik, asztalon csak hoverre jelenik meg | 1 | asztalon is látható link (Recognition > recall) |
| L5 | Erősség: a 2026-os blokkok vizuális nyelve (arany = ásógép, szürke = kontroll, csíkozás = mély) minden táblán azonos | — | — |

## 7. Navigáció és információs architektúra

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| N1 | Trunk Test: oldalcím, aktív menüpont, szekciósín / mobil szekciósáv — teljesül | — | — |
| N2 | Eredmény-összegzés hiánya (4.1) — a 10-31-i N2 nyitva, két évvel már sürgetőbb | 3 | `/kutatas` záró szekció + rövid változat a főoldalon |
| N3 | Lábléc és záró CTA hiánya a tartalmi oldalakon (4.1) | 2 | `PageEnd` |
| N4 | SEO-alapok: nincs `not-found`, `icon`, `robots`, `sitemap`, OG-kép (10-31-i N5, nyitott) | 2 | `app/not-found.tsx`, `app/icon.png`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.*` |
| N5 | Az oldal címe még „Tudományos Kutatás 2025” (`app/layout.tsx:14`); a `/problema` címe „Ásógépes Technológia”, a többi „Ásógépes Talajművelés” | 1 | „… · 2025–2026”; egységes márkanév a címekben |
| N6 | Keresés nincs — 4 oldalas webhelyen nem szükséges | 0 | — |

## 8. Akadálymentesség, kód, biztonság

- Akadálymentesség: 4.3–4.6. Pozitív: `lang="hu"`, minden képnek `alt`, a Story `aria-current="step"` + `aria-live`, az ÉVAD-gombok `aria-pressed`.
- ESLint: 4 `exhaustive-deps` figyelmeztetés (10-31: 6), köztük a halott `BookLayout`-ban.
- **Halott kód**: `experiment/BookLayout/*` és `experiment/pages/HeroPage.tsx` (a régi „9 kombináció, 6 hónap” szöveggel) csak egymásra és a `pages/index.ts` barrelre hivatkoznak; törlendők (CSS-ükkel együtt).
- `npm audit --omit=dev`: a `next` által hozott `postcss` (high, de build idejű: csak megbízhatatlan CSS feldolgozásánál számít — itt nincs ilyen). A javítás Next 16; addig elfogadható, a következő 15.5.x patchnél újranézni.
- E2E tesztek (`tests/`) a 2025-ös tartalmat tesztelik, nem frissültek; a QA-szkriptek fedik le a valós szabályokat. Javaslat: az e2e-ket törölni vagy a QA-szkriptekre építeni.
- **48 fájl commitolatlan** (≈ +1979 / −891 sor, a 2026-os adatmunka) — érdemes commitolni, mielőtt a javítások elkezdődnek.

## 9. Teljesítmény

Nem mértem újra: csak a dev szerver futott, ott a TBT/LCP nem mérvadó. Az utolsó production mérés (11-01, `docs/2026-10-31-…` 13.1): mobil TBT `/problema` ~440 ms, `/kutatas` ~280 ms, `/technologia` ~400 ms; LCP 0,8–3,2 s; CLS ≤ 0,011.

Kockázat azóta: a `/kutatas` két új Story-blokkal, a talajélet-idővonallal és a hagyma-animációval bővült; a `content-visibility` és a `useLoopActive` ezt elvileg kezeli. **Javaslat**: egy `perf.js` futás a QA-buildön (`.next-qa`, 3100-as port), mielőtt a `main`-re megy.

## 10. Javasolt ütemterv

| Prioritás | Feladat | Érintett fájlok | Méret |
|---|---|---|---|
| **P1** | `PageEnd` záró blokk (következő oldal + kapcsolat), `kutatas/layout.tsx` DOM-trükk törlése | `shared/ScrollLayout`, `layout/Footer`, `app/kutatas/layout.tsx` | S–M |
| **P1** | `/kutatas` „Két év eredményei” összegzés (az Évek-sáv komponensekből) | új szekció, `ResearchScrollLayout` | M |
| **P1** | Szántás-idézet rács 1025–1599 px; zárt kártyák magassága | `problem/…Ploughing…`, `ProblemNew.module.css` | S |
| **P1** | Skip-link `id`, 3D-gomb neve, `Timeline` `aria-label`, magyar feliratok a `PhotoViewer`-ben | `ScrollLayout.tsx`, `LakitelekChartPage.tsx`, `Timeline.tsx`, `PhotoViewer` | S |
| **P2** | Teljes `<h1>` a DOM-ban (gépírás csak vizuális) | `home/Hero.tsx`, `useTypewriter` | S |
| **P2** | SEO-alapok + cím „2025–2026” | `app/` | S |
| **P2** | Sötét háttér a tartalmi oldalakon (krém villanás) | `globals.css` / `ScrollLayout` | S |
| **P2** | nested-interactive, görgethető régiók, heading-order | `PhotoViewer`, `Timeline`, `LakitelekChartPage` | S |
| **P2** | Halott `BookLayout` + `HeroPage` törlése | `experiment/BookLayout`, `pages/HeroPage.tsx`, `pages/index.ts` | S |
| **P3** | Deep link alszakasz-teszt a `nav-check`-be; „keskeny szövegoszlop” szabály a `layout-check`-be | `scripts/qa/` | S |
| **P3** | `perf.js` a QA-buildön; e2e tesztek sorsa | — | S |
| — | 2026-os fotók feltöltése (már tervezett, nem hiba) | `public/images/kutatás_pics`, `data.ts` | — |

## 11. Hatókörön kívül

- A 2026-os fotók hiánya (szándékos, nem pontozva).
- Production build és teljesítménymérés (9.); valódi eszközös (iOS/Android) teszt.
- A kutatási számok szakmai helyessége (a 11-02-i dokumentum ellenőrizte őket).
- Az audit nem változtatott a kódon.

## 12. Elvégezve — P1 (2026-11-03, dev szerveren ellenőrizve)

- **Oldalvégek**: új `shared/PageEnd` (következő oldal + a kutatást végzők), a `ScrollLayout` `end` propján: `/problema` → Technológia, `/technologia` → Kutatás, `/kutatas` → Alkalmazási útmutató (`?section=application-guide`). A `app/kutatas/layout.tsx` DOM-trükk törölve. Mobilon a `.section:last-child` → `:last-of-type`, hogy az utolsó szekció alsó térköze megmaradjon.
- **Összegzés** (`experiment/sections/SummarySection`, új „05 Összegzés” szekció): 5 kártya, minden szám a `seasons.ts`-ből számolva (laza réteg a tenyészidő végén mindkét évben, talajhő 2026, hagyma fejlődése, paradicsomtábla, Lakitelek fenntartással), „Részletek” gomb az alszakaszra; a talajélet kísérő adatként jelölve. Asztalon felülre igazítva, a menüből ugrva a jelvény 76 px-en (1366/1440/1920).
- **Szántás-idézet**: 1201–1799 px között a kép és a kártyák egymás mellett, az idézet alattuk teljes szélességben → 22 sor helyett 4 sor (1201–1600 px mérve).
- **Akadálymentesség**: `id="main-content"` a `ScrollLayout` `<main>`-jén (skip-link), `aria-label` a 3D-modell gombján, a `DateLabel` `aria-label` helyett `sr-only` szöveg, magyar feliratok a `PhotoViewer`-ben. Az axe button-name, aria-prohibited-attr és skip-link találatai eltűntek.
- **QA**: `mobile-check` mostantól a szöveg saját elemének levágását is figyeli (`.sr-only`). Mind zöld: clip, type, mobile, layout, nav, touch; tsc (src) és lint 0 hiba.
