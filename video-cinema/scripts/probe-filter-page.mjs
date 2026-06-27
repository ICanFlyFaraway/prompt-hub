const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
async function get(path) {
  const res = await fetch(`https://m.dckjqsh.com${path}`, {
    headers: { 'User-Agent': UA, Referer: 'https://m.dckjqsh.com/' },
  });
  return res.text();
}
let html = await get('/xxsw/6-----------.html');
const pages = [...html.matchAll(/href="(\/xxsw\/[^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(pages)].filter((p) => p.includes('6'));
console.log('filter page links:', unique.slice(0, 15));
const pageInfo = html.match(/num">(\d+\/\d+)/);
console.log('page info', pageInfo?.[1]);
const stuiPage = html.match(/stui-page[\s\S]{0,1200}/);
console.log(stuiPage?.[0]);

html = await get('/xxsw/6---%E5%8A%A8%E4%BD%9C--------.html');
console.log('\n--- plot filter page ---');
console.log(html.match(/stui-page[\s\S]{0,900}/)?.[0]);
