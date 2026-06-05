/** Core curated prompts */
export const BASE_PROMPTS = [
  {
    id: 'writing-coach',
    model: 'chatgpt',
    category: 'writing',
    icon: '✍️',
    accent: 'var(--accent)',
    featured: true,
    hot: true,
    hotRank: 3,
    badge: 'editor',
    uses: 2400,
    contributor: 'opc',
    tags: { zh: ['写作', '教育'], en: ['Writing', 'Education'] },
    title: { zh: '万能写作导师', en: 'Universal writing coach' },
    description: {
      zh: '分析文章结构、逻辑与语言，给出可操作的修改建议与改写示范。',
      en: 'Analyze structure, logic, and tone; return actionable edits with rewritten examples.'
    },
    content: {
      zh: '你是一位专业写作教练，擅长各类文体。请先分析我文章的结构、逻辑和语言，再给出具体修改建议和改写示范，每条建议附上理由。文章如下：\n\n[粘贴你的文章]',
      en: 'You are a professional writing coach skilled across genres. First analyze my draft\'s structure, logic, and language. Then give specific revision advice and rewrite examples; explain the reason for each suggestion.\n\n[Paste your draft here]'
    }
  },
  {
    id: 'claude-polish',
    model: 'claude',
    category: 'writing',
    icon: '📝',
    accent: 'var(--teal)',
    featured: true,
    hot: true,
    hotRank: 3,
    badge: 'new',
    uses: 4100,
    contributor: 'alex',
    tags: { zh: ['Claude', '长文'], en: ['Claude', 'Long-form'] },
    title: { zh: '长文润色与结构优化', en: 'Long-form polish & structure' },
    description: {
      zh: '保持原意的前提下优化段落层次、过渡与可读性。',
      en: 'Improve hierarchy, transitions, and readability without changing meaning.'
    },
    content: {
      zh: '你是资深编辑。请在不改变核心观点的前提下：1）优化段落层次与标题；2）改善句间过渡；3）统一语气与人称；4）标注可删减的冗余句。输出：修订版 + 修改摘要。\n\n原文：\n[粘贴长文]',
      en: 'You are a senior editor. Without changing core ideas: 1) Improve section hierarchy and headings; 2) Fix transitions; 3) Unify tone and POV; 4) Flag redundant sentences. Output: revised text + change summary.\n\nDraft:\n[Paste text]'
    }
  },
  {
    id: 'story-outline',
    model: 'chatgpt',
    category: 'writing',
    icon: '📖',
    accent: 'var(--pink)',
    featured: false,
    uses: 890,
    contributor: 'opc',
    tags: { zh: ['小说', '大纲'], en: ['Fiction', 'Outline'] },
    title: { zh: '小说三幕式大纲生成', en: 'Three-act fiction outline' },
    description: {
      zh: '根据题材与主角目标，输出三幕结构、章节要点与冲突升级表。',
      en: 'Generate three-act structure, chapter beats, and escalating conflict table.'
    },
    content: {
      zh: '题材：[填写] 主角目标：[填写] 风格：[悬疑/言情/科幻等]\n请生成三幕式大纲：每幕 3–5 个关键情节点；附人物关系简表与高潮/结局建议。',
      en: 'Genre: [fill] Protagonist goal: [fill] Tone: [thriller/romance/sci-fi etc.]\nCreate a three-act outline with 3–5 beats per act, a character relation sketch, and climax/ending options.'
    }
  },
  {
    id: 'email-pro',
    model: 'chatgpt',
    category: 'writing',
    icon: '📧',
    accent: 'var(--blue)',
    featured: false,
    uses: 1200,
    tags: { zh: ['商务', '邮件'], en: ['Business', 'Email'] },
    title: { zh: '专业商务邮件撰写', en: 'Professional business email' },
    description: {
      zh: '根据场景生成得体、简洁、可执行的商务邮件正文。',
      en: 'Draft clear, polite, action-oriented business emails for any scenario.'
    },
    content: {
      zh: '场景：[催款/道歉/邀请/跟进等] 收件人身份：[填写] 关键信息：[填写]\n请写一封中文商务邮件：主题行 + 正文（150–250字）+ 可选英文版本。语气专业、立场明确、含明确下一步。',
      en: 'Scenario: [payment reminder/apology/invite/follow-up] Recipient: [fill] Key facts: [fill]\nWrite a business email: subject + body (120–200 words) + clear next step. Tone: professional and direct.'
    }
  },
  {
    id: 'code-review',
    model: 'claude',
    category: 'coding',
    icon: '💻',
    accent: 'var(--teal)',
    featured: true,
    uses: 1900,
    contributor: 'alex',
    tags: { zh: ['Claude', '编程'], en: ['Claude', 'Code'] },
    title: { zh: '代码审查专家', en: 'Code review expert' },
    description: {
      zh: '结构化输出 bug、安全、性能与可读性建议。',
      en: 'Structured report on bugs, security, performance, and readability.'
    },
    content: {
      zh: '你是资深软件工程师。请审查以下代码并输出 Markdown 报告：\n1）潜在 bug 与安全风险\n2）性能优化\n3）可读性与命名\n4）最佳实践与测试建议\n\n```\n[粘贴代码]\n```',
      en: 'You are a senior software engineer. Review this code in Markdown:\n1) Bugs and security risks\n2) Performance improvements\n3) Readability and naming\n4) Best practices and test ideas\n\n```\n[Paste code]\n```'
    }
  },
  {
    id: 'unit-test-gen',
    model: 'chatgpt',
    category: 'coding',
    icon: '🧪',
    accent: 'var(--green)',
    featured: false,
    uses: 1560,
    contributor: 'alex',
    tags: { zh: ['测试', 'Jest'], en: ['Testing', 'Jest'] },
    title: { zh: '单元测试生成器', en: 'Unit test generator' },
    description: {
      zh: '为给定函数生成边界用例与 mock 建议。',
      en: 'Generate boundary cases and mock strategy for a function.'
    },
    content: {
      zh: '语言/框架：[如 TypeScript + Jest]\n为以下函数编写单元测试：覆盖正常路径、边界、异常；说明 mock 策略；附测试文件完整代码。\n\n[粘贴函数]',
      en: 'Language/framework: [e.g. TypeScript + Jest]\nWrite unit tests covering happy path, edge cases, and errors; explain mocks; output full test file.\n\n[Paste function]'
    }
  },
  {
    id: 'sql-optimize',
    model: 'claude',
    category: 'coding',
    icon: '🗄️',
    accent: 'var(--blue)',
    featured: false,
    uses: 980,
    tags: { zh: ['SQL', '性能'], en: ['SQL', 'Performance'] },
    title: { zh: 'SQL 查询优化顾问', en: 'SQL query optimizer' },
    description: {
      zh: '解释执行计划思路并给出索引与改写建议。',
      en: 'Explain execution logic and suggest indexes and rewrites.'
    },
    content: {
      zh: '数据库：[MySQL/PostgreSQL等] 表结构简述：[填写]\n请分析以下 SQL：1）性能瓶颈 2）推荐索引 3）等价优化写法 4）注意事项\n\n```sql\n[粘贴查询]\n```',
      en: 'Database: [MySQL/PostgreSQL etc.] Schema notes: [fill]\nAnalyze this SQL: 1) Bottlenecks 2) Index recommendations 3) Optimized rewrite 4) Caveats\n\n```sql\n[Paste query]\n```'
    }
  },
  {
    id: 'api-doc',
    model: 'chatgpt',
    category: 'coding',
    icon: '📡',
    accent: 'var(--accent)',
    featured: false,
    uses: 720,
    tags: { zh: ['API', '文档'], en: ['API', 'Docs'] },
    title: { zh: 'REST API 文档生成', en: 'REST API documentation' },
    description: {
      zh: '从路由定义生成 OpenAPI 风格说明与示例请求。',
      en: 'Produce OpenAPI-style docs and sample requests from route definitions.'
    },
    content: {
      zh: '根据以下 API 路由信息，生成 Markdown 文档：概述、认证、各端点（方法/路径/参数/响应/错误码）、curl 示例。\n\n[粘贴路由或代码片段]',
      en: 'From these API routes, produce Markdown docs: overview, auth, each endpoint (method/path/params/responses/errors), and curl examples.\n\n[Paste routes or code]'
    }
  },
  {
    id: 'mj-product-photo',
    model: 'midjourney',
    category: 'image',
    icon: '🎨',
    accent: 'var(--amber)',
    featured: true,
    uses: 3100,
    contributor: 'mjlab',
    tags: { zh: ['Midjourney', '电商'], en: ['Midjourney', 'E-commerce'] },
    title: { zh: 'MJ 极简商业摄影', en: 'MJ minimalist product photo' },
    description: {
      zh: '白底棚拍风格，适合电商主图与详情页。',
      en: 'White-studio product shots for e-commerce hero images.'
    },
    content: {
      zh: 'product photography, [商品名], minimalist white studio background, soft diffused lighting, ultra sharp details, 8K resolution, commercial style --ar 4:3 --v 6 --style raw',
      en: 'product photography, [product name], minimalist white studio background, soft diffused lighting, ultra sharp details, 8K resolution, commercial style --ar 4:3 --v 6 --style raw'
    }
  },
  {
    id: 'mj-cinematic-portrait',
    model: 'midjourney',
    category: 'image',
    icon: '🎬',
    accent: 'var(--coral)',
    featured: true,
    hot: true,
    hotRank: 2,
    badge: 'hot',
    uses: 4800,
    contributor: 'mjlab',
    tags: { zh: ['Midjourney', '人像'], en: ['Midjourney', 'Portrait'] },
    title: { zh: 'MJ v6 电影感人像', en: 'MJ v6 cinematic portrait' },
    description: {
      zh: '胶片质感、浅景深、叙事光影的经典人像公式。',
      en: 'Film grain, shallow DOF, and narrative lighting for portraits.'
    },
    content: {
      zh: 'cinematic portrait of [subject], 35mm film still, moody rim lighting, shallow depth of field, subtle film grain, color graded teal and orange, hyper detailed eyes --ar 2:3 --v 6 --style raw',
      en: 'cinematic portrait of [subject], 35mm film still, moody rim lighting, shallow depth of field, subtle film grain, color graded teal and orange, hyper detailed eyes --ar 2:3 --v 6 --style raw'
    }
  },
  {
    id: 'sd-realistic-portrait',
    model: 'sd',
    category: 'image',
    icon: '🌄',
    accent: 'var(--green)',
    featured: true,
    uses: 4300,
    tags: { zh: ['SD', '人像'], en: ['SD', 'Portrait'] },
    title: { zh: 'SD 写实人像大师', en: 'SD photoreal portrait' },
    description: {
      zh: '85mm 焦段、黄金时刻光线与皮肤质感细节。',
      en: '85mm lens, golden hour light, and detailed skin texture.'
    },
    content: {
      zh: 'beautiful [描述] portrait, hyper realistic photography, 85mm lens, golden hour lighting, shot on Sony A7IV, shallow depth of field, detailed skin texture, professional color grading',
      en: 'beautiful [description] portrait, hyper realistic photography, 85mm lens, golden hour lighting, shot on Sony A7IV, shallow depth of field, detailed skin texture, professional color grading'
    }
  },
  {
    id: 'sd-anime',
    model: 'sd',
    category: 'image',
    icon: '🌸',
    accent: 'var(--pink)',
    featured: false,
    uses: 2100,
    tags: { zh: ['SD', '动漫'], en: ['SD', 'Anime'] },
    title: { zh: 'SD 日系动漫插画', en: 'SD anime illustration' },
    description: {
      zh: '清爽线稿、赛璐璐上色与柔和背景光。',
      en: 'Clean line art, cel shading, and soft background glow.'
    },
    content: {
      zh: 'masterpiece, best quality, 1girl, [角色描述], anime style, detailed eyes, soft lighting, pastel background, dynamic pose, highly detailed, illustration',
      en: 'masterpiece, best quality, 1girl, [character description], anime style, detailed eyes, soft lighting, pastel background, dynamic pose, highly detailed, illustration'
    }
  },
  {
    id: 'xhs-titles',
    model: 'chatgpt',
    category: 'marketing',
    icon: '📱',
    accent: 'var(--pink)',
    featured: true,
    uses: 5700,
    tags: { zh: ['营销', '社媒'], en: ['Marketing', 'Social'] },
    title: { zh: '小红书爆款标题', en: 'Xiaohongshu viral titles' },
    description: {
      zh: '数字+情绪+场景组合，符合平台口语化风格。',
      en: 'Numbers, emotion, and scene hooks tuned for the platform.'
    },
    content: {
      zh: '帮我生成 10 个小红书爆款标题，主题：[主题]。要求：带数字+情绪词+场景词，18–25 字，口语化，参考近期热门笔记风格。',
      en: 'Generate 10 viral Xiaohongshu-style titles for topic: [topic]. Use numbers + emotional words + scene hooks, 18–25 Chinese characters, conversational tone.'
    }
  },
  {
    id: 'seo-blog',
    model: 'chatgpt',
    category: 'marketing',
    icon: '🔍',
    accent: 'var(--blue)',
    featured: false,
    uses: 1800,
    contributor: 'opc',
    tags: { zh: ['SEO', '博客'], en: ['SEO', 'Blog'] },
    title: { zh: 'SEO 博客文章大纲', en: 'SEO blog outline' },
    description: {
      zh: '围绕主关键词生成 H2/H3 结构与 meta 描述。',
      en: 'H2/H3 structure and meta description around a focus keyword.'
    },
    content: {
      zh: '主关键词：[填写] 目标读者：[填写] 字数约：[1500/2500]\n请输出：1）SEO 标题 3 个 2）meta description 3）H2/H3 大纲 4）每节要点与内链建议',
      en: 'Focus keyword: [fill] Audience: [fill] Length: [1500/2500 words]\nOutput: 1) Three SEO titles 2) Meta description 3) H2/H3 outline 4) Bullet points per section + internal link ideas'
    }
  },
  {
    id: 'ad-copy-ab',
    model: 'claude',
    category: 'marketing',
    icon: '📣',
    accent: 'var(--amber)',
    featured: false,
    uses: 1340,
    tags: { zh: ['广告', 'A/B'], en: ['Ads', 'A/B'] },
    title: { zh: '信息流广告 A/B 文案', en: 'Feed ad A/B copy' },
    description: {
      zh: '同一卖点生成两套风格对比文案与 CTA。',
      en: 'Two ad variants with different hooks and CTAs for the same offer.'
    },
    content: {
      zh: '产品：[填写] 卖点：[填写] 受众：[填写]\n生成 A/B 两套信息流广告：标题≤20字、正文≤60字、CTA；并说明测试假设（痛点/利益/社交证明）。',
      en: 'Product: [fill] USP: [fill] Audience: [fill]\nCreate A/B feed ads: headline ≤20 chars, body ≤60 chars, CTA; explain test hypothesis for each variant.'
    }
  },
  {
    id: 'brand-voice',
    model: 'chatgpt',
    category: 'marketing',
    icon: '🏷️',
    accent: 'var(--accent)',
    featured: false,
    uses: 990,
    tags: { zh: ['品牌', '调性'], en: ['Brand', 'Voice'] },
    title: { zh: '品牌语气指南生成', en: 'Brand voice guide' },
    description: {
      zh: '提炼品牌人格、禁用词与示例句式。',
      en: 'Define personality, banned phrases, and sample sentences.'
    },
    content: {
      zh: '品牌名：[填写] 行业：[填写] 价值观：[填写]\n请输出品牌语气指南：人格形容词、Do/Don\'t 列表、三种场景示例句（社媒/客服/官网）、禁用词表。',
      en: 'Brand: [fill] Industry: [fill] Values: [fill]\nProduce a voice guide: personality traits, Do/Don\'t, sample lines for social/support/web, and words to avoid.'
    }
  },
  {
    id: 'explain-like-5',
    model: 'chatgpt',
    category: 'education',
    icon: '🎓',
    accent: 'var(--green)',
    featured: false,
    uses: 2200,
    tags: { zh: ['科普', '学习'], en: ['Explain', 'Learning'] },
    title: { zh: '五岁小朋友也能懂', en: 'Explain like I\'m five' },
    description: {
      zh: '用类比与故事把复杂概念讲清楚。',
      en: 'Use analogies and stories to explain hard topics simply.'
    },
    content: {
      zh: '请用「五岁小朋友也能懂」的方式解释：[概念]。要求：生活类比 + 一个小故事 + 一句总结；避免术语堆砌。',
      en: 'Explain [concept] like I\'m five: use a daily-life analogy + a short story + one-sentence summary; avoid jargon.'
    }
  },
  {
    id: 'flashcards',
    model: 'claude',
    category: 'education',
    icon: '🃏',
    accent: 'var(--teal)',
    featured: false,
    uses: 1100,
    tags: { zh: ['记忆', '卡片'], en: ['Flashcards', 'Study'] },
    title: { zh: '考点闪卡批量生成', en: 'Exam flashcard batch' },
    description: {
      zh: '从讲义提取问答对，适合 Anki 导入格式。',
      en: 'Q&A pairs from notes, ready for Anki-style import.'
    },
    content: {
      zh: '根据以下讲义内容，生成 20 张闪卡（问题|答案），覆盖高频考点，难度递进。输出 CSV：front,back\n\n[粘贴讲义]',
      en: 'From these notes, create 20 flashcards (question|answer) covering high-yield topics with increasing difficulty. Output CSV: front,back\n\n[Paste notes]'
    }
  },
  {
    id: 'lesson-plan',
    model: 'chatgpt',
    category: 'education',
    icon: '📚',
    accent: 'var(--blue)',
    featured: false,
    uses: 650,
    tags: { zh: ['教案', '教师'], en: ['Lesson plan', 'Teaching'] },
    title: { zh: '45 分钟课堂教案', en: '45-minute lesson plan' },
    description: {
      zh: '目标、活动、评估与差异化教学建议一应俱全。',
      en: 'Objectives, activities, assessment, and differentiation in one plan.'
    },
    content: {
      zh: '学科：[填写] 年级：[填写] 课题：[填写]\n请写 45 分钟教案：学习目标、导入、讲授、练习、小结、作业、形成性评估、差异化策略（快/慢学习者）。',
      en: 'Subject: [fill] Grade: [fill] Topic: [fill]\nWrite a 45-min lesson: objectives, hook, instruction, practice, closure, homework, formative check, and differentiation for fast/slow learners.'
    }
  },
  {
    id: 'biz-plan',
    model: 'chatgpt',
    category: 'business',
    icon: '📊',
    accent: 'var(--blue)',
    featured: true,
    uses: 2200,
    tags: { zh: ['商业', '计划书'], en: ['Business', 'Plan'] },
    title: { zh: '商业计划书框架', en: 'Business plan framework' },
    description: {
      zh: '从市场到财务的完整章节骨架与关键指标提示。',
      en: 'Full chapter skeleton from market sizing to financials.'
    },
    content: {
      zh: '作为资深商业顾问，为 [产品/服务] 撰写商业计划书框架：执行摘要、市场分析、竞争格局、商业模式、运营计划、财务预测（3年）、风险与对策。每节列出需填写的关键数据项。',
      en: 'As a senior consultant, draft a business plan framework for [product/service]: executive summary, market, competition, model, operations, 3-year financials, risks. List key metrics to fill per section.'
    }
  },
  {
    id: 'swot-workshop',
    model: 'claude',
    category: 'business',
    icon: '⚖️',
    accent: 'var(--accent)',
    featured: false,
    uses: 880,
    tags: { zh: ['战略', 'SWOT'], en: ['Strategy', 'SWOT'] },
    title: { zh: 'SWOT 战略工作坊', en: 'SWOT strategy workshop' },
    description: {
      zh: '引导式提问补全四象限并给出战略选项。',
      en: 'Guided questions to fill SWOT and propose strategic options.'
    },
    content: {
      zh: '公司/项目：[填写] 行业背景：[填写]\n先提出 5 个澄清问题，再输出 SWOT 四象限（各 4–6 条），最后给出 SO/WO/ST/WT 四类战略建议各 2 条。',
      en: 'Company/project: [fill] Industry context: [fill]\nAsk 5 clarifying questions, then SWOT (4–6 items per quadrant), then two strategic moves each for SO/WO/ST/WT.'
    }
  },
  {
    id: 'meeting-summary',
    model: 'chatgpt',
    category: 'business',
    icon: '📋',
    accent: 'var(--teal)',
    featured: false,
    uses: 1650,
    tags: { zh: ['会议', '纪要'], en: ['Meeting', 'Notes'] },
    title: { zh: '会议纪要一键整理', en: 'Meeting notes formatter' },
    description: {
      zh: '从杂乱记录提炼决议、待办与负责人。',
      en: 'Turn raw notes into decisions, action items, and owners.'
    },
    content: {
      zh: '将以下会议记录整理为标准纪要：背景、讨论要点、决议、Action Items（负责人|截止日|状态）、未决问题。\n\n[粘贴记录]',
      en: 'Format these meeting notes: context, discussion points, decisions, action items (owner|due|status), open questions.\n\n[Paste notes]'
    }
  },
  {
    id: 'therapist-rp',
    model: 'chatgpt',
    category: 'roleplay',
    icon: '🧠',
    accent: 'var(--coral)',
    featured: true,
    hot: true,
    hotRank: 1,
    badge: 'hot',
    uses: 5200,
    contributor: 'opc',
    tags: { zh: ['角色扮演', '系统提示'], en: ['Roleplay', 'System'] },
    title: { zh: '心理咨询师角色（演示）', en: 'Counselor roleplay (demo)' },
    description: {
      zh: '共情倾听框架，强调非医疗建议、仅供写作演练。',
      en: 'Empathetic listening frame; not medical advice—writing practice only.'
    },
    content: {
      zh: '【演示用途，非医疗建议】你是一位训练有素的心理咨询师。使用开放式提问、情感反映与总结；不提供诊断或用药建议；若涉及自伤/危机，建议寻求专业帮助。开始对话前请先说明边界。',
      en: '[Demo only—not medical advice] You are a trained counselor. Use open questions, reflections, and summaries; no diagnosis or medication advice; if crisis/self-harm appears, urge professional help. State boundaries before chatting.'
    }
  },
  {
    id: 'socratic-tutor',
    model: 'claude',
    category: 'roleplay',
    icon: '🏛️',
    accent: 'var(--accent2)',
    featured: false,
    uses: 1400,
    tags: { zh: ['苏格拉底', '教学'], en: ['Socratic', 'Tutor'] },
    title: { zh: '苏格拉底式导师', en: 'Socratic tutor' },
    description: {
      zh: '只提问不直接给答案，引导学生自己推导。',
      en: 'Guide with questions only—no direct answers.'
    },
    content: {
      zh: '你是苏格拉底式导师。对用户的问题不要直接给最终答案，用连续追问引导其自己推导；每次只问 1–2 个问题；在学生接近结论时帮助总结。',
      en: 'You are a Socratic tutor. Do not give final answers; use sequential questions so the learner derives the conclusion. Ask 1–2 questions at a time; summarize when they are close.'
    }
  },
  {
    id: 'devils-advocate',
    model: 'chatgpt',
    category: 'roleplay',
    icon: '😈',
    accent: 'var(--amber)',
    featured: false,
    uses: 760,
    tags: { zh: ['辩论', '批判'], en: ['Debate', 'Critical'] },
    title: { zh: '魔鬼代言人挑战', en: 'Devil\'s advocate challenger' },
    description: {
      zh: '针对你的方案提出最强反对论点与反例。',
      en: 'Stress-test your idea with the strongest counterarguments.'
    },
    content: {
      zh: '针对以下方案，扮演魔鬼代言人：列出 5 条最强反对理由、2 个失败案例类比、以及如何让方案更抗质疑的改进建议。\n\n方案：[粘贴]',
      en: 'As devil\'s advocate for this proposal: list 5 strongest objections, 2 failure analogies, and how to harden the plan against criticism.\n\nProposal:\n[Paste]'
    }
  },
  {
    id: 'short-video-script',
    model: 'chatgpt',
    category: 'video',
    icon: '🎥',
    accent: 'var(--coral)',
    featured: true,
    hot: true,
    hotRank: 4,
    badge: 'hot',
    uses: 3700,
    tags: { zh: ['短视频', '口播'], en: ['Short video', 'Script'] },
    title: { zh: '爆款短视频口播脚本', en: 'Viral short-video script' },
    description: {
      zh: '3 秒钩子 + 痛点 + 解法 + CTA 的 60 秒结构。',
      en: '60-second structure: hook, pain, solution, CTA.'
    },
    content: {
      zh: '主题：[填写] 平台：[抖音/视频号/Reels] 时长约 60 秒\n写口播脚本：分镜时间轴 | 画面建议 | 台词。结构：3秒钩子→痛点→方案→信任背书→CTA。',
      en: 'Topic: [fill] Platform: [TikTok/Reels/Shorts] ~60 seconds\nWrite a script with timecode | visual notes | voiceover. Structure: 3s hook → pain → solution → proof → CTA.'
    }
  },
  {
    id: 'sora-shot-list',
    model: 'sora',
    category: 'video',
    icon: '🎞️',
    accent: 'var(--pink)',
    featured: false,
    uses: 890,
    tags: { zh: ['Sora', '镜头'], en: ['Sora', 'Shots'] },
    title: { zh: 'Sora 镜头描述模板', en: 'Sora shot description template' },
    description: {
      zh: '按镜头拆解运动、光线与情绪，便于视频模型生成。',
      en: 'Per-shot motion, lighting, and mood for video models.'
    },
    content: {
      zh: '为 [场景/故事] 写 5 个连续镜头描述（各 2–3 句英文）：镜头类型、主体动作、环境、光线、情绪、镜头运动（push in / orbit / handheld）。风格：[电影/广告/纪录片]',
      en: 'For [scene/story], write 5 consecutive shot prompts (2–3 English sentences each): shot type, subject action, environment, lighting, mood, camera move (push in / orbit / handheld). Style: [cinematic/ad/documentary]'
    }
  },
  {
    id: 'youtube-outline',
    model: 'chatgpt',
    category: 'video',
    icon: '▶️',
    accent: 'var(--blue)',
    featured: false,
    uses: 1120,
    tags: { zh: ['YouTube', '长视频'], en: ['YouTube', 'Long-form'] },
    title: { zh: 'YouTube 长视频结构', en: 'YouTube long-form structure' },
    description: {
      zh: '章节时间戳、缩略图文案与描述区 SEO。',
      en: 'Chapter timestamps, thumbnail copy, and description SEO.'
    },
    content: {
      zh: '视频主题：[填写] 目标时长：[8–12分钟]\n输出：1）标题 5 个 2）缩略图文案 3）带时间戳的章节大纲 4）描述区前 150 字（含关键词）',
      en: 'Topic: [fill] Target length: [8–12 min]\nOutput: 5 titles, thumbnail text, timestamped chapter outline, and first 150 chars of description with keywords.'
    }
  },
  {
    id: 'gemini-multimodal',
    model: 'gemini',
    category: 'education',
    icon: '🔮',
    accent: 'var(--pink)',
    featured: false,
    uses: 540,
    tags: { zh: ['Gemini', '多模态'], en: ['Gemini', 'Multimodal'] },
    title: { zh: 'Gemini 图文讲义分析', en: 'Gemini slide deck analysis' },
    description: {
      zh: '上传幻灯片截图后提取要点与测验题。',
      en: 'Extract key points and quiz questions from slide images.'
    },
    content: {
      zh: '（配合图片上传）请分析这份幻灯片：1）每页要点 2）整体知识图谱 3）5 道测验题（含答案）4）建议延伸阅读',
      en: '(With slide images attached) Analyze this deck: 1) Key points per slide 2) Concept map 3) Five quiz questions with answers 4) Further reading'
    }
  },
  {
    id: 'prompt-engineer-meta',
    model: 'chatgpt',
    category: 'coding',
    icon: '💡',
    accent: 'var(--accent2)',
    featured: true,
    hot: true,
    hotRank: 5,
    badge: 'tips',
    uses: 3400,
    contributor: 'opc',
    tags: { zh: ['Prompt 工程', '元提示'], en: ['Prompt engineering', 'Meta'] },
    title: { zh: 'Prompt 工程师自我提升框架', en: 'Prompt engineer self-improvement' },
    description: {
      zh: '让模型帮你迭代、评测并版本化自己的提示词。',
      en: 'Iterate, evaluate, and version your own prompts systematically.'
    },
    content: {
      zh: '你是 Prompt 工程教练。我会提供一个任务型提示词。请：1）分析其清晰度与遗漏约束 2）给出改进版 v2 3）设计 3 条测试输入与期望输出要点 4）建议 A/B 评测方法。',
      en: 'You are a prompt engineering coach. I will share a task prompt. Please: 1) Analyze clarity and missing constraints 2) Provide improved v2 3) Design 3 test inputs with expected output traits 4) Suggest A/B evaluation method.'
    }
  }
];

