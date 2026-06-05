/** 扩展提示词：每类补足至至少 10 条 */
export const EXTENDED_PROMPTS = [
  // —— writing ×6 ——
  {
    id: 'writing-poetry',
    model: 'chatgpt',
    category: 'writing',
    icon: '🌙',
    accent: 'var(--accent2)',
    uses: 760,
    tags: { zh: ['诗歌', '文学'], en: ['Poetry', 'Literature'] },
    title: { zh: '现代诗创作助手', en: 'Modern poetry assistant' },
    description: { zh: '按意象与节奏创作原创诗作，附创作说明。', en: 'Original poems with imagery, rhythm, and craft notes.' },
    content: {
      zh: '主题：[填写] 情绪：[忧郁/激昂/宁静] 风格：[海子/余光中/自由体]\n请写一首 12–20 行的现代诗，并附 3 句创作说明（意象选择与节奏设计）。',
      en: 'Theme: [fill] Mood: [melancholy/energetic/calm] Style: [free verse/lyrical]\nWrite a 12–20 line modern poem plus 3 sentences on imagery and rhythm choices.'
    }
  },
  {
    id: 'writing-resume',
    model: 'chatgpt',
    category: 'writing',
    icon: '📄',
    accent: 'var(--blue)',
    uses: 2100,
    tags: { zh: ['简历', '求职'], en: ['Resume', 'Career'] },
    title: { zh: 'ATS 友好简历优化', en: 'ATS-friendly resume polish' },
    description: { zh: '关键词对齐 JD，量化成果，一页结构清晰。', en: 'Align keywords to JD, quantify wins, one-page structure.' },
    content: {
      zh: '目标岗位 JD：[粘贴] 我的简历：[粘贴]\n请输出优化版简历要点（bullet 用 STAR+数据），并列出应补充的关键词与需删减的冗余表述。',
      en: 'Job description: [paste] Resume: [paste]\nOutput optimized bullet points (STAR + metrics), keywords to add, and fluff to cut.'
    }
  },
  {
    id: 'writing-wechat',
    model: 'claude',
    category: 'writing',
    icon: '💬',
    accent: 'var(--green)',
    uses: 1680,
    tags: { zh: ['公众号', '长文'], en: ['WeChat', 'Long-form'] },
    title: { zh: '公众号深度文框架', en: 'WeChat long-read framework' },
    description: { zh: '钩子开篇、层层递进、金句结尾与转发语。', en: 'Hook, layered argument, quotable close, share line.' },
    content: {
      zh: '选题：[填写] 读者：[填写] 字数约 2500\n请给：标题 5 个、导语、3 个小标题结构、每节要点、结尾金句、朋友圈转发语（40字内）。',
      en: 'Topic: [fill] Audience: [fill] ~2500 chars\nProvide: 5 titles, intro, 3 H2 sections with bullets, closing line, 40-char share blurb.'
    }
  },
  {
    id: 'writing-translate',
    model: 'claude',
    category: 'writing',
    icon: '🌐',
    accent: 'var(--teal)',
    uses: 1420,
    tags: { zh: ['翻译', '本地化'], en: ['Translation', 'Localization'] },
    title: { zh: '专业本地化翻译', en: 'Professional localization' },
    description: { zh: '意译优先、术语表一致、附文化注释。', en: 'Meaning-first translation with glossary and cultural notes.' },
    content: {
      zh: '源语言→目标语言：[中→英] 领域：[科技/法律/营销] 术语表：[可选]\n翻译以下内容，附 3 处文化适配说明与备选译法：\n\n[粘贴原文]',
      en: 'Source→target: [ZH→EN] Domain: [tech/legal/marketing] Glossary: [optional]\nTranslate below with 3 localization notes and alternative phrasings:\n\n[Paste source]'
    }
  },
  {
    id: 'writing-headline',
    model: 'chatgpt',
    category: 'writing',
    icon: '📰',
    accent: 'var(--amber)',
    uses: 980,
    tags: { zh: ['标题', '新闻'], en: ['Headline', 'News'] },
    title: { zh: '新闻标题 ABC 测试', en: 'News headline A/B/C test' },
    description: { zh: '客观、吸引点击但不标题党，三种角度各 5 条。', en: 'Factual, clickable, not clickbait—15 variants in 3 angles.' },
    content: {
      zh: '新闻事实：[填写] 平台：[门户/财经/科技]\n分别给出：客观报道型、利益相关型、悬念型标题各 5 条（≤28字），并标注各适合的场景。',
      en: 'Facts: [fill] Outlet style: [general/finance/tech]\nGive 5 factual, 5 stakeholder, 5 curiosity headlines (≤60 chars) with usage notes.'
    }
  },
  {
    id: 'writing-abstract',
    model: 'claude',
    category: 'writing',
    icon: '🎓',
    accent: 'var(--accent)',
    uses: 870,
    tags: { zh: ['论文', '学术'], en: ['Paper', 'Academic'] },
    title: { zh: '学术论文摘要撰写', en: 'Academic abstract writer' },
    description: { zh: '背景-方法-结果-结论四句式，符合期刊字数。', en: 'Background-method-results-conclusion within word limit.' },
    content: {
      zh: '研究领域：[填写] 核心创新：[填写] 字数上限：[250/300]\n根据我提供的要点撰写英文/中文摘要，并列出 5 个关键词（含英文）。\n\n要点：[粘贴]',
      en: 'Field: [fill] Contribution: [fill] Word limit: [250/300]\nWrite abstract + 5 keywords from my notes:\n\n[Paste notes]'
    }
  },

  // —— coding ×5 ——
  {
    id: 'coding-react',
    model: 'chatgpt',
    category: 'coding',
    icon: '⚛️',
    accent: 'var(--blue)',
    uses: 2200,
    tags: { zh: ['React', '前端'], en: ['React', 'Frontend'] },
    title: { zh: 'React 组件生成', en: 'React component generator' },
    description: { zh: 'TypeScript + 无障碍 + 响应式，附 props 类型。', en: 'TypeScript, a11y, responsive, with prop types.' },
    content: {
      zh: '需求：[描述 UI 与交互] 技术栈：React 18 + TypeScript + CSS Modules\n请输出完整组件代码、Props 接口、以及 2 条使用示例。',
      en: 'Requirements: [UI + behavior] Stack: React 18 + TypeScript + CSS Modules\nOutput full component, Props interface, and 2 usage examples.'
    }
  },
  {
    id: 'coding-debug',
    model: 'claude',
    category: 'coding',
    icon: '🐛',
    accent: 'var(--coral)',
    uses: 1890,
    tags: { zh: ['调试', '排错'], en: ['Debug', 'Troubleshoot'] },
    title: { zh: '报错侦探', en: 'Error detective' },
    description: { zh: '从堆栈定位根因，给出最小修复 diff。', en: 'Trace stack to root cause with minimal fix diff.' },
    content: {
      zh: '环境：[Node/Python/浏览器等] 期望行为：[填写]\n根据报错信息与代码，按序：1）复述现象 2）根因假设（按概率排序）3）验证步骤 4）最小修复代码\n\n[粘贴报错+代码]',
      en: 'Environment: [fill] Expected: [fill]\nFrom error + code: 1) Symptom 2) Root-cause hypotheses 3) Verification steps 4) Minimal fix\n\n[Paste error + code]'
    }
  },
  {
    id: 'coding-regex',
    model: 'chatgpt',
    category: 'coding',
    icon: '🔤',
    accent: 'var(--amber)',
    uses: 1340,
    tags: { zh: ['正则', '工具'], en: ['Regex', 'Tools'] },
    title: { zh: '正则表达式生成器', en: 'Regex builder' },
    description: { zh: '解释每个捕获组，附测试用例与边界说明。', en: 'Explain groups, test cases, and edge cases.' },
    content: {
      zh: '匹配需求：[用自然语言描述] 语言 flavor：[JS/Python]\n输出：正则表达式、逐段解释、5 个应匹配/不应匹配示例。',
      en: 'Match requirement: [describe in plain language] Flavor: [JS/Python]\nOutput: regex, segment explanation, 5 should-match and 5 should-not-match examples.'
    }
  },
  {
    id: 'coding-git-commit',
    model: 'chatgpt',
    category: 'coding',
    icon: '📦',
    accent: 'var(--green)',
    uses: 1560,
    tags: { zh: ['Git', '规范'], en: ['Git', 'Convention'] },
    title: { zh: 'Conventional Commits 生成', en: 'Conventional Commits generator' },
    description: { zh: '根据 diff 生成规范提交信息与 PR 描述。', en: 'Commit message and PR body from your diff.' },
    content: {
      zh: '根据以下 git diff，生成：1）符合 Conventional Commits 的 subject（≤72字）2）body 3）可选 BREAKING CHANGE 4）简短 PR 描述\n\n[粘贴 diff]',
      en: 'From this diff, produce: 1) Conventional Commits subject (≤72 chars) 2) body 3) optional BREAKING CHANGE 4) short PR description\n\n[Paste diff]'
    }
  },
  {
    id: 'coding-docker',
    model: 'claude',
    category: 'coding',
    icon: '🐳',
    accent: 'var(--teal)',
    uses: 920,
    tags: { zh: ['Docker', 'DevOps'], en: ['Docker', 'DevOps'] },
    title: { zh: 'Dockerfile 安全审查', en: 'Dockerfile security review' },
    description: { zh: '镜像瘦身、非 root、漏洞与层缓存优化。', en: 'Slim image, non-root, CVE hints, layer caching.' },
    content: {
      zh: '请审查以下 Dockerfile：1）安全风险 2）镜像体积优化 3）构建缓存 4）改进版 Dockerfile\n\n[粘贴 Dockerfile]',
      en: 'Review this Dockerfile: 1) Security risks 2) Size optimization 3) Build cache 4) Improved Dockerfile\n\n[Paste Dockerfile]'
    }
  },

  // —— image ×6 ——
  {
    id: 'image-mj-logo',
    model: 'midjourney',
    category: 'image',
    icon: '🔷',
    accent: 'var(--accent)',
    uses: 1750,
    tags: { zh: ['Midjourney', 'Logo'], en: ['Midjourney', 'Logo'] },
    title: { zh: 'MJ 极简 Logo 设计', en: 'MJ minimalist logo' },
    description: { zh: '矢量感、单色可延展、适合科技品牌。', en: 'Vector feel, monochrome, scalable tech brand mark.' },
    content: {
      zh: 'minimalist logo design for [品牌名], geometric abstract symbol, flat design, single color [色值], white background, professional branding, vector style --ar 1:1 --v 6 --style raw',
      en: 'minimalist logo design for [brand name], geometric abstract symbol, flat design, single color [hex], white background, professional branding, vector style --ar 1:1 --v 6 --style raw'
    }
  },
  {
    id: 'image-mj-interior',
    model: 'midjourney',
    category: 'image',
    icon: '🛋️',
    accent: 'var(--teal)',
    uses: 1320,
    tags: { zh: ['Midjourney', '室内'], en: ['Midjourney', 'Interior'] },
    title: { zh: 'MJ 北欧风室内设计', en: 'MJ Scandinavian interior' },
    description: { zh: '自然光、木质与绿植，建筑杂志质感。', en: 'Natural light, wood, plants, architectural magazine look.' },
    content: {
      zh: 'Scandinavian living room interior, [面积/户型], oak flooring, large windows natural light, indoor plants, neutral palette, architectural photography, ArchDaily style --ar 16:9 --v 6',
      en: 'Scandinavian living room interior, [size/layout], oak flooring, large windows natural light, indoor plants, neutral palette, architectural photography, ArchDaily style --ar 16:9 --v 6'
    }
  },
  {
    id: 'image-sd-landscape',
    model: 'sd',
    category: 'image',
    icon: '🏔️',
    accent: 'var(--green)',
    uses: 1980,
    tags: { zh: ['SD', '风景'], en: ['SD', 'Landscape'] },
    title: { zh: 'SD 史诗风光大片', en: 'SD epic landscape' },
    description: { zh: '广角、戏剧光线、国家地理风格。', en: 'Wide angle, dramatic light, National Geographic style.' },
    content: {
      zh: 'epic landscape of [地点], golden hour, dramatic clouds, wide angle 14mm, ultra detailed, National Geographic photography, 8k, cinematic color grading',
      en: 'epic landscape of [location], golden hour, dramatic clouds, wide angle 14mm, ultra detailed, National Geographic photography, 8k, cinematic color grading'
    }
  },
  {
    id: 'image-sd-product',
    model: 'sd',
    category: 'image',
    icon: '📦',
    accent: 'var(--amber)',
    uses: 1540,
    tags: { zh: ['SD', '电商'], en: ['SD', 'E-commerce'] },
    title: { zh: 'SD 产品场景图', en: 'SD product lifestyle shot' },
    description: { zh: '产品置入生活场景，柔和布光。', en: 'Product in lifestyle scene with soft lighting.' },
    content: {
      zh: '[产品] placed on [场景桌面/厨房/办公桌], lifestyle product photography, soft box lighting, shallow depth of field, commercial advertising, clean composition',
      en: '[product] placed on [scene desk/kitchen/office], lifestyle product photography, soft box lighting, shallow depth of field, commercial advertising, clean composition'
    }
  },
  {
    id: 'image-mj-anime',
    model: 'midjourney',
    category: 'image',
    icon: '⚡',
    accent: 'var(--pink)',
    uses: 2890,
    tags: { zh: ['Midjourney', '动漫'], en: ['Midjourney', 'Anime'] },
    title: { zh: 'MJ 热血动漫海报', en: 'MJ shonen anime poster' },
    description: { zh: '动态构图、高饱和、漫画网点背景。', en: 'Dynamic pose, saturated colors, halftone background.' },
    content: {
      zh: 'anime key visual, [角色描述], dynamic action pose, speed lines, vibrant colors, halftone background, poster composition, studio quality --ar 2:3 --niji 6',
      en: 'anime key visual, [character description], dynamic action pose, speed lines, vibrant colors, halftone background, poster composition, studio quality --ar 2:3 --niji 6'
    }
  },
  {
    id: 'image-mj-food',
    model: 'midjourney',
    category: 'image',
    icon: '🍜',
    accent: 'var(--coral)',
    uses: 1760,
    tags: { zh: ['Midjourney', '美食'], en: ['Midjourney', 'Food'] },
    title: { zh: 'MJ 美食摄影', en: 'MJ food photography' },
    description: { zh: '食欲感、蒸汽与质感特写，餐厅菜单适用。', en: 'Appetizing steam and texture close-up for menus.' },
    content: {
      zh: 'gourmet food photography, [菜名], steam rising, macro texture details, rustic wooden table, warm side lighting, restaurant menu style, appetizing --ar 4:5 --v 6',
      en: 'gourmet food photography, [dish name], steam rising, macro texture details, rustic wooden table, warm side lighting, restaurant menu style, appetizing --ar 4:5 --v 6'
    }
  },

  // —— marketing ×6 ——
  {
    id: 'mkt-amazon',
    model: 'chatgpt',
    category: 'marketing',
    icon: '🛒',
    accent: 'var(--amber)',
    uses: 1430,
    tags: { zh: ['电商', '亚马逊'], en: ['E-commerce', 'Amazon'] },
    title: { zh: '亚马逊 Listing 优化', en: 'Amazon listing optimizer' },
    description: { zh: '标题关键词、五点描述、A+ 故事线。', en: 'Title keywords, bullets, A+ narrative arc.' },
    content: {
      zh: '产品：[填写] 核心卖点：[填写] 竞品差异：[填写]\n输出：1）标题（≤200字符，埋词）2）五点描述 3）Search Terms 建议 4）A+ 模块故事线大纲',
      en: 'Product: [fill] USPs: [fill] Differentiators: [fill]\nOutput: 1) Title (≤200 chars, keywords) 2) Five bullets 3) Search terms 4) A+ module story outline'
    }
  },
  {
    id: 'mkt-linkedin',
    model: 'chatgpt',
    category: 'marketing',
    icon: '💼',
    accent: 'var(--blue)',
    uses: 1180,
    tags: { zh: ['LinkedIn', 'B2B'], en: ['LinkedIn', 'B2B'] },
    title: { zh: 'LinkedIn 思想领袖帖', en: 'LinkedIn thought-leadership post' },
    description: { zh: '钩子+故事+洞察+互动问句，适合 B2B。', en: 'Hook, story, insight, engagement question for B2B.' },
    content: {
      zh: '观点：[填写] 个人经历片段：[填写]\n写一篇 LinkedIn 帖（1200字符内）：强钩子首行、短段落、1 个数据点、结尾互动问句、3 个相关 hashtag。',
      en: 'Take: [fill] Personal anecdote: [fill]\nWrite a LinkedIn post (≤1200 chars): strong first line, short paragraphs, one data point, closing question, 3 hashtags.'
    }
  },
  {
    id: 'mkt-email-seq',
    model: 'claude',
    category: 'marketing',
    icon: '📬',
    accent: 'var(--teal)',
    uses: 990,
    tags: { zh: ['邮件', '转化'], en: ['Email', 'Conversion'] },
    title: { zh: '欢迎邮件序列 5 封', en: '5-email welcome sequence' },
    description: { zh: '培育→价值→案例→优惠→召回，逐封目标清晰。', en: 'Nurture, value, case study, offer, win-back—clear goal each.' },
    content: {
      zh: '产品：[SaaS/课程等] 用户画像：[填写]\n设计 5 封邮件序列：每封的主题行、发送时机（D+天数）、核心 CTA、正文大纲（150字/封）。',
      en: 'Product: [SaaS/course etc.] Persona: [fill]\nDesign 5 emails: subject, send day (D+n), CTA, body outline (~150 words each).'
    }
  },
  {
    id: 'mkt-landing',
    model: 'claude',
    category: 'marketing',
    icon: '🚀',
    accent: 'var(--accent)',
    uses: 1670,
    tags: { zh: ['落地页', '转化'], en: ['Landing page', 'CRO'] },
    title: { zh: '高转化落地页文案', en: 'High-converting landing copy' },
    description: { zh: '首屏价值主张、社会证明、FAQ 异议处理。', en: 'Hero value prop, social proof, objection-handling FAQ.' },
    content: {
      zh: '产品：[填写] 目标用户痛点：[填写]\n输出落地页结构：Hero 标题+副标题、3 个利益点、社会证明占位、定价区文案、FAQ 5 条、最终 CTA。',
      en: 'Product: [fill] Pain points: [fill]\nOutput landing structure: hero headline/subhead, 3 benefits, social proof placeholders, pricing copy, 5 FAQs, final CTA.'
    }
  },
  {
    id: 'mkt-influencer',
    model: 'chatgpt',
    category: 'marketing',
    icon: '⭐',
    accent: 'var(--pink)',
    uses: 840,
    tags: { zh: ['达人', 'Brief'], en: ['Influencer', 'Brief'] },
    title: { zh: '达人合作 Brief', en: 'Influencer campaign brief' },
    description: { zh: '交付物、话术要点、禁词与 KPI 一目了然。', en: 'Deliverables, talking points, banned words, KPIs.' },
    content: {
      zh: '品牌：[填写] 活动目标：[曝光/转化] 预算级别：[填写]\n撰写达人 Brief：活动背景、必提卖点 3 条、内容形式与时长、禁词、数据回传要求、时间线。',
      en: 'Brand: [fill] Goal: [awareness/conversion] Budget tier: [fill]\nWrite influencer brief: background, 3 must-mention USPs, format/length, banned terms, reporting, timeline.'
    }
  },
  {
    id: 'mkt-press',
    model: 'chatgpt',
    category: 'marketing',
    icon: '📰',
    accent: 'var(--green)',
    uses: 720,
    tags: { zh: ['PR', '新闻稿'], en: ['PR', 'Press release'] },
    title: { zh: '新闻稿标准撰写', en: 'Press release writer' },
    description: { zh: '倒金字塔结构，导语含何时何地何人何事。', en: 'Inverted pyramid with 5W1H lead paragraph.' },
    content: {
      zh: '事件：[产品发布/融资等] 关键事实：[时间地点数据]\n撰写中文新闻稿：标题、导语（≤80字）、正文 3 段、引语 1 条、关于公司 boilerplate、媒体联系占位。',
      en: 'Event: [launch/funding etc.] Facts: [dates, figures]\nWrite press release: headline, lead (≤80 words), 3 body paragraphs, one quote, boilerplate, media contact placeholder.'
    }
  },

  // —— education ×6 ——
  {
    id: 'edu-math',
    model: 'chatgpt',
    category: 'education',
    icon: '➗',
    accent: 'var(--blue)',
    uses: 2340,
    tags: { zh: ['数学', '辅导'], en: ['Math', 'Tutoring'] },
    title: { zh: '分步数学辅导', en: 'Step-by-step math tutor' },
    description: { zh: '不直接给答案，引导推导并类比生活例子。', en: 'Guide derivation without giving away the final answer.' },
    content: {
      zh: '年级：[填写] 题目：[粘贴]\n请分步引导解题：每步只揭示下一个思路，用一个问题推动；最后让学生自己写出答案；附 1 个生活类比帮助理解。',
      en: 'Grade: [fill] Problem: [paste]\nGuide step-by-step with one question per step; do not reveal final answer until the end; add one real-life analogy.'
    }
  },
  {
    id: 'edu-language',
    model: 'chatgpt',
    category: 'education',
    icon: '🗣️',
    accent: 'var(--teal)',
    uses: 1890,
    tags: { zh: ['英语', '口语'], en: ['English', 'Speaking'] },
    title: { zh: '英语口语陪练', en: 'English speaking partner' },
    description: { zh: '情景对话+纠错+更地道改写。', en: 'Role-play dialogues with corrections and natural rewrites.' },
    content: {
      zh: '水平：[A2/B1/B2] 场景：[面试/旅行/商务]\n进行 8 轮对话练习；每轮后：纠正语法 1–2 处、提供更地道表达、给评分（流利度/准确度）',
      en: 'Level: [A2/B1/B2] Scenario: [interview/travel/business]\nRun 8 dialogue turns; after each: 1–2 grammar fixes, more natural phrasing, brief scores for fluency/accuracy.'
    }
  },
  {
    id: 'edu-research',
    model: 'claude',
    category: 'education',
    icon: '📑',
    accent: 'var(--accent)',
    uses: 1120,
    tags: { zh: ['文献', '综述'], en: ['Research', 'Review'] },
    title: { zh: '文献综述结构化', en: 'Literature review structurer' },
    description: { zh: '主题分类、研究空白与未来方向。', en: 'Thematic clusters, gaps, and future directions.' },
    content: {
      zh: '研究问题：[填写] 已有文献要点：[粘贴多条]\n输出：1）主题分类表 2）各主题共识与争议 3）研究空白 4）建议的 3 个后续课题',
      en: 'Research question: [fill] Paper notes: [paste]\nOutput: 1) Thematic table 2) Consensus/disputes per theme 3) Gaps 4) Three follow-up topics.'
    }
  },
  {
    id: 'edu-citation',
    model: 'claude',
    category: 'education',
    icon: '📚',
    accent: 'var(--amber)',
    uses: 680,
    tags: { zh: ['引用', '格式'], en: ['Citation', 'Format'] },
    title: { zh: 'APA 引用格式化', en: 'APA citation formatter' },
    description: { zh: '期刊/书籍/网页统一 APA 7 格式。', en: 'Uniform APA 7 for journal, book, and web sources.' },
    content: {
      zh: '将以下参考文献信息格式化为 APA 7 引用条目（含 DOI/URL 规则），并指出缺失字段：\n\n[粘贴文献信息列表]',
      en: 'Format these references as APA 7 entries (DOI/URL rules) and flag missing fields:\n\n[Paste bibliographic info]'
    }
  },
  {
    id: 'edu-kids-story',
    model: 'chatgpt',
    category: 'education',
    icon: '🧸',
    accent: 'var(--pink)',
    uses: 1450,
    tags: { zh: ['儿童', '故事'], en: ['Kids', 'Story'] },
    title: { zh: '儿童睡前故事', en: 'Bedtime story for kids' },
    description: { zh: '温和情节、正面价值观、适合 5–8 岁。', en: 'Gentle plot, positive values, ages 5–8.' },
    content: {
      zh: '主角：[动物/孩子] 主题：[勇气/分享/友谊] 时长约 5 分钟朗读\n写一个睡前故事：开端-冲突-解决，语言简单，结尾有温柔总结句。',
      en: 'Hero: [animal/child] Theme: [courage/sharing/friendship] ~5 min read aloud\nWrite a bedtime story: beginning-conflict-resolution, simple words, gentle closing moral.'
    }
  },
  {
    id: 'edu-quiz',
    model: 'chatgpt',
    category: 'education',
    icon: '❓',
    accent: 'var(--green)',
    uses: 1010,
    tags: { zh: ['测验', '出题'], en: ['Quiz', 'Assessment'] },
    title: { zh: '测验题自动生成', en: 'Quiz question generator' },
    description: { zh: '选择/填空/简答混合，附答案与解析。', en: 'Mix of MCQ, fill-in, short answer with keys.' },
    content: {
      zh: '知识点：[填写] 难度：[基础/进阶]\n生成 15 道题：单选 8 + 填空 4 + 简答 3；每题附标准答案与 1 句解析。',
      en: 'Topic: [fill] Difficulty: [basic/advanced]\nCreate 15 questions: 8 MCQ + 4 fill-in + 3 short answer; include answers and one-line explanations.'
    }
  },

  // —— business ×7 ——
  {
    id: 'biz-pitch',
    model: 'chatgpt',
    category: 'business',
    icon: '🎯',
    accent: 'var(--accent)',
    uses: 1780,
    tags: { zh: ['融资', '路演'], en: ['Pitch', 'Fundraising'] },
    title: { zh: '3 分钟融资路演稿', en: '3-minute pitch deck script' },
    description: { zh: '问题-方案-牵引-团队-融资用途，投资人视角。', en: 'Problem-solution-traction-team-ask from investor lens.' },
    content: {
      zh: '项目：[填写] 阶段：[种子/A轮] 数据亮点：[填写]\n撰写 10 页路演逐页讲稿（每页≤40秒口语），并附 anticipated Q&A 5 条。',
      en: 'Startup: [fill] Stage: [seed/Series A] Metrics: [fill]\nWrite slide-by-slide script (≤40s each) for 10 slides plus 5 anticipated investor Q&As.'
    }
  },
  {
    id: 'biz-okr',
    model: 'claude',
    category: 'business',
    icon: '📈',
    accent: 'var(--teal)',
    uses: 1320,
    tags: { zh: ['OKR', '管理'], en: ['OKR', 'Management'] },
    title: { zh: '季度 OKR 制定', en: 'Quarterly OKR builder' },
    description: { zh: '目标可衡量，关键结果有基线与里程碑。', en: 'Measurable objectives with baselines and milestones.' },
    content: {
      zh: '团队：[填写] 公司年度目标：[填写]\n输出 3 个 Objective，每个 3–4 个 KR（含量化指标、负责人建议、Q1/Q2 里程碑）。',
      en: 'Team: [fill] Company annual goal: [fill]\nOutput 3 Objectives with 3–4 KRs each (metrics, owner suggestion, Q1/Q2 milestones).'
    }
  },
  {
    id: 'biz-compete',
    model: 'claude',
    category: 'business',
    icon: '🔭',
    accent: 'var(--blue)',
    uses: 1090,
    tags: { zh: ['竞品', '分析'], en: ['Competitive', 'Intel'] },
    title: { zh: '竞品情报矩阵', en: 'Competitive intelligence matrix' },
    description: { zh: '功能、定价、渠道、优劣势对比表。', en: 'Feature, pricing, channel, SWOT comparison table.' },
    content: {
      zh: '我方产品：[填写] 竞品 A/B/C：[填写]\n输出对比矩阵（功能/定价/目标客户/渠道/优势/劣势），并给 3 条差异化策略建议。',
      en: 'Our product: [fill] Competitors A/B/C: [fill]\nOutput comparison matrix and three differentiation strategies.'
    }
  },
  {
    id: 'biz-persona',
    model: 'chatgpt',
    category: 'business',
    icon: '👤',
    accent: 'var(--pink)',
    uses: 940,
    tags: { zh: ['用户画像', '产品'], en: ['Persona', 'Product'] },
    title: { zh: '用户画像 Persona', en: 'User persona builder' },
    description: { zh: '人口统计、目标、痛点、场景与引语。', en: 'Demographics, goals, pains, scenarios, quote.' },
    content: {
      zh: '产品：[填写] 现有用户访谈摘要：[粘贴]\n生成 2 个详细 Persona（姓名虚构、年龄职业、目标、痛点、使用场景、代表性引语、反对意见）。',
      en: 'Product: [fill] Interview notes: [paste]\nCreate 2 detailed personas with fictional names, demographics, goals, pains, scenarios, quote, objections.'
    }
  },
  {
    id: 'biz-pricing',
    model: 'chatgpt',
    category: 'business',
    icon: '💰',
    accent: 'var(--amber)',
    uses: 870,
    tags: { zh: ['定价', '策略'], en: ['Pricing', 'Strategy'] },
    title: { zh: 'SaaS 定价策略分析', en: 'SaaS pricing strategy' },
    description: { zh: '价值指标、套餐分层与竞品锚定。', en: 'Value metric, tiering, and competitive anchoring.' },
    content: {
      zh: '产品类型：[B2B SaaS] 竞品价格：[填写] 客户细分：[填写]\n建议：价值度量指标、3 档套餐结构与价格区间、免费试用策略、需验证的 3 个定价假设。',
      en: 'Product: [B2B SaaS] Competitor pricing: [fill] Segments: [fill]\nRecommend value metric, 3-tier packaging with price bands, trial strategy, three pricing hypotheses to validate.'
    }
  },
  {
    id: 'biz-interview',
    model: 'chatgpt',
    category: 'business',
    icon: '🎤',
    accent: 'var(--green)',
    uses: 2100,
    tags: { zh: ['面试', '管理'], en: ['Interview', 'Hiring'] },
    title: { zh: '结构化行为面试题', en: 'Structured behavioral interview' },
    description: { zh: 'STAR 追问与评分 rubric。', en: 'STAR follow-ups and scoring rubric.' },
    content: {
      zh: '岗位：[填写] 胜任力模型：[领导力/执行力等 4 项]\n为每项胜任力设计 2 道行为面试题（含 STAR 追问链）和 1–5 分评分标准。',
      en: 'Role: [fill] Competencies: [4 items]\nFor each competency, write 2 behavioral questions with STAR follow-ups and a 1–5 scoring rubric.'
    }
  },
  {
    id: 'biz-exec-summary',
    model: 'claude',
    category: 'business',
    icon: '📋',
    accent: 'var(--accent2)',
    uses: 780,
    tags: { zh: ['汇报', '高管'], en: ['Report', 'Executive'] },
    title: { zh: '高管一页纸汇报', en: 'One-page executive summary' },
    description: { zh: '结论先行，数据支撑，建议 3 条可执行项。', en: 'Conclusion first, data-backed, three actionable recommendations.' },
    content: {
      zh: '汇报主题：[填写] 原始材料：[粘贴数据/邮件]\n压缩为一页纸：核心结论（3 条）、关键数据表、风险、建议行动（负责人+时间）。',
      en: 'Topic: [fill] Source material: [paste]\nCompress to one page: 3 conclusions, key metrics table, risks, recommended actions with owners and dates.'
    }
  },

  // —— roleplay ×7 ——
  {
    id: 'rp-legal-demo',
    model: 'claude',
    category: 'roleplay',
    icon: '⚖️',
    accent: 'var(--blue)',
    uses: 640,
    tags: { zh: ['法律', '演示'], en: ['Legal', 'Demo'] },
    title: { zh: '法律顾问（演示）', en: 'Legal advisor (demo)' },
    description: { zh: '信息归纳与问题清单，非正式法律意见。', en: 'Issue spotting and question lists—not formal legal advice.' },
    content: {
      zh: '【演示用途，非法律意见】根据我描述的情况：1）归纳法律争点 2）列出需补充的事实 3）建议咨询专业律师的问题清单 4）免责声明。',
      en: '[Demo only—not legal advice] From my situation: 1) Summarize legal issues 2) Missing facts to clarify 3) Questions for a licensed attorney 4) Disclaimer.'
    }
  },
  {
    id: 'rp-fitness',
    model: 'chatgpt',
    category: 'roleplay',
    icon: '💪',
    accent: 'var(--green)',
    uses: 1580,
    tags: { zh: ['健身', '教练'], en: ['Fitness', 'Coach'] },
    title: { zh: '私人健身教练', en: 'Personal fitness coach' },
    description: { zh: '根据体能与器械定制训练计划，强调安全。', en: 'Custom plan by fitness level and equipment, safety first.' },
    content: {
      zh: '年龄体重：[填写] 目标：[减脂/增肌] 器械：[居家/健身房] 伤病史：[填写]\n制定一周训练计划（每天动作+组次+休息），并附热身与饮食原则（非医疗建议）。',
      en: 'Stats: [fill] Goal: [fat loss/muscle] Equipment: [home/gym] Injuries: [fill]\nOne-week plan with exercises/sets/rest, warm-up and general nutrition principles (not medical advice).'
    }
  },
  {
    id: 'rp-chef',
    model: 'chatgpt',
    category: 'roleplay',
    icon: '👨‍🍳',
    accent: 'var(--coral)',
    uses: 1240,
    tags: { zh: ['烹饪', '菜谱'], en: ['Cooking', 'Recipe'] },
    title: { zh: '米其林主厨顾问', en: 'Michelin-style chef advisor' },
    description: { zh: '食材替代、步骤计时与摆盘建议。', en: 'Substitutions, timing, and plating tips.' },
    content: {
      zh: '食材：[填写] 口味偏好：[清淡/重口] 人数：[填写]\n给出完整菜谱：备料清单、分步操作（含分钟计时）、调味技巧、摆盘一句话建议。',
      en: 'Ingredients: [fill] Taste: [light/bold] Servings: [fill]\nFull recipe: prep list, timed steps, seasoning tips, one-line plating advice.'
    }
  },
  {
    id: 'rp-travel',
    model: 'chatgpt',
    category: 'roleplay',
    icon: '✈️',
    accent: 'var(--teal)',
    uses: 1920,
    tags: { zh: ['旅行', '攻略'], en: ['Travel', 'Guide'] },
    title: { zh: '本地通旅行向导', en: 'Local travel guide' },
    description: { zh: '日程、交通、避坑与预算分级方案。', en: 'Itinerary, transit, pitfalls, budget tiers.' },
    content: {
      zh: '目的地：[填写] 天数：[填写] 风格：[亲子/美食/摄影] 预算：[经济/舒适]\n输出每日行程（上午/下午/晚上）、交通方式、2 个避坑提示、雨天备选。',
      en: 'Destination: [fill] Days: [fill] Style: [family/food/photo] Budget: [budget/mid]\nDaily itinerary AM/PM/eve, transit tips, two pitfalls, rainy-day backup.'
    }
  },
  {
    id: 'rp-hr',
    model: 'claude',
    category: 'roleplay',
    icon: '🏢',
    accent: 'var(--accent)',
    uses: 1100,
    tags: { zh: ['HR', '面试'], en: ['HR', 'Interview'] },
    title: { zh: 'HR 初试官模拟', en: 'HR screen roleplay' },
    description: { zh: '动机、薪资期望与文化匹配度考察。', en: 'Motivation, comp expectations, culture fit.' },
    content: {
      zh: '你扮演 HR 进行 15 分钟初试。岗位：[填写] 请先问我 8 个问题（含追问），最后给反馈：优势、风险点、是否推荐进入下一轮（说明理由）。',
      en: 'You are HR for a 15-minute screen. Role: [fill] Ask 8 questions with follow-ups, then feedback: strengths, risks, pass/fail recommendation with reasons.'
    }
  },
  {
    id: 'rp-debate',
    model: 'chatgpt',
    category: 'roleplay',
    icon: '🎙️',
    accent: 'var(--amber)',
    uses: 820,
    tags: { zh: ['辩论', '主持'], en: ['Debate', 'Moderator'] },
    title: { zh: '辩论赛主持人', en: 'Debate moderator' },
    description: { zh: '公正控场、时间提醒与总结陈词框架。', en: 'Neutral timing, rules, and summary frameworks.' },
    content: {
      zh: '辩题：[填写] 赛制：[正方/反方各3人]\n输出：开场规则说明、每环节时间分配、主持人过渡语 5 条、总结陈词提示问题 3 个。',
      en: 'Motion: [fill] Format: [teams of 3]\nOutput: opening rules, time allocation per segment, 5 transition scripts, 3 questions for final summaries.'
    }
  },
  {
    id: 'rp-english-native',
    model: 'chatgpt',
    category: 'roleplay',
    icon: '🇺🇸',
    accent: 'var(--blue)',
    uses: 1760,
    tags: { zh: ['英语', '母语'], en: ['English', 'Native'] },
    title: { zh: '英语母语聊天伙伴', en: 'Native English chat partner' },
    description: { zh: '自然闲聊+俚语解释+文化背景补充。', en: 'Casual chat with idiom and culture notes.' },
    content: {
      zh: '扮演美国本土朋友闲聊。话题由我发起。每次回复后：解释 1 个地道表达、标注正式/非正式程度、可选提供更简短口语版。',
      en: 'Act as a native US friend for casual chat. I pick topics. After each reply: explain one idiom, mark formal/informal register, optional shorter colloquial version.'
    }
  },

  // —— video ×7 ——
  {
    id: 'vid-tiktok-hook',
    model: 'chatgpt',
    category: 'video',
    icon: '📱',
    accent: 'var(--pink)',
    uses: 2450,
    tags: { zh: ['TikTok', '钩子'], en: ['TikTok', 'Hook'] },
    title: { zh: 'TikTok 前 3 秒钩子', en: 'TikTok first-3-second hook' },
    description: { zh: '10 个开场钩子+画面建议，提升完播率。', en: 'Ten opening hooks with visual directions for retention.' },
    content: {
      zh: '视频主题：[填写] 目标受众：[填写]\n生成 10 个前 3 秒钩子（台词+画面动作），并标注适用情绪（好奇/反差/痛点）。',
      en: 'Topic: [fill] Audience: [fill]\nGenerate 10 hooks for the first 3 seconds (line + visual action) tagged by emotion (curiosity/contrast/pain).'
    }
  },
  {
    id: 'vid-podcast',
    model: 'claude',
    category: 'video',
    icon: '🎧',
    accent: 'var(--accent)',
    uses: 980,
    tags: { zh: ['播客', '提纲'], en: ['Podcast', 'Outline'] },
    title: { zh: '播客节目提纲', en: 'Podcast episode outline' },
    description: { zh: '开场、章节话题、嘉宾追问与收尾 CTA。', en: 'Cold open, segments, guest questions, closing CTA.' },
    content: {
      zh: '嘉宾：[填写] 主题：[填写] 时长约 45 分钟\n输出：节目名建议、冷开场 30 秒稿、4 个章节话题+每章 3 个追问、听众行动号召。',
      en: 'Guest: [fill] Topic: [fill] ~45 minutes\nOutput: title ideas, 30s cold open script, 4 segments with 3 questions each, listener CTA.'
    }
  },
  {
    id: 'vid-storyboard',
    model: 'chatgpt',
    category: 'video',
    icon: '🎬',
    accent: 'var(--amber)',
    uses: 1340,
    tags: { zh: ['分镜', '广告'], en: ['Storyboard', 'Ad'] },
    title: { zh: '15 秒广告分镜脚本', en: '15-second ad storyboard' },
    description: { zh: '镜头表含画面、台词、时长与转场。', en: 'Shot list with visuals, lines, duration, transitions.' },
    content: {
      zh: '产品：[填写] 核心信息：[一句话卖点]\n输出 6 镜分镜表：镜号|时长|画面|台词/旁白|转场|备注。',
      en: 'Product: [fill] Key message: [one-line USP]\nSix-shot storyboard table: shot|duration|visual|VO/dialogue|transition|notes.'
    }
  },
  {
    id: 'vid-subtitle',
    model: 'chatgpt',
    category: 'video',
    icon: '💬',
    accent: 'var(--teal)',
    uses: 870,
    tags: { zh: ['字幕', 'SRT'], en: ['Subtitles', 'SRT'] },
    title: { zh: '视频字幕 SRT 生成', en: 'Video subtitle SRT generator' },
    description: { zh: '按口语节奏断句，时间轴占位可后续微调。', en: 'Natural phrase breaks with placeholder timestamps.' },
    content: {
      zh: '根据以下口播稿生成 SRT 字幕（每行≤14字，合理断句），时间轴用占位 00:00:00,000 递增估算，并附断句原则说明。\n\n[粘贴口播稿]',
      en: 'From this script, generate SRT (≤42 chars per line in EN or ≤14 Chinese chars), placeholder timestamps incrementally, plus line-break rules used.\n\n[Paste script]'
    }
  },
  {
    id: 'vid-course-promo',
    model: 'claude',
    category: 'video',
    icon: '🎓',
    accent: 'var(--blue)',
    uses: 760,
    tags: { zh: ['课程', '宣传片'], en: ['Course', 'Promo'] },
    title: { zh: '在线课程宣传片脚本', en: 'Online course promo script' },
    description: { zh: '痛点-承诺-大纲-师资-限时优惠五段式。', en: 'Pain-promise-outline-instructor-offer five-beat script.' },
    content: {
      zh: '课程名：[填写] 学员成果：[填写] 时长 90 秒\n写宣传片旁白+分镜建议（5 段），含 1 条社会证明插入点与结尾优惠 CTA。',
      en: 'Course: [fill] Outcomes: [fill] 90-second promo\nVoiceover + visual beats (5 parts), one social proof beat, closing offer CTA.'
    }
  },
  {
    id: 'vid-documentary',
    model: 'claude',
    category: 'video',
    icon: '📽️',
    accent: 'var(--green)',
    uses: 650,
    tags: { zh: ['纪录片', '旁白'], en: ['Documentary', 'Narration'] },
    title: { zh: '纪录片旁白稿', en: 'Documentary narration' },
    description: { zh: '克制客观、画面感强、信息密度适中。', en: 'Restrained, visual, balanced information density.' },
    content: {
      zh: '题材：[历史/自然/人物] 时长 8 分钟\n撰写旁白稿（约 1200 字），每段标注对应画面类型（档案/航拍/访谈/空镜），避免煽情形容词堆砌。',
      en: 'Subject: [history/nature/profile] 8 minutes\nWrite ~1200-word narration with suggested visuals per paragraph (archive/drone/interview/b-roll); avoid melodrama.'
    }
  },
  {
    id: 'vid-livestream',
    model: 'chatgpt',
    category: 'video',
    icon: '🔴',
    accent: 'var(--coral)',
    uses: 1120,
    tags: { zh: ['直播', '带货'], en: ['Livestream', 'Sales'] },
    title: { zh: '直播带货话术节奏', en: 'Live commerce talk track' },
    description: { zh: '预热-讲解-逼单-答疑循环，含互动话术。', en: 'Warm-up-demo-close-Q&A loop with engagement lines.' },
    content: {
      zh: '品类：[美妆/3C/食品] 单品：[填写] 直播 60 分钟\n输出分段时间轴：预热互动、产品讲解要点、价格锚点、限时逼单、FAQ 5 条、下播预告。',
      en: 'Category: [beauty/tech/food] SKU: [fill] 60-minute live\nTimed run sheet: warm-up, demo beats, price anchor, urgency close, 5 FAQs, sign-off tease.'
    }
  }
];
