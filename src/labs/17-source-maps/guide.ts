import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🗺',
      message: '生产环境的 JS 都是 minify 后的。Source Maps 让 DevTools 自动还原原代码。',
    },
    {
      emoji: '⚙️',
      message: 'DevTools Settings（齿轮）→ Sources → 勾选 "Enable JavaScript source maps"',
    },
    {
      emoji: '📍',
      message: '启用后，Sources 面板里的 webpack:// 或其他源码树会出现。',
    },
  ],
  steps: [
    {
      title: '打开 DevTools Settings',
      body: '点 DevTools 右上角的 ⚙ 齿轮图标（或按 F1）。',
      devToolsScreenshot: 'devtools-settings',
    },
    {
      title: 'Sources 子菜单',
      body: 'Settings 弹窗里左侧选 "Sources"。找到 "Enable JavaScript source maps" 复选框。',
      devToolsScreenshot: 'settings-sources',
    },
    {
      title: '勾选 + 刷新',
      body: '勾上复选框，关闭 Settings，刷新页面。Sources 面板里会出现源码树。',
    },
    {
      title: '点堆栈链接',
      body: '在 Console 看一个错误堆栈，点右侧的源码位置链接。会跳到 Sources 面板的原始 .ts/.tsx 文件（而非 .min.js）。',
    },
  ],
  hints: [
    { text: 'DevTools 右上 ⚙ → Sources 子菜单。' },
    { text: '"Enable JavaScript source maps" 复选框默认开启，但被某些环境（无痕模式）会关。' },
    { text: 'Server 端要在响应 .min.js 时同时提供 .min.js.map（同路径 +.map）' },
  ],
  validate: () => {
    const btn = document.querySelector('.sm-lab .btn--primary');
    if (btn && btn.textContent?.includes('应用 Source Map')) {
      return {
        passed: false,
        feedback: '还没点"应用 Source Map（模拟）"按钮。这模拟了在 DevTools 里启用 source map 的效果。',
      };
    }
    const ok = document.querySelector('.sm-lab__tag-ok');
    if (ok) return { passed: true, feedback: '' };
    return { passed: false, feedback: '找不到通关标记' };
  },
  reflection: {
    prompt: 'Source map 文件的扩展名通常是？',
    options: ['.map', '.src', '.original', '.debug'],
    correctIndex: 0,
    explanation: '.map 是约定。构建工具（webpack/vite/esbuild）会自动生成 bundle.min.js → bundle.min.js.map。',
  },
};
