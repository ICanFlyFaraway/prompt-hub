const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const res = await fetch('https://m.dckjqsh.com/xxtp/1.html', {
  headers: { 'User-Agent': UA, Referer: 'https://m.dckjqsh.com/' },
});
const html = await res.text();
console.log('len', html.length, 'status', res.status);

const screenBlock = html.match(/<ul class="stui-screen__list[\s\S]*?<\/ul>/);
console.log('\n--- screen list ---\n', screenBlock?.[0]?.slice(0, 2500));

const liSample = html.match(/<li>[\s\S]*?stui-vodlist__thumb[\s\S]*?<\/li>/);
console.log('\n--- vod li ---\n', liSample?.[0]?.slice(0, 800));

const hotBlock = html.match(/本周热门[\s\S]{0,1500}/);
console.log('\n--- hot ---\n', hotBlock?.[0]?.slice(0, 1200));

const pageBlock = html.match(/stui-page[\s\S]{0,800}/);
console.log('\n--- page ---\n', pageBlock?.[0]);

const vodGrid = html.match(/stui-vodlist clearfix[\s\S]{0,2000}/);
console.log('\n--- vod grid ---\n', vodGrid?.[0]?.slice(0, 1800));

const allScreens = [...html.matchAll(/<ul class="stui-screen__list[\s\S]*?<\/ul>/g)];
console.log('\n--- screen count ---', allScreens.length);
