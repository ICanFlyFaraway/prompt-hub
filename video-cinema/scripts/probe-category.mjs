const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const BASE = 'https://m.dckjqsh.com';

async function probe(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'User-Agent': UA, Referer: `${BASE}/` },
  });
  const html = await res.text();
  const xxtp = [...html.matchAll(/href="(\/xxtp\/[^"]+)"/g)].map((m) => m[1]);
  const nav = [...html.matchAll(/href="\/xxtp\/(\d+)\.html"[^>]*>([^<]+)</g)].map((m) => ({
    id: m[1],
    label: m[2].trim(),
  }));
  const vods = [...html.matchAll(/href="\/xxdt\/(\d+)\.html"[^>]*title="([^"]*)"/g)]
    .slice(0, 5)
    .map((m) => ({ id: m[1], title: m[2] }));
  const filters = [...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*class="[^"]*btn[^"]*"[^>]*>([^<]*)</g)]
    .slice(0, 20)
    .map((m) => ({ href: m[1], label: m[2].trim() }));
  const h1 = html.match(/<h1[^>]*>([^<]+)</)?.[1];
  const pageLinks = [...html.matchAll(/href="(\/xxtp\/1-\d+\.html)"/g)].map((m) => m[1]);
  console.log('\n===', path, '===');
  console.log('title h1:', h1);
  console.log('nav:', nav);
  console.log('unique xxtp:', [...new Set(xxtp)].slice(0, 15));
  console.log('page links:', [...new Set(pageLinks)].slice(0, 8));
  console.log('vods:', vods);
  console.log('filters sample:', filters.slice(0, 8));
}

const paths = ['/xxtp/1.html', '/xxtp/2.html', '/xxtp/3.html', '/xxtp/4.html', '/xxtp/20.html'];
for (const p of paths) await probe(p);
