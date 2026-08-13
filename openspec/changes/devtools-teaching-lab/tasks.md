## 1. 项目初始化与脚手架

- [ ] 1.1 使用 `npm create vite@latest devtools-teaching-lab -- --template react-ts` 初始化项目，验证 `npm run dev` 可启动
- [ ] 1.2 安装核心依赖：`react-router-dom`、`zustand`、`msw`、`clsx`
- [ ] 1.3 配置 TS 严格模式（`tsconfig.json` 中 `strict: true`），添加 `src/types/` 全局类型声明目录
- [ ] 1.4 建立 `src/` 目录结构骨架：`labs/`、`components/`、`store/`、`lib/`、`pages/`、`routes/`
- [ ] 1.5 配置 ESLint + Prettier，添加 `// [TEACHING_BUG]` 标记的 lint 规则（仅警告，不阻塞）
- [ ] 1.6 配置 Vite `base` 路径以支持子路径部署（GitHub Pages 等），添加 `vite.config.ts` 注释说明

## 2. 应用外壳与路由

- [ ] 2.1 在 `src/routes/` 定义路由：`/`（首页）、`/labs`（关卡列表）、`/labs/:slug`（关卡页）、`*`（404）
- [ ] 2.2 实现 `src/components/AppShell.tsx`：顶部导航 + 进度条 + 徽章预览入口
- [ ] 2.3 实现 `src/pages/HomePage.tsx`：项目介绍 + "开始学习"CTA + 进度概览
- [ ] 2.4 实现 `src/pages/LabsIndexPage.tsx`：关卡卡片列表，按 `difficulty` 排序，渲染锁定/解锁状态
- [ ] 2.5 实现 `src/pages/LabPage.tsx`：根据 `:slug` 从 registry 解析 Lab，未解锁则重定向到 `/labs` 并提示
- [ ] 2.6 实现 `src/pages/NotFoundPage.tsx`

## 3. 关卡注册机制与类型定义

- [ ] 3.1 在 `src/labs/types.ts` 定义 `Lab`、`LabMeta`、`LabGuideConfig`、`TourStep`、`ConsoleHint`、`Hint`、`ValidationResult` 类型
- [ ] 3.2 在 `src/labs/registry.ts` 创建空 registry 数组与 `getLab(slug)`、`getAllLabs()`、`isUnlocked(slug, progress)` 辅助函数
- [ ] 3.3 编写 registry 的单元测试（vitest）：注册一个 mock Lab 后能通过 helper 取出

## 4. 进度系统（progress-system capability）

- [ ] 4.1 在 `src/store/progressStore.ts` 用 Zustand + persist 中间件实现 `Progress` 状态：`version`、`completed`、`badges`、`currentLab`、`lastActiveAt`
- [ ] 4.2 实现 actions：`markComplete(slug, badge)`、`reset()`、`exportProgress()`、`setCurrentLab(slug)`
- [ ] 4.3 实现 `loadOrMigrate()` 启动逻辑：读取 localStorage，按 `version` 字段校验；版本不匹配则提示重置
- [ ] 4.4 实现 `safeSetItem` 封装：捕获 `localStorage.setItem` 异常（隐私模式/超限），降级到内存 + Toast 提示
- [ ] 4.5 实现 `src/components/ProgressBar.tsx`：订阅 store，渲染 `X/N` 与百分比，通关瞬间动画更新
- [ ] 4.6 实现 `src/components/BadgeGrid.tsx`：徽章网格，未获得的徽章灰色锁定
- [ ] 4.7 在首页加"导出进度"和"重置进度"按钮（重置需二次确认对话框）
- [ ] 4.8 编写 progressStore 单元测试：markComplete 不重复颁发徽章、reset 清空、loadOrMigrate 旧版本降级

## 5. 引导框架（guided-learning capability）

- [ ] 5.1 实现 `src/lib/consoleGuide.ts`：`printHint(hint)` 用 `%c` 输出带样式 `[Lab]` 前缀信息，统一颜色规范
- [ ] 5.2 实现 `src/components/LabGuide/StepTour.tsx`：右下角浮窗，显示步骤序号 `X/N` + 文本 + 上/下一步按钮 + 最小化/关闭
- [ ] 5.3 实现浮窗状态持久化（最小化/当前步骤）到组件本地 state，支持"显示引导"按钮重新唤起
- [ ] 5.4 实现步骤 `highlightSelector` 高亮：用 portal 渲染绝对定位的 outline 框覆盖匹配元素
- [ ] 5.5 实现 DevTools 操作步骤的截图缩略图组件（先用占位图，后续替换实际截图）
- [ ] 5.6 实现 `src/components/LabGuide/ValidateButton.tsx`："检查答案"按钮，调用 lab 的 `validate()` 并分发结果
- [ ] 5.7 实现反思型验证 UI：`ReflectionDialog.tsx` 单选/多选对话框，支持配置选项与正确答案
- [ ] 5.8 实现反馈分发：通过时 Console 庆祝 + 浮窗成功图标 + Toast；未通过仅浮窗 + Toast（不污染 Console）
- [ ] 5.9 实现 `src/components/LabGuide/HintButton.tsx`：分级提示按钮，每次点击只前进一级，到达末级置灰
- [ ] 5.10 实现 `?presentation=1` 演示模式：读取 query param，隐藏浮窗与 HintButton，Console 引导保留
- [ ] 5.11 把以上组件组装为 `src/components/LabGuide/index.tsx`，接受 `LabGuideConfig` prop，统一渲染

## 6. 关卡 1：console-errors（Console 报错排查）

- [ ] 6.1 实现 `src/labs/01-console-errors/Scenario.tsx`：一个点击无响应的表单，含 `[TEACHING_BUG]`（如 `undefined.foo`）
- [ ] 6.2 编写 `guide.ts`：3 条 consoleHints、3 个 tour 步骤、反思型 validate（让学员选出报错的变量名）
- [ ] 6.3 编写 `FIX.md`：修复说明（解释错误原因 + 修复思路），验证通过后展示
- [ ] 6.4 在 registry 注册本关，元数据：`panel: 'Console'`、`difficulty: 1`、`prerequisite: null`

## 7. 关卡 2：elements-dom（Elements DOM/样式）

- [ ] 7.1 实现 Scenario：样式错位的卡片列表，bug 是 `flex-direction` 写错或 `key` 重复导致渲染异常
- [ ] 7.2 编写 guide：主动型 validate（读取 DOM `computed style` 与期望值比对）
- [ ] 7.3 编写 FIX.md，注册到 registry（`panel: 'Elements'`、`difficulty: 1`、`prerequisite: 'console-errors'`）

## 8. 关卡 3：sources-breakpoint（Sources 断点调试）

- [ ] 8.1 实现 Scenario：购物车总价计算错误（如 `[TEACHING_BUG]` 把 `price * count` 写成 `price * count * 2`）
- [ ] 8.2 编写 guide：反思型 validate（让学员选出"哪个变量值不对"）+ 提供"应用修复"按钮触发主动型二次验证
- [ ] 8.3 编写 FIX.md，注册（`panel: 'Sources'`、`difficulty: 2`、`prerequisite: 'elements-dom'`）

## 9. 关卡 4：network-failing-api（Network 请求排查）

- [ ] 9.1 配置 MSW：在 `src/mocks/handlers.ts` 注册一个返回 500/404 的接口与一个正常接口
- [ ] 9.2 在 `src/main.tsx` 启用 MSW（仅 dev 与 staging，生产可降级为 fetch 拦截）
- [ ] 9.3 实现 Scenario：列表加载失败但页面无任何错误提示（fetch 错误被吞掉）
- [ ] 9.4 编写 guide：反思型 validate（让学员选出失败的请求方法 + 状态码）
- [ ] 9.5 编写 FIX.md，注册（`panel: 'Network'`、`difficulty: 2`、`prerequisite: 'sources-breakpoint'`）

## 10. 关卡 5：application-storage（Application 存储排查）

- [ ] 10.1 实现 Scenario：登录态丢失，bug 是 cookie `Secure` 标志导致 http 本地环境丢 cookie，或 localStorage key 拼写错误
- [ ] 10.2 编写 guide：主动型 validate（读取 localStorage/cookie 与期望 key 比对）
- [ ] 10.3 编写 FIX.md，注册（`panel: 'Application'`、`difficulty: 2`、`prerequisite: 'network-failing-api'`）

## 11. 关卡 6：performance-jank（Performance 性能分析）

- [ ] 11.1 实现 Scenario：一个动画在每帧执行大量同步计算导致掉帧，渲染 FPS 计数器组件
- [ ] 11.2 实现 `src/components/FpsMeter.tsx`：用 `requestAnimationFrame` 实时显示 FPS，便于学员观测
- [ ] 11.3 编写 guide：反思型 validate（让学员选出"哪个函数是性能瓶颈"）
- [ ] 11.4 编写 FIX.md，注册（`panel: 'Performance'`、`difficulty: 3`、`prerequisite: 'application-storage'`）

## 12. 关卡 7：memory-leak（Memory 内存分析）

- [ ] 12.1 实现 Scenario：定时器不断向一个未释放的数组 push 数据，长时间停留页面越来越卡
- [ ] 12.2 编写 guide：反思型 validate（让学员选出泄漏的数据结构/未清理的定时器）
- [ ] 12.3 编写 FIX.md（提供"释放泄漏"按钮验证修复后内存稳定）
- [ ] 12.4 注册（`panel: 'Memory'`、`difficulty: 3`、`prerequisite: 'performance-jank'`）

## 13. 关卡 8：comprehensive（综合多面板排查）

- [ ] 13.1 实现 Scenario：一个表单提交后偶发失败，需要先看 Console（警告）→ Network（请求载荷错）→ Sources（断点定位变量）才能定位根因
- [ ] 13.2 编写 guide：分 3 阶段 validate，每阶段对应一个面板的操作
- [ ] 13.3 编写 FIX.md（结业说明 + 推荐进阶学习路径），注册（`panel: 'Comprehensive'`、`difficulty: 3`、`prerequisite: 'memory-leak'`）

## 14. 关卡完成页与修复说明展示

- [ ] 14.1 实现 `src/components/FixReveal.tsx`：validate 通过后才渲染 `FIX.md` 内容（用 react-markdown）
- [ ] 14.2 实现"下一关"CTA：通关后浮窗显示"前往下一关：<下一关标题>"按钮
- [ ] 14.3 实现"重新挑战"按钮：清除本关完成态但保留徽章（首期最小实现，不做计时）

## 15. 反向测试（保护教学 bug 不被误修）

- [ ] 15.1 为每个关卡添加一条"反向单测"：断言 buggy 行为成立（如 console-errors 关卡断言点击按钮抛错）
- [ ] 15.2 在 `package.json` 添加 `test:bugs` 脚本，CI 中运行；教学 bug 被误修时测试失败

## 16. README 与部署

- [ ] 16.1 编写 `README.md`：项目简介、本地启动、部署说明、新增关卡指南、`[TEACHING_BUG]` 规范
- [ ] 16.2 配置 GitHub Pages 部署 workflow（`.github/workflows/deploy.yml`），构建产物推到 `gh-pages` 分支
- [ ] 16.3 在 `README.md` 添加首期 8 关的关卡地图与建议学习路径
- [ ] 16.4 手动 smoke test：从首页进入 → 通关第一关 → 验证进度持久化 → 刷新恢复 → 重置进度

## 17. 验收与收尾

- [ ] 17.1 对照 `specs/lab-scenarios/spec.md` 逐条验收（路由、bug 复现、8 关齐备、元数据、validate、新增成本）
- [ ] 17.2 对照 `specs/guided-learning/spec.md` 逐条验收（Console、浮窗、高亮、验证、反馈、分级提示、演示模式）
- [ ] 17.3 对照 `specs/progress-system/spec.md` 逐条验收（数据模型、解锁、徽章、进度条、导出/重置、版本化、持久化）
- [ ] 17.4 邀请一位非作者同学走查前 3 关，收集反馈记录到 `docs/user-feedback.md`（首期不要求整改）
