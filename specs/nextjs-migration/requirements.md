# Next.js Migráció - Követelmények

## Projekt leírás
A statikus HTML/CSS/JS ásógép kutatás weboldal átalakítása Next.js 14 App Router alapú többoldalas alkalmazássá.

## Fő követelmények

### 1. Technológia
- Next.js 14 App Router
- TypeScript
- CSS Modules (meglévő CSS megtartása)
- Framer Motion animációkhoz
- Lucide React ikonokhoz

### 2. Oldal struktúra
A jelenlegi egyoldalas scrollozható elrendezés helyett külön oldalak:

| Route | Tartalom | Háttérszín |
|-------|----------|------------|
| `/` | Hero szekció | Cream + gradiens |
| `/problema` | 01 - A Probléma | Fehér |
| `/megoldas` | 02 - A Megoldás | Sötét (earth-800) |
| `/kiserlet` | 03 - A Kísérlet | Cream |
| `/eredmenyek` | 04 - Eredmények | Sötét (soil) |

### 3. Layout elemek
- **Navigation**: Minden oldalon, Link komponensekkel (nem scroll anchor)
- **Footer**: Minden oldalon (layout része)
- **Hero**: CSAK a főoldalon (`/`)

### 4. Dizájn megőrzése
- Minden CSS változó (`--color-*`, `--space-*`, `--font-*`) változatlan marad
- Minden komponens vizuálisan azonos a jelenlegivel
- Reszponzív breakpointok megtartása (1024px, 768px)
- Animációk megtartása Framer Motion-nel

### 5. Interaktív elemek
- **SoilInfographic**: Toggle a szántás szimulálására (már van React verzió: `inputs/soilgraph.tsx`)
- **LocationTabs**: Tab váltás a 3 kísérleti helyszín között
- **Chart animációk**: Bar chart animációk viewport belépéskor
- **Scroll animációk**: Fade-in elemek görgetéskor

### 6. Tartalom
- Minden szöveg magyar nyelvű marad
- Statikus adatok (helyszínek, mérések) TypeScript fájlba kerülnek

## Nem követelmény
- Unit tesztek
- E2E tesztek
- Backend/API
- CMS integráció
