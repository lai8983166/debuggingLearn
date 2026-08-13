import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🏁',
      message: '结业关卡：提交反馈会失败。需要 Console + Network + Sources 三个面板协作。',
    },
    {
      emoji: '👀',
      message: '第一步总是 Console——点提交后看 Console 有一条 warning，里面打印了 payload 对象。',
    },
    {
      emoji: '🔍',
      message: '第二步 Network——看 /api/feedback 请求的 Response，服务端给了非常具体的提示。',
    },
  ],
  steps: [
    {
      title: '触发 bug',
      body: '填好表单点提交。会看到"提交失败：..."的红色错误。先看页面提示，再去 DevTools。',
      highlightSelector: '.feedback',
    },
    {
      title: '1. 看 Console',
      body: '打开 Console。有一条 [App] 正在发送 payload 的 warning，里面打印了对象。展开看里面有哪些字段。',
      devToolsScreenshot: 'console-warning',
    },
    {
      title: '2. 看 Network Response',
      body: 'Network 面板找 /api/feedback，看 Response 子面板。服务端明确告诉你哪个字段不对。',
      devToolsScreenshot: 'network-response-feedback',
    },
    {
      title: '3. Sources 设断点',
      body: 'Sources 找到 buildPayload 函数，在 return 那行设断点，重新提交一次。在 Scope 面板看返回的对象字段名。',
      devToolsScreenshot: 'sources-buildpayload',
    },
    {
      title: '对比发现',
      body: '服务端要 contactEmail，但代码里写的是 contactMail。一个字母的差别——这就是综合关的核心。',
    },
  ],
  hints: [
    { text: '提交失败时先看 Console 有没有 warning。' },
    { text: 'Network Response 里服务端会告诉你期望的字段名。' },
    { text: 'buildPayload 函数里 contactMail 应该是 contactEmail。' },
  ],
  reflection: {
    prompt: '综合关卡的核心 bug 是？',
    options: [
      'buildPayload 把 contactEmail 拼成了 contactMail',
      'fetch 的 Content-Type 不对',
      '邮箱格式校验失败',
      '服务端不可用',
    ],
    correctIndex: 0,
    explanation:
      '字段名和服务端 schema 不一致。客户端拼错了一个字母（contactMail vs contactEmail），服务端直接拒收并返回 400。',
  },
};
