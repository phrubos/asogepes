# Ásógépes Talajművelés — UX-heurisztikai pontozás (harmadik kör)

Dátum: 2026-11-06 · Ág: `preview/megrendelo-2026-11` (`759d149`) · Előzmény: `docs/2026-11-03-ui-ux-audit.md`
Módszer: `ux-heuristics` skill (Nielsen 10, Krug, Quick Diagnostic, súlyosság 0–4), a futó dev szerveren (localhost:3000) mérve.

## 1. Pontszámok

| Terület | 10-31 | 11-03 | **11-06** | Legsúlyosabb mostani gond |
|---|---|---|---|---|
| UX-heurisztikák (Nielsen/Krug) | 4 | 8 | **8** | Nincs magyar 404-oldal; a fejlécben nincs webhelynév; a `/kutatas` 20 képernyő, az összegzés a végén |
| Mobil nézet | 3 | 9 | **9** | Telefonon a fő gomb („Fedezd fel a kutatást”) az első képernyő alatt van |
| Layout / vizuális design | 6 | 8 | **8** | A 11-03-i L2–L4 (zárt kártyák, levágott alcím, hoverre megjelenő link) nincs újramérve |
| Tipográfia | 3 | 9 | **9** | — (`type-check`, `clip-check` zöld) |
| Akadálymentesség | 5 | 7 | **8** | `nested-interactive` (serious), görgethető régió fókusz nélkül, két `<h1>` a `/kutatas`-on |
| Információs architektúra / SEO | — | — | **6** | `robots.txt`, `sitemap.xml`, ikon, 404 hiányzik; a `/problema` címe más márkanevet visel |
| Arculat és tartalmi következetesség | — | — | **8** | Megszólítás: tegező gombok („Fedezd fel”, „Görgess”), miközben a brand-skill semleges hangot ír elő |
| Karbantartás / QA | 5 | 8 | **8** | A `nav-check` hamis hibát jelez; halott `BookLayout` + `HeroPage` még a kódban |
| Teljesítmény | 4 | nem mérve | **nem mérve** | Csak dev szerver futott; a `hero-check` zöld (cím 206 ms asztalon, 764 ms lassú 4G-n) |

**Összkép: 8/10.** Katasztrofális (4-es) vagy súlyos (3-as) hiba nincs. A 11-03-i súlyos tételek (oldalvégi zsákutca, összegzés hiánya, szántás-idézet) megoldódtak. Ami a 10/10-ig hiányzik, az többnyire kicsi, egy-egy fájlos javítás.

## 2. Mérések

| Mérés | Eredmény |
|---|---|
| `clip-check`, `type-check`, `hero-check`, `motion-check`, `touch-check`, `mobile-check`, `layout-check` | mind zöld |
| `nav-check` | 4 × FAIL, de **álriasztás**: az első `<template id="B:0">` egy üres, `hidden` `div`-ben van (a Next így streameli a metaadatot, valószínűleg az OG-képek óta); a `<h1>` előtte, a szerver HTML-ben van. A menüváltás 213–340 ms, a deep linkek célba érnek. |
| axe, 1440 px | `/`: 0 · `/problema`: heading-order, nested-interactive · `/technologia`: ugyanaz · `/kutatas`: heading-order, nested-interactive ×3, scrollable-region-focusable |
| axe, 390 px | `/`: 0 · `/problema`: heading-order · `/technologia`: 0 · `/kutatas`: nested-interactive ×2, scrollable-region ×2, heading-order, color-contrast ×2 (álriasztás: belépő animáció közben; nyugalmi állapotban 0) |
| HTTP | `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/icon.png` mind 404; ismeretlen URL: a Next angol alapértelmezett 404-oldala |
| Oldalhossz (képernyő) | 1440 px: `/` 1,2 · `/problema` 7,7 · `/technologia` 7,4 · `/kutatas` **20,5**; 390 px: `/kutatas` **19,3** |
| `<h1>` | a `/kutatas`-on kettő: „Szántóföldi talajszerkezetvizsgálatok” és „A penetrométeres mérés” (`MethodologyPage.tsx:29`) |
| Aktív menüpont | `aria-current="page"` mind a 4 oldalon |

## 3. Quick Diagnostic

| Kérdés | Állapot | Megjegyzés |
|---|---|---|
| Azonnal látszik, milyen webhely és oldal ez? | **részben** | Oldalcím és aktív menüpont van; a fejlécben nincs webhelynév vagy jel, a tartalmi oldalakon csak a 4 menüpont. A `/problema` `<title>`-je „Ásógépes Technológia”, a többi „Ásógépes Talajművelés”. |
| Egyértelmű a fő cselekvés? | igen | Egy arany gomb a főoldalon; telefonon görgetni kell hozzá. |
| Világos a navigáció? | igen | Trunk Test teljesül: menü, szekciósín, mobil szekciósáv, oldalvégi „Tovább”. |
| Megtalálható a keresés? | n. a. | 4 oldalon nem kell. |
| Látszik, mi történik? | igen | 3D-modell betöltése gombbal, Story-blokkok „1 / 3” léptetővel, `aria-live`. |
| Segítenek a hibaüzenetek? | **nem** | Rossz URL-en angol Next-oldal („This page could not be found”), menü és visszaút nélkül. |
| Vissza lehet lépni? | igen | Böngésző-vissza működik, `?section=` linkek. |
| Működik hover nélkül? | igen | `touch-check` zöld. |
| Minden vezérlőnek van neve? | igen | A 11-03-i névtelen gomb javítva. |
| Van „hm?” pillanat? | **részben** | A `/kutatas` 20 képernyő; a „mit tanultunk” összegzés az 5. szekció, a végén. |

## 4. Hibák súlyosság szerint

| # | Hiba | Heurisztika | Súly. | Javítás |
|---|---|---|---|---|
| U1 | Angol, menü nélküli 404-oldal | Nielsen 9 (hibák), 4 (következetesség) | 2 | `app/not-found.tsx` magyarul, menüvel és „Vissza a főoldalra” / „A kutatás” linkkel |
| U2 | Nincs webhelynév a fejlécben | Krug Trunk Test 1. kérdés | 0 | **Elvetve** (felhasználói döntés, 11-06): a „Főoldal” menüpont ugyanezt adja, a külön név zavaró duplikáció volt |
| U3 | `/kutatas`: 20 képernyő, az összegzés a végén | Krug 1 (ne kelljen gondolkodni), Nielsen 6 | 2 | A hero alá rövid „Fő eredmények” sor (3 szám + „Összegzés” link), vagy az Összegzés előre, a Módszertan elé |
| U4 | Nincs kapcsolatfelvételi pont (csak külső link az agroskill.hu-ra) | Krug: a látogató célja | 2 | Az oldalvégi partnerblokk mellé rövid „Kérdése van?” sor: név, telefon, e-mail (a megrendelő döntése) |
| A1 | `nested-interactive`: gomb a gombban (szekciósín aktív eleme, `PhotoViewer` előnézet) | WCAG 4.1.2 | 2 | A táblán már szerepel (axe-sor) |
| A2 | Görgethető leírás-doboz fókusz nélkül (`PhotoViewer_descriptionArea`, Lakitelek tábla) | WCAG 2.1.1 | 2 | `tabIndex={0}`, `role="region"`, `aria-label` |
| A3 | Két `<h1>` a `/kutatas`-on | WCAG 1.3.1, SEO | 1 | `MethodologyPage.tsx:29` → `<h2>` |
| A4 | `heading-order` a `/problema` hero-kártyáin és a `/kutatas`-on | WCAG 1.3.1 | 1 | A táblán már szerepel |
| S1 | `robots.txt`, `sitemap.xml`, ikon hiányzik | megtalálhatóság | 2 | `app/robots.ts`, `app/sitemap.ts`, `app/icon.png` (a 10-31 óta nyitott N4) |
| S2 | `/problema` címe „A Probléma \| Ásógépes Technológia” | Nielsen 4 | 1 | „Probléma \| Ásógépes Talajművelés” |
| C1 | Tegező gombok és utasítások („Fedezd fel a kutatást”, „Görgess lejjebb”, „Koppints a helyszínekért”) a semleges szöveg mellett | Nielsen 4 | 1 | Döntés kell: a rövid UI-utasítások maradhatnak tegezők (bevett a magyar weben), vagy személytelenre váltanak („A kutatás megtekintése”); a brand-skill ehhez igazodjon |
| M1 | Telefonon a fő gomb az első képernyő alatt | Nielsen 8 | 1 | A hero-szöveg rövidítése telefonon vagy a gomb a statisztikák elé |
| Q1 | `nav-check` álriasztás a Suspense-szabálynál | — | 1 | A szabály csak a `<h1>`-et megelőző, nem `hidden` szülőben lévő `template`-et nézze |
| Q2 | Halott `BookLayout` + `HeroPage` | — | 1 | A táblán már szerepel |

## 5. Erősségek

- A Story-blokkok (egy fókusz, „1 / 3”, Vissza / Tovább, mobilon húzás) a webhely legjobb mintája.
- Mobil: egy margó, balra zárt címek, sticky szekciósáv, 0 levágás, 0 kis célterület.
- A főoldali eredménykártya (laza réteg 2025 / 2026, „Részletek”) azonnal megmutatja a lényeget asztalon.
- Oldalvégek: „Tovább” kártya és a két partner logója minden tartalmi oldal alján.
- Reduced motion, billentyűzet, koppintás mindenhol tesztelve.

## 6. Út a 10/10-hez

| Prioritás | Feladat | Fájlok | Méret | Hatás |
|---|---|---|---|---|
| P1 | Magyar 404 + `robots` + `sitemap` + ikon + `/problema` cím | `app/not-found.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/icon.png`, `app/problema/page.tsx` | S | UX +0,5, SEO 6 → 9 |
| P1 | Webhelynév a fejlécben | `layout/Navigation` | S | Trunk Test teljes |
| P1 | Második `<h1>` → `<h2>`, `nested-interactive`, görgethető régiók | `MethodologyPage`, `ScrollLayout`, `PhotoViewer`, `LakitelekChartPage` | S | Akadálymentesség 8 → 10 |
| P2 | „Fő eredmények” a `/kutatas` elején | `ResearchHeroSection` vagy `ResearchScrollLayout` | S–M | UX +0,5 |
| P2 | Kapcsolat sor az oldalvégeken (a megrendelő adataival) | `shared/PageEnd`, `lib/partners.ts` | S | A megrendelő célja |
| P2 | Megszólítás: döntés és egységesítés | gombszövegek, brand-skill | S | Következetesség |
| P3 | `nav-check` szabály javítása, halott kód törlése, `perf.js` a QA-buildön | `scripts/qa/`, `experiment/BookLayout` | S | Karbantartás 8 → 10, teljesítmény újra mérve |

## 7. Hatókörön kívül

- Teljesítmény production buildön (csak dev szerver futott); valódi eszközös teszt; felhasználói teszt (a következő lépés a heurisztikus értékelés után: 3–5 ember, a feladat: „mit tud meg az ásógépről 2 perc alatt?”).
- Az audit nem változtatott a kódon.

## 8. Utólag (11-06): P1 kész

Magyar 404, `robots.txt`, `sitemap.xml`, ikon, `/problema` cím; axe 0 hiba mind az 5 oldalon (1440 és 390 px). A webhelynév a fejlécben kipróbálva és elvetve (U2). Akadálymentesség 8 → 10, IA/SEO 6 → 9.
