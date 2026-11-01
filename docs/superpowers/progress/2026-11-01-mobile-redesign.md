# Mobil újratervezés — napló

Spec: `docs/superpowers/specs/2026-11-01-mobile-redesign-design.md`. Döntések (felhasználó, 2026-11-01): felső sáv + Tartalom lap; márka marad, fegyelmezve; csak ≤1024 px.

## 1. fázis — közös keret
- `MobileSectionBar` (új): 56 px-es tapadó sáv az aktuális szekció + alszekció nevével; koppintásra alsó lap (role=dialog, fókuszcsapda, Esc / háttér zár, body-scroll lock) minden szekcióval és alszekcióval. ≤1024 px-en a pöttysor (sidebar) és a „Görgess lejjebb” korong eltűnik; a `NextSectionIndicator` mobilon nem is mountol.
- Szekciók ≤1024 px: `min-height: 0`, 20 px oldalmargó, 64 px köz; az első szekció 56 px-rel lejjebb kezd. Ugrás után a cél 64 px-re a tetejétől (a sáv alatt).
- `Navigation`: hamburger 1024 px-től (eddig 900), az 56 px-es sáv jobb szélén; a fejléc üres része átengedi a koppintást (`pointer-events`).
- FINDING + mitigáció: a képoptimalizáló hosszan futó, memóriahiányos szerveren ismét elakadt (két 1920 px-es Lakitelek-ortofotó, mögöttük minden képkérés). Friss szerveren 15 egyidejű hideg kódolás sem akadt el → nem reprodukálható determinisztikusan. Mitigáció: a 2560 px-nél nagyobb forrásképek (8 db) 2560 px-re méretezve (arány megtartva, ±0,0004; a hőkép-jelölők %-osak) — 21,5 → 7,9 MB, kevesebb memória dekódoláskor. A hero-háttér maradt (nagyobb lett volna).
- QA: nav-, touch-, motion-, type-check zöld; clip-check 7 méret × 4 oldal = 0.
