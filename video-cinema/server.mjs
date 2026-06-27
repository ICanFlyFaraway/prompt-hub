import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITES, SITE_LIST, resolveSite, toLocalId, toPublicId } from './lib/sites.mjs';
import {
  parseUotxfList,
  parseUotxfDetail,
  parseUotxfSearchPage,
  parseUotxfFilters,
  parseUotxfPagination,
  buildUotxfListPath,
  buildUotxfSearchPath,
} from './lib/parsers-uotxf.mjs';
import { fetchAjaxSuggest, rankSearchItems } from './lib/search.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3456;

/** @type {import('./lib/sites.mjs').SiteConfig} */
export const SOURCE = SITES.dckjqsh;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** @param {import('./lib/sites.mjs').SiteConfig} site @param {string} urlPath */
async function fetchSiteHtml(site, urlPath) {
  const url = urlPath.startsWith('http') ? urlPath : `${site.base}${urlPath}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Referer: `${site.base}/`,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`${site.name} 上游返回 ${res.status}`);
  return res.text();
}

/** @param {import('./lib/sites.mjs').SiteConfig} site @param {string} urlPath */
async function fetchSiteHtmlSafe(site, urlPath) {
  try {
    return await fetchSiteHtml(site, urlPath);
  } catch (err) {
    console.warn(`[${site.key}] ${urlPath}: ${err.message}`);
    return '';
  }
}

async function fetchSourceHtml(urlPath) {
  return fetchSiteHtml(SOURCE, urlPath);
}

function mergeLists(...lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const item of list) {
      const key = `${item.sourceSite || SOURCE.key}:${item.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function siteForFilterPath(filterPath) {
  if (!filterPath) return null;
  if (filterPath.includes('/vodshow/')) return SITES.uotxf;
  if (filterPath.includes('/xxsw/')) return SITES.dckjqsh;
  return null;
}

async function searchBothSources(keyword, page = 1) {
  const [htmlA, htmlB, ajaxA, ajaxB] = await Promise.all([
    fetchSiteHtml(SITES.dckjqsh, buildSearchPath(keyword, page)).catch(() => ''),
    fetchSiteHtml(SITES.uotxf, buildUotxfSearchPath(keyword, page, SITES.uotxf)).catch(() => ''),
    page === 1 ? fetchAjaxSuggest(SITES.dckjqsh, keyword).catch(() => []) : Promise.resolve([]),
    page === 1 ? fetchAjaxSuggest(SITES.uotxf, keyword).catch(() => []) : Promise.resolve([]),
  ]);

  const emptySearch = { items: [], pagination: { current: page, total: 1 }, movieHot: [], tvHot: [], pageTitle: '' };
  const dataA = htmlA ? parseSearchPage(htmlA, keyword, page) : emptySearch;
  const dataB = htmlB ? parseUotxfSearchPage(htmlB, keyword, page, SITES.uotxf) : emptySearch;

  const items = rankSearchItems(
    mergeLists(ajaxA, ajaxB, dataA.items, dataB.items),
    keyword,
  );

  return {
    items,
    keyword,
    page,
    pagination: {
      current: page,
      total: Math.max(dataA.pagination?.total || 1, dataB.pagination?.total || 1, ajaxA.length || ajaxB.length ? 1 : 0),
    },
    pageTitle: dataA.pageTitle || dataB.pageTitle || '',
    movieHot: mergeLists(dataA.movieHot || [], dataB.movieHot || []).slice(0, 10),
    tvHot: mergeLists(dataA.tvHot || [], dataB.tvHot || []).slice(0, 10),
  };
}

function absUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `${SOURCE.base}${url.startsWith('/') ? '' : '/'}${url}`;
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parsePlayerAaaa(html) {
  const match = html.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function parseVodCards(html) {
  const items = parseVodListItems(html);
  if (items.length) return items;

  const seen = new Set();
  const patterns = [
    /<a[^>]*class="[^"]*stui-vodlist__thumb[^"]*"[^>]*href="\/xxdt\/(\d+)\.html"[^>]*title="([^"]*)"[^>]*(?:data-original="([^"]*)")?[^>]*>/gi,
    /<a[^>]*href="\/xxdt\/(\d+)\.html"[^>]*title="([^"]*)"[^>]*class="[^"]*stui-vodlist__thumb[^"]*"[^>]*(?:data-original="([^"]*)")?[^>]*>/gi,
  ];
  const fallback = [];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html)) !== null) {
      const id = Number(m[1]);
      if (seen.has(id)) continue;
      seen.add(id);
      fallback.push({
        id,
        title: decodeHtml(m[2]),
        poster: absUrl(m[3] || ''),
        status: '更新中',
        actors: [],
        rating: 7,
        source: true,
        sourceSite: SOURCE.key,
      });
    }
  }
  return fallback;
}

function parseVodListItems(html) {
  const items = [];
  const seen = new Set();
  const blockRe = /<div class="stui-vodlist__box">([\s\S]*?)<\/div>\s*(?:<!--[\s\S]*?-->)?/gi;
  let block;
  while ((block = blockRe.exec(html)) !== null) {
    const b = block[1];
    const idMatch = b.match(/href="\/xxdt\/(\d+)\.html"/);
    if (!idMatch) continue;
    const id = Number(idMatch[1]);
    if (seen.has(id)) continue;
    seen.add(id);

    const title = decodeHtml(b.match(/title="([^"]*)"/)?.[1] || '');
    const poster = absUrl(b.match(/data-original="([^"]*)"/)?.[1] || '');
    const status = decodeHtml(b.match(/class="pic-text[^"]*"[^>]*>([^<]*)</)?.[1] || '更新中');
    const actorText = decodeHtml(b.match(/<p class="[^"]*text[^"]*">([^<]*)</)?.[1] || '');
    const actors = actorText
      ? actorText
          .split(/[,，]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

    items.push({
      id,
      title,
      poster,
      status,
      actors,
      rating: 7,
      source: true,
      sourceSite: SOURCE.key,
    });
  }
  return items;
}

function parseFilterGroups(html) {
  const groups = [];
  const ulRe = /<ul class="stui-screen__list[^"]*">([\s\S]*?)<\/ul>/gi;
  let ul;
  while ((ul = ulRe.exec(html)) !== null) {
    const listHtml = ul[1];
    const headline = decodeHtml(listHtml.match(/<span class="text-muted">([^<]*)</)?.[1] || '');
    if (!headline) continue;
    const options = [];
    const linkRe = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
    let link;
    while ((link = linkRe.exec(listHtml)) !== null) {
      const href = link[1];
      if (!href.includes('/xxsw/')) continue;
      options.push({
        label: decodeHtml(link[2]),
        path: href.startsWith('/') ? href : `/${href}`,
      });
    }
    if (options.length) groups.push({ label: headline, options });
  }
  return groups;
}

function parsePagination(html) {
  let current = 1;
  let total = 1;
  const numMatch = html.match(/class="num">(\d+)\/(\d+)/);
  if (numMatch) {
    current = Number(numMatch[1]) || 1;
    total = Number(numMatch[2]) || 1;
  } else {
    const lastMatch = html.match(/stui-page[\s\S]*?href="[^"]*-(\d+)\.html"[^>]*>\s*尾页/);
    if (lastMatch) total = Number(lastMatch[1]) || 1;
  }
  return { current, total };
}

function parseSidebarList(html, sectionTitle) {
  const sectionRe = new RegExp(
    `${sectionTitle}[\\s\\S]{0,2500}?<ul class="stui-vodlist__media[^"]*">([\\s\\S]*?)<\\/ul>`,
    'i',
  );
  const m = html.match(sectionRe);
  if (!m) return [];

  const items = [];
  const seen = new Set();
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let li;
  while ((li = liRe.exec(m[1])) !== null) {
    const block = li[1];
    const idM = block.match(/href="\/xxdt\/(\d+)\.html"/);
    if (!idM) continue;
    const id = Number(idM[1]);
    if (seen.has(id)) continue;
    seen.add(id);
    const titleM =
      block.match(/title="([^"]*)"/) || block.match(/<p class="margin-0"[^>]*>\s*<a[^>]*>([^<]*)<\/a>/);
    const ratingM = block.match(/class="branch">([^<]*)</);
    const posterM = block.match(/url\(([^)]+)\)/) || block.match(/data-original="([^"]*)"/);
    items.push({
      id,
      title: decodeHtml(titleM?.[1] || ''),
      poster: absUrl((posterM?.[1] || '').replace(/['"]/g, '')),
      rating: Number(ratingM?.[1]) || 7,
      source: true,
    });
  }
  return items.slice(0, 10);
}

function buildXxswPagePath(path, page) {
  if (page <= 1) return path;
  if (path.endsWith('-----------.html')) {
    return path.replace(/-----------\.html$/, `--------${page}---.html`);
  }
  if (path.endsWith('--------.html')) {
    return path.replace(/--------\.html$/, `-----${page}---.html`);
  }
  return path.replace(/\.html$/, `-----${page}---.html`);
}

function buildSearchPath(keyword, page = 1) {
  const encoded = encodeURIComponent(keyword);
  if (page <= 1) {
    return `${SOURCE.searchPath}?wd=${encoded}&submit=${encodeURIComponent('展示')}`;
  }
  return `/xxsc/${encoded}----------${page}---.html`;
}

function parseSearchResults(html) {
  const items = [];
  const seen = new Set();
  const blockRe =
    /<li[^>]*>\s*<div class="thumb">([\s\S]*?)<div class="detail">([\s\S]*?)<\/div>\s*<\/li>/gi;
  let block;
  while ((block = blockRe.exec(html)) !== null) {
    const thumb = block[1];
    const detail = block[2];
    const idMatch = thumb.match(/href="\/xxdt\/(\d+)\.html"/);
    if (!idMatch) continue;
    const id = Number(idMatch[1]);
    if (seen.has(id)) continue;
    seen.add(id);

    const title =
      decodeHtml(thumb.match(/title="([^"]*)"/)?.[1] || '') ||
      decodeHtml(detail.match(/class="title"[^>]*>\s*<a[^>]*>([^<]*)</)?.[1] || '');
    const poster = absUrl(thumb.match(/data-original="([^"]*)"/)?.[1] || '');
    const status = decodeHtml(thumb.match(/class="pic-text[^"]*"[^>]*>([^<]*)</)?.[1] || '更新中');
    const director = decodeHtml(detail.match(/导演：<\/span>([^<]*)</)?.[1] || '内详');
    const actorText = decodeHtml(detail.match(/主演：<\/span>([^<]*)</)?.[1] || '');
    const actors = actorText
      ? actorText
          .split(/[,，]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 5)
      : ['内详'];
    const subCategory = decodeHtml(detail.match(/类型：<\/span>([^<]*)/)?.[1] || '');
    const area = decodeHtml(detail.match(/地区：<\/span>([^<]*)/)?.[1] || '');
    const yearMatch = detail.match(/年份：<\/span>(\d{4})/);
    const playMatch = detail.match(/href="\/xxpy\/(\d+)-(\d+)-(\d+)\.html"/);

    items.push({
      id,
      title,
      poster,
      status,
      director,
      actors,
      subCategory,
      area,
      year: yearMatch ? Number(yearMatch[1]) : new Date().getFullYear(),
      playSid: playMatch ? Number(playMatch[2]) : 1,
      playNid: playMatch ? Number(playMatch[3]) : 1,
      source: true,
      sourceSite: SOURCE.key,
    });
  }
  return items;
}

function parseRankTextList(html, sectionTitle) {
  const sectionRe = new RegExp(
    `${sectionTitle}[\\s\\S]*?<ul class="stui-vodlist__text[^"]*">([\\s\\S]*?)<\\/ul>`,
    'i',
  );
  const m = html.match(sectionRe);
  if (!m) return [];

  const items = [];
  const seen = new Set();
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let li;
  while ((li = liRe.exec(m[1])) !== null) {
    const block = li[1];
    const idM = block.match(/href="\/xxdt\/(\d+)\.html"/);
    if (!idM) continue;
    const id = Number(idM[1]);
    if (seen.has(id)) continue;
    seen.add(id);
    const titleM = block.match(/href="\/xxdt\/\d+\.html"[^>]*>(?:[\s\S]*?)([^<]+)<\/a>/);
    const statusM = block.match(/class="pic-text[^"]*"[^>]*>([^<]*)</);
    items.push({
      id,
      title: decodeHtml((titleM?.[1] || '').replace(/^\d+\s*\.\s*/, '').trim()),
      status: decodeHtml(statusM?.[1] || ''),
      rating: 7,
      source: true,
    });
  }
  return items.slice(0, 10);
}

function parseSearchPage(html, keyword, page) {
  let items = parseSearchResults(html);
  if (!items.length) {
    items = parseVodListItems(html);
  }
  if (!items.length) {
    items = parseVodCards(html).map((item) => enrichListItem(item, html));
  }

  const pagination = parsePagination(html);
  const pageTitle = decodeHtml(html.match(/<title>([^<]*)<\/title>/i)?.[1] || '');
  const movieHot = [
    ...parseSidebarList(html, '电影热播榜'),
    ...parseRankTextList(html, '电影热播榜'),
  ].slice(0, 10);
  const tvHot = [
    ...parseSidebarList(html, '电视剧热播榜'),
    ...parseRankTextList(html, '电视剧热播榜'),
  ].slice(0, 10);

  return {
    items,
    keyword,
    page: pagination.current || page,
    pagination,
    pageTitle,
    movieHot,
    tvHot,
  };
}

function buildListPath(category, page, filterPath, site = SOURCE) {
  const resolvedFilter = filterPath || site.defaultFilters?.[category];
  if (resolvedFilter) {
    return site.template === 'uotxf'
      ? buildUotxfListPath(category, page, resolvedFilter, site)
      : buildXxswPagePath(resolvedFilter, page);
  }
  const typeId = site.typeIds[category];
  if (!typeId) return null;
  if (site.template === 'uotxf') {
    if (page <= 1) return `${site.listPath}/${typeId}.html`;
    return `${site.listPath}/${typeId}-${page}.html`;
  }
  if (page <= 1) return `/xxtp/${typeId}.html`;
  return `/xxtp/${typeId}-${page}.html`;
}

function parseCategoryPage(html, category, page, filterPath) {
  const items = parseVodListItems(html);
  const pagination = parsePagination(html);
  const filters = parseFilterGroups(html);
  const hotList = parseSidebarList(html, '本周热门');
  const latestList = parseSidebarList(html, '最新更新');
  const pageTitle = decodeHtml(html.match(/<title>([^<]*)<\/title>/i)?.[1] || '');

  return {
    items: items.map((item) => ({ ...item, category })),
    category,
    page: pagination.current || page,
    pagination,
    filters,
    hotList,
    latestList,
    pageTitle,
    filterPath: filterPath || '',
  };
}

function parseMetaValue(html, label) {
  const blockRe = new RegExp(
    `${label}\\s*[:：]\\s*</span>\\s*([^<]*(?:<[^>]+>[^<]*)*)`,
    'i',
  );
  const block = html.match(blockRe);
  if (block) {
    const text = block[1]
      .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1 ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
    if (text) return decodeHtml(text);
  }

  const re = new RegExp(`${label}[:：]\\s*([^<\\n]+)`, 'i');
  const m = html.match(re);
  return m ? decodeHtml(m[1].replace(/<[^>]+>/g, '').trim()) : '';
}

function parseActors(html) {
  const block = html.match(/主演\s*[:：]\s*<\/span>([\s\S]*?)(?:<\/p>|<span class="text-muted">)/i);
  if (!block) return parseMetaValue(html, '主演') || '内详';
  const actors = [...block[1].matchAll(/<a[^>]*>([^<]*)<\/a>/gi)].map((m) => decodeHtml(m[1]));
  return actors.length ? actors : ['内详'];
}

function parsePlaylists(html, vodId) {
  const sources = [];
  const blockRe = /<h3[^>]*>\s*([^<]*?)\s*<\/h3>[\s\S]*?<ul class="stui-content__playlist[^"]*">([\s\S]*?)<\/ul>/gi;
  let block;
  while ((block = blockRe.exec(html)) !== null) {
    const sourceName = decodeHtml(block[1]);
    const listHtml = block[2];
    const episodes = [];
    const epRe = /<a[^>]*href="\/xxpy\/(\d+)-(\d+)-(\d+)\.html"[^>]*>([^<]*)<\/a>/gi;
    let ep;
    while ((ep = epRe.exec(listHtml)) !== null) {
      if (Number(ep[1]) !== vodId) continue;
      episodes.push({
        sid: Number(ep[2]),
        nid: Number(ep[3]),
        name: decodeHtml(ep[4]),
        playUrl: `${SOURCE.playPath}/${ep[1]}-${ep[2]}-${ep[3]}.html`,
      });
    }
    if (episodes.length) sources.push({ name: sourceName, episodes });
  }

  if (!sources.length) {
    const fallback = [];
    const epRe = /<a[^>]*href="\/xxpy\/(\d+)-(\d+)-(\d+)\.html"[^>]*>([^<]*)<\/a>/gi;
    let ep;
    while ((ep = epRe.exec(html)) !== null) {
      if (Number(ep[1]) !== vodId) continue;
      fallback.push({
        sid: Number(ep[2]),
        nid: Number(ep[3]),
        name: decodeHtml(ep[4]),
        playUrl: `${SOURCE.playPath}/${ep[1]}-${ep[2]}-${ep[3]}.html`,
      });
    }
    if (fallback.length) sources.push({ name: '播放', episodes: fallback });
  }

  return sources;
}

function parseRelatedVideos(html) {
  const sectionRe = /猜你喜欢[\s\S]{0,4000}?<ul class="stui-vodlist__bd[^"]*">([\s\S]*?)<\/ul>/i;
  const m = html.match(sectionRe);
  if (!m) return [];
  return parseVodListItems(m[1]);
}

function parseVodDetail(html, id) {
  const title =
    decodeHtml(html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</i)?.[1] || '') ||
    decodeHtml(html.match(/<title>《?([^》<]+)》?/i)?.[1] || '') ||
    '';

  const posterMatch =
    html.match(/class="[^"]*v-thumb[^"]*"[^>]*data-original="(\/upload\/[^"]+)"/) ||
    html.match(/data-original="(\/upload\/[^"]+)"/) ||
    html.match(/v-thumb[^>]*style="[^"]*url\(([^)]+)\)/) ||
    html.match(/background-image:\s*url\(([^)]+)\)/);
  const poster = posterMatch ? absUrl(posterMatch[1].replace(/['"]/g, '')) : '';

  const sketchMatch = html.match(/class="[^"]*detail-sketch[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
  const contentMatch = html.match(/class="[^"]*detail-content[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
  const cleanDesc = (raw) =>
    decodeHtml((raw || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  const descriptionSketch = cleanDesc(sketchMatch?.[1]);
  const descriptionFull = cleanDesc(contentMatch?.[1]) || descriptionSketch;
  const description = descriptionFull || descriptionSketch;

  const scoreMatch = html.match(/class="[^"]*score[^"]*"[^>]*>[\s\S]*?(\d+(?:\.\d+)?)/i);
  const rating = scoreMatch ? Number(scoreMatch[1]) : 7;

  const playSources = parsePlaylists(html, id);
  const flatEpisodes = playSources.flatMap((s) =>
    s.episodes.map((ep) => ({ ...ep, sourceName: s.name })),
  );

  const statusBadge = html.match(/class="pic-text[^"]*"[^>]*>([^<]*)</);

  return {
    id,
    title: title || `影片 ${id}`,
    poster,
    description,
    descriptionSketch: descriptionSketch || description.slice(0, 120),
    descriptionFull: descriptionFull || description,
    rating,
    category: 'movie',
    subCategory: parseMetaValue(html, '类型') || '未知',
    area: parseMetaValue(html, '地区') || '未知',
    year: Number(parseMetaValue(html, '年份')) || new Date().getFullYear(),
    status: decodeHtml(statusBadge?.[1] || '') || parseMetaValue(html, '状态') || '更新中',
    director: parseMetaValue(html, '导演') || '内详',
    actors: parseActors(html),
    playSources,
    episodes: flatEpisodes,
    relatedVideos: parseRelatedVideos(html),
    hotList: parseSidebarList(html, '本周热门'),
    latestList: parseSidebarList(html, '最新更新'),
    pageTitle: decodeHtml(html.match(/<title>([^<]*)<\/title>/i)?.[1] || ''),
    updatedTime: parseMetaValue(html, '时间') || '',
    source: true,
    sourceSite: SOURCE.key,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function enrichListItem(item, html, category = 'movie') {
  const blockRe = new RegExp(
    `/xxdt/${item.id}\\.html"[\\s\\S]{0,800}?<p class="[^"]*text[^"]*">([^<]*)</p>`,
    'i',
  );
  const statusRe = new RegExp(
    `/xxdt/${item.id}\\.html"[\\s\\S]{0,400}?class="pic-text[^"]*"[^>]*>([^<]*)</`,
    'i',
  );
  const m = html.match(blockRe);
  const statusM = html.match(statusRe);
  const actorText = m ? decodeHtml(m[1].trim()) : '';
  return {
    ...item,
    actors: actorText
      ? actorText
          .split(/[,，]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3)
      : item.actors || [],
    status: item.status || (statusM ? decodeHtml(statusM[1]) : '更新中'),
    rating: item.rating || 7,
    category,
    subCategory: '',
  };
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath.replace(/^\//, ''));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  try {
    if (url.pathname === '/api/config') {
      return sendJson(res, 200, {
        base: SOURCE.base,
        parse: SOURCE.parse,
        detailPath: SOURCE.detailPath,
        playPath: SOURCE.playPath,
        sources: SITE_LIST.map((s) => ({
          key: s.key,
          name: s.name,
          base: s.base,
          idOffset: s.idOffset || 0,
        })),
      });
    }

    if (url.pathname === '/api/home') {
      const [htmlA, htmlB] = await Promise.all([
        fetchSiteHtmlSafe(SITES.dckjqsh, '/'),
        fetchSiteHtmlSafe(SITES.uotxf, '/'),
      ]);
      const itemsA = htmlA ? parseVodCards(htmlA).map((item) => enrichListItem(item, htmlA)) : [];
      const itemsB = htmlB ? parseUotxfList(htmlB, SITES.uotxf) : [];
      return sendJson(res, 200, { items: mergeLists(itemsA, itemsB).slice(0, 60) });
    }

    const searchMatch = url.pathname.match(/^\/api\/search$/);
    if (searchMatch) {
      const q = url.searchParams.get('q')?.trim();
      if (!q) return sendJson(res, 400, { error: '缺少搜索关键词' });
      const page = Math.max(1, Number(url.searchParams.get('page') || 1));
      const data = await searchBothSources(q, page);
      return sendJson(res, 200, data);
    }

    const listMatch = url.pathname.match(/^\/api\/list\/([^/]+)$/);
    if (listMatch) {
      const category = listMatch[1];
      const page = Math.max(1, Number(url.searchParams.get('page') || 1));
      const filterPath = url.searchParams.get('filter')?.trim() || '';
      const filterSite = siteForFilterPath(filterPath);

      const searchKeyword =
        !filterPath && !filterSite ? SOURCE.searchCategories?.[category] : '';
      if (searchKeyword) {
        const searchData = await searchBothSources(searchKeyword, page);
        return sendJson(res, 200, {
          items: searchData.items.map((item) => ({ ...item, category })),
          category,
          page: searchData.page,
          pagination: searchData.pagination,
          filters: [],
          hotList: [],
          latestList: [],
          pageTitle: searchData.pageTitle,
          filterPath: '',
          keyword: searchKeyword,
        });
      }

      const fetchForSite = async (site) => {
        try {
          const listPath = buildListPath(category, page, filterPath, site);
          if (!listPath) return null;
          const html = await fetchSiteHtml(site, listPath);
          if (site.template === 'uotxf') {
            return {
              items: parseUotxfList(html, site).map((item) => ({ ...item, category })),
              pagination: parseUotxfPagination(html),
              filters: parseUotxfFilters(html, site),
              hotList: [],
              latestList: [],
              pageTitle: decodeHtml(html.match(/<title>([^<]*)<\/title>/i)?.[1] || ''),
            };
          }
          const data = parseCategoryPage(html, category, page, filterPath);
          if (!data.items.length) {
            data.items = parseVodCards(html).map((item) => enrichListItem(item, html, category));
          }
          return data;
        } catch (err) {
          console.warn(`[${site.key}] list/${category}: ${err.message}`);
          return null;
        }
      };

      if (filterSite) {
        const data = await fetchForSite(filterSite);
        if (!data) return sendJson(res, 404, { error: '未知分类' });
        return sendJson(res, 200, { ...data, category, filterPath });
      }

      const [dataA, dataB] = await Promise.all([
        fetchForSite(SITES.dckjqsh),
        fetchForSite(SITES.uotxf),
      ]);
      if (!dataA && !dataB) return sendJson(res, 404, { error: '未知分类' });

      const items = mergeLists(dataA?.items || [], dataB?.items || []);
      const pagination = {
        current: page,
        total: Math.max(dataA?.pagination?.total || 1, dataB?.pagination?.total || 1),
      };
      return sendJson(res, 200, {
        items,
        category,
        page: pagination.current,
        pagination,
        filters: dataA?.filters?.length ? dataA.filters : dataB?.filters || [],
        hotList: dataA?.hotList?.length ? dataA.hotList : dataB?.hotList || [],
        latestList: dataA?.latestList?.length ? dataA.latestList : dataB?.latestList || [],
        pageTitle: dataA?.pageTitle || dataB?.pageTitle || '',
        filterPath,
      });
    }

    const vodMatch = url.pathname.match(/^\/api\/vod\/(\d+)$/);
    if (vodMatch) {
      const publicId = Number(vodMatch[1]);
      const site = resolveSite(publicId);
      const localId = toLocalId(publicId);
      const html = await fetchSiteHtml(site, `${site.detailPath}/${localId}.html`);
      const vod =
        site.template === 'uotxf'
          ? parseUotxfDetail(html, localId, site)
          : parseVodDetail(html, localId);
      return sendJson(res, 200, vod);
    }

    const playMatch = url.pathname.match(/^\/api\/play\/(\d+)\/(\d+)\/(\d+)$/);
    if (playMatch) {
      const [, publicId, sid, nid] = playMatch.map(Number);
      const site = resolveSite(publicId);
      const localId = toLocalId(publicId);
      const html = await fetchSiteHtml(site, `${site.playPath}/${localId}-${sid}-${nid}.html`);
      const player = parsePlayerAaaa(html);
      if (!player) return sendJson(res, 502, { error: '无法解析播放数据' });

      const needsParse = player.from !== 'vip' && player.from !== 'dplayer';
      const iframeUrl = needsParse
        ? `${site.parse}${encodeURIComponent(player.url)}`
        : player.url;

      return sendJson(res, 200, {
        id: publicId,
        sid,
        nid,
        url: player.url,
        from: player.from,
        needsParse,
        iframeUrl,
        embedUrl: `${site.base}${site.playPath}/${localId}-${sid}-${nid}.html`,
        sourceSite: site.key,
        vod: player.vod_data || {},
        linkNext: player.link_next || '',
        linkPre: player.link_pre || '',
      });
    }

    if (url.pathname.startsWith('/api/')) {
      return sendJson(res, 404, { error: '接口不存在' });
    }

    serveStatic(req, res);
  } catch (err) {
    console.error(err);
    sendJson(res, 502, { error: err.message || '上游请求失败' });
  }
});

server.listen(PORT, () => {
  console.log(`小草影院已启动: http://localhost:${PORT}`);
  console.log(`资源源站: ${SITE_LIST.map((s) => s.base).join(' | ')}`);
});
