import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '📊',
      message: '看右上角 CLS 数字（应该 > 0.1）。Rendering 面板能可视化"哪些区域在抖"。',
    },
    {
      emoji: '🎨',
      message: 'Cmd/Ctrl+Shift+P → "Show Rendering" → 找到 "Layout Shift Regions" 勾选。',
    },
    {
      emoji: '🖌',
      message: '同面板的 "Paint Flashing" 高亮所有重绘区域（绿色闪烁），帮助找不必要的重绘。',
    },
  ],
  steps: [
    {
      title: '打开 Rendering 面板',
      body: 'Cmd+Shift+P → "Show Rendering" → 回车。Rendering 面板出现在 DevTools drawer（底部）。',
      devToolsScreenshot: 'rendering-panel',
    },
    {
      title: '勾选 Layout Shift Regions',
      body: 'Rendering 面板顶部有一系列复选框。勾上 "Layout Shift regions" 和 "Paint flashing"。',
      devToolsScreenshot: 'rendering-checkboxes',
    },
    {
      title: '刷新页面观察',
      body: '刷新页面（或滚动）。会看到蓝色矩形高亮"产生 layout shift 的区域"，绿色矩形高亮"被重绘的区域"。',
      highlightSelector: '.render-lab__content',
    },
    {
      title: '看 Core Web Vitals',
      body: 'Rendering 面板还有一个 "Core Web Vitals" 选项，实时显示 LCP / CLS / INP 数值。比页面右上角的 FpsMeter 更准（这是 DevTools 官方指标）。',
      devToolsScreenshot: 'rendering-web-vitals',
    },
    {
      title: '其他 Rendering 选项',
      body: '面板里还有：FPS meter、Scrolling performance issues、Emulate color scheme、Emulate vision deficiencies（色盲模拟）等，逐个勾上试试。',
    },
  ],
  hints: [
    { text: 'Rendering 面板藏在 Cmd+Shift+P → "Show Rendering"。' },
    { text: '"Layout Shift regions" 勾上后蓝色高亮 = 抖动区域。' },
    { text: '"Paint flashing" 勾上后绿色高亮 = 重绘区域。' },
  ],
  reflection: {
    prompt: 'Rendering 面板里"Layout Shift Regions" 复选框的作用是？',
    options: [
      '高亮所有产生 layout shift 的区域',
      '强制页面不抖动',
      '显示 FPS',
      '模拟色盲',
    ],
    correctIndex: 0,
    explanation: '勾上后页面会动态高亮"被推动 / 改变尺寸"的区域，蓝色矩形。配合 Core Web Vitals 实时数字可以定位 CLS 来源。',
  },
};
