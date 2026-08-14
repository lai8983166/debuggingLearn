# 关卡 28 速查：AI 辅助调试（v4 结业）

## AI 调试的工作流

```
发现问题（DevTools）
    ↓ 收集上下文（Console 堆栈 / Network 请求 / Elements DOM / 相关代码）
    ↓ 写结构化 prompt（四要素）
    ↓ AI 返回：解释 + 假设列表 + 验证方法 + 修复建议
    ↓ 你用 DevTools 验证假设
    ↓ 确认后修复 → 验证修复
```

**关键**：AI 不是替代你调试——它是"提出假设的加速器"。验证仍靠 DevTools。

## 好调试 prompt 的四要素

### ① 完整堆栈
```
TypeError: Cannot read properties of undefined (reading 'map')
    at MetricsTable (MetricsTable.tsx:23:18)
    ...
```
不要只贴第一行——调用链上层往往是真正的病灶。

### ② 相关代码片段
```
MetricsTable.tsx:20-25：
export function MetricsTable({ data }) {
  return <table>{data.map(...)}</table>;
}
```
报错行 ±10 行足够。标注文件名行号。

### ③ 复现步骤
"首次进入页面报错；刷新一次后正常" —— 暗示异步时序（首次 fetch 未完成，data 是 undefined）。

### ④ 明确输出要求
```
请：
1. 解释错误的直接原因
2. 列出 2-3 个可能根因（按可能性排序）
3. 每个假设的验证方法
4. 推荐修复（含代码）
```

## 各 DevTools 面板对应的"可喂给 AI"内容

| 面板 | 拷什么 | 对 AI 的价值 |
| --- | --- | --- |
| Console | 完整堆栈 / warning | 定位位置 |
| Network | 失败请求的 Headers + Response | API 问题根因 |
| Elements | 报错元素的 outerHTML + computed style | CSS/DOM 问题 |
| Performance | 掉帧时间线的文字描述（哪个函数最宽） | 性能瓶颈 |
| Memory | 泄漏对象的 Retainers 链描述 | 泄漏根因 |
| Application | cookie / localStorage 键值对 | 状态问题 |

## 进阶技巧

- **让 AI 反问**："如果信息不够，请先问我需要什么"——避免它瞎猜
- **多 AI 对照**：同一 prompt 问 Claude + ChatGPT，答案收敛的更可信
- **贴 diff 而非全文**："我改了 X，现在报 Y" 比 "我的代码报 Y" 定位快
- **AI 的代码要 review**：它给的修复可能有边界条件遗漏 / 安全问题

## AI 调试的边界

**AI 擅长**：
- 解释陌生错误信息（CUDA 错误码、C++ 链接错误、正则）
- 列假设清单（你可能思维定势）
- 解释别人的代码 / 老代码
- 写验证用的小测试

**AI 不擅长**：
- 需要真实运行时信息的（内存快照细节、竞态时序）——必须你从 DevTools 拿
- 大项目跨文件的影响分析（上下文放不下）
- 一次到位的复杂修复——迭代式（改一点验一点）更可靠

## 全站 28 关回顾

v1（8 关）Console/Elements/Sources/Network/Application/Performance/Memory/综合
v2（8 关）Lighthouse/Coverage/Device Mode/Web Vitals/Async/Animations/Command Menu/SW
v3（6 关）Source Maps/WebSocket/CORS/Cookie/Rendering/SaaS 综合
v4（6 关）React DevTools/Recorder/Layers/跨浏览器/真机/AI 辅助

恭喜完成全部 28 关 🎓

## DevTools 技能收获

- AI 调试 prompt 四要素
- 从各 DevTools 面板提取上下文喂 AI
- 把 AI 回答当假设、用 DevTools 验证的工作流
