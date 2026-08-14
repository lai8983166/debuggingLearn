import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🚨',
      message: 'BuggyAnalytics 仪表盘有 5 个混合 bug。不告诉用哪个面板——你得自己挑。',
    },
    {
      emoji: '🧭',
      message: '诊断流程：先看 Console（有无错误）→ Network（API 是否成功）→ Elements（DOM/样式）→ Performance（性能）→ Application（存储）。',
    },
    {
      emoji: '✅',
      message: '5 个修复按钮在页面下方。修完所有 bug 后点"检查答案"通关。',
    },
  ],
  steps: [
    {
      title: '观察现象',
      body: '看页面：卡片挤压、数据"加载中"永不停、点击 Refresh 后页面抖动。这些都是不同 bug 的表现。',
    },
    {
      title: '1. DOM 错乱',
      body: 'Elements 检查 .saas__grid 容器。flex 容器没设 flex-wrap，三个卡片宽度被压扁。点"修复 1"。',
      highlightSelector: '.saas__grid',
    },
    {
      title: '2. 内存泄漏',
      body: 'Performance 录制看主线程任务，会发现每秒有泄漏任务。或直接看代码：useEffect 的 cleanup 是空的，interval 一直跑。点"修复 2"。',
    },
    {
      title: '3. API 失败',
      body: 'Network 面板看 /api/metrics，状态码 500。但 Console 没报错——fetch 的 catch 静默吞了。点"修复 3"。',
      devToolsScreenshot: 'saas-network-500',
    },
    {
      title: '4. a11y 问题',
      body: 'Lighthouse 跑分或用 Rendering 面板的 vision deficiencies。.saas__metric 灰字灰底对比度不足；图标按钮缺 aria-label。点"修复 4"。',
    },
    {
      title: '5. 视觉抖动',
      body: 'Performance 录制 Refresh 操作。会看到连续的 layout / reflow。代码里读 5 次 offsetHeight 强制 reflow。点"修复 5"。',
    },
    {
      title: '通关',
      body: '5 个修复都点完后，"检查答案"会返回 passed=true。这是 v3 最后一关，结业徽章：SaaS 救火队长。',
    },
  ],
  hints: [
    { text: '看 Console + Network + Elements + Performance 四个面板。' },
    { text: '5 个 bug 各对应一个面板：DOM/内存/API/a11y/性能。' },
    { text: '修复按钮在页面下方，每个 bug 一个。' },
  ],
  validate: () => {
    // 主动型：检查 5 个修复按钮是否都点了
    const disabled = document.querySelectorAll('.saas__action .btn[disabled]');
    if (disabled.length === 5) {
      return { passed: true, feedback: '' };
    }
    return {
      passed: false,
      feedback: `已修复 ${disabled.length} / 5 个 bug。继续点其余修复按钮。`,
    };
  },
  reflection: {
    prompt: '诊断真实项目的标准流程是？',
    options: [
      'Console → Network → Elements → Performance → Application，按"错误明显度"顺序排查',
      '随便打开哪个面板开始',
      '只能一个一个试',
      '先看代码再说，DevTools 没用',
    ],
    correctIndex: 0,
    explanation: 'Console 是入口（错误最先暴露）→ Network 看请求 → Elements 看 DOM/CSS → Performance 找瓶颈 → Application 看存储。按"现象 → 根因"逐层深挖。',
  },
};
