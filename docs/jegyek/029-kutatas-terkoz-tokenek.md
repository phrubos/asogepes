# 029 · /kutatas térközök a 4 px-es rácsra és a `--space-*` tokenekre

**Státusz:** kész · **Létrehozva:** 2026-11-15 · **Méret:** M

## Cél

A /kutatas térközei egy ritmusra álljanak, ne 38 féle kézzel beírt érték szórjon (a mai audit szerint csak 66 %-uk esik a 4 px-es rácsra). A design-audit „térközök” pontja 7 → 8.

## Hatókör

- `src/components/experiment/**/*.module.css`: `padding`, `margin`, `gap` (és hosszú alakjaik).
- Rácson kívüli értékek (3, 5, 6, 7, 9, 10, 13, 14, 18, 22, 26 px) → a legközelebbi 4-többszörös; egyenlő távolságnál a 8-as ritmus felé (6 → 8, 10 → 8, 14 → 16, 18 → 16, 22 → 24, 26 → 24).
- A tokennel egyező értékek (4/8/16/24/32/48/64 px, 0.25/0.5/1/1.5/2/3/4 rem) → `var(--space-xs…3xl)`.
- Asztali és mobil is.

## Nem nyúlunk hozzá

- 1–2 px-es finomhangolások, negatív értékek, `top/left/inset` pozíciók, `calc()`.
- 12 és 20 px marad literálként (rácson van, nincs rá token; a 20 px a mobil gutter, a 12 px a jelvény → tartalom döntés).
- 96/128 px marad literál (`--space-4xl/5xl` 1600 px alatt zsugorodik).

## Döntések

- 2026-11-15: a felhasználó kérte a D5 és D6 javítását a 80/100 fölé jutáshoz.

## Kész, ha

- [x] Az `experiment/**/*.module.css` padding/margin/gap értékei között nincs 3–26 px közötti, rácson kívüli érték.
- [x] Audit-mérés a /kutatas-on (390 és 1440 px): a 4 px-es rácson lévő térközök aránya ≥ 80 %, a különböző értékek száma csökken.
- [x] `style-diff.js`: a változások csak térköz-tulajdonságok, elemenként ≤ 2 px (a kerekítés), más oldalon nincs eltérés.
- [x] `layout-check`, `mobile-check`, `token-check` zöld; `clip-check` csak az ismert térkép-feliratokat jelzi.
- [x] `npx tsc --noEmit` hibamentes (a `.next-qa` maradványai nélkül).
- [x] Szemmel: képernyőkép 390 és 1440 px-en.

## Eredmény

- 29 CSS-fájl, 163 deklaráció (`padding`/`margin`/`gap`): rácson kívüli érték → legközelebbi 4-többszörös, tokennel egyező → `var(--space-*)`. Átalakító: egyszeri Python-szkript, nem maradt a repóban.
- Audit-mérés a /kutatas-on: 4 px-es rácson 66 % → **87 %** (1440 px) és 66 % → **90 %** (390 px); különböző értékek 38 → 32 és 24 → 19.
- `style-diff`: 1802 érték változott, mind a /kutatas-on, csak térközök és az ebből adódó méretek (elemenként ≤ 2 px); a másik három oldalon 0 eltérés. A telefonos oldal 180 px-lel (0,7 %) hosszabb.
- `layout-check`, `mobile-check`, `token-check` zöld; `clip-check`: csak a térkép ismert helynevei (Tiszakécske, Tisza); tsc 0 hiba.
- Checker subagent ebben a munkamenetben nem volt elérhető, a mérések kézzel futottak.
