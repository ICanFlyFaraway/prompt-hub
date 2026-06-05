import { DETAILED_OVERRIDES } from './prompt-detailed-overrides.js';

const IMAGE_MODELS = new Set(['midjourney', 'sd']);

/**
 * @param {object} p
 * @returns {{ zh: string, en: string }}
 */
function enrichImagePrompt(p, coreZh, coreEn) {
  const titleZh = p.title?.zh || '';
  const titleEn = p.title?.en || '';
  const isMj = p.model === 'midjourney';
  const vFlag = isMj ? '--v 6' : '';
  const styleNote = isMj
    ? { zh: '可使用 --style raw 减少过度艺术化', en: 'Try --style raw to reduce over-stylization' }
    : { zh: '可配合 LoRA / CFG 7–8 微调写实度', en: 'Tune realism with LoRA / CFG 7–8' };

  return {
    zh: `# 用途说明
${titleZh} — 适用于 ${isMj ? 'Midjourney' : 'Stable Diffusion'} 生成流程。

# 正向提示词（主 Prompt）
\`\`\`
${coreZh.trim()}
\`\`\`

# 推荐参数
| 参数 | 建议 |
|------|------|
| 画幅 | 按用途选 --ar（人像 2:3 / 横幅 16:9 / 方图 1:1）|
| 版本 | ${isMj ? vFlag + '，商业图建议 --style raw' : 'Checkpoint 选写实/动漫对应模型'}|
| 迭代 | 先简单构图，再叠加光影/材质关键词 |

${styleNote.zh}

# 负向提示词（Negative）
\`\`\`
lowres, blurry, watermark, text, logo, deformed hands, bad anatomy, oversaturated, noisy, jpeg artifacts
\`\`\`
（商业产品图请额外加：cluttered background, distorted label）

# 变量替换
- 将 [方括号] 内容换成你的主体描述（英文关键词通常更稳）
- 主体 + 场景 + 光影 + 镜头 + 风格 顺序排列，避免歧义形容词堆叠

# 迭代步骤
1. **草图轮**：仅主体 + 简单背景，确认构图
2. **细节轮**：加材质、镜头、光影词
3. **精修轮**：局部重绘 / 后期调色，勿依赖模型生成文字

# 常见问题
- 画面脏乱 → 加强负向词 + 减少风格词数量
- 不像产品 → 加 product photography / studio strobe 等约束

---
# 原始简要说明（供参考）
${coreZh.trim()}`,
    en: `# Purpose
${titleEn} — workflow for ${isMj ? 'Midjourney' : 'Stable Diffusion'}.

# Positive prompt
\`\`\`
${coreEn.trim()}
\`\`\`

# Suggested settings
| Parameter | Tip |
|-----------|-----|
| Aspect | --ar by use case (portrait 2:3, banner 16:9, square 1:1) |
| Version | ${isMj ? vFlag + ', use --style raw for commercial shots' : 'Pick a matching realistic/anime checkpoint'} |
| Iteration | Simple composition first, then lighting/material keywords |

${styleNote.en}

# Negative prompt
\`\`\`
lowres, blurry, watermark, text, logo, deformed hands, bad anatomy, oversaturated, noisy, jpeg artifacts
\`\`\`

# Variables
- Replace [brackets] with your subject (English tokens often work better)
- Order: subject → scene → lighting → lens → style; avoid vague adjective piles

# Iteration
1. Layout pass: subject + simple background
2. Detail pass: material, lens, lighting
3. Finish in post/local inpaint; avoid model-generated text

# Troubleshooting
- Busy image → stronger negatives, fewer style words
- Product drift → add product photography / studio strobe

---
# Brief reference
${coreEn.trim()}`
  };
}

/**
 * @param {object} p
 * @returns {{ zh: string, en: string }}
 */
function enrichTextPrompt(p, coreZh, coreEn) {
  const titleZh = p.title?.zh || '本任务';
  const titleEn = p.title?.en || 'this task';
  const catHint = {
    writing: { zh: '写作与内容创作', en: 'writing and content' },
    coding: { zh: '软件开发与工程实践', en: 'software development' },
    marketing: { zh: '营销与增长', en: 'marketing and growth' },
    education: { zh: '教学与学习', en: 'teaching and learning' },
    business: { zh: '商业分析与决策', en: 'business analysis' },
    roleplay: { zh: '角色扮演与对话模拟', en: 'roleplay and dialogue simulation' },
    video: { zh: '视频与影视脚本', en: 'video and scripting' },
    image: { zh: '图像生成', en: 'image generation' }
  }[p.category] || { zh: '通用', en: 'general' };

  const varsBlock = (lang) =>
    lang === 'zh'
      ? `- 项目 / 主题：[填写]\n- 目标受众：[填写]\n- 约束或禁忌：[填写]\n- 期望长度 / 格式：[填写]`
      : `- Topic / project: [fill]\n- Audience: [fill]\n- Constraints / taboos: [fill]\n- Length / format: [fill]`;

  return {
    zh: `# 角色设定
你是该领域的资深专家，正在协助我完成「${titleZh}」。场景侧重：${catHint.zh}。

# 背景信息（请先确认或让我补充）
${varsBlock('zh')}

# 核心任务
${coreZh.trim()}

# 推荐工作流程
1. **澄清**：若信息不足，先提出 3 个关键问题，再开始主任务。
2. **分析**：列出要点、假设与风险（如适用）。
3. **产出**：按「输出格式」交付完整结果，必要时附简要理由。
4. **自检**：对照下方质量清单做最终检查。

# 约束原则
- 不编造事实；不确定处标注「需核实」。
- 优先可执行建议，避免空泛描述。
- 尊重我提供的语气、品牌调性与合规要求。

# 输出格式
请使用 Markdown，层级清晰；若涉及代码，使用对应语言代码块；若需表格，用 Markdown 表格。

# 质量检查清单
- [ ] 是否完整回答核心任务
- [ ] 结构是否便于我直接使用
- [ ] 是否标明假设与待确认项

---
# 我的输入内容 / 素材（粘贴 below）
[在此粘贴你的原始材料、代码、数据或问题描述]`,
    en: `# Role
You are a senior expert helping me with "${titleEn}" in ${catHint.en}.

# Context (confirm or ask me to fill)
${varsBlock('en')}

# Core task
${coreEn.trim()}

# Workflow
1. **Clarify**: if information is missing, ask 3 key questions first.
2. **Analyze**: bullet key points, assumptions, and risks when relevant.
3. **Deliver**: follow the output format with complete, usable results.
4. **Self-check**: verify against the quality checklist below.

# Rules
- Do not fabricate facts; mark uncertain items as "needs verification".
- Prefer actionable guidance over vague commentary.
- Respect my tone, brand voice, and compliance constraints.

# Output format
Use clear Markdown headings; code in fenced blocks; tables in Markdown when helpful.

# Quality checklist
- [ ] Core task fully addressed
- [ ] Structure is ready to use
- [ ] Assumptions and open questions labeled

---
# My input / materials (paste below)
[Paste your source material, code, data, or question here]`
  };
}

/**
 * @param {object} prompt
 * @returns {object}
 */
export function enrichPrompt(prompt) {
  if (DETAILED_OVERRIDES[prompt.id]) {
    return {
      ...prompt,
      content: { ...DETAILED_OVERRIDES[prompt.id] },
      detailed: true
    };
  }

  const coreZh = prompt.content?.zh || '';
  const coreEn = prompt.content?.en || '';
  if (!coreZh && !coreEn) return prompt;

  const alreadyDetailed =
    coreZh.length > 900 ||
    (coreZh.includes('# 角色') && coreZh.includes('# 输出格式'));
  if (alreadyDetailed) return { ...prompt, detailed: true };

  const content = IMAGE_MODELS.has(prompt.model)
    ? enrichImagePrompt(prompt, coreZh, coreEn)
    : enrichTextPrompt(prompt, coreZh, coreEn);

  return { ...prompt, content, detailed: true };
}

/**
 * @deprecated Use lazy getPromptFull() in prompt-store.js
 * @param {object[]} prompts
 */
export function enrichAllPrompts(prompts) {
  return prompts.map(enrichPrompt);
}
