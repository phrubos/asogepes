# 024 · Évrészek a /kutatas navigációjában

**Státusz:** kész (felhasználói átnézésre vár) · **Létrehozva:** 2026-11-13 · **Méret:** M

## Cél

Ha egy blokk mindkét évből látszik (egymás alatt 2025 és 2026, pl. Lakitelek › Egyéb fotók), az oldalsávból, a telefonos „Tartalom” lapról és a jobb alsó „Görgess lejjebb” gombbal is rá lehessen ugrani a 2025-ös és a 2026-os részre, és a navigáció mutassa, melyik évnél tart az olvasó.

## Hatókör

- `/kutatas`, a két évből duplázódó blokkok: Szentkirály › A talajszerkezet változása, Talajhőmérséklet; Lakitelek › 7 művelési kombináció, Egyéb fotók.
- Asztali oldalsáv: az aktív alpont alatt egy halk „└ 2025 · 2026” sor (szöveges linkek, nem pillek).
- Telefon/tablet (≤1024 px): a Tartalom lapon az alpont sorának jobb oldalán két koppintható évszám (44 px), a felső sáv „Egyéb fotók · 2026”.
- Jobb alsó gomb: az évrészeken is végiglépked („Lakitelek › Egyéb fotók · 2026”).
- Minden évrész saját azonosítót kap (`<blokk>-<év>`, pl. `lakitelek-photos-2026`), a `?section=` link oda ugrik.

## Nem nyúlunk hozzá

- A 25 / 26 szűrő chipek működése és kinézete.
- Az egyszer megjelenő blokkok (Helyszín adatok, Talajélet) és az egyéves blokkok: nincs évsoruk.
- `/problema`, `/technologia`: a `ScrollLayout` változása rájuk nincs hatással (nincs évrészük).

## Döntések

- 2026-11-13: az A változat (évek egy sorban az aktív alpont alatt) — felhasználó.
- Az évek nem pillek, mert a pill a szűrő (015).
- Ha a szűrővel csak egy év látszik, az évsor eltűnik; a régi blokk-azonosító (`lakitelek-photos`) megmarad, a régi linkek működnek. Egy nem létező évrészre mutató link (`…-2026`, ha a 2026 ki van kapcsolva) a blokkra esik vissza.

## Változatok (csak új vizuális blokknál)

- Mockup oldal: `.superdesign/design_iterations/kutatas_ev_nav_1.html` · választott: A · módosítások: nincs

## Nyitott kérdések

- (nincs)

## Kész, ha

- [ ] 1440 px: Lakitelek › Egyéb fotók aktív → alatta „2025 · 2026” sor; a 2026-ra kattintva a `#lakitelek-photos-2026` teteje a szokásos eltolásnál (≈80 px) áll, a 2026 arany és `aria-current="true"`
- [ ] 1440 px: kézi görgetéssel a 2025-ös részből a 2026-osba érve az évsor és a sín arany kitöltése átvált
- [ ] Jobb alsó gomb a 2025-ös részen: „Lakitelek › Egyéb fotók · 2026”, kattintásra oda ugrik
- [ ] 390 px: Tartalom lap → Egyéb fotók sorában 2025 / 2026 (≥44×44 px), a 2026-ra koppintva oda ugrik, a felső sáv „Egyéb fotók · 2026”
- [ ] Szűrő: Lakitelek csak 2025 → nincs évsor sehol, a jobb alsó gomb évszám nélkül
- [ ] `?section=lakitelek-photos-2026` (mindkét év) oda ugrik; `?section=lakitelek-photos-2026&evad-lk=2025` a blokkra esik vissza
- [ ] `/problema` és `/technologia` navigációja változatlan
- [ ] `npx tsc --noEmit` és `npm run lint` hibamentes
- [ ] Zöld: `nav-check.js`, `layout-check.js`, `touch-check.js`, `motion-check.js`, `token-check.js`
- [ ] Szemmel: képernyőkép 390 és 1440 px-en

## Eredmény

2026-11-13, dev szerveren (Playwright):
- 1440: Lakitelek › Egyéb fotók → „└ 2025 · 2026”; 2026-ra kattintva `#lakitelek-photos-2026` top = 80, `aria-current`; kézi görgetéssel a 2025-ös rész lesz aktuális (URL `?section=lakitelek-photos-2025`); a jobb alsó gomb a 2025-ön „Lakitelek · Egyéb fotók 2026”, kattintásra top = 80. Szentkirály talajszerkezet: 2 évrész, top = 80. Az alpontra kattintva az első évrész rögtön aktív.
- 390×844: a lapon az évgombok 52×44 px, a 2026-ra koppintva top = 64, a felső sáv „Egyéb fotók · 2026”.
- `?evad-lk=2025`: nincs évsor; `?section=lakitelek-photos-2026&evad-lk=2025` → `#lakitelek-photos` (top = 80).
- `/problema`, `/technologia` alpont-ugrás változatlan.
- `tsc` (src) és `lint` 0 hiba; `layout-check`, `touch-check`, `motion-check`, `token-check` zöld (egy színnel kevesebb). `nav-check`: a „Suspense” pont mind a 4 oldalon piros a dev szerveren (ismert álriasztás, lásd tábla), a többi zöld.
- Mellékjavítás: a görgetéskövetés előbb a szekciót keresi, utána benne az alpontot (a nem renderelt `content-visibility` szekciók régi téglalapja rossz alpontot jelölt ugrás után).
- Fájlok: `shared/ScrollLayout/{ScrollLayout,MobileSectionBar,NextSectionIndicator}.*`, `experiment/ResearchScrollLayout.tsx`, `experiment/season/SiteBlocks.*`.
