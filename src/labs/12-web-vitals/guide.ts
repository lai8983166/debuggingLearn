import type { LabGuideConfig } from '@/labs/types';

// Multi-phase validate state. Kept in module scope so the validate()
// closure can advance phase across calls. Reset on lab remount isn't
// automatic — see FIX.md for caveat.
let phase = 0;
// Allow Scenario to reset phase via this export when needed
export function _resetPhase() {
  phase = 0;
}

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🎯',
      message: 'Web Vitals 三大指标：LCP（加载）/ CLS（稳定）/ INP（交互）。看右上角实时数值（红色 = 不合格）。',
    },
    {
      emoji: '📍',
      message: '本关三个 bug 同时存在。点"应用 X 修复"按钮逐个修。每修一个看右上对应数值变绿。',
    },
    {
      emoji: '✅',
      message: '三项全修后点"检查答案"通关——validate 会依次确认每一项都修好了。',
    },
  ],
  steps: [
    {
      title: '看实时数值',
      body: '右上角 WebVitalsMeter 显示 LCP / CLS / INP。当前应该都是红色（LCP > 2500ms, CLS > 0.1, INP > 200ms）。',
      highlightSelector: '.wv-meter',
    },
    {
      title: '修 LCP',
      body: '点"应用 LCP 修复"按钮。hero 图换小尺寸 + 加 width/height/loading。LCP 应该从红变绿。',
      highlightSelector: '.wv__section:first-of-type .btn',
    },
    {
      title: '修 CLS',
      body: '点"应用 CLS 修复"。图片占位 div 加 aspect-ratio，预占空间，加载完成后不再推动下方内容。CLS 应该归零。',
      highlightSelector: '.wv__section:nth-of-type(2) .btn',
    },
    {
      title: '修 INP',
      body: '点"应用 INP 修复"。按钮 onClick 从同步 500ms 循环改成 setTimeout 让主线程透气。再点几次主按钮，INP 应该大幅下降。',
    },
    {
      title: '全部变绿',
      body: '三项全修后点"检查答案"通关。validate() 内部依次检查 LCP / CLS / INP 是否都修了。',
    },
  ],
  hints: [
    { text: '看右上角 WebVitalsMeter。三个指标，红色 = 不合格。' },
    { text: '点页面上三个"应用 X 修复"按钮。' },
    { text: 'validate() 内部分三阶段，全部检查通过才返回 passed=true。' },
  ],
  validate: () => {
    // 主动型多阶段验证：读取页面侧的修复标记（class）来判断学员是否点了按钮。
    // 这里我们看 Scenario 里的 img 和 div 状态。
    const hero = document.querySelector('.wv__hero');
    const placeholder = document.querySelector('.wv__card > div');
    const primaryBtn = document.querySelector('.wv__section:nth-of-type(3) .btn--primary');

    const lcpFixed = hero?.classList.contains('wv__hero--fixed') ?? false;
    const clsFixed =
      placeholder?.classList.contains('wv__placeholder-good') ?? false;
    const inpFixed = primaryBtn?.textContent?.includes('已修复') ?? false;

    if (phase === 0) {
      if (lcpFixed) {
        phase = 1;
        return { passed: false, feedback: '✓ LCP 已修。继续看 CLS…' };
      }
      return {
        passed: false,
        feedback: '阶段 1/3：LCP 还没修。点第一个"应用 LCP 修复"按钮。',
      };
    }
    if (phase === 1) {
      if (clsFixed) {
        phase = 2;
        return { passed: false, feedback: '✓ CLS 已修。最后看 INP…' };
      }
      return {
        passed: false,
        feedback: '阶段 2/3：CLS 还没修。点第二个"应用 CLS 修复"按钮。',
      };
    }
    if (phase === 2) {
      if (inpFixed) {
        phase = 3;
        return { passed: true, feedback: '' };
      }
      return {
        passed: false,
        feedback: '阶段 3/3：INP 还没修。点第三个"应用 INP 修复"，然后点几次主按钮验证。',
      };
    }
    return { passed: true, feedback: '' };
  },
  reflection: {
    prompt: 'Web Vitals 三大指标中，反映"交互响应速度"的是？',
    options: ['LCP（最大内容渲染）', 'CLS（累积布局偏移）', 'INP（交互到下一帧）', 'TTFB（首字节时间）'],
    correctIndex: 2,
    explanation:
      'INP（Interaction to Next Paint）= 从用户操作到下一帧绘制的时间。LCP 反映加载、CLS 反映视觉稳定、INP 反映交互响应。',
  },
};
