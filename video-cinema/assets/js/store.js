const HISTORY_KEY = 'video-cinema:history';
const REQUESTS_KEY = 'video-cinema:requests';

/** @typedef {{ videoId: number, title: string, poster: string, episode: string, episodeIndex: number, watchedAt: string, source?: boolean, sid?: number, nid?: number }} HistoryItem */

/** @returns {HistoryItem[]} */
export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** @param {HistoryItem} item */
export function addHistory(item) {
  const list = getHistory().filter((h) => h.videoId !== item.videoId);
  list.unshift(item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

/** @param {{ title: string, contact: string, note: string }} request */
export function addRequest(request) {
  const list = getRequests();
  list.unshift({ ...request, createdAt: new Date().toISOString() });
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(list.slice(0, 100)));
}

export function getRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
