import { t } from './i18n.js';

export const LEGAL_PAGE_IDS = ['about', 'terms', 'privacy', 'contact'];

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function getLegalPageIdFromUrl() {
  const params = new URLSearchParams(location.search);
  let id = (params.get('p') || '').toLowerCase();

  if (!id && location.hash) {
    id = location.hash.replace(/^#/, '').toLowerCase();
  }

  if (!id) {
    const parts = location.pathname.split('/').filter(Boolean);
    const legalIdx = parts.lastIndexOf('legal');
    if (legalIdx >= 0 && parts[legalIdx + 1]) {
      id = parts[legalIdx + 1].toLowerCase();
    }
  }

  return LEGAL_PAGE_IDS.includes(id) ? id : 'about';
}

/** Same-page links that work for /en/legal, /en/legal.html, and /en/legal/ */
export function legalPageHref(pageId) {
  return `?p=${pageId}`;
}

export function getLegalPage(key) {
  const page = t(`legal.${key}`);
  return page && typeof page === 'object' && !Array.isArray(page) ? page : null;
}

export function renderLegalBodyHtml(page) {
  const parts = [];
  if (page.email) {
    const label = page.emailLabel ? escapeHtml(page.emailLabel) : '';
    const mail = escapeHtml(page.email);
    parts.push(
      `<div class="legal-contact-card">
        ${label ? `<div class="legal-contact-label">${label}</div>` : ''}
        <a class="legal-email" href="mailto:${mail}">${mail}</a>
      </div>`
    );
  }
  for (const section of page.sections || []) {
    const heading = escapeHtml(section.heading || '');
    const paras = (section.body || [])
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('');
    parts.push(`<section class="legal-section"><h4>${heading}</h4>${paras}</section>`);
  }
  return parts.join('');
}

export function renderLegalDocument(pageKey) {
  const page = getLegalPage(pageKey);
  if (!page) return false;

  const titleEl = document.getElementById('legal-page-title');
  const updatedEl = document.getElementById('legal-page-updated');
  const bodyEl = document.getElementById('legal-page-body');

  if (titleEl) titleEl.textContent = page.title || '';
  if (updatedEl) {
    updatedEl.textContent = page.updated || '';
    updatedEl.style.display = page.updated ? 'block' : 'none';
  }
  if (bodyEl) bodyEl.innerHTML = renderLegalBodyHtml(page);

  document.title = `${page.title || pageKey} — ${t('siteName')}${t('siteTagline')}`;
  return true;
}
