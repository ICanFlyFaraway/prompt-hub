const API_BASE = '';

/** @typedef {Object} SourceEpisode
 * @property {number} sid
 * @property {number} nid
 * @property {string} name
 * @property {string} [sourceName]
 * @property {string} [playUrl]
 */

/** @typedef {Object} SourceVideo
 * @property {number} id
 * @property {string} title
 * @property {string} poster
 * @property {number} rating
 * @property {string} [category]
 * @property {string} [subCategory]
 * @property {string} [area]
 * @property {number} [year]
 * @property {string} [status]
 * @property {string} [director]
 * @property {string[]} [actors]
 * @property {string} [description]
 * @property {SourceEpisode[]} [episodes]
 * @property {boolean} source
 */

let _config = null;

const UOTXF_ID_OFFSET = 900_000_000;

export function isSourceId(id) {
  const n = Number(id);
  return n >= 10000 || n >= UOTXF_ID_OFFSET;
}

async function api(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `请求失败 ${res.status}`);
  return data;
}

export async function getSourceConfig() {
  if (!_config) _config = await api('/api/config');
  return _config;
}

/** @returns {Promise<SourceVideo[]>} */
export async function fetchHomeVideos() {
  const data = await api('/api/home');
  return data.items || [];
}

/** @typedef {Object} SearchPageData
 * @property {SourceVideo[]} items
 * @property {string} keyword
 * @property {number} page
 * @property {{ current: number, total: number }} pagination
 * @property {string} pageTitle
 * @property {SourceVideo[]} movieHot
 * @property {SourceVideo[]} tvHot
 */

/** @param {string} keyword @param {number} [page] @returns {Promise<SearchPageData>} */
export async function searchSourcePage(keyword, page = 1) {
  const q = new URLSearchParams({ q: keyword, page: String(page) });
  return api(`/api/search?${q}`);
}

/** @param {string} keyword @param {number} [page] @returns {Promise<SourceVideo[]>} */
export async function searchSourceVideos(keyword, page = 1) {
  const data = await searchSourcePage(keyword, page);
  return data.items || [];
}

/** @typedef {Object} CategoryFilterOption
 * @property {string} label
 * @property {string} path
 */

/** @typedef {Object} CategoryFilterGroup
 * @property {string} label
 * @property {CategoryFilterOption[]} options
 */

/** @typedef {Object} CategoryPageData
 * @property {SourceVideo[]} items
 * @property {string} category
 * @property {number} page
 * @property {{ current: number, total: number }} pagination
 * @property {CategoryFilterGroup[]} filters
 * @property {SourceVideo[]} hotList
 * @property {SourceVideo[]} latestList
 * @property {string} pageTitle
 * @property {string} filterPath
 */

/** @param {string} category @param {number} [page] @param {string} [filter] @returns {Promise<CategoryPageData>} */
export async function fetchCategoryPage(category, page = 1, filter = '') {
  const q = new URLSearchParams({ page: String(page) });
  if (filter) q.set('filter', filter);
  return api(`/api/list/${category}?${q}`);
}

/** @param {string} category @param {number} [page] @returns {Promise<SourceVideo[]>} */
export async function fetchCategoryVideos(category, page = 1) {
  const data = await fetchCategoryPage(category, page);
  return data.items || [];
}

/** @param {number} id @returns {Promise<SourceVideo>} */
export async function fetchVodDetail(id) {
  return api(`/api/vod/${id}`);
}

/** @param {number} id @param {number} sid @param {number} nid */
export async function fetchPlayInfo(id, sid, nid) {
  return api(`/api/play/${id}/${sid}/${nid}`);
}

/** @param {SourceVideo} video */
export function normalizeSourceVideo(video) {
  return {
    ...video,
    id: video.id,
    title: video.title || '',
    poster: video.poster || '',
    rating: video.rating || 7,
    category: video.category || 'movie',
    subCategory: video.subCategory || '',
    area: video.area || '',
    year: video.year || new Date().getFullYear(),
    status: video.status || '更新中',
    director: video.director || '内详',
    actors: video.actors || ['内详'],
    description: video.description || '',
    episodes: video.episodes || [],
    playSources: video.playSources || [],
    relatedVideos: video.relatedVideos || [],
    hotList: video.hotList || [],
    latestList: video.latestList || [],
    descriptionSketch: video.descriptionSketch || video.description || '',
    descriptionFull: video.descriptionFull || video.description || '',
    updatedTime: video.updatedTime || '',
    playSid: video.playSid || 1,
    playNid: video.playNid || 1,
    source: true,
    updatedAt: video.updatedAt || new Date().toISOString().slice(0, 10),
  };
}

export async function isApiAvailable() {
  try {
    await getSourceConfig();
    return true;
  } catch {
    return false;
  }
}
