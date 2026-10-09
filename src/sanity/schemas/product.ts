export const productSchema = {
  name: 'product',
  title: 'Prodotto',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome prodotto',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
    },
    {
      name: 'maison',
      title: 'Maison / Produttore',
      type: 'reference',
      to: [{ type: 'maison' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Champagne', value: 'champagne' },
          { title: 'Vino', value: 'vino' },
          { title: 'Gin', value: 'gin' },
          { title: 'Fine Food', value: 'fine-food' },
        ],
      },
    },
    {
      name: 'tag',
      title: 'Tag tipo (es. Champagne · Extra Brut)',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Immagine prodotto',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'imgStyle',
      title: 'Stile immagine',
      type: 'string',
      options: {
        list: [
          { title: 'Bottiglia (verticale, centrata)', value: 'bottle' },
          { title: 'Default (cover)', value: 'default' },
        ],
      },
      initialValue: 'bottle',
    },
    {
      name: 'meta',
      title: 'Meta info (volume, tipo, appellation…)',
      description: 'Es: ["75 cl", "Extra Brut", "Barbonne-Fayel"]',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'description',
      title: 'Descrizione breve (card)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'overlayDescription',
      title: 'Descrizione estesa (popup)',
      type: 'text',
      rows: 5,
    },
    {
      name: 'specs',
      title: 'Scheda tecnica',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Etichetta', type: 'string' },
            { name: 'value', title: 'Valore', type: 'string' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    },
    {
      name: 'sortOrder',
      title: 'Ordine nel catalogo',
      type: 'number',
    },
    {
      name: 'isAvailable',
      title: 'Disponibile',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'tag', media: 'image' },
  },
  orderings: [
    {
      title: 'Ordine catalogo',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
};
