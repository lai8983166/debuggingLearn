import type { LabGuideConfig } from '@/labs/types';

export const guide: LabGuideConfig = {
  consoleHints: [
    {
      emoji: '📱',
      message: '模拟器测不出真机的触摸 / 性能 / 网络差异。真机调试 = 电脑上完整 DevTools + 手机上实时页面。',
    },
    {
      emoji: '🔌',
      message: 'Android Chrome 的入口是 chrome://inspect。USB 连接 + 手机开 USB 调试即可。',
    },
    {
      emoji: '🍎',
      message: 'iOS Safari 远程调试只能在 Mac 上（Safari 的开发菜单）。Windows 用户需要远程 Mac 或用模拟器。',
    },
  ],
  steps: [
    {
      title: '打开 chrome://inspect',
      body: '在电脑 Chrome 地址栏输入 chrome://inspect。这是 Android / WebView / Node 远程调试的总入口。',
      devToolsScreenshot: 'chrome-inspect',
    },
    {
      title: '手机开 USB 调试',
      body: 'Android：设置 → 关于手机 → 连点版本号 7 次开启开发者模式 → 开发者选项 → USB 调试。连电脑后手机弹窗"允许调试"。',
    },
    {
      title: 'Devices 列表',
      body: 'chrome://inspect 页面会列出手机上的 Chrome tab。点下面的 inspect 打开完整 DevTools（ Elements / Console / Sources 全可用）。',
      devToolsScreenshot: 'chrome-inspect-device',
    },
    {
      title: 'iOS Safari 流程',
      body: 'iPhone：设置 → Safari → 高级 → Web 检查器。USB 连 Mac，Mac Safari 开发菜单选设备。仅 Mac 可用。',
      devToolsScreenshot: 'safari-device',
    },
    {
      title: 'WebView 调试',
      body: 'App 内嵌网页（混合开发）也能调：App 开发者调用 setWebContentsDebuggingEnabled(true) 后，chrome://inspect 会列出 WebView。',
    },
    {
      title: '无线调试',
      body: 'Android 11+ 支持无线 ADB：开发者选项 → 无线调试 → 配对。之后不用 USB 线也能 chrome://inspect。',
    },
  ],
  hints: [
    { text: 'chrome://inspect 是 Chrome 远程调试总入口。' },
    { text: 'Android 要开"USB 调试"；iOS 要开"Web 检查器"。' },
    { text: 'iOS Safari 远程调试只能在 Mac 上做。' },
  ],
  reflection: {
    prompt: '调试 Android Chrome 上跑的网页，电脑端入口是？',
    options: [
      'chrome://inspect',
      'chrome://devices',
      'chrome://debug',
      'adb devices',
    ],
    correctIndex: 0,
    explanation: 'chrome://inspect 列出 USB/无线连接的 Android 设备上所有可调试目标（Chrome tab / WebView / Node），点 inspect 打开完整 DevTools。',
  },
};
