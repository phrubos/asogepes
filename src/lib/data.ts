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

// Consequences data
export const consequences = [
  {
    title: 'Lassú felmelegedés',
    description: 'A tömör talaj nehezebben melegszik fel tavasszal, késleltetve a vetést',
    icon: 'clock',
  },
  {
    title: 'Rossz vízgazdálkodás',
    description: 'Az eketalp nem engedi át a vizet — pangóvíz vagy kiszáradás',
    icon: 'water',
  },
  {
    title: 'Gyökérfejlődés gátlása',
    description: '20 bar felett a gyökerek nem tudnak áthatolni a tömör rétegen',
    icon: 'root',
  },
  {
    title: 'Szervesanyag-vesztés',
    description: 'A forgatás oxidálja a talaj széntartalmát — fogy a humusz',
    icon: 'organic',
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
