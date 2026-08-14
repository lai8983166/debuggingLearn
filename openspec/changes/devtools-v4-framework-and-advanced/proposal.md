## Why

v1-v3 共 22 关覆盖了 DevTools 主线和真实世界场景。第二梯队的框架生态（React DevTools）、高级面板（Recorder / Layers）、跨浏览器工具差异、真机调试、AI 辅助调试是工业界进阶技能——特别是 React DevTools 的 Profiler 和 Layers 的 GPU 合成视图，是中高级前端面试和性能优化的必学项。

## What Changes

新增 6 个 v4 关卡（编号 23-28）：

1. **`react-devtools`**（★★）— 本应用就是 React！学员装 React DevTools 扩展直接调试我们的 Scenario。Components 面板看 props/state、Profiler 找 re-render 元凶、"apply React.memo 修复"按钮
2. **`recorder-panel`**（★★）— Recorder 面板录制 UI 操作流、回放、导出 Puppeteer 脚本做 E2E
3. **`layers-panel`**（★★）— Layers 3D 视图看 GPU 合成层、`will-change` 滥用导致层爆炸、修复按钮
4. **`cross-browser`**（★★）— Safari Web Inspector / Firefox DevTools 与 Chrome 的差异对照（反思型）
5. **`remote-debugging`**（★★）— chrome://inspect 真机调试 Android、iOS Safari via Mac（文档型 + 反思）
6. **`ai-assisted-debugging`**（★★）— 如何把堆栈/CSS 计算值/内存快照喂给 AI 让它帮你诊断（新技能）

## Capabilities

### New Capabilities
- `framework-and-advanced-tools`: v4 框架与高级工具包——React DevTools、Recorder、Layers、跨浏览器、真机调试、AI 辅助调试

### Modified Capabilities
- `lab-scenarios`: 关卡总数下限从 22 提升到 28；解锁链从 v3 `saas-dashboard` 延伸到 v4 全部 6 关

## Impact

- **新增代码**：6 个 `src/labs/23-28-*/`，每个含 Scenario.tsx / guide.ts / FIX.md / index.ts
- **修改代码**：`registry.ts`（追加 6 条）、`teaching-bugs.test.ts`（追加反向测试）、`README.md`
- **依赖**：无新增；react-devtools 关利用本应用自身是 React 的事实
- **验证模式**：react-devtools / layers-panel 有"应用修复"按钮（主动型）；其余为反思型
