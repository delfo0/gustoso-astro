import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '5u9flw4g',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: import.meta.env.SANITY_TOKEN,
});

export async function safeFetch<T>(query: string, fallback: T): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query);
  } catch (err) {
    console.error(`[sanity] fetch failed: ${(err as Error).message}\nquery: ${query.slice(0, 120)}...`);
    return fallback;
  }
}

export function imageUrl(ref: string): string {
  const withoutPrefix = ref.replace(/^image-/, '');
  const lastDash = withoutPrefix.lastIndexOf('-');
  const id = withoutPrefix.slice(0, lastDash);
  const format = withoutPrefix.slice(lastDash + 1);
  return `https://cdn.sanity.io/images/5u9flw4g/production/${id}.${format}`;
}
