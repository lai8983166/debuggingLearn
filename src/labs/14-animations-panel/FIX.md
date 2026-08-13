# 关卡 14 修复说明：Animations 面板

## Animations 面板是干什么的

可视化页面所有 CSS Transitions / Animations 的时间线。可以：
- 看每个动画的 duration / delay / easing
- 现场改 easing / duration 验证（不刷新页面）
- 慢速回放（0.1× / 0.25× / 0.5× 速度）观察细节

## 本关的 bug

三个动画都用 `linear` easing：

```css
.anim-spin  { animation: spin 1.5s linear infinite; }
.anim-hover { transition: transform 0.3s linear; }
.anim-fill  { animation: fill 1.5s linear infinite alternate; }
```

linear 让动画"匀速"——但现实物体从静止到运动再到静止都有加速度，匀速看起来像机器人。

## easing 选择指南

| Easing | 特性 | 适用 |
| --- | --- | --- |
| `linear` | 匀速 | 进度条、加载旋转（机械运动） |
| `ease-out`（默认） | 快进慢出 | 大多数 UI 进入动画 |
| `ease-in` | 慢进快出 | 元素离开 / 关闭 |
| `ease-in-out` | 慢-快-慢 | 颜色 / 透明度过渡 |
| `cubic-bezier(0.4, 0, 0.2, 1)` | Material 标准 | 通用推荐 |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | 微弹回 | 卡片放大 / hover 强调 |

### cubic-bezier 工具

- [cubic-bezier.com](https://cubic-bezier.com) 交互式调节
- Chrome DevTools 在 Styles 面板里点击 timing-function 值前的小图标能打开可视化编辑器

## 推荐阅读

- [Material Design Motion Duration](https://m2.material.io/design/motion/speed.html#duration) — 推荐时长：小元素 200-300ms，大区域 350-400ms
- [easings.net](https://easings.net) — 30+ 缓动函数速查

## Animations 面板的进阶

- **捕捉一次性动画**：默认面板会持续监听，触发后立即捕获
- **修改 timing function**：在面板详情区双击值即可临时修改
- **修改 playback rate**：顶部按钮可以 0.1× ~ 1× 慢放，方便调试过快动画
- **修改 keyframe**：在时间线上拖动 keyframe 节点改变触发时间

## DevTools 技能收获

- More tools 里藏着 Animations / Coverage / Layers / Rendering 等多个面板
- Animations 时间线视图
- 现场修改 timing-function 验证
- cubic-bezier 的物理直觉
