# 关卡 16 修复说明：Service Worker 离线缓存

## 错误现象

页面显示"当前版本 v1.0.0"。点"模拟发布新版"按钮，后端最新变成 v2.0.0——但页面仍显示 v1.0.0。

## 根因

`public/sw-lab.js`：

```js
// [TEACHING_BUG] cache-first：缓存有就直接返回，根本不去问后端
self.addEventListener('fetch', (event) => {
  if (event.request.url includes '/api/version') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;        // ← 这里"卡"住了所有更新
        const fresh = await fetch(event.request);
        cache.put(event.request, fresh.clone());
        return fresh;
      }),
    );
  }
});
```

`/api/version` 是动态数据，但被当成静态资源缓存——典型的"策略选错"。

## 三种主流缓存策略

### 1. cache-first（适合静态资源）

```js
async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const fresh = await fetch(req);
  caches.put(req, fresh.clone());
  return fresh;
}
```

适用：hash 命名的 CSS/JS（`app.abc123.css`）、字体、图标、不可变图片。

### 2. network-first（适合动态数据）

```js
async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return (await caches.match(req)) ?? new Response('offline');
  }
}
```

适用：API 响应、用户数据、文章内容。离线时退回缓存。

### 3. stale-while-revalidate（最佳折中）

```js
async function swr(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  const network = fetch(req).then((fresh) => {
    cache.put(req, fresh.clone());
    return fresh;
  });
  return cached ?? network;  // 缓存有就先返回，背后偷偷更新
}
```

适用：既要快又要新的内容。先秒回缓存，后台异步刷新。

## Service Worker 生命周期

| 阶段 | 触发 |
| --- | --- |
| install | 首次注册或 SW 文件变化时 |
| activate | 旧 SW 不再控制页面后 |
| fetch / message / push / sync | 各种事件 |

**关键点**：新 SW 安装后不会立即接管页面——要等所有旧 tab 关闭。这就是为什么 `clients.claim()` 和 `skipWaiting()` 经常用。

## 修复本关的几种方式

1. **手动 Unregister**（最直接，开发期常用）：
   Application → Service Workers → Unregister

2. **删除 Cache Storage 条目**：
   Application → Cache Storage → 右键删除

3. **更新 SW 文件代码**（生产正确做法）：
   - 改 cache 策略为 network-first 或 stale-while-revalidate
   - bump CACHE_NAME（如 v1→v2），新 SW activate 时清旧 cache：
     ```js
     self.addEventListener('activate', (event) => {
       event.waitUntil(
         caches.keys().then((keys) =>
           Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
         ),
       );
     });
     ```

## DevTools 技能收获

- Application → Service Workers 子面板：注册状态、Update、Unregister
- Application → Cache Storage 子面板：查看 / 删除缓存条目
- "Update on reload" 选项：每次刷新都重新安装 SW（开发期利器）
- "Bypass for network" 选项：暂时绕过 SW（排查 SW bug 时用）
- Network 面板的 "Service Worker" 标识：哪些请求被 SW 拦截了
