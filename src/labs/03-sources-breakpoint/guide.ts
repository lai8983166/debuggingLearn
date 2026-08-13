import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🧮',
      message: '购物车的合计金额比期望多了一倍。手算一下：50×2 + 30×1 = 130。但页面显示 260。',
    },
    {
      emoji: '🐛',
      message: '打开 Sources 面板（Cmd/Ctrl+P 搜文件名），找到 computeTotal 函数。',
    },
    {
      emoji: '🔬',
      message:
        '在 total += ... 这行行号上点一下设置断点，然后点页面"显示期望金额"按钮，断点会暂停，看右侧 Scope 面板里的 item 和 total 值。',
    },
  ],
  steps: [
    {
      title: '打开 Sources 面板',
      body: 'DevTools 切到 Sources 面板。左侧 File Navigator 找到 Scenario.tsx（或在 Page 上 Cmd/Ctrl+P 搜索）。',
      devToolsScreenshot: 'sources-panel',
    },
    {
      title: '定位 computeTotal',
      body: '在 Scenario.tsx 里找到 `function computeTotal` 函数。注意 `total += item.unitPrice * item.qty * 2` 这一行。',
    },
    {
      title: '设置断点',
      body: '点击该行左侧的行号（会出现一个蓝色标记），断点就设上了。',
      devToolsScreenshot: 'sources-breakpoint',
    },
    {
      title: '触发执行',
      body: '回到页面，点"显示期望金额"按钮。代码执行到断点处会暂停，DevTools 高亮当前行。',
      highlightSelector: '.cart__btn',
    },
    {
      title: '看变量值',
      body: '右侧 "Scope" 面板展开 Local，看 item.unitPrice、item.qty 和 total 的实时值。可以鼠标悬停在代码里的变量名上也能看到。',
      devToolsScreenshot: 'sources-scope',
    },
    {
      title: '逐步执行',
      body: '点工具栏的 "Step over"（F10）逐行执行，观察 total 的变化规律——你会发现每次都翻倍。',
    },
  ],
  hints: [
    { text: '错误是"合计翻倍"。计算逻辑在 computeTotal 函数里。' },
    { text: '在 `total += item.unitPrice * item.qty * 2` 行设断点。' },
    { text: '断点暂停后看 Scope 面板，能看到 `* 2` 让每次累加都翻倍。' },
  ],
  reflection: {
    prompt: 'Scope 面板里，每次循环 total 增加多少（以 T 恤为例，50×2）？',
    options: [
      '每次 +100（50×2），但实际加了 200 因为多乘了 2',
      '每次 +50',
      '每次 +2',
      '没有变化',
    ],
    correctIndex: 0,
    explanation:
      'item.unitPrice * item.qty = 100（T 恤）。但代码 `* 2` 后变 200，所以 total 每次多加 100。',
  },
};
