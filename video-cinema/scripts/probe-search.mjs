const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const q = '一人之下';
const url = `https://m.dckjqsh.com/xxsc/-------------.html?wd=${encodeURIComponent(q)}&submit=${encodeURIComponent('展示')}`;
const res = await fetch(url, {
  headers: { 'User-Agent': UA, Referer: 'https://m.dckjqsh.com/' },
});
const html = await res.text();
console.log('status', res.status, 'len', html.length);
console.log('title', html.match(/<title>([^<]+)/)?.[1]);

const ids = [...new Set([...html.matchAll(/href="\/xxdt\/(\d+)\.html"/g)].map((m) => m[1]))];
console.log('vod count', ids.length, ids.slice(0, 5));

const item = html.match(/<li class="active[\s\S]{0,2500}/) || html.match(/stui-vodlist__detail[\s\S]{0,2500}/);
console.log('\nitem sample:\n', item?.[0]?.slice(0, 1200));

const page = html.match(/stui-page[\s\S]{0,900}/);
console.log('\npage:\n', page?.[0]);

// page 2 pattern?
const page2 = [...html.matchAll(/href="(\/xxsc\/[^"]+)"/g)].map((m) => m[1]).filter((p) => p.includes('wd'));
console.log('\nsearch page links', [...new Set(page2)].slice(0, 8));

const movieHot = html.match(/电影热播榜[\s\S]{0,1800}/);
console.log('\nmovie hot:\n', movieHot?.[0]?.slice(0, 900));
