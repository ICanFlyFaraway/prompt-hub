/** Shared config — no heavy prompt payloads here */

export const CONTRIBUTORS = [
  { id: 'opc', name: { zh: 'OpenPrompt 社区', en: 'OpenPrompt Community' }, initials: 'OP', color: '#7c6ff7' },
  { id: 'alex', name: { zh: 'Alex Chen', en: 'Alex Chen' }, initials: 'AC', color: '#2dd4bf' },
  { id: 'mjlab', name: { zh: 'MJ Lab', en: 'MJ Lab' }, initials: 'MJ', color: '#f59e0b' }
];

export const POPULAR_TAGS = {
  zh: ['写作', '编程', '图像', '营销', '教育', '商业', '角色扮演', '视频', 'SEO', 'Prompt 工程'],
  en: ['Writing', 'Development', 'Image & Art', 'Marketing', 'Education', 'Business', 'Roleplay', 'Video scripts', 'SEO', 'Prompt engineering']
};

export const CATEGORY_IDS = [
  'writing',
  'coding',
  'image',
  'marketing',
  'education',
  'business',
  'roleplay',
  'video'
];

export const AI_TOOLS = [
  { id: 'chatgpt', letter: 'G', color: '#10a37f', url: 'https://chat.openai.com/', countKey: 'chatgpt' },
  { id: 'claude', letter: 'C', color: '#a78bfa', url: 'https://claude.ai/', countKey: 'claude' },
  { id: 'midjourney', letter: 'M', color: '#f59e0b', url: 'https://www.midjourney.com/', countKey: 'midjourney' },
  { id: 'sd', letter: 'SD', color: '#60a5fa', url: 'https://stability.ai/', countKey: 'sd' },
  { id: 'gemini', letter: 'G', color: '#f472b6', url: 'https://gemini.google.com/', countKey: 'gemini' },
  { id: 'sora', letter: 'S', color: '#f87171', url: 'https://openai.com/sora', countKey: 'sora' },
  { id: 'perplexity', letter: 'P', color: '#34d399', url: 'https://www.perplexity.ai/', countKey: 'perplexity' }
];

export {
  getPromptIndex,
  getPromptFull,
  getPromptCountByModel,
  getPromptCountByCategory,
  loadChunk,
  ensureChunksForItems,
  startBackgroundLoad,
  getLoadProgress,
  isAllChunksLoaded
} from './prompt-store.js';
