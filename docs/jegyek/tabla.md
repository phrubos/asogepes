# Tábla

Utoljára frissítve: 2026-11-06. Folyamat és státuszok: [README](README.md).

| # | Feladat | Státusz | Fájlok | Párhuzamosan? | Forrás / megjegyzés |
|---|---|---|---|---|---|
| [001](001-asogep-animacio.md) | Ásógép-animáció a talajszelvényen | ötlet | `problem/visualizations/SpadingMachineSVG.tsx` | igen | 4 nyitott kérdés a jegyben |
| — | 2026-os fotók feltöltése a kutatás oldalra | vár (fotókra) | `public/images/kutatás_pics`, `src/lib/data.ts` | igen | audit 11-03 §10 |
| — | Lakitelek: melyik mérés az évek közötti híd (2026 júl. vége tarlón készült) | vár (kutatókra) | `experiment/pages/Lakitelek*`, `seasons.ts` | igen | adatdok. 11-02 §7–8 |
| — | 2026-os géptípusok (38SX / 38WX / 40SX) helyszínenként | vár (kutatókra) | `src/lib/data.ts`, `experiment/pages/*` | igen | adatdok. 11-02 §7 |
| — | Sötét háttér a tartalmi oldalakon (krém villanás ugráskor) | ötlet | `globals.css`, `ScrollLayout` | nem (közös fájl) | audit P2; checker 11-05: villanás nem látszott, de a `body` még krém (rgb 245,240,232), csak a `.scrollContainer` sötét |
| — | axe: nested-interactive, görgethető régiók, heading-order | ötlet | `PhotoViewer`, `Timeline`, `LakitelekChartPage`, `ScrollLayout`, `StaticChallenge`, `ProblemHeroPage`, `PenetrometerExplainer` | igen | audit P2; checker 11-05: mindhárom szabály még talál (PhotoViewer előnézet, sín aktív eleme; Timeline, fotóleírás; h3 a /problema és /kutatas oldalon) |
| — | Halott `BookLayout` + `HeroPage` törlése | ötlet | `experiment/BookLayout`, `experiment/pages/HeroPage.tsx`, `pages/index.ts` | igen | audit P2; checker 11-05: nem használja semmi, törölhető; az `experiment/pages/HeroPage.module.css` marad (`ResearchHeroSection` használja), a `pages/index.ts` 1. sora törlendő |
| — | Alszakasz deep link teszt a `nav-check`-be; „keskeny szövegoszlop” szabály a `layout-check`-be | ötlet | `scripts/qa/` | igen | audit P3 |
| — | `perf.js` a QA-buildön; az e2e (Playwright) tesztek sorsa | ötlet | `scripts/qa/`, `tests/` | igen | audit P3 |

## Kész

| Feladat | Mikor | Hol |
|---|---|---|
| [002](002-mobil-hero-video.md) Mobil hero: álló Imants-videó | 2026-11-06 | `home/Hero.tsx`, checker ellenőrizte; nyitott: LCP prod buildben |
| Teljes `<h1>` a főoldalon (`aria-label` + gépírás `aria-hidden`) | 2026-11-05 | `home/Hero.tsx`, checker ellenőrizte |
| Audit P1: oldalvégek, összegzés, szántás-idézet, a11y | 2026-11-03 | audit 11-03 §12 |
| SEO-cím „2025 óta”, OG-képek | 2026-11-03 | `app/layout.tsx`, commit 5cc8623 |
| Mobil redesign (≤1024 px) | 2026-11-01 | `docs/superpowers/progress/2026-11-01-mobile-redesign.md` |
