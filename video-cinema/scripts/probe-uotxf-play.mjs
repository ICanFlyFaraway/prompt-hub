const UA = 'Mozilla/5.0';
const BASE = 'https://www.uotxf.cn';
const html = await fetch(`${BASE}/voddetail/7180.html`, {
  headers: { 'User-Agent': UA, Referer: `${BASE}/` },
}).then((r) => r.text());

const playLinks = [...html.matchAll(/href="(\/vodplay\/\d+-\d+-\d+\.html)"[^>]*>([^<]*)</g)];
console.log('play links', playLinks.slice(0, 8).map((m) => `${m[2]} ${m[1]}`));

const playlistBlocks = [...html.matchAll(/class="[^"]*playlist[^"]*"[\s\S]{0,2000}/gi)];
console.log('playlist blocks', playlistBlocks.length);

if (playLinks[0]) {
  const playHtml = await fetch(`${BASE}${playLinks[0][1]}`, {
    headers: { 'User-Agent': UA, Referer: `${BASE}/` },
  }).then((r) => r.text());
  const pa = playHtml.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);
  if (pa) console.log('player', JSON.parse(pa[1]));
  else {
    console.log('no player_aaaa, try other patterns');
    console.log(playHtml.match(/player_[a-z]+\s*=\s*\{/)?.[0]);
    console.log(playHtml.slice(0, 500));
  }
}
