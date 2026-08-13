# 关卡 11 修复说明：Mobile 模拟 + 网络限速

## Device Mode 是什么

DevTools 内置的响应式测试环境。一键切换：
- 视口尺寸（设备预设 / 自定义）
- UA / 设备像素比
- 触摸事件模拟
- 网络限速 + CPU 节流
- 地理位置模拟

## 本关的两层 bug

### 1. CSS 响应式写法不规范

`Scenario.css`：

```css
.mob__grid {
  display: grid;
  gap: 12px;
  /* [TEACHING_BUG] 没设默认 grid-template-columns，移动端会"碰巧"显示单列
     但这种"靠默认值"的写法很脆弱 */
}

@media (min-width: 768px) {
  .mob__grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}
```

**正确写法（mobile-first）**：

```css
.mob__grid {
  display: grid;
  grid-template-columns: 1fr;   /* 移动端默认单列 */
  gap: 12px;
}

@media (min-width: 768px) {
  .mob__grid {
    grid-template-columns: repeat(3, 1fr);
    /* 不需要 !important */
  }
}
```

mobile-first：先写最小屏的样式，再在媒体查询里"升级"。比 desktop-first 反过来写更不容易出 bug。

### 2. 图片未优化

```tsx
// ❌
<img src="https://picsum.photos/200/200" />

// ✅
<img
  src="https://picsum.photos/200/200"
  width={80}
  height={80}
  loading="lazy"
  alt={`商品 ${name} 图`}
  srcSet="https://picsum.photos/200/200 1x, https://picsum.photos/400/400 2x"
/>
```

- `width/height`：预留空间，避免 CLS
- `loading="lazy"`：视口外延迟加载
- `srcSet`：高 DPR 屏（Retina）自动用高清版

## Network Throttling 预设

| 预设 | 带宽 | RTT | 用途 |
| --- | --- | --- | --- |
| Online | 不限 | 不限 | 默认 |
| Fast 3G | 1.6 Mbps | 150ms | 4G 边缘 |
| **Slow 3G** | **400 kbps** | **400ms** | **典型 3G** |
| Custom | 自定义 | 自定义 | 模拟特定网络 |

CPU 也可以节流：Performance 面板录制前选 "CPU: 4× slowdown"。

## 移动端调试技巧

- **Remote Debugging**：USB 连真机，`chrome://inspect` 调试 Android Chrome
- **iOS Safari**：用 Mac 的 Safari → Develop 菜单
- **触摸事件**：Device Mode 自动启用 touch 事件，可以测 `touchstart` / `pinch`
- **设备方向**：Device Mode 顶部的旋转按钮切换横竖屏

## DevTools 技能收获

- Device Mode 切换（Cmd+Shift+M）
- Dimensions 设备预设
- Network throttle 预设 + 自定义
- mobile-first CSS 写法
