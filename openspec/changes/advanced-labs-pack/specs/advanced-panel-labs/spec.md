## ADDED Requirements

### Requirement: Lighthouse 关卡
系统 SHALL 提供一个 `lighthouse-audit` 关卡，包含一个性能/可访问性/SEO/最佳实践都有明显扣分项的页面。引导 SHALL 指导学员手动运行 DevTools 内置的 Lighthouse，并要求学员通过反思型问题报告主要扣分项。

#### Scenario: Lighthouse 跑分引导
- **WHEN** 学员进入 `lighthouse-audit` 关卡
- **THEN** Scenario SHALL 渲染一个含明显性能问题的页面（如未优化大图、阻塞渲染的 CSS、缺少 alt 文本、对比度不足）
- **AND** Console SHALL 提示学员打开 Lighthouse 面板并 Generate report

#### Scenario: 反思型验证
- **WHEN** 学员点击"检查答案"
- **THEN** 系统 SHALL 弹出反思型问题，要求学员从选项中选出本页面 Lighthouse 评分最低的类别（Performance / Accessibility / Best Practices / SEO）
- **AND** 选对正确选项后通关

### Requirement: Coverage 关卡
系统 SHALL 提供一个 `coverage-unused-code` 关卡，页面引入一个大型内联 JS 块但首屏只使用了其中一小部分。引导 SHALL 指导学员用 Coverage 面板启动 instrumentation、刷新页面、观察未使用字节百分比。

#### Scenario: Coverage 启动引导
- **WHEN** 学员进入 `coverage-unused-code` 关卡
- **THEN** Scenario SHALL 包含一段至少 50KB 的内联 JS（仅 5% 在首屏被调用）
- **AND** Console SHALL 提示学员打开 Command Menu → "Show Coverage" → 点击 reload 图标开始记录

#### Scenario: 反思型验证
- **WHEN** 学员点击"检查答案"
- **THEN** 系统 SHALL 弹出反思型问题，要求学员选出观察到的"Unused bytes"大致百分比范围

### Requirement: Mobile 模拟关卡
系统 SHALL 提供一个 `mobile-emulation` 关卡，页面在桌面布局下正常但移动端断点失效。引导 SHALL 指导学员切换 Device Mode、选择 iPhone 等设备预设、并启用 Slow 3G 网络限速。

#### Scenario: Device Mode 引导
- **WHEN** 学员进入关卡
- **THEN** Scenario SHALL 渲染一个桌面下用 `@media (min-width: 768px)` 的栅格，移动端下退化为单列但因 bug 仍保持多列
- **AND** Tour 步骤 SHALL 配置 `devToolsScreenshot: 'device-mode'` 展示如何切到移动端视图

#### Scenario: 反思型验证
- **WHEN** 学员点击"检查答案"
- **THEN** 系统 SHALL 要求学员反思两个问题：（a）哪个 CSS 媒体查询断点失效 （b）Slow 3G 下首屏加载大致耗时

### Requirement: Web Vitals 三阶段关卡
系统 SHALL 提供一个 `web-vitals` 关卡，在同一页面同时埋设 LCP、CLS、INP 三个 bug。验证 SHALL 使用模块级计数器在 `validate()` 内部分阶段推进，每次"检查答案"推进一阶段，三阶段全过才视为通关。

#### Scenario: LCP 阶段
- **WHEN** 学员首次点击"检查答案"（阶段 0）
- **THEN** 系统 SHALL 检查 LCP 修复（如 hero 图片已添加 `loading="lazy"` 或 `width/height`）
- **AND** 修复成功后推进到阶段 1，反馈提示继续修 CLS

#### Scenario: CLS 阶段
- **WHEN** 阶段 1 检查通过后
- **THEN** 系统 SHALL 检查 CLS 修复（如图片占位 div 已设固定 aspect-ratio）

#### Scenario: INP 阶段
- **WHEN** 阶段 2 检查通过后
- **THEN** 系统 SHALL 检查 INP 修复（如按钮 onClick 已去掉同步长循环或改为异步）
- **AND** 三阶段全过 `passed` 字段首次返回 true，触发通关

### Requirement: 异步竞态关卡
系统 SHALL 提供一个 `async-race-condition` 关卡，模拟搜索框快速切换查询时旧请求晚 resolve 覆盖新结果的经典 bug。引导 SHALL 教学员用 Sources 异步堆栈 + 在 fetch 链设断点理解 microtask 顺序。

#### Scenario: 竞态复现
- **WHEN** 学员在 500ms 内连续输入两个不同查询
- **THEN** Scenario SHALL 显示"旧查询的晚到结果"，即 UI 显示的不是最后一次输入的内容
- **AND** MSW SHALL 配置一个延迟 1500ms、一个延迟 200ms 的两条接口制造竞态

#### Scenario: 修复验证
- **WHEN** 学员在 Scenario 中点击"应用 AbortController 修复"按钮（替代在 DevTools 里改源码）
- **THEN** Scenario SHALL 重新跑搜索逻辑，验证旧请求被取消
- **AND** validate SHALL 检查全局 flag 确认修复已应用

### Requirement: Animations 关卡
系统 SHALL 提供一个 `animations-panel` 关卡，包含一组 easing 设置不当导致动画"机械感强"的 CSS keyframes。引导 SHALL 教学员用 Animations 面板的时间线查看与修改 easing。

#### Scenario: Animations 修改引导
- **WHEN** 学员进入关卡
- **THEN** Scenario SHALL 渲染至少两个动画元素（如 loading 旋转 + 卡片 hover）
- **AND** Console SHALL 提示学员打开 Animations 面板（More tools → Animations），点元素触发动画后查看时间线

#### Scenario: 反思型验证
- **WHEN** 学员点击"检查答案"
- **THEN** 系统 SHALL 要求学员选出"机械感"的根因（linear easing vs cubic-bezier）

### Requirement: Command Menu 效率关卡
系统 SHALL 提供一个 `command-menu-snippets` 关卡，无 bug，纯任务清单式介绍 DevTools 效率功能。Scenario SHALL 维护一个任务清单 state，部分任务通过页面侧可观测行为标记完成（如粘贴 snippet 触发 `window.__task_*`），部分用反思型问题。

#### Scenario: 任务清单验证
- **WHEN** 学员完成至少 N-1 个任务并点击"检查答案"
- **THEN** validate SHALL 返回 `passed: tasks.filter(Boolean).length >= N - 1`（允许 1 个任务用反思型问题替代）

#### Scenario: 任务覆盖范围
- **WHEN** 查看任务清单
- **THEN** 任务 SHALL 至少覆盖：Cmd+K 打开 Command Menu、Cmd+P 跳文件、Cmd+Shift+P 跑命令、Console drawer、Sources Snippets 创建 + 运行、Dock side 切换、Go to line

### Requirement: Service Worker 关卡
系统 SHALL 提供一个 `service-worker-offline` 关卡，在 mount 时动态注册一个内联 Service Worker（用 Blob URL 限定 scope），unmount 时注销。SW 缓存策略故意写错（cache-first 缓存了错误版本），导致页面更新后仍显示旧内容。引导 SHALL 教学员用 Application 面板 Service Workers 子面板手动 unregister、用 Cache Storage 子面板删除条目。

#### Scenario: SW 注册与限定 scope
- **WHEN** Scenario mount
- **THEN** SHALL 调用 `navigator.serviceWorker.register(blobUrl, { scope: '/labs/service-worker-offline/' })`
- **AND** unmount 时 SHALL 调用 `registration.unregister()`

#### Scenario: 缓存策略 bug
- **WHEN** 学员点"模拟发布新版"按钮
- **THEN** Scenario 内部 bump 一个版本号，但因 SW cache-first 策略，页面仍显示旧版本号

#### Scenario: 反思型验证
- **WHEN** 学员在 Application 面板手动 unregister SW 后点击"检查答案"
- **THEN** validate SHALL 通过 `navigator.serviceWorker.getRegistration()` 确认 SW 已被注销，并反思型确认学员理解 cache-first vs network-first 的差异

### Requirement: v2 关卡编号与解锁链
8 个进阶关卡 SHALL 在 `registry.ts` 数组中按顺序追加，编号 09-16。第 09 关（`lighthouse-audit`）的 `prerequisite` SHALL 为 v1 的 `comprehensive`。其余 v2 关卡的 `prerequisite` SHALL 指向前一关 slug。

#### Scenario: v1→v2 衔接
- **WHEN** 学员完成 v1 最后一关 `comprehensive`
- **THEN** `lighthouse-audit` 关卡卡片 SHALL 从锁定变为可进入
- **AND** BadgeGrid 自动多出 8 个徽章槽位

### Requirement: 反向测试覆盖
`teaching-bugs.test.ts` SHALL 为每个 v2 关卡新增至少一条断言，验证 `[TEACHING_BUG]` 标记和关键 bug 代码片段仍在源码中。

#### Scenario: CI 保护
- **WHEN** 维护者运行 `npm run test:bugs`
- **THEN** 所有 v2 反向测试 SHALL 通过；如果某 v2 教学 bug 被误修，对应测试 SHALL 失败
