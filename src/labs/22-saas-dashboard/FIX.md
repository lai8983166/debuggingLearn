# 关卡 22 修复说明：SaaS Dashboard 综合关（结业）

## 5 个 bug 的根因

### 1. DOM 错乱（Elements 面板）

```tsx
<div className="saas__grid">
  <div className="saas__card" style={{ flex: 1 }}>...</div>
  ...
</div>
```

flex 容器没设 `flex-wrap: wrap`，三个卡片在桌面下被强行挤在一行。

**修复**：加 `flex-wrap: wrap` 或给卡片 `min-width`。

### 2. 内存泄漏（Memory / Performance 面板）

```tsx
useEffect(() => {
  intervalRef.current = window.setInterval(() => {
    for (let i = 0; i < 100; i++) leakPool.push(Math.random());
  }, 1000);

  return () => {
    // 空——这就是泄漏
  };
}, []);
```

**修复**：

```tsx
return () => {
  if (intervalRef.current) window.clearInterval(intervalRef.current);
};
```

### 3. API 失败（Network 面板）

```tsx
fetch('/api/metrics')
  .then((r) => r.json())    // 没 check res.ok，500 也进 then
  .then((data) => setMetrics(data.metrics))
  .catch(() => {
    // 静默吞掉
  });
```

**修复**：

```tsx
.then((r) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
})
.then(...)
.catch((err) => {
  console.error('[App] metrics failed:', err);
  setErrorState('数据加载失败');
});
```

### 4. a11y 问题（Lighthouse / Rendering 面板）

```css
.saas__metric {
  color: #6b7280;        /* 灰字 */
  background: #4b5563;   /* 灰底 */
  /* 对比度 1.5:1，远低于 4.5:1 标准 */
}
```

```tsx
<button className="saas__icon-btn">?</button>
// 缺 aria-label，屏幕阅读器读不出含义
```

**修复**：

```css
.saas__metric {
  color: var(--color-text);
  background: var(--color-surface-2);
}
```

```tsx
<button aria-label="更多信息">?</button>
```

### 5. 视觉抖动（Performance 面板）

```tsx
const handleRefresh = () => {
  for (let i = 0; i < 5; i++) {
    document.body.offsetHeight;  // 强制 reflow 5 次
  }
  setRefreshCount((c) => c + 1);
};
```

读取 `offsetHeight` / `offsetWidth` / `getComputedStyle` 等会强制浏览器同步 layout。多次连续读取 = 多次 reflow。

**修复**：把读取结果缓存：

```tsx
const height = document.body.offsetHeight;  // 只读一次
// 用 height 做事
```

或者干脆移除不必要的 layout 读。

## 诊断真实项目的 workflow

1. **Console 看有没有报错**——错误第一时间暴露在这里
2. **Network 看请求**——是否成功、状态码、响应时间
3. **Elements 看 DOM/样式**——视觉错位、computed style
4. **Performance 录制**——卡顿来源
5. **Memory 快照**——内存增长来源
6. **Application 看存储**——cookie/localStorage/IndexedDB 状态

每个 bug 至少有一个面板能定位。诊断思路比单纯记命令更重要。

## v3 全部 6 关回顾

| # | 关卡 | 面板 | 核心技能 |
| --- | --- | --- | --- |
| 17 | source-maps | Sources | 启用 source map 调试生产代码 |
| 18 | websocket-debug | Network (WS) | 看 WS messages |
| 19 | cors-errors | Network | 读 CORS 错误 + preflight |
| 20 | third-party-cookies | Application | SameSite / 第三方 cookie |
| 21 | rendering-panel | Rendering | Layout shift / Paint flashing 可视化 |
| 22 | saas-dashboard | 综合 | 真实项目诊断 workflow |

加上 v1+v2 共 16 关，全站 **22 个关卡**覆盖了 DevTools 的所有主要能力。结业 🎓

## 进阶

- **React/Vue/Angular DevTools**（v4 计划）
- **Recorder / Layers 面板**（v4）
- **真机调试**（Chrome Android / iOS Safari）
- **AI 辅助调试**（让 Claude 解读堆栈）
