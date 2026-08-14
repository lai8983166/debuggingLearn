## MODIFIED Requirements

### Requirement: 覆盖 DevTools 主要面板
系统 SHALL 至少提供 22 个关卡（v1 8 + v2 8 + v3 6）：
- **v3 真实世界（6 关，新增）**：Source Maps、WebSocket、CORS、第三方 Cookie、Rendering、综合 SaaS Dashboard。

#### Scenario: 22 关齐备
- **WHEN** 查看 `src/labs/registry.ts`
- **THEN** SHALL 至少包含 22 个 Lab 条目，其中 6 个 `panel` 字段为 v3 列表

### Requirement: v3 关卡解锁链
v3 第 17 关（`source-maps`）的 `prerequisite` SHALL 为 v2 最后一关 `service-worker-offline`。其余 v3 关卡的 `prerequisite` SHALL 指向前一关 slug，形成线性解锁链。

#### Scenario: v2→v3 衔接
- **WHEN** 学员完成 v2 最后一关 `service-worker-offline`
- **THEN** `source-maps` 关卡卡片 SHALL 从锁定变为可进入
