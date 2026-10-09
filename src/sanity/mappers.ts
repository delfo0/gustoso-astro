import type { Product } from '../components/ProductCard.astro';

interface SanityProduct {
  name: string;
  tag: string;
  imageUrl?: string;
  meta?: string[];
  description?: string;
  overlayDescription?: string;
  specs?: Array<{ label: string; value: string }>;
  imgStyle?: 'bottle' | 'default';
}

export function mapProduct(p: SanityProduct): Product {
  return {
    img: p.imageUrl ?? '',
    tag: p.tag ?? '',
    name: p.name ?? '',
    meta: Array.isArray(p.meta) ? p.meta : (p.meta ? [p.meta as unknown as string] : []),
    desc: p.description ?? '',
    overlayDesc: p.overlayDescription ?? '',
    specs: (p.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
    imgStyle: p.imgStyle === 'bottle' ? 'bottle' : undefined,
  };
}

export const PRODUCT_FIELDS = `
  name, tag,
  "imageUrl": image.asset->url,
  meta, description, overlayDescription,
  specs[]{ label, value },
  imgStyle
`;
