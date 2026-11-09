# 010 · Szentkirály: könnyebb talajszerkezet- és hőmérséklet-grafikon telefonon

**Státusz:** kész (checker hátra) · **Létrehozva:** 2026-11-09 · **Méret:** M

## Cél

A két legsűrűbb grafikon telefonon egyszerre csak a lényeget mutassa. Forrás: mobil UX 11-09 K4 (P2). A jelentésben javasolt lapozós blokk helyett egyszerűbb kapcsolók: ugyanaz a hatás, kevesebb mozgó rész.

## Hatókör

- `Timeline.tsx` + `.module.css`: ≤1024 px-en, ha van mélyásógépes sorozat, alapból csak a kontroll–ásógép pár (oszlopok, jelmagyarázat, értékelőkártyák); „Mélyásógépes parcellák is (2)” kapcsoló (`aria-pressed`) hozza elő. Asztalon minden látszik, a kapcsoló rejtve.
- `TemperatureSeriesChart.tsx` + `.module.css`: ≤1024 px-en „Mélység: 3 cm | 10 cm” választó, egyszerre egy sáv. Asztalon mindkét sáv.

## Döntések

- 2026-11-09: a felhasználó jóváhagyta a P2-t („mehet a P2, mindhárom”).

## Nyitott kérdések

- (nincs)

## Kész, ha

- [x] 390 és 1440 px képernyőkép megnézve
- [x] `npx tsc --noEmit` hibamentes (`src/`), ESLint 0 hiba
- [x] `layout-check`, `mobile-check` zöld; `clip-check`: csak a 006-os térképfeliratok (ismert, a táblán)
- [ ] `checker` ellenőrzés

## Eredmény

2026-11-09.

- 390 px: talajszerkezet 8 oszlop (bekapcsolva 16), a kártya 983 px; hőmérséklet 1 sáv, 883 px; 1440 px: 16 oszlop, 2 sáv, nincs kapcsoló
- Kecskemét (2 sorozat): változatlan, nincs kapcsoló
- A gombok 44 px magasak; `mobile-check`, `layout-check` zöld
