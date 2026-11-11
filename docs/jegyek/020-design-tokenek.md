# 020 · Design tokenek összevonása (betűméret, lekerekítés, árnyék, szín, térköz)

**Státusz:** kész · **Létrehozva:** 2026-11-11 · **Méret:** L

## Cél

A `globals.css` tokenjei (`--space-*`, `--radius-*`, színek) már léteznek, de a 67 CSS-modul nagyrészt saját értékeket ír be. Ha egy skálára kerül minden, az oldal „egy kézből valónak” hat, és egy új blokk nem hoz be újabb eltéréseket.

Kiinduló mérés (audit 2026-11-11, `css-stats`):

| Tulajdonság | Különböző érték | Használat |
|---|---|---|
| `font-size` | 69 | 515 |
| `border-radius` | 45 | 332 |
| `box-shadow` | 75 | 99 |
| beírt szín (hex/rgba) | 328 | 1301 |
| `gap` | 66 | 489 |
| `transition` | 107 | 166 |
| `backdrop-filter` | 8 | 39 |

## Hatókör

- Típusskála kb. 8 lépésben (`--text-xs` … `--text-3xl`); a 0.8125, 0.85, 0.825 rem és a px-es értékek a legközelebbi lépésre kerülnek.
- Lekerekítés 4 lépésben + kapszula (`--radius-sm/md/lg/xl`, `--radius-pill`); beágyazott elem = szülő − belső margó.
- Árnyék 3 szintben (`--shadow-1/2/3`, puha, rétegzett).
- Színek: az ismétlődő rgba-k tokenné (`--gold-a10`, `--white-a60` …).
- Térköz: 4/8-as skála (a 6, 10, 14, 18 px-es rések a legközelebbi lépésre).
- Ellenőrzés: stylelint szabály (`declaration-property-value-disallowed-list` vagy saját szkript a `scripts/qa`-ban), ami jelzi az új beírt értékeket.

## Nem nyúlunk hozzá

- A látvány: a cél a pixelhű megtartás. Ahol egy lépésre kerekítés látható eltérést hoz, ott előtte/utána képpel kérdezünk.
- Arany mennyiség, asztali blokkmagasság (felhasználói döntések).

## Nyitott kérdések

- [x] Tulajdonságonként haladunk (betűméret → lekerekítés → árnyék → szín → térköz), minden lépés után előtte/utána mérés a négy oldalon (döntés 2026-11-11).
- [x] Az őr egyelőre QA-szkript (`scripts/qa/token-check.js`), a buildbe csak ha bevált (döntés 2026-11-11).
- [x] Látható lépések (döntés 2026-11-11): a 17/19/22 px-es szöveg a 16/18/20/24-es skálára; a szakaszcímek két szintre (`--text-h2` 28–40 px, `--text-h3` 20–28 px), a hero-címek és a nagy számok maradnak; sarkok 4/8/12/16/24 + kapszula, árnyék 3 szint (fényudvar, fókuszgyűrű külön); palettán kívüli színek: lila → arany, hőmérséklet-narancs → terrakotta, Material-zöld → `--color-green-light`.

## Kész, ha

Célszámok igazítva 2026-11-11 (felhasználói döntés): a ≤ 12 / ≤ 8 / ≤ 10 csak úgy lett volna elérhető, ha a hero-címekhez, a nagy számokhoz, a fényudvarokhoz és a fotók olvashatósági árnyékaihoz is hozzányúlunk, ezeket viszont szándékosan meghagytuk.

- [x] `token-check.js` újramérve: `font-size` ≤ 39, `border-radius` ≤ 37, `box-shadow` ≤ 56 különböző érték. A felület szövegei a 10 betűtokenből, a sarkok a 7 lekerekítés-tokenből, a mélységi árnyékok a 3 árnyéktokenből jönnek. A plafonok az őrben rögzítve vannak, csak lefelé mozdulhatnak.
- [x] Előtte/utána (`style-diff.js`): a láthatatlan lépések eltérése ≤ 0,4 px; a látható eltérések a jóváhagyott négy döntésből jönnek.
- [x] Az összes QA-szkript zöld (a clip-check csak az ismert /kutatas térképfeliratokon bukik), a `tsc` és a `lint` hibamentes.

## Eredmény

Kész 2026-11-11. A `checker` ellenőrizte a dev szerveren.

- **Tokenek** (`globals.css`):
  - betű: `--text-xs…3xl` (12–24 px), valamint `--text-h3` (20–28 px) és `--text-h2` (28–40 px);
  - lekerekítés: `--radius-sm/md/lg/xl/2xl` (4/8/12/16/24 px), `--radius-pill`, `--radius-round`;
  - árnyék: `--shadow-1/2/3`;
  - szín: `--color-accent-light` (#E07A5F) és `--color-green-text` (#7F9F70), szövegre sötét háttéren.
- **Láthatatlan lépések** (`style-diff`-fel ellenőrizve, eltérés ≤ 0,4 px):
  - 424 betűméret került tokenre;
  - 155 lekerekítés került tokenre;
  - 74 palettaszín lett `var(--color-*)`;
  - 379 térköz lett `--space-*`.
  - A `--space-4xl/5xl` 1600 px alatt kisebb, ezért a fix 96 és 128 px literál maradt.
- **Látható lépések** (jóváhagyva):
  - A 17/19/22 px-es szövegek a skálára kerültek.
  - A szakaszcímek két szintre kerültek, ezért az Alkalmazási útmutató címe 1440 px-en 32 → 40 px, a helyszínfejléc 44 → 40 px.
  - 64 sarok került a 12 px-es lépésre.
  - 51 árnyék került a 3 szintre. A fotók 1–2 px-es olvashatósági árnyékai visszaálltak, a diagramoszlopok az 1. szintre kerültek.
  - A lila Útmutató-mappa arany lett, a felirata „Guide” helyett „Útmutató”. A hőmérséklet-narancs terrakotta, a Material-zöld és -piros palettaszín lett.
- **Darabszámok:**
  - betűméret: 69 → 39;
  - lekerekítés: 45 → 37;
  - árnyék: 75 → 56;
  - beírt szín: 328 → 310.
  - A maradék: hero-címek és nagy számok, sarkonkénti kombinációk, 1–6 px-es apró sarkok, fényudvarok, gyűrűk és belső árnyékok.
- **Kontraszt:** a terrakotta szöveg 4,96–5,62:1. A zöld szöveg a `checker` mérése szerint 4,28:1 volt; a `--color-green-text` bevezetése után számítva 5,5:1 a legsötétebb kártyán.
- **Őr:** `scripts/qa/token-check.js` (plafonok) és `scripts/qa/style-diff.js` (számolt stílusok előtte/utána). Mindkettő bekerült a CLAUDE.md-be és a `scripts/qa` README-be.
- **Nyitva maradt:** a stylelint a buildbe csak később kerül, ha az őr beválik.
