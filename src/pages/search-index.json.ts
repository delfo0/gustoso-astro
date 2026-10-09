import type { APIRoute } from 'astro';
import { sanityClient } from '../sanity/client';

interface ProductRaw {
  _id: string;
  name: string;
  tag?: string;
  category?: 'champagne' | 'vino' | 'gin' | 'fine-food';
  description?: string;
  meta?: string[];
  imgUrl?: string | null;
  maisonName?: string | null;
  maisonSlug?: string | null;
}

interface MaisonRaw {
  _id: string;
  name: string;
  region?: string;
  tag?: string;
  description?: string;
  slug: string;
  logoUrl?: string | null;
  heroUrl?: string | null;
}

function hrefForProduct(p: ProductRaw): string {
  if (p.category === 'gin') return '/catalogo-gin';
  if (p.category === 'fine-food') return '/catalogo-fine-food';
  return p.maisonSlug ? `/catalogo-${p.maisonSlug}` : '/';
}

export const GET: APIRoute = async () => {
  const [products, maisons] = await Promise.all([
    sanityClient.fetch<ProductRaw[]>(`
      *[_type == "product"] | order(sortOrder asc) {
        _id, name, tag, category, description, meta,
        "imgUrl": image.asset->url,
        "maisonName": maison->name,
        "maisonSlug": maison->slug.current
      }
    `),
    sanityClient.fetch<MaisonRaw[]>(`
      *[_type == "maison"] | order(sortOrder asc) {
        _id, name, region, tag, description,
        "slug": slug.current,
        "logoUrl": logoImage.asset->url,
        "heroUrl": heroImage.asset->url
      }
    `),
  ]);

  const items = [
    ...products.map((p) => ({
      kind: 'product' as const,
      id: p._id,
      name: p.name,
      tag: p.tag ?? '',
      desc: p.description ?? '',
      meta: (p.meta ?? []).join(' '),
      img: p.imgUrl ?? '',
      maison: p.maisonName ?? '',
      href: hrefForProduct(p),
    })),
    ...maisons.map((m) => ({
      kind: 'maison' as const,
      id: m._id,
      name: m.name,
      tag: m.tag ?? '',
      desc: m.description ?? '',
      meta: m.region ?? '',
      img: m.heroUrl ?? m.logoUrl ?? '',
      maison: '',
      href: `/catalogo-${m.slug}`,
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
