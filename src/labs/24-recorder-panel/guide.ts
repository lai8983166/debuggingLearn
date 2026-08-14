import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '🎬',
      message: 'Recorder 面板（Chrome 117+）录制 UI 操作流 → 保存 → 回放 → 导出 E2E 脚本。',
    },
    {
      emoji: '▶️',
      message: '录制完点 Replay 按钮回放——表单会被自动重新填写提交，你不用动。',
    },
    {
      emoji: '📤',
      message: 'Export 菜单能导出 Puppeteer / Playwright / WebdriverIO 脚本——秒出 E2E 测试。',
    },
  ],
  steps: [
    {
      title: '打开 Recorder',
      body: 'DevTools 右上 ⋮ → More tools → Recorder。或 Cmd+Shift+P 搜 "Show Recorder"。',
      devToolsScreenshot: 'recorder-open',
    },
    {
      title: '新建录制',
      body: '点 "Start new recording"，给流程起名（如 signup-flow），点 Start。',
      devToolsScreenshot: 'recorder-new',
    },
    {
      title: '操作页面',
      body: '在左边的页面上走完整个表单：输入姓名 → 下一步 → 选计划 → 下一步 → 提交。Recorder 会记录每一步。',
      highlightSelector: '.rec__step',
    },
    {
      title: '停止并查看',
      body: '点 End recording。左侧时间线列出每步操作（click / change / navigate），可展开看 selector。',
      devToolsScreenshot: 'recorder-steps',
    },
    {
      title: '回放',
      body: '点 ▶ Replay 按钮——浏览器自动重放整个流程（包括重新输入文字）。',
      devToolsScreenshot: 'recorder-replay',
    },
    {
      title: '导出脚本',
      body: '点 Export 下拉 → 选 Puppeteer（或 Playwright）→ 下载 .js 文件。这就是可运行的 E2E 测试。',
      devToolsScreenshot: 'recorder-export',
    },
  ],
  hints: [
    { text: 'Recorder 在 More tools 里，Chrome 117+ 才有。' },
    { text: '录制完点 ▶ Replay 自动重放流程。' },
    { text: 'Export → Puppeteer/Playwright 直接生成 E2E 脚本。' },
  ],
  reflection: {
    prompt: 'Recorder 面板导出的脚本最适合用来做？',
    options: [
      'E2E 回归测试（CI 里自动跑 UI 流程）',
      '单元测试',
      '性能测试',
      '安全扫描',
    ],
    correctIndex: 0,
    explanation: 'Recorder 生成 Puppeteer/Playwright 脚本，模拟真实用户操作（点击/输入/导航），是 E2E 回归测试的完美起点。导出后通常要加断言（expect）才能当测试用。',
  },
};
