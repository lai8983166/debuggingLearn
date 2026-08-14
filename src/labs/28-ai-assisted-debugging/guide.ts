import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🤖',
      message: 'AI 调试的核心不是"问 AI"而是"喂对上下文"。堆栈 + 代码 + 复现步骤 + 输出要求，四件缺一不可。',
    },
    {
      emoji: '📋',
      message: 'DevTools 是上下文的来源：Console 拷堆栈、Elements 拷 outerHTML、Network 拷请求/响应、Performance 拷掉帧截图。',
    },
    {
      emoji: '⚠️',
      message: 'AI 会"自信地错"——把它的回答当假设，用 DevTools 验证后再改代码。',
    },
  ],
  steps: [
    {
      title: '要素 ①：完整堆栈',
      body: '从 Console 复制完整堆栈（不只第一行）。堆栈里的文件名和行号是 AI 定位的关键线索。',
      highlightSelector: '.aidbg__pre',
    },
    {
      title: '要素 ②：相关代码',
      body: '贴报错位置附近的代码（±10 行），不要贴整个文件。标注文件名和行号。',
    },
    {
      title: '要素 ③：复现步骤',
      body: '"首次进入报错，刷新后正常"这种信息对 AI 极有价值——它暗示了异步时序问题。',
    },
    {
      title: '要素 ④：输出要求',
      body: '明确让 AI：1) 解释错误 2) 列假设（按可能性排序）3) 每个假设的验证方法 4) 推荐修复。结构化输出比"帮我修"有用 10 倍。',
    },
    {
      title: '点开好 prompt 对照',
      body: '点页面"展示完整好 prompt"按钮，对照四要素。',
      highlightSelector: '.aidbg__section .btn--primary',
    },
    {
      title: '验证 AI 的假设',
      body: 'AI 给出的假设要你自己在 DevTools 验证（断点 / Network / Elements）。AI 的准确率高度依赖你给的上下文质量。',
    },
  ],
  hints: [
    { text: '四要素：堆栈 / 代码片段 / 复现步骤 / 输出要求。' },
    { text: 'DevTools 是上下文的来源（Console/Network/Elements 拷数据）。' },
    { text: 'AI 回答当假设，DevTools 验证后再改代码。' },
  ],
  reflection: {
    prompt: 'AI 调试 prompt 里最不该缺少的是？',
    options: [
      '完整错误堆栈 + 相关代码 + 复现步骤 + 明确输出要求',
      '项目的全部源码',
      '礼貌用语',
      '让 AI 随便猜',
    ],
    correctIndex: 0,
    explanation: '四要素缺一不可。堆栈定位位置、代码给语境、复现步骤暗示时序、输出要求让回答结构化可执行。全量源码反而稀释重点。',
  },
};
