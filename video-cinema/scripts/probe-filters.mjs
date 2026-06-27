import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UA = 'Mozilla/5.0';
const BASE = 'https://m.dckjqsh.com';

async function get(path) {
  return fetch(`${BASE}${path}`, {
    headers: { 'User-Agent': UA, Referer: `${BASE}/` },
  }).then((r) => r.text());
}

const html = await get('/xxtp/1.html');
fs.writeFileSync(path.join(__dirname, 'cat1.html'), html);

for (const prefix of ['xxsc', 'xxfl', 'xxtp', 'vodshow', 'vodtype']) {
  const links = [...html.matchAll(new RegExp(`href="(/${prefix}/[^"]+)"`, 'g'))]
    .slice(0, 8)
    .map((m) => m[1]);
  console.log(prefix, links);
}

const head = html.match(/stui-screen[\s\S]{0,4000}/)?.[0] || '';
console.log('\nscreen sample:\n', head.slice(0, 2000));

const action = [...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>[^<]*动作[^<]*<\/a>/g)].map((m) => m[1]);
console.log('\naction links', action.slice(0, 5));

const pag = html.match(/1\/(\d+)/);
console.log('total pages', pag?.[1]);
