# Ásógépes Talajművelés — UI/UX, layout, mobil és teljesítmény-analízis

Dátum: 2026-10-31 · Ág: `chore/cleanup-2026` · Állapot: a takarítás után (a 2026-os adatfeltöltés előtt)

## 1. Összefoglaló

| Terület | Értékelés | Legsúlyosabb gond |
|---|---|---|
| UX-heurisztikák (Nielsen/Krug, ux-heuristics skill) | **4 / 10** | A főoldal a videó betöltéséig blokkolva van, videóhiba esetén **soha** nem jelenik meg |
| Mobil nézet | **3 / 10** | `/kutatas` és `/problema` szövegei jobbra kilógnak és le vannak vágva (390 és 360 px-en is) |
| Layout / vizuális design | 6 / 10 | Erős, egységes földszín-arculat; asztali nézetben apró betűk és üres, 100vh-s „holt” képernyők |
| Teljesítmény | 4 / 10 | Mobilon (lassított 4G) a főoldal tartalma **57 s** után válik láthatóvá; TBT 1,3–2,2 s |
| Akadálymentesség | 5 / 10 | A reduced-motion nincs általánosan kezelve; kicsi érintési célterületek; hover-only interakciók |
| Biztonság / karbantarthatóság | 5 / 10 | Next 15.5.7: kritikus besorolású ismert sebezhetőségek; elavult e2e tesztek |

**A 10/10-hez vezető legfontosabb javítások** (részletek a 13. fejezetben):
1. A hero-betöltő megszüntetése / nem blokkolóvá tétele, és a videó lusta, mobilon kisebb változatú betöltése (P0).
2. `ScrollLayout` `.mainContent { min-width: 0 }` + a `/problema` maradék kilógásai (P0).
3. A „125% scaling fix” média-feltételének szűkítése: jelenleg minden 1200+ px széles, ≤900 px magas ablakban 13 px-re veszi a gyökér-betűméretet (P1).
4. Next frissítése a legújabb 15.5.x patch-re (P0, biztonság).

## 2. Módszertan

- **Build**: `next build` + `next start` (production), Playwright 1.57 Chromium.
- **Nézetek**: asztali 1440×900, mobil 390×844 és 360×844 (`isMobile`, touch, DPR 3).
- **Képernyőképek**: oldalanként viewport-lépésekben görgetve (64 kép), takarítás előtt és után; pixel-diff a CSS-takarítás ellenőrzésére.
- **Teljesítmény**: CDP hálózat-lassítás (mobil: 1,6 Mbit/s, 150 ms RTT, 4× CPU; asztali: 10 Mbit/s, 40 ms), PerformanceObserver (FCP, LCP, CLS, long task → TBT-közelítés), átvitt bájtok típusonként.
- **DOM-mérések**: kilógó szövegelemek, betűméret-eloszlás, 44 px alatti érintési célok.
- **Kód-audit**: import-gráf (halott fájlok), `tsc --noUnusedLocals`, CSS-modul osztályhasználat, ESLint, `npm audit`.
- Skillek: `ux-heuristics` (súlyossági skála 0–4), `performance-optimization`; a motion-pontokhoz a `design-motion-principles` / `review-animations` szempontjai.

Súlyosság: **4** katasztrofális (feladat nem végezhető el) · **3** súlyos · **2** kisebb · **1** kozmetikai.

## 3. Takarítás eredménye (ezen az ágon, 2 commit)

| Mi | Mennyi |
|---|---|
| Elérhetetlen `src` fájlok (régi layoutok, hero-variánsok, nem használt ui/hookok) | 110 fájl törölve |
| Halott exportok a `lib/data.ts`, `lib/technology-data.ts` fájlokban | 8 export (findings, consequences, benefits, machineTypes, fieldData…) |
| Nem használt importok / lokális változók élő komponensekben | ~50 (pl. a nem renderelt `ScrollProgress`, a 250 soros `IrrigationBackground`) |
| Sehol nem hivatkozott CSS-modul szelektorok | 655 szelektor, −4775 sor (`ProblemNew.module.css`: 3515 → 634 sor) |
| Nem hivatkozott `public` médiák (forrásvideók, régi képek, docx) | 35 fájl, `public/` 126 MB → 51 MB |
| Statikus prototípus, tervezési előzmények, `.superdesign`, `.kombai`, `planning/` | törölve (a git historyban megvannak) |
| `inputs/` (szakdolgozat, TDK, forrásképek, 59 MB) | kikerült a gitből, a lemezen megmaradt (`.gitignore`) |
| npm csomagok | 12 eltávolítva (react-three/*, gsap, lottie, query-string, image-size, clsx, tailwind-merge, ffmpeg) |
| `/problema` First Load JS | 183 kB → 179 kB |

Ellenőrzés: `tsc` OK, `next build` OK, `npm run lint` 0 hiba (6 `exhaustive-deps` figyelmeztetés maradt, lásd 11.), a takarítás előtti és utáni képsorozat pixel-diffje csak animációs/videós képkockákban tér el, az oldalmagasságok bájtra azonosak.

## 4. Kritikus hibák (P0)

### 4.1 A főoldal betöltője a videóhoz van kötve — súlyosság 4
`home/Hero.tsx`: `<LoadingScreen isLoading={!isVideoReady} />` — a teljes képernyős „Betöltés...” réteg csak a `<video>` `playing` eseményére tűnik el.
- **Mért**: blokkolt videónál a betöltő 20 s után is látszik (a tartalom soha nem jelenik meg). Az `onError` a `<video>`-n van, de a hiba a `<source>` elemen keletkezik, így nem fut le.
- **Mért**: lassított 4G-n a betöltő **57,1 s** után tűnik el (a 13,4 MB-os `hero_background_optimized.mp4` `preload="auto"`-val töltődik).
- Adatkímélő mód, iOS Low Power Mode, autoplay-tiltás esetén szintén nem indul a videó → örök betöltő.
- **Javítás**: a betöltőt el kell hagyni; a poster-kép azonnal látszik (már be van állítva), a videó `preload="metadata"`/lusta indítás, mobilra külön ≤2 MB-os, 720p változat (`<source media>`), `prefers-reduced-motion` és `Save-Data` esetén csak poster.

### 4.2 Mobil: a tartalom jobbra kilóg és le van vágva — súlyosság 4
- **Mért** (390 px): `/kutatas` 117, `/problema` 41 levágott szövegelem; 360 px-en a `/technologia` is (26). Példák: „Szántóföldi talajszerkezet **vizsgálatok**”, a hero leírása 473 px széles egy 390 px-es képernyőn, „Miért veszítjük **a gyökértömeget?**”.
- **Ok** (igazolt): `shared/ScrollLayout` → `.mainContent` flex-elem `min-width: auto`, ezért a tartalom 610–660 px-re nyújtja; a `html/body { overflow-x: hidden }` elrejti a görgetősávot, így a szöveg egyszerűen eltűnik.
- **Javítás**: `.mainContent { min-width: 0; }` — böngészőben injektálva a `/kutatas` 117 → 1, a `/technologia` 26 → 0, a `/problema` 41 → 19 levágott elemre esik. A `/problema` maradéka a talajszelvény-diagram SVG-tengelyei és a hero-cím (`ProblemHeroPage`) — ezek külön javítandók.

### 4.3 Elavult Next.js kritikus besorolású ismert sebezhetőségekkel — súlyosság 3 (biztonság)
`npm audit --omit=dev`: `next@15.5.7` (critical: Server Actions source exposure, több DoS, cache poisoning, middleware bypass), `sharp`, `postcss`, `nanoid`, `source-map-js` (high). A javított verzió ugyanazon a minor ágon belül van (15.5.x legújabb patch). Javasolt: `next` és `eslint-config-next` frissítése a legutolsó, legalább 7 napja kiadott 15.5.x patch-re, majd build + képsorozat.

## 5. Mobil nézet

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| M1 | Kilógó, levágott tartalom (4.2) | 4 | `min-width: 0`, majd a `/problema` SVG-k `viewBox` + `width: 100%` |
| M2 | Alsó szekció-navigáció: 28×38 px-es pöttyök felirat nélkül (csak az aktív címkéje látszik) | 2 | ≥44 px célterület, `aria-label` a szekció nevével |
| M3 | A lebegő „Görgess lejjebb / következő szekció” pirula a tartalom jobb alsó részét takarja (pl. modellkártyák, Lakitelek) | 2 | Mobilon kisebb, kerek gomb vagy a navigációs sávba integrálva; görgetés közben elrejteni |
| M4 | A hamburger ikon háttér nélkül lebeg a tartalom felett (szövegre/képre is rákerül) | 1 | Áttetsző fejléc-sáv (blur) vagy árnyékos gomb |
| M5 | Az alsó nav + lebegő pirula + hamburger együtt a 844 px-es képernyő ~15%-át foglalja | 2 | Egy rögzített elem: alsó sáv a szekciókkal és a következő gombbal |
| M6 | Interaktív elemek csak `onMouseEnter`-rel (15 hely, pl. `HubFolder`, kártyák kibontása) — érintőn nincs hover | 3 | Kattintásra/koppintásra is nyíljon; `@media (hover: hover)` csak a díszítésre |
| M7 | 3D modell (`FieldChart3DCanvas`, three.js) mobilon is betölt, a forgatás ütközik a görgetéssel | 2 | Mobilon statikus kép + „3D megnyitása” gomb; `touch-action` kezelése |
| M8 | Szövegtörzs mobilon 12,8–13 px medián, sok 11–12 px-es címke | 2 | Törzs ≥16 px, címkék ≥12 px |

## 6. Layout és vizuális design

**Erősségek**: következetes, prémium földszín-paletta, Fraunces + Inter párosítás, szép adatvizualizációk (talajszelvény, hőkép-összehasonlító csúszka, ortofotó), egyértelmű oldalankénti narratíva (probléma → technológia → kutatás).

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| L1 | Üres, „holt” képernyők: a 100vh-s szekciókat a tartalom nem tölti ki (pl. `/technologia` 40SX → Alkalmazás: egy teljes 1440×900-as képernyő üres; `/problema` 3–4. lépés) | 2 | `min-height: 100vh` helyett tartalomhoz igazodó magasság + egységes szekció-padding |
| L2 | Asztali nézetben a tartalom keskeny, a bal oldali sín 240 px-et foglal; 1440 px-en a tartalom ~60%-a hasznos | 1 | Max-szélesség 1200–1280 px, a sín 200 px |
| L3 | A felső navigációs pirula görgetéskor rácsúszik a szekciócímekre (pl. Szentkirály kártyák) | 1 | Szekció-`scroll-margin-top`, illetve felső padding a nav magasságával |
| L4 | Nincs lábléc a `/kutatas`-on (a layout DOM-manipulációval rejti el: `kutatas/layout.tsx` `style.display = 'none'`) — az oldal vége után nincs „merre tovább” | 2 | Lábléc vissza, vagy záró CTA (pl. „Kapcsolat / Agroskill”); DOM-manipuláció helyett prop/route group |
| L5 | Kevés kontraszt a sín inaktív címkéin és a szekciószámokon (`00`, `01` sötétbarna a sötét háttéren) | 2 | WCAG AA (4,5:1) ellenőrzés a `--color-earth-*` tokenekre |

## 7. Tipográfia és olvashatóság

- **Mért** (asztali 1440×900): a szövegtörzs mediánja 10,4 px (`/problema`), 10,6 px (`/technologia`), 11 px (`/kutatas`); a min. 8,9 px. A `/kutatas` 41 mért szövegblokkjából 41 kisebb 14 px-nél.
- **Ok**: `globals.css` 454–459. sor: a „125% SCALING FIX” feltétele `(min-resolution: 1.20dppx) and (max-resolution: 1.35dppx), (min-width: 1200px) and (max-height: 900px)` — a vessző VAGY-ot jelent, így **minden** 1200 px-nél szélesebb, legfeljebb 900 px magas ablakban (1440×900, 1366×768, 1920×1080 böngészőkerettel) 13 px a gyökér-betűméret. Ráadásul sok komponens rem alapú kisbetűs címkéket használ (0,7–0,8 rem → 9–10 px).
- **Súlyosság 3** (a fő célcsoport — gazdák, szakemberek, gyakran laptopon/tableten — olvasási nehézsége).
- **Javítás**: a média-feltétel megszüntetése; a sűrű nézetek (Lakitelek összehasonlítás) helyett a tartalom tördelése/görgetése. Törzs 16–18 px, címkék ≥12 px, `line-height` 1,5–1,6, sorhossz ≤75 karakter.

## 8. Navigáció és információs architektúra

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| N1 | Négy menüpont, jó „itt vagy” jelzés (aláhúzás) és oldalankénti szekció-sín — a Trunk Test teljesül | — | — |
| N2 | Nincs „Eredmények / Összegzés” oldal: a kutatás fő megállapításai szétszórtan, a helyszíni oldalak alján vannak; a `lib/data.ts` `findings` tömbje soha nem jelent meg | 3 | 2026-tal: `/eredmenyek` vagy az oldal végén összegző szekció (2025 vs 2026 összevetés) |
| N3 | A főoldal egy képernyő (hero + 3 szám + CTA) — nincs áttekintés, ki végezte, miért, mi az eredmény | 2 | Rövid „3 lépés” blokk a három oldalra mutató kártyákkal + partnerlogók |
| N4 | `?section=` deep link működik, de a szekció-URL nem frissül olvasás közben megosztható formában minden esetben | 1 | Konzisztens `replaceState` (már részben van) |
| N5 | Nincs saját 404 oldal, favicon (404), robots.txt, sitemap, Open Graph kép | 2 | `app/not-found.tsx`, `app/icon.png`, `app/robots.ts`, `app/sitemap.ts`, `opengraph-image` |
| N6 | A cím „Tudományos Kutatás 2025” (`app/layout.tsx`) | 1 | 2026-os adatokkal frissítendő (lásd 12.) |

## 9. Teljesítmény

### Mérések (production build, helyi szerver)

| Profil | Oldal | FCP | LCP | CLS | TBT~ | Átvitel |
|---|---|---|---|---|---|---|
| Mobil, lassított 4G, 4× CPU | `/` | 2,2 s | (betöltő takarja) | 0,032 | 398 ms | 1,1 MB + videó streaming |
| | `/problema` | 4,4 s | 4,4 s | 0,010 | **2213 ms** | 543 KB |
| | `/technologia` | 3,3 s | 3,7 s | 0,019 | 1276 ms | 823 KB |
| | `/kutatas` | 3,1 s | 3,7 s | 0,029 | 1520 ms | 1,05 MB |
| Asztali, 10 Mbit/s | `/` | 0,3 s | 0,3 s | 0,001 | 0 ms | 1,2 MB |
| | `/technologia` | 0,6 s | 1,0 s | 0 | 0 ms | **4,1 MB** (Andornak.mp4 autoplay) |
| | `/kutatas` | 0,6 s | 0,9 s | 0,007 | 98 ms | 2,3 MB |

Hero-betöltő lassított 4G-n: **57,1 s**, mire a főoldal tartalma látható (4.1).

### Megállapítások

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| P1 | Hero-videó 13,4 MB, `preload="auto"`, mobilon is | 4 | Lásd 4.1; mobilra ≤2 MB-os változat, `preload="none"` + IntersectionObserver |
| P2 | Mesterséges késleltetések: `RouteLoadingProvider` minden oldalbetöltésnél 800 ms teljes képernyős betöltőt mutat, navigációkor `NavigationContext` +500 ms; `template.tsx` oldalanként belépő animációt futtat | 3 | Betöltő csak valódi várakozásnál (Suspense `loading.tsx`), a mesterséges időzítők törlése |
| P3 | Magas TBT mobilon (1,3–2,2 s): minden szekció egyszerre mountol és animál (48 framer-motion fájl), végtelen ciklusú demók (`HubFolder` demo, `CompactionStatsPage` lejátszó, typewriter) | 3 | Szekciók lusta mountolása (`next/dynamic` + látótérbe érve), végtelen animációk leállítása képernyőn kívül |
| P4 | Google Fonts `@import` a CSS-ben (render-blokkoló, két külön kérés, 200 KB font) | 2 | `next/font/google` (self-host, preload, `size-adjust` → kevesebb CLS) |
| P5 | Nagy forrásképek: ortofotók és hőképek 1,1–4,4 MB, modellfotók 3,3–3,6 MB, PNG illusztrációk 600–800 KB. A `next/image` optimalizál, de a lightbox/csúszka több helyen teljes méretben tölt | 2 | Forrásképek előre méretezése (max. 2560 px, WebP/AVIF), `sizes` minden `Image`-en (19 helyen van `sizes`/`priority`) |
| P6 | `Andornak.mp4` (3,4 MB) autoplay a `/technologia` 2. szekciójában, akkor is, ha a felhasználó nem jut el odáig | 2 | `preload="none"`, indítás látótérbe érve, poster |
| P7 | `export const dynamic = 'force-dynamic'` a főoldalon — semmi nem indokolja (statikus tartalom) | 1 | Eltávolítás → statikus HTML, CDN-cache |
| P8 | `three` (~600 KB nyers) csak a Lakitelek 3D modellhez — már `dynamic(..., { ssr:false })`, jó | — | Mobilon kattintásra töltsön (M7) |
| P9 | `next.config.js` dev-only `splitChunks` felülírás és `onDemandEntries` — félrevezető komment („hydration”), production-ra nincs hatása | 1 | Törlés vagy pontos komment |

## 10. Akadálymentesség

| # | Megállapítás | Súly. | Javaslat |
|---|---|---|---|
| A1 | `prefers-reduced-motion` csak 6 fájlban van kezelve a 48 framer-motion fájlból; nincs `MotionConfig reducedMotion="user"` | 3 | Gyökér `MotionConfig reducedMotion="user"` + CSS `@media (prefers-reduced-motion)` a keyframe-ekre; parallax, typewriter, magnetic button kikapcsolása |
| A2 | Hover-only információ (M6) | 3 | Billentyűzettel és koppintással is elérhető |
| A3 | Kicsi érintési célok: a nav linkek 32 px magasak, a mobil szekció-pöttyök 28×38 px, a főoldali CTA link 20 px magas | 2 | ≥44×44 px |
| A4 | A teljes képernyős betöltő nem jelez `aria-busy`/`role="status"`-t, és elrejti a skip-linket | 2 | Betöltő megszüntetése (4.1, P2) |
| A5 | `kutatas/layout.tsx` DOM-ban elrejti a láblécet → a lábléc navigáció/kapcsolat elérhetetlen | 2 | L4 |
| A6 | Pozitívum: `lang="hu"`, skip-link, `aria-label` a navon, minden `next/image`-nek van `alt` | — | — |

## 11. Animáció (motion) — rövid audit

- **Indokolt**: talajszelvény-szimuláció, hőkép-csúszka, oldalsín jelző — ezek a megértést szolgálják.
- **Túlzó / zavaró**: typewriter a hero címben (10 s-onként újraír), „magnetic” CTA gomb, parallax a hero-videón, oldalanként belépő animáció (`template.tsx`), végtelen demó-ciklusok (`HubFolder`), mesterséges betöltők. Ezek a TBT-t is növelik (P3), és reduced-motion esetén is futnak (A1).
- **Javaslat**: a `review-animations` / `design-motion-principles` skill teljes auditja a következő iterációban; addig: typewriter → statikus szöveg, demó-ciklusok csak látótérben és egyszer.
- ESLint: 6 `react-hooks/exhaustive-deps` figyelmeztetés (`BookLayout`, `Navigation`, `CompactionStatsPage`, `BeforeAfterSlider`, `ScrollLayout` ×2) — ezek régi closure-ök, viselkedésbeli hibát okozhatnak; egyenként javítandók. `AnimatedNumber`: a `requestAnimationFrame` nincs cleanupkor törölve.

## 12. 2026-os adatfeltöltés előkészítése

- **Adatforrások**: a helyszínek (Szentkirály, Kecskemét-Borbás, Lakitelek) minden adata, fotója, kezelése a `src/lib/data.ts` `locations` objektumában van; a modellek a `modelDetails`-ben és a `technology-data.ts`-ben.
- **Duplikált, kódba égetett számok**: a `/kutatas` hero statisztikái (`experiment/pages/HeroPage.tsx`: 3 / 9 / 6) külön vannak beírva, a főoldal ugyanezt a `heroStats`-ból veszi → 2026-ban két helyen kell frissíteni; javasolt egy forrásból.
- **Évszám**: az oldal címe „Tudományos Kutatás 2025” (`app/layout.tsx`).
- **Javasolt adatmodell-döntés (a felhasználónál látszik)**: a 2026-os adatok *lecserélik* a 2025-öst, vagy *mellé kerülnek* (évválasztó / 2025 vs 2026 összevetés)? Ez határozza meg, hogy a `locations` évenként kulcsolt lesz-e (`locations[2026].lakitelek`). **Döntés szükséges az adatfeltöltés előtt.**
- **E2E tesztek**: a `tests/` 2025 decemberi, a redesign előtti állapotot teszteli (pl. „7 kezelés, 4 hónap”, „Fedezd fel” CTA a `/problema`-ra). 57-ből 21 bukott, a nem létező `/eredmenyek` oldal spec-jét töröltem (11 teszt). A maradék 10 bukó tesztet a 2026-os tartalommal együtt kell frissíteni.

## 13. Javasolt ütemterv

| Prioritás | Feladat | Érintett fájlok | Méret |
|---|---|---|---|
| **P0** ✅ | Hero-betöltő megszüntetése, poster azonnal, videó lusta + mobil változat | `home/Hero.tsx`, `public/videos` | S |
| **P0** ✅ | `ScrollLayout .mainContent { min-width: 0 }` + `/problema` SVG/hero kilógások | `ScrollLayout.module.css`, `ProblemHeroPage.module.css`, `PloughingSoilComparison` | S–M |
| **P0** ✅ | Next + eslint-config-next frissítése a legújabb 15.5.x patch-re | `package.json` | S |
| **P1** ✅ | 125%-os skálázási média-feltétel szűkítése, tipográfiai skála (törzs ≥16 px) | `globals.css`, CSS-modulok | M |
| **P1** ✅ | Mesterséges betöltők és késleltetések törlése (`RouteLoadingProvider`, `NavigationContext` 500 ms, `template.tsx`) | providers, `app/template.tsx` | S |
| **P1** ✅ | `MotionConfig reducedMotion="user"` + CSS reduced-motion | `app/layout.tsx`, `globals.css` | S |
| **P1** ✅ | Hover-only interakciók koppintásra is | `HubFolder`, kártyák | M |
| **P1** ✅ | `next/font`, `force-dynamic` törlése, `Andornak.mp4` lusta | `layout.tsx`, `page.tsx`, `OperationPrinciple.tsx` | S |
| **P2** | Mobil alsó navigáció egyesítése (pöttyök + következő gomb), 44 px célok | `ScrollLayout`, `NextSectionIndicator` | M |
| **P2** | 100vh „holt” képernyők megszüntetése | szekció CSS-ek | M |
| **P2** | Forrásképek előméretezése (ortofotók, modellfotók) | `public/images` | S |
| **P2** | SEO-alapok: not-found, icon, robots, sitemap, OG kép | `app/` | S |
| **P2** | Lábléc a `/kutatas`-on / záró CTA, DOM-manipuláció törlése | `kutatas/layout.tsx` | S |
| **P3** | Eredmények-összegzés (2025 vs 2026) — az adatmodell-döntés után | új szekció/oldal | L |
| **P3** | E2E tesztek frissítése, `exhaustive-deps` figyelmeztetések javítása | `tests/`, komponensek | M |
| **P3** | Teljes motion-audit (`review-animations`) | — | M |

Javaslat: a P0 + P1 tételeket érdemes a 2026-os adatfeltöltés **előtt** elvégezni (rövid spec + terv a `docs/` alá), hogy az új adatok már javított mobil és tipográfiai keretbe kerüljenek.

### 13.1 Elvégezve — 2026-10-31 (`chore/cleanup-2026`)

A P0 + P1 tételek (✅) elkészültek; spec: `docs/superpowers/specs/2026-10-31-pre-2026-hardening-design.md`, napló: `docs/superpowers/progress/2026-10-31-pre-2026-hardening.md`. Minden pont mérve a `scripts/qa/` szkriptjeivel, production buildön: `hero-check`, `nav-check`, `clip-check` (360/390/1440/1536/1366 px × 4 oldal = 0), `type-check` (folyószöveg medián ≥ 15 px, nincs 12 px alatti szöveg), `motion-check`, `touch-check` mind zöld.

| Profil | Oldal | FCP előtte → utána | LCP előtte → utána | CLS előtte → utána | TBT~ előtte → utána |
|---|---|---|---|---|---|
| Mobil, lassított 4G, 4× CPU | `/` | 2,2 s → 0,8 s | (betöltő 57 s) → 0,8 s | 0,032 → 0 | 398 → ~250 ms |
| | `/problema` | 4,4 s → 1,1 s | 4,4 s → 2,8 s | 0,010 → **0,106** | 2213 → ~1000 ms |
| | `/technologia` | 3,3 s → 1,0 s | 3,7 s → 3,6 s | 0,019 → 0 | 1276 → ~500 ms |
| | `/kutatas` | 3,1 s → 1,3 s | 3,7 s → 3,2 s | 0,029 → 0,011 | 1520 → ~950 ms |
| Asztali, 10 Mbit/s | `/technologia` | 0,6 s → 0,3 s | 1,0 s → 0,5 s | 0 → 0,005 | 0 → ~50 ms |
| | `/kutatas` | 0,6 s → 0,4 s | 0,9 s → 0,9 s | 0,007 → 0 | 98 → ~150 ms |

Átvitel: asztali `/technologia` 4,1 MB → 600 KB (a videó csak látótérben tölt), `/` 1,2 MB → 643 KB (asztali, videó a `load` után), mobilon nincs videó.

Utójavítás (2026-11-01, a nyitott tételek): (1) a `/problema` mobil CLS 0,106 → 0,001 — a hero-cím telefonon szélességhez igazodó méretet kapott, így a tartalék és a Fraunces betűvel is 2 sorban marad; (2) 1024 px alatt a HubFolder helyett egyszerű témalista (a HubFolder csak asztalon mountol); (3) a négy `.png` nevű JPEG átnevezve `.jpg`-re; (4) mobil TBT: a képernyőn kívüli végtelen animációk csak látótérben futnak (`useLoopActive`), a talajrögök statikusak (eddig ~74 000 stílusírás betöltéskor), a modell-diagram `transform`-mal animál, a ScrollLayout második szekciótól `content-visibility: auto` → mobil TBT `/problema` ~1000 → ~440 ms, `/kutatas` ~950 → ~280 ms, `/technologia` ~500 → ~400 ms; (5) az `InteractiveSoil` SMIL-esője áll képernyőn kívül és reduced motion esetén (`motion-check` ellenőrzi).

## 14. Hatókörön kívül

- Az analízis nem változtatott a felületen: a fenti hibák nincsenek javítva ezen az ágon (kivétel: halott kód/asset/függőség takarítás, ESLint-konfig, `CLAUDE.md`).
- Nem készült valódi eszközös (iOS/Android) mérés és Lighthouse-futtatás; a számok emulált, helyi production-szerveres mérések — éles CDN-en (Vercel) az asztali értékek jobbak, a mobil arányok hasonlók.
- Tartalmi/szakmai helyesség (kutatási adatok) ellenőrzése nem része.
- Képi arculat, színpaletta újratervezése nem része.
