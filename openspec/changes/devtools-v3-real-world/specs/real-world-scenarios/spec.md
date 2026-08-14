## ADDED Requirements

### Requirement: Source Maps 关卡
`source-maps` 关卡 SHALL 提供一段故意 minify 的 JS（base64 内联），含 `//# sourceMappingURL=` 注释指向人造 .map。引导 SHALL 教学员在 DevTools Settings → Sources 启用 source maps，并通过反思型问题验证学员理解。

### Requirement: WebSocket 关卡
`websocket-debug` 关卡 SHALL 演示一个伪造的实时聊天场景：用 fetch polling 模拟 WS（godbolt-style 诚实声明），消息格式错误。引导 SHALL 教学员 Network → WS 子面板的 Frames 视图（注明本关用 fetch 模拟简化，真实 WS 看同名子面板）。

### Requirement: CORS 关卡
`cors-errors` 关卡 SHALL 让 fetch 真实失败地请求一个 cross-origin 端点（`https://example.invalid/api` 或 MSW 模拟的 cross-origin）。Console 必须显示真实 CORS 错误，Network 必须显示失败请求 + Preflight OPTIONS。

### Requirement: 第三方 Cookie 关卡
`third-party-cookies` 关卡 SHALL 在主域设一个 `SameSite=Lax` 的 cookie，演示刷新后某些跨页场景丢失。引导 SHALL 教 Application 面板的 Cookie 视图 + SameSite 字段含义。验证用反思型。

### Requirement: Rendering 面板关卡
`rendering-panel` 关卡 SHALL 提供一个滚动的页面，含多个会触发 Layout Shift 的元素（图片无尺寸、动态 banner、字体加载）。WebVitalsMeter SHALL 显示 CLS 高。引导 SHALL 教 Rendering 面板的 "Layout Shift Regions" / "Paint Flashing" / "Core Web Vitals" 选项。

### Requirement: SaaS Dashboard 综合关
`saas-dashboard` 关卡 SHALL 提供一个虚构"BuggyAnalytics"仪表盘，**同时**埋设 5 个混合 bug：
1. DOM 错乱（卡片 flex 没设容器宽度）
2. 内存泄漏（图表 mount 时空 cleanup）
3. API 失败（/api/metrics 500 被吞）
4. a11y 问题（低对比度 + 缺 aria-label）
5. 视觉抖动（refresh 时 force reflow）

每 bug 配一个"应用 X 修复"按钮（页面侧模拟修复）。验证用模块级 phase 计数器，每次 validate 推进一个 phase；5 个 phase 全过才返回 `passed: true`。

#### Scenario: 单关多 bug 解锁
- **WHEN** 学员完成第 5 个 bug 的修复
- **THEN** `passed: true` 返回，触发通关

### Requirement: 反向测试覆盖
`teaching-bugs.test.ts` SHALL 为每个 v3 关卡新增至少一条断言，验证 `[TEACHING_BUG]` 标记 + 关键 bug 代码片段仍在源码中。
