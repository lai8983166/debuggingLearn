import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🤔',
      message: '商品卡片看起来"顺序反了"且挤在一起。Elements 面板是排查样式布局的首选。',
    },
    {
      emoji: '🔎',
      message:
        '在 Elements 面板里找到 .buggy-grid 元素，看右侧 Computed 面板的 flex-direction。',
    },
    {
      emoji: '🛠',
      message:
        '在 Elements 面板直接双击样式值改一改（仅本机生效，刷新会重置），看布局对不对。',
    },
  ],
  steps: [
    {
      title: '右键检查',
      body: '在任一商品卡片上点右键 → "检查"（Inspect），DevTools 自动定位到该元素。',
      highlightSelector: '.product-card',
    },
    {
      title: '找到父容器',
      body: '在 Elements 树里向上找，定位到 .buggy-grid 这个容器（它是所有卡片的父节点）。',
      highlightSelector: '.buggy-grid',
    },
    {
      title: '看 Computed 样式',
      body: '右侧切到 "Computed" 子面板（不是 Styles），找 flex-direction 这一项的值。',
      devToolsScreenshot: 'elements-computed',
    },
    {
      title: '现场实验',
      body: '回到 "Styles" 子面板，点击 flex-direction 的值改一改（比如改成 row），观察页面变化。这是 Elements 面板最实用的能力：实时调试样式。',
      devToolsScreenshot: 'elements-styles-edit',
    },
  ],
  hints: [
    { text: '从外观看是 flex 布局问题，先找 flex 容器。' },
    { text: '在 Elements 面板里，容器是 .buggy-grid。' },
    { text: 'flex-direction 的值不是常见的 row / column，而是一个倒序的变体。' },
  ],
  validate: () => {
    // Active validation: read the computed style of .buggy-grid.
    const grid = document.querySelector('.buggy-grid');
    if (!grid) {
      return { passed: false, feedback: '页面上找不到 .buggy-grid 元素' };
    }
    // Learner may have edited the style in DevTools. Check computed value.
    const computed = window.getComputedStyle(grid);
    const dir = computed.flexDirection;
    const wrap = computed.flexWrap;
    // Pass condition: learner changed flex-direction away from column-reverse
    // (we accept row, row-reverse, column — anything that's not the bug).
    if (dir === 'column-reverse') {
      return {
        passed: false,
        feedback:
          'flex-direction 还是 column-reverse。在 Styles 面板里把它改掉，再点检查答案。',
      };
    }
    if (wrap === 'nowrap') {
      return {
        passed: false,
        feedback:
          '方向对了，但卡片还会挤一行。flex-wrap 也加上 wrap 试试（提示：这是次要 bug，主 bug 是方向）。',
      };
    }
    return {
      passed: true,
      feedback: '',
    };
  },
  reflection: {
    prompt: '卡片排列异常的根因是什么？',
    options: [
      'flex-direction 被写成了 column-reverse（应该为 row 或加 wrap）',
      'product-card 的宽度设小了',
      'products 数组里数据重复',
      'h4 标签的字体太大',
    ],
    correctIndex: 0,
    explanation:
      'column-reverse 让卡片不仅竖排，还倒序；没有 wrap 导致一行装不下时溢出。修复：row + wrap。',
  },
};
