# 关卡 09 修复说明：Lighthouse 综合体检

## Lighthouse 是什么

Google 开发的开源审计工具，DevTools 内置。一次性给页面 4 个 0-100 分：

| 类别 | 关注 |
| --- | --- |
| **Performance** | LCP / CLS / INP / TBT / FCP 等加载与交互指标 |
| **Accessibility** | ARIA / 对比度 / alt / 键盘可达性 / lang 属性 |
| **Best Practices** | HTTPS / 控制台错误 / 图片尺寸 / deprecated API |
| **SEO** | meta description / title / 字号 / 链接文本 |

## 本关的扣分项

### Accessibility（最严重）

1. **多个 `<img>` 缺 `alt`** — 屏幕阅读器无法描述图片
   ```tsx
   <img src="..." />                              // ❌
   <img src="..." alt="革命性产品的主视觉" />       // ✅
   <img src="..." alt="" />                        // ✅（装饰性图片）
   ```

2. **CTA 按钮对比度不足** — `#fde047` 黄字配 `#ffffff` 白底只有 ~1.6:1，远低于 AA 标准 4.5:1
   - 用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 验证
   - 修复：换深色背景或深色文字

3. **`<html>` 标签缺 `lang` 属性** — 屏幕阅读器不知道用什么语言朗读
   ```html
   <html lang="zh-CN">
   ```

### Performance

1. **首屏 hero 图无 `width/height`** — 浏览器无法预留空间 → CLS 高
2. **缺 `loading="lazy"`** — 视口外图片也立即加载
3. **图片未压缩 / 未提供 modern 格式** — 用 WebP/AVIF 替代 JPEG，体积可省 30-50%

### SEO

1. **缺 `<meta name="description">`** — 搜索引擎摘要为空
2. **缺 `<title>`**（或太短/太长）

### Best Practices

1. **控制台错误**（如果有）
2. **图片缺 `width/height` 属性**

## 进阶用法

```bash
# CLI 模式（CI 友好）
npx lighthouse https://example.com --output html --output-path ./report.html

# 只跑 performance
npx lighthouse https://example.com --only-categories=performance
```

CI 集成：用 [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) 对每次 PR 自动跑分并阻止回归。

## DevTools 技能收获

- Lighthouse 面板的 4 大类别
- Navigation / Timespan / Snapshot 三种模式区别
- 报告里每个 audit 的 "Learn more" 跳 web.dev 文档
- 用 CLI 在 CI 中持续监控
