import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🏥',
      message: '本关页面"看着还行"，但 Lighthouse 跑分会很难看。Lighthouse 是 DevTools 内置的体检工具。',
    },
    {
      emoji: '🏃',
      message: '打开 Lighthouse 面板（DevTools 顶部 tab，可能要在 ">>" 里找）。Categories 四个勾全选，Mode: Navigation，点 Generate report。',
    },
    {
      emoji: '📊',
      message: '跑完后看四个分数（Performance / Accessibility / Best Practices / SEO）。点每个类别的"扣分项"展开看具体问题。',
    },
  ],
  steps: [
    {
      title: '找到 Lighthouse 面板',
      body: 'DevTools 顶部 tab 横滑找 "Lighthouse"。如果没有，点 ">>" 下拉里选。',
      devToolsScreenshot: 'lighthouse-panel',
    },
    {
      title: '配置报告',
      body: 'Categories 四个全选（Performance / Accessibility / Best Practices / SEO）。Device 选 Mobile（更严格）。Mode: Navigation。',
      devToolsScreenshot: 'lighthouse-config',
    },
    {
      title: 'Generate report',
      body: '点 "Analyze page load" 按钮。等待 5-10 秒，Lighthouse 会重新加载页面并跑所有审计。',
      devToolsScreenshot: 'lighthouse-running',
    },
    {
      title: '读分数',
      body: '报告顶部有四个 0-100 分圆环。本页面至少有一个类别会低于 50。点最低分类别，展开看具体的 audit 失败项。',
      devToolsScreenshot: 'lighthouse-report',
    },
    {
      title: '看具体扣分',
      body: '每个失败 audit 有 "Learn more" 链接到 web.dev 详细文档。截图保存你的分数，方便修复后对比。',
    },
  ],
  hints: [
    { text: 'Lighthouse 在 DevTools 顶部 tab 横滑可以找到。' },
    { text: '四类都要选：Performance / Accessibility / Best Practices / SEO。' },
    { text: '本关 hero 图缺 alt 和尺寸、CTA 黄字白底对比度不足、首屏外链大图。' },
  ],
  reflection: {
    prompt: '本页面 Lighthouse 跑分最低的类别是？',
    options: ['Performance', 'Accessibility', 'Best Practices', 'SEO'],
    // 本关四个类别都会低，但 Accessibility 几乎必扣（alt 缺失 + 对比度不足 + 缺 lang）
    correctIndex: 1,
    explanation:
      'Accessibility 通常最低：img 缺 alt（多个）、CTA 文字对比度 1.6:1 远低于 4.5:1 标准、html 标签缺 lang 属性。Performance 也会低，但 a11y 扣分更彻底。',
  },
};
