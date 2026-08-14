import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '💬',
      message: 'WebSocket 是双向实时通信协议（不同于 HTTP 一问一答）。Network 面板有专门的 WS 子分类。',
    },
    {
      emoji: '🌐',
      message: 'Network 面板顶部 Filter → 选 WS（或搜 "websockets"）。本关用 fetch 模拟，所以你看到的是 fetch 请求；真实 WS 在 WS 子分类。',
    },
    {
      emoji: '🔧',
      message: '点某个 WS 请求 → 右侧切到 "Messages"（旧版叫 Frames）子面板。绿色 ↑ 是发出去，白色 ↓ 是收到。',
    },
  ],
  steps: [
    {
      title: '打开 Network',
      body: 'DevTools → Network 面板。注意顶部的 Filter 行有 "All / Fetch/XHR / JS / CSS / Img / Media / Font / Doc / WS / WSS / Manifest / Other"。',
      devToolsScreenshot: 'network-filters',
    },
    {
      title: '点 WS 子分类',
      body: 'WS = WebSocket。真实 WS 应用所有连接会出现在这里。',
      devToolsScreenshot: 'network-ws',
    },
    {
      title: '点连接看 Messages',
      body: '点击 WS 请求 → 右侧切到 "Messages" 子面板（旧版叫 Frames）。每条消息一行，时间 / 数据 / 方向（↑发 ↓收）。',
      devToolsScreenshot: 'network-ws-messages',
    },
    {
      title: '本关的 fetch 模拟',
      body: '本关用 fetch 简化。你在 Fetch/XHR 里能看到周期性请求。点开看 Response：返回的是格式错误的 JSON。',
    },
    {
      title: '看 Response',
      body: '点 Request → Response 子面板。会看到 `{user:"bot",text:"hi there",ts:1699...` ——缺最后的 `}`。前端 JSON.parse 失败被静默吞掉。',
    },
  ],
  hints: [
    { text: 'Network → 顶部 Filter → 选 WS。' },
    { text: 'WS 连接详情 → Messages 子面板看 frame。' },
    { text: '本关服务器返回的 JSON 格式错误（缺右花括号）。' },
  ],
  reflection: {
    prompt: 'WebSocket 在 Network 面板里查看消息的子面板叫？',
    options: ['Frames（或新版本叫 Messages）', 'Headers', 'Preview', 'Initiator'],
    correctIndex: 0,
    explanation: '旧版本叫 Frames，新版本叫 Messages。绿色箭头 ↑ 是客户端发出的，白色 ↓ 是收到的。',
  },
};
