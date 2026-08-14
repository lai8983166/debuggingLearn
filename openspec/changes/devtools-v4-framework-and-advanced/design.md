## Context

v4 在既有框架上扩展，最大亮点是 `react-devtools` 关——本应用自身就是 React，学员无需任何额外环境就能用 React DevTools 扩展调试我们的 Scenario 组件。

约束：
- 不引入新 npm 依赖
- v4 第 1 关前置 = v3 最后一关 `saas-dashboard`
- 真机调试 / 跨浏览器关无法在页面内实操，用文档 + 反思型

## Decisions

### 1. react-devtools：利用宿主应用自身

Scenario 含一个"每秒 re-render 的重组件"（没有 memo 的子树 + context 变化）。学员装 React DevTools 扩展后：
- Components 面板看 props/state 树
- Profiler 录制 → 火焰图看哪个组件渲染耗时最多
- "应用 React.memo 修复"按钮切换到 memo 版本，Profiler 再录对比

主动型验证：检测按钮是否点击。

### 2. recorder-panel：录一段表单流程

Scenario 是一个多步表单。学员用 Recorder 面板录制"填写→提交"流程，回放验证，导出 Puppeteer 脚本。反思型验证（无法检测录制操作）。

### 3. layers-panel：will-change 层爆炸

Scenario 含 10 个卡片全部带 `will-change: transform`（滥用），Layers 面板能看到 10 个独立层（内存浪费）。修复按钮移除多余 will-change，只留动画卡片。主动型验证读 DOM class。

### 4. cross-browser：纯文档对照表

Chrome / Safari / Firefox 三家 DevTools 的面板对照、各自的独有功能（Safari 的 Layers 图层视图、Firefox 的 Grid/Fonts 面板）。反思型。

### 5. remote-debugging：文档 + 命令清单

chrome://inspect、Android USB 调试、iOS Safari 远程调试（需 Mac）。含 WebView 调试。反思型。

### 6. ai-assisted-debugging：教 prompt 技巧

含一个真实错误堆栈示例，教"如何写好调试 prompt"（给上下文、给堆栈、给复现步骤、让 AI 列假设）。反思型验证 AI 调试工作流的理解。

## Risks / Trade-offs

- **[React DevTools 扩展需要学员手动安装]** → 引导第一步就是装扩展，提供 chrome web store 链接
- **[Recorder 面板 Chrome 117+ 才有]** → 检测不到就降级为文档教学，README 注明
- **[跨浏览器 / 真机关完全无法实操]** → 诚实标注"本关为文档型"，Quiz 保持可过

## Migration Plan

- v3 进度完全兼容 v4
- 回滚：git revert

## Open Questions

- v4 是否做 Vue/Angular DevTools？—— 本应用是 React，做 Vue 关没有实操环境。留 v5 或做成纯截图教学关
