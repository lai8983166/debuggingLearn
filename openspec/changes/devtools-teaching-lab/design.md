## Context

全新项目，目标是做"在真实前端代码里练 DevTools"的教学平台。学习对象是会写前端、但 DevTools 只会看 Console 的开发者。约束：

- 部署要轻量（纯静态），学员无需配后端、无需注册即可使用
- 故意埋的 bug 必须可在源码里清晰追溯，且能让学员"真的"用 DevTools 发现
- 引导不能完全靠纯文字（学员会跳读），需要"Console 引导 + 浮窗 + 验证反馈"多通道
- 单页应用，每关独立路由，便于分享和书签到具体关卡

## Goals / Non-Goals

**Goals:**
- 8 个独立关卡，覆盖 DevTools 主要面板（Elements / Console / Sources / Network / Performance / Memory / Application / 综合）
- 每关提供 Console 自动提示、步骤浮窗、答案验证三种引导通道，可任选其一或组合使用
- 进度、解锁、徽章持久化在 localStorage，刷新不丢
- 项目结构清晰、新增关卡成本低（一个文件夹 + 注册一行）
- 故意埋的 bug 必须在源码中带 `[TEACHING_BUG]` 注释标记，便于评审与避免误判

**Non-Goals:**
- 不做真实后端（全部 mock；Network 关卡用 MSW 或本地 fetch 拦截）
- 不做账号系统/云端进度同步（首期 localStorage 足够）
- 不做移动端适配（DevTools 教学本身就在桌面浏览器练）
- 不做 i18n（首期中文）
- 不做关卡编辑器（首期只做内置 8 关）

## Decisions

### 1. 技术栈：Vite + React 18 + TypeScript
**理由**：Vite 启动快、产物纯静态可托管到 GitHub Pages；React 生态成熟、组件多；TS 让"故意埋的 bug"在源码层有类型可循，便于学员在 Sources 面板看到变量类型。
**备选**：Vue 3 / SvelteKit。Vue 也合适，但 React 受众更广、教学收益更高。Next.js 不必要（不需要 SSR/后端）。

### 2. 路由：React Router v6
**理由**：每关一个 `/labs/:slug` 路由，方便书签、分享、刷新保持位置。
**备选**：自写 hash router。React Router 已够轻，不重复造轮子。

### 3. 状态管理：Zustand + localStorage 持久化中间件
**理由**：进度系统状态很简单（已完成关卡集合 + 已获徽章 + 当前解锁关卡），Zustand 比 Redux 模板代码少很多，自带 persist 中间件够用。
**备选**：Context + useReducer。可行为一致但代码更散；Zustand 单文件 store 更清晰。

### 4. Mock 网络：MSW（Mock Service Worker）
**理由**：Network 关卡需要让学员看到"真实的 HTTP 请求"出现在 DevTools Network 面板里。MSW 拦截 fetch 在 Service Worker 层，请求会真实出现在 Network 面板中，符合教学需求。
**备选**：直接 `mock-fetch` 库。但拦截的请求不会出现在 Network 面板，破坏教学效果。

### 5. 引导框架设计（核心）
统一抽象为 `<LabGuide>` 组件，每个关卡声明自己的引导配置：

```ts
type LabGuideConfig = {
  consoleHints: ConsoleHint[];          // 启动时和点击"提示"时往 console 输出
  steps: TourStep[];                    // 步骤浮窗的步骤序列
  validate: () => ValidationResult;     // 答案验证函数（页面侧）
  hints: Hint[];                        // 分级文字提示（兜底）
};
```

**三个通道**：
- **Console 引导**：用 `console.log('%c…', 'css')` 输出带样式的彩色提示，让学员"为了看提示不得不打开 Console"，本身就是练习。每关启动时自动打一条，学员点"下一步"时再打下一条。
- **步骤浮窗（Tour）**：右下角浮窗，显示"第 X/N 步：…"，可上下切换。**可高亮页面元素**（用 portal + 绝对定位 outline 框），但**不能高亮 DevTools 本身**（浏览器限制）——所以涉及 DevTools 操作的步骤用文字 + 截图缩略图说明。
- **答案验证**：每关右下角"检查答案"按钮。验证逻辑在页面侧执行：
  - **主动型**：直接读 DOM / computed style / 全局状态判断修复是否生效（适合 Elements、Performance 修复后）
  - **反思型**：弹出单选/多选，让学员选出根因（适合 Sources、Network 这种难以页面侧检测的）
  - **混合型**：先单选确认根因，再让学员在页面里实际修复并校验
- 验证通过 → 颁发徽章 + 解锁下一关 + Console 庆祝输出。

### 6. 关卡注册机制
`src/labs/registry.ts` 维护一个 `Lab[]` 数组，每个 Lab 一个文件夹：

```
src/labs/
  01-console-errors/
    index.tsx          // 入口组件
    guide.ts           // 引导配置（consoleHints, steps, validate）
    Scenario.tsx       // 含 bug 的场景组件
    FIX.md             // 答案/修复说明（仅验证通过后展示）
  02-elements-dom/
    ...
  registry.ts
```

新增关卡 = 新建文件夹 + 在 registry 里加一行。顺序由数组下标决定，"解锁"逻辑 = `index === 0 || completed.includes(prevSlug)`。

### 7. "故意 bug"的标注规范
所有埋的 bug 在源码里用统一注释标记：
```ts
// [TEACHING_BUG] 这里返回值类型错了，导致计算结果翻倍
return price * count * 2;
```
好处：未来代码评审时能快速区分"教学用 bug"和"真实缺陷"，也让维护者扫一眼就知道每关的 bug 在哪。

### 8. 进度数据结构
```ts
type Progress = {
  completed: string[];        // 已通关的 lab slug
  badges: string[];           // 已获徽章 id
  currentLab: string;         // 当前所在的 lab（恢复用）
  lastActiveAt: number;       // 时间戳
};
```
存 `localStorage` key `devtools-lab-progress-v1`。带版本号便于未来迁移。

### 9. 关卡顺序与难度曲线
按"上手门槛从低到高"：
1. `console-errors` — 看 Console 报错（最简单，破冰）
2. `elements-dom` — 修 DOM 结构
3. `sources-breakpoint` — 断点 + 变量监视
4. `network-failing-api` — Network + 状态码
5. `application-storage` — Storage/Cookie 排查
6. `performance-jank` — Performance 面板找掉帧
7. `memory-leak` — Memory 快照对比
8. `comprehensive` — 综合跨面板排查（结业）

## Risks / Trade-offs

- **[无法直接检测 DevTools 操作]** → 学员"是否真在 DevTools 里设了断点"无法从页面侧得知。**缓解**：用反思型验证（让学员选出根因/填关键变量值）替代操作检测；明确说明"答案验证是用来确认你理解了，不是监视你的操作"。
- **[Console 引导可能被学员的浏览器扩展污染]** → 浏览器扩展也往 console 输出。**缓解**：每条引导用统一前缀 `[Lab]` + 高对比色样式，过滤视觉噪音。
- **[MSW Service Worker 在生产部署需正确配置]** → 静态托管下 SW 路径容易 404。**缓解**：Vite 配 `base` 路径 + 部署文档说明；首期允许退化到 fetch 拦截（接受 Network 面板看不到请求的折损）。
- **[Memory/Performance 关卡的"卡顿"在不同机器差异大]** → 学员机器若太快可能感受不到卡顿。**缓解**：用 `requestAnimationFrame` + 人为大循环 + 帧率显示组件，保证有可观测的掉帧。
- **[故意 bug 容易被未来维护者误修]** → **缓解**：`[TEACHING_BUG]` 标记 + 单测断言"bug 必须存在"（每关附一个"反向测试"，断言 buggy 行为成立）。
- **[纯前端无法真正阻止学员作弊（直接看源码）]** → 不视为风险，本身就是开源教学；但答案/修复说明只在验证通过后才展示，保持练习动机。

## Migration Plan

新项目首期无需迁移。未来若引入真实后端/账号：
- localStorage 进度可一键导出 JSON，未来登录后导入
- MSW mock 可替换为真实 API，关卡代码无需大改（fetch 路径不变）

## Open Questions

- 是否需要"重置进度"按钮？（建议有，放在首页设置区）
- 关卡完成后是否允许"重新挑战"以刷新徽章等级（如"无提示通关"）？（首期不做，预留 v2）
- 是否需要一个"演示模式"让老师投屏讲解时不显示步骤浮窗？（建议加 query param `?presentation=1` 隐藏浮窗）
