## MODIFIED Requirements

### Requirement: 覆盖 DevTools 主要面板
系统 SHALL 至少提供 16 个关卡，覆盖以下 DevTools 面板/能力：

**v1 核心（8 关，已有）**：Console 报错、Elements DOM、Sources 断点、Network 请求、Application 存储、Performance 性能、Memory 内存、综合多面板协作。

**v2 进阶（8 关，新增）**：Lighthouse 综合评分、Coverage 死代码分析、Device Mode 移动模拟 + 网络限速、Web Vitals（LCP/CLS/INP）、异步竞态调试、Animations 时间线、Command Menu + Snippets 效率、Service Worker 离线缓存。

#### Scenario: 16 个关卡齐备
- **WHEN** 查看 `src/labs/registry.ts`
- **THEN** SHALL 至少包含 16 个 Lab 条目，其中 8 个 `panel` 字段为 v2 列表（Lighthouse / Coverage / Device Mode / Web Vitals / Async / Animations / Command Menu / Service Worker）

### Requirement: 关卡完成判定
（v1 内容不变）每个关卡 SHALL 提供一个 `validate()` 函数（或等价的反思型问题集），返回 `{ passed: boolean; feedback: string }`。学员点击"检查答案"按钮时系统 MUST 调用该函数并以可视化反馈呈现结果。

**v2 补充**：`validate()` 函数 MAY 内部维护多阶段状态（如 web-vitals 的三阶段），从外部观察仍是单次返回 `{ passed, feedback }` 接口。

#### Scenario: 多阶段 validate 仍符合接口
- **WHEN** v2 关卡的 `validate()` 内部维护 phase 状态
- **THEN** 调用方 SHALL 仍只看到 `{ passed: boolean; feedback: string }` 返回值，无需感知阶段
- **AND** 每次"检查答案"按钮点击 SHALL 推进至多一阶段，三阶段全过才返回 `passed: true`

#### Scenario: 验证通过
- **WHEN** 学员点击"检查答案"，且 `validate()` 返回 `{ passed: true }`
- **THEN** 系统 SHALL 展示成功反馈、修复说明 `FIX.md` 内容，并通知进度系统颁发徽章/解锁下一关

#### Scenario: 验证未通过
- **WHEN** 学员点击"检查答案"，且 `validate()` 返回 `{ passed: false }`
- **THEN** 系统 SHALL 展示 `feedback` 字段的内容作为下一步提示，不修改进度状态

## ADDED Requirements

### Requirement: v2 关卡的截图引导
对于纯 DevTools 操作的步骤（Lighthouse 跑分、Coverage 启动、Device Mode 切换、Animations 时间线查看等），Tour 步骤 SHALL 通过 `devToolsScreenshot` 字段嵌入截图缩略图与简明操作文字，不依赖页面侧高亮。

#### Scenario: 截图占位与替换
- **WHEN** Tour 步骤配置了 `devToolsScreenshot: 'lighthouse-run'`
- **THEN** 浮窗 SHALL 渲染该截图的占位组件
- **AND** 占位组件 SHALL 在 `src/assets/devtools-screenshots/<name>.png` 存在时自动切换为真实截图（v2 首期允许保留占位）
