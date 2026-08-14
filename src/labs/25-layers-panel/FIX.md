# 关卡 25 修复说明：Layers 面板

## 错误现象

10 个静态卡片 + 1 个动画卡片，浏览器创建了 ~10 个合成层。GPU 内存白白浪费。

## 浏览器渲染管线

```
JS → Style → Layout → Paint → Composite
                              ↑ GPU 合成层在这里
```

**合成层（Compositing Layer）**：浏览器把页面切成多个层，每层独立光栅化，最后 GPU 合成。动画如果只在合成层上（transform / opacity），就不触发 Layout 和 Paint——非常快。

## 什么会创建合成层

| 触发条件 | 备注 |
| --- | --- |
| `transform: translateZ(0)` / `translate3d` | 老 hack |
| `will-change: transform / opacity` | 现代 hint |
| `<video>` / `<canvas>` / WebGL | 本身就是层 |
| CSS animation / transition (transform) | 动画期间临时提升 |
| `position: fixed` | 部分浏览器 |
| 3D transform | 必然 |

## 层爆炸的代价

每层占 **宽 × 高 × 4 字节** GPU 内存（RGBA）。1920×1080 的一层 ≈ 8MB。10 层就 80MB——手机直接卡。

还会增加**合成开销**：GPU 要把所有层拼起来，层越多越慢。

## 修复

```css
/* ❌ 所有卡片都加 */
.lyr-card { will-change: transform; }

/* ✅ 只有动画的加 */
.lyr-card--anim { will-change: transform; animation: pulse 2s infinite; }
```

**更极致**：动画结束移除 will-change（用 JS）：

```js
el.classList.add('animating');          // 开始前加（含 will-change）
el.addEventListener('animationend', () => {
  el.classList.remove('animating');     // 结束后移除
});
```

## Layers 面板用法

1. Cmd+Shift+P → "Show Layers"
2. **左侧**：层列表 + 大小 + 内存 + 提升原因（"Reason for layer creation"很关键）
3. **右侧 3D 视图**：拖动旋转。层堆太高 = 爆炸
4. 点某层 → 高亮对应 DOM

## 什么情况真的需要 will-change

- 元素**即将**执行 transform/opacity 动画（hover 前、滚动触发前）
- 动画卡顿且 Performance 面板显示 Paint 占比高

**不是**性能优化银弹——先测（Performance + Layers），再决定加不加。

## DevTools 技能收获

- Layers 面板的位置与 3D 视图操作
- "Reason for layer creation" 列定位层提升原因
- 合成层内存计算（宽 × 高 × 4B）
- will-change 的正确与滥用
- Rendering 面板的 "Paint flashing" 配合定位过度绘制
