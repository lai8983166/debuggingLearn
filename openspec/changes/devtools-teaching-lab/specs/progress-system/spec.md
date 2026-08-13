## ADDED Requirements

### Requirement: 进度数据模型
进度系统 SHALL 维护一个 `Progress` 结构：`completed: string[]`（已通关 lab slug 集合）、`badges: string[]`（已获徽章 id）、`currentLab: string`（当前所在关卡 slug）、`lastActiveAt: number`（毫秒时间戳）。该结构 MUST 持久化到 `localStorage` 的 `devtools-lab-progress-v1` 键下。

#### Scenario: 首次访问初始化
- **WHEN** 学员首次访问应用且 `localStorage` 无该 key
- **THEN** 系统 SHALL 初始化为 `{ completed: [], badges: [], currentLab: 'console-errors', lastActiveAt: <now> }` 并写入

#### Scenario: 已有数据恢复
- **WHEN** 学员刷新页面，`localStorage` 存在合法 `Progress`
- **THEN** 系统 SHALL 加载该数据并据此恢复 `currentLab`、解锁状态、徽章

### Requirement: 关卡解锁逻辑
关卡 `i`（i > 0）SHALL 仅在前一关卡 `i-1` 的 slug 出现在 `completed` 中时解锁。第 0 关 SHALL 默认解锁。学员点击未解锁关卡时 SHALL 被拒绝进入并提示前置关卡。

#### Scenario: 解锁下一关
- **WHEN** 学员完成关卡 `i`，`completed` 加入 slug_i
- **THEN** 关卡 `i+1` SHALL 立即变为解锁状态，关卡卡片上的"锁定"标识 SHALL 消失

#### Scenario: 未解锁关卡拒绝访问
- **WHEN** 学员点击锁定的关卡卡片
- **THEN** 系统 SHALL 不跳转路由，并显示提示"请先完成：<前置关卡标题>"

### Requirement: 徽章颁发
每个关卡 SHALL 关联至少一个徽章 id。学员首次完成某关时 SHALL 将该徽章加入 `badges`。重复完成同一关卡 SHALL NOT 重复颁发徽章。

#### Scenario: 首次通关颁发徽章
- **WHEN** 学员首次通过 `network-failing-api` 关卡
- **THEN** `badges` SHALL 加入 `badge:network-failing-api`，并触发徽章动画展示

#### Scenario: 重复通关不重复颁发
- **WHEN** 学员再次通过同一已通关关卡
- **THEN** `badges` 数组 SHALL 不变，不触发徽章动画

### Requirement: 进度展示
系统 SHALL 在首页与关卡列表展示进度条（已完成关卡数 / 总关卡数）和已获徽章网格。进度条 SHALL 在通关瞬间实时更新。

#### Scenario: 进度条渲染
- **WHEN** 学员完成 3 关，共 8 关
- **THEN** 进度条 SHALL 显示 `3/8` 及 37.5% 填充

#### Scenario: 实时更新
- **WHEN** 学员通过当前关卡
- **THEN** 进度条 SHALL 在 200ms 内更新到新值，无需手动刷新

### Requirement: 数据导出与重置
系统 SHALL 提供"导出进度"功能（下载 JSON 文件）和"重置进度"功能（清空 localStorage 并回到初始态）。重置 SHALL 需要二次确认。

#### Scenario: 导出进度
- **WHEN** 学员点击"导出进度"
- **THEN** 浏览器 SHALL 下载一个包含完整 `Progress` 对象的 JSON 文件，文件名形如 `devtools-lab-progress-<timestamp>.json`

#### Scenario: 重置需确认
- **WHEN** 学员点击"重置进度"
- **THEN** 系统 SHALL 弹出确认对话框"确定清除所有进度？此操作不可撤销"；只有点击"确认"才执行清空

### Requirement: 进度版本化
`Progress` 数据 SHALL 包含一个 `version` 字段（当前为 `1`）。当未来 schema 变更时，系统 MUST 能通过版本号检测旧数据并执行迁移或安全降级（不崩溃）。

#### Scenario: 旧版本数据降级
- **WHEN** `localStorage` 中的数据 `version` 为未知值（如未来的 `2`）
- **THEN** 系统 SHALL 检测到版本不匹配，不崩溃，提示"进度数据版本不兼容，建议重置"，并允许学员手动重置

### Requirement: 持久化可靠性
进度更新 SHALL 同步写入 `localStorage`，写入失败（如配额超限、隐私模式禁用）时 SHALL 降级到内存中并 Toast 提示"进度无法持久化，刷新后将丢失"。

#### Scenario: localStorage 写入失败
- **WHEN** `localStorage.setItem` 抛出异常
- **THEN** 系统 SHALL 捕获异常，在内存中保留进度，并 Toast 提示学员
