import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🏎',
      message: '快速输入 A 再输入 B——你会看到结果先变成 B 的，然后被 A 覆盖。这就是异步竞态。',
    },
    {
      emoji: '📚',
      message: '打开 Console 看 [App] firing search 日志，理解请求发出顺序。A 先发但晚到，B 后发但先到。',
    },
    {
      emoji: '🔧',
      message: '点"应用 AbortController 修复"按钮，再试 A→B——旧请求会被取消，UI 永远显示最新输入。',
    },
  ],
  steps: [
    {
      title: '触发竞态',
      body: '在输入框快速输入字母 A，紧接着输入 B（< 500ms 间隔）。注意 UI 输出的变化。',
      highlightSelector: '.race__input',
    },
    {
      title: '观察 Console',
      body: 'Console 会看到 [App] firing search for "A" 和 for "B" 两条日志，按发送顺序排列。',
      devToolsScreenshot: 'console-async-log',
    },
    {
      title: '看 Network',
      body: 'Network 面板按时间排序请求。注意：A 请求的"响应时间"明显长于 B 请求。',
      devToolsScreenshot: 'network-race',
    },
    {
      title: '在 Sources 设断点',
      body: 'Sources 找到 setOutput(data) 那一行设断点。重新触发竞态，看哪次 setOutput 最后执行——会是晚到的 A 请求。',
      devToolsScreenshot: 'sources-async-stack',
    },
    {
      title: '看异步堆栈',
      body: '暂停时 Scope 面板上方有 Call Stack。开启 "Async stack traces"（DevTools Settings → Experiments）能看到 fetch 链的完整调用路径。',
    },
    {
      title: '应用修复',
      body: '点页面"应用 AbortController 修复"按钮，再触发竞态。Console 会看到 "request #X aborted (good)" 日志——旧请求被取消了。',
      highlightSelector: '.btn--primary',
    },
  ],
  hints: [
    { text: '竞态：先发的请求晚到，覆盖了后发的正确结果。' },
    { text: 'Console 看 [App] firing 日志，Network 看时序。' },
    { text: 'AbortController.abort() 能取消未完成的 fetch。' },
  ],
  validate: () => {
    // 主动型：检查学员是否点了修复按钮
    const btn = document.querySelector('.race .btn--primary');
    if (btn?.textContent?.includes('已应用')) {
      return { passed: true, feedback: '' };
    }
    return {
      passed: false,
      feedback: '还没点"应用 AbortController 修复"按钮。点了之后再用一次 A→B 验证修复效果。',
    };
  },
  reflection: {
    prompt: 'AbortController 取消 fetch 时，Promise 会怎样？',
    options: [
      'reject 一个 name 为 "AbortError" 的 DOMException',
      'resolve 一个 undefined',
      '永远挂起（pending）',
      '正常 resolve 原始数据',
    ],
    correctIndex: 0,
    explanation:
      'fetch 收到 abort 信号后立即 reject，err instanceof DOMException && err.name === "AbortError"。代码里要判断这个 case 跳过错误处理。',
  },
};
