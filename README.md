# PromptHub

纯前端 AI 提示词导航站，基于原型 `prompt_navigator_website.html` 开发。

## 功能

- **i18n**：中文 `/zh/`、英文 `/en/`，语言在 URL 路径中体现，文案见 `locales/`
- **明暗主题**：导航栏切换，偏好保存在 `localStorage`
- **场景分类**：8 大类，每类 **100 条**提示词（共 **800 条**），中英文标题/描述/正文；**详细版正文按需生成**（打开弹窗或复制时）
- **交互筛选**：导航、Tab、侧栏分类、热门标签、卡片标签、工具条、热门榜、配套工具区均可点击筛选
- **模型筛选**：ChatGPT、Claude、Midjourney、SD、Gemini、Sora 等 Tab / 工具条
- **搜索、标签、收藏、一键复制、详情弹窗**
- **贡献者展示**（无排行榜）
- 已移除：登录、投稿入口、贡献者排行、投稿 CTA

## 本地运行

需通过 HTTP 服务打开（ES 模块与 `fetch` 加载语言包）：

```bash
cd C:\Users\Administrator\Projects\prompt-hub
npx --yes serve .
```

浏览器访问：

- http://localhost:3000/zh/
- http://localhost:3000/en/

根路径 `/` 会根据浏览器语言或上次选择跳转到 `/zh/` 或 `/en/`。

## 加载性能（索引 + 分块懒加载）

首屏不再同步加载约 1MB+ 的 `prompts-bulk.js` / `prompts-scale.js`，也不再对 800 条一次性 `enrichAllPrompts`：

| 资源 | 说明 |
|------|------|
| `prompts-index.js` | 约 800 条**轻量索引**（标题、截断描述、标签等，无正文） |
| `chunks/{category}.js` | 每类约 100 条**原始数据**，按分类动态 `import` |
| `prompts-base.js` | 内置精选，随主包加载 |
| `prompt-store.js` | `loadChunk` / `getPromptFull`（按需 enrich + 缓存） |

**运行时行为**

- 列表筛选、分页、搜索：只用索引，速度快
- 当前页卡片：只拉取本页涉及的分类 chunk
- 弹窗 / 复制：对该条 `getPromptFull` → 加载 chunk（若未缓存）→ `enrichPrompt`
- 空闲时后台顺序加载 8 个 chunk，顶栏显示进度条

数据变更后重建索引与分块：

```bash
node scripts/build-prompt-data.mjs
```

源数据仍由 `prompts-base.js`、`prompts-extended.js`、`prompts-bulk.js`、`prompts-scale.js` 合并生成；页面运行时**不**再 import bulk/scale。

## 详细版提示词

详细版在**首次需要正文时**扩写（角色、背景变量、步骤、约束、输出格式等）：

- 通用扩写：`assets/js/data/prompt-enricher.js`
- 精选手写覆盖：`assets/js/data/prompt-detailed-overrides.js`

弹窗中带「完整详细版」标识，卡片显示「详细版」标签。

## 分页与响应式

- 提示词列表默认 **每页 24 条**（可选 12 / 24 / 48，记忆在 localStorage）
- 筛选条件变化时自动回到第 1 页
- 小屏（&lt;900px）侧栏改为抽屉，顶部有「筛选」按钮

## 批量扩充提示词

| 脚本 | 产出 | 数量 |
|------|------|------|
| `node scripts/generate-bulk-prompts.mjs` | `prompts-bulk.js` | +20 / 类 |
| `node scripts/generate-scale-prompts.mjs` | `prompts-scale.js` | +70 / 类 |
| `node scripts/build-prompt-data.mjs` | `prompts-index.js` + `chunks/*.js` | 构建懒加载产物 |

与内置 10 条/类合计 **100 条/类 · 800 条总计**。修改 bulk/scale 后先跑生成脚本，再跑 `build-prompt-data.mjs`。

## 扩展新语言

1. 在 `locales/` 增加如 `ja.json`
2. 在 `assets/js/i18n.js` 的 `SUPPORTED_LOCALES` 中加入 `ja`
3. 新建 `ja/index.html`（可复制 `en/index.html` 并设置 `window.__LOCALE__ = 'ja'`）
4. 为 `assets/js/data/prompts.js` 中各字段补充 `ja` 文案（或沿用 `localizeField` 回退逻辑）

## 结构

```
prompt-hub/
  index.html          # 跳转至默认语言
  zh/index.html       # 中文站
  en/index.html       # 英文站
  locales/            # UI 文案
  assets/
    css/main.css
    js/app.js
    js/i18n.js
    js/data/prompts.js
    js/data/prompts-index.js
    js/data/prompt-store.js
    js/data/chunks/*.js
```
