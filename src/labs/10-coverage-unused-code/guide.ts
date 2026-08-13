import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '📦',
      message: '本页面看似只有一个按钮，但 bundle 里塞了大段未使用代码。Coverage 面板能看到"哪些字节真的被执行了"。',
    },
    {
      emoji: '🎯',
      message: 'Cmd/Ctrl+Shift+P 打开 Command Menu，搜 "Show Coverage" 回车，Coverage 面板就出现了。',
    },
    {
      emoji: '🔁',
      message: '点 Coverage 面板左上的 reload 图标——它会刷新页面并记录每个字节的执行情况。刷新后看 Unused Bytes 列。',
    },
  ],
  steps: [
    {
      title: '打开 Command Menu',
      body: '按 Cmd+Shift+P（Mac）或 Ctrl+Shift+P（Win/Linux）。这是 DevTools 的"搜索命令"入口。',
      devToolsScreenshot: 'command-menu',
    },
    {
      title: '搜 Show Coverage',
      body: '输入 "Coverage"，选 "Show Coverage" 回车。Coverage 面板会出现在 DevTools 区域（通常在底部 drawer）。',
      devToolsScreenshot: 'command-menu-coverage',
    },
    {
      title: '启动 instrumentation',
      body: '点 Coverage 面板左上的 reload 图标（带圆圈的箭头）。浏览器会刷新页面并记录每个 JS/CSS 资源的执行覆盖。',
      devToolsScreenshot: 'coverage-reload',
    },
    {
      title: '看 Unused Bytes',
      body: '刷新后 Coverage 列出所有资源。看 "Unused Bytes" 列——本页面的主 JS 资源会显示 90%+ 未使用。',
      devToolsScreenshot: 'coverage-result',
    },
    {
      title: '点开看细节',
      body: '点击该资源行，会打开源码视图。红色行 = 未执行；绿色行 = 已执行。你会看到大量红色（unusedUtils、BIG_UNUSED_ARRAY 等）。',
    },
  ],
  hints: [
    { text: 'Coverage 面板藏在 Command Menu 里：Cmd+Shift+P 搜 "Show Coverage"。' },
    { text: 'Coverage 面板左上有 reload 图标，点了才开始记录。' },
    { text: '本页面 50KB+ 的 JS，首屏只会用到 5% 左右。' },
  ],
  reflection: {
    prompt: '本页面主 JS 资源的 "Unused Bytes" 大致是多少？',
    options: ['小于 10%（基本都用上了）', '约 30%（中等浪费）', '约 90%（绝大部分没用到）', '100%（一行都没执行）'],
    correctIndex: 2,
    explanation:
      '50KB 数组 + 4 个工具函数 + 调试链接，首屏只会执行 sayHi 那一个函数。Unused Bytes 会显示约 90%+。这就是首屏性能浪费的典型现场。',
  },
};
