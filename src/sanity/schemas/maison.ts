export const maisonSchema = {
  name: 'maison',
  title: 'Maison',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'number',
      title: 'N° (es. 01)',
      type: 'string',
    },
    {
      name: 'tag',
      title: 'Tag categoria (es. Champagne, Linguadoca)',
      type: 'string',
    },
    {
      name: 'region',
      title: 'Regione (es. Sézannais · AOC)',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Descrizione breve (card)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'heroImage',
      title: 'Immagine hero (catalog card)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'logoImage',
      title: 'Logo partner (ribbon + brandmark)',
      type: 'image',
    },
    {
      name: 'catalogSlug',
      title: 'Slug pagina catalogo',
      description: 'es. "aubert-mathieu" → /catalogo-aubert-mathieu',
      type: 'string',
    },
    {
      name: 'sortOrder',
      title: 'Ordine visualizzazione',
      type: 'number',
    },
  ],
  preview: {
    select: { title: 'name', media: 'heroImage' },
  },
};
