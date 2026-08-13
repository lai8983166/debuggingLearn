import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '💧',
      message: '本页面有内存泄漏。停留 30 秒以上浏览器会越来越卡。',
    },
    {
      emoji: '📸',
      message: 'Memory 面板 → Heap snapshot → Take snapshot。拍三张：刚进入 / 等 10 秒 / 等 30 秒。',
    },
    {
      emoji: '🔁',
      message: '选中第三张，视图切到 "Objects allocated between snapshot 1 and 2"，看哪些类型增长。',
    },
  ],
  steps: [
    {
      title: '打开 Memory 面板',
      body: 'DevTools 切到 "Memory" 面板。选 "Heap snapshot"，点 Take snapshot。',
      devToolsScreenshot: 'memory-panel',
    },
    {
      title: '拍第一张快照',
      body: '快照命名为 "Snapshot 1"。完成后下方会列出所有对象。',
      devToolsScreenshot: 'memory-snapshot-1',
    },
    {
      title: '等 10 秒拍第二张',
      body: '在页面上等 10 秒（或多次点"手动触发一次泄漏"按钮），再 Take snapshot。命名 Snapshot 2。',
      highlightSelector: '.btn--primary',
    },
    {
      title: '对比增长',
      body: '选中 Snapshot 2，上方视图下拉选 "Objects allocated between Snapshot 1 and 2"。按 "Size" 排序。',
      devToolsScreenshot: 'memory-comparison',
    },
    {
      title: '找到泄漏对象',
      body: '观察增长最多的类型——通常是 (array) / number / (string)。展开看具体 retainer 链。',
      devToolsScreenshot: 'memory-retainers',
    },
    {
      title: '看 Retainers',
      body: '点开一个对象，下方 "Retainers" 显示"谁还引用着它"——这是泄漏的关键。会指向 leakPool / setInterval 回调。',
    },
  ],
  hints: [
    { text: '泄漏是"组件卸载后，引用还被持有"导致的。' },
    { text: 'Memory 面板拍快照，对比两个快照之间的增长。' },
    { text: '模块级的 leakPool 数组持有 sink；setInterval 和 resize 监听器在 cleanup 里没清理。' },
  ],
  reflection: {
    prompt: '本关内存泄漏的根因是？',
    options: [
      'useEffect 的 cleanup 是空的：定时器、监听器和模块级 leakPool 都没释放',
      'React 本身有内存泄漏',
      'useState 占用内存',
      'CSS 文件太大',
    ],
    correctIndex: 0,
    explanation:
      '组件 unmount 时 React 调用 cleanup 函数。本关 cleanup 是空的——定时器还在跑、window 上还挂着监听器、模块级的 leakPool 数组持有 sink，都没释放。',
  },
};
