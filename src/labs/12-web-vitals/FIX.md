# 关卡 12 修复说明：Web Vitals 三连击

## Web Vitals 是什么

Google 定义的核心用户体验指标，直接影响搜索排名。三个核心：

| 指标 | 全称 | 含义 | Good | Needs Improvement | Poor |
| --- | --- | --- | --- | --- | --- |
| **LCP** | Largest Contentful Paint | 最大内容元素绘制时间 | < 2.5s | < 4s | ≥ 4s |
| **CLS** | Cumulative Layout Shift | 累积布局偏移量 | < 0.1 | < 0.25 | ≥ 0.25 |
| **INP** | Interaction to Next Paint | 最差交互响应时间 | < 200ms | < 500ms | ≥ 500ms |

> FID（First Input Delay）已于 2024 年 3 月被 INP 替代。

## 三个 bug 的修复

### 1. LCP — 大图无尺寸无 lazy

```tsx
// ❌
<img src="https://picsum.photos/2000/1500" />

// ✅
<img
  src="https://picsum.photos/120/90"
  width={400}
  height={300}
  loading="lazy"
  alt="..."
/>
```

- 提供合适尺寸的图（按 CSS 缩放，不要让浏览器下载 2000px 图再用 100px 显示）
- `width/height` 防止 CLS，也加速 LCP（浏览器预分配空间）
- `loading="lazy"` 让首屏外的图延迟加载
- 用 modern 格式：WebP / AVIF 体积比 JPEG 小 30-50%
- responsive：`srcSet` + `sizes` 按设备发不同图

### 2. CLS — 占位 0 高度

```tsx
// ❌
<div><img src="..." /></div>  // 加载完撑开，推动下方内容

// ✅
<div style={{ aspectRatio: '3 / 2', position: 'relative' }}>
  <img src="..." style={{ position: 'absolute', inset: 0, objectFit: 'cover' }} />
</div>
```

要点：**容器先占好空间**，图加载完不改变容器尺寸。

其他常见 CLS 源：
- 字体加载导致文字位移（用 `font-display: swap` + size-adjust）
- 动态注入的 banner / 广告（预留高度）
- 异步组件（用 skeleton 占位）

### 3. INP — 同步长任务堵塞主线程

```tsx
// ❌ 主线程被堵 500ms
const handleClick = () => {
  const start = Date.now();
  while (Date.now() - start < 500) {}
  setCount(c => c + 1);
};

// ✅ 让主线程透气
const handleClick = () => {
  // 轻量状态更新立即响应
  setCount(c => c + 1);
  // 重活交给 setTimeout / scheduler
  setTimeout(() => heavyWork(), 0);
};

// 更好：用 requestIdleCallback / Web Worker
```

INP 的关键是：**主线程一次不要占用超过 50ms**（人能感知的延迟阈值）。

## 怎么测 Web Vitals

1. **DevTools Performance 面板** 录制，看 Web Vitals 行（Chrome 110+ 内置显示）
2. **Lighthouse** 跑分会算出三个指标
3. **Web Vitals Chrome 扩展** 实时显示
4. **生产环境**：用 `web-vitals` 库上报

```ts
import { onLCP, onCLS, onINP } from 'web-vitals';
onLCP(console.log);
onCLS(console.log);
onINP(console.log);
```

5. **PageSpeed Insights**（https://pagespeed.web.dev）测试任意 URL
6. **CrUX**（Chrome UX Report）查看真实用户数据

## DevTools 技能收获

- PerformanceObserver API 读取 LCP/CLS/INP
- aspect-ratio CSS 解决 CLS
- 主线程长任务（Long Task）的识别
- web-vitals 库的生产集成
