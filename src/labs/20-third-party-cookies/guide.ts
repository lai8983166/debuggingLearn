import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🍪',
      message: 'Cookie 有个 SameSite 属性，决定是否在跨域请求中携带。Chrome 80+ 默认 Lax。',
    },
    {
      emoji: '🔍',
      message: 'Application → Cookies → 当前域名。每个 cookie 行有 Name/Value/Domain/Path/Expires/SameSite 等列。',
    },
    {
      emoji: '⚠️',
      message: 'SameSite=None 必须搭配 Secure，否则被拒绝。Chrome 还在逐步禁用第三方 cookie。',
    },
  ],
  steps: [
    {
      title: '打开 Application',
      body: 'DevTools → Application 面板 → 左侧 Storage → Cookies → 点当前域名。',
      devToolsScreenshot: 'application-cookies',
    },
    {
      title: '找 SameSite 列',
      body: '右侧 cookie 表格有 SameSite 列。看 app_session 行，值应该是 Lax。',
      devToolsScreenshot: 'application-cookies-samesite',
    },
    {
      title: '改值实验',
      body: '双击 SameSite 单元格改成 None（DevTools 会刷新页面验证）。但注意：None 必须配 Secure，本地 http 可能失败。',
    },
    {
      title: '看第三方 cookie 警告',
      body: 'Console 可能有黄色警告 "Cookie ... has been rejected because it is already cross-site"——这就是第三方 cookie 被拦的信号。',
    },
  ],
  hints: [
    { text: 'SameSite 三档：Strict（最严）/ Lax（默认）/ None（最松，需 Secure）' },
    { text: 'Chrome 80+ 默认 Lax；2024 年开始逐步禁用第三方 cookie。' },
    { text: 'Application → Cookies → 当前域名的 SameSite 列。' },
  ],
  reflection: {
    prompt: '要让 cookie 在跨域 iframe 中也能发送，SameSite 必须是？',
    options: ['None（且必须配 Secure）', 'Lax', 'Strict', '随便哪个都行'],
    correctIndex: 0,
    explanation: 'iframe 是典型的"第三方上下文"。SameSite=None + Secure 才能跨域携带。但 Chrome 在逐步禁用第三方 cookie，长期方案是用 postMessage / localStorage / server-side session 替代。',
  },
};
