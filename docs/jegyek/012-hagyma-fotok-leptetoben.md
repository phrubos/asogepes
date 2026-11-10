# 012 · Szentkirály hagyma: valódi fotók a léptetőben

**Státusz:** kész · **Létrehozva:** 2026-11-10 · **Méret:** M

## Cél

Az „Az ásógépes hagyma egy hónappal előrébb jár” léptető a rajzolt hagymák helyett a két valódi terepi fotót mutatja (2026. jún. 26., júl. 22.). A látogató a saját szemével látja a különbséget. A számok a fotókon vannak, a rajzból csak a léptékhelyes összkép marad.

## Hatókör

- `experiment/pages/SzentkiralyGrowthPage.tsx` + `.module.css`: 5 lépés helyett 4.
  1. **Június** (fotó, felfedő animáció, Ø + levél címkék).
  2. **Július** (idő-csúszka júniusról júliusra).
  3. **Egy hónap előny** (júliusi kontroll és júniusi ásógépes fej egymás mellett, ráközelítve, arany szaggatott keret, „= egy hónappal korábban”).
  4. **Összkép** (négy léptékhelyes kör + ív).
- Telefonon (≤1024 px): a két parcella egymás alatt, összkép két sorban. Nincs külön fül, a `Story` léptet.
- „Teljes fotó” gomb: a két fotó a meglévő `PhotoViewerModal`-ban.
- `src/lib/seasons.ts`: fotók az adatban; a `rangeNote` („Halvány levél…”) törlődik, a rajzzal együtt.
- Fotók: `public/images/kutatás_pics/Szentkirály/hagyma/` (2400 px WebP, 90°-kal elforgatva, EXIF/GPS nélkül).
- Forrás: Drive „Ásógép-2026”, `20260626_111240`, `20260722_123616`. Demó: https://claude.ai/artifact/4A1tBTJXGFjUQsQ8TjUoTG

## Nem nyúlunk hozzá

- `Story` közös komponens (a talajélet-blokk is használja).
- Az Összegzés „hagyma” kártyája (`SummarySection`).

## Döntések

- 2026-11-10: a felhasználó jóváhagyta a 4 lépéses demót, a felső (kisebb) csoport a kontroll, az arany keretek helye jó; „mehet a fejlesztés”.
- 2026-11-10: a feliratok csak hónapot mondanak („Június”, „egy hónappal korábban”), a 11-08-i megrendelői döntés szerint (nincs nap/dekád).
- 2026-11-10: nincs automatikus lejátszás (a `Story` elve: az olvasó léptet).

## Nyitott kérdések

- (nincs)

## Kész, ha

- [x] 1440 px: 4 lépés; az 1. lépésen fotó + két címke; a 2. lépésen a csúszka működik egérrel és billentyűvel; a 3. lépésen két kivágás arany kerettel; a 4. lépésen négy kör.
- [x] 390 px: két fotódoboz egymás alatt, a csúszka húzása nem lapoz (swipe), összkép két sorban; `mobile-check` zöld (tap ≥ 44 px, nincs átfedő szöveg).
- [x] Nincs 12 px alatti szöveg (`type-check`), `motion-check` zöld (csökkentett mozgásnál nincs átmenet).
- [x] „Teljes fotó” megnyitja a modált, a két fotó lapozható.
- [x] `npx tsc --noEmit` hibamentes, ESLint 0 hiba.
- [x] `layout-check` zöld; `clip-check`: legfeljebb a táblán ismert térképfeliratok.
- [x] Képernyőkép 390 és 1440 px-en mind a 4 lépésről.

## Eredmény

- A rajzolt hagymák helyett két terepi fotó, 4 lépés (Június · Július idő-csúszkával · Egy hónap előny kivágásokkal · Összkép 4 léptékhelyes körrel). Telefonon két doboz egymás alatt. „Teljes fotó” → `PhotoViewerModal`.
- checker (11-10, dev szerver): minden pont rendben. A csúszka egérrel, billentyűvel és érintéssel is működik, húzáskor a lépésszámláló „2 / 4” marad. 390 px-en a 3. lépésben a jelvény és az ÁSÓGÉP-felirat között 13 px a hézag. A modál lapoz, és Escape-re bezárul. A `layout-check`, `mobile-check`, `type-check` és `motion-check` zöld. A `clip-check` csak az ismert 006-os térképfeliratokat jelzi. Nincs vízszintes görgetés.
- Képek: scratchpad `shots/` (d-step1–4, m-step1–4, modál, reduced motion).
