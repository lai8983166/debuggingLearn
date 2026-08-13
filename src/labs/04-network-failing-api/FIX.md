# 关卡 4 修复说明：Network 请求排查

## 错误现象

文章列表区显示"这里什么都没有"。Console 没有报错。看起来像"没数据"，
但其实是请求失败了被静默吞掉。

## 根因

两层 bug 叠加：

1. **服务端返回 500**（本关 MSW 模拟的故障，在生产里对应 db 挂了、上游服务挂了等）
2. **前端代码吞错误**：

```ts
fetch('/api/articles')
  .then((res) => {
    if (!res.ok) {
      // [TEACHING_BUG] 直接返回空数组——把失败伪装成"成功但无数据"
      return [] as Article[];
    }
    return res.json();
  })
  .catch(() => {
    // [TEACHING_BUG] 完全静默
    setLoading(false);
  });
```

## 修复

```ts
fetch('/api/articles')
  .then(async (res) => {
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status}: ${body}`);
    }
    return res.json();
  })
  .then((data) => setArticles(data))
  .catch((err) => {
    setError(err.message);       // UI 显示错误状态
    reportToSentry(err);          // 上报监控
  })
  .finally(() => setLoading(false));
```

## DevTools 技能收获

- Network 面板的基本信息列：Name / Status / Type / Initiator / Size / Time
- 点请求 → Headers / Response / Preview / Timing 子面板
- **Status 列**比 Response body 更快定位 4xx/5xx
- 右键请求 → "Copy as fetch / cURL" 便于复现
- 右键请求 → "Replay XHR" 不刷新页面重发

## 进阶

- **Throttling**：Network 面板顶部 "Online" 下拉可模拟 Slow 3G，测试弱网体验
- **Block request URL**：右键请求 → "Block request domain" 模拟资源被墙
- **Override headers**：使用 Network 面板的 Request Intercept 修改请求
