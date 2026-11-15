# 030 · /kutatas tipográfia: adatfeliratok 13 px-en, display-méretek tokenre

**Státusz:** kész · **Létrehozva:** 2026-11-15 · **Méret:** M

## Cél

A /kutatas szövegeinek kb. harmada 12 px-es (asztalin 298 elem). Az adatok (idővonal-értékek, hónapok, eredményszámok, hőmérséklet-eltérések) legyenek jobban olvashatók, és a nagy számok, címek méretei egy skálából jöjjenek. A design-audit „tipográfia” pontja 8 → 9.

## Hatókör

- Adatfeliratok `--text-xs` (12 px) → `--text-sm` (13 px): `Timeline` (bar értékek, sorcímkék, hónapok, jelzők), `TemperatureSeriesChart` (dátum, eltérés), `TemperatureChart` (sorcímke), `LakitelekChartPage` (eredményszám, táblafej), `LakitelekRyeBoard` (rövidítések), `YearBridge` (év, érték), `ScrollLayout` alfejezet-gombok telefonon.
- Display-skála a `globals.css`-ben (`--text-4xl` … `--text-8xl`: 28/32/40/48/56 px); a kézzel beírt rem-méretek erre kerülnek (pontos egyezés: nincs változás; 1.625rem → 28 px, 2.25rem és 3.25rem → a közelebbi lépcső).
- `token-check` font-size plafonja lejjebb.

## Nem nyúlunk hozzá

- Csupa nagybetűs jelvények, eyebrow-k, évchipek, a fotókon ülő feliratok (`cqmin`) — ezek 12 px-en maradnak, ez a szokásos méretük.
- Fluid hero-címek (`clamp(...)`), a főoldal hero-ja.

## Döntések

- 2026-11-15: a felhasználó kérte („ezt is csináljuk meg”) a design 85 körüli pontszámához.

## Kész, ha

- [~] /kutatas 1440 px: 12 px-es szövegek aránya ~35 % → ≤ 20 % (lett: 36 % → kb. 21 % asztalin, 30 % → 20 % telefonon; a csupa nagybetűs sorcímkék szándékosan 12 px-en maradtak).
- [x] `token-check`: font-size különböző értékek 39 → ≤ 36, plafon lejjebb.
- [x] `clip-check`, `mobile-check` (átfedés, levágás): nincs új jelzés az ismert térkép-feliratokon túl; a bar belső értékei kiférnek.
- [x] `style-diff`: csak a font-size és az abból adódó méretek változnak.
- [x] `layout-check`, `type-check` (a főoldal ismert n = 3 jelzésén túl) zöld; tsc 0 hiba.
- [~] Szemmel: idővonal és hőmérséklet-diagram 390 és 1440 px-en megnézve; a Lakitelek-táblát csak a clip-check mérte.

## Eredmény

- 16 deklaráció `--text-xs` → `--text-sm` (7 CSS-fájl); kivétel: telefonon a 28 px széles idővonal-sávok belső értéke („37,8” csak 12 px-en fér ki) és az idővonal csupa nagybetűs sorcímkéi (KONTROLL / ÁSÓGÉP) 12 px-en maradtak.
- Display-skála: `--text-4xl…8xl` (28/32/40/48/56 px) a `globals.css`-ben; 17 kézzel beírt rem-méret erre került. Pontos egyezés a főoldalon, /problema-n, /technologia-n és a menüben (nincs látható változás); a /kutatas-on 3 szám 36 → 32 px, 1 szám 52 → 48 px, 2 cím 26 → 28 px.
- `token-check`: font-size 39 → 36 különböző érték, plafon 36-ra csökkentve.
- Audit-mérés /kutatas: 12 px-es szövegek 36 % → kb. 21 % (1440) és 30 % → 20 % (390); különböző betűméretek 13 → 11 és 10 → 9.
- `style-diff`: csak a /kutatas változott (font-size, line-height és az ebből adódó méretek), a másik három oldalon 0 eltérés.
- `clip-check`: csak a térkép ismert helynevei; `layout-check`, `mobile-check`, `token-check` zöld; `type-check`: csak a főoldal ismert n = 3 jelzése; tsc 0 hiba.
- Checker subagent ebben a munkamenetben nem volt elérhető, a mérések kézzel futottak.
