import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🌍',
      message: '三家 DevTools 各有所长：Chrome 最全、Safari 的图层视图好用、Firefox 的 Grid 调试最强。',
    },
    {
      emoji: '🍎',
      message: 'Safari 开发菜单默认隐藏：设置 → 高级 → 勾选"在菜单栏中显示开发菜单"。',
    },
    {
      emoji: '🦊',
      message: 'Firefox 的响应式模式可以同时模拟触屏 + 网络 throttling，比 Chrome 一体化。',
    },
  ],
  steps: [
    {
      title: '启用 Safari 开发菜单',
      body: 'Safari → 设置（⌘,）→ 高级 → 勾选"在菜单栏中显示开发菜单"。然后 Cmd+Opt+I 打开 Web Inspector。',
    },
    {
      title: '核心差异记忆法',
      body: '面板叫法不同：Elements=元素=检查器；Sources=来源代码=调试器。功能基本对应，找的时候按语义翻。',
      devToolsScreenshot: 'cross-browser-panels',
    },
    {
      title: '各家独有武器',
      body: 'Safari：图形层（Layers）+ WebGPU 检查。Firefox：Grid 可视化 + Fonts 面板 + Shapes 编辑。Chrome：Recorder + Coverage + Lighthouse。',
      devToolsScreenshot: 'cross-browser-unique',
    },
    {
      title: '"Chrome 好 Safari 坏"怎么排查',
      body: '常见原因：日期格式（Safari 不认 2024-1-1）、flex gap 老版本、-webkit- 前缀。在 Safari 的 Console 直接跑出问题的代码段对比。',
    },
  ],
  hints: [
    { text: 'Safari 开发菜单要在设置 → 高级里手动启用。' },
    { text: 'Firefox 的 Grid 可视化是独有强项；Chrome 的 Coverage 是独有。' },
    { text: 'Safari 的日期解析比 Chrome 严格（new Date("2024-1-1") 会 Invalid Date）。' },
  ],
  reflection: {
    prompt: 'Firefox DevTools 相对独有的功能是？',
    options: [
      'Grid 布局可视化 + Fonts 面板',
      'Lighthouse 跑分',
      'Coverage 死代码分析',
      'Recorder 录制',
    ],
    correctIndex: 0,
    explanation: 'Grid 可视化和 Fonts 面板是 Firefox 独有；Lighthouse、Coverage、Recorder 是 Chrome 独有。Safari 的独有优势是图形层视图（比 Chrome 的 Layers 更好用）。',
  },
};
