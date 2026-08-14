## Why

v1+v2 共 16 关覆盖了"单面板单 bug"练习。但真实项目里 bug 不会按面板分类——一个 SaaS 仪表盘可能同时有视觉错乱、内存泄漏、API 失败、a11y 问题，学员得自己判断该用哪个面板。同时还有几个高频但被忽略的主题：Source Maps（调试压缩代码）、WebSocket、CORS、第三方 Cookie、Rendering 面板。本包补齐这两块。

## What Changes

新增 6 个 v3 关卡（编号 17-22）：

1. **`source-maps`**（★）— 故意 minify 的 bundle + source map 缺失，学员要在 Sources 里手动启用 source map 才能看原代码
2. **`websocket-debug`**（★）— 一个伪造的实时聊天场景，WS 消息格式错误；用 Network → WS 子面板看 frame
3. **`cors-errors`**（★）— fetch 跨域请求被拦，看 Console 的 CORS 错误 + Network 的 Preflight
4. **`third-party-cookies`**（★）— 嵌入 iframe 设置 cookie 但 SameSite=Lax 导致丢；Application 看 Cookie 的 SameSite 字段
5. **`rendering-panel`**（★★）— Layout Shift 区域可视化 + Paint Flashing，找出"为什么滚动卡"
6. **`saas-dashboard`**（★★★）— 一个虚构 SaaS 仪表盘同时藏 5 个混合 bug（DOM 错乱 / 内存泄漏 / API 失败 / a11y / 视觉抖动），学员自己挑面板诊断

每关遵循现有约定：`[TEACHING_BUG]` 标注、四通道引导、反思型/主动型验证、反向测试。新增徽章 6 个。

## Capabilities

### New Capabilities
- `real-world-scenarios`: v3 真实世界场景包——6 个面向工业界高频痛点的关卡，含 Source Maps、WebSocket、CORS、第三方 Cookie、Rendering 面板、以及多 bug 混合的 SaaS 仪表盘

### Modified Capabilities
- `lab-scenarios`: 关卡总数下限从 16 提升到 22；解锁链从 v2 `service-worker-offline` 延伸到 v3 全部 6 关

## Impact

- **新增代码**：6 个 `src/labs/17-22-*/`，每个含 Scenario.tsx / guide.ts / FIX.md / index.ts
- **修改代码**：`registry.ts`（追加 6 条）、`teaching-bugs.test.ts`（追加 6 条反向测试）、`README.md`（关卡地图扩到 22 行）
- **依赖**：无新增；MSW 扩展为 WebSocket 关卡提供 mock（用 `ws` mock 库，已是 msw 间接依赖）
- **进度数据**：v3 兼容现有 schema，无需迁移
