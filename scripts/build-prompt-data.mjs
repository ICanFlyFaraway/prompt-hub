/**
 * Builds prompts-index.js + per-category chunk files (lazy load).
 * Run: node scripts/build-prompt-data.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { BASE_PROMPTS } from '../assets/js/data/prompts-base.js';
import { EXTENDED_PROMPTS } from '../assets/js/data/prompts-extended.js';
import { BULK_PROMPTS } from '../assets/js/data/prompts-bulk.js';
import { SCALE_PROMPTS } from '../assets/js/data/prompts-scale.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '../assets/js/data');
const chunksDir = join(outDir, 'chunks');

mkdirSync(chunksDir, { recursive: true });

const ALL = [...BASE_PROMPTS, ...EXTENDED_PROMPTS, ...BULK_PROMPTS, ...SCALE_PROMPTS];

function toIndexItem(p) {
  return {
    id: p.id,
    model: p.model,
    category: p.category,
    icon: p.icon,
    accent: p.accent,
    uses: p.uses,
    featured: !!p.featured,
    hot: !!p.hot,
    hotRank: p.hotRank,
    badge: p.badge,
    contributor: p.contributor,
    tags: p.tags,
    title: p.title,
    description: {
      zh: (p.description?.zh || '').slice(0, 140),
      en: (p.description?.en || '').slice(0, 140)
    }
  };
}

const index = ALL.map(toIndexItem);
writeFileSync(
  join(outDir, 'prompts-index.js'),
  `/** Auto-generated slim index (${index.length} prompts). Run: node scripts/build-prompt-data.mjs */\nexport const PROMPT_INDEX = ${JSON.stringify(index)};\n`,
  'utf8'
);

const byCategory = {};
for (const p of ALL) {
  if (!byCategory[p.category]) byCategory[p.category] = [];
  byCategory[p.category].push(p);
}

for (const [cat, list] of Object.entries(byCategory)) {
  writeFileSync(
    join(chunksDir, `${cat}.js`),
    `/** Lazy-loaded chunk: ${cat} (${list.length} prompts) */\nexport const CHUNK_PROMPTS = ${JSON.stringify(list)};\n`,
    'utf8'
  );
}

const sizes = Object.fromEntries(
  Object.entries(byCategory).map(([k, v]) => [k, v.length])
);
console.log('Index:', index.length, 'prompts');
console.log('Chunks:', sizes);
