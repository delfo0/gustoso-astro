export const catalogSchema = {
  name: 'catalog',
  title: 'Catalogo',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { source: 'title' },
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Gin', value: 'gin' },
          { title: 'Fine Food', value: 'fine-food' },
          { title: 'Vini (multi-maison)', value: 'vini' },
        ],
      },
    },
    {
      name: 'description',
      title: 'Descrizione SEO',
      type: 'text',
    },
    {
      name: 'brandmarkImage',
      title: 'Logo brandmark (header catalogo)',
      type: 'image',
    },
    {
      name: 'products',
      title: 'Prodotti (ordine manuale)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category' },
  },
};
