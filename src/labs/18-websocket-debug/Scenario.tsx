/**
 * Lab 18 — WebSocket 调试
 *
 * Scenario: 一个"实时聊天"。我们用 fetch polling 模拟 WS（godbolt-style 诚实声明），
 * 服务器返回格式错误的 JSON，前端 JSON.parse 失败但被静默吞掉。
 *
 * 学员在 Network 面板能看到 fetch 请求，但看不到真正的 WS frames。
 * 引导里明确告诉学员：真实 WS 看 Network → WS 子分类 → Frames 子面板。
 */

import { useEffect, useRef, useState } from 'react';
import './Scenario.css';

interface ChatMessage {
  user: string;
  text: string;
  ts: number;
}

export function WebsocketDebugScenario() {
  const [messages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // [TEACHING_BUG] 模拟 WS 服务端返回格式错误的 JSON（缺右花括号）
    // 真实场景里：fetch('wss://...') 不会有 response.json()
    // 这里用 fetch polling 简化教学
    const fakeWs = async () => {
      // 模拟一个返回损坏 JSON 的服务器
      const fakeResponse = '{user:"bot",text:"hi there",ts:' + Date.now() + ','; // 缺右括号
      try {
        JSON.parse(fakeResponse); // [TEACHING_BUG] 这行会抛
      } catch (e) {
        // [TEACHING_BUG] 静默吞掉
        setErrorCount((c) => c + 1);
        return;
      }
    };
    setConnected(true);
    timerRef.current = window.setInterval(fakeWs, 1500);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="ws-lab">
      <h3>💬 实时聊天（含 bug）</h3>
      <p className="ws-lab__lead">
        <strong>声明：</strong>本关用 fetch 模拟 WS（简化教学）。真实 WebSocket 在 Network 面板的
        <code> WS</code> 子分类里看 <code>Frames</code> 子面板。
      </p>

      <div className="ws-lab__status">
        <span className="ws-lab__dot ws-lab__dot--on" />
        连接状态：{connected ? '已连接' : '连接中…'}
      </div>

      <div className="ws-lab__window">
        <div className="ws-lab__messages">
          {messages.length === 0 ? (
            <p className="ws-lab__placeholder">
              等待消息…（应该每 1.5 秒收到一条，但你看不到——bug 在某处）
            </p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="ws-lab__msg">
                <strong>{m.user}:</strong> {m.text}
              </div>
            ))
          )}
        </div>
        <div className="ws-lab__counter">静默错误数：{errorCount}</div>
      </div>

      <p className="ws-lab__hint">
        打开 Network 面板，刷新页面。看请求列表里有没有定期出现的新请求？
        或者用 Console 输入 <code>{`JSON.parse('{"bad": "json"}')`}</code> 看错误长什么样。
      </p>
    </div>
  );
}
