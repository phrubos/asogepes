# Implementation Plan - Megoldás Oldal Modell-Alapú Szekciók

## Fázisok

### Fázis 1: Adatstruktúra Frissítése
**Fájl:** `src/lib/data.ts`

1. Új `modelDetails` objektum létrehozása a 3 modell adataival
2. Minden modellhez:
   - Alapadatok (id, name, type, image)
   - Műszaki specifikációk (depth, power, features)
   - Terep alkalmazási adatok (location, crop, soil, treatments, results)
   - Highlight/megállapítás

---

### Fázis 2: Hero Navigációs Gombok Módosítása
**Fájl:** `src/components/solution-v2/SolutionLayout.tsx`

1. 2 gomb helyett 3 gomb
2. Gombok tartalma:
   - Modell neve (38SX, 38WX, 40SX)
   - Típus badge (Nagy szériás, Lazítókéses, Mélyásógép)
   - Modell képe háttérként
3. ScrollToSection frissítése az új anchor ID-kkal

---

### Fázis 3: Stílusok Frissítése
**Fájl:** `src/components/solution-v2/SolutionNew.module.css`

1. 3 gombos elrendezés (lépcsőzetes desktop-on)
2. Responsive: mobil-on egymás alatt
3. Gomb stílusok finomhangolása

---

### Fázis 4: Új ModelSection Komponens
**Új fájlok:**
- `src/components/solution-v2/ModelSection.tsx`
- `src/components/solution-v2/ModelSection.module.css`

**Komponens felépítése:**
```
ModelSection
├── SectionHeader (modell neve + badge)
├── TopGrid
│   ├── ImageContainer (modell kép)
│   └── SpecsCard (műszaki adatok)
├── FieldApplicationCard
│   ├── LocationInfo (helyszín, kultúra, talaj, öntözés)
│   ├── TreatmentsGrid (kezelések és eredmények)
│   └── HighlightBox (főbb megállapítás)
```

---

### Fázis 5: Oldal Frissítése
**Fájl:** `src/app/megoldas/page.tsx`

1. Régi komponensek eltávolítása (MachineBlueprint, BenefitsGrid, ModelComparison)
2. 3 ModelSection beillesztése
3. Scroll anchor ID-k beállítása

---

## Részletes Implementáció

### 1. data.ts Módosítások

```typescript
// Új export hozzáadása a fájl végéhez
export const modelDetails = {
  '38sx': {
    id: '38sx',
    name: '38SX',
    type: 'Nagy szériás',
    typeEn: 'Standard Spader',
    image: '/images/38SX.png',
    specs: {
      depth: '15-35 cm',
      power: '80-150 LE',
      features: ['Kompakt felépítés', 'Költséghatékony', 'Könnyű karbantartás']
    },
    fieldApplication: {
      location: 'Lakitelek',
      parcels: 'III., VII. parcella',
      crop: 'Ipari paradicsom',
      soil: 'Humuszos homok',
      ka: '27',
      irrigation: '450 mm',
      period: 'Május – Augusztus',
      treatments: [
        {
          parcel: 'III.',
          description: 'Ásógép (30 cm) önállóan',
          initial: 22,
          final: 20,
          change: -2,
          stable: true,
          best: false
        },
        {
          parcel: 'VII.',
          description: 'Szántás + Ásógép (25 cm)',
          initial: 32,
          final: 31,
          change: -1,
          stable: true,
          best: true
        }
      ],
      highlight: {
        title: 'Legjobb stabilitás',
        text: 'A szántás + ásógép kombináció (VII. parcella) adta a legjobb stabilitást (-1 cm változás), míg az önálló ásógép is kiváló eredményt hozott.'
      }
    }
  },
  '38wx': {
    id: '38wx',
    name: '38WX',
    type: 'Lazítókéses',
    typeEn: 'Spader with Subsoiler',
    image: '/images/38WX.png',
    specs: {
      depth: '35 cm + 55 cm lazítás',
      power: '100-180 LE',
      features: ['Dupla működési mélység', 'Mélylazító kések', 'Tömör talajokra']
    },
    fieldApplication: {
      location: 'Szentkirály',
      crop: 'Vöröshagyma',
      soil: 'Réti csernozjom',
      ka: '28,5',
      irrigation: '350 mm',
      period: 'Március – Június',
      measurements: '4 alkalom',
      spadetreatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        '38WX ásógép (30 cm + 55 cm lazítókés)'
      ],
      controlTreatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        'Kombinátor'
      ],
      chartData: [
        { month: 'Március', spade: 35, control: 8 },
        { month: 'Április', spade: 30, control: 25 },
        { month: 'Május', spade: 22, control: 23 },
        { month: 'Június', spade: 17, control: 5 }
      ],
      highlight: {
        title: 'Látható különbség',
        text: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.'
      }
    }
  },
  '40sx': {
    id: '40sx',
    name: '40SX',
    type: 'Mélyásógép',
    typeEn: 'Heavy Duty Spader',
    image: '/images/40SX.png',
    specs: {
      depth: '20-50 cm',
      power: '100-250 LE',
      features: ['Dupla rotor rendszer', 'Automata kenés', 'Beépített kővédelem']
    },
    fieldApplication: {
      locations: [
        {
          name: 'Kecskemét-Borbás',
          crop: 'Ipari paradicsom',
          soil: 'Réti csernozjom',
          ka: '28',
          irrigation: '400 mm',
          period: 'Május – Június',
          spadeTreatments: [
            'Őszi szántás (28 cm)',
            'Simítózás',
            'Ásóborona',
            '40SX mélyásógép (45 cm)'
          ],
          chartData: [
            { month: 'Május', spade: 40, control: 35 },
            { month: 'Június', spade: 37, control: 27 }
          ],
          callout: {
            number: '10 cm',
            text: 'különbség júniusban az ásógépezett parcella javára'
          }
        },
        {
          name: 'Lakitelek I. parcella',
          crop: 'Ipari paradicsom',
          soil: 'Humuszos homok',
          ka: '27',
          treatment: 'Mélyásógép (40 cm) önállóan',
          initial: 33,
          final: 31,
          change: -2,
          stable: true
        }
      ],
      highlight: {
        title: 'Szembetűnő növekedési különbség',
        text: 'A júniusi fotón jól látható: az ásógépezett sorok paradicsomjai nagyobbak és fejlettebbek, mint a hagyományos művelésű terület növényei.'
      }
    }
  }
}
```

---

### 2. SolutionLayout.tsx Módosítások

**Változtatások:**
- `navButtons` div 3 gombot tartalmaz
- Minden gomb a megfelelő modell szekcióra mutat
- Gomb képek frissítése a modell képekre

```tsx
// Navigációs gombok adatai
const navButtons = [
  { id: 'model-38sx', name: '38SX', type: 'Nagy szériás', image: '/images/38SX.png' },
  { id: 'model-38wx', name: '38WX', type: 'Lazítókéses', image: '/images/38WX.png' },
  { id: 'model-40sx', name: '40SX', type: 'Mélyásógép', image: '/images/40SX.png' },
]
```

---

### 3. ModelSection.tsx Struktúra

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Leaf, Layers, Droplets, Calendar, CheckCircle2, Lightbulb } from 'lucide-react'
import { modelDetails } from '@/lib/data'
import styles from './ModelSection.module.css'

interface ModelSectionProps {
  modelId: '38sx' | '38wx' | '40sx'
}

export default function ModelSection({ modelId }: ModelSectionProps) {
  const model = modelDetails[modelId]
  
  return (
    <section className={styles.section} id={`model-${modelId}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{model.name}</h2>
        <span className={styles.badge}>{model.type}</span>
      </div>

      {/* Top Grid: Image + Specs */}
      <div className={styles.topGrid}>
        <div className={styles.imageContainer}>
          <Image src={model.image} alt={model.name} width={500} height={400} />
        </div>
        <div className={styles.specsCard}>
          {/* Műszaki adatok */}
        </div>
      </div>

      {/* Field Application */}
      <div className={styles.fieldCard}>
        {/* Terepen Alkalmazva */}
      </div>

      {/* Highlight */}
      <div className={styles.highlightBox}>
        {/* Főbb Megállapítás */}
      </div>
    </section>
  )
}
```

---

### 4. page.tsx Frissítés

```tsx
import SolutionLayout from '@/components/solution-v2/SolutionLayout'
import ModelSection from '@/components/solution-v2/ModelSection'

export default function MegoldasPage() {
  return (
    <SolutionLayout>
      <ModelSection modelId="38sx" />
      <ModelSection modelId="38wx" />
      <ModelSection modelId="40sx" />
    </SolutionLayout>
  )
}
```

---

## Végrehajtási Sorrend

1. ✅ `data.ts` - modelDetails hozzáadása
2. ✅ `ModelSection.tsx` + `ModelSection.module.css` - új komponens
3. ✅ `SolutionLayout.tsx` - 3 navigációs gomb
4. ✅ `SolutionNew.module.css` - 3 gombos layout stílusok
5. ✅ `page.tsx` - komponensek cseréje

---

## Tesztelés

```bash
npm run dev
# Navigálj: http://localhost:3000/megoldas
# Ellenőrizd:
# - 3 gomb megjelenik
# - Scroll működik
# - Szekciók tartalma helyes
# - Responzív viselkedés
```
