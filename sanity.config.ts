import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { maisonSchema, productSchema, catalogSchema } from './src/sanity/schemas';

const champagneSpecs = [
  { _key: 'tipologia',    label: 'Tipologia',    value: '' },
  { _key: 'vitigno',      label: 'Vitigno',      value: '' },
  { _key: 'terroir',      label: 'Terroir',      value: '' },
  { _key: 'vinificazione',label: 'Vinificazione',value: '' },
  { _key: 'affinamento',  label: 'Affinamento',  value: '' },
  { _key: 'dosaggio',     label: 'Dosaggio',     value: '' },
  { _key: 'servizio',     label: 'Servizio',     value: '' },
];

const vinoSpecs = [
  { _key: 'tipologia',    label: 'Tipologia',    value: '' },
  { _key: 'vitigno',      label: 'Vitigno',      value: '' },
  { _key: 'terroir',      label: 'Terroir',      value: '' },
  { _key: 'vinificazione',label: 'Vinificazione',value: '' },
  { _key: 'affinamento',  label: 'Affinamento',  value: '' },
  { _key: 'annata',       label: 'Annata',       value: '' },
  { _key: 'servizio',     label: 'Servizio',     value: '' },
];

const ginSpecs = [
  { _key: 'tipologia',   label: 'Tipologia',   value: '' },
  { _key: 'botaniche',   label: 'Botaniche',   value: '' },
  { _key: 'produzione',  label: 'Produzione',  value: '' },
  { _key: 'gradazione',  label: 'Gradazione',  value: '' },
  { _key: 'servizio',    label: 'Servizio',    value: '' },
];

const fineFoodSpecs = [
  { _key: 'specie',     label: 'Specie',     value: '' },
  { _key: 'produzione', label: 'Produzione', value: '' },
  { _key: 'affinamento',label: 'Affinamento',value: '' },
  { _key: 'grani',      label: 'Grani',      value: '' },
  { _key: 'formati',    label: 'Formati',    value: '' },
];

export default defineConfig({
  name: 'gustoso',
  title: 'Gustoso CMS',

  projectId: '5u9flw4g',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenuti')
          .items([
            S.listItem()
              .title('Maison')
              .schemaType('maison')
              .child(S.documentTypeList('maison').title('Maison')),
            S.divider(),
            S.listItem()
              .title('Champagne / Vini Bianchi')
              .icon(() => '🍾')
              .child(
                S.documentTypeList('product')
                  .title('Champagne / Vini')
                  .filter('_type == "product" && category in ["champagne","vino"]')
                  .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
              ),
            S.listItem()
              .title('Gin')
              .icon(() => '🌿')
              .child(
                S.documentTypeList('product')
                  .title('Gin')
                  .filter('_type == "product" && category == "gin"')
                  .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
              ),
            S.listItem()
              .title('Fine Food')
              .icon(() => '🫧')
              .child(
                S.documentTypeList('product')
                  .title('Fine Food')
                  .filter('_type == "product" && category == "fine-food"')
                  .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
              ),
            S.divider(),
            S.listItem()
              .title('Tutti i prodotti')
              .schemaType('product')
              .child(S.documentTypeList('product').title('Tutti i prodotti')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: [maisonSchema, productSchema, catalogSchema],
  },

  templates: (prev) => [
    ...prev.filter((t) => t.schemaType !== 'product'),
    {
      id: 'product-champagne',
      title: 'Champagne / Sparkling',
      schemaType: 'product',
      value: { category: 'champagne', imgStyle: 'bottle', specs: champagneSpecs },
    },
    {
      id: 'product-vino',
      title: 'Vino fermo (Languedoc, Borgogna…)',
      schemaType: 'product',
      value: { category: 'vino', imgStyle: 'bottle', specs: vinoSpecs },
    },
    {
      id: 'product-gin',
      title: 'Gin',
      schemaType: 'product',
      value: { category: 'gin', specs: ginSpecs },
    },
    {
      id: 'product-fine-food',
      title: 'Fine Food / Caviale',
      schemaType: 'product',
      value: { category: 'fine-food', specs: fineFoodSpecs },
    },
  ],
});
