import { loadLocale, t, getOtherLocale } from './i18n.js';
import { getLegalPageIdFromUrl, legalPageHref, renderLegalDocument } from './legal.js';

function $(sel) {
  return document.querySelector(sel);
}

function $$(sel) {
  return [...document.querySelectorAll(sel)];
}

function applyTranslations() {
  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const text = t(key);
    if (attr) el.setAttribute(attr, text);
    else el.textContent = text;
  });
}

function getTheme() {
  return localStorage.getItem('ph-theme') || 'dark';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ph-theme', theme);
  const icon = $('#theme-toggle i');
  if (icon) icon.className = theme === 'light' ? 'ti ti-moon' : 'ti ti-sun';
}

function highlightFooterNav(pageId) {
  $$('[data-legal-nav]').forEach((a) => {
    const id = a.dataset.legalNav;
    a.classList.toggle('active', id === pageId);
    a.setAttribute('href', legalPageHref(id));
    a.setAttribute('aria-current', id === pageId ? 'page' : 'false');
  });
}

function syncLegalPageFromUrl() {
  const pageId = getLegalPageIdFromUrl();
  if (!renderLegalDocument(pageId)) {
    window.location.replace('./');
    return false;
  }
  highlightFooterNav(pageId);
  return true;
}

export async function initLegalPage() {
  const locale = window.__LOCALE__ || 'zh';
  const base = window.__BASE__ || '../';
  await loadLocale(locale, base);
  applyTranslations();
  setTheme(getTheme());

  if (!syncLegalPageFromUrl()) return;

  $('#theme-toggle')?.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  $('#lang-switch')?.addEventListener('click', () => {
    const other = getOtherLocale();
    localStorage.setItem('ph-locale', other);
    const pageId = getLegalPageIdFromUrl();
    window.location.href = `${base}${other}/legal?p=${pageId}`;
  });

  window.addEventListener('popstate', () => {
    syncLegalPageFromUrl();
  });
}
