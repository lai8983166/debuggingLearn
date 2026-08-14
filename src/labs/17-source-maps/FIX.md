# 关卡 17 修复说明：Source Maps

## 错误现象

线上代码崩了，Console 报错指向 `bundle.min.js:1:8456`。打开 Sources 看到的全是：

```js
function calculateTotal(a,b){let c=0;for(let i=0;i<b.length;i++){c+=b[i].price*b[i].qty}return c}
```

变量名 a/b/c，没换行，完全没法看。这是生产环境标配——压缩 + 混淆。

## Source Map 是什么

Source map 是一个 `.map` 文件，记录"minify 后的位置 ↔ 原始代码"的映射。

```
bundle.min.js              <- 浏览器下载的（minify 后）
bundle.min.js.map          <- 同时提供（同一目录 + .map 后缀）
```

`.min.js` 文件末尾有一行注释告诉 DevTools 去找 .map：

```js
//# sourceMappingURL=bundle.min.js.map
```

DevTools 看到 `sourceMappingURL` 后，自动 fetch `.map` 文件，把 minified 代码"翻译"回原始 TypeScript。

## 启用

DevTools 默认启用 source maps。如果没看到原代码：

1. **DevTools 右上 ⚙** → Preferences
2. **Sources** 标签
3. 勾选 **"Enable JavaScript source maps"**
4. 刷新页面

CSS 也有 source maps，单独的 **"Enable CSS source maps"** 选项。

## 生产环境调试的关键

线上事故时，**source map 必须能访问到**。常见策略：

| 策略 | 优点 | 缺点 |
| --- | --- | --- |
| source map 公开 | 调试方便 | 暴露源码（商业敏感） |
| source map 仅内网 | 安全 | 客户端看不到 |
| **source map 上传到 Sentry 等错误监控** | 安全 + 调试方便 | 需要 Sentry 配置 |
| 不生成 source map | 最小化 | 无法在生产调试 |

推荐：**生产 build 生成 .map 但不上传到 CDN**，只在 Sentry 后台用。

## DevTools 技能收获

- DevTools Settings（F1）的位置
- Sources 子菜单的 "Enable JavaScript source maps"
- Console 堆栈链接跳到原始源码（自动反 minify）
- 在原代码位置设断点（即使运行的是 minified 代码，DevTools 自动桥接）
