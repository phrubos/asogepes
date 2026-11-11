# 017 · Kutatás oldal: fejezetritmus és egy közös belépő

**Státusz:** vár (a felhasználó jóváhagyására; utána 2. lépés: /technologia) · **Létrehozva:** 2026-11-10 · **Méret:** M

## Cél

A /kutatas ne egy hosszú, egyforma szalag legyen: a helyszínek fejezetként váljanak el, a blokkok egy visszafogott, egyszeri belépővel érkezzenek, mint a /technologia oldalon, csak annak ismétlődő effektje nélkül.

## Hatókör

- `experiment/pages/CombinedPage.module.css`: blokkok között 96 px (asztal, 110 helyett), 48 px (telefon, marad); a helyszín előtt nagy szünet (asztal +120 px, telefon +40 px → 104 px) és egy balról induló, halványuló arany hajszálvonal.
- `experiment/season/RevealBlock.tsx` (új): áttűnés + 24 px emelkedés, egyszer. Görgetésre futó helyzetmérés, nem IntersectionObserver (az a `content-visibility` szakaszokban ugrás után nem jelez, a blokk láthatatlan maradt).
- `experiment/season/SiteBlocks.tsx`, `experiment/sections/MethodologySection.tsx`, `*CombinedPage.tsx`.
- Asztal és mobil; telefonon nincs belépő (`mobile-static`), csak a térköz változik.

## Nem nyúlunk hozzá

- A grafikonok saját kirajzolása, a blokkok belseje, a kinézet (színek, betűk).
- /technologia: a `once: false` → egyszeri belépő csak a jóváhagyás után (2. lépés).

## Döntések

- 2026-11-10 (felhasználó): „mehet a javasolt irány”: hierarchikus térköz, egy visszafogott egyszeri belépő; nincs parallax, scroll-jacking, snap.
- 2026-11-11: a hajszálvonal széles képernyőn elcsúszott (1920 px-en 100 px-szel a badge előtt); most a középre igazított 1200 px-es dobozhoz igazodik (1366–1920 px-en egyezik).
- 2026-11-10: a „csak Szentkirály először” helyett az egész oldalon, mert a stílus közös fájlban van; az összevetés ugyanúgy megy (`/elotte-utana`).

## Nyitott kérdések

- [ ] A felhasználó jóváhagyja-e a kinézetet; utána a /technologia egyszeri belépője.

## Kész, ha

- [x] Telefon (390): blokkok között 48 px, helyszínek között 104 px; asztal: blokkok között 96 px margó, a helyszín előtt hajszálvonal a badge bal szélével egy vonalban.
- [x] `?section=` ugrás és gyors görgetés után nincs 1 alatti átlátszóságú blokk a képernyőn (1440 és 1366 px).
- [x] `layout-check`, `motion-check`, `nav-check`, `mobile-check` zöld; mobil TBT nem nő (`perf.js`).
- [x] `npx tsc --noEmit` hibamentes; képernyőkép 390 és 1440 px-en.

## Eredmény

- A checker (2026-11-10) minden pontot rendben talált:
  - 390 px: blokkok között 48 px, helyszínek között 104 px (mindhárom határnál).
  - 1440 px: a hajszálvonal és a badge bal széle egyaránt 308 px; a blokk-margó 96 px; a helyszínek között asztalon kb. 364 px.
  - Ugrás (`?section=`, 5 cél), menü és gyors görgetés után 0 rejtett blokk, 1440 és 1366 px-en.
  - `layout-check`, `motion-check`, `mobile-check` zöld; `nav-check`: csak a 4 ismert Suspense-hiba.
- Mobil TBT (/kutatas, dev szerver, 3-3 futás): előtte 2609 / 2670 / 3563 ms, utána 2623 / 3484 / 2537 ms. A medián 2670 → 2623, nem nőtt.
- Az első változat IntersectionObservert használt; `?section=` ugrás után a blokk opacity 0-n maradt. Javítva: görgetésre futó helyzetmérés.
