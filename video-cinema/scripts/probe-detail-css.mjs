const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const res = await fetch('https://m.dckjqsh.com/xxdt/247937.html', {
  headers: { 'User-Agent': UA, Referer: 'https://m.dckjqsh.com/' },
});
const html = await res.text();
const links = [...html.matchAll(/href="([^"]+\.css[^"]*)"/gi)].map((m) => m[1]);
console.log('css links:', links);

for (const link of links.filter((l) => l.includes('stui')).slice(0, 4)) {
  const url = link.startsWith('http') ? link : `https://m.dckjqsh.com${link.startsWith('/') ? '' : '/'}${link}`;
  const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
  const rules = [
    'stui-content__thumb',
    'stui-content__detail',
    'stui-content',
    'desc.detail',
    'desc ',
    'detail-sketch',
    'detail-more',
    'v-thumb',
    'stui-vodlist__thumb',
    '.left',
  ];
  for (const sel of rules) {
    const re = new RegExp(`[^}]*${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^}]*\\}`, 'gi');
    const matches = css.match(re);
    if (matches) {
      console.log(`\n--- ${sel} in ${url} ---`);
      matches.slice(0, 5).forEach((m) => console.log(m.trim()));
    }
  }
}
