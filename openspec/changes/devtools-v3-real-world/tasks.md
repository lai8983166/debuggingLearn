## 1. 关卡 17：source-maps

- [ ] 1.1 实现 `src/labs/17-source-maps/Scenario.tsx`：minified JS（base64 内联）含 `//# sourceMappingURL=mock.js.map` 注释
- [ ] 1.2 guide.ts：3 条 consoleHints、4 个 tour steps（DevTools Settings → Sources → Enable source maps）、反思型 validate
- [ ] 1.3 FIX.md：source map 工作原理 + 生产环境调试技巧
- [ ] 1.4 index.ts meta（`panel: 'Sources'`、`difficulty: 1`、`prerequisite: 'service-worker-offline'`、`badgeLabel: '解压缩师'`）
- [ ] 1.5 注册到 registry.ts

## 2. 关卡 18：websocket-debug

- [ ] 2.1 Scenario：伪造"实时聊天"用 fetch polling 模拟，消息格式错误（JSON.parse 失败）
- [ ] 2.2 guide.ts：诚实声明 fetch 模拟，教 Network → WS 子面板的 Frames 视图
- [ ] 2.3 FIX.md：WS 调试速查 + 真实 WS 服务端测试
- [ ] 2.4 注册（`panel: 'Network'`、`difficulty: 1`、`prerequisite: 'source-maps'`、`badgeLabel: '实时观察员'`）

## 3. 关卡 19：cors-errors

- [ ] 3.1 Scenario：fetch `https://example.invalid/api/data`（真实跨域失败）
- [ ] 3.2 guide.ts：教读 Console 的 CORS 错误 + Network 的 Preflight OPTIONS
- [ ] 3.3 FIX.md：CORS 三件套（Origin / Methods / Headers）+ 常见 server 配置
- [ ] 3.4 注册（`panel: 'Network'`、`difficulty: 1`、`prerequisite: 'websocket-debug'`、`badgeLabel: '跨域外交官'`）

## 4. 关卡 20：third-party-cookies

- [ ] 4.1 Scenario：主域设 `SameSite=Lax` cookie，演示跨页刷新某些场景丢失
- [ ] 4.2 guide.ts：教 Application → Cookies 看 SameSite 字段；反思型 validate
- [ ] 4.3 FIX.md：SameSite 三档（None / Lax / Strict）+ Chrome 默认 + 第三方 cookie 终结时间表
- [ ] 4.4 注册（`panel: 'Application'`、`difficulty: 1`、`prerequisite: 'cors-errors'`、`badgeLabel: 'Cookie 法务'`）

## 5. 关卡 21：rendering-panel

- [ ] 5.1 Scenario：滚动页面含多个 Layout Shift 元素（图片无尺寸 + 动态 banner + 字体加载）
- [ ] 5.2 复用 WebVitalsMeter 组件显示 CLS 高
- [ ] 5.3 guide.ts：教 Cmd+Shift+P → "Show Rendering" → Layout Shift Regions / Paint Flashing
- [ ] 5.4 FIX.md：CLS 常见原因 + 字体加载策略（`font-display`）
- [ ] 5.5 注册（`panel: 'Rendering'`、`difficulty: 2`、`prerequisite: 'third-party-cookies'`、`badgeLabel: '抖动终结者'`）

## 6. 关卡 22：saas-dashboard（综合）

- [ ] 6.1 Scenario：BuggyAnalytics 仪表盘，5 个混合 bug
  - DOM 错乱（flex: 1 无容器宽度）
  - 内存泄漏（图表 mount 时空 cleanup）
  - API 失败（/api/metrics 500 被吞）
  - a11y（对比度 1.5:1、缺 aria-label）
  - 视觉抖动（refresh force reflow）
- [ ] 6.2 5 个"应用 X 修复"按钮 + 模块级 phase 计数器，validate 5 阶段
- [ ] 6.3 guide.ts：不直接告诉用哪个面板，分阶段引导
- [ ] 6.4 FIX.md：5 个 bug 的修复思路 + "诊断真实项目" workflow
- [ ] 6.5 注册（`panel: 'Comprehensive'`、`difficulty: 3`、`prerequisite: 'rendering-panel'`、`badgeLabel: 'SaaS 救火队长'`）

## 7. 反向测试 + 文档

- [ ] 7.1 `teaching-bugs.test.ts` 追加 6 条 v3 反向测试
- [ ] 7.2 README 关卡地图扩到 22 行（v3 单独一节）
- [ ] 7.3 `npm run build` + `npm test` 全过
- [ ] 7.4 smoke test：访问每关路由 HTTP 200

## 8. 提交

- [ ] 8.1 按关卡分多次 git commit（每关或每两关一次）
- [ ] 8.2 规划文件作为第一个 commit
