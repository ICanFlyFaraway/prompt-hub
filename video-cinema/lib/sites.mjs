/** @typedef {'stui' | 'uotxf'} SiteTemplate */

/** @typedef {Object} SiteConfig
 * @property {string} key
 * @property {string} name
 * @property {string} base
 * @property {string} parse
 * @property {SiteTemplate} template
 * @property {string} detailPath
 * @property {string} playPath
 * @property {string} listPath
 * @property {string} filterPath
 * @property {string} searchPath
 * @property {number} [idOffset]
 * @property {Record<string, number>} typeIds
 * @property {Record<string, string>} [defaultFilters]
 * @property {Record<string, string>} [searchCategories]
 */

export const UOTXF_ID_OFFSET = 900_000_000;

/** @type {Record<string, SiteConfig>} */
export const SITES = {
  dckjqsh: {
    key: 'dckjqsh',
    name: '星星影院',
    base: 'https://m.dckjqsh.com',
    parse: 'https://tv.qingning77.com/api/publicApi.php?url=',
    template: 'stui',
    detailPath: '/xxdt',
    playPath: '/xxpy',
    listPath: '/xxtp',
    filterPath: '/xxsw',
    searchPath: '/xxsc/-------------.html',
    idOffset: 0,
    typeIds: { movie: 1, tv: 2, variety: 3, anime: 4, short: 5 },
    defaultFilters: { ustv: '/xxsw/21-----------.html' },
    searchCategories: { adult: '情色' },
  },
  uotxf: {
    key: 'uotxf',
    name: '天龙影院',
    base: 'https://www.uotxf.cn',
    parse: 'https://tv.qingning77.com/api/publicApi.php?url=',
    template: 'uotxf',
    detailPath: '/voddetail',
    playPath: '/vodplay',
    listPath: '/vodtype',
    filterPath: '/vodshow',
    searchPath: '/vodsearch/-------------.html',
    idOffset: UOTXF_ID_OFFSET,
    typeIds: { movie: 22, tv: 23, anime: 24, variety: 25, ustv: 37, short: 42 },
    defaultFilters: { ustv: '/vodshow/37-----------.html' },
    searchCategories: { adult: '情色' },
  },
};

export const SITE_LIST = [SITES.dckjqsh, SITES.uotxf];

/** @param {number} publicId */
export function resolveSite(publicId) {
  if (publicId >= UOTXF_ID_OFFSET) return SITES.uotxf;
  return SITES.dckjqsh;
}

/** @param {SiteConfig} site @param {number} localId */
export function toPublicId(site, localId) {
  return (site.idOffset || 0) + localId;
}

/** @param {number} publicId */
export function toLocalId(publicId) {
  const site = resolveSite(publicId);
  return publicId - (site.idOffset || 0);
}

/** @param {number} publicId */
export function isRemoteId(publicId) {
  const id = Number(publicId);
  return id >= 10_000 || id >= UOTXF_ID_OFFSET;
}
