import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🎬',
      message: '本关三个动画用了 linear 缓动——感觉机械、不自然。Animations 面板可以可视化时间线。',
    },
    {
      emoji: '📂',
      message: 'Animations 面板藏在 "More tools" 里：DevTools 右上 ⋮ → More tools → Animations。',
    },
    {
      emoji: '🎯',
      message: '打开后点页面里的动画元素（旋转/悬停/进度），Animations 面板会捕获并显示时间线 + easing 字段。',
    },
  ],
  steps: [
    {
      title: '打开 Animations 面板',
      body: 'DevTools 右上角 ⋮ → More tools → Animations。Animations 面板通常出现在底部 drawer。',
      devToolsScreenshot: 'animations-panel',
    },
    {
      title: '触发动画',
      body: '点页面上的元素：🔄 自动旋转 / 悬停 👆 / 进度条自动循环。每触发一次，Animations 面板记录一条时间线。',
      highlightSelector: '.ani__group',
    },
    {
      title: '看时间线',
      body: '时间线横向展开，显示每个动画的 duration、delay、easing。鼠标悬停时间线条目看属性详情。',
      devToolsScreenshot: 'animations-timeline',
    },
    {
      title: '看 easing 字段',
      body: '点击某条动画，下方详情会显示 animation-timing-function 的值。本关三个动画都是 linear。',
      devToolsScreenshot: 'animations-easing',
    },
    {
      title: '修改 easing 验证',
      body: '可以双击 easing 字段直接改（在 DevTools 里改是临时的）。改成 cubic-bezier(0.4, 0, 0.2, 1) 看效果差异。',
    },
    {
      title: '应用持久修复',
      body: '点页面"应用 cubic-bezier 修复"按钮，CSS 会被覆盖。看动画明显变自然——这就是为什么 cubic-bezier 比 linear 好。',
      highlightSelector: '.btn--primary',
    },
  ],
  hints: [
    { text: 'Animations 面板在 More tools 里。' },
    { text: '三个动画都用了 linear easing。' },
    { text: '改成 cubic-bezier(0.4, 0, 0.2, 1) 之类的会让动画自然很多。' },
  ],
  validate: () => {
    // 主动型：检查修复样式是否注入
    const style = document.querySelector('style[data-animations-fix]');
    if (style) {
      return { passed: true, feedback: '' };
    }
    return {
      passed: false,
      feedback: '还没应用 cubic-bezier 修复。点页面下方的修复按钮，再观察动画变化。',
    };
  },
  reflection: {
    prompt: '为什么 linear 让动画"机械感"？',
    options: [
      'linear 全程匀速，没有起止过渡；现实物体的运动都有加速 / 减速过程',
      'linear 的 duration 太长',
      'linear 只能用在不循环的动画',
      'linear 是 deprecated API',
    ],
    correctIndex: 0,
    explanation:
      '现实里物体不会瞬间从 0 加速到全速再瞬间停下——它们都有惯性。cubic-bezier 模拟这种加速 / 减速，所以更自然。',
  },
};
