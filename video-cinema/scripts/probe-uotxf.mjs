const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BASE = 'https://www.uotxf.cn';

async function get(path) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Referer: `${BASE}/`, Accept: 'text/html' },
    redirect: 'follow',
  });
  return { status: res.status, html: await res.text() };
}

const paths = {
  movie: '/vodtype/22.html',
  tv: '/vodtype/23.html',
  anime: '/vodtype/24.html',
  variety: '/vodtype/25.html',
  usTv: '/vodtype/37.html',
  short: '/vodtype/42.html',
  action: '/vodtype/26.html',
};

for (const [name, path] of Object.entries(paths)) {
  const { html } = await get(path);
  const vods = [...new Map([...html.matchAll(/href="\/voddetail\/(\d+)\.html"[^>]*(?:title="([^"]*)")?/g)].map((m) => [m[1], m[2] || ''])).entries()].slice(0, 4);
  const pages = html.match(/共(\d+)页|page=(\d+)/gi);
  console.log(`\n${name} ${path}: ${vods.length}+ items`, vods.map((v) => v[1] || v[0]).join(', '));
  const filters = [...html.matchAll(/href="(\/vodshow\/[^"]+)"[^>]*>([^<]*)</g)].slice(0, 5);
  if (filters.length) console.log('  vodshow filters:', filters.map((f) => `${f[2]} ${f[1]}`).join(' | '));
}

const detail = await get('/voddetail/7180.html');
console.log('\ndetail title', detail.html.match(/<h1[^>]*>([^<]*)</i)?.[1] || detail.html.match(/<title>([^<]*)</i)?.[1]);
const playlists = [...detail.html.matchAll(/<h3[^>]*>\s*([^<]*?)\s*<\/h3>[\s\S]*?<ul class="[^"]*playlist[^"]*">([\s\S]*?)<\/ul>/gi)];
console.log('playlists', playlists.length);
for (const p of playlists.slice(0, 3)) {
  const eps = [...p[2].matchAll(/href="(\/vodplay\/[^"]+)"[^>]*>([^<]*)</g)].slice(0, 3);
  console.log(`  source: ${p[1].trim()}`, eps.map((e) => `${e[2]} ${e[1]}`).join(' | '));
}

const play = await get('/vodplay/7180-1-1.html');
const pa = play.html.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);
if (pa) {
  const data = JSON.parse(pa[1]);
  console.log('\nplayer_aaaa', { url: data.url?.slice(0, 80), from: data.from });
}

const search = await get(`/index.php/vod/search.html?wd=${encodeURIComponent('一人之下')}`);
const sitems = [...search.html.matchAll(/href="\/voddetail\/(\d+)\.html"[^>]*title="([^"]*)"/g)].slice(0, 5);
console.log('\nsearch', sitems.length, sitems.map((m) => m[2]).join(', '));

const search2 = await get(`/vodsearch/-------------.html?wd=${encodeURIComponent('复仇者')}`);
const s2 = [...search2.html.matchAll(/href="\/voddetail\/(\d+)\.html"/g)].length;
console.log('vodsearch path count', s2, 'status', search2.status);
