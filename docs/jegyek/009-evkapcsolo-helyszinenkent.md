# 009 · Egy évkapcsoló helyszínenként, az évszám sima szöveg

**Státusz:** kész · **Létrehozva:** 2026-11-09 · **Méret:** M

## Cél

A /kutatas-on 13 „ÉV” doboz helyett helyszínenként egy kapcsoló; a blokkokban az év sima szöveg. Egy helyszín váltása a többit nem állítja át. Forrás: mobil UX 11-09 K3 (P2).

## Hatókör

- `season/SeasonContext.tsx`: `param` prop (helyszínenként `?evad-szk=`, `?evad-lk=`, `?evad-kb=`); a régi `?evad=` továbbra is működik.
- `*CombinedPage.tsx`: mindhárom helyszín saját `SeasonProvider`-ben (Kecskemét: csak 2025, így nincs többé „2026-ban itt nem mértünk”).
- `season/SeasonOnly.tsx` + `.module.css`: „Év: 2025 · …” sima szöveg, nem gombnak látszó doboz; új `SeasonLabel`: „Év: 2026 · másik év ↑” (a link a helyszín adataihoz ugrik).
- A kapcsoló csak a Helyszín adatokban marad (Szentkirály, Lakitelek); a Talajszerkezet, Talajhőmérséklet és a Lakitelek 3D blokkban `SeasonLabel`. Asztalon is.

## Döntések

- 2026-11-09: a felhasználó jóváhagyta a P2-t („mehet a P2, mindhárom”).

## Nyitott kérdések

- (nincs)

## Kész, ha

- [x] 390 és 1440 px képernyőkép megnézve
- [x] `npx tsc --noEmit` hibamentes (`src/`), ESLint 0 hiba
- [x] `layout-check`, `mobile-check` zöld; `clip-check`: csak a 006-os térképfeliratok (ismert, a táblán)
- [x] `checker` ellenőrzés (11-09): minden pont rendben; `touch-check`, `motion-check` is zöld

## Eredmény

2026-11-09.

- 390 px: 2 kapcsoló (Szentkirály, Lakitelek info), 12 szöveges évfelirat; Kecskemét mindenhol „Év: 2025”
- Szentkirály 2025-re váltva: a szentkirályi blokkok követik, Lakitelek marad 2026; URL `?evad-szk=2025`
- „másik év ↑” a Lakitelek 3D blokkból a Helyszín adatokra ugrik (top 64 px)
