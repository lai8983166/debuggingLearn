# 关卡 18 修复说明：WebSocket 调试

## 错误现象

聊天窗口显示"等待消息…"，但永远收不到。后台每 1.5 秒有一个请求，但 UI 不更新。

## 根因

服务器返回的 JSON 缺最后的右花括号：

```json
{user:"bot",text:"hi there",ts:1699999999999,
```

前端 `JSON.parse()` 抛 `SyntaxError`，但 catch 块静默吞掉（不打印、不上报）。

```ts
try {
  JSON.parse(fakeResponse);  // [TEACHING_BUG] 抛 SyntaxError
} catch (e) {
  setErrorCount((c) => c + 1);
  return;   // [TEACHING_BUG] 静默忽略
}
```

## 修复

服务端修复：返回合法 JSON。

```json
{"user":"bot","text":"hi there","ts":1699999999999}
```

注意：JSON 规范要求 key 也用双引号。

前端修复：catch 块要至少打印错误。

```ts
try {
  JSON.parse(response);
} catch (e) {
  console.error('[App] Failed to parse WS message:', response, e);
  reportToSentry(e);
  return;
}
```

## 真实 WebSocket 调试

本关用 fetch 模拟。真实 WebSocket 在 Network 面板里：

1. **Network 面板** 顶部 Filter → **WS**
2. 找到 `wss://` 开头的连接
3. 点击该连接 → 右侧切到 **Messages**（旧版 Frames）子面板
4. 实时看到双向消息流：
   - 绿色 ↑ `Text` 客户端发出的
   - 白色 ↓ `Text` 服务端收到的
   - 还能看到二进制 frame、ping/pong

## WS 调试进阶

- **重连逻辑**：Network 看到频繁的 connect/disconnect → 检查心跳 / 重连退避
- **协议升级**：WS 连接的 Request Headers 有 `Upgrade: websocket` + `Sec-WebSocket-Key`
- **二进制 frame**：默认显示 hex；点 "Binary" 切换显示模式
- **mock WS**：用 `mock-socket` 库前端测试 WS，无需真实服务端

## DevTools 技能收获

- Network Filter 的 WS / WSS 子分类
- Messages（Frames）子面板
- 双向消息的方向箭头含义
- 区分 Fetch 模拟与真实 WS（用于本关的诚实声明）
