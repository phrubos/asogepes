# 011 · Térfogattömeg-mérés: AI mini klipek a lépésfotók között

**Státusz:** elvetve · **Létrehozva:** 2026-11-09 · **Méret:** M

## Cél

A Módszertan „A térfogattömeg mérése” fotóváltójában a lépések között ne áttűnés legyen, hanem egy rövid mozgókép (fal AI, MiniMax H3 Max, első/utolsó képkocka = a két valódi fotó), amely pontosan a következő lépés fotóján áll meg.

## Hatókör

- `experiment/pages/BulkDensityMethodPage.tsx` + `.module.css`, `lib/methodology.ts`
- `public/videos/terfogattomeg/terfogattomeg-1-2.mp4`, `-2-3.mp4`, `-3-4.mp4` (960×640, H.264, hang nélkül, 1,0 / 1,2 / 2,2 MB)
- Asztali és mobil is.

## Nem nyúlunk hozzá

- A fotók, a lépésszövegek, a laborkártya és a metszetrajz.
- Kézi lépésváltás (fül, nyíl, húzás): továbbra is fotó, klip nélkül.

## Döntések

- 2026-11-09 (felhasználó): mindhárom átmenetnél a kezes/lapátos változat. 1→2: kesztyűs kéz nyomja be a hengert; 2→3: lapát ássa körbe; 3→4: kupak felfordítása → henger kiemelése a kupakba → felső kupak rányomása (két köztes kulcskockával, 10,5 s-ra vágva).
- A klip a cél-lépés alatt fut (a „Henger” szöveg alatt nyomja be a kéz a hengert), utána 2,5 s állókép, aztán jön a következő.

## Kész, ha

- [x] Automatikus lejátszásnál 1→2, 2→3, 3→4 között a klip fut, a végén nincs ugrás a fotóra
- [x] A lépés-sáv kitöltése a klip + tartás hosszáig tart
- [x] Fülre/nyílra/húzásra a fotó jelenik meg azonnal, a klip leáll
- [x] `prefers-reduced-motion` és Save-Data: nincs videó, csak fotók (nem töltődik le mp4)
- [x] A videók csak akkor töltődnek, amikor a blokk a képernyő közelébe ér
- [x] Az „Újra” gomb elölről lejátssza a klipekkel
- [x] `npx tsc --noEmit` és `npm run lint` hibamentes
- [x] Szemmel: 390 és 1440 px-en a klip kitölti a keretet (3:2), nincs fekete sáv

## Eredmény

**2026-11-09: elvetve, visszaállítva a fotókra (felhasználói döntés).** A beépítés működött (lásd lent), de:
- a kutatási oldalon a fotók valódi dokumentációk, az AI-mozdulatok többször életszerűtlenek lettek (sorrend, helycsere, rányomás helyett ráejtés);
- a fotó + lépésszöveg + SVG metszetrajz egyértelműen elmagyarázza a módszert;
- 4,5 MB videó és újabb AI-körök a javításhoz.

A tudás és a kód megmaradt: `~/.claude/skills/keyframe-clips` (recept, buktatók, `references/integration-bulkdensity.patch`). A forrásklipek nincsenek a repóban.

Az elvetés előtti mérések:

- 2026-11-09: a klipek automatikus lejátszáskor sorban futnak, a lépés-sáv hossza = 3 s tartás + klip (8170 / 7420 / 13460 ms), és megáll, amíg a videó tölt. A klip végképe és a cél-fotó eltérése 18,4–18,6 (újrakódolási zaj); a 3→4 klip a laborkártya alatt marad, így ott nincs klip→fotó váltás.
- Kézi fülváltásra a klip-réteg azonnal eltűnik; reduced motion: 0 `<video>`, 0 mp4-kérés (390 és 1440 px); a blokk előtt 0 mp4-kérés; az „Újra” klipekkel játszik újra.
- 390 px: 348×232, 1440 px: 574×383 videó, 3:2, fekete sáv nélkül. `tsc` (src) és `lint` hibamentes, `layout-check` és `motion-check` zöld (checker).
- Nem mérve: production build, `perf.js`.

