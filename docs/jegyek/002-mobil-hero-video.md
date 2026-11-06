# 002 · Mobil hero: álló Imants-videó

**Státusz:** kész · **Létrehozva:** 2026-11-06 · **Méret:** M

## Cél

Telefonon a főoldal háttere ne legyen elmosódott, és látszódjon rajta az Imants márka: egy rövid, valódi, álló videó a gépről.

## Hatókör

- `home/Hero.tsx`, `home/Hero.module.css`, csak 767 px alatt.
- Új fájlok: `public/videos/hero_mobile_imants.mp4` (720×1280, 4 s hurok, 1,3 MB), `public/images/hero-poster-mobile.jpg` (1080×1920, a videó első kockája).
- `scripts/qa/hero-check.js`: telefonon most már szabad a mobil videó, de csak a betöltés után.

## Nem nyúlunk hozzá

- Asztali és tablet (≥768 px) nézet: ugyanaz a fekvő videó és poszter.

## Döntések

- 2026-11-06: az ok mérve: a telefon 1200×625-ös posztert kapott (`sizes="100vw"`), ~5,3× nagyítás (felhasználó: „nagyon elmosódott”).
- 2026-11-06: a felhasználó a valódi felvételt választotta (nem AI), és kérte, hogy az Imants felirat látsszon. A 2-es jelölt lett: a `hero_background_optimized.mp4` 15,5–18,75 s része, a feliratra kockánként stabilizált 9:16-os kivágás (a recept az Eredményben), 1,5× lassítás (minterpolate), meleg színkorrekció (`cinematic-film` skill), 0,5 s áttűnéses hurok, majd fal.ai `bytedance-upscaler` (fidelity high) 1080×1920-ra, 720×1280-ban kódolva.
- 2026-11-06: mivel a hero 390×~1014 px (keskenyebb a 9:16-nál), a videó nem tölti ki a herót (a felirat kilógna), hanem felül, teljes szélességben áll, és lefelé a sötét háttérbe olvad.
- A videó csak `window.load` után indul, mozgáscsökkentésnél, Save-Data-nál és 2g/3g kapcsolatnál nem; képernyőn kívül megáll. Ilyenkor az álló poszter látszik.

## Kész, ha

- [x] 390 px-en a hero háttere a mobil poszter (`hero-poster-mobile`), a böngésző ≥1080 px széles változatot kap
- [x] 390 px-en a mobil videó a betöltés után elindul, az „imants” felirat teljes szélességben látszik (nincs levágva)
- [x] Mozgáscsökkentésnél nincs videókérés, a poszter látszik
- [x] 1440 px-en változatlan: fekvő poszter + `hero_background_optimized.mp4`
- [x] `hero-check.js` zöld; `mobile-check.js`, `layout-check.js` zöld; mobil TBT (`perf.js`) nem romlik
- [x] `npx tsc --noEmit` hibamentes
- [x] Szemmel: képernyőkép 390 és 1440 px-en

## Eredmény

2026-11-06, dev szerveren mérve (checker + saját mérés):
- 390 px, DPR 3: a poszter `hero-poster-mobile` (1080×1920-as fájl jön), a `.heroMedia` 390×693, a h1 teteje 301 px (360 px-en 282). A mobil videó csak a `load` után indul, és lejátszik.
- Mozgáscsökkentésnél 0 .mp4 kérés, a poszter látszik. 1440 px-en a nézet változatlan (`hero-poster-frame` w=1920 + `hero_background_optimized.mp4`).
- Megállítás: 390×150-es ablakban, ha a hero alja -178 px-en van, a videó `paused`, visszagörgetve újra fut. A főoldalon a hero alja normál ablakmagasságnál sosem megy 100 px-nél messzebbre, ezért a checker -28 px-es mérése még a `useLoopActive` 100 px-es ráhagyásán belül volt.
- hero-check, mobile-check (390/360: 0/0/0), layout-check, motion-check: zöld; tsc (src) és eslint hibamentes.
- perf.js, dev szerver, `/` mobile4g: FCP 0,8 s, CLS 0,001, TBT ~955 ms (a többi oldalnál kisebb). **Nyitott:** lassított mobilhálózaton az LCP-elem a `video` (18,4 s, dev); production buildben érdemes megnézni, és ha ott is így van, a videó ne legyen nagyobb LCP-jelölt a poszternél.
- A videó receptje: kockánkénti stabilizálás az „imants” feliratra (hely + méret, PIL), 1,5× minterpolate lassítás, a `cinematic-film` színkorrekciója, 0,5 s áttűnéses hurok a legjobban illeszkedő kockák között, fal `bytedance-upscaler` (fidelity high), 720×1280-ban kódolva (CRF 26).
- fal-költség összesen ~0,13 USD (próbákkal együtt).
