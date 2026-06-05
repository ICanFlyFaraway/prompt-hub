const SUPPORTED_LOCALES = ['zh', 'en'];
const DEFAULT_LOCALE = 'zh';

let currentLocale = DEFAULT_LOCALE;
let messages = {};

export function getSupportedLocales() {
  return SUPPORTED_LOCALES;
}

export function getLocale() {
  return currentLocale;
}

export function getOtherLocale() {
  return currentLocale === 'zh' ? 'en' : 'zh';
}

export async function loadLocale(locale, basePath = '../') {
  const loc = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const res = await fetch(`${basePath}locales/${loc}.json`);
  if (!res.ok) throw new Error(`Failed to load locale: ${loc}`);
  messages = await res.json();
  currentLocale = loc;
  document.documentElement.lang = loc === 'zh' ? 'zh-CN' : 'en';
  return messages;
}

export function t(key) {
  const parts = key.split('.');
  let val = messages;
  for (const p of parts) {
    val = val?.[p];
  }
  return val ?? key;
}

export function localizeField(field) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[currentLocale] ?? field[DEFAULT_LOCALE] ?? '';
}

export function buildLocalePath(locale, hash = '') {
  const base = typeof window.__BASE__ === 'string' ? window.__BASE__ : '../';
  const prefix = locale === DEFAULT_LOCALE ? `${base}zh/` : `${base}${locale}/`;
  return `${prefix}${hash}`;
}
