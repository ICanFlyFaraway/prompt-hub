const UA = 'Mozilla/5.0';
const BASE = 'https://www.uotxf.cn';
const html = await fetch(`${BASE}/vodtype/22.html`, {
  headers: { 'User-Agent': UA, Referer: `${BASE}/` },
}).then((r) => r.text());

const items = [...html.matchAll(/href="\/voddetail\/(\d+)\.html"[^>]*title="([^"]*)"/g)];
const unique = [...new Map(items.map((m) => [m[1], m[2]])).entries()];
console.log('unique vods', unique.length);
unique.slice(0, 8).forEach(([id, t]) => console.log(id, t));

const posters = [...html.matchAll(/voddetail\/(\d+)\.html"[^>]*data-background="([^"]+)"/g)];
console.log('\nposters', posters.slice(0, 3).map((m) => [m[1], m[2].slice(0, 60)]));

const filterUl = html.match(/stui-screen[\s\S]{0,3000}/);
console.log('\nhas stui-screen', !!filterUl);

const vodshow = [...html.matchAll(/href="(\/vodshow\/[^"]+)"[^>]*>([^<]*)</g)];
console.log('vodshow count', vodshow.length, 'sample', vodshow.slice(0, 3).map((m) => m[2]));

// pagination mac style
const macPage = [...html.matchAll(/href="(\/vodtype\/22-\d+\.html)"/g)];
console.log('mac pages', [...new Set(macPage.map((m) => m[1]))]);

const detail = await fetch(`${BASE}/voddetail/8877.html`, { headers: { 'User-Agent': UA, Referer: `${BASE}/` } }).then((r) => r.text());
console.log('\ndetail h1', detail.match(/<h1[^>]*>([^<]*)</i)?.[1]);
console.log('desc sketch', detail.match(/detail-sketch/)?.[0] || detail.match(/简介/)?.index);
const epAll = [...detail.matchAll(/href="\/vodplay\/(\d+)-(\d+)-(\d+)\.html"[^>]*>([^<]*)</g)];
console.log('eps', epAll.length, epAll.slice(0, 3).map((m) => m[4]));
