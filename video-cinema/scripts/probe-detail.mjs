const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const res = await fetch('https://m.dckjqsh.com/xxdt/247937.html', {
  headers: { 'User-Agent': UA, Referer: 'https://m.dckjqsh.com/' },
});
const html = await res.text();

const top = html.match(/stui-content__detail[\s\S]{0,3500}/);
console.log('detail top:\n', top?.[0]?.slice(0, 2000));

const playlist = html.match(/stui-content__playlist[\s\S]{0,2000}/g);
console.log('\nplaylists count', playlist?.length);
playlist?.forEach((p, i) => console.log(`\n--- playlist ${i} ---\n`, p.slice(0, 600)));

const guess = html.match(/猜你喜欢[\s\S]{0,1200}/);
console.log('\nguess:\n', guess?.[0]?.slice(0, 800));

const sidebar = html.match(/本周热门[\s\S]{0,800}/);
console.log('\nsidebar:\n', sidebar?.[0]?.slice(0, 500));
