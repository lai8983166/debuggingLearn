/**
 * Lab 27 — 真机远程调试
 *
 * 文档型关卡：展示 chrome://inspect、Android USB、iOS Safari、WebView 的调试流程。
 * 反思型验证。
 */

import './Scenario.css';

const PLATFORMS = [
  {
    name: 'Android Chrome（USB）',
    steps: [
      '手机：设置 → 开发者选项 → 打开 USB 调试',
      'USB 连电脑，手机弹窗允许调试',
      '电脑 Chrome 打开 chrome://inspect',
      '页面出现手机上的 tab 列表 → 点 inspect',
      '完整 DevTools 在电脑上，页面在手机上实时渲染',
    ],
  },
  {
    name: 'iOS Safari（需 Mac）',
    steps: [
      'iPhone：设置 → Safari → 高级 → 打开 Web 检查器',
      'USB 连 Mac',
      'Mac Safari：开发菜单 → 选你的 iPhone 设备名',
      '列出手机 Safari 的所有页面 → 点一个调试',
      '仅 Mac 可用——Windows/Linux 调不了 iOS Safari',
    ],
  },
  {
    name: 'Android WebView（App 内嵌页）',
    steps: [
      'App 代码：WebView.setWebContentsDebuggingEnabled(true)（Android）',
      'chrome://inspect 里出现 WebView 条目',
      '点 inspect 调试 App 内嵌的网页',
      '混合开发（Cordova/Capacitor/React Native WebView）的核心调试手段',
    ],
  },
  {
    name: 'Node.js（远程协议）',
    steps: [
      '启动：node --inspect server.js',
      'chrome://inspect → Open dedicated DevTools for Node',
      '断点 / 单步调试 Node 后端代码',
      'VSCode 的 JS 调试也是这个协议',
    ],
  },
];

export function RemoteDebuggingScenario() {
  return (
    <div className="rdbg">
      <h3>📱 真机远程调试</h3>
      <p className="rdbg__lead">
        模拟器测不出真机的触摸、性能、网络行为。真机远程调试让你在电脑上用完整
        DevTools 调试手机上跑的页面。
      </p>

      <div className="rdbg__platforms">
        {PLATFORMS.map((p) => (
          <div key={p.name} className="rdbg__platform">
            <h4>{p.name}</h4>
            <ol className="rdbg__steps">
              {p.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="rdbg__inspect">
        <code>chrome://inspect</code> —— 记住这个 URL，它是 Chrome 远程调试的总入口
      </div>
    </div>
  );
}
