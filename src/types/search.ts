export interface SearchItem {
  kind: 'product' | 'maison';
  id: string;
  name: string;
  tag: string;
  desc: string;
  meta: string;
  img: string;
  maison: string;
  href: string;
}
