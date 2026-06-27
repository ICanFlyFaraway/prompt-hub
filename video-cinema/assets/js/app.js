import {
  SITE,
  NAV_ITEMS,
  CATEGORY_META,
  BANNERS,
  getVideoById,
  getVideosByCategory,
  getHotVideos,
  searchVideos,
  filterVideos,
  getRelatedVideos,
} from './data.js';
import {
  isSourceId,
  isApiAvailable,
  fetchHomeVideos,
  searchSourceVideos,
  searchSourcePage,
  fetchCategoryVideos,
  fetchCategoryPage,
  fetchVodDetail,
  fetchPlayInfo,
  normalizeSourceVideo,
} from './source.js';
import { getHistory, addHistory, clearHistory, addRequest } from './store.js';
import {
  initAuthStore,
  isLoggedIn,
  login,
  logout,
  getCurrentUser,
  changePassword,
  resetPasswordByPhone,
} from './auth.js';

const PAGE_SIZE = 18;
let carouselTimer = null;
let carouselIndex = 0;
let sourceEnabled = false;
/** @type {'login' | 'forgot'} */
let authView = 'login';
/** @type {Map<number, object>} */
const sourceCache = new Map();

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatPageTitle(title, fallback) {
  const text = title || fallback;
  return text.replace(/星星影院/g, SITE.name);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2500);
}

function renderLoading(text = '加载中...') {
  return `<div class="page-card simple-page"><div class="search-empty"><div class="loading-spinner"></div><p>${escapeHtml(text)}</p></div></div>`;
}

function renderError(msg) {
  return `<div class="page-card simple-page"><div class="search-empty"><div class="icon">⚠️</div><p>${escapeHtml(msg)}</p><a href="#/" style="margin-top:12px;display:inline-block;color:var(--accent)">返回首页</a></div></div>`;
}

function renderStars(rating) {
  const full = Math.round(rating / 2);
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="star${i < full ? ' filled' : ''}">★</span>`,
  ).join('');
}

function posterUrl(video, size = '300/450') {
  const url = video?.poster?.trim();
  if (url) return url;
  return `https://picsum.photos/seed/fallback-${video.id}/${size}`;
}

function renderVideoCard(video) {
  const actors = (video.actors || []).slice(0, 3).join(', ');
  const poster = posterUrl(video);
  return `
    <article class="video-card" data-id="${video.id}">
      <div class="video-poster">
        <img src="${poster}" alt="${escapeHtml(video.title)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${posterUrl(video)}'" />
        <span class="video-badge">${escapeHtml(video.status || '更新中')}</span>
      </div>
      <div class="video-info">
        <div class="video-title">${escapeHtml(video.title)}</div>
        <div class="video-meta">${escapeHtml(actors || '内详')}</div>
      </div>
    </article>`;
}

function renderHotItem(video) {
  const poster = posterUrl(video, '96/128');
  return `
    <div class="hot-item" data-id="${video.id}">
      <div class="hot-thumb">
        <img src="${poster}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${posterUrl(video, '96/128')}'" />
      </div>
      <div class="hot-info">
        <div class="hot-name">${escapeHtml(video.title)}</div>
        <div class="hot-rating">
          <div class="stars">${renderStars(video.rating || 7)}</div>
          <span class="rating-num">${(video.rating || 7).toFixed(1)}</span>
        </div>
      </div>
    </div>`;
}

function categoryHref(category, { page = 1, filter = '', sub = '' } = {}) {
  const q = new URLSearchParams();
  if (page > 1) q.set('page', String(page));
  if (filter) q.set('filter', filter);
  else if (sub) q.set('sub', sub);
  const qs = q.toString();
  return `#/category/${category}${qs ? `?${qs}` : ''}`;
}

function renderSection(category, videos, filterGroups) {
  const meta = CATEGORY_META[category];
  const hot = [...videos].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 9);
  const typeFilters =
    filterGroups?.find((g) => g.label === '按类型')?.options || filterGroups?.[0]?.options || [];
  const subFilters = (typeFilters.length ? typeFilters : meta.subCategories.map((s) => ({ label: s })))
    .slice(0, 8)
    .map((s) => {
      const href = s.path ? categoryHref(category, { filter: s.path }) : categoryHref(category, { sub: s.label });
      return `<a href="${href}">${escapeHtml(s.label)}</a>`;
    })
    .join('');

  return `
    <section class="content-section">
      <div class="section-main">
        <div class="section-header">
          <div class="section-title">
            <span class="icon">📺</span>
            <a href="#/category/${category}">${escapeHtml(meta.sectionTitle)}</a>
          </div>
          <div class="sub-filters">
            ${subFilters}
            <a class="more" href="#/category/${category}">更多 &gt;</a>
          </div>
        </div>
        <div class="video-grid">
          ${videos.length ? videos.slice(0, 10).map(renderVideoCard).join('') : '<p style="color:#888">暂无数据</p>'}
        </div>
      </div>
      <aside class="section-sidebar">
        <div class="hot-panel">
          <div class="hot-panel-title">${escapeHtml(meta.hotTitle)}</div>
          <div class="hot-list">${hot.map(renderHotItem).join('')}</div>
        </div>
      </aside>
    </section>`;
}

function renderCarousel(banners) {
  const slides = banners
    .map(
      (b, i) => `
    <div class="carousel-slide" data-video-id="${b.videoId}" data-index="${i}">
      <img src="${b.image}" alt="${escapeHtml(b.title)}" />
      <div class="slide-title">${escapeHtml(b.title)}</div>
    </div>`,
    )
    .join('');

  const dots = banners
    .map((_, i) => `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`)
    .join('');

  return `
    <section class="banner-section">
      <div class="app-promo">
        <span>📱 欢迎安装高清版[橘子TV]电影APP</span>
        <button class="app-promo-btn" type="button">打开APP</button>
      </div>
      <div class="carousel">
        <div class="carousel-track">${slides}</div>
        <div class="carousel-dots">${dots}</div>
      </div>
    </section>`;
}

async function buildHomeBanners(homeItems) {
  const fromSource = (homeItems || []).slice(0, 5).map((v, i) => ({
    id: i + 1,
    title: v.title,
    videoId: v.id,
    image: posterUrl(v, '1200/420'),
  }));
  return fromSource.length ? fromSource : BANNERS;
}

async function renderHomePage() {
  document.title = `${SITE.name} - ${SITE.slogan}`;

  if (sourceEnabled) {
    try {
      const results = await Promise.allSettled([
        fetchCategoryPage('movie', 1),
        fetchCategoryPage('tv', 1),
        fetchCategoryPage('ustv', 1),
        fetchCategoryPage('variety', 1),
        fetchCategoryPage('anime', 1),
        fetchCategoryPage('short', 1),
      ]);
      const pick = (i) => (results[i].status === 'fulfilled' ? results[i].value : { items: [], filters: [] });
      const movieData = pick(0);
      const tvData = pick(1);
      const ustvData = pick(2);
      const varietyData = pick(3);
      const animeData = pick(4);
      const shortData = pick(5);
      const movie = movieData.items || [];
      const hasAny = results.some((r) => r.status === 'fulfilled' && r.value?.items?.length);
      if (!hasAny) {
        return renderError('首页资源加载失败，请稍后重试');
      }
      const banners = await buildHomeBanners(movie);
      return `
        <div class="page-card source-badge-wrap">
          <span class="source-badge">已对接双资源站</span>
          ${renderCarousel(banners)}
          ${renderSection('movie', movie.map(normalizeSourceVideo), movieData.filters)}
          ${renderSection('tv', (tvData.items || []).map(normalizeSourceVideo), tvData.filters)}
          ${renderSection('ustv', (ustvData.items || []).map(normalizeSourceVideo), ustvData.filters)}
          ${renderSection('variety', (varietyData.items || []).map(normalizeSourceVideo), varietyData.filters)}
          ${renderSection('anime', (animeData.items || []).map(normalizeSourceVideo), animeData.filters)}
          ${renderSection('short', (shortData.items || []).map(normalizeSourceVideo), shortData.filters)}
        </div>`;
    } catch (err) {
      return renderError(`首页资源加载失败: ${err.message}`);
    }
  }

  return `
    <div class="page-card">
      ${renderCarousel(BANNERS)}
      ${renderSection('movie', getVideosByCategory('movie', 10))}
      ${renderSection('tv', getVideosByCategory('tv', 10))}
      ${renderSection('ustv', getVideosByCategory('ustv', 10))}
      ${renderSection('variety', getVideosByCategory('variety', 10))}
      ${renderSection('anime', getVideosByCategory('anime', 10))}
      ${renderSection('short', getVideosByCategory('short', 10))}
    </div>`;
}

function renderFilterScreen(filterGroups, category, activeFilter) {
  if (!filterGroups?.length) return '';
  return `
    <div class="filter-screen">
      ${filterGroups
        .map(
          (group) => `
        <div class="filter-row">
          <span class="filter-label">${escapeHtml(group.label)}</span>
          <div class="filter-options">
            ${group.options
              .map((opt) => {
                const active = activeFilter === opt.path;
                return `<a class="filter-link${active ? ' active' : ''}" href="${categoryHref(category, { filter: opt.path })}">${escapeHtml(opt.label)}</a>`;
              })
              .join('')}
          </div>
        </div>`,
        )
        .join('')}
    </div>`;
}

function renderCategoryTypeNav(activeCategory) {
  return `
    <nav class="category-type-nav">
      ${NAV_ITEMS.filter((n) => n.key !== 'home')
        .map(
          (n) =>
            `<a class="type-nav-link${n.key === activeCategory ? ' active' : ''}" href="${categoryHref(n.key)}">${escapeHtml(n.label)}</a>`,
        )
        .join('')}
    </nav>`;
}

function renderCategoryPage(category, route, videos, pageData) {
  const meta = CATEGORY_META[category];
  const { sub: subCategory = '', page = 1, filter: activeFilter = '' } = route;
  const useSourceLayout = sourceEnabled && pageData;

  let pageItems = videos;
  let currentPage = page;
  let totalPages = 1;

  if (useSourceLayout) {
    currentPage = pageData.pagination?.current || page;
    totalPages = pageData.pagination?.total || 1;
    pageItems = videos;
    document.title = pageData.pageTitle
      ? formatPageTitle(pageData.pageTitle, `${meta.label} - ${SITE.name}`)
      : `${meta.label} - ${SITE.name}`;
  } else {
    const filtered = subCategory ? videos.filter((v) => v.subCategory === subCategory) : videos;
    totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * PAGE_SIZE;
    pageItems = filtered.slice(start, start + PAGE_SIZE);
    document.title = `${meta.label} - ${SITE.name}`;
  }

  const mockFilters = [
    { label: '全部', value: '' },
    ...meta.subCategories.map((s) => ({ label: s, value: s })),
  ];

  const filterScreen = useSourceLayout
    ? renderFilterScreen(pageData.filters, category, activeFilter)
    : '';

  const sidebarHot = useSourceLayout
    ? (pageData.hotList || []).map(normalizeSourceVideo)
    : [...pageItems].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 9);
  const sidebarLatest = useSourceLayout
    ? (pageData.latestList || []).map(normalizeSourceVideo)
    : pageItems.slice(0, 9);

  return `
    <div class="breadcrumb">
      <a href="#/">首页</a><span>&gt;</span>${escapeHtml(meta.label)}
      ${subCategory ? `<span>&gt;</span>${escapeHtml(subCategory)}` : ''}
    </div>
    <div class="page-card category-page">
      ${useSourceLayout ? renderCategoryTypeNav(category) : ''}
      ${useSourceLayout ? filterScreen : ''}
      <div class="page-header${useSourceLayout ? ' category-page-header' : ''}">
        <h2>${escapeHtml(meta.label)}${sourceEnabled ? ' <span class="source-badge">资源站</span>' : ''}</h2>
        ${
          !useSourceLayout
            ? `<div class="filter-bar">
          ${mockFilters
            .map((f) => {
              const active = f.value === (subCategory || '');
              const href = f.value ? categoryHref(category, { sub: f.value }) : categoryHref(category);
              return `<a class="filter-btn${active ? ' active' : ''}" href="${href}">${escapeHtml(f.label)}</a>`;
            })
            .join('')}
        </div>`
            : useSourceLayout && meta.searchKeyword && !pageData.filters?.length
              ? `<div class="filter-bar">
          <a class="filter-btn active" href="${categoryHref(category)}">全部</a>
          ${meta.subCategories
            .filter((s) => s !== meta.searchKeyword)
            .map(
              (s) =>
                `<a class="filter-btn" href="#/search?q=${encodeURIComponent(s)}">${escapeHtml(s)}</a>`,
            )
            .join('')}
        </div>`
              : ''
        }
      </div>
      <div class="category-layout">
        <div class="category-main">
          <div class="listing-grid">
            ${pageItems.length ? pageItems.map(renderVideoCard).join('') : '<div class="search-empty"><div class="icon">📭</div><p>暂无相关内容</p></div>'}
          </div>
          ${renderPagination(category, route, currentPage, totalPages)}
        </div>
        <aside class="category-sidebar">
          <div class="hot-panel">
            <div class="hot-panel-title">本周热门</div>
            <div class="hot-list">${sidebarHot.length ? sidebarHot.map(renderHotItem).join('') : '<p class="sidebar-empty">暂无</p>'}</div>
          </div>
          <div class="hot-panel">
            <div class="hot-panel-title">最新更新</div>
            <div class="hot-list">${sidebarLatest.length ? sidebarLatest.map(renderHotItem).join('') : '<p class="sidebar-empty">暂无</p>'}</div>
          </div>
        </aside>
      </div>
    </div>`;
}

function renderPagination(category, route, current, total) {
  if (total <= 1) return '';
  const { filter = '', sub = '' } = route;
  const hrefFor = (p) => categoryHref(category, { page: p, filter, sub });

  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 2) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return `
    <div class="pagination category-pagination">
      <a class="page-btn" href="${hrefFor(1)}">首页</a>
      <a class="page-btn${current <= 1 ? ' disabled' : ''}" href="${current <= 1 ? 'javascript:void(0)' : hrefFor(current - 1)}">上一页</a>
      <span class="page-info">${current}/${total}</span>
      ${pages
        .map((p) =>
          p === '…'
            ? '<span class="page-ellipsis">…</span>'
            : `<a class="page-btn${p === current ? ' active' : ''}" href="${hrefFor(p)}">${p}</a>`,
        )
        .join('')}
      <a class="page-btn${current >= total ? ' disabled' : ''}" href="${current >= total ? 'javascript:void(0)' : hrefFor(current + 1)}">下一页</a>
      <a class="page-btn" href="${hrefFor(total)}">尾页</a>
    </div>`;
}

function searchHref(keyword, page = 1) {
  const q = new URLSearchParams({ q: keyword });
  if (page > 1) q.set('page', String(page));
  return `#/search?${q}`;
}

function renderSearchResultItem(video) {
  const poster = posterUrl(video, '180/260');
  const actors = (video.actors || []).join(', ');
  const playHref = `#/play/${video.id}/${video.playSid || 1}/${video.playNid || 1}`;
  return `
    <li class="search-result-item" data-id="${video.id}">
      <div class="search-thumb">
        <a href="#/vod/${video.id}">
          <img src="${poster}" alt="${escapeHtml(video.title)}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${posterUrl(video, '180/260')}'" />
          <span class="video-badge">${escapeHtml(video.status || '更新中')}</span>
        </a>
      </div>
      <div class="search-detail">
        <h3 class="search-title"><a href="#/vod/${video.id}">${escapeHtml(video.title)}</a></h3>
        <p><span class="text-muted">导演：</span>${escapeHtml(video.director || '内详')}</p>
        <p><span class="text-muted">主演：</span>${escapeHtml(actors || '内详')}</p>
        <p class="search-meta-line">
          <span class="text-muted">类型：</span>${escapeHtml(video.subCategory || '未知')}
          <span class="split-line"></span>
          <span class="text-muted">地区：</span>${escapeHtml(video.area || '未知')}
          <span class="split-line"></span>
          <span class="text-muted">年份：</span>${video.year || ''}
        </p>
        <p class="search-actions">
          <a class="btn btn-min btn-primary" href="${playHref}">立即播放</a>
          <a class="btn btn-min btn-default" href="#/vod/${video.id}">查看详情</a>
        </p>
      </div>
    </li>`;
}

function renderSearchRankItem(video, index) {
  return `
    <div class="rank-item" data-id="${video.id}">
      <span class="rank-num">${index + 1}</span>
      <div class="rank-info">
        <div class="rank-name">${escapeHtml(video.title)}</div>
        ${video.status ? `<div class="rank-status">${escapeHtml(video.status)}</div>` : ''}
      </div>
    </div>`;
}

function renderSearchPagination(keyword, current, total) {
  if (total <= 1) return '';
  const hrefFor = (p) => searchHref(keyword, p);
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 2) pages.push(i);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }
  return `
    <div class="pagination category-pagination">
      <a class="page-btn" href="${hrefFor(1)}">首页</a>
      <a class="page-btn${current <= 1 ? ' disabled' : ''}" href="${current <= 1 ? 'javascript:void(0)' : hrefFor(current - 1)}">上一页</a>
      <span class="page-info">${current}/${total}</span>
      ${pages
        .map((p) =>
          p === '…'
            ? '<span class="page-ellipsis">…</span>'
            : `<a class="page-btn${p === current ? ' active' : ''}" href="${hrefFor(p)}">${p}</a>`,
        )
        .join('')}
      <a class="page-btn${current >= total ? ' disabled' : ''}" href="${current >= total ? 'javascript:void(0)' : hrefFor(current + 1)}">下一页</a>
      <a class="page-btn" href="${hrefFor(total)}">尾页</a>
    </div>`;
}

function renderSearchPage(keyword, results, pageData, page = 1) {
  const useSourceLayout = sourceEnabled && pageData;
  document.title = useSourceLayout
    ? formatPageTitle(pageData.pageTitle, `${keyword}搜索结果 - ${SITE.name}`)
    : `搜索: ${keyword} - ${SITE.name}`;

  const currentPage = useSourceLayout ? pageData.pagination?.current || page : 1;
  const totalPages = useSourceLayout ? pageData.pagination?.total || 1 : 1;
  const movieHot = useSourceLayout ? (pageData.movieHot || []).map(normalizeSourceVideo) : [];
  const tvHot = useSourceLayout ? (pageData.tvHot || []).map(normalizeSourceVideo) : [];

  return `
    <div class="breadcrumb">
      <a href="#/">首页</a><span>&gt;</span>搜索结果
    </div>
    <div class="page-card search-page">
      <div class="search-page-head">
        <h2 class="search-keyword">${escapeHtml(keyword)}</h2>
        ${sourceEnabled ? '<span class="source-badge">资源站</span>' : ''}
      </div>
      <div class="search-layout">
        <div class="search-main">
          ${
            results.length
              ? `<ul class="search-result-list">${results.map(renderSearchResultItem).join('')}</ul>`
              : `<div class="search-empty"><div class="icon">🔍</div><p>未找到相关内容，试试其他关键词</p></div>`
          }
          ${useSourceLayout ? renderSearchPagination(keyword, currentPage, totalPages) : ''}
        </div>
        ${
          useSourceLayout
            ? `<aside class="search-sidebar">
          <div class="hot-panel">
            <div class="hot-panel-title">电影热播榜</div>
            <div class="rank-list">${movieHot.length ? movieHot.map((v, i) => renderSearchRankItem(v, i)).join('') : '<p class="sidebar-empty">暂无</p>'}</div>
          </div>
          <div class="hot-panel">
            <div class="hot-panel-title">电视剧热播榜</div>
            <div class="rank-list">${tvHot.length ? tvHot.map((v, i) => renderSearchRankItem(v, i)).join('') : '<p class="sidebar-empty">暂无</p>'}</div>
          </div>
        </aside>`
            : ''
        }
      </div>
      ${
        !useSourceLayout
          ? `<div class="search-header">共找到 <strong>${results.length}</strong> 条结果</div>`
          : ''
      }
    </div>`;
}

function getPlaySources(video) {
  if (video.playSources?.length) return video.playSources;
  if (!video.episodes?.length) return [];
  const bySource = new Map();
  for (const ep of video.episodes) {
    const name = ep.sourceName || '播放';
    if (!bySource.has(name)) bySource.set(name, []);
    bySource.get(name).push(ep);
  }
  return [...bySource.entries()].map(([name, episodes]) => ({ name, episodes }));
}

function getFirstEpisode(video) {
  const sources = getPlaySources(video);
  return sources[0]?.episodes?.[0] || video.episodes?.[0] || null;
}

function isSeriesVideo(video) {
  const sources = getPlaySources(video);
  const totalEps = sources.reduce((n, s) => n + s.episodes.length, 0);
  return totalEps > 1 || /集/.test(video.status || '');
}

function renderPlaySourcePanels(video, activeSid, activeNid) {
  const sources = getPlaySources(video);
  if (!sources.length) {
    return '<div class="source-panel"><p class="sidebar-empty">暂无播放源</p></div>';
  }
  const isSeries = isSeriesVideo(video);

  return sources
    .map((source) => {
      const scrollable = source.episodes.length > 30;
      const useGrid = isSeries && source.episodes.length > 1;
      const listClass = useGrid
        ? `source-playlist source-playlist-grid${source.episodes.length > 5 ? ' cols-6' : ''}`
        : 'source-playlist';

      return `
    <div class="source-panel playlist-panel">
      <h3 class="panel-title">
        ${escapeHtml(source.name)}
        ${useGrid ? `<span class="ep-count">${source.episodes.length}集</span>` : ''}
      </h3>
      <div class="source-panel-body${scrollable ? ' is-scroll' : ''}">
        <ul class="${listClass}">
          ${source.episodes
            .map((ep) => {
              const active = activeSid === ep.sid && activeNid === ep.nid;
              const external = ep.external || ep.playUrl?.startsWith('http');
              if (external) {
                return `<li><a class="source-ep external" href="${escapeHtml(ep.playUrl || '#')}" target="_blank" rel="noopener">${escapeHtml(ep.name)}</a></li>`;
              }
              return `<li><a class="source-ep${active ? ' active' : ''}" href="#/play/${video.id}/${ep.sid}/${ep.nid}">${escapeHtml(ep.name)}</a></li>`;
            })
            .join('')}
        </ul>
      </div>
    </div>`;
    })
    .join('');
}

function renderDetailSidebars(hotList, latestList) {
  const hot = (hotList || []).map(normalizeSourceVideo);
  const latest = (latestList || []).map(normalizeSourceVideo);
  if (!hot.length && !latest.length) return '';
  return `
    <aside class="detail-sidebar">
      ${
        hot.length
          ? `<div class="hot-panel"><div class="hot-panel-title">本周热门</div><div class="hot-list">${hot.map(renderHotItem).join('')}</div></div>`
          : ''
      }
      ${
        latest.length
          ? `<div class="hot-panel"><div class="hot-panel-title">最新更新</div><div class="hot-list">${latest.map(renderHotItem).join('')}</div></div>`
          : ''
      }
    </aside>`;
}

function renderDescBlock(video, { showLabel = true } = {}) {
  const sketch = video.descriptionSketch || video.description || '暂无简介';
  const full = video.descriptionFull || video.description || sketch;
  const expandable = full.length > sketch.length + 10;
  return `
    <p class="detail-desc-block desc${showLabel ? '' : ' no-label'}${expandable ? '' : ' no-expand'}">
      ${showLabel ? '<span class="left text-muted">简介：</span>' : ''}
      <span class="desc-sketch">${escapeHtml(sketch)}</span>
      ${expandable ? `<span class="desc-full">${escapeHtml(full)}</span>` : ''}
      ${expandable ? '<button type="button" class="detail-more-btn">详情</button>' : ''}
    </p>`;
}

function renderDetailPage(video) {
  const meta = CATEGORY_META[video.category] || CATEGORY_META.movie;
  document.title = formatPageTitle(video.pageTitle, `${video.title} - ${SITE.name}`);

  const related = video.source
    ? (video.relatedVideos || []).map(normalizeSourceVideo)
    : getRelatedVideos(video.id);
  const firstEp = getFirstEpisode(video);
  const playHref = firstEp ? `#/play/${video.id}/${firstEp.sid || 1}/${firstEp.nid || 1}` : '#';
  const series = isSeriesVideo(video);

  return `
    <div class="breadcrumb">
      <a href="#/">首页</a><span>&gt;</span>
      <a href="#/category/${video.category}">${escapeHtml(meta.label)}</a>
      <span>&gt;</span>${escapeHtml(video.title)}
    </div>
    <div class="page-card detail-page-v2">
      <div class="detail-layout">
        <div class="detail-main">
          <div class="detail-header-block">
            <div class="detail-cover">
              <a class="detail-cover-link" href="${playHref}" aria-label="立即播放">
                <img src="${posterUrl(video, '300/450')}" alt="${escapeHtml(video.title)}" loading="lazy" decoding="async" />
                <span class="detail-cover-play" aria-hidden="true">▶</span>
                <span class="detail-status">${escapeHtml(video.status || '更新中')}</span>
              </a>
            </div>
            <div class="detail-head-info">
              <h1>${escapeHtml(video.title)}</h1>
              <p class="detail-data"><span class="text-muted">主演：</span>${escapeHtml((video.actors || []).join(' ') || '未知')}</p>
              <p class="detail-data"><span class="text-muted">导演：</span>${escapeHtml(video.director || '内详')}</p>
              <p class="detail-data detail-data-inline">
                <span class="text-muted">类型：</span>${escapeHtml(video.subCategory || '未知')}
                <span class="split-line"></span>
                <span class="text-muted">地区：</span>${escapeHtml(video.area || '未知')}
                <span class="split-line"></span>
                <span class="text-muted">年份：</span>${video.year || ''}
              </p>
              ${video.updatedTime ? `<p class="detail-data"><span class="text-muted">时间：</span>${escapeHtml(video.updatedTime)}</p>` : ''}
              ${renderDescBlock(video)}
              <div class="detail-action-btns play-btn-row">
                ${firstEp ? `<a class="btn btn-min btn-primary" href="${playHref}">立即播放</a>` : ''}
                ${series ? `<a class="btn btn-min btn-default" href="#detail-sources">选集</a>` : ''}
              </div>
            </div>
          </div>
          <div class="detail-sources" id="detail-sources">
            ${renderPlaySourcePanels(video)}
          </div>
          ${
            related.length
              ? `<section class="guess-section"><h3 class="panel-title">猜你喜欢</h3><div class="video-grid">${related.map(renderVideoCard).join('')}</div></section>`
              : ''
          }
        </div>
        ${renderDetailSidebars(video.hotList, video.latestList)}
      </div>
    </div>`;
}

function renderSourcePlayerPage(video, playInfo, sid, nid) {
  const episode = (video.episodes || []).find((e) => e.sid === sid && e.nid === nid);
  const epName = episode?.name || `第${nid}集`;

  document.title = playInfo.vod?.vod_name
    ? `${playInfo.vod.vod_name} - ${SITE.name}`
    : `正在播放: ${video.title} ${epName} - ${SITE.name}`;

  addHistory({
    videoId: video.id,
    title: video.title,
    poster: video.poster,
    episode: epName,
    episodeIndex: nid,
    sid,
    nid,
    source: true,
    watchedAt: new Date().toISOString(),
  });

  const episodes = video.episodes || [];
  const idx = episodes.findIndex((e) => e.sid === sid && e.nid === nid);
  const prev = idx > 0 ? episodes[idx - 1] : playInfo.linkPre ? null : null;
  const next = idx >= 0 && idx < episodes.length - 1 ? episodes[idx + 1] : null;
  const related = (video.relatedVideos || []).map(normalizeSourceVideo);

  return `
    <div class="player-page-v2">
      <div class="player-top-bar">
        <div class="player-top-actions">
          ${prev ? `<a href="#/play/${video.id}/${prev.sid}/${prev.nid}">上一集</a>` : '<span class="disabled">上一集</span>'}
          ${next ? `<a href="#/play/${video.id}/${next.sid}/${next.nid}">下一集</a>` : '<span class="disabled">下一集</span>'}
          <a href="#/vod/${video.id}">${escapeHtml(video.title)}</a>
        </div>
        <button type="button" class="player-mode-btn" data-iframe-url="${escapeHtml(playInfo.iframeUrl)}" data-embed-url="${escapeHtml(playInfo.embedUrl)}">切换模式</button>
      </div>
      <div class="player-wrap player-iframe-wrap">
        <iframe
          class="player-iframe"
          src="${escapeHtml(playInfo.iframeUrl)}"
          allowfullscreen
          allow="autoplay; fullscreen"
          referrerpolicy="no-referrer"
          sandbox="allow-same-origin allow-forms allow-scripts allow-modals allow-popups allow-presentation"
        ></iframe>
      </div>
      <div class="page-card player-detail-card">
        <div class="detail-layout">
          <div class="detail-main">
            <div class="player-vod-head">
              <h1>${escapeHtml(video.title)}</h1>
              <p class="detail-data detail-data-inline">
                <span class="text-muted">类型：</span>${escapeHtml(video.subCategory || '未知')}
                <span class="split-line"></span>
                <span class="text-muted">地区：</span>${escapeHtml(video.area || '未知')}
                <span class="split-line"></span>
                <span class="text-muted">年份：</span>${video.year || ''}
              </p>
            </div>
            <div class="detail-sources episode-select-section">${renderPlaySourcePanels(video, sid, nid)}</div>
            <section class="synopsis-section">
              <h3 class="panel-title">剧情简介</h3>
              ${renderDescBlock(video, { showLabel: false })}
            </section>
            ${
              related.length
                ? `<section class="guess-section"><h3 class="panel-title">猜你喜欢</h3><div class="video-grid">${related.map(renderVideoCard).join('')}</div></section>`
                : ''
            }
          </div>
          ${renderDetailSidebars(video.hotList, video.latestList)}
        </div>
      </div>
    </div>`;
}

function renderMockPlayerPage(video, epIndex) {
  const idx = Math.min(Math.max(0, epIndex), video.episodes.length - 1);
  const episode = video.episodes[idx];

  document.title = `正在播放: ${video.title} ${episode.name} - ${SITE.name}`;

  addHistory({
    videoId: video.id,
    title: video.title,
    poster: video.poster,
    episode: episode.name,
    episodeIndex: idx,
    watchedAt: new Date().toISOString(),
  });

  return `
    <div class="player-page">
      <div class="player-wrap">
        <video controls autoplay src="${episode.url}" poster="${video.poster}">您的浏览器不支持视频播放</video>
      </div>
      <div class="player-info">
        <h1>${escapeHtml(video.title)} - ${escapeHtml(episode.name)}</h1>
        <div class="player-nav">
          <a href="#/vod/${video.id}">返回详情</a>
          ${idx <= 0 ? '<button disabled>上一集</button>' : `<a class="play-btn" href="#/play/${video.id}/${idx - 1}">上一集</a>`}
          ${idx >= video.episodes.length - 1 ? '<button disabled>下一集</button>' : `<a class="play-btn" href="#/play/${video.id}/${idx + 1}">下一集</a>`}
        </div>
      </div>
    </div>`;
}

function renderHistoryPage() {
  document.title = `播放记录 - ${SITE.name}`;
  const history = getHistory();

  return `
    <div class="breadcrumb"><a href="#/">首页</a><span>&gt;</span>播放记录</div>
    <div class="page-card simple-page">
      <h2>播放记录</h2>
      ${
        history.length
          ? `${history
              .map((h) => {
                const playHref = h.source
                  ? `#/play/${h.videoId}/${h.sid || 1}/${h.nid || 1}`
                  : `#/play/${h.videoId}/${h.episodeIndex}`;
                return `
            <div class="history-item" data-href="${playHref}">
              <div class="history-thumb"><img src="${h.poster}" alt="" /></div>
              <div class="history-info">
                <div class="history-title">${escapeHtml(h.title)}</div>
                <div class="history-ep">看到：${escapeHtml(h.episode)}</div>
                <div class="history-time">${new Date(h.watchedAt).toLocaleString('zh-CN')}</div>
              </div>
            </div>`;
              })
              .join('')}
          <button class="clear-btn" id="clear-history">清空记录</button>`
          : '<div class="search-empty"><div class="icon">📋</div><p>暂无播放记录</p></div>'
      }
    </div>`;
}

function renderRequestPage() {
  document.title = `求片留言 - ${SITE.name}`;
  return `
    <div class="breadcrumb"><a href="#/">首页</a><span>&gt;</span>求片留言</div>
    <div class="page-card simple-page">
      <h2>求片留言</h2>
      <p style="margin-bottom:16px;color:#888;font-size:13px">找不到想看的影片？留下片名和联系方式，我们会尽快处理。</p>
      <form class="request-form" id="request-form">
        <div class="form-group"><label for="req-title">片名 *</label><input id="req-title" name="title" required placeholder="请输入想看的影片名称" /></div>
        <div class="form-group"><label for="req-contact">联系方式</label><input id="req-contact" name="contact" placeholder="邮箱或微信号（选填）" /></div>
        <div class="form-group"><label for="req-note">补充说明</label><textarea id="req-note" name="note" placeholder="版本要求、清晰度等（选填）"></textarea></div>
        <button class="submit-btn" type="submit">提交留言</button>
      </form>
    </div>`;
}

function renderNotFound() {
  document.title = `页面未找到 - ${SITE.name}`;
  return `<div class="page-card simple-page"><div class="search-empty"><div class="icon">😕</div><p>页面不存在</p><a href="#/" style="margin-top:12px;display:inline-block;color:var(--accent)">返回首页</a></div></div>`;
}

function parseRoute() {
  const hash = location.hash.slice(1) || '/';
  const [pathPart, queryPart] = hash.split('?');
  const params = new URLSearchParams(queryPart || '');
  const parts = pathPart.split('/').filter(Boolean);

  if (!parts.length) return { view: 'home' };

  if (parts[0] === 'category' && parts[1]) {
    return {
      view: 'category',
      category: parts[1],
      sub: params.get('sub') || '',
      filter: params.get('filter') || '',
      page: parseInt(params.get('page') || '1', 10),
    };
  }
  if (parts[0] === 'search') {
    return {
      view: 'search',
      keyword: params.get('q') || '',
      page: parseInt(params.get('page') || '1', 10),
    };
  }
  if (parts[0] === 'vod' && parts[1]) return { view: 'detail', id: parseInt(parts[1], 10) };
  if (parts[0] === 'play' && parts[1]) {
    const id = parseInt(parts[1], 10);
    if (isSourceId(id)) {
      return { view: 'play', id, sid: parseInt(parts[2] || '1', 10), nid: parseInt(parts[3] || '1', 10), source: true };
    }
    return { view: 'play', id, ep: parseInt(parts[2] || '0', 10), source: false };
  }
  if (parts[0] === 'history') return { view: 'history' };
  if (parts[0] === 'request') return { view: 'request' };
  return { view: 'notfound' };
}

async function resolveVideo(id) {
  if (sourceCache.has(id)) return sourceCache.get(id);
  if (isSourceId(id)) {
    const vod = normalizeSourceVideo(await fetchVodDetail(id));
    sourceCache.set(id, vod);
    return vod;
  }
  return getVideoById(id);
}

async function renderRoute(route) {
  const main = $('#app-main');
  if (!main) return;

  stopCarousel();
  main.innerHTML = renderLoading();
  window.scrollTo(0, 0);

  let html;
  try {
    switch (route.view) {
      case 'home':
        html = await renderHomePage();
        break;
      case 'category': {
        let videos;
        let pageData = null;
        if (sourceEnabled) {
          pageData = await fetchCategoryPage(route.category, route.page, route.filter);
          videos = (pageData.items || []).map(normalizeSourceVideo);
        } else {
          videos = filterVideos(route.category, route.sub || undefined);
        }
        html = renderCategoryPage(route.category, route, videos, pageData);
        break;
      }
      case 'search': {
        if (!route.keyword) {
          html = renderNotFound();
          break;
        }
        let results;
        let searchData = null;
        if (sourceEnabled) {
          searchData = await searchSourcePage(route.keyword, route.page || 1);
          results = (searchData.items || []).map(normalizeSourceVideo);
        } else {
          results = searchVideos(route.keyword);
        }
        html = renderSearchPage(route.keyword, results, searchData, route.page);
        break;
      }
      case 'detail': {
        const video = await resolveVideo(route.id);
        html = video ? renderDetailPage(video) : renderNotFound();
        break;
      }
      case 'play': {
        if (route.source && isSourceId(route.id)) {
          const [video, playInfo] = await Promise.all([
            resolveVideo(route.id),
            fetchPlayInfo(route.id, route.sid, route.nid),
          ]);
          if (!video) html = renderNotFound();
          else html = renderSourcePlayerPage(video, playInfo, route.sid, route.nid);
        } else {
          const video = getVideoById(route.id);
          html = video ? renderMockPlayerPage(video, route.ep) : renderNotFound();
        }
        break;
      }
      case 'history':
        html = renderHistoryPage();
        break;
      case 'request':
        html = renderRequestPage();
        break;
      default:
        html = renderNotFound();
    }
  } catch (err) {
    html = renderError(err.message || '加载失败');
  }

  main.innerHTML = html;
  updateNavActive(route);
  bindPageEvents(route);
  if (route.view === 'home') startCarousel();
}

function updateNavActive(route) {
  $$('.nav-links a').forEach((a) => a.classList.remove('active'));
  if (route.view === 'home') $('.nav-links a[href="#/"]')?.classList.add('active');
  else if (route.view === 'category') $(`.nav-links a[href="#/category/${route.category}"]`)?.classList.add('active');
}

function navigateTo(path) {
  location.hash = path;
}

function bindGlobalEvents() {
  if (bindGlobalEvents._abort) bindGlobalEvents._abort.abort();
  const ac = new AbortController();
  bindGlobalEvents._abort = ac;
  const { signal } = ac;

  $('#search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#search-input')?.value.trim();
    if (q) navigateTo(`/search?q=${encodeURIComponent(q)}`);
  }, { signal });

  $('.logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/');
  }, { signal });

  $$('.header-action').forEach((el) => {
    el.addEventListener('click', () => {
      const action = el.dataset.action;
      if (action === 'request') navigateTo('/request');
      if (action === 'history') navigateTo('/history');
    }, { signal });
  });

  $('#user-menu-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    $('#user-menu')?.classList.toggle('open');
  }, { signal });

  document.addEventListener('click', () => $('#user-menu')?.classList.remove('open'), { signal });

  $('#user-menu')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    e.stopPropagation();
    $('#user-menu')?.classList.remove('open');
    if (btn.dataset.action === 'change-password') openChangePasswordModal();
    if (btn.dataset.action === 'logout') {
      logout();
      showToast('已退出登录');
      authView = 'login';
      stopCarousel();
      bindGlobalEvents._abort?.abort();
      bindGlobalEvents._abort = null;
      closeChangePasswordModal();
      renderAuthPage();
      bindAuthEvents();
    }
  }, { signal });

  window.addEventListener('hashchange', () => {
    if (!isLoggedIn()) return;
    renderRoute(parseRoute());
  }, { signal });
}

function bindPageEvents(route) {
  const main = $('#app-main');

  main?.addEventListener('click', (e) => {
    const historyItem = e.target.closest('.history-item[data-href]');
    if (historyItem) {
      navigateTo(historyItem.dataset.href.replace('#', ''));
      return;
    }

    const card = e.target.closest('.video-card, .hot-item, .search-result-item, .rank-item');
    if (card?.dataset.id) {
      const playBtn = e.target.closest('.btn-primary[href*="/play/"]');
      if (playBtn) return;
      navigateTo(`/vod/${card.dataset.id}`);
      return;
    }

    const slide = e.target.closest('.carousel-slide');
    if (slide?.dataset.videoId) {
      navigateTo(`/vod/${slide.dataset.videoId}`);
      return;
    }

    const dot = e.target.closest('.carousel-dot');
    if (dot) {
      goToSlide(parseInt(dot.dataset.index, 10));
      return;
    }

    const sourceEp = e.target.closest('.episode-btn[data-source-play]');
    if (sourceEp) {
      navigateTo(`/play/${sourceEp.dataset.videoId}/${sourceEp.dataset.sid}/${sourceEp.dataset.nid}`);
      return;
    }

    const epBtn = e.target.closest('.episode-btn[data-ep-index]');
    if (epBtn) {
      navigateTo(`/play/${epBtn.dataset.videoId}/${epBtn.dataset.epIndex}`);
      return;
    }

    const moreBtn = e.target.closest('.detail-more-btn');
    if (moreBtn) {
      const block = moreBtn.closest('.detail-desc-block');
      if (block) {
        block.classList.toggle('expanded');
        moreBtn.textContent = block.classList.contains('expanded') ? '收起' : '详情';
      }
    }
  });

  $('#clear-history')?.addEventListener('click', () => {
    clearHistory();
    showToast('播放记录已清空');
    renderRoute(parseRoute());
  });

  $('#request-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addRequest({ title: fd.get('title'), contact: fd.get('contact'), note: fd.get('note') });
    e.target.reset();
    showToast('留言提交成功，感谢您的反馈！');
  });

  $('.app-promo-btn')?.addEventListener('click', () => showToast('APP 下载功能演示'));

  $('.player-mode-btn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const iframe = $('.player-iframe');
    if (!iframe) return;
    const isEmbed = iframe.dataset.mode === 'embed';
    iframe.src = isEmbed ? btn.dataset.iframeUrl : btn.dataset.embedUrl;
    iframe.dataset.mode = isEmbed ? 'parse' : 'embed';
    btn.textContent = isEmbed ? '切换嵌入模式' : '切换解析模式';
    showToast(isEmbed ? '已切换为解析播放' : '已切换为源站嵌入');
  });

  $$('.pagination .page-btn.disabled').forEach((btn) => {
    btn.addEventListener('click', (e) => e.preventDefault());
  });
}

function startCarousel() {
  stopCarousel();
  carouselIndex = 0;
  const dotCount = $$('.carousel-dot').length || 1;
  carouselTimer = setInterval(() => goToSlide((carouselIndex + 1) % dotCount), 4000);
}

function stopCarousel() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

function goToSlide(index) {
  carouselIndex = index;
  const track = $('.carousel-track');
  const dots = $$('.carousel-dot');
  if (track) track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

function renderAuthPage() {
  const app = $('#app');
  if (!app) return;

  const isForgot = authView === 'forgot';
  app.innerHTML = `
    <div class="auth-gate">
      <div class="auth-card">
        <div class="auth-brand">
          <span class="auth-logo">🌿</span>
          <h1>${escapeHtml(SITE.name)}</h1>
          <p>登录后观看影片</p>
        </div>
        ${
          isForgot
            ? `
        <form class="auth-form" id="forgot-form">
          <h2>找回密码</h2>
          <p class="auth-hint">请输入绑定的手机号码，验证通过后可重新设置密码。</p>
          <label class="auth-field">
            <span>手机号码</span>
            <input type="tel" name="phone" placeholder="请输入手机号码" autocomplete="tel" required />
          </label>
          <label class="auth-field">
            <span>新密码</span>
            <input type="password" name="newPassword" placeholder="至少 3 位" minlength="3" required />
          </label>
          <label class="auth-field">
            <span>确认新密码</span>
            <input type="password" name="confirmPassword" placeholder="再次输入新密码" minlength="3" required />
          </label>
          <button type="submit" class="auth-submit">重置密码</button>
          <button type="button" class="auth-link-btn" data-auth-view="login">返回登录</button>
        </form>`
            : `
        <form class="auth-form" id="login-form">
          <h2>账号登录</h2>
          <label class="auth-field">
            <span>账号</span>
            <input type="text" name="username" placeholder="请输入账号" autocomplete="username" required />
          </label>
          <label class="auth-field">
            <span>密码</span>
            <input type="password" name="password" placeholder="请输入密码" autocomplete="current-password" required />
          </label>
          <button type="submit" class="auth-submit">登录</button>
          <button type="button" class="auth-link-btn" data-auth-view="forgot">忘记密码？</button>
        </form>`
        }
        <p class="auth-foot">纯前端演示登录 · 数据保存在本机浏览器</p>
      </div>
    </div>`;
}

function renderChangePasswordModal() {
  if ($('#auth-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-modal-backdrop" data-close-modal></div>
    <div class="auth-modal-card">
      <div class="auth-modal-head">
        <h3>修改密码</h3>
        <button type="button" class="auth-modal-close" data-close-modal aria-label="关闭">×</button>
      </div>
      <form class="auth-form" id="change-password-form">
        <label class="auth-field">
          <span>当前密码</span>
          <input type="password" name="oldPassword" required autocomplete="current-password" />
        </label>
        <label class="auth-field">
          <span>新密码</span>
          <input type="password" name="newPassword" minlength="3" required autocomplete="new-password" />
        </label>
        <label class="auth-field">
          <span>确认新密码</span>
          <input type="password" name="confirmPassword" minlength="3" required autocomplete="new-password" />
        </label>
        <button type="submit" class="auth-submit">保存修改</button>
      </form>
    </div>`;
  document.body.appendChild(modal);
}

function openChangePasswordModal() {
  renderChangePasswordModal();
  $('#auth-modal')?.classList.add('open');
}

function closeChangePasswordModal() {
  $('#auth-modal')?.classList.remove('open');
  $('#change-password-form')?.reset();
}

function bindAuthEvents() {
  const app = $('#app');
  if (!app) return;

  app.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('[data-auth-view]');
    if (viewBtn) {
      authView = viewBtn.dataset.authView === 'forgot' ? 'forgot' : 'login';
      renderAuthPage();
      bindAuthEvents();
    }
  });

  $('#login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const result = login(String(fd.get('username') || ''), String(fd.get('password') || ''));
    if (!result.ok) {
      showToast(result.message || '登录失败');
      return;
    }
    showToast('登录成功');
    startApp();
  });

  $('#forgot-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newPassword = String(fd.get('newPassword') || '');
    const confirmPassword = String(fd.get('confirmPassword') || '');
    if (newPassword !== confirmPassword) {
      showToast('两次输入的新密码不一致');
      return;
    }
    const result = resetPasswordByPhone(String(fd.get('phone') || ''), newPassword);
    if (!result.ok) {
      showToast(result.message || '重置失败');
      return;
    }
    showToast(result.message || '密码已重置');
    authView = 'login';
    renderAuthPage();
    bindAuthEvents();
  });
}

function bindAuthModalEvents() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]')) closeChangePasswordModal();
  });

  $('#change-password-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newPassword = String(fd.get('newPassword') || '');
    const confirmPassword = String(fd.get('confirmPassword') || '');
    if (newPassword !== confirmPassword) {
      showToast('两次输入的新密码不一致');
      return;
    }
    const result = changePassword(String(fd.get('oldPassword') || ''), newPassword);
    if (!result.ok) {
      showToast(result.message || '修改失败');
      return;
    }
    showToast(result.message || '密码已修改');
    closeChangePasswordModal();
  });
}

function initShell() {
  const app = $('#app');
  if (!app) return;

  app.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="logo" href="#/">
          <span class="logo-stars">🌿</span>
          <div class="logo-text"><h1>${SITE.name}</h1><span>${SITE.pinyin}</span></div>
        </a>
        <form class="search-box" id="search-form">
          <input id="search-input" type="search" placeholder="请输入关键词..." autocomplete="off" />
          <button type="submit" aria-label="搜索">🔍</button>
        </form>
        <div class="header-actions">
          <div class="header-action" data-action="request"><span class="icon">💬</span><span>求片留言</span></div>
          <div class="header-action" data-action="history"><span class="icon">🕐</span><span>播放记录</span></div>
          <div class="header-user">
            <button type="button" class="header-user-btn" id="user-menu-btn" aria-haspopup="true">
              <span class="icon">👤</span>
              <span>${escapeHtml(getCurrentUser() || '用户')}</span>
            </button>
            <div class="header-user-menu" id="user-menu">
              <button type="button" data-action="change-password">修改密码</button>
              <button type="button" data-action="logout">退出登录</button>
            </div>
          </div>
        </div>
      </div>
    </header>
    <nav class="site-nav">
      <div class="nav-inner">
        <div class="nav-links">${NAV_ITEMS.map((n) => `<a href="#${n.path}"${n.key === 'home' ? ' class="active"' : ''}>${n.label}</a>`).join('')}</div>
        <div class="nav-update">今日更新 <em>'${SITE.todayUpdate}'</em> 部影片</div>
      </div>
    </nav>
    <main class="main-wrap" id="app-main"></main>
    <footer class="site-footer">
      <p>Copyright © ${new Date().getFullYear()} All Rights Reserved ${SITE.name}</p>
      <p style="margin-top:8px;max-width:700px;margin-left:auto;margin-right:auto">本站所有视频和图片均来自互联网收集而来，版权归原创者所有，本网站只提供web页面服务，并不提供资源存储，也不参与录制、上传。若本站收录的节目无意侵犯了贵司版权，请留言板说明问题，我们会尽快删除侵权内容，谢谢。</p>
    </footer>`;
}

async function startApp() {
  initShell();
  bindGlobalEvents();
  sourceEnabled = await isApiAvailable();
  if (!location.hash) location.hash = '/';
  await renderRoute(parseRoute());
}

async function init() {
  initAuthStore();
  bindAuthModalEvents();
  if (!isLoggedIn()) {
    renderAuthPage();
    bindAuthEvents();
    return;
  }
  await startApp();
}

init();
