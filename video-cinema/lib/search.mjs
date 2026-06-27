import { toPublicId } from './sites.mjs';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** @param {string} title @param {string} keyword */
export function searchRelevanceScore(title, keyword) {
  if (!title || !keyword) return 0;
  const t = title.toLowerCase().replace(/\s+/g, '');
  const k = keyword.toLowerCase().replace(/\s+/g, '');
  if (!k) return 0;
  if (t === k) return 120;
  if (t.includes(k)) return 100;
  if (title.includes(keyword)) return 95;

  let ti = 0;
  let matched = 0;
  for (const c of k) {
    const next = t.indexOf(c, ti);
    if (next === -1) break;
    matched++;
    ti = next + 1;
  }
  if (matched === k.length) return 40 + Math.min(20, matched);
  if (matched >= Math.ceil(k.length * 0.6)) return 15;
  return 0;
}

/** @param {Array<Record<string, unknown>>} items @param {string} keyword */
export function rankSearchItems(items, keyword) {
  const scored = items.map((item) => ({
    ...item,
    _score: searchRelevanceScore(String(item.title || ''), keyword),
  }));
  scored.sort((a, b) => b._score - a._score);
  const hasStrong = scored.some((i) => i._score >= 80);
  const filtered = hasStrong ? scored.filter((i) => i._score >= 15) : scored;
  return filtered.map(({ _score, ...item }) => item);
}

/** @param {import('./sites.mjs').SiteConfig} site @param {string} keyword */
export async function fetchAjaxSuggest(site, keyword) {
  const url = `${site.base}/index.php/ajax/suggest?mid=1&wd=${encodeURIComponent(keyword)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Referer: `${site.base}/`,
      Accept: 'application/json, text/plain, */*',
    },
  });
  const text = await res.text();
  if (!text.trim().startsWith('{')) return [];
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return [];
  }
  if (data.code !== 1 || !Array.isArray(data.list)) return [];

  return data.list.map((item) => ({
    id: toPublicId(site, Number(item.id)),
    title: String(item.name || '').trim(),
    poster: item.pic || '',
    status: '正片',
    director: '内详',
    actors: ['内详'],
    subCategory: '',
    area: '',
    year: new Date().getFullYear(),
    playSid: 1,
    playNid: 1,
    source: true,
    sourceSite: site.key,
    fromAjax: true,
  }));
}
