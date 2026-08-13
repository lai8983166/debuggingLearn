## 1. v1 验收与归档准备

- [ ] 1.1 在 `openspec/changes/devtools-teaching-lab/` 运行 `openspec archive --change devtools-teaching-lab`（可选：等 v2 完成后一起归档）
- [ ] 1.2 创建 v2 关卡目录骨架：`src/labs/09-lighthouse-audit/` 到 `src/labs/16-service-worker-offline/`，每个含 4 个空文件（Scenario.tsx / Scenario.css / guide.ts / FIX.md / index.ts）
- [ ] 1.3 在 `src/mocks/handlers.ts` 追加 v2 共享接口骨架（先空数组，各关按需填）

## 2. 关卡 09：lighthouse-audit（Lighthouse 综合体检）

- [ ] 2.1 实现 `Scenario.tsx`：一个含多种扣分点的页面——大 base64 图（无 lazy/width/height）、阻塞渲染的内联 CSS、缺 alt 的 img、对比度不足的按钮文字、缺 meta description
- [ ] 2.2 编写 `guide.ts`：3 条 consoleHints（"按 Generate report"、"看 Performance 分数"、"看 Accessibility 找扣分项"）、4 个 tour step（每个嵌入 devToolsScreenshot 占位）、反思型 validate（要求选出最低分类别）
- [ ] 2.3 编写 `FIX.md`：解释 Lighthouse 四大类别 + 本次扣分项的修复思路
- [ ] 2.4 在 `index.ts` 定义 meta（`panel: 'Lighthouse'`、`difficulty: 2`、`prerequisite: 'comprehensive'`、`badgeLabel: '体检主任'`）
- [ ] 2.5 在 registry 注册，更新 README 关卡地图第 9 行

## 3. 关卡 10：coverage-unused-code（Coverage 死代码分析）

- [ ] 3.1 实现 `Scenario.tsx`：首屏只有"显示问候语"按钮，但内联一段 50KB+ 的 JS（如展开后的 1000 个 console.log 字符串 / 大数组），只有 5% 在按钮点击时执行
- [ ] 3.2 编写 `guide.ts`：教 Cmd+Shift+P → "Show Coverage" → 点 reload 图标 → 看 Unused Bytes %；反思型 validate（要求选观察到的未使用百分比范围）
- [ ] 3.3 编写 `FIX.md`：讲清"首屏字节"概念 + code splitting / tree shaking / 动态 import
- [ ] 3.4 注册 + meta（`panel: 'Coverage'`、`difficulty: 2`、`prerequisite: 'lighthouse-audit'`、`badgeLabel: '瘦身教练'`）

## 4. 关卡 11：mobile-emulation（Device Mode + 网络限速）

- [ ] 4.1 实现 `Scenario.tsx`：栅格布局，媒体查询 `@media (min-width: 768px)` 因 CSS 优先级 bug 在窄屏不生效；图片未优化在 Slow 3G 下加载慢
- [ ] 4.2 编写 `guide.ts`：教切 Device Mode（Cmd+Shift+M）→ 选 iPhone 12 → 设 Network 为 Slow 3G → 触发 reload；反思型 validate 两题
- [ ] 4.3 编写 `FIX.md`：响应式断点 + throttling 测试 + 移动端常见坑
- [ ] 4.4 注册 + meta（`panel: 'Device Mode'`、`difficulty: 2`、`prerequisite: 'coverage-unused-code'`、`badgeLabel: '移动先行'`）

## 5. 关卡 12：web-vitals（LCP/CLS/INP 三阶段）

- [ ] 5.1 实现 `WebVitalsMeter.tsx` 组件：用 PerformanceObserver 实时显示 LCP/CLS/INP 数值，类似 v1 FpsMeter
- [ ] 5.2 实现 `Scenario.tsx`：hero 大图（无 lazy/width/height → LCP 高）；图片占位空 div 加载后撑开（→ CLS 高）；按钮 onClick 跑 500ms 同步循环（→ INP 高）
- [ ] 5.3 编写 `guide.ts`：模块级 `let phase = 0`；`validate()` 三阶段——LCP 检查 hero img 是否加了 `loading=lazy` 或 width/height；CLS 检查占位 div 是否设了 aspect-ratio；INP 检查 onClick 是否改成 setTimeout/await；反馈字符串带"✓ LCP 修好，继续 CLS"等推进提示
- [ ] 5.4 在 Scenario 提供"应用 LCP 修复"等 3 个一键按钮（替代学员在 DevTools 改代码，便于验证）
- [ ] 5.5 编写 `FIX.md`：三大指标定义 + core-web-vitals 评分阈值 + 每项修复
- [ ] 5.6 注册 + meta（`panel: 'Web Vitals'`、`difficulty: 3`、`prerequisite: 'mobile-emulation'`、`badgeLabel: 'Vitals 焕新师'`）

## 6. 关卡 13：async-race-condition（异步竞态）

- [ ] 6.1 在 `src/mocks/handlers.ts` 追加：`/api/search?q=A` 延迟 1500ms，`/api/search?q=B` 延迟 200ms（用 `HttpResponse.json` + `await delay()`）
- [ ] 6.2 实现 `Scenario.tsx`：搜索框 + 结果显示；快速输入 A→B 时，UI 先显示 B（200ms 后到），然后被 A 覆盖（1500ms 后到）
- [ ] 6.3 实现"应用 AbortController 修复"按钮：内部维护 `AbortController` 序号，新请求取消旧请求；点击后设置 `window.__async_fixed = true`
- [ ] 6.4 编写 `guide.ts`：教在 fetch 链设断点 + 看 Console 的异步堆栈（async stack traces）；validate 用主动型（检查 `window.__async_fixed`）+ 反思型（要求选出 AbortController 的核心 API）
- [ ] 6.5 编写 `FIX.md`：竞态条件 4 种修复方案对比（AbortController / 序号 / 取消 promise / debouce）
- [ ] 6.6 注册 + meta（`panel: 'Async'`、`difficulty: 3`、`prerequisite: 'web-vitals'`、`badgeLabel: '竞态终结者'`）

## 7. 关卡 14：animations-panel（Animations 时间线）

- [ ] 7.1 实现 `Scenario.tsx`：3 个动画元素——loading 旋转（`linear` easing 看起来很机械）、卡片 hover（`linear`）、进度条填充（`linear`）。修复目标：改成 `cubic-bezier`
- [ ] 7.2 实现"应用 cubic-bezier 修复"按钮：动态注入 `<style>` 覆盖 easing
- [ ] 7.3 编写 `guide.ts`：教 More tools → Animations → 触发动画 → 看时间线 + 修改 easing 字段；validate 用主动型（检查注入的 style）+ 反思型
- [ ] 7.4 编写 `FIX.md`：linear vs cubic-bezier 的视觉差异 + 常用 easing 推荐
- [ ] 7.5 注册 + meta（`panel: 'Animations'`、`difficulty: 2`、`prerequisite: 'async-race-condition'`、`badgeLabel: '动效调音师'`）

## 8. 关卡 15：command-menu-snippets（效率关）

- [ ] 8.1 实现 `Scenario.tsx`：维护 `tasks: boolean[10]` state；提供 10 个任务卡（Cmd+K、Cmd+P、Cmd+Shift+P、Drawer、Snippets 创建、Snippets 运行、Dock right、Go to line、Console settings、Performance monitor）
- [ ] 8.2 为"Snippets 运行"任务：监听 `window.__task_snippet_run`，提示学员在 Snippets 粘贴 `window.__task_snippet_run = true`
- [ ] 8.3 其余 9 个任务：用反思型问题替代（"你完成了吗？" 单选"是"即标记 task 完成）
- [ ] 8.4 编写 `guide.ts`：每个任务对应 1 个 tour step（带 devToolsScreenshot）；validate 检查 `tasks.filter(Boolean).length >= 9`
- [ ] 8.5 编写 `FIX.md`：列出 30+ DevTools 快捷键速查表
- [ ] 8.6 注册 + meta（`panel: 'Command Menu'`、`difficulty: 2`、`prerequisite: 'animations-panel'`、`badgeLabel: '效率达人'`）

## 9. 关卡 16：service-worker-offline（Service Worker）

- [ ] 9.1 实现 `inlineWorker.ts` 工具：把 SW 代码字符串化 → Blob URL → `navigator.serviceWorker.register(url, { scope })`；提供 `unregister(scope)` 辅助
- [ ] 9.2 SW 代码：cache-first 策略；缓存 key 含 `/api/version`，故意不更新缓存 → "新版"按钮后页面仍显示旧版号
- [ ] 9.3 实现 `Scenario.tsx`：mount 时注册 SW；显示当前版本号；提供"模拟发布新版"按钮（仅更新内存版本号，SW 不会重抓）
- [ ] 9.4 编写 `guide.ts`：教 Application → Service Workers 子面板看注册列表 + 手动 Unregister；Application → Cache Storage 看条目 + 删除；validate 用主动型（检查 `navigator.serviceWorker.getRegistrations()` 是否已空）+ 反思型
- [ ] 9.5 编写 `FIX.md`：SW 生命周期 + cache-first vs network-first vs stale-while-revalidate + 版本管理
- [ ] 9.6 注册 + meta（`panel: 'Service Worker'`、`difficulty: 3`、`prerequisite: 'command-menu-snippets'`、`badgeLabel: '离线工程师'`）

## 10. 反向测试

- [ ] 10.1 在 `src/labs/teaching-bugs.test.ts` 追加 8 个 `describe` 块（命名 `teaching-bug: lab 09..16 <slug>`），每个至少一条断言验证 `[TEACHING_BUG]` 标记 + 关键 bug 代码片段仍存在
- [ ] 10.2 运行 `npm run test:bugs` 验证全部通过

## 11. 文档与构建验证

- [ ] 11.1 更新 `README.md` 关卡地图为 16 行；新增"v2 进阶包"段落，说明前置是 v1 + 推荐用 Chrome/Edge
- [ ] 11.2 `npm run build` 通过，bundle 大小记录到 commit message
- [ ] 11.3 `npm test` 全部通过（28 + 8 = 36 测试）
- [ ] 11.4 手动 smoke test：依次进入 v2 的 8 关，确认 Scenario 渲染、引导显示、验证可推进
- [ ] 11.5 提交并推 git（按关卡分多次 commit）

## 12. 验收

- [ ] 12.1 对照 `specs/advanced-panel-labs/spec.md` 逐条验收（8 关 + 编号链 + 反测覆盖）
- [ ] 12.2 对照 `specs/lab-scenarios/spec.md` MODIFIED+ADDED 验收（16 关齐备、多阶段 validate 接口、截图引导）
- [ ] 12.3 v1 关卡未被破坏（重跑 v1 反向测试 + 手动走查 v1 任选 2 关）
