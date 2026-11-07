# 004 · Lakitelek 3D: a hengerek a föld alatt (rizotron-nézet)

**Státusz:** folyamatban · **Létrehozva:** 2026-11-07 · **Méret:** M

## Cél

A megrendelő (Attila) kérése: a lakiteleki 7 parcellás 3D diagramon látszódjon, hogy a laza réteg a föld alatt van. A hengerek a felszínből lefelé nőnek, színük a mélységtől függ, és egy sematikus penetrométer (0–20 bar) magyarázza, mit mér a henger.

## Hatókör

- `/kutatas` → Lakitelek diagram, 2025 és 2026 évad (beágyazott és teljes képernyős nézet).
- `experiment/FieldChart3DCanvas.tsx` újraírva a demó „A – Rizotron” változata alapján; `experiment/pages/LakitelekChartPage.tsx` teljes képernyős jelmagyarázata.
- Asztali és mobil.

## Nem nyúlunk hozzá

- Az eredménytáblázat (oldalpanel), az évadváltó, a play gombos betöltés.
- Adatok (`seasons.ts`, `data.ts`).

## Döntések

- 2026-11-07: a felhasználó a demóból az A (Rizotron) nézetet választotta: üvegfalú, kivágott talajtömb, fent növények és parcellatáblák, a hengerek lefelé lógnak. Demó: https://claude.ai/artifact/SaVKP6Eh2Kjg5dmLDt6Voy
- 2026-11-07: színek Attila üzenete szerint: ≤ 10 cm piros, 10–25 cm sárga (a 25 is), > 25 cm zöld.
- 2026-11-07: a penetrométer fix, magyarázó ábra a bal szélen (30 cm mélyen, 20 bar), Imants-szerű számlappal és felirattal; T-markolat balról jobbra. Megnyitáskor egyszer leszúr (reduced motion esetén nem). Nincs összekötő vonal, nincs címke, kattintásra nem mozdul.
- 2026-11-07: kattintásra a henger kiemelődik, a kártya kiírja az értéket.
- Vibrálás ellen: a henger nyitott végű (nincs teteje a felszín síkjában), a felszín átlátszatlan, a gyűrű polygon offsettel, kamera near 0.5 / far 150.

## Nyitott kérdések

- [ ] Attila: a 20 bar a laza réteg határa?
- [ ] Attila: megvannak a mélységenkénti penetrométer-leolvasások? (akkor ellenállás–mélység görbe a talajfalon)
- [ ] Attila: rendben van az Imants név a számlapon?

## Kész, ha

- [ ] 2025 és 2026 évadban a hengerek a felszín alatt vannak, színük a fenti szabály szerint (2026 júl. vége mind piros/sárga)
- [ ] A penetrométer a bal szélen áll, betöltéskor leszúr; reduced motion mellett azonnal a végállapot
- [ ] Felülről nézve nincs villogás (henger nincs a felszín síkjában)
- [ ] Hengerre kattintva a kártya a parcellát, a hónapot és az értéket mutatja
- [ ] Teljes képernyőn és 390 px-en is működik, nincs konzolhiba
- [ ] `npx tsc --noEmit` és `npm run lint` hibamentes
- [ ] Szemmel: képernyőkép 390 és 1440 px-en

## Eredmény

(kitöltés a végén)
