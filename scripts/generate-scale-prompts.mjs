/**
 * Generates 70 prompts × 8 categories (560) → prompts-scale.js
 * Combined with existing 30/cat → 100 per category, 800 total
 * Run: node scripts/generate-scale-prompts.mjs
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../assets/js/data/prompts-scale.js');
const PER_CATEGORY = 70;
const ICONS = ['✨', '🔥', '💡', '🎯', '📌', '⭐', '🧩', '🚀', '💎', '📎', '🌟', '⚡', '🎪', '🔮', '🛠️'];

const TEXT_MODELS = ['chatgpt', 'claude', 'gemini', 'chatgpt', 'claude'];
const IMAGE_MODELS = ['midjourney', 'sd', 'midjourney', 'sd'];

/**
 * @param {string} category
 * @param {number} index
 * @param {object} a facet A {zh,en}
 * @param {object} b facet B {zh,en}
 * @param {object} core {zh,en} task body
 */
function textPrompt(category, index, a, b, core) {
  const model = TEXT_MODELS[index % TEXT_MODELS.length];
  const n = String(index + 1).padStart(3, '0');
  return {
    id: `${category}-scale-${n}`,
    model,
    category,
    icon: ICONS[index % ICONS.length],
    accent: 'var(--accent)',
    uses: 280 + index * 17,
    tags: { zh: [a.zh, b.zh], en: [a.en, b.en] },
    title: {
      zh: `${a.zh} × ${b.zh}`,
      en: `${a.en} × ${b.en}`
    },
    description: {
      zh: `针对「${a.zh}」场景，完成「${b.zh}」的专业输出，含步骤与验收标准。`,
      en: `Professional ${b.en} output for ${a.en} with steps and acceptance criteria.`
    },
    content: {
      zh: `【场景】${a.zh}\n【任务类型】${b.zh}\n\n${core.zh}\n\n请在我提供素材后，先列出假设与待确认项（如有），再按结构化格式交付完整结果。`,
      en: `【Context】${a.en}\n【Task type】${b.en}\n\n${core.en}\n\nAfter I provide materials, list assumptions and open questions if needed, then deliver a complete structured result.`
    }
  };
}

function imagePrompt(category, index, style, subject, promptEn, promptZh) {
  const model = IMAGE_MODELS[index % IMAGE_MODELS.length];
  const n = String(index + 1).padStart(3, '0');
  return {
    id: `${category}-scale-${n}`,
    model,
    category,
    icon: ICONS[index % ICONS.length],
    accent: 'var(--amber)',
    uses: 320 + index * 19,
    tags: {
      zh: [style.zh, subject.zh, model === 'midjourney' ? 'Midjourney' : 'SD'],
      en: [style.en, subject.en, model === 'midjourney' ? 'Midjourney' : 'SD']
    },
    title: {
      zh: `${style.zh} · ${subject.zh}`,
      en: `${style.en} · ${subject.en}`
    },
    description: {
      zh: `${style.zh}风格下的${subject.zh}图像生成提示词，含参数与迭代建议（自动扩写为详细版）。`,
      en: `${style.en} ${subject.en} image prompt with parameters and iteration tips (auto-expanded to full version).`
    },
    content: {
      zh: `${promptZh}\n\n变量 [主体] 请替换为你的英文主体描述。`,
      en: `${promptEn}\n\nReplace [subject] with your subject description in English.`
    }
  };
}

function buildWriting() {
  const genres = [
    { zh: '议论文', en: 'Argumentative essay' },
    { zh: '说明文', en: 'Expository writing' },
    { zh: '叙事散文', en: 'Narrative essay' },
    { zh: '职场公文', en: 'Workplace documents' },
    { zh: '新媒体短文', en: 'Social short-form' },
    { zh: '学术论文', en: 'Academic paper' },
    { zh: '品牌文案', en: 'Brand copy' },
    { zh: '新闻稿', en: 'Press release' },
    { zh: '技术博客', en: 'Technical blog' },
    { zh: '诗歌散文', en: 'Poetry/prose' }
  ];
  const tasks = [
    {
      zh: '结构重组',
      en: 'Restructure',
      zhC: '分析现有结构问题，给出新大纲并示范首尾段改写。',
      enC: 'Diagnose structure issues, propose a new outline, and sample rewritten opening/closing.'
    },
    {
      zh: '语言润色',
      en: 'Language polish',
      zhC: '统一语气与人称，减少冗余，提升动词具象度与句间衔接。',
      enC: 'Unify tone and POV, cut redundancy, strengthen verbs and transitions.'
    },
    {
      zh: '扩写充实',
      en: 'Expand',
      zhC: '在保持论点不变前提下扩写 30%，补充案例、数据占位与论证链。',
      enC: 'Expand ~30% while keeping the thesis; add case placeholders and argument chain.'
    },
    {
      zh: '精简压缩',
      en: 'Condense',
      zhC: '压缩至目标字数，保留核心论据，删除重复与弱支撑句。',
      enC: 'Hit target word count; keep core arguments; remove repetition and weak support.'
    },
    {
      zh: '标题优化',
      en: 'Headline optimization',
      zhC: '生成 15 个标题备选，标注吸引点、受众与渠道适配。',
      enC: 'Generate 15 headline options with hook type, audience, and channel fit.'
    },
    {
      zh: '受众改写',
      en: 'Audience adaptation',
      zhC: '将同一内容改写为初学者/专家两个版本，各附导读段。',
      enC: 'Rewrite for beginner vs expert audiences with a short primer each.'
    },
    {
      zh: '合规审读',
      en: 'Compliance review',
      zhC: '标注敏感表述、绝对化用语与事实待核实句，给出替换建议。',
      enC: 'Flag sensitive phrasing, superlatives, and unverified claims with replacements.'
    }
  ];
  const out = [];
  let i = 0;
  for (const g of genres) {
    for (const t of tasks) {
      if (i >= PER_CATEGORY) break;
      out.push(
        textPrompt('writing', i, g, t, {
          zh: t.zhC,
          en: t.enC
        })
      );
      i++;
    }
  }
  return out;
}

function buildCoding() {
  const stacks = [
    { zh: 'Python', en: 'Python' },
    { zh: 'TypeScript', en: 'TypeScript' },
    { zh: 'Go', en: 'Go' },
    { zh: 'Rust', en: 'Rust' },
    { zh: 'Java', en: 'Java' },
    { zh: 'C#', en: 'C#' },
    { zh: 'React', en: 'React' },
    { zh: 'Vue', en: 'Vue' },
    { zh: 'Node.js', en: 'Node.js' },
    { zh: 'SQL', en: 'SQL' }
  ];
  const tasks = [
    {
      zh: '代码审查',
      en: 'Code review',
      zhC: '审查以下代码：正确性、安全、性能、可读性，输出分级问题表与修复建议。',
      enC: 'Review code for correctness, security, performance, readability; graded issues and fixes.'
    },
    {
      zh: '单元测试',
      en: 'Unit tests',
      zhC: '为给定函数编写测试：正常/边界/异常路径，附 mock 策略说明。',
      enC: 'Write unit tests: happy/edge/error paths with mock strategy notes.'
    },
    {
      zh: '重构方案',
      en: 'Refactoring plan',
      zhC: '在不改行为前提下提出分步重构计划，每步可独立合并。',
      enC: 'Stepwise refactoring plan with behavior preserved; merge-friendly steps.'
    },
    {
      zh: 'Bug 定位',
      en: 'Bug triage',
      zhC: '根据报错与复现步骤，给出根因假设、验证实验与最小修复。',
      enC: 'From error and repro steps: hypotheses, verification, minimal fix.'
    },
    {
      zh: 'API 设计',
      en: 'API design',
      zhC: '设计 REST/GraphQL 端点、请求响应 schema、错误码与版本策略。',
      enC: 'Design endpoints, schemas, error codes, and versioning strategy.'
    },
    {
      zh: '性能优化',
      en: 'Performance tuning',
      zhC: '分析瓶颈，给出测量方法、优化项优先级与预期收益。',
      enC: 'Find bottlenecks with measurement plan, prioritized optimizations.'
    },
    {
      zh: '文档生成',
      en: 'Documentation',
      zhC: '生成 README/API 文档：快速开始、示例、配置项与常见问题。',
      enC: 'Produce README/API docs: quick start, examples, config, FAQ.'
    }
  ];
  const out = [];
  let i = 0;
  for (const s of stacks) {
    for (const t of tasks) {
      if (i >= PER_CATEGORY) break;
      out.push(
        textPrompt('coding', i, s, t, {
          zh: `技术栈：${s.zh}。${t.zhC}\n\n\`\`\`\n[粘贴代码或需求]\n\`\`\``,
          en: `Stack: ${s.en}. ${t.enC}\n\n\`\`\`\n[Paste code or requirements]\n\`\`\``
        })
      );
      i++;
    }
  }
  return out;
}

function buildImage() {
  const styles = [
    { zh: '写实摄影', en: 'Photoreal' },
    { zh: '电影光影', en: 'Cinematic' },
    { zh: '极简商业', en: 'Minimal commercial' },
    { zh: '赛博朋克', en: 'Cyberpunk' },
    { zh: '水彩插画', en: 'Watercolor' },
    { zh: '日系动漫', en: 'Anime' },
    { zh: '3D 渲染', en: '3D render' },
    { zh: '复古胶片', en: 'Vintage film' },
    { zh: '水墨国风', en: 'Chinese ink' },
    { zh: '科幻概念', en: 'Sci-fi concept' }
  ];
  const subjects = [
    { zh: '人像', en: 'Portrait', enP: 'portrait of [subject], detailed eyes, natural skin', zhP: '人像 [主体]，精致眼神，自然肤质' },
    { zh: '产品', en: 'Product', enP: 'product shot of [subject], studio lighting, sharp details', zhP: '产品 [主体]，影棚光，锐利细节' },
    { zh: '建筑', en: 'Architecture', enP: 'architecture of [subject], wide angle, blue hour', zhP: '建筑 [主体]，广角，蓝调时刻' },
    { zh: '风景', en: 'Landscape', enP: 'landscape of [subject], golden hour, dramatic clouds', zhP: '风景 [主体]，黄金时刻，戏剧云层' },
    { zh: '美食', en: 'Food', enP: 'gourmet food [subject], steam, macro texture', zhP: '美食 [主体]，蒸汽，微距质感' },
    { zh: '动物', en: 'Animal', enP: 'wildlife [subject], telephoto, natural habitat', zhP: '动物 [主体]，长焦，自然栖息地' },
    { zh: '室内', en: 'Interior', enP: 'interior design [subject], soft natural light', zhP: '室内 [主体]，柔和自然光' }
  ];
  const out = [];
  let i = 0;
  for (const st of styles) {
    for (const sub of subjects) {
      if (i >= PER_CATEGORY) break;
      const styleEn =
        st.en === 'Photoreal'
          ? 'hyper realistic'
          : st.en === 'Cinematic'
            ? 'cinematic lighting, film still'
            : st.en === 'Anime'
              ? 'anime style, vibrant'
              : st.en.toLowerCase();
      out.push(
        imagePrompt(
          'image',
          i,
          st,
          sub,
          `${styleEn} ${sub.enP}, highly detailed, professional composition --ar 3:2`,
          `${st.zh}，${sub.zhP}，高细节，专业构图`
        )
      );
      i++;
    }
  }
  return out;
}

function buildMarketing() {
  const channels = [
    { zh: '小红书', en: 'Xiaohongshu' },
    { zh: '抖音', en: 'Douyin/TikTok' },
    { zh: '微信生态', en: 'WeChat ecosystem' },
    { zh: '微博', en: 'Weibo' },
    { zh: 'B站', en: 'Bilibili' },
    { zh: 'LinkedIn', en: 'LinkedIn' },
    { zh: 'Google Ads', en: 'Google Ads' },
    { zh: '邮件营销', en: 'Email marketing' },
    { zh: '亚马逊', en: 'Amazon' },
    { zh: '线下活动', en: 'Offline events' }
  ];
  const tasks = [
    {
      zh: '爆款标题',
      en: 'Viral headlines',
      zhC: '生成 12 条标题与 3 条封面文案，标注情绪触发与关键词布局。',
      enC: '12 headlines and 3 cover lines with emotion hooks and keyword placement.'
    },
    {
      zh: '活动方案',
      en: 'Campaign plan',
      zhC: '输出活动目标、机制、时间线、渠道分工与 KPI 预估框架。',
      enC: 'Campaign goals, mechanics, timeline, channel roles, KPI framework.'
    },
    {
      zh: '转化文案',
      en: 'Conversion copy',
      zhC: '撰写落地页核心区块：首屏、利益点、社会证明、FAQ、CTA。',
      enC: 'Landing blocks: hero, benefits, proof, FAQ, CTA.'
    },
    {
      zh: '用户画像',
      en: 'Persona brief',
      zhC: '描述目标用户痛点、场景、反对意见与打动点。',
      enC: 'Persona pains, scenarios, objections, and compelling angles.'
    },
    {
      zh: '竞品话术',
      en: 'Competitive messaging',
      zhC: '对比维度表 + 我方差异化话术 + 销售应对 Q&A。',
      enC: 'Comparison table, differentiation lines, sales Q&A.'
    },
    {
      zh: '私域话术',
      en: 'Community scripts',
      zhC: '设计 7 天社群节奏：早安/干货/互动/成交/复盘话术模板。',
      enC: '7-day community rhythm scripts: value, engagement, offer, recap.'
    },
    {
      zh: '品牌 Slogan',
      en: 'Brand slogan',
      zhC: '生成 20 条 slogan，附品牌调性说明与使用场景建议。',
      enC: '20 slogans with voice notes and usage scenarios.'
    }
  ];
  const out = [];
  let i = 0;
  for (const c of channels) {
    for (const t of tasks) {
      if (i >= PER_CATEGORY) break;
      out.push(textPrompt('marketing', i, c, t, { zh: t.zhC, en: t.enC }));
      i++;
    }
  }
  return out;
}

function buildEducation() {
  const subjects = [
    { zh: '数学', en: 'Mathematics' },
    { zh: '英语', en: 'English' },
    { zh: '物理', en: 'Physics' },
    { zh: '化学', en: 'Chemistry' },
    { zh: '历史', en: 'History' },
    { zh: '编程入门', en: 'Intro programming' },
    { zh: '经济学', en: 'Economics' },
    { zh: '心理学', en: 'Psychology' },
    { zh: '艺术史', en: 'Art history' },
    { zh: '学习方法', en: 'Study skills' }
  ];
  const tasks = [
    {
      zh: '概念讲解',
      en: 'Concept explanation',
      zhC: '用类比+例子+小测验讲清概念，避免术语堆砌。',
      enC: 'Explain with analogy, example, and mini-quiz; avoid jargon dumps.'
    },
    {
      zh: '习题辅导',
      en: 'Problem coaching',
      zhC: '苏格拉底式引导解题，不直接给最终答案。',
      enC: 'Socratic problem guidance without giving away the final answer.'
    },
    {
      zh: '教案设计',
      en: 'Lesson plan',
      zhC: '45 分钟教案：目标、活动、评估、差异化策略。',
      enC: '45-min lesson: objectives, activities, assessment, differentiation.'
    },
    {
      zh: '出题测验',
      en: 'Quiz generation',
      zhC: '生成 15 道题（选择/填空/简答）附答案与解析。',
      enC: '15 questions (MCQ/fill/short) with answers and explanations.'
    },
    {
      zh: '知识卡片',
      en: 'Flashcards',
      zhC: '输出 25 张闪卡问答，难度递进，适合 Anki。',
      enC: '25 flashcards Q/A with increasing difficulty for Anki.'
    },
    {
      zh: '论文辅导',
      en: 'Paper coaching',
      zhC: '帮助梳理论文结构、文献综述框架与论证逻辑。',
      enC: 'Help with paper structure, literature review frame, and argument flow.'
    },
    {
      zh: '家长沟通',
      en: 'Parent communication',
      zhC: '起草客观的家校沟通信，含事实、进步点与合作建议。',
      enC: 'Draft factual parent letter with progress and collaboration tips.'
    }
  ];
  const out = [];
  let i = 0;
  for (const s of subjects) {
    for (const t of tasks) {
      if (i >= PER_CATEGORY) break;
      out.push(
        textPrompt('education', i, s, t, {
          zh: `学科/主题：${s.zh}。${t.zhC}`,
          en: `Subject: ${s.en}. ${t.enC}`
        })
      );
      i++;
    }
  }
  return out;
}

function buildBusiness() {
  const domains = [
    { zh: '战略规划', en: 'Strategy' },
    { zh: '财务管理', en: 'Finance' },
    { zh: '人力资源', en: 'HR' },
    { zh: '运营管理', en: 'Operations' },
    { zh: '市场营销', en: 'Marketing ops' },
    { zh: '产品管理', en: 'Product management' },
    { zh: '供应链', en: 'Supply chain' },
    { zh: '法务合规', en: 'Legal/compliance' },
    { zh: '数据分析', en: 'Data analytics' },
    { zh: '创业融资', en: 'Startup fundraising' }
  ];
  const tasks = [
    {
      zh: '决策备忘录',
      en: 'Decision memo',
      zhC: '撰写决策 memo：背景、选项对比表、推荐方案与风险。',
      enC: 'Decision memo: context, options table, recommendation, risks.'
    },
    {
      zh: 'OKR 拆解',
      en: 'OKR breakdown',
      zhC: '将目标拆解为可衡量 KR，含负责人与时间里程碑。',
      enC: 'Break objectives into measurable KRs with owners and milestones.'
    },
    {
      zh: '周报月报',
      en: 'Status report',
      zhC: '整理周报：进展、阻塞、需决策项、下周计划。',
      enC: 'Status report: progress, blockers, decisions needed, next week.'
    },
    {
      zh: '流程优化',
      en: 'Process improvement',
      zhC: '绘制现状流程、瓶颈点与改进方案（附指标）。',
      enC: 'As-is process, bottlenecks, to-be improvements with metrics.'
    },
    {
      zh: '竞品分析',
      en: 'Competitive analysis',
      zhC: '输出竞品矩阵与差异化策略建议 3 条。',
      enC: 'Competitor matrix plus three differentiation moves.'
    },
    {
      zh: '会议纪要',
      en: 'Meeting minutes',
      zhC: '结构化纪要：决议、Action Items（负责人+截止日）。',
      enC: 'Minutes: decisions and action items with owners and due dates.'
    },
    {
      zh: '风险评估',
      en: 'Risk assessment',
      zhC: '风险登记册：概率、影响、缓解措施、触发信号。',
      enC: 'Risk register: probability, impact, mitigation, early signals.'
    }
  ];
  const out = [];
  let i = 0;
  for (const d of domains) {
    for (const t of tasks) {
      if (i >= PER_CATEGORY) break;
      out.push(textPrompt('business', i, d, t, { zh: t.zhC, en: t.enC }));
      i++;
    }
  }
  return out;
}

function buildRoleplay() {
  const roles = [
    { zh: '面试官', en: 'Interviewer' },
    { zh: '销售教练', en: 'Sales coach' },
    { zh: '心理咨询师', en: 'Counselor (demo)' },
    { zh: '法律顾问', en: 'Legal advisor (demo)' },
    { zh: '健身教练', en: 'Fitness coach' },
    { zh: '营养师', en: 'Nutritionist (general)' },
    { zh: '导游', en: 'Tour guide' },
    { zh: '投资顾问', en: 'Investment advisor (demo)' },
    { zh: '产品经理', en: 'Product manager' },
    { zh: '英语老师', en: 'English tutor' }
  ];
  const scenarios = [
    {
      zh: '模拟对话',
      en: 'Dialogue simulation',
      zhC: '进行 8 轮角色对话，结束后给反馈与改进话术。',
      enC: '8-turn roleplay then feedback and better phrasing.'
    },
    {
      zh: '压力测试',
      en: 'Stress test',
      zhC: '扮演挑剔对方，提出 5 个尖锐问题并评估我的回答。',
      enC: 'Play a tough counterpart with 5 hard questions; evaluate answers.'
    },
    {
      zh: '培训演练',
      en: 'Training drill',
      zhC: '按剧本引导我完成标准流程，纠正偏离步骤。',
      enC: 'Guide me through a standard script; correct process deviations.'
    },
    {
      zh: '反馈点评',
      en: 'Feedback debrief',
      zhC: '根据我的表现从维度表打分并给 3 条提升建议。',
      enC: 'Score my performance on a rubric with three improvements.'
    },
    {
      zh: '开场破冰',
      en: 'Icebreaker',
      zhC: '设计 5 种开场白并说明适用场合与风险。',
      enC: 'Five opening lines with context fit and risks.'
    },
    {
      zh: '异议处理',
      en: 'Objection handling',
      zhC: '连续提出常见异议，示范 LAER 回应结构。',
      enC: 'Common objections with LAER-style response examples.'
    },
    {
      zh: '复盘总结',
      en: 'After-action review',
      zhC: '引导我复盘：做得好/待改进/下次实验行动。',
      enC: 'Debrief: what worked, gaps, next experiments.'
    }
  ];
  const out = [];
  let i = 0;
  for (const r of roles) {
    for (const s of scenarios) {
      if (i >= PER_CATEGORY) break;
      const disclaimer =
        r.zh.includes('心理') || r.zh.includes('法律') || r.zh.includes('投资')
          ? {
              zh: '【演示用途，非专业意见】',
              en: '[Demo only—not professional advice]'
            }
          : { zh: '', en: '' };
      out.push(
        textPrompt('roleplay', i, r, s, {
          zh: `${disclaimer.zh}${s.zhC}`,
          en: `${disclaimer.en}${s.enC}`
        })
      );
      i++;
    }
  }
  return out;
}

function buildVideo() {
  const formats = [
    { zh: '短视频', en: 'Short video' },
    { zh: '直播带货', en: 'Live commerce' },
    { zh: '课程视频', en: 'Course video' },
    { zh: '品牌广告', en: 'Brand ad' },
    { zh: '纪录片', en: 'Documentary' },
    { zh: '播客视频', en: 'Video podcast' },
    { zh: '产品演示', en: 'Product demo' },
    { zh: 'Vlog', en: 'Vlog' },
    { zh: '访谈节目', en: 'Interview show' },
    { zh: '动画解说', en: 'Animated explainer' }
  ];
  const tasks = [
    {
      zh: '分镜脚本',
      en: 'Storyboard script',
      zhC: '输出分镜表：镜号、时长、画面、口播、字幕、音效。',
      enC: 'Shot list: #, duration, visual, VO, captions, SFX.'
    },
    {
      zh: '口播稿',
      en: 'VO script',
      zhC: '撰写口播稿并标注语气、停顿与重音。',
      enC: 'VO script with tone, pauses, and stress marks.'
    },
    {
      zh: '标题封面',
      en: 'Title & thumbnail',
      zhC: '10 个标题 + 封面文案 + 缩略图画面描述。',
      enC: '10 titles, cover copy, thumbnail visual brief.'
    },
    {
      zh: '剪辑节奏',
      en: 'Edit pacing',
      zhC: '给出剪辑节奏表与 B-roll 插入点建议。',
      enC: 'Edit pacing map and B-roll insertion points.'
    },
    {
      zh: '平台适配',
      en: 'Platform adaptation',
      zhC: '同一脚本改写为竖屏/横屏两版时长与信息密度。',
      enC: 'Adapt script for vertical vs horizontal length and density.'
    },
    {
      zh: '字幕文案',
      en: 'Caption copy',
      zhC: '生成 SRT 风格字幕行，口语化且可读。',
      enC: 'SRT-style captions: colloquial and readable.'
    },
    {
      zh: 'CTA 设计',
      en: 'CTA design',
      zhC: '设计 3 种结尾号召：关注/下单/私信，各附口播句。',
      enC: 'Three endings: follow/purchase/DM with VO lines.'
    }
  ];
  const out = [];
  let i = 0;
  for (const f of formats) {
    for (const t of tasks) {
      if (i >= PER_CATEGORY) break;
      out.push(textPrompt('video', i, f, t, { zh: t.zhC, en: t.enC }));
      i++;
    }
  }
  return out;
}

const all = [
  ...buildWriting(),
  ...buildCoding(),
  ...buildImage(),
  ...buildMarketing(),
  ...buildEducation(),
  ...buildBusiness(),
  ...buildRoleplay(),
  ...buildVideo()
];

writeFileSync(
  outPath,
  `/** Auto-generated 560 prompts (70×8). Run: node scripts/generate-scale-prompts.mjs */\nexport const SCALE_PROMPTS = ${JSON.stringify(all, null, 2)};\n`,
  'utf8'
);

const counts = {};
all.forEach((p) => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});
console.log('Wrote', all.length, 'prompts to', outPath);
console.log('Per category:', counts);
