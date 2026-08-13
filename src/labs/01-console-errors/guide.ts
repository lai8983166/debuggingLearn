import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '👀',
      message: '点击页面上的"登录"按钮。注意：什么也没发生？这就是 bug。',
    },
    {
      emoji: '🐞',
      message: '打开 DevTools（F12 或 Cmd+Opt+I）→ Console 面板。你会看到一条红色错误。',
    },
    {
      emoji: '🎯',
      message:
        '错误信息会指向一个变量名。请记住它——你需要在"检查答案"里选出导致问题的变量。',
    },
  ],
  steps: [
    {
      title: '触发 bug',
      body: '点击表单里的"登录"按钮，看页面有什么反应（应该是什么都没发生）。',
    },
    {
      title: '打开 Console',
      body: '按 F12（Windows/Linux）或 Cmd+Opt+I（Mac）打开 DevTools，切到 Console 面板。',
      devToolsScreenshot: 'console-panel',
    },
    {
      title: '读错误信息',
      body: 'Console 顶部应该有一条红色错误，类似 "Cannot read properties of undefined (reading \'...\')"。注意括号里的属性名。',
    },
    {
      title: '回 Sources 看代码',
      body: '点击错误信息右侧的链接（指向源码位置），跳到 Sources 面板看具体哪一行出错。',
      devToolsScreenshot: 'sources-from-console',
    },
  ],
  hints: [
    { text: '点登录按钮后页面没反应，说明 onClick handler 里出错了。' },
    { text: '错误信息里提到了某个属性（例如 endpoint）的访问者。' },
    {
      text: 'bug 在 Scenario.tsx 的 handleSubmit 里：config 实际上是 undefined。',
    },
  ],
  reflection: {
    prompt: '点击"检查答案"。错误信息里"undefined"对应的是哪个变量？',
    options: [
      'config（被断言为对象，但实际是 undefined）',
      'email（用户输入可能为空字符串）',
      'password（用户输入可能为空字符串）',
      'fetch（浏览器原生 API）',
    ],
    correctIndex: 0,
    explanation:
      '错误是 "Cannot read properties of undefined (reading \'endpoint\')"。代码里 `config.endpoint` —— config 是 undefined。',
  },
};
