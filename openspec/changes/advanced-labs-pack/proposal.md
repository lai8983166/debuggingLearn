## Why

v1 的 8 关覆盖了 DevTools 的"主线面板"，但工业界高频使用的几项能力还没练到：Lighthouse 综合评分、Coverage 死代码分析、Mobile 模拟 + 网络限速、Web Vitals 三大核心指标（LCP/CLS/INP）、异步竞态条件、Animations 时间线、Command Menu/Snippets 效率、Service Worker 离线缓存。这些是面试和真实业务里"必须会但学校不教"的技能，且每项都能用现有的引导框架承载，无需改架构。

## What Changes

新增 **8 个进阶关卡**（编号 09-16），按建议通关顺序：

1. `lighthouse-audit` — 一个性能/可访问性/SEO 都扣分的页面，跑 Lighthouse 找主要扣分项
2. `coverage-unused-code` — 一个引入了大库但只用到 10% 的页面，Coverage 面板定位未使用代码
3. `mobile-emulation` — 桌面下表现良好但移动端布局崩 + Slow 3G 加载慢，Device Mode + Network throttle 排查
4. `web-vitals` — 同一页面埋 3 个 bug：LCP 慢（大图未优化）、CLS 高（图片无尺寸）、INP 高（点击响应慢）；分 3 阶段验证
5. `async-race-condition` — 快速切换 tab 时旧 fetch 覆盖新结果，教异步堆栈 + AbortController
6. `animations-panel` — 卡顿的 CSS keyframes，用 Animations 面板看时间线、改 easing 验证
7. `command-menu-snippets` — 无 bug 纯效率关，闯关式介绍 Command Menu（Cmd+K）10+ 快捷操作和 Sources Snippets
8. `service-worker-offline` — Service Worker 缓存策略 bug，Application 面板 Service Workers + Cache Storage 子面板

配套调整：
- `registry.ts` 追加 8 个 Lab
- 新增的"反思型多阶段验证"和"任务清单式验证"在现有 `validate()` 函数内实现，不修改引导框架
- `package.json` 新增 `lighthouse-core`（仅开发依赖用于本地评分参考）—— 不，**不引入新依赖**，Lighthouse 由浏览器内置提供
- v2 第 1 关前置 = v1 最后一关 `comprehensive`
- BadgeGrid 与 ProgressBar 自动适配新关卡（订阅 store，无需改组件）
- 反向测试新增 8 条断言保护 v2 教学 bug

不做：
- 不改 v1 现有 8 关的内容（保持向后兼容）
- 不引入新 NPM 依赖（保持纯静态可托管）
- 不做"跳过 v1 直接到 v2"的诊断测试（v3 工作）

## Capabilities

### New Capabilities
- `advanced-panel-labs`: 进阶关卡包——8 个覆盖 Lighthouse/Coverage/Mobile/Web Vitals/异步竞态/Animations/Command Menu/Service Worker 的高级调试场景，作为 v1 核心关卡的延伸课程

### Modified Capabilities
- `lab-scenarios`: 关卡总数下限从 8 提升至 16（8 核心 + 8 进阶）；解锁链从 v1 `comprehensive` 延伸到 v2 全部 8 关

## Impact

- **新增代码**：`src/labs/09-lighthouse-audit/` 到 `src/labs/16-service-worker-offline/`，每个含 Scenario/guide/FIX/index 4 件套
- **修改代码**：`src/labs/registry.ts`（追加 import + 数组扩展）、`src/labs/teaching-bugs.test.ts`（追加 8 条反向测试）、`README.md`（关卡地图扩展为 16 行）
- **依赖**：无新增（Lighthouse/Coverage/Device Mode 都是 DevTools 内置）
- **进度数据**：无需 schema 变更。`progress-system` 现有的 `version: 1` 完全兼容新关卡——`completed` 数组自然扩展。BadgeGrid 与 ProgressBar 订阅 `getAllLabs()` 自动适配
- **部署**：纯静态产物体积预计 +60-100KB（gzip），可接受
- **可访问性**：所有新教学 bug 同样用 `[TEACHING_BUG]` 标注
