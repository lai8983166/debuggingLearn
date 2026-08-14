# 关卡 21 修复说明：Rendering 面板

## Rendering 面板是什么

DevTools 内置但常被忽略的调试可视化面板，藏在 Cmd+Shift+P → "Show Rendering"。功能：

| 选项 | 作用 |
| --- | --- |
| **Layout Shift regions** | 高亮产生 layout shift 的区域（蓝色） |
| **Paint flashing** | 高亮重绘的区域（绿色） |
| **Core Web Vitals** | 实时显示 LCP / CLS / INP 数值 |
| **FPS meter** | 实时帧率（独立于 Performance 录制） |
| **Scrolling performance issues** | 标记会阻塞滚动的元素（CSS `touch-action` 没设的） |
| **Emulate vision deficiencies** | 模拟色盲 / 模糊 / 对比度低 |
| **Emulate color scheme** | 强制 dark / light |
| **Emulate CSS media feature** | 模拟 `prefers-reduced-motion` 等 |

## 本关的 bug

1. **动态 banner 无预留空间**
   ```tsx
   {bannerVisible && <div className="banner">...</div>}
   ```
   banner 出现时撑开整个布局，下方内容全部下移。

2. **图片无 width/height**
   ```tsx
   <img src="https://picsum.photos/60/60" alt="" />
   ```
   图片加载完成前是 0 高度，加载后突然撑开。

3. **字体加载导致位移**
   初用 serif fallback 渲染，加载完后字体宽度变化。

## 修复

### 1. Banner 预留空间

```tsx
<div className="banner-slot">
  {bannerVisible && <div className="banner">...</div>}
</div>

<style>.banner-slot { min-height: 60px; }</style>
```

### 2. 图片设尺寸

```tsx
<img src="..." width={60} height={60} loading="lazy" alt="" />
```

### 3. 字体策略

```css
@font-face {
  font-family: 'MyFont';
  src: url(...) format('woff2');
  font-display: swap;        /* 用 fallback 渲染，加载完后切换（仍可能位移） */
  size-adjust: 100%;          /* 微调 fallback 字体大小，减少切换时位移 */
}
```

更彻底：用 `<link rel="preload">` 提前加载字体。

## 进阶：找性能瓶颈

Paint flashing 配合 Performance 录制：

1. 开启 Paint flashing
2. Performance 面板录制
3. 滚动 / 操作页面
4. 停止录制，看 "Paint" 行的绿色块

大量 paint 通常是 CSS 复杂选择器或大图片导致。

## Emulate vision deficiencies（必学）

设计阶段必用：

- **Blurriness**：模拟视力模糊
- **Deuteranopia / Protanopia / Tritanopia**：色盲类型
- **High contrast / Low contrast**：检查对比度

你的"高对比度按钮"在色盲眼里可能是灰色——这关足以让 a11y 进 CI。

## DevTools 技能收获

- Rendering 面板的位置（Command Menu → "Show Rendering"）
- Layout Shift regions 蓝色高亮
- Paint flashing 绿色高亮
- Core Web Vitals 实时数字
- Emulate vision deficiencies 的色盲模拟
