# 关卡 26 速查：跨浏览器 DevTools

## 面板叫法对照

| 功能 | Chrome | Safari | Firefox |
| --- | --- | --- | --- |
| DOM/样式 | Elements | 元素 | 检查器 |
| 源码/断点 | Sources | 来源代码 | 调试器 |
| 请求 | Network | 网络 | 网络 |
| 性能 | Performance | 时间线 | 性能 |
| 存储 | Application | 存储 | 存储 |

## 启用 Safari 开发菜单

Safari 默认隐藏开发者功能：

```
Safari → 设置（⌘,）→ 高级 → 勾选"在菜单栏中显示开发菜单"
```

然后 `Cmd+Opt+I` 打开 Web Inspector。

## 各家独有武器

### Chrome 独有
- **Recorder**：录制 UI 流程导出 E2E 脚本（第 24 关）
- **Coverage**：死代码分析（v2 第 10 关）
- **Lighthouse**：综合评分（v2 第 9 关）
- 最成熟的 Performance 火焰图

### Safari 独有 / 更强
- **图形层视图**（比 Chrome 的 Layers 面板更好用，层提升原因更清晰）
- WebGPU 检查器
- 真机 iOS 调试的唯一入口（第 27 关）

### Firefox 独有 / 更强
- **Grid 布局可视化**（CSS Grid 调试最强工具，叠加线/区域名一目了然）
- **Fonts 面板**（渲染用的所有字体、变量、回退链）
- CSS Shapes 可视化编辑
- 请求重放（右键 → Edit and Resend）
- 多行 Console 编辑体验更好

## "Chrome 正常 Safari 炸" 常见原因

| 原因 | 排查 |
| --- | --- |
| **日期格式** | `new Date('2024-1-1')` Safari 返回 Invalid Date（要求 ISO `2024-01-01`） |
| **flex gap** | Safari 14.0 及以下不支持，需 margin 替代 |
| **-webkit- 前缀** | 某些 CSS（如 mask、backdrop-filter）Safari 需要前缀 |
| ** look-behind 正则** | 老版本 Safari 不支持 `(?<=...)` |
| **ResizeObserver / IntersectionObserver** | 行为细节差异 |

排查方法：在两家的 Console 跑同一小段代码对比输出；Elements/检查器看 computed style 是否生效。

## 为什么还要学跨浏览器

- **用户分布**：Safari 在移动端（尤其欧美）份额不可忽视；Firefox 用户虽少但多是技术人群
- **Can I Use 验证**：写新 CSS/JS API 前先查 [caniuse.com](https://caniuse.com)
- **渐进增强**：先保证核心功能全浏览器可用，增强特性做特性检测（`if ('grid' in ...)`) 或 `@supports`

## DevTools 技能收获

- 三家 DevTools 的面板语义映射
- Safari 开发菜单的启用
- 各家独有功能清单（Grid 可视化 / Fonts / 图形层 / Recorder / Coverage）
- 常见跨浏览器坑与排查法
