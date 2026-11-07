# 001 · Ásógép-animáció a talajszelvényen

**Státusz:** kész (2026-11-07) · **Létrehozva:** 2026-11-05 · **Méret:** M

## Cél

A `/problema` ásógépes talajszelvényén ismétlődő animáció: valós léptékű ásórotor (6 kapa, a kerekekkel együtt forog) és egy 406 mm-es hajtott elmunkáló henger halad át a szelvényen. Minden áthaladás a mostani statikus képpel ér véget.

Demó: `docs/javaslatok/2026-11-03-asogep-szelveny-animacio.html`

## Hatókör

- `src/components/problem/visualizations/SpadingMachineSVG.tsx`
- Asztali és mobil; `prefers-reduced-motion` mellett a statikus végállapot, kapcsoló nélkül.

## Nem nyúlunk hozzá

- A szelvény végső képe (a mostani statikus ábra) nem változik.

## Döntések

- 2026-11-03: a gép hiteles ábrázolása a cél (források: Agroskill, Imants prospektus); a javaslatot félretettük későbbre.
- 2026-11-07: a gép a működési elv videója szerint, tükrözve, 6 kapával (3. változat, jóváhagyva).
- 2026-11-07: lassabb a „fél valós sebességnél”, és ismétlődik. Ütemezés: 1,5 s érintetlen talaj → ~6,3 s munka a valós 4,5 km/h harmadával (≈1,5 km/h) → 4 s kész kép → 0,8 s áttűnés vissza; egy kör ~12,6 s. Az első kör az áttűnéssel indul, így a statikus képből nincs ugrás.
- 2026-11-07: alapból a gép a képen belül marad; egy apró, halvány kapcsoló a kép bal felső sarkában (24 px-es ikon, 44 px-es tapintási felület) mutatja az egész gépet a kép fölött.

## Terv: a gép új kinézete (3. változat, 2026-11-07)

A felhasználónak tetszik a demó ötlete, de a gépnek jobban kell hasonlítania a `/technologia` működési elv videójára (`public/videos/Andornak.mp4`, „Ásórotor” / „Elmunkáló henger”). A videóban a gép balra halad, a szelvényen jobbra, ezért az egészet **tükrözzük**: elöl, jobb oldalon az ásórotor, mögötte, bal oldalon a henger.

### Mit veszünk át a videóból

| Elem | Videó (referencia) | Most a demóban | 3. változat |
|---|---|---|---|
| Rotoragy | világos fogaskerék (~12 fog), 4 csavarlyuk + középlyuk, mögötte kerek tárcsa (~⅓ sugár) | sima kör + pötty | fogaskerék + mögötte tárcsa, egyszer generált `path` |
| Kapakar | széles, lapos acélpánt, a tövénél vastag, ~70°-os sarló ívben hajlik, a hegy a **forgásirányba előre** mutat | vékony vonal, hátrafelé hajlik | kitöltött, elvékonyodó sarló alak (nem `stroke`), hegy előre (a mi irányunkban az óramutató szerint) |
| Ásólap | külön, csavarral rögzített, világosabb lap a kar végén, hegyes | kis négyszög | külön lap egy csavarpöttyel, a kar ívét folytatja |
| Kapák száma | 6 egy tárcsán | 4 erős + 24 halvány vonal | **eldöntendő**, lásd lent |
| Henger | sötét dob, nagy világos fogaskerék-agy, körülötte 2–3 gyűrűben szaggatott krémszínű ívek (a forgó rugós fogak) | világos dob + 16 görbe fog | sötét dob + agy + 3 szaggatott ív (`stroke-dasharray` köríveken), a fogak 0–6 cm mélyen a felszín alá érnek |
| Váz | nincs | áttetsző lemez + vonórúd | **elhagyjuk** (a képen furcsa, kékes sávnak látszott) |
| Talaj a gép között | a rotor és a henger között felhalmozott rögök | van emelkedés (`swell`) | marad, picit hangsúlyosabb buckával a rotor mögött |

### Színek és stílus

- Meleg acélszürke, földszínes palettán belül: test `#8f877c`, árnyék/él `#5b5349`, fény `#cfc7ba`, agy `#e3ddd2`; a henger dobja `#3a332c`.
- A rögökhöz illő rajzstílus: lapos kitöltés + vékony sötét körvonal (`rgba(0,0,0,.35)`), a karon egy keskeny világos élfény-sáv a 3D-hatásért. Szűrő (`blur`, `drop-shadow`) nincs, mert drága festeni.
- Világoskék égen (`#90CAF9`) a világos fém elvész, ezért a test sötétebb, mint a videóban.

### Lépték és vágás

- Marad a valós lépték: kapahegy-sugár ~40 cm, a hegy a „30 cm” jelig ér, a tengely 10 cm-rel a felszín fölött (y ≈ 22). A viewBox csak 45 egység eget mutat, így a rotor felső fele kilóg a képből; az agy és az alsó kapák látszanak.
- **Eldöntendő:** az animáció alatt a gép kilóghat-e a kép fölé (`overflow: visible` az SVG-n, a beépítéskor a kártya is engedje), hogy az egész csillag látsszon, ahogy a videóban.

### Megvalósítás (a demóban, utána a komponensben)

1. Egy kar + ásólap egyszer, `<defs>`-ben (`<path id="spade">`), a kapák `<use transform="rotate(…)">` példányok; a fogaskerék-`path` egy függvényből (`gearPath(teeth, rOuter, rInner)`), a rotor és a henger közösen használja.
2. Forgásirány tükrözve: a rotor az óramutató szerint forog (alul a kapák hátra, balra mozognak), a hegyek előre mutatnak; a kerületi sebesség aránya (1,5×) és az óra matematikája változatlan, a rögök törése és repülése is.
3. A henger: dob + agy + 3 szaggatott körív eltérő sugárral és szaggatással, együtt forognak a dobbal (1,1×).
4. A demóban egy „Előző gép” kapcsoló marad az összehasonlításhoz; a statikus végső kép nem változik.
5. Jóváhagyás után kerül át a `SpadingMachineSVG.tsx`-be (a „Kész, ha” lista szerint).

### Lejátszás gombbal + kultivátor (2026-11-07, demó)

- Felhasználói döntés: ne fusson magától. Alapból a kész kép látszik; egy kis ▶ gomb egyszer lejátssza, és a kész képen áll meg (futás közben a gomb megállít). A kultivátoros kártya is kap animációt, ugyanígy; a sárga U csak a menet végén rajzolódik be.
- Demó: `docs/javaslatok/2026-11-07-szelveny-animaciok-lejatszas.html` (artifact https://claude.ai/artifact/8ZSviuvHGV1cktxKbdetWv).
- Kultivátor szemből (a három U három kapa nyoma): a gép mögülünk közelít, áthalad a szelvény síkján, kimegy felénk. Ütemezés: 0,6 s áttűnés → 0,8 s → 1,8 s közelítés → áthaladás → 0,75 s → U berajzolódik (~1,2 s); összesen ~5,3 s. Ásógép: 0,6 s áttűnés → 1,0 s → ~6,3 s munka; ~7,9 s.
- Checker (11-07, az ismétlődő változaton): minden pont rendben; a mobil TBT a dev szerveren 3,26 s a /problema oldalon (a legmagasabb), alapérték nélkül. A play gombos változat ezt csökkenti (kattintásig nem fut semmi); a beépítés után a QA-buildön újramérni.

### Demó 2 (2026-11-07)

- Az „egész gép” kapcsoló kikerül (felhasználói döntés).
- A kultivátorhoz három változat van a demóban: A áthaladás (a gép felénk jön át a szelvény síkján, ~5,3 s), B ék és repedések (a kapák benyomódnak, repedések a felszínig, az ék megemelkedik és morzsákra esik, ~5,8 s), C rezgő kapák (a lazulás a kapavégek körül terjed, ~6,9 s). A választás nyitott.
- 11-07: a C tetszik, de jön-megy hatással: elkészült a D változat (a gép mögülünk érkezik, fékezve megáll a szelvény síkjában, 3 s-ig rezeg, amíg a lazulás szétterjed, aztán felgyorsulva kimegy felénk; ~7,9 s). Jóváhagyásra vár.
- 11-07: a D irányát megfordítottuk (felhasználói kérés): a gép felőlünk érkezik nagyban, fékezve megáll a síkban, rezeg, aztán távolodva, a talajban halványan kimegy; ~8,0 s.
- Sárga vonal az ásógépen: a demóban kapcsolható (hullámos vonal y≈106-nál a menet végén, felirattal: „A sárga vonal fölött a teljes szélességben laza a talaj.”). Javaslat: maradjon mindkettőn. Döntés nyitott.

### Végső döntés és beépítés (2026-11-07)

- Kultivátor: az **A** változat (áthaladás). Az ásógépes szelvény is kap sárga vonalat (y≈106, a menet végén rajzolódik be, felirat: „A sárga vonal fölött a teljes szélességben laza a talaj.”).
- Beépítve: `SpadingMachineSVG.tsx` (ismétlődés helyett play gomb, „egész gép” kapcsoló törölve, sárga vonal), `HeavyCultivatorSVG.tsx` (A animáció), közös `soilAnimation.ts`, `useSoilPlayback.ts`, `SoilPlayButton.tsx` (+ `.module.css`); a felirat a `CultivatorComparisonPage.tsx`-ben. A `SpadingMachineSVG.module.css` törölve.

## Nyitott kérdések

- [x] Kapák száma: 6 egy tárcsán, mint a videóban (felhasználói döntés, 2026-11-07).
- [x] Kilóghat-e a gép a szelvénykép fölé? Alapból nem; apró kapcsolóval igen (2026-11-07).

- [ ] A rotor sugara (~40 cm) és az ásóhegy / haladási sebesség aránya (1,5×) becslés — kell-e pontos adat?
- [ ] Az SVG megjegyzése (100 egység = 30 cm) ellentmond a rajzolt „30 cm” feliratnak (y≈115) — melyik a helyes?
- [x] Kapjon-e a `HeavyCultivatorSVG` hasonló animációt? Igen, az A változat (2026-11-07).
- [ ] Kellenek-e a 38WX altalajlazító fogai?

## Kész, ha

- [x] Alapból mindkét kártyán a kész kép látszik (a szerveroldali HTML-ben a kompakt rögök `opacity="0"`, a gép rejtve)
- [x] A kis gomb (24 px-es ikon, 44 px-es tapintási felület, billentyűzettel is) egyszer lejátssza az animációt: ásógép ~9,2 s, kultivátor ~5,3 s; futás közben megállít, és a kész képre ugrik; a végén újrajátszás ikon
- [x] Ha a kártya futás közben kigördül a képből, megáll a kész képen; csökkentett mozgásnál nincs gomb
- [x] A sárga U és az ásógépes vonal a menet végén rajzolódik be; a görgetéskori berajzolás megmaradt
- [x] `motion-check.js`, `mobile-check.js`, `layout-check.js` a /problema oldalon rendben; mobil TBT nem nő (kattintásig nem fut semmi)
- [x] `npx tsc --noEmit` hibamentes; képernyőkép 390 és 1440 px-en

## Eredmény

2026-11-07, commit 84da2a1 (preview/megrendelo-2026-11). Checker: minden pont rendben. A szerveroldali HTML-ben a 360 kompakt rög opacity 0, a gép parkolva; a gomb 44×44 px, egérrel és billentyűzettel is működik; ha a kártya kigördül a képből, vagy a felhasználó megállítja, a kész képre ugrik; csökkentett mozgásnál 0 gomb. A motion-, mobile- és layout-check átment, a tsc és az eslint hibamentes. A /problema mobil TBT-je a dev szerveren 1897 ms (az ismétlődő változatnál 3260 ms volt), asztalon 559 ms.

Nyitva marad: a rotorsugár és a fordulatszám becsült érték; a skála-ellentmondás a komponens megjegyzésében; a 38WX altalajlazító kései; a TBT újramérése QA-buildön.
