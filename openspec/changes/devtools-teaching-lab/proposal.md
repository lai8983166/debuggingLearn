## Why

前端开发者（尤其是初中级）普遍会"用 DevTools 看 Console 报错"，但很少系统掌握 Elements / Sources / Network / Performance / Memory / Application 等面板的调试能力。现有教程多是文档+截图，缺乏"在一个真实项目里动手定位 bug"的练习场景。本项目构建一个"故意带 bug 的模拟前端应用"，让学习者在真实代码环境中用 DevTools 一步步定位、验证、修复问题，比看文档更接近实战。

## What Changes

- 新增 Web 应用 `devtools-teaching-lab`，包含一个"模拟真实业务"的前端外壳（首页、关卡列表、进度展示）
- 新增 **8 个独立关卡页面**，每个关卡演示一类 DevTools 调试场景：
  1. Elements — DOM 结构错乱（样式错位的卡片列表）
  2. Console — JS 运行时错误 + 日志排查（点击无响应的表单）
  3. Sources — 断点调试变量状态（计算结果错误的购物车）
  4. Network — API 请求异常（加载失败的列表 + 状态码排查）
  5. Performance — 渲染掉帧（卡顿动画）
  6. Memory — 内存泄漏（长时间停留导致卡顿的页面）
  7. Application — Storage / Cookie 问题（登录态丢失）
  8. 综合 — 多面板协作排查（一个需要跨 Console + Network + Sources 才能解决的复杂 bug）
- 新增**多通道引导框架**：Console 自动提示 + 步骤浮窗（Step Tour）+ 答案验证 + 游戏化进度，避免单一纯文字说明
- 新增**答案验证机制**：每关提供"检查答案"按钮 + 行为监听（如学员在 Console 输入指定表达式、选中目标 DOM 节点时自动判定通过）
- 新增**进度系统**：通关进度条、徽章、关卡解锁逻辑，存储到 localStorage
- 不做：真实后端 API（用 mock 即可，避免环境依赖）、账号系统、移动端适配（首期）

## Capabilities

### New Capabilities
- `lab-scenarios`: 关卡场景能力——提供独立的、可索引的调试场景页面，每个场景包含一个可复现的 bug、明确的学习目标、以及覆盖某一类 DevTools 面板的练习
- `guided-learning`: 多通道引导能力——在每个场景内通过 Console 提示、步骤浮窗、答案验证三种通道协同引导学员，避免依赖纯文字说明
- `progress-system`: 进度与激励能力——跟踪学员通关状态、计算进度、解锁关卡、颁发徽章，并通过 localStorage 持久化

### Modified Capabilities
<!-- 全新项目，无已有 spec -->

## Impact

- **新增代码**：前端应用（建议 Vite + React + TypeScript，见 design.md 详述）、引导框架库、8 个关卡场景、进度状态管理
- **依赖**：前端框架、路由、状态管理、构建工具；不引入后端（mock 数据）
- **部署**：纯静态产物，可托管到任意静态站点（GitHub Pages / Netlify），便于学员直接访问
- **可访问性**：所有"故意埋的 bug"需在文档/源码注释中明确标注 `[TEACHING_BUG]`，避免被误认为真实缺陷
