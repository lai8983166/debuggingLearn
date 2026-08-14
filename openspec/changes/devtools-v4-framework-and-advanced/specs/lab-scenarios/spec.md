## MODIFIED Requirements

### Requirement: 覆盖 DevTools 主要面板
系统 SHALL 至少提供 28 个关卡（v1 8 + v2 8 + v3 6 + v4 6）：
- **v4 框架与高级工具（6 关，新增）**：React DevTools、Recorder、Layers、跨浏览器、真机调试、AI 辅助调试。

#### Scenario: 28 关齐备
- **WHEN** 查看 `src/labs/registry.ts`
- **THEN** SHALL 至少包含 28 个 Lab 条目

### Requirement: v4 关卡解锁链
v4 第 23 关（`react-devtools`）的 `prerequisite` SHALL 为 v3 最后一关 `saas-dashboard`。其余 v4 关卡线性链接。

#### Scenario: v3→v4 衔接
- **WHEN** 学员完成 `saas-dashboard`
- **THEN** `react-devtools` SHALL 解锁
