import type { Product } from '../components/ProductCard.astro';

export const products: Product[] = [
  {
    img: '/assets/products/gin/london-dry.webp',
    tag: 'London Dry',
    name: 'London Dry Super Premium',
    meta: ['70 cl', '43% vol'],
    desc: 'Quindici botaniche mediterranee, distillazione discontinua in alambicchi tradizionali. Profilo complesso, morbido e deciso.',
    overlayDesc: 'London Dry di produzione artigianale, elaborato con cura dal Master Distiller attraverso un processo di distillazione discontinua in alambicchi tradizionali appositamente modificati. Quindici botaniche mediterranee selezionate conferiscono un profilo olfattivo complesso e un gusto morbido e deciso allo stesso tempo. Il ginepro balcanico ne costituisce la spina dorsale, affiancato da note agrumate e una vena speziata di zenzero e liquirizia.',
    specs: [
      { label: 'Tipologia', value: 'London Dry Gin · Artigianale' },
      { label: 'Botaniche', value: '15 botaniche selezionate — Ginepro dei Balcani, Limone, Lime, Liquirizia, Zenzero e altre · Coltivazione naturale da produttori del Mediterraneo, lavorate manualmente' },
      { label: 'Produzione', value: 'Distillazione tradizionale in alambicchi a fuoco diretto, ciclo discontinuo · Contatto diretto delle botaniche nell\'alambicco' },
      { label: 'Gradazione', value: '43% Vol.' },
      { label: 'Servizio', value: 'Con tonica leggera, guarnito con limone o arancio · Ottimo liscio o on the rocks' },
    ],
  },
  {
    img: '/assets/products/gin/compound-gold.webp',
    tag: 'Compound',
    name: 'Compound Quality Gold',
    meta: ['70 cl', '43% vol'],
    desc: 'Infusione a freddo su ricetta antica. Colore dorato, sentori speziati, finale caldo di zenzero e pepe rosa.',
    overlayDesc: 'Gin dal carattere inconfondibile, ottenuto con la tecnica dell\'infusione a freddo (Cold Compound) a partire da una ricetta artigianale d\'ispirazione antica. Il colore dorato, i sentori speziati e il finale caldo e piccante di zenzero e pepe rosa lo rendono immediatamente riconoscibile. Otto botaniche bilanciate con precisione dal Master Distiller per un profilo di freschezza e piacevolezza difficilmente replicabile.',
    specs: [
      { label: 'Tipologia', value: 'Compound Gin · Artigianale' },
      { label: 'Botaniche', value: '8 botaniche selezionate — Zenzero, Pepe Rosa e altre · Ricetta artigianale antica rielaborata dal Master Distiller' },
      { label: 'Produzione', value: 'Tecnica Cold Compound (Bathtub Gin) · Infusione a freddo delle botaniche in spirito neutro' },
      { label: 'Gradazione', value: '43% Vol.' },
      { label: 'Servizio', value: 'Con tonica leggermente speziata o tonica classica · Ottimo liscio per apprezzare i sentori dorati e il finale piccante' },
    ],
  },
];
