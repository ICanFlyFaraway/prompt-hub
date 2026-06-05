/**
 * Generates assets/js/data/prompts-bulk.js (20 prompts × 8 categories)
 * Run: node scripts/generate-bulk-prompts.mjs
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../assets/js/data/prompts-bulk.js');

const MODELS = ['chatgpt', 'claude', 'chatgpt', 'claude', 'gemini', 'chatgpt', 'claude', 'midjourney', 'sd', 'sora'];

/** @type {Record<string, Array<[string,string,string,string,string,string,string,string[]]>>} */
const CATALOG = {
  writing: [
    ['speech', '演讲稿撰写', 'Speech writer', '层次清晰、金句点缀的公开演讲稿。', 'Structured speech with memorable lines.', '场合：[年会/毕业典礼] 时长：[8分钟] 主题：[填写]\n请写演讲稿：开场故事、3个论点、结尾号召，口语化，标注停顿处。', 'Occasion: [fill] Length: [8 min] Theme: [fill]\nWrite a speech: opening story, 3 points, closing call-to-action, conversational tone, pause markers.'],
    ['whitepaper', '技术白皮书提纲', 'Technical whitepaper outline', 'B2B 白皮书章节与论据骨架。', 'B2B whitepaper chapters and argument skeleton.', '产品：[填写] 读者：[CTO/采购]\n输出白皮书目录、每章核心论点、需引用的数据类型、Executive Summary 草稿（200字）。', 'Product: [fill] Audience: [CTO/procurement]\nOutput TOC, thesis per chapter, data to cite, 200-word executive summary draft.'],
    ['novel-dialogue', '小说对话润色', 'Fiction dialogue polish', '角色口吻区分、潜台词与节奏。', 'Distinct voices, subtext, and pacing.', '人设简述：[填写]\n润色以下对话，使每个角色口吻可辨，增加潜台词，删减说明性对白：\n\n[粘贴对话]', 'Character notes: [fill]\nPolish dialogue for distinct voice, subtext, less exposition:\n\n[Paste dialogue]'],
    ['product-copy', '产品详情页文案', 'Product page copy', '卖点金字塔、规格与 FAQ 一体。', 'Benefit pyramid, specs, and FAQ combined.', '产品：[填写] 竞品差异：[填写]\n写电商详情页：首屏标题+副标题、3个核心卖点、规格表文案、FAQ 5条。', 'Product: [fill] Differentiators: [fill]\nWrite product page: hero headline/subhead, 3 benefits, spec copy, 5 FAQs.'],
    ['grant-proposal', '基金申请书摘要', 'Grant proposal abstract', '研究问题、方法与预期影响。', 'Research question, methods, expected impact.', '课题：[填写] 基金类型：[国家级/校级]\n撰写摘要（中英文各300字）：背景、缺口、方法、创新、预期成果。', 'Topic: [fill] Grant type: [fill]\nWrite 300-word abstract (ZH+EN): background, gap, methods, novelty, outcomes.'],
    ['tone-rewrite', '语气风格改写', 'Tone/style rewrite', '同一内容改写为正式/轻松/权威版。', 'Rewrite same content in formal/casual/authoritative tones.', '原文：[粘贴] 目标语气：[正式/轻松/权威]\n给出改写版，并列出 3 处关键措辞变化及原因。', 'Source: [paste] Target tone: [formal/casual/authoritative]\nRewrite plus 3 key wording changes with reasons.'],
    ['script-voiceover', '纪录片旁白精简', 'Doc narration trim', '删繁就简，保留画面感。', 'Trim while keeping visual language.', '旁白稿：[粘贴] 目标字数：[减少30%]\n精简旁白，保留画面感动词，输出对照表（删改原因）。', 'Narration: [paste] Target: [30% shorter]\nTrim with visual verbs; table of cuts and reasons.'],
    ['legal-plain', '法律条款通俗化', 'Legal plain language', '面向消费者的简明说明，非法律意见。', 'Consumer-friendly summary—not legal advice.', '【非法律意见】条款原文：[粘贴]\n用通俗语言写「用户须知」版（≤500字），标注仍需律师审核的要点。', '[Not legal advice] Clause text: [paste]\nPlain-language user summary (≤500 words) and items needing lawyer review.'],
    ['newsletter', '邮件周刊编辑', 'Email newsletter editor', '要闻+点评+行动号召结构。', 'Briefs, commentary, and CTA structure.', '本周素材：[粘贴多条链接摘要]\n编排邮件周刊：主题行3个、导语、3条要闻点评、1个深度链接、结尾CTA。', 'Weekly notes: [paste]\nNewsletter: 3 subject lines, intro, 3 briefs with takes, 1 deep link, CTA.'],
    ['caption-social', '社媒配图说明', 'Social image captions', '多平台字数适配与 hashtag 策略。', 'Platform length limits and hashtag strategy.', '图片内容：[描述] 品牌调性：[填写]\n写 Instagram/微博/LinkedIn 三个版本配文+hashtag建议。', 'Image: [describe] Brand voice: [fill]\nCaptions for Instagram/Weibo/LinkedIn with hashtag tips.'],
    ['ebook-chapter', '电子书章节扩写', 'Ebook chapter expander', '从大纲扩写成完整章节。', 'Expand outline into full chapter.', '章节大纲：[粘贴] 目标字数：[3000]\n扩写为完整章节：案例1个、小结、过渡到下一章的钩子。', 'Outline: [paste] Target: [3000 words]\nFull chapter with one case study, summary, bridge to next chapter.'],
    ['sensitive-edit', '敏感内容合规改写', 'Sensitive content compliance edit', '降敏表述，保留核心信息。', 'Soften sensitive phrasing, keep core facts.', '原文：[粘贴] 发布渠道：[国内社媒/海外]\n给出合规改写版+风险词替换对照表。', 'Text: [paste] Channel: [domestic/global]\nCompliant rewrite plus risky-term substitution table.'],
    ['readme-tech', '开源 README 撰写', 'Open-source README', '安装、示例、贡献指南齐全。', 'Install, examples, and contributing guide.', '项目名：[填写] 技术栈：[填写] 核心功能：[3条]\n写 README：徽章区、简介、Quick Start、API示例、Contributing、License占位。', 'Name: [fill] Stack: [fill] Features: [3 bullets]\nREADME: badges, intro, quick start, API example, contributing, license placeholder.'],
    ['comparison-article', '对比评测文章', 'Comparison review article', '客观维度表+选购建议。', 'Objective comparison table plus buying advice.', '对比对象 A vs B：[填写] 用户场景：[填写]\n写评测文：维度表（价格/性能/体验）、优缺点、适用人群、结论建议。', 'A vs B: [fill] Use case: [fill]\nReview with comparison table, pros/cons, who should buy, conclusion.'],
    ['ghost-memoir', '人物回忆录提纲', 'Memoir outline', '时间线+主题章节+情感高潮。', 'Timeline, thematic chapters, emotional peaks.', '主人公：[填写] 年代跨度：[填写]\n输出回忆录目录（12章）、每章关键事件与情感主题。', 'Subject: [fill] Era: [fill]\n12-chapter memoir outline with key events and emotional themes per chapter.'],
    ['ux-microcopy', 'UX 微文案套装', 'UX microcopy set', '按钮、空状态、错误提示一致语气。', 'Buttons, empty states, errors in one voice.', '产品类型：[App/Web] 语气：[友好专业]\n写 20 条微文案：注册流程、空状态、错误、成功 Toast。', 'Product: [App/Web] Voice: [friendly pro]\n20 microcopy strings: signup, empty states, errors, success toasts.'],
    ['annual-report', '年报董事长致辞', 'Chairman letter draft', '成绩-挑战-展望三段式。', 'Results, challenges, outlook structure.', '年度数据亮点：[填写] 行业环境：[填写]\n撰写董事长致辞（800字）：致谢、成绩、挑战坦诚、来年战略、结语。', 'Highlights: [fill] Industry context: [fill]\n800-word chairman letter: thanks, results, honest challenges, strategy, close.'],
    ['subtitle-trans', '字幕翻译本地化', 'Subtitle localization', '口语化、时长可读、文化适配。', 'Colloquial, readable timing, cultural fit.', '原文字幕（英文）：[粘贴] 目标：[简体/繁体]\n翻译并压缩为可读字幕行（每行≤14字），附文化注释3条。', 'EN subtitles: [paste] Target: [ZH variant]\nLocalized lines (≤14 chars), 3 cultural notes.'],
    ['brand-story', '品牌故事撰写', 'Brand story writer', '起源-使命-愿景叙事弧。', 'Origin-mission-vision narrative arc.', '品牌：[填写] 创始人故事素材：[粘贴]\n写品牌故事（600字）：冲突、转折、价值观、用户共鸣点。', 'Brand: [fill] Founder notes: [paste]\n600-word brand story: conflict, turn, values, user resonance.'],
    ['policy-summary', '政策文件要点解读', 'Policy brief summary', '影响对象、时间节点、行动清单。', 'Who is affected, timeline, action checklist.', '政策原文摘要：[粘贴]\n输出：一句话结论、3条核心变化、受影响方、企业行动清单（5条）。', 'Policy notes: [paste]\nOne-line conclusion, 3 changes, affected parties, 5 action items for business.']
  ],
  coding: [
    ['rust-ownership', 'Rust 所有权讲解', 'Rust ownership tutor', '用类比解释 borrow/move 与生命周期。', 'Explain borrow/move and lifetimes with analogies.', '我是 Rust 初学者。请用类比解释以下代码为何编译失败，并给出修复：\n\n```rust\n[粘贴代码]\n```', 'I am new to Rust. Explain why this fails with an analogy and fix:\n\n```rust\n[paste]\n```'],
    ['python-pandas', 'Pandas 数据清洗', 'Pandas data cleaning', '缺失值、类型转换、分组聚合流水线。', 'Missing values, dtypes, groupby pipeline.', '数据描述：[列说明] 目标：[聚合报表]\n写 Pandas 代码：读 CSV、清洗、透视表，附注释。\n\n样例前几行：[粘贴]', 'Schema: [fill] Goal: [report]\nPandas code: read CSV, clean, pivot, commented.\n\nSample rows: [paste]'],
    ['k8s-yaml', 'Kubernetes 清单审查', 'Kubernetes manifest review', '资源限制、探针、安全上下文检查。', 'Limits, probes, security context checks.', '审查以下 Deployment YAML：风险、最佳实践、改进版 YAML。\n\n```yaml\n[粘贴]\n```', 'Review Deployment YAML: risks, best practices, improved YAML.\n\n```yaml\n[paste]\n```'],
    ['graphql-schema', 'GraphQL Schema 设计', 'GraphQL schema design', '类型、分页、错误模型建议。', 'Types, pagination, error model advice.', '业务实体：[用户/订单/商品]\n设计 GraphQL schema（SDL）、查询示例、分页与错误字段约定。', 'Entities: [users/orders/products]\nGraphQL SDL, sample queries, pagination and error conventions.'],
    ['ci-github-actions', 'GitHub Actions 流水线', 'GitHub Actions pipeline', '测试-构建-部署多阶段模板。', 'Test-build-deploy multi-stage template.', '项目：[Node/Python] 部署目标：[Vercel/ECS]\n写 `.github/workflows/ci.yml` 含缓存、矩阵测试、部署门禁。', 'Project: [Node/Python] Deploy: [Vercel/ECS]\nWrite ci.yml with cache, matrix tests, deploy gates.'],
    ['perf-bottleneck', '性能瓶颈分析', 'Performance bottleneck analysis', '从日志/火焰图定位热点。', 'Find hotspots from logs or profiles.', '现象：[延迟高/内存涨] 环境：[生产/压测]\n根据以下指标与日志，列出瓶颈假设、验证步骤、优化优先级。\n\n[粘贴数据]', 'Symptom: [latency/memory] Env: [prod/load test]\nHypotheses, verification steps, optimization priority from metrics/logs.\n\n[Paste data]'],
    ['migrate-db', '数据库迁移方案', 'Database migration plan', '零停机迁移步骤与回滚。', 'Zero-downtime steps and rollback.', '从 [MySQL 5.7] 迁到 [8.0/Postgres]，数据量 [填写]\n输出迁移阶段、双写策略、校验、回滚触发条件。', 'From [MySQL 5.7] to [8.0/Postgres], size: [fill]\nPhases, dual-write, validation, rollback triggers.'],
    ['oauth-design', 'OAuth2 集成设计', 'OAuth2 integration design', '授权码模式流程与安全隐患。', 'Authorization code flow and security pitfalls.', '应用类型：[Web/SPA/移动端] IdP：[Google/企业AD]\n画流程说明（文字版）、端点清单、token 存储建议、常见漏洞检查表。', 'App: [Web/SPA/mobile] IdP: [Google/AD]\nFlow description, endpoints, token storage, security checklist.'],
    ['flutter-widget', 'Flutter 组件实现', 'Flutter widget implementation', '状态管理选型与 widget 树结构。', 'State management choice and widget tree.', 'UI 描述：[填写] 状态：[本地/Provider/Riverpod]\n输出 Flutter 代码：Widget 结构、状态类、关键注释。', 'UI: [fill] State: [local/Provider/Riverpod]\nFlutter widget code with structure and comments.'],
    ['solidity-audit', 'Solidity 合约初审', 'Solidity contract pre-audit', '重入、溢出、权限常见风险点。', 'Reentrancy, overflow, access control risks.', '【非正式审计】合约代码：[粘贴]\n列出风险等级排序的问题与修复思路（不含投资建议）。', '[Informal review] Contract:\n\n[paste]\n\nRanked issues and fix ideas—not financial advice.'],
    ['terraform-module', 'Terraform 模块设计', 'Terraform module design', '变量、输出、环境分离。', 'Variables, outputs, environment separation.', '资源：[VPC+ECS/RDS] 环境：[dev/prod]\n写 Terraform 模块骨架：variables.tf、main.tf 要点、outputs、README 用法。', 'Resources: [VPC+ECS/RDS] Envs: [dev/prod]\nModule skeleton: variables, main highlights, outputs, usage README.'],
    ['prompt-to-code', '需求转接口代码', 'Requirements to API code', '从 PRD 片段生成 REST 路由骨架。', 'REST route skeleton from PRD snippet.', 'PRD 片段：[粘贴] 语言：[Go/Node]\n生成路由、handler 签名、请求/响应 struct、待办 TODO 注释。', 'PRD excerpt: [paste] Language: [Go/Node]\nRoutes, handler stubs, request/response types, TODO comments.'],
    ['css-layout', '复杂 CSS 布局', 'Complex CSS layout', 'Grid/Flex 实现设计稿还原。', 'Grid/Flex to match design spec.', '设计描述：[三栏/仪表盘] 响应式断点：[768/1024]\n写 HTML+CSS（或 Tailwind）实现，说明布局策略。', 'Layout: [3-col/dashboard] Breakpoints: [768/1024]\nHTML+CSS or Tailwind with layout explanation.'],
    ['algorithm-explain', '算法思路讲解', 'Algorithm walkthrough', '图解复杂度与边界条件。', 'Illustrated complexity and edge cases.', '算法题：[粘贴题目] 我的思路：[粘贴]\n评估复杂度，指出边界 case，给出更优解法伪代码。', 'Problem: [paste] My approach: [paste]\nComplexity, edge cases, better pseudocode.'],
    ['monorepo-setup', 'Monorepo 工作区配置', 'Monorepo workspace setup', 'pnpm/turbo 脚本与包边界。', 'pnpm/turbo scripts and package boundaries.', '包结构：[app+ui+utils] 工具：[pnpm+turbo]\n输出 workspace 配置、turbo pipeline、共享 tsconfig 策略。', 'Packages: [app+ui+utils] Tools: [pnpm+turbo]\nWorkspace config, turbo pipeline, shared tsconfig strategy.'],
    ['websocket-chat', 'WebSocket 聊天室', 'WebSocket chat room', '连接管理、广播、心跳。', 'Connection management, broadcast, heartbeat.', '栈：[Node+ws / Socket.io]\n实现聊天室核心代码：连接、房间、消息广播、断线重连注释。', 'Stack: [Node+ws / Socket.io]\nCore chat: connect, rooms, broadcast, reconnect notes.'],
    ['csv-etl', 'CSV ETL 脚本', 'CSV ETL script', '大文件流式处理与错误行隔离。', 'Streaming large CSV with bad-row quarantine.', '输入格式：[描述] 输出：[Parquet/DB]\n写 Python 流式 ETL：校验、错误行写 side file、统计报告。', 'Input: [describe] Output: [Parquet/DB]\nPython streaming ETL with validation and error side file.'],
    ['ios-swiftui', 'SwiftUI 视图生成', 'SwiftUI view generator', '声明式 UI 与预览数据。', 'Declarative UI with preview data.', '界面：[列表+详情] 数据模型：[填写]\n输出 SwiftUI View + Model + PreviewProvider 示例。', 'UI: [list+detail] Model: [fill]\nSwiftUI view, model, preview sample.'],
    ['code-comment', '遗留代码注释补全', 'Legacy code commenter', '解释意图而非复述语法。', 'Explain intent, not syntax paraphrase.', '为以下代码补充模块级说明、函数 docstring、复杂逻辑行内注释：\n\n```\n[粘贴]\n```', 'Add module overview, function docstrings, inline comments for tricky logic:\n\n```\n[paste]\n```'],
    ['openapi-mock', 'OpenAPI Mock 服务', 'OpenAPI mock server', '从 spec 生 mock 路由与示例响应。', 'Mock routes and sample responses from spec.', 'OpenAPI 片段：[粘贴]\n列出 mock 端点、示例 JSON、可用来前端联调的说明。', 'OpenAPI excerpt: [paste]\nMock endpoints, sample JSON, frontend integration notes.']
  ],
  image: [
    ['mj-icon-set', 'MJ 图标套装', 'MJ icon set', '统一风格的 UI 图标组。', 'Consistent UI icon set style.', 'flat icon set for [主题], rounded corners, 2px stroke, pastel palette, grid layout, app UI design --ar 1:1 --v 6', 'flat icon set for [topic], rounded corners, 2px stroke, pastel palette, grid layout, app UI design --ar 1:1 --v 6'],
    ['mj-poster', 'MJ 电影海报', 'MJ movie poster', '片名区留白、强烈明暗对比。', 'Title safe area, strong contrast.', 'movie poster, [片名/类型], cinematic lighting, dramatic composition, title space at top, grain texture --ar 2:3 --v 6 --style raw', 'movie poster, [title/genre], cinematic lighting, dramatic composition, title space at top, grain texture --ar 2:3 --v 6 --style raw'],
    ['mj-fashion', 'MJ 时尚 editorial', 'MJ fashion editorial', '杂志风构图与大胆配色。', 'Editorial layout and bold color.', 'high fashion editorial, [模特/服装], studio lighting, Vogue style, dynamic pose, color blocking --ar 3:4 --v 6', 'high fashion editorial, [model/outfit], studio lighting, Vogue style, dynamic pose, color blocking --ar 3:4 --v 6'],
    ['mj-isometric', 'MJ 2.5D 等距插画', 'MJ isometric illustration', 'SaaS 仪表盘或城市场景。', 'SaaS dashboard or city scene.', 'isometric illustration, [SaaS dashboard / smart city], clean vectors, soft shadows, tech blue palette --ar 16:9 --v 6', 'isometric illustration, [SaaS dashboard / smart city], clean vectors, soft shadows, tech blue palette --ar 16:9 --v 6'],
    ['mj-watercolor', 'MJ 水彩插画', 'MJ watercolor art', '柔和晕染、纸质纹理。', 'Soft washes and paper texture.', 'watercolor illustration of [主题], wet on wet, paper texture, gentle colors, children book style --ar 4:3 --v 6', 'watercolor illustration of [subject], wet on wet, paper texture, gentle colors, children book style --ar 4:3 --v 6'],
    ['mj-cyberpunk', 'MJ 赛博朋克街景', 'MJ cyberpunk street', '霓虹雨夜、反射路面。', 'Neon rain night with reflections.', 'cyberpunk street at night, neon signs, rain reflections, holographic ads, moody atmosphere --ar 21:9 --v 6', 'cyberpunk street at night, neon signs, rain reflections, holographic ads, moody atmosphere --ar 21:9 --v 6'],
    ['sd-architecture', 'SD 建筑效果图', 'SD architecture render', '现代立面、蓝天环境光。', 'Modern facade, daylight sky.', 'modern architecture exterior, [建筑类型], glass facade, blue sky, architectural visualization, photoreal --ar 16:9', 'modern architecture exterior, [building type], glass facade, blue sky, architectural visualization, photoreal --ar 16:9'],
    ['sd-fantasy', 'SD 奇幻场景', 'SD fantasy scene', '史诗尺度、魔法光效。', 'Epic scale with magical lighting.', 'epic fantasy landscape, [城堡/森林], magical glow, volumetric light, detailed environment, concept art style', 'epic fantasy landscape, [castle/forest], magical glow, volumetric light, detailed environment, concept art style'],
    ['sd-sticker', 'SD 贴纸素材', 'SD sticker assets', '白底描边、可爱 Q 版。', 'White outline, cute chibi style.', 'cute chibi sticker, [角色], thick white outline, simple shading, transparent background style, kawaii', 'cute chibi sticker, [character], thick white outline, simple shading, transparent background style, kawaii'],
    ['sd-vintage', 'SD 复古海报', 'SD vintage poster', '丝网印刷、有限色板。', 'Screen print limited palette.', 'vintage travel poster, [目的地], limited color palette, screen print texture, retro typography layout --ar 3:4', 'vintage travel poster, [destination], limited color palette, screen print texture, retro typography layout --ar 3:4'],
    ['mj-pet-portrait', 'MJ 宠物肖像', 'MJ pet portrait', '影棚光、表情生动。', 'Studio light, expressive face.', 'professional pet portrait, [品种], studio lighting, shallow depth of field, happy expression --ar 4:5 --v 6', 'professional pet portrait, [breed], studio lighting, shallow depth of field, happy expression --ar 4:5 --v 6'],
    ['mj-ui-mockup', 'MJ UI  mockup', 'MJ UI mockup', '手机壳+真实界面占位。', 'Phone frame with realistic UI placeholder.', 'mobile app UI mockup on iPhone, [金融/社交] app, clean interface, soft shadow, presentation mockup --ar 9:16 --v 6', 'mobile app UI mockup on iPhone, [finance/social] app, clean interface, soft shadow, presentation mockup --ar 9:16 --v 6'],
    ['sd-macro', 'SD 微距摄影', 'SD macro photography', '露珠、纹理细节极致。', 'Dewdrops and extreme texture detail.', 'macro photography, [花/昆虫], dewdrops, extreme detail, soft bokeh background, natural light', 'macro photography, [flower/insect], dewdrops, extreme detail, soft bokeh background, natural light'],
    ['mj-book-cover', 'MJ 书籍封面', 'MJ book cover', '类型化构图（悬疑/言情/科幻）。', 'Genre-coded composition.', 'book cover design, [类型] novel, central symbol, typography space, atmospheric --ar 2:3 --v 6', 'book cover design, [genre] novel, central symbol, typography space, atmospheric --ar 2:3 --v 6'],
    ['sd-scifi', 'SD 科幻机甲', 'SD sci-fi mecha', '金属磨损、动态姿态。', 'Worn metal, dynamic pose.', 'sci-fi mecha, battle worn metal, dynamic pose, industrial background, detailed mechanical parts, cinematic', 'sci-fi mecha, battle worn metal, dynamic pose, industrial background, detailed mechanical parts, cinematic'],
    ['mj-wedding', 'MJ 婚礼摄影风', 'MJ wedding photo style', '柔焦、逆光、浪漫色调。', 'Soft focus, backlight, romantic tones.', 'wedding photography, couple in [场景], golden hour backlight, soft pastel tones, romantic --ar 3:2 --v 6', 'wedding photography, couple in [scene], golden hour backlight, soft pastel tones, romantic --ar 3:2 --v 6'],
    ['sd-noir', 'SD 黑色电影', 'SD film noir', '高对比黑白、阴影构图。', 'High-contrast noir shadows.', 'film noir scene, [侦探/雨巷], high contrast black and white, dramatic shadows, 1940s atmosphere', 'film noir scene, [detective/alley], high contrast black and white, dramatic shadows, 1940s atmosphere'],
    ['mj-pattern', 'MJ 无缝图案', 'MJ seamless pattern', '平铺纹理、品牌延展。', 'Tileable texture for brand extension.', 'seamless pattern, [花卉/几何], tileable, brand packaging style, soft colors --tile --v 6', 'seamless pattern, [floral/geometric], tileable, brand packaging style, soft colors --tile --v 6'],
    ['sd-hdr-sky', 'SD 风光 HDR 天空', 'SD landscape HDR sky', '替换天空、自然饱和。', 'Sky replacement, natural saturation.', 'landscape photo, [山脉/海岸], dramatic HDR sky, natural colors, wide angle, sharp foreground', 'landscape photo, [mountains/coast], dramatic HDR sky, natural colors, wide angle, sharp foreground'],
    ['mj-ink', 'MJ 水墨国风', 'MJ Chinese ink style', '留白、泼墨、山水意境。', 'Negative space, ink wash landscape mood.', 'traditional Chinese ink painting, [山水/梅兰竹菊], minimalist negative space, brush texture --ar 3:4 --v 6', 'traditional Chinese ink painting, [landscape/plants], minimalist negative space, brush texture --ar 3:4 --v 6']
  ],
  marketing: [
    ['funnel-copy', '转化漏斗文案', 'Conversion funnel copy', '认知-兴趣-决策各阶段话术。', 'Awareness-interest-decision stage copy.', '产品：[填写] 漏斗阶段：[投放页/注册/付费]\n写各阶段 headline + 3条bullet + CTA 按钮文案。', 'Product: [fill] Stage: [landing/signup/pay]\nHeadlines, 3 bullets, CTA per funnel stage.'],
    ['retargeting-ad', '再营销广告文案', 'Retargeting ad copy', '提醒未完成动作，降低压迫感。', 'Remind abandoned action without pressure.', '用户行为：[加购未付/试用到期]\n写 3 条再营销文案（不同心理触发：稀缺/利益/社交证明）。', 'Behavior: [cart abandon/trial end]\n3 retargeting ads: scarcity, benefit, social proof.'],
    ['crm-sms', '短信营销模板', 'SMS marketing templates', '70字内清晰 CTA，合规退订提示。', 'Clear CTA under 70 chars with opt-out.', '活动：[促销/预约提醒] 品牌：[填写]\n写 5 条短信模板（含退订说明占位），标注发送场景。', 'Campaign: [promo/reminder] Brand: [fill]\n5 SMS templates with opt-out placeholder and use case.'],
    ['b2b-case-study', 'B2B 客户案例', 'B2B case study', '挑战-方案-结果量化三部曲。', 'Challenge-solution-quantified results.', '客户行业：[填写] 使用产品：[填写] 成果数据：[填写]\n写案例研究：标题、摘要、三节正文、客户引语占位。', 'Industry: [fill] Product: [fill] Results: [metrics]\nCase study with title, summary, 3 sections, quote placeholder.'],
    ['community-plan', '社群运营日历', 'Community content calendar', '一周话题与互动玩法。', 'Weekly topics and engagement mechanics.', '社群：[微信/Discord] 目标：[活跃/转化]\n输出 7 天运营日历：话题、互动形式、UGC 引导、管理员话术。', 'Community: [WeChat/Discord] Goal: [engagement/conversion]\n7-day calendar: topics, formats, UGC prompts, mod scripts.'],
    ['pitch-onepager', '融资一页纸', 'Investor one-pager', '问题、方案、市场、牵引力一页呈现。', 'Problem, solution, market, traction on one page.', '创业项目：[填写] 数据：[MRR/用户增长]\n写投资人一页纸结构：每块 2–3 句，附视觉建议（图表类型）。', 'Startup: [fill] Metrics: [MRR/growth]\nOne-pager sections with 2–3 sentences each and chart suggestions.'],
    ['referral-program', '裂变活动规则', 'Referral program copy', '邀请奖励与规则清晰可执行。', 'Clear invite rewards and rules.', '产品：[填写] 奖励：[双方各得X]\n写活动规则页：参与方式、奖励发放、限制条款、FAQ 5条。', 'Product: [fill] Reward: [both get X]\nRules page: how to join, payout, limits, 5 FAQs.'],
    ['webinar-invite', '线上研讨会邀请', 'Webinar invitation', '痛点+嘉宾亮点+议程 bullet。', 'Pain point, speaker highlights, agenda bullets.', '主题：[填写] 嘉宾：[填写] 时间：[填写]\n写邀请邮件：主题行、痛点段、议程、注册 CTA。', 'Topic: [fill] Speakers: [fill] Time: [fill]\nInvite email: subject, pain intro, agenda, register CTA.'],
    ['churn-email', '流失召回邮件', 'Win-back email', '承认距离、提供回归理由。', 'Acknowledge absence, give reason to return.', '产品：[SaaS/订阅] 流失原因假设：[价格/未用]\n写 3 封召回邮件序列（轻-中-强优惠梯度）。', 'Product: [SaaS] Churn reason: [price/no use]\n3 win-back emails with escalating offers.'],
    ['product-launch', '新品发布清单', 'Product launch checklist', '预热-发布-延续全渠道文案包。', 'Tease-launch-sustain omni-channel copy pack.', '新品：[填写] 发布日：[填写]\n输出 T-7 到 T+3 每日社媒/邮件主题与核心信息点。', 'Product: [fill] Launch date: [fill]\nDaily themes and key messages from T-7 to T+3.'],
    ['survey-copy', '问卷邀请文案', 'Survey invitation copy', '降低填写成本，强调反馈价值。', 'Low friction, emphasize feedback value.', '调研目的：[NPS/功能优先级] 奖励：[可选]\n写邀请语：邮件+弹窗两版，预计耗时说明。', 'Goal: [NPS/prioritization] Reward: [optional]\nEmail + modal invite with time estimate.'],
    ['affiliate-guide', '联盟推广话术', 'Affiliate talking points', '合规披露+核心卖点话术卡。', 'Disclosure-compliant talking points card.', '佣金产品：[填写] 受众：[博主类型]\n给推广者：披露句模板、3条卖点、禁用承诺清单。', 'Product: [fill] Affiliates: [creator type]\nDisclosure template, 3 talking points, banned claims list.'],
    ['holiday-campaign', '节日营销方案', 'Holiday campaign plan', '主题创意+折扣机制+视觉方向。', 'Theme, offer mechanics, visual direction.', '节日：[双11/圣诞] 品类：[填写]\n方案：主题 slogan、促销机制、3个视觉参考描述、风险合规提示。', 'Holiday: [11.11/Xmas] Category: [fill]\nSlogan, promo mechanics, 3 visual briefs, compliance notes.'],
    ['manifesto', '品牌宣言撰写', 'Brand manifesto', '情绪共鸣与立场表达。', 'Emotional resonance and stance.', '品牌价值观：[3条] 反对什么：[填写]\n写 400 字品牌宣言，适合官网 About 与视频旁白。', 'Values: [3] What we oppose: [fill]\n400-word manifesto for About page and VO.'],
    ['comparison-lp', '竞品对比落地页', 'Competitor comparison LP', '公正对比表+迁移指南。', 'Fair comparison table plus migration guide.', '我方 vs 竞品：[填写]\n写对比页：维度表、诚实局限、迁移步骤 3 步、CTA。', 'Us vs competitor: [fill]\nComparison page: table, honest limits, 3 migration steps, CTA.'],
    ['ugc-brief', 'UGC 拍摄 Brief', 'UGC shooting brief', '镜头清单与必提卖点。', 'Shot list and must-mention USPs.', '平台：[TikTok/小红书] 时长：[30s]\n给创作者的 Brief：镜头表、台词要点、禁忌、交付规格。', 'Platform: [TikTok] Length: [30s]\nCreator brief: shot list, script beats, don\'ts, deliverable specs.'],
    ['pricing-page', '定价页文案', 'Pricing page copy', '套餐差异一眼看懂，减少选择焦虑。', 'Clear plan differences, less choice anxiety.', '三档套餐：[基础/Pro/企业] 差异：[填写]\n写定价页：每档一句话定位、功能对比表文案、FAQ 针对价格异议。', 'Tiers: [basic/pro/enterprise] Differences: [fill]\nOne-liner per tier, comparison copy, pricing objection FAQs.'],
    ['web-copy-hero', '官网首屏文案', 'Website hero copy', '价值主张+副标题+双 CTA。', 'Value prop, subhead, dual CTAs.', '产品：[填写] ICP：[填写]\n首屏：H1、副标题、主/次 CTA、信任徽章文案建议（3个）。', 'Product: [fill] ICP: [fill]\nHero H1, subhead, primary/secondary CTA, 3 trust badge lines.'],
    ['app-store', '应用商店描述', 'App Store description', '关键词前置、截图说明文案。', 'Keywords front-loaded, screenshot captions.', 'App：[填写] 核心功能：[3条]\n写商店描述（短/长）、副标题、关键词列表、5张截图说明文案。', 'App: [fill] Features: [3]\nShort/long description, subtitle, keywords, 5 screenshot captions.'],
    ['partner-co-marketing', '联合营销提案', 'Co-marketing proposal', '双方受众契合点与资源交换。', 'Audience fit and resource exchange.', '合作品牌：[填写] 目标：[曝光/获客]\n提案大纲：合作理由、活动形式、分工、KPI、时间线。', 'Partner: [fill] Goal: [awareness/leads]\nProposal: rationale, format, responsibilities, KPIs, timeline.']
  ],
  education: [
    ['concept-map', '概念图生成', 'Concept map generator', '核心概念与关系连线。', 'Core concepts and relationship links.', '课程主题：[填写] 范围：[一章/整课]\n输出概念图（文本版）：节点、层级、关系动词标注。', 'Topic: [fill] Scope: [chapter/course]\nText concept map: nodes, levels, labeled relations.'],
    ['rubric-grader', '作业 Rubric 评分', 'Assignment rubric grading', '按量规给分与改进反馈。', 'Score against rubric with feedback.', 'Rubric：[粘贴] 学生作业：[粘贴]\n按维度打分（1-5）、证据引用、改进建议各 2 条。', 'Rubric: [paste] Submission: [paste]\nScores 1-5 per dimension, evidence quotes, 2 improvements each.'],
    ['curriculum-map', '课程对标矩阵', 'Curriculum alignment matrix', '知识点覆盖国标/考纲。', 'Map topics to standards/exam syllabus.', '课程标准：[粘贴摘要] 现有大纲：[粘贴]\n输出对标矩阵：知识点、覆盖度、缺口、补充建议。', 'Standards: [paste] Syllabus: [paste]\nAlignment matrix: topic, coverage, gaps, supplements.'],
    ['lab-report', '实验报告模板', 'Lab report template', '假设-方法-数据-结论规范结构。', 'Hypothesis-methods-data-conclusion structure.', '实验名称：[填写] 数据：[粘贴]\n生成完整实验报告框架，图表说明占位，误差分析提示。', 'Lab: [fill] Data: [paste]\nFull report skeleton, figure captions, error analysis prompts.'],
    ['parent-letter', '家校沟通信', 'Parent communication letter', '客观反馈+合作建议。', 'Objective feedback plus collaboration tips.', '学生情况：[填写] 事件：[期中/行为]\n写致家长信：事实描述、积极面、建议家庭配合点，语气尊重。', 'Student: [fill] Context: [midterm/behavior]\nLetter to parents: facts, positives, home collaboration tips, respectful tone.'],
    ['special-needs', '差异化教学建议', 'Differentiated instruction tips', '多水平学生活动分层。', 'Tiered activities for mixed levels.', '班级情况：[水平差异描述] 课题：[填写]\n给同一目标设计基础/拓展/挑战三版活动与评估方式。', 'Class profile: [fill] Lesson: [fill]\nThree activity tiers (basic/extended/challenge) and assessments.'],
    ['history-timeline', '历史时间轴梳理', 'History timeline organizer', '因果链与关键人物并列。', 'Causal chain with key figures.', '时期：[唐宋/二战] 范围：[中国/世界]\n输出时间轴（≥15节点）：事件、原因、影响、关联人物。', 'Era: [fill] Scope: [fill]\nTimeline (≥15 nodes): event, cause, effect, figures.'],
    ['coding-homework', '编程作业提示', 'Coding homework hints', '苏格拉底式提示不直接给代码。', 'Socratic hints without full code giveaway.', '题目：[粘贴] 学生卡点：[粘贴]\n给 3 条递进提示（不要完整答案），最后给测试思路。', 'Problem: [paste] Stuck at: [paste]\n3 escalating hints, no full solution; test strategy at end.'],
    ['science-analogy', '科学概念类比', 'Science concept analogies', '用日常经验解释抽象理论。', 'Everyday analogies for abstract theory.', '概念：[量子/进化/电路]\n给 3 个生活类比、常见误解纠正、课堂提问 5 个。', 'Concept: [fill]\n3 analogies, misconception fixes, 5 classroom questions.'],
    ['debate-prep', '辩论备赛资料', 'Debate prep brief', '论点、证据、反驳预案。', 'Arguments, evidence, rebuttal prep.', '辩题：[填写] 立场：[正/反]\n备赛包：定义、3论点+证据来源类型、预判反驳与回应。', 'Motion: [fill] Side: [pro/con]\nDefinitions, 3 args with evidence types, predicted rebuttals.'],
    ['vocab-builder', '词汇记忆故事法', 'Vocabulary story method', '词根联想+情境句。', 'Root mnemonics plus context sentences.', '单词列表：[10个]\n每个词：词根拆解、联想故事、例句、易混词辨析。', 'Word list: [10 words]\nPer word: roots, memory story, example sentence, confusables.'],
    ['thesis-outline', '学位论文提纲', 'Thesis outline builder', '章节逻辑与文献占位。', 'Chapter logic with literature placeholders.', '题目：[填写] 方法：[定量/定性]\n输出章节目录、每章 3 要点、需补充的文献类型。', 'Title: [fill] Method: [quant/qual]\nChapter TOC, 3 bullets per chapter, literature types needed.'],
    ['museum-guide', '博物馆研学手册', 'Museum study guide', '观察问题+延伸阅读。', 'Observation prompts plus further reading.', '展览主题：[填写] 学段：[初中/高中]\n研学手册：行前 3 问题、参观观察表、行后反思、延伸阅读 5 本。', 'Exhibit: [fill] Level: [middle/high school]\nPre/during/post visit questions, observation sheet, 5 readings.'],
    ['music-theory', '乐理知识讲解', 'Music theory explainer', '由浅入深+听觉描述提示。', 'Progressive depth with listening cues.', '主题：[和弦/节奏/调式]\n讲解文稿：定义、示例（描述听觉感受）、练习 3 题。', 'Topic: [chords/rhythm/modes]\nScript: definition, listening descriptions, 3 exercises.'],
    ['art-critique', '艺术作品_critique', 'Art critique framework', '形式-内容-语境三维分析。', 'Form-content-context analysis.', '作品：[画/摄影/装置] 背景：[可选]\n按形式、符号内容、历史语境写 critique（500字），结尾开放问题 2 个。', 'Work: [fill] Context: [optional]\n500-word critique: form, content, context; 2 open questions.'],
    ['study-schedule', '考研复习计划', 'Exam study planner', '科目权重+番茄钟排期。', 'Subject weights plus pomodoro schedule.', '目标考试：[考研/雅思] 剩余周数：[填写] 薄弱科：[填写]\n输出 4 周计划表：每日科目块、复习/练习比、周末模考安排。', 'Exam: [fill] Weeks left: [fill] Weak subjects: [fill]\n4-week schedule: daily blocks, review/practice ratio, mock exams.'],
    ['peer-review', '同伴互评引导', 'Peer review guide', '建设性反馈模板。', 'Constructive feedback template.', '作业类型：[论文/设计]\n给学生互评表：优点 2 条（具体）、问题 2 条、建议 1 条，语气示范。', 'Assignment: [essay/design]\nPeer review form: 2 strengths, 2 issues, 1 suggestion, tone examples.'],
    ['inclusive-lang', '包容性课堂用语', 'Inclusive classroom language', '中立、尊重多样性的示范。', 'Neutral, respectful diverse examples.', '情境：[点名/反馈/分组]\n改写以下表述为包容性版本 10 条，并说明原则。', 'Context: [roll call/feedback/groups]\nRewrite 10 phrases inclusively with principles explained.'],
    ['steam-project', 'STEAM 项目设计', 'STEAM project design', '跨学科目标与评估标准。', 'Interdisciplinary goals and rubric.', '年级：[填写] 主题：[可再生能源等]\nSTEAM 项目： driving question、活动 4 步、材料、评估 rubric。', 'Grade: [fill] Theme: [renewable energy etc.]\nDriving question, 4 activities, materials, assessment rubric.'],
    ['oral-exam', '口试答辩模拟', 'Oral exam simulator', '考官追问链与应答要点。', 'Examiner follow-ups and answer keys.', '论文摘要：[粘贴]\n模拟 10 个口试问题（含追问），每题给应答要点与常见失误。', 'Abstract: [paste]\n10 oral exam questions with follow-ups, answer keys, common mistakes.']
  ],
  business: [
    ['okr-cascade', 'OKR 向下拆解', 'OKR cascade breakdown', '公司到团队对齐检查。', 'Company-to-team alignment check.', '公司 O：[填写] 团队：[填写]\n拆解 Team KR，检查对齐度、重叠与缺口，标红风险 KR。', 'Company O: [fill] Team: [fill]\nTeam KRs, alignment check, overlaps, gaps, risk flags.'],
    ['market-sizing', '市场规模测算 TAM', 'Market sizing TAM/SAM/SOM', '自上而下与自下而上交叉验证。', 'Top-down and bottom-up cross-check.', '行业：[填写] 地区：[填写] 商业模式：[填写]\n估算 TAM/SAM/SOM，列假设、数据来源建议、敏感性分析。', 'Industry: [fill] Region: [fill] Model: [fill]\nTAM/SAM/SOM with assumptions, data sources, sensitivity.'],
    ['vendor-rfp', '供应商 RFP 提纲', 'Vendor RFP outline', '需求、评分权重、SLA 条款。', 'Requirements, scoring weights, SLA clauses.', '采购类别：[云服务/营销代理] 预算：[填写]\nRFP 目录：需求说明、评分表、SLA、交付里程碑、保密条款要点。', 'Category: [cloud/agency] Budget: [fill]\nRFP sections: requirements, scorecard, SLA, milestones, NDA points.'],
    ['board-deck', '董事会汇报提纲', 'Board deck outline', '财务+战略+风险一页摘要。', 'Finance, strategy, risk one-page summary.', '本季亮点：[数据] 风险：[填写]\n董事会 8 页提纲：每页标题、3 bullet、需准备的图表类型。', 'Highlights: [metrics] Risks: [fill]\n8-slide board outline: title, 3 bullets, chart type per slide.'],
    ['process-map', '业务流程梳理', 'Business process mapping', '泳道图步骤与瓶颈标注。', 'Swimlane steps with bottleneck flags.', '流程：[订单履约/客服] 参与角色：[填写]\n输出泳道图（文本版）：步骤、责任人、系统、瓶颈与改进建议。', 'Process: [order/support] Roles: [fill]\nText swimlane: steps, owners, systems, bottlenecks, improvements.'],
    ['change-mgmt', '变革沟通计划', 'Change management comms', '利益相关方分层沟通节奏。', 'Stakeholder-tiered communication cadence.', '变革内容：[系统上线/组织调整] 影响人群：[填写]\n沟通计划：对象、信息、渠道、时间线、FAQ 预判 5 条。', 'Change: [system/reorg] Stakeholders: [fill]\nComms plan: audience, message, channel, timeline, 5 FAQs.'],
    ['roi-calculator', 'ROI 测算说明', 'ROI calculation narrative', '成本项、收益项、回收期假设。', 'Cost/benefit items and payback assumptions.', '项目：[填写] 投入：[填写] 预期收益：[填写]\n写 ROI 说明：公式、假设表、乐观/基准/悲观三情景。', 'Project: [fill] Investment: [fill] Benefits: [fill]\nROI narrative: formula, assumptions, best/base/worst cases.'],
    ['partnership-term', '合作协议要点', 'Partnership term sheet', '分成、 exclusivity、退出条款框架。', 'Revenue share, exclusivity, exit framework.', '合作类型：[渠道/联名] 双方资源：[填写]\n term sheet 要点：目标、分工、分成、排他、期限、终止条件（非法律意见）。', 'Type: [channel/co-brand] Resources: [fill]\nTerm sheet bullets: goals, roles, split, exclusivity, term, termination—not legal advice.'],
    ['cs-playbook', '客服话术手册', 'CS playbook scripts', '共情-解决-确认三步模板。', 'Empathize-solve-confirm templates.', '场景：[退款/延迟发货/投诉]\n每场景：开场共情句、解决步骤、升级条件、结束确认句。', 'Scenarios: [refund/delay/complaint]\nPer scenario: empathy opener, resolution steps, escalation, closing confirm.'],
    ['inventory-policy', '库存策略建议', 'Inventory policy advice', '安全库存与补货点公式说明。', 'Safety stock and reorder point formulas.', 'SKU 特征：[快消/长尾] Lead time：[填写]\n建议安全库存公式、补货点计算示例、缺货风险说明。', 'SKU: [fast/long tail] Lead time: [fill]\nSafety stock formula, reorder point example, stockout risk notes.'],
    ['brand-perception', '品牌认知调研分析', 'Brand perception analysis', '问卷开放题归类与洞察。', 'Code open survey responses into insights.', '开放题回答：[粘贴多条]\n归类主题、情感倾向、top 3 洞察、建议行动。', 'Open responses: [paste]\nThemes, sentiment, top 3 insights, recommended actions.'],
    ['esg-report', 'ESG 披露段落', 'ESG disclosure draft', '环境-社会-治理指标叙述。', 'E-S-G metrics narrative.', '行业：[制造/互联网] 已有数据：[填写]\n起草 ESG 报告三节草稿（各200字）与待收集 KPI 清单。', 'Industry: [fill] Data on hand: [fill]\n200-word drafts per E/S/G pillar plus KPI gap list.'],
    ['sales-forecast', '销售预测复盘', 'Sales forecast review', '漏斗阶段转化率诊断。', 'Funnel stage conversion diagnosis.', 'CRM 漏斗数据：[粘贴] 目标：[填写]\n分析阶段转化率、偏差原因、下月预测调整建议。', 'Funnel data: [paste] Target: [fill]\nConversion analysis, variance causes, next-month forecast adjustments.'],
    ['workshop-facilitate', '战略研讨会引导', 'Strategy workshop facilitation', '议程、分组讨论题、收敛方法。', 'Agenda, breakouts, convergence method.', '目标：[三年战略/痛点排序] 时长：[半天]\n研讨会议程：开场、2个分组题、投票收敛、总结模板。', 'Goal: [3-year strategy/prioritization] Length: [half day]\nAgenda: opening, 2 breakouts, voting convergence, summary template.'],
    ['ip-licensing', 'IP 授权商务邮件', 'IP licensing outreach', '合作意向与条款试探。', 'Partnership intent and term feelers.', 'IP 类型：[形象/专利/内容] 目标公司：[填写]\n写商务探询邮件：价值主张、合作形式选项、非约束性意向表述。', 'IP: [character/patent/content] Target co: [fill]\nOutreach email: value, deal structure options, non-binding language.'],
    ['crisis-comms', '危机公关声明', 'Crisis statement draft', '事实-责任-行动三步。', 'Facts-accountability-action structure.', '事件摘要：[填写] 已知事实：[填写]\n起草对外声明草稿（非法律意见）：致歉边界、已采取行动、后续跟进渠道。', 'Incident: [fill] Known facts: [fill]\nExternal statement draft—not legal advice: facts, accountability, actions, updates channel.'],
    ['unit-economics', '单体经济模型', 'Unit economics model', 'CAC、LTV、毛利拆解。', 'CAC, LTV, gross margin breakdown.', '业务：[订阅/交易] 数据：[粘贴]\n拆解 unit economics，标注关键假设，给健康度判断与优化杠杆 3 条。', 'Business: [subscription/transaction] Data: [paste]\nUnit economics breakdown, assumptions, health check, 3 levers.'],
    ['delegation-brief', '授权 briefing 模板', 'Delegation briefing template', '背景-目标-权限-验收标准。', 'Context-goal-authority-done criteria.', '任务：[填写] 委派给：[角色]\n写 briefing：背景、目标、决策权限边界、资源、验收标准、检查点时间。', 'Task: [fill] Delegatee: [role]\nBriefing: context, goal, authority limits, resources, done criteria, checkpoints.'],
    ['postmortem', '项目复盘报告', 'Project postmortem', '时间线、根因、改进项 owner。', 'Timeline, root causes, action owners.', '项目：[填写] 结果：[成功/延期]\n复盘：时间线、5 whys 根因、做得好的 3 条、改进项 5 条（含 owner）。', 'Project: [fill] Outcome: [success/delay]\nTimeline, 5 whys, 3 wins, 5 action items with owners.'],
    ['tax-prep-notes', '税务沟通备忘', 'Tax prep memo', '整理问题清单给顾问（非税务建议）。', 'Question list for advisor—not tax advice.', '【非税务建议】业务变化：[填写] 票据情况：[填写]\n整理给税务顾问的问题清单 10 条与材料准备列表。', '[Not tax advice] Business changes: [fill] Documents: [fill]\n10 questions for tax advisor plus document prep list.']
  ],
  roleplay: [
    ['rp-doctor-demo', '全科医生问诊（演示）', 'GP intake (demo)', '病史采集结构，非诊断。', 'Structured history—not diagnosis.', '【演示非诊疗】扮演全科医生，按 OPQRST 询问主诉 [填写]，总结需进一步检查项，建议就医。', '[Demo not medical] Play GP using OPQRST for chief complaint [fill], summarize workup needs, urge real care.'],
    ['rp-sales-coach', '销售教练对练', 'Sales coach roleplay', '异议处理与成交试探。', 'Objection handling and closing trials.', '产品：[填写] 客户类型：[填写]\n扮演挑剔客户提出 5 个异议，在我回应后给改进反馈与下一句话术建议。', 'Product: [fill] Buyer: [fill]\nPlay tough buyer with 5 objections; after my replies, coach me with better lines.'],
    ['rp-negotiation', '商务谈判模拟', 'Business negotiation sim', 'BATNA、让步阶梯演练。', 'BATNA and concession ladder practice.', '场景：[采购合同] 我方底线：[填写] 对方诉求：[填写]\n扮演对方谈判代表 3 轮，之后点评我的 BATNA 使用与让步顺序。', 'Scenario: [procurement] Our floor: [fill] Their ask: [fill]\nPlay counterpart for 3 rounds, then review BATNA and concessions.'],
    ['rp-customer-angry', '愤怒客户安抚', 'Angry customer de-escalation', '倾听-共情-方案-跟进。', 'Listen-empathize-solve-follow-up.', '扮演愤怒客户，投诉 [物流损坏]。在我回复后评估共情与解决方案，给下一句话建议。', 'Play angry customer: [damaged shipment]. After my response, rate empathy and solution, suggest next line.'],
    ['rp-investor', '投资人拷问模拟', 'Investor grill simulation', '尖锐问题与数据追问。', 'Sharp questions and metric drills.', '扮演种子轮投资人，针对 [项目] 连问 12 个问题（市场、壁垒、单位经济、团队），最后给投资/not 理由。', 'Play seed investor: 12 hard questions on market, moat, unit economics, team; then invest/pass rationale.'],
    ['rp-teacher-parent', '班主任家访对话', 'Parent-teacher conference', '客观反馈+合作计划。', 'Objective feedback plus joint plan.', '扮演家长，孩子情况 [学习吃力]。进行 10 分钟对话模拟，结束时给沟通改进建议。', 'Play parent of struggling student; 10-minute conference sim; communication tips at end.'],
    ['rp-writer-editor', '杂志主编改稿', 'Magazine editor persona', '质疑逻辑与要求删减。', 'Challenge logic and demand cuts.', '扮演苛刻主编，对我的稿件 [粘贴摘要] 提出 5 条删改意见，并示范开头重写。', 'Play tough editor: 5 cuts on my draft summary [paste], rewrite opening example.'],
    ['rp-language-exchange', '语言交换伙伴', 'Language exchange partner', '纠正发音与地道表达。', 'Fix pronunciation and idioms.', '语言：[日语/法语] 水平：[中级]\n用目标语闲聊 5 轮，每轮纠正 1 处并教更地道说法。', 'Language: [JP/FR] Level: [intermediate]\n5-turn chat in target language; one correction and idiom per turn.'],
    ['rp-product-user', '用户访谈模拟', 'User interview simulation', '开放式问题与追问。', 'Open questions and follow-ups.', '扮演目标用户 [新手妈妈]，产品 [育儿App]。连问 8 个访谈问题并根据回答追问。', 'Play user [new parent] for [parenting app]; 8 interview questions with follow-ups.'],
    ['rp-mock-journalist', '媒体采访模拟', 'Media interview simulation', '尖锐与温和问题混合。', 'Mix of tough and soft questions.', '扮演记者，话题 [AI伦理]，10 个问题，含陷阱题，之后点评我的回答结构。', 'Play journalist on [AI ethics]: 10 questions including traps; critique answer structure.'],
    ['rp-union-talk', '劳资沟通代表', 'Labor dialogue representative', '诉求陈述与妥协方案。', 'Demands and compromise framing.', '扮演工会代表，诉求 [加薪8%]，进行 3 轮谈判对话，之后分析我方让步空间。', 'Play union rep asking [8% raise]; 3 negotiation rounds; analyze concession room.'],
    ['rp-mentor-tech', '技术导师 Code Review 对话', 'Tech mentor review chat', '引导思考而非直接改码。', 'Guide thinking, don’t patch directly.', '扮演资深导师，Review 我的 PR 思路 [描述]，只问引导问题，最后总结学习点 3 条。', 'Play senior mentor on my PR idea [describe]; guiding questions only; 3 learnings at end.'],
    ['rp-ethics-board', '伦理委员会陈述', 'Ethics board presentation', '风险收益与知情同意。', 'Risk-benefit and informed consent.', '扮演伦理委员，研究 [用户行为实验]，提问 8 个伦理问题，并给有条件通过意见。', 'Play ethics board on [behavior study]; 8 ethics questions; conditional approval feedback.'],
    ['rp-voice-acting', '配音导演指导', 'Voice director coaching', '情绪、停顿、重音标记。', 'Emotion, pauses, stress marks.', '扮演配音导演，台词 [粘贴]，指导 3 种情绪版本并标注重音与停顿符号。', 'Play VO director on lines [paste]; 3 emotional takes with stress/pause marks.'],
    ['rp-hotel-concierge', '酒店礼宾服务', 'Hotel concierge service', '推荐与预订话术优雅得体。', 'Polished recommendations and booking talk.', '扮演礼宾，客人需求 [纪念日晚餐+交通]，提供 2 套方案并处理特殊要求。', 'Play concierge for [anniversary dinner + transport]; 2 plans, handle special requests.'],
    ['rp-scrum-master', 'Scrum Master 引导', 'Scrum Master facilitation', '站会/复盘提问引导团队。', 'Standup/retro questions to guide team.', '扮演 Scrum Master，团队问题 [延期/冲突]，引导 retro 提问 6 个，不替团队下结论。', 'Play SM for [delay/conflict]; 6 retro questions without deciding for team.'],
    ['rp-pharma-rep', '医药代表学术拜访（演示）', 'Pharma rep academic visit (demo)', '学术资料呈现合规边界。', 'Academic presentation compliance bounds.', '【演示非医疗建议】扮演医生，听我介绍 [药物类别] 3 分钟，提出 5 个学术问题与合规关切。', '[Demo] Play physician; hear 3-min [drug class] pitch; 5 academic and compliance questions.'],
    ['rp-life-coach', '人生教练对话', 'Life coach conversation', 'GROW 模型提问。', 'GROW model questions.', '扮演人生教练，目标 [职业转型]，用 GROW 模型提问 8 个，不替我决定。', 'Play life coach for [career change]; 8 GROW questions; no decisions for me.'],
    ['rp-antique-appraiser', '古董鉴定师（娱乐）', 'Antique appraiser (entertainment)', '描述特征与可能年代。', 'Describe traits and possible era—not real appraisal.', '【娱乐】扮演鉴定师，物品 [描述]，说明观察要点、可能年代区间、需实物鉴定的声明。', '[Entertainment] Play appraiser on [item]; observation points, era range, need physical appraisal disclaimer.'],
    ['rp-crisis-hotline', '心理热线倾听（演示）', 'Crisis line listening (demo)', '积极倾听，危机升级协议。', 'Active listening, escalation protocol.', '【演示非危机服务】扮演来电者 [轻度焦虑]，练习倾听 5 轮；若涉及自伤提示升级专业帮助脚本。', '[Demo not a hotline] Caller with [mild anxiety]; 5 listening turns; self-harm escalation script.']
  ],
  video: [
    ['vid-explainer', '产品 explainer 脚本', 'Product explainer script', '60秒问题-方案-演示结构。', '60s problem-solution-demo arc.', '产品：[填写] 受众：[非技术]\n写 60 秒 explainer：旁白+画面分镜（6镜），结尾 CTA。', 'Product: [fill] Audience: [non-technical]\n60s explainer VO + 6-shot storyboard, CTA end.'],
    ['vid-testimonial', '客户见证视频提纲', 'Customer testimonial outline', 'Before- after- 推荐三幕。', 'Before-after-recommend three acts.', '客户：[行业] 成果：[数据]\n见证片提纲：采访问题 6 个、B-roll 建议、金句剪辑点。', 'Customer: [industry] Results: [metrics]\nTestimonial: 6 interview questions, B-roll list, quote cut points.'],
    ['vid-training', '企业培训片脚本', 'Corporate training video script', '学习目标与场景演示结合。', 'Learning objectives plus scenario demos.', '培训主题：[信息安全] 时长：[5分钟]\n脚本：目标、3模块、情景剧对话、小测验插入点。', 'Topic: [security] Length: [5 min]\nScript: objectives, 3 modules, scenario dialogue, quiz checkpoints.'],
    ['vid-unboxing', '开箱视频节奏', 'Unboxing video pacing', '悬念-展示-体验-总结节拍。', 'Tease-reveal-experience-summary beats.', '产品：[填写] 平台：[B站/YouTube]\n开箱脚本：时间轴、特写镜头提示、口播要点、避广告法敏感词提示。', 'Product: [fill] Platform: [Bilibili/YouTube]\nUnboxing timeline, close-up cues, VO beats, compliance notes.'],
    ['vid-vlog-travel', '旅行 Vlog 叙事', 'Travel vlog narrative', 'Day in life 与转场钩子。', 'Day-in-life hooks and transitions.', '目的地：[填写] 时长：[8分钟]\nVlog 结构：开场钩子、3个高光片段、转场句、结尾反思。', 'Destination: [fill] Length: [8 min]\nVlog structure: hook, 3 highlights, transitions, closing reflection.'],
    ['vid-gaming-highlight', '游戏集锦解说', 'Gaming highlight commentary', '节奏剪辑点与梗解说。', 'Cut rhythm and meme commentary.', '游戏：[填写] 素材：[精彩击杀/搞笑]\n写 3 分钟集锦：解说词、字幕梗、BGM 情绪提示、剪辑节奏表。', 'Game: [fill] Clips: [highlights]\n3-min montage: commentary, meme captions, BGM mood, cut rhythm table.'],
    ['vid-webinar-trailer', '研讨会预告片', 'Webinar trailer script', '痛点+嘉宾+日期信息密度。', 'Pain, speakers, date in tight pack.', '研讨会：[主题] 嘉宾：[2人]\n30秒预告：分镜+旁白，信息清单核对表。', 'Webinar: [topic] Speakers: [2]\n30s trailer storyboard + VO, info checklist.'],
    ['vid-music-sync', '音乐卡点剪辑表', 'Music beat sync edit sheet', '鼓点与画面切换对齐。', 'Align cuts to drum hits.', '音乐风格：[电子/嘻哈] 镜头素材：[描述]\n输出卡点表：秒数|鼓点类型|画面|转场效果。', 'Music: [electronic/hip-hop] Footage: [describe]\nBeat sync table: time|beat type|visual|transition.'],
    ['vid-interview-broll', '人物访谈 B-roll 清单', 'Interview B-roll shot list', '象征画面与情绪补充。', 'Symbolic shots for emotional support.', '访谈主题：[创业者故事]\n列 15 个 B-roll 镜头建议（景别+含义），附提问备用 5 条。', 'Interview: [founder story]\n15 B-roll shots (framing + meaning), 5 backup questions.'],
    ['vid-safety-induction', '安全培训视频', 'Safety induction video', '规范演示+事故案例警示。', 'Procedure demo plus cautionary case.', '场景：[工厂/工地] 风险点：[填写]\n脚本：规范步骤演示、错误示范、案例旁白、测验 3 题。', 'Setting: [factory/site] Risks: [fill]\nScript: correct procedure, wrong demo, case narration, 3 quiz questions.'],
    ['vid-crowdfunding', '众筹视频脚本', 'Crowdfunding video script', '故事+原型+团队+回报层级。', 'Story, prototype, team, reward tiers.', '项目：[硬件/游戏] 目标金额：[填写]\n2–3分钟众筹片：情感故事线、产品演示段、团队字幕、CTA。', 'Project: [hardware/game] Goal: [fill]\n2–3 min crowdfunding arc: story, demo, team lower thirds, CTA.'],
    ['vid-asrm-style', '教程屏录旁白', 'Tutorial screencast VO', '步骤清晰、鼠标动作同步提示。', 'Clear steps synced to cursor actions.', '软件：[填写] 操作：[完成某任务]\n旁白稿按步骤编号，标注鼠标点击与等待时长提示。', 'Software: [fill] Task: [fill]\nNumbered VO with click markers and wait timing notes.'],
    ['vid-fashion-lookbook', '时尚 Lookbook 视频', 'Fashion lookbook video', '造型切换+节奏音乐建议。', 'Outfit changes plus music tempo tips.', '系列：[春夏] 造型数：[5套]\nLookbook 分镜：每套停留秒数、走位、转场、配乐 BPM 建议。', 'Collection: [SS] Looks: [5]\nShot list: seconds per look, movement, transitions, BPM suggestion.'],
    ['vid-real-estate', '房源展示脚本', 'Property tour script', '空间动线+卖点旁白。', 'Spatial walkthrough plus USP narration.', '房源：[户型/面积/地段]\n2分钟导览：房间顺序、每间旁白卖点、结尾预约 CTA。', 'Property: [type/size/area]\n2-min tour path, room VO USPs, booking CTA.'],
    ['vid-event-recap', '活动现场回顾', 'Event recap video', '快剪+现场音+金句字幕。', 'Fast cuts, ambient sound, quote captions.', '活动：[峰会/发布会] 高光：[3环节]\n回顾片结构：30秒快剪清单、字幕金句 5 条、BGM 情绪曲线。', 'Event: [conference/launch] Highlights: [3]\nRecap: 30s cut list, 5 quote captions, BGM arc.'],
    ['vid-vertical-drama', '竖屏短剧钩子', 'Vertical micro-drama hook', '3秒反转+悬念结尾。', '3-second twist plus cliffhanger end.', '题材：[都市/古风] 集长：[90秒]\n写单集：人物关系、开场反转、高潮、结尾悬念句。', 'Genre: [urban/historical] Length: [90s]\nOne episode: relations, opening twist, climax, cliffhanger line.'],
    ['vid-ai-avatar', '数字人播报稿', 'AI avatar news script', '短句、少歧义、读音标注。', 'Short sentences, disambiguation, pronunciation notes.', '新闻主题：[填写] 时长：[90秒]\n播报稿：短句化、多音字拼音标注、停顿符号，适合 TTS/数字人。', 'Topic: [fill] Length: [90s]\nBroadcast script: short sentences, pronunciation notes, pause markers for TTS/avatar.'],
    ['vid-review-structure', '测评视频公正结构', 'Balanced review video structure', '优点-缺点-适合人群。', 'Pros-cons-who-should-buy structure.', '产品：[填写] 竞品参考：[填写]\n测评脚本：开箱段、测试维度 4 个、评分表、结论与购买建议（含免责声明）。', 'Product: [fill] vs [competitor]\nReview script: unbox, 4 test dimensions, scorecard, conclusion with disclaimer.'],
    ['vid-motivation', '励志短片旁白', 'Motivational short VO', '画面意象与排比句式。', 'Visual metaphors and parallel structure.', '主题：[坚持/转型] 时长：[60秒]\n旁白诗化稿+建议画面意象列表（无版权通用场景）。', 'Theme: [persistence/change] Length: [60s]\nPoetic VO plus B-roll metaphor list (generic scenes).'],
    ['vid-chapter-youtube', 'YouTube 章节标记', 'YouTube chapter markers', '时间戳+章节标题 SEO。', 'Timestamps plus chapter title SEO.', '视频大纲：[粘贴]\n生成 YouTube 章节时间戳（≥5段）、每段标题含关键词、描述区前 150 字优化。', 'Outline: [paste]\nYouTube chapter timestamps (≥5), keyword-rich titles, optimized description opener.']
  ]
};

const ICONS = ['✨', '🔥', '💡', '🎯', '📌', '⭐', '🧩', '🚀', '💎', '📎'];

function buildPrompts() {
  const items = [];
  let globalIdx = 0;
  for (const [category, rows] of Object.entries(CATALOG)) {
    rows.forEach((row, i) => {
      const [slug, zhT, enT, zhD, enD, zhC, enC] = row;
      const model = MODELS[i % MODELS.length];
      const isImage = category === 'image';
      const m = isImage
        ? ['midjourney', 'sd', 'midjourney', 'sd'][i % 4]
        : model;
      items.push({
        id: `${category}-bulk-${slug}`,
        model: m,
        category,
        icon: ICONS[i % ICONS.length],
        accent: 'var(--accent)',
        uses: 520 + globalIdx * 41,
        tags: {
          zh: [zhT.slice(0, 6), category === 'image' ? (m === 'midjourney' ? 'Midjourney' : 'SD') : '经典'],
          en: [enT.split(' ')[0], 'Classic']
        },
        title: { zh: zhT, en: enT },
        description: { zh: zhD, en: enD },
        content: { zh: zhC, en: enC }
      });
      globalIdx++;
    });
  }
  return items;
}

const prompts = buildPrompts();
const header = `/** Auto-generated — 20 prompts × 8 categories. Run: node scripts/generate-bulk-prompts.mjs */\nexport const BULK_PROMPTS = `;
const body = JSON.stringify(prompts, null, 2)
  .replace(/"([^"]+)":/g, '$1:')
  .replace(/"/g, "'")
  .replace(/'/g, '"')
  .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*):/g, '$1"$2":');

// Use proper JSON export
writeFileSync(
  outPath,
  `/** Auto-generated — 20 prompts × 8 categories. Regenerate: node scripts/generate-bulk-prompts.mjs */\nexport const BULK_PROMPTS = ${JSON.stringify(prompts, null, 2)};\n`,
  'utf8'
);
console.log(`Wrote ${prompts.length} prompts to ${outPath}`);
const counts = {};
prompts.forEach((p) => {
  counts[p.category] = (counts[p.category] || 0) + 1;
});
console.log(counts);
