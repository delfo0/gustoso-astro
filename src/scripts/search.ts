import MiniSearch from 'minisearch';
import type { SearchItem } from '../types/search';

type SearchHit = SearchItem & {
  id: string | number;
  score: number;
  terms: string[];
  queryTerms: string[];
};

const OVERLAY_HTML = `
<div class="search-overlay" id="search-overlay" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Ricerca prodotti">
  <div class="search-backdrop" id="search-backdrop"></div>
  <div class="search-panel">
    <div class="search-header">
      <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="search" id="search-input" class="search-input" placeholder="Cerca prodotto, maison, territorio…" autocomplete="off" spellcheck="false" aria-label="Cerca prodotti" aria-controls="search-results" aria-autocomplete="list" />
      <button class="search-kbd" id="search-close-btn" type="button" aria-label="Chiudi ricerca"><kbd>Esc</kbd></button>
    </div>
    <div class="search-results" id="search-results" role="listbox" aria-label="Risultati ricerca">
      <p class="search-empty">Inizia a digitare per cercare tra i prodotti.</p>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', OVERLAY_HTML);

const overlay  = document.getElementById('search-overlay')!;
const backdrop = document.getElementById('search-backdrop')!;
const input    = document.getElementById('search-input') as HTMLInputElement;
const results  = document.getElementById('search-results')!;
const closeBtn = document.getElementById('search-close-btn')!;
const searchBtn = document.getElementById('nav-search');

let mini: MiniSearch<SearchItem> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let gaTimer: ReturnType<typeof setTimeout> | null = null;
let selectedIdx = -1;
const MAX_RESULTS_PER_KIND = 8;

function trackSearch(query: string, count: number) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g !== 'function') return;
  g('event', 'search', { search_term: query, results_count: count });
}

async function ensureIndex(): Promise<void> {
  if (mini) return;
  results.innerHTML = '<p class="search-empty">Caricamento…</p>';
  try {
    const res = await fetch('/search-index.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items: SearchItem[] = await res.json();
    mini = new MiniSearch<SearchItem>({
      idField: 'id',
      fields: ['name', 'tag', 'maison', 'meta', 'desc'],
      storeFields: ['kind', 'name', 'tag', 'desc', 'img', 'maison', 'href', 'meta'],
      searchOptions: {
        boost: { name: 3, tag: 2, maison: 2, meta: 1.2 },
        fuzzy: 0.2,
        prefix: true,
        combineWith: 'AND',
      },
    });
    mini.addAll(items);
    showPrompt();
  } catch {
    results.innerHTML = `<p class="search-empty">Errore nel caricamento. <button class="search-retry" id="search-retry" type="button">Riprova</button></p>`;
    document.getElementById('search-retry')?.addEventListener('click', () => {
      mini = null;
      ensureIndex();
    });
  }
}

function openSearch() {
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('search-open');
  selectedIdx = -1;
  setTimeout(() => input.focus(), 60);
  ensureIndex();
}

function closeSearch() {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('search-open');
  input.value = '';
  selectedIdx = -1;
  input.removeAttribute('aria-activedescendant');
  showPrompt();
}

function showPrompt() {
  results.innerHTML = '<p class="search-empty">Inizia a digitare per cercare tra i prodotti.</p>';
}

function showNoResults(q: string) {
  results.innerHTML = `<p class="search-empty">Nessun risultato per «${escHtml(q)}».<br><span class="search-empty-hint">Prova con il nome del prodotto, la maison o il territorio.</span></p>`;
}

function escHtml(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function hl(text: string, q: string): string {
  if (!q || !text) return escHtml(text || '');
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escHtml(text).replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>');
}

function getItems(): HTMLElement[] {
  return Array.from(results.querySelectorAll<HTMLElement>('.search-result-item'));
}

function setSelected(idx: number) {
  const items = getItems();
  const clamped = Math.max(-1, Math.min(idx, items.length - 1));
  items.forEach((item, i) => {
    const active = i === clamped;
    item.classList.toggle('is-selected', active);
    item.setAttribute('aria-selected', active ? 'true' : 'false');
    if (active) item.scrollIntoView({ block: 'nearest' });
  });
  selectedIdx = clamped;
  if (selectedIdx >= 0) {
    input.setAttribute('aria-activedescendant', `sr-${selectedIdx}`);
  } else {
    input.removeAttribute('aria-activedescendant');
  }
}

function renderProductCard(h: SearchHit, idx: number, q: string): string {
  const href = h.href + '#open:' + encodeURIComponent(h.name);
  const imgStyle = h.img ? ` style="background-image:url('${h.img}')"` : '';
  return `<a class="search-result-item" href="${href}" id="sr-${idx}" role="option" aria-selected="false">
    <div class="search-result-img"${imgStyle}></div>
    <div class="search-result-body">
      <p class="search-result-name">${hl(h.name, q)}</p>
      <span class="search-result-meta">
        ${h.tag ? `<span class="search-result-tag">${hl(h.tag, q)}</span>` : ''}
        ${hl(h.maison, q)}
      </span>
    </div>
  </a>`;
}

function renderMaisonCard(h: SearchHit, idx: number, q: string): string {
  const imgStyle = h.img ? ` style="background-image:url('${h.img}')"` : '';
  const subtitle = [h.tag ? hl(h.tag, q) : '', h.meta ? hl(h.meta, q) : ''].filter(Boolean).join(' · ');
  return `<a class="search-result-item search-result-item--maison" href="${h.href}" id="sr-${idx}" role="option" aria-selected="false">
    <div class="search-result-img"${imgStyle}></div>
    <div class="search-result-body">
      <p class="search-result-name">${hl(h.name, q)} <span class="search-result-badge">Maison</span></p>
      <span class="search-result-meta">${subtitle}</span>
    </div>
  </a>`;
}

function doSearch(raw: string) {
  if (!mini) return;
  selectedIdx = -1;
  input.removeAttribute('aria-activedescendant');

  const q = raw.trim();
  if (q.length < 2) { showPrompt(); return; }

  const hits = mini.search(q) as SearchHit[];
  const maisonHits = hits.filter(h => h.kind === 'maison').slice(0, MAX_RESULTS_PER_KIND);
  const productHits = hits.filter(h => h.kind === 'product').slice(0, MAX_RESULTS_PER_KIND);

  if (!hits.length) { showNoResults(q); return; }

  if (gaTimer) clearTimeout(gaTimer);
  gaTimer = setTimeout(() => trackSearch(q, hits.length), 1500);

  let html = '';
  let idx = 0;
  const hasBoth = maisonHits.length > 0 && productHits.length > 0;

  if (maisonHits.length > 0) {
    if (hasBoth) html += '<p class="search-section-label">Maison</p>';
    html += maisonHits.map(h => renderMaisonCard(h, idx++, q)).join('');
  }
  if (productHits.length > 0) {
    if (hasBoth) html += '<p class="search-section-label">Prodotti</p>';
    html += productHits.map(h => renderProductCard(h, idx++, q)).join('');
  }

  const shown = maisonHits.length + productHits.length;
  const total = hits.length;
  const more = total > shown ? ` di ${total}` : '';
  const countTxt = `${shown}${more} risultat${shown === 1 ? 'o' : 'i'}`;
  results.innerHTML = `<p class="search-count" aria-live="polite" aria-atomic="true">${countTxt}</p>${html}`;

  results.querySelectorAll('.search-result-item').forEach(a => {
    a.addEventListener('click', closeSearch);
  });
}

if (searchBtn) searchBtn.addEventListener('click', openSearch);
backdrop.addEventListener('click', closeSearch);
closeBtn.addEventListener('click', closeSearch);

input.addEventListener('input', () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => doSearch(input.value), 160);
});

document.addEventListener('keydown', (e) => {
  const isOpen = overlay.classList.contains('is-open');

  if (!isOpen) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    return;
  }

  if (e.key === 'Escape') { e.preventDefault(); closeSearch(); return; }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); closeSearch(); return; }

  const items = getItems();
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setSelected(selectedIdx + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (selectedIdx <= 0) { setSelected(-1); input.focus(); }
    else setSelected(selectedIdx - 1);
  } else if (e.key === 'Enter' && selectedIdx >= 0) {
    e.preventDefault();
    items[selectedIdx]?.click();
  }
});
