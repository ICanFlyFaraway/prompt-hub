const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const res = await fetch('https://m.dckjqsh.com/xxdt/69190.html', {
  headers: { 'User-Agent': UA, Referer: 'https://m.dckjqsh.com/' },
});
const html = await res.text();
console.log('title', html.match(/<title>([^<]+)/)?.[1]);
console.log('h1', html.match(/<h1[^>]*>([^<]+)/)?.[1]);

const detail = html.match(/stui-content__detail[\s\S]{0,2800}/);
console.log('\ndetail:\n', detail?.[0]?.slice(0, 1800));

const playlists = [...html.matchAll(/<h3[^>]*>\s*([^<]*?)\s*<\/h3>[\s\S]*?<ul class="stui-content__playlist[^"]*">([\s\S]*?)<\/ul>/gi)];
console.log('\nplaylist count', playlists.length);
for (const [, name, body] of playlists) {
  const eps = [...body.matchAll(/href="([^"]*)"[^>]*>([^<]*)<\/a>/gi)];
  console.log(`\n--- ${name.trim()} (${eps.length} items) ---`);
  console.log(eps.slice(0, 8).map((e) => `${e[2]} -> ${e[1]}`).join('\n'));
}

const thumb = html.match(/stui-content__thumb[\s\S]{0,1200}/);
console.log('\nthumb:\n', thumb?.[0]?.slice(0, 900));
