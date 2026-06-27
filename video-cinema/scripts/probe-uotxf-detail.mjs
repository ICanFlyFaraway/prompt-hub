const UA = 'Mozilla/5.0';
const BASE = 'https://www.uotxf.cn';
const ids = [8877, 7180, 23918];
for (const id of ids) {
  const html = await fetch(`${BASE}/voddetail/${id}.html`, {
    headers: { 'User-Agent': UA, Referer: `${BASE}/` },
  }).then((r) => r.text());
  console.log(`\n=== ${id} ===`);
  console.log('title', html.match(/<title>([^<]*)</i)?.[1]);
  const poster =
    html.match(/data-original="([^"]+)"/)?.[1] ||
    html.match(/data-background="([^"]+)"/)?.[1] ||
    html.match(/lazyload[^>]*src="([^"]+)"/)?.[1];
  console.log('poster', poster?.slice(0, 80));
  for (const label of ['主演', '导演', '类型', '地区', '年份']) {
    const v = html.match(new RegExp(`${label}[^<]*</[^>]+>\\s*([^<\\n]{1,40})`))?.[1]?.trim();
    if (v) console.log(label, v);
  }
  const eps = [...html.matchAll(/href="\/vodplay\/\d+-\d+-\d+\.html"[^>]*>([^<]*)</g)].slice(0, 5);
  console.log('eps', eps.map((m) => m[1]).join(', '));
}
