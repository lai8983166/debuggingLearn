import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🌐',
      message: 'CORS = Cross-Origin Resource Sharing。前端调用其他域名的 API 时常被它拦下。',
    },
    {
      emoji: '🔴',
      message: '点页面"发起跨域请求"按钮。Console 会出现红色 CORS 错误，含 Access-Control-Allow-Origin 字样。',
    },
    {
      emoji: '🔍',
      message: 'Network 面板里也能看到这个请求。注意可能有一个 OPTIONS 请求（Preflight）跟一个真实请求。',
    },
  ],
  steps: [
    {
      title: '触发请求',
      body: '点"发起跨域请求"按钮。失败后页面显示"Failed to fetch"——但具体原因在 Console。',
      highlightSelector: '.btn--primary',
    },
    {
      title: '看 Console',
      body: 'Console 会出现红色错误，类似："Access to fetch at \'https://api.invalid.example.com/data\' from origin \'...\' has been blocked by CORS policy"。',
      devToolsScreenshot: 'console-cors',
    },
    {
      title: '看 Network',
      body: 'Network 面板有这个失败请求。状态可能是 "(failed) net::ERR_NAME_NOT_RESOLVED" 或类似的 CORS-specific 错误。',
      devToolsScreenshot: 'network-cors-failed',
    },
    {
      title: '理解 Preflight',
      body: '非简单请求（如带 Authorization header 或自定义 header 的 POST）会先发 OPTIONS 请求做 preflight。CORS 错误可能在 OPTIONS 或真实请求上。',
      devToolsScreenshot: 'network-preflight',
    },
  ],
  hints: [
    { text: 'CORS 错误的关键字："Access-Control-Allow-Origin"。' },
    { text: 'Network 里先看有没有 OPTIONS 请求（Preflight）。' },
    { text: 'CORS 是浏览器行为——服务器处理成功了，但浏览器拒绝把响应给前端。' },
  ],
  reflection: {
    prompt: 'CORS 错误的根因通常是？',
    options: [
      '服务器没在响应头里返回 Access-Control-Allow-Origin',
      '前端代码语法错误',
      '浏览器缓存了旧版本',
      'DNS 解析失败',
    ],
    correctIndex: 0,
    explanation: '服务器必须明确返回 Access-Control-Allow-Origin 头允许跨域。CORS 是服务端配置问题，不是前端代码 bug——前端无法"绕过"。',
  },
};
