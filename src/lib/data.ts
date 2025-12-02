// Location data for the experiment section
export const locations = {
  szentkiraly: {
    name: 'Szentkirály',
    crop: 'Vöröshagyma',
    soil: 'Réti csernozjom',
    ka: '28,5',
    irrigation: '350 mm',
    period: 'Március – Június',
    measurements: '4 alkalom',
    spade: {
      treatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        '38WX ásógép (30 cm + 55 cm lazítókés)',
      ],
    },
    control: {
      treatments: [
        'Őszi nehézkultivátor',
        'Tavaszi nehézkultivátor',
        'Kombinátor',
      ],
    },
    chartData: [
      { month: 'Március', spade: 35, control: 8 },
      { month: 'Április', spade: 30, control: 25 },
      { month: 'Május', spade: 22, control: 23 },
      { month: 'Június', spade: 17, control: 5 },
    ],
    highlight: {
      title: 'Látható különbség',
      text: 'A júniusi helyszíni bejáráson szemmel látható volt: az ásógépezett parcellán jelentősen kevesebb gyom fejlődött, mint a hagyományos művelésű területen.',
    },
  },
  kecskemet: {
    name: 'Kecskemét-Borbás',
    crop: 'Ipari paradicsom',
    soil: 'Réti csernozjom',
    ka: '28',
    irrigation: '400 mm',
    period: 'Május – Június',
    measurements: '2 alkalom',
    spade: {
      treatments: [
        'Őszi szántás (28 cm)',
        'Simítózás',
        'Ásóborona',
        '40SX mélyásógép (45 cm)',
      ],
    },
    control: {
      treatments: [
        'Őszi szántás (28 cm)',
        'Simítózás',
        'Ásóborona',
      ],
    },
    chartData: [
      { month: 'Május', spade: 40, control: 35 },
      { month: 'Június', spade: 37, control: 27 },
    ],
    callout: {
      number: '10 cm',
      text: 'különbség júniusban az ásógépezett parcella javára',
    },
    highlight: {
      title: 'Szembetűnő növekedési különbség',
      text: 'A júniusi fotón jól látható: az ásógépezett sorok paradicsomjai nagyobbak és fejlettebbek, mint a hagyományos művelésű terület növényei.',
    },
  },
  lakitelek: {
    name: 'Lakitelek',
    crop: 'Ipari paradicsom',
    soil: 'Humuszos homok',
    ka: '27',
    irrigation: '450 mm',
    period: 'Május – Augusztus',
    measurements: '7 különböző',
    parcels: [
      { num: 'I.', treatment: 'Mélyásógép (40 cm)', may: 33, aug: 31, change: -2, good: true },
      { num: 'II.', treatment: 'Lazítás + Ásógép (30 cm)', may: 35, aug: 28, change: -7, good: false },
      { num: 'III.', treatment: 'Ásógép (30 cm)', may: 22, aug: 20, change: -2, good: true },
      { num: 'IV.', treatment: 'Lazítás + Szántás + Kombinátor', may: 35, aug: 28, change: -7, good: false },
      { num: 'V.', treatment: 'Szántás + Kombinátor', may: 28, aug: 32, change: 4, good: true },
      { num: 'VI.', treatment: 'Lazítás + Szántás + Ásógép', may: 36, aug: 29, change: -7, good: false },
      { num: 'VII.', treatment: 'Szántás + Ásógép (25 cm)', may: 32, aug: 31, change: -1, good: true },
    ],
    multiChartData: [
      { label: 'I. Mélyásógép', may: 33, aug: 31 },
      { label: 'II. Lazítás+Ásógép', may: 35, aug: 28 },
      { label: 'III. Ásógép', may: 22, aug: 20 },
      { label: 'IV. Hagyományos+Lazítás', may: 35, aug: 28 },
      { label: 'V. Hagyományos', may: 28, aug: 32 },
      { label: 'VI. Mindent kombináció', may: 36, aug: 29 },
      { label: 'VII. Szántás+Ásógép', may: 32, aug: 31 },
    ],
  },
}

// Key findings for results section
export const findings = [
  {
    number: '01',
    title: 'Tartósabb lazaság',
    text: 'Az ásógépezett parcellák 5-10 cm-rel mélyebben maradtak lazák a teljes tenyészidőszak alatt, még 400-450 mm öntözővíz kijuttatása után is.',
  },
  {
    number: '02',
    title: 'Gyorsabb felmelegedés',
    text: 'A tavaszi mérések során az ásógépezett talaj 2-4°C-kal melegebb volt — a 2025-ös hideg tavasz miatt ez különösen fontos volt.',
  },
  {
    number: '03',
    title: 'Jobb vízgazdálkodás',
    text: 'Az ásógépezett parcellákban a víz egyenletesebben oszlott el a talajszelvényben, mélyebb rétegekbe is lejutott.',
  },
  {
    number: '04',
    title: 'Látható növényfejlődés',
    text: 'A paradicsom és hagyma állományok szemmel láthatóan fejlettebbek voltak az ásógépezett területeken.',
  },
]

// Hero statistics
export const heroStats = [
  { number: '3', label: 'Helyszín', sublabel: 'Szentkirály · Kecskemét · Lakitelek' },
  { number: '4', label: 'Hónap', sublabel: 'Március – Június' },
]

// Tab 1: A Tömörödés Problémája
export const compactionChallenges = [
  {
    title: 'Gyakori öntözés hatása',
    description: 'Intenzív öntözéses kertészeti kultúrákban 4-7 naponként 30-50 mm víz kijuttatása történik, ami fokozatosan tömöríti a talajt.',
    icon: 'droplet',
    data: '350-450 mm/szezon',
  },
  {
    title: 'Gépek taposása',
    description: 'Nehéz öntözőberendezések, traktorok és betakarító gépek rendszeres áthaladása tömöríti a felső talajréteget.',
    icon: 'weight',
    data: 'Folyamatos terhelés',
  },
  {
    title: 'Szerkezetromlás üteme',
    description: 'A szántott talajon már 30 nap alatt 20-50%-os szerkezetromlás mérhető intenzív öntözés mellett.',
    icon: 'layers',
    data: '30 nap alatt kritikus',
  },
]

// Tab 2: Miért nem elég a szántás?
export const ploughingProblems = [
  {
    title: 'Eketalp képződés',
    description: 'A szántás 25-30 cm mélységben tömör réteget (eketalpat) gyúr, ami akadályozza a gyökerek és a víz mélyebb behatolását.',
    icon: 'layers',
    dataBadge: '20+ bar nyomás',
    source: 'Szakdolgozat 7. oldal',
  },
  {
    title: 'Rétegek felcserélése',
    description: 'A forgatás során az aerob (oxigéndús) és anaerob (oxigénszegény) rétegek felcserélődnek, ami károsítja a talajéletet.',
    icon: 'activity',
    dataBadge: 'Talajélet károsodás',
    source: 'Szakdolgozat 7. oldal',
  },
  {
    title: 'Széntartalom oxidálódása',
    description: 'A forgatás hatására a mélyebb rétegek szerves anyaga a felszínre kerül és gyorsabban oxidálódik, csökkentve a humusztartalmat.',
    icon: 'leaf',
    dataBadge: 'Humusz veszteség',
    source: 'Szakdolgozat 7. oldal',
  },
  {
    title: 'Lassú felmelegedés',
    description: 'A tömör talajszerkezet rosszabbul vezeti a hőt, így tavasszal lassabban melegszik fel — a 2025-ös hideg tavasz során ez 2-4°C különbséget jelentett.',
    icon: 'thermometer',
    dataBadge: '2-4°C különbség',
    source: '14., 16. ábra',
  },
]

// Legacy alias for backward compatibility
export const irrigationChallenges = compactionChallenges

// Problem statistics
export const problemStatistics = {
  irrigation: {
    min: 350,
    max: 450,
    unit: 'mm',
    label: 'Öntözővíz / szezon',
  },
  frequency: {
    min: 4,
    max: 7,
    unit: 'nap',
    label: 'Öntözési gyakoriság',
  },
}

// Consequences data
export const consequences = [
  {
    title: 'Gyors tömörödés',
    description: 'Szántott talajon 30 nap alatt 20-50%-os szerkezetromlás intenzív öntözés mellett',
    icon: 'compress',
    dataBadge: 'Szentkirály: 35cm → 5cm',
    source: '13. ábra, 32. oldal',
  },
  {
    title: 'Biológiai élet károsodása',
    description: 'A forgatás során az aerob és anaerob rétegek felcserélése károsítja a talajéletet',
    icon: 'activity',
    dataBadge: 'Széntartalom oxidálódása',
    source: '7. oldal',
  },
  {
    title: 'Lassú tavaszi felmelegedés',
    description: 'Tömör talajszerkezet → késleltetett növényfejlődés. 2025 hideg tavaszán kritikus volt.',
    icon: 'thermometer',
    dataBadge: '2-4°C különbség',
    source: '14., 16. ábra',
  },
  {
    title: 'Nem egyenletes vízgazdálkodás',
    description: 'A tömör rétegek akadályozzák a víz egyenletes eloszlását a talajban',
    icon: 'droplet',
    dataBadge: 'Pangóvíz ÉS kiszáradás',
    source: '11., 17. ábra',
  },
]

// Benefits data
export const benefits = [
  { title: 'Nincs eketalp', description: 'Nem gyúr tömör réteget a művelt zóna alá' },
  { title: 'Megmarad a talajélet', description: 'A mikroorganizmusok a helyükön maradnak' },
  { title: 'Gyorsabb felmelegedés', description: 'Nagyobb pórustérfogat = jobb hővezetés' },
  { title: 'Egyenletes felszín', description: 'Nincs barázda, azonnal vethető' },
]

// Machine types
export const machineTypes = [
  { badge: 'Nagy szériás', name: '38SX', depth: '15-35 cm munkamélység', featured: false },
  { badge: 'Lazítókéses', name: '38WX', depth: '35 cm + 55 cm lazítás', featured: false },
  { badge: 'Mélyásógép', name: '40SX', depth: '20-50 cm munkamélység', featured: true },
]

// Alkalmazási módok - ásógép önmagában vs. kombinációban
export const applicationModes = [
  {
    id: 'solo',
    title: 'Önálló ásógép',
    description: 'Csak ásógéppel végzett művelés, más eszköz nélkül',
    when: 'Jó szerkezetű, nem túl tömör talajokon',
    depth: '30-45 cm',
    result: 'Stabil lazaság (-2 cm változás)',
    examples: ['Lakitelek I. parcella (Mélyásógép)', 'Lakitelek III. parcella (Ásógép 30cm)'],
    rating: 4,
    icon: 'spade',
  },
  {
    id: 'with-loosening',
    title: 'Lazítás + Ásógép',
    description: 'Előzetes mélylazítás után ásógépes művelés',
    when: 'Nagyon tömör, mély eketalpas talajokon',
    depth: '55 cm lazítás + 30 cm ásógép',
    result: 'Nagyobb kezdeti lazaság, de gyorsabb tömörödés (-7 cm)',
    examples: ['Lakitelek II. parcella', 'Szentkirály 38WX kezelés'],
    rating: 3,
    icon: 'layers',
  },
  {
    id: 'with-ploughing',
    title: 'Szántás + Ásógép',
    description: 'Őszi szántás után tavaszi ásógépes művelés',
    when: 'Hagyományos gazdálkodásba illeszkedve',
    depth: '28 cm szántás + 25 cm ásógép',
    result: 'Legjobb stabilitás (-1 cm változás)',
    examples: ['Lakitelek VII. parcella', 'Kecskemét-Borbás kezelés'],
    rating: 5,
    icon: 'combine',
  },
]

// Összehasonlító táblázat a kísérletekből
export const treatmentComparison = [
  { treatment: 'Mélyásógép (40 cm)', initial: 33, final: 31, change: -2, stable: true },
  { treatment: 'Ásógép (30 cm)', initial: 22, final: 20, change: -2, stable: true },
  { treatment: 'Szántás + Ásógép', initial: 32, final: 31, change: -1, stable: true },
  { treatment: 'Lazítás + Ásógép', initial: 35, final: 28, change: -7, stable: false },
  { treatment: 'Lazítás + Szántás + Kombinátor', initial: 35, final: 28, change: -7, stable: false },
  { treatment: 'Csak szántás + Kombinátor', initial: 28, final: 32, change: 4, stable: true },
]
