const UA = 'Mozilla/5.0';
const BASE = 'https://www.uotxf.cn';
const q = encodeURIComponent('卧底');
const html = await fetch(`${BASE}/vodsearch/-------------.html?wd=${q}`, {
  headers: { 'User-Agent': UA, Referer: `${BASE}/` },
}).then((r) => r.text());
const items = [...new Map([...html.matchAll(/href="\/voddetail\/(\d+)\.html"[^>]*title="([^"]*)"/g)].map((m) => [m[1], m[2]])).entries()];
console.log('items', items.length, items.slice(0, 5));
const page2 = [...html.matchAll(/href="(\/vodsearch\/[^"]+)"/g)].map((m) => m[1]).filter((p) => p.includes('wd') || p.includes('%'));
console.log('page links', [...new Set(page2)].slice(0, 5));
const pag = html.match(/class="num">(\d+)\/(\d+)/);
console.log('pag', pag?.slice(1));
