# 2026 előtti javítások (P0–P1) — spec

Dátum: 2026-10-31 · Forrás: `docs/2026-10-31-ui-ux-performance-analysis.md` (4., 5., 7., 9., 10. fejezet)

## Cél
A 2026-os adatok feltöltése előtt a meglévő oldal legyen gyors, mobilon olvasható és akadálymentes, hogy az új adatok (amelyek a 2025-ösök **mellé** kerülnek, a Kutatás oldalon választhatóan) már javított keretbe érkezzenek.

## Követelmények

Minden mérés a `scripts/qa/` szkriptjeivel, production buildön (`next build && next start`) történik.

| # | Követelmény | Elfogadási feltétel (mérhető) |
|---|---|---|
| R1 | **Hero nem blokkol.** A főoldalon nincs teljes képernyős betöltő; a poster-kép és a szöveg azonnal látszik. Háttérvideó csak ≥768 px széles nézetben indul, és ott sem, ha `prefers-reduced-motion: reduce` vagy `Save-Data` van. A videó csak a `load` esemény után kezd töltődni (`preload="none"`). Videóhiba esetén a poster marad. | `hero-check.js`: blokkolt mp4 mellett a hero-cím 3 s-on belül látható; lassított 4G mobilon a tartalom látható ≤ 4 s; mobilon nincs `.mp4` kérés. |
| R2 | **Mobilon nincs levágott tartalom.** | `clip-check.js` 360 és 390 px-en, mind a 4 oldalon: 0 olyan szöveges elem, amelyet a viewport vagy egy `overflow: hidden/clip` ős levág (szándékosan görgethető elemek kivételével). |
| R3 | **Biztonsági frissítés.** `next` és `eslint-config-next` → `15.5.28` (kiadva 2026-10-14). Nem-force `npm audit fix` a tranzitív csomagokra. | `npm audit --omit=dev`: nincs `critical`; build OK. |
| R4 | **Olvasható tipográfia.** A `globals.css` „125% SCALING FIX” szabálya (13 px gyökér) megszűnik. Folyószöveg ≥ 15 px, legkisebb címke ≥ 12 px asztalon és mobilon. A nagyobb betű miatt a tartalom sehol nem vágódhat le: a szekciók a tartalomhoz nőnek. | `type-check.js`: medián ≥ 15 px, min ≥ 12 px (1440×900, 390×844). `clip-check.js` 1440×900, 1536×864 és 1366×768 asztali nézetben is 0. |
| R5 | **Nincs mesterséges késleltetés.** `RouteLoadingProvider` (800 ms), `NavigationContext` (+500 ms), `LoadingScreen` és az `app/template.tsx` oldalbelépő animáció megszűnik. | Oldalváltáskor és első betöltéskor nincs teljes képernyős réteg; a menü kattintás után az új oldal címe ≤ 1 s alatt látszik (helyi szerver). |
| R6 | **Reduced motion.** Gyökér `MotionConfig reducedMotion="user"`; globális CSS-szabály a `prefers-reduced-motion: reduce` esetre (animációk/átmenetek ~0, `scroll-behavior: auto`). Reduce esetén: a typewriter a teljes szöveget statikusan mutatja, a parallax kikapcsol, az `AnimatedNumber` azonnal a végértéket mutatja (a rAF cleanupkor törlődik). | Reduce-emulációval a főoldal 0,5 s-on belül végleges állapotban van (két képernyőkép 0,5 s és 3 s után pixelre azonos, a poster miatt videó nincs). |
| R7 | **Érintés- és billentyűparitás.** A hoverre nyíló kártyák (`CompactionStatsPage`, `PloughingEffectsPage`) koppintásra / Enterre is nyílnak-zárulnak (`button`, `aria-expanded`); hover-nyitás csak `(hover: hover)` eszközön. A `ProblemHeroSection` navigációs kártyái fókuszálhatók és Enterrel működnek. A `HubFolder` hub-ja koppintásra kinyitja az opciókat. | Playwright touch-emulációval (390×844) koppintásra kinyílik a kártya és látszik a rejtett szöveg; Tab + Enter ugyanígy asztalon. |
| R8 | **Betöltési alapok.** Fontok `next/font/google`-lel (Inter, Fraunces; a `--font-body` / `--font-display` változók megmaradnak), a CSS `@import`-ok törlődnek. A főoldal `force-dynamic` exportja törlődik (statikus). Az `Andornak.mp4` `preload="none"`, és csak látótérbe érve indul. | Build-kimenetben a `/` statikus (○); nincs `fonts.googleapis.com` kérés; asztali `/technologia` első betöltés < 1 MB (a videó nélkül). |

## Döntések (a felhasználónál is látszanak — visszamondhatók)
- **D1** Mobilon (<768 px) nincs háttérvideó, csak a poster-kép. Ok: a helyi gépen nincs H.264-kódoló kisebb mobilváltozathoz, és a poster a leggyorsabb. *Ha rossz:* mobilon kevésbé „élő” a hero; később egy ≤2 MB-os mobilvideó visszahozható.
- **D2** Az oldalbelépő fade (`template.tsx`) megszűnik. *Ha rossz:* az oldalváltás kicsit hirtelenebb.
- **D3** A typewriter-effekt megmarad (reduce esetén statikus). *Ha rossz:* a teljes kivétele egy sor.
- **D4** A betűméret-növelés miatt a sűrű nézetek (pl. Lakitelek összehasonlítás) hosszabbak lesznek; görgetés megengedett, a „minden egy képernyőn” elv feladva.

## Hatókörön kívül
- Évválasztó (2025/2026) és a 2026-os adatok — külön spec az adatmodellel együtt.
- Elemző P2–P3 tételei: mobil alsó navigáció egyesítése, 100vh üres képernyők, képek előméretezése, SEO (not-found, icon, robots, sitemap, OG), lábléc a `/kutatas`-on, eredmény-összegzés.
- Az e2e tesztek átírása, a teljes motion-audit, vizuális újratervezés, színpaletta.
- `exhaustive-deps` figyelmeztetések, kivéve az érintett fájlokban.
