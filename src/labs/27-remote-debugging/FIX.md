# 关卡 27 速查：真机远程调试

## 为什么必须真机

模拟器/DevTools Device Mode 测不出：
- **触摸事件**（touchstart / gesture 的真实行为）
- **性能**（手机 CPU/GPU 比电脑慢 5-20 倍）
- **网络**（真实 4G/WiFi 的抖动）
- **系统集成**（软键盘弹起、滚动回弹、safe-area）

## Android Chrome（USB）

```
1. 手机：设置 → 关于手机 → 连点"版本号"7 次（开启开发者模式）
2. 开发者选项 → 打开 USB 调试
3. USB 连电脑，手机弹窗点"允许"
4. 电脑 Chrome 打开 chrome://inspect
5. 页面列出手机的 tab → 点 inspect
```

**无线**（Android 11+）：开发者选项 → 无线调试 → 用配对码配对一次，之后免线。

## iOS Safari（仅 Mac）

```
1. iPhone：设置 → Safari → 高级 → 打开 Web 检查器
2. USB 连 Mac
3. Mac Safari 菜单栏：开发 → [你的 iPhone 名] → 选页面
```

**Windows/Linux 用户**：无法直接调 iOS Safari。替代：
- iOS 模拟器（需 Mac）
- [remote-ios-webkit-debugging-protocol](https://github.com/google/ios-webkit-debug-proxy)（社区方案，不稳）
- Eruda / vConsole（页面内嵌调试面板，任何平台可用）

## WebView（App 内嵌页）

混合开发（Cordova / Capacitor / React Native WebView / 小程序）的调试命脉：

```java
// Android App 里启用（仅 debug build！）
if (BuildConfig.DEBUG) {
  WebView.setWebContentsDebuggingEnabled(true);
}
```

之后 chrome://inspect 会列出 WebView，inspect 调试 App 内嵌页面。

iOS WKWebView：Safari 开发菜单直接列出（无需额外代码）。

## Node.js 远程调试

```
node --inspect server.js          # 监听 9229 端口
# 或
node --inspect-brk server.js      # 启动即断在第一行
```

chrome://inspect → "Open dedicated DevTools for Node"。VSCode 的 JS 调试本质也是这个协议（Chrome DevTools Protocol）。

## 常见坑

| 坑 | 解法 |
| --- | --- |
| chrome://inspect 看不到设备 | 换 USB 线（有些线只能充电）/ 换端口 / adb kill-server |
| inspect 打开白屏 | Chrome 版本和手机 Chrome 版本差异太大，升级两端 |
| iOS 设备不出现 | Mac Safari → 开发 → 选设备前要先"信任电脑" |
| WebView 不出现 | App 没调 setWebContentsDebuggingEnabled，或是 release build |

## 页面内嵌调试面板（跨平台兜底）

无法用远程调试时，给页面注入调试工具：

- [Eruda](https://github.com/liriliri/eruda)：Console / Elements / Network 的页面内嵌版
- [vConsole](https://github.com/Tencent/vConsole)：腾讯出品，微信场景常用

```html
<script src="https://cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

## DevTools 技能收获

- chrome://inspect 的完整功能（Android / WebView / Node）
- Android USB / 无线调试流程
- iOS Safari 远程调试（Mac only）
- WebView 调试开关与混合开发调试
- Eruda / vConsole 内嵌面板兜底方案
