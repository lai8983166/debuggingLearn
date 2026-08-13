import type { LabGuideConfig, ReflectionQuestion } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '📱',
      message: '桌面下这页看着挺整齐。但用 DevTools 切到 iPhone 视图就会发现问题——窄屏下没有自动变单列。',
    },
    {
      emoji: '🐌',
      message: '再把 Network 设成 Slow 3G 刷新——外链图片要 5-10 秒才能加载，移动端真实体验很差。',
    },
    {
      emoji: '🔍',
      message: '根因在 Scenario.css 的 .mob__grid 上。窄屏下应该走单列默认值，但代码的写法有问题。',
    },
  ],
  steps: [
    {
      title: '切到 Device Mode',
      body: 'Cmd/Ctrl+Shift+M 切换 Device Mode（或点 DevTools 左上设备图标）。视口变成手机框。',
      devToolsScreenshot: 'device-mode',
    },
    {
      title: '选设备预设',
      body: '顶部 Dimensions 下拉选 "iPhone 12"（或 iPhone SE）。响应式模式会按 390px 宽度渲染。',
      devToolsScreenshot: 'device-iphone',
    },
    {
      title: '开 Network throttle',
      body: 'Network 面板 → 顶部 "Online" 下拉 → 选 "Slow 3G"。',
      devToolsScreenshot: 'network-throttle',
    },
    {
      title: '刷新观察',
      body: '按 Cmd/Ctrl+R 刷新。观察两点：（a）商品列表是否变成单列 （b）图片加载耗时（Network 面板 Time 列）。',
    },
    {
      title: '在 Elements 检查',
      body: '右键商品网格 → 检查。看 .mob__grid 的 computed style，grid-template-columns 的实际值。',
      highlightSelector: '.mob__grid',
    },
  ],
  hints: [
    { text: 'Device Mode 快捷键：Cmd/Ctrl+Shift+M。' },
    { text: 'Network throttle 选 Slow 3G。' },
    { text: 'CSS 里 .mob__grid 默认没设 grid-template-columns，移动端会继承默认 1 列，但桌面 768px 时三列。' },
  ],
  validate: () => {
    // 主动型：检测 .mob__grid 当前 computed style 是否已是单列（学员可能在 Elements 改了 CSS）
    const grid = document.querySelector('.mob__grid');
    if (grid) {
      const cols = window.getComputedStyle(grid).gridTemplateColumns;
      // 学员若在 DevTools 改成了 grid-template-columns: 1fr，会通过
      if (cols.trim() === '1fr' || /^1fr\s+1fr$/.test(cols.trim())) {
        return { passed: true, feedback: '' };
      }
    }
    return {
      passed: false,
      feedback:
        '看 Scenario.css：.mob__grid 在窄屏下应该显式设 grid-template-columns: 1fr 作为默认值。试着在 DevTools 改一改。',
    };
  },
  reflection: {
    prompt: 'Slow 3G 下，本页面首屏图片大致多久加载完成？',
    options: ['< 1 秒（基本即时）', '约 2-3 秒', '约 5-10 秒甚至更久', '永远不会加载'],
    correctIndex: 2,
    explanation:
      'Slow 3G 模拟 ~400kbps 带宽 + 400ms RTT。picsum 的小图 200x200 大概要 5-10 秒。这就是为什么 mobile-first 优化很重要。',
  } satisfies ReflectionQuestion,
};
