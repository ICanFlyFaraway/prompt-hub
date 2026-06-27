/** @typedef {'movie'|'tv'|'ustv'|'adult'|'variety'|'anime'|'short'} Category */

/**
 * @typedef {Object} Episode
 * @property {string} name
 * @property {string} url
 */

/**
 * @typedef {Object} Video
 * @property {number} id
 * @property {string} title
 * @property {Category} category
 * @property {string} subCategory
 * @property {string} poster
 * @property {number} rating
 * @property {string} status
 * @property {number} year
 * @property {string} area
 * @property {string} director
 * @property {string[]} actors
 * @property {string} description
 * @property {Episode[]} episodes
 * @property {string} updatedAt
 * @property {boolean} [featured]
 */

export const SITE = {
  name: '小草影院',
  pinyin: 'XIAO CAO YING YUAN',
  slogan: '最新好看高清电影 · 免费热播电影在线观看',
  todayUpdate: 376,
  icp: '渝ICP备19004206号-4',
};

export const NAV_ITEMS = [
  { key: 'home', label: '首页', path: '/' },
  { key: 'movie', label: '电影', path: '/category/movie' },
  { key: 'tv', label: '电视剧', path: '/category/tv' },
  { key: 'ustv', label: '美剧', path: '/category/ustv' },
  { key: 'adult', label: '情色', path: '/category/adult' },
  { key: 'variety', label: '综艺', path: '/category/variety' },
  { key: 'anime', label: '动漫', path: '/category/anime' },
  { key: 'short', label: '短剧', path: '/category/short' },
];

export const CATEGORY_META = {
  movie: {
    label: '电影',
    sectionTitle: '最新电影',
    hotTitle: '本周热门电影',
    subCategories: ['动作片', '喜剧片', '爱情片', '科幻片', '恐怖片', '剧情片', '战争片', '纪录片'],
  },
  tv: {
    label: '电视剧',
    sectionTitle: '最新电视剧',
    hotTitle: '本周热门电视剧',
    subCategories: ['国产剧', '港台剧', '日韩剧', '泰剧', '其他剧'],
  },
  ustv: {
    label: '美剧',
    sectionTitle: '最新美剧',
    hotTitle: '本周热门美剧',
    subCategories: ['欧美剧', '犯罪', '悬疑', '科幻', '喜剧', '剧情', '奇幻', '动作'],
    sourceFilter: '/xxsw/21-----------.html',
  },
  adult: {
    label: '情色',
    sectionTitle: '最新情色',
    hotTitle: '本周热门情色',
    subCategories: ['情色', '伦理', '理论', '三级', '限制级'],
    searchKeyword: '情色',
  },
  variety: {
    label: '综艺',
    sectionTitle: '最新综艺',
    hotTitle: '本周热门综艺',
    subCategories: ['大陆综艺', '港台综艺', '日韩综艺', '欧美综艺'],
  },
  anime: {
    label: '动漫',
    sectionTitle: '最新动漫',
    hotTitle: '本周热门动漫',
    subCategories: ['国产动漫', '日本动漫', '欧美动漫', '其他动漫'],
  },
  short: {
    label: '短剧',
    sectionTitle: '最新短剧',
    hotTitle: '本周热门短剧',
    subCategories: ['现代甜蜜', '古装穿越', '动漫合集', '逆袭重生', '都市情感'],
  },
};

const DEMO_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

/** @param {number} id */
function poster(id) {
  return `https://picsum.photos/seed/cinema-${id}/300/450`;
}

/** @param {number} id */
function banner(id) {
  return `https://picsum.photos/seed/banner-${id}/1200/420`;
}

/** @type {Video[]} */
const RAW = [
  // 电影
  { id: 1, title: '棕熊！', category: 'movie', subCategory: '喜剧片', status: '正片', year: 2026, area: '日本', director: '铃木福', actors: ['铃木福'], rating: 7.2, featured: true,
    description: '一只棕熊误入人类世界，引发一连串温馨又爆笑的奇遇。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-08' },
  { id: 2, title: '真人快打2-5月18日-HD高清', category: 'movie', subCategory: '动作片', status: '已完结', year: 2026, area: '美国', director: '西蒙·麦奎德', actors: ['卡尔·厄本', '阿德莱恩·鲁道夫', '林路迪'], rating: 6.8, featured: true,
    description: '经典格斗游戏改编，各路强者再度集结，展开殊死对决。',
    episodes: [{ name: 'HD高清', url: DEMO_VIDEO }], updatedAt: '2026-06-07' },
  { id: 3, title: '长尾豹马修2026', category: 'movie', subCategory: '喜剧片', status: '正片', year: 2026, area: '法国', director: '艾洛蒂·丰唐', actors: ['菲利普·拉肖', '贾梅尔·杜布兹', '塔雷克·布达里'], rating: 7.5,
    description: '长尾豹马修全新冒险，笑料不断。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-07' },
  { id: 4, title: '寻她 普通话版', category: 'movie', subCategory: '剧情片', status: '正片', year: 2026, area: '大陆', director: '内详', actors: ['舒淇', '白客', '张本煜', '郎月婷'], rating: 8.1, featured: true,
    description: '一段关于寻找与重逢的温情故事，普通话配音版。',
    episodes: [{ name: '普通话版', url: DEMO_VIDEO }], updatedAt: '2026-06-06' },
  { id: 5, title: '寻她（粤语版）', category: 'movie', subCategory: '剧情片', status: 'TC中字', year: 2026, area: '大陆', director: '内详', actors: ['舒淇', '白客', '张本煜', '郎月婷', '邱天'], rating: 8.0,
    description: '粤语原声版本，保留地道对白韵味。',
    episodes: [{ name: '粤语版', url: DEMO_VIDEO }], updatedAt: '2026-06-06' },
  { id: 6, title: '情歌恋习曲', category: 'movie', subCategory: '爱情片', status: '正片', year: 2026, area: '美国', director: '内详', actors: ['保罗·路德', '尼克·乔纳斯', '哈瓦娜·罗丝·刘'], rating: 6.5,
    description: '音乐与爱情交织的浪漫喜剧。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-05' },
  { id: 7, title: '特工蹦擦擦', category: 'movie', subCategory: '动作片', status: '正片', year: 2026, area: '土耳其', director: '内详', actors: ['格来·阿尔蒂诺克', '奥兹格·奥扎卡尔'], rating: 6.2,
    description: '特工任务与家庭喜剧的奇妙碰撞。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-05' },
  { id: 8, title: '狙击7队', category: 'movie', subCategory: '战争片', status: 'HD国语', year: 2026, area: '澳大利亚', director: '内详', actors: ['拉达·米切尔', '蒂姆·罗斯', '瑞恩·柯万腾'], rating: 6.9,
    description: '精英狙击小队执行绝密任务，生死一线。',
    episodes: [{ name: 'HD国语', url: DEMO_VIDEO }], updatedAt: '2026-06-04' },
  { id: 9, title: '寻她', category: 'movie', subCategory: '剧情片', status: 'DVD中字', year: 2026, area: '大陆', director: '内详', actors: ['舒淇', '白客', '张本煜', '郎月婷'], rating: 8.3,
    description: '同名作品标准版，口碑剧情佳作。',
    episodes: [{ name: 'DVD中字', url: DEMO_VIDEO }], updatedAt: '2026-06-04' },
  { id: 10, title: '云裳风暴', category: 'movie', subCategory: '剧情片', status: '正片', year: 2025, area: '欧美', director: '内详', actors: ['索菲娅·罗兰', '朱莉娅·罗伯茨', '福里斯特·惠特克'], rating: 7.8,
    description: '时尚界风云变幻中的权力与欲望。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-03' },
  { id: 11, title: '我的邻居是女巫', category: 'movie', subCategory: '恐怖片', status: '正片', year: 2026, area: '印尼', director: '内详', actors: ['索利玛·克里斯蒂娜·希卡'], rating: 5.8,
    description: '温馨社区背后隐藏着不可告人的秘密。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-03' },
  { id: 12, title: '兰子汉', category: 'movie', subCategory: '纪录片', status: '正片', year: 2025, area: '爱尔兰', director: '内详', actors: ['Darragh Humphreys', '阿道·欧汉隆'], rating: 7.0,
    description: '记录爱尔兰乡村生活的真实影像。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-02' },

  // 电视剧
  { id: 101, title: '厂区日志', category: 'tv', subCategory: '国产剧', status: '更新至12集', year: 2026, area: '大陆', director: '内详', actors: ['王宁', '尹贝希', '张金条', '徐岑子'], rating: 7.4, featured: true,
    description: '工厂里一群年轻人的日常与梦想。',
    episodes: Array.from({ length: 12 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 102, title: '逍遥四公子', category: 'tv', subCategory: '国产剧', status: '更新至24集', year: 2026, area: '大陆', director: '内详', actors: ['王东', '潘麓宇', '陈洁怡', '骆诗琪'], rating: 8.2,
    description: '四位公子哥的江湖传奇。',
    episodes: Array.from({ length: 24 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 103, title: '风，带有香气', category: 'tv', subCategory: '日韩剧', status: '更新至8集', year: 2026, area: '日本', director: '内详', actors: ['见上爱', '上坂树里', '水野美纪', '多部未华子'], rating: 8.5, featured: true,
    description: '治愈系日剧，风与花香中的都市故事。',
    episodes: Array.from({ length: 8 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 104, title: '翘楚', category: 'tv', subCategory: '国产剧', status: '更新至16集', year: 2026, area: '大陆', director: '内详', actors: ['陈都灵', '周翊然', '唐晓天', '王瑞昌'], rating: 8.0,
    description: '古装权谋与青春成长并行。',
    episodes: Array.from({ length: 16 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 105, title: '白日飞升', category: 'tv', subCategory: '国产剧', status: '全36集', year: 2026, area: '大陆', director: '内详', actors: ['完颜洛绒', '王俊笔', '钟晨瑶'], rating: 7.6,
    description: '修仙世界的逆袭之路。',
    episodes: Array.from({ length: 36 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 106, title: '她战', category: 'tv', subCategory: '国产剧', status: '更新至10集', year: 2026, area: '大陆', director: '内详', actors: ['李若天', '朱近桐', '钱冬旎'], rating: 7.1,
    description: '女性职场奋斗题材剧集。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 107, title: '借颜', category: 'tv', subCategory: '国产剧', status: '更新至18集', year: 2026, area: '大陆', director: '内详', actors: ['任运杰', '戚砚笛', '辛浩江'], rating: 7.3,
    description: '身份互换引发的情感纠葛。',
    episodes: Array.from({ length: 18 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 108, title: '罪案现场', category: 'tv', subCategory: '国产剧', status: '全24集', year: 2026, area: '大陆', director: '内详', actors: ['刘俊孝', '刘宇航', '许晓诺'], rating: 7.9,
    description: '悬疑罪案，层层剥茧追寻真相。',
    episodes: Array.from({ length: 24 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 109, title: '耀眼2026', category: 'tv', subCategory: '国产剧', status: '更新至6集', year: 2026, area: '大陆', director: '内详', actors: ['关晓彤', '李昀锐', '高露', '鲍起静'], rating: 8.4,
    description: '家庭与梦想的温暖叙事。',
    episodes: Array.from({ length: 6 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 110, title: '礼物', category: 'tv', subCategory: '日韩剧', status: '更新至4集', year: 2026, area: '日本', director: '内详', actors: ['堤真一', '有村架纯', '山田裕贵'], rating: 8.6,
    description: '一份礼物改变了几代人的命运。',
    episodes: Array.from({ length: 4 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 111, title: '一年', category: 'ustv', subCategory: '欧美剧', status: '全10集', year: 2025, area: '美国', director: '内详', actors: ['内详'], rating: 7.7, featured: true,
    description: '一年时间里的成长与蜕变。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },
  { id: 113, title: '犯罪记录第二季', category: 'ustv', subCategory: '犯罪', status: '更新中', year: 2026, area: '美国', director: '内详', actors: ['彼得·卡帕尔迪'], rating: 8.1,
    description: '悬疑犯罪题材美剧续季。',
    episodes: Array.from({ length: 8 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 114, title: '克拉克森的农场 第五季', category: 'ustv', subCategory: '喜剧', status: '更新中', year: 2026, area: '英国', director: '内详', actors: ['杰里米·克拉克森'], rating: 8.8, featured: true,
    description: '克拉克森继续他的农场冒险。',
    episodes: Array.from({ length: 6 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 115, title: '惊魂海湾第一季', category: 'ustv', subCategory: '悬疑', status: '全8集', year: 2025, area: '美国', director: '内详', actors: ['内详'], rating: 7.5,
    description: '海滨小镇上的离奇案件。',
    episodes: Array.from({ length: 8 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 112, title: '给你爱情处方', category: 'tv', subCategory: '日韩剧', status: '全16集', year: 2025, area: '韩国', director: '内详', actors: ['陈世妍', '朴基雄', '金承秀'], rating: 6.8,
    description: '爱情如同处方，需要对症下药。',
    episodes: Array.from({ length: 16 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },

  // 情色（离线演示）
  { id: 116, title: '爱情色香味', category: 'adult', subCategory: '情色', status: '正片', year: 2024, area: '香港', director: '内详', actors: ['内详'], rating: 6.5,
    description: '离线演示条目。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-05' },
  { id: 117, title: '限制级杀手', category: 'adult', subCategory: '限制级', status: '正片', year: 2023, area: '美国', director: '内详', actors: ['内详'], rating: 6.2,
    description: '离线演示条目。',
    episodes: [{ name: '正片', url: DEMO_VIDEO }], updatedAt: '2026-06-04' },

  // 综艺
  { id: 201, title: '花样青春限量版', category: 'variety', subCategory: '韩国综艺', status: '更新至6期', year: 2026, area: '韩国', director: '罗暎锡', actors: ['郑裕美', '朴叙俊', '崔宇植'], rating: 9.0, featured: true,
    description: '罗PD经典旅行综艺回归。',
    episodes: Array.from({ length: 6 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 202, title: '男生女生向前冲第十八季', category: 'variety', subCategory: '大陆综艺', status: '更新至20期', year: 2026, area: '大陆', director: '内详', actors: ['内详'], rating: 6.5,
    description: '经典闯关综艺第十八季。',
    episodes: Array.from({ length: 20 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 203, title: '第三调解室', category: 'variety', subCategory: '大陆综艺', status: '更新至100期', year: 2026, area: '大陆', director: '内详', actors: ['刘佳', '何国锋', '张小童'], rating: 7.2,
    description: '真实案例调解，化解社会矛盾。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 204, title: '毛雪汪', category: 'variety', subCategory: '大陆综艺', status: '更新至50期', year: 2026, area: '大陆', director: '内详', actors: ['毛不易', '李雪琴', '元宝'], rating: 8.3,
    description: '轻松聊天类慢综艺。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 205, title: '全知干预视角', category: 'variety', subCategory: '韩国综艺', status: '更新至200期', year: 2026, area: '韩国', director: '内详', actors: ['李英子', '全炫茂', '宋恩伊'], rating: 8.0,
    description: '明星经纪人视角揭秘幕后。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 206, title: '拜托了冰箱2', category: 'variety', subCategory: '韩国综艺', status: '全12期', year: 2025, area: '韩国', director: '内详', actors: ['金圣柱', '安贞焕'], rating: 7.8,
    description: '明星冰箱大公开，厨师创意料理。',
    episodes: Array.from({ length: 12 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 207, title: '台湾第一等', category: 'variety', subCategory: '港台综艺', status: '更新至30期', year: 2026, area: '台湾', director: '内详', actors: ['小马'], rating: 6.9,
    description: '台湾本土趣味综艺。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 208, title: '钱塘老娘舅', category: 'variety', subCategory: '大陆综艺', status: '日更', year: 2026, area: '大陆', director: '内详', actors: ['迟婷', '小胖', '陈金林'], rating: 7.0,
    description: '邻里纠纷调解真人秀。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 209, title: '为爱闪耀的她', category: 'variety', subCategory: '大陆综艺', status: '更新至8期', year: 2026, area: '大陆', director: '内详', actors: ['内详'], rating: 6.6,
    description: '女性成长励志综艺。',
    episodes: Array.from({ length: 8 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 210, title: '半熟恋人第五季', category: 'variety', subCategory: '大陆综艺', status: '更新至6期', year: 2026, area: '大陆', director: '内详', actors: ['内详'], rating: 7.5,
    description: '都市轻熟龄恋爱观察综艺。',
    episodes: Array.from({ length: 6 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 211, title: '爸爸当家第五季', category: 'variety', subCategory: '大陆综艺', status: '更新至10期', year: 2026, area: '大陆', director: '内详', actors: ['郑思维', '刘钰雯', '萨琪拉'], rating: 8.1,
    description: '爸爸带娃亲子真人秀。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },
  { id: 212, title: '奔跑吧第十季', category: 'variety', subCategory: '大陆综艺', status: '更新至4期', year: 2026, area: '大陆', director: '内详', actors: ['李晨', '郑恺', '沙溢', '白鹿', '范丞丞'], rating: 7.4, featured: true,
    description: '国民户外竞技综艺第十季。',
    episodes: Array.from({ length: 4 }, (_, i) => ({ name: `第${i + 1}期`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },

  // 动漫
  { id: 301, title: '奔跑的木头', category: 'anime', subCategory: '国产动漫', status: '更新至12集', year: 2026, area: '大陆', director: '内详', actors: ['内详'], rating: 6.8,
    description: '木质小人偶的奇幻冒险。',
    episodes: Array.from({ length: 12 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 302, title: '瑞克和莫蒂第九季', category: 'anime', subCategory: '欧美动漫', status: '更新至6集', year: 2026, area: '美国', director: '内详', actors: ['伊恩·卡多尼', '哈利·贝尔登'], rating: 9.2, featured: true,
    description: '科幻荒诞喜剧动画第九季。',
    episodes: Array.from({ length: 6 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 303, title: '大道独行之蝶龙变', category: 'anime', subCategory: '国产动漫', status: '更新至8集', year: 2026, area: '大陆', director: '内详', actors: ['洛离'], rating: 7.5,
    description: '修仙题材国漫新作。',
    episodes: Array.from({ length: 8 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 304, title: '被家族抛弃，我觉醒九亿属性点', category: 'anime', subCategory: '国产动漫', status: '更新至16集', year: 2026, area: '大陆', director: '内详', actors: ['内详'], rating: 6.5,
    description: '逆袭爽文改编动态漫。',
    episodes: Array.from({ length: 16 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 305, title: '新大头儿子和小头爸爸——运动中国行', category: 'anime', subCategory: '国产动漫', status: '全52集', year: 2025, area: '大陆', director: '内详', actors: ['内详'], rating: 7.0,
    description: '经典亲子动画运动主题篇。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 306, title: '汤直志异', category: 'anime', subCategory: '国产动漫', status: '更新至10集', year: 2026, area: '大陆', director: '内详', actors: ['内详'], rating: 7.8,
    description: '志怪题材国风动画。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 307, title: '灵武大陆', category: 'anime', subCategory: '国产动漫', status: '更新至80集', year: 2026, area: '大陆', director: '内详', actors: ['内详'], rating: 7.2,
    description: '玄幻热血长篇国漫。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 308, title: '无上神帝', category: 'anime', subCategory: '国产动漫', status: '更新至400集', year: 2026, area: '大陆', director: '内详', actors: ['溪林', '郭懿骧', '关帅'], rating: 6.9,
    description: '长篇修仙动画连载。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 309, title: '逆天至尊', category: 'anime', subCategory: '国产动漫', status: '更新至300集', year: 2026, area: '大陆', director: '内详', actors: ['阿旦', '糖醋里脊'], rating: 6.7,
    description: '热血升级流国漫。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 310, title: '茉莉花酱的好感度正在崩坏', category: 'anime', subCategory: '日本动漫', status: '更新至6集', year: 2026, area: '日本', director: '内详', actors: ['天崎滉平', '内田真礼'], rating: 8.0,
    description: '恋爱喜剧新番。',
    episodes: Array.from({ length: 6 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 311, title: '幽灵音乐会：遗失的歌曲', category: 'anime', subCategory: '日本动漫', status: '更新至4集', year: 2026, area: '日本', director: '内详', actors: ['藤寺美德', '入野自由', '花泽香菜'], rating: 8.3,
    description: '音乐与幽灵交织的奇幻故事。',
    episodes: Array.from({ length: 4 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },
  { id: 312, title: '黑猫和魔女的课堂', category: 'anime', subCategory: '日本动漫', status: '更新至8集', year: 2026, area: '日本', director: '内详', actors: ['本渡枫', '岛崎信长', '花泽香菜'], rating: 7.9, featured: true,
    description: '魔女学院奇幻日常。',
    episodes: Array.from({ length: 8 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },

  // 短剧
  { id: 401, title: '一袖清风断却尘缘-现代甜蜜', category: 'short', subCategory: '现代甜蜜', status: '全80集', year: 2026, area: '大陆', director: '内详', actors: ['傅景程', '苏婳'], rating: 8.5,
    description: '现代都市甜宠短剧。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 402, title: '她请旨和亲后太子悔不当初-动漫合集', category: 'short', subCategory: '动漫合集', status: '全60集', year: 2026, area: '大陆', director: '内详', actors: ['楚望舒', '陆沉'], rating: 7.8,
    description: '古装和亲题材动态短剧。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-08' },
  { id: 403, title: '我哥竟穿成了摄政王第一季-动漫合集', category: 'short', subCategory: '动漫合集', status: '全50集', year: 2026, area: '大陆', director: '内详', actors: ['林破天', '林娇娇'], rating: 7.2,
    description: '穿越摄政王的搞笑日常。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 404, title: '开局荒年弃妇我靠穿梭两界屯粮-动漫合集', category: 'short', subCategory: '动漫合集', status: '全70集', year: 2026, area: '大陆', director: '内详', actors: ['沈文远', '小穗'], rating: 7.0,
    description: '双界穿梭种田逆袭。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-07' },
  { id: 405, title: '又菜又爱玩大唐小公主穿现代-动漫合集', category: 'short', subCategory: '古装穿越', status: '全40集', year: 2026, area: '大陆', director: '内详', actors: ['李明达', '江南'], rating: 6.8,
    description: '大唐公主穿越现代的趣事。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 406, title: '最强纨绔化身大乾第一发明家-动漫合集', category: 'short', subCategory: '逆袭重生', status: '全55集', year: 2026, area: '大陆', director: '内详', actors: ['李黑子', '王林'], rating: 7.1,
    description: '纨绔子弟变身发明奇才。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-06' },
  { id: 407, title: '放弃家产后我荣耀归来-动漫合集', category: 'short', subCategory: '逆袭重生', status: '全45集', year: 2026, area: '大陆', director: '内详', actors: ['小北'], rating: 7.4,
    description: '弃子归来复仇逆袭。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 408, title: '青云归脉-动漫合集', category: 'short', subCategory: '古装穿越', status: '全60集', year: 2026, area: '大陆', director: '内详', actors: ['顾雨晴', '沈青云'], rating: 7.6,
    description: '修仙门派恩怨情仇。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-05' },
  { id: 409, title: '婆家的螃蟹我的离婚书-动漫合集', category: 'short', subCategory: '都市情感', status: '全30集', year: 2026, area: '大陆', director: '内详', actors: ['刘云'], rating: 6.9,
    description: '婚姻矛盾与现实抉择。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 410, title: '国宴厨娘落凡尘-动漫合集', category: 'short', subCategory: '古装穿越', status: '全50集', year: 2026, area: '大陆', director: '内详', actors: ['何修远', '何知宁'], rating: 8.0, featured: true,
    description: '御厨娘下凡开酒楼。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-04' },
  { id: 411, title: '大唐小公主的现代生活-动漫合集', category: 'short', subCategory: '古装穿越', status: '全35集', year: 2026, area: '大陆', director: '内详', actors: ['洛修', '艾德里安'], rating: 7.3,
    description: '公主适应现代生活的爆笑日常。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },
  { id: 412, title: '考古成真疯了吧还说游戏编的-动漫合集', category: 'short', subCategory: '动漫合集', status: '全40集', year: 2026, area: '大陆', director: '内详', actors: ['陈平安'], rating: 7.5,
    description: '游戏设定竟成现实的考古冒险。',
    episodes: Array.from({ length: 10 }, (_, i) => ({ name: `第${i + 1}集`, url: DEMO_VIDEO })), updatedAt: '2026-06-03' },
];

export const VIDEOS = RAW.map((v) => ({
  ...v,
  poster: poster(v.id),
}));

export const BANNERS = [
  { id: 1, title: '花间令', videoId: 104, image: banner(1) },
  { id: 2, title: '惜花芷', videoId: 109, image: banner(2) },
  { id: 3, title: '手术直播间', videoId: 108, image: banner(3) },
  { id: 4, title: '寻她', videoId: 4, image: banner(4) },
  { id: 5, title: '瑞克和莫蒂第九季', videoId: 302, image: banner(5) },
];

/** @param {number} id */
export function getVideoById(id) {
  return VIDEOS.find((v) => v.id === id) ?? null;
}

/** @param {Category} category */
export function getVideosByCategory(category, limit = Infinity) {
  return VIDEOS.filter((v) => v.category === category).slice(0, limit);
}

/** @param {Category} category */
export function getHotVideos(category, limit = 9) {
  return [...VIDEOS]
    .filter((v) => v.category === category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/** @param {string} keyword */
export function searchVideos(keyword) {
  const q = keyword.trim().toLowerCase();
  if (!q) return [];
  return VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.actors.some((a) => a.toLowerCase().includes(q)) ||
      v.director.toLowerCase().includes(q) ||
      v.subCategory.includes(q),
  );
}

/** @param {Category} category @param {string} [subCategory] */
export function filterVideos(category, subCategory) {
  return VIDEOS.filter(
    (v) => v.category === category && (!subCategory || v.subCategory === subCategory),
  );
}

/** @param {number} videoId @param {number} limit */
export function getRelatedVideos(videoId, limit = 6) {
  const current = getVideoById(videoId);
  if (!current) return [];
  return VIDEOS.filter((v) => v.id !== videoId && v.category === current.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getFeaturedVideos() {
  return VIDEOS.filter((v) => v.featured);
}
