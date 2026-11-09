# 008 · /technologia: másodlagos gombok az útmutatóban, összehasonlítás a modellkártyán

**Státusz:** kész (checker hátra) · **Létrehozva:** 2026-11-09 · **Méret:** S

## Cél

A /technologia telefonon ne kiabáljon négy egyforma arany gombbal, és a 38SX csökkenő számai ne olvashatók romlásnak. Forrás: mobil UX 11-09 K5, K7 (P2).

## Hatókör

- `ApplicationGuide.module.css`: ≤1024 px-en a „Lásd a kísérletben” körvonalas pirula (mint a „Részletek”), nem teli arany sáv; asztalon változatlan szöveges link.
- `ModelSection.tsx`: a 38SX „Kísérleti eredmények” alá összehasonlító sor a `seasons.ts` 2025-ös V. parcellájából („szántás + kombinátor 32 → 19 cm”); a „2026-os adatokban az ásógép típusa nincs megnevezve…” belső megjegyzés törölve (a link marad). Asztalon is.

## Döntések

- 2026-11-09: a felhasználó jóváhagyta a P2-t („mehet a P2, mindhárom”).

## Nyitott kérdések

- [ ] Nyitott (megrendelő): a „Szerkezet tartóssága” csillagok forrása (K6) — a csillagokhoz nem nyúltunk.
- [ ] Nyitott (kutatók): a 38SX kártya a III. parcellára 22 → 20 cm-t ír (`data.ts` `modelDetails.38sx`), a kutatás oldal 2025-ös adata 23 → 19 cm; a VII.-re 32 → 31 vs. 31 → 31. Melyik a helyes?

## Kész, ha

- [x] 390 és 1440 px képernyőkép megnézve
- [x] `npx tsc --noEmit` hibamentes (`src/`), ESLint 0 hiba
- [x] `layout-check`, `mobile-check` zöld; `clip-check`: csak a 006-os térképfeliratok (ismert, a táblán)
- [ ] `checker` ellenőrzés

## Eredmény

2026-11-09.

- 390 px: 4 × „Lásd a kísérletben” 177×44 px, átlátszó háttér, arany keret; 1440 px: 143×31 szöveges link, mint eddig
- Az összehasonlító sor 390 és 1440 px-en látszik; `clip-check` `/technologia`: 0 minden szélességen; `mobile-check` zöld
