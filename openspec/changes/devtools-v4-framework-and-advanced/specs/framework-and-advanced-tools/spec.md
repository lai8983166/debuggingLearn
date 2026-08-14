## ADDED Requirements

### Requirement: React DevTools 关卡
`react-devtools` 关卡 SHALL 提供一个含 re-render 问题的 React 子树（无 memo 的重组件 + 每秒变化的 context）。引导 SHALL 教学员安装 React DevTools 扩展、用 Components 面板查 props/state、用 Profiler 录制找 re-render 元凶。提供"应用 React.memo 修复"按钮，主动型验证。

### Requirement: Recorder 关卡
`recorder-panel` 关卡 SHALL 提供一个多步表单。引导 SHALL 教 Recorder 面板的录制/回放/导出 Puppeteer 脚本流程。反思型验证。

### Requirement: Layers 关卡
`layers-panel` 关卡 SHALL 提供 10 个全部带 `will-change: transform` 的卡片（层爆炸）。引导 SHALL 教 Layers 面板的 3D 视图与层计数。提供"应用修复"按钮移除多余 will-change，主动型验证。

### Requirement: 跨浏览器关卡
`cross-browser` 关卡 SHALL 以对照表形式覆盖 Chrome / Safari / Firefox 三家 DevTools 的面板差异与各自独有功能。反思型验证。

### Requirement: 真机调试关卡
`remote-debugging` 关卡 SHALL 覆盖 chrome://inspect、Android USB 调试、iOS Safari 远程调试（需 Mac）、WebView 调试。文档型 + 反思型验证。

### Requirement: AI 辅助调试关卡
`ai-assisted-debugging` 关卡 SHALL 教调试 prompt 技巧（给上下文/堆栈/复现步骤/要求列假设），含真实错误堆栈示例。反思型验证 AI 调试工作流理解。

### Requirement: 反向测试覆盖
`teaching-bugs.test.ts` SHALL 为每个 v4 关卡新增至少一条断言。
