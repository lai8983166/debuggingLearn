import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '⚛',
      message: 'React DevTools 是独立浏览器扩展（不是 Chrome DevTools 内置）。装了它，F12 里会多出 Components 和 Profiler 两个 tab。',
    },
    {
      emoji: '🔥',
      message: 'Profiler → 点 ● 录制 → 等几秒 → 停止。火焰图里越宽的条 = 渲染越贵。看 HeavyCard 是否每次都全量渲染。',
    },
    {
      emoji: '🛠',
      message: '点页面下方"应用 React.memo 修复"按钮，再录一次 Profiler 对比——MemoHeavyCard 不再重渲染。',
    },
  ],
  steps: [
    {
      title: '安装扩展',
      body: 'Chrome Web Store 搜 "React Developer Tools" 安装。刷新页面后 F12 顶部会出现 Components / Profiler 新 tab。',
    },
    {
      title: 'Components 面板',
      body: '点 Components tab，左侧是组件树。点任意 HeavyCard——右侧能看到它的 props（label）和 hooks。',
      devToolsScreenshot: 'react-components',
    },
    {
      title: 'Profiler 录制',
      body: 'Profiler tab → 点左上 ● 圆点开始录制 → 等 5 秒 → 停止。出现 commit 时间线。',
      devToolsScreenshot: 'react-profiler-record',
    },
    {
      title: '读火焰图',
      body: '每次父组件 tick +1 都产生一个 commit。点某个 commit，火焰图显示哪些组件渲染了。没有 memo 的 HeavyCard 每次都出现（灰色 = 没渲染，彩色 = 渲染了）。',
      devToolsScreenshot: 'react-profiler-flame',
    },
    {
      title: '高亮渲染',
      body: 'Components tab 左上角有个 ⚙ 图标，勾选 "Highlight updates when components render"。页面上每次渲染的组件会被彩色边框圈出来——3 张卡片每秒都闪。',
    },
    {
      title: '应用修复对比',
      body: '点页面下方"应用 React.memo 修复"，再录一次 Profiler。MemoHeavyCard 变灰（不再渲染）。',
      highlightSelector: '.rdt__fix .btn--primary',
    },
  ],
  hints: [
    { text: 'React DevTools 是浏览器扩展，需单独安装。' },
    { text: 'Profiler 的 ● 按钮录制，火焰图灰色 = 跳过渲染，彩色 = 渲染了。' },
    { text: 'React.memo 包住组件后 props 不变就跳过渲染。' },
  ],
  validate: () => {
    const btn = document.querySelector('.rdt__fix .btn--primary') as HTMLButtonElement | null;
    if (btn?.disabled) return { passed: true, feedback: '' };
    return {
      passed: false,
      feedback: '还没点"应用 React.memo 修复"。先用 Profiler 录制看问题，再点修复按钮对比。',
    };
  },
  reflection: {
    prompt: 'React.memo 的作用是？',
    options: [
      'props 未变化时跳过组件的重新渲染',
      '让组件渲染更快',
      '缓存组件的 DOM',
      '避免组件挂载',
    ],
    correctIndex: 0,
    explanation: 'React.memo 是高阶组件：对 props 做浅比较，相同则跳过渲染（返回缓存的元素）。context 变化不受 memo 拦截——本关 tick 通过 context 传播所以修复后仍会渲染一次 Provider，但卡片 props 没变就被跳过了。',
  },
};
