# Tábla

Utoljára frissítve: 2026-11-10. Folyamat és státuszok: [README](README.md).

| # | Feladat | Státusz | Fájlok | Párhuzamosan? | Forrás / megjegyzés |
|---|---|---|---|---|---|
| [004](004-lakitelek-3d-fold-alatt.md) | Lakitelek 3D: hengerek a föld alatt (rizotron), színkód, penetrométer | folyamatban (dev szerveres ellenőrzés hátra) | `experiment/FieldChart3DCanvas.tsx`, `experiment/pages/LakitelekChartPage.tsx` | igen | Attila üzenete 11-07; nyitott kérdések a jegyben |
| [008](008-technologia-utmutato-modellkartya.md) | `/technologia`: másodlagos „Lásd a kísérletben” gombok telefonon, összehasonlítás a 38SX kártyán | vár (megrendelőre: csillagok forrása; kutatókra: 38SX számok eltérése) — a kód kész, checker rendben | `solution-v2/ApplicationGuide.module.css`, `solution-v2/ModelSection.*` | igen | mobil UX 11-09 K5–K7 |
| — | 2026-os fotók feltöltése a kutatás oldalra | részben (Lakitelek rozs: 014; Szentkirály paradicsom: 013) | `public/images/kutatás_pics`, `src/lib/data.ts` | igen | audit 11-03 §10 |
| — | Lakitelek: melyik mérés az évek közötti híd (2026 júl. vége tarlón készült) | vár (kutatókra) | `experiment/pages/Lakitelek*`, `seasons.ts` | igen | adatdok. 11-02 §7–8 |
| — | 2026-os géptípusok (38SX / 38WX / 40SX) helyszínenként | vár (kutatókra) | `src/lib/data.ts`, `experiment/pages/*` | igen | adatdok. 11-02 §7 |
| — | Sötét háttér a tartalmi oldalakon (krém villanás ugráskor) | ötlet | `globals.css`, `ScrollLayout` | nem (közös fájl) | audit P2; checker 11-05: villanás nem látszott, de a `body` még krém (rgb 245,240,232), csak a `.scrollContainer` sötét |
| — | Halott `BookLayout` + `HeroPage` törlése | ötlet | `experiment/BookLayout`, `experiment/pages/HeroPage.tsx`, `pages/index.ts` | igen | audit P2; checker 11-05: nem használja semmi, törölhető; az `experiment/pages/HeroPage.module.css` marad (`ResearchHeroSection` használja), a `pages/index.ts` 1. sora törlendő |
| — | Kapcsolat sor az oldalvégeken | vár (megrendelőre: mely adatok) | `shared/PageEnd`, `lib/partners.ts` | igen | UX-pontozás 11-06 U4 |
| — | Megszólítás: tegező vagy személytelen UI-szövegek | vár (döntésre) | gombszövegek, `asogepes-brand` skill | igen | UX-pontozás 11-06 C1 |
| — | `clip-check`: a helyszíntérképek (006) SVG-feliratai vágódnak a tábla-zoomnál (városnevek) | ötlet | `experiment/fieldmap/*`, `scripts/qa/clip-check.js` | igen | checker 11-09 (007); szándékos levágás-e, vagy a szkript zárja ki |
| — | `nav-check` Suspense-szabály álriasztás | ötlet | `scripts/qa/nav-check.js` | igen | UX-pontozás 11-06 Q1 |
| — | Alszakasz deep link teszt a `nav-check`-be; „keskeny szövegoszlop” szabály a `layout-check`-be | ötlet | `scripts/qa/` | igen | audit P3 |
| — | `perf.js` a QA-buildön; az e2e (Playwright) tesztek sorsa | ötlet | `scripts/qa/`, `tests/` | igen | audit P3 |

## Kész

| Feladat | Mikor | Hol |
|---|---|---|
| [014](014-lakitelek-rozs-majus.md) Lakitelek rozs: hét parcella májusban a Fotók blokkban (2026): egy léptékű csempesor talajszinttel, szűrő, nagy nézet (föld felett / föld alatt), jelölt összkép; „Hajtás és gyökér” ki a léptetőből; checker: rendben, 2 telefonos hiba javítva. Nyitott: sorhossz/tőszám a kutatóknak | 2026-11-10 | `experiment/pages/LakitelekRyeBoard.*`, `LakitelekPhotosPage.tsx`, `FurtherMeasuresPage.*`, `lib/seasons.ts`, `public/images/kutatás_pics/Lakitelek/rozs/` |
| [013](013-paradicsom-fold-felett-alatt.md) Szentkirály paradicsom: „Föld felett, föld alatt” (kutató a két parcellán egy léptékben + gyökérpár, gyűrűs jelölők, nagyító), Hajtáshossz ki a léptetőből; checker: minden pont rendben | 2026-11-10 | `experiment/pages/AboveBelowGround.*`, `SzentkiralyTomatoPage.tsx`, `FurtherMeasuresPage.tsx`, `public/images/kutatás_pics/Szentkirály/paradicsom/` |
| [012](012-hagyma-fotok-leptetoben.md) Szentkirály hagyma: valódi fotók a léptetőben (4 lépés, a rajz helyett, idő-csúszka, teljes fotó); checker: minden pont rendben | 2026-11-10 | `experiment/pages/SzentkiralyGrowthPage.*`, `lib/seasons.ts`, `public/images/kutatás_pics/Szentkirály/hagyma/` |
| [011](011-terfogattomeg-klipek.md) Térfogattömeg-mérés: AI mini klipek a lépésfotók között — **elvetve**, maradnak a fotók + SVG (a hitelesség és az érthetőség miatt); tudás: `keyframe-clips` skill | 2026-11-09 | nincs kódváltozás |
| [010](010-szentkiraly-grafikonok-mobilon.md) Szentkirály telefonon: mélyásógép-kapcsoló (8 oszlop 16 helyett), mélységválasztó a hőmérsékletnél; checker: minden pont rendben | 2026-11-09 | `experiment/Timeline.*`, `experiment/TemperatureSeriesChart.*`, commit 3f02bfb |
| [009](009-evkapcsolo-helyszinenkent.md) Egy évkapcsoló helyszínenként (saját évállapot, `?evad-szk/-lk/-kb`), az év sima szöveg „másik év ↑” linkkel; Kecskemét mindig 2025; checker: minden pont rendben | 2026-11-09 | `experiment/season/*`, `*CombinedPage.tsx`, commit 3f02bfb |
| [007](007-fo-eredmenyek-elore.md) Fő eredmények a hero után, lenyitható módszertan telefonon; 390 px: eredmények 1121 px-en, oldal −2,7 képernyő; checker: 1–7, 9 rendben, a piros `clip-check`/`nav-check` a 007-től független | 2026-11-09 | `ResearchScrollLayout`, `sections/SummarySection`, `sections/MethodologySection`, commit e730938 |
| [006](006-helyszin-terkep.md) Helyszín adatok térképpel mindhárom helyszínen (papírfecni, zoom a Duna–Tisza közéről a táblá(k)ra, Szentkirályon két tábla + animált 2,3 km, ugráskor újraindul); checker: minden pont rendben. Nyitott: Lakitelek parcellasorrend, Szentkirály paradicsom sarkai | 2026-11-08 | `experiment/pages/*InfoPage.*`, `experiment/fieldmap/*`, `lib/field-maps.ts` |
| [005](005-terfogattomeg-modszertan.md) Módszertan: a térfogattömeg mérése (fotóváltó 4 egységesített képpel, laborkártya, magyarázó kártya metszetrajzzal, Újra gomb); checker: minden pont rendben | 2026-11-08 | `experiment/pages/BulkDensity*`, `sections/MethodologySection.tsx`, `lib/methodology.ts`, `public/images/kutatás_pics/Lakitelek/terfogattomeg/` |
| [001](001-asogep-animacio.md) Szelvény-animációk play gombbal (ásógép + nehézkultivátor A változat, sárga vonal mindkettőn); checker: minden pont rendben, mobil TBT a dev szerveren 1897 ms | 2026-11-07 | `problem/visualizations/*`, `CultivatorComparisonPage.tsx`, commit 84da2a1 |
| UX-pontozás P1: magyar 404 (menüpont nélkül aláhúzás), `robots`/`sitemap`/`icon.svg`/`apple-icon`, `/problema` cím; axe 0 mind az 5 oldalon 1440 és 390 px-en (sín: a címsor a gomb; PhotoViewer: fókuszra megjelenő „Teljes képernyős nézet” gomb; görgethető dobozok fókuszálhatók; címsorrend). A webhelynév a fejlécben elvetve (felhasználói döntés: a „Főoldal” menüpont ugyanaz) | 2026-11-06 | `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/icon.svg`, `lib/site.ts`, `ScrollLayout`, `PhotoViewer`, `Timeline`, `LakitelekChartPage`, problem szekciók |
| [003](003-partner-logok.md) Partnerlogók (lábléc, oldalvég, OG-kép) + `asogepes-brand` skill | 2026-11-06 | `lib/partners.ts`, `layout/Footer`, `shared/PageEnd`, `lib/og/renderOgImage.tsx` |
| [002](002-mobil-hero-video.md) Mobil hero: álló videó (Imants → traktor → ásók) | 2026-11-06 | `home/Hero.tsx`, checker ellenőrizte; nyitott: LCP prod buildben |
| Teljes `<h1>` a főoldalon (`aria-label` + gépírás `aria-hidden`) | 2026-11-05 | `home/Hero.tsx`, checker ellenőrizte |
| Audit P1: oldalvégek, összegzés, szántás-idézet, a11y | 2026-11-03 | audit 11-03 §12 |
| SEO-cím „2025 óta”, OG-képek | 2026-11-03 | `app/layout.tsx`, commit 5cc8623 |
| Mobil redesign (≤1024 px) | 2026-11-01 | `docs/superpowers/progress/2026-11-01-mobile-redesign.md` |
