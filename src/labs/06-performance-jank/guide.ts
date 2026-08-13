import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🎬',
      message: '看右上角的 FPS 计数器（应该明显低于 60）。球在动但卡顿——这就是 jank。',
    },
    {
      emoji: '📊',
      message: '打开 Performance 面板，点左上的 ● 圆点开始录制，等 3 秒再点停止。',
    },
    {
      emoji: '🔥',
      message: '在 Main 线程的火焰图里找"宽且红"的函数（占用大量时间）——记住它的名字。',
    },
  ],
  steps: [
    {
      title: '观察 FPS',
      body: '看右上角 FpsMeter 显示的数字。理想是 60，本关应该明显更低（< 30 都正常）。',
      highlightSelector: '.fps-meter',
    },
    {
      title: '打开 Performance 面板',
      body: 'DevTools 切到 "Performance"（旧版本叫 "Timeline"）面板。',
      devToolsScreenshot: 'performance-panel',
    },
    {
      title: '录制',
      body: '点左上角的 ● Record 按钮，等约 3 秒后点 Stop。期间页面继续运行，所有主线程活动都被记录。',
      devToolsScreenshot: 'performance-record',
    },
    {
      title: '看 Main 线程',
      body: '时间轴下方 Main 这一行是主线程。火焰图里每一格是一个函数调用，越宽 = 越慢。',
      devToolsScreenshot: 'performance-main',
    },
    {
      title: '定位最宽的格子',
      body: '在 Main 火焰图里找最宽（红/橙色）的函数标签。鼠标悬停看耗时。应该是 expensiveComputation。',
      devToolsScreenshot: 'performance-flamegraph',
    },
    {
      title: '看 Bottom-Up',
      body: '底部切到 "Bottom-Up" 视图，按 "Self Time" 排序，看哪个函数累计耗时最多。',
      devToolsScreenshot: 'performance-bottomup',
    },
  ],
  hints: [
    { text: '卡顿的源头是动画里每帧都做大量计算。' },
    { text: 'Performance 面板录一段，看 Main 火焰图。' },
    { text: '占据主线程大块时间的是 expensiveComputation 函数。' },
  ],
  reflection: {
    prompt: '火焰图里占用主线程大部分时间的函数名是？',
    options: [
      'expensiveComputation',
      'requestAnimationFrame',
      'setPosition',
      'Math.sin',
    ],
    correctIndex: 0,
    explanation:
      'expensiveComputation 每帧跑 30 万次浮点运算。虽然单次 30 万次不算太久，但每帧都跑，主线程被堵，掉帧。',
  },
};
