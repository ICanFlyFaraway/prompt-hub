import { loadLocale, t, localizeField, getLocale, getOtherLocale } from './i18n.js';
import {
  CONTRIBUTORS,
  POPULAR_TAGS,
  AI_TOOLS,
  CATEGORY_IDS,
  getPromptIndex,
  getPromptFull,
  getPromptCountByModel,
  getPromptCountByCategory,
  loadChunk,
  ensureChunksForItems,
  startBackgroundLoad,
  getLoadProgress,
  isAllChunksLoaded
} from './data/prompts.js';

const TAB_COLORS = {
  chatgpt: '#10a37f',
  claude: '#a78bfa',
  midjourney: '#f59e0b',
  sd: '#3b82f6',
  gemini: '#f472b6',
  sora: '#f87171'
};

const CATEGORY_ICONS = {
  all: 'ti-layout-grid',
  writing: 'ti-pencil',
  coding: 'ti-code',
  image: 'ti-palette',
  marketing: 'ti-speakerphone',
  education: 'ti-school',
  business: 'ti-briefcase',
  roleplay: 'ti-messages',
  video: 'ti-video'
};

const PAGE_SIZE_OPTIONS = [12, 24, 48];

const state = {
  model: 'all',
  category: 'all',
  search: '',
  tag: null,
  featuredOnly: false,
  page: 1,
  pageSize: Number(localStorage.getItem('ph-page-size')) || 24,
  favorites: new Set(JSON.parse(localStorage.getItem('ph-favorites') || '[]'))
};

let toastTimer;
let resizeTimer;
let filteredCache = null;
let filterCacheKey = '';
let gridLoading = false;

function getPromptList() {
  return getPromptIndex();
}

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $$(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function saveFavorites() {
  localStorage.setItem('ph-favorites', JSON.stringify([...state.favorites]));
}

function getTheme() {
  return localStorage.getItem('ph-theme') || 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ph-theme', theme);
  const icon = $('#theme-toggle i');
  if (icon) {
    icon.className = theme === 'light' ? 'ti ti-moon' : 'ti ti-sun';
  }
}

function showToast(msg) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(t('card.copied'));
  } catch {
    showToast('Copy failed');
  }
}

function resolveCategoryFromTag(tag) {
  if (!tag) return null;
  const lower = tag.toLowerCase();
  for (const id of CATEGORY_IDS) {
    const label = t(`categories.${id}`).toLowerCase();
    if (label === lower || label.includes(lower) || lower.includes(label)) return id;
  }
  return null;
}

function hasActiveFilters() {
  return (
    state.model !== 'all' ||
    state.category !== 'all' ||
    state.tag ||
    state.featuredOnly ||
    state.search.trim()
  );
}

function filterStateKey() {
  return [
    state.model,
    state.category,
    state.search,
    state.tag,
    state.featuredOnly,
    getLocale()
  ].join('|');
}

function getFilteredList() {
  const key = filterStateKey();
  if (filteredCache && filterCacheKey === key) return filteredCache;
  filteredCache = filteredPromptsUncached();
  filterCacheKey = key;
  return filteredCache;
}

function invalidateFilterCache() {
  filteredCache = null;
  filterCacheKey = '';
}

function applyFilters(updates = {}, { scroll = false, resetPage = true } = {}) {
  Object.assign(state, updates);
  if (resetPage) state.page = 1;
  invalidateFilterCache();
  if (state.category !== 'all') void loadChunk(state.category);
  refreshFilterUI({ scroll });
}

function resetFilters({ scroll = false } = {}) {
  state.model = 'all';
  state.category = 'all';
  state.tag = null;
  state.featuredOnly = false;
  state.search = '';
  state.page = 1;
  const input = $('#search-input');
  if (input) input.value = '';
  invalidateFilterCache();
  refreshFilterUI({ scroll });
}

function getResponsiveDefaultPageSize() {
  const w = window.innerWidth;
  if (w < 520) return 12;
  if (w < 900) return 18;
  return 24;
}

function getEffectivePageSize() {
  const stored = state.pageSize;
  if (PAGE_SIZE_OPTIONS.includes(stored)) return stored;
  return getResponsiveDefaultPageSize();
}

function getPaginationMeta(list) {
  const pageSize = getEffectivePageSize();
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, state.page), totalPages);
  if (page !== state.page) state.page = page;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  return { page, pageSize, total, totalPages, start, end };
}

function tVar(key, vars = {}) {
  let s = t(key);
  Object.entries(vars).forEach(([k, v]) => {
    s = s.replaceAll(`{${k}}`, String(v));
  });
  return s;
}

function tPage(key, vars = {}) {
  return tVar(`pagination.${key}`, vars);
}

function scrollToPromptSection() {
  $('#prompt-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setMobileSidebarOpen(open) {
  const sidebar = $('#sidebar');
  const backdrop = $('#sidebar-backdrop');
  const btn = $('#mobile-filter-btn');
  if (!sidebar) return;
  sidebar.classList.toggle('open', open);
  backdrop?.classList.toggle('visible', open);
  if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}

function goToPage(page, { scroll = true } = {}) {
  const list = getFilteredList();
  const { totalPages } = getPaginationMeta(list);
  state.page = Math.min(Math.max(1, page), totalPages);
  renderPromptGrid();
  renderPagination();
  renderSectionTitle();
  if (scroll) scrollToPromptSection();
}

function refreshFilterUI({ scroll = false } = {}) {
  renderTabs();
  renderCategoryChips();
  renderSidebar();
  renderToolStrip();
  renderFilterBar();
  renderSectionTitle();
  renderLoadProgress();
  void renderPromptGrid();
  renderCrosslinks();
  updateNavActive();
  if (scroll) scrollToPromptSection();
}

function filteredPromptsUncached() {
  const q = state.search.trim().toLowerCase();
  return getPromptList().filter((p) => {
    if (state.featuredOnly && !p.featured) return false;
    if (state.model !== 'all' && p.model !== state.model) return false;
    if (state.category !== 'all' && p.category !== state.category) return false;
    if (state.tag) {
      const tags = (p.tags[getLocale()] || []).map((x) => x.toLowerCase());
      const qTag = state.tag.toLowerCase();
      if (!tags.some((tag) => tag.includes(qTag) || qTag.includes(tag))) return false;
    }
    if (!q) return true;
    const title = localizeField(p.title).toLowerCase();
    const desc = localizeField(p.description).toLowerCase();
    const tags = (p.tags[getLocale()] || []).join(' ').toLowerCase();
    const catLabel = t(`categories.${p.category}`).toLowerCase();
    return (
      title.includes(q) ||
      desc.includes(q) ||
      tags.includes(q) ||
      catLabel.includes(q)
    );
  });
}

function filteredPrompts() {
  return getFilteredList();
}

function renderLoadProgress() {
  const bar = $('#load-progress');
  if (!bar) return;
  const { done, total } = getLoadProgress();
  if (isAllChunksLoaded()) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  const pct = Math.round((done / total) * 100);
  bar.innerHTML = `
    <div class="load-progress-inner">
      <span class="load-progress-text">${tVar('loading.background', { done, total, pct })}</span>
      <div class="load-progress-track"><div class="load-progress-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function renderStats() {
  const list = getPromptList();
  const models = new Set(list.map((p) => p.model)).size;
  $('#stat-prompts').textContent = String(list.length);
  $('#stat-tools').textContent = String(models);
  $('#stat-categories').textContent = String(CATEGORY_IDS.length);
  $('#stat-contributors').textContent = String(CONTRIBUTORS.length);
}

function renderFilterBar() {
  const bar = $('#filter-bar');
  if (!bar) return;
  const chips = [];
  if (state.featuredOnly) {
    chips.push({ type: 'featured', label: t('sections.featured') });
  }
  if (state.category !== 'all') {
    chips.push({ type: 'category', value: state.category, label: t(`categories.${state.category}`) });
  }
  if (state.model !== 'all') {
    chips.push({ type: 'model', value: state.model, label: t(`tabs.${state.model}`) });
  }
  if (state.tag) {
    chips.push({ type: 'tag', value: state.tag, label: `#${state.tag}` });
  }
  if (state.search.trim()) {
    chips.push({ type: 'search', label: `"${state.search.trim()}"` });
  }

  if (chips.length === 0) {
    bar.classList.add('hidden');
    bar.innerHTML = '';
    return;
  }

  bar.classList.remove('hidden');
  bar.innerHTML =
    `<span class="filter-bar-label">${t('filters.active')}</span>` +
    chips
      .map(
        (c) =>
          `<button type="button" class="filter-chip" data-clear="${c.type}" data-value="${c.value || ''}">
            ${c.label} <i class="ti ti-x" aria-hidden="true"></i>
          </button>`
      )
      .join('') +
    `<button type="button" class="filter-clear-all" id="filter-clear-all">${t('filters.clearAll')}</button>`;

  $$('.filter-chip', bar).forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.clear;
      if (type === 'featured') applyFilters({ featuredOnly: false });
      else if (type === 'category') applyFilters({ category: 'all' });
      else if (type === 'model') applyFilters({ model: 'all' });
      else if (type === 'tag') applyFilters({ tag: null });
      else if (type === 'search') {
        state.search = '';
        $('#search-input').value = '';
        state.page = 1;
        invalidateFilterCache();
        refreshFilterUI();
      }
    });
  });
  $('#filter-clear-all', bar)?.addEventListener('click', () => resetFilters());
}

function renderSectionTitle() {
  const el = $('#section-title');
  if (!el) return;
  const list = getFilteredList();
  const { total, start, end } = getPaginationMeta(list);
  let title = t('sections.featured');
  if (state.category !== 'all') title = t(`categories.${state.category}`);
  else if (state.featuredOnly) title = t('sections.featured');
  else if (state.model !== 'all') title = t(`tabs.${state.model}`);
  else if (state.tag) title = `#${state.tag}`;
  else if (state.search.trim()) title = t('filters.searchResults');

  const range =
    total > 0
      ? ` · ${tPage('range', { start: total === 0 ? 0 : start + 1, end })}`
      : '';
  el.innerHTML = `${title} <span class="section-count">${total} ${t('filters.items')}${range}</span>`;
}

function updateNavActive() {
  $$('.nav-links a').forEach((a) => {
    a.classList.remove('active');
    const nav = a.dataset.nav;
    if (nav === 'all' && state.category === 'all' && !state.featuredOnly && state.model === 'all') {
      a.classList.add('active');
    } else if (nav === 'featured' && state.featuredOnly) {
      a.classList.add('active');
    } else if (nav === 'tools' && state.model !== 'all') {
      a.classList.add('active');
    }
  });
}

function renderCategoryChips() {
  const wrap = $('#category-chips');
  if (!wrap) return;
  const cats = ['all', ...CATEGORY_IDS];
  wrap.innerHTML = cats
    .map((id) => {
      const active =
        state.category === id && !state.featuredOnly ? ' active' : '';
      const count = getPromptCountByCategory(id);
      return `<button type="button" class="category-chip${active}" data-category="${id}">
        ${t(`categories.${id}`)} <span style="opacity:0.7">(${count})</span>
      </button>`;
    })
    .join('');
  $$('[data-category]', wrap).forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.category;
      applyFilters(
        {
          category: state.category === id && id !== 'all' ? 'all' : id,
          featuredOnly: false,
          tag: null
        },
        { scroll: true }
      );
      setMobileSidebarOpen(false);
    });
  });
}

function renderTabs() {
  const wrap = $('#tabs');
  const tabIds = ['all', 'chatgpt', 'claude', 'midjourney', 'sd', 'gemini', 'sora'];
  wrap.innerHTML = tabIds
    .map((id) => {
      const active = state.model === id ? ' active' : '';
      const dotStyle = id !== 'all' ? ` style="background:${TAB_COLORS[id]}"` : '';
      const count = id === 'all' ? getPromptList().length : getPromptCountByModel(id);
      return `<button class="tab${active}" data-model="${id}" type="button">
        <span class="dot"${dotStyle}></span>${t(`tabs.${id}`)}
        <span class="tab-count">${count}</span>
      </button>`;
    })
    .join('');
  $$('.tab', wrap).forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.model;
      applyFilters(
        { model: state.model === id && id !== 'all' ? 'all' : id, featuredOnly: false },
        { scroll: true }
      );
    });
  });
}

function renderSidebar() {
  const cats = ['all', ...CATEGORY_IDS];
  const catList = $('#category-list');
  if (!catList) return;
  catList.innerHTML = cats
    .map((id) => {
      const active = state.category === id && !state.featuredOnly ? ' active' : '';
      const count = getPromptCountByCategory(id);
      const icon = CATEGORY_ICONS[id];
      return `<button type="button" class="sidebar-item${active}" data-category="${id}">
        <i class="ti ${icon}" aria-hidden="true"></i>
        ${t(`categories.${id}`)}
        <span class="badge-count">${count}</span>
      </button>`;
    })
    .join('');

  $$('[data-category]', catList).forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.category;
      applyFilters(
        {
          category: state.category === id && id !== 'all' ? 'all' : id,
          featuredOnly: false,
          tag: null
        },
        { scroll: true }
      );
      setMobileSidebarOpen(false);
    });
  });

  const tagsEl = $('#popular-tags');
  const tags = POPULAR_TAGS[getLocale()] || POPULAR_TAGS.zh;
  tagsEl.innerHTML = tags
    .map((tag) => {
      const active = state.tag === tag ? ' active' : '';
      const cat = resolveCategoryFromTag(tag);
      const catAttr = cat ? ` data-filter-category="${cat}"` : '';
      return `<button type="button" class="tag-pill${active}" data-tag="${tag}"${catAttr}>#${tag}</button>`;
    })
    .join('');
  $$('.tag-pill', tagsEl).forEach((el) => {
    el.addEventListener('click', () => {
      const tag = el.dataset.tag;
      const catFromTag = el.dataset.filterCategory || resolveCategoryFromTag(tag);
      if (catFromTag) {
        const nextCat = state.category === catFromTag ? 'all' : catFromTag;
        applyFilters({ category: nextCat, tag: null, featuredOnly: false }, { scroll: true });
        return;
      }
      applyFilters(
        { tag: state.tag === tag ? null : tag, featuredOnly: false },
        { scroll: true }
      );
    });
  });

  const contribEl = $('#contributors-list');
  if (CONTRIBUTORS.length === 0) {
    $('#contributors-section')?.remove();
    return;
  }
  contribEl.innerHTML = CONTRIBUTORS.map((c) => {
    const count = getPromptList().filter((p) => p.contributor === c.id).length;
    return `<div class="contributor-row">
      <div class="contributor-avatar" style="background:${c.color}22;color:${c.color}">${c.initials}</div>
      <div>
        <div style="font-size:12px;color:var(--text)">${localizeField(c.name)}</div>
        <div style="font-size:11px;color:var(--muted)">${count} ${getLocale() === 'zh' ? '条提示词' : 'prompts'}</div>
      </div>
    </div>`;
  }).join('');
}

function renderToolStrip() {
  const strip = $('#tools-strip');
  const chips = AI_TOOLS.map((tool) => {
    const active = state.model === tool.id ? ' active' : '';
    const border = `border-color:${tool.color}44`;
    const bg = `background:${tool.color}22;color:${tool.color}`;
    const count = getPromptCountByModel(tool.countKey);
    if (count === 0 && tool.id === 'perplexity') return '';
    return `<button type="button" class="tool-chip${active}" data-tool="${tool.id}" style="${border}">
      <div class="tool-icon" style="${bg}">${tool.letter}</div>
      <span>${tool.id === 'perplexity' ? 'Perplexity' : t(`tabs.${tool.id}`)}</span>
      <span class="chip-count">${count}</span>
    </button>`;
  }).join('');
  strip.innerHTML =
    chips +
    `<button type="button" class="tool-chip" id="reset-filters" style="border-color:var(--border)">
      <i class="ti ti-filter-off" aria-hidden="true" style="font-size:14px;color:var(--muted)"></i>
      <span style="color:var(--muted)">${t('filters.clearAll')}</span>
    </button>`;

  $$('.tool-chip[data-tool]', strip).forEach((chip) => {
    chip.addEventListener('click', () => {
      const id = chip.dataset.tool;
      applyFilters(
        { model: state.model === id ? 'all' : id, featuredOnly: false },
        { scroll: true }
      );
    });
  });

  $('#reset-filters')?.addEventListener('click', () => resetFilters({ scroll: true }));
}

function promptCardHtml(p) {
  const title = localizeField(p.title);
  const desc = localizeField(p.description);
  const tagList = p.tags[getLocale()] || [];
  const tags = tagList
    .map((tag) => {
      const cat = resolveCategoryFromTag(tag);
      const attrs = cat
        ? ` class="tag tag-clickable" data-filter-tag="${tag}" data-filter-category="${cat}"`
        : ` class="tag tag-clickable" data-filter-tag="${tag}"`;
      return `<button type="button"${attrs}>${tag}</button>`;
    })
    .join('');
  const modelBtn = `<button type="button" class="tag tag-clickable tag-model" data-filter-model="${p.model}">${t(`tabs.${p.model}`)}</button>`;
  const catBtn = `<button type="button" class="tag tag-clickable tag-category" data-filter-category="${p.category}">${t(`categories.${p.category}`)}</button>`;
  const fav = state.favorites.has(p.id);
  const uses = p.uses ? `${(p.uses / 1000).toFixed(1)}k` : '';
  const detailedBadge = `<span class="tag tag-detailed">${t('card.detailedBadge')}</span>`;
  return `<article class="prompt-card" style="--card-accent:${p.accent || 'var(--accent)'}" data-id="${p.id}">
    <div class="card-top">
      <div class="card-icon" style="background:rgba(124,111,247,0.12)">${p.icon}</div>
      <div class="card-actions">
        <button type="button" class="card-btn copy-btn" title="${t('card.copy')}" data-id="${p.id}">
          <i class="ti ti-copy" aria-hidden="true"></i>
        </button>
        <button type="button" class="card-btn fav-btn${fav ? ' favorited' : ''}" title="${t('card.favorite')}" data-id="${p.id}">
          <i class="ti ti-heart${fav ? '-filled' : ''}" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="card-title">${title}</div>
    <div class="card-desc">${desc}</div>
    <div class="card-footer">
      <div class="card-tags">${detailedBadge}${modelBtn}${catBtn}${tags}</div>
      ${uses ? `<div class="card-meta"><i class="ti ti-bolt" aria-hidden="true"></i>${uses}</div>` : ''}
    </div>
  </article>`;
}

function bindPromptCards(root) {
  $$('.prompt-card', root).forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-btn, .tag-clickable')) return;
      openModal(card.dataset.id);
    });
  });
  $$('.copy-btn', root).forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const full = await getPromptFull(btn.dataset.id);
      if (full) copyText(localizeField(full.content));
    });
  });
  $$('.fav-btn', root).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (state.favorites.has(id)) state.favorites.delete(id);
      else state.favorites.add(id);
      saveFavorites();
      renderPromptGrid();
    });
  });
  $$('[data-filter-model]', root).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.filterModel;
      applyFilters({ model: id, featuredOnly: false }, { scroll: true });
    });
  });
  $$('[data-filter-category]', root).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.filterCategory;
      applyFilters({ category: id, tag: null, featuredOnly: false }, { scroll: true });
    });
  });
  $$('[data-filter-tag]', root).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tag = btn.dataset.filterTag;
      const cat = btn.dataset.filterCategory || resolveCategoryFromTag(tag);
      if (cat) applyFilters({ category: cat, tag: null, featuredOnly: false }, { scroll: true });
      else applyFilters({ tag, featuredOnly: false }, { scroll: true });
    });
  });
}

async function renderPromptGrid() {
  const list = getFilteredList();
  const grid = $('#prompt-grid');
  const meta = getPaginationMeta(list);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state">${t('empty')}</div>`;
    renderPagination();
    gridLoading = false;
    return;
  }

  const pageList = list.slice(meta.start, meta.end);
  grid.innerHTML = `<div class="grid-loading">${t('loading.page')}</div>`;
  gridLoading = true;

  try {
    await ensureChunksForItems(pageList);
    grid.innerHTML = pageList.map(promptCardHtml).join('');
    bindPromptCards(grid);
    renderPagination();
  } finally {
    gridLoading = false;
  }
}

function renderPagination() {
  const nav = $('#pagination');
  if (!nav) return;

  const list = getFilteredList();
  const meta = getPaginationMeta(list);

  if (meta.total === 0) {
    nav.innerHTML = '';
    nav.classList.add('hidden');
    return;
  }

  nav.classList.remove('hidden');
  const { page, totalPages, start, end, total, pageSize } = meta;

  const pageOptions = PAGE_SIZE_OPTIONS.map(
    (n) =>
      `<option value="${n}"${pageSize === n ? ' selected' : ''}>${n}</option>`
  ).join('');

  const pageNumbers = buildPageNumbers(page, totalPages);

  nav.innerHTML = `
    <div class="pagination-info">
      <span>${tPage('pageOf', { current: page, total: totalPages })}</span>
      <span class="pagination-range">${tPage('range', { start: start + 1, end })} / ${total}</span>
    </div>
    <div class="pagination-controls">
      <button type="button" class="page-btn" data-page="prev" ${page <= 1 ? 'disabled' : ''}>
        <i class="ti ti-chevron-left" aria-hidden="true"></i> ${t('pagination.prev')}
      </button>
      <div class="page-numbers" role="group" aria-label="${t('pagination.label')}">
        ${pageNumbers}
      </div>
      <button type="button" class="page-btn" data-page="next" ${page >= totalPages ? 'disabled' : ''}>
        ${t('pagination.next')} <i class="ti ti-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
    <div class="pagination-extra">
      <label class="page-size-label">
        ${t('pagination.perPage')}
        <select id="page-size-select" class="page-size-select" aria-label="${t('pagination.perPage')}">
          ${pageOptions}
        </select>
      </label>
      <label class="page-jump-label">
        ${t('pagination.jump')}
        <input type="number" id="page-jump-input" class="page-jump-input" min="1" max="${totalPages}" value="${page}" />
        <button type="button" class="page-jump-btn" id="page-jump-btn">${t('pagination.go')}</button>
      </label>
    </div>
  `;

  nav.setAttribute('aria-label', t('pagination.label'));

  $$('[data-page]', nav).forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const action = btn.dataset.page;
      if (action === 'prev') goToPage(page - 1);
      else if (action === 'next') goToPage(page + 1);
      else goToPage(Number(action));
    });
  });

  $('#page-size-select', nav)?.addEventListener('change', (e) => {
    state.pageSize = Number(e.target.value);
    localStorage.setItem('ph-page-size', String(state.pageSize));
    state.page = 1;
    renderPromptGrid();
    renderSectionTitle();
    scrollToPromptSection();
  });

  const jumpBtn = $('#page-jump-btn', nav);
  const jumpInput = $('#page-jump-input', nav);
  const doJump = () => {
    const v = parseInt(jumpInput?.value || '1', 10);
    if (!Number.isNaN(v)) goToPage(v);
  };
  jumpBtn?.addEventListener('click', doJump);
  jumpInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doJump();
  });
}

function buildPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => pageNumBtn(i + 1, i + 1 === current));
  }
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  let html = '';
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) html += `<span class="page-ellipsis">…</span>`;
    html += pageNumBtn(p, p === current);
    prev = p;
  }
  return html;
}

function pageNumBtn(n, active) {
  return `<button type="button" class="page-num${active ? ' active' : ''}" data-page="${n}">${n}</button>`;
}

function renderCrosslinks() {
  const grid = $('#crosslink-grid');
  const tools = AI_TOOLS.filter((x) => x.id !== 'perplexity').slice(0, 5);
  const cards = tools
    .map((tool) => {
      const count = getPromptCountByModel(tool.countKey);
      const active = state.model === tool.id ? ' active' : '';
      return `<button type="button" class="cl-card${active}" data-filter-model="${tool.id}">
        <div class="cl-top">
          <div class="cl-logo" style="background:${tool.color}22;color:${tool.color}">${tool.letter}</div>
          <div>
            <div class="cl-name">${t(`tabs.${tool.id}`)}</div>
            <div class="cl-count">${count} ${getLocale() === 'zh' ? '条提示词' : 'prompts'}</div>
          </div>
          <i class="ti ti-filter cl-arrow" aria-hidden="true"></i>
        </div>
        <div class="cl-desc">${t(`toolDesc.${tool.id}`)}</div>
      </button>`;
    })
    .join('');
  const viewAll = `<button type="button" class="cl-card" data-filter-model="all" data-scroll-tools="1">
    <div class="cl-top">
      <div class="cl-logo" style="background:var(--surface2);color:var(--muted)"><i class="ti ti-apps" aria-hidden="true"></i></div>
      <div>
        <div class="cl-name">${getLocale() === 'zh' ? '全部模型' : 'All models'}</div>
        <div class="cl-count">${getPromptList().length} ${getLocale() === 'zh' ? '条提示词' : 'prompts'}</div>
      </div>
    </div>
    <div class="cl-desc">${t('toolDesc.viewAll')}</div>
  </button>`;
  grid.innerHTML = cards + viewAll;

  $$('[data-filter-model]', grid).forEach((card) => {
    card.addEventListener('click', () => {
      if (card.dataset.scrollTools) {
        $('#tools-strip')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      const id = card.dataset.filterModel;
      applyFilters({ model: id, featuredOnly: false }, { scroll: true });
    });
  });
}

function renderHotList() {
  const hot = getPromptList().filter((p) => p.hot)
    .sort((a, b) => (a.hotRank || 99) - (b.hotRank || 99))
    .slice(0, 5);
  const list = $('#hot-list');
  list.innerHTML = hot
    .map((p, i) => {
      const rank = String(i + 1).padStart(2, '0');
      const badgeKey = p.badge ? `badges.${p.badge}` : 'badges.hot';
      const badgeColors = {
        hot: 'rgba(248,113,113,0.12);color:var(--coral)',
        editor: 'rgba(251,191,36,0.12);color:var(--amber)',
        new: 'rgba(52,211,153,0.12);color:var(--green)',
        tips: 'rgba(167,139,250,0.12);color:var(--accent2)'
      };
      const style = badgeColors[p.badge] || badgeColors.hot;
      return `<div class="hot-item" data-id="${p.id}">
        <div class="hot-rank">${rank}</div>
        <div class="hot-info">
          <div class="hot-name">${localizeField(p.title)}</div>
          <div class="hot-meta">
            <button type="button" class="meta-link" data-filter-model="${p.model}">${t(`tabs.${p.model}`)}</button>
            <span> · </span>
            <button type="button" class="meta-link" data-filter-category="${p.category}">${t(`categories.${p.category}`)}</button>
            <span> · ${p.uses || 0} ${t('card.uses')}</span>
          </div>
        </div>
        <button type="button" class="hot-badge meta-link" data-filter-category="${p.category}" style="background:${style}">${t(badgeKey)}</button>
      </div>`;
    })
    .join('');

  $$('.hot-item', list).forEach((item) => {
    const id = item.dataset.id;
    item.addEventListener('click', (e) => {
      if (e.target.closest('.meta-link')) return;
      openModal(id);
    });
  });
  $$('.meta-link', list).forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.dataset.filterModel) {
        applyFilters({ model: btn.dataset.filterModel, featuredOnly: false }, { scroll: true });
      } else if (btn.dataset.filterCategory) {
        applyFilters({ category: btn.dataset.filterCategory, tag: null, featuredOnly: false }, { scroll: true });
      }
    });
  });
}

async function openModal(id) {
  const meta = getPromptList().find((x) => x.id === id);
  if (!meta) return;
  const titleEl = $('#modal-title');
  const hintEl = $('#modal-hint');
  const badgeEl = $('#modal-badge');
  const bodyEl = $('#modal-body');
  titleEl.textContent = localizeField(meta.title);
  if (badgeEl) {
    badgeEl.textContent = t('modal.detailed');
    badgeEl.style.display = 'inline-flex';
  }
  if (hintEl) {
    hintEl.textContent = t('modal.hint');
    hintEl.style.display = 'block';
  }
  bodyEl.textContent = t('loading.content');
  $('#modal-overlay').classList.add('open');

  const p = await getPromptFull(id);
  if (!p) {
    bodyEl.textContent = t('loading.error');
    return;
  }
  bodyEl.textContent = localizeField(p.content);
  $('#modal-copy').onclick = () => copyText(localizeField(p.content));
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $('#modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function applyTranslations() {
  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const text = t(key);
    if (attr) el.setAttribute(attr, text);
    else el.textContent = text;
  });
  document.title = `${t('siteName')}${t('siteTagline')} — ${t('hero.titleHighlight')}`;
}

function bindGlobalEvents() {
  $('#search-input')?.addEventListener('input', (e) => {
    state.search = e.target.value;
    state.featuredOnly = false;
    state.page = 1;
    invalidateFilterCache();
    refreshFilterUI();
  });

  $('#mobile-filter-btn')?.addEventListener('click', () => {
    const sidebar = $('#sidebar');
    setMobileSidebarOpen(!sidebar?.classList.contains('open'));
  });
  $('#sidebar-backdrop')?.addEventListener('click', () => setMobileSidebarOpen(false));

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderPromptGrid();
      renderPagination();
      renderSectionTitle();
    }, 150);
  });

  $('#theme-toggle')?.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  $('#lang-switch')?.addEventListener('click', () => {
    const other = getOtherLocale();
    localStorage.setItem('ph-locale', other);
    const base = window.__BASE__ || '../';
    window.location.href = `${base}${other}/`;
  });

  $('#modal-close')?.addEventListener('click', closeModal);
  $('#modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      setMobileSidebarOpen(false);
    }
  });

  $$('.nav-links a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const nav = a.dataset.nav;
      if (nav === 'all') {
        applyFilters({ category: 'all', model: 'all', tag: null, featuredOnly: false }, { scroll: true });
      } else if (nav === 'featured') {
        applyFilters({ category: 'all', model: 'all', tag: null, featuredOnly: true }, { scroll: true });
      } else if (nav === 'tools') {
        $('#tools-strip')?.scrollIntoView({ behavior: 'smooth' });
      } else if (nav === 'guide') {
        $('#crosslink')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  $$('.hero-stats .stat').forEach((stat, i) => {
    stat.style.cursor = 'pointer';
    stat.addEventListener('click', () => {
      if (i === 0) resetFilters({ scroll: true });
      else if (i === 1) $('#tools-strip')?.scrollIntoView({ behavior: 'smooth' });
      else if (i === 2) {
        const first = CATEGORY_IDS[0];
        applyFilters({ category: first, featuredOnly: false }, { scroll: true });
      } else if (i === 3) {
        $('#contributors-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

export async function initApp(locale) {
  const base = window.__BASE__ || '../';
  await loadLocale(locale, base);
  setTheme(getTheme());
  applyTranslations();
  renderStats();
  renderHotList();
  refreshFilterUI();
  bindGlobalEvents();

  const startBg = () =>
    startBackgroundLoad(() => {
      renderLoadProgress();
    }).then(() => {
      renderLoadProgress();
    });

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => startBg(), { timeout: 3000 });
  } else {
    setTimeout(startBg, 800);
  }

  if (state.category !== 'all') void loadChunk(state.category);
}
