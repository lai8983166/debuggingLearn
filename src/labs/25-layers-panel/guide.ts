import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🗂',
      message: 'Layers 面板显示浏览器创建的所有 GPU 合成层。层太多 = 内存浪费 + 合成开销。',
    },
    {
      emoji: '🔍',
      message: 'Cmd/Ctrl+Shift+P → "Show Layers"。左侧是层列表（含内存占用），右侧可拖动旋转的 3D 视图。',
    },
    {
      emoji: '🛠',
      message: '点修复按钮移除多余 will-change，回 Layers 看层数变化。',
    },
  ],
  steps: [
    {
      title: '打开 Layers',
      body: 'Cmd+Shift+P → 搜 "Show Layers" → 回车。',
      devToolsScreenshot: 'layers-open',
    },
    {
      title: '看层列表',
      body: '左侧列出每个合成层：大小 / 内存占用 / 提升原因（如 "will-change: transform"）。',
      devToolsScreenshot: 'layers-list',
    },
    {
      title: '3D 视图',
      body: '右侧 3D 视图可拖动旋转。每个层是一块"板子"。如果层堆得像千层饼 → 层爆炸。',
      devToolsScreenshot: 'layers-3d',
    },
    {
      title: '数一数',
      body: '修复前应该有 ~10 层（每张卡片一层）。每层都占 GPU 内存（宽×高×4 字节）。',
      highlightSelector: '.lyr__grid',
    },
    {
      title: '应用修复',
      body: '点页面下方"应用修复"按钮。回到 Layers 面板刷新（可能需要重新打开），层数降到 1-2。',
      highlightSelector: '.lyr__fix .btn--primary',
    },
  ],
  hints: [
    { text: 'Layers 面板在 Command Menu → "Show Layers"。' },
    { text: '每个合成层占 宽×高×4 字节的 GPU 内存。' },
    { text: 'will-change 只给真正要动画的元素加，动画结束就移除。' },
  ],
  validate: () => {
    const grid = document.querySelector('.lyr__grid');
    if (grid?.classList.contains('lyr__grid--fixed')) {
      return { passed: true, feedback: '' };
    }
    return {
      passed: false,
      feedback: '还没点"应用修复"。先用 Layers 面板看层爆炸，再点修复按钮对比层数。',
    };
  },
  reflection: {
    prompt: 'will-change: transform 的正确用法是？',
    options: [
      '只给即将执行动画的元素加，动画结束后移除',
      '给所有元素加，性能更好',
      '只在 CSS 里全局声明',
      '跟性能无关，随便用',
    ],
    correctIndex: 0,
    explanation: 'will-change 提示浏览器"这个元素即将变化"，浏览器会为它创建独立合成层。滥用 = 层爆炸（内存浪费 + 合成开销）。最佳实践：JS 在动画开始前加 class，结束后移除。',
  },
};
