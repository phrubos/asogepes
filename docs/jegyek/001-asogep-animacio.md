# 001 · Ásógép-animáció a talajszelvényen

**Státusz:** ötlet (parkoltatva 2026-11-03) · **Létrehozva:** 2026-11-05 · **Méret:** M

## Cél

A `/problema` ásógépes talajszelvényén egyszer lefutó animáció: egy valós arányú Imants 38SX rotor (7 tárcsa × 4 ásó, a kerekekkel együtt forog) és egy 406 mm-es hajtott fogashenger halad át a szelvényen. Az utolsó képkocka megegyezik a mostani statikus képpel.

Demó: `docs/javaslatok/2026-11-03-asogep-szelveny-animacio.html`

## Hatókör

- `src/components/problem/visualizations/SpadingMachineSVG.tsx`
- Asztali és mobil; mobilon is egyszer fut, `prefers-reduced-motion` mellett rögtön a végállapot.

## Nem nyúlunk hozzá

- A szelvény végső képe (a mostani statikus ábra) nem változik.

## Döntések

- 2026-11-03: a gép hiteles ábrázolása a cél (források: Agroskill, Imants prospektus); a javaslatot félretettük későbbre.

## Nyitott kérdések

- [ ] A rotor sugara (~40 cm) és az ásóhegy / haladási sebesség aránya (1,5×) becslés — kell-e pontos adat?
- [ ] Az SVG megjegyzése (100 egység = 30 cm) ellentmond a rajzolt „30 cm” feliratnak (y≈115) — melyik a helyes?
- [ ] Kapjon-e a `HeavyCultivatorSVG` hasonló animációt?
- [ ] Kellenek-e a 38WX altalajlazító fogai?

## Kész, ha

- [ ] Az animáció egyszer fut, amikor a szelvény a nézetbe ér; az utolsó képkocka pixelre egyezik a mostani ábrával
- [ ] `motion-check.js` zöld (reduced motion: nincs mozgás)
- [ ] Off-screen nem fut (`useLoopActive` / IntersectionObserver)
- [ ] Mobil TBT nem nő érdemben (`perf.js`, előtte/utána)
- [ ] `npx tsc --noEmit` hibamentes; képernyőkép 390 és 1440 px-en

## Eredmény

—
