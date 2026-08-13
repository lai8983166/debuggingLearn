import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '📭',
      message: '页面显示"这里什么都没有"。但 Console 也没报错——错误被代码吞了。',
    },
    {
      emoji: '🌐',
      message: '打开 Network 面板，刷新页面，看请求列表里 /api/articles 的 Status 列。',
    },
    {
      emoji: '🔴',
      message: '点该请求 → 右侧 Headers 面板看 Response 状态码。再切到 Response 子面板看错误内容。',
    },
  ],
  steps: [
    {
      title: '打开 Network 面板',
      body: 'DevTools 切到 Network 面板。确保左上角的红色 ●（记录）是激活状态。',
      devToolsScreenshot: 'network-panel',
    },
    {
      title: '刷新页面',
      body: '按 F5 刷新页面，让请求重新发一遍。Network 面板会列出所有请求。',
      highlightSelector: '.articles',
    },
    {
      title: '找到 /api/articles',
      body: '在请求列表里找名为 "articles" 的请求。注意 Status 列——这里不是 200。',
      devToolsScreenshot: 'network-request-row',
    },
    {
      title: '看 Response',
      body: '点击该请求，右侧切到 "Response" 子面板。会看到后端返回的 JSON 错误信息（含状态码解释）。',
      devToolsScreenshot: 'network-response',
    },
    {
      title: '看 Headers',
      body: '回到 "Headers" 子面板，注意 Response Headers 里的 HTTP status code。这就是 fetch 没抛错但页面没数据的原因。',
      devToolsScreenshot: 'network-headers',
    },
  ],
  hints: [
    { text: '页面没数据但 Console 没报错——典型的"错误被 catch 吞掉"。' },
    { text: '在 Network 面板刷新看请求列表。' },
    { text: '/api/articles 请求的 Status 是 500，且代码只判断 catch 没判断 res.ok。' },
  ],
  reflection: {
    prompt: '/api/articles 请求的 HTTP 状态码是多少？',
    options: ['200 OK（成功）', '404 Not Found（不存在）', '500 Internal Server Error（服务器内部错误）', '304 Not Modified（缓存）'],
    correctIndex: 2,
    explanation:
      '500 表示服务端处理时出错。fetch 不会因为 4xx/5xx 自动 reject——必须手动检查 res.ok 或 res.status。',
  },
};
