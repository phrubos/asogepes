# Ásógépes Talajművelés — UX-audit (negyedik kör) + vizuális design-pontozás

Dátum: 2026-11-15 · Ág: `preview/megrendelo-2026-11` (`a9de234` + commitolatlan angol változat) · Előzmény: `docs/2026-11-06-ux-heuristika.md`, `docs/2026-11-09-mobil-ux-attekintes.md`
Módszer: a futó dev szerver (localhost:3000), production build nem készült. Skillek: `ux-heuristics` (Nielsen/Krug, súlyosság 0–4) és az új `ui-design-review` (10 vizuális dimenzió, 0–10). Az angol (`/en/...`) oldalak nem részei a pontozásnak.

## 1. Pontszámok

### UX-területek (a korábbi körökkel összevethető)

| Terület | 10-31 | 11-03 | 11-06 | 11-09 | **11-15** | Mi változott / mi hiányzik még |
|---|---|---|---|---|---|---|
| UX-heurisztikák (Nielsen/Krug) | 4 | 8 | 8 | — | **9** | A fő eredmények a hero után (007), egy évkapcsoló helyszínenként (009), kapcsolat-lábléc (023), magyar 404. Nyitott: szakszavak (K8), a főoldali gomb telefonon a 2. képernyőn (K12) |
| Mobil mechanika | 3 | 9 | 9 | 9 | **9** | `mobile-check`, `layout-check`, `touch-check` zöld; 0 átfedés, 0 kis célterület |
| Mobil érthetőség | — | — | — | 7 | **8** | A `/kutatas` 26,7 → 19,9 képernyő, az eredmény a 2. képernyőn. Még mindig a leghosszabb oldal |
| Layout / vizuális design | 6 | 8 | 8 | — | **8** | Lásd a vizuális design-táblát (78/100) |
| Tipográfia | 3 | 9 | 9 | — | **9** | Folyószöveg medián 15 px, sormagasság 1,5–1,6. Apróság: Arial a „Részletek” gombokon, 3 asztali bekezdés > 85 karakter/sor |
| Akadálymentesség | 5 | 7 | 8 | — | **9** | axe: 1 valódi hiba (`landmark-unique`), a 9 kontraszthiba álriasztás (2.2) |
| Információs architektúra / SEO | — | — | 6 | — | **9** | `robots`, `sitemap`, ikon, 404, egységes cím; a hreflang az angol változattal érkezik |
| Arculat, tartalmi következetesség | — | — | 8 | — | **9** | Egységes földszín + Fraunces/Inter/mono, partnerlogók, talajszelvény-lábléc |
| Karbantartás / QA | 5 | 8 | 8 | — | **8** | Két ismert álriasztás a szkriptekben (`nav-check` Suspense, `clip-check` térképfeliratok), egy új (`type-check` a főoldalon); a régi `.next-qa` típusai miatt a `tsc` hibát ír |
| Teljesítmény | 4 | — | — | — | **nincs mérve** | Csak dev szerver futott; a `hero-check` zöld (cím 396 ms lassú asztalin, 0 `.mp4` mobilon) |

**UX-összkép: 9/10** (11-06: 8/10). Katasztrofális (4) vagy súlyos (3) hiba nincs.

### Vizuális design (`ui-design-review`, 0–10)

| # | Dimenzió | Pont | Indok (mérés + képernyőkép) |
|---|---|---|---|
| 1 | Vizuális hierarchia | **8** | Erős főcím és egyetlen arany fő gomb; az eredménykártyák (címke → cím → számsor → magyarázat) jól szkennelhetők. Asztalon a 100vh-s blokkok tetején 150–230 px üres sáv (szándékos döntés, 018) |
| 2 | Tipográfia | **8** | 3 tudatos család (Fraunces címek, Inter szöveg, JetBrains Mono adatok), folyószöveg 15 px, sormagasság 1,4–1,6. A `/kutatas` leggyakoribb mérete 12 px (298 elem, főleg mono nagybetűs címkék), ettől sűrű; 39 beírt betűméret a CSS-ben; Arial szivárog a `SummarySection` gombjaiba; egy bekezdés 140 karakter/sor (`LakitelekSoilLifePage_lead`, 1440 px) |
| 3 | Színpaletta | **8** | Koherens barna–arany, kék nincs; jó kontraszt sötét alapon. 309 beírt színérték, és egy zöld jelvényszín („Szimulált állapot”) a palettán kívül |
| 4 | Térközök, levegő | **7** | Telefonon egy 20 px-es margó, rendezett ritmus (`layout-check` zöld). A 4 px-es rácsra eső értékek aránya a `/kutatas`-on csak 66 % (máshol 80–87 %), 38 különböző térköz egy oldalon |
| 5 | Vizuális következetesség | **7** | 37 lekerekítés és 56 árnyék a CSS-ben; a `/problema` „szimulált állapot” kártyái kétféle fejlécet használnak (nagybetűs címke + szám vs. Fraunces cím + szöveg) |
| 6 | Képek, grafikák | **7** | Valódi terepfotók, illeszkedő géprenderek, saját SVG-szelvények. A `/technologia` működési videójának nincs posztere (`preload="none"`), ezért indításig üres szürke doboz natív lejátszóvezérlőkkel, asztalon és telefonon is |
| 7 | Layout, rács | **8** | Bal oldali fejezetsín + tartalom, telefonon sticky szekciósáv. A `/problema` 3 kártyája 2 oszlopos rácsban árva cellát hagy (1440 px) |
| 8 | Komponensek | **8** | Kártyák, lapozós Story-blokkok, szegmensválasztó (38SX/38WX/40SX), pirulák; minden interakció tappal és billentyűvel is működik. A böngésző natív videóvezérlője kilóg a saját stílusból |
| 9 | Arculat, személyiség | **9** | Egyedi, nem sablonszerű: földszín, Fraunces, talajszelvény-lábléc, mono adatnyelv |
| 10 | Kortárs színvonal | **8** | Sötét, szerkesztői hangulat, takarékos mozgás, reduced-motion kezelve |

**Design-összpontszám: 78/100 (B, „Professional Design”, 3. szint)**, közel a 80-as „Design Excellence” határhoz. Első benyomás (főoldal): 9/10.

## 2. Mérések

| Ellenőrzés | Eredmény |
|---|---|
| `mobile-check` | zöld (360/390 px: 0 üres sáv, 0 átfedés, 0 kis célterület) |
| `layout-check` | zöld |
| `motion-check` | zöld |
| `touch-check` | zöld |
| `hero-check` | zöld (cím 396 ms lassú asztalin) |
| `token-check` | zöld, mind az 5 szám a plafonon (betűméret 39, lekerekítés 37, árnyék 56, szín 309/310, átmenet 82) |
| `clip-check` | piros: 17 elem, mind a helyszíntérkép SVG-városneve a tábla-zoomnál (ismert, a táblán „ötlet”) |
| `nav-check` | piros: a Suspense-szabály a dev szerver streamelése miatt álriaszt (11-06, Q1); a menü és a `?section=` deep linkek rendben |
| `type-check` | piros a főoldalon: „medián 12 px”, de csak 3 mintából (a főoldalon szinte nincs 40 karakternél hosszabb szövegelem, a 3 minta mind címke). A tartalmi oldalak 15 px-esek |
| ESLint | 0 hiba |
| `tsc --noEmit` | a forrás tiszta; a hibák a régi `.next-qa/types` mappából jönnek (az `(hu)` útvonal-áthelyezés előtti build) |
| axe 1440 + 390 px | `/`, `/problema`, `/technologia`: 0 · `/kutatas`: `color-contrast` ×9 (álriasztás), `landmark-unique` ×1 |

### 2.1 Tipográfia és térköz, számokban (1440 px / 390 px)

| Oldal | Betűméretek | Családok | Sormagasság (medián) | Karakter/sor (medián / max) | 4 px-es rácson | Képernyő |
|---|---|---|---|---|---|---|
| `/` | 9 / 7 | Inter, Fraunces, mono | — | — | 83 % / 72 % | 1,5 / 1,9 |
| `/problema` | 15 / 11 | Inter, Fraunces, mono | 1,6 / 1,55 | 51 / 39 | 87 % / 86 % | 8 / 7,9 |
| `/technologia` | 11 / 9 | Inter, Fraunces, mono | 1,5 / 1,5 | 72 / 47 | 83 % / 80 % | 7,8 / 6,4 |
| `/kutatas` | 13 / 10 | + Arial (17 elem) | 1,55 / 1,55 | 61 / 140 → 47 / 54 | 66 % / 66 % | 19,9 / 19,9 |

### 2.2 A `/kutatas` kontraszthibája álriasztás

Mind a 9 elem a Lakitelek-blokkok végén van (`#lakitelek-talajelet`, `#lakitelek-meresek`, `#lakitelek-photos-2026`, `LakitelekRyeBoard`). Az axe a krém `body`-t (`#f5f0e8`) veszi háttérnek, a valódi háttér a `ScrollLayout_scrollContainer` sötétbarnája (rgb 31, 26, 22); a képernyőképen a szöveg jól olvasható. Valószínűleg az új függönyös lábléc miatt: a lap alján a krém `body` „látszik” az axe-nak. Megszűnne, ha a `body` is sötét lenne (a tábla „Sötét háttér a tartalmi oldalakon” ötlete).

## 3. Hibák súlyosság szerint

| # | Hiba | Hol | Súly. | Javaslat |
|---|---|---|---|---|
| D1 | A működési videónak nincs posztere: indításig üres szürke doboz natív vezérlőkkel | `solution-v2/OperationPrinciple.tsx:130` | **2** | `poster` egy jellemző képkockával (pl. `/images/...-poster.webp`); a vezérlők csak lejátszáskor látsszanak |
| D2 | Túl hosszú sor asztalon: 140 karakter/sor | `LakitelekSoilLifePage_lead`, `BulkDensityMethodPage_foot` (101), `MethodologyBlocks_lead` (86) | **1** | `max-width: 68ch` a lead/foot bekezdéseken |
| D3 | Arial a „Részletek” gombokon (a `<button>` nem örökli a betűtípust) | `experiment/sections/SummarySection` | **1** | `font: inherit` a gombon |
| D4 | `landmark-unique`: a lakiteleki eredménytábla `role="region"`-je név nélkül ismétlődik (2025/2026) | `LakitelekChartPage` `resultsTableWrapper` | **1** | Egyedi `aria-label` évvel („Eredménytábla, 2025”) |
| D5 | Kétféle kártyafejléc a „Szimulált állapot” rácsban + árva cella | `/problema` 1440 px | **1** | Egységes fejléc; 3 kártya egy sorban vagy az utolsó teljes szélességben |
| D6 | Térköz-szórás a `/kutatas`-on (38 érték, 66 % a 4 px-es rácson) | `experiment/**/*.module.css` | **1** | A `--space-*` tokenekre terelés a következő érintéskor; a `token-check` bővítése térközökre |
| D7 | A szkriptek három álriasztása miatt piros a QA | `nav-check`, `clip-check`, `type-check` | **1** | Suspense-szabály csak QA-buildön; térképfeliratok kizárása; `type-check` minimum mintaszám (pl. n ≥ 8) |
| K8, K12 | Szakszó-magyarázatok; a főoldali gomb telefonon a 2. képernyőn | 11-09-i lista | 1 | változatlanul nyitott |

## 4. Út a 10/10-hez (design 78 → 85+)

1. **D1 videóposzter**: a legláthatóbb vizuális hiba, egyfájlos javítás → Képek 7 → 8.
2. **D2 + D3** (sorhossz, Arial): tipográfia 8 → 9.
3. **D5 + egységes jelvényszín**: következetesség 7 → 8.
4. **Térköztokenek a `/kutatas`-on** (D6), lehetőleg a `token-check` bővítésével: térközök 7 → 8.
5. **Sötét `body`** a tartalmi oldalakon: megszünteti az axe-álriasztást.
6. **Teljesítmény újramérése** QA-buildön (`perf.js`), ha kéred.

## 5. Javítva (2026-11-15, ugyanaznap)

| # | Javítás | Mérés utána (dev szerver) |
|---|---|---|
| D1 | `poster="/images/andornak-poster.webp"` (a videó első képkockája, 1280 px, 55 kB) + `width/height` a képarányhoz | 1440 és 390 px: a poszter látszik, nincs szürke doboz |
| D2 | `LakitelekSoilLifePage` lead asztalon és `BulkDensityMethodPage` foot: `max-width: 68ch` | mindkettő 643 px széles (korábban a talajélet-lead a teljes kártyaszélesség) |
| D3 | Globális `button, input, select, textarea { font-family: inherit }` a `globals.css`-ben (nem csak a „Részletek” gomb: a Story lapozó-, kapcsoló-, mélységválasztó-, modellfül- és nagyítógombok is Arialt kaptak) | Arial-szöveg: 0 mind a 4 oldalon (korábban 17 + 21 elem) |
| D4 | A lakiteleki eredménytábla `aria-label`-jében az év | axe: `landmark-unique` 0; a 9 `color-contrast`-álriasztás marad |
| — | `/problema` illusztráció (`InteractiveSoil`: „Tömörödött réteg”, mélységskála, manométer) és az „O₂” ikon: `var(--font-mono), monospace` az általános `monospace` helyett | JetBrains Mono, nincs ütközés a képen |
| — | `OperationPrinciple`: reduced motion mellett (natív vezérlők) a címkék `top: 64%`-on; telefonon a jelmagyarázat belépője csak átlátszóságot animál | 1440 px: címkék alja 590 px, vezérlősáv 612 px-től. 390 px: a jelmagyarázat 8 px-rel a videó alatt (korábban 8 px-rel rálógott, mozgáscsökkentéstől függetlenül) |

Maradt: a fotók vízjele (`BeforeAfterSlider`) `system-ui`, ez a kamera-felirat jellege miatt maradhat.
