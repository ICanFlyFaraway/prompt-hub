import { toPublicId } from './sites.mjs';

const UA_DECODE = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

/** @param {string} url @param {import('./sites.mjs').SiteConfig} site */
export function absUrl(url, site) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `${site.base}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** @param {string} html @param {import('./sites.mjs').SiteConfig} site */
export function parseUotxfList(html, site) {
  const items = [];
  const seen = new Set();
  const re = /href="\/voddetail\/(\d+)\.html"[^>]*title="([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const localId = Number(m[1]);
    if (seen.has(localId)) continue;
    seen.add(localId);
    const posterRe = new RegExp(
      `voddetail/${localId}\\.html[^>]*data-background="([^"]+)"`,
      'i',
    );
    const posterM = html.match(posterRe);
    items.push({
      id: toPublicId(site, localId),
      title: UA_DECODE(m[2]),
      poster: posterM ? posterM[1] : '',
      status: '更新中',
      actors: [],
      rating: 7,
      source: true,
      sourceSite: site.key,
    });
  }
  return items;
}

/** @param {string} html */
export function parseUotxfPagination(html) {
  const numMatch = html.match(/class="num">(\d+)\/(\d+)/);
  if (numMatch) {
    return { current: Number(numMatch[1]) || 1, total: Number(numMatch[2]) || 1 };
  }
  const totalMatch = html.match(/共\s*(\d+)\s*页/);
  if (totalMatch) return { current: 1, total: Number(totalMatch[1]) || 1 };
  return { current: 1, total: 1 };
}

/** @param {string} html @param {import('./sites.mjs').SiteConfig} site */
export function parseUotxfFilters(html, site) {
  const options = [];
  const seen = new Set();
  const re = /href="(\/vodshow\/[^"]+)"[^>]*>([^<]*)</gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const path = m[1];
    if (seen.has(path)) continue;
    seen.add(path);
    options.push({ label: UA_DECODE(m[2]), path });
  }
  if (!options.length) return [];
  return [{ label: '筛选', options }];
}

/** @param {string} html @param {string} label */
function parseMeta(html, label) {
  const re = new RegExp(`${label}\\s*[:：][^<]*</[^>]+>\\s*([^<\\n]+)`, 'i');
  const m = html.match(re);
  return m ? UA_DECODE(m[1].replace(/<[^>]+>/g, '').trim()) : '';
}

/** @param {string} html @param {number} localId @param {import('./sites.mjs').SiteConfig} site */
export function parseUotxfDetail(html, localId, site) {
  const title =
    UA_DECODE(html.match(/<title>《([^》]+)》/)?.[1] || '') ||
    UA_DECODE(html.match(/<h1[^>]*>([^<]*)</i)?.[1] || '') ||
    `影片 ${localId}`;

  const poster =
    html.match(/class="[^"]*lazyload[^"]*"[^>]*data-original="([^"]+)"/)?.[1] ||
    html.match(/data-original="([^"]+)"/)?.[1] ||
    html.match(/data-background="([^"]+)"/)?.[1] ||
    '';

  const sketchMatch = html.match(/class="[^"]*detail-sketch[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
  const contentMatch = html.match(/class="[^"]*detail-content[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
  const cleanDesc = (raw) =>
    UA_DECODE((raw || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());

  const descriptionSketch = cleanDesc(sketchMatch?.[1]);
  const descriptionFull = cleanDesc(contentMatch?.[1]) || descriptionSketch;

  const episodes = [];
  const epRe = /href="\/vodplay\/(\d+)-(\d+)-(\d+)\.html"[^>]*>([^<]*)</gi;
  let ep;
  while ((ep = epRe.exec(html)) !== null) {
    if (Number(ep[1]) !== localId) continue;
    episodes.push({
      sid: Number(ep[2]),
      nid: Number(ep[3]),
      name: UA_DECODE(ep[4]),
      playUrl: `${site.playPath}/${ep[1]}-${ep[2]}-${ep[3]}.html`,
    });
  }

  const playSources = episodes.length ? [{ name: '播放', episodes }] : [];

  return {
    id: toPublicId(site, localId),
    title,
    poster: absUrl(poster, site),
    description: descriptionFull || descriptionSketch,
    descriptionSketch: descriptionSketch || descriptionFull?.slice(0, 120) || '',
    descriptionFull: descriptionFull || descriptionSketch,
    rating: 7,
    category: 'movie',
    subCategory: parseMeta(html, '类型') || '未知',
    area: parseMeta(html, '地区') || '未知',
    year: Number(parseMeta(html, '年份')) || new Date().getFullYear(),
    status: parseMeta(html, '状态') || '更新中',
    director: parseMeta(html, '导演') || '内详',
    actors: (parseMeta(html, '主演') || '内详')
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean),
    playSources,
    episodes: episodes.map((e) => ({ ...e, sourceName: '播放' })),
    relatedVideos: parseUotxfList(html, site).filter((v) => v.id !== toPublicId(site, localId)).slice(0, 12),
    hotList: [],
    latestList: [],
    pageTitle: UA_DECODE(html.match(/<title>([^<]*)<\/title>/i)?.[1] || ''),
    updatedTime: parseMeta(html, '时间') || '',
    source: true,
    sourceSite: site.key,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

/** @param {string} html @param {string} keyword @param {number} page @param {import('./sites.mjs').SiteConfig} site */
export function parseUotxfSearchPage(html, keyword, page, site) {
  const items = parseUotxfList(html, site).map((item) => ({
    ...item,
    director: '内详',
    subCategory: '',
    area: '',
    year: new Date().getFullYear(),
    playSid: 1,
    playNid: 1,
  }));
  return {
    items,
    keyword,
    page: parseUotxfPagination(html).current || page,
    pagination: parseUotxfPagination(html),
    pageTitle: UA_DECODE(html.match(/<title>([^<]*)<\/title>/i)?.[1] || ''),
    movieHot: [],
    tvHot: [],
  };
}

/** @param {string} category @param {number} page @param {string} filterPath @param {import('./sites.mjs').SiteConfig} site */
export function buildUotxfListPath(category, page, filterPath, site) {
  const resolved = filterPath || site.defaultFilters?.[category];
  if (resolved) return buildVodshowPagePath(resolved, page);
  const typeId = site.typeIds[category];
  if (!typeId) return null;
  if (page <= 1) return `${site.listPath}/${typeId}.html`;
  return `${site.listPath}/${typeId}-${page}.html`;
}

export function buildVodshowPagePath(path, page) {
  if (page <= 1) return path;
  if (path.endsWith('-----------.html')) {
    return path.replace(/-----------\.html$/, `--------${page}---.html`);
  }
  if (path.endsWith('--------.html')) {
    return path.replace(/--------\.html$/, `-----${page}---.html`);
  }
  return path.replace(/\.html$/, `-----${page}---.html`);
}

/** @param {string} keyword @param {number} page @param {import('./sites.mjs').SiteConfig} site */
export function buildUotxfSearchPath(keyword, page, site) {
  const encoded = encodeURIComponent(keyword);
  if (page <= 1) return `${site.searchPath}?wd=${encoded}`;
  return `/vodsearch/${encoded}----------${page}---.html`;
}
