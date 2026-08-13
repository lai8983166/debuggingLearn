## ADDED Requirements

### Requirement: 关卡独立可访问
每个关卡 SHALL 拥有独立路由 `/labs/:slug`，学员可通过 URL 直接访问任意已解锁关卡。未解锁关卡访问时 SHALL 重定向到关卡列表页并提示需要先完成前置关卡。

#### Scenario: 直接访问已解锁关卡
- **WHEN** 学员访问 `/labs/sources-breakpoint`，且该关卡已解锁
- **THEN** 系统 SHALL 渲染该关卡的场景页面，并初始化引导

#### Scenario: 直接访问未解锁关卡
- **WHEN** 学员访问 `/labs/memory-leak`，但前置关卡尚未完成
- **THEN** 系统 SHALL 重定向到 `/labs`，并显示提示"请先完成前置关卡"

### Requirement: 关卡可复现的 Bug
每个关卡 SHALL 包含至少一个明确的、可复现的 `[TEACHING_BUG]` 缺陷，且该缺陷 MUST 能通过指定的 DevTools 面板观测到。每个 `[TEACHING_BUG]` MUST 在源码中以注释 `// [TEACHING_BUG]` 标注。

#### Scenario: Bug 可复现
- **WHEN** 学员刷新关卡页面
- **THEN** 该关卡的 bug 表现 SHALL 一致地出现（视觉错误 / 报错 / 错误数据 / 卡顿 / 状态丢失等）

#### Scenario: Bug 标注可追溯
- **WHEN** 维护者在源码中搜索 `[TEACHING_BUG]`
- **THEN** SHALL 能定位到每个关卡埋设的所有 bug 及其说明注释

### Requirement: 覆盖 DevTools 主要面板
系统 SHALL 至少提供 8 个关卡，分别覆盖以下 DevTools 面板/能力：Console 报错排查、Elements DOM/样式、Sources 断点调试、Network 请求排查、Application 存储、Performance 性能分析、Memory 内存分析、综合多面板协作。

#### Scenario: 8 个关卡齐备
- **WHEN** 查看关卡注册表 `src/labs/registry.ts`
- **THEN** SHALL 至少包含 8 个 Lab 条目，每个 Lab 的 `panel` 字段标注其训练的 DevTools 面板

### Requirement: 关卡元数据
每个关卡 SHALL 声明结构化元数据：`slug`（路由标识）、`title`（标题）、`panel`（训练的 DevTools 面板）、`difficulty`（难度 1-3）、`learningGoal`（学习目标一句话）、`prerequisite`（前置关卡 slug，可为空）。

#### Scenario: 关卡列表渲染
- **WHEN** 学员访问关卡列表页 `/labs`
- **THEN** 每个关卡卡片 SHALL 显示标题、训练面板、难度、学习目标，并按难度从低到高排序

### Requirement: 关卡完成判定
每个关卡 SHALL 提供一个 `validate()` 函数（或等价的反思型问题集），返回 `{ passed: boolean; feedback: string }`。学员点击"检查答案"按钮时系统 MUST 调用该函数并以可视化反馈呈现结果。

#### Scenario: 验证通过
- **WHEN** 学员点击"检查答案"，且 `validate()` 返回 `{ passed: true }`
- **THEN** 系统 SHALL 展示成功反馈、修复说明 `FIX.md` 内容，并通知进度系统颁发徽章/解锁下一关

#### Scenario: 验证未通过
- **WHEN** 学员点击"检查答案"，且 `validate()` 返回 `{ passed: false }`
- **THEN** 系统 SHALL 展示 `feedback` 字段的内容作为下一步提示，不修改进度状态

### Requirement: 关卡新增成本低
新增一个关卡 SHALL 仅需：新建 `src/labs/<slug>/` 目录、实现场景与引导、在 `registry.ts` 追加一行。MUST NOT 需要修改框架级代码。

#### Scenario: 新增关卡无侵入
- **WHEN** 开发者按规范新增关卡文件夹并注册
- **THEN** 关卡列表 SHALL 自动出现新关卡，且不修改任何引导框架或进度系统源码
