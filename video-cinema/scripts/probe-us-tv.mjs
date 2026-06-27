const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const BASE = 'https://m.dckjqsh.com';

async function get(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'User-Agent': UA, Referer: `${BASE}/` },
  });
  return res.text();
}

const html = await get('/xxtp/2.html');
const filters = [...html.matchAll(/<a[^>]*href="(\/xxsw\/[^"]+)"[^>]*>([^<]*)<\/a>/gi)];
const us = filters.filter((m) => /美|欧美|美国|海外/.test(m[2]));
console.log('tv filters (US related):');
us.forEach((m) => console.log(m[2].trim(), m[1]));

const home = await get('/');
const homeUs = [...home.matchAll(/href="(\/xxsw\/[^"]+)"[^>]*>([^<]*)<\/a>/gi)].filter((m) => /美剧|欧美剧/.test(m[2]));
console.log('\nhome links:', homeUs.map((m) => `${m[2]} ${m[1]}`));

const allLabels = [...new Set(filters.map((m) => m[2].trim()))];
console.log('\nall filter labels:', allLabels.slice(0, 30));

if (us[0]) {
  const fhtml = await get(us[0][1]);
  const vods = [...fhtml.matchAll(/href="\/xxdt\/(\d+)\.html"[^>]*title="([^"]*)"/g)].slice(0, 5);
  console.log('\nfirst 5 vods from', us[0][1]);
  vods.forEach((m) => console.log(m[1], m[2]));
}
