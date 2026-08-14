## Context

v3 在 v1+v2 的稳定框架上扩展，不改架构。最大挑战是 `saas-dashboard`——一个 Scenario 同时藏 5 个混合 bug，需要新的"诊断流程"引导模式：不告诉学员用哪个面板，让学员先观察现象、自己选面板，验证时按 bug 类型分组判断。

约束：
- 不引入新依赖（MSW 已有；ws 用原生 WebSocket + MSW 即可）
- v3 第 1 关前置 = v2 最后一关 `service-worker-offline`
- SaaS dashboard 的 5 个 bug 必须各自可独立验证（不能一次验证全部）

## Goals / Non-Goals

**Goals:**
- 6 个新关卡覆盖 Source Maps / WebSocket / CORS / 3rd-party Cookie / Rendering / 综合 SaaS
- SaaS dashboard 的多 bug 用模块级 phase 计数器，但每次 validate 只推进一个 bug
- v2 学员的进度自然延伸到 v3，不破坏现有数据
- 全部 bug 用 `[TEACHING_BUG]` 标注 + 反向测试

**Non-Goals:**
- 不做 React DevTools / Vue DevTools（v4）
- 不做 Recorder / Layers（v4）
- 不做真机调试（v4）
- 不做 AI 辅助调试（v4）

## Decisions

### 1. Source Maps 关：让学员"修复"启用

Scenario 内嵌一段被 minify 的 JS（base64 内联，避免真做 build）。学员在 DevTools Settings → Sources → Enable JavaScript source maps 启用后，能看到原代码（人造 .map 文件）。修复机制：在 Scenario 里检测 `//# sourceMappingURL=` 注释 + 学员是否手动加载了 .map。

由于无法检测学员是否真在 DevTools 里点了"enable source maps"按钮（浏览器不暴露），用反思型 + 一个"应用 source map"按钮替代。

### 2. WebSocket 关：MSW 不直接支持 WS，用原生 mock

MSW 2.x 的 ws 支持还在实验阶段。改用：Scenario mount 时连一个**伪造的 WS 服务器**（用 `mswjs` 不行，改用一个 in-memory event emitter 假装是 WS）。学员在 DevTools Network → WS 子面板能看到——其实不是真的 WS 连接，而是我们 fetch 的伪装。

更简洁的方案：**真的开一个 WS 连接到本应用**。Docusaurus / Vite dev server 不支持 WS server，但可以用 client-side 假装：用一个 EventTarget 包装，让它在 Network 面板里**不**显示。但这就失去了教学价值（Network 面板看不到东西）。

最终方案：**使用 fetch polling 模拟 WS 视觉效果** + 在引导文字里诚实告诉学员"为了教学简化，下面是 fetch 模拟，真实 WS 在 Network 面板的 WS 子分类里看 Frames"。这是务实折衷。

### 3. CORS 关：跨域 fetch 真的会失败

fetch 一个**真实不存在的 cross-origin 端点**（如 `https://example.invalid/api/data`）。浏览器真的会触发 CORS preflight 失败。Console 显示真实 CORS 错误。Network 显示真实失败请求。无需 mock。

### 4. 第三方 Cookie 关：iframe 嵌入

Scenario 渲染一个 `<iframe>` 嵌入到一个假域名（用 `srcdoc` 模拟）。iframe 里"设置" cookie 但 SameSite=Lax 导致下次刷新丢。但 sandbox 限制下 iframe 设置 cookie 本来就受限——改用反思型验证：让学员在 Application 面板看主域的 cookie SameSite 字段。

### 5. Rendering 面板关：真实 Layout Shift

页面滚动时多个 image 加载导致 layout shift。Scenario 故意：
- 图片无 width/height
- 动态注入的 banner 不预留空间
- 字体加载导致文字位移

WebVitalsMeter 显示 CLS 高。学员用 Rendering 面板 → "Layout Shift Regions" 看哪些区域在抖。

### 6. SaaS Dashboard：5 个混合 bug

一个虚构的"BuggyAnalytics"仪表盘：
1. **DOM 错乱**：图表卡片用 `flex: 1` 但容器没设宽度，桌面下挤压
2. **内存泄漏**：每个图表 mount 时注册 setInterval 但 cleanup 是空的
3. **API 失败**：/api/metrics 返回 500，被静默吞掉
4. **a11y 问题**：图表用纯色对比度 1.5:1；按钮无 aria-label
5. **视觉抖动**：数据 refresh 时整个仪表盘闪一下（force reflow）

5 个 bug 用 `phase` 计数器：每次 validate 检查"是否所有该 phase 的 bug 都修了"，学员手动用"应用 X 修复"按钮模拟修复。验证模式与 web-vitals 关一致。

### 7. 关卡解锁链

17 source-maps → 18 websocket → 19 cors → 20 third-party-cookies → 21 rendering-panel → 22 saas-dashboard（线性）

## Risks / Trade-offs

- **[Source Maps 关可能不能真正用 DevTools 启用]** → 学员可能看不到原代码。**缓解**：提供"应用 source map"按钮在页面侧模拟效果
- **[WebSocket 关用 fetch 模拟可能误导学员]** → 诚实标注"这是 fetch 模拟，真实 WS 看 Frames"
- **[CORS 用真实跨域请求可能被网络拦截]** → 如果 `example.invalid` 不通，回退到本地 MSW 模拟（也走 cross-origin 模拟）
- **[SaaS dashboard 的内存泄漏可能影响其他关]** → 限定泄漏到模块级，unmount 时手动释放
- **[Rendering 关的 CLS 受机器速度影响]** → 用 WebVitalsMeter 实时显示，且故意把 bug 做得明显（图片宽度变化 200px+）

## Migration Plan

- v2 进度数据完全兼容 v3，无 schema 改动
- v3 全部代码新增在 `src/labs/17-22/`，回滚只需 git revert

## Open Questions

- SaaS dashboard 5 个 bug 是太多还是太少？6 个可能更平衡（一个面板一个）
- 第三方 Cookie 关是否值得做？Chrome 已经默认禁用，技术细节在变化。**决定做但限定在概念教学**
