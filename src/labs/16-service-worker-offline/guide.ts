import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '📦',
      message: 'Service Worker 是浏览器里的"中间人"代理，能拦截 fetch。本关 SW 用 cache-first 策略，"卡住"了旧版本。',
    },
    {
      emoji: '🔧',
      message: '打开 Application → Service Workers 子面板，能看到当前注册的 SW。点 Unregister 手动注销即可解锁本关。',
    },
    {
      emoji: '🗂',
      message: '进一步：Application → Cache Storage 看缓存的 key/value。删除条目能强制下次重新拉取。',
    },
  ],
  steps: [
    {
      title: '观察现象',
      body: '点"模拟发布新版"按钮。后端最新版本变了，但"当前显示版本"还是旧值——SW 缓存挡住了新请求。',
      highlightSelector: '.sw__actions .btn--primary',
    },
    {
      title: '打开 Application → Service Workers',
      body: 'DevTools → Application → 左侧 Service Workers 子面板。能看到当前注册的 /sw-lab.js 及其状态。',
      devToolsScreenshot: 'application-sw',
    },
    {
      title: 'Unregister SW',
      body: '点击该 SW 行右上的 "Unregister" 按钮。注册状态会变为"未注册"。',
      devToolsScreenshot: 'application-sw-unregister',
    },
    {
      title: '重新拉取',
      body: '回到页面点"重新拉取版本"按钮。因为没有 SW 拦截，fetch 直接打到 MSW，返回最新版本。',
      highlightSelector: '.sw__actions .btn:not(.btn--primary)',
    },
    {
      title: '看 Cache Storage（可选）',
      body: 'Application 左侧 → Cache Storage → 点开 sw-lab-cache-v1 → 看 /api/version 的缓存值。可以右键删除条目。',
      devToolsScreenshot: 'application-cache-storage',
    },
  ],
  hints: [
    { text: 'Application 面板左侧有 Service Workers 子面板。' },
    { text: '点 SW 行右上的 Unregister 按钮即可注销。' },
    { text: 'cache-first = 先看缓存有就返回缓存，没才请求网络。适合不变资源，不适合频繁更新的 API。' },
  ],
  validate: () => {
    // 主动型：检查 SW 是否已 unregister
    const em = document.querySelector('.sw__card em');
    const text = em?.textContent ?? '';
    if (text.includes('未注册')) {
      return { passed: true, feedback: '' };
    }
    return {
      passed: false,
      feedback: 'SW 还在注册。打开 Application → Service Workers → Unregister，等几秒再点检查答案。',
    };
  },
  reflection: {
    prompt: 'cache-first 策略最适合缓存什么？',
    options: [
      '几乎不变的静态资源（CSS/JS/字体/图标）',
      '频繁更新的用户数据',
      '实时股票报价',
      'POST 请求',
    ],
    correctIndex: 0,
    explanation:
      '静态资源（hash 命名的 CSS/JS、字体）几乎不变，cache-first 能秒开。用户数据 / 实时数据要用 network-first 或 stale-while-revalidate。',
  },
};
