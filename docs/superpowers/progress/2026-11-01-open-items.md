# Nyitott tételek javítása — 2026-11-01 (a pre-2026 hardening után)

1. `/problema` mobil CLS 0,106: a hero `h1` a tartalék betűvel 2, a Fraunces 800-zal 3 sorba tört (h 81 → 121 px). Telefonon (≤640 px) `clamp(1.625rem, 7.4vw, 2.2rem)` → mindkét betűvel 2 sor; fontok blokkolásával / betöltésével mért címmagasság 360 és 390 px-en mind a 4 oldalon azonos. CLS 0,106 → 0,001. Ruling: a `display: swap` marad (nem `optional`) — cost if wrong: más címeknél is lehet sortörés-különbség; a `perf.js` CLS-e jelezné.
2. HubFolder 768/1024 px: ≤1024 px-en a HubFolder helyett koppintható témalista (`TechHeroSection`, `HeroPage.module.css .topicList`), a HubFolder csak `(min-width: 1025px)`-en mountol (új `useMediaQuery` hook) → telefonon a demó-ciklus sem fut. A touch-check: HubFolder érintős laptopon, témalista telefonon.
3. Négy `.png` nevű JPEG → `.jpg` (`manometer_200_v2`, `penetrometer_rotated_view`, `premium_cultivator_courtyard`, `premium_plough_head`), hivatkozások frissítve. 12 párhuzamos optimalizálói kérés (AVIF, 256/640/1080) üres lemez-cache-sel: mind 200, < 0,2 s. Az eredeti elakadás (memóriahiányos gépen) nem reprodukálható.
4. Mobil TBT. CPU-profil: a fő szál ideje főleg render (layout/style/paint), plusz Framer-képkockák. Javítások:
   - új `useLoopActive(ref)` (látótérben és nem reduce): `PloughingSoilComparison` vízcseppek, `PloughedSoilSVG` cseppek + sáv, `HungaryMap` pulzus, `CompactionStatsPage` 20 s-os lejátszó;
   - a talajrögök (`HeavyCultivatorSVG`, `SpadingMachineSVG`, `PloughedSoilSVG`) belépő animációja törölve — betöltéskor, képernyőn kívül futott (~74 000 attribútumírás);
   - a kártyák „lenyitó” nyila CSS `.nudge-down`; a modell-diagram oszlopai `height` helyett `transform: scaleY`;
   - `ScrollLayout`: `.section+.section { content-visibility: auto }` — a fontcsere és a hidratálás eddig a teljes oldalt újra-layoutolta; a görgetés (`scrollToElement`) megálláskor újracéloz, érintés/görgő megszakítja, reduce esetén nem animál. Mélylink A/B (28 cél × telefon/asztal, `content-visibility` be/ki): azonos érkezés.
   Eredmény (mobil 4G, 3 futás): TBT `/problema` ~1000 → ~440 ms, `/kutatas` ~950 → ~280 ms, `/technologia` ~500 → ~400 ms, `/` ~230 ms.
5. `InteractiveSoil` SMIL-eső: `paused` prop → `svg.pauseAnimations()`; képernyőn kívül és reduce esetén áll. `motion-check` (c) pont ellenőrzi.

QA (production build): nav-, touch-, motion-, hero-, type-check zöld; clip-check 360/390/768/1024/1366/1440/1536 px × 4 oldal = 0; tsc OK; lint 0 hiba.
FINDING (mobil újratervezéshez): néhány mélylink-eltolás régi (pl. `?section=methodology-penetrometer`, `ploughing-effects` 150 px) — `content-visibility` nélkül is ugyanígy; az `experiment/pages/HeroPage.tsx` (BookLayout) valószínűleg halott kód; a talaj-SVG-k égboltja világoskék (#87CEEB) — palettán kívül.
