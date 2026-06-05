import { PROMPT_INDEX } from './prompts-index.js';
import { BASE_PROMPTS } from './prompts-base.js';
import { enrichPrompt } from './prompt-enricher.js';

const CATEGORY_IDS = [
  'writing',
  'coding',
  'image',
  'marketing',
  'education',
  'business',
  'roleplay',
  'video'
];

/** @type {Map<string, object>} */
const fullCache = new Map(BASE_PROMPTS.map((p) => [p.id, p]));

/** @type {Set<string>} */
const chunksLoaded = new Set();

/** @type {Map<string, Promise<void>>} */
const chunkInflight = new Map();

/** @type {Map<string, object>} */
const enrichCache = new Map();

/** @type {Promise<void> | null} */
let backgroundLoadPromise = null;

let loadProgress = { done: 0, total: CATEGORY_IDS.length };

/**
 * @param {(progress: { done: number, total: number }) => void} [onProgress]
 */
export async function loadChunk(category) {
  if (chunksLoaded.has(category)) return;
  const pending = chunkInflight.get(category);
  if (pending) return pending;

  const job = (async () => {
    const mod = await import(`./chunks/${category}.js`);
    for (const p of mod.CHUNK_PROMPTS) {
      fullCache.set(p.id, p);
    }
    chunksLoaded.add(category);
    chunkInflight.delete(category);
  })();

  chunkInflight.set(category, job);
  return job;
}

/**
 * @param {object[]} indexItems
 */
export async function ensureChunksForItems(indexItems) {
  const cats = [...new Set(indexItems.map((p) => p.category))];
  await Promise.all(cats.map((c) => loadChunk(c)));
}

/**
 * @param {(progress: { done: number, total: number }) => void} [onProgress]
 */
export function startBackgroundLoad(onProgress) {
  if (backgroundLoadPromise) return backgroundLoadPromise;

  backgroundLoadPromise = (async () => {
    for (let i = 0; i < CATEGORY_IDS.length; i++) {
      const cat = CATEGORY_IDS[i];
      await loadChunk(cat);
      loadProgress = { done: i + 1, total: CATEGORY_IDS.length };
      onProgress?.(loadProgress);
      await new Promise((r) => setTimeout(r, 0));
    }
  })();

  return backgroundLoadPromise;
}

export function getLoadProgress() {
  return { ...loadProgress };
}

export function isAllChunksLoaded() {
  return chunksLoaded.size >= CATEGORY_IDS.length;
}

/** Slim list for filter / cards */
export function getPromptIndex() {
  return PROMPT_INDEX;
}

/**
 * @param {string} id
 */
export async function getPromptFull(id) {
  let raw = fullCache.get(id);
  if (!raw) {
    const meta = PROMPT_INDEX.find((x) => x.id === id);
    if (!meta) return null;
    await loadChunk(meta.category);
    raw = fullCache.get(id);
  }
  if (!raw) return null;
  if (!enrichCache.has(id)) {
    enrichCache.set(id, enrichPrompt(raw));
  }
  return enrichCache.get(id);
}

export function getPromptCountByModel(modelId) {
  if (modelId === 'all') return PROMPT_INDEX.length;
  if (modelId === 'perplexity') return 0;
  return PROMPT_INDEX.filter((p) => p.model === modelId).length;
}

export function getPromptCountByCategory(categoryId) {
  if (categoryId === 'all') return PROMPT_INDEX.length;
  return PROMPT_INDEX.filter((p) => p.category === categoryId).length;
}
