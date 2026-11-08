# Tábla

Utoljára frissítve: 2026-11-08. Folyamat és státuszok: [README](README.md).

| # | Feladat | Státusz | Fájlok | Párhuzamosan? | Forrás / megjegyzés |
|---|---|---|---|---|---|
| [004](004-lakitelek-3d-fold-alatt.md) | Lakitelek 3D: hengerek a föld alatt (rizotron), színkód, penetrométer | folyamatban (dev szerveres ellenőrzés hátra) | `experiment/FieldChart3DCanvas.tsx`, `experiment/pages/LakitelekChartPage.tsx` | igen | Attila üzenete 11-07; nyitott kérdések a jegyben |
| — | 2026-os fotók feltöltése a kutatás oldalra | vár (fotókra) | `public/images/kutatás_pics`, `src/lib/data.ts` | igen | audit 11-03 §10 |
| — | Lakitelek: melyik mérés az évek közötti híd (2026 júl. vége tarlón készült) | vár (kutatókra) | `experiment/pages/Lakitelek*`, `seasons.ts` | igen | adatdok. 11-02 §7–8 |
| — | 2026-os géptípusok (38SX / 38WX / 40SX) helyszínenként | vár (kutatókra) | `src/lib/data.ts`, `experiment/pages/*` | igen | adatdok. 11-02 §7 |
| — | Sötét háttér a tartalmi oldalakon (krém villanás ugráskor) | ötlet | `globals.css`, `ScrollLayout` | nem (közös fájl) | audit P2; checker 11-05: villanás nem látszott, de a `body` még krém (rgb 245,240,232), csak a `.scrollContainer` sötét |
| — | Halott `BookLayout` + `HeroPage` törlése | ötlet | `experiment/BookLayout`, `experiment/pages/HeroPage.tsx`, `pages/index.ts` | igen | audit P2; checker 11-05: nem használja semmi, törölhető; az `experiment/pages/HeroPage.module.css` marad (`ResearchHeroSection` használja), a `pages/index.ts` 1. sora törlendő |
| — | „Fő eredmények” a `/kutatas` elején | ötlet | `experiment/sections/ResearchHeroSection`, `ResearchScrollLayout` | igen | UX-pontozás 11-06 U3 |
| — | Kapcsolat sor az oldalvégeken | vár (megrendelőre: mely adatok) | `shared/PageEnd`, `lib/partners.ts` | igen | UX-pontozás 11-06 U4 |
| — | Megszólítás: tegező vagy személytelen UI-szövegek | vár (döntésre) | gombszövegek, `asogepes-brand` skill | igen | UX-pontozás 11-06 C1 |
| — | `nav-check` Suspense-szabály álriasztás | ötlet | `scripts/qa/nav-check.js` | igen | UX-pontozás 11-06 Q1 |
| — | Alszakasz deep link teszt a `nav-check`-be; „keskeny szövegoszlop” szabály a `layout-check`-be | ötlet | `scripts/qa/` | igen | audit P3 |
| — | `perf.js` a QA-buildön; az e2e (Playwright) tesztek sorsa | ötlet | `scripts/qa/`, `tests/` | igen | audit P3 |

## Kész

| Feladat | Mikor | Hol |
|---|---|---|
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
